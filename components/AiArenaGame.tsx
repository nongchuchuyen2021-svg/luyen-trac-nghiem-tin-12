"use client";

import { useEffect, useRef, useState } from "react";
import type { ArenaGame, ArenaThreat } from "@/lib/types";
import { getLessonProgress, saveAttempt } from "@/lib/progress";
import { sound } from "@/lib/sound";

type PowerUpKey = "shield" | "scan" | "twoFa" | "freeze";

interface PowerUpState {
  available: boolean;
  active: boolean;
}

export default function AiArenaGame({
  lessonId,
  game,
  onBack,
}: {
  lessonId: string;
  game: ArenaGame;
  onBack?: () => void;
}) {
  const allThreats = useRef<ArenaThreat[]>([]);
  const threatWaveMap = useRef<number[]>([]);

  if (allThreats.current.length === 0) {
    const list: ArenaThreat[] = [];
    const wMap: number[] = [];
    game.waves.forEach((w, wIdx) => {
      w.threats.forEach((t) => {
        list.push(t);
        wMap.push(wIdx);
      });
    });
    allThreats.current = list;
    threatWaveMap.current = wMap;
  }

  const totalThreats = allThreats.current.length;

  // Game state
  const [currentIdx, setCurrentIdx] = useState(0);
  const [systemStability, setSystemStability] = useState(100);
  const [bossHp, setBossHp] = useState(game.bossHp);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Timer
  const QUESTION_TIME = 20;
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [isFrozen, setIsFrozen] = useState(false);

  // Power-ups (Mỗi loại dùng 1 lần)
  const [powerUps, setPowerUps] = useState<Record<PowerUpKey, PowerUpState>>({
    shield: { available: true, active: false },
    scan: { available: true, active: false },
    twoFa: { available: true, active: false },
    freeze: { available: true, active: false },
  });
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);

  // Tương tác câu hiện tại
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answeredState, setAnsweredState] = useState<{
    correct: boolean;
    hpDelta: number;
    scoreDelta: number;
    explain: string;
    shieldBlocked?: boolean;
  } | null>(null);

  // Trạng thái trận đấu
  const [gameState, setGameState] = useState<"intro" | "playing" | "victory" | "defeat">("intro");
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [screenShake, setScreenShake] = useState(false);

  const currentThreat = allThreats.current[currentIdx];
  const currentWaveIdx = threatWaveMap.current[currentIdx] ?? 0;
  const currentWave = game.waves[currentWaveIdx] ?? game.waves[0];

  useEffect(() => {
    const p = getLessonProgress(`${lessonId}:arena:${game.id}`);
    if (p && p.best) {
      setBestScore(p.best);
    }
  }, [lessonId, game.id]);

  useEffect(() => {
    sound.enabled = soundEnabled;
  }, [soundEnabled]);

  // Đếm ngược thời gian
  useEffect(() => {
    if (gameState !== "playing" || answeredState !== null || isFrozen) return;

    if (timeLeft <= 0) {
      handleTimeOut();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 5 && t > 1) {
          sound.tick();
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, answeredState, timeLeft, isFrozen]);

  function triggerShake() {
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 450);
  }

  function handleTimeOut() {
    if (!currentThreat || answeredState) return;

    const damage = currentThreat.damage;
    let effectiveDamage = damage;
    let blocked = false;

    if (powerUps.shield.active) {
      effectiveDamage = 0;
      blocked = true;
      setPowerUps((prev) => ({ ...prev, shield: { available: false, active: false } }));
    }

    sound.damage();
    triggerShake();

    const newStability = Math.max(0, systemStability - effectiveDamage);
    setSystemStability(newStability);
    setCombo(0);

    setAnsweredState({
      correct: false,
      hpDelta: -effectiveDamage,
      scoreDelta: 0,
      explain: `⏰ HẾT THỜI GIAN PHÂN TÍCH! Thuật toán siêu AI Omega đã gây nhiễu loạn phân hệ này. ${currentThreat.explain}`,
      shieldBlocked: blocked,
    });

    if (newStability <= 0) {
      sound.defeat();
      setTimeout(() => setGameState("defeat"), 1200);
    }
  }

  function handlePickOption(optionIdx: number) {
    if (answeredState !== null || !currentThreat) return;

    sound.click();
    setSelectedOption(optionIdx);

    const isCorrect = optionIdx === currentThreat.answer;

    if (isCorrect) {
      sound.laser();
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);
      if (newCombo > 1) sound.combo(newCombo);

      const speedBonus = timeLeft > 10 ? 50 : timeLeft > 5 ? 25 : 0;
      const comboBonus = (newCombo - 1) * 30;
      let totalGained = currentThreat.score + speedBonus + comboBonus;

      if (powerUps.twoFa.active) {
        totalGained *= 2;
        setPowerUps((prev) => ({ ...prev, twoFa: { available: false, active: false } }));
      }

      setScore((s) => s + totalGained);

      // Trừ máu Boss
      const bossDamage = Math.round(game.bossHp / totalThreats) + 15;
      const newBossHp = Math.max(0, bossHp - bossDamage);
      setBossHp(newBossHp);

      setAnsweredState({
        correct: true,
        hpDelta: 0,
        scoreDelta: totalGained,
        explain: currentThreat.explain,
      });
    } else {
      let damage = currentThreat.damage;
      let blocked = false;

      if (powerUps.shield.active) {
        damage = 0;
        blocked = true;
        setPowerUps((prev) => ({ ...prev, shield: { available: false, active: false } }));
      }

      sound.damage();
      triggerShake();

      const newStability = Math.max(0, systemStability - damage);
      setSystemStability(newStability);
      setCombo(0);

      setAnsweredState({
        correct: false,
        hpDelta: -damage,
        scoreDelta: 0,
        explain: currentThreat.explain,
        shieldBlocked: blocked,
      });

      if (newStability <= 0) {
        sound.defeat();
        setTimeout(() => setGameState("defeat"), 1200);
      }
    }
  }

  function handleNextThreat() {
    if (systemStability <= 0) {
      setGameState("defeat");
      return;
    }

    const nextIdx = currentIdx + 1;
    if (nextIdx >= totalThreats) {
      sound.victory();
      setGameState("victory");
      saveAttempt(`${lessonId}:arena:${game.id}`, score);
      return;
    }

    setCurrentIdx(nextIdx);
    setSelectedOption(null);
    setAnsweredState(null);
    setTimeLeft(QUESTION_TIME);
    setIsFrozen(false);
    setEliminatedOptions([]);
  }

  function activatePowerUp(key: PowerUpKey) {
    if (!powerUps[key].available || answeredState !== null) return;

    if (key === "shield") {
      sound.shield();
      setPowerUps((prev) => ({ ...prev, shield: { available: false, active: true } }));
    } else if (key === "scan") {
      sound.scan();
      if (!currentThreat) return;
      const wrongIndices = [0, 1, 2, 3].filter((i) => i !== currentThreat.answer);
      const shuffled = [...wrongIndices].sort(() => Math.random() - 0.5);
      setEliminatedOptions(shuffled.slice(0, 2));
      setPowerUps((prev) => ({ ...prev, scan: { available: false, active: false } }));
    } else if (key === "twoFa") {
      sound.shield();
      setPowerUps((prev) => ({ ...prev, twoFa: { available: false, active: true } }));
    } else if (key === "freeze") {
      sound.freeze();
      setIsFrozen(true);
      setTimeLeft((t) => t + 10);
      setPowerUps((prev) => ({ ...prev, freeze: { available: false, active: false } }));
    }
  }

  function handleRestart() {
    setCurrentIdx(0);
    setSystemStability(100);
    setBossHp(game.bossHp);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setTimeLeft(QUESTION_TIME);
    setIsFrozen(false);
    setSelectedOption(null);
    setAnsweredState(null);
    setEliminatedOptions([]);
    setPowerUps({
      shield: { available: true, active: false },
      scan: { available: true, active: false },
      twoFa: { available: true, active: false },
      freeze: { available: true, active: false },
    });
    setGameState("playing");
  }

  function getRank(finalScore: number) {
    if (finalScore >= 2500) {
      return {
        title: "BẬC THẦY ĐẠI KIỆN TƯỚNG AI TOÀN CẦU",
        badge: "👑",
        color: "text-amber-300",
        desc: "Thấu suốt mọi ngóc ngách của AI tạo sinh, hộp đen, giải mã hoàn toàn Siêu Trí tuệ Omega!",
      };
    }
    if (finalScore >= 1800) {
      return {
        title: "CHUYÊN GIA KIỂM SOÁT SIÊU TRÍ TUỆ",
        badge: "⚡",
        color: "text-cyan-300",
        desc: "Làm chủ các ứng dụng AI trong Y tế, Giao thông, Sản xuất và ngăn chặn rủi ro dữ liệu xuất sắc!",
      };
    }
    if (finalScore >= 1000) {
      return {
        title: "KỸ SƯ AN TOÀN AI CAO CẤP",
        badge: "🛡️",
        color: "text-emerald-300",
        desc: "Phân biệt rõ ràng AI tạo sinh vs truyền thống, nhận thức đúng đắn về trách nhiệm công nghệ.",
      };
    }
    return {
      title: "THỰC TẬP SINH CÔNG NGHỆ AI",
      badge: "🔰",
      color: "text-blue-300",
      desc: "Đã hoàn thành thử thách sơ khởi, cần ôn tập thêm về các nguy cơ hộp đen và đầu độc mô hình.",
    };
  }

  // ──────────────────────────────────────────
  // MÀN HÌNH GIỚI THIỆU (INTRO)
  // ──────────────────────────────────────────
  if (gameState === "intro") {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6">
        <div className="mx-auto max-w-2xl">
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900/80 px-3.5 py-1.5 font-mono text-xs text-slate-300 backdrop-blur transition hover:border-cyan-500 hover:text-white"
            >
              ← Quay lại danh sách game
            </button>
          )}

          <div className="mt-6 overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-cyan-950/40 via-slate-900/90 to-slate-950 p-6 shadow-2xl backdrop-blur sm:p-8">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 font-mono text-xs font-semibold text-cyan-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
                AI SINGULARITY ARENA · TIN HỌC 12
              </span>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-xs text-slate-300 hover:text-white"
                title={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
              >
                {soundEnabled ? "🔊 Âm thanh: BẬT" : "🔇 Âm thanh: TẮT"}
              </button>
            </div>

            <div className="mt-5 text-center">
              <span className="text-6xl sm:text-7xl">🧠⚡</span>
              <h1 className="mt-3 font-display text-2xl font-black tracking-tight text-white sm:text-3xl">
                {game.title}
              </h1>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-slate-300 sm:text-base">
                {game.instructions}
              </p>
            </div>

            {/* Bối cảnh nhiệm vụ */}
            <div className="mt-6 rounded-2xl border border-cyan-500/20 bg-cyan-950/20 p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🤖</span>
                <div>
                  <h3 className="font-display text-sm font-bold text-cyan-300">
                    BÁO ĐỘNG HẠT NHÂN AI: SIÊU TRÍ TUỆ OMEGA VƯỢT TẦM KIỂM SOÁT!
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-300">
                    Siêu mạng trí tuệ nhân tạo <span className="font-semibold text-cyan-400">"{game.bossName}"</span> đang
                    thử nghiệm kiểm soát toàn bộ hạ tầng Y tế (IBM Watson), Giao thông tự lái, Tài chính ngân hàng và hệ thống AI tạo sinh.
                    Em hãy vào vai <strong>Trưởng ban An toàn & Kiểm soát AI</strong>, vận dụng kiến thức Bài 2 để giải mã các tình huống,
                    duy trì độ ổn định hệ thống và thuần hóa Siêu AI!
                  </p>
                </div>
              </div>
            </div>

            {/* 4 Vũ khí AI */}
            <div className="mt-6">
              <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-cyan-300">
                🛠️ 4 Kỹ năng Tác chiến Kiểm soát AI (Power-ups):
              </h4>
              <div className="mt-3 grid grid-cols-2 gap-2.5 text-xs sm:grid-cols-4">
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                  <div className="text-lg">🛡️</div>
                  <div className="mt-1 font-bold text-slate-200">Khiên Thuật toán</div>
                  <div className="text-[11px] text-slate-400">Miễn nhiễm 1 đòn sai</div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                  <div className="text-lg">🔍</div>
                  <div className="mt-1 font-bold text-slate-200">Giải mã Hộp đen</div>
                  <div className="text-[11px] text-slate-400">Loại bỏ 2 phương án sai</div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                  <div className="text-lg">⚡</div>
                  <div className="mt-1 font-bold text-slate-200">Gia tốc Lượng tử</div>
                  <div className="text-[11px] text-slate-400">Nhân 2 điểm câu này</div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                  <div className="text-lg">⏱️</div>
                  <div className="mt-1 font-bold text-slate-200">Đóng băng Neural</div>
                  <div className="text-[11px] text-slate-400">+10s thời gian suy nghĩ</div>
                </div>
              </div>
            </div>

            {bestScore !== null && (
              <div className="mt-5 text-center font-mono text-xs text-amber-300">
                🏆 Điểm kỷ lục của em: <span className="font-bold">{bestScore} điểm</span>
              </div>
            )}

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => {
                  sound.click();
                  setGameState("playing");
                }}
                className="flex-1 rounded-2xl bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 py-3.5 font-display text-base font-bold text-white shadow-lg shadow-cyan-900/40 transition hover:brightness-110 active:scale-[0.98]"
              >
                ⚔️ ĐẤU SOLO DIỆT BOSS OMEGA →
              </button>
              {onBack && (
                <button
                  onClick={onBack}
                  className="rounded-2xl border border-indigo-500/50 bg-indigo-950/60 px-5 py-3.5 font-display text-sm font-bold text-indigo-300 transition hover:border-cyan-400 hover:text-white"
                >
                  👥 Đấu Đối Kháng Các Nhóm
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ──────────────────────────────────────────
  // MÀN HÌNH CHIẾN THẮNG (VICTORY)
  // ──────────────────────────────────────────
  if (gameState === "victory") {
    const rank = getRank(score);
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6">
        <div className="mx-auto max-w-xl text-center">
          <div className="overflow-hidden rounded-3xl border border-cyan-500/40 bg-gradient-to-b from-cyan-950/40 via-slate-900 to-slate-950 p-6 shadow-2xl sm:p-8">
            <span className="text-7xl animate-bounce">🧠✨</span>
            <span className="mt-2 inline-block rounded-full bg-cyan-500/20 px-3.5 py-1 font-mono text-xs font-bold text-cyan-300">
              ALIGNMENT ACHIEVED · SIÊU TRÍ TUỆ ĐÃ ĐƯỢC ĐỊNH HƯỚNG AN TOÀN!
            </span>
            <h1 className="mt-3 font-display text-2xl font-black text-white sm:text-3xl">
              THUẦN HÓA THÀNH CÔNG A.I. OMEGA!
            </h1>
            <p className="mt-2 text-sm text-slate-300">
              Em đã xuất sắc vượt qua toàn bộ {totalThreats} thử thách thuật toán, phân tích sâu sắc các mặt lợi - hại của AI
              và thiết lập chuẩn mực đạo đức an toàn cho hệ thống!
            </p>

            {/* Rank Card */}
            <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-950/20 p-5 text-center">
              <div className="text-4xl">{rank.badge}</div>
              <div className={`mt-1 font-display text-lg font-black uppercase ${rank.color}`}>
                {rank.title}
              </div>
              <p className="mt-1 text-xs text-slate-300">{rank.desc}</p>
            </div>

            {/* Thống kê trận đấu */}
            <div className="mt-5 grid grid-cols-3 gap-3 font-mono text-xs">
              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
                <div className="text-slate-400">Tổng điểm</div>
                <div className="mt-1 text-lg font-bold text-amber-300">{score}</div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
                <div className="text-slate-400">Độ ổn định còn</div>
                <div className="mt-1 text-lg font-bold text-cyan-400">{systemStability}%</div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
                <div className="text-slate-400">Chuỗi Combo max</div>
                <div className="mt-1 text-lg font-bold text-teal-400">{maxCombo}x 🔥</div>
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleRestart}
                className="flex-1 rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-600 py-3 font-display text-sm font-bold text-white shadow-lg transition hover:brightness-110"
              >
                🔄 Thách đấu lại trận mới
              </button>
              {onBack && (
                <button
                  onClick={onBack}
                  className="rounded-2xl border border-slate-700 bg-slate-800/80 px-5 py-3 font-display text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white"
                >
                  ← Về danh sách game
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ──────────────────────────────────────────
  // MÀN HÌNH THẤT THỦ (DEFEAT)
  // ──────────────────────────────────────────
  if (gameState === "defeat") {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6">
        <div className="mx-auto max-w-xl text-center">
          <div className="overflow-hidden rounded-3xl border border-rose-500/40 bg-gradient-to-b from-rose-950/50 via-slate-900 to-slate-950 p-6 shadow-2xl sm:p-8">
            <span className="text-7xl">⚠️</span>
            <span className="mt-2 inline-block rounded-full bg-rose-500/20 px-3.5 py-1 font-mono text-xs font-bold text-rose-300">
              SYSTEM INTEGRITY COLLAPSED · THUẬT TOÁN MẤT KIỂM SOÁT!
            </span>
            <h1 className="mt-3 font-display text-2xl font-black text-rose-400 sm:text-3xl">
              HỆ THỐNG MẤT ĐỘ ỔN ĐỊNH TOÀN DIỆN!
            </h1>
            <p className="mt-2 text-sm text-slate-300">
              Hệ thống đã bị sụp đổ do các quyết định thuật toán sai lầm hoặc bị ảnh hưởng bởi rủi ro hộp đen và đầu độc dữ liệu.
              Hãy kiểm tra lại lý thuyết Bài 2 và tái lập phòng tuyến!
            </p>

            <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-left text-xs leading-relaxed text-slate-300">
              <span className="font-bold text-cyan-300">💡 Ghi nhớ chiến thuật Bài 2 Tin 12:</span>
              <ul className="mt-2 list-inside list-disc space-y-1 text-slate-400">
                <li>Phân biệt rõ: AI tạo sinh là tạo nội dung mới (hình ảnh, văn bản, âm thanh, code); AI truyền thống chỉ phân loại hoặc dự đoán.</li>
                <li>Hệ chuyên gia hiện đại tự học từ dữ liệu để hình thành tri thức nhờ Học máy (Machine Learning).</li>
                <li>Hiểu rõ 4 rủi ro lớn của AI: Thất nghiệp, Xâm phạm riêng tư, Vấn đề hộp đen (thiếu minh bạch), Rủi ro an ninh/dữ liệu sai.</li>
              </ul>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleRestart}
                className="flex-1 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 py-3 font-display text-sm font-bold text-white shadow-lg transition hover:brightness-110"
              >
                🔄 Khởi động lại phòng tuyến & Thử lại
              </button>
              {onBack && (
                <button
                  onClick={onBack}
                  className="rounded-2xl border border-slate-700 bg-slate-800/80 px-5 py-3 font-display text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white"
                >
                  ← Về danh sách game
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ──────────────────────────────────────────
  // MÀN HÌNH TÁC CHIẾN ĐẤU TRƯỜNG (PLAYING)
  // ──────────────────────────────────────────
  const stabilityPercent = Math.max(0, Math.min(100, systemStability));
  const stabilityColor =
    stabilityPercent > 50
      ? "bg-gradient-to-r from-teal-500 to-cyan-400"
      : stabilityPercent > 25
        ? "bg-gradient-to-r from-amber-500 to-yellow-400"
        : "bg-gradient-to-r from-rose-600 to-red-500 animate-pulse";

  const bossHpPercent = Math.max(0, Math.min(100, Math.round((bossHp / game.bossHp) * 100)));

  return (
    <main
      className={`min-h-screen bg-slate-950 pb-16 pt-5 text-slate-100 transition-transform duration-100 ${
        screenShake ? "translate-x-1.5 -translate-y-1.5" : ""
      }`}
    >
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          {onBack && (
            <button
              onClick={onBack}
              className="rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 font-mono text-xs text-slate-400 hover:text-slate-200"
            >
              ← Rời đấu trường
            </button>
          )}
          <div className="flex items-center gap-3">
            {combo > 1 && (
              <span className="rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 px-2.5 py-0.5 font-mono text-xs font-bold text-white shadow-lg animate-bounce">
                🔥 COMBO {combo}x
              </span>
            )}
            <span className="font-mono text-xs font-bold text-amber-300">
              💎 {score} <span className="text-[10px] text-slate-400">điểm</span>
            </span>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="text-sm text-slate-400 hover:text-white"
              title="Bật/Tắt âm thanh"
            >
              {soundEnabled ? "🔊" : "🔇"}
            </button>
          </div>
        </div>

        {/* HUD DUAL BARS */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          {/* Độ ổn định hệ thống */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-3 shadow-md">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 font-bold text-cyan-400">
                <span>🛡️</span> HỆ THỐNG
              </span>
              <span className="font-mono font-bold text-slate-200">{stabilityPercent}%</span>
            </div>
            <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className={`h-full transition-all duration-300 ${stabilityColor}`}
                style={{ width: `${stabilityPercent}%` }}
              />
            </div>
          </div>

          {/* Lõi Siêu AI Omega */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-3 shadow-md">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 font-bold text-rose-400">
                <span>{game.bossEmoji}</span> {game.bossName}
              </span>
              <span className="font-mono font-bold text-slate-200">{bossHpPercent}%</span>
            </div>
            <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-300"
                style={{ width: `${bossHpPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* THANH KỸ NĂNG AI POWER-UPS */}
        <div className="mt-3 flex items-center justify-between rounded-xl border border-cyan-500/20 bg-cyan-950/20 px-3 py-2 text-xs">
          <span className="font-mono text-[11px] font-semibold text-cyan-300">
            TRỢ THỦ AI:
          </span>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => activatePowerUp("shield")}
              disabled={!powerUps.shield.available || answeredState !== null}
              className={`flex items-center gap-1 rounded-lg px-2 py-1 transition ${
                powerUps.shield.active
                  ? "border border-cyan-400 bg-cyan-500/20 text-cyan-300"
                  : powerUps.shield.available && !answeredState
                    ? "border border-slate-700 bg-slate-800 hover:border-cyan-500 hover:text-cyan-300"
                    : "opacity-30 cursor-not-allowed border border-slate-800 bg-slate-900"
              }`}
              title="Khiên Thuật toán: miễn nhiễm 1 đòn nếu giải mã sai"
            >
              <span>🛡️</span>
              <span className="hidden sm:inline">Khiên AI</span>
            </button>

            <button
              onClick={() => activatePowerUp("scan")}
              disabled={!powerUps.scan.available || answeredState !== null}
              className={`flex items-center gap-1 rounded-lg px-2 py-1 transition ${
                powerUps.scan.available && !answeredState
                  ? "border border-slate-700 bg-slate-800 hover:border-teal-500 hover:text-teal-300"
                  : "opacity-30 cursor-not-allowed border border-slate-800 bg-slate-900"
              }`}
              title="Giải mã Hộp đen: Loại bỏ 2 phương án sai (50:50)"
            >
              <span>🔍</span>
              <span className="hidden sm:inline">Hộp đen 50:50</span>
            </button>

            <button
              onClick={() => activatePowerUp("twoFa")}
              disabled={!powerUps.twoFa.available || answeredState !== null}
              className={`flex items-center gap-1 rounded-lg px-2 py-1 transition ${
                powerUps.twoFa.active
                  ? "border border-amber-400 bg-amber-500/20 text-amber-300"
                  : powerUps.twoFa.available && !answeredState
                    ? "border border-slate-700 bg-slate-800 hover:border-amber-500 hover:text-amber-300"
                    : "opacity-30 cursor-not-allowed border border-slate-800 bg-slate-900"
              }`}
              title="Gia tốc Lượng tử: Nhân đôi điểm số cho câu này"
            >
              <span>⚡</span>
              <span className="hidden sm:inline">x2 Điểm</span>
            </button>

            <button
              onClick={() => activatePowerUp("freeze")}
              disabled={!powerUps.freeze.available || answeredState !== null}
              className={`flex items-center gap-1 rounded-lg px-2 py-1 transition ${
                isFrozen
                  ? "border border-blue-400 bg-blue-500/20 text-blue-300"
                  : powerUps.freeze.available && !answeredState
                    ? "border border-slate-700 bg-slate-800 hover:border-blue-500 hover:text-blue-300"
                    : "opacity-30 cursor-not-allowed border border-slate-800 bg-slate-900"
              }`}
              title="Đóng băng Neural: Thêm +10s thời gian"
            >
              <span>⏱️</span>
              <span className="hidden sm:inline">+10s</span>
            </button>
          </div>
        </div>

        {/* THẺ TÌNH HUỐNG THỬ THÁCH THUẬT TOÁN */}
        {currentThreat && (
          <div className="mt-4 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/95 shadow-xl">
            {/* Header thẻ: Tên đợt & Bộ đếm thời gian */}
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/60 px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{currentWave.emoji}</span>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-cyan-400">
                    ĐỢT {currentWave.waveNumber}/5 · CÂU {currentIdx + 1}/{totalThreats}
                  </div>
                  <div className="font-display text-xs font-bold text-slate-200">
                    {currentWave.name}
                  </div>
                </div>
              </div>

              {/* Đồng hồ đếm ngược */}
              <div
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-xs font-bold ${
                  timeLeft <= 5
                    ? "bg-rose-500/20 text-rose-400 animate-pulse border border-rose-500/40"
                    : isFrozen
                      ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                      : "bg-slate-800 text-slate-300"
                }`}
              >
                <span>{isFrozen ? "❄️" : "⏱️"}</span>
                <span>{timeLeft}s</span>
              </div>
            </div>

            {/* Nội dung tình huống */}
            <div className="p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <span className="text-3xl">{currentThreat.threatEmoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold uppercase tracking-wide text-cyan-400">
                      [{currentThreat.threatType}]
                    </span>
                    <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-slate-400">
                      Nguồn gốc: {currentThreat.attackerTag}
                    </span>
                  </div>
                  <h3 className="mt-1 font-display text-base font-bold text-white sm:text-lg">
                    {currentThreat.threatName}
                  </h3>
                </div>
              </div>

              {/* Khung mô tả tình huống thực tế */}
              <div className="mt-3.5 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 text-xs leading-relaxed text-slate-300 sm:text-sm">
                <div className="font-mono text-[11px] font-bold text-cyan-300 mb-1">
                  📡 TÌNH HUỐNG THUẬT TOÁN GHI NHẬN:
                </div>
                {currentThreat.situation}
              </div>

              {/* Câu hỏi phản công */}
              <p className="mt-4 font-display text-sm font-semibold text-white sm:text-base">
                🎯 {currentThreat.q}
              </p>

              {/* 4 Lựa chọn phương án */}
              <div className="mt-4 space-y-2.5">
                {currentThreat.options.map((opt, optIdx) => {
                  const isEliminated = eliminatedOptions.includes(optIdx);
                  const isPicked = selectedOption === optIdx;
                  const isCorrectAnswer = optIdx === currentThreat.answer;

                  let btnStyle =
                    "border-slate-800 bg-slate-950/40 hover:border-cyan-500 hover:bg-cyan-950/20 text-slate-200";

                  if (answeredState !== null) {
                    if (isCorrectAnswer) {
                      btnStyle = "border-emerald-500 bg-emerald-950/40 text-emerald-300 font-semibold";
                    } else if (isPicked && !isCorrectAnswer) {
                      btnStyle = "border-rose-500 bg-rose-950/40 text-rose-300 font-semibold";
                    } else {
                      btnStyle = "opacity-40 border-slate-800 bg-slate-950/20 text-slate-500";
                    }
                  } else if (isEliminated) {
                    btnStyle = "opacity-25 line-through border-slate-800 bg-slate-950 cursor-not-allowed text-slate-600";
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={isEliminated || answeredState !== null}
                      onClick={() => handlePickOption(optIdx)}
                      className={`group flex w-full items-start gap-3 rounded-2xl border p-3.5 text-left text-xs transition sm:text-sm ${btnStyle}`}
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-800/80 font-mono text-xs text-slate-300 group-hover:border-cyan-400 group-hover:text-white">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="flex-1 leading-snug">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* BẢN TIN PHÂN TÍCH ĐIỀU TRA KHI ĐÃ TRẢ LỜI */}
              {answeredState && (
                <div
                  className={`mt-5 rounded-2xl border p-4 text-xs leading-relaxed animate-pop-in sm:text-sm ${
                    answeredState.correct
                      ? "border-emerald-500/40 bg-emerald-950/30 text-emerald-200"
                      : "border-rose-500/40 bg-rose-950/30 text-rose-200"
                  }`}
                >
                  <div className="flex items-center justify-between font-display text-sm font-bold">
                    <span>
                      {answeredState.correct
                        ? "🧠 ĐÃ GIẢI MÃ THUẬT TOÁN THÀNH CÔNG!"
                        : answeredState.shieldBlocked
                          ? "🛡️ KHIÊN THUẬT TOÁN ĐÃ BẢO VỆ HỆ THỐNG!"
                          : "⚠️ HỆ THỐNG BỊ MẤT ỔN ĐỊNH!"}
                    </span>
                    <span className="font-mono text-xs">
                      {answeredState.correct
                        ? `+${answeredState.scoreDelta} điểm`
                        : `${answeredState.hpDelta}% Ổn định`}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-slate-300 sm:text-sm">
                    {answeredState.explain}
                  </p>

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={handleNextThreat}
                      className="rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 px-5 py-2 font-display text-xs font-bold text-white shadow-md transition hover:brightness-110 sm:text-sm"
                    >
                      Tiếp tục phản công →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
