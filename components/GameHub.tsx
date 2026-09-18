"use client";

import { useEffect, useState } from "react";
import type { LessonGame } from "@/lib/types";
import { getLessonProgress } from "@/lib/progress";
import SortGameClient from "@/components/SortGame";
import TimelineGameClient from "@/components/TimelineGame";
import TopologyGameClient from "@/components/TopologyGame";
import BinaryIPGameClient from "@/components/BinaryIPGame";
import RoutingGameClient from "@/components/RoutingGame";

export default function GameHub({
  lessonId,
  games,
  onBack,
}: {
  lessonId: string;
  games: LessonGame[];
  onBack?: () => void;
}) {
  const [active, setActive] = useState<LessonGame | null>(games.length === 1 ? games[0] : null);
  const [bestByGame, setBestByGame] = useState<Record<string, number | null>>({});

  useEffect(() => {
    if (active) return;
    const map: Record<string, number | null> = {};
    for (const g of games) {
      map[g.id] = getLessonProgress(`${lessonId}:game:${g.id}`)?.best ?? null;
    }
    setBestByGame(map);
  }, [active, games, lessonId]);

  if (active) {
    // Nếu bài chỉ có đúng 1 game thì màn chọn game không hiện — "Quay lại" đi
    // thẳng ra ngoài luôn. Nếu có nhiều game thì "Quay lại" về màn chọn trước.
    const handleBack = games.length === 1 ? onBack : () => setActive(null);
    if (active.kind === "sort") {
      return <SortGameClient lessonId={lessonId} game={active} onBack={handleBack} />;
    }
    if (active.kind === "timeline") {
      return <TimelineGameClient lessonId={lessonId} game={active} onBack={handleBack} />;
    }
    if (active.kind === "topology") {
      return <TopologyGameClient lessonId={lessonId} game={active} onBack={handleBack} />;
    }
    if (active.kind === "binary") {
      return <BinaryIPGameClient lessonId={lessonId} game={active} onBack={handleBack} />;
    }
    return <RoutingGameClient lessonId={lessonId} game={active} onBack={handleBack} />;
  }

  return (
    <main className="playground min-h-screen pb-16">
      <div className="mx-auto max-w-2xl px-5 pt-10 sm:px-8">
        {onBack && (
          <button
            onClick={onBack}
            className="rounded-full border border-ink/10 bg-white px-3 py-1.5 font-mono text-xs text-ink-soft transition hover:border-sea/40 hover:text-sea-deep"
          >
            ← Quay lại
          </button>
        )}
        <h1 className="mt-5 font-display text-xl font-bold text-ink">🎮 Trung tâm Game</h1>
        <p className="mt-1 text-sm text-ink-soft">Chọn 1 trò để ôn bài theo kiểu vừa học vừa chơi.</p>

        <div className="mt-6 space-y-3">
          {games.map((g) => {
            const desc =
              g.kind === "sort"
                ? `${g.items.length} thẻ · kéo hoặc bấm để phân loại`
                : g.kind === "timeline"
                ? `${g.items.length} mốc · kéo hoặc chạm để sắp xếp`
                : g.kind === "topology"
                ? `${g.nodes.length} thiết bị · ghép hành động vào sơ đồ mạng`
                : g.kind === "binary"
                ? `${g.questions.length} địa chỉ · gõ số đổi nhị phân sang thập phân`
                : `${g.questions.length} gói tin · chọn đúng cổng theo bảng định tuyến`;
            const best = bestByGame[g.id] ?? null;
            return (
              <button
                key={g.id}
                onClick={() => setActive(g)}
                className="group flex w-full items-center gap-4 rounded-2xl border border-ink/5 bg-white p-5 text-left shadow-card transition hover:-translate-y-0.5 hover:border-sea/30 hover:shadow-card-hover"
              >
                <span className="text-3xl">{g.emoji}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-base font-semibold text-ink group-hover:text-sea-deep">
                    {g.title}
                  </span>
                  <span className="mt-0.5 block text-sm text-ink-soft">{desc}</span>
                </span>
                {best !== null && (
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 font-mono text-xs font-medium ${
                      best >= 80 ? "bg-leaf/15 text-leaf" : best >= 50 ? "bg-gold/15 text-gold" : "bg-berry/10 text-berry"
                    }`}
                  >
                    {best >= 80 ? "⭐ " : ""}
                    {best}%
                  </span>
                )}
                <span className="shrink-0 text-ink-soft/40 transition group-hover:translate-x-0.5 group-hover:text-sea">→</span>
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}
