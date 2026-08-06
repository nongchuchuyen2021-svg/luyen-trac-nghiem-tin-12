import type { LessonTheory } from "./types";
import bai01 from "@/data/theory/bai-01";
import bai02 from "@/data/theory/bai-02";
import bai03 from "@/data/theory/bai-03";
import bai04 from "@/data/theory/bai-04";
import bai05 from "@/data/theory/bai-05";
import bai06 from "@/data/theory/bai-06";
import bai07 from "@/data/theory/bai-07";
import bai08 from "@/data/theory/bai-08";
import bai09 from "@/data/theory/bai-09";

// Bài lí thuyết tự học của từng bài.
// Thêm bài mới: tạo data/theory/<id>.ts rồi import và khai báo thêm một dòng
// ở đây — không cần sửa gì trong components.
//
// Bài nào chưa có ở bảng này thì thẻ "Lý thuyết" tự ẩn khỏi trang bài học.
export const THEORY_BANK: Record<string, LessonTheory> = {
  "bai-01": bai01,
  "bai-02": bai02,
  "bai-03": bai03,
  "bai-04": bai04,
  "bai-05": bai05,
  "bai-06": bai06,
  "bai-07": bai07,
  "bai-08": bai08,
  "bai-09": bai09,
};

export function getTheory(lessonId: string): LessonTheory | null {
  return THEORY_BANK[lessonId] ?? null;
}

export function hasTheory(lessonId: string): boolean {
  return lessonId in THEORY_BANK;
}
