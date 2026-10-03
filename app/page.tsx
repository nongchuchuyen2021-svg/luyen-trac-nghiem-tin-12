import HomeClient from "@/components/HomeClient";
import { CURRICULUM } from "@/data/curriculum";
import { getQuestions } from "@/lib/questions";
import { getTF, getEssay } from "@/lib/extras";
import { hasTheory } from "@/lib/theory";
import { getLessonGames } from "@/lib/games";
import type { LessonCounts } from "@/lib/types";

// Đếm số câu từng dạng ngay lúc dựng trang (trang chủ là trang tĩnh) rồi
// truyền xuống HomeClient. Trước đây HomeClient tự đếm nên trình duyệt phải
// tải cả ngân hàng câu hỏi về chỉ để hiện một dòng chữ.
export default function HomePage() {
  const counts: Record<string, LessonCounts> = {};
  for (const topic of CURRICULUM) {
    for (const lesson of topic.lessons) {
      if (!lesson.available) continue;
      const games = getLessonGames(lesson.id);
      counts[lesson.id] = {
        mcq: getQuestions(lesson.id).length,
        tf: getTF(lesson.id).length,
        essay: getEssay(lesson.id).length,
        theory: hasTheory(lesson.id),
        games: games.length,
        hasArena: games.some((g) => g.kind === "arena" || g.kind === "team-battle"),
      };
    }
  }

  return <HomeClient counts={counts} />;
}
