"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { EssayQuestion, Question, TFQuestion } from "@/lib/types";
import { getLessonProgress } from "@/lib/progress";
import QuizClient from "@/components/QuizClient";
import TrueFalseQuiz from "@/components/TrueFalseQuiz";
import EssayViewer from "@/components/EssayViewer";

type Mode = "menu" | "mcq" | "tf" | "essay";

export default function LessonClient({
  lessonId,
  lessonTitle,
  topicName,
  mcq,
  tf,
  essay,
}: {
  lessonId: string;
  lessonTitle: string;
  topicName: string;
  mcq: Question[];
  tf: TFQuestion[];
  essay: EssayQuestion[];
}) {
  const [mode, setMode] = useState<Mode>("menu");
  const [bestMcq, setBestMcq] = useState<number | null>(null);
  const [bestTf, setBestTf] = useState<number | null>(null);

  useEffect(() => {
    if (mode === "menu") {
      setBestMcq(getLessonProgress(lessonId)?.best ?? null);
      setBestTf(getLessonProgress(`${lessonId}:ds`)?.best ?? null);
    }
  }, [mode, lessonId]);

  if (mode === "mcq") {
    // QuizClient tự bọc <main> riêng nên không bọc thêm ở đây
    return (
      <QuizClient
        lessonId={lessonId}
        lessonTitle={lessonTitle}
        topicName={topicName}
        questions={mcq}
        onBack={() => setMode("menu")}
      />
    );
  }

  if (mode === "tf") {
    return (
      <main className="playground min-h-screen pb-16">
        <TrueFalseQuiz
          lessonId={lessonId}
          lessonTitle={lessonTitle}
          questions={tf}
          onBack={() => setMode("menu")}
        />
      </main>
    );
  }

  if (mode === "essay") {
    return (
      <main className="playground min-h-screen pb-16">
        <EssayViewer
          lessonTitle={lessonTitle}
          questions={essay}
          onBack={() => setMode("menu")}
        />
      </main>
    );
  }

  const options = [
    {
      key: "mcq" as Mode,
      emoji: "🎯",
      name: "Trắc nghiệm",
      desc: `${mcq.length} câu · chọn 1 trong 4 phương án, chấm ngay từng câu`,
      best: bestMcq,
      enabled: mcq.length > 0,
    },
    {
      key: "tf" as Mode,
      emoji: "⚖️",
      name: "Đúng / Sai",
      desc: `${tf.length} câu tình huống · mỗi câu 4 ý, chấm điểm như thi tốt nghiệp`,
      best: bestTf,
      enabled: tf.length > 0,
    },
    {
      key: "essay" as Mode,
      emoji: "✍️",
      name: "Tự luận",
      desc: `${essay.length} câu · tự trả lời rồi đối chiếu gợi ý đáp án`,
      best: null,
      enabled: essay.length > 0,
    },
  ];

  return (
    <main className="playground min-h-screen pb-16">
      <div className="mx-auto max-w-2xl px-5 pt-10 sm:px-8">
        <Link
          href="/"
          className="rounded-full border border-ink/10 bg-white px-3 py-1.5 font-mono text-xs text-ink-soft transition hover:border-grape/40 hover:text-grape-deep"
        >
          ← Trang chủ
        </Link>
        <h1 className="mt-5 font-display text-2xl font-bold leading-snug text-ink">
          {lessonTitle}
        </h1>
        <p className="mt-1 font-mono text-xs text-ink-soft/60">{topicName}</p>

        <div className="mt-6 space-y-3">
          {options
            .filter((o) => o.enabled)
            .map((o) => (
              <button
                key={o.key}
                onClick={() => setMode(o.key)}
                className="group flex w-full items-center gap-4 rounded-2xl border border-ink/5 bg-white p-5 text-left shadow-card transition hover:-translate-y-0.5 hover:border-grape/30 hover:shadow-card-hover"
              >
                <span className="text-3xl">{o.emoji}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-base font-semibold text-ink group-hover:text-grape-deep">
                    {o.name}
                  </span>
                  <span className="mt-0.5 block text-sm text-ink-soft">{o.desc}</span>
                </span>
                {o.best !== null && (
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 font-mono text-xs font-medium ${
                      o.best >= 80
                        ? "bg-mint/15 text-mint"
                        : o.best >= 50
                          ? "bg-sun/15 text-sun"
                          : "bg-tomato/10 text-tomato"
                    }`}
                  >
                    {o.best >= 80 ? "⭐ " : ""}
                    {o.best}%
                  </span>
                )}
                <span className="shrink-0 text-ink-soft/40 transition group-hover:translate-x-0.5 group-hover:text-grape">
                  →
                </span>
              </button>
            ))}
        </div>
      </div>
    </main>
  );
}
