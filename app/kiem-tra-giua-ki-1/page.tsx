import type { Metadata } from "next";
import KiemTraGiuaKi1Client from "@/components/KiemTraGiuaKi1Client";

export const metadata: Metadata = {
  title: "Kiểm tra giữa kì 1 — Tin học 12 | THPT Na Rì",
  description:
    "Đề kiểm tra giữa kì 1 môn Tin học 12. 16 câu TNKQ, 3 câu TNĐS, 2 câu tự luận từ nguồn đề cương. Tự động đổi đề mới khi chuyển tab, lưu kết quả về Google Sheets.",
};

export default function Page() {
  return <KiemTraGiuaKi1Client />;
}
