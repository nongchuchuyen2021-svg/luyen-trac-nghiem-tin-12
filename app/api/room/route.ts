import { NextResponse } from "next/server";

export interface RoomPlayer {
  id: string;
  name: string;
  emoji: string;
  color: string;
  score: number;
  altitude: number; // 0 -> 1000m
  correctCount: number;
  streak: number;
  maxStreak: number;
  currentChoice: number | null; // 0..3
  timeMs: number | null;
  lastDelta: number;
  lastActive: number;
}

export interface RoomQuestion {
  id: string;
  question: string;
  code?: string;
  options: [string, string, string, string];
  correctAnswer: number;
  explanation: string;
}

export interface BattleRoom {
  pin: string;
  topicId: string;
  topicTitle: string;
  hostSecret: string;
  status: "lobby" | "playing" | "revealed" | "ended";
  questions: RoomQuestion[];
  currentQIndex: number;
  roundTime: number; // seconds
  roundStartTime: number;
  players: Record<string, RoomPlayer>;
  createdAt: number;
  lastActive: number;
}

// In-memory global store that survives across hot reloads and local dev/prod
const globalStore = globalThis as unknown as {
  __BATTLE_ROOMS__?: Map<string, BattleRoom>;
};

if (!globalStore.__BATTLE_ROOMS__) {
  globalStore.__BATTLE_ROOMS__ = new Map<string, BattleRoom>();
}

const rooms = globalStore.__BATTLE_ROOMS__;

// Dọn dẹp các phòng quá 3 tiếng không hoạt động
function cleanupOldRooms() {
  const now = Date.now();
  rooms.forEach((room, pin) => {
    if (now - room.lastActive > 3 * 60 * 60 * 1000) {
      rooms.delete(pin);
    }
  });
}

