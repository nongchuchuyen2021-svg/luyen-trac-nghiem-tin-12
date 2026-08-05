"use client";

import { useEffect, useRef, useState } from "react";
import type { TFQuestion } from "@/lib/types";
import { saveAttempt, getLessonProgress } from "@/lib/progress";
import { scrollIntoViewIfNeeded } from "@/components/QuizClient";

// Điểm mỗi câu theo quy chế thi tốt nghiệp: đúng 1 ý 0,1đ; 2 ý 0,25đ; 3 ý 0,5đ; 4 ý 1đ
const POINTS = [0, 0.1, 0.25, 0.5, 1];
const LABELS = ["a", "b", "c", "d"];

export default function TrueFalseQuiz({
  lessonId,
  lessonTitle,
  questions,
  onBack,
}: {
  lessonId: string;
  lessonTitle: string;
  questions: TFQuestion[];
  onBack: () => void;
}) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(boolean | null)[]>([null, null, null, null]);
  const [submitted, setSubmitted] = useState(false);
  const [earned, setEarned] = useState<number[]>([]); // điểm từng câu đã nộp
  const [finished, setFinished] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (submitted) scrollIntoViewIfNeeded(resultRef.current);
  }, [submitted]);

  const q = questions[current];
  const maxScore = questions.length; // mỗi câu tối đa 1 điểm
  const totalEarned = earned.reduce((s, x) => s + x, 0);

  function setAnswer(i: number, val: boolean) {
    if (submitted) return;
    setAnswers((prev) => prev.map((a, idx) => (idx === i ? val : a)));
  }

  function submit() {
    const correct = q.statements.filter((st, i) => answers[i] === st.answer).length;
    setEarned((prev) => [...prev, POINTS[correct]]);
    setSubmitted(true);
  }

  function next() {
    if (current + 1 >= questions.length) {
      const total = earned.reduce((s, x) => s + x, 0);
      const percent = Math.round((total / maxScore) * 100);
      saveAttempt(`${lessonId}:ds`, percent);
      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
      setAnswers([null, null, null, null]);
      setSubmitted(false);
    }
  }

  function retry() {
    setCurrent(0);
    setAnswers([null, null, null, null]);
    setSubmitted(false);
    setEarned([]);
    setFinished(false);
  }

  if (finished) {
    const percent = Math.round((totalEarned / maxScore) * 100);
    const best = getLessonProgress(`${lessonId}:ds`)?.best ?? percent;
    const emoji = percent >= 80 ? "🎉" : percent >= 50 ? "💪" : "📖";
    return (
      <div className="mx-auto max-w-2xl px-5 pt-12 sm:px-8">
        <div className="animate-pop-in rounded-2xl border border-ink/5 bg-white p-8 text-center shadow-card">
          <p className="text-6xl">{emoji}</p>
          <h1 className="mt-3 font-display text-2xl font-bold text-ink">
            {totalEarned.toFixed(2).replace(".", ",")}/{maxScore} điểm · {percent}%
          </h1>
          <p className="mt-2 text-ink-soft">
            Chấm theo quy chế thi tốt nghiệp: mỗi câu đúng 1 ý được 0,1đ · 2 ý 0,25đ · 3 ý
            0,5đ · cả 4 ý 1đ. Kỉ lục của em: {best}%.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={retry}
              className="rounded-full bg-gradient-to-r from-grape to-bubble px-6 py-2.5 font-medium text-white shadow-card transition hover:opacity-90"
            >
              Làm lại
            </button>
            <button
              onClick={onBack}
              className="rounded-full border border-ink/10 bg-white px-6 py-2.5 font-medium text-ink-soft transition hover:border-grape/40 hover:text-grape-deep"
            >
              ← Chọn phần khác
            </button>
          </div>
        </div>
      </div>
    );
  }

  const allAnswered = answers.every((a) => a !== null);

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
            Câu {current + 1}/{questions.length} · Đúng/Sai
          </p>
        </div>
        <h1 className="mt-3 font-display text-lg font-semibold leading-snug text-ink">
          {lessonTitle}
        </h1>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-ink/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-grape to-bubble transition-all duration-300"
            style={{ width: `${Math.round((current / questions.length) * 100)}%` }}
          />
        </div>
      </header>

      <div key={q.id} className="mt-6 animate-pop-in">
        <div className="rounded-2xl border border-ink/5 bg-white p-5 shadow-card sm:p-6">
          <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-ink">
            {q.context}
          </p>
          {q.code && (
            <pre className="mt-3 overflow-x-auto rounded-lg bg-ink/95 p-3.5 font-mono text-sm leading-relaxed text-green-300">
              {q.code}
            </pre>
          )}
          <p className="mt-3 font-mono text-xs text-ink-soft/70">
            Chọn Đúng hoặc Sai cho TỪNG ý dưới đây:
          </p>
        </div>

        <div className="mt-4 space-y-3">
          {q.statements.map((st, i) => {
            const chosen = answers[i];
            const isCorrect = submitted && chosen === st.answer;
            const isWrong = submitted && chosen !== st.answer;
            return (
              <div
                key={i}
                className={`rounded-xl border-2 bg-white p-4 transition ${
                  isCorrect
                    ? "border-mint bg-mint/5"
                    : isWrong
                      ? "border-tomato bg-tomato/5"
                      : "border-ink/10"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink/5 font-mono text-xs font-semibold text-ink-soft">
                    {LABELS[i]}
                  </span>
                  <p className="min-w-0 flex-1 text-sm leading-relaxed text-ink">{st.text}</p>
                </div>
                <div className="mt-2.5 flex items-center gap-2 pl-9">
                  <button
                    onClick={() => setAnswer(i, true)}
                    disabled={submitted}
                    className={`rounded-full border-2 px-4 py-1 text-xs font-semibold transition ${
                      chosen === true
                        ? "border-grape bg-grape text-white"
                        : "border-ink/15 bg-white text-ink-soft hover:border-grape/50"
                    }`}
                  >
                    Đúng
                  </button>
                  <button
                    onClick={() => setAnswer(i, false)}
                    disabled={submitted}
                    className={`rounded-full border-2 px-4 py-1 text-xs font-semibold transition ${
                      chosen === false
                        ? "border-bubble bg-bubble text-white"
                        : "border-ink/15 bg-white text-ink-soft hover:border-bubble/50"
                    }`}
                  >
                    Sai
                  </button>
                  {submitted && (
                    <span
                      className={`ml-1 font-mono text-xs font-semibold ${
                        isCorrect ? "text-mint" : "text-tomato"
                      }`}
                    >
                      {isCorrect ? "✓" : `✗ Đáp án: ${st.answer ? "Đúng" : "Sai"}`}
                    </span>
                  )}
                </div>
                {submitted && (
                  <p className="mt-2 pl-9 text-xs leading-relaxed text-ink-soft">
                    {st.explain}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {!submitted ? (
          <button
            onClick={submit}
            disabled={!allAnswered}
            className="mt-4 w-full rounded-full bg-gradient-to-r from-grape to-bubble px-5 py-2.5 font-medium text-white transition hover:opacity-90 disabled:opacity-40"
          >
            {allAnswered ? "Chấm câu này" : "Hãy chọn Đúng/Sai cho đủ 4 ý"}
          </button>
        ) : (
          <div
            ref={resultRef}
            className="mt-4 animate-pop-in rounded-xl border border-ink/5 bg-white p-4 shadow-card"
          >
            <p className="font-display text-sm font-semibold text-ink">
              🎯 Em đúng {q.statements.filter((st, i) => answers[i] === st.answer).length}/4 ý —
              được {POINTS[q.statements.filter((st, i) => answers[i] === st.answer).length]
                .toString()
                .replace(".", ",")}{" "}
              điểm
            </p>
            <button
              onClick={next}
              className="mt-3 w-full rounded-full bg-gradient-to-r from-grape to-bubble px-5 py-2.5 font-medium text-white transition hover:opacity-90"
            >
              {current + 1 >= questions.length ? "Xem tổng kết 🏁" : "Câu tiếp theo →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
