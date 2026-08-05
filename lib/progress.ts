import type { LessonProgress, ProgressMap } from "./types";

const KEY = "ltn12:progress";

export function getProgress(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function getLessonProgress(lessonId: string): LessonProgress | null {
  return getProgress()[lessonId] ?? null;
}

// Phần Lý thuyết không chấm điểm, chỉ ghi nhận "đã đọc hết bài". Dùng chung
// kho tiến độ nhưng đặt hậu tố :lt để không lẫn vào số bài đã chinh phục ở
// trang chủ (chỗ đó chỉ đếm theo id bài trần).
export function theoryKey(lessonId: string) {
  return `${lessonId}:lt`;
}

export function markTheoryRead(lessonId: string) {
  if (typeof window === "undefined") return;
  const all = getProgress();
  const key = theoryKey(lessonId);
  if (all[key]?.best === 100) return; // đã ghi rồi thì thôi, đỡ ghi đè liên tục
  all[key] = {
    best: 100,
    attempts: (all[key]?.attempts ?? 0) + 1,
    lastAt: new Date().toISOString(),
  };
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function saveAttempt(lessonId: string, scorePercent: number) {
  if (typeof window === "undefined") return;
  const all = getProgress();
  const prev = all[lessonId];
  all[lessonId] = {
    best: Math.max(prev?.best ?? 0, scorePercent),
    attempts: (prev?.attempts ?? 0) + 1,
    lastAt: new Date().toISOString(),
  };
  localStorage.setItem(KEY, JSON.stringify(all));
}
