import { NextResponse } from "next/server";
import { randomBytes, randomInt } from "node:crypto";
import { createRoom, readRoom, replaceRoom } from "@/lib/room-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RoomPlayer {
  id: string; secret: string; name: string; emoji: string; color: string;
  score: number; altitude: number; correctCount: number; streak: number;
  maxStreak: number; currentChoice: number | null; timeMs: number | null;
  lastDelta: number;
}
interface RoomQuestion {
  id: string; question: string; code?: string;
  options: [string, string, string, string]; correctAnswer: number; explanation: string;
}
interface BattleRoom {
  pin: string; topicId: string; topicTitle: string; hostSecret: string;
  status: "lobby" | "playing" | "revealed" | "ended";
  questions: RoomQuestion[]; currentQIndex: number; roundTime: number;
  roundStartTime: number; players: Record<string, RoomPlayer>;
}
class RequestError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}
const secret = () => randomBytes(32).toString("hex");
const text = (v: unknown, max: number) => typeof v === "string" && v.trim().length > 0 && v.trim().length <= max;
function fail(message: string, status = 400): never { throw new RequestError(message, status); }

function evaluate(room: BattleRoom) {
  // Repeated reveals and simultaneous final answers can only score a round once.
  if (room.status !== "playing") return;
  const q = room.questions[room.currentQIndex];
  room.status = "revealed";
  const players = Object.values(room.players);
  const fastest = players.filter(p => p.currentChoice === q.correctAnswer && p.timeMs !== null)
    .sort((a, b) => a.timeMs! - b.timeMs! || a.id.localeCompare(b.id))[0]?.id;
  for (const p of players) {
    let delta = p.altitude > 0 ? -20 : 0;
    if (p.currentChoice === q.correctAnswer) {
      p.correctCount++;
      p.streak++;
      p.maxStreak = Math.max(p.maxStreak, p.streak);
      delta = 100 + (p.id === fastest ? 50 : 0) + (p.streak >= 3 ? 40 : p.streak === 2 ? 20 : 0);
    } else p.streak = 0;
    p.lastDelta = delta;
    p.altitude = Math.min(1000, Math.max(0, p.altitude + delta));
    p.score = p.altitude;
  }
}
function beginRound(room: BattleRoom) {
  room.status = "playing";
  room.roundStartTime = Date.now();
  for (const p of Object.values(room.players)) {
    p.currentChoice = null; p.timeMs = null; p.lastDelta = 0;
  }
}
function snapshot(room: BattleRoom, b: Record<string, unknown>) {
  const isHost = b.hostSecret === room.hostSecret;
  const me = typeof b.playerId === "string" ? room.players[b.playerId] : undefined;
  const isPlayer = !!me && b.playerSecret === me.secret;
  const visible = room.status === "revealed" || room.status === "ended";
  const q = room.questions[room.currentQIndex];
  return {
    ok: true, pin: room.pin, status: room.status, topicId: room.topicId,
    topicTitle: room.topicTitle, currentQIndex: room.currentQIndex,
    totalQuestions: room.questions.length, roundTime: room.roundTime,
    roundStartTime: room.roundStartTime, serverTime: Date.now(), isHost,
    question: room.status === "lobby" ? null : isHost || visible ? q : {
      id: q.id, question: q.question, code: q.code, options: q.options,
    },
    players: Object.values(room.players).map(p => ({
      id: p.id, name: p.name, emoji: p.emoji, color: p.color, score: p.score,
      altitude: p.altitude, correctCount: p.correctCount, streak: p.streak,
      maxStreak: p.maxStreak, hasAnswered: p.currentChoice !== null,
      currentChoice: isHost || visible || (isPlayer && p.id === b.playerId) ? p.currentChoice : null,
      timeMs: isHost || visible || (isPlayer && p.id === b.playerId) ? p.timeMs : null,
      lastDelta: p.lastDelta,
    })),
  };
}

