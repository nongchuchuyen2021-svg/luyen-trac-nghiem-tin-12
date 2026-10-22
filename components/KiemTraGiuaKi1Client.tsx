"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  taoDeGiuaKi1,
  GIUA_KI_1_ID,
  GIUA_KI_1_TITLE,
  GIUA_KI_1_SUBTITLE,
  GIUA_KI_1_MINUTES,
  GIUA_KI_1_MC_COUNT,
  GIUA_KI_1_TF_COUNT,
  GIUA_KI_1_ESSAY_COUNT,
  GIUA_KI_1_TOTAL_QUESTIONS,
  type DeGiuaKi1,
} from "@/data/de-kiem-tra/giua-ki-1";
import {
  tinhDiemGiuaKi1,
  theoDoiTabGiuaKi1,
  dinhDangThoiGian,
  type GiuaKi1Answers,
  type GiuaKi1ScoringResult,
} from "@/lib/giua-ki-1";
import { getHocSinh, saveHocSinh, hopLe, chuanHoa } from "@/lib/hocsinh";
import {
  playCorrect,
  playWrong,
  playCelebration,
  playClick,
  playBuzzer,
} from "@/lib/sound";
import Confetti from "@/components/Confetti";

const OPTION_LABELS = ["A", "B", "C", "D"];
const STATEMENT_LABELS = ["a", "b", "c", "d"];

