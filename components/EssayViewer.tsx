"use client";

import { useState } from "react";
import type { EssayQuestion } from "@/lib/types";

export default function EssayViewer({
  lessonTitle,
  questions,
  onBack,
}: {
  lessonTitle: string;
  questions: EssayQuestion[];
  onBack: () => void;
}) {
  const [current, setCurrent] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [draft, setDraft] = useState("");

  const q = questions[current];

  function go(delta: number) {
    const next = current + delta;
    if (next < 0 || next >= questions.length) return;
    setCurrent(next);
    setRevealed(false);
    setDraft("");
  }

  return (
    <div className="mx-auto max-w-2xl px-5 pt-8 sm:px-8">
      <header>
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={onBack}
            className="rounded-full border border-ink/10 bg-white px-3 py-1.5 font-mono text-xs text-ink-soft transition hover:border-grape/40 hover:text-grape-deep"
          >
            ← Quay lại
          </button>
          <p className="font-mono text-xs text-ink-soft">
            Câu {current + 1}/{questions.length} · Tự luận
          </p>
        </div>
        <h1 className="mt-3 font-display text-lg font-semibold leading-snug text-ink">
          {lessonTitle}
        </h1>
      </header>

      <div key={q.id} className="mt-6 animate-pop-in">
        <div className="rounded-2xl border border-ink/5 bg-white p-5 shadow-card sm:p-6">
          <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-ink">{q.q}</p>
          {q.code && (
            <pre className="mt-3 overflow-x-auto rounded-lg bg-ink/95 p-3.5 font-mono text-sm leading-relaxed text-green-300">
              {q.code}
            </pre>
          )}
        </div>

        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Em nháp câu trả lời ở đây trước khi xem gợi ý… (nội dung không bị lưu lại)"
          rows={5}
          className="mt-4 w-full resize-y rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm leading-relaxed placeholder:text-ink-soft/50 focus:border-grape"
        />

        {!revealed ? (
          <button
            onClick={() => setRevealed(true)}
            className="mt-3 w-full rounded-full bg-gradient-to-r from-grape to-bubble px-5 py-2.5 font-medium text-white transition hover:opacity-90"
          >
            Xem gợi ý trả lời 💡
          </button>
        ) : (
          <div className="mt-3 animate-pop-in rounded-xl border border-mint/30 bg-mint/5 p-4">
            <p className="font-display text-sm font-semibold text-mint">💡 Gợi ý trả lời</p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink">
              {q.answer}
            </p>
            <p className="mt-3 font-mono text-xs text-ink-soft/60">
              Tự đối chiếu với phần nháp của em — diễn đạt khác nhưng đủ ý vẫn được điểm nhé!
            </p>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            onClick={() => go(-1)}
            disabled={current === 0}
            className="rounded-full border border-ink/10 bg-white px-5 py-2 text-sm font-medium text-ink-soft transition hover:border-grape/40 disabled:opacity-40"
          >
            ← Câu trước
          </button>
          {current + 1 < questions.length ? (
            <button
              onClick={() => go(1)}
              className="rounded-full border border-ink/10 bg-white px-5 py-2 text-sm font-medium text-ink-soft transition hover:border-grape/40"
            >
              Câu sau →
            </button>
          ) : (
            <button
              onClick={onBack}
              className="rounded-full bg-gradient-to-r from-grape to-bubble px-5 py-2 text-sm font-medium text-white transition hover:opacity-90"
            >
              Hoàn thành 🏁
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
