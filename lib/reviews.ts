import type { LessonReview } from "@/lib/types";

// Ngân hàng "Ôn tập tổng kết" — thêm 1 dòng mỗi khi soạn xong 1 bài
import bai02 from "@/data/reviews/bai-02";

export const REVIEW_BANK: Record<string, LessonReview> = {
  "bai-02": bai02,
};

export function getReview(lessonId: string): LessonReview | null {
  return REVIEW_BANK[lessonId] ?? null;
}
