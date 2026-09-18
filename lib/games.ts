import type { LessonGame } from "@/lib/types";

// Ngân hàng game gắn với từng bài — thêm 1 dòng mỗi khi soạn xong 1 bài
import bai02 from "@/data/games/bai-02";
import bai03 from "@/data/games/bai-03";
import bai04 from "@/data/games/bai-04";

export const GAME_BANK: Record<string, LessonGame[]> = {
  "bai-02": bai02,
  "bai-03": bai03,
  "bai-04": bai04,
};

export function getLessonGames(lessonId: string): LessonGame[] {
  return GAME_BANK[lessonId] ?? [];
}
