import type { Metadata } from "next";
import KiemTraGiuaKi1Client from "@/components/KiemTraGiuaKi1Client";

export const metadata: Metadata = {
  title: "Kiểm tra giữa kì 1 — Tin học 12 | THPT Na Rì",
  description:
    "Đề kiểm tra giữa kì 1 môn Tin học 12 theo chương trình GDPT 2018. 16 câu TNKQ, 3 câu TNĐS, 2 câu tự luận từ nguồn đề cương bài 1–8. Tự động đổi đề mới khi chuyển tab và lưu kết quả về Google Sheets.",
};

export default function KiemTraGiuaKi1Page() {
  return <KiemTraGiuaKi1Client />;
}
