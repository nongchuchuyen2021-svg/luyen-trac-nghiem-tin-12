"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { BATTLE_TOPICS, getBattleQuestions, type BattleQuestion } from "@/lib/battle";
import { BAI_04_BATTLE_QUESTIONS } from "@/data/games/bai-04";
import {
  playClick,
  playCorrect,
  playWrong,
  playCelebration,
  playWhistle,
  playTick,
  playClimb,
  playBuzzer,
  playSummitVictory,
  isSoundEnabled,
  setSoundEnabled,
} from "@/lib/sound";
import Confetti from "@/components/Confetti";

export interface PlayerData {
  id: string;
  name: string;
  emoji: string;
  color: string;
  score: number;
  altitude: number;
  correctCount: number;
  streak: number;
  maxStreak: number;
  hasAnswered: boolean;
  currentChoice: number | null;
  timeMs: number | null;
  lastDelta: number;
}

export interface QuestionData {
  id: string;
  question: string;
  code?: string;
  options: [string, string, string, string];
  correctAnswer?: number;
  explanation?: string;
}

const EMOJI_LIST = ["🐉", "🦅", "⚡", "🐯", "🤖", "🚀", "🔥", "🦁", "🦈", "👾", "🛡️", "🌟"];

const TEAM_COLORS = [
  { id: "rose", name: "Đỏ Rồng", bg: "bg-rose-500", border: "border-rose-500", text: "text-rose-400" },
  { id: "cyan", name: "Xanh Biển", bg: "bg-cyan-500", border: "border-cyan-500", text: "text-cyan-400" },
  { id: "emerald", name: "Xanh Lá", bg: "bg-emerald-500", border: "border-emerald-500", text: "text-emerald-400" },
  { id: "amber", name: "Vàng Hổ", bg: "bg-amber-500", border: "border-amber-500", text: "text-amber-400" },
  { id: "purple", name: "Tím Lượng Tử", bg: "bg-purple-500", border: "border-purple-500", text: "text-purple-400" },
];

