"use client";

import { useEffect, useState } from "react";
import type { BinaryGame, BinaryQuestion } from "@/lib/types";
import { getLessonProgress, saveAttempt } from "@/lib/progress";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Phân tích 1 byte nhị phân (8 kí tự "0"/"1") thành các số hạng luỹ thừa 2
// đang "bật", để hiện lời giải "11000000 = 128+64 = 192" — tính trực tiếp từ
// đúng chuỗi bit của câu hỏi, không cần soạn tay nên không thể sai lệch.
function decodeByte(bits: string): { value: number; terms: number[] } {
  const terms: number[] = [];
  let value = 0;
  for (let i = 0; i < 8; i++) {
    if (bits[i] === "1") {
      const p = 2 ** (7 - i);
      terms.push(p);
      value += p;
    }
  }
  return { value, terms };
}

type ByteInputs = [string, string, string, string];

export default function BinaryIPGameClient({
  lessonId,
  game,
  onBack,
}: {
  lessonId: string;
  game: BinaryGame;
  onBack?: () => void;
}) {
  const progressKey = `${lessonId}:game:${game.id}`;
  const n = game.questions.length;

  const [deck, setDeck] = useState<BinaryQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [inputs, setInputs] = useState<ByteInputs>(["", "", "", ""]);
  const [checked, setChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongItems, setWrongItems] = useState<BinaryQuestion[]>([]);
  const [finished, setFinished] = useState(false);
  const [best, setBest] = useState<number | null>(null);

  function setup() {
    setDeck(shuffle(game.questions));
    setCurrent(0);
    setInputs(["", "", "", ""]);
    setChecked(false);
    setCorrectCount(0);
    setWrongItems([]);
    setFinished(false);
  }

  useEffect(() => {
    setup();
    setBest(getLessonProgress(progressKey)?.best ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game, lessonId]);

  const q = deck[current];
  const bytes = q ? q.binary.split(" ") : [];
  const allFilled = inputs.every((v) => v.trim() !== "");
  const scorePercent = Math.round((correctCount / n) * 100);

  function setByte(idx: number, value: string) {
    if (checked) return;
    // Chỉ nhận tối đa 3 chữ số, tự cắt bớt để không gõ được số dài vô lí
    const cleaned = value.replace(/[^0-9]/g, "").slice(0, 3);
    setInputs((prev) => {
      const next = [...prev] as ByteInputs;
      next[idx] = cleaned;
      return next;
    });
  }

  function check() {
    if (!allFilled || !q) return;
    setChecked(true);
    const correct = q.answer.every((b, i) => Number(inputs[i]) === b);
    if (correct) {
      setCorrectCount((c) => c + 1);
    } else {
      setWrongItems((list) => [...list, q]);
    }
  }

  function next() {
    if (current + 1 >= n) {
      const percent = Math.round((correctCount / n) * 100);
      saveAttempt(progressKey, percent);
      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
      setInputs(["", "", "", ""]);
      setChecked(false);
    }
  }

  if (deck.length === 0 || !q) {
    return (
      <main className="playground min-h-screen pb-16">
        <div className="mx-auto max-w-2xl px-5 pt-8 sm:px-8 text-sm text-ink-soft">Đang tải…</div>
      </main>
    );
  }

  if (finished) {
    return (
      <main className="playground min-h-screen pb-16">
        <div className="mx-auto max-w-2xl px-5 pt-8 sm:px-8">
          <div className="rounded-2xl border border-ink/5 bg-white p-5 text-center shadow-card">
            <p className="text-4xl">{scorePercent === 100 ? "🎉" : scorePercent >= 60 ? "💪" : "📖"}</p>
            <h2 className="mt-2 font-display text-xl font-bold text-ink">
              {correctCount}/{n} đúng · {scorePercent}%
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

          {wrongItems.length > 0 && (
            <div className="mt-4 space-y-2">
              <h3 className="font-display text-sm font-semibold text-ink">📌 Các địa chỉ cần ôn lại</h3>
              {wrongItems.map((w) => (
                <div key={w.id} className="rounded-xl border border-ink/5 bg-white p-3.5 shadow-card">
                  <p className="font-mono text-xs text-ink-soft">{w.binary}</p>
                  <p className="mt-1 text-sm font-medium text-ink">Đáp án đúng: {w.answer.join(".")}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
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

        <div className="mt-2 flex items-center justify-between font-mono text-[11px] text-ink-soft/60">
          <span>Câu {current + 1}/{n}</span>
        </div>

        {/* Chuỗi nhị phân, tách rõ 4 byte */}
        <div className="mt-4 rounded-2xl border border-ink/5 bg-white p-5 text-center shadow-card">
          <p className="font-mono text-[10px] uppercase tracking-wider text-ink-soft/60">Địa chỉ IPv4 dạng nhị phân (32 bit)</p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2 font-mono text-base font-bold text-sea-deep sm:text-lg">
            {bytes.map((b, i) => (
              <span key={i} className="rounded-lg bg-sea/10 px-2 py-1">
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* 4 ô nhập từng byte thập phân */}
        <div className="mt-4 grid grid-cols-4 gap-2 sm:gap-3">
          {inputs.map((v, i) => {
            const isCorrectByte = checked && Number(v) === q.answer[i];
            const isWrongByte = checked && Number(v) !== q.answer[i];
            return (
              <div key={i}>
                <label className="block text-center font-mono text-[10px] text-ink-soft/60">Byte {i + 1}</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={v}
                  disabled={checked}
                  onChange={(e) => setByte(i, e.target.value)}
                  placeholder="0-255"
                  className={`mt-1 w-full rounded-xl border-2 bg-white px-2 py-2.5 text-center font-mono text-base font-bold text-ink outline-none transition ${
                    isCorrectByte
                      ? "border-leaf bg-leaf/10 text-leaf-deep"
                      : isWrongByte
                        ? "border-berry bg-berry/10 text-berry"
                        : "border-ink/15 focus:border-sea"
                  }`}
                />
                {isWrongByte && <p className="mt-1 text-center font-mono text-[10px] font-bold text-leaf-deep">{q.answer[i]}</p>}
              </div>
            );
          })}
        </div>

        {/* Lời giải chi tiết sau khi kiểm tra */}
        {checked && (
          <div className="mt-4 animate-pop-in space-y-1.5 rounded-2xl border border-ink/5 bg-white p-4 shadow-card">
            <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-sea-deep">💡 Cách đổi từng byte</p>
            {bytes.map((b, i) => {
              const { value, terms } = decodeByte(b);
              return (
                <p key={i} className="font-mono text-xs text-ink-soft">
                  Byte {i + 1}: {b} = {terms.length > 0 ? terms.join("+") : "0"} = <span className="font-bold text-ink">{value}</span>
                </p>
              );
            })}
            {q.note && <p className="mt-2 text-xs leading-relaxed text-ink-soft">{q.note}</p>}
          </div>
        )}

        {!checked ? (
          <button
            onClick={check}
            disabled={!allFilled}
            className={`mt-6 w-full rounded-full px-5 py-3 font-display font-semibold text-white transition ${
              allFilled ? "bg-gradient-to-r from-sea to-coral hover:opacity-90" : "cursor-not-allowed bg-ink/15 text-ink-soft"
            }`}
          >
            Kiểm tra
          </button>
        ) : (
          <button
            onClick={next}
            className="mt-6 w-full rounded-full bg-gradient-to-r from-sea to-coral px-5 py-3 font-display font-semibold text-white transition hover:opacity-90"
          >
            {current + 1 >= n ? "Xem kết quả" : "Câu tiếp theo →"}
          </button>
        )}
      </div>
    </main>
  );
}
