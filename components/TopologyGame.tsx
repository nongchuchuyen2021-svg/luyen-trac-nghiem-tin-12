"use client";

import { useEffect, useState } from "react";
import type { TopologyGame, TopologyNode } from "@/lib/types";
import { getLessonProgress, saveAttempt } from "@/lib/progress";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type PlacedState = (TopologyNode | null)[];

export default function TopologyGameClient({
  lessonId,
  game,
  onBack,
}: {
  lessonId: string;
  game: TopologyGame;
  onBack?: () => void;
}) {
  const progressKey = `${lessonId}:game:${game.id}`;
  const n = game.nodes.length;

  const [pool, setPool] = useState<TopologyNode[]>([]);
  const [placed, setPlaced] = useState<PlacedState>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [best, setBest] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  function setup() {
    setPool(shuffle(game.nodes));
    setPlaced(new Array(n).fill(null));
    setSelectedId(null);
    setChecked(false);
  }

  useEffect(() => {
    setup();
    setBest(getLessonProgress(progressKey)?.best ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game, lessonId]);

  const allFilled = placed.every((s) => s !== null);
  const correctCount = checked
    ? placed.reduce((acc, s, i) => acc + (s && s.id === game.nodes[i].id ? 1 : 0), 0)
    : 0;
  const scorePercent = Math.round((correctCount / n) * 100);

  function placeAtNode(card: TopologyNode, idx: number) {
    if (checked || placed[idx] !== null) return;
    setPlaced((prev) => {
      const next = [...prev];
      next[idx] = card;
      return next;
    });
    setPool((prev) => prev.filter((p) => p.id !== card.id));
    setSelectedId(null);
  }

  function returnToPool(idx: number) {
    if (checked) return;
    const card = placed[idx];
    if (!card) return;
    setPlaced((prev) => {
      const next = [...prev];
      next[idx] = null;
      return next;
    });
    setPool((prev) => [...prev, card]);
  }

  function onCardTap(card: TopologyNode) {
    if (checked) return;
    setSelectedId((id) => (id === card.id ? null : card.id));
  }

  function onNodeTap(idx: number) {
    if (checked) return;
    if (placed[idx]) {
      returnToPool(idx);
      return;
    }
    const card = pool.find((p) => p.id === selectedId);
    if (card) placeAtNode(card, idx);
  }

  function onDrop(idx: number) {
    setDragOverIdx(null);
    if (checked || placed[idx] !== null || !selectedId) return;
    const card = pool.find((p) => p.id === selectedId);
    if (card) placeAtNode(card, idx);
  }

  function check() {
    if (!allFilled) return;
    setChecked(true);
    const correct = placed.reduce((acc, s, i) => acc + (s && s.id === game.nodes[i].id ? 1 : 0), 0);
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

        {/* Sơ đồ mạng: chuỗi thiết bị cố định đúng thứ tự vật lí, học sinh ghép
            thẻ hành động vào đúng thiết bị (không phải đoán thứ tự trước/sau) */}
        <ol className="relative ml-2 mt-6 space-y-4 border-l-2 border-dashed border-sea/25 pl-5">
          {game.nodes.map((node, i) => {
            const s = placed[i];
            const isCorrect = checked && s && s.id === node.id;
            const isWrong = checked && s && s.id !== node.id;
            return (
              <li key={node.id} className="relative">
                <span className="absolute -left-[27px] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-sea shadow-sm" />

                {/* Nhãn thiết bị — LUÔN hiển thị cố định, đây chính là sơ đồ mạng */}
                <div className="mb-1.5 flex items-center gap-2">
                  <span className="text-lg leading-none">{node.emoji}</span>
                  <span className="inline-flex items-center rounded-full bg-sea/15 px-2.5 py-0.5 font-mono text-xs font-bold text-sea-deep">
                    {node.node}
                  </span>
                </div>

                {/* Ô thả thẻ hành động */}
                <div
                  onClick={() => onNodeTap(i)}
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
                  className={`flex min-h-[56px] cursor-pointer items-center gap-3 rounded-2xl border-2 p-3.5 transition ${
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
                  {s ? (
                    <>
                      <span className="min-w-0 flex-1 text-sm font-medium text-ink">{s.action}</span>
                      {!checked && <span className="shrink-0 text-ink-soft/40">✕</span>}
                      {checked && (
                        <span className={`shrink-0 font-mono text-xs font-bold ${isCorrect ? "text-leaf-deep" : "text-berry"}`}>
                          {isCorrect ? "✓" : "✕"}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-sm text-ink-soft/50">Chạm để đặt hành động vào đây…</span>
                  )}
                </div>

                {checked && isWrong && (
                  <p className="mt-1.5 text-xs leading-relaxed text-berry">
                    Đúng ra thiết bị này phải là: <span className="font-medium">{node.action}</span>
                  </p>
                )}
              </li>
            );
          })}

          {/* Đích đến cuối cùng — chỉ trang trí, khép kín sơ đồ, không phải ô thả thẻ */}
          {game.endLabel && (
            <li className="relative">
              <span className="absolute -left-[27px] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-leaf shadow-sm" />
              <div className="inline-flex items-center gap-2 rounded-full bg-leaf/10 px-3 py-1.5 font-mono text-xs font-bold text-leaf-deep">
                {game.endLabel}
              </div>
            </li>
          )}
        </ol>

        {/* Thẻ hành động chưa xếp */}
        {!checked && (
          <div className="mt-6">
            <p className="font-mono text-[11px] text-ink-soft/60">
              {pool.length > 0
                ? "Chạm chọn 1 thẻ rồi chạm (hoặc kéo) vào đúng thiết bị trên sơ đồ:"
                : "Đã xếp hết — kiểm tra thôi!"}
            </p>
            <div className="mt-2 flex flex-wrap gap-2.5">
              {pool.map((card) => (
                <div
                  key={card.id}
                  draggable
                  onDragStart={() => setSelectedId(card.id)}
                  onClick={() => onCardTap(card)}
                  className={`flex cursor-grab items-center gap-2 rounded-2xl border-2 bg-white px-3.5 py-2.5 text-sm font-medium text-ink shadow-card transition active:cursor-grabbing ${
                    selectedId === card.id ? "border-sea bg-sea/10 scale-[1.03]" : "border-ink/10"
                  }`}
                >
                  <span className="text-lg">{card.emoji}</span>
                  {card.action}
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
            Kiểm tra sơ đồ
          </button>
        ) : (
          <div className="mt-6 animate-pop-in space-y-4">
            <div className="rounded-2xl border border-ink/5 bg-white p-5 text-center shadow-card">
              <p className="text-4xl">{scorePercent === 100 ? "🎉" : scorePercent >= 60 ? "💪" : "📖"}</p>
              <h2 className="mt-2 font-display text-xl font-bold text-ink">
                {correctCount}/{n} đúng thiết bị · {scorePercent}%
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
              <h3 className="font-display text-sm font-semibold text-ink">📌 Sơ đồ đầy đủ, đúng từng thiết bị</h3>
              <ul className="mt-2 space-y-2">
                {game.nodes.map((it) => (
                  <li key={it.id} className="rounded-xl border border-ink/5 bg-white p-3.5 shadow-card">
                    <p className="text-sm font-medium text-ink">
                      {it.emoji} <span className="font-mono text-xs text-sea-deep">{it.node}</span> — {it.action}
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
