"use client";

import { useEffect, useState } from "react";
import type { ClassifyGame, ClassifyItem } from "@/lib/types";
import { getLessonProgress, saveAttempt } from "@/lib/progress";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const CARD_COLORS = [
  { border: "border-sea/50", bg: "bg-sea/5", text: "text-sea-deep" },
  { border: "border-coral/50", bg: "bg-coral/5", text: "text-coral" },
  { border: "border-leaf/50", bg: "bg-leaf/5", text: "text-leaf-deep" },
  { border: "border-gold/50", bg: "bg-gold/5", text: "text-gold-deep" },
  { border: "border-purple-500/40", bg: "bg-purple-500/5", text: "text-purple-700" },
  { border: "border-pink-400/40", bg: "bg-pink-400/5", text: "text-pink-700" },
];

type PlacedMap = Record<string, ClassifyItem[]>;

export default function ClassifyGameClient({
  lessonId,
  game,
  onBack,
}: {
  lessonId: string;
  game: ClassifyGame;
  onBack?: () => void;
}) {
  const progressKey = `${lessonId}:game:${game.id}`;
  const total = game.items.length;

  const [pool, setPool] = useState<ClassifyItem[]>([]);
  const [placed, setPlaced] = useState<PlacedMap>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [best, setBest] = useState<number | null>(null);

  function emptyPlaced(): PlacedMap {
    const m: PlacedMap = {};
    for (const c of game.categories) m[c.id] = [];
    return m;
  }

  function setup() {
    setPool(shuffle(game.items));
    setPlaced(emptyPlaced());
    setSelectedId(null);
    setChecked(false);
  }

  useEffect(() => {
    setup();
    setBest(getLessonProgress(progressKey)?.best ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game, lessonId]);

  const allPlaced = pool.length === 0;
  const correctCount = checked
    ? game.categories.reduce((acc, c) => acc + placed[c.id].filter((it) => it.categoryId === c.id).length, 0)
    : 0;
  const scorePercent = Math.round((correctCount / total) * 100);
  const wrongItems = checked
    ? game.categories.flatMap((c) => placed[c.id].filter((it) => it.categoryId !== c.id))
    : [];

  function toggleSelect(id: string) {
    if (checked) return;
    setSelectedId((cur) => (cur === id ? null : id));
  }

  function assignTo(categoryId: string) {
    if (checked || !selectedId) return;
    const chip = pool.find((c) => c.id === selectedId);
    if (!chip) return;
    setPool((prev) => prev.filter((c) => c.id !== chip.id));
    setPlaced((prev) => ({ ...prev, [categoryId]: [...prev[categoryId], chip] }));
    setSelectedId(null);
  }

  function unassign(categoryId: string, itemId: string) {
    if (checked) return;
    const chip = placed[categoryId].find((c) => c.id === itemId);
    if (!chip) return;
    setPlaced((prev) => ({ ...prev, [categoryId]: prev[categoryId].filter((c) => c.id !== itemId) }));
    setPool((prev) => [...prev, chip]);
  }

  function check() {
    if (!allPlaced) return;
    setChecked(true);
    const correct = game.categories.reduce((acc, c) => acc + placed[c.id].filter((it) => it.categoryId === c.id).length, 0);
    saveAttempt(progressKey, Math.round((correct / total) * 100));
  }

  function chipClass(categoryId: string, item: ClassifyItem): string {
    if (!checked) return "border-ink/15 bg-white text-ink hover:border-sea/40";
    return item.categoryId === categoryId ? "border-leaf bg-leaf/10 text-leaf-deep" : "border-berry bg-berry/10 text-berry";
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

        {checked && (
          <div className="mt-4 animate-pop-in rounded-2xl border border-ink/5 bg-white p-4 text-center shadow-card">
            <p className="text-3xl">{scorePercent === 100 ? "🎉" : scorePercent >= 60 ? "💪" : "📖"}</p>
            <p className="mt-1 font-display text-lg font-bold text-ink">
              {correctCount}/{total} đúng nhóm · {scorePercent}%
            </p>
            {best !== null && scorePercent > best && (
              <p className="mt-1 font-mono text-xs font-medium text-leaf">🚀 Kỉ lục mới! (trước đó: {best}%)</p>
            )}
            <div className="mt-3 flex flex-wrap justify-center gap-3">
              <button
                onClick={setup}
                className="rounded-full bg-gradient-to-r from-sea to-coral px-5 py-2 font-medium text-white shadow-card transition hover:opacity-90"
              >
                🔄 Làm lại (xáo mới)
              </button>
              {onBack && (
                <button
                  onClick={onBack}
                  className="rounded-full border border-ink/10 bg-white px-5 py-2 font-medium text-ink-soft transition hover:border-sea/40 hover:text-sea-deep"
                >
                  ← Chọn phần khác
                </button>
              )}
            </div>
          </div>
        )}

        {/* Lưới các nhóm phân loại, song song (không lồng nhau) */}
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {game.categories.map((cat, i) => {
            const c = CARD_COLORS[i % CARD_COLORS.length];
            return (
              <div key={cat.id} className={`rounded-2xl border-2 ${c.border} ${c.bg} p-3.5`}>
                <button onClick={() => assignTo(cat.id)} disabled={checked} className="w-full text-left">
                  <p className={`font-mono text-[10px] font-bold uppercase tracking-wider ${c.text}`}>
                    {cat.emoji} {cat.name}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-ink-soft">{cat.subtitle}</p>
                </button>
                {placed[cat.id]?.length > 0 && (
                  <div className="mt-2 flex flex-col gap-1.5">
                    {placed[cat.id].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => unassign(cat.id, item.id)}
                        disabled={checked}
                        className={`rounded-xl border-2 px-2.5 py-1.5 text-left text-xs font-medium transition ${chipClass(cat.id, item)}`}
                      >
                        {item.label}
                        {checked && item.categoryId !== cat.id && (
                          <span className="ml-1 font-mono text-[10px] opacity-80">
                            (đúng: {game.categories.find((c2) => c2.id === item.categoryId)?.name})
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Túi thẻ chưa xếp */}
        {!checked && (
          <div className="mt-5">
            <p className="font-mono text-[11px] text-ink-soft/60">
              {pool.length > 0 ? "Chạm chọn 1 thẻ rồi chạm vào đúng nhóm bên trên:" : "Đã xếp hết — kiểm tra thôi!"}
            </p>
            <div className="mt-2 flex flex-wrap gap-2.5">
              {pool.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleSelect(item.id)}
                  className={`rounded-2xl border-2 bg-white px-3.5 py-2.5 text-left text-sm font-medium text-ink shadow-card transition ${
                    selectedId === item.id ? "border-sea bg-sea/10 scale-[1.03]" : "border-ink/10"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {checked && wrongItems.length > 0 && (
          <div className="mt-4 space-y-2">
            <h3 className="font-display text-sm font-semibold text-ink">📌 Các mẩu cần ôn lại</h3>
            {wrongItems.map((it) => (
              <div key={it.id} className="rounded-xl border border-ink/5 bg-white p-3.5 shadow-card">
                <p className="text-sm font-medium text-ink">{it.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-ink-soft">{it.explain}</p>
              </div>
            ))}
          </div>
        )}

        {!checked && (
          <button
            onClick={check}
            disabled={!allPlaced}
            className={`mt-6 w-full rounded-full px-5 py-3 font-display font-semibold text-white transition ${
              allPlaced ? "bg-gradient-to-r from-sea to-coral hover:opacity-90" : "cursor-not-allowed bg-ink/15 text-ink-soft"
            }`}
          >
            Kiểm tra cách phân loại
          </button>
        )}
      </div>
    </main>
  );
}
