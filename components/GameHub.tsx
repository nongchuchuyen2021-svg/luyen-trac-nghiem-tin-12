"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { LessonGame } from "@/lib/types";
import { getLessonProgress } from "@/lib/progress";
import SortGameClient from "@/components/SortGame";
import TimelineGameClient from "@/components/TimelineGame";
import TopologyGameClient from "@/components/TopologyGame";
import EncapsulationGameClient from "@/components/EncapsulationGame";
import RoutingGameClient from "@/components/RoutingGame";
import MenuPathGameClient from "@/components/MenuPathGame";
import ClassifyGameClient from "@/components/ClassifyGame";
import AiArenaGame from "@/components/AiArenaGame";
import TeamArenaGame from "@/components/TeamArenaGame";
import SummitBattleClient from "@/components/SummitBattleClient";
import { getQuestions } from "@/lib/questions";
import { playClick } from "@/lib/sound";
import type { TeamBattleGame, GroupBattleGame } from "@/lib/types";

export default function GameHub({
  lessonId,
  games: initialGames,
  onBack,
}: {
  lessonId: string;
  games: LessonGame[];
  onBack?: () => void;
}) {
  // Ensure every lesson with questions has access to the Team Battle Arena!
  const games = [...initialGames];
  if (!games.some((g) => g.kind === "team-battle")) {
    const mcqs = getQuestions(lessonId);
    if (mcqs.length >= 4) {
      const autoTeamGame: TeamBattleGame = {
        kind: "team-battle",
        id: `team-battle-${lessonId}`,
        title: "Đấu trường Đại chiến Các Nhóm",
        emoji: "⚔️",
        instructions:
          "Chia lớp thành 2 - 4 nhóm đối kháng trực tiếp trên màn hình máy chiếu! Bấm chuông cướp quyền, rinh cúp vô địch môn Tin học 12!",
        questions: mcqs.map((q) => {
          const order = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
          return {
            id: q.id,
            q: q.q,
            options: order.map((i) => q.options[i]),
            answer: order.indexOf(q.answer),
            explain: q.explain,
            score: 100,
            damage: 25,
          };
        }),
      };
      games.unshift(autoTeamGame);
    }
  }

  const [active, setActive] = useState<LessonGame | null>(games.length === 1 ? games[0] : null);
  const [bestByGame, setBestByGame] = useState<Record<string, number | null>>({});

  useEffect(() => {
    if (active) return;
    const map: Record<string, number | null> = {};
    for (const g of games) {
      if (g.kind === "arena") {
        map[g.id] = getLessonProgress(`${lessonId}:arena:${g.id}`)?.best ?? null;
      } else if (g.kind === "group-battle") {
        map[g.id] = null;
      } else {
        map[g.id] = getLessonProgress(`${lessonId}:game:${g.id}`)?.best ?? null;
      }
    }
    setBestByGame(map);
  }, [active, games, lessonId]);

  if (active) {
    const handleBack = games.length === 1 ? onBack : () => setActive(null);
    if (active.kind === "group-battle") {
      return <SummitBattleClient initialTopic={lessonId} onBack={handleBack} />;
    }
    if (active.kind === "team-battle") {
      return <TeamArenaGame lessonId={lessonId} game={active} onBack={handleBack} />;
    }
    if (active.kind === "sort") {
      return <SortGameClient lessonId={lessonId} game={active} onBack={handleBack} />;
    }
    if (active.kind === "timeline") {
      return <TimelineGameClient lessonId={lessonId} game={active} onBack={handleBack} />;
    }
    if (active.kind === "arena") {
      return <AiArenaGame lessonId={lessonId} game={active} onBack={handleBack} />;
    }
    if (active.kind === "topology") {
      return <TopologyGameClient lessonId={lessonId} game={active} onBack={handleBack} />;
    }
    if (active.kind === "encapsulation") {
      return <EncapsulationGameClient lessonId={lessonId} game={active} onBack={handleBack} />;
    }
    if (active.kind === "routing") {
      return <RoutingGameClient lessonId={lessonId} game={active} onBack={handleBack} />;
    }
    if (active.kind === "menupath") {
      return <MenuPathGameClient lessonId={lessonId} game={active} onBack={handleBack} />;
    }
    return <ClassifyGameClient lessonId={lessonId} game={active} onBack={handleBack} />;
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
        <h1 className="mt-5 font-display text-2xl font-bold text-ink">🎮 Trung tâm Game & Đấu trường</h1>
        <p className="mt-1 text-sm text-ink-soft">Chọn 1 trò để ôn bài theo kiểu vừa học vừa chơi hoặc bước vào Đấu trường AI.</p>

        {/* Banner Đấu trường nhiều máy (Mã PIN) */}
        <Link
          href="/dau-truong"
          className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-cyan-500/40 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-4 text-white shadow-lg transition hover:border-cyan-400 hover:shadow-cyan-500/20"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-2xl">
              🌐
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-sm sm:text-base font-bold text-white">
                  Đấu Trường Nhiều Máy Tính (Mã PIN)
                </span>
                <span className="rounded-full bg-cyan-400/20 border border-cyan-400/40 px-2 py-0.2 font-mono text-[9px] font-bold text-cyan-300">
                  Kahoot Mode
                </span>
              </div>
              <p className="font-mono text-xs text-slate-300">
                Host máy chiếu + Nhiều máy tính học sinh tham gia bằng mã PIN
              </p>
            </div>
          </div>
          <span className="rounded-full border border-cyan-400/40 bg-cyan-500/20 px-3 py-1 font-mono text-xs font-bold text-cyan-300 shrink-0">
            Vào ngay →
          </span>
        </Link>

        <div className="mt-6 space-y-3.5">
          {games.map((g) => {
            const isTeamBattle = g.kind === "team-battle";
            const isArena = g.kind === "arena";
            const desc =
              g.kind === "group-battle"
                ? g.instructions
                : g.kind === "team-battle"
                ? `${g.questions.length} câu hỏi đối kháng · Chia 2 - 4 nhóm · Bấm chuông cướp quyền · Rinh Cúp Vàng!`
                : g.kind === "sort"
                ? `${g.items.length} thẻ · kéo hoặc bấm để phân loại`
                : g.kind === "timeline"
                ? `${g.items.length} mốc · kéo hoặc chạm để sắp xếp`
                : g.kind === "arena"
                ? `${g.waves.length} đợt thử thách · Ổn định hệ thống 100% · Vô hiệu hóa ${g.bossName}`
                : g.kind === "topology"
                ? `${g.nodes.length} thiết bị · ghép hành động vào sơ đồ mạng`
                : g.kind === "encapsulation"
                ? `${g.items.length} mẩu thông tin · xếp đúng lớp đóng gói`
                : g.kind === "routing"
                ? `${g.questions.length} gói tin · chọn đúng cổng theo bảng định tuyến`
                : g.kind === "menupath"
                ? `${g.questions.length} thử thách · ghép đúng đường đi trong menu`
                : `${g.items.length} mẩu · xếp đúng nhóm phân loại`;

            const best = bestByGame[g.id] ?? null;

            if (g.kind === "group-battle") {
              return (
                <button
                  key={g.id}
                  onClick={() => {
                    playClick();
                    setActive(g);
                  }}
                  className="group relative flex w-full flex-col overflow-hidden rounded-3xl border border-amber-500/50 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/40 p-5 sm:p-6 text-left text-white shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:border-amber-400 hover:shadow-amber-500/20"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5 sm:gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-amber-400/40 bg-amber-500/20 text-3xl shadow-inner group-hover:scale-110 transition-transform">
                        {g.emoji}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded bg-amber-500/30 px-1.5 py-0.5 font-mono text-[10px] font-bold text-amber-300">
                            Game Đại Chiến #1
                          </span>
                          <h3 className="font-display text-base sm:text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                            {g.title}
                          </h3>
                          <span className="rounded-full bg-cyan-500/20 border border-cyan-400/40 px-2 py-0.5 font-mono text-[9px] font-bold text-cyan-300">
                            Đấu 2 — 4 Nhóm
                          </span>
                        </div>
                        <p className="mt-1 font-mono text-xs text-slate-300 leading-relaxed">
                          {g.instructions}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right hidden sm:block">
                      <span className="inline-flex items-center gap-1 rounded-xl border border-amber-400/40 bg-amber-500/15 px-3 py-1 font-mono text-xs font-bold text-amber-300">
                        2 — 4 Tổ
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-3 font-mono text-[11px]">
                    <span className="text-slate-400">
                      Thể thức: Máy chiếu lớp học / 2-4 tổ học sinh (Phím tắt 1-4, Q-R, A-F, Z-V hoặc chạm màn hình)
                    </span>
                    <span className="font-bold text-amber-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Khởi tranh leo đỉnh →
                    </span>
                  </div>
                </button>
              );
            }

            if (isTeamBattle) {
              return (
                <button
                  key={g.id}
                  onClick={() => setActive(g)}
                  className="group relative flex w-full items-center gap-4 overflow-hidden rounded-3xl border border-indigo-500/50 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 p-5 text-left text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400 hover:shadow-2xl hover:shadow-indigo-900/40"
                >
                  <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-indigo-500/25 blur-2xl transition group-hover:bg-indigo-500/35" />
                  <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-indigo-400/40 bg-indigo-900/50 text-3xl shadow-inner">
                    {g.emoji}
                  </span>
                  <span className="relative min-w-0 flex-1">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-400/50 bg-indigo-500/25 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                      <span className="h-1.5 w-1.5 animate-ping rounded-full bg-cyan-400" />
                      ĐẤU TRƯỜNG ĐỐI KHÁNG CÁC NHÓM 👥
                    </span>
                    <span className="mt-1 block font-display text-lg font-bold text-white group-hover:text-cyan-200">
                      {g.title}
                    </span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-slate-300">
                      {desc}
                    </span>
                  </span>
                  <span className="relative shrink-0 rounded-full border border-cyan-400/40 bg-gradient-to-r from-cyan-500 to-indigo-600 px-4 py-2 font-mono text-xs font-bold text-white shadow-lg shadow-cyan-500/20 transition group-hover:scale-105">
                    VÀO ĐẤU NHÓM ⚔️
                  </span>
                </button>
              );
            }

            if (isArena) {
              return (
                <button
                  key={g.id}
                  onClick={() => setActive(g)}
                  className="group relative flex w-full items-center gap-4 overflow-hidden rounded-3xl border border-cyan-500/40 bg-gradient-to-r from-slate-950 via-teal-950 to-slate-900 p-5 text-left text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-900/40"
                >
                  <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-cyan-600/20 blur-2xl transition group-hover:bg-cyan-600/30" />
                  <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-500/30 bg-teal-900/40 text-3xl shadow-inner">
                    {g.emoji}
                  </span>
                  <span className="relative min-w-0 flex-1">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/40 bg-cyan-500/20 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
                      ĐẤU TRƯỜNG ĐẶC BIỆT
                    </span>
                    <span className="mt-1 block font-display text-lg font-bold text-white group-hover:text-cyan-200">
                      {g.title}
                    </span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-slate-300">
                      {desc}
                    </span>
                  </span>
                  {best !== null ? (
                    <span className="relative shrink-0 rounded-full border border-amber-500/30 bg-amber-500/20 px-3 py-1 font-mono text-xs font-bold text-amber-300">
                      🏆 {best}đ
                    </span>
                  ) : (
                    <span className="relative shrink-0 rounded-full border border-cyan-500/30 bg-cyan-500/20 px-3 py-1 font-mono text-xs font-bold text-cyan-300 transition group-hover:scale-105">
                      VÀO ĐẤU ⚔️
                    </span>
                  )}
                </button>
              );
            }

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
                <span className="shrink-0 text-ink-soft/40 transition group-hover:translate-x-0.5 group-hover:text-sea">
                  →
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}
