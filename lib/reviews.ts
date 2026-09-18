import type { LessonReview } from "@/lib/types";

// Ngân hàng "Ôn tập tổng kết" — thêm 1 dòng mỗi khi soạn xong 1 bài
import bai02 from "@/data/reviews/bai-02";
import bai03 from "@/data/reviews/bai-03";

export const REVIEW_BANK: Record<string, LessonReview> = {
  "bai-02": bai02,
  "bai-03": bai03,
};

export function getReview(lessonId: string): LessonReview | null {
  return REVIEW_BANK[lessonId] ?? null;
}
