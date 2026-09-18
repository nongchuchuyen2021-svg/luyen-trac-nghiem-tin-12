"use client";

import { useEffect, useState } from "react";
import type { MenuPathGame, MenuPathQuestion } from "@/lib/types";
import { getLessonProgress, saveAttempt } from "@/lib/progress";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// correctIndex = vị trí đúng trong đường đi (0,1,2…), hoặc -1 nếu đây là thẻ
// bẫy (mục menu có thật nhưng thuộc quy trình khác, không thuộc đường đi này)
type Chip = { id: string; label: string; correctIndex: number };

function buildChips(q: MenuPathQuestion): Chip[] {
  const pathChips = q.path.map((label, i) => ({ id: `${q.id}-p${i}`, label, correctIndex: i }));
  const decoyChips = q.decoys.map((label, i) => ({ id: `${q.id}-d${i}`, label, correctIndex: -1 }));
  return shuffle([...pathChips, ...decoyChips]);
}

type PlacedState = (Chip | null)[];

export default function MenuPathGameClient({
  lessonId,
  game,
  onBack,
}: {
  lessonId: string;
  game: MenuPathGame;
  onBack?: () => void;
}) {
  const progressKey = `${lessonId}:game:${game.id}`;
  const n = game.questions.length;

  const [deck, setDeck] = useState<MenuPathQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [pool, setPool] = useState<Chip[]>([]);
  const [placed, setPlaced] = useState<PlacedState>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongItems, setWrongItems] = useState<MenuPathQuestion[]>([]);
  const [finished, setFinished] = useState(false);
  const [best, setBest] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  function setupGame() {
    setDeck(shuffle(game.questions));
    setCurrent(0);
    setFinished(false);
    setCorrectCount(0);
    setWrongItems([]);
  }

  function setupQuestion(q: MenuPathQuestion) {
    setPool(buildChips(q));
    setPlaced(new Array(q.path.length).fill(null));
    setSelectedId(null);
    setChecked(false);
  }

  useEffect(() => {
    setupGame();
    setBest(getLessonProgress(progressKey)?.best ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game, lessonId]);

  useEffect(() => {
    if (deck[current]) setupQuestion(deck[current]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deck, current]);

  const q = deck[current];
  const allFilled = placed.length > 0 && placed.every((s) => s !== null);
  const scorePercent = Math.round((correctCount / n) * 100);

  function toggleSelect(id: string) {
    if (checked) return;
    setSelectedId((cur) => (cur === id ? null : id));
  }

  function placeAt(chip: Chip, idx: number) {
    if (checked || placed[idx] !== null) return;
    setPlaced((prev) => {
      const next = [...prev];
      next[idx] = chip;
      return next;
    });
    setPool((prev) => prev.filter((c) => c.id !== chip.id));
    setSelectedId(null);
  }

  function returnToPool(idx: number) {
    if (checked) return;
    const chip = placed[idx];
    if (!chip) return;
    setPlaced((prev) => {
      const next = [...prev];
      next[idx] = null;
      return next;
    });
    setPool((prev) => [...prev, chip]);
  }

  function onSlotTap(idx: number) {
    if (checked) return;
    if (placed[idx]) {
      returnToPool(idx);
      return;
    }
    const chip = pool.find((c) => c.id === selectedId);
    if (chip) placeAt(chip, idx);
  }

  function onDrop(idx: number) {
    setDragOverIdx(null);
    if (checked || placed[idx] !== null || !selectedId) return;
    const chip = pool.find((c) => c.id === selectedId);
    if (chip) placeAt(chip, idx);
  }

  function check() {
    if (!allFilled || !q) return;
    setChecked(true);
    const correct = placed.every((c, i) => c && c.correctIndex === i);
    if (correct) {
      setCorrectCount((c) => c + 1);
    } else {
      setWrongItems((list) => [...list, q]);
    }
  }

  function next() {
    if (current + 1 >= n) {
      const percent = Math.round((correctCount / n) * 100);
      saveAttempt(progressKey, percent);
      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
    }
  }

  function restart() {
    setupGame();
  }

  if (deck.length === 0 || !q) {
    return (
      <main className="playground min-h-screen pb-16">
        <div className="mx-auto max-w-2xl px-5 pt-8 sm:px-8 text-sm text-ink-soft">Đang tải…</div>
      </main>
    );
  }

  if (finished) {
    return (
      <main className="playground min-h-screen pb-16">
        <div className="mx-auto max-w-2xl px-5 pt-8 sm:px-8">
          <div className="rounded-2xl border border-ink/5 bg-white p-5 text-center shadow-card">
            <p className="text-4xl">{scorePercent === 100 ? "🎉" : scorePercent >= 60 ? "💪" : "📖"}</p>
            <h2 className="mt-2 font-display text-xl font-bold text-ink">
              {correctCount}/{n} đúng đường đi · {scorePercent}%
            </h2>
            {best !== null && scorePercent > best && (
              <p className="mt-1 font-mono text-sm font-medium text-leaf">🚀 Kỉ lục mới! (trước đó: {best}%)</p>
            )}
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <button
                onClick={restart}
                className="rounded-full bg-gradient-to-r from-sea to-coral px-6 py-2.5 font-medium text-white shadow-card transition hover:opacity-90"
              >
                Chơi lại (xáo mới)
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

          {wrongItems.length > 0 && (
            <div className="mt-4 space-y-2">
              <h3 className="font-display text-sm font-semibold text-ink">📌 Các đường đi cần ôn lại</h3>
              {wrongItems.map((w) => (
                <div key={w.id} className="rounded-xl border border-ink/5 bg-white p-3.5 shadow-card">
                  <p className="text-sm font-medium text-ink">{w.goal}</p>
                  <p className="mt-1 font-mono text-xs leading-relaxed text-sea-deep">{w.path.join(" → ")}</p>
                  <p className="mt-1 text-xs leading-relaxed text-ink-soft">{w.explain}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    );
  }

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
            {best !== null && <p className="font-mono text-xs text-ink-soft">kỉ lục {best}%</p>}
          </div>
          <h1 className="mt-3 font-display text-lg font-semibold leading-snug text-ink">
            {game.emoji} {game.title}
          </h1>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">{game.instructions}</p>
        </header>

        <div className="mt-2 font-mono text-[11px] text-ink-soft/60">
          Thử thách {current + 1}/{n}
        </div>

        {/* Mục tiêu thao tác */}
        <div className="mt-2 rounded-2xl border border-ink/5 bg-white p-4 text-center shadow-card">
          <p className="font-mono text-[10px] uppercase tracking-wider text-ink-soft/60">🎯 Mục tiêu</p>
          <p className="mt-1 text-sm font-semibold text-ink">{q.goal}</p>
        </div>

        {/* Chuỗi bước menu cần dựng đúng thứ tự */}
        <ol className="relative ml-2 mt-4 space-y-3 border-l-2 border-dashed border-sea/25 pl-5">
          {placed.map((chip, i) => {
            const isCorrect = checked && chip && chip.correctIndex === i;
            const isWrong = checked && chip && chip.correctIndex !== i;
            return (
              <li key={i} className="relative">
                <span className="absolute -left-[27px] top-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-sea font-mono text-[9px] font-bold text-white shadow-sm">
                  {i + 1}
                </span>
                <div
                  onClick={() => onSlotTap(i)}
                  onDragOver={(e) => {
                    if (!checked && !placed[i]) {
                      e.preventDefault();
                      setDragOverIdx(i);
                    }
                  }}
                  onDragLeave={() => setDragOverIdx((cur) => (cur === i ? null : cur))}
                  onDrop={(e) => {
                    e.preventDefault();
                    onDrop(i);
                  }}
                  className={`flex min-h-[48px] cursor-pointer items-center gap-2 rounded-2xl border-2 p-3 text-sm transition ${
                    isCorrect
                      ? "border-leaf bg-leaf/10 font-medium text-leaf-deep"
                      : isWrong
                        ? "border-berry bg-berry/10 font-medium text-berry"
                        : chip
                          ? "border-sea/40 bg-white font-medium text-ink shadow-card"
                          : dragOverIdx === i
                            ? "border-sea bg-sea/10 border-dashed"
                            : "border-ink/15 border-dashed bg-white/50 text-ink-soft/50"
                  }`}
                >
                  {chip ? chip.label : "Chạm để đặt bước vào đây…"}
                  {checked && (isCorrect ? " ✓" : isWrong ? " ✕" : "")}
                </div>
              </li>
            );
          })}
        </ol>

        {/* Túi thẻ menu — có lẫn bẫy */}
        {!checked && (
          <div className="mt-5">
            <p className="font-mono text-[11px] text-ink-soft/60">
              {pool.length > 0 ? "Chạm chọn 1 thẻ rồi chạm (hoặc kéo) vào đúng vị trí — coi chừng có thẻ bẫy:" : "Đã xếp hết — kiểm tra thôi!"}
            </p>
            <div className="mt-2 flex flex-wrap gap-2.5">
              {pool.map((chip) => (
                <div
                  key={chip.id}
                  draggable
                  onDragStart={() => setSelectedId(chip.id)}
                  onClick={() => toggleSelect(chip.id)}
                  className={`cursor-grab rounded-2xl border-2 bg-white px-3.5 py-2.5 text-sm font-medium text-ink shadow-card transition active:cursor-grabbing ${
                    selectedId === chip.id ? "border-sea bg-sea/10 scale-[1.03]" : "border-ink/10"
                  }`}
                >
                  {chip.label}
                </div>
              ))}
            </div>
          </div>
        )}

        {checked && (
          <div
            className={`mt-4 animate-pop-in rounded-2xl border p-4 text-sm leading-relaxed shadow-card ${
              placed.every((c, i) => c && c.correctIndex === i) ? "border-leaf/30 bg-leaf/10 text-leaf-deep" : "border-berry/30 bg-berry/10 text-berry"
            }`}
          >
            <p className="font-mono text-xs font-bold uppercase tracking-wider">Đường đi đúng</p>
            <p className="mt-1 font-mono text-ink">{q.path.join(" → ")}</p>
            <p className="mt-1 text-ink">{q.explain}</p>
          </div>
        )}

        {!checked ? (
          <button
            onClick={check}
            disabled={!allFilled}
            className={`mt-6 w-full rounded-full px-5 py-3 font-display font-semibold text-white transition ${
              allFilled ? "bg-gradient-to-r from-sea to-coral hover:opacity-90" : "cursor-not-allowed bg-ink/15 text-ink-soft"
            }`}
          >
            Kiểm tra đường đi
          </button>
        ) : (
          <button
            onClick={next}
            className="mt-6 w-full rounded-full bg-gradient-to-r from-sea to-coral px-5 py-3 font-display font-semibold text-white transition hover:opacity-90"
          >
            {current + 1 >= n ? "Xem kết quả" : "Thử thách tiếp theo →"}
          </button>
        )}
      </div>
    </main>
  );
}