function act(room: BattleRoom, b: Record<string, unknown>) {
  const expired = room.status === "playing" && Date.now() >= room.roundStartTime + room.roundTime * 1000;
  if (expired) evaluate(room);
  if (b.action === "state") return snapshot(room, b);
  if (b.action === "join") {
    if (room.status !== "lobby") return { ok: false, error: "Trận đấu đã bắt đầu. Em chờ phòng mới nhé." };
    if (!text(b.name, 30)) fail("Tên người chơi phải có từ 1 đến 30 kí tự.");
    if (Object.keys(room.players).length >= 100) fail("Phòng đã đủ 100 người chơi.");
    const id = "p_" + randomBytes(12).toString("hex");
    const playerSecret = secret();
    room.players[id] = {
      id, secret: playerSecret, name: (b.name as string).trim(),
      emoji: text(b.emoji, 12) ? b.emoji as string : "🐉",
      color: ["rose", "cyan", "emerald", "amber", "purple"].includes(b.color as string) ? b.color as string : "cyan",
      score: 0, altitude: 0, correctCount: 0, streak: 0, maxStreak: 0,
      currentChoice: null, timeMs: null, lastDelta: 0,
    };
    return { ok: true, playerId: id, playerSecret, pin: room.pin, topicTitle: room.topicTitle };
  }
  if (b.action === "answer") {
    const p = typeof b.playerId === "string" ? room.players[b.playerId] : undefined;
    if (!p || typeof b.playerSecret !== "string" || b.playerSecret !== p.secret) fail("Người chơi không hợp lệ!", 403);
    if (room.status !== "playing") return { ok: false, error: "Vòng đã khóa hoặc hết thời gian." };
    if (b.questionIndex !== room.currentQIndex) fail("Câu hỏi đã thay đổi. Em thử lại nhé.", 409);
    if (!Number.isInteger(b.choice) || (b.choice as number) < 0 || (b.choice as number) > 3) fail("Đáp án không hợp lệ.");
    if (p.currentChoice !== null) return { ok: true, answered: true };
    p.currentChoice = b.choice as number;
    p.timeMs = Math.max(0, Date.now() - room.roundStartTime);
    if (Object.values(room.players).every(player => player.currentChoice !== null)) evaluate(room);
    return { ok: true, answered: true };
  }
  if (b.action === "hostAction") {
    if (b.hostSecret !== room.hostSecret) fail("Quyền truy cập không hợp lệ!", 403);
    // Tie commands to a round so a retried 'next' cannot skip a question.
    if (b.questionIndex !== room.currentQIndex) fail("Phòng đã chuyển sang câu khác.", 409);
    if (b.type === "start") {
      if (room.status === "lobby") {
        if (!Object.keys(room.players).length) fail("Cần ít nhất một người chơi để bắt đầu.");
        beginRound(room);
      }
    } else if (b.type === "reveal") evaluate(room);
    else if (b.type === "next") {
      if (room.status !== "revealed") fail("Hãy khóa câu hiện tại trước khi chuyển câu.", 409);
      if (room.currentQIndex + 1 >= room.questions.length) room.status = "ended";
      else { room.currentQIndex++; beginRound(room); }
    } else if (b.type === "end") room.status = "ended";
    else fail("Lệnh điều khiển không hợp lệ.");
    return { ok: true, status: room.status, currentQIndex: room.currentQIndex };
  }
  fail("Hành động không hợp lệ.");
}

export async function POST(req: Request) {
  try {
    const raw = await req.text();
    if (raw.length > 150_000) fail("Dữ liệu quá lớn.", 413);
    let b: Record<string, unknown>;
    try {
      b = JSON.parse(raw);
      if (!b || typeof b !== "object" || Array.isArray(b)) fail("Dữ liệu không hợp lệ.");
    } catch { fail("Dữ liệu không hợp lệ."); }
    if (b.action === "create") {
      const qs = b.questions;
      if (!Array.isArray(qs) || qs.length < 1 || qs.length > 50 || qs.some(q =>
        !q || !text(q.id, 100) || !text(q.question, 4000) || !Array.isArray(q.options) || q.options.length !== 4 ||
        q.options.some((o: unknown) => !text(o, 2000)) || !Number.isInteger(q.correctAnswer) || q.correctAnswer < 0 || q.correctAnswer > 3 ||
        (q.code !== undefined && (typeof q.code !== "string" || q.code.length > 8000)) ||
        typeof q.explanation !== "string" || q.explanation.length > 4000)) fail("Bộ câu hỏi không hợp lệ.");
      const roundTime = b.roundTime ?? 25;
      if (!Number.isInteger(roundTime) || (roundTime as number) < 5 || (roundTime as number) > 180) fail("Thời gian phải từ 5 đến 180 giây.");
      const room: BattleRoom = {
        pin: "", topicId: text(b.topicId, 50) ? b.topicId as string : "bai-04",
        topicTitle: text(b.topicTitle, 200) ? b.topicTitle as string : "Đấu trường Tin học 12",
        hostSecret: secret(), status: "lobby", questions: qs as RoomQuestion[],
        currentQIndex: 0, roundTime: roundTime as number, roundStartTime: 0, players: {},
      };
      for (let i = 0; i < 10; i++) {
        room.pin = randomInt(100000, 1000000).toString();
        if (await createRoom(room.pin, room)) return NextResponse.json({
          ok: true, pin: room.pin, hostSecret: room.hostSecret,
          room: { pin: room.pin, topicId: room.topicId, topicTitle: room.topicTitle,
            status: room.status, playerCount: 0, roundTime: room.roundTime },
        });
      }
      fail("Chưa tạo được phòng. Vui lòng thử lại.", 503);
    }
    if (typeof b.pin !== "string" || !/^\d{6}$/.test(b.pin.trim())) fail("Mã PIN phải gồm 6 chữ số.");
    const pin = (b.pin as string).trim();
    for (let i = 0; i < 24; i++) {
      const previous = await readRoom(pin);
      if (!previous) fail("Phòng không tồn tại hoặc đã đóng.", 404);
      const room = JSON.parse(previous!) as BattleRoom;
      const result = act(room, b);
      if (await replaceRoom(pin, previous!, room)) return NextResponse.json(result);
      // Spread retries when an entire class answers at the same instant.
      await new Promise(resolve => setTimeout(resolve, randomInt(10, 80)));
    }
    fail("Phòng đang bận. Em thử lại nhé.", 409);
  } catch (err) {
    if (err instanceof RequestError) return NextResponse.json({ ok: false, error: err.message }, { status: err.status });
    console.error("Room API:", err instanceof Error ? err.message : "unknown error");
    return NextResponse.json({ ok: false, error: "Chưa kết nối được kho dữ liệu phòng đấu. Vui lòng thử lại sau." }, { status: 503 });
  }
}
