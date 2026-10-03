"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import type { BattleQuestion, BattleTopic } from "@/lib/battle";
import { BATTLE_TOPICS, getBattleQuestions } from "@/lib/battle";
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

export interface TeamState {
  id: string;
  name: string;
  emoji: string;
  color: "rose" | "cyan" | "emerald" | "amber";
  textColor: string;
  borderColor: string;
  bgColor: string;
  bgLight: string;
  badgeBg: string;
  keys: string[]; // [A, B, C, D]
  altitude: number; // 0m -> 1000m (hoặc 1000 Mbps)
  correctCount: number;
  streak: number;
  maxStreak: number;
  currentChoice: number | null; // 0..3
  timeMs: number | null;
  lastDelta: number;
}

const DEFAULT_TEAMS: TeamState[] = [
  {
    id: "team-1",
    name: "Tổ 1: Rồng Đỏ 🐉",
    emoji: "🔴",
    color: "rose",
    textColor: "text-rose-400",
    borderColor: "border-rose-500",
    bgColor: "bg-rose-500",
    bgLight: "bg-rose-500/10",
    badgeBg: "bg-rose-500/20 text-rose-300 border-rose-500/40",
    keys: ["1", "2", "3", "4"],
    altitude: 0,
    correctCount: 0,
    streak: 0,
    maxStreak: 0,
    currentChoice: null,
    timeMs: null,
    lastDelta: 0,
  },
  {
    id: "team-2",
    name: "Tổ 2: Đại Bàng Xanh 🦅",
    emoji: "🔵",
    color: "cyan",
    textColor: "text-cyan-400",
    borderColor: "border-cyan-500",
    bgColor: "bg-cyan-500",
    bgLight: "bg-cyan-500/10",
    badgeBg: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
    keys: ["Q", "W", "E", "R"],
    altitude: 0,
    correctCount: 0,
    streak: 0,
    maxStreak: 0,
    currentChoice: null,
    timeMs: null,
    lastDelta: 0,
  },
  {
    id: "team-3",
    name: "Tổ 3: Báo Sấm Sét ⚡",
    emoji: "🟢",
    color: "emerald",
    textColor: "text-emerald-400",
    borderColor: "border-emerald-500",
    bgColor: "bg-emerald-500",
    bgLight: "bg-emerald-500/10",
    badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    keys: ["A", "S", "D", "F"],
    altitude: 0,
    correctCount: 0,
    streak: 0,
    maxStreak: 0,
    currentChoice: null,
    timeMs: null,
    lastDelta: 0,
  },
  {
    id: "team-4",
    name: "Tổ 4: Hổ Hoàng Kim 🐯",
    emoji: "🟡",
    color: "amber",
    textColor: "text-amber-400",
    borderColor: "border-amber-500",
    bgColor: "bg-amber-500",
    bgLight: "bg-amber-500/10",
    badgeBg: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    keys: ["Z", "X", "C", "V"],
    altitude: 0,
    correctCount: 0,
    streak: 0,
    maxStreak: 0,
    currentChoice: null,
    timeMs: null,
    lastDelta: 0,
  },
];

const SUMMIT_ALTITUDE = 1000;
const BASE_ALTITUDE = 0;

