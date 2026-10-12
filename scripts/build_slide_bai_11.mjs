import fs from 'node:fs';
import path from 'node:path';

// Trình biên soạn Slide bài giảng điện tử Bài 11: Chèn tệp tin đa phương tiện và khung nội tuyến vào trang web
// SGK Tin học 12 (ICT - Kết nối tri thức, trang 62–66).
// Đỉnh cao hiệu ứng & tương tác:
// 1. Image Distortion Lab: Trực quan hoá tỉ lệ ảnh, thanh trượt width/height co giãn méo xệch theo thời gian thực.
// 2. Alt Text Simulator: Bật/tắt mô phỏng ảnh hỏng, xem cơ chế cứu cánh của thuộc tính alt.
// 3. Audio/Video Studio: Thử nghiệm controls, poster, giải mã bí mật autoplay + muted trên Google Chrome.
// 4. Iframe Interactive Switcher: Bấm link <a target="..."> nạp nội dung CLB Thể thao / Nghệ thuật trực tiếp trong iframe.
// 5. HTML5 Media Live Playground với 3 template mẫu.
// 6. Mini-Quiz 4 câu hỏi SGK có âm thanh Web Audio và Bảng kiểm tra kỹ năng + Canvas Confetti ăn mừng.

const htmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bài 11: Chèn Đa Phương Tiện & Khung Nội Tuyến — Tin học 12</title>
  <style>
    /* ─── RESET & BIẾN MÀU SẮC CHUẨN 2026 ─── */
    :root {
      --bg: #070D18;
      --bg-card: rgba(13, 23, 38, 0.95);
      --border-card: rgba(56, 225, 240, 0.18);
      --ink: #FFFFFF;
      --ink-soft: #94A3B8;
      --sea: #0D7C86;
      --sea-light: #38E1F0;
      --coral: #F2683C;
      --coral-light: #FF855D;
      --gold: #F5A623;
      --leaf: #10B981;
      --leaf-light: #34D399;
      --purple: #8B5CF6;
      --purple-light: #C4B5FD;
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

    /* ─── NỀN MẠNG LƯỚI ĐA PHƯƠNG TIỆN ─── */
    .bg-mesh {
      position: fixed; inset: 0;
      background:
        radial-gradient(circle at 10% 20%, rgba(242, 104, 60, 0.28) 0, transparent 45%),
        radial-gradient(circle at 90% 80%, rgba(13, 124, 134, 0.32) 0, transparent 45%),
        radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.2) 0, transparent 60%);
      animation: meshPulse 14s ease-in-out infinite alternate;
      pointer-events: none; z-index: 0;
    }
    @keyframes meshPulse {
      0%   { transform: scale(1) translate(0, 0); opacity: 0.9; }
      100% { transform: scale(1.05) translate(-10px, 10px); opacity: 1; }
    }

    /* Ký hiệu media trôi nổi */
    .float-layer { position: fixed; inset: 0; pointer-events: none; z-index: 1; overflow: hidden; }
    .float-tag {
      position: absolute;
      font-family: var(--font-mono); font-size: 13px; font-weight: 700;
      color: rgba(56, 225, 240, 0.18);
      border: 1px solid rgba(56, 225, 240, 0.12);
      padding: 4px 10px; border-radius: 8px;
      background: rgba(13, 124, 134, 0.05);
      animation: floatUp 24s linear infinite;
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
    .reveal-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(56, 225, 240, 0.35); }

    .reveal-item {
      opacity: 0; transform: translateY(18px) scale(0.98);
      transition: opacity 0.45s ease, transform 0.45s var(--ease-spring);
      pointer-events: none;
    }
    .reveal-item.revealed { opacity: 1; transform: translateY(0) scale(1); pointer-events: auto; }

    /* ─── CÁC KHỐI GIAO DIỆN CHUẨN ─── */
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
    .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }

    .card {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px; padding: 16px 20px;
      transition: all 0.3s var(--ease-spring);
    }
    .card:hover { border-color: rgba(56, 225, 240, 0.35); transform: translateY(-2px); }
    .card-title {
      font-size: 16px; font-weight: 700; color: #38E1F0;
      display: flex; align-items: center; gap: 8px; margin-bottom: 8px;
    }

    .code-box {
      background: #040911; border: 1px solid rgba(56, 225, 240, 0.2);
      border-radius: 14px; overflow: hidden; font-family: var(--font-mono); font-size: 13.5px;
    }
    .code-header {
      background: rgba(255, 255, 255, 0.05); padding: 8px 14px;
      display: flex; justify-content: space-between; align-items: center;
      font-size: 12px; color: #94A3B8; border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }
    .code-content { padding: 14px; line-height: 1.6; color: #E2E8F0; white-space: pre-wrap; }
    .html-tag { color: #38E1F0; font-weight: 700; }
    .html-attr { color: #F5A623; }
    .html-val { color: #34D399; }
    .cmt-kw { color: #64748B; font-style: italic; }

    /* ─── THANH ĐIỀU HƯỚNG DƯỚI ĐÁY ─── */
    .nav-bar {
      position: fixed; bottom: 12px; left: 50%; transform: translateX(-50%);
      display: flex; align-items: center; gap: 14px;
      background: rgba(6, 13, 23, 0.88); border: 1px solid rgba(255, 255, 255, 0.12);
      padding: 6px 18px; border-radius: 40px; backdrop-filter: blur(20px);
      z-index: 100; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
    .nav-btn {
      background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.15);
      color: #FFF; width: 34px; height: 34px; border-radius: 50%;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: all 0.2s ease; font-size: 14px;
    }
    .nav-btn:hover { background: #0D7C86; border-color: #38E1F0; }
    .nav-dots { display: flex; gap: 6px; align-items: center; }
    .nav-dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: rgba(255, 255, 255, 0.2); cursor: pointer; transition: all 0.25s ease;
    }
    .nav-dot.active { width: 24px; border-radius: 10px; background: #38E1F0; }
    .nav-counter { font-size: 13px; font-weight: 700; color: #94A3B8; font-family: var(--font-mono); }

    /* ─── QUIZ ENGINE STYLES ─── */
    .quiz-card {
      background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px; padding: 14px; margin-bottom: 10px;
    }
    .quiz-q { font-size: 14px; font-weight: 700; color: #FFF; margin-bottom: 8px; }
    .quiz-opt {
      display: block; width: 100%; text-align: left;
      background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1);
      color: #CBD5E1; padding: 8px 12px; border-radius: 8px; margin-bottom: 6px;
      font-size: 13px; cursor: pointer; transition: all 0.2s ease;
    }
    .quiz-opt:hover { background: rgba(56, 225, 240, 0.15); border-color: #38E1F0; color: #FFF; }
    .quiz-opt.correct { background: rgba(16, 185, 129, 0.25) !important; border-color: #10B981 !important; color: #34D399 !important; font-weight: 700; }
    .quiz-opt.wrong { background: rgba(239, 68, 68, 0.25) !important; border-color: #EF4444 !important; color: #F87171 !important; }
    .quiz-fb { display: none; margin-top: 8px; padding: 8px 12px; border-radius: 8px; font-size: 12.5px; line-height: 1.5; }

    /* ─── CHECKLIST STYLES ─── */
    .check-item {
      display: flex; align-items: center; gap: 12px;
      background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 12px 16px; border-radius: 12px; cursor: pointer; transition: all 0.2s ease;
    }
    .check-item:hover { background: rgba(56, 225, 240, 0.1); border-color: #38E1F0; }
    .check-item.done { background: rgba(16, 185, 129, 0.15); border-color: #10B981; }
    .check-item.done .check-title { color: #34D399; text-decoration: line-through; }

    /* ─── LIVE PLAYGROUND ─── */
    .playground-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; height: 380px; }
    .pg-editor {
      width: 100%; height: 100%; background: #020710; border: 1px solid rgba(56, 225, 240, 0.2);
      border-radius: 12px; color: #F1F5F9; font-family: var(--font-mono); font-size: 13px;
      padding: 12px; resize: none; outline: none;
    }
    .pg-preview {
      width: 100%; height: 100%; background: #FFFFFF; border-radius: 12px; border: 1px solid #CBD5E1;
    }

    /* ─── CANVAS CONFETTI ─── */
    #confettiCanvas { position: fixed; inset: 0; pointer-events: none; z-index: 999; }
  </style>
</head>
<body>
  <div class="bg-mesh"></div>
  <canvas id="confettiCanvas"></canvas>

  <!-- Ký hiệu thẻ trôi nổi -->
  <div class="float-layer">
    <div class="float-tag" style="left: 6%; top: 18%; animation-delay: 0s;">&lt;img src="..." alt="..."&gt;</div>
    <div class="float-tag" style="left: 78%; top: 25%; animation-delay: 3s;">&lt;video controls poster="..."&gt;</div>
    <div class="float-tag" style="left: 15%; top: 75%; animation-delay: 6s;">&lt;audio autoplay muted&gt;</div>
    <div class="float-tag" style="left: 65%; top: 80%; animation-delay: 9s;">&lt;iframe src="..." target="..."&gt;</div>
    <div class="float-tag" style="left: 88%; top: 40%; animation-delay: 12s;">&lt;source type="video/mp4"&gt;</div>
  </div>

  <div class="deck-container">

    <!-- ══ SLIDE 1: HERO & TRANG BÌA ════════════════════════════════════════════ -->
    <section class="slide active" id="slide-1" data-total-reveal="0">
      <div class="slide-header">
        <div>
          <span class="slide-badge coral">Tin học 12 · Định hướng Tin học ứng dụng (ICT)</span>
          <div class="slide-title">BÀI 11: CHÈN ĐA PHƯƠNG TIỆN & KHUNG NỘI TUYẾN</div>
          <div class="slide-subtitle">SGK Kết nối tri thức với cuộc sống — Trang 62–66</div>
        </div>
        <div class="slide-badge purple">Phiên bản Số 2026</div>
      </div>
      <div class="slide-body" style="align-items: center; text-align: center; gap: 20px;">
        <div style="max-width: 880px;">
          <p style="font-size: 19px; color: #CBD5E1; line-height: 1.6; margin-bottom: 24px;">
            Bứt phá giới hạn văn bản tĩnh! Tích hợp thế giới <span style="color: #38E1F0; font-weight: 700;">Hình ảnh (img)</span>, 
            <span style="color: #FF855D; font-weight: 700;">Âm thanh & Video (audio/video)</span> cùng 
            <span style="color: #C4B5FD; font-weight: 700;">Khung nội tuyến (iframe)</span> để biến trang web thành trung tâm truyền thông sống động.
          </p>

          <!-- BỘ 3 TRỤ CỘT ĐA PHƯƠNG TIỆN -->
          <div class="grid-3" style="margin-bottom: 24px;">
            <div class="card" style="border-top: 4px solid #38E1F0; background: rgba(13, 124, 134, 0.15);">
              <div style="font-size: 32px; margin-bottom: 8px;">🖼️</div>
              <div style="font-size: 17px; font-weight: 700; color: #38E1F0; margin-bottom: 6px;">1. Chèn hình ảnh</div>
              <p style="font-size: 13px; color: #94A3B8; line-height: 1.5;">Thẻ <code>&lt;img&gt;</code>, thuộc tính <code>src</code>, <code>alt</code> cứu cánh và bí kíp giữ tỉ lệ tránh méo ảnh.</p>
            </div>

            <div class="card" style="border-top: 4px solid #F2683C; background: rgba(242, 104, 60, 0.15);">
              <div style="font-size: 32px; margin-bottom: 8px;">🎬</div>
              <div style="font-size: 17px; font-weight: 700; color: #FF855D; margin-bottom: 6px;">2. Âm thanh & Video</div>
              <p style="font-size: 13px; color: #94A3B8; line-height: 1.5;">Thẻ <code>&lt;video&gt;</code>, <code>&lt;audio&gt;</code>, đa định dạng <code>&lt;source&gt;</code>, giải mã bí mật autoplay trên Chrome.</p>
            </div>

            <div class="card" style="border-top: 4px solid #8B5CF6; background: rgba(139, 92, 246, 0.15);">
              <div style="font-size: 32px; margin-bottom: 8px;">🪟</div>
              <div style="font-size: 17px; font-weight: 700; color: #C4B5FD; margin-bottom: 6px;">3. Khung nội tuyến</div>
              <p style="font-size: 13px; color: #94A3B8; line-height: 1.5;">Thẻ <code>&lt;iframe&gt;</code> nhúng trang trong trang, liên kết thẻ <code>&lt;a target="..."&gt;</code> chuyển trang siêu tốc.</p>
            </div>
          </div>

          <div style="display: inline-flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.06); padding: 8px 20px; border-radius: 30px; border: 1px solid rgba(255,255,255,0.12); font-size: 13px; color: #CBD5E1;">
            <span>💡 <strong>Hướng dẫn:</strong> Bấm phím <code>Space</code> hoặc <code>→</code> để xem từng ý, bấm <code>F</code> để bật Toàn màn hình!</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ SLIDE 2: BỐI CẢNH & KHỞI ĐỘNG ═════════════════════════════════════════ -->
    <section class="slide" id="slide-2" data-total-reveal="3">
      <div class="slide-header">
        <div>
          <span class="slide-badge gold">Khởi động & Bối cảnh</span>
          <div class="slide-title">Kỷ nguyên Web Đa Phương Tiện (Multimedia)</div>
          <div class="slide-subtitle">Trang web không thể chỉ có chữ — Âm thanh, hình ảnh và video là linh hồn của Internet hiện đại</div>
        </div>
        <div class="reveal-ctrl">
          <span>✨</span><span class="reveal-status" id="slide-2-status">0 / 3</span>
          <button class="reveal-btn" onclick="revealNext();">▶ Hiện ý</button>
          <button class="reveal-btn" style="background: rgba(255,255,255,0.15);" onclick="revealAll();">Hiện hết</button>
        </div>
      </div>
      <div class="slide-body">
        <div class="grid-2">
          <!-- BÊN TRÁI: SO SÁNH QUÁ KHỨ VS HIỆN TẠI -->
          <div class="card reveal-item" style="border-left: 5px solid #F5A623;">
            <div class="card-title" style="color: #FFC043;">📜 Tiến hoá của Trang Web:</div>
            <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 10px;">
              <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 10px; border-left: 3px solid #64748B;">
                <div style="font-weight: 700; color: #94A3B8; font-size: 13.5px;">Web năm 1991 (Web 1.0):</div>
                <div style="font-size: 13px; color: #CBD5E1; margin-top: 4px;">Chỉ toàn chữ văn bản đen trắng và các liên kết thô sơ. Thiếu tính trực quan và không giữ chân được người dùng.</div>
              </div>
              <div style="background: rgba(13, 124, 134, 0.2); padding: 12px; border-radius: 10px; border-left: 3px solid #38E1F0;">
                <div style="font-weight: 700; color: #38E1F0; font-size: 13.5px;">Web Hiện đại 2026:</div>
                <div style="font-size: 13px; color: #CBD5E1; margin-top: 4px;">Tập trung trải nghiệm nghe - nhìn: Hình ảnh độ phân giải cao, video 4K phát trực tiếp, podcast audio và nhúng app bản đồ lồng trong trang qua iframe!</div>
              </div>
            </div>
          </div>

          <!-- BÊN PHẢI: BÀI TOÁN BĂNG THÔNG & ĐỊNH DẠNG -->
          <div class="card reveal-item" style="border-left: 5px solid #F2683C;">
            <div class="card-title" style="color: #FF855D;">⚡ Thách thức Cốt lõi của Nhà Thiết kế Web:</div>
            <ul style="margin-left: 18px; font-size: 13.5px; line-height: 1.7; color: #CBD5E1; margin-top: 8px;">
              <li><strong>Trình duyệt phải tải tệp lên trước khi hiển thị:</strong> Ảnh hay video quá nặng sẽ khiến trang tải chậm, người dùng bỏ đi!</li>
              <li><strong>Sự tương thích định dạng:</strong> Không phải định dạng nào trình duyệt cũng đọc được (ví dụ: ảnh TIFF, EPS không hiển thị trực tiếp).</li>
              <li><strong>Mạng yếu hoặc link hỏng:</strong> Cần giải pháp văn bản thay thế để người đọc không bị hoang mang khi ảnh không tải được.</li>
            </ul>
          </div>
        </div>

        <!-- THÔNG ĐIỆP GHI NHỚ -->
        <div class="card reveal-item" style="background: rgba(16, 185, 129, 0.1); border-color: rgba(16, 185, 129, 0.3);">
          <div style="font-size: 14px; color: #34D399; font-weight: 700;">🎯 Mục tiêu Bài 11:</div>
          <div style="font-size: 13.5px; color: #E2E8F0; margin-top: 4px;">
            Nắm vững cú pháp thẻ <code>&lt;img&gt;</code>, bí kíp chống méo ảnh, thẻ <code>&lt;video&gt;</code> & <code>&lt;audio&gt;</code> đa định dạng, và kỹ thuật nhúng tài nguyên bằng <code>&lt;iframe&gt;</code> kết hợp điều khiển liên kết.
          </div>
        </div>
      </div>
    </section>

    <!-- ══ SLIDE 3: THẺ IMG — CÚ PHÁP & BẢN CHẤT INLINE ═══════════════════════════ -->
    <section class="slide" id="slide-3" data-total-reveal="3">
      <div class="slide-header">
        <div>
          <span class="slide-badge leaf">Mục 1 · Trang 62</span>
          <div class="slide-title">Chèn Hình Ảnh: Thẻ &lt;img&gt; & Bản chất Nội tuyến</div>
          <div class="slide-subtitle">Thẻ đơn không có thẻ đóng — Chèn hình ảnh trực tiếp ngay trong dòng chữ mà không gây ngắt dòng</div>
        </div>
        <div class="reveal-ctrl">
          <span>✨</span><span class="reveal-status" id="slide-3-status">0 / 3</span>
          <button class="reveal-btn" onclick="revealNext();">▶ Hiện ý</button>
          <button class="reveal-btn" style="background: rgba(255,255,255,0.15);" onclick="revealAll();">Hiện hết</button>
        </div>
      </div>
      <div class="slide-body">
        <div class="grid-2">
          <!-- BÊN TRÁI: CÚ PHÁP & ĐẶC ĐIỂM -->
          <div class="card reveal-item" style="border-left: 5px solid #10B981;">
            <div class="card-title" style="color: #34D399;">📌 Đặc điểm của thẻ &lt;img&gt;:</div>
            <ul style="margin-left: 18px; font-size: 13.5px; line-height: 1.7; color: #CBD5E1;">
              <li><strong>Thẻ đơn:</strong> Chỉ viết <code>&lt;img ...&gt;</code>, không bao giờ có thẻ đóng <code>&lt;/img&gt;</code>.</li>
              <li><strong>Inline Element (Nội tuyến):</strong> Ảnh nằm ngang hàng với văn bản, <em>không tự động nhảy xuống dòng mới</em>.</li>
              <li><strong>Thuộc tính <code>src</code> (Source):</strong> Là thuộc tính <strong>bắt buộc</strong>, chỉ đường dẫn tới tệp tin ảnh.</li>
            </ul>

            <div class="code-box" style="margin-top: 14px;">
              <div class="code-header"><span>Cú pháp cơ bản</span></div>
              <div class="code-content">&lt;<span class="html-tag">img</span> <span class="html-attr">src</span>=<span class="html-val">"duong_dan_anh"</span> <span class="html-attr">alt</span>=<span class="html-val">"chu_thay_the"</span>&gt;</div>
            </div>
          </div>

          <!-- BÊN PHẢI: MINH HOẠ HÌNH 11.1 SGK -->
          <div class="card reveal-item" style="border-left: 5px solid #38E1F0;">
            <div class="card-title" style="color: #38E1F0;">☕ Minh hoạ Hình 11.1 SGK — Cốc cà phê:</div>
            <div class="code-box" style="margin-bottom: 12px;">
              <div class="code-header"><span>Mã nguồn HTML</span></div>
              <div class="code-content">&lt;<span class="html-tag">p</span>&gt;Tôi muốn uống một cốc
&lt;<span class="html-tag">img</span> <span class="html-attr">src</span>=<span class="html-val">"images/coffee.png"</span> <span class="html-attr">alt</span>=<span class="html-val">"cốc cà phê"</span> <span class="html-attr">width</span>=<span class="html-val">"36"</span>&gt;
ngay bây giờ.&lt;/<span class="html-tag">p</span>&gt;</div>
            </div>

            <!-- HIỂN THỊ THỰC TẾ -->
            <div style="background: rgba(255, 255, 255, 0.06); padding: 14px 18px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">
              <div style="font-size: 12px; color: #94A3B8; margin-bottom: 6px;">Kết quả hiển thị trên trang:</div>
              <div style="font-size: 16px; color: #FFF; display: flex; align-items: center; gap: 8px;">
                <span>Tôi muốn uống một cốc</span>
                <svg width="34" height="34" viewBox="0 0 36 36" fill="none" style="vertical-align: middle; filter: drop-shadow(0 2px 6px rgba(245,166,35,0.4));">
                  <path d="M6 10H26V22C26 25.3137 23.3137 28 20 28H12C8.68629 28 6 25.3137 6 22V10Z" fill="#8F5D02"/>
                  <path d="M26 12H28C29.6569 12 31 13.3431 31 15V17C31 18.6569 29.6569 20 28 20H26" stroke="#8F5D02" stroke-width="3" stroke-linecap="round"/>
                  <ellipse cx="16" cy="10" rx="10" ry="3" fill="#D4A373"/>
                  <path d="M12 6C12 4 14 3 14 1" stroke="#E2E8F0" stroke-width="1.5" stroke-linecap="round"/>
                  <path d="M16 6C16 4 18 3 18 1" stroke="#E2E8F0" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                <span>ngay bây giờ.</span>
              </div>
            </div>
          </div>
        </div>

        <!-- LƯU Ý VỀ TẢI DỮ LIỆU -->
        <div class="card reveal-item" style="background: rgba(245, 166, 35, 0.1); border-color: rgba(245, 166, 35, 0.3);">
          <div style="font-size: 13.5px; color: #FFC043; line-height: 1.5;">
            ⚠️ <strong>Quy luật tải trang:</strong> Trình duyệt gặp thẻ <code>&lt;img&gt;</code> sẽ gửi yêu cầu mạng để tải tệp ảnh từ máy chủ. Ảnh dung lượng càng lớn thì trang web càng tốn thời gian tải, gây giật lag trên mạng di động!
          </div>
        </div>
      </div>
    </section>

    <!-- ══ SLIDE 4: THUỘC TÍNH ALT — CỨU CÁNH KHI ẢNH HỎNG (SIMULATOR) ════════════ -->
    <section class="slide" id="slide-4" data-total-reveal="2">
      <div class="slide-header">
        <div>
          <span class="slide-badge coral">Kỹ thuật trọng tâm · Trang 63</span>
          <div class="slide-title">Bí Mật Thuộc Tính &lt;alt&gt; — "Phao Cứu Sinh" Khi Lỗi Ảnh</div>
          <div class="slide-subtitle">Văn bản thay thế (Alternative Text) giúp người dùng và công cụ tìm kiếm vẫn hiểu được nội dung bức ảnh</div>
        </div>
        <div class="reveal-ctrl">
          <span>✨</span><span class="reveal-status" id="slide-4-status">0 / 2</span>
          <button class="reveal-btn" onclick="revealNext();">▶ Hiện ý</button>
          <button class="reveal-btn" style="background: rgba(255,255,255,0.15);" onclick="revealAll();">Hiện hết</button>
        </div>
      </div>
      <div class="slide-body">
        <div class="grid-2">
          <!-- BÊN TRÁI: 3 VAI TRÒ CỦA ALT -->
          <div class="card reveal-item" style="border-left: 5px solid #F2683C;">
            <div class="card-title" style="color: #FF855D;">🛡️ 3 Giá trị Vô giá của thuộc tính alt:</div>
            <ul style="margin-left: 18px; font-size: 13.5px; line-height: 1.7; color: #CBD5E1;">
              <li><strong>Khi mạng lag hoặc tệp ảnh bị xoá/sai tên:</strong> Trình duyệt sẽ hiển thị dòng văn bản thay thế giúp người xem biết ảnh chứa gì.</li>
              <li><strong>Hỗ trợ người khiếm thị (Accessibility):</strong> Trình đọc màn hình (Screen Reader) sẽ đọc to dòng <code>alt</code> cho người khiếm thị nghe.</li>
              <li><strong>Tối ưu hoá tìm kiếm (SEO):</strong> Robot Google hiểu nội dung ảnh thông qua mô tả trong <code>alt</code>.</li>
            </ul>

            <div class="code-box" style="margin-top: 14px;">
              <div class="code-header"><span>Ví dụ Hình 11.2 SGK — Liên kết tải biểu mẫu</span></div>
              <div class="code-content">&lt;<span class="html-tag">a</span> <span class="html-attr">href</span>=<span class="html-val">"tai_lieu/bieu_mau.pdf"</span>&gt;
  &lt;<span class="html-tag">img</span> <span class="html-attr">src</span>=<span class="html-val">"images/pdffiles.png"</span>
       <span class="html-attr">alt</span>=<span class="html-val">"Biểu mẫu xin nhập học"</span>&gt;
&lt;/<span class="html-tag">a</span>&gt;</div>
            </div>
          </div>

          <!-- BÊN PHẢI: BỘ MÔ PHỎNG ALT TEXT SIMULATOR -->
          <div class="card reveal-item" style="border-left: 5px solid #38E1F0; background: rgba(13, 124, 134, 0.1);">
            <div class="card-title" style="color: #38E1F0;">🧪 Mô phỏng Trực tiếp: Bật / Tắt Lỗi Tệp Ảnh</div>
            <p style="font-size: 13px; color: #94A3B8; margin-bottom: 12px;">Nhấp vào các nút bên dưới để xem cách trình duyệt xử lý khi tệp ảnh tồn tại vs khi bị mất:</p>

            <div style="display: flex; gap: 8px; margin-bottom: 14px;">
              <button class="reveal-btn" onclick="simAlt(true);" style="background: #10B981;">🟢 Ảnh tồn tại</button>
              <button class="reveal-btn" onclick="simAlt(false);" style="background: #EF4444;">🔴 Ảnh bị hỏng (Mất file)</button>
              <button class="reveal-btn" onclick="simAltNoAlt();" style="background: #64748B;">⚠️ Thiếu thuộc tính alt</button>
            </div>

            <!-- KHUNG PREVIEW TRÌNH DUYỆT ẢO -->
            <div id="alt-sim-box" style="background: #FFFFFF; color: #0F172A; padding: 20px; border-radius: 12px; min-height: 140px; display: flex; flex-direction: column; justify-content: center; align-items: center; border: 2px dashed #CBD5E1; transition: all 0.3s ease;">
              <!-- Nội dung do JS render -->
            </div>
            <div id="alt-sim-desc" style="font-size: 12.5px; color: #CBD5E1; margin-top: 10px; font-style: italic;">
              * Chọn kịch bản để thấy sự khác biệt cứu cánh của thuộc tính alt.
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ SLIDE 5: ĐỊNH DẠNG ẢNH TRÊN WEB & CẬP NHẬT 2026 ═══════════════════════ -->
    <section class="slide" id="slide-5" data-total-reveal="3">
      <div class="slide-header">
        <div>
          <span class="slide-badge purple">Tiêu chuẩn Web</span>
          <div class="slide-title">Các Định Dạng Ảnh Hỗ Trợ & Cập Nhật Trình Duyệt 2026</div>
          <div class="slide-subtitle">Không phải định dạng nào cũng đưa lên web được — Chọn đúng định dạng để web tải nhanh gấp đôi</div>
        </div>
        <div class="reveal-ctrl">
          <span>✨</span><span class="reveal-status" id="slide-5-status">0 / 3</span>
          <button class="reveal-btn" onclick="revealNext();">▶ Hiện ý</button>
          <button class="reveal-btn" style="background: rgba(255,255,255,0.15);" onclick="revealAll();">Hiện hết</button>
        </div>
      </div>
      <div class="slide-body">
        <!-- 4 ĐỊNH DẠNG CHÍNH -->
        <div class="grid-4 reveal-item">
          <div class="card" style="border-top: 4px solid #38E1F0;">
            <div style="font-size: 20px; font-weight: 800; color: #38E1F0;">JPEG / JPG</div>
            <div style="font-size: 12px; color: #94A3B8; margin: 4px 0;">Nén mất dữ liệu (Lossy)</div>
            <p style="font-size: 13px; color: #CBD5E1; line-height: 1.5;">Thích hợp cho <strong>ảnh chụp, phong cảnh, chân dung</strong>. Dung lượng nhẹ nhưng không có nền trong suốt.</p>
          </div>

          <div class="card" style="border-top: 4px solid #10B981;">
            <div style="font-size: 20px; font-weight: 800; color: #34D399;">PNG</div>
            <div style="font-size: 12px; color: #94A3B8; margin: 4px 0;">Nén không mất dữ liệu</div>
            <p style="font-size: 13px; color: #CBD5E1; line-height: 1.5;">Hỗ trợ <strong>nền trong suốt (Transparent)</strong>, sắc nét từng điểm ảnh. Tuyệt vời cho logo, icon, sơ đồ.</p>
          </div>

          <div class="card" style="border-top: 4px solid #F5A623;">
            <div style="font-size: 20px; font-weight: 800; color: #FFC043;">GIF</div>
            <div style="font-size: 12px; color: #94A3B8; margin: 4px 0;">Giới hạn 256 màu</div>
            <p style="font-size: 13px; color: #CBD5E1; line-height: 1.5;">Chuyên dùng cho <strong>ảnh động ngắn, hoạt hoạ vui nhộn</strong>. Dung lượng có thể khá nặng nếu diễn hoạt dài.</p>
          </div>

          <div class="card" style="border-top: 4px solid #F2683C;">
            <div style="font-size: 20px; font-weight: 800; color: #FF855D;">WebP</div>
            <div style="font-size: 12px; color: #94A3B8; margin: 4px 0;">Chuẩn thế hệ mới Google</div>
            <p style="font-size: 13px; color: #CBD5E1; line-height: 1.5;">Nhẹ hơn JPEG từ <strong>25% - 35%</strong> mà chất lượng tương đương, hỗ trợ cả trong suốt lẫn chuyển động.</p>
          </div>
        </div>

        <!-- HỘP CẬP NHẬT 2026 SO VỚI SGK -->
        <div class="card reveal-item" style="border-left: 5px solid #EF4444; background: rgba(239, 68, 68, 0.08);">
          <div class="card-title" style="color: #F87171;">⚠️ Cập nhật Thực tế 2026: Định dạng JPEG-XR trong SGK</div>
          <div style="font-size: 13.5px; color: #E2E8F0; line-height: 1.6;">
            SGK (trang 62) có nhắc tới <strong>JPEG-XR</strong> như một định dạng mới cho web. Tuy nhiên, trên thực tế, các trình duyệt hàng đầu thế giới (Google Chrome, Mozilla Firefox, Safari) <strong>đều không hỗ trợ JPEG-XR</strong> (Chrome đã đánh dấu vĩnh viễn WONTFIX). Định dạng hiện đại siêu nhẹ thực tế đang bùng nổ là <strong>WebP</strong> và <strong>AVIF</strong>!
          </div>
        </div>

        <!-- LỜI KHUYÊN ĐƯỜNG DẪN TƯƠNG ĐỐI -->
        <div class="card reveal-item" style="border-left: 5px solid #10B981; background: rgba(16, 185, 129, 0.08);">
          <div style="font-size: 13.5px; color: #34D399; line-height: 1.6;">
            💡 <strong>Lời khuyên từ SGK:</strong> Khi chèn ảnh vào website của mình, nên ưu tiên sử dụng <strong>đường dẫn tương đối</strong> (lưu ảnh vào thư mục trong dự án) thay vì dẫn link tuyệt đối từ web khác, để phòng tránh ảnh bị xoá hoặc gãy link bất ngờ!
          </div>
        </div>
      </div>
    </section>

    <!-- ══ SLIDE 6: IMAGE DISTORTION LAB — THÍ NGHIỆM TỈ LỆ ẢNH ══════════════════ -->
    <section class="slide" id="slide-6" data-total-reveal="2">
      <div class="slide-header">
        <div>
          <span class="slide-badge coral">Thí nghiệm thực hành · Hình 11.3</span>
          <div class="slide-title">Image Distortion Lab — Quy Tắc Vàng Giữ Tỉ Lệ Ảnh</div>
          <div class="slide-subtitle">Chỉ đặt 1 chiều (width hoặc height) thì ảnh đẹp — Đặt cả hai sai tỉ lệ sẽ làm ảnh méo mó dị dạng!</div>
        </div>
        <div class="reveal-ctrl">
          <span>✨</span><span class="reveal-status" id="slide-6-status">0 / 2</span>
          <button class="reveal-btn" onclick="revealNext();">▶ Hiện ý</button>
          <button class="reveal-btn" style="background: rgba(255,255,255,0.15);" onclick="revealAll();">Hiện hết</button>
        </div>
      </div>
      <div class="slide-body">
        <div class="grid-2">
          <!-- BÊN TRÁI: QUY TẮC CỐT LÕI & CÁC NÚT MẪU -->
          <div class="card reveal-item" style="border-left: 5px solid #F5A623;">
            <div class="card-title" style="color: #FFC043;">📐 2 Quy tắc SGK Hình 11.3 (Trang 63):</div>
            <ul style="margin-left: 18px; font-size: 13.5px; line-height: 1.7; color: #CBD5E1; margin-bottom: 14px;">
              <li><strong>Chỉ khai báo 1 trong 2 thuộc tính (<code>width</code> hoặc <code>height</code>):</strong> Chiều còn lại sẽ được trình duyệt <em>tự động tính toán theo đúng tỉ lệ ảnh gốc</em>.</li>
              <li><strong>Khai báo cả 2 thuộc tính sai tỉ lệ gốc:</strong> Ảnh sẽ bị ép chiều ngang/chiều dọc khiến hình bị <strong>méo</strong>!</li>
            </ul>

            <div style="font-size: 13px; font-weight: 700; color: #38E1F0; margin-bottom: 8px;">Kịch bản thử nghiệm nhanh:</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
              <button class="reveal-btn" onclick="setDistortPreset(150, 150, 'Gốc (150×150)');">Preset 1: Gốc 150×150</button>
              <button class="reveal-btn" onclick="setDistortPreset(240, 0, 'Chỉ width=240');">Preset 2: Chỉ width=240</button>
              <button class="reveal-btn" onclick="setDistortPreset(300, 90, 'Méo ngang (300×90)');" style="background: #F2683C;">Preset 3: Méo ngang</button>
              <button class="reveal-btn" onclick="setDistortPreset(90, 260, 'Méo dọc (90×260)');" style="background: #EF4444;">Preset 4: Méo dọc</button>
            </div>

            <!-- THANH TRƯỢT TỰ DO -->
            <div style="margin-top: 14px; background: rgba(0,0,0,0.3); padding: 10px 14px; border-radius: 10px;">
              <div style="font-size: 12.5px; color: #94A3B8; margin-bottom: 6px;">Kéo thanh trượt tự do:</div>
              <div style="display: flex; align-items: center; gap: 10px; font-size: 12px; margin-bottom: 6px;">
                <span style="width: 50px;">Width:</span>
                <input type="range" id="range-w" min="60" max="360" value="150" oninput="onDistortSlider();" style="flex: 1;">
                <span id="label-w" style="width: 40px; font-family: var(--font-mono); color: #38E1F0;">150px</span>
              </div>
              <div style="display: flex; align-items: center; gap: 10px; font-size: 12px;">
                <span style="width: 50px;">Height:</span>
                <input type="range" id="range-h" min="60" max="360" value="150" oninput="onDistortSlider();" style="flex: 1;">
                <span id="label-h" style="width: 40px; font-family: var(--font-mono); color: #38E1F0;">150px</span>
              </div>
            </div>
          </div>

          <!-- BÊN PHẢI: KHUNG HIỂN THỊ HÌNH TRÁI TIM SGK -->
          <div class="card reveal-item" style="border-left: 5px solid #F2683C; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(0,0,0,0.4);">
            <div id="distort-code-badge" style="font-family: var(--font-mono); font-size: 13px; color: #38E1F0; background: rgba(0,0,0,0.6); padding: 6px 14px; border-radius: 8px; border: 1px solid rgba(56,225,240,0.3); margin-bottom: 14px;">
              &lt;img src="heart.png" width="150" height="150"&gt;
            </div>

            <!-- HÌNH TRÁI TIM SVG THỰC TẾ -->
            <div style="width: 380px; height: 260px; display: flex; align-items: center; justify-content: center; background: radial-gradient(circle, rgba(242,104,60,0.15) 0%, transparent 70%); border: 1px dashed rgba(255,255,255,0.15); border-radius: 14px; overflow: hidden;">
              <svg id="heart-svg" width="150" height="150" viewBox="0 0 100 100" style="transition: all 0.25s ease; filter: drop-shadow(0 4px 15px rgba(242, 104, 60, 0.6));">
                <path d="M50 85 C20 60, 5 40, 5 25 C5 12, 15 5, 27 5 C37 5, 45 12, 50 20 C55 12, 63 5, 73 5 C85 5, 95 12, 95 25 C95 40, 80 60, 50 85 Z" fill="#F2683C"/>
                <circle cx="32" cy="22" r="6" fill="#FFA585" opacity="0.6"/>
              </svg>
            </div>

            <div id="distort-status-text" style="margin-top: 10px; font-size: 13.5px; font-weight: 700; color: #34D399;">
              ✅ Tỉ lệ chuẩn 1:1 — Ảnh sắc nét, hoàn hảo!
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ SLIDE 7: THẺ VIDEO & AUDIO ════════════════════════════════════════════ -->
    <section class="slide" id="slide-7" data-total-reveal="3">
      <div class="slide-header">
        <div>
          <span class="slide-badge sea">Mục 2 · Trang 63</span>
          <div class="slide-title">Chèn Âm Thanh & Video: &lt;video&gt; & &lt;audio&gt;</div>
          <div class="slide-subtitle">Mang trải nghiệm nghe nhìn lên trang web mà không cần cài đặt thêm phần mềm bổ trợ</div>
        </div>
        <div class="reveal-ctrl">
          <span>✨</span><span class="reveal-status" id="slide-7-status">0 / 3</span>
          <button class="reveal-btn" onclick="revealNext();">▶ Hiện ý</button>
          <button class="reveal-btn" style="background: rgba(255,255,255,0.15);" onclick="revealAll();">Hiện hết</button>
        </div>
      </div>
      <div class="slide-body">
        <div class="grid-2">
          <!-- BÊN TRÁI: THẺ VIDEO -->
          <div class="card reveal-item" style="border-left: 5px solid #F2683C;">
            <div class="card-title" style="color: #FF855D;">🎬 Thẻ &lt;video&gt; — Trình chiếu Phim ảnh:</div>
            <ul style="margin-left: 18px; font-size: 13.5px; line-height: 1.7; color: #CBD5E1;">
              <li><strong>Là thẻ đôi:</strong> Có thẻ mở và thẻ đóng: <code>&lt;video&gt;...&lt;/video&gt;</code>.</li>
              <li><strong>Định dạng phổ biến nhất:</strong> <code>mp4</code> (hỗ trợ bởi 99% trình duyệt) và <code>webm</code> (tối ưu mã nguồn mở).</li>
              <li><strong>Các thuộc tính hỗ trợ:</strong> <code>src</code>, <code>width</code>, <code>height</code>, <code>controls</code>, <code>autoplay</code>, <code>muted</code>, <code>poster</code>.</li>
            </ul>

            <div class="code-box" style="margin-top: 12px;">
              <div class="code-header"><span>Ví dụ chèn video</span></div>
              <div class="code-content">&lt;<span class="html-tag">video</span> <span class="html-attr">width</span>=<span class="html-val">"320"</span> <span class="html-attr">height</span>=<span class="html-val">"240"</span> <span class="html-attr">controls</span> <span class="html-attr">src</span>=<span class="html-val">"movie.mp4"</span>&gt;
  Trình duyệt của bạn không hỗ trợ thẻ video.
&lt;/<span class="html-tag">video</span>&gt;</div>
            </div>
          </div>

          <!-- BÊN PHẢI: THẺ AUDIO -->
          <div class="card reveal-item" style="border-left: 5px solid #38E1F0;">
            <div class="card-title" style="color: #38E1F0;">🎵 Thẻ &lt;audio&gt; — Phát nhạc & Podcast:</div>
            <ul style="margin-left: 18px; font-size: 13.5px; line-height: 1.7; color: #CBD5E1;">
              <li><strong>Là thẻ đôi:</strong> <code>&lt;audio&gt;...&lt;/audio&gt;</code>.</li>
              <li><strong>3 Định dạng tệp âm thanh phổ biến nhất:</strong> <code>mp3</code>, <code>wav</code> và <code>ogg</code>.</li>
              <li><strong style="color: #F87171;">Đặc biệt lưu ý:</strong> Thẻ <code>&lt;audio&gt;</code> <strong>KHÔNG CÓ</strong> các thuộc tính <code>width</code>, <code>height</code> và <code>poster</code>!</li>
            </ul>

            <div class="code-box" style="margin-top: 12px;">
              <div class="code-header"><span>Ví dụ chèn âm thanh</span></div>
              <div class="code-content">&lt;<span class="html-tag">audio</span> <span class="html-attr">controls</span> <span class="html-attr">src</span>=<span class="html-val">"bai_hat.mp3"</span>&gt;
  Trình duyệt không hỗ trợ phát âm thanh.
&lt;/<span class="html-tag">audio</span>&gt;</div>
            </div>
          </div>
        </div>

        <!-- BẢNG SO SÁNH 2 THẺ -->
        <div class="card reveal-item" style="background: rgba(139, 92, 246, 0.1); border-color: rgba(139, 92, 246, 0.3);">
          <div style="font-size: 14px; font-weight: 700; color: #C4B5FD; margin-bottom: 6px;">⚖️ Bảng đối chiếu nhanh &lt;video&gt; vs &lt;audio&gt;:</div>
          <div style="display: flex; gap: 20px; font-size: 13px; color: #CBD5E1;">
            <div>• Cả hai đều hỗ trợ: <code>src</code>, <code>controls</code>, <code>autoplay</code>, <code>muted</code>, <code>loop</code>, thẻ <code>&lt;source&gt;</code>.</div>
            <div>• Riêng <code>&lt;video&gt;</code> có thêm: <code>width</code>, <code>height</code>, <code>poster</code> (ảnh bìa).</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ SLIDE 8: THUỘC TÍNH BOOLEAN & BÍ MẬT AUTOPLAY TRÊN CHROME ═══════════════ -->
    <section class="slide" id="slide-8" data-total-reveal="3">
      <div class="slide-header">
        <div>
          <span class="slide-badge gold">Thuộc tính nâng cao · Trang 64</span>
          <div class="slide-title">Thuộc Tính Boolean & Bí Quyết Tự Động Phát (Autoplay)</div>
          <div class="slide-subtitle">Khám phá thuộc tính không cần giá trị và chính sách bảo vệ người dùng của Google Chrome</div>
        </div>
        <div class="reveal-ctrl">
          <span>✨</span><span class="reveal-status" id="slide-8-status">0 / 3</span>
          <button class="reveal-btn" onclick="revealNext();">▶ Hiện ý</button>
          <button class="reveal-btn" style="background: rgba(255,255,255,0.15);" onclick="revealAll();">Hiện hết</button>
        </div>
      </div>
      <div class="slide-body">
        <div class="grid-3">
          <!-- CARD 1: CONTROLS -->
          <div class="card reveal-item" style="border-top: 4px solid #38E1F0;">
            <div style="font-size: 24px; margin-bottom: 6px;">🎛️</div>
            <div style="font-size: 16px; font-weight: 700; color: #38E1F0; margin-bottom: 6px;">controls</div>
            <div style="font-size: 12px; color: #94A3B8; margin-bottom: 8px;">Thuộc tính Boolean</div>
            <p style="font-size: 13px; color: #CBD5E1; line-height: 1.5;">Hiển thị giao diện điều khiển (nút Play/Pause, thanh tua, âm lượng, toàn màn hình). Nếu thiếu thuộc tính này, video sẽ bị "đơ" người dùng không bấm chạy được!</p>
          </div>

          <!-- CARD 2: AUTOPLAY & MUTED -->
          <div class="card reveal-item" style="border-top: 4px solid #F2683C;">
            <div style="font-size: 24px; margin-bottom: 6px;">▶️</div>
            <div style="font-size: 16px; font-weight: 700; color: #FF855D; margin-bottom: 6px;">autoplay & muted</div>
            <div style="font-size: 12px; color: #94A3B8; margin-bottom: 8px;">Tự động phát khi tải trang</div>
            <p style="font-size: 13px; color: #CBD5E1; line-height: 1.5;">Chrome chặn tự phát có tiếng! Muốn video tự chạy ngay lập tức khi người dùng mở trang, <strong>bắt buộc phải kèm thêm <code>muted</code></strong> (tắt âm thanh)!</p>
          </div>

          <!-- CARD 3: POSTER -->
          <div class="card reveal-item" style="border-top: 4px solid #F5A623;">
            <div style="font-size: 24px; margin-bottom: 6px;">🖼️</div>
            <div style="font-size: 16px; font-weight: 700; color: #FFC043; margin-bottom: 6px;">poster</div>
            <div style="font-size: 12px; color: #94A3B8; margin-bottom: 8px;">Chỉ dùng cho thẻ &lt;video&gt;</div>
            <p style="font-size: 13px; color: #CBD5E1; line-height: 1.5;">Cung cấp đường dẫn tới hình ảnh đại diện (thumbnail) hiển thị trước khi video bắt đầu chạy. Giúp trang web chuyên nghiệp như YouTube!</p>
          </div>
        </div>

        <!-- MÔ PHỎNG PLAYER TRỰC QUAN -->
        <div class="card reveal-item" style="background: rgba(0,0,0,0.4); border-color: rgba(56,225,240,0.2); display: flex; align-items: center; justify-content: space-between; padding: 14px 24px;">
          <div>
            <div style="font-size: 15px; font-weight: 700; color: #FFF;">Cú pháp chuẩn phối hợp đầy đủ thuộc tính:</div>
            <div style="font-family: var(--font-mono); font-size: 13px; color: #38E1F0; margin-top: 4px;">
              &lt;video width="480" height="270" controls autoplay muted poster="images/thumb.jpg"&gt;...&lt;/video&gt;
            </div>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="reveal-btn" onclick="playMockVideo();">▶ Thử nghiệm Player ảo</button>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ SLIDE 9: THẺ SOURCE — GIẢI PHÁP ĐA ĐỊNH DẠNG ═══════════════════════════ -->
    <section class="slide" id="slide-9" data-total-reveal="3">
      <div class="slide-header">
        <div>
          <span class="slide-badge leaf">Tối ưu tương thích · Trang 64</span>
          <div class="slide-title">Thẻ &lt;source&gt; — Cung Cấp Đa Định Dạng Thông Minh</div>
          <div class="slide-subtitle">Trình duyệt tự động chọn tệp tin tương thích tốt nhất — Không sợ người dùng bị lỗi không xem được</div>
        </div>
        <div class="reveal-ctrl">
          <span>✨</span><span class="reveal-status" id="slide-9-status">0 / 3</span>
          <button class="reveal-btn" onclick="revealNext();">▶ Hiện ý</button>
          <button class="reveal-btn" style="background: rgba(255,255,255,0.15);" onclick="revealAll();">Hiện hết</button>
        </div>
      </div>
      <div class="slide-body">
        <div class="grid-2">
          <!-- BÊN TRÁI: NGUYÊN LÝ HOẠT ĐỘNG CỦA SOURCE -->
          <div class="card reveal-item" style="border-left: 5px solid #10B981;">
            <div class="card-title" style="color: #34D399;">⚙️ Cơ chế hoạt động của thẻ &lt;source&gt;:</div>
            <ul style="margin-left: 18px; font-size: 13.5px; line-height: 1.7; color: #CBD5E1;">
              <li><strong>Lồng bên trong:</strong> Các thẻ <code>&lt;source&gt;</code> được đặt bên trong thẻ <code>&lt;video&gt;</code> hoặc <code>&lt;audio&gt;</code>.</li>
              <li><strong>Duyệt từ trên xuống dưới:</strong> Trình duyệt sẽ quét từng thẻ <code>&lt;source&gt;</code>; tệp nào trình duyệt hỗ trợ đầu tiên sẽ được chọn ngay để phát.</li>
              <li><strong>Thông báo dự phòng:</strong> Dòng chữ ở cuối sẽ chỉ hiển thị nếu trình duyệt quá cũ không hỗ trợ bất kỳ định dạng nào.</li>
            </ul>
          </div>

          <!-- BÊN PHẢI: MÃ NGUỒN CHUẨN SGK -->
          <div class="code-box reveal-item">
            <div class="code-header"><span>Ví dụ trong SGK trang 64</span></div>
            <div class="code-content">&lt;<span class="html-tag">video</span> <span class="html-attr">width</span>=<span class="html-val">"320"</span> <span class="html-attr">height</span>=<span class="html-val">"240"</span> <span class="html-attr">controls</span>&gt;
  &lt;<span class="html-tag">source</span> <span class="html-attr">src</span>=<span class="html-val">"movie.mp4"</span> <span class="html-attr">type</span>=<span class="html-val">"video/mp4"</span>&gt;
  &lt;<span class="html-tag">source</span> <span class="html-attr">src</span>=<span class="html-val">"movie.ogg"</span> <span class="html-attr">type</span>=<span class="html-val">"video/ogg"</span>&gt;
  Trình duyệt của bạn không hỗ trợ HTML video
&lt;/<span class="html-tag">video</span>&gt;</div>
          </div>
        </div>

        <!-- SƠ ĐỒ QUY TRÌNH RA QUYẾT ĐỊNH CỦA BROWSER -->
        <div class="card reveal-item" style="background: rgba(13, 124, 134, 0.15); border-color: rgba(56, 225, 240, 0.3);">
          <div style="font-size: 13.5px; font-weight: 700; color: #38E1F0; margin-bottom: 8px;">🔄 Quy trình duyệt của trình duyệt:</div>
          <div style="display: flex; align-items: center; justify-content: space-around; font-size: 13px; color: #CBD5E1; text-align: center;">
            <div style="background: rgba(0,0,0,0.4); padding: 8px 14px; border-radius: 8px;">1. Đọc source movie.mp4<br><span style="color:#10B981;">Hỗ trợ? Phát ngay!</span></div>
            <div style="font-size: 20px; color: #94A3B8;">➔</div>
            <div style="background: rgba(0,0,0,0.4); padding: 8px 14px; border-radius: 8px;">2. Nếu không hỗ trợ MP4<br><span style="color:#F5A623;">Thử tiếp movie.ogg</span></div>
            <div style="font-size: 20px; color: #94A3B8;">➔</div>
            <div style="background: rgba(0,0,0,0.4); padding: 8px 14px; border-radius: 8px;">3. Cả 2 đều không đọc được<br><span style="color:#EF4444;">Hiện văn bản dự phòng</span></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ SLIDE 10: KHUNG NỘI TUYẾN IFRAME ═══════════════════════════════════════ -->
    <section class="slide" id="slide-10" data-total-reveal="3">
      <div class="slide-header">
        <div>
          <span class="slide-badge purple">Mục 3 · Trang 64</span>
          <div class="slide-title">Khung Nội Tuyến &lt;iframe&gt; — "Cửa Sổ Thần Kỳ" Nhúng Trang</div>
          <div class="slide-subtitle">Nhúng tài nguyên web khác, video YouTube, Google Maps ngay bên trong trang web hiện tại</div>
        </div>
        <div class="reveal-ctrl">
          <span>✨</span><span class="reveal-status" id="slide-10-status">0 / 3</span>
          <button class="reveal-btn" onclick="revealNext();">▶ Hiện ý</button>
          <button class="reveal-btn" style="background: rgba(255,255,255,0.15);" onclick="revealAll();">Hiện hết</button>
        </div>
      </div>
      <div class="slide-body">
        <div class="grid-2">
          <!-- BÊN TRÁI: KHÁI NIỆM & THUỘC TÍNH -->
          <div class="card reveal-item" style="border-left: 5px solid #8B5CF6;">
            <div class="card-title" style="color: #C4B5FD;">🪟 Khái niệm iframe (Inline Frame):</div>
            <ul style="margin-left: 18px; font-size: 13.5px; line-height: 1.7; color: #CBD5E1;">
              <li><strong>Khung nội tuyến:</strong> Là một khung nhìn hiển thị một tài liệu web hoàn toàn khác độc lập bên trong trang web chính.</li>
              <li><strong>Thuộc tính <code>src</code>:</strong> Đường dẫn tới tệp tin HTML hoặc địa chỉ website cần nhúng.</li>
              <li><strong>Thuộc tính <code>width</code>, <code>height</code>:</strong> Kích thước chiều rộng và chiều cao của khung (tính bằng pixel hoặc %).</li>
            </ul>

            <div class="code-box" style="margin-top: 14px;">
              <div class="code-header"><span>Cú pháp cơ bản</span></div>
              <div class="code-content">&lt;<span class="html-tag">iframe</span> <span class="html-attr">src</span>=<span class="html-val">"CLB.html"</span> <span class="html-attr">width</span>=<span class="html-val">"600"</span> <span class="html-attr">height</span>=<span class="html-val">"400"</span>&gt;&lt;/<span class="html-tag">iframe</span>&gt;</div>
            </div>
          </div>

          <!-- BÊN PHẢI: ỨNG DỤNG THỰC TẾ ĐỈNH CAO -->
          <div class="card reveal-item" style="border-left: 5px solid #38E1F0;">
            <div class="card-title" style="color: #38E1F0;">🌐 Ứng dụng Thực tế Đời sống của iframe:</div>
            <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 8px;">
              <div style="background: rgba(255,255,255,0.05); padding: 10px 14px; border-radius: 8px; font-size: 13px; color: #CBD5E1;">
                🔴 <strong>Nhúng Video YouTube:</strong> Nút "Chia sẻ ➔ Nhúng" của YouTube tạo sẵn mã <code>&lt;iframe&gt;</code> để đưa video vào bài viết.
              </div>
              <div style="background: rgba(255,255,255,0.05); padding: 10px 14px; border-radius: 8px; font-size: 13px; color: #CBD5E1;">
                🗺️ <strong>Bản đồ Google Maps:</strong> Nhúng vị trí trường học, doanh nghiệp, cửa hàng ngay trên trang liên hệ.
              </div>
              <div style="background: rgba(255,255,255,0.05); padding: 10px 14px; border-radius: 8px; font-size: 13px; color: #CBD5E1;">
                📊 <strong>Google Forms & Quảng cáo:</strong> Tải biểu mẫu khảo sát hoặc các banner quảng cáo từ đối tác bên thứ ba.
              </div>
            </div>
          </div>
        </div>

        <!-- MÔ HÌNH TRỰC QUAN -->
        <div class="card reveal-item" style="background: rgba(16, 185, 129, 0.08); border-color: rgba(16, 185, 129, 0.25);">
          <div style="font-size: 13px; color: #34D399; line-height: 1.5;">
            💡 <strong>Tính bảo mật & Cô lập:</strong> Nội dung trong <code>&lt;iframe&gt;</code> chạy trong một ngữ cảnh tài liệu riêng biệt, không bị xung đột CSS hay JavaScript với trang web mẹ bao bọc nó!
          </div>
        </div>
      </div>
    </section>

    <!-- ══ SLIDE 11: TUYỆT KỸ KẾT HỢP: <a> TARGET ĐIỀU KHIỂN IFRAME ═══════════════ -->
    <section class="slide" id="slide-11" data-total-reveal="2">
      <div class="slide-header">
        <div>
          <span class="slide-badge coral">Kỹ thuật liên kết cốt lõi · Hình 11.4–11.5</span>
          <div class="slide-title">Tuyệt Kỹ: Dùng Thẻ &lt;a target="..."&gt; Đổi Nội Dung Trong Iframe</div>
          <div class="slide-subtitle">Bấm vào các liên kết bên ngoài để thay đổi tài liệu hiển thị bên trong khung mà không tải lại toàn trang</div>
        </div>
        <div class="reveal-ctrl">
          <span>✨</span><span class="reveal-status" id="slide-11-status">0 / 2</span>
          <button class="reveal-btn" onclick="revealNext();">▶ Hiện ý</button>
          <button class="reveal-btn" style="background: rgba(255,255,255,0.15);" onclick="revealAll();">Hiện hết</button>
        </div>
      </div>
      <div class="slide-body">
        <div class="grid-2">
          <!-- BÊN TRÁI: NGUYÊN LÝ KẾT HỢP SGK TRANG 65 -->
          <div class="card reveal-item" style="border-left: 5px solid #F5A623;">
            <div class="card-title" style="color: #FFC043;">🔗 Quy tắc kết nối target ➔ id / name:</div>
            <ul style="margin-left: 18px; font-size: 13.5px; line-height: 1.7; color: #CBD5E1;">
              <li><strong>Bước 1:</strong> Gán thuộc tính <code>id</code> và <code>name</code> cho khung <code>&lt;iframe&gt;</code> (ví dụ: <code>id="my_frame" name="my_frame"</code>).</li>
              <li><strong>Bước 2:</strong> Trong thẻ <code>&lt;a&gt;</code>, đặt thuộc tính <code>target="my_frame"</code> (trùng đúng tên định danh của khung).</li>
              <li><strong>Bước 3: Thứ tự đặt mã:</strong> SGK lưu ý muốn liên kết hiển thị <em>phía trên</em> khung thì phải viết thẻ <code>&lt;a&gt;</code> <em>ở trên</em> thẻ <code>&lt;iframe&gt;</code>!</li>
            </ul>

            <div class="code-box" style="margin-top: 12px;">
              <div class="code-header"><span>Mã nguồn Nhiệm vụ 3 SGK</span></div>
              <div class="code-content">&lt;<span class="html-tag">a</span> <span class="html-attr">href</span>=<span class="html-val">"the_thao.html"</span> <span class="html-attr">target</span>=<span class="html-val">"iframe"</span>&gt;CLB Thể thao&lt;/<span class="html-tag">a</span>&gt;
&lt;<span class="html-tag">a</span> <span class="html-attr">href</span>=<span class="html-val">"nghe_thuat.html"</span> <span class="html-attr">target</span>=<span class="html-val">"iframe"</span>&gt;CLB Nghệ thuật&lt;/<span class="html-tag">a</span>&gt;

&lt;<span class="html-tag">iframe</span> <span class="html-attr">id</span>=<span class="html-val">"iframe"</span> <span class="html-attr">name</span>=<span class="html-val">"iframe"</span> <span class="html-attr">width</span>=<span class="html-val">"100%"</span> <span class="html-attr">height</span>=<span class="html-val">"200"</span>&gt;&lt;/<span class="html-tag">iframe</span>&gt;</div>
            </div>
          </div>

          <!-- BÊN PHẢI: BỘ MÔ PHỎNG IFRAME SWITCHER -->
          <div class="card reveal-item" style="border-left: 5px solid #38E1F0; background: rgba(13, 124, 134, 0.1);">
            <div class="card-title" style="color: #38E1F0;">🧪 Mô phỏng Trực tiếp CLB Ngoại Khóa:</div>
            <p style="font-size: 13px; color: #94A3B8; margin-bottom: 12px;">Bấm các nút liên kết bên dưới để xem khung iframe tự động nạp trang tương ứng:</p>

            <div style="display: flex; gap: 8px; margin-bottom: 14px;">
              <button class="reveal-btn" onclick="switchIframe('the_thao');" style="background: #0284C7;">⚽ CLB Thể thao</button>
              <button class="reveal-btn" onclick="switchIframe('nghe_thuat');" style="background: #8B5CF6;">🎨 CLB Nghệ thuật</button>
              <button class="reveal-btn" onclick="switchIframe('tin_hoc');" style="background: #10B981;">💻 CLB Tin học</button>
            </div>

            <!-- KHUNG IFRAME MOCKUP -->
            <div id="mock-iframe-display" style="background: #FFFFFF; color: #0F172A; border-radius: 12px; height: 180px; padding: 18px; border: 3px solid #38E1F0; box-shadow: 0 8px 24px rgba(0,0,0,0.4); display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; transition: all 0.3s ease;">
              <!-- Nội dung do JS render -->
            </div>
            <div style="font-size: 12px; color: #94A3B8; margin-top: 8px; text-align: right;">
              Trạng thái: <code>target="iframe"</code> đã kích hoạt!
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ SLIDE 12: ĐẤU TRƯỜNG PLAYGROUND — LIVE CODE STUDIO ═════════════════════ -->
    <section class="slide" id="slide-12" data-total-reveal="0">
      <div class="slide-header">
        <div>
          <span class="slide-badge leaf">Thực hành Live Coding</span>
          <div class="slide-title">HTML5 Media & Iframe Studio (Playground)</div>
          <div class="slide-subtitle">Trải nghiệm gõ code trực tiếp và xem kết quả tức thì ngay trên slide giảng dạy</div>
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="reveal-btn" onclick="loadTemplate11('tpl_img');">Mẫu 1: Ảnh & Tỉ lệ</button>
          <button class="reveal-btn" onclick="loadTemplate11('tpl_media');">Mẫu 2: Video/Audio</button>
          <button class="reveal-btn" onclick="loadTemplate11('tpl_iframe');">Mẫu 3: Iframe Switcher</button>
        </div>
      </div>
      <div class="slide-body">
        <div class="playground-grid">
          <!-- BÊN TRÁI: EDITOR -->
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <div style="display: flex; justify-content: space-between; font-size: 12px; color: #94A3B8;">
              <span>Mã nguồn HTML (Gõ để sửa đổi):</span>
              <button onclick="updatePlayground11();" class="reveal-btn" style="padding: 2px 8px; font-size: 11px;">▶ Chạy code</button>
            </div>
            <textarea id="pg11-code" class="pg-editor" oninput="updatePlayground11();"></textarea>
          </div>

          <!-- BÊN PHẢI: PREVIEW -->
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <div style="font-size: 12px; color: #94A3B8;">Màn hình xem trước (Live Preview):</div>
            <iframe id="pg11-frame" class="pg-preview"></iframe>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ SLIDE 13: MINI-QUIZ 4 CÂU HỎI TRỌNG TÂM SGK ════════════════════════════ -->
    <section class="slide" id="slide-13" data-total-reveal="0">
      <div class="slide-header">
        <div>
          <span class="slide-badge gold">Kiểm tra nhanh</span>
          <div class="slide-title">Thử Thách Mini-Quiz: 4 Câu Hỏi Cốt Lõi SGK</div>
          <div class="slide-subtitle">Chọn đáp án đúng nhất — Nghe âm thanh phản hồi tức thì và đo mức độ ghi nhớ</div>
        </div>
        <div class="slide-badge coral">Có âm thanh phản hồi 🔊</div>
      </div>
      <div class="slide-body">
        <div class="grid-2" style="max-height: 480px; overflow-y: auto;">
          <!-- CÂU 1 -->
          <div class="quiz-card">
            <div class="quiz-q">Câu 1: Nhận định nào sau đây là ĐÚNG về thẻ &lt;img&gt;?</div>
            <button class="quiz-opt" onclick="checkQ(this, false, 'q1', 'Sai rồi! Thẻ img hỗ trợ nhiều định dạng như PNG, JPEG, GIF, WebP chứ không riêng .jpg.');">A. Chỉ chèn được ảnh có định dạng .jpg</button>
            <button class="quiz-opt" onclick="checkQ(this, true, 'q1', 'Chính xác! Thẻ img là thẻ đơn, không có thẻ đóng và bắt buộc phải có thuộc tính src.');">B. Là thẻ đơn, bắt buộc có thuộc tính src chỉ đường dẫn</button>
            <button class="quiz-opt" onclick="checkQ(this, false, 'q1', 'Sai rồi! width và height không bắt buộc.');">C. Bắt buộc phải có cả hai thuộc tính width và height</button>
            <button class="quiz-opt" onclick="checkQ(this, false, 'q1', 'Sai rồi! Nếu đường dẫn src sai, ảnh sẽ bị lỗi và chỉ hiện văn bản alt.');">D. Ảnh luôn hiển thị đúng dù đường dẫn trong src bị sai</button>
            <div id="q1-feedback" class="quiz-fb"></div>
          </div>

          <!-- CÂU 2 -->
          <div class="quiz-card">
            <div class="quiz-q">Câu 2: Nếu thẻ &lt;img&gt; chỉ khai báo thuộc tính width mà không khai báo height thì:</div>
            <button class="quiz-opt" onclick="checkQ(this, false, 'q2', 'Sai rồi! Trình duyệt vẫn hiển thị ảnh hoàn toàn bình thường.');">A. Ảnh không hiển thị được</button>
            <button class="quiz-opt" onclick="checkQ(this, false, 'q2', 'Sai rồi! Chiều cao sẽ thay đổi tương ứng theo tỉ lệ ảnh gốc.');">B. Chiều cao giữ nguyên bằng kích thước gốc bất kể chiều rộng</button>
            <button class="quiz-opt" onclick="checkQ(this, true, 'q2', 'Rất chuẩn! Chiều còn lại được tính toán tự động theo đúng tỉ lệ ảnh gốc giúp ảnh không bị méo.');">C. Chiều cao được tính toán tự động theo đúng tỉ lệ ảnh gốc</button>
            <button class="quiz-opt" onclick="checkQ(this, false, 'q2', 'Sai rồi! HTML hoàn toàn hợp lệ, không báo lỗi cú pháp.');">D. Trình duyệt báo lỗi cú pháp</button>
            <div id="q2-feedback" class="quiz-fb"></div>
          </div>

          <!-- CÂU 3 -->
          <div class="quiz-card">
            <div class="quiz-q">Câu 3: Thẻ &lt;audio&gt; KHÔNG có thuộc tính nào sau đây so với thẻ &lt;video&gt;?</div>
            <button class="quiz-opt" onclick="checkQ(this, false, 'q3', 'Sai rồi! Cả audio và video đều có controls.');">A. controls</button>
            <button class="quiz-opt" onclick="checkQ(this, false, 'q3', 'Sai rồi! Cả audio và video đều có autoplay.');">B. autoplay</button>
            <button class="quiz-opt" onclick="checkQ(this, true, 'q3', 'Tuyệt vời! Thẻ audio không có thuộc tính poster (ảnh bìa) cũng như width, height.');">C. poster (và width, height)</button>
            <button class="quiz-opt" onclick="checkQ(this, false, 'q3', 'Sai rồi! src là thuộc tính chỉ đường dẫn của cả 2 thẻ.');">D. src</button>
            <div id="q3-feedback" class="quiz-fb"></div>
          </div>

          <!-- CÂU 4 -->
          <div class="quiz-card">
            <div class="quiz-q">Câu 4: Để liên kết &lt;a&gt; mở nội dung ngay trong khung &lt;iframe&gt; cần gán target bằng:</div>
            <button class="quiz-opt" onclick="checkQ(this, false, 'q4', 'Sai rồi! _blank sẽ mở sang tab mới.');">A. "_blank"</button>
            <button class="quiz-opt" onclick="checkQ(this, true, 'q4', 'Chính xác 100%! Gán target đúng bằng mã định danh (id/name) của khung iframe đó.');">B. Đúng bằng mã định danh id (hoặc name) của iframe</button>
            <button class="quiz-opt" onclick="checkQ(this, false, 'q4', 'Sai rồi! Không gán target bằng src.');">C. Đúng bằng giá trị thuộc tính src của iframe</button>
            <button class="quiz-opt" onclick="checkQ(this, false, 'q4', 'Sai rồi! _self là mở tại chính trang hiện tại.');">D. "_self"</button>
            <div id="q4-feedback" class="quiz-fb"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══ SLIDE 14: TỔNG KẾT & CHECKLIST KỸ NĂNG ════════════════════════════════ -->
    <section class="slide" id="slide-14" data-total-reveal="0">
      <div class="slide-header">
        <div>
          <span class="slide-badge leaf">Ghi nhớ & Đánh giá</span>
          <div class="slide-title">Tổng Kết Kiến Thức & Bảng Kiểm Tra Kỹ Năng</div>
          <div class="slide-subtitle">Tích chọn các kỹ năng em đã làm chủ trong Bài 11 để kích hoạt pháo hoa ăn mừng</div>
        </div>
        <button class="reveal-btn" onclick="fireConfetti();" style="background: linear-gradient(135deg, #F2683C, #F5A623);">🎉 Bắn pháo hoa ăn mừng</button>
      </div>
      <div class="slide-body">
        <div class="grid-2">
          <!-- BÊN TRÁI: 6 ĐIỂM VÀNG GHI NHỚ -->
          <div class="card" style="border-left: 5px solid #38E1F0;">
            <div class="card-title" style="color: #38E1F0;">⭐ 6 Điểm Vàng Cốt Lõi Cần Nhớ:</div>
            <ul style="margin-left: 18px; font-size: 13.5px; line-height: 1.7; color: #CBD5E1;">
              <li>Thẻ <code>&lt;img&gt;</code> chèn ảnh; <code>src</code> bắt buộc, <code>alt</code> là chữ thay thế khi lỗi ảnh.</li>
              <li>Chỉ đặt 1 chiều (width hoặc height) thì ảnh giữ nguyên tỉ lệ; đặt cả hai sai tỉ lệ sẽ làm ảnh bị méo.</li>
              <li><code>&lt;video&gt;</code> và <code>&lt;audio&gt;</code> chèn đa phương tiện; hỗ trợ <code>controls</code>, <code>autoplay</code>, <code>muted</code>.</li>
              <li>Chrome chặn autoplay có tiếng: muốn tự phát video phải kèm theo <code>muted</code>.</li>
              <li>Thẻ <code>&lt;source&gt;</code> cung cấp nhiều định dạng để trình duyệt tự chọn tệp tương thích.</li>
              <li>Thẻ <code>&lt;iframe&gt;</code> nhúng trang web con; kết hợp <code>&lt;a target="id_khung"&gt;</code> để đổi nội dung trong khung.</li>
            </ul>
          </div>

          <!-- BÊN PHẢI: BẢNG KIỂM TRA KỸ NĂNG -->
          <div class="card" style="border-left: 5px solid #10B981;">
            <div class="card-title" style="color: #34D399;">✅ Bảng Kiểm Tra Kỹ Năng Tự Đánh Giá:</div>
            <p style="font-size: 13px; color: #94A3B8; margin-bottom: 12px;">Nhấp vào từng ô để đánh dấu kỹ năng em đã nắm vững:</p>

            <div style="display: flex; flex-direction: column; gap: 8px;">
              <div class="check-item" onclick="toggleChecklistItem(this);">
                <span>⬜</span>
                <span class="check-title" style="font-size: 13.5px; color: #CBD5E1;">Em biết cách dùng thẻ &lt;img&gt; với đầy đủ src và alt</span>
              </div>
              <div class="check-item" onclick="toggleChecklistItem(this);">
                <span>⬜</span>
                <span class="check-title" style="font-size: 13.5px; color: #CBD5E1;">Em hiểu nguyên tắc giữ tỉ lệ ảnh và tránh làm méo hình</span>
              </div>
              <div class="check-item" onclick="toggleChecklistItem(this);">
                <span>⬜</span>
                <span class="check-title" style="font-size: 13.5px; color: #CBD5E1;">Em biết chèn video/audio với controls, autoplay và muted</span>
              </div>
              <div class="check-item" onclick="toggleChecklistItem(this);">
                <span>⬜</span>
                <span class="check-title" style="font-size: 13.5px; color: #CBD5E1;">Em hiểu cơ chế hoạt động của thẻ &lt;source&gt; đa định dạng</span>
              </div>
              <div class="check-item" onclick="toggleChecklistItem(this);">
                <span>⬜</span>
                <span class="check-title" style="font-size: 13.5px; color: #CBD5E1;">Em thành thạo kỹ thuật dùng &lt;a target="..."&gt; điều khiển iframe</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>

  <!-- ══ THANH ĐIỀU HƯỚNG DƯỚI ĐÁY ═════════════════════════════════════════════ -->
  <div class="nav-bar">
    <button class="nav-btn" onclick="prevSlide();" title="Slide trước (← / Phím mũi tên trái)">‹</button>
    <div class="nav-dots" id="navDots"></div>
    <span class="nav-counter" id="navCounter">1 / 14</span>
    <button class="nav-btn" onclick="nextSlide();" title="Slide sau (→ / Phím mũi tên phải)">›</button>
    <button class="nav-btn" onclick="toggleFullscreen();" title="Toàn màn hình (F)" style="margin-left: 6px;">⛶</button>
  </div>

  <!-- ══ JAVASCRIPT HỆ THỐNG ĐIỀU KHIỂN & TƯƠNG TÁC ═════════════════════════════ -->
  <script>
    /* ─── WEB AUDIO API SYNTHESIZER ─── */
    let audioCtx = null;
    function getAudioContext() {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      return audioCtx;
    }

    function playTone(freq, type, duration, gainVal = 0.12) {
      try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type; osc.frequency.value = freq;
        gain.gain.setValueAtTime(gainVal, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(); osc.stop(ctx.currentTime + duration);
      } catch(e) {}
    }

    function playClick() { playTone(480, 'sine', 0.08, 0.06); }
    function playSlideChange() { playTone(360, 'sine', 0.12, 0.08); }
    function playSuccess() {
      try {
        const ctx = getAudioContext();
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
          setTimeout(() => playTone(freq, 'triangle', 0.22, 0.1), idx * 75);
        });
      } catch(e) {}
    }
    function playWrong() {
      try {
        const ctx = getAudioContext();
        [320, 240].forEach((freq, idx) => {
          setTimeout(() => playTone(freq, 'sawtooth', 0.18, 0.08), idx * 110);
        });
      } catch(e) {}
    }

    /* ─── QUẢN LÝ SLIDE & NAVIGATION ─── */
    const totalSlides = 14;
    let currentSlide = 1;
    const revealCounts = Array(totalSlides + 1).fill(0);

    const dotsContainer = document.getElementById('navDots');
    for (let i = 1; i <= totalSlides; i++) {
      const dot = document.createElement('div');
      dot.className = 'nav-dot' + (i === 1 ? ' active' : '');
      dot.onclick = () => goToSlide(i);
      dotsContainer.appendChild(dot);
    }

    function updateSlide() {
      document.querySelectorAll('.slide').forEach((s, idx) => {
        s.classList.remove('active', 'prev');
        const sNum = idx + 1;
        if (sNum === currentSlide) sNum === 1 ? s.classList.add('active') : s.classList.add('active');
        else if (sNum < currentSlide) s.classList.add('prev');
      });

      document.querySelectorAll('.nav-dot').forEach((d, idx) => {
        d.classList.toggle('active', idx + 1 === currentSlide);
      });

      document.getElementById('navCounter').innerText = currentSlide + ' / ' + totalSlides;

      // Khởi tạo các tương tác đặc thù khi chuyển slide
      if (currentSlide === 4) simAlt(true);
      if (currentSlide === 6) setDistortPreset(150, 150, 'Gốc 150×150');
      if (currentSlide === 11) switchIframe('the_thao');
      if (currentSlide === 12 && !document.getElementById('pg11-code').value) loadTemplate11('tpl_img');
    }

    function nextSlide() {
      if (currentSlide < totalSlides) {
        currentSlide++;
        playSlideChange();
        updateSlide();
      }
    }

    function prevSlide() {
      if (currentSlide > 1) {
        currentSlide--;
        playSlideChange();
        updateSlide();
      }
    }

    function goToSlide(n) {
      if (n >= 1 && n <= totalSlides && n !== currentSlide) {
        currentSlide = n;
        playSlideChange();
        updateSlide();
      }
    }

    function toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(()=>{});
      } else {
        document.exitFullscreen().catch(()=>{});
      }
    }

    /* ─── CƠ CHẾ HIỆN TỪNG Ý (REVEAL ENGINE) ─── */
    function revealNext() {
      const slide = document.getElementById('slide-' + currentSlide);
      if (!slide) return;
      const total = parseInt(slide.dataset.totalReveal || '0');
      if (total === 0) { nextSlide(); return; }

      let cur = revealCounts[currentSlide];
      if (cur < total) {
        cur++;
        revealCounts[currentSlide] = cur;
        const items = slide.querySelectorAll('.reveal-item');
        if (items[cur - 1]) items[cur - 1].classList.add('revealed');
        const statusEl = document.getElementById('slide-' + currentSlide + '-status');
        if (statusEl) statusEl.innerText = cur + ' / ' + total;
        playClick();
      } else {
        nextSlide();
      }
    }

    function revealAll() {
      const slide = document.getElementById('slide-' + currentSlide);
      if (!slide) return;
      const total = parseInt(slide.dataset.totalReveal || '0');
      revealCounts[currentSlide] = total;
      slide.querySelectorAll('.reveal-item').forEach(it => it.classList.add('revealed'));
      const statusEl = document.getElementById('slide-' + currentSlide + '-status');
      if (statusEl) statusEl.innerText = total + ' / ' + total;
      playSuccess();
    }

    /* ─── PHÍM TẮT ĐIỀU HƯỚNG ─── */
    window.addEventListener('keydown', (e) => {
      if (['TEXTAREA', 'INPUT'].includes(e.target.tagName)) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') nextSlide();
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') prevSlide();
      else if (e.key === ' ') { e.preventDefault(); revealNext(); }
      else if (e.key.toLowerCase() === 'f') toggleFullscreen();
      else if (e.key.toLowerCase() === 'p') goToSlide(12);
      else if (e.key >= '1' && e.key <= '9') {
        const target = parseInt(e.key);
        if (target <= totalSlides) goToSlide(target);
      }
    });

    /* ─── TƯƠNG TÁC SLIDE 4: ALT TEXT SIMULATOR ─── */
    function simAlt(exists) {
      playClick();
      const box = document.getElementById('alt-sim-box');
      const desc = document.getElementById('alt-sim-desc');
      if (exists) {
        box.innerHTML = \`
          <div style="display: flex; align-items: center; gap: 14px;">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="8" fill="#EF4444"/>
              <path d="M14 16H26L34 24V34C34 35.1046 33.1046 36 32 36H16C14.8954 36 14 35.1046 14 34V16Z" fill="white"/>
              <text x="24" y="29" fill="#EF4444" font-size="10" font-weight="bold" text-anchor="middle">PDF</text>
            </svg>
            <div>
              <div style="font-weight: 700; color: #0F172A; font-size: 15px;">Biểu mẫu xin nhập học.pdf</div>
              <div style="font-size: 12px; color: #64748B;">Tệp ảnh pdffiles.png tải thành công 100%</div>
            </div>
          </div>\`;
        desc.innerHTML = '<span style="color:#10B981;">🟢 Ảnh hiển thị trọn vẹn: Người dùng nhìn thấy biểu tượng icon PDF rõ ràng.</span>';
      } else {
        box.innerHTML = \`
          <div style="border: 2px dashed #EF4444; background: #FEF2F2; padding: 14px 20px; border-radius: 8px; display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 26px;">🖼️❌</span>
            <div>
              <div style="font-weight: 700; color: #B91C1C; font-size: 14px;">Biểu mẫu xin nhập học</div>
              <div style="font-size: 11.5px; color: #7F1D1D;">(Ảnh bị lỗi tải - Trình duyệt hiển thị dòng văn bản thay thế từ thuộc tính alt)</div>
            </div>
          </div>\`;
        desc.innerHTML = '<span style="color:#FFC043;">🛡️ Cứu cánh của alt: Dù ảnh vỡ, người đọc vẫn biết đây là liên kết tải "Biểu mẫu xin nhập học"!</span>';
      }
    }

    function simAltNoAlt() {
      playWrong();
      const box = document.getElementById('alt-sim-box');
      const desc = document.getElementById('alt-sim-desc');
      box.innerHTML = \`
        <div style="border: 1px solid #CBD5E1; background: #F8FAFC; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; border-radius: 4px;">
          <span style="font-size: 22px; color: #94A3B8;">❌</span>
        </div>\`;
      desc.innerHTML = '<span style="color:#EF4444;">⚠️ Nguy hiểm khi thiếu alt: Trình duyệt chỉ hiện icon vỡ trống không, người dùng không biết đây là cái gì!</span>';
    }

    /* ─── TƯƠNG TÁC SLIDE 6: IMAGE DISTORTION LAB ─── */
    function setDistortPreset(w, h, label) {
      playClick();
      document.getElementById('range-w').value = w;
      document.getElementById('range-h').value = h === 0 ? w : h;
      applyDistort(w, h, label);
    }

    function onDistortSlider() {
      const w = parseInt(document.getElementById('range-w').value);
      const h = parseInt(document.getElementById('range-h').value);
      applyDistort(w, h, 'Tự do');
    }

    function applyDistort(w, h, label) {
      const svg = document.getElementById('heart-svg');
      const codeBadge = document.getElementById('distort-code-badge');
      const statusText = document.getElementById('distort-status-text');
      const labelW = document.getElementById('label-w');
      const labelH = document.getElementById('label-h');

      labelW.innerText = w + 'px';
      labelH.innerText = (h === 0 ? 'auto' : h + 'px');

      if (h === 0) {
        // Chỉ đặt width, height tự tính theo tỉ lệ gốc 1:1
        svg.style.width = w + 'px';
        svg.style.height = w + 'px';
        codeBadge.innerText = '<img src="heart.png" width="' + w + '">';
        statusText.innerHTML = '✅ Chỉ khai báo width="' + w + '" — Chiều cao tự nhảy ' + w + 'px theo tỉ lệ gốc, ảnh chuẩn đẹp!';
        statusText.style.color = '#34D399';
      } else {
        svg.style.width = w + 'px';
        svg.style.height = h + 'px';
        codeBadge.innerText = '<img src="heart.png" width="' + w + '" height="' + h + '">';
        const ratio = w / h;
        if (Math.abs(ratio - 1.0) < 0.15) {
          statusText.innerHTML = '✅ Tỉ lệ cân đối (' + w + '×' + h + ') — Hình ảnh giữ nguyên vẻ đẹp tự nhiên!';
          statusText.style.color = '#34D399';
        } else if (w > h) {
          statusText.innerHTML = '⚠️ Sai tỉ lệ! Width lớn hơn Height (' + w + '×' + h + ') ➔ Trái tim bị ép BẸP DÍ theo chiều ngang!';
          statusText.style.color = '#F5A623';
        } else {
          statusText.innerHTML = '⚠️ Sai tỉ lệ! Height lớn hơn Width (' + w + '×' + h + ') ➔ Trái tim bị KÉO DÀI NGOẴNG theo chiều dọc!';
          statusText.style.color = '#EF4444';
        }
      }
    }

    /* ─── TƯƠNG TÁC SLIDE 8: MOCK VIDEO ─── */
    function playMockVideo() {
      playSuccess();
      alert('🎬 Video Demo: Trình duyệt Google Chrome đã nhận diện cờ muted=true nên video tự động chạy mượt mà không bị chặn âm thanh!');
    }

    /* ─── TƯƠNG TÁC SLIDE 11: IFRAME SWITCHER ─── */
    const iframeData = {
      the_thao: {
        title: '⚽ CÂU LẠC BỘ THỂ THAO',
        color: '#0284C7',
        bg: '#F0F9FF',
        content: 'Lịch tập Bóng đá: Thứ 3 & Thứ 5 hàng tuần tại Sân vận động.<br>Giải Cầu lông học sinh mở rộng khai mạc tuần sau!'
      },
      nghe_thuat: {
        title: '🎨 CÂU LẠC BỘ NGHỆ THUẬT',
        color: '#8B5CF6',
        bg: '#F5F3FF',
        content: 'Ban Nhạc acoustic tuyển sinh thành viên mới (Guitar & Vocal).<br>Triển lãm tranh màu nước Chủ đề Mái trường khai mạc thứ 6!'
      },
      tin_hoc: {
        title: '💻 CÂU LẠC BỘ TIN HỌC 12',
        color: '#10B981',
        bg: '#ECFDF5',
        content: 'Workshop Chuyên đề: Làm chủ HTML5 Media & Khung Iframe.<br>Thiết kế website trường học Nguyễn Bỉnh Khiêm dự thi Olympic!'
      }
    };

    function switchIframe(key) {
      playClick();
      const d = iframeData[key];
      const box = document.getElementById('mock-iframe-display');
      box.style.background = d.bg;
      box.style.borderColor = d.color;
      box.innerHTML = \`
        <div style="font-size: 18px; font-weight: 800; color: \${d.color}; margin-bottom: 8px;">\${d.title}</div>
        <div style="font-size: 14px; color: #334155; line-height: 1.6;">\${d.content}</div>
        <div style="margin-top: 10px; font-size: 11.5px; color: #64748B; font-style: italic;">
          [Tài nguyên được nạp độc lập từ tệp: \${key}.html]
        </div>\`;
    }

    /* ─── LIVE PLAYGROUND SLIDE 12 ─── */
    const templates11 = {
      tpl_img: \`<h2>Thử nghiệm Chèn Ảnh & Tỉ Lệ</h2>
<p>Ảnh cân đối tỉ lệ chuẩn (chỉ đặt width):</p>
<img width="180" alt="Cốc cà phê thơm" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><circle cx='50' cy='50' r='40' fill='%23F5A623'/><text x='50' y='55' fill='white' font-size='12' font-weight='bold' text-anchor='middle'>COFFEE</text></svg>">

<p>Ảnh sai tỉ lệ (bị méo mó vì đặt width=240 height=60):</p>
<img width="240" height="60" alt="Ảnh méo" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><circle cx='50' cy='50' r='40' fill='%23EF4444'/><text x='50' y='55' fill='white' font-size='12' font-weight='bold' text-anchor='middle'>BỊ MÉO</text></svg>">\`,

      tpl_media: \`<h2>HTML5 Video & Audio Player</h2>
<p>1. Trình phát âm thanh có thanh điều khiển controls:</p>
<audio controls>
  <source src="sound.mp3" type="audio/mpeg">
  Trình duyệt không hỗ trợ phát audio.
</audio>

<p>2. Khung Video có poster và thanh controls:</p>
<video width="320" height="180" controls poster="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='180'><rect width='320' height='180' fill='%230D7C86'/><text x='160' y='95' fill='white' font-size='16' font-weight='bold' text-anchor='middle'>BẤM ĐỂ XEM VIDEO</text></svg>">
  <source src="movie.mp4" type="video/mp4">
</video>\`,

      tpl_iframe: \`<h2>Trang web Nhúng Iframe CLB</h2>
<p>Chọn câu lạc bộ để xem nội dung:</p>
<p>
  <a href="data:text/html;charset=utf-8,<h3>Lịch sinh hoạt Bóng đá</h3><p>Sân số 2 lúc 16h30</p>" target="khung_clb">CLB Thể thao</a> | 
  <a href="data:text/html;charset=utf-8,<h3>Lớp vẽ màu nước</h3><p>Phòng Mỹ thuật lúc 14h00</p>" target="khung_clb">CLB Nghệ thuật</a>
</p>

<iframe id="khung_clb" name="khung_clb" width="100%" height="150" style="border: 2px solid #0D7C86; border-radius: 8px;"></iframe>\`
    };

    function loadTemplate11(key) {
      playClick();
      document.getElementById('pg11-code').value = templates11[key];
      updatePlayground11();
    }

    function updatePlayground11() {
      const code = document.getElementById('pg11-code').value;
      const frame = document.getElementById('pg11-frame');
      const doc = frame.contentDocument || frame.contentWindow.document;
      doc.open(); doc.write(code); doc.close();
    }

    /* ─── QUIZ ENGINE SLIDE 13 ─── */
    function checkQ(btn, ok, qId, explain) {
      const parent = btn.closest('.quiz-card');
      parent.querySelectorAll('.quiz-opt').forEach(b => { b.disabled = true; b.style.pointerEvents = 'none'; });
      btn.classList.add(ok ? 'correct' : 'wrong');
      ok ? playSuccess() : playWrong();
      const fb = document.getElementById(qId + '-feedback');
      fb.style.display = 'block';
      fb.style.background = ok ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)';
      fb.style.border = '1px solid ' + (ok ? '#10B981' : '#EF4444');
      fb.style.color  = ok ? '#34D399' : '#FCA5A5';
      fb.innerHTML = (ok ? '🎉 <strong>Chính xác!</strong> ' : '❌ <strong>Chưa đúng!</strong> ') + explain;
    }

    /* ─── CHECKLIST SLIDE 14 ─── */
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
      const colors = ['#38E1F0', '#F2683C', '#F5A623', '#10B981', '#8B5CF6', '#FFFFFF'];
      const parts = Array.from({ length: 120 }, () => ({
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

// Ghi ra 2 nơi: public/bai-11-trinh-chieu.html và bai-11-trinh-chieu.html
const publicPath = path.resolve('public', 'bai-11-trinh-chieu.html');
const rootPath = path.resolve('bai-11-trinh-chieu.html');

fs.writeFileSync(publicPath, htmlContent, 'utf-8');
fs.writeFileSync(rootPath, htmlContent, 'utf-8');

console.log('✅ Successfully generated Bai 11 Slide Deck:');
console.log(' - ' + publicPath);
console.log(' - ' + rootPath);
