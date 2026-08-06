"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CURRICULUM } from "@/data/curriculum";
import { getQuestions } from "@/lib/questions";
import { hasTheory } from "@/lib/theory";
import { getProgress } from "@/lib/progress";
import type { ProgressMap } from "@/lib/types";

function ScoreBadge({ best }: { best: number }) {
  if (best >= 80) {
    return (
      <span className="rounded-full bg-leaf/15 px-2.5 py-1 font-mono text-xs font-medium text-leaf-deep">
        ⭐ {best}%
      </span>
    );
  }
  if (best >= 50) {
    return (
      <span className="rounded-full bg-gold/15 px-2.5 py-1 font-mono text-xs font-medium text-gold-deep">
        {best}%
      </span>
    );
  }
  return (
    <span className="rounded-full bg-berry/10 px-2.5 py-1 font-mono text-xs font-medium text-berry">
      {best}%
    </span>
  );
}

export default function HomeClient() {
  const [progress, setProgress] = useState<ProgressMap>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setProgress(getProgress());
    setLoaded(true);
  }, []);

  const availableLessons = CURRICULUM.flatMap((t) => t.lessons).filter((l) => l.available);
  const doneCount = availableLessons.filter((l) => (progress[l.id]?.best ?? 0) >= 80).length;

  return (
    <main className="playground min-h-screen pb-16">
      <div className="mx-auto max-w-3xl px-5 pt-12 sm:px-8">
        <header className="text-center">
          <p className="inline-block rounded-full bg-gradient-to-r from-sea to-coral px-5 py-2 font-display text-base font-semibold text-white shadow-card sm:px-6 sm:py-2.5 sm:text-xl">
            🏫 Trường THPT Na Rì - Tỉnh Thái Nguyên
          </p>
          <p className="mt-5 text-5xl">📚✨</p>
          <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">
            Ôn luyện{" "}
            <span className="bg-gradient-to-r from-sea to-coral bg-clip-text text-transparent">
              Tin học 12
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-ink-soft">
            Chọn bài để luyện — làm đến đâu chấm đến đó, có giải thích từng câu. Đạt từ 80%
            trở lên sẽ nhận sao ⭐. Tiến độ được lưu ngay trên máy của em.
          </p>
          {loaded && (
            <p className="mt-4 inline-block rounded-full border border-sea/20 bg-white px-4 py-1.5 font-mono text-sm text-sea-deep shadow-card">
              🏆 Đã chinh phục {doneCount}/{availableLessons.length} bài
            </p>
          )}
        </header>

        <div className="mt-10 space-y-8">
          {CURRICULUM.map((topic) => {
            const hasAvailable = topic.lessons.some((l) => l.available);
            return (
              <section key={topic.id}>
                <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
                  <span>{topic.emoji}</span> {topic.name}
                </h2>
                <ul className="mt-3 space-y-2">
                  {topic.lessons.map((lesson) => {
                    const p = progress[lesson.id];
                    if (!lesson.available) {
                      return (
                        <li
                          key={lesson.id}
                          className="flex items-center justify-between rounded-xl border border-dashed border-ink/10 bg-white/40 px-4 py-3 text-sm text-ink-soft/50"
                        >
                          <span>{lesson.title}</span>
                          <span className="shrink-0 font-mono text-xs">sắp có</span>
                        </li>
                      );
                    }
                    const count = getQuestions(lesson.id).length;
                    return (
                      <li key={lesson.id}>
                        <Link
                          href={`/luyen/${lesson.id}`}
                          className="group flex items-center justify-between gap-3 rounded-xl border border-ink/5 bg-white px-4 py-3 shadow-card transition hover:-translate-y-0.5 hover:border-sea/30 hover:shadow-card-hover"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-ink group-hover:text-sea-deep">
                              {lesson.title}
                            </p>
                            <p className="mt-0.5 font-mono text-xs text-ink-soft/70">
                              {count} câu hỏi
                              {p ? ` · đã làm ${p.attempts} lần` : ""}
                            </p>
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            {hasTheory(lesson.id) && (
                              <span
                                title="Bài này đã có phần lý thuyết tự học"
                                className="rounded-full bg-sea/10 px-2.5 py-1 font-mono text-xs font-medium text-sea-deep"
                              >
                                📖 lý thuyết
                              </span>
                            )}
                            {loaded && p && <ScoreBadge best={p.best} />}
                            <span className="text-ink-soft/40 transition group-hover:translate-x-0.5 group-hover:text-sea">
                              →
                            </span>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                {!hasAvailable && null}
              </section>
            );
          })}
        </div>

        <footer className="mt-12 space-y-1 text-center font-mono text-xs text-ink-soft/50">
          <p>Tổ Tin học — Trường THPT Na Rì, tỉnh Thái Nguyên</p>
          <p>SGK Kết nối tri thức với cuộc sống · Tiến độ lưu trên trình duyệt của bạn</p>
        </footer>
      </div>
    </main>
  );
}
