import type { LessonGame, TeamBattleGame } from "@/lib/types";
import { getQuestions } from "@/lib/questions";

// Ngân hàng game gắn với từng bài — thêm 1 dòng mỗi khi soạn xong 1 bài
import bai02 from "@/data/games/bai-02";
import bai03 from "@/data/games/bai-03";
import bai04 from "@/data/games/bai-04";
import bai05 from "@/data/games/bai-05";
import bai06 from "@/data/games/bai-06";

export const GAME_BANK: Record<string, LessonGame[]> = {
  "bai-02": bai02,
  "bai-03": bai03,
  "bai-04": bai04,
  "bai-05": bai05,
  "bai-06": bai06,
};

export function getLessonGames(lessonId: string): LessonGame[] {
  const custom = GAME_BANK[lessonId];
  if (custom && custom.length > 0) {
    return custom;
  }

  // Tự động sinh Đấu trường Đại chiến Các Nhóm cho tất cả các bài có câu hỏi trắc nghiệm
  const mcqs = getQuestions(lessonId);
  if (mcqs.length >= 4) {
    const autoTeamGame: TeamBattleGame = {
      kind: "team-battle",
      id: `team-battle-${lessonId}`,
      title: "Đấu trường Đại chiến Các Nhóm",
      emoji: "⚔️",
      instructions:
        "Chia lớp thành 2 - 4 nhóm đối kháng trực tiếp trên màn hình máy chiếu! Bấm chuông cướp quyền, rinh cúp vô địch môn Tin học 12!",
      questions: mcqs.map((q) => ({
        id: q.id,
        q: q.q,
        options: q.options,
        answer: q.answer,
        explain: q.explain,
        score: 100,
        damage: 25,
      })),
    };
    return [autoTeamGame];
  }

  return [];
}
