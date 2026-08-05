"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { LessonTheory, TheoryBlock, Tone } from "@/lib/types";
import { markTheoryRead } from "@/lib/progress";
import Diagram from "@/components/theory/Diagram";

// Bảng lớp CSS theo tông màu — viết đủ chuỗi để Tailwind quét được,
// không ghép chuỗi động kiểu `bg-${tone}` (Tailwind sẽ không sinh ra lớp đó).
const TONE: Record<Tone, { box: string; title: string }> = {
  sea: { box: "border-sea/25 bg-sea/[0.07]", title: "text-sea-deep" },
  coral: { box: "border-coral/30 bg-coral/[0.07]", title: "text-coral" },
  leaf: { box: "border-leaf/30 bg-leaf/[0.07]", title: "text-leaf-deep" },
  gold: { box: "border-gold/35 bg-gold/[0.09]", title: "text-gold-deep" },
  berry: { box: "border-berry/25 bg-berry/[0.06]", title: "text-berry" },
};

// Cho phép in đậm bằng **…** và in nghiêng bằng *…* ngay trong chuỗi dữ liệu,
// đỡ phải viết JSX trong file data. Không hỗ trợ thêm cú pháp nào khác cho gọn.
// Nghiêng dùng cho câu ví dụ đi kèm một ý, để nó nhạt hơn phần định nghĩa.
function Rich({ text }: { text: string }) {
  // Bắt **…** trước *…* để cụm in đậm không bị cắt nhầm thành hai cụm nghiêng.
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

function QuickCheck({
  q,
  options,
  answer,
  explain,
}: {
  q: string;
  options: string[];
  answer: number;
  explain: string;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const correct = picked === answer;

  return (
    <div className="rounded-2xl border-2 border-dashed border-sea/30 bg-sea/[0.05] p-4 sm:p-5">
      <p className="font-display text-sm font-semibold text-sea-deep">🤔 Thử kiểm tra xem em đã hiểu chưa</p>
      <p className="mt-2 text-[15px] leading-relaxed text-ink">
        <Rich text={q} />
      </p>
      <div className="mt-3 space-y-2">
        {options.map((o, i) => {
          const chosen = picked === i;
          const reveal = picked !== null;
          const isRight = i === answer;
          return (
            <button
              key={i}
              onClick={() => picked === null && setPicked(i)}
              disabled={picked !== null}
              className={`flex w-full items-start gap-2.5 rounded-xl border-2 px-3.5 py-2.5 text-left text-sm transition ${
                reveal && isRight
                  ? "border-leaf bg-leaf/10 text-leaf-deep"
                  : chosen
                    ? "border-berry bg-berry/10 text-berry"
                    : "border-ink/10 bg-white text-ink hover:border-sea/40"
              } ${picked === null ? "cursor-pointer" : "cursor-default"}`}
            >
              <span className="font-mono text-xs font-bold opacity-60">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1">{o}</span>
              {reveal && isRight && <span>✓</span>}
              {reveal && chosen && !isRight && <span>✕</span>}
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <div className="mt-3 animate-pop-in rounded-xl bg-white/80 p-3.5">
          <p className={`font-display text-sm font-semibold ${correct ? "text-leaf-deep" : "text-coral"}`}>
            {correct ? "🎉 Chính xác!" : "💡 Chưa đúng, em xem lại nhé"}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
            <Rich text={explain} />
          </p>
        </div>
      )}
    </div>
  );
}

function CodeBlock({
  code,
  caption,
  preview,
}: {
  code: string;
  caption?: string;
  preview?: boolean;
}) {
  return (
    <div>
      {caption && <p className="mb-2 font-mono text-xs text-ink-soft">{caption}</p>}
      <div className={preview ? "grid gap-3 sm:grid-cols-2" : ""}>
        <pre className="overflow-x-auto rounded-xl bg-ink/95 p-4 font-mono text-[13px] leading-relaxed text-green-300">
          {code}
        </pre>
        {preview && (
          <div className="overflow-hidden rounded-xl border-2 border-ink/10 bg-white">
            <p className="border-b border-ink/10 bg-cream px-3 py-1.5 font-mono text-[11px] text-ink-soft">
              👀 Trình duyệt hiện ra
            </p>
            {/* sandbox rỗng: khung xem trước không chạy script, không đụng được
                vào trang chính — an toàn kể cả khi ví dụ có mã lạ */}
            <iframe
              title="Kết quả hiển thị"
              sandbox=""
              srcDoc={code}
              className="h-[180px] w-full border-0 bg-white"
            />
          </div>
        )}
      </div>
    </div>
  );
}

function Block({ block }: { block: TheoryBlock }) {
  switch (block.kind) {
    case "text":
      return (
        <p className="text-[15px] leading-[1.75] text-ink-soft">
          <Rich text={block.text} />
        </p>
      );

    case "list": {
      const Tag = block.ordered ? "ol" : "ul";
      return (
        <Tag className="space-y-2 pl-1">
          {block.items.map((it, i) => (
            <li key={i} className="flex gap-2.5 text-[15px] leading-[1.7] text-ink-soft">
              <span className="mt-[3px] shrink-0 font-mono text-xs font-bold text-sea">
                {block.ordered ? `${i + 1}.` : "•"}
              </span>
              <span>
                <Rich text={it} />
              </span>
            </li>
          ))}
        </Tag>
      );
    }

    case "cards": {
      const tone = TONE[block.tone ?? "sea"];
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          {block.items.map((c, i) => (
            <div key={i} className={`rounded-2xl border ${tone.box} p-4`}>
              <p className="text-2xl">{c.emoji}</p>
              <p className={`mt-1.5 font-display text-[15px] font-semibold ${tone.title}`}>{c.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                <Rich text={c.text} />
              </p>
            </div>
          ))}
        </div>
      );
    }

    case "compare":
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { pane: block.left, tone: TONE.coral },
            { pane: block.right, tone: TONE.sea },
          ].map(({ pane, tone }, i) => (
            <div key={i} className={`rounded-2xl border ${tone.box} p-4`}>
              <p className={`font-display text-[15px] font-semibold ${tone.title}`}>
                {pane.emoji} {pane.title}
              </p>
              <ul className="mt-2.5 space-y-1.5">
                {pane.items.map((it, j) => (
                  <li key={j} className="flex gap-2 text-sm leading-relaxed text-ink-soft">
                    <span className="mt-[2px] shrink-0 opacity-50">–</span>
                    <span>
                      <Rich text={it} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );

    case "steps":
      return (
        <ol className="relative space-y-4 border-l-2 border-dashed border-sea/25 pl-6">
          {block.items.map((s, i) => (
            <li key={i} className="relative">
              <span className="absolute -left-[34px] flex h-6 min-w-[24px] items-center justify-center rounded-full bg-sea px-1.5 font-mono text-[10px] font-bold text-white">
                {s.label}
              </span>
              <p className="font-display text-[15px] font-semibold text-ink">{s.title}</p>
              <p className="mt-0.5 text-sm leading-relaxed text-ink-soft">
                <Rich text={s.text} />
              </p>
            </li>
          ))}
        </ol>
      );

    case "figure":
      return (
        <figure className="rounded-2xl border border-ink/5 bg-white p-3 shadow-card sm:p-4">
          {/* Trên điện thoại, ép hình giữ bề ngang tối thiểu rồi cho vuốt ngang.
              Nếu để hình co theo màn hình 375px thì chữ trong hình chỉ còn
              khoảng 6px — không đọc nổi. */}
          <div className="-mx-1 overflow-x-auto px-1">
            <div className="min-w-[600px] sm:min-w-0">
              <Diagram name={block.diagram} />
            </div>
          </div>
          <figcaption className="mt-2 text-center font-mono text-xs text-ink-soft/70">
            {block.caption}
          </figcaption>
          <p className="mt-1 text-center font-mono text-[11px] text-ink-soft/50 sm:hidden">
            ↔ vuốt ngang để xem hết hình
          </p>
        </figure>
      );

    case "code":
      return <CodeBlock code={block.code} caption={block.caption} preview={block.preview} />;

    case "example":
      return (
        <div className="rounded-2xl border-l-4 border-coral bg-coral/[0.07] px-4 py-3.5">
          <p className="font-display text-sm font-semibold text-coral">💬 {block.title}</p>
          <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">
            <Rich text={block.text} />
          </p>
        </div>
      );

    case "note":
      return (
        <div className="rounded-2xl border-2 border-dashed border-gold/50 bg-gold/[0.1] p-4 sm:p-5">
          <p className="font-display text-sm font-semibold text-gold-deep">📌 Ghi nhớ</p>
          <p className="mt-1.5 text-[15px] leading-[1.7] text-ink">
            <Rich text={block.text} />
          </p>
        </div>
      );

    case "update":
      return (
        <div className="rounded-2xl border-2 border-dashed border-ink/25 bg-ink/[0.04] p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="rounded-full bg-ink px-2.5 py-1 font-mono text-[11px] font-semibold text-white">
              🆕 Cập nhật 2026
            </span>
            <span className="font-mono text-[11px] text-ink-soft/70">
              ngoài SGK · đề thi không hỏi phần này
            </span>
          </div>
          <p className="mt-2.5 font-display text-[15px] font-semibold text-ink">{block.title}</p>
          <p className="mt-1 text-[15px] leading-[1.7] text-ink-soft">
            <Rich text={block.text} />
          </p>
          {block.items && (
            <ul className="mt-3 space-y-2.5">
              {block.items.map((it, i) => (
                <li key={i} className="flex gap-2.5 rounded-xl bg-white/70 p-3">
                  <span className="shrink-0 text-xl">{it.emoji}</span>
                  <span className="min-w-0">
                    <span className="block font-display text-sm font-semibold text-ink">{it.title}</span>
                    <span className="mt-0.5 block text-sm leading-relaxed text-ink-soft">
                      <Rich text={it.text} />
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      );

    case "check":
      return (
        <QuickCheck q={block.q} options={block.options} answer={block.answer} explain={block.explain} />
      );
  }
}

export default function TheoryViewer({
  lessonId,
  lessonTitle,
  topicName,
  theory,
  onBack,
  onGoQuiz,
}: {
  lessonId: string;
  lessonTitle: string;
  topicName: string;
  theory: LessonTheory;
  onBack: () => void;
  onGoQuiz: () => void;
}) {
  const [percent, setPercent] = useState(0);
  const bodyRef = useRef<HTMLDivElement>(null);
  const sectionIds = useMemo(() => theory.sections.map((s) => s.id), [theory]);
  const [activeId, setActiveId] = useState(sectionIds[0]);

  // Thanh tiến độ đọc + mục đang xem. Đọc hết bài thì đánh dấu đã học.
  useEffect(() => {
    function onScroll() {
      const el = bodyRef.current;
      if (!el) return;
      const total = el.scrollHeight - window.innerHeight;
      const done = total > 0 ? Math.min(100, Math.max(0, (window.scrollY / total) * 100)) : 100;
      setPercent(done);
      if (done > 92) markTheoryRead(lessonId);

      let seen = sectionIds[0];
      for (const id of sectionIds) {
        const node = document.getElementById(id);
        if (node && node.getBoundingClientRect().top <= 120) seen = id;
      }
      setActiveId(seen);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lessonId, sectionIds]);

  return (
    <div ref={bodyRef}>
      {/* Thanh tiến độ đọc bám trên đỉnh màn hình */}
      <div className="fixed inset-x-0 top-0 z-20 h-1 bg-ink/5">
        <div
          className="h-full bg-gradient-to-r from-sea to-coral transition-[width] duration-150"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="mx-auto max-w-2xl px-5 pt-8 sm:px-8">
        <header>
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={onBack}
              className="rounded-full border border-ink/10 bg-white px-3 py-1.5 font-mono text-xs text-ink-soft transition hover:border-sea/40 hover:text-sea-deep"
            >
              ← Quay lại
            </button>
            <p className="font-mono text-xs text-ink-soft">📖 Lý thuyết · ~{theory.minutes} phút đọc</p>
          </div>
          <h1 className="mt-3 font-display text-2xl font-bold leading-snug text-ink">{lessonTitle}</h1>
          <p className="mt-1 font-mono text-xs text-ink-soft/60">{topicName}</p>
          <p className="mt-4 rounded-2xl bg-white p-4 text-[15px] leading-[1.7] text-ink-soft shadow-card">
            <Rich text={theory.intro} />
          </p>
        </header>

        {/* Mục lục dạng chip, bấm nhảy tới mục */}
        <nav className="sticky top-1 z-10 -mx-5 mt-5 overflow-x-auto px-5 py-2 sm:-mx-8 sm:px-8">
          <div className="flex w-max gap-2">
            {theory.sections.map((s, i) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`whitespace-nowrap rounded-full border px-3 py-1.5 font-mono text-xs transition ${
                  activeId === s.id
                    ? "border-sea bg-sea text-white"
                    : "border-ink/10 bg-white text-ink-soft hover:border-sea/40"
                }`}
              >
                {i + 1}. {s.heading}
              </a>
            ))}
          </div>
        </nav>

        <div className="mt-4 space-y-8 pb-8">
          {theory.sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-16">
              <h2 className="flex items-center gap-2.5 font-display text-xl font-bold text-ink">
                <span className="text-2xl">{s.emoji}</span>
                {s.heading}
              </h2>
              <div className="mt-4 space-y-4">
                {s.blocks.map((b, i) => (
                  <Block key={i} block={b} />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Chốt bài */}
        <div className="rounded-2xl border border-ink/5 bg-white p-5 shadow-card sm:p-6">
          <p className="font-display text-lg font-bold text-ink">🎒 Ghi nhớ nhanh cả bài</p>
          <ul className="mt-3 space-y-2.5">
            {theory.summary.map((s, i) => (
              <li key={i} className="flex gap-2.5 text-[15px] leading-[1.7] text-ink-soft">
                <span className="mt-[3px] shrink-0 text-leaf">✔</span>
                <span>
                  <Rich text={s} />
                </span>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={onGoQuiz}
          className="mt-4 w-full rounded-full bg-gradient-to-r from-sea to-coral px-5 py-3 font-medium text-white transition hover:opacity-90"
        >
          Đã hiểu rồi — làm trắc nghiệm thôi 🎯
        </button>
        <button
          onClick={onBack}
          className="mt-2.5 w-full rounded-full border border-ink/10 bg-white px-5 py-2.5 text-sm font-medium text-ink-soft transition hover:border-sea/40"
        >
          ← Về danh sách phần luyện tập
        </button>
      </div>
    </div>
  );
}
