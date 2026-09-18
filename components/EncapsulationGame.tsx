"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { EncapsulationGame, EncapsulationItem, EncapsulationLayerId } from "@/lib/types";
import { getLessonProgress, saveAttempt } from "@/lib/progress";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const LAYER_COLOR: Record<EncapsulationLayerId, { border: string; bg: string; text: string; ring: string }> = {
  ethernet: { border: "border-coral/50", bg: "bg-coral/5", text: "text-coral", ring: "border-coral" },
  ip: { border: "border-sea/50", bg: "bg-sea/5", text: "text-sea-deep", ring: "border-sea" },
  tcp: { border: "border-leaf/50", bg: "bg-leaf/5", text: "text-leaf-deep", ring: "border-leaf" },
};

type PlacedMap = Record<EncapsulationLayerId, EncapsulationItem[]>;

function emptyPlaced(): PlacedMap {
  return { ethernet: [], ip: [], tcp: [] };
}

export default function EncapsulationGameClient({
  lessonId,
  game,
  onBack,
}: {
  lessonId: string;
  game: EncapsulationGame;
  onBack?: () => void;
}) {
  const progressKey = `${lessonId}:game:${game.id}`;
  const total = game.items.length;

  const [pool, setPool] = useState<EncapsulationItem[]>([]);
  const [placed, setPlaced] = useState<PlacedMap>(emptyPlaced());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [best, setBest] = useState<number | null>(null);

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
    ? (Object.keys(placed) as EncapsulationLayerId[]).reduce(
        (acc, lid) => acc + placed[lid].filter((it) => it.layerId === lid).length,
        0
      )
    : 0;
  const scorePercent = Math.round((correctCount / total) * 100);
  const wrongItems = checked
    ? (Object.keys(placed) as EncapsulationLayerId[]).flatMap((lid) => placed[lid].filter((it) => it.layerId !== lid))
    : [];

  function toggleSelect(id: string) {
    if (checked) return;
    setSelectedId((cur) => (cur === id ? null : id));
  }

  function assignTo(layerId: EncapsulationLayerId) {
    if (checked || !selectedId) return;
    const chip = pool.find((c) => c.id === selectedId);
    if (!chip) return;
    setPool((prev) => prev.filter((c) => c.id !== chip.id));
    setPlaced((prev) => ({ ...prev, [layerId]: [...prev[layerId], chip] }));
    setSelectedId(null);
  }

  function unassign(layerId: EncapsulationLayerId, itemId: string) {
    if (checked) return;
    const chip = placed[layerId].find((c) => c.id === itemId);
    if (!chip) return;
    setPlaced((prev) => ({ ...prev, [layerId]: prev[layerId].filter((c) => c.id !== itemId) }));
    setPool((prev) => [...prev, chip]);
  }

  function check() {
    if (!allPlaced) return;
    setChecked(true);
    const correct = (Object.keys(placed) as EncapsulationLayerId[]).reduce(
      (acc, lid) => acc + placed[lid].filter((it) => it.layerId === lid).length,
      0
    );
    saveAttempt(progressKey, Math.round((correct / total) * 100));
  }

  function chipClass(layerId: EncapsulationLayerId, item: EncapsulationItem): string {
    if (!checked) return "border-ink/15 bg-white text-ink hover:border-sea/40";
    return item.layerId === layerId ? "border-leaf bg-leaf/10 text-leaf-deep" : "border-berry bg-berry/10 text-berry";
  }

  const [ethernet, ip, tcp] = game.layers;

  function LayerBox({
    layer,
    children,
  }: {
    layer: (typeof game.layers)[number];
    children?: ReactNode;
  }) {
    const c = LAYER_COLOR[layer.id];
    return (
      <div className={`rounded-2xl border-2 ${c.border} ${c.bg} p-3 sm:p-4`}>
        <button
          onClick={() => assignTo(layer.id)}
          disabled={checked}
          className="w-full text-left"
        >
          <p className={`font-mono text-[10px] font-bold uppercase tracking-wider ${c.text}`}>
            {layer.emoji} {layer.name}
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-ink-soft">{layer.subtitle}</p>
        </button>

        {placed[layer.id].length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {placed[layer.id].map((item) => (
              <button
                key={item.id}
                onClick={() => unassign(layer.id, item.id)}
                disabled={checked}
                className={`rounded-xl border-2 px-2.5 py-1.5 text-left text-xs font-medium transition ${chipClass(layer.id, item)}`}
              >
                {item.label}
                {checked && item.layerId !== layer.id && (
                  <span className="ml-1 font-mono text-[10px] opacity-80">
                    (đúng: {game.layers.find((l) => l.id === item.layerId)?.name})
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        <div className="mt-3">{children}</div>
      </div>
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

        {/* Kết quả sau khi kiểm tra */}
        {checked && (
          <div className="mt-4 animate-pop-in rounded-2xl border border-ink/5 bg-white p-4 text-center shadow-card">
            <p className="text-3xl">{scorePercent === 100 ? "🎉" : scorePercent >= 60 ? "💪" : "📖"}</p>
            <p className="mt-1 font-display text-lg font-bold text-ink">
              {correctCount}/{total} đúng lớp · {scorePercent}%
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

        {/* Sơ đồ phong bì lồng nhau: Ethernet ⊃ IP ⊃ TCP ⊃ Dữ liệu */}
        <div className="mt-4">
          <LayerBox layer={ethernet}>
            <LayerBox layer={ip}>
              <LayerBox layer={tcp}>
                <div className="rounded-xl border-2 border-dashed border-ink/15 bg-white/60 px-3 py-2 text-center font-mono text-xs text-ink-soft/70">
                  ✉️ {game.dataLabel}
                </div>
              </LayerBox>
            </LayerBox>
          </LayerBox>
        </div>

        {/* Túi thẻ thông tin chưa xếp */}
        {!checked && (
          <div className="mt-5">
            <p className="font-mono text-[11px] text-ink-soft/60">
              {pool.length > 0
                ? "Chạm chọn 1 thẻ rồi chạm vào đúng lớp phụ trách bên trên:"
                : "Đã xếp hết — kiểm tra thôi!"}
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

        {/* Giải thích các thẻ đặt sai */}
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
            Kiểm tra cách đóng gói
          </button>
        )}
      </div>
    </main>
  );
}
