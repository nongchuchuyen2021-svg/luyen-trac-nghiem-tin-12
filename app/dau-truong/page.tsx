import { Metadata } from "next";
import DauTruongClient from "./DauTruongClient";

export const metadata: Metadata = {
  title: "Đấu Trường Nhiều Máy Tính (Mã PIN) — Tin Học 12",
  description: "Phòng thi đấu trực tuyến nhiều máy tính dành cho lớp học môn Tin học 12. Giáo viên làm Host trên máy chiếu, học sinh nhập mã PIN tham gia thi đấu thời gian thực.",
};

export default function DauTruongPage({
  searchParams,
}: {
  searchParams?: { pin?: string };
}) {
  const pin = searchParams?.pin || "";
  return (
    <main className="min-h-screen bg-slate-950 pb-16 pt-4 text-white">
      <DauTruongClient initialPin={pin} />
    </main>
  );
}