export async function POST(req: Request) {
  try {
    cleanupOldRooms();
    const body = await req.json();
    const { action } = body;

    // 1. TẠO PHÒNG MỚI (DÀNH CHO GIÁO VIÊN / HOST)
    if (action === "create") {
      const { topicId, topicTitle, questions, roundTime = 25 } = body;
      // Sinh mã PIN 6 chữ số ngẫu nhiên không trùng lặp
      let pin = "";
      do {
        pin = Math.floor(100000 + Math.random() * 900000).toString();
      } while (rooms.has(pin));

      const hostSecret = Math.random().toString(36).substring(2) + Date.now().toString(36);

      const newRoom: BattleRoom = {
        pin,
        topicId: topicId || "bai-04",
        topicTitle: topicTitle || "Bài 4. Giao thức mạng",
        hostSecret,
        status: "lobby",
        questions: questions || [],
        currentQIndex: 0,
        roundTime,
        roundStartTime: 0,
        players: {},
        createdAt: Date.now(),
        lastActive: Date.now(),
      };

      rooms.set(pin, newRoom);

      return NextResponse.json({
        ok: true,
        pin,
        hostSecret,
        room: {
          pin,
          topicId: newRoom.topicId,
          topicTitle: newRoom.topicTitle,
          status: newRoom.status,
          playerCount: 0,
          roundTime: newRoom.roundTime,
        },
      });
    }

    // 2. HỌC SINH THAM GIA PHÒNG
    if (action === "join") {
      const { pin, name, emoji = "🐉", color = "cyan" } = body;
      const room = rooms.get(pin?.trim());
      if (!room) {
        return NextResponse.json({ ok: false, error: "Không tìm thấy phòng với mã PIN này. Vui lòng kiểm tra lại!" }, { status: 404 });
      }

      if (room.status === "ended") {
        return NextResponse.json({ ok: false, error: "Phòng đấu này đã kết thúc!" }, { status: 400 });
      }

      const playerId = "p_" + Math.random().toString(36).substring(2, 9);
      const cleanName = (name || "Học sinh").trim().substring(0, 30);

      const player: RoomPlayer = {
        id: playerId,
        name: cleanName,
        emoji,
        color,
        score: 0,
        altitude: 0,
        correctCount: 0,
        streak: 0,
        maxStreak: 0,
        currentChoice: null,
        timeMs: null,
        lastDelta: 0,
        lastActive: Date.now(),
      };

      room.players[playerId] = player;
      room.lastActive = Date.now();

      return NextResponse.json({
        ok: true,
        playerId,
        pin: room.pin,
        topicTitle: room.topicTitle,
      });
    }

    // 3. LẤY TRẠNG THÁI PHÒNG (POLL STATE)
    if (action === "state") {
      const { pin, playerId, hostSecret } = body;
      const room = rooms.get(pin?.trim());
      if (!room) {
        return NextResponse.json({ ok: false, error: "Phòng không tồn tại hoặc đã đóng." }, { status: 404 });
      }

      room.lastActive = Date.now();
      const isHost = hostSecret && hostSecret === room.hostSecret;

      if (playerId && room.players[playerId]) {
        room.players[playerId].lastActive = Date.now();
      }

      const currentQ = room.questions[room.currentQIndex];

      // Nếu đang trong vòng chơi và là học sinh -> giấu đáp án đúng
      let sanitizedQuestion = null;
      if (currentQ) {
        if (isHost || room.status === "revealed" || room.status === "ended") {
          sanitizedQuestion = currentQ;
        } else {
          sanitizedQuestion = {
            id: currentQ.id,
            question: currentQ.question,
            code: currentQ.code,
            options: currentQ.options,
            // Không gửi correctAnswer cho học sinh khi chưa revealed!
          };
        }
      }

      const playerList = Object.values(room.players).map((p) => ({
        id: p.id,
        name: p.name,
        emoji: p.emoji,
        color: p.color,
        score: p.score,
        altitude: p.altitude,
        correctCount: p.correctCount,
        streak: p.streak,
        maxStreak: p.maxStreak,
        hasAnswered: p.currentChoice !== null,
        currentChoice: isHost || room.status === "revealed" || p.id === playerId ? p.currentChoice : null,
        timeMs: isHost || room.status === "revealed" || p.id === playerId ? p.timeMs : null,
        lastDelta: p.lastDelta,
      }));

      return NextResponse.json({
        ok: true,
        pin: room.pin,
        status: room.status,
        topicId: room.topicId,
        topicTitle: room.topicTitle,
        currentQIndex: room.currentQIndex,
        totalQuestions: room.questions.length,
        question: sanitizedQuestion,
        roundTime: room.roundTime,
        roundStartTime: room.roundStartTime,
        players: playerList,
        isHost: Boolean(isHost),
      });
    }

    // 4. HỌC SINH NỘP ĐÁP ÁN (ANSWER)
    if (action === "answer") {
      const { pin, playerId, choice, timeMs } = body;
      const room = rooms.get(pin?.trim());
      if (!room || room.status !== "playing") {
        return NextResponse.json({ ok: false, error: "Không thể nộp đáp án lúc này!" }, { status: 400 });
      }

      const player = room.players[playerId];
      if (!player) {
        return NextResponse.json({ ok: false, error: "Người chơi không hợp lệ!" }, { status: 404 });
      }

      if (player.currentChoice !== null) {
        return NextResponse.json({ ok: true, message: "Bạn đã chốt đáp án rồi!" });
      }

      player.currentChoice = typeof choice === "number" ? choice : null;
      player.timeMs = typeof timeMs === "number" ? timeMs : 10;
      room.lastActive = Date.now();

      // Kiểm tra nếu tất cả học sinh trong phòng đã trả lời xong -> tự động chuyển revealed
      const allAnswered = Object.values(room.players).length > 0 &&
        Object.values(room.players).every((p) => p.currentChoice !== null);

      if (allAnswered) {
        evaluateRoomRound(room);
      }

      return NextResponse.json({ ok: true, answered: true });
    }

    // 5. GIÁO VIÊN / HOST ĐIỀU KHIỂN (HOST ACTION)
    if (action === "hostAction") {
      const { pin, hostSecret, type } = body;
      const room = rooms.get(pin?.trim());
      if (!room || room.hostSecret !== hostSecret) {
        return NextResponse.json({ ok: false, error: "Quyền truy cập không hợp lệ!" }, { status: 403 });
      }

      room.lastActive = Date.now();

      if (type === "start") {
        room.status = "playing";
        room.currentQIndex = 0;
        room.roundStartTime = Date.now();
        // Reset player round answers
        for (const p of Object.values(room.players)) {
          p.currentChoice = null;
          p.timeMs = null;
          p.lastDelta = 0;
        }
      } else if (type === "reveal") {
        evaluateRoomRound(room);
      } else if (type === "next") {
        if (room.currentQIndex + 1 >= room.questions.length) {
          room.status = "ended";
        } else {
          room.status = "playing";
          room.currentQIndex += 1;
          room.roundStartTime = Date.now();
          for (const p of Object.values(room.players)) {
            p.currentChoice = null;
            p.timeMs = null;
            p.lastDelta = 0;
          }
        }
      } else if (type === "end") {
        room.status = "ended";
      }

      return NextResponse.json({ ok: true, status: room.status, currentQIndex: room.currentQIndex });
    }

    return NextResponse.json({ ok: false, error: "Hành động không hợp lệ" }, { status: 400 });
  } catch (err: unknown) {
    console.error("Room API error:", err);
    return NextResponse.json({ ok: false, error: "Lỗi máy chủ phòng đấu" }, { status: 500 });
  }
}

// Logic tính điểm & độ cao leo tháp khi hết vòng
function evaluateRoomRound(room: BattleRoom) {
  room.status = "revealed";
  const currentQ = room.questions[room.currentQIndex];
  if (!currentQ) return;

  const players = Object.values(room.players);
  let fastestTime = 99999;
  let fastestPlayerId: string | null = null;

  for (const p of players) {
    if (p.currentChoice === currentQ.correctAnswer && p.timeMs !== null) {
      if (p.timeMs < fastestTime) {
        fastestTime = p.timeMs;
        fastestPlayerId = p.id;
      }
    }
  }

  for (const p of players) {
    const isCorrect = p.currentChoice === currentQ.correctAnswer;
    let delta = 0;

    if (isCorrect) {
      p.correctCount += 1;
      p.streak += 1;
      if (p.streak > p.maxStreak) p.maxStreak = p.streak;

      // Cơ bản: +100m
      delta = 100;
      // Nhanh nhất: +50m
      if (p.id === fastestPlayerId) {
        delta += 50;
      }
      // Streak
      if (p.streak >= 3) {
        delta += 40;
      } else if (p.streak === 2) {
        delta += 20;
      }
    } else {
      delta = p.altitude > 0 ? -20 : 0;
      p.streak = 0;
    }

    p.lastDelta = delta;
    p.altitude = Math.min(1000, Math.max(0, p.altitude + delta));
    p.score = p.altitude;
  }
}
