"use client";

import { useState } from "react";
import type { LessonReview } from "@/lib/types";
import Diagram from "@/components/theory/Diagram";

export default function ReviewViewer({
  lessonTitle,
  review,
  onBack,
}: {
  lessonTitle: string;
  review: LessonReview;
  onBack?: () => void;
}) {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const doneCount = Object.values(checked).filter(Boolean).length;

  return (
    <main className="playground min-h-screen pb-16">
      <div className="mx-auto max-w-2xl px-5 pt-8 sm:px-8">
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
        </div>

        <h1 className="mt-4 font-display text-xl font-bold leading-snug text-ink">📋 Ôn tập tổng kết</h1>
        <p className="mt-0.5 font-mono text-xs text-ink-soft/60">{lessonTitle}</p>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">{review.summary}</p>

        {/* Sơ đồ tổng kết, nếu có */}
        {review.diagram && (
          <figure className="mt-6 rounded-2xl border border-ink/5 bg-white p-3 shadow-card sm:p-4">
            <div className="-mx-1 overflow-x-auto px-1">
              <div className="min-w-[600px] sm:min-w-0">
                <Diagram name={review.diagram} />
              </div>
            </div>
          </figure>
        )}

        {/* Ý cốt lõi */}
        <section className="mt-6">
          <h2 className="font-display text-base font-semibold text-ink">🔑 Ý cốt lõi</h2>
          <ul className="mt-2.5 space-y-2 rounded-2xl border border-sea/15 bg-sea/5 p-4">
            {review.keyPoints.map((k, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink">
                <span className="mt-0.5 shrink-0 text-sea-deep">●</span>
                <Rich text={k} />
              </li>
            ))}
          </ul>
        </section>

        {/* Lỗi hay gặp */}
        {review.commonMistakes.length > 0 && (
          <section className="mt-6">
            <h2 className="font-display text-base font-semibold text-ink">⚠️ Lỗi hay gặp</h2>
            <div className="mt-2.5 space-y-3">
              {review.commonMistakes.map((m, i) => (
                <div key={i} className="rounded-2xl border border-berry/20 bg-white p-4 shadow-card">
                  <p className="text-sm font-medium text-berry">❌ {m.mistake}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">✅ {m.fix}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Mẹo nhớ */}
        {review.tips.length > 0 && (
          <section className="mt-6">
            <h2 className="font-display text-base font-semibold text-ink">💡 Mẹo nhớ nhanh</h2>
            <ul className="mt-2.5 space-y-2 rounded-2xl border border-gold/25 bg-gold/5 p-4">
              {review.tips.map((t, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink">
                  <span className="mt-0.5 shrink-0 text-gold-deep">✦</span>
                  <Rich text={t} />
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Flashcard */}
        {review.flashcards.length > 0 && (
          <section className="mt-6">
            <h2 className="font-display text-base font-semibold text-ink">🎴 Thẻ ghi nhớ — chạm để lật</h2>
            <div className="mt-2.5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {review.flashcards.map((f, i) => {
                const isFlipped = !!flipped[i];
                return (
                  <button
                    key={i}
                    onClick={() => setFlipped((prev) => ({ ...prev, [i]: !prev[i] }))}
                    className={`min-h-[110px] rounded-2xl border-2 p-4 text-left shadow-card transition ${
                      isFlipped ? "border-leaf bg-leaf/5" : "border-sea/25 bg-white hover:border-sea/50"
                    }`}
                  >
                    <span
                      className={`font-mono text-[10px] font-bold uppercase tracking-wider ${
                        isFlipped ? "text-leaf-deep" : "text-sea-deep"
                      }`}
                    >
                      {isFlipped ? "✓ Trả lời" : "? Câu hỏi — chạm để xem"}
                    </span>
                    <p className="mt-1.5 text-sm font-medium leading-relaxed text-ink">
                      {isFlipped ? f.back : f.front}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Checklist */}
        {review.checklist.length > 0 && (
          <section className="mt-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-semibold text-ink">✅ Em tự đánh giá</h2>
              <span className="font-mono text-xs text-ink-soft">
                {doneCount}/{review.checklist.length}
              </span>
            </div>
            <div className="mt-2.5 space-y-2">
              {review.checklist.map((c, i) => {
                const isChecked = !!checked[i];
                return (
                  <button
                    key={i}
                    onClick={() => setChecked((prev) => ({ ...prev, [i]: !prev[i] }))}
                    className={`flex w-full items-center gap-3 rounded-xl border p-3.5 text-left text-sm transition ${
                      isChecked ? "border-leaf/40 bg-leaf/10 text-ink" : "border-ink/10 bg-white text-ink-soft"
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 text-xs font-bold ${
                        isChecked ? "border-leaf bg-leaf text-white" : "border-ink/20 text-transparent"
                      }`}
                    >
                      ✓
                    </span>
                    {c}
                  </button>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

// Bọc **đậm** / *nghiêng* — giống hệt Rich trong TheoryViewer.tsx, chép riêng
// ở đây để ReviewViewer không phải phụ thuộc ngược vào TheoryViewer.
function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith("**") && p.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-ink">
              {p.slice(2, -2)}
            </strong>
          );
        }
        if (p.length > 2 && p.startsWith("*") && p.endsWith("*")) {
          return (
            <em key={i} className="text-ink-soft/80">
              {p.slice(1, -1)}
            </em>
          );
        }
        return <span key={i}>{p}</span>;
      })}
    </>
  );
}
