"use client";

import { useEffect, useState } from "react";
import type { TimelineGame, TimelineItem } from "@/lib/types";
import { getLessonProgress, saveAttempt } from "@/lib/progress";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type SlotState = (TimelineItem | null)[];

export default function TimelineGameClient({
  lessonId,
  game,
  onBack,
}: {
  lessonId: string;
  game: TimelineGame;
  onBack?: () => void;
}) {
  const progressKey = `${lessonId}:game:${game.id}`;
  const n = game.items.length;

  const [pool, setPool] = useState<TimelineItem[]>([]);
  const [slots, setSlots] = useState<SlotState>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [best, setBest] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  function setup() {
    setPool(shuffle(game.items));
    setSlots(new Array(n).fill(null));
    setSelectedId(null);
    setChecked(false);
  }

  useEffect(() => {
    setup();
    setBest(getLessonProgress(progressKey)?.best ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game, lessonId]);

  const allFilled = slots.every((s) => s !== null);
  const correctCount = checked
    ? slots.reduce((acc, s, i) => acc + (s && s.id === game.items[i].id ? 1 : 0), 0)
    : 0;
  const scorePercent = Math.round((correctCount / n) * 100);

  function placeInSlot(item: TimelineItem, slotIdx: number) {
    if (checked || slots[slotIdx] !== null) return;
    setSlots((prev) => {
      const next = [...prev];
      next[slotIdx] = item;
      return next;
    });
    setPool((prev) => prev.filter((p) => p.id !== item.id));
    setSelectedId(null);
  }

  function returnToPool(slotIdx: number) {
    if (checked) return;
    const item = slots[slotIdx];
    if (!item) return;
    setSlots((prev) => {
      const next = [...prev];
      next[slotIdx] = null;
      return next;
    });
    setPool((prev) => [...prev, item]);
  }

  function onCardTap(item: TimelineItem) {
    if (checked) return;
    setSelectedId((id) => (id === item.id ? null : item.id));
  }

  function onSlotTap(idx: number) {
    if (checked) return;
    if (slots[idx]) {
      returnToPool(idx);
      return;
    }
    const item = pool.find((p) => p.id === selectedId);
    if (item) placeInSlot(item, idx);
  }

  function onDrop(idx: number) {
    setDragOverIdx(null);
    if (checked || slots[idx] !== null || !selectedId) return;
    const item = pool.find((p) => p.id === selectedId);
    if (item) placeInSlot(item, idx);
  }

  function check() {
    if (!allFilled) return;
    setChecked(true);
    const correct = slots.reduce((acc, s, i) => acc + (s && s.id === game.items[i].id ? 1 : 0), 0);
    const percent = Math.round((correct / n) * 100);
    saveAttempt(progressKey, percent);
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

        {/* 5 ô theo thứ tự thời gian */}
        <div className="mt-6 space-y-2.5">
          <div className="flex items-center justify-between font-mono text-[11px] text-ink-soft/60">
            <span>⏪ Sớm nhất</span>
            <span>Gần đây nhất ⏩</span>
          </div>
          {slots.map((s, i) => {
            const isCorrect = checked && s && s.id === game.items[i].id;
            const isWrong = checked && s && s.id !== game.items[i].id;
            return (
              <div
                key={i}
                onClick={() => onSlotTap(i)}
                onDragOver={(e) => {
                  if (!checked && !slots[i]) {
                    e.preventDefault();
                    setDragOverIdx(i);
                  }
                }}
                onDragLeave={() => setDragOverIdx((cur) => (cur === i ? null : cur))}
                onDrop={(e) => {
                  e.preventDefault();
                  onDrop(i);
                }}
                className={`flex min-h-[64px] cursor-pointer items-center gap-3 rounded-2xl border-2 p-3.5 transition ${
                  isCorrect
                    ? "border-leaf bg-leaf/10"
                    : isWrong
                      ? "border-berry bg-berry/10"
                      : s
                        ? "border-sea/40 bg-white shadow-card"
                        : dragOverIdx === i
                          ? "border-sea bg-sea/10 border-dashed"
                          : "border-ink/15 border-dashed bg-white/50"
                }`}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink/5 font-mono text-xs font-bold text-ink-soft">
                  {i + 1}
                </span>
                {s ? (
                  <>
                    <span className="text-xl">{s.emoji}</span>
                    <span className="min-w-0 flex-1 text-sm font-medium text-ink">{s.label}</span>
                    {checked && (
                      <span className={`shrink-0 font-mono text-xs font-bold ${isCorrect ? "text-leaf-deep" : "text-berry"}`}>
                        {s.year}
                      </span>
                    )}
                    {!checked && <span className="shrink-0 text-ink-soft/40">✕</span>}
                  </>
                ) : (
                  <span className="text-sm text-ink-soft/50">Chạm để đặt thẻ vào đây…</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Thẻ chưa xếp */}
        {!checked && (
          <div className="mt-6">
            <p className="font-mono text-[11px] text-ink-soft/60">
              {pool.length > 0 ? "Chạm chọn 1 thẻ rồi chạm (hoặc kéo) vào ô muốn đặt:" : "Đã xếp hết — kiểm tra thôi!"}
            </p>
            <div className="mt-2 flex flex-wrap gap-2.5">
              {pool.map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={() => setSelectedId(item.id)}
                  onClick={() => onCardTap(item)}
                  className={`flex cursor-grab items-center gap-2 rounded-2xl border-2 bg-white px-3.5 py-2.5 text-sm font-medium text-ink shadow-card transition active:cursor-grabbing ${
                    selectedId === item.id ? "border-sea bg-sea/10 scale-[1.03]" : "border-ink/10"
                  }`}
                >
                  <span className="text-lg">{item.emoji}</span>
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nút kiểm tra / kết quả */}
        {!checked ? (
          <button
            onClick={check}
            disabled={!allFilled}
            className={`mt-6 w-full rounded-full px-5 py-3 font-display font-semibold text-white transition ${
              allFilled
                ? "bg-gradient-to-r from-sea to-coral hover:opacity-90"
                : "cursor-not-allowed bg-ink/15 text-ink-soft"
            }`}
          >
            Kiểm tra thứ tự
          </button>
        ) : (
          <div className="mt-6 animate-pop-in space-y-4">
            <div className="rounded-2xl border border-ink/5 bg-white p-5 text-center shadow-card">
              <p className="text-4xl">{scorePercent === 100 ? "🎉" : scorePercent >= 60 ? "💪" : "📖"}</p>
              <h2 className="mt-2 font-display text-xl font-bold text-ink">
                {correctCount}/{n} đúng vị trí · {scorePercent}%
              </h2>
              {best !== null && scorePercent > best && (
                <p className="mt-1 font-mono text-sm font-medium text-leaf">🚀 Kỉ lục mới! (trước đó: {best}%)</p>
              )}
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <button
                  onClick={setup}
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

            <div>
              <h3 className="font-display text-sm font-semibold text-ink">📌 Thứ tự đúng đầy đủ</h3>
              <ul className="mt-2 space-y-2">
                {game.items.map((it) => (
                  <li key={it.id} className="rounded-xl border border-ink/5 bg-white p-3.5 shadow-card">
                    <p className="text-sm font-medium text-ink">
                      {it.emoji} {it.label} <span className="font-mono text-xs text-sea-deep">· {it.year}</span>
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-ink-soft">{it.explain}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
