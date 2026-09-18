"use client";

import { useEffect, useState } from "react";
import type { RoutingGame, RoutingQuestion, RoutingRule } from "@/lib/types";
import { getLessonProgress, saveAttempt } from "@/lib/progress";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const DEFAULT_ID = "default";

type PortChoice = { id: string; label: string; port: string };

export default function RoutingGameClient({
  lessonId,
  game,
  onBack,
}: {
  lessonId: string;
  game: RoutingGame;
  onBack?: () => void;
}) {
  const progressKey = `${lessonId}:game:${game.id}`;
  const n = game.questions.length;

  const allChoices: PortChoice[] = [
    ...game.rules.map((r) => ({ id: r.id, label: r.label, port: r.port })),
    { id: DEFAULT_ID, label: "Không có trong bảng", port: game.defaultPort },
  ];

  const [deck, setDeck] = useState<RoutingQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [choiceOrder, setChoiceOrder] = useState<PortChoice[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongItems, setWrongItems] = useState<RoutingQuestion[]>([]);
  const [finished, setFinished] = useState(false);
  const [best, setBest] = useState<number | null>(null);

  function setup() {
    setDeck(shuffle(game.questions));
    setCurrent(0);
    setPicked(null);
    setCorrectCount(0);
    setWrongItems([]);
    setFinished(false);
  }

  useEffect(() => {
    setup();
    setBest(getLessonProgress(progressKey)?.best ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game, lessonId]);

  useEffect(() => {
    setChoiceOrder(shuffle(allChoices));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, deck]);

  const q = deck[current];
  const scorePercent = Math.round((correctCount / n) * 100);

  function pick(choiceId: string) {
    if (picked || !q) return;
    setPicked(choiceId);
    if (choiceId === q.correctRuleId) {
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
      setPicked(null);
    }
  }

  function ruleLabel(id: string): string {
    if (id === DEFAULT_ID) return `Cổng mặc định — ${game.defaultPort}`;
    const r = game.rules.find((r) => r.id === id);
    return r ? `${r.label} — ${r.port}` : id;
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
              {correctCount}/{n} đúng cổng · {scorePercent}%
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
              <h3 className="font-display text-sm font-semibold text-ink">📌 Các gói tin cần ôn lại</h3>
              {wrongItems.map((w) => (
                <div key={w.id} className="rounded-xl border border-ink/5 bg-white p-3.5 shadow-card">
                  <p className="text-sm font-medium text-ink">{w.destination}</p>
                  <p className="mt-1 font-mono text-xs text-sea-deep">→ {ruleLabel(w.correctRuleId)}</p>
                  <p className="mt-1 text-xs leading-relaxed text-ink-soft">{w.explain}</p>
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

        {/* Bảng định tuyến cố định — luôn hiển thị làm tài liệu tra cứu */}
        <div className="mt-4 rounded-2xl border border-ink/5 bg-white p-4 shadow-card">
          <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-sea-deep">🗂️ Bảng định tuyến — {game.routerName}</p>
          <div className="mt-2 divide-y divide-ink/5">
            {game.rules.map((r) => (
              <div key={r.id} className="flex items-center justify-between py-1.5 text-sm">
                <span className="text-ink">{r.label}</span>
                <span className="font-mono text-xs font-bold text-sea-deep">{r.port}</span>
              </div>
            ))}
            <div className="flex items-center justify-between py-1.5 text-sm">
              <span className="text-ink-soft/70">Còn lại (không có trong bảng)</span>
              <span className="font-mono text-xs font-bold text-coral">{game.defaultPort}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between font-mono text-[11px] text-ink-soft/60">
          <span>Gói tin {current + 1}/{n}</span>
        </div>

        {/* Gói tin đang đến */}
        <div className="mt-2 rounded-2xl border border-ink/5 bg-white p-5 text-center shadow-card">
          <p className="text-3xl">📨</p>
          <p className="mt-2 text-base font-semibold text-ink">{q.destination}</p>
          <p className="mt-1 font-mono text-[11px] text-ink-soft/60">Router này nên đẩy gói tin ra cổng nào?</p>
        </div>

        {/* Các lựa chọn cổng ra */}
        <div className="mt-3 space-y-2">
          {choiceOrder.map((c) => {
            const isPicked = picked === c.id;
            const isAnswer = c.id === q.correctRuleId;
            const showResult = picked !== null;
            return (
              <button
                key={c.id}
                onClick={() => pick(c.id)}
                disabled={picked !== null}
                className={`flex w-full items-center justify-between gap-3 rounded-2xl border-2 p-3.5 text-left transition ${
                  showResult && isAnswer
                    ? "border-leaf bg-leaf/10"
                    : showResult && isPicked && !isAnswer
                      ? "border-berry bg-berry/10"
                      : "border-ink/10 bg-white hover:border-sea/40"
                }`}
              >
                <span className="text-sm font-medium text-ink">
                  {c.id === DEFAULT_ID ? "➡️ Cổng mặc định" : `🛣️ ${c.label}`}
                </span>
                <span className="font-mono text-xs font-bold text-sea-deep">{c.port}</span>
              </button>
            );
          })}
        </div>

        {picked && (
          <div
            className={`mt-4 animate-pop-in rounded-2xl border p-4 text-sm leading-relaxed shadow-card ${
              picked === q.correctRuleId ? "border-leaf/30 bg-leaf/10 text-leaf-deep" : "border-berry/30 bg-berry/10 text-berry"
            }`}
          >
            <p className="font-mono text-xs font-bold uppercase tracking-wider">
              {picked === q.correctRuleId ? "✓ Chính xác" : "✕ Chưa đúng"}
            </p>
            <p className="mt-1 text-ink">{q.explain}</p>
          </div>
        )}

        {picked && (
          <button
            onClick={next}
            className="mt-4 w-full rounded-full bg-gradient-to-r from-sea to-coral px-5 py-3 font-display font-semibold text-white transition hover:opacity-90"
          >
            {current + 1 >= n ? "Xem kết quả" : "Gói tiếp theo →"}
          </button>
        )}
      </div>
    </main>
  );
}