export default function SummitBattleClient({
  initialTopic = "bai-04",
  onBack,
}: {
  initialTopic?: string;
  onBack?: () => void;
}) {
  const [teamCount, setTeamCount] = useState<2 | 3 | 4>(4);
  const [selectedTopic, setSelectedTopic] = useState<string>(initialTopic);
  const [roundTime, setRoundTime] = useState<number>(25);
  const [totalQuestionsCount, setTotalQuestionsCount] = useState<number>(10);
  const [showKeyGuide, setShowKeyGuide] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [soundOn, setSoundOn] = useState<boolean>(true);

  // Teams state
  const [teams, setTeams] = useState<TeamState[]>(DEFAULT_TEAMS);
  const [isEditingNames, setIsEditingNames] = useState<boolean>(false);

  // Match state
  const [questions, setQuestions] = useState<BattleQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [phase, setPhase] = useState<"setup" | "playing" | "revealed" | "gameover">("setup");

  // Timer
  const [timeLeft, setTimeLeft] = useState<number>(roundTime);
  const roundStartTimeRef = useRef<number>(Date.now());
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Winner
  const [knockoutWinner, setKnockoutWinner] = useState<TeamState | null>(null);

  useEffect(() => {
    setSoundOn(isSoundEnabled());
  }, []);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) playClick();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  // Nạp danh sách câu hỏi
  const startMatch = async () => {
    playClick();
    setLoading(true);
    const extra = selectedTopic === "bai-04" ? BAI_04_BATTLE_QUESTIONS : [];
    const qs = await getBattleQuestions(selectedTopic, totalQuestionsCount, extra);
    setQuestions(qs);
    setCurrentIdx(0);
    setKnockoutWinner(null);

    setTeams((prev) =>
      prev.map((t) => ({
        ...t,
        altitude: 0,
        correctCount: 0,
        streak: 0,
        maxStreak: 0,
        currentChoice: null,
        timeMs: null,
        lastDelta: 0,
      }))
    );

    setTimeLeft(roundTime);
    setLoading(false);
    setPhase("playing");
    roundStartTimeRef.current = Date.now();
    playWhistle();
  };

  const updateTeamName = (index: number, newName: string) => {
    setTeams((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], name: newName };
      return copy;
    });
  };

  const currentQ = questions[currentIdx];
  const activeTeams = teams.slice(0, teamCount);

  // Nhóm lựa chọn phương án
  const handleTeamChoice = useCallback(
    (teamIndex: number, optionIdx: number) => {
      if (phase !== "playing") return;
      setTeams((prev) => {
        const team = prev[teamIndex];
        if (!team || team.currentChoice !== null) return prev;
        playBuzzer();
        const copy = [...prev];
        const elapsed = Math.max(0.1, (Date.now() - roundStartTimeRef.current) / 1000);
        copy[teamIndex] = {
          ...team,
          currentChoice: optionIdx,
          timeMs: Math.round(elapsed * 10) / 10,
        };
        return copy;
      });
    },
    [phase]
  );

  // Đánh giá kết quả vòng đấu
  const evaluateRound = useCallback(() => {
    if (!currentQ || phase !== "playing") return;

    setPhase("revealed");
    playWhistle();

    setTeams((prev) => {
      let fastestTime = 99999;
      let fastestTeamId: string | null = null;

      for (let i = 0; i < teamCount; i++) {
        const t = prev[i];
        if (t.currentChoice === currentQ.correctAnswer && t.timeMs !== null) {
          if (t.timeMs < fastestTime) {
            fastestTime = t.timeMs;
            fastestTeamId = t.id;
          }
        }
      }

      let climbedAny = false;

      const updated = prev.map((t, idx) => {
        if (idx >= teamCount) return t;

        const isCorrect = t.currentChoice === currentQ.correctAnswer;
        let delta = 0;
        let nextStreak = t.streak;
        let nextMaxStreak = t.maxStreak;
        let nextCorrect = t.correctCount;

        if (isCorrect) {
          climbedAny = true;
          nextCorrect += 1;
          nextStreak += 1;
          if (nextStreak > nextMaxStreak) nextMaxStreak = nextStreak;

          // Điểm cơ bản leo tháp: +100m
          delta = 100;

          // Thưởng tốc độ (Fastest Climber): +50m
          if (t.id === fastestTeamId) {
            delta += 50;
          }

          // Thưởng chuỗi liên tiếp (Streak): 2 câu +20m, 3+ câu +40m
          if (nextStreak >= 3) {
            delta += 40;
          } else if (nextStreak === 2) {
            delta += 20;
          }
        } else {
          // Trả lời sai: Trượt nhẹ -20m
          delta = t.altitude > 0 ? -20 : 0;
          nextStreak = 0;
        }

        const newAltitude = Math.min(SUMMIT_ALTITUDE, Math.max(BASE_ALTITUDE, t.altitude + delta));

        return {
          ...t,
          altitude: newAltitude,
          correctCount: nextCorrect,
          streak: nextStreak,
          maxStreak: nextMaxStreak,
          lastDelta: delta,
        };
      });

      if (climbedAny) {
        playClimb();
      } else {
        playWrong();
      }

      const summitChampion = updated.slice(0, teamCount).find((t) => t.altitude >= SUMMIT_ALTITUDE);
      if (summitChampion) {
        setKnockoutWinner(summitChampion);
        setTimeout(() => {
          setPhase("gameover");
          playSummitVictory();
        }, 1500);
      }

      return updated;
    });
  }, [currentQ, phase, teamCount]);

  // Bộ đếm thời gian
  useEffect(() => {
    if (phase !== "playing" || loading) return;

    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
          evaluateRound();
          return 0;
        }
        if (prev <= 4) {
          playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [phase, loading, evaluateRound]);

  // Kiểm tra nếu tất cả nhóm đã bấm xong thì kết thúc vòng ngay
  useEffect(() => {
    if (phase !== "playing") return;
    const allAnswered = activeTeams.every((t) => t.currentChoice !== null);
    if (allAnswered && activeTeams.length > 0) {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      const timer = setTimeout(() => {
        evaluateRound();
      }, 450);
      return () => clearTimeout(timer);
    }
  }, [activeTeams, phase, evaluateRound]);

  const handleNextQuestion = () => {
    playClick();
    if (currentIdx + 1 >= questions.length || knockoutWinner !== null) {
      setPhase("gameover");
      playSummitVictory();
    } else {
      setCurrentIdx((c) => c + 1);
      setTimeLeft(roundTime);
      roundStartTimeRef.current = Date.now();
      setTeams((prev) =>
        prev.map((t) => ({
          ...t,
          currentChoice: null,
          timeMs: null,
          lastDelta: 0,
        }))
      );
      setPhase("playing");
      playWhistle();
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea") return;

      if (phase === "revealed") {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          handleNextQuestion();
        }
        return;
      }

      if (phase !== "playing") return;

      const key = e.key.toUpperCase();

      activeTeams.forEach((t, tIdx) => {
        const keyIdx = t.keys.indexOf(key);
        if (keyIdx !== -1) {
          e.preventDefault();
          handleTeamChoice(tIdx, keyIdx);
        }
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase, activeTeams, handleTeamChoice]);

  const rankedTeams = [...activeTeams].sort((a, b) => {
    if (b.altitude !== a.altitude) return b.altitude - a.altitude;
    return b.correctCount - a.correctCount;
  });

  return (
    <div className="relative min-h-[92vh] w-full max-w-6xl mx-auto px-3 sm:px-6 py-4 space-y-5 animate-fade-in-up">
      {/* ==================================================================== */}
      {/* TOP HEADER: Máy Chiếu & Công Cụ Lớp Học */}
      {/* ==================================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-700/80 bg-slate-900/90 p-3 sm:p-4 text-white shadow-xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={() => {
                playClick();
                onBack();
              }}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:border-cyan-400 transition"
              title="Quay lại danh sách game"
            >
              ←
            </button>
          )}
          <div className="flex items-center gap-2.5">
            <span className="text-2xl sm:text-3xl">🏔️</span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-base sm:text-lg font-bold text-white tracking-wide">
                  Chinh Phục Đỉnh Cao: Đại Chiến Giao Thức Mạng
                </h1>
                <span className="rounded-full bg-cyan-500/20 border border-cyan-400/40 px-2.5 py-0.5 font-mono text-[10px] font-bold text-cyan-300">
                  Đấu {teamCount} Nhóm
                </span>
                <span className="hidden sm:inline-block rounded-full bg-amber-500/20 border border-amber-400/40 px-2.5 py-0.5 font-mono text-[10px] font-bold text-amber-300">
                  Bài 4 Tin 12
                </span>
              </div>
              <p className="font-mono text-xs text-slate-400 mt-0.5">
                Đua tốc độ giải mã TCP/IP, Router & Băng thông · Leo Tháp Gigabit (1000m)
              </p>
            </div>
          </div>
        </div>

        {/* Nút công cụ */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className={`px-3 py-1.5 rounded-xl border font-mono text-xs font-semibold transition flex items-center gap-1 ${
              soundOn
                ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                : "border-slate-700 bg-slate-800 text-slate-400"
            }`}
            title="Bật/Tắt âm thanh"
          >
            {soundOn ? "🔊 Bật" : "🔇 Tắt"}
          </button>

          <button
            onClick={() => setShowKeyGuide(!showKeyGuide)}
            className={`px-3 py-1.5 rounded-xl border font-mono text-xs font-semibold transition ${
              showKeyGuide
                ? "border-cyan-400/40 bg-cyan-500/20 text-cyan-300"
                : "border-slate-700 bg-slate-800 text-slate-400 hover:text-white"
            }`}
            title="Bật/Tắt hướng dẫn phím tắt bàn phím"
          >
            ⌨️ Phím tắt
          </button>

          <button
            onClick={toggleFullscreen}
            className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 font-mono text-xs font-semibold text-slate-300 hover:text-white hover:border-amber-400 transition flex items-center gap-1.5"
            title="Phóng to toàn màn hình máy chiếu lớp học"
          >
            <span>{isFullscreen ? "🗗 Thu nhỏ" : "⛶ Máy chiếu"}</span>
          </button>

          {phase !== "setup" && (
            <button
              onClick={() => {
                playClick();
                setPhase("setup");
              }}
              className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 font-mono text-xs font-semibold text-rose-300 hover:bg-rose-500/20 hover:border-rose-400 transition"
            >
              ⚙️ Cài đặt
            </button>
          )}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* BẢNG HƯỚNG DẪN PHÍM TẮT ĐỒNG THỜI DÀNH CHO CẢ 4 TỔ */}
      {/* ==================================================================== */}
      {showKeyGuide && (
        <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-4 text-white shadow-lg animate-pop-in">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              ⚡ HỆ THỐNG PHÍM BẤM ĐỒNG THỜI DÀNH CHO 2 — 4 TỔ (DÙNG CHUNG 1 BÀN PHÍM HOẶC CHẠM MÀN HÌNH)
            </span>
            <button
              onClick={() => setShowKeyGuide(false)}
              className="text-xs text-slate-400 hover:text-white font-mono"
            >
              [Ẩn]
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
            {activeTeams.map((t) => (
              <div
                key={t.id}
                className={`rounded-xl border p-2.5 ${t.bgLight} ${t.borderColor}/50 flex flex-col justify-between`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-bold text-xs ${t.textColor}`}>{t.name}</span>
                  <span className="text-base">{t.emoji}</span>
                </div>
                <div className="grid grid-cols-4 gap-1 mt-2">
                  {t.keys.map((k, kIdx) => (
                    <div
                      key={k}
                      className="flex flex-col items-center justify-center rounded-lg bg-slate-900/90 border border-slate-700/80 py-1"
                    >
                      <span className="font-mono text-xs font-black text-white">{k}</span>
                      <span className="font-mono text-[9px] text-slate-400">
                        {String.fromCharCode(65 + kIdx)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MÀN HÌNH 1: SETUP TRẬN ĐẤU (CHỌN NHÓM, THỜI GIAN, CHỦ ĐỀ) */}
      {/* ==================================================================== */}
      {phase === "setup" && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/95 p-6 sm:p-8 text-white shadow-2xl space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/10 px-3 py-1 font-mono text-xs font-bold text-amber-300">
              🏆 THỂ THỨC ĐẠI CHIẾN PHÒNG MÁY / MÁY CHIẾU LỚP HỌC
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
              Cấu Hình Trận Đấu Chinh Phục Đỉnh Cao
            </h2>
            <p className="text-sm text-slate-300">
              Thiết kế dành cho máy chiếu lớp học: 2 đến 4 tổ học sinh cùng bấm phím đồng thời, đua tốc độ giải mã giao thức mạng để leo lên đỉnh tháp Gigabit 1000m.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-800">
            {/* 1. Chọn số nhóm */}
            <div className="space-y-3">
              <label className="block font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
                1. Số đội / Tổ thi đấu
              </label>
              <div className="grid grid-cols-3 gap-2">
                {([2, 3, 4] as const).map((count) => (
                  <button
                    key={count}
                    onClick={() => {
                      playClick();
                      setTeamCount(count);
                    }}
                    className={`rounded-2xl border py-3 px-2 font-mono text-sm font-bold transition flex flex-col items-center gap-1 ${
                      teamCount === count
                        ? "border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-lg shadow-cyan-500/20"
                        : "border-slate-800 bg-slate-800/60 text-slate-400 hover:text-white hover:border-slate-700"
                    }`}
                  >
                    <span className="text-xl">
                      {count === 2 ? "👥" : count === 3 ? "👥👤" : "👥👥"}
                    </span>
                    <span>{count} Tổ</span>
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setIsEditingNames(!isEditingNames)}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-mono underline"
                >
                  {isEditingNames ? "✓ Xong đổi tên đội" : "✏️ Đổi tên các đội thi đấu"}
                </button>
              </div>

              {isEditingNames && (
                <div className="space-y-2 mt-2 p-3 rounded-xl bg-slate-950 border border-slate-800">
                  {teams.slice(0, teamCount).map((t, idx) => (
                    <div key={t.id} className="flex items-center gap-2">
                      <span className="text-sm">{t.emoji}</span>
                      <input
                        type="text"
                        value={t.name}
                        onChange={(e) => updateTeamName(idx, e.target.value)}
                        className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 font-mono text-xs text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Chọn chủ đề bài học */}
            <div className="space-y-3">
              <label className="block font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
                2. Bài học thi đấu
              </label>
              <select
                value={selectedTopic}
                onChange={(e) => {
                  playClick();
                  setSelectedTopic(e.target.value);
                }}
                className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-3 py-3 font-mono text-xs text-white focus:border-cyan-400 focus:outline-none"
              >
                {BATTLE_TOPICS.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-400 font-mono">
                {selectedTopic === "bai-04"
                  ? "⭐ Đã bao gồm bộ câu hỏi độc quyền: TCP/IP, cổng bảo mật 443, IPv6 128 bit, CSMA/CD, Bảng định tuyến."
                  : "Hệ thống tự động trích xuất ngân hàng câu hỏi từ bài đã chọn."}
              </p>
            </div>

            {/* 3. Cài đặt thời gian & số câu */}
            <div className="space-y-3">
              <label className="block font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
                3. Thời gian mỗi câu hỏi
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[15, 20, 25, 35].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => {
                      playClick();
                      setRoundTime(sec);
                    }}
                    className={`rounded-xl border py-2 font-mono text-xs font-bold transition ${
                      roundTime === sec
                        ? "border-amber-400 bg-amber-500/20 text-amber-300"
                        : "border-slate-800 bg-slate-800/60 text-slate-400 hover:text-white"
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>

              <label className="block font-mono text-xs font-bold uppercase tracking-wider text-slate-400 pt-2">
                Số lượng câu hỏi
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[8, 10, 15].map((cnt) => (
                  <button
                    key={cnt}
                    onClick={() => {
                      playClick();
                      setTotalQuestionsCount(cnt);
                    }}
                    className={`rounded-xl border py-2 font-mono text-xs font-bold transition ${
                      totalQuestionsCount === cnt
                        ? "border-emerald-400 bg-emerald-500/20 text-emerald-300"
                        : "border-slate-800 bg-slate-800/60 text-slate-400 hover:text-white"
                    }`}
                  >
                    {cnt} câu
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quy chế tính điểm */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-xs font-mono text-slate-300 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
              <span className="block text-emerald-400 font-bold text-sm">+100m</span>
              <span className="text-slate-400">Đúng cơ bản</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
              <span className="block text-cyan-400 font-bold text-sm">+50m</span>
              <span className="text-slate-400">Nhanh nhất (Speed)</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
              <span className="block text-amber-400 font-bold text-sm">+20m / +40m</span>
              <span className="text-slate-400">Chuỗi đúng (Streak)</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
              <span className="block text-rose-400 font-bold text-sm">1000m</span>
              <span className="text-slate-400">Chạm đỉnh = Knock-out</span>
            </div>
          </div>

          {/* Nút bắt đầu */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={startMatch}
              disabled={loading}
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-amber-400 bg-gradient-to-r from-amber-500 via-coral to-rose-600 px-8 py-3.5 font-display text-base font-black text-white shadow-2xl shadow-amber-500/40 transition hover:scale-105 active:scale-95"
            >
              <span>🚀 BẮT ĐẦU (1 MÁY CHIẾU LỚP HỌC)</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>

            <Link
              href="/dau-truong"
              className="inline-flex items-center gap-2 rounded-full border border-cyan-400/50 bg-cyan-500/15 px-6 py-3 font-mono text-xs font-bold text-cyan-300 hover:bg-cyan-500/25 transition"
            >
              <span>🌐 Chuyển sang đấu NHIỀU MÁY (Mã PIN như Kahoot)</span>
              <span>↗</span>
            </Link>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MÀN HÌNH 2 & 3: ĐANG THI ĐẤU (PLAYING & REVEALED) */}
      {/* ==================================================================== */}
      {(phase === "playing" || phase === "revealed") && currentQ && (
        <div className="space-y-5">
          {/* TRACK LEO THÁP BĂNG THÔNG GIGABIT (0m -> 1000m) */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-4 sm:p-5 text-white shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 font-mono text-xs text-slate-300">
              <span className="font-bold flex items-center gap-2 text-cyan-400">
                📶 ĐỘ CAO LEO THÁP BĂNG THÔNG GIGABIT (MỤC TIÊU: 1000m)
              </span>
              <span className="text-slate-400">
                Câu {currentIdx + 1} / {questions.length}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {activeTeams.map((t) => {
                const percent = Math.min(100, Math.max(0, (t.altitude / SUMMIT_ALTITUDE) * 100));
                return (
                  <div key={t.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{t.emoji}</span>
                        <span className={`font-bold ${t.textColor}`}>{t.name}</span>
                        {t.streak >= 2 && (
                          <span className="rounded-full bg-amber-500/20 border border-amber-400/40 px-2 py-0.2 text-[10px] text-amber-300">
                            🔥 {t.streak} liên tiếp
                          </span>
                        )}
                        {phase === "revealed" && t.lastDelta !== 0 && (
                          <span
                            className={`font-bold text-xs ${
                              t.lastDelta > 0 ? "text-emerald-400" : "text-rose-400"
                            }`}
                          >
                            {t.lastDelta > 0 ? `+${t.lastDelta}m` : `${t.lastDelta}m`}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{t.altitude}m</span>
                        <span className="text-slate-400 text-[11px]">({t.correctCount} đúng)</span>
                      </div>
                    </div>

                    <div className="relative h-4 w-full rounded-full bg-slate-950 p-0.5 overflow-hidden border border-slate-800">
                      {/* Checkpoint markers */}
                      <div className="absolute left-1/4 top-0 bottom-0 w-0.5 bg-slate-700/60 z-10" />
                      <div className="absolute left-2/4 top-0 bottom-0 w-0.5 bg-slate-700/60 z-10" />
                      <div className="absolute left-3/4 top-0 bottom-0 w-0.5 bg-slate-700/60 z-10" />

                      <div
                        className={`h-full rounded-full transition-all duration-700 ease-out ${t.bgColor}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Checkpoint labels */}
            <div className="flex justify-between font-mono text-[10px] text-slate-400 pt-2 px-1">
              <span>0m: Cáp Vật Lý</span>
              <span className="hidden sm:inline">250m: Switch L2</span>
              <span>500m: Router L3</span>
              <span className="hidden sm:inline">750m: Cáp Quốc Tế</span>
              <span className="text-amber-400 font-bold">1000m: Đỉnh Gigabit 🏆</span>
            </div>
          </div>

          {/* KHỐI CÂU HỎI TRẮC NGHIỆM */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/95 p-5 sm:p-7 text-white shadow-2xl space-y-4">
            {/* Header câu hỏi: Số thứ tự + Bộ đếm thời gian */}
            <div className="flex items-center justify-between gap-4">
              <span className="rounded-full bg-cyan-500/20 border border-cyan-400/40 px-3 py-1 font-mono text-xs font-bold text-cyan-300">
                CÂU HỎI {currentIdx + 1} TRÊN {questions.length}
              </span>

              {/* Đồng hồ đếm ngược */}
              <div
                className={`flex items-center gap-2 rounded-2xl px-4 py-1.5 font-mono text-base font-black transition ${
                  timeLeft <= 4
                    ? "bg-rose-500/25 border border-rose-500 text-rose-400 animate-wiggle"
                    : "bg-slate-800 border border-slate-700 text-amber-300"
                }`}
              >
                <span>⏱️</span>
                <span>{timeLeft}s</span>
              </div>
            </div>

            {/* Nội dung câu hỏi */}
            <div className="space-y-3">
              <h2 className="font-display text-lg sm:text-xl font-bold text-white leading-relaxed">
                {currentQ.question}
              </h2>

              {currentQ.code && (
                <pre className="rounded-2xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs sm:text-sm text-cyan-300 overflow-x-auto">
                  <code>{currentQ.code}</code>
                </pre>
              )}
            </div>

            {/* Danh sách 4 phương án A, B, C, D */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {currentQ.options.map((opt, optIdx) => {
                const isCorrectOpt = optIdx === currentQ.correctAnswer;
                const letter = String.fromCharCode(65 + optIdx);

                let optCardClass = "border-slate-800 bg-slate-800/60 text-slate-200";
                if (phase === "revealed") {
                  if (isCorrectOpt) {
                    optCardClass = "border-emerald-400 bg-emerald-500/25 text-emerald-200 shadow-lg shadow-emerald-500/20";
                  } else {
                    optCardClass = "border-slate-800/40 bg-slate-900/40 text-slate-500 opacity-60";
                  }
                }

                return (
                  <div
                    key={optIdx}
                    className={`rounded-2xl border p-4 transition-all duration-300 flex items-start gap-3 ${optCardClass}`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl font-mono text-xs font-bold ${
                        phase === "revealed" && isCorrectOpt
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-700 text-white"
                      }`}
                    >
                      {letter}
                    </span>
                    <span className="text-sm font-medium leading-relaxed">{opt}</span>
                  </div>
                );
              })}
            </div>

            {/* Giải thích chi tiết khi revealed */}
            {phase === "revealed" && (
              <div className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-mono text-emerald-300 space-y-1 animate-pop-in">
                <span className="font-bold flex items-center gap-1.5 text-emerald-400">
                  💡 GIẢI THÍCH CHI TIẾT:
                </span>
                <p className="leading-relaxed">{currentQ.explanation}</p>
              </div>
            )}
          </div>

          {/* ==================================================================== */}
          {/* KHỐI ĐIỀU KHIỂN & TRẠNG THÁI BẤM CỦA CÁC ĐỘI (CHẠM HOẶC PHÍM) */}
          {/* ==================================================================== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {activeTeams.map((t, tIdx) => {
              const hasChosen = t.currentChoice !== null;
              const isCorrect = hasChosen && t.currentChoice === currentQ.correctAnswer;

              return (
                <div
                  key={t.id}
                  className={`rounded-2xl border p-3.5 flex flex-col justify-between transition-all duration-300 ${t.bgLight} ${
                    hasChosen ? t.borderColor : "border-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className={`font-bold text-xs ${t.textColor} flex items-center gap-1.5`}>
                      <span>{t.emoji}</span>
                      <span>{t.name}</span>
                    </span>
                    {hasChosen ? (
                      <span className="font-mono text-[10px] text-cyan-300">
                        {t.timeMs}s chốt
                      </span>
                    ) : (
                      <span className="font-mono text-[10px] text-slate-400 animate-pulse">
                        Đang suy nghĩ...
                      </span>
                    )}
                  </div>

                  {/* Trạng thái đã chốt phương án */}
                  <div className="py-2.5">
                    {hasChosen ? (
                      <div className="text-center">
                        <span className="text-2xl font-black font-mono">
                          {String.fromCharCode(65 + (t.currentChoice ?? 0))}
                        </span>
                        {phase === "revealed" && (
                          <div className="mt-1">
                            {isCorrect ? (
                              <span className="text-xs font-bold text-emerald-400">
                                ✓ Chính xác (+{t.lastDelta}m)
                              </span>
                            ) : (
                              <span className="text-xs font-bold text-rose-400">
                                ✗ Chưa đúng ({t.lastDelta}m)
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center text-xs text-slate-400 font-mono py-1">
                        Bấm phím tắt hoặc chạm:
                      </div>
                    )}
                  </div>

                  {/* Bàn phím / Nút chạm trực tiếp trên màn hình */}
                  <div className="grid grid-cols-4 gap-1 pt-1">
                    {t.keys.map((k, kIdx) => {
                      const isSelected = t.currentChoice === kIdx;
                      return (
                        <button
                          key={k}
                          disabled={phase !== "playing" || hasChosen}
                          onClick={() => handleTeamChoice(tIdx, kIdx)}
                          className={`flex flex-col items-center justify-center rounded-xl border py-2 transition ${
                            isSelected
                              ? `${t.bgColor} border-white text-white shadow-lg`
                              : "border-slate-700 bg-slate-900 text-slate-300 hover:border-white hover:text-white disabled:opacity-50"
                          }`}
                        >
                          <span className="font-mono text-xs font-black">{k}</span>
                          <span className="font-mono text-[9px] text-slate-400">
                            {String.fromCharCode(65 + kIdx)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* NÚT TIẾP TỤC SANG CÂU TIẾP THEO (KHI REVEALED) */}
          {phase === "revealed" && (
            <div className="flex justify-center pt-2">
              <button
                onClick={handleNextQuestion}
                className="group relative inline-flex items-center gap-3 rounded-full border border-cyan-400 bg-gradient-to-r from-cyan-500 to-indigo-600 px-8 py-3.5 font-display text-base font-bold text-white shadow-xl shadow-cyan-500/25 transition hover:scale-105 active:scale-95"
              >
                <span>
                  {currentIdx + 1 >= questions.length || knockoutWinner !== null
                    ? "🏆 XEM KẾT QUẢ VINH QUANG"
                    : "CÂU TIẾP THEO (Phím Space / Enter) →"}
                </span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* MÀN HÌNH 4: LỄ TRAO CÚP VINH QUANG (GAMEOVER) */}
      {/* ==================================================================== */}
      {phase === "gameover" && (
        <div className="rounded-3xl border border-amber-400/40 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 p-6 sm:p-10 text-white shadow-2xl text-center space-y-6 animate-pop-in">
          <Confetti trigger={true} />

          <div className="space-y-2">
            <span className="text-5xl sm:text-6xl select-none animate-bounce">🏆</span>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/10 px-4 py-1 font-mono text-xs font-bold text-amber-300">
              ĐẠI CHIẾN HOÀN TẤT
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-black text-white">
              {knockoutWinner
                ? `🎉 ${knockoutWinner.name} ĐOẠT CÚP KNOCK-OUT 1000m!`
                : `🎉 ${rankedTeams[0].name} ĐOẠT NGÔI VÔ ĐỊCH!`}
            </h2>
            <p className="text-sm text-slate-300 font-mono">
              Vinh danh các chuyên gia giao thức mạng xuất sắc nhất lớp!
            </p>
          </div>

          {/* BỤC VINH QUANG (PODIUM) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto pt-6 items-end">
            {/* Hạng 2 */}
            {rankedTeams[1] && (
              <div className="order-2 sm:order-1 rounded-2xl border border-slate-700 bg-slate-800/80 p-4 space-y-2">
                <span className="text-3xl">🥈</span>
                <div className="font-mono text-xs font-bold text-slate-300">Á QUÂN</div>
                <div className={`font-bold text-sm ${rankedTeams[1].textColor}`}>
                  {rankedTeams[1].name}
                </div>
                <div className="font-mono text-base font-black text-white">
                  {rankedTeams[1].altitude}m
                </div>
                <div className="font-mono text-xs text-slate-400">
                  {rankedTeams[1].correctCount} câu đúng
                </div>
              </div>
            )}

            {/* Hạng 1 */}
            {rankedTeams[0] && (
              <div className="order-1 sm:order-2 rounded-3xl border-2 border-amber-400 bg-amber-500/15 p-6 space-y-2 shadow-2xl shadow-amber-500/30 scale-105">
                <span className="text-4xl">👑</span>
                <div className="font-mono text-xs font-bold text-amber-300">QUÁN QUÂN</div>
                <div className={`font-bold text-base ${rankedTeams[0].textColor}`}>
                  {rankedTeams[0].name}
                </div>
                <div className="font-mono text-2xl font-black text-amber-300">
                  {rankedTeams[0].altitude}m
                </div>
                <div className="font-mono text-xs text-slate-300">
                  {rankedTeams[0].correctCount} câu đúng · Chuỗi dài: {rankedTeams[0].maxStreak}
                </div>
              </div>
            )}

            {/* Hạng 3 */}
            {rankedTeams[2] && (
              <div className="order-3 rounded-2xl border border-slate-700 bg-slate-800/80 p-4 space-y-2">
                <span className="text-3xl">🥉</span>
                <div className="font-mono text-xs font-bold text-amber-600">HẠNG BA</div>
                <div className={`font-bold text-sm ${rankedTeams[2].textColor}`}>
                  {rankedTeams[2].name}
                </div>
                <div className="font-mono text-base font-black text-white">
                  {rankedTeams[2].altitude}m
                </div>
                <div className="font-mono text-xs text-slate-400">
                  {rankedTeams[2].correctCount} câu đúng
                </div>
              </div>
            )}
          </div>

          {/* Bảng tổng kết thứ hạng chi tiết */}
          <div className="max-w-xl mx-auto rounded-2xl border border-slate-800 bg-slate-950 p-4 text-xs font-mono">
            <div className="grid grid-cols-4 font-bold text-slate-400 pb-2 border-b border-slate-800">
              <span>HẠNG</span>
              <span className="col-span-2 text-left">ĐỘI THI ĐẤU</span>
              <span className="text-right">ĐỘ CAO</span>
            </div>
            {rankedTeams.map((t, idx) => (
              <div
                key={t.id}
                className="grid grid-cols-4 py-2 border-b border-slate-900 last:border-0 items-center"
              >
                <span className="font-bold text-slate-300">#{idx + 1}</span>
                <span className={`col-span-2 text-left font-bold ${t.textColor}`}>
                  {t.emoji} {t.name}
                </span>
                <span className="text-right font-bold text-white">{t.altitude}m</span>
              </div>
            ))}
          </div>

          {/* Nút hành động */}
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <button
              onClick={startMatch}
              className="rounded-full border border-amber-400 bg-amber-500 px-6 py-3 font-mono text-xs font-bold text-black shadow-lg hover:bg-amber-400 transition"
            >
              🔄 Tái Đấu Ngay
            </button>
            <button
              onClick={() => {
                playClick();
                setPhase("setup");
              }}
              className="rounded-full border border-slate-700 bg-slate-800 px-6 py-3 font-mono text-xs font-bold text-slate-300 hover:text-white transition"
            >
              ⚙️ Cài Đặt Thể Thức Mới
            </button>
            {onBack && (
              <button
                onClick={() => {
                  playClick();
                  onBack();
                }}
                className="rounded-full border border-slate-700 bg-slate-800 px-6 py-3 font-mono text-xs font-bold text-slate-300 hover:text-white transition"
              >
                ← Thoát Về Menu Game
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
