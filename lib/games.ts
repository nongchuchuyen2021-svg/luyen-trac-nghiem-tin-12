import type { LessonGame } from "@/lib/types";

// Ngân hàng game tương tác gắn với từng bài — Hoàn thiện đầy đủ 28/28 bài học (3 game/bài)
import bai01 from "@/data/games/bai-01";
import bai02 from "@/data/games/bai-02";
import bai03 from "@/data/games/bai-03";
import bai04 from "@/data/games/bai-04";
import bai05 from "@/data/games/bai-05";
import bai06 from "@/data/games/bai-06";
import bai07 from "@/data/games/bai-07";
import bai08 from "@/data/games/bai-08";
import bai09 from "@/data/games/bai-09";
import bai10 from "@/data/games/bai-10";
import bai11 from "@/data/games/bai-11";
import bai12 from "@/data/games/bai-12";
import bai13 from "@/data/games/bai-13";
import bai14 from "@/data/games/bai-14";
import bai15 from "@/data/games/bai-15";
import bai16 from "@/data/games/bai-16";
import bai17 from "@/data/games/bai-17";
import bai18 from "@/data/games/bai-18";
import bai19 from "@/data/games/bai-19";
import bai20 from "@/data/games/bai-20";
import bai21 from "@/data/games/bai-21";
import bai22 from "@/data/games/bai-22";
import bai23 from "@/data/games/bai-23";
import bai24 from "@/data/games/bai-24";
import bai25 from "@/data/games/bai-25";
import bai26 from "@/data/games/bai-26";
import bai27 from "@/data/games/bai-27";
import bai28 from "@/data/games/bai-28";

export const GAME_BANK: Record<string, LessonGame[]> = {
  "bai-01": bai01,
  "bai-02": bai02,
  "bai-03": bai03,
  "bai-04": bai04,
  "bai-05": bai05,
  "bai-06": bai06,
  "bai-07": bai07,
  "bai-08": bai08,
  "bai-09": bai09,
  "bai-10": bai10,
  "bai-11": bai11,
  "bai-12": bai12,
  "bai-13": bai13,
  "bai-14": bai14,
  "bai-15": bai15,
  "bai-16": bai16,
  "bai-17": bai17,
  "bai-18": bai18,
  "bai-19": bai19,
  "bai-20": bai20,
  "bai-21": bai21,
  "bai-22": bai22,
  "bai-23": bai23,
  "bai-24": bai24,
  "bai-25": bai25,
  "bai-26": bai26,
  "bai-27": bai27,
  "bai-28": bai28,
};

export function getLessonGames(lessonId: string): LessonGame[] {
  return GAME_BANK[lessonId] ?? [];
}
