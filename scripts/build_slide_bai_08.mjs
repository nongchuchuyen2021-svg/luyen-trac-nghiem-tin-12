import fs from 'node:fs';
import path from 'node:path';

// Trình biên soạn Slide bài giảng điện tử Bài 8: Định dạng văn bản
// SGK Tin học 12 (ICT - Kết nối tri thức, trang 46–51).
// Đỉnh cao hiệu ứng: Live Font Studio đổi cỡ/màu/phông thời gian thực,
// Interactive Typography Lab (8 kiểu chữ), mô phỏng Div vs Span block/inline,
// Live Code Playground, âm thanh Web Audio và pháo hoa.

const htmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bài 8: Định dạng văn bản — Tin học 12</title>
  <style>
    /* ─── RESET & BIẾN MÀU SẮC CHUẨN 2026 ─── */
    :root {
      --bg: #070E18;
      --bg-card: rgba(13, 24, 38, 0.95);
      --border-card: rgba(56, 225, 240, 0.18);
      --ink: #FFFFFF;
      --ink-soft: #94A3B8;
      --sea: #0D7C86;
      --sea-light: #38E1F0;
      --coral: #F2683C;
      --gold: #F5A623;
      --leaf: #10B981;
      --leaf-light: #34D399;
      --purple: #8B5CF6;
      --berry: #EC4899;
      --font-main: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      --font-mono: 'Consolas', 'Fira Code', 'Courier New', monospace;
      --ease-spring: cubic-bezier(0.16, 1, 0.3, 1);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: var(--font-main);
      background: var(--bg);
      color: var(--ink);
      overflow: hidden;
      width: 100vw; height: 100vh;
      user-select: none;
      -webkit-font-smoothing: antialiased;
    }

    /* ─── NỀN VŨ TRỤ SỐ MÃ NGUỒN ─── */
    .bg-mesh {
      position: fixed; inset: 0;
      background:
        radial-gradient(circle at 14% 16%, rgba(13, 124, 134, 0.32) 0, transparent 45%),
        radial-gradient(circle at 86% 84%, rgba(245, 166, 35, 0.25) 0, transparent 45%),
        radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.18) 0, transparent 60%);
      animation: meshPulse 14s ease-in-out infinite alternate;
      pointer-events: none; z-index: 0;
    }
    @keyframes meshPulse {
      0%   { transform: scale(1) translate(0, 0); opacity: 0.9; }
      100% { transform: scale(1.06) translate(-10px, 10px); opacity: 1; }
    }

    /* Thẻ định dạng HTML trôi nổi */
    .float-layer { position: fixed; inset: 0; pointer-events: none; z-index: 1; overflow: hidden; }
    .float-tag {
      position: absolute;
      font-family: var(--font-mono); font-size: 13px; font-weight: 700;
      color: rgba(56, 225, 240, 0.18);
      border: 1px solid rgba(56, 225, 240, 0.12);
      padding: 3px 10px; border-radius: 8px;
      background: rgba(13, 124, 134, 0.05);
      animation: floatUp 22s linear infinite;
    }
    @keyframes floatUp {
      0%   { transform: translateY(108vh) rotate(0deg); opacity: 0; }
      10%  { opacity: 0.45; }
      90%  { opacity: 0.45; }
      100% { transform: translateY(-10vh) rotate(360deg); opacity: 0; }
    }

    /* ─── DECK CONTAINER ─── */
    .deck-container {
      position: relative; width: 100vw; height: 100vh;
      display: flex; justify-content: center; align-items: center; z-index: 2;
    }

    /* ─── SLIDE FRAME ─── */
    .slide {
      position: absolute;
      width: 95vw; max-width: 1380px;
      height: 88vh; max-height: 870px;
      background: var(--bg-card);
      border: 1px solid var(--border-card);
      border-radius: 24px;
      backdrop-filter: blur(28px);
      box-shadow: 0 38px 85px rgba(0, 0, 0, 0.78), inset 0 1px 0 rgba(255, 255, 255, 0.12);
      padding: 26px 42px;
      display: flex; flex-direction: column;
      opacity: 0; pointer-events: none;
      transform: translateX(70px) scale(0.96);
      transition: transform 0.6s var(--ease-spring), opacity 0.5s ease;
      overflow-y: auto;
    }
    .slide::-webkit-scrollbar { width: 6px; }
    .slide::-webkit-scrollbar-thumb { background: rgba(56, 225, 240, 0.25); border-radius: 4px; }
    .slide.active  { opacity: 1; pointer-events: auto; transform: translateX(0) scale(1); z-index: 3; }
    .slide.prev    { opacity: 0; pointer-events: none; transform: translateX(-70px) scale(0.96); }

    /* ─── SLIDE HEADER ─── */
    .slide-header {
      display: flex; justify-content: space-between; align-items: flex-start;
      margin-bottom: 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 10px; flex-shrink: 0;
    }
    .slide-badge {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 3px 13px; border-radius: 20px;
      font-size: 12px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;
      background: rgba(13, 124, 134, 0.28); color: #38E1F0;
      border: 1px solid rgba(56, 225, 240, 0.35); margin-bottom: 4px;
    }
    .slide-badge.coral  { background: rgba(242, 104, 60, 0.25);  color: #FF855D; border-color: rgba(255, 133, 93, 0.35); }
    .slide-badge.gold   { background: rgba(245, 166, 35, 0.25);  color: #FFC043; border-color: rgba(255, 192, 67, 0.35); }
    .slide-badge.leaf   { background: rgba(16, 185, 129, 0.25);  color: #34D399; border-color: rgba(52, 211, 153, 0.35); }
    .slide-badge.purple { background: rgba(139, 92, 246, 0.25);  color: #C4B5FD; border-color: rgba(196, 181, 253, 0.35); }

    .slide-title {
      font-size: 26px; font-weight: 800; letter-spacing: -0.4px; line-height: 1.25;
      background: linear-gradient(135deg, #FFFFFF 40%, #BFEAF2 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .slide-subtitle { font-size: 13.5px; color: var(--ink-soft); margin-top: 2px; }

    .slide-body {
      flex: 1; display: flex; flex-direction: column;
      justify-content: center; gap: 12px; position: relative;
    }

    /* ─── REVEAL CONTROLLER ─── */
    .reveal-ctrl {
      display: flex; align-items: center; gap: 8px;
      background: rgba(0, 0, 0, 0.35); padding: 5px 13px;
      border-radius: 30px; border: 1px solid rgba(255, 255, 255, 0.1); font-size: 13px;
    }
    .reveal-status { font-weight: 800; color: #38E1F0; font-family: var(--font-mono); }
    .reveal-btn {
      background: linear-gradient(135deg, #0D7C86, #16A8B6); color: #FFF; border: none;
      padding: 5px 12px; border-radius: 16px; font-size: 12px; font-weight: 700;
      cursor: pointer; transition: all 0.25s var(--ease-spring);
      display: inline-flex; align-items: center; gap: 4px;
    }
    .reveal-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 14px rgba(56, 225, 240, 0.45); }

    /* ─── REVEAL ITEMS ─── */
    .reveal-item {
      opacity: 0; transform: translateY(22px) scale(0.97);
      transition: opacity 0.5s var(--ease-spring), transform 0.5s var(--ease-spring), box-shadow 0.4s;
      will-change: opacity, transform;
    }
    .slide.active .reveal-item.visible { opacity: 1; transform: translateY(0) scale(1); }
    .reveal-item.just-revealed {
      box-shadow: 0 0 28px rgba(56, 225, 240, 0.4), inset 0 0 16px rgba(56, 225, 240, 0.15);
      border-color: #38E1F0 !important;
    }

    /* ─── CARDS & GRIDS ─── */
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
    .card {
      background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.09);
      border-radius: 16px; padding: 14px 18px; position: relative; overflow: hidden;
      transition: transform 0.3s var(--ease-spring), border-color 0.3s;
    }
    .card:hover { transform: translateY(-3px); border-color: rgba(56, 225, 240, 0.3); }
    .card-title {
      font-size: 15px; font-weight: 700; color: #FFF; margin-bottom: 6px;
      display: flex; align-items: center; gap: 8px;
    }

    /* ─── CODE BOX ─── */
    .code-box {
      background: #0D1520; border: 1px solid rgba(56, 225, 240, 0.25);
      border-radius: 14px; overflow: hidden; box-shadow: 0 10px 26px rgba(0,0,0,0.5);
    }
    .code-header {
      background: rgba(255, 255, 255, 0.06); padding: 7px 13px;
      display: flex; justify-content: space-between; align-items: center;
      font-size: 11.5px; font-family: var(--font-mono); color: #94A3B8;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .code-content {
      padding: 13px 16px; font-family: var(--font-mono);
      font-size: 13px; line-height: 1.65; color: #E2E8F0;
      white-space: pre-wrap; overflow-x: auto;
    }
    .tag-kw  { color: #F2683C; font-weight: bold; }
    .attr-kw { color: #38E1F0; }
    .val-kw  { color: #10B981; }
    .cmt-kw  { color: #64748B; font-style: italic; }

    /* ─── PREVIEW BOX (NỀN TRẮNG CHUẨN TRÌNH DUYỆT) ─── */
    .preview-box {
      background: #FFFFFF; color: #111827; border-radius: 14px;
      padding: 14px 18px; font-family: var(--font-main);
      border: 2px solid #38E1F0; overflow-y: auto; max-height: 380px;
      box-shadow: 0 10px 28px rgba(0,0,0,0.5);
    }
    .preview-header {
      font-size: 10.5px; text-transform: uppercase; color: #64748B;
      font-weight: 700; margin-bottom: 8px;
      display: flex; justify-content: space-between;
      border-bottom: 1px dashed #CBD5E1; padding-bottom: 5px;
    }

    /* NÚT THAO TÁC SIMULATOR */
    .sim-btn {
      background: rgba(255, 255, 255, 0.08); color: #E2E8F0;
      border: 1px solid rgba(255, 255, 255, 0.18); padding: 5px 12px;
      border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer;
      transition: all 0.2s var(--ease-spring); display: inline-flex; align-items: center; gap: 5px;
    }
    .sim-btn:hover { background: rgba(56, 225, 240, 0.2); border-color: #38E1F0; color: #FFF; transform: translateY(-1px); }
    .sim-btn.active { background: #0D7C86; border-color: #38E1F0; color: #FFF; box-shadow: 0 0 12px rgba(56, 225, 240, 0.4); }

    /* ─── PLAYGROUND ─── */
    .playground-wrapper {
      display: grid; grid-template-columns: 1.1fr 1fr; gap: 14px; height: 460px;
    }
    .editor-pane {
      background: #0A1118; border: 1px solid rgba(56, 225, 240, 0.3);
      border-radius: 14px; display: flex; flex-direction: column; overflow: hidden;
    }
    .editor-bar {
      background: rgba(255, 255, 255, 0.05); padding: 7px 13px;
      display: flex; justify-content: space-between; align-items: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08); font-size: 11.5px;
    }
    .live-code-area {
      flex: 1; background: transparent; border: none; color: #F8FAFC;
      font-family: var(--font-mono); font-size: 13px; line-height: 1.65;
      padding: 13px; resize: none; outline: none; white-space: pre;
    }
    .preview-pane {
      background: #FFF; border-radius: 14px; border: 2px solid #38E1F0;
      overflow: hidden; display: flex; flex-direction: column;
    }
    .preview-pane-bar {
      background: #F1F5F9; padding: 7px 13px; border-bottom: 1px solid #CBD5E1;
      font-size: 11px; font-weight: 700; color: #64748B; text-transform: uppercase;
      display: flex; align-items: center; gap: 6px;
    }
    .preview-frame { flex: 1; border: none; width: 100%; height: 100%; background: white; }

    /* QUIZ CARDS */
    .quiz-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .quiz-card {
      background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 14px; padding: 14px; display: flex; flex-direction: column; gap: 8px;
    }
    .quiz-q { font-size: 13.5px; font-weight: 700; color: #FFF; line-height: 1.4; }
    .quiz-btn {
      background: rgba(255, 255, 255, 0.06); color: #E2E8F0;
      border: 1px solid rgba(255, 255, 255, 0.12); padding: 7px 11px;
      border-radius: 8px; font-size: 12px; text-align: left; cursor: pointer;
      transition: all 0.2s var(--ease-spring);
    }
    .quiz-btn:hover { background: rgba(56, 225, 240, 0.15); border-color: #38E1F0; color: #FFF; transform: translateX(4px); }
    .quiz-btn.correct { background: #059669 !important; border-color: #34D399 !important; color: #FFF !important; font-weight: 700; }
    .quiz-btn.wrong   { background: #DC2626 !important; border-color: #F87171 !important; color: #FFF !important; animation: shake 0.4s ease; }
    @keyframes shake { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-6px); } 40%, 80% { transform: translateX(6px); } }
    .quiz-feedback { font-size: 12px; margin-top: 3px; padding: 5px 9px; border-radius: 6px; display: none; line-height: 1.4; }

    /* CHECKLIST */
    .checklist-item {
      display: flex; align-items: center; gap: 10px;
      padding: 8px 12px; background: rgba(255, 255, 255, 0.04);
      border-radius: 8px; cursor: pointer; transition: all 0.2s;
      border: 1px solid rgba(255, 255, 255, 0.06); font-size: 13.5px;
    }
    .checklist-item:hover { background: rgba(56, 225, 240, 0.1); border-color: rgba(56, 225, 240, 0.3); }
    .checklist-item.done {
      background: rgba(16, 185, 129, 0.15); border-color: #10B981; color: #34D399; text-decoration: line-through;
    }

    /* ─── DECK NAV DƯỚI CÙNG ─── */
    .deck-nav {
      position: fixed; bottom: 13px; left: 50%; transform: translateX(-50%);
      background: rgba(8, 15, 24, 0.9); border: 1px solid rgba(255, 255, 255, 0.14);
      border-radius: 40px; padding: 6px 16px;
      display: flex; align-items: center; gap: 12px;
      backdrop-filter: blur(18px); z-index: 100;
      box-shadow: 0 10px 32px rgba(0, 0, 0, 0.65);
    }
    .nav-btn {
      background: transparent; border: none; color: #E2E8F0; font-size: 18px;
      cursor: pointer; padding: 3px 9px; border-radius: 20px;
      transition: all 0.2s; display: flex; align-items: center;
    }
    .nav-btn:hover { color: #38E1F0; background: rgba(255, 255, 255, 0.1); transform: scale(1.12); }
    .deck-progress { width: 220px; height: 6px; background: rgba(255, 255, 255, 0.14); border-radius: 3px; overflow: hidden; }
    .deck-progress-bar { height: 100%; width: 0; background: linear-gradient(90deg, #0D7C86, #F5A623, #38E1F0); transition: width 0.3s var(--ease-spring); }
    .deck-counter { font-size: 13px; font-weight: 700; color: #94A3B8; font-family: var(--font-mono); min-width: 56px; text-align: center; }

    #confettiCanvas { position: fixed; inset: 0; pointer-events: none; z-index: 999; }
  </style>
</head>
<body>

  <div class="bg-mesh"></div>
  <div class="float-layer">
    <div class="float-tag" style="left: 5%; animation-delay: 0s;">&lt;h1&gt;</div>
    <div class="float-tag" style="left: 18%; animation-delay: 4s;">&lt;p&gt;</div>
    <div class="float-tag" style="left: 32%; animation-delay: 9s;">style="color:red"</div>
    <div class="float-tag" style="left: 48%; animation-delay: 2s;">&lt;div&gt;</div>
    <div class="float-tag" style="left: 64%; animation-delay: 7s;">&lt;span&gt;</div>
    <div class="float-tag" style="left: 78%; animation-delay: 12s;">&lt;strong&gt;</div>
    <div class="float-tag" style="left: 88%; animation-delay: 16s;">font-size: 20px</div>
  </div>

  <canvas id="confettiCanvas"></canvas>
  <div class="deck-container">

    <!-- ══ SLIDE 1: TRANG BÌA ════════════════════════════════════════════════ -->
    <section class="slide active" id="slide-1" data-total-reveal="3">
      <div class="slide-header">
        <div>
          <span class="slide-badge">Tin học 12 · Định hướng ICT · Kết nối tri thức</span>
          <div class="slide-title">Bài 8. Định dạng văn bản trong HTML</div>
          <div class="slide-subtitle">Sách giáo khoa Tin học 12 (Trang 46 – 51) · Làm cho trang web đẹp và chuyên nghiệp</div>
        </div>
        <div class="reveal-ctrl">
          <span>✨ Hiệu ứng:</span>
          <span class="reveal-status" id="slide-1-status">0 / 3</span>
          <button class="reveal-btn" onclick="revealNext();">▶ Hiện ý (↓)</button>
          <button class="reveal-btn" style="background: rgba(255,255,255,0.15);" onclick="revealAll();">Hiện hết</button>
        </div>
      </div>
      <div class="slide-body">
        <div class="grid-3" style="margin-top: 8px;">
          <div class="card reveal-item" style="border-top: 4px solid #38E1F0; text-align: center; padding: 22px 16px;">
            <div style="font-size: 42px; margin-bottom: 10px;">📰</div>
            <div style="font-size: 16px; font-weight: 700; color: #38E1F0; margin-bottom: 6px;">Tiêu đề h1 – h6 &amp; Đoạn p</div>
            <p style="font-size: 13.5px; color: #CBD5E1; line-height: 1.5;">6 Cấp tiêu đề giảm dần về độ quan trọng · Đoạn văn bản tách biệt dòng với khoảng trống chuẩn.</p>
          </div>
          <div class="card reveal-item" style="border-top: 4px solid #F5A623; text-align: center; padding: 22px 16px;">
            <div style="font-size: 42px; margin-bottom: 10px;">🧱</div>
            <div style="font-size: 16px; font-weight: 700; color: #FFC043; margin-bottom: 6px;">Khối div &amp; Span</div>
            <p style="font-size: 13.5px; color: #CBD5E1; line-height: 1.5;">Phân biệt rõ ràng khối lớn xuống dòng mới (div) vs khối nhỏ nội dòng (span).</p>
          </div>
          <div class="card reveal-item" style="border-top: 4px solid #10B981; text-align: center; padding: 22px 16px;">
            <div style="font-size: 42px; margin-bottom: 10px;">🎨</div>
            <div style="font-size: 16px; font-weight: 700; color: #34D399; margin-bottom: 6px;">Kiểu chữ &amp; Thuộc tính style</div>
            <p style="font-size: 13.5px; color: #CBD5E1; line-height: 1.5;">8 Kiểu chữ Bảng 8.1 SGK · Đổi màu, cỡ chữ, phông chữ qua thuộc tính style linh hoạt.</p>
          </div>
        </div>

        <div class="card reveal-item" style="background: rgba(13, 124, 134, 0.15); border: 1px dashed rgba(56, 225, 240, 0.4); padding: 10px 18px; display: flex; align-items: center; justify-content: space-between;">
          <span style="font-size: 13.5px; color: #E2E8F0;">⌨️ <strong>Space/→</strong> chuyển slide · <strong>↓</strong> mở từng ý · <strong>F</strong> toàn màn hình · <strong>M</strong> bật/tắt âm thanh</span>
          <button class="sim-btn" onclick="nextSlide();" style="background: #0D7C86; color: white;">Khám phá ngay 🚀</button>
        </div>
      </div>
    </section>

    <!-- ══ SLIDE 2: THUỘC TÍNH THẺ HTML ═══════════════════════════════════════ -->
    <section class="slide" id="slide-2" data-total-reveal="3">
      <div class="slide-header">
        <div>
          <span class="slide-badge coral">Cú pháp cốt lõi · Trang 46</span>
          <div class="slide-title">Thuộc tính của Thẻ HTML — Bổ sung siêu năng lực</div>
          <div class="slide-subtitle">Mọi phần tử HTML đều có thể có thuộc tính để điều khiển cách hiển thị</div>
        </div>
        <div class="reveal-ctrl">
          <span>✨</span><span class="reveal-status" id="slide-2-status">0 / 3</span>
          <button class="reveal-btn" onclick="revealNext();">▶ Hiện ý</button>
          <button class="reveal-btn" style="background: rgba(255,255,255,0.15);" onclick="revealAll();">Hiện hết</button>
        </div>
      </div>
      <div class="slide-body">
        <div class="card reveal-item" style="border-left: 5px solid #38E1F0; padding: 12px 18px;">
          <div class="card-title">📖 Cú pháp thuộc tính chuẩn SGK:</div>
          <div style="font-family: var(--font-mono); font-size: 16px; font-weight: 700; color: #38E1F0; background: #0D1520; padding: 10px 16px; border-radius: 8px; margin: 8px 0; border: 1px solid rgba(56, 225, 240, 0.3);">
            &lt;Tên_thẻ <span style="color:#FFC043;">tên_thuộc_tính</span>=<span style="color:#10B981;">"giá trị"</span>&gt; Nội dung &lt;/Tên_thẻ&gt;
          </div>
          <p style="font-size: 13.5px; color: #CBD5E1; line-height: 1.6;">
            Thuộc tính của thẻ có tác dụng <strong>bổ sung thông tin, làm rõ các điều khiển được thẻ chỉ định</strong>.
          </p>
        </div>

        <div class="grid-2 reveal-item">
          <div class="card" style="border-top: 4px solid #10B981;">
            <div class="card-title" style="color: #34D399;">📍 Vị trí &amp; Quy tắc viết thuộc tính:</div>
            <ul style="margin-left: 18px; font-size: 13.5px; line-height: 1.7; color: #CBD5E1;">
              <li>Thuộc tính nằm trong <strong>thẻ bắt đầu (opening tag)</strong>, sau tên thẻ.</li>
              <li><strong>TUYỆT ĐỐI KHÔNG nằm trong thẻ kết thúc!</strong></li>
              <li>Nếu có nhiều hơn một thuộc tính, chúng được <strong>ngăn cách nhau bởi dấu cách</strong>.</li>
            </ul>
          </div>

          <div class="card" style="border-top: 4px solid #F5A623;">
            <div class="card-title" style="color: #FFC043;">🎨 Thuộc tính thần thánh: style</div>
            <p style="font-size: 13.5px; color: #CBD5E1; line-height: 1.6;">
              Một trong những thuộc tính dùng thường xuyên nhất là <strong>style</strong>. Nó cho phép thiết lập định dạng văn bản: <strong>màu sắc, phông chữ, cỡ chữ, kiểu chữ, căn lề, viền khung</strong>,... ngay tại phần tử đó!
            </p>
          </div>
        </div>

        <div class="card reveal-item" style="background: rgba(13, 124, 134, 0.12); padding: 10px 16px; font-size: 13px;">
          💡 <strong>Ví dụ:</strong> <code>&lt;p style="color:red" align="center"&gt;</code> mang 2 thuộc tính là <code>style</code> và <code>align</code>, cách nhau bởi một dấu cách!
        </div>
      </div>
    </section>

    <!-- ══ SLIDE 3: ĐỊNH DẠNG TIÊU ĐỀ H1 ĐẾN H6 ═══════════════════════════════ -->
    <section class="slide" id="slide-3" data-total-reveal="3">
      <div class="slide-header">
        <div>
          <span class="slide-badge gold">Trọng tâm SGK · Trang 46-47</span>
          <div class="slide-title">Sáu cấp tiêu đề: &lt;h1&gt; đến &lt;h6&gt;</div>
          <div class="slide-subtitle">Độ quan trọng và kích cỡ giảm dần từ h1 (lớn nhất) đến h6 (nhỏ nhất)</div>
        </div>
        <div class="reveal-ctrl">
          <span>✨</span><span class="reveal-status" id="slide-3-status">0 / 3</span>
          <button class="reveal-btn" onclick="revealNext();">▶ Hiện ý</button>
          <button class="reveal-btn" style="background: rgba(255,255,255,0.15);" onclick="revealAll();">Hiện hết</button>
        </div>
      </div>
      <div class="slide-body">
        <div class="grid-2">
          <!-- CODE MẪU SGK -->
          <div class="code-box reveal-item">
            <div class="code-header"><span>headings.html — Mã nguồn HTML</span><span>Màu đen mặc định</span></div>
            <div class="code-content">&lt;<span class="tag-kw">h1</span>&gt;Tin học 12 (Cấp 1 - Lớn nhất)&lt;/<span class="tag-kw">h1</span>&gt;
&lt;<span class="tag-kw">h2</span>&gt;Phần chung (Cấp 2)&lt;/<span class="tag-kw">h2</span>&gt;
&lt;<span class="tag-kw">h3</span>&gt;Chủ đề 1. Máy tính và xã hội (Cấp 3)&lt;/<span class="tag-kw">h3</span>&gt;
&lt;<span class="tag-kw">h4</span>&gt;1. Trí tuệ nhân tạo (Cấp 4)&lt;/<span class="tag-kw">h4</span>&gt;
&lt;<span class="tag-kw">h5</span>&gt;Tiêu đề cấp 5&lt;/<span class="tag-kw">h5</span>&gt;
&lt;<span class="tag-kw">h6</span>&gt;Tiêu đề cấp 6 - Nhỏ nhất&lt;/<span class="tag-kw">h6</span>&gt;</div>
          </div>

          <!-- PREVIEW CHUẨN SƯ PHẠM (CHỮ ĐEN ĐỒNG NHẤT) -->
          <div class="preview-box reveal-item">
            <div class="preview-header"><span>🌐 Kết quả hiển thị mặc định của trình duyệt</span></div>
            <h1 style="margin: 0 0 6px 0; font-size: 26px; color: #111827;">Tin học 12 (Cấp 1 - Lớn nhất)</h1>
            <h2 style="margin: 0 0 6px 0; font-size: 22px; color: #111827;">Phần chung (Cấp 2)</h2>
            <h3 style="margin: 0 0 6px 0; font-size: 18px; color: #111827;">Chủ đề 1. Máy tính và xã hội (Cấp 3)</h3>
            <h4 style="margin: 0 0 6px 0; font-size: 15px; color: #111827;">1. Trí tuệ nhân tạo (Cấp 4)</h4>
            <h5 style="margin: 0 0 4px 0; font-size: 13px; color: #111827;">Tiêu đề cấp 5</h5>
            <h6 style="margin: 0; font-size: 11px; color: #111827;">Tiêu đề cấp 6 - Nhỏ nhất</h6>
          </div>
        </div>

        <div class="card reveal-item" style="border-left: 5px solid #F5A623; padding: 10px 16px; font-size: 13px;">
          📌 <strong>Lưu ý sư phạm quan trọng:</strong> Trình duyệt mặc định hiển thị toàn bộ tiêu đề h1–h6 bằng <strong>màu đen đồng nhất</strong>. Tiêu đề không chỉ để chỉnh cỡ chữ, mà các công cụ tìm kiếm (như Google) dùng thẻ <code>&lt;h1&gt;</code> để xác định chủ đề chính của cả trang web!
        </div>
      </div>
    </section>

    <!-- ══ SLIDE 4: ĐOẠN VĂN BẢN <P> ═══════════════════════════════════════════ -->
    <section class="slide" id="slide-4" data-total-reveal="3">
      <div class="slide-header">
        <div>
          <span class="slide-badge leaf">Cấu trúc đoạn · Trang 47</span>
          <div class="slide-title">Đoạn văn bản: Thẻ &lt;p&gt; và Quy tắc khoảng trống</div>
          <div class="slide-subtitle">Cách đơn giản nhất để ngắt đoạn văn và tạo khoảng thở cho trang web</div>
        </div>
        <div class="reveal-ctrl">
          <span>✨</span><span class="reveal-status" id="slide-4-status">0 / 3</span>
          <button class="reveal-btn" onclick="revealNext();">▶ Hiện ý</button>
          <button class="reveal-btn" style="background: rgba(255,255,255,0.15);" onclick="revealAll();">Hiện hết</button>
        </div>
      </div>
      <div class="slide-body">
        <div class="grid-2">
          <!-- CODE VÀ MÔ TẢ -->
          <div class="card reveal-item" style="border-left: 4px solid #10B981;">
            <div class="card-title" style="color: #34D399;">Quy tắc thẻ &lt;p&gt; (Paragraph):</div>
            <ul style="margin-left: 18px; font-size: 13.5px; line-height: 1.7; color: #CBD5E1;">
              <li>Đặt nội dung trong cặp thẻ <code>&lt;p&gt;Nội dung&lt;/p&gt;</code>.</li>
              <li>Trình duyệt tự động hiển thị đoạn văn trên <strong>dòng mới</strong>, kèm <strong>khoảng trống nhỏ phía trước và phía sau đoạn</strong>.</li>
              <li>Phù hợp với văn bản chứa nhiều chữ, bài báo, tài liệu.</li>
            </ul>
            <div style="margin-top: 10px; padding: 8px 12px; background: rgba(239, 68, 68, 0.1); border-radius: 6px; border: 1px dashed #EF4444; font-size: 12.5px; color: #FCA5A5;">
              ⚠️ <strong>Điều cấm kỵ SGK:</strong> Trong thẻ <code>&lt;p&gt;</code> <strong>KHÔNG ĐƯỢC CHỨA</strong> tiêu đề h1–h6, danh sách, hay các phần tử dạng khối khác!
            </div>
          </div>

          <!-- MINH HOẠ SO SÁNH -->
          <div class="code-box reveal-item">
            <div class="code-header"><span>paragraph.html</span></div>
            <div class="code-content">&lt;<span class="tag-kw">p</span>&gt;Thẻ p tạo đoạn nội dung,&lt;/<span class="tag-kw">p</span>&gt;&lt;<span class="tag-kw">p</span>&gt;thẻ div tạo khối chứa dữ liệu.&lt;/<span class="tag-kw">p</span>&gt;
&lt;<span class="tag-kw">p</span>&gt;Các thẻ này&lt;<span class="tag-kw">br</span>&gt;không có hình thức riêng&lt;/<span class="tag-kw">p</span>&gt;&lt;<span class="tag-kw">p</span>&gt;mà được định dạng bằng style.&lt;/<span class="tag-kw">p</span>&gt;</div>
          </div>
        </div>

        <div class="preview-box reveal-item" style="max-height: 110px;">
          <div class="preview-header"><span>🌐 Kết quả hiển thị (Dù viết dính nhau trong code, trình duyệt vẫn tách dòng và có khoảng trống!)</span></div>
          <p style="margin: 4px 0;">Thẻ p tạo đoạn nội dung,</p>
          <p style="margin: 4px 0;">thẻ div tạo khối chứa dữ liệu.</p>
        </div>
      </div>
    </section>

    <!-- ══ SLIDE 5: KHỐI DIV VS SPAN (BLOCK VS INLINE) ═════════════════════════ -->
    <section class="slide" id="slide-5" data-total-reveal="3">
      <div class="slide-header">
        <div>
          <span class="slide-badge purple">Trọng tâm phân biệt · Trang 47-48</span>
          <div class="slide-title">Khối lớn &lt;div&gt; vs. Khối nhỏ &lt;span&gt;</div>
          <div class="slide-subtitle">Quan sát sự khác biệt kinh điển giữa Block-level (xuống dòng) và Inline-level (trong dòng)</div>
        </div>
        <div class="reveal-ctrl">
          <span>✨</span><span class="reveal-status" id="slide-5-status">0 / 3</span>
          <button class="reveal-btn" onclick="revealNext();">▶ Hiện ý</button>
          <button class="reveal-btn" style="background: rgba(255,255,255,0.15);" onclick="revealAll();">Hiện hết</button>
        </div>
      </div>
      <div class="slide-body">
        <div class="grid-2">
          <!-- BẢNG SO SÁNH DIV VS SPAN -->
          <div class="card reveal-item" style="border-top: 4px solid #38E1F0;">
            <div class="card-title" style="color: #38E1F0;">📦 &lt;div&gt; — Khối lớn (Division)</div>
            <ul style="margin-left: 18px; font-size: 13.5px; line-height: 1.7; color: #CBD5E1;">
              <li>Là <strong>một khối độc lập</strong>, luôn <strong>bắt đầu trên dòng mới</strong>.</li>
              <li>Chiếm trọn 100% chiều ngang của dòng.</li>
              <li>Dùng để gom nhóm nhiều phần tử, tạo khung phân chia bố cục trang web.</li>
            </ul>
          </div>

          <div class="card reveal-item" style="border-top: 4px solid #F5A623;">
            <div class="card-title" style="color: #FFC043;">🏷️ &lt;span&gt; — Khối nhỏ nội dòng</div>
            <ul style="margin-left: 18px; font-size: 13.5px; line-height: 1.7; color: #CBD5E1;">
              <li>Sử dụng cho <strong>quy mô nhỏ hơn</strong>.</li>
              <li>Hiển thị <strong>ngay trên cùng dòng đang viết</strong> (không ngắt dòng).</li>
              <li>Dùng để đổi màu, đổi phông cho <strong>một vài chữ nằm giữa câu</strong>.</li>
            </ul>
          </div>
        </div>

        <!-- MÔ PHỎNG VISUAL BOX MODEL -->
        <div class="grid-2 reveal-item">
          <div class="code-box">
            <div class="code-header"><span>div-span.html</span></div>
            <div class="code-content">&lt;<span class="tag-kw">p</span>&gt;Đoạn văn có &lt;<span class="tag-kw">span</span> <span class="attr-kw">style</span>=<span class="val-kw">"color:red"</span>&gt;một cụm span&lt;/<span class="tag-kw">span</span>&gt; nằm giữa dòng.&lt;/<span class="tag-kw">p</span>&gt;
&lt;<span class="tag-kw">div</span> <span class="attr-kw">style</span>=<span class="val-kw">"color:blue"</span>&gt;Còn div thì tự xuống dòng mới.&lt;/<span class="tag-kw">div</span>&gt;
&lt;<span class="tag-kw">p</span>&gt;Đoạn tiếp theo.&lt;/<span class="tag-kw">p</span>&gt;</div>
          </div>

          <div class="preview-box" style="font-size: 14.5px;">
            <div class="preview-header"><span>🌐 Kết quả trực quan</span></div>
            <p style="margin: 0 0 8px 0;">Đoạn văn có <span style="color:red; background: #FEE2E2; padding: 2px 6px; border-radius: 4px; border: 1px dashed red;">một cụm span</span> nằm giữa dòng.</p>
            <div style="color:blue; background: #DBEAFE; padding: 6px; border-radius: 4px; border: 1px dashed blue; margin-bottom: 8px;">
              Còn div thì tự xuống dòng mới (chiếm trọn khối ngang).
            </div>
            <p style="margin: 0;">Đoạn tiếp theo.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ SLIDE 6: BẢNG 8 KIỂU CHỮ SGK (BẢNG 8.1) ═════════════════════════════ -->
    <section class="slide" id="slide-6" data-total-reveal="3">
      <div class="slide-header">
        <div>
          <span class="slide-badge gold">Bảng tra cứu · Trang 48</span>
          <div class="slide-title">Bảng 8 Kiểu chữ thông dụng (Bảng 8.1 SGK)</div>
          <div class="slide-subtitle">Nhấn mạnh ngữ nghĩa và thay đổi hình thức trình bày văn bản</div>
        </div>
        <div class="reveal-ctrl">
          <span>✨</span><span class="reveal-status" id="slide-6-status">0 / 3</span>
          <button class="reveal-btn" onclick="revealNext();">▶ Hiện ý</button>
          <button class="reveal-btn" style="background: rgba(255,255,255,0.15);" onclick="revealAll();">Hiện hết</button>
        </div>
      </div>
      <div class="slide-body">
        <div class="card reveal-item" style="padding: 10px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr style="background: rgba(255,255,255,0.06); color: #38E1F0; border-bottom: 1px solid rgba(255,255,255,0.15);">
              <th style="padding: 7px; text-align: left;">Thẻ HTML</th>
              <th style="padding: 7px; text-align: left;">Ý nghĩa định dạng</th>
              <th style="padding: 7px; text-align: left;">Ví dụ trong mã</th>
              <th style="padding: 7px; text-align: left;">Kết quả hiển thị</th>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
              <td style="padding: 6px; font-family: var(--font-mono); color: #F2683C;">&lt;strong&gt; ; &lt;b&gt;</td>
              <td style="padding: 6px;">Chữ in <strong>đậm</strong></td>
              <td style="padding: 6px; font-family: var(--font-mono); font-size: 11.5px;">&lt;strong&gt;đậm&lt;/strong&gt;</td>
              <td style="padding: 6px; color: #34D399;"><strong>chữ đậm</strong></td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
              <td style="padding: 6px; font-family: var(--font-mono); color: #F2683C;">&lt;em&gt; ; &lt;i&gt;</td>
              <td style="padding: 6px;">Chữ in <em>nghiêng</em></td>
              <td style="padding: 6px; font-family: var(--font-mono); font-size: 11.5px;">&lt;em&gt;nghiêng&lt;/em&gt;</td>
              <td style="padding: 6px; color: #34D399;"><em>chữ nghiêng</em></td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
              <td style="padding: 6px; font-family: var(--font-mono); color: #F2683C;">&lt;u&gt;</td>
              <td style="padding: 6px;">Chữ <u>gạch chân</u></td>
              <td style="padding: 6px; font-family: var(--font-mono); font-size: 11.5px;">&lt;u&gt;gạch chân&lt;/u&gt;</td>
              <td style="padding: 6px; color: #34D399;"><u>chữ gạch chân</u></td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
              <td style="padding: 6px; font-family: var(--font-mono); color: #F2683C;">&lt;mark&gt;</td>
              <td style="padding: 6px;">Đánh dấu (bôi vàng)</td>
              <td style="padding: 6px; font-family: var(--font-mono); font-size: 11.5px;">&lt;mark&gt;bôi vàng&lt;/mark&gt;</td>
              <td style="padding: 6px;"><mark style="background:#FDE047;color:#111;padding:0 3px;">bôi vàng</mark></td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
              <td style="padding: 6px; font-family: var(--font-mono); color: #F2683C;">&lt;small&gt;</td>
              <td style="padding: 6px;">Giảm kích cỡ chữ</td>
              <td style="padding: 6px; font-family: var(--font-mono); font-size: 11.5px;">&lt;small&gt;nhỏ hơn&lt;/small&gt;</td>
              <td style="padding: 6px; color: #94A3B8;"><small>chữ nhỏ hơn</small></td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
              <td style="padding: 6px; font-family: var(--font-mono); color: #F2683C;">&lt;sup&gt; / &lt;sub&gt;</td>
              <td style="padding: 6px;">Chỉ số trên / Chỉ số dưới</td>
              <td style="padding: 6px; font-family: var(--font-mono); font-size: 11.5px;">x&lt;sup&gt;2&lt;/sup&gt; / H&lt;sub&gt;2&lt;/sub&gt;O</td>
              <td style="padding: 6px; color: #38E1F0;">x<sup>2</sup> / H<sub>2</sub>O</td>
            </tr>
            <tr>
              <td style="padding: 6px; font-family: var(--font-mono); color: #F2683C;">&lt;del&gt;</td>
              <td style="padding: 6px;">Đánh dấu xoá (gạch giữa chữ)</td>
              <td style="padding: 6px; font-family: var(--font-mono); font-size: 11.5px;">&lt;del&gt;gạch bỏ&lt;/del&gt;</td>
              <td style="padding: 6px; color: #F87171;"><del>chữ gạch bỏ</del></td>
            </tr>
          </table>
        </div>

        <div class="grid-2 reveal-item">
          <div class="card" style="border-left: 4px solid #38E1F0; font-size: 12.5px;">
            💡 <strong>strong/em vs b/i:</strong> Cùng có tác dụng in đậm/nghiêng, nhưng <code>&lt;strong&gt;</code> và <code>&lt;em&gt;</code> mang ý nghĩa <strong>nhấn mạnh về mặt ngữ nghĩa</strong> nên được khuyến khích sử dụng hơn.
          </div>
          <div class="card" style="border-left: 4px solid #F5A623; font-size: 12.5px;">
            ⚠️ <strong>Lưu ý HTML5:</strong> HTML5 không hỗ trợ thẻ <code>&lt;big&gt;</code> và <code>&lt;u&gt;</code>, nên thay bằng <code>font-size</code> và <code>text-decoration: underline</code> trong thuộc tính style.
          </div>
        </div>
      </div>
    </section>

    <!-- ══ SLIDE 7: PHÒNG THÍ NGHIỆM KIỂU CHỮ TƯƠNG TÁC ════════════════════════ -->
    <section class="slide" id="slide-7" data-total-reveal="1">
      <div class="slide-header">
        <div>
          <span class="slide-badge leaf">Thí nghiệm tương tác</span>
          <div class="slide-title">Phòng Thí nghiệm 8 Kiểu chữ — Bấm để biến hóa!</div>
          <div class="slide-subtitle">Nhấp chọn kiểu chữ để xem hiệu ứng thay đổi trực tiếp trên văn bản</div>
        </div>
        <div class="reveal-ctrl">
          <button class="sim-btn" onclick="resetTypographyDemo();">🔄 Đặt lại mặc định</button>
        </div>
      </div>
      <div class="slide-body">
        <div class="grid-2 reveal-item visible">
          <!-- BẢNG NÚT BẤM -->
          <div class="card">
            <div class="card-title">🎛️ Chọn hiệu ứng định dạng chữ:</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 10px;">
              <button class="sim-btn" onclick="applyTypeEffect('strong');"><strong>&lt;strong&gt; In đậm</strong></button>
              <button class="sim-btn" onclick="applyTypeEffect('em');"><em>&lt;em&gt; In nghiêng</em></button>
              <button class="sim-btn" onclick="applyTypeEffect('u');"><u>&lt;u&gt; Gạch chân</u></button>
              <button class="sim-btn" onclick="applyTypeEffect('mark');"><mark style="padding:0 4px;">&lt;mark&gt; Bôi vàng</mark></button>
              <button class="sim-btn" onclick="applyTypeEffect('small');"><small>&lt;small&gt; Chữ nhỏ</small></button>
              <button class="sim-btn" onclick="applyTypeEffect('sup');">x<sup>2</sup> &lt;sup&gt; Mũ trên</button>
              <button class="sim-btn" onclick="applyTypeEffect('sub');">H<sub>2</sub>O &lt;sub&gt; Chỉ số dưới</button>
              <button class="sim-btn" onclick="applyTypeEffect('del');"><del>&lt;del&gt; Gạch xóa</del></button>
            </div>
            <div id="type-code-display" style="margin-top: 12px; font-family: var(--font-mono); font-size: 12.5px; background: #0D1520; color: #38E1F0; padding: 10px; border-radius: 6px; border: 1px solid rgba(56, 225, 240, 0.3);">
              Mã HTML tương ứng sẽ xuất hiện tại đây...
            </div>
          </div>

          <!-- MÀN HÌNH PREVIEW TRỰC QUAN -->
          <div class="preview-box" style="display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 240px;">
            <div class="preview-header" style="width: 100%;"><span>🌐 Khung xem trước trực tiếp</span></div>
            <div id="type-preview-text" style="font-size: 22px; color: #111827; text-align: center; margin: 20px 0;">
              Tin học 12 rất thú vị!
            </div>
            <div id="type-explain-text" style="font-size: 13px; color: #64748B; font-style: italic;">
              ← Nhấp các nút bên trái để đổi kiểu chữ ngay lập tức!
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ SLIDE 8: THUỘC TÍNH STYLE ĐỊNH DẠNG PHÔNG CHỮ ═══════════════════════ -->
    <section class="slide" id="slide-8" data-total-reveal="3">
      <div class="slide-header">
        <div>
          <span class="slide-badge coral">Kỹ thuật trọng tâm · Trang 49</span>
          <div class="slide-title">Định dạng Phông chữ qua thuộc tính &lt;code&gt;style&lt;/code&gt;</div>
          <div class="slide-subtitle">Ba thuộc tính cốt lõi: color (màu sắc), font-family (phông chữ), font-size (cỡ chữ)</div>
        </div>
        <div class="reveal-ctrl">
          <span>✨</span><span class="reveal-status" id="slide-8-status">0 / 3</span>
          <button class="reveal-btn" onclick="revealNext();">▶ Hiện ý</button>
          <button class="reveal-btn" style="background: rgba(255,255,255,0.15);" onclick="revealAll();">Hiện hết</button>
        </div>
      </div>
      <div class="slide-body">
        <div class="grid-3 reveal-item">
          <!-- 1. MÀU SẮC -->
          <div class="card" style="border-top: 4px solid #38E1F0;">
            <div class="card-title" style="color: #38E1F0;">1. color: màu_sắc</div>
            <p style="font-size: 13px; color: #CBD5E1; line-height: 1.6;">
              Có thể đặt tên tiếng Anh (<code>red</code>, <code>green</code>, <code>blue</code>) hoặc dùng hệ màu RGB (<code>rgb(0,0,255)</code>).
            </p>
          </div>

          <!-- 2. PHÔNG CHỮ -->
          <div class="card" style="border-top: 4px solid #F5A623;">
            <div class="card-title" style="color: #FFC043;">2. font-family: tên_phông</div>
            <p style="font-size: 13px; color: #CBD5E1; line-height: 1.6;">
              Chọn kiểu phông hiển thị (<code>Tahoma</code>, <code>Arial</code>, <code>Times New Roman</code>, <code>Courier New</code>).
            </p>
          </div>

          <!-- 3. CỠ CHỮ -->
          <div class="card" style="border-top: 4px solid #10B981;">
            <div class="card-title" style="color: #34D399;">3. font-size: cỡ_chữ</div>
            <p style="font-size: 13px; color: #CBD5E1; line-height: 1.6;">
              Dùng số kèm đơn vị pixel (<code>20px</code>, <code>24px</code>) hoặc từ thông dụng (<code>small</code>, <code>large</code>).
            </p>
          </div>
        </div>

        <div class="card reveal-item" style="border-left: 5px solid #F5A623; padding: 12px 18px;">
          <div class="card-title" style="color: #FFC043;">⚠️ Quy tắc vàng khi gộp nhiều định dạng:</div>
          <p style="font-size: 14px; color: #E2E8F0; line-height: 1.6;">
            Khi muốn thực hiện <strong>nhiều định dạng phông đồng thời</strong>, ta đặt các cặp <code>tên:giá_trị</code> trong cùng MỘT thuộc tính style, <strong>ngăn cách nhau bởi dấu chấm phẩy ";"</strong>!
          </p>
          <div style="font-family: var(--font-mono); font-size: 14px; background: #0D1520; color: #34D399; padding: 10px; border-radius: 6px; margin-top: 6px; border: 1px solid #10B981;">
            &lt;p style="<span style="color:#38E1F0;">color: green</span>; <span style="color:#FFC043;">font-family: Tahoma</span>; <span style="color:#F472B6;">font-size: 20px</span>"&gt;Nội dung&lt;/p&gt;
          </div>
        </div>

        <div class="card reveal-item" style="background: rgba(239, 68, 68, 0.1); border-color: rgba(248, 113, 113, 0.3); padding: 10px 16px; font-size: 13px;">
          ❌ <strong>Lỗi học sinh hay mắc:</strong> Viết nhiều chữ style rời rạc (<code>&lt;p style="color:red" style="font-size:20px"&gt;</code>) hoặc dùng dấu phẩy để ngăn cách là SAI cú pháp!
        </div>
      </div>
    </section>

    <!-- ══ SLIDE 9: LIVE FONT STUDIO (THAY ĐỔI CỠ, MÀU, PHÔNG THỜI GIAN THỰC) ═ -->
    <section class="slide" id="slide-9" data-total-reveal="1">
      <div class="slide-header">
        <div>
          <span class="slide-badge leaf">Studio tương tác độc quyền</span>
          <div class="slide-title">Live Font Studio — Tự tay pha trộn định dạng</div>
          <div class="slide-subtitle">Kéo thanh trượt cỡ chữ, chọn màu, đổi phông và quan sát mã code tự sinh ra</div>
        </div>
        <div class="reveal-ctrl">
          <button class="sim-btn" onclick="resetFontStudio();">🔄 Đặt lại mặc định</button>
        </div>
      </div>
      <div class="slide-body">
        <div class="grid-2 reveal-item visible">
          <!-- BẢNG ĐIỀU KHIỂN STUDIO -->
          <div class="card" style="display: flex; flex-direction: column; gap: 12px;">
            <!-- THANH KÉO CỠ CHỮ -->
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 700; color: #38E1F0;">
                <span>Cỡ chữ (font-size):</span>
                <span id="lbl-size" style="font-family: var(--font-mono);">24px</span>
              </div>
              <input type="range" id="rng-size" min="14" max="42" value="24" oninput="updateFontStudio();" style="width: 100%; margin-top: 6px; cursor: pointer;">
            </div>

            <!-- CHỌN MÀU -->
            <div>
              <div style="font-size: 13px; font-weight: 700; color: #FFC043; margin-bottom: 6px;">Màu sắc (color):</div>
              <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                <button class="sim-btn active" onclick="setStudioColor('red');" style="color: tomato; border-color: tomato;">red</button>
                <button class="sim-btn" onclick="setStudioColor('blue');" style="color: #60CDFF; border-color: #60CDFF;">blue</button>
                <button class="sim-btn" onclick="setStudioColor('green');" style="color: #34D399; border-color: #34D399;">green</button>
                <button class="sim-btn" onclick="setStudioColor('#8B5CF6');" style="color: #C4B5FD; border-color: #C4B5FD;">#8B5CF6</button>
                <button class="sim-btn" onclick="setStudioColor('#EC4899');" style="color: #F472B6; border-color: #F472B6;">#EC4899</button>
              </div>
            </div>

            <!-- CHỌN PHÔNG -->
            <div>
              <div style="font-size: 13px; font-weight: 700; color: #34D399; margin-bottom: 6px;">Phông chữ (font-family):</div>
              <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                <button class="sim-btn active" onclick="setStudioFont('Tahoma');">Tahoma</button>
                <button class="sim-btn" onclick="setStudioFont('Arial');">Arial</button>
                <button class="sim-btn" onclick="setStudioFont('Courier New');">Courier New</button>
                <button class="sim-btn" onclick="setStudioFont('Times New Roman');">Times New Roman</button>
              </div>
            </div>

            <!-- MÃ CODE TỰ ĐỘNG SINH -->
            <div style="font-family: var(--font-mono); font-size: 12px; background: #0A1118; color: #E2E8F0; padding: 10px; border-radius: 6px; border: 1px solid rgba(56, 225, 240, 0.3);">
              &lt;p style="<span id="code-style-out" style="color: #38E1F0;">color: red; font-family: Tahoma; font-size: 24px;</span>"&gt;Văn bản mẫu&lt;/p&gt;
            </div>
          </div>

          <!-- MÀN HÌNH PREVIEW CHỮ SỐNG ĐỘNG -->
          <div class="preview-box" style="display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 260px;">
            <div class="preview-header" style="width: 100%;"><span>🌐 Kết quả trực tiếp</span></div>
            <div id="studio-preview-text" style="font-size: 24px; color: red; font-family: Tahoma; text-align: center; margin: auto; transition: all 0.2s var(--ease-spring);">
              Tin học 12 — Thiết kế Trang Web!
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ SLIDE 10: BÀI TOÁN THỰC HÀNH PHƯƠNG TRÌNH BẬC 2 (SGK TRANG 50) ══════ -->
    <section class="slide" id="slide-10" data-total-reveal="2">
      <div class="slide-header">
        <div>
          <span class="slide-badge gold">Bài thực hành SGK · Hình 8.3 Trang 50</span>
          <div class="slide-title">Bài toán thực hành: Biện luận Phương trình bậc 2</div>
          <div class="slide-subtitle">Vận dụng kết hợp tiêu đề h1/h3, thẻ span, chỉ số sup/sub, đậm strong, nghiêng em</div>
        </div>
        <div class="reveal-ctrl">
          <span>✨</span><span class="reveal-status" id="slide-10-status">0 / 2</span>
          <button class="reveal-btn" onclick="revealNext();">▶ Hiện ý</button>
          <button class="reveal-btn" style="background: rgba(255,255,255,0.15);" onclick="revealAll();">Hiện hết</button>
        </div>
      </div>
      <div class="slide-body">
        <div class="grid-2">
          <!-- CODE SGK -->
          <div class="code-box reveal-item">
            <div class="code-header"><span>phuongtrinhbac2.html</span></div>
            <div class="code-content">&lt;<span class="tag-kw">h1</span>&gt;Biện luận số nghiệm của phương trình bậc 2&lt;/<span class="tag-kw">h1</span>&gt;
&lt;<span class="tag-kw">h3</span>&gt;&lt;<span class="tag-kw">span</span> <span class="attr-kw">style</span>=<span class="val-kw">"color:rgb(205,0,0)"</span>&gt;Bài toán:&lt;/<span class="tag-kw">span</span>&gt;
Xác định số nghiệm của ax&lt;<span class="tag-kw">sup</span>&gt;2&lt;/<span class="tag-kw">sup</span>&gt; + bx + c = 0&lt;/<span class="tag-kw">h3</span>&gt;

&lt;<span class="tag-kw">h3</span> <span class="attr-kw">style</span>=<span class="val-kw">"color:rgb(205,0,0)"</span>&gt;Cách làm:&lt;/<span class="tag-kw">h3</span>&gt;
&lt;<span class="tag-kw">p</span>&gt;&lt;<span class="tag-kw">strong</span>&gt;B&lt;<span class="tag-kw">sub</span>&gt;1&lt;/<span class="tag-kw">sub</span>&gt;&lt;/<span class="tag-kw">strong</span>&gt;: Xác định hệ số a, b và c&lt;/<span class="tag-kw">p</span>&gt;
&lt;<span class="tag-kw">p</span>&gt;&lt;<span class="tag-kw">strong</span>&gt;B&lt;<span class="tag-kw">sub</span>&gt;2&lt;/<span class="tag-kw">sub</span>&gt;&lt;/<span class="tag-kw">strong</span>&gt;: Tính delta = b&lt;<span class="tag-kw">sup</span>&gt;2&lt;/<span class="tag-kw">sup</span>&gt; - 4ac&lt;/<span class="tag-kw">p</span>&gt;
&lt;<span class="tag-kw">p</span>&gt;&lt;<span class="tag-kw">strong</span>&gt;B&lt;<span class="tag-kw">sub</span>&gt;3&lt;/<span class="tag-kw">sub</span>&gt;&lt;/<span class="tag-kw">strong</span>&gt;: Kết luận&lt;<span class="tag-kw">br</span>&gt;
+ Nếu delta &lt; 0: Phương trình &lt;<span class="tag-kw">em</span>&gt;vô nghiệm&lt;/<span class="tag-kw">em</span>&gt;&lt;<span class="tag-kw">br</span>&gt;
+ Nếu delta = 0: Có &lt;<span class="tag-kw">em</span>&gt;nghiệm duy nhất&lt;/<span class="tag-kw">em</span>&gt;&lt;<span class="tag-kw">br</span>&gt;
+ Nếu delta &gt; 0: Có hai &lt;<span class="tag-kw">em</span>&gt;nghiệm phân biệt&lt;/<span class="tag-kw">em</span>&gt;&lt;/<span class="tag-kw">p</span>&gt;</div>
          </div>

          <!-- KẾT QUẢ PREVIEW CHUẨN SGK -->
          <div class="preview-box reveal-item" style="font-size: 13.5px;">
            <div class="preview-header"><span>🌐 Kết quả hiển thị (Khớp 100% Hình 8.3 SGK)</span></div>
            <h1 style="font-size: 20px; margin: 0 0 8px 0; color: #111827;">Biện luận số nghiệm của phương trình bậc 2</h1>
            <h3 style="font-size: 15px; margin: 0 0 6px 0; color: #111827;">
              <span style="color: rgb(205,0,0);">Bài toán:</span> Xác định số nghiệm của ax<sup>2</sup> + bx + c = 0 (a != 0)
            </h3>
            <h3 style="font-size: 15px; margin: 0 0 6px 0; color: rgb(205,0,0);">Cách làm:</h3>
            <p style="margin: 0 0 4px 0;"><strong>B<sub>1</sub></strong>: Xác định hệ số a, b và c</p>
            <p style="margin: 0 0 4px 0;"><strong>B<sub>2</sub></strong>: Tính <strong>delta</strong> = b<sup>2</sup> - 4ac</p>
            <p style="margin: 0 0 4px 0;">
              <strong>B<sub>3</sub></strong>: Kết luận<br>
              + Nếu <strong>delta</strong> &lt; 0: Phương trình <em>vô nghiệm</em><br>
              + Nếu <strong>delta</strong> = 0: Phương trình có <em>nghiệm duy nhất</em><br>
              + Nếu <strong>delta</strong> &gt; 0: Phương trình có hai <em>nghiệm phân biệt</em>
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ SLIDE 11: LIVE CODE PLAYGROUND ═════════════════════════════════════ -->
    <section class="slide" id="slide-11" data-total-reveal="1">
      <div class="slide-header">
        <div>
          <span class="slide-badge leaf">Thực hành thời gian thực</span>
          <div class="slide-title">Phòng Thực hành Code Trực tiếp — Bài 8</div>
          <div class="slide-subtitle">Chỉnh sửa code bên trái → Xem ngay bên phải. Thử nghiệm mọi thẻ định dạng!</div>
        </div>
        <div class="reveal-ctrl">
          <button class="sim-btn" onclick="loadTemplate8('tpl_headings');">📰 Mẫu 1: Tiêu đề</button>
          <button class="sim-btn" onclick="loadTemplate8('tpl_math');">📐 Mẫu 2: Toán &amp; Hóa</button>
          <button class="sim-btn" onclick="loadTemplate8('tpl_sgk');">🏆 Mẫu 3: Bài mẫu SGK</button>
        </div>
      </div>
      <div class="slide-body">
        <div class="playground-wrapper reveal-item visible">
          <div class="editor-pane">
            <div class="editor-bar">
              <span>📝 Soạn thảo HTML (gõ để thay đổi)</span>
              <button class="sim-btn" onclick="updatePlayground8();">▶ Chạy lại</button>
            </div>
            <textarea class="live-code-area" id="pg8-code" oninput="updatePlayground8();" spellcheck="false">&lt;h1 style="color: #0D7C86;"&gt;Tiêu đề lớn màu xanh ngọc&lt;/h1&gt;
&lt;p&gt;Đoạn văn có chữ &lt;strong&gt;in đậm&lt;/strong&gt;, &lt;em&gt;in nghiêng&lt;/em&gt; và &lt;mark&gt;bôi vàng&lt;/mark&gt;.&lt;/p&gt;
&lt;hr&gt;
&lt;p style="color: red; font-size: 20px; font-family: Tahoma;"&gt;
  Đoạn này chữ màu đỏ, phông Tahoma, cỡ 20px!
&lt;/p&gt;
&lt;p&gt;Công thức Hóa học: H&lt;sub&gt;2&lt;/sub&gt;O và Toán học: a&lt;sup&gt;2&lt;/sup&gt; + b&lt;sup&gt;2&lt;/sup&gt; = c&lt;sup&gt;2&lt;/sup&gt;&lt;/p&gt;</textarea>
          </div>
          <div class="preview-pane">
            <div class="preview-pane-bar">
              <span>🌐</span> Kết quả hiển thị ngay lập tức
            </div>
            <iframe class="preview-frame" id="pg8-frame"></iframe>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ SLIDE 12: ĐẤU TRƯỜNG TRẮC NGHIỆM 4 CÂU ═════════════════════════════ -->
    <section class="slide" id="slide-12" data-total-reveal="2">
      <div class="slide-header">
        <div>
          <span class="slide-badge coral">Kiểm tra kiến thức</span>
          <div class="slide-title">Đấu trường Trắc nghiệm — Bài 8 Tin học 12</div>
          <div class="slide-subtitle">Nhấp chọn đáp án để nhận phản hồi phân tích chi tiết và tính điểm tức thì</div>
        </div>
        <div class="reveal-ctrl">
          <span>✨</span><span class="reveal-status" id="slide-12-status">0 / 2</span>
          <button class="reveal-btn" onclick="revealNext();">▶ Hiện ý</button>
          <button class="reveal-btn" style="background: rgba(255,255,255,0.15);" onclick="revealAll();">Hiện hết</button>
        </div>
      </div>
      <div class="slide-body">
        <div class="quiz-grid">
          <!-- CÂU 1 -->
          <div class="quiz-card reveal-item">
            <div class="quiz-q">Câu 1: Thuộc tính của thẻ HTML được viết ở vị trí nào?</div>
            <button class="quiz-btn" onclick="checkQ(this, true, 'q1', 'Chính xác! Thuộc tính nằm trong thẻ bắt đầu, sau tên thẻ. Không nằm trong thẻ kết thúc!')">A. Trong thẻ bắt đầu, sau tên thẻ</button>
            <button class="quiz-btn" onclick="checkQ(this, false, 'q1', 'Sai rồi! Thẻ kết thúc chỉ có tên thẻ sau dấu /, không chứa thuộc tính.')">B. Trong thẻ kết thúc, sau dấu /</button>
            <button class="quiz-btn" onclick="checkQ(this, false, 'q1', 'Sai rồi! Chỉ viết ở thẻ bắt đầu.')">C. Ở cả thẻ bắt đầu và thẻ kết thúc</button>
            <button class="quiz-btn" onclick="checkQ(this, false, 'q1', 'Sai rồi! Thuộc tính phải nằm trong cặp dấu < >.')">D. Ở dòng riêng phía trên thẻ</button>
            <div class="quiz-feedback" id="q1-feedback"></div>
          </div>

          <!-- CÂU 2 -->
          <div class="quiz-card reveal-item">
            <div class="quiz-q">Câu 2: Điểm khác nhau cơ bản nhất giữa &lt;div&gt; và &lt;span&gt; là gì?</div>
            <button class="quiz-btn" onclick="checkQ(this, false, 'q2', 'Sai rồi! Cả hai đều có thể chứa chữ và hình ảnh.')">A. div dùng cho chữ, span dùng cho hình ảnh</button>
            <button class="quiz-btn" onclick="checkQ(this, true, 'q2', 'Chính xác! div là khối bắt đầu trên dòng mới (block), còn span dùng cho quy mô nhỏ trong dòng (inline)!')">B. div bắt đầu trên dòng mới, span nằm gọn trong dòng</button>
            <button class="quiz-btn" onclick="checkQ(this, false, 'q2', 'Sai rồi! Cả hai đều có thể dùng thuộc tính style.')">C. div bắt buộc có style, còn span thì không</button>
            <button class="quiz-btn" onclick="checkQ(this, false, 'q2', 'Sai rồi! Cả hai đều là thẻ đôi có thẻ đóng.')">D. span là thẻ đơn, còn div là thẻ đôi</button>
            <div class="quiz-feedback" id="q2-feedback"></div>
          </div>

          <!-- CÂU 3 -->
          <div class="quiz-card reveal-item">
            <div class="quiz-q">Câu 3: Muốn một đoạn văn bản vừa có chữ xanh, phông Tahoma, cỡ 20px thì viết thế nào?</div>
            <button class="quiz-btn" onclick="checkQ(this, false, 'q3', 'Sai rồi! Không được viết nhiều chữ style rời rạc.')">A. &lt;p style="color:blue" style="font-family:Tahoma" style="font-size:20px"&gt;</button>
            <button class="quiz-btn" onclick="checkQ(this, false, 'q3', 'Sai rồi! Các định dạng trong style phải ngăn nhau bằng dấu chấm phẩy ;, không phải dấu phẩy.')">B. &lt;p style="color:blue,font-family:Tahoma,font-size:20px"&gt;</button>
            <button class="quiz-btn" onclick="checkQ(this, true, 'q3', 'Chính xác! Đặt trong MỘT thuộc tính style và ngăn nhau bởi dấu chấm phẩy ; chuẩn cú pháp SGK!')">C. &lt;p style="color:blue; font-family:Tahoma; font-size:20px"&gt;</button>
            <button class="quiz-btn" onclick="checkQ(this, false, 'q3', 'Sai rồi! Đây là cú pháp HTML cổ xưa, HTML5 dùng style.')">D. &lt;p color="blue" font="Tahoma" size="20px"&gt;</button>
            <div class="quiz-feedback" id="q3-feedback"></div>
          </div>

          <!-- CÂU 4 -->
          <div class="quiz-card reveal-item">
            <div class="quiz-q">Câu 4: Vì sao SGK khuyến khích dùng &lt;strong&gt; và &lt;em&gt; hơn &lt;b&gt; và &lt;i&gt;?</div>
            <button class="quiz-btn" onclick="checkQ(this, false, 'q4', 'Sai rồi! Hình thức hiển thị hoàn toàn giống nhau.')">A. Vì strong và em hiển thị đẹp mắt hơn hẳn</button>
            <button class="quiz-btn" onclick="checkQ(this, true, 'q4', 'Chính xác! strong và em có ý nghĩa nhấn mạnh vào ngữ nghĩa của nội dung!')">B. Vì strong và em nhấn mạnh vào ngữ nghĩa của nội dung</button>
            <button class="quiz-btn" onclick="checkQ(this, false, 'q4', 'Sai rồi! b và i vẫn tồn tại trong HTML5.')">C. Vì b và i đã bị HTML5 loại bỏ hoàn toàn</button>
            <button class="quiz-btn" onclick="checkQ(this, false, 'q4', 'Sai rồi! b và i gõ ngắn hơn.')">D. Vì strong và em gõ nhanh hơn khi soạn thảo</button>
            <div class="quiz-feedback" id="q4-feedback"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ SLIDE 13: CHECKLIST KỸ NĂNG & TỔNG KẾT ═════════════════════════════ -->
    <section class="slide" id="slide-13" data-total-reveal="3">
      <div class="slide-header">
        <div>
          <span class="slide-badge gold">Tự đánh giá kỹ năng</span>
          <div class="slide-title">🎉 Chúc mừng em đã hoàn thành xuất sắc Bài 8!</div>
          <div class="slide-subtitle">Tự đánh giá các kỹ năng định dạng văn bản HTML mà em đã làm chủ</div>
        </div>
        <div class="reveal-ctrl">
          <span>✨</span><span class="reveal-status" id="slide-13-status">0 / 3</span>
          <button class="reveal-btn" onclick="revealNext();">▶ Hiện ý</button>
          <button class="reveal-btn" style="background: rgba(255,255,255,0.15);" onclick="revealAll();">Hiện hết</button>
        </div>
      </div>
      <div class="slide-body">
        <div class="grid-2">
          <!-- BẢNG CHECKLIST -->
          <div class="card reveal-item" style="border-left: 5px solid #10B981;">
            <div class="card-title" style="color: #34D399;">
              📋 Bấm để đánh dấu kỹ năng em đã thành thạo:
            </div>
            <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 8px;">
              <div class="checklist-item" onclick="toggleChecklistItem(this);">
                <span>⬜</span> <span>1. Sử dụng đúng 6 cấp tiêu đề &lt;h1&gt; đến &lt;h6&gt;</span>
              </div>
              <div class="checklist-item" onclick="toggleChecklistItem(this);">
                <span>⬜</span> <span>2. Tạo đoạn văn &lt;p&gt; và hiểu rõ quy tắc khoảng trống</span>
              </div>
              <div class="checklist-item" onclick="toggleChecklistItem(this);">
                <span>⬜</span> <span>3. Phân biệt chính xác khối lớn &lt;div&gt; vs khối nhỏ &lt;span&gt;</span>
              </div>
              <div class="checklist-item" onclick="toggleChecklistItem(this);">
                <span>⬜</span> <span>4. Thành thạo 8 kiểu chữ: strong, em, mark, sup, sub, del...</span>
              </div>
              <div class="checklist-item" onclick="toggleChecklistItem(this);">
                <span>⬜</span> <span>5. Định dạng màu sắc, cỡ chữ và phông chữ qua thuộc tính style</span>
              </div>
              <div class="checklist-item" onclick="toggleChecklistItem(this);">
                <span>⬜</span> <span>6. Kết hợp nhiều định dạng trong style bằng dấu chấm phẩy ";"</span>
              </div>
            </div>
          </div>

          <!-- TỔNG KẾT & LIÊN KẾT HỌC TẬP -->
          <div class="reveal-item" style="display: flex; flex-direction: column; gap: 10px;">
            <div class="card" style="border-left: 5px solid #38E1F0;">
              <div class="card-title" style="color: #38E1F0;">💡 Lời nhắn nhủ từ bài học:</div>
              <p style="font-size: 13.5px; line-height: 1.6; color: #CBD5E1;">
                Định dạng văn bản hợp lý giúp trang web rõ ràng, mạch lạc, thu hút người đọc và thân thiện với các cỗ máy tìm kiếm. Hãy luôn giữ cho mã nguồn HTML sạch sẽ và đúng chuẩn!
              </p>
            </div>

            <div class="card" style="text-align: center; padding: 16px;">
              <div style="font-size: 16px; font-weight: 700; color: white; margin-bottom: 10px;">
                Luyện tập trắc nghiệm &amp; Xem SGK điện tử
              </div>
              <div style="display: flex; gap: 10px; justify-content: center;">
                <a href="/luyen/bai-08" style="display: inline-flex; align-items: center; gap: 6px; background: #0D7C86; color: white; text-decoration: none; padding: 8px 16px; border-radius: 8px; font-weight: 700; font-size: 13px;">
                  ✍️ Luyện trắc nghiệm Bài 8
                </a>
                <a href="/sgk/bai-08.html" target="_blank" style="display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.08); color: white; text-decoration: none; padding: 8px 16px; border-radius: 8px; font-weight: 700; font-size: 13px; border: 1px solid rgba(255,255,255,0.2);">
                  📖 Đọc SGK Điện tử
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="card reveal-item" style="text-align: center; padding: 12px; background: rgba(13, 124, 134, 0.12); border-color: rgba(56, 225, 240, 0.4);">
          <button class="sim-btn" onclick="fireConfetti();" style="background: linear-gradient(135deg, #0D7C86, #38E1F0); color: white; font-weight: 800; padding: 8px 22px; font-size: 14px;">
            🎊 Bắn pháo hoa ăn mừng hoàn thành Bài 8!
          </button>
        </div>
      </div>
    </section>

  </div><!-- .deck-container -->

  <!-- ─── DECK NAV DƯỚI CÙNG ─── -->
  <div class="deck-nav">
    <button class="nav-btn" onclick="prevSlide();" title="Slide trước (←)">‹</button>
    <div class="deck-progress"><div class="deck-progress-bar" id="progressBar"></div></div>
    <div class="deck-counter" id="slideCounter">01 / 13</div>
    <button class="nav-btn" onclick="nextSlide();" title="Slide tiếp (→ / Space)">›</button>
    <button class="nav-btn" onclick="toggleMute();" id="muteBtn" title="Bật/Tắt âm thanh (M)">🔊</button>
    <button class="nav-btn" onclick="toggleFullScreen();" title="Toàn màn hình (F)">⛶</button>
  </div>

  <script>
    let currentSlide = 1;
    const TOTAL = 13;
    let isMuted = false;

    /* ─── WEB AUDIO API ─── */
    const audioCtx = (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined')
      ? new (window.AudioContext || window.webkitAudioContext)() : null;

    function _play(freq, type, dur, volPeak) {
      if (isMuted || !audioCtx) return;
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      osc.connect(g); g.connect(audioCtx.destination);
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      g.gain.setValueAtTime(volPeak || 0.18, audioCtx.currentTime);
      g.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + dur);
      osc.start(); osc.stop(audioCtx.currentTime + dur);
    }
    function playClick()   { _play(620, 'sine', 0.05, 0.12); }
    function playReveal()  { _play(440, 'triangle', 0.12, 0.18); setTimeout(() => _play(880, 'triangle', 0.1, 0.12), 70); }
    function playSuccess() { _play(523, 'sine', 0.09, 0.18); setTimeout(() => _play(659, 'sine', 0.09, 0.16), 80); setTimeout(() => _play(784, 'sine', 0.22, 0.15), 160); }
    function playWrong()   { _play(210, 'sawtooth', 0.18, 0.18); }
    function toggleMute()  { isMuted = !isMuted; document.getElementById('muteBtn').innerText = isMuted ? '🔇' : '🔊'; }

    /* ─── REVEAL ENGINE ─── */
    function getActiveSlide() { return document.getElementById('slide-' + currentSlide); }

    function updateRevealStatus() {
      const s = getActiveSlide(); if (!s) return;
      const total = s.querySelectorAll('.reveal-item').length;
      const visible = s.querySelectorAll('.reveal-item.visible').length;
      const el = document.getElementById('slide-' + currentSlide + '-status');
      if (el) el.innerText = visible + ' / ' + total;
    }

    function revealNext() {
      const s = getActiveSlide(); if (!s) return false;
      const hidden = [...s.querySelectorAll('.reveal-item:not(.visible)')];
      if (hidden.length) {
        hidden[0].classList.add('visible', 'just-revealed');
        playReveal();
        setTimeout(() => hidden[0].classList.remove('just-revealed'), 700);
        updateRevealStatus(); return true;
      }
      return false;
    }

    function revealAll() {
      const s = getActiveSlide(); if (!s) return;
      s.querySelectorAll('.reveal-item').forEach(i => i.classList.add('visible'));
      playClick(); updateRevealStatus();
    }

    function autoStagger(slide) {
      const items = slide.querySelectorAll('.reveal-item');
      items.forEach((item, i) => {
        setTimeout(() => { item.classList.add('visible'); updateRevealStatus(); }, (i + 1) * 150);
      });
    }

    /* ─── NAVIGATION ─── */
    function updateSlide() {
      document.querySelectorAll('.slide').forEach((s, i) => {
        const idx = i + 1;
        s.classList.remove('active', 'prev');
        if (idx === currentSlide) {
          s.classList.add('active');
          s.querySelectorAll('.reveal-item').forEach(el => el.classList.remove('visible'));
          autoStagger(s);
        } else if (idx < currentSlide) s.classList.add('prev');
      });
      const pct = (currentSlide / TOTAL) * 100;
      document.getElementById('progressBar').style.width = pct + '%';
      document.getElementById('slideCounter').innerText =
        String(currentSlide).padStart(2, '0') + ' / ' + String(TOTAL).padStart(2, '0');
      if (currentSlide === 11) setTimeout(updatePlayground8, 120);
      if (currentSlide === 13) setTimeout(fireConfetti, 400);
    }

    function nextSlide() { if (currentSlide < TOTAL) { currentSlide++; playClick(); updateSlide(); } }
    function prevSlide() { if (currentSlide > 1) { currentSlide--; playClick(); updateSlide(); } }

    function toggleFullScreen() {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
      else document.exitFullscreen().catch(() => {});
    }

    window.addEventListener('keydown', e => {
      if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); nextSlide(); }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp')            { e.preventDefault(); prevSlide(); }
      else if (e.key === 'ArrowDown')                               { e.preventDefault(); revealNext(); }
      else if (e.key === 'f' || e.key === 'F')                         { e.preventDefault(); toggleFullScreen(); }
      else if (e.key === 'm' || e.key === 'M')                         { e.preventDefault(); toggleMute(); }
      else if (e.key === 'Home')  { currentSlide = 1; updateSlide(); }
      else if (e.key === 'End')   { currentSlide = TOTAL; updateSlide(); }
    });

    /* ─── PHÒNG THÍ NGHIỆM KIỂU CHỮ (SLIDE 7) ─── */
    const typeEffects = {
      strong: { html: 'Tin học 12 &lt;strong&gt;rất thú vị&lt;/strong&gt;!', text: 'Tin học 12 <strong>rất thú vị</strong>!', msg: 'Đã bọc bằng &lt;strong&gt;...&lt;/strong&gt; để in đậm nhấn mạnh ngữ nghĩa!' },
      em:     { html: 'Tin học 12 &lt;em&gt;rất thú vị&lt;/em&gt;!',     text: 'Tin học 12 <em>rất thú vị</em>!',     msg: 'Đã bọc bằng &lt;em&gt;...&lt;/em&gt; để in nghiêng nhấn mạnh cảm xúc!' },
      u:      { html: 'Tin học 12 &lt;u&gt;rất thú vị&lt;/u&gt;!',       text: 'Tin học 12 <u>rất thú vị</u>!',       msg: 'Đã bọc bằng &lt;u&gt;...&lt;/u&gt; để gạch chân dưới chữ!' },
      mark:   { html: 'Tin học 12 &lt;mark&gt;rất thú vị&lt;/mark&gt;!', text: 'Tin học 12 <mark style="background:#FDE047;color:#111;">rất thú vị</mark>!', msg: 'Đã bọc bằng &lt;mark&gt;...&lt;/mark&gt; để bôi vàng đánh dấu như bút highlight!' },
      small:  { html: 'Tin học 12 &lt;small&gt;rất thú vị&lt;/small&gt;!', text: 'Tin học 12 <small>rất thú vị</small>!', msg: 'Đã bọc bằng &lt;small&gt;...&lt;/small&gt; để giảm kích cỡ chữ!' },
      sup:    { html: 'Phương trình x&lt;sup&gt;2&lt;/sup&gt; + y&lt;sup&gt;2&lt;/sup&gt; = z&lt;sup&gt;2&lt;/sup&gt;', text: 'Phương trình x<sup>2</sup> + y<sup>2</sup> = z<sup>2</sup>', msg: 'Thẻ &lt;sup&gt; tạo chỉ số trên dùng cho lũy thừa, số mũ!' },
      sub:    { html: 'Công thức H&lt;sub&gt;2&lt;/sub&gt;O và CO&lt;sub&gt;2&lt;/sub&gt;', text: 'Công thức H<sub>2</sub>O và CO<sub>2</sub>', msg: 'Thẻ &lt;sub&gt; tạo chỉ số dưới dùng cho công thức hóa học!' },
      del:    { html: 'Giá cũ: &lt;del&gt;100.000đ&lt;/del&gt; -> 80.000đ', text: 'Giá cũ: <del>100.000đ</del> -> 80.000đ', msg: 'Thẻ &lt;del&gt; tạo nét gạch ngang giữa chữ để đánh dấu nội dung bị xóa!' }
    };

    function applyTypeEffect(key) {
      playClick();
      const d = typeEffects[key];
      document.getElementById('type-code-display').innerHTML = '<code>' + d.html + '</code>';
      document.getElementById('type-preview-text').innerHTML = d.text;
      document.getElementById('type-explain-text').innerHTML = d.msg;
    }

    function resetTypographyDemo() {
      playClick();
      document.getElementById('type-code-display').innerText = 'Mã HTML tương ứng sẽ xuất hiện tại đây...';
      document.getElementById('type-preview-text').innerText = 'Tin học 12 rất thú vị!';
      document.getElementById('type-explain-text').innerText = '← Nhấp các nút bên trái để đổi kiểu chữ ngay lập tức!';
    }

    /* ─── LIVE FONT STUDIO (SLIDE 9) ─── */
    let curStudioSize = '24px';
    let curStudioColor = 'red';
    let curStudioFont = 'Tahoma';

    function setStudioColor(col) {
      playClick(); curStudioColor = col; updateFontStudio();
    }

    function setStudioFont(font) {
      playClick(); curStudioFont = font; updateFontStudio();
    }

    function updateFontStudio() {
      const val = document.getElementById('rng-size').value;
      curStudioSize = val + 'px';
      document.getElementById('lbl-size').innerText = curStudioSize;

      const preview = document.getElementById('studio-preview-text');
      preview.style.fontSize = curStudioSize;
      preview.style.color = curStudioColor;
      preview.style.fontFamily = curStudioFont;

      const codeStr = 'color: ' + curStudioColor + '; font-family: ' + curStudioFont + '; font-size: ' + curStudioSize + ';';
      document.getElementById('code-style-out').innerText = codeStr;
    }

    function resetFontStudio() {
      playClick();
      document.getElementById('rng-size').value = 24;
      curStudioSize = '24px';
      curStudioColor = 'red';
      curStudioFont = 'Tahoma';
      updateFontStudio();
    }

    /* ─── LIVE PLAYGROUND (SLIDE 11) ─── */
    const templates8 = {
      tpl_headings: \`<h1>Tiêu đề cấp 1: Tin học 12</h1>
<h2>Tiêu đề cấp 2: Chủ đề B</h2>
<h3>Tiêu đề cấp 3: Bài 8. Định dạng văn bản</h3>
<p>Mặc định trình duyệt hiển thị các tiêu đề h1-h6 bằng <strong>màu đen đồng nhất</strong>.</p>\`,
      tpl_math: \`<h2 style="color: #0D7C86;">Toán học & Hóa học</h2>
<p>Phương trình Pythagore: a<sup>2</sup> + b<sup>2</sup> = c<sup>2</sup></p>
<p>Phương trình Einstein: E = m · c<sup>2</sup></p>
<hr>
<p>Axit Sunfuric: H<sub>2</sub>SO<sub>4</sub></p>
<p>Khí Cacbonic: CO<sub>2</sub></p>\`,
      tpl_sgk: \`<h1>Biện luận số nghiệm phương trình bậc 2</h1>
<h3><span style="color:rgb(205,0,0)">Bài toán:</span> ax<sup>2</sup> + bx + c = 0</h3>
<h3 style="color:rgb(205,0,0)">Cách làm:</h3>
<p><strong>B<sub>1</sub></strong>: Xác định hệ số a, b, c</p>
<p><strong>B<sub>2</sub></strong>: Tính <strong>delta</strong> = b<sup>2</sup> - 4ac</p>
<p><strong>B<sub>3</sub></strong>: Kết luận<br>
+ delta &lt; 0: Phương trình <em>vô nghiệm</em><br>
+ delta = 0: <em>Nghiệm duy nhất</em><br>
+ delta &gt; 0: Hai <em>nghiệm phân biệt</em></p>\`
    };

    function loadTemplate8(key) {
      playClick();
      document.getElementById('pg8-code').value = templates8[key];
      updatePlayground8();
    }

    function updatePlayground8() {
      const code = document.getElementById('pg8-code').value;
      const frame = document.getElementById('pg8-frame');
      const doc = frame.contentDocument || frame.contentWindow.document;
      doc.open(); doc.write(code); doc.close();
    }

    /* ─── QUIZ ENGINE (SLIDE 12) ─── */
    function checkQ(btn, ok, qId, explain) {
      const parent = btn.closest('.quiz-card');
      parent.querySelectorAll('.quiz-btn').forEach(b => { b.disabled = true; b.style.pointerEvents = 'none'; });
      btn.classList.add(ok ? 'correct' : 'wrong');
      ok ? playSuccess() : playWrong();
      const fb = document.getElementById(qId + '-feedback');
      fb.style.display = 'block';
      fb.style.background = ok ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)';
      fb.style.border = '1px solid ' + (ok ? '#10B981' : '#EF4444');
      fb.style.color  = ok ? '#34D399' : '#FCA5A5';
      fb.innerHTML = (ok ? '🎉 <strong>Chính xác!</strong> ' : '❌ <strong>Chưa đúng!</strong> ') + explain;
    }

    /* ─── CHECKLIST (SLIDE 13) ─── */
    function toggleChecklistItem(item) {
      playClick();
      item.classList.toggle('done');
      const box = item.querySelector('span:first-child');
      box.innerText = item.classList.contains('done') ? '✅' : '⬜';
    }

    /* ─── CONFETTI CANVAS ─── */
    function fireConfetti() {
      playSuccess();
      const cvs = document.getElementById('confettiCanvas');
      const ctx = cvs.getContext('2d');
      cvs.width = window.innerWidth; cvs.height = window.innerHeight;
      const colors = ['#38E1F0', '#F5A623', '#F2683C', '#10B981', '#8B5CF6', '#FFFFFF'];
      const parts = Array.from({ length: 110 }, () => ({
        x: window.innerWidth / 2, y: window.innerHeight * 0.42,
        vx: (Math.random() - 0.5) * 18,
        vy: (Math.random() - 0.65) * 18,
        sz: Math.random() * 9 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1, rot: Math.random() * 360, vrot: (Math.random() - 0.5) * 14
      }));
      function render() {
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        let alive = false;
        parts.forEach(p => {
          p.x += p.vx; p.y += p.vy; p.vy += 0.38; p.alpha -= 0.013; p.rot += p.vrot;
          if (p.alpha > 0) {
            alive = true; ctx.save(); ctx.globalAlpha = p.alpha;
            ctx.translate(p.x, p.y); ctx.rotate(p.rot * Math.PI / 180);
            ctx.fillStyle = p.color; ctx.fillRect(-p.sz / 2, -p.sz / 2, p.sz, p.sz);
            ctx.restore();
          }
        });
        if (alive) requestAnimationFrame(render);
        else ctx.clearRect(0, 0, cvs.width, cvs.height);
      }
      render();
    }

    /* KHỞI ĐỘNG */
    updateSlide();
  </script>
</body>
</html>
`;

// Ghi ra 2 nơi: public/bai-08-trinh-chieu.html và bai-08-trinh-chieu.html
const publicPath = path.resolve('public', 'bai-08-trinh-chieu.html');
const rootPath = path.resolve('bai-08-trinh-chieu.html');

fs.writeFileSync(publicPath, htmlContent, 'utf-8');
fs.writeFileSync(rootPath, htmlContent, 'utf-8');

console.log('✅ Successfully generated Bai 08 Slide Deck (v2 — Enhanced):');
console.log(' - ' + publicPath);
console.log(' - ' + rootPath);
