"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { TeamBattleGame, TeamBattleQuestion } from "@/lib/types";
import { sound } from "@/lib/sound";

export type TeamColor = "cyan" | "rose" | "amber" | "emerald";

export interface TeamInGame {
  id: string;
  name: string;
  emoji: string;
  color: TeamColor;
  buzzerKey: string;
  buzzerKeyCode: string;
  hp: number;
  score: number;
  correctCount: number;
  wrongCount: number;
  streak: number;
  maxStreak: number;
  buzzedAt: number | null;
  // Power-ups
  shieldActive: boolean;
  shieldAvailable: boolean;
  doubleActive: boolean;
  doubleAvailable: boolean;
  frozenTurns: number;
}

export type BattleMode = "buzzer" | "turns" | "all";

const DEFAULT_TEAMS_PRESET: { name: string; emoji: string; color: TeamColor; key: string; code: string }[] = [
  { name: "Tổ 1 - Cyan Core", emoji: "🔷", color: "cyan", key: "A", code: "KeyA" },
  { name: "Tổ 2 - Red Dragons", emoji: "🔴", color: "rose", key: "L", code: "KeyL" },
  { name: "Tổ 3 - Golden AI", emoji: "🟡", color: "amber", key: "Z", code: "KeyZ" },
  { name: "Tổ 4 - Emerald Shield", emoji: "🟢", color: "emerald", key: "M", code: "KeyM" },
];

const EMOJI_OPTIONS = ["🔷", "🔴", "🟡", "🟢", "🦁", "🐉", "🦅", "🐺", "🤖", "🚀", "⚡", "🛡️", "🔥", "🐱", "🦈", "👾"];

