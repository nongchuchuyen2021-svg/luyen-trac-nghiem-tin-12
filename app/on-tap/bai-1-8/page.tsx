import type { Metadata } from "next";
import ReviewClient from "@/components/ReviewClient";
export const metadata: Metadata = { title: "Ôn tập bài 1–8 | Tin học 12", description: "Đề cương 60 câu TNKQ, 12 câu đúng–sai và 8 câu tự luận. Luyện theo mức độ, xem giải thích và lưu kết quả Google Sheets." };
export default function Page(){ return <ReviewClient/>; }