export default function DauTruongClient({ initialPin = "" }: { initialPin?: string }) {
  // Chế độ: "select" (chọn vào phòng hay tạo phòng) | "player" | "host"
  const [role, setRole] = useState<"select" | "player" | "host">(initialPin ? "player" : "select");

  // Form Học sinh
  const [pinInput, setPinInput] = useState<string>(initialPin);
  const [playerName, setPlayerName] = useState<string>("");
  const [selectedEmoji, setSelectedEmoji] = useState<string>("🐉");
  const [selectedColor, setSelectedColor] = useState<string>("rose");
  const [playerId, setPlayerId] = useState<string | null>(null);

  // Form Giáo viên / Host
  const [hostTopic, setHostTopic] = useState<string>("bai-04");
  const [hostQuestionCount, setHostQuestionCount] = useState<number>(10);
  const [hostRoundTime, setHostRoundTime] = useState<number>(25);
  const [hostSecret, setHostSecret] = useState<string | null>(null);
  const [roomPin, setRoomPin] = useState<string>("");

  // Trạng thái phòng đồng bộ từ server
  const [roomStatus, setRoomStatus] = useState<"lobby" | "playing" | "revealed" | "ended">("lobby");
  const [topicTitle, setTopicTitle] = useState<string>("");
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(null);
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [roundStartTime, setRoundStartTime] = useState<number>(0);
  const [roundTime, setRoundTime] = useState<number>(25);
  const [timeLeft, setTimeLeft] = useState<number>(25);

  // Trạng thái riêng của học sinh
  const [myChoice, setMyChoice] = useState<number | null>(null);
  const [myTimeMs, setMyTimeMs] = useState<number | null>(null);
  const [hasSubmitting, setHasSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const prevStatusRef = useRef<string>("lobby");
  const prevQIndexRef = useRef<number>(-1);
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setSoundOn(isSoundEnabled());
  }, []);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) playClick();
  };

  // ───────────────────────────────────────────────────────────────────────────
  // POLLING ĐỒNG BỘ TRẠNG THÁI PHÒNG (MỖI 700ms)
  // ───────────────────────────────────────────────────────────────────────────
  const pollRoomState = useCallback(async () => {
    const pin = roomPin || pinInput;
    if (!pin) return;

    try {
      const res = await fetch("/api/room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "state",
          pin,
          playerId,
          hostSecret,
        }),
      });

      if (!res.ok) return;
      const data = await res.json();
      if (!data.ok) return;

      setRoomStatus(data.status);
      setTopicTitle(data.topicTitle);
      setCurrentQIndex(data.currentQIndex);
      setTotalQuestions(data.totalQuestions);
      setCurrentQuestion(data.question);
      setPlayers(data.players || []);
      setRoundTime(data.roundTime);
      setRoundStartTime(data.roundStartTime);

      // Âm thanh khi chuyển trạng thái
      if (prevStatusRef.current !== data.status || prevQIndexRef.current !== data.currentQIndex) {
        if (data.status === "playing" && prevStatusRef.current !== "playing") {
          playWhistle();
          setMyChoice(null);
          setMyTimeMs(null);
        } else if (data.status === "revealed" && prevStatusRef.current === "playing") {
          playWhistle();
          // Kiểm tra bản thân đúng hay sai để phát âm thanh
          if (playerId) {
            const me = (data.players as PlayerData[]).find((p) => p.id === playerId);
            if (me && me.lastDelta > 0) {
              playCorrect();
            } else if (me && me.lastDelta <= 0 && me.hasAnswered) {
              playWrong();
            }
          }
        } else if (data.status === "ended" && prevStatusRef.current !== "ended") {
          playSummitVictory();
        }
        prevStatusRef.current = data.status;
        prevQIndexRef.current = data.currentQIndex;
      }
    } catch {
      // Ignored during network fluctuation
    }
  }, [roomPin, pinInput, playerId, hostSecret]);

  useEffect(() => {
    if (role === "select") return;
    const pin = roomPin || pinInput;
    if (!pin) return;

    pollRoomState();
    pollTimerRef.current = setInterval(pollRoomState, 750);

    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, [role, roomPin, pinInput, pollRoomState]);

  // Bộ đếm thời gian mượt mà tại client
  useEffect(() => {
    if (roomStatus !== "playing" || !roundStartTime) return;

    const timer = setInterval(() => {
      const elapsed = (Date.now() - roundStartTime) / 1000;
      const rem = Math.max(0, Math.ceil(roundTime - elapsed));
      setTimeLeft(rem);
      if (rem <= 4 && rem > 0 && role === "host") {
        playTick();
      }
    }, 200);

    return () => clearInterval(timer);
  }, [roomStatus, roundStartTime, roundTime, role]);

  // ───────────────────────────────────────────────────────────────────────────
  // HỌC SINH THAM GIA PHÒNG
  // ───────────────────────────────────────────────────────────────────────────
  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!pinInput.trim()) {
      setErrorMessage("Vui lòng nhập mã PIN gồm 6 số!");
      return;
    }
    if (!playerName.trim()) {
      setErrorMessage("Vui lòng nhập tên của bạn hoặc tên tổ!");
      return;
    }

    try {
      playClick();
      const res = await fetch("/api/room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "join",
          pin: pinInput.trim(),
          name: playerName.trim(),
          emoji: selectedEmoji,
          color: selectedColor,
        }),
      });

      const data = await res.json();
      if (!data.ok) {
        setErrorMessage(data.error || "Không thể tham gia phòng này.");
        return;
      }

      setPlayerId(data.playerId);
      setRoomPin(data.pin);
      setTopicTitle(data.topicTitle);
      setRole("player");
      playWhistle();
    } catch {
      setErrorMessage("Lỗi kết nối. Vui lòng thử lại!");
    }
  };

  // ───────────────────────────────────────────────────────────────────────────
  // GIÁO VIÊN TẠO PHÒNG MỚI (HOST)
  // ───────────────────────────────────────────────────────────────────────────
  const handleCreateRoom = async () => {
    setErrorMessage(null);
    playClick();

    try {
      const extra = hostTopic === "bai-04" ? BAI_04_BATTLE_QUESTIONS : [];
      const qs = await getBattleQuestions(hostTopic, hostQuestionCount, extra);
      const selectedTopicObj = BATTLE_TOPICS.find((t) => t.id === hostTopic);

      const res = await fetch("/api/room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          topicId: hostTopic,
          topicTitle: selectedTopicObj ? selectedTopicObj.name : "Đại chiến Tin học 12",
          questions: qs,
          roundTime: hostRoundTime,
        }),
      });

      const data = await res.json();
      if (!data.ok) {
        setErrorMessage(data.error || "Không thể tạo phòng đấu.");
        return;
      }

      setRoomPin(data.pin);
      setHostSecret(data.hostSecret);
      setTopicTitle(data.room.topicTitle);
      setRole("host");
      playWhistle();
    } catch {
      setErrorMessage("Không thể tạo phòng đấu. Vui lòng thử lại!");
    }
  };

  // ───────────────────────────────────────────────────────────────────────────
  // GIÁO VIÊN ĐIỀU KHIỂN TRẬN ĐẤU (START, REVEAL, NEXT)
  // ───────────────────────────────────────────────────────────────────────────
  const handleHostAction = async (type: "start" | "reveal" | "next" | "end") => {
    if (!roomPin || !hostSecret) return;
    playClick();

    try {
      await fetch("/api/room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "hostAction",
          pin: roomPin,
          hostSecret,
          type,
        }),
      });
      pollRoomState();
    } catch {
      // Ignored
    }
  };

  // ───────────────────────────────────────────────────────────────────────────
  // HỌC SINH NỘP ĐÁP ÁN (A, B, C, D)
  // ───────────────────────────────────────────────────────────────────────────
  const handleStudentAnswer = async (choiceIdx: number) => {
    if (myChoice !== null || hasSubmitting || roomStatus !== "playing") return;

    playBuzzer();
    setHasSubmitting(true);
    setMyChoice(choiceIdx);
    const elapsed = Math.max(0.1, Math.round(((Date.now() - roundStartTime) / 100) / 10));
    setMyTimeMs(elapsed);

    try {
      await fetch("/api/room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "answer",
          pin: roomPin || pinInput,
          playerId,
          choice: choiceIdx,
          timeMs: elapsed,
        }),
      });
      setHasSubmitting(false);
      pollRoomState();
    } catch {
      setHasSubmitting(false);
    }
  };

  const copyRoomLink = () => {
    const url = `${window.location.origin}/dau-truong?pin=${roomPin}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  const rankedPlayers = [...players].sort((a, b) => {
    if (b.altitude !== a.altitude) return b.altitude - a.altitude;
    return b.correctCount - a.correctCount;
  });

  const me = players.find((p) => p.id === playerId);

  return (
    <div className="relative min-h-[92vh] w-full max-w-6xl mx-auto px-3 sm:px-6 py-4 space-y-5 animate-fade-in-up">
      {/* ==================================================================== */}
      {/* TOP HEADER */}
      {/* ==================================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-700/80 bg-slate-900/90 p-3 sm:p-4 text-white shadow-xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:border-cyan-400 transition"
            title="Về trang chủ"
          >
            ←
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-2xl">🌐</span>
              <h1 className="font-display text-base sm:text-lg font-bold text-white tracking-wide">
                Đấu Trường Trực Tuyến Nhiều Máy Tính
              </h1>
              <span className="rounded-full bg-cyan-500/20 border border-cyan-400/40 px-2.5 py-0.5 font-mono text-[10px] font-bold text-cyan-300">
                Real-time Room
              </span>
            </div>
            <p className="font-mono text-xs text-slate-400 mt-0.5">
              Host máy chiếu + Nhiều máy tính học sinh tham gia bằng mã PIN
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className={`px-3 py-1.5 rounded-xl border font-mono text-xs font-semibold transition flex items-center gap-1 ${
              soundOn
                ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                : "border-slate-700 bg-slate-800 text-slate-400"
            }`}
          >
            {soundOn ? "🔊 Bật" : "🔇 Tắt"}
          </button>

          {role !== "select" && (
            <button
              onClick={() => {
                playClick();
                setRole("select");
                setRoomPin("");
                setPlayerId(null);
                setHostSecret(null);
              }}
              className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 font-mono text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition"
            >
              Thoát phòng
            </button>
          )}
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-2xl border border-rose-500/50 bg-rose-500/15 p-3.5 text-center text-xs font-mono font-bold text-rose-300 animate-wiggle">
          ⚠️ {errorMessage}
        </div>
      )}

      {/* ==================================================================== */}
      {/* 1. MÀN HÌNH CHỌN VAI TRÒ (HỌC SINH VÀO PHÒNG HOẶC GIÁO VIÊN TẠO PHÒNG) */}
      {/* ==================================================================== */}
      {role === "select" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {/* CỘT TRÁI: DÀNH CHO HỌC SINH */}
          <div className="rounded-3xl border border-cyan-500/40 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/60 p-6 sm:p-8 text-white shadow-2xl space-y-5">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-2xl">
                📱
              </span>
              <div>
                <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-cyan-300 uppercase">
                  Dành cho Học sinh / Các tổ
                </span>
                <h2 className="font-display text-xl font-bold text-white">Vào Phòng Đấu (Nhập PIN)</h2>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Nhập mã PIN hiển thị trên máy chiếu của giáo viên để tham gia thi đấu trực tiếp từ máy tính phòng máy hoặc điện thoại!
            </p>

            <form onSubmit={handleJoinRoom} className="space-y-4">
              <div>
                <label className="block font-mono text-xs font-bold text-slate-300 mb-1">
                  1. Mã PIN phòng thi (6 số)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Ví dụ: 849201"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ""))}
                  className="w-full rounded-2xl border border-cyan-500/50 bg-slate-900 px-4 py-3 font-mono text-xl tracking-widest text-center text-cyan-300 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-xs font-bold text-slate-300 mb-1">
                  2. Tên của bạn hoặc Tên Tổ
                </label>
                <input
                  type="text"
                  maxLength={25}
                  placeholder="Ví dụ: Tổ 1 - Rồng Đỏ hoặc Bảo Nam"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 font-mono text-sm text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-xs font-bold text-slate-300 mb-2">
                  3. Chọn Avatar Emoji
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {EMOJI_LIST.map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setSelectedEmoji(em)}
                      className={`h-10 rounded-xl text-xl flex items-center justify-center border transition ${
                        selectedEmoji === em
                          ? "border-cyan-400 bg-cyan-500/30 scale-110 shadow-lg"
                          : "border-slate-800 bg-slate-900 hover:border-slate-700"
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs font-bold text-slate-300 mb-2">
                  4. Chọn Màu đội
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {TEAM_COLORS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedColor(c.id)}
                      className={`py-2 rounded-xl text-xs font-mono font-bold border transition flex items-center justify-center gap-1.5 ${
                        selectedColor === c.id
                          ? `${c.border} ${c.bg}/30 text-white ring-2 ring-white/50`
                          : "border-slate-800 bg-slate-900 text-slate-400"
                      }`}
                    >
                      <span className={`h-2.5 w-2.5 rounded-full ${c.bg}`} />
                      <span className="hidden sm:inline">{c.name.split(" ")[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl border border-cyan-400 bg-gradient-to-r from-cyan-500 to-indigo-600 py-3.5 font-display text-base font-bold text-white shadow-xl shadow-cyan-500/25 transition hover:scale-[1.02] active:scale-[0.98]"
              >
                🚀 VÀO PHÒNG ĐẤU NGAY
              </button>
            </form>
          </div>

          {/* CỘT PHẢI: DÀNH CHO GIÁO VIÊN (TẠO PHÒNG HOST) */}
          <div className="rounded-3xl border border-amber-500/40 bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950/40 p-6 sm:p-8 text-white shadow-2xl space-y-5">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 border border-amber-400/40 text-2xl">
                🖥️
              </span>
              <div>
                <span className="rounded-full bg-amber-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-300 uppercase">
                  Dành cho Giáo viên / Máy chiếu
                </span>
                <h2 className="font-display text-xl font-bold text-white">Tạo Phòng Đấu Cho Lớp</h2>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Mở trên máy chiếu lớp học: Hệ thống sẽ sinh mã PIN để học sinh ở phòng máy hoặc trên điện thoại kết nối vào thi đấu đồng thời!
            </p>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block font-mono text-xs font-bold text-slate-300 mb-1">
                  1. Chọn bài học thi đấu
                </label>
                <select
                  value={hostTopic}
                  onChange={(e) => setHostTopic(e.target.value)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-3 py-3 font-mono text-xs text-white focus:border-amber-400 focus:outline-none"
                >
                  {BATTLE_TOPICS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  {hostTopic === "bai-04"
                    ? "⭐ Bài 4: Giao thức mạng (đã có bộ câu hỏi độc quyền TCP/IP, Router, IPv6)."
                    : "Tự động trích xuất ngân hàng câu hỏi chuẩn SGK."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-xs font-bold text-slate-300 mb-1">
                    2. Số câu hỏi
                  </label>
                  <select
                    value={hostQuestionCount}
                    onChange={(e) => setHostQuestionCount(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 font-mono text-xs text-white"
                  >
                    <option value={8}>8 câu</option>
                    <option value={10}>10 câu</option>
                    <option value={15}>15 câu</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-xs font-bold text-slate-300 mb-1">
                    3. Thời gian / câu
                  </label>
                  <select
                    value={hostRoundTime}
                    onChange={(e) => setHostRoundTime(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 font-mono text-xs text-white"
                  >
                    <option value={15}>15 giây</option>
                    <option value={20}>20 giây</option>
                    <option value={25}>25 giây</option>
                    <option value={35}>35 giây</option>
                  </select>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3.5 text-xs font-mono text-slate-400 space-y-1">
                <span className="text-amber-300 font-bold block">✨ Tính năng phòng máy:</span>
                <p>• Tự động xáo trộn ngẫu nhiên phương án A, B, C, D cho mọi câu hỏi.</p>
                <p>• Học sinh bấm máy riêng, điểm số leo tháp cập nhật tức thời trên máy chiếu.</p>
              </div>

              <button
                type="button"
                onClick={handleCreateRoom}
                className="w-full rounded-2xl border border-amber-400 bg-gradient-to-r from-amber-500 via-coral to-rose-600 py-3.5 font-display text-base font-black text-white shadow-xl shadow-amber-500/30 transition hover:scale-[1.02] active:scale-[0.98]"
              >
                👑 TẠO PHÒNG MÁY CHIẾU NGAY
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 2. MÀN HÌNH GIÁO VIÊN / HOST (MÁY CHIẾU) */}
      {/* ==================================================================== */}
      {role === "host" && (
        <div className="space-y-5">
          {/* LOBBY CHỜ HỌC SINH VÀO PHÒNG */}
          {roomStatus === "lobby" && (
            <div className="rounded-3xl border border-amber-500/50 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 p-6 sm:p-10 text-white shadow-2xl text-center space-y-6">
              <div className="space-y-2">
                <span className="rounded-full bg-amber-500/20 border border-amber-400/40 px-4 py-1 font-mono text-xs font-bold text-amber-300">
                  {topicTitle}
                </span>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-300">
                  Các em học sinh hãy vào trang web và nhập mã PIN:
                </h2>
              </div>

              {/* MÃ PIN KHỔNG LỒ */}
              <div className="inline-flex flex-col items-center justify-center rounded-3xl border-2 border-cyan-400 bg-cyan-500/10 px-8 py-5 shadow-2xl shadow-cyan-500/30 animate-pulse">
                <span className="font-mono text-xs uppercase tracking-widest text-cyan-300">MÃ PIN PHÒNG ĐẤU</span>
                <span className="font-mono text-5xl sm:text-7xl font-black tracking-widest text-white mt-1">
                  {roomPin}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={copyRoomLink}
                  className="rounded-full border border-slate-700 bg-slate-800 px-4 py-2 font-mono text-xs text-slate-300 hover:text-white transition flex items-center gap-1.5"
                >
                  <span>{copiedLink ? "✓ Đã chép link!" : "📋 Sao chép link mời"}</span>
                </button>
                <span className="font-mono text-xs text-slate-400">
                  Link: <code className="text-cyan-300">.../dau-truong?pin={roomPin}</code>
                </span>
              </div>

              {/* DANH SÁCH HỌC SINH ĐÃ VÀO */}
              <div className="space-y-3 pt-4 border-t border-slate-800 max-w-3xl mx-auto">
                <div className="flex items-center justify-between font-mono text-xs text-slate-400">
                  <span>HỌC SINH ĐÃ THAM GIA ({players.length})</span>
                  <span>{players.length === 0 ? "Đang chờ học sinh vào..." : "Sẵn sàng thi đấu!"}</span>
                </div>

                <div className="flex flex-wrap justify-center gap-2.5 min-h-[80px] p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                  {players.length === 0 ? (
                    <div className="flex items-center justify-center text-slate-500 font-mono text-xs italic">
                      Chưa có ai vào phòng. Học sinh nhập mã PIN trên máy riêng để xuất hiện tại đây!
                    </div>
                  ) : (
                    players.map((p) => (
                      <span
                        key={p.id}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 font-mono text-xs font-bold text-white shadow-md animate-pop-in"
                      >
                        <span className="text-base">{p.emoji}</span>
                        <span>{p.name}</span>
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* NÚT BẮT ĐẦU */}
              <div>
                <button
                  disabled={players.length === 0}
                  onClick={() => handleHostAction("start")}
                  className="group relative inline-flex items-center gap-3 rounded-full border border-amber-400 bg-gradient-to-r from-amber-500 via-coral to-rose-600 px-10 py-4 font-display text-lg font-black text-white shadow-2xl shadow-amber-500/40 transition hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>🚀 BẮT ĐẦU ĐẠI CHIẾN ({players.length} BẠN)</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>
          )}

          {/* MÀN HÌNH ĐANG THI ĐẤU (PLAYING & REVEALED) DÀNH CHO HOST MÁY CHIẾU */}
          {(roomStatus === "playing" || roomStatus === "revealed") && currentQuestion && (
            <div className="space-y-5">
              {/* THANH ĐIỀU HƯỚNG HOST + ĐỒNG HỒ */}
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/95 p-3.5 text-white">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-cyan-500/20 border border-cyan-400/40 px-3 py-1 font-mono text-xs font-bold text-cyan-300">
                    CÂU {currentQIndex + 1} / {totalQuestions}
                  </span>
                  <span className="font-mono text-xs text-slate-400">PIN: {roomPin}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-slate-300">
                    Đã nộp: <strong className="text-cyan-400">{players.filter((p) => p.hasAnswered).length}</strong> / {players.length}
                  </span>

                  {roomStatus === "playing" && (
                    <div
                      className={`flex items-center gap-1.5 rounded-xl px-3 py-1 font-mono text-base font-black ${
                        timeLeft <= 4 ? "bg-rose-500/30 text-rose-400 animate-wiggle" : "bg-slate-800 text-amber-300"
                      }`}
                    >
                      <span>⏱️</span>
                      <span>{timeLeft}s</span>
                    </div>
                  )}

                  {roomStatus === "playing" ? (
                    <button
                      onClick={() => handleHostAction("reveal")}
                      className="rounded-xl border border-amber-400 bg-amber-500/20 px-3.5 py-1.5 font-mono text-xs font-bold text-amber-300 hover:bg-amber-500 hover:text-black transition"
                    >
                      Khóa câu & Xem kết quả
                    </button>
                  ) : (
                    <button
                      onClick={() => handleHostAction("next")}
                      className="rounded-xl border border-cyan-400 bg-cyan-500 px-4 py-1.5 font-mono text-xs font-bold text-black hover:bg-cyan-400 transition"
                    >
                      {currentQIndex + 1 >= totalQuestions ? "Xem kết quả chung cuộc 🏆" : "Câu tiếp theo →"}
                    </button>
                  )}
                </div>
              </div>

              {/* KHỐI ĐỀ BÀI CHO MÁY CHIẾU */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/95 p-6 text-white shadow-2xl space-y-4">
                <h2 className="font-display text-xl sm:text-2xl font-bold leading-relaxed">
                  {currentQuestion.question}
                </h2>

                {currentQuestion.code && (
                  <pre className="rounded-2xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs sm:text-sm text-cyan-300 overflow-x-auto">
                    <code>{currentQuestion.code}</code>
                  </pre>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  {currentQuestion.options.map((opt, idx) => {
                    const letter = String.fromCharCode(65 + idx);
                    const isCorrect = idx === currentQuestion.correctAnswer;
                    const countChosen = players.filter((p) => p.currentChoice === idx).length;

                    let cardClass = "border-slate-800 bg-slate-800/60 text-slate-200";
                    if (roomStatus === "revealed") {
                      if (isCorrect) {
                        cardClass = "border-emerald-400 bg-emerald-500/25 text-emerald-200 shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-400";
                      } else {
                        cardClass = "border-slate-800/40 bg-slate-900/40 text-slate-500 opacity-60";
                      }
                    }

                    return (
                      <div
                        key={idx}
                        className={`rounded-2xl border p-4 flex items-start justify-between gap-3 transition-all ${cardClass}`}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-mono text-sm font-bold ${
                              roomStatus === "revealed" && isCorrect
                                ? "bg-emerald-500 text-white"
                                : "bg-slate-700 text-white"
                            }`}
                          >
                            {letter}
                          </span>
                          <span className="text-sm font-medium leading-relaxed">{opt}</span>
                        </div>

                        {roomStatus === "revealed" && (
                          <span className="font-mono text-xs font-bold text-slate-300 shrink-0 bg-slate-800 px-2 py-1 rounded-lg">
                            {countChosen} bạn
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {roomStatus === "revealed" && currentQuestion.explanation && (
                  <div className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-mono text-emerald-300 space-y-1">
                    <span className="font-bold block text-emerald-400">💡 GIẢI THÍCH:</span>
                    <p>{currentQuestion.explanation}</p>
                  </div>
                )}
              </div>

              {/* BẢNG XẾP HẠNG TRỰC TIẾP LEO THÁP (MÁY CHIẾU) */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 text-white shadow-xl">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-400 block pb-3 border-b border-slate-800">
                  📶 TIẾN ĐỘ LEO THÁP BĂNG THÔNG 1000m CỦA CẢ LỚP
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
                  {rankedPlayers.slice(0, 9).map((p, idx) => (
                    <div
                      key={p.id}
                      className="rounded-xl border border-slate-800 bg-slate-950 p-3 flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-amber-400">#{idx + 1}</span>
                        <span className="text-base">{p.emoji}</span>
                        <span className="font-mono text-xs font-bold text-white truncate max-w-[120px]">
                          {p.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-xs font-bold text-emerald-400">{p.altitude}m</span>
                        {p.streak >= 2 && (
                          <span className="block font-mono text-[9px] text-amber-300">🔥x{p.streak}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MÀN HÌNH TỔNG KẾT VINH QUANG DÀNH CHO HOST */}
          {roomStatus === "ended" && (
            <div className="rounded-3xl border border-amber-400/40 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 p-8 sm:p-12 text-white shadow-2xl text-center space-y-6 animate-pop-in">
              <Confetti trigger={true} />
              <span className="text-6xl animate-bounce block">🏆</span>
              <div className="space-y-1">
                <span className="rounded-full bg-amber-500/20 border border-amber-400/40 px-4 py-1 font-mono text-xs font-bold text-amber-300">
                  TRẬN ĐẤU HOÀN TẤT
                </span>
                <h2 className="font-display text-3xl font-black text-white">
                  VINH DANH QUÁN QUÂN LỚP HỌC
                </h2>
              </div>

              {/* PODIUM TOP 3 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto pt-4 items-end">
                {rankedPlayers[1] && (
                  <div className="order-2 sm:order-1 rounded-2xl border border-slate-700 bg-slate-800/80 p-4 space-y-2">
                    <span className="text-3xl">🥈</span>
                    <div className="font-mono text-xs font-bold text-slate-300">Á QUÂN</div>
                    <div className="font-bold text-sm text-white">{rankedPlayers[1].name}</div>
                    <div className="font-mono text-base font-black text-white">{rankedPlayers[1].altitude}m</div>
                  </div>
                )}

                {rankedPlayers[0] && (
                  <div className="order-1 sm:order-2 rounded-3xl border-2 border-amber-400 bg-amber-500/20 p-6 space-y-2 shadow-2xl shadow-amber-500/40 scale-105">
                    <span className="text-4xl">👑</span>
                    <div className="font-mono text-xs font-bold text-amber-300">QUÁN QUÂN</div>
                    <div className="font-bold text-base text-amber-300">{rankedPlayers[0].name}</div>
                    <div className="font-mono text-2xl font-black text-amber-300">{rankedPlayers[0].altitude}m</div>
                  </div>
                )}

                {rankedPlayers[2] && (
                  <div className="order-3 rounded-2xl border border-slate-700 bg-slate-800/80 p-4 space-y-2">
                    <span className="text-3xl">🥉</span>
                    <div className="font-mono text-xs font-bold text-amber-600">HẠNG BA</div>
                    <div className="font-bold text-sm text-white">{rankedPlayers[2].name}</div>
                    <div className="font-mono text-base font-black text-white">{rankedPlayers[2].altitude}m</div>
                  </div>
                )}
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setRole("select")}
                  className="rounded-full border border-amber-400 bg-amber-500 px-6 py-3 font-mono text-xs font-bold text-black hover:bg-amber-400 transition"
                >
                  Tạo phòng thi đấu khác
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* 3. MÀN HÌNH HỌC SINH / PLAYER (TAY CẦM ĐIỀU KHIỂN TRÊN MÁY CON) */}
      {/* ==================================================================== */}
      {role === "player" && (
        <div className="space-y-4">
          {/* SẢNH CHỜ HỌC SINH */}
          {roomStatus === "lobby" && (
            <div className="rounded-3xl border border-cyan-500/40 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 p-8 text-white shadow-2xl text-center space-y-5">
              <span className="text-5xl animate-bounce block">{selectedEmoji}</span>
              <div>
                <span className="rounded-full bg-cyan-500/20 border border-cyan-400/40 px-3 py-1 font-mono text-xs font-bold text-cyan-300">
                  Phòng #{roomPin}
                </span>
                <h2 className="font-display text-2xl font-bold text-white mt-2">
                  Chào {playerName}!
                </h2>
                <p className="font-mono text-xs text-slate-400 mt-1">
                  Bạn đã vào phòng thành công. Hãy nhìn lên máy chiếu và chuẩn bị sẵn sàng phản xạ nhé!
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 font-mono text-xs text-amber-300 animate-pulse">
                ⏳ Đang chờ giáo viên bấm BẮT ĐẦU ĐẠI CHIẾN...
              </div>

              <div className="pt-2 text-xs font-mono text-slate-500">
                Đã có {players.length} bạn trong phòng
              </div>
            </div>
          )}

          {/* MÀN HÌNH THI ĐẤU CỦA HỌC SINH (4 NÚT LỚN SIÊU NHẠY) */}
          {roomStatus === "playing" && currentQuestion && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-900 p-3 rounded-2xl border border-slate-800 text-white font-mono text-xs">
                <span>CÂU {currentQIndex + 1}/{totalQuestions}</span>
                <span className="text-amber-300 font-bold">⏱️ {timeLeft}s</span>
                <span className="text-cyan-300">{me?.altitude || 0}m</span>
              </div>

              {/* Tóm tắt câu hỏi cho học sinh */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 text-white text-sm font-semibold">
                {currentQuestion.question}
              </div>

              {/* TRẠNG THÁI ĐÃ BẤM CHỌN HAY CHƯA */}
              {myChoice !== null ? (
                <div className="rounded-3xl border border-cyan-400/50 bg-cyan-500/20 p-8 text-center text-white space-y-2 animate-pop-in">
                  <span className="text-4xl block">🔒</span>
                  <h3 className="font-display text-xl font-bold text-cyan-300">
                    ĐÃ CHỐT PHƯƠNG ÁN {String.fromCharCode(65 + myChoice)}!
                  </h3>
                  <p className="font-mono text-xs text-slate-300">
                    Thời gian phản xạ: <strong className="text-white">{myTimeMs}s</strong>. Đang đợi cả lớp trả lời...
                  </p>
                </div>
              ) : (
                /* 4 NÚT LỚN RỰC RỠ DÀNH CHO HỌC SINH BẤM */
                <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-2">
                  {[
                    { label: "A", bg: "bg-rose-600 hover:bg-rose-500", border: "border-rose-400" },
                    { label: "B", bg: "bg-blue-600 hover:bg-blue-500", border: "border-blue-400" },
                    { label: "C", bg: "bg-emerald-600 hover:bg-emerald-500", border: "border-emerald-400" },
                    { label: "D", bg: "bg-amber-600 hover:bg-amber-500", border: "border-amber-400" },
                  ].map((btn, idx) => (
                    <button
                      key={btn.label}
                      onClick={() => handleStudentAnswer(idx)}
                      className={`h-36 sm:h-44 rounded-3xl border-2 ${btn.border} ${btn.bg} flex flex-col items-center justify-center p-3 text-white shadow-2xl transition-all duration-200 active:scale-95`}
                    >
                      <span className="font-mono text-4xl sm:text-5xl font-black">{btn.label}</span>
                      <span className="text-xs sm:text-sm font-medium mt-1 line-clamp-2 text-center text-white/90">
                        {currentQuestion.options[idx]}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* MÀN HÌNH KẾT QUẢ CÂU CỦA HỌC SINH (REVEALED) */}
          {roomStatus === "revealed" && (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/95 p-6 sm:p-8 text-white text-center space-y-4 animate-pop-in">
              {me && me.lastDelta > 0 ? (
                <div className="space-y-2">
                  <span className="text-5xl block animate-bounce">🎉</span>
                  <h3 className="font-display text-2xl font-black text-emerald-400">
                    CHÍNH XÁC! (+{me.lastDelta}m)
                  </h3>
                  <p className="font-mono text-xs text-slate-300">
                    Độ cao hiện tại: <strong className="text-white text-sm">{me.altitude}m</strong>
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <span className="text-5xl block">❌</span>
                  <h3 className="font-display text-2xl font-black text-rose-400">
                    CHƯA CHÍNH XÁC ({me?.lastDelta || 0}m)
                  </h3>
                  <p className="font-mono text-xs text-slate-300">
                    Độ cao hiện tại: <strong className="text-white text-sm">{me?.altitude || 0}m</strong>
                  </p>
                </div>
              )}

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-400">
                Thứ hạng tạm thời của bạn: <strong className="text-amber-300">#{rankedPlayers.findIndex((p) => p.id === playerId) + 1}</strong> trên {players.length} bạn
              </div>

              <p className="font-mono text-xs text-slate-400 animate-pulse">
                Hãy nhìn lên máy chiếu để xem giải thích chi tiết và bảng xếp hạng!
              </p>
            </div>
          )}

          {/* MÀN HÌNH KẾT THÚC CỦA HỌC SINH */}
          {roomStatus === "ended" && (
            <div className="rounded-3xl border border-amber-400/40 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 p-8 text-white text-center space-y-5 animate-pop-in">
              <Confetti trigger={true} />
              <span className="text-5xl block">🏆</span>
              <h2 className="font-display text-2xl font-black text-white">
                HOÀN THÀNH ĐẠI CHIẾN!
              </h2>
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/40 font-mono text-sm space-y-1">
                <div className="text-amber-300 font-bold text-lg">
                  HẠNG #{rankedPlayers.findIndex((p) => p.id === playerId) + 1}
                </div>
                <div className="text-slate-300">
                  Độ cao: <strong className="text-white">{me?.altitude || 0}m</strong> · Số câu đúng: <strong className="text-white">{me?.correctCount || 0}</strong>
                </div>
              </div>

              <button
                onClick={() => setRole("select")}
                className="rounded-full border border-slate-700 bg-slate-800 px-6 py-2.5 font-mono text-xs text-slate-300 hover:text-white"
              >
                Về màn hình phòng
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