export default function KiemTraGiuaKi1Client() {
  const [giaiDoan, setGiaiDoan] = useState<"gioi-thieu" | "dang-lam" | "da-nop">("gioi-thieu");
  const [hoTen, setHoTen] = useState("");
  const [lop, setLop] = useState("");
  const [thongBaoLoi, setThongBaoLoi] = useState("");

  // Dữ liệu đề thi
  const [de, setDe] = useState<DeGiuaKi1 | null>(null);
  const [answers, setAnswers] = useState<GiuaKi1Answers>({
    mc: {},
    tf: {},
    essay: {},
  });
  const [cauHienTai, setCauHienTai] = useState(0); // 0-15: TNKQ, 16-18: TNĐS, 19-20: Tự luận

  // Bộ đếm thời gian
  const [giayConLai, setGiayConLai] = useState(GIUA_KI_1_MINUTES * 60);
  const hetGioLucRef = useRef(0);
  const thoiGianBatDauRef = useRef(0);

  // Giám sát gian lận / chuyển tab
  const [soLanDoiDe, setSoLanDoiDe] = useState(0);
  const [hienCanhBaoChuyenTab, setHienCanhBaoChuyenTab] = useState(false);
  const daNopRef = useRef(false);
  const deHienTaiRef = useRef<DeGiuaKi1 | null>(null);

  // Modal xác nhận nộp bài
  const [hienXacNhanNop, setHienXacNhanNop] = useState(false);

  // Kết quả sau khi nộp
  const [ketQua, setKetQua] = useState<GiuaKi1ScoringResult | null>(null);
  const [saveId, setSaveId] = useState("");
  const [trangThaiLuu, setTrangThaiLuu] = useState<"dang-luu" | "thanh-cong" | "that-bai">("dang-luu");
  const [thongBaoLuuSheets, setThongBaoLuuSheets] = useState("");
  const [thoiGianLuu, setThoiGianLuu] = useState("");

  const cauHoiRef = useRef<HTMLDivElement>(null);

  // Tự nạp thông tin học sinh từ bộ nhớ máy
  useEffect(() => {
    const hs = getHocSinh();
    if (hs) {
      setHoTen(hs.hoTen);
      setLop(hs.lop);
    }
  }, []);

  // Đếm ngược thời gian khi đang làm bài
  useEffect(() => {
    if (giaiDoan !== "dang-lam") return;
    const timer = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((hetGioLucRef.current - performance.now()) / 1000));
      setGiayConLai(remaining);
      if (remaining <= 0) {
        clearInterval(timer);
        nopBai(true);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [giaiDoan]);

  // CHỨC NĂNG CHỐNG GIAN LẬN: THEO DÕI CHUYỂN TAB HOẶC RỜI CỬA SỔ
  // "nếu chuyển tab sẽ load lại với đề mới hoàn toàn"
  useEffect(() => {
    if (giaiDoan !== "dang-lam") return;

    return theoDoiTabGiuaKi1(document, (hidden) => {
      if (daNopRef.current) return;
      if (!hidden) return; // Chỉ kích hoạt khi tab vừa bị ẩn (học sinh chuyển tab hoặc thu nhỏ)

      playBuzzer();

      // Lấy danh sách ID đề cũ để ưu tiên bốc câu hỏi mới
      const oldIds: string[] = [];
      if (deHienTaiRef.current) {
        oldIds.push(
          ...deHienTaiRef.current.mc.map((q) => q.id),
          ...deHienTaiRef.current.tf.map((q) => q.id),
          ...deHienTaiRef.current.essay.map((q) => q.id)
        );
      }

      // TẠO ĐỀ MỚI HOÀN TOÀN
      const deMoi = taoDeGiuaKi1(oldIds);
      deHienTaiRef.current = deMoi;
      setDe(deMoi);

      // XÓA SẠCH MỌI CÂU TRẢ LỜI CỦA ĐỀ CŨ
      const freshAnswers: GiuaKi1Answers = { mc: {}, tf: {}, essay: {} };
      deMoi.mc.forEach((q) => (freshAnswers.mc[q.id] = null));
      deMoi.tf.forEach((q) => (freshAnswers.tf[q.id] = [null, null, null, null]));
      deMoi.essay.forEach((q) => (freshAnswers.essay[q.id] = { text: "", rubric: [false, false, false, false] }));
      setAnswers(freshAnswers);

      // Đưa về câu 1
      setCauHienTai(0);
      setHienXacNhanNop(false);
      setSoLanDoiDe((n) => n + 1);
      setHienCanhBaoChuyenTab(true);
    });
  }, [giaiDoan]);

  // Cuộn mượt đến câu hỏi hiện tại khi chuyển câu
  useEffect(() => {
    if (cauHoiRef.current) {
      cauHoiRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [cauHienTai]);

  // Danh sách ID đang hoạt động
  const activeMcIds = useMemo(() => de?.mc.map((q) => q.id) ?? [], [de]);
  const activeTfIds = useMemo(() => de?.tf.map((q) => q.id) ?? [], [de]);
  const activeEssayIds = useMemo(() => de?.essay.map((q) => q.id) ?? [], [de]);

  // Thống kê tiến độ làm bài
  const tienDo = useMemo(() => {
    if (!de) return { mcDone: 0, tfDone: 0, essayDone: 0, totalDone: 0 };
    const mcDone = de.mc.filter((q) => answers.mc[q.id] !== null && answers.mc[q.id] !== undefined).length;
    const tfDone = de.tf.filter((q) => {
      const arr = answers.tf[q.id];
      return arr && arr.length === 4 && !arr.includes(null);
    }).length;
    const essayDone = de.essay.filter((q) => (answers.essay[q.id]?.text?.trim().length ?? 0) >= 10).length;
    return {
      mcDone,
      tfDone,
      essayDone,
      totalDone: mcDone + tfDone + essayDone,
    };
  }, [de, answers]);

  // BẮT ĐẦU LÀM BÀI
  function batDauLamBai() {
    if (!hopLe({ hoTen, lop })) {
      setThongBaoLoi("Vui lòng nhập đầy đủ họ và tên (ít nhất 2 tiếng) và tên lớp (ví dụ: 12A1).");
      return;
    }
    const hs = chuanHoa({ hoTen, lop });
    saveHocSinh(hs);
    setHoTen(hs.hoTen);
    setLop(hs.lop);
    setThongBaoLoi("");
    playClick();

    // Tạo đề thi đầu tiên
    const boDe = taoDeGiuaKi1();
    deHienTaiRef.current = boDe;
    setDe(boDe);

    // Khởi tạo đáp án rỗng
    const initialAnswers: GiuaKi1Answers = { mc: {}, tf: {}, essay: {} };
    boDe.mc.forEach((q) => (initialAnswers.mc[q.id] = null));
    boDe.tf.forEach((q) => (initialAnswers.tf[q.id] = [null, null, null, null]));
    boDe.essay.forEach((q) => (initialAnswers.essay[q.id] = { text: "", rubric: [false, false, false, false] }));
    setAnswers(initialAnswers);

    // Thiết lập thời gian
    const now = performance.now();
    thoiGianBatDauRef.current = now;
    hetGioLucRef.current = now + GIUA_KI_1_MINUTES * 60 * 1000;
    setGiayConLai(GIUA_KI_1_MINUTES * 60);

    setSoLanDoiDe(0);
    setHienCanhBaoChuyenTab(false);
    daNopRef.current = false;
    setCauHienTai(0);
    setGiaiDoan("dang-lam");
  }

  // Chọn đáp án trắc nghiệm khách quan
  function chonDapAnMC(mcQuestionId: string, optionIndex: number) {
    playClick();
    setAnswers((prev) => ({
      ...prev,
      mc: { ...prev.mc, [mcQuestionId]: optionIndex },
    }));
  }

  // Chọn đáp án Đúng/Sai từng ý
  function chonDapAnTF(tfQuestionId: string, statementIndex: number, val: boolean) {
    playClick();
    setAnswers((prev) => {
      const oldChoices = prev.tf[tfQuestionId] ?? [null, null, null, null];
      const newChoices = [...oldChoices];
      newChoices[statementIndex] = val;
      return {
        ...prev,
        tf: { ...prev.tf, [tfQuestionId]: newChoices },
      };
    });
  }

  // Nhập nội dung tự luận
  function nhapTuLuan(essayQuestionId: string, text: string) {
    setAnswers((prev) => ({
      ...prev,
      essay: {
        ...prev.essay,
        [essayQuestionId]: {
          text,
          rubric: prev.essay[essayQuestionId]?.rubric ?? [false, false, false, false],
        },
      },
    }));
  }

  // Tự đánh giá tiêu chí rubric sau khi nộp
  function capNhatRubric(essayQuestionId: string, rubricIndex: number, checked: boolean) {
    playClick();
    setAnswers((prev) => {
      const oldEntry = prev.essay[essayQuestionId] ?? { text: "", rubric: [false, false, false, false] };
      const newRubric = [...oldEntry.rubric];
      newRubric[rubricIndex] = checked;
      const updated = {
        ...prev,
        essay: {
          ...prev.essay,
          [essayQuestionId]: { ...oldEntry, rubric: newRubric },
        },
      };

      // Tự động tính lại điểm sau khi học sinh cập nhật rubric
      const newScore = tinhDiemGiuaKi1(updated, activeMcIds, activeTfIds, activeEssayIds);
      setKetQua(newScore);

      // Gửi cập nhật lên Google Sheets
      void guiKetQuaLenGoogleSheets(updated, newScore, saveId);
      return updated;
    });
  }

  // GỬI KẾT QUẢ LÊN GOOGLE SHEETS
  async function guiKetQuaLenGoogleSheets(
    currentAnswers: GiuaKi1Answers,
    currentScore: GiuaKi1ScoringResult,
    currentSaveId: string
  ) {
    setTrangThaiLuu("dang-luu");
    const thoiGianLamBai = Math.max(1, Math.round((performance.now() - thoiGianBatDauRef.current) / 1000));
    try {
      const res = await fetch("/api/kiem-tra-giua-ki-1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hoTen,
          lop,
          saveId: currentSaveId,
          answers: currentAnswers,
          activeMcIds,
          activeTfIds,
          activeEssayIds,
          soLanDoiDe,
          thoiGianLamBai,
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setTrangThaiLuu("thanh-cong");
        setThoiGianLuu(data.thoiGian || new Date().toLocaleTimeString("vi-VN"));
        setThongBaoLuuSheets("Đã lưu điểm và bài làm thành công vào Google Sheets!");
      } else {
        setTrangThaiLuu("that-bai");
        setThongBaoLuuSheets(data.loi || "Chưa lưu được vào Google Sheets. Em hãy bấm nút thử lưu lại nhé.");
      }
    } catch {
      setTrangThaiLuu("that-bai");
      setThongBaoLuuSheets("Lỗi kết nối mạng khi lưu Google Sheets. Kết quả vẫn được lưu an toàn trên máy.");
    }
  }

  // NỘP BÀI THI
  function nopBai(tuDong = false) {
    if (giaiDoan !== "dang-lam" || daNopRef.current) return;
    if (!tuDong && document.hidden) return; // Chống nộp khi tab không focus

    daNopRef.current = true;
    setHienXacNhanNop(false);

    // Tính điểm tổng hợp
    const scoring = tinhDiemGiuaKi1(answers, activeMcIds, activeTfIds, activeEssayIds);
    setKetQua(scoring);
    const newSaveId = `gk1-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setSaveId(newSaveId);

    setGiaiDoan("da-nop");

    // Phát âm thanh chúc mừng hoặc nhắc nhở
    if (scoring.totalScore >= 8.0) {
      playCelebration();
    } else if (scoring.totalScore >= 5.0) {
      playCorrect();
    } else {
      playWrong();
    }

    // Tự động lưu kết quả vào Google Sheets
    void guiKetQuaLenGoogleSheets(answers, scoring, newSaveId);
  }

  // =========================================================================
  // GIAI ĐOẠN 1: MÀN HÌNH GIỚI THIỆU & NHẬP THÔNG TIN
  // =========================================================================
  if (giaiDoan === "gioi-thieu") {
    return (
      <main className="min-h-screen bg-cream pb-16 pt-8 text-ink">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-white px-4 py-2 font-mono text-xs font-semibold text-ink-soft shadow-sm transition hover:border-sea hover:text-sea-deep"
            >
              ← Trang chủ Tin học 12
            </Link>
            <Link
              href="/on-tap/bai-1-8"
              className="inline-flex items-center gap-1.5 rounded-full border border-sea/20 bg-sea/5 px-4 py-2 font-mono text-xs font-semibold text-sea-deep transition hover:bg-sea/10"
            >
              📖 Xem đề cương ôn tập
            </Link>
          </div>

          <div className="overflow-hidden rounded-3xl border border-ink/10 bg-white p-6 shadow-card sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/5 pb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sea-deep px-3.5 py-1 font-mono text-xs font-bold text-white">
                ⏱️ BÀI KIỂM TRA ĐỊNH KÌ
              </span>
              <span className="font-mono text-xs font-semibold text-ink-soft">
                Tin học 12 · GDPT 2018 · Học kì 1
              </span>
            </div>

            <div className="mt-5">
              <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                {GIUA_KI_1_TITLE}
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {GIUA_KI_1_SUBTITLE}
              </p>
            </div>

            {/* Các thông số đề thi */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-2xl border border-ink/5 bg-cream p-3.5 text-center">
                <span className="font-mono text-xs text-ink-soft">Thời gian</span>
                <p className="mt-0.5 font-display text-xl font-bold text-sea-deep">
                  {GIUA_KI_1_MINUTES} <span className="text-xs font-normal text-ink-soft">phút</span>
                </p>
              </div>
              <div className="rounded-2xl border border-ink/5 bg-cream p-3.5 text-center">
                <span className="font-mono text-xs text-ink-soft">Số câu hỏi</span>
                <p className="mt-0.5 font-display text-xl font-bold text-ink">
                  {GIUA_KI_1_TOTAL_QUESTIONS} <span className="text-xs font-normal text-ink-soft">câu</span>
                </p>
              </div>
              <div className="rounded-2xl border border-ink/5 bg-cream p-3.5 text-center">
                <span className="font-mono text-xs text-ink-soft">Thang điểm</span>
                <p className="mt-0.5 font-display text-xl font-bold text-leaf-deep">
                  10,0 <span className="text-xs font-normal text-ink-soft">điểm</span>
                </p>
              </div>
              <div className="rounded-2xl border border-ink/5 bg-cream p-3.5 text-center">
                <span className="font-mono text-xs text-ink-soft">Lưu điểm</span>
                <p className="mt-0.5 font-display text-xs font-bold text-sea">
                  Google Sheets
                </p>
              </div>
            </div>

            {/* Cấu trúc đề chi tiết */}
            <div className="mt-6 rounded-2xl border border-ink/10 bg-slate-50 p-4">
              <h3 className="font-display text-xs font-bold uppercase tracking-wider text-ink-soft">
                Cấu trúc đề kiểm tra (21 câu):
              </h3>
              <ul className="mt-2.5 space-y-2 text-xs leading-relaxed text-ink-soft">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-sea-deep">● Phần I:</span>
                  <span><strong>16 câu Trắc nghiệm khách quan</strong> (4 phương án, 1 đáp án đúng). Mỗi câu 0,25 điểm = <strong>4,0 điểm</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-sea-deep">● Phần II:</span>
                  <span><strong>3 câu Trắc nghiệm Đúng/Sai</strong> (mỗi câu 4 ý độc lập). Thang điểm chuẩn Bộ GD&ĐT: đúng 1 ý = 0,1đ; đúng 2 ý = 0,25đ; đúng 3 ý = 0,5đ; đúng 4 ý = 1,0đ = <strong>3,0 điểm</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-sea-deep">● Phần III:</span>
                  <span><strong>2 câu Tự luận</strong> thực hành / vận dụng. Mỗi câu 4 tiêu chí rubric (mỗi câu 1,5đ) = <strong>3,0 điểm</strong>.</span>
                </li>
              </ul>
            </div>

            {/* CẢNH BÁO CHỐNG CHUYỂN TAB ĐẶC BIỆT */}
            <div className="mt-6 rounded-2xl border-2 border-berry/30 bg-berry/5 p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <span className="text-2xl sm:text-3xl">⚠️</span>
                <div>
                  <h3 className="font-display text-sm font-bold text-berry">
                    QUY CHẾ GIÁM SÁT CHUYỂN TAB TỰ ĐỘNG:
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-ink">
                    Hệ thống tích hợp công nghệ chống gian lận thời gian thực: <strong>Nếu em chuyển sang tab khác, mở ứng dụng khác hoặc thu nhỏ trình duyệt</strong> trong lúc làm bài, <strong>toàn bộ bài làm hiện tại sẽ bị hủy và hệ thống tự động tải lại một ĐỀ KIỂM TRA MỚI HOÀN TOÀN</strong>.
                  </p>
                  <p className="mt-1.5 text-xs font-semibold text-berry">
                    Thời gian làm bài vẫn tiếp tục đếm ngược. Vui lòng tập trung làm bài nghiêm túc trên một cửa sổ!
                  </p>
                </div>
              </div>
            </div>

            {/* Nhập họ tên và lớp */}
            <div className="mt-6 border-t border-ink/5 pt-6">
              <h2 className="font-display text-sm font-bold uppercase tracking-wider text-ink">
                Thông tin học sinh dự thi:
              </h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-ink-soft">
                    Họ và tên học sinh <span className="text-berry">*</span>
                  </label>
                  <input
                    type="text"
                    value={hoTen}
                    onChange={(e) => setHoTen(e.target.value)}
                    placeholder="Ví dụ: Nông Văn Hoàng"
                    maxLength={60}
                    className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm font-medium text-ink placeholder:text-ink-soft/40 focus:border-sea focus:outline-none focus:ring-2 focus:ring-sea/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-soft">
                    Lớp <span className="text-berry">*</span>
                  </label>
                  <input
                    type="text"
                    value={lop}
                    onChange={(e) => setLop(e.target.value)}
                    placeholder="Ví dụ: 12A1"
                    maxLength={12}
                    className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm font-medium uppercase text-ink placeholder:text-ink-soft/40 focus:border-sea focus:outline-none focus:ring-2 focus:ring-sea/20"
                  />
                </div>
              </div>

              {thongBaoLoi && (
                <p className="mt-3 text-xs font-semibold text-berry">
                  ⚠️ {thongBaoLoi}
                </p>
              )}

              <button
                onClick={batDauLamBai}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-sea-deep px-6 py-4 font-display text-base font-bold text-white shadow-lg transition hover:bg-sea active:scale-[0.99]"
              >
                🚀 Bắt đầu làm bài kiểm tra ({GIUA_KI_1_MINUTES} phút)
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // =========================================================================
  // GIAI ĐOẠN 2: ĐANG LÀM BÀI (CÓ CHỨC NĂNG CHỐNG CHUYỂN TAB)
  // =========================================================================
  if (giaiDoan === "dang-lam" && de) {
    const isMC = cauHienTai < GIUA_KI_1_MC_COUNT;
    const isTF = cauHienTai >= GIUA_KI_1_MC_COUNT && cauHienTai < GIUA_KI_1_MC_COUNT + GIUA_KI_1_TF_COUNT;
    const isEssay = cauHienTai >= GIUA_KI_1_MC_COUNT + GIUA_KI_1_TF_COUNT;

    const currentMC = isMC ? de.mc[cauHienTai] : null;
    const currentTF = isTF ? de.tf[cauHienTai - GIUA_KI_1_MC_COUNT] : null;
    const currentEssay = isEssay ? de.essay[cauHienTai - GIUA_KI_1_MC_COUNT - GIUA_KI_1_TF_COUNT] : null;

    return (
      <main className="min-h-screen bg-cream pb-24 text-ink">
        {/* Sticky Header: Đồng hồ, thông tin, nút nộp bài */}
        <header className="sticky top-0 z-30 border-b border-ink/10 bg-white/95 backdrop-blur-md">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2.5 sm:px-6">
            <div className="flex items-center gap-3">
              <span className="hidden font-display text-sm font-bold text-ink sm:inline">
                {GIUA_KI_1_TITLE}
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 font-mono text-xs font-semibold text-ink-soft">
                {hoTen} ({lop})
              </span>
              {soLanDoiDe > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-berry/10 px-2.5 py-1 font-mono text-xs font-bold text-berry">
                  ⚠️ Đã đổi đề: {soLanDoiDe} lần
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Đồng hồ đếm ngược */}
              <div
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-mono text-sm font-bold ${
                  giayConLai < 180
                    ? "animate-pulse bg-berry text-white"
                    : giayConLai < 600
                    ? "bg-coral/15 text-coral"
                    : "bg-sea/10 text-sea-deep"
                }`}
              >
                <span>⏱️</span>
                <span>{dinhDangThoiGian(giayConLai)}</span>
              </div>

              {/* Nút nộp bài */}
              <button
                onClick={() => setHienXacNhanNop(true)}
                className="rounded-full bg-leaf-deep px-4 py-1.5 font-display text-xs font-bold text-white shadow transition hover:bg-leaf"
              >
                Nộp bài ({tienDo.totalDone}/{GIUA_KI_1_TOTAL_QUESTIONS})
              </button>
            </div>
          </div>
        </header>

        {/* Modal cảnh báo chuyển tab nếu học sinh vừa bị đổi đề */}
        {hienCanhBaoChuyenTab && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="max-w-md animate-pop-in rounded-3xl border-2 border-berry bg-white p-6 shadow-2xl">
              <div className="text-center">
                <span className="text-5xl">🚨</span>
                <h3 className="mt-3 font-display text-xl font-bold text-berry">
                  VI PHẠM QUY CHẾ: ĐÃ CHUYỂN TAB!
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink">
                  Hệ thống phát hiện em vừa rời khỏi màn hình kiểm tra. Theo quy chế thi,{" "}
                  <strong>toàn bộ bài làm trước đó đã bị hủy và hệ thống đã tải lại một ĐỀ MỚI HOÀN TOÀN</strong>.
                </p>
                <div className="mt-3 rounded-xl bg-berry/10 p-3 text-xs text-berry font-semibold">
                  Số lần vi phạm chuyển tab: {soLanDoiDe} lần.
                </div>
                <p className="mt-3 text-xs text-ink-soft">
                  Thời gian làm bài vẫn đang tiếp tục. Vui lòng tập trung làm bài thi mới và không chuyển tab!
                </p>
                <button
                  onClick={() => setHienCanhBaoChuyenTab(false)}
                  className="mt-5 w-full rounded-2xl bg-berry py-3 font-display text-sm font-bold text-white shadow hover:bg-red-700"
                >
                  Tôi đã hiểu và tiếp tục làm bài mới
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal xác nhận nộp bài */}
        {hienXacNhanNop && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="max-w-md animate-pop-in rounded-3xl border border-ink/10 bg-white p-6 shadow-2xl">
              <h3 className="font-display text-lg font-bold text-ink">
                Xác nhận nộp bài kiểm tra?
              </h3>
              <p className="mt-2 text-sm text-ink-soft">
                Em đã hoàn thành <strong>{tienDo.totalDone}/{GIUA_KI_1_TOTAL_QUESTIONS}</strong> câu hỏi.
              </p>
              {tienDo.totalDone < GIUA_KI_1_TOTAL_QUESTIONS && (
                <div className="mt-3 rounded-xl bg-amber-50 p-3 text-xs text-amber-800">
                  ⚠️ Còn {GIUA_KI_1_TOTAL_QUESTIONS - tienDo.totalDone} câu chưa trả lời. Em có chắc chắn muốn nộp bài ngay bây giờ không?
                </div>
              )}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setHienXacNhanNop(false)}
                  className="rounded-xl border border-ink/10 px-4 py-2 text-xs font-semibold text-ink-soft hover:bg-slate-50"
                >
                  Quay lại làm tiếp
                </button>
                <button
                  onClick={() => nopBai(false)}
                  className="rounded-xl bg-leaf-deep px-5 py-2 text-xs font-bold text-white shadow hover:bg-leaf"
                >
                  Đồng ý nộp bài
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-6">
          {/* Bảng điều hướng 21 câu hỏi */}
          <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/5 pb-2.5">
              <span className="font-display text-xs font-bold uppercase tracking-wider text-ink-soft">
                Danh sách câu hỏi ({tienDo.totalDone}/{GIUA_KI_1_TOTAL_QUESTIONS} đã làm)
              </span>
              <div className="flex items-center gap-3 text-[11px] text-ink-soft">
                <span className="flex items-center gap-1">
                  <span className="h-3 w-3 rounded bg-sea-deep" /> Đang chọn
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-3 w-3 rounded bg-leaf/20 border border-leaf" /> Đã trả lời
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-3 w-3 rounded bg-slate-100 border border-slate-200" /> Chưa làm
                </span>
              </div>
            </div>

            {/* Phân nhóm câu hỏi */}
            <div className="mt-3 space-y-2.5">
              {/* Phần I: TNKQ 1-16 */}
              <div>
                <p className="text-[11px] font-bold text-ink-soft">Phần I: Trắc nghiệm khách quan (16 câu)</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {de.mc.map((q, idx) => {
                    const isDone = answers.mc[q.id] !== null && answers.mc[q.id] !== undefined;
                    const isCurrent = cauHienTai === idx;
                    return (
                      <button
                        key={q.id}
                        onClick={() => setCauHienTai(idx)}
                        className={`h-8 w-8 rounded-lg font-mono text-xs font-semibold transition ${
                          isCurrent
                            ? "bg-sea-deep text-white shadow"
                            : isDone
                            ? "border border-leaf bg-leaf/15 text-leaf-deep font-bold"
                            : "border border-slate-200 bg-slate-50 text-ink-soft hover:bg-slate-100"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Phần II: Đúng/Sai 17-19 */}
              <div>
                <p className="text-[11px] font-bold text-ink-soft">Phần II: Đúng / Sai (3 câu)</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {de.tf.map((q, idx) => {
                    const realIdx = GIUA_KI_1_MC_COUNT + idx;
                    const choices = answers.tf[q.id] ?? [null, null, null, null];
                    const count = choices.filter((c) => c !== null).length;
                    const isDone = count === 4;
                    const isCurrent = cauHienTai === realIdx;
                    return (
                      <button
                        key={q.id}
                        onClick={() => setCauHienTai(realIdx)}
                        className={`flex h-8 items-center gap-1 rounded-lg px-2.5 font-mono text-xs font-semibold transition ${
                          isCurrent
                            ? "bg-sea-deep text-white shadow"
                            : isDone
                            ? "border border-leaf bg-leaf/15 text-leaf-deep font-bold"
                            : count > 0
                            ? "border border-amber-300 bg-amber-50 text-amber-800"
                            : "border border-slate-200 bg-slate-50 text-ink-soft hover:bg-slate-100"
                        }`}
                      >
                        <span>Câu {realIdx + 1}</span>
                        <span className="text-[10px] opacity-75">({count}/4)</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Phần III: Tự luận 20-21 */}
              <div>
                <p className="text-[11px] font-bold text-ink-soft">Phần III: Tự luận (2 câu)</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {de.essay.map((q, idx) => {
                    const realIdx = GIUA_KI_1_MC_COUNT + GIUA_KI_1_TF_COUNT + idx;
                    const isDone = (answers.essay[q.id]?.text?.trim().length ?? 0) >= 10;
                    const isCurrent = cauHienTai === realIdx;
                    return (
                      <button
                        key={q.id}
                        onClick={() => setCauHienTai(realIdx)}
                        className={`flex h-8 items-center gap-1 rounded-lg px-2.5 font-mono text-xs font-semibold transition ${
                          isCurrent
                            ? "bg-sea-deep text-white shadow"
                            : isDone
                            ? "border border-leaf bg-leaf/15 text-leaf-deep font-bold"
                            : "border border-slate-200 bg-slate-50 text-ink-soft hover:bg-slate-100"
                        }`}
                      >
                        <span>Câu {realIdx + 1}</span>
                        {isDone && <span>✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* VÙNG NỘI DUNG CÂU HỎI */}
          <div ref={cauHoiRef} className="mt-6 rounded-3xl border border-ink/10 bg-white p-6 shadow-card sm:p-8">
            {/* 1. HIỂN THỊ CÂU HỎI TRẮC NGHIỆM KHÁCH QUAN (16 câu) */}
            {isMC && currentMC && (
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/5 pb-3">
                  <span className="font-mono text-xs font-bold text-sea-deep">
                    CÂU HỎI {cauHienTai + 1} / {GIUA_KI_1_TOTAL_QUESTIONS} · TNKQ
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 font-mono text-xs text-ink-soft">
                    {currentMC.lessonTitle}
                  </span>
                </div>

                <h2 className="mt-4 whitespace-pre-wrap font-display text-lg font-bold leading-relaxed text-ink">
                  {currentMC.q}
                </h2>

                {currentMC.code && (
                  <pre className="mt-4 overflow-x-auto rounded-2xl bg-slate-900 p-4 font-mono text-xs text-slate-100 shadow-inner">
                    <code>{currentMC.code}</code>
                  </pre>
                )}

                <div className="mt-6 space-y-3">
                  {currentMC.shuffledOptions.map((optionText, optIdx) => {
                    const originalIndex = currentMC.options.indexOf(optionText);
                    const isSelected = answers.mc[currentMC.id] === originalIndex;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => chonDapAnMC(currentMC.id, originalIndex)}
                        className={`flex w-full items-start gap-3.5 rounded-2xl border p-4 text-left transition ${
                          isSelected
                            ? "border-sea-deep bg-sea/10 shadow-sm"
                            : "border-slate-200 bg-white hover:border-sea/40 hover:bg-slate-50"
                        }`}
                      >
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl font-mono text-xs font-bold ${
                            isSelected
                              ? "bg-sea-deep text-white"
                              : "border border-slate-300 bg-slate-100 text-ink-soft"
                          }`}
                        >
                          {OPTION_LABELS[optIdx]}
                        </span>
                        <span className="mt-0.5 text-sm leading-relaxed text-ink">
                          {optionText}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. HIỂN THỊ CÂU HỎI ĐÚNG / SAI (3 câu) */}
            {isTF && currentTF && (
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/5 pb-3">
                  <span className="font-mono text-xs font-bold text-sea-deep">
                    CÂU HỎI {cauHienTai + 1} / {GIUA_KI_1_TOTAL_QUESTIONS} · ĐÚNG / SAI
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 font-mono text-xs text-ink-soft">
                    {currentTF.lessonTitle}
                  </span>
                </div>

                <div className="mt-4 rounded-2xl border border-sea/20 bg-sea/5 p-4 text-sm leading-relaxed text-ink">
                  <p className="font-bold text-sea-deep">Ngữ cảnh tình huống:</p>
                  <p className="mt-1 whitespace-pre-wrap">{currentTF.context}</p>
                </div>

                {currentTF.code && (
                  <pre className="mt-4 overflow-x-auto rounded-2xl bg-slate-900 p-4 font-mono text-xs text-slate-100 shadow-inner">
                    <code>{currentTF.code}</code>
                  </pre>
                )}

                <div className="mt-6 space-y-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-ink-soft">
                    Đánh giá từng ý sau đây là Đúng hay Sai:
                  </p>
                  {currentTF.statements.map((stmt, stmtIdx) => {
                    const chosenVal = answers.tf[currentTF.id]?.[stmtIdx] ?? null;
                    return (
                      <div
                        key={stmtIdx}
                        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <p className="text-sm leading-relaxed text-ink">
                            <strong className="text-sea-deep">Ý {STATEMENT_LABELS[stmtIdx]})</strong> {stmt.text}
                          </p>
                        </div>
                        <div className="mt-3 flex gap-3">
                          <button
                            type="button"
                            onClick={() => chonDapAnTF(currentTF.id, stmtIdx, true)}
                            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-bold transition ${
                              chosenVal === true
                                ? "border-leaf bg-leaf text-white shadow"
                                : "border-slate-200 bg-slate-50 text-ink-soft hover:bg-slate-100"
                            }`}
                          >
                            <span>✓</span> Đúng
                          </button>
                          <button
                            type="button"
                            onClick={() => chonDapAnTF(currentTF.id, stmtIdx, false)}
                            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-bold transition ${
                              chosenVal === false
                                ? "border-berry bg-berry text-white shadow"
                                : "border-slate-200 bg-slate-50 text-ink-soft hover:bg-slate-100"
                            }`}
                          >
                            <span>✕</span> Sai
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. HIỂN THỊ CÂU HỎI TỰ LUẬN (2 câu) */}
            {isEssay && currentEssay && (
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/5 pb-3">
                  <span className="font-mono text-xs font-bold text-sea-deep">
                    CÂU HỎI {cauHienTai + 1} / {GIUA_KI_1_TOTAL_QUESTIONS} · TỰ LUẬN
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 font-mono text-xs text-ink-soft">
                    {currentEssay.lessonTitle}
                  </span>
                </div>

                <h2 className="mt-4 whitespace-pre-wrap font-display text-lg font-bold leading-relaxed text-ink">
                  {currentEssay.q}
                </h2>

                {currentEssay.code && (
                  <pre className="mt-4 overflow-x-auto rounded-2xl bg-slate-900 p-4 font-mono text-xs text-slate-100 shadow-inner">
                    <code>{currentEssay.code}</code>
                  </pre>
                )}

                <div className="mt-6">
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-soft">
                    Bài làm của em (nhập văn bản hoặc mã HTML):
                  </label>
                  <textarea
                    rows={8}
                    maxLength={2000}
                    value={answers.essay[currentEssay.id]?.text ?? ""}
                    onChange={(e) => nhapTuLuan(currentEssay.id, e.target.value)}
                    placeholder="Viết câu trả lời hoặc đoạn mã HTML tại đây..."
                    className="mt-2 w-full rounded-2xl border border-ink/15 bg-white p-4 font-mono text-sm leading-relaxed text-ink placeholder:text-ink-soft/40 focus:border-sea focus:outline-none focus:ring-2 focus:ring-sea/20"
                  />
                  <div className="mt-1 flex items-center justify-between text-xs text-ink-soft">
                    <span>Yêu cầu tối thiểu 10 ký tự</span>
                    <span>
                      {(answers.essay[currentEssay.id]?.text?.length ?? 0)}/2000 ký tự
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Nút điều hướng trước / sau */}
            <div className="mt-8 flex items-center justify-between border-t border-ink/5 pt-4">
              <button
                disabled={cauHienTai === 0}
                onClick={() => setCauHienTai((prev) => Math.max(0, prev - 1))}
                className="rounded-xl border border-ink/10 px-4 py-2 font-mono text-xs font-semibold text-ink-soft transition hover:bg-slate-50 disabled:opacity-30"
              >
                ← Câu trước
              </button>

              {cauHienTai < GIUA_KI_1_TOTAL_QUESTIONS - 1 ? (
                <button
                  onClick={() => setCauHienTai((prev) => Math.min(GIUA_KI_1_TOTAL_QUESTIONS - 1, prev + 1))}
                  className="rounded-xl bg-sea-deep px-5 py-2 font-mono text-xs font-bold text-white shadow transition hover:bg-sea"
                >
                  Câu tiếp theo →
                </button>
              ) : (
                <button
                  onClick={() => setHienXacNhanNop(true)}
                  className="rounded-xl bg-leaf-deep px-6 py-2 font-display text-xs font-bold text-white shadow transition hover:bg-leaf"
                >
                  Nộp bài thi 📨
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    );
  }

  // =========================================================================
  // GIAI ĐOẠN 3: ĐÃ NỘP BÀI — XEM KẾT QUẢ & ĐỐI CHIẾU RUBRIC TỰ LUẬN
  // =========================================================================
  if (giaiDoan === "da-nop" && de && ketQua) {
    const isGood = ketQua.totalScore >= 8.0;

    return (
      <main className="min-h-screen bg-cream pb-16 pt-8 text-ink">
        {isGood && <Confetti />}

        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          {/* Header kết quả */}
          <div className="overflow-hidden rounded-3xl border border-ink/10 bg-white p-6 shadow-card sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/5 pb-4">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-sea-deep">
                🎉 KẾT QUẢ KIỂM TRA ĐỊNH KÌ GIỮA HỌC KÌ 1
              </span>
              <span className="font-mono text-xs font-semibold text-ink-soft">
                {hoTen} · Lớp {lop}
              </span>
            </div>

            <div className="mt-6 text-center">
              <span className="text-5xl">{isGood ? "🏆" : ketQua.totalScore >= 5.0 ? "🎯" : "💪"}</span>
              <h1 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">
                Điểm số: <span className="text-sea-deep">{ketQua.totalScore.toFixed(2)}</span> / 10,0
              </h1>
              <p className="mt-2 text-sm text-ink-soft">
                {ketQua.totalScore >= 9.0
                  ? "Xuất sắc! Em nắm rất vững kiến thức Tin học 12."
                  : ketQua.totalScore >= 8.0
                  ? "Giỏi lắm! Thành tích rất ấn tượng."
                  : ketQua.totalScore >= 6.5
                  ? "Khá tốt! Em hãy xem lại các câu chưa đúng để hoàn thiện hơn."
                  : ketQua.totalScore >= 5.0
                  ? "Đạt yêu cầu. Cần ôn tập kĩ hơn các bài lí thuyết và tự luận."
                  : "Chưa đạt yêu cầu. Em hãy luyện tập thêm trên hệ thống nhé."}
              </p>
            </div>

            {/* Chi tiết 3 phần điểm */}
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-ink/5 bg-cream p-4 text-center">
                <span className="font-mono text-xs text-ink-soft">Phần I: TNKQ (16 câu)</span>
                <p className="mt-1 font-display text-2xl font-bold text-sea-deep">
                  {ketQua.mcScore.toFixed(2)} <span className="text-xs font-normal text-ink-soft">/ 4,0đ</span>
                </p>
                <p className="mt-1 text-xs text-ink-soft">Đúng {ketQua.mcCorrect}/16 câu</p>
              </div>

              <div className="rounded-2xl border border-ink/5 bg-cream p-4 text-center">
                <span className="font-mono text-xs text-ink-soft">Phần II: Đúng/Sai (3 câu)</span>
                <p className="mt-1 font-display text-2xl font-bold text-sea-deep">
                  {ketQua.tfScore.toFixed(2)} <span className="text-xs font-normal text-ink-soft">/ 3,0đ</span>
                </p>
                <p className="mt-1 text-xs text-ink-soft">Đúng {ketQua.tfCorrectStatements}/12 ý</p>
              </div>

              <div className="rounded-2xl border border-ink/5 bg-cream p-4 text-center">
                <span className="font-mono text-xs text-ink-soft">Phần III: Tự luận (2 câu)</span>
                <p className="mt-1 font-display text-2xl font-bold text-sea-deep">
                  {ketQua.essayScore.toFixed(2)} <span className="text-xs font-normal text-ink-soft">/ 3,0đ</span>
                </p>
                <p className="mt-1 text-xs text-ink-soft">Tự đối chiếu rubric bên dưới</p>
              </div>
            </div>

            {/* Trạng thái lưu Google Sheets */}
            <div className="mt-6 rounded-2xl border border-ink/10 bg-slate-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">
                    {trangThaiLuu === "thanh-cong" ? "✅" : trangThaiLuu === "dang-luu" ? "⏳" : "⚠️"}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-ink">
                      {trangThaiLuu === "thanh-cong"
                        ? `Đã lưu vào Google Sheets lúc ${thoiGianLuu}`
                        : trangThaiLuu === "dang-luu"
                        ? "Đang lưu bài thi vào Google Sheets..."
                        : "Chưa lưu được vào Google Sheets"}
                    </p>
                    <p className="text-[11px] text-ink-soft">
                      {thongBaoLuuSheets || "Mã phiên bài thi: " + saveId}
                    </p>
                  </div>
                </div>

                {trangThaiLuu === "that-bai" && (
                  <button
                    onClick={() => guiKetQuaLenGoogleSheets(answers, ketQua, saveId)}
                    className="rounded-xl bg-sea px-4 py-1.5 font-mono text-xs font-semibold text-white shadow hover:bg-sea-deep"
                  >
                    Thử lưu lại
                  </button>
                )}
              </div>
            </div>

            {soLanDoiDe > 0 && (
              <p className="mt-3 text-center text-xs text-berry font-semibold">
                ⚠️ Trong quá trình làm bài, học sinh đã chuyển tab {soLanDoiDe} lần và hệ thống đã tải lại đề mới.
              </p>
            )}

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/"
                className="rounded-xl border border-ink/15 bg-white px-5 py-2.5 font-mono text-xs font-semibold text-ink-soft hover:bg-slate-50"
              >
                ← Về trang chủ
              </Link>
              <button
                onClick={() => {
                  setGiaiDoan("gioi-thieu");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="rounded-xl bg-sea-deep px-5 py-2.5 font-mono text-xs font-bold text-white shadow hover:bg-sea"
              >
                Làm bài kiểm tra mới ↺
              </button>
            </div>
          </div>

          {/* PHẦN ĐỐI CHIẾU RUBRIC TỰ LUẬN */}
          <div className="mt-8 rounded-3xl border border-ink/10 bg-white p-6 shadow-card sm:p-8">
            <h2 className="font-display text-xl font-bold text-ink">
              ✍️ Đối chiếu & Tự đánh giá phần Tự luận (3,0 điểm)
            </h2>
            <p className="mt-1 text-xs text-ink-soft">
              Học sinh đọc đáp án gợi ý chính thức và tích vào 4 tiêu chí rubric đạt được cho mỗi câu. Điểm tự luận sẽ tự động cập nhật lên Google Sheets.
            </p>

            <div className="mt-6 space-y-6">
              {de.essay.map((q, idx) => {
                const esEntry = answers.essay[q.id] ?? { text: "", rubric: [false, false, false, false] };
                const scoreThisQ = ketQua.essayScoresPerQuestion[idx] ?? 0;
                return (
                  <div key={q.id} className="rounded-2xl border border-ink/10 bg-slate-50/60 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/5 pb-3">
                      <span className="font-mono text-xs font-bold text-sea-deep">
                        CÂU TỰ LUẬN {idx + 1}: {q.lessonTitle}
                      </span>
                      <span className="rounded-full bg-sea/10 px-3 py-1 font-mono text-xs font-bold text-sea-deep">
                        Điểm: {scoreThisQ.toFixed(2)} / 1,5đ
                      </span>
                    </div>

                    <h3 className="mt-3 font-display text-base font-bold text-ink">
                      {q.q}
                    </h3>

                    {/* Bài làm của học sinh */}
                    <div className="mt-4 rounded-xl border border-ink/10 bg-white p-4">
                      <p className="text-xs font-bold text-ink-soft">Bài làm của em:</p>
                      <p className="mt-1.5 whitespace-pre-wrap font-mono text-xs leading-relaxed text-ink">
                        {esEntry.text?.trim() ? esEntry.text : "*(Em chưa nhập bài làm cho câu này)*"}
                      </p>
                    </div>

                    {/* Hướng dẫn đáp án mẫu */}
                    <div className="mt-4 rounded-xl border border-sea/20 bg-sea/5 p-4">
                      <p className="text-xs font-bold text-sea-deep">💡 Đáp án gợi ý chính thức:</p>
                      <pre className="mt-1.5 whitespace-pre-wrap font-sans text-xs leading-relaxed text-ink">
                        {q.answer}
                      </pre>
                    </div>

                    {/* 4 tiêu chí Rubric */}
                    <div className="mt-4 rounded-xl border border-ink/10 bg-white p-4">
                      <p className="text-xs font-bold text-ink-soft">
                        Đánh giá 4 tiêu chí (mỗi tiêu chí đạt được cộng 0,375 điểm):
                      </p>
                      <div className="mt-2 space-y-2">
                        {q.rubric.map((criteriaText, cIdx) => (
                          <label
                            key={cIdx}
                            className="flex cursor-pointer items-start gap-2.5 rounded-lg p-1.5 text-xs text-ink hover:bg-slate-50"
                          >
                            <input
                              type="checkbox"
                              checked={esEntry.rubric[cIdx] ?? false}
                              onChange={(e) => capNhatRubric(q.id, cIdx, e.target.checked)}
                              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-sea focus:ring-sea"
                            />
                            <span>{criteriaText}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* XEM LẠI CHI TIẾT CÂU HỎI TRẮC NGHIỆM VÀ ĐÁP ÁN */}
          <div className="mt-8 rounded-3xl border border-ink/10 bg-white p-6 shadow-card sm:p-8">
            <h2 className="font-display text-xl font-bold text-ink">
              📖 Xem lại đáp án và giải thích chi tiết
            </h2>
            <p className="mt-1 text-xs text-ink-soft">
              Đối chiếu phương án em đã chọn với đáp án đúng và lời giải chi tiết của từng câu hỏi.
            </p>

            {/* Chi tiết 16 câu TNKQ */}
            <div className="mt-6 space-y-5">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-sea-deep">
                Phần I: 16 câu Trắc nghiệm khách quan
              </h3>
              {de.mc.map((q, idx) => {
                const userChoice = answers.mc[q.id];
                const isCorrect = userChoice === q.answer;
                return (
                  <div
                    key={q.id}
                    className={`rounded-2xl border p-4 ${
                      isCorrect ? "border-leaf/30 bg-leaf/[0.03]" : "border-berry/30 bg-berry/[0.03]"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className={isCorrect ? "text-leaf-deep" : "text-berry"}>
                        {isCorrect ? "✓ Câu " + (idx + 1) + ": Chính xác (+0,25đ)" : "✕ Câu " + (idx + 1) + ": Chưa đúng"}
                      </span>
                      <span className="font-mono text-ink-soft">{q.lessonTitle}</span>
                    </div>

                    <p className="mt-2 font-display text-sm font-semibold text-ink">
                      {q.q}
                    </p>

                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {q.options.map((opt, oIdx) => {
                        const isUserPicked = userChoice === oIdx;
                        const isAnswer = q.answer === oIdx;
                        return (
                          <div
                            key={oIdx}
                            className={`rounded-xl border p-2.5 text-xs ${
                              isAnswer
                                ? "border-leaf bg-leaf/15 font-bold text-leaf-deep"
                                : isUserPicked
                                ? "border-berry bg-berry/15 font-semibold text-berry"
                                : "border-slate-200 bg-white text-ink-soft"
                            }`}
                          >
                            <span className="font-mono">{OPTION_LABELS[oIdx]}. </span>
                            {opt}
                            {isAnswer && " (Đáp án đúng)"}
                            {isUserPicked && !isAnswer && " (Em đã chọn)"}
                          </div>
                        );
                      })}
                    </div>

                    {q.explain && (
                      <p className="mt-3 rounded-xl bg-slate-100 p-3 text-xs leading-relaxed text-ink-soft">
                        <strong>💡 Giải thích:</strong> {q.explain}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Chi tiết 3 câu TNĐS */}
            <div className="mt-8 space-y-5">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-sea-deep">
                Phần II: 3 câu Trắc nghiệm Đúng / Sai
              </h3>
              {de.tf.map((q, idx) => {
                const userChoices = answers.tf[q.id] ?? [null, null, null, null];
                const scoreQ = ketQua.tfScoresPerQuestion[idx] ?? 0;
                return (
                  <div key={q.id} className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-sea-deep">
                        Câu {GIUA_KI_1_MC_COUNT + idx + 1}: {q.lessonTitle}
                      </span>
                      <span className="font-mono text-leaf-deep font-bold">
                        +{scoreQ.toFixed(2)} điểm
                      </span>
                    </div>

                    <p className="mt-2 rounded-xl bg-slate-50 p-3 text-xs text-ink">
                      {q.context}
                    </p>

                    <div className="mt-3 space-y-2">
                      {q.statements.map((stmt, sIdx) => {
                        const uChoice = userChoices[sIdx];
                        const isStmtCorrect = uChoice === stmt.answer;
                        return (
                          <div
                            key={sIdx}
                            className={`rounded-xl border p-3 text-xs ${
                              isStmtCorrect
                                ? "border-leaf/30 bg-leaf/5"
                                : "border-berry/30 bg-berry/5"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-ink">
                                <strong>Ý {STATEMENT_LABELS[sIdx]}):</strong> {stmt.text}
                              </p>
                              <span
                                className={`shrink-0 font-bold ${
                                  isStmtCorrect ? "text-leaf-deep" : "text-berry"
                                }`}
                              >
                                {isStmtCorrect ? "✓ Đúng" : "✕ Sai"}
                              </span>
                            </div>
                            <p className="mt-1 text-[11px] text-ink-soft">
                              Đáp án: <strong>{stmt.answer ? "Đúng" : "Sai"}</strong> · Em chọn:{" "}
                              <strong>{uChoice === null ? "Chưa chọn" : uChoice ? "Đúng" : "Sai"}</strong>.{" "}
                              {stmt.explain}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return null;
}
