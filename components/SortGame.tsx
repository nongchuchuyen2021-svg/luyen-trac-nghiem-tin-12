"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { SortGame, SortGameItem } from "@/lib/types";
import { getLessonProgress, saveAttempt } from "@/lib/progress";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const SWIPE_THRESHOLD = 90; // px kéo ngang tối thiểu để tính là 1 lượt trả lời
// Moi game trong cung 1 bai co progress key rieng theo game.id

export default function SortGame({
  lessonId,
  game,
  onBack,
}: {
  lessonId: string;
  game: SortGame;
  onBack?: () => void;
}) {
  const [deck, setDeck] = useState<SortGameItem[]>([]);
  const [current, setCurrent] = useState(0);
  const [answered, setAnswered] = useState<null | { picked: boolean; correct: boolean }>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongItems, setWrongItems] = useState<SortGameItem[]>([]);
  const [finished, setFinished] = useState(false);
  const [best, setBest] = useState<number | null>(null);

  // Trạng thái kéo thẻ
  const [dragX, setDragX] = useState(0);
  const draggingRef = useRef(false);
  const startXRef = useRef(0);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDeck(shuffle(game.items));
    setBest(getLessonProgress(`${lessonId}:game:${game.id}`)?.best ?? null);
  }, [game, lessonId]);

  const item = deck[current];
  const scorePercent = deck.length ? Math.round((correctCount / deck.length) * 100) : 0;

  function commit(pickedMatch: boolean) {
    if (answered || !item) return;
    const correct = pickedMatch === item.isMatch;
    setAnswered({ picked: pickedMatch, correct });
    if (correct) {
      setCorrectCount((c) => c + 1);
    } else {
      setWrongItems((list) => [...list, item]);
    }
    setDragX(pickedMatch ? 260 : -260);
  }

  function next() {
    if (current + 1 >= deck.length) {
      saveAttempt(`${lessonId}:game:${game.id}`, scorePercent);
      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
      setAnswered(null);
      setDragX(0);
    }
  }

  function restart() {
    setDeck(shuffle(game.items));
    setCurrent(0);
    setAnswered(null);
    setCorrectCount(0);
    setWrongItems([]);
    setFinished(false);
    setDragX(0);
    setBest(getLessonProgress(`${lessonId}:game:${game.id}`)?.best ?? null);
  }

  // ── Kéo thẻ bằng Pointer Events (dùng chung cho chuột & cảm ứng) ──
  function onPointerDown(e: React.PointerEvent) {
    if (answered) return;
    draggingRef.current = true;
    startXRef.current = e.clientX - dragX;
    cardRef.current?.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!draggingRef.current || answered) return;
    setDragX(e.clientX - startXRef.current);
  }

  function onPointerUp() {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (answered) return;
    if (dragX > SWIPE_THRESHOLD) {
      commit(true);
    } else if (dragX < -SWIPE_THRESHOLD) {
      commit(false);
    } else {
      setDragX(0);
    }
  }

  const wrongList = useMemo(() => wrongItems, [wrongItems]);

  if (deck.length === 0) {
    return (
      <main className="playground flex min-h-screen items-center justify-center">
        <p className="font-mono text-sm text-ink-soft">Đang chuẩn bị game…</p>
      </main>
    );
  }

  // ===== Màn hình kết quả =====
  if (finished) {
    const emoji = scorePercent >= 80 ? "🎉" : scorePercent >= 50 ? "💪" : "📖";
    const message =
      scorePercent >= 80
        ? "Xuất sắc! Em phân biệt rất chuẩn."
        : scorePercent >= 50
          ? "Khá lắm! Xem lại các thẻ sai rồi chơi lại nhé."
          : "Đừng nản! Đọc lại phần lý thuyết rồi chơi lại nhé.";

    return (
      <main className="playground min-h-screen pb-16">
        <div className="mx-auto max-w-2xl px-5 pt-12 sm:px-8">
          <div className="animate-pop-in rounded-2xl border border-ink/5 bg-white p-8 text-center shadow-card">
            <p className="text-6xl">{emoji}</p>
            <h1 className="mt-3 font-display text-2xl font-bold text-ink">
              {correctCount}/{deck.length} thẻ đúng · {scorePercent}%
            </h1>
            <p className="mt-2 text-ink-soft">{message}</p>
            {best !== null && scorePercent > best && (
              <p className="mt-2 font-mono text-sm font-medium text-leaf">
                🚀 Kỉ lục mới! (trước đó: {best}%)
              </p>
            )}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                onClick={restart}
                className="rounded-full bg-gradient-to-r from-sea to-coral px-6 py-2.5 font-medium text-white shadow-card transition hover:opacity-90"
              >
                Chơi lại (xáo thẻ mới)
              </button>
              {onBack && (
                <button
                  onClick={onBack}
                  className="rounded-full border border-ink/10 bg-white px-6 py-2.5 font-medium text-ink-soft transition hover:border-sea/40 hover:text-sea-deep"
                >
                  ← Chọn phần khác
                </button>
              )}
            </div>
          </div>

          {wrongList.length > 0 && (
            <section className="mt-8">
              <h2 className="font-display text-lg font-semibold text-ink">
                📌 Xem lại {wrongList.length} thẻ sai
              </h2>
              <ul className="mt-3 space-y-3">
                {wrongList.map((w) => (
                  <li key={w.id} className="rounded-xl border border-berry/20 bg-white p-4 shadow-card">
                    <p className="text-sm font-medium text-ink">
                      {w.emoji} {w.label}
                    </p>
                    <p className="mt-1 text-sm text-leaf">
                      ✔ {w.isMatch ? game.matchLabel : game.noMatchLabel}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-soft">{w.explain}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>
    );
  }

  // ===== Màn hình chơi =====
  const progressPercent = Math.round((current / deck.length) * 100);
  const rotate = Math.max(-12, Math.min(12, dragX / 12));
  const leanRight = dragX > 24;
  const leanLeft = dragX < -24;

  return (
    <main className="playground min-h-screen pb-16">
      <div className="mx-auto max-w-2xl px-5 pt-8 sm:px-8">
        <header>
          <div className="flex items-center justify-between gap-3">
            {onBack ? (
              <button
                onClick={onBack}
                className="rounded-full border border-ink/10 bg-white px-3 py-1.5 font-mono text-xs text-ink-soft transition hover:border-sea/40 hover:text-sea-deep"
              >
                ← Quay lại
              </button>
            ) : (
              <span />
            )}
            <p className="font-mono text-xs text-ink-soft">
              Thẻ {current + 1}/{deck.length}
              {best !== null && ` · kỉ lục ${best}%`}
            </p>
          </div>
          <h1 className="mt-3 font-display text-lg font-semibold leading-snug text-ink">
            {game.emoji} {game.title}
          </h1>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">{game.instructions}</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-ink/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sea to-coral transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </header>

        {/* Khay 2 bên */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div
            className={`flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-4 font-display text-sm font-semibold transition ${
              leanLeft ? "border-berry bg-berry/10 text-berry scale-[1.03]" : "border-ink/10 text-ink-soft"
            }`}
          >
            <span className="text-xl">{game.noMatchEmoji}</span> {game.noMatchLabel}
          </div>
          <div
            className={`flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-4 font-display text-sm font-semibold transition ${
              leanRight ? "border-leaf bg-leaf/10 text-leaf-deep scale-[1.03]" : "border-ink/10 text-ink-soft"
            }`}
          >
            <span className="text-xl">{game.matchEmoji}</span> {game.matchLabel}
          </div>
        </div>

        {/* Thẻ đang kéo */}
        <div className="relative mt-6 h-64 select-none">
          <div
            key={item.id}
            ref={cardRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            style={{
              transform: `translateX(${dragX}px) rotate(${rotate}deg)`,
              transition: draggingRef.current ? "none" : "transform 0.35s ease-out",
              touchAction: "pan-y",
            }}
            className={`absolute inset-0 flex cursor-grab flex-col items-center justify-center gap-3 rounded-3xl border-2 bg-white p-6 text-center shadow-card-hover active:cursor-grabbing ${
              answered
                ? answered.correct
                  ? "border-leaf"
                  : "border-berry animate-wiggle"
                : "border-ink/10"
            }`}
          >
            <span className="text-6xl">{item.emoji}</span>
            <p className="font-display text-lg font-semibold text-ink">{item.label}</p>
            {!answered && (
              <p className="font-mono text-[11px] text-ink-soft/50">
                ← kéo hoặc bấm nút bên dưới →
              </p>
            )}
          </div>
        </div>

        {/* Nút bấm thay thế kéo thả */}
        {!answered ? (
          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              onClick={() => commit(false)}
              className="rounded-2xl border-2 border-berry/30 bg-berry/5 py-3 font-display font-semibold text-berry transition hover:bg-berry/10"
            >
              {game.noMatchEmoji} {game.noMatchLabel}
            </button>
            <button
              onClick={() => commit(true)}
              className="rounded-2xl border-2 border-leaf/30 bg-leaf/5 py-3 font-display font-semibold text-leaf-deep transition hover:bg-leaf/10"
            >
              {game.matchEmoji} {game.matchLabel}
            </button>
          </div>
        ) : (
          <div className="mt-5 animate-pop-in rounded-xl border border-ink/5 bg-white p-4 shadow-card">
            <p className={`font-display text-sm font-semibold ${answered.correct ? "text-leaf" : "text-berry"}`}>
              {answered.correct ? "🎯 Chính xác!" : "😅 Chưa đúng rồi"}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
              Đáp án: <strong>{item.isMatch ? game.matchLabel : game.noMatchLabel}</strong> — {item.explain}
            </p>
            <button
              onClick={next}
              className="mt-3 w-full rounded-full bg-gradient-to-r from-sea to-coral px-5 py-2.5 font-medium text-white transition hover:opacity-90"
            >
              {current + 1 >= deck.length ? "Xem kết quả 🏁" : "Thẻ tiếp theo →"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