export default function TeamArenaGame({
  lessonId,
  game,
  onBack,
}: {
  lessonId: string;
  game: TeamBattleGame;
  onBack?: () => void;
}) {
  // Screen state: "setup" | "battle" | "victory"
  const [screen, setScreen] = useState<"setup" | "battle" | "victory">("setup");
  const [teamCount, setTeamCount] = useState<number>(4);
  const [battleMode, setBattleMode] = useState<BattleMode>("buzzer");
  const [questionLimit, setQuestionLimit] = useState<number>(10);
  const [timerSeconds, setTimerSeconds] = useState<number>(20);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Team configurations in setup
  const [teamConfigs, setTeamConfigs] = useState(DEFAULT_TEAMS_PRESET);

  // Active game state
  const [teams, setTeams] = useState<TeamInGame[]>([]);
  const [questions, setQuestions] = useState<TeamBattleQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(20);
  const [timerActive, setTimerActive] = useState<boolean>(false);

  // Buzzer & answering state
  // "idle" -> reading question
  // "buzzer_open" -> teams can buzz
  // "answering" -> 1 team has buzzed and is answering
  // "revealed" -> answer is shown, explanation visible
  const [turnPhase, setTurnPhase] = useState<"idle" | "buzzer_open" | "answering" | "revealed">("idle");
  const [answeringTeamId, setAnsweringTeamId] = useState<string | null>(null);
  const [answeringTimeLeft, setAnsweringTimeLeft] = useState<number>(10);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [turnTeamIndex, setTurnTeamIndex] = useState<number>(0); // For turn-based mode
  const [alreadyBuzzedWrong, setAlreadyBuzzedWrong] = useState<string[]>([]);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [screenShake, setScreenShake] = useState<boolean>(false);
  const [feedbackAnim, setFeedbackAnim] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    sound.enabled = soundEnabled;
  }, [soundEnabled]);

  const triggerShake = () => {
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 500);
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Start the battle from setup
  const startBattle = () => {
    sound.click();
    // Prepare selected questions with shuffled options
    const shuffled = [...game.questions].sort(() => Math.random() - 0.5);
    const selectedQ = shuffled.slice(0, Math.min(questionLimit, shuffled.length)).map((q) => {
      const order = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
      return {
        ...q,
        options: order.map((i) => q.options[i]),
        answer: order.indexOf(q.answer),
      };
    });
    setQuestions(selectedQ);
    setCurrentQIndex(0);

    // Initialize teams
    const initialTeams: TeamInGame[] = teamConfigs.slice(0, teamCount).map((cfg, idx) => ({
      id: `team-${idx}`,
      name: cfg.name.trim() || `Tổ ${idx + 1}`,
      emoji: cfg.emoji,
      color: cfg.color,
      buzzerKey: cfg.key,
      buzzerKeyCode: cfg.code,
      hp: 100,
      score: 0,
      correctCount: 0,
      wrongCount: 0,
      streak: 0,
      maxStreak: 0,
      buzzedAt: null,
      shieldActive: false,
      shieldAvailable: true,
      doubleActive: false,
      doubleAvailable: true,
      frozenTurns: 0,
    }));

    setTeams(initialTeams);
    setScreen("battle");
    setTurnTeamIndex(0);
    setAlreadyBuzzedWrong([]);
    setBattleLog([`⚔️ Trận chiến bắt đầu giữa ${initialTeams.length} nhóm!`]);

    // Begin first question
    initQuestion(0, initialTeams, battleMode);
  };

  const initQuestion = (qIdx: number, currentTeams: TeamInGame[], mode: BattleMode) => {
    setSelectedOption(null);
    setAnsweringTeamId(null);
    setAlreadyBuzzedWrong([]);
    setTimeLeft(timerSeconds);
    setAnsweringTimeLeft(10);
    setFeedbackAnim(null);

    if (mode === "buzzer") {
      setTurnPhase("buzzer_open");
      setTimerActive(true);
    } else if (mode === "turns") {
      setTurnPhase("answering");
      const activeIdx = qIdx % currentTeams.length;
      setAnsweringTeamId(currentTeams[activeIdx].id);
      setTimerActive(true);
    } else {
      // "all" mode
      setTurnPhase("answering");
      setTimerActive(true);
    }
  };

  // Main countdown timer
  useEffect(() => {
    if (screen !== "battle" || !timerActive || turnPhase === "revealed") return;

    const interval = setInterval(() => {
      if (turnPhase === "buzzer_open") {
        setTimeLeft((t) => {
          if (t <= 5 && t > 1) sound.tick();
          if (t <= 1) {
            // Time out without any buzz
            sound.damage();
            setTurnPhase("revealed");
            setBattleLog((prev) => [`⏰ Hết thời gian suy nghĩ! Không nhóm nào giành quyền trả lời.`, ...prev]);
            return 0;
          }
          return t - 1;
        });
      } else if (turnPhase === "answering") {
        setAnsweringTimeLeft((t) => {
          if (t <= 4 && t > 1) sound.tick();
          if (t <= 1) {
            // Answering time out!
            handleAnswerTimeout();
            return 0;
          }
          return t - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [screen, timerActive, turnPhase, answeringTeamId, teams]);

  // Handle buzzer press
  const handleBuzzer = useCallback(
    (teamId: string) => {
      if (turnPhase !== "buzzer_open") return;
      if (alreadyBuzzedWrong.includes(teamId)) return;

      const team = teams.find((t) => t.id === teamId);
      if (!team || team.frozenTurns > 0) return;

      sound.buzzer();
      setAnsweringTeamId(teamId);
      setTurnPhase("answering");
      setAnsweringTimeLeft(10);
      setBattleLog((prev) => [`🛎️ ${team.emoji} [${team.name}] đã bấm chuông giành quyền! (10s để chọn đáp án)`, ...prev]);
    },
    [turnPhase, alreadyBuzzedWrong, teams]
  );

  // Global Keyboard listener for Buzzers (A, L, Z, M) and Options (1, 2, 3, 4)
  useEffect(() => {
    if (screen !== "battle") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if ((e.target as HTMLElement).tagName === "INPUT") return;

      if (turnPhase === "buzzer_open") {
        const teamByCode = teams.find((t) => t.buzzerKeyCode === e.code || t.buzzerKey.toUpperCase() === e.key.toUpperCase());
        if (teamByCode) {
          e.preventDefault();
          handleBuzzer(teamByCode.id);
        }
      } else if (turnPhase === "answering" && answeringTeamId) {
        // Options 1, 2, 3, 4
        if (["1", "2", "3", "4"].includes(e.key)) {
          e.preventDefault();
          handlePickOption(parseInt(e.key, 10) - 1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [screen, turnPhase, answeringTeamId, teams, handleBuzzer]);

  // Pick an option
  const handlePickOption = (optionIdx: number) => {
    if (turnPhase !== "answering" || selectedOption !== null) return;
    const currentQ = questions[currentQIndex];
    if (!currentQ) return;

    setSelectedOption(optionIdx);
    const isCorrect = optionIdx === currentQ.answer;
    const activeTeam = teams.find((t) => t.id === answeringTeamId);

    if (isCorrect) {
      sound.laser();
      setTurnPhase("revealed");
      setTimerActive(false);

      if (activeTeam) {
        let points = (currentQ.score ?? 100) + (answeringTimeLeft > 5 ? 30 : 10);
        if (activeTeam.doubleActive) {
          points *= 2;
        }

        const streakBonus = activeTeam.streak >= 2 ? activeTeam.streak * 20 : 0;
        points += streakBonus;

        const damage = currentQ.damage ?? 20;

        setFeedbackAnim(`🎉 ${activeTeam.name} TRẢ LỜI ĐÚNG! +${points}đ · GÂY -${damage} HP LÊN CÁC ĐỘI KHÁC!`);
        setBattleLog((prev) => [
          `🎯 ${activeTeam.emoji} [${activeTeam.name}] trả lời CHÍNH XÁC! (+${points} điểm, gây ${damage} sát thương).`,
          ...prev,
        ]);

        // Update teams: active team gets score, streak; others lose HP (unless shielded)
        setTeams((prev) =>
          prev.map((t) => {
            if (t.id === activeTeam.id) {
              const newStreak = t.streak + 1;
              return {
                ...t,
                score: t.score + points,
                correctCount: t.correctCount + 1,
                streak: newStreak,
                maxStreak: Math.max(t.maxStreak, newStreak),
                doubleActive: false,
              };
            } else {
              // Other team takes damage unless shield is active
              if (t.shieldActive) {
                return { ...t, shieldActive: false };
              }
              return {
                ...t,
                hp: Math.max(0, t.hp - damage),
              };
            }
          })
        );
      }
    } else {
      // Wrong answer
      sound.damage();
      triggerShake();

      if (activeTeam) {
        let penaltyHp = 15;
        let penaltyScore = 20;
        let shieldBlocked = false;

        if (activeTeam.shieldActive) {
          penaltyHp = 0;
          shieldBlocked = true;
        }

        setFeedbackAnim(`❌ ${activeTeam.name} TRẢ LỜI SAI! ${shieldBlocked ? "🛡️ Khiên đã đỡ mất máu!" : `-15 HP, -${penaltyScore}đ`}`);
        setBattleLog((prev) => [
          `💥 ${activeTeam.emoji} [${activeTeam.name}] trả lời SAI! ${shieldBlocked ? "(Khiên bảo vệ đã chặn sát thương)" : "(-15 HP, -20 điểm)"}.`,
          ...prev,
        ]);

        const updatedWrongList = [...alreadyBuzzedWrong, activeTeam.id];
        setAlreadyBuzzedWrong(updatedWrongList);

        setTeams((prev) =>
          prev.map((t) => {
            if (t.id === activeTeam.id) {
              return {
                ...t,
                hp: Math.max(0, t.hp - penaltyHp),
                score: Math.max(0, t.score - penaltyScore),
                wrongCount: t.wrongCount + 1,
                streak: 0,
                shieldActive: false,
                doubleActive: false,
              };
            }
            return t;
          })
        );

        // Check if other teams can still buzz
        const availableTeams = teams.filter((t) => !updatedWrongList.includes(t.id));
        if (battleMode === "buzzer" && availableTeams.length > 0) {
          // Re-open buzzer for remaining teams!
          setSelectedOption(null);
          setAnsweringTeamId(null);
          setTurnPhase("buzzer_open");
          setAnsweringTimeLeft(8);
          setBattleLog((prev) => [`🔔 Chuông mở lại cho các nhóm còn lại cướp quyền!`, ...prev]);
        } else {
          // No one left, reveal
          setTurnPhase("revealed");
          setTimerActive(false);
        }
      }
    }
  };

  // Handle timeout when answering
  const handleAnswerTimeout = () => {
    if (!answeringTeamId) return;
    const activeTeam = teams.find((t) => t.id === answeringTeamId);
    sound.damage();
    triggerShake();

    if (activeTeam) {
      setFeedbackAnim(`⏰ ${activeTeam.name} HẾT GIỜ TRẢ LỜI! (-10 HP)`);
      setBattleLog((prev) => [`⏰ ${activeTeam.emoji} [${activeTeam.name}] đã hết 10 giây trả lời! (-10 HP)`, ...prev]);

      const updatedWrongList = [...alreadyBuzzedWrong, activeTeam.id];
      setAlreadyBuzzedWrong(updatedWrongList);

      setTeams((prev) =>
        prev.map((t) => (t.id === activeTeam.id ? { ...t, hp: Math.max(0, t.hp - 10), streak: 0 } : t))
      );

      const availableTeams = teams.filter((t) => !updatedWrongList.includes(t.id));
      if (battleMode === "buzzer" && availableTeams.length > 0) {
        setSelectedOption(null);
        setAnsweringTeamId(null);
        setTurnPhase("buzzer_open");
        setAnsweringTimeLeft(8);
      } else {
        setTurnPhase("revealed");
        setTimerActive(false);
      }
    }
  };

  // Move to next question or victory
  const nextQuestion = () => {
    sound.click();
    const nextIdx = currentQIndex + 1;
    if (nextIdx >= questions.length) {
      finishBattle();
    } else {
      setCurrentQIndex(nextIdx);
      initQuestion(nextIdx, teams, battleMode);
    }
  };

  // Finish battle and show victory podium
  const finishBattle = () => {
    sound.fanfare();
    setScreen("victory");
  };

  // Manual score adjustment by teacher (+/- 50pts)
  const adjustTeamScore = (teamId: string, delta: number) => {
    sound.click();
    setTeams((prev) =>
      prev.map((t) => (t.id === teamId ? { ...t, score: Math.max(0, t.score + delta) } : t))
    );
  };

  // Activate power-up for a team
  const triggerPowerUp = (teamId: string, type: "shield" | "double" | "freeze") => {
    const team = teams.find((t) => t.id === teamId);
    if (!team) return;

    if (type === "shield" && team.shieldAvailable) {
      sound.shield();
      setTeams((prev) =>
        prev.map((t) => (t.id === teamId ? { ...t, shieldActive: true, shieldAvailable: false } : t))
      );
      setBattleLog((prev) => [`🛡️ ${team.emoji} [${team.name}] đã bật KHIÊN BẢO VỆ!`, ...prev]);
    } else if (type === "double" && team.doubleAvailable) {
      sound.twoFa();
      setTeams((prev) =>
        prev.map((t) => (t.id === teamId ? { ...t, doubleActive: true, doubleAvailable: false } : t))
      );
      setBattleLog((prev) => [`⚡ ${team.emoji} [${team.name}] kích hoạt X2 ĐIỂM SỐ & SÁT THƯƠNG!`, ...prev]);
    } else if (type === "freeze") {
      sound.freeze();
      // Freezes other teams for next buzzer
      setTeams((prev) =>
        prev.map((t) => (t.id !== teamId ? { ...t, frozenTurns: 1 } : t))
      );
      setBattleLog((prev) => [`❄️ ${team.emoji} [${team.name}] ĐÓNG BĂNG chuông của tất cả đối thủ!`, ...prev]);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER: SETUP SCREEN
  // ─────────────────────────────────────────────────────────────────────────────
  if (screen === "setup") {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 pb-16 selection:bg-cyan-500 selection:text-white">
        <div className="mx-auto max-w-4xl px-4 pt-8 sm:px-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            {onBack && (
              <button
                onClick={onBack}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2 font-mono text-xs text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300 shadow-md"
              >
                ← Quay lại trung tâm Game
              </button>
            )}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-300 hover:text-white"
                title="Bật/Tắt âm thanh"
              >
                {soundEnabled ? "🔊 Âm thanh Bật" : "🔇 Âm thanh Tắt"}
              </button>
            </div>
          </div>

          {/* Hero Banner */}
          <div className="relative mt-6 overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 p-6 shadow-2xl sm:p-8">
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />
            <div className="absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-500/20 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-cyan-300">
                <span className="h-2 w-2 animate-ping rounded-full bg-cyan-400" />
                CHẾ ĐỘ THI ĐẤU LỚP HỌC (CLASSROOM BATTLE)
              </span>
              <h1 className="mt-3 font-display text-3xl font-extrabold text-white sm:text-4xl">
                ⚔️ Đấu Trường Đại Chiến Các Nhóm
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
                Chia lớp thành 2 - 4 nhóm đối kháng trực tiếp trên màn hình máy chiếu! Bấm chuông cướp quyền,
                bắn pháo tri thức, kích hoạt khiên thuật toán và rinh cúp vô địch môn Tin học 12!
              </p>
            </div>
          </div>

          {/* Setup Settings Grid */}
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {/* Setting 1: Số nhóm tham gia */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
              <h2 className="font-display text-sm font-bold uppercase tracking-wider text-cyan-400">
                👥 1. Số nhóm tham gia
              </h2>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[2, 3, 4].map((num) => (
                  <button
                    key={num}
                    onClick={() => setTeamCount(num)}
                    className={`rounded-xl py-2.5 font-display text-base font-bold transition ${
                      teamCount === num
                        ? "border-2 border-cyan-400 bg-cyan-500/30 text-white shadow-lg shadow-cyan-500/20"
                        : "border border-slate-700 bg-slate-800/80 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                    }`}
                  >
                    {num} Nhóm
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs text-slate-400">
                Lớp có thể chia làm 4 tổ hoặc 2 đội thi đấu đối kháng trực diện.
              </p>
            </div>

            {/* Setting 2: Chế độ thi đấu */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
              <h2 className="font-display text-sm font-bold uppercase tracking-wider text-cyan-400">
                ⚡ 2. Chế độ tranh quyền
              </h2>
              <div className="mt-4 space-y-2">
                {[
                  { mode: "buzzer" as BattleMode, label: "🛎️ Chuông Bấm Nhanh", desc: "Bấm phím cướp quyền trả lời" },
                  { mode: "turns" as BattleMode, label: "🎯 Lần Lượt Theo Vòng", desc: "Mỗi nhóm luân phiên 1 câu" },
                  { mode: "all" as BattleMode, label: "🤝 Cả Lớp Cùng Đấu", desc: "Thảo luận và công bố đáp án" },
                ].map((item) => (
                  <button
                    key={item.mode}
                    onClick={() => setBattleMode(item.mode)}
                    className={`flex w-full flex-col items-start rounded-xl p-2.5 text-left transition ${
                      battleMode === item.mode
                        ? "border-2 border-cyan-400 bg-cyan-500/20 text-white"
                        : "border border-slate-700 bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                    }`}
                  >
                    <span className="font-display text-xs font-bold">{item.label}</span>
                    <span className="text-[11px] text-slate-400">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Setting 3: Quy mô trận đấu */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
              <h2 className="font-display text-sm font-bold uppercase tracking-wider text-cyan-400">
                ⏱️ 3. Số câu & Thời gian
              </h2>
              <div className="mt-4">
                <span className="text-xs text-slate-400">Số câu hỏi:</span>
                <div className="mt-1.5 grid grid-cols-3 gap-2">
                  {[5, 10, 15].map((cnt) => (
                    <button
                      key={cnt}
                      onClick={() => setQuestionLimit(cnt)}
                      className={`rounded-xl py-2 font-mono text-xs font-bold transition ${
                        questionLimit === cnt
                          ? "border border-cyan-400 bg-cyan-500/30 text-white"
                          : "border border-slate-700 bg-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {cnt} câu
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <span className="text-xs text-slate-400">Thời gian suy nghĩ mỗi câu:</span>
                <div className="mt-1.5 grid grid-cols-3 gap-2">
                  {[15, 20, 30].map((sec) => (
                    <button
                      key={sec}
                      onClick={() => setTimerSeconds(sec)}
                      className={`rounded-xl py-2 font-mono text-xs font-bold transition ${
                        timerSeconds === sec
                          ? "border border-cyan-400 bg-cyan-500/30 text-white"
                          : "border border-slate-700 bg-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {sec} giây
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Team Configuration Cards */}
          <div className="mt-8">
            <h2 className="font-display text-lg font-bold text-white">
              🎨 Tùy chỉnh Tên Nhóm & Phím Bấm Chuông
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Nhóm trưởng hoặc đại diện nhóm có thể bấm phím tắt trên bàn phím hoặc chạm vào màn hình cảm ứng để bấm chuông!
            </p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              {teamConfigs.slice(0, teamCount).map((cfg, idx) => {
                const colorBorder =
                  cfg.color === "cyan"
                    ? "border-cyan-500/50 bg-cyan-950/30"
                    : cfg.color === "rose"
                    ? "border-rose-500/50 bg-rose-950/30"
                    : cfg.color === "amber"
                    ? "border-amber-500/50 bg-amber-950/30"
                    : "border-emerald-500/50 bg-emerald-950/30";

                const badgeColor =
                  cfg.color === "cyan"
                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-400/40"
                    : cfg.color === "rose"
                    ? "bg-rose-500/20 text-rose-300 border-rose-400/40"
                    : cfg.color === "amber"
                    ? "bg-amber-500/20 text-amber-300 border-amber-400/40"
                    : "bg-emerald-500/20 text-emerald-300 border-emerald-400/40";

                return (
                  <div key={idx} className={`rounded-2xl border p-4 shadow-xl ${colorBorder}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
                        Đội {idx + 1}
                      </span>
                      <span className={`rounded-full border px-2 py-0.5 font-mono text-[11px] font-bold ${badgeColor}`}>
                        Phím: [{cfg.key}]
                      </span>
                    </div>

                    {/* Emoji selector & Name input */}
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const nextEmoji = EMOJI_OPTIONS[(EMOJI_OPTIONS.indexOf(cfg.emoji) + 1) % EMOJI_OPTIONS.length];
                          const updated = [...teamConfigs];
                          updated[idx].emoji = nextEmoji;
                          setTeamConfigs(updated);
                        }}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-2xl transition hover:scale-110"
                        title="Bấm để đổi linh vật"
                      >
                        {cfg.emoji}
                      </button>
                      <input
                        type="text"
                        value={cfg.name}
                        onChange={(e) => {
                          const updated = [...teamConfigs];
                          updated[idx].name = e.target.value;
                          setTeamConfigs(updated);
                        }}
                        placeholder={`Tổ ${idx + 1}`}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2 text-sm font-semibold text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              onClick={startBattle}
              className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-rose-500 px-8 py-4 font-display text-lg font-bold text-white shadow-xl shadow-cyan-500/25 transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/40 sm:w-auto"
            >
              <span>🚀 BẮT ĐẦU ĐẠI CHIẾN NGAY</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER: ACTIVE BATTLE SCREEN
  // ─────────────────────────────────────────────────────────────────────────────
  const currentQ = questions[currentQIndex];
  const answeringTeam = teams.find((t) => t.id === answeringTeamId);

  return (
    <div
      ref={containerRef}
      className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-white ${
        screenShake ? "animate-wiggle" : ""
      }`}
    >
      {/* Top Bar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setScreen("setup")}
              className="rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 font-mono text-xs text-slate-300 hover:border-slate-500 hover:text-white"
            >
              ⚙️ Cài đặt trận
            </button>
            <span className="font-display text-sm font-bold text-white hidden sm:inline-block">
              ⚔️ {game.title}
            </span>
          </div>

          {/* Question progress and timer */}
          <div className="flex items-center gap-4">
            <span className="rounded-full border border-slate-700 bg-slate-800/90 px-3 py-1 font-mono text-xs font-bold text-cyan-400">
              CÂU {currentQIndex + 1}/{questions.length}
            </span>
            <button
              onClick={toggleFullscreen}
              className="rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs text-slate-300 hover:text-white"
              title="Phóng to toàn màn hình máy chiếu"
            >
              {isFullscreen ? "🗗 Thu nhỏ" : "⛶ Toàn màn hình"}
            </button>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="rounded-xl border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white"
            >
              {soundEnabled ? "🔊" : "🔇"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 flex flex-col justify-between">
        {/* TEAM PODIUMS / STATS BAR */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {teams.map((t) => {
            const isAnswering = t.id === answeringTeamId;
            const hasBuzzedWrong = alreadyBuzzedWrong.includes(t.id);

            const borderClass =
              isAnswering
                ? "border-2 border-yellow-400 bg-yellow-950/40 shadow-xl shadow-yellow-500/20 scale-[1.02]"
                : t.color === "cyan"
                ? "border-cyan-500/40 bg-cyan-950/20"
                : t.color === "rose"
                ? "border-rose-500/40 bg-rose-950/20"
                : t.color === "amber"
                ? "border-amber-500/40 bg-amber-950/20"
                : "border-emerald-500/40 bg-emerald-950/20";

            return (
              <div
                key={t.id}
                className={`relative flex flex-col justify-between rounded-2xl border p-3.5 transition-all duration-300 ${borderClass}`}
              >
                {/* Team header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{t.emoji}</span>
                    <span className="truncate font-display text-sm font-bold text-white max-w-[100px] sm:max-w-[120px]">
                      {t.name}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-black text-amber-400">
                    {t.score}đ
                  </span>
                </div>

                {/* HP Bar */}
                <div className="mt-2.5">
                  <div className="flex justify-between font-mono text-[10px] text-slate-400">
                    <span>MÁU (HP)</span>
                    <span className={t.hp <= 25 ? "text-rose-400 font-bold" : ""}>{t.hp}%</span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={`h-full transition-all duration-500 ${
                        t.hp > 50
                          ? "bg-gradient-to-r from-emerald-500 to-cyan-400"
                          : t.hp > 25
                          ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                          : "bg-gradient-to-r from-rose-600 to-red-500 animate-pulse"
                      }`}
                      style={{ width: `${t.hp}%` }}
                    />
                  </div>
                </div>

                {/* Active Badges & Power-ups */}
                <div className="mt-2.5 flex items-center justify-between pt-1 border-t border-slate-800/80">
                  <div className="flex items-center gap-1.5">
                    {t.shieldActive && (
                      <span className="rounded-md bg-cyan-500/20 px-1.5 py-0.5 text-[10px] font-bold text-cyan-300 animate-pulse">
                        🛡️ Khiên
                      </span>
                    )}
                    {t.doubleActive && (
                      <span className="rounded-md bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-300 animate-pulse">
                        ⚡ x2
                      </span>
                    )}
                    {t.streak >= 2 && (
                      <span className="rounded-md bg-rose-500/20 px-1.5 py-0.5 text-[10px] font-bold text-rose-300">
                        🔥x{t.streak}
                      </span>
                    )}
                  </div>

                  {/* Manual teacher bonus/penalty buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => adjustTeamScore(t.id, -20)}
                      className="h-5 w-5 rounded bg-slate-800 text-[10px] font-bold text-slate-400 hover:bg-rose-900 hover:text-white"
                      title="Giáo viên trừ 20đ"
                    >
                      -
                    </button>
                    <button
                      onClick={() => adjustTeamScore(t.id, 50)}
                      className="h-5 w-5 rounded bg-slate-800 text-[10px] font-bold text-slate-400 hover:bg-emerald-900 hover:text-white"
                      title="Giáo viên cộng 50đ"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* On-screen Buzzer Button */}
                {battleMode === "buzzer" && (
                  <button
                    type="button"
                    disabled={turnPhase !== "buzzer_open" || hasBuzzedWrong || t.frozenTurns > 0}
                    onClick={() => handleBuzzer(t.id)}
                    className={`mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl py-2 font-display text-xs font-bold uppercase transition ${
                      isAnswering
                        ? "bg-yellow-400 text-slate-950 font-black animate-pulse shadow-md"
                        : turnPhase === "buzzer_open" && !hasBuzzedWrong
                        ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white hover:scale-105 active:scale-95 shadow-md shadow-cyan-500/20"
                        : "bg-slate-800/60 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    <span>🛎️ BẤM CHUÔNG [{t.buzzerKey}]</span>
                  </button>
                )}
              </div>
            );
          })}
        </section>

        {/* QUESTION DISPLAY CARD */}
        {currentQ && (
          <section className="relative mt-4 overflow-hidden rounded-3xl border border-slate-700/80 bg-slate-900/90 p-5 shadow-2xl sm:p-7 backdrop-blur-md">
            {/* Top Status Banner */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-indigo-500/20 px-3 py-1 font-mono text-xs font-semibold text-indigo-300">
                  {currentQ.category ?? "Tin học 12 · Trọng tâm"}
                </span>
                {turnPhase === "buzzer_open" && (
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-amber-400 animate-pulse">
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                    CHUÔNG MỞ: NHÓM NÀO SẼ BẤM ĐẦU TIÊN?
                  </span>
                )}
                {turnPhase === "answering" && answeringTeam && (
                  <span className="inline-flex items-center gap-1.5 font-display text-xs font-bold text-yellow-300">
                    🛎️ {answeringTeam.emoji} [{answeringTeam.name}] ĐANG TRẢ LỜI: {answeringTimeLeft}s!
                  </span>
                )}
              </div>

              {/* Countdown badge */}
              <div className="font-mono text-sm font-bold">
                {turnPhase === "buzzer_open" && (
                  <span className={`px-3 py-1 rounded-full ${timeLeft <= 5 ? "bg-rose-500/30 text-rose-300 animate-ping" : "bg-slate-800 text-slate-300"}`}>
                    ⏱️ {timeLeft}s
                  </span>
                )}
                {turnPhase === "answering" && (
                  <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/40">
                    ⏳ {answeringTimeLeft}s
                  </span>
                )}
              </div>
            </div>

            {/* Question Text */}
            <div className="py-4 sm:py-6">
              <h2 className="font-display text-xl font-bold leading-relaxed text-white sm:text-2xl">
                {currentQ.q}
              </h2>
            </div>

            {/* Notification / Feedback Banner */}
            {feedbackAnim && (
              <div className="mb-4 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 font-display text-sm font-bold text-cyan-300 animate-pop-in">
                {feedbackAnim}
              </div>
            )}

            {/* 4 Options Grid */}
            <div className="grid gap-3 sm:grid-cols-2">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.answer;

                let optStyle =
                  "border-slate-700 bg-slate-800/80 text-slate-200 hover:border-cyan-400 hover:bg-slate-800";

                if (turnPhase === "revealed") {
                  if (isCorrect) {
                    optStyle = "border-2 border-emerald-400 bg-emerald-950/60 text-white font-bold shadow-lg shadow-emerald-500/20";
                  } else if (isSelected && !isCorrect) {
                    optStyle = "border-2 border-rose-500 bg-rose-950/60 text-rose-200 line-through";
                  } else {
                    optStyle = "border-slate-800 bg-slate-900/50 text-slate-500";
                  }
                } else if (isSelected) {
                  optStyle = "border-2 border-yellow-400 bg-yellow-950/50 text-yellow-200";
                }

                const optPrefix = ["A", "B", "C", "D"][idx];

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={turnPhase !== "answering" || selectedOption !== null}
                    onClick={() => handlePickOption(idx)}
                    className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition duration-200 ${optStyle} ${
                      turnPhase === "answering" ? "cursor-pointer active:scale-[0.98]" : ""
                    }`}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-600 bg-slate-900 font-mono text-xs font-bold text-cyan-400">
                      {optPrefix}
                    </span>
                    <span className="text-sm font-medium leading-relaxed sm:text-base">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Explanation box after answer is revealed */}
            {turnPhase === "revealed" && (
              <div className="mt-5 rounded-2xl border border-emerald-500/40 bg-emerald-950/30 p-4 animate-pop-in">
                <div className="flex items-center gap-2 font-display text-sm font-bold text-emerald-400">
                  <span>💡 Giải thích chi tiết chuẩn SGK Tin 12:</span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-slate-200">{currentQ.explain}</p>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={nextQuestion}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-2.5 font-display text-sm font-bold text-white shadow-lg shadow-emerald-500/25 hover:scale-105 transition"
                  >
                    <span>{currentQIndex + 1 >= questions.length ? "Xem Trao Cúp Vô Địch 🏆" : "Câu tiếp theo →"}</span>
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* BOTTOM TEAM POWER-UPS & BATTLE LOG */}
        <section className="mt-4 grid gap-4 sm:grid-cols-3">
          {/* Power-up activation toolbar */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3.5">
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-cyan-400">
              ⚡ Kỹ năng trợ thủ cho nhóm
            </h3>
            <p className="mt-1 text-[11px] text-slate-400">
              Mỗi nhóm có 1 lần bật Khiên, Nhân đôi điểm x2 hoặc Đóng băng đối thủ:
            </p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {teams.map((t) => (
                <div key={t.id} className="flex items-center gap-1 rounded-xl bg-slate-800/80 px-2 py-1 text-xs">
                  <span className="font-bold text-white">{t.emoji}</span>
                  <button
                    disabled={!t.shieldAvailable}
                    onClick={() => triggerPowerUp(t.id, "shield")}
                    className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                      t.shieldAvailable ? "bg-cyan-500/30 text-cyan-300 hover:bg-cyan-500/50" : "bg-slate-700 text-slate-500 cursor-not-allowed"
                    }`}
                    title="Bật khiên đỡ đòn"
                  >
                    🛡️ Khiên
                  </button>
                  <button
                    disabled={!t.doubleAvailable}
                    onClick={() => triggerPowerUp(t.id, "double")}
                    className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                      t.doubleAvailable ? "bg-amber-500/30 text-amber-300 hover:bg-amber-500/50" : "bg-slate-700 text-slate-500 cursor-not-allowed"
                    }`}
                    title="Nhân đôi điểm câu này"
                  >
                    ⚡ x2
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Battle Log ticker */}
          <div className="sm:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/80 p-3.5">
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-slate-400">
              📜 Nhật ký trận đấu trực tiếp
            </h3>
            <div className="mt-1.5 h-16 overflow-y-auto space-y-1 font-mono text-xs text-slate-300 scrollbar-thin">
              {battleLog.map((log, idx) => (
                <div key={idx} className="leading-snug">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER: VICTORY CEREMONY / PODIUM SCREEN
  // ─────────────────────────────────────────────────────────────────────────────
  if (screen === "victory") {
    const sortedTeams = [...teams].sort((a, b) => b.score - a.score || b.hp - a.hp);
    const champion = sortedTeams[0];

    return (
      <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
        {/* Background celebration glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-yellow-500/20 blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-2xl w-full text-center">
          <p className="text-6xl animate-bounce">🏆</p>
          <span className="mt-2 inline-flex items-center gap-2 rounded-full border border-yellow-400/40 bg-yellow-500/20 px-4 py-1 font-mono text-xs font-bold uppercase tracking-wider text-yellow-300">
            LỄ TRAO CÚP VÔ ĐỊCH ĐẤU TRƯỜNG TIN HỌC 12
          </span>
          <h1 className="mt-3 font-display text-3xl font-extrabold text-white sm:text-5xl">
            {champion.emoji} {champion.name} VÔ ĐỊCH!
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Xuất sắc đạt số điểm cao nhất: <span className="font-mono font-bold text-yellow-400">{champion.score} điểm</span> với {champion.correctCount} câu trả lời đúng!
          </p>

          {/* Podium Table */}
          <div className="mt-8 rounded-3xl border border-slate-700/80 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-md">
            <h2 className="font-display text-lg font-bold text-cyan-400">
              🏅 Bảng Xếp Hạng Toàn Trận
            </h2>
            <div className="mt-4 space-y-3">
              {sortedTeams.map((t, idx) => {
                const rankEmoji = idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : "🎖️";
                const rankTitle = idx === 0 ? "VÔ ĐỊCH" : idx === 1 ? "Á QUÂN" : idx === 2 ? "QUÝ QUÂN" : "TOP 4";
                const rankBg =
                  idx === 0
                    ? "border-yellow-400/60 bg-yellow-500/15 text-white"
                    : idx === 1
                    ? "border-slate-500/60 bg-slate-800/80 text-slate-200"
                    : idx === 2
                    ? "border-amber-600/60 bg-amber-900/20 text-slate-300"
                    : "border-slate-800 bg-slate-900/40 text-slate-400";

                return (
                  <div
                    key={t.id}
                    className={`flex items-center justify-between rounded-2xl border p-4 transition ${rankBg}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{rankEmoji}</span>
                      <div className="text-left">
                        <span className="font-display font-bold text-base">
                          {t.emoji} {t.name}
                        </span>
                        <div className="font-mono text-xs text-slate-400">
                          {rankTitle} · {t.correctCount} câu đúng · Máu còn lại {t.hp}%
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-xl font-black text-amber-400">
                        {t.score}đ
                      </span>
                      {t.maxStreak >= 2 && (
                        <p className="font-mono text-[10px] text-rose-400">
                          Combo kỷ lục: 🔥x{t.maxStreak}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => {
                sound.click();
                setScreen("setup");
              }}
              className="w-full sm:w-auto rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-6 py-3 font-display text-sm font-bold text-white shadow-xl hover:scale-105 transition"
            >
              🔄 Đấu lại trận mới
            </button>
            {onBack && (
              <button
                onClick={onBack}
                className="w-full sm:w-auto rounded-2xl border border-slate-700 bg-slate-900 px-6 py-3 font-mono text-sm text-slate-300 hover:border-slate-500 hover:text-white transition"
              >
                ← Về trung tâm Game
              </button>
            )}
          </div>
        </div>
      </main>
    );
  }

  return null;
}
