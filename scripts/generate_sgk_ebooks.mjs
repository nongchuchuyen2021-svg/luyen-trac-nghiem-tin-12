import fs from 'fs';
import path from 'path';

// Danh mục 28 bài học SGK Tin học 12 KNTT (Định hướng Tin học ứng dụng - ICT)
const LESSONS = [
  { id: "bai-01", num: 1, title: "Làm quen với Trí tuệ nhân tạo", topic: "Chủ đề 1. Máy tính và xã hội tri thức", pages: "Trang 5-11" },
  { id: "bai-02", num: 2, title: "Trí tuệ nhân tạo trong khoa học và đời sống", topic: "Chủ đề 1. Máy tính và xã hội tri thức", pages: "Trang 12-18" },
  { id: "bai-03", num: 3, title: "Một số thiết bị mạng thông dụng", topic: "Chủ đề 2. Mạng máy tính và Internet", pages: "Trang 19-25" },
  { id: "bai-04", num: 4, title: "Giao thức mạng", topic: "Chủ đề 2. Mạng máy tính và Internet", pages: "Trang 26-31" },
  { id: "bai-05", num: 5, title: "Thực hành chia sẻ tài nguyên trên mạng", topic: "Chủ đề 2. Mạng máy tính và Internet", pages: "Trang 32-38" },
  { id: "bai-06", num: 6, title: "Giao tiếp và ứng xử trong không gian mạng", topic: "Chủ đề 3. Đạo đức, pháp luật và văn hoá trong môi trường số", pages: "Trang 39-44" },
  { id: "bai-07", num: 7, title: "HTML và cấu trúc trang web", topic: "Chủ đề 4. Thiết kế trang web (HTML & CSS)", pages: "Trang 45-51" },
  { id: "bai-08", num: 8, title: "Định dạng văn bản", topic: "Chủ đề 4. Thiết kế trang web (HTML & CSS)", pages: "Trang 52-57" },
  { id: "bai-09", num: 9, title: "Tạo danh sách, bảng", topic: "Chủ đề 4. Thiết kế trang web (HTML & CSS)", pages: "Trang 58-64" },
  { id: "bai-10", num: 10, title: "Tạo liên kết", topic: "Chủ đề 4. Thiết kế trang web (HTML & CSS)", pages: "Trang 65-70" },
  { id: "bai-11", num: 11, title: "Chèn tệp đa phương tiện và khung nội tuyến", topic: "Chủ đề 4. Thiết kế trang web (HTML & CSS)", pages: "Trang 71-77" },
  { id: "bai-12", num: 12, title: "Biểu mẫu trong trang web", topic: "Chủ đề 4. Thiết kế trang web (HTML & CSS)", pages: "Trang 78-84" },
  { id: "bai-13", num: 13, title: "CSS và định dạng trang web", topic: "Chủ đề 4. Thiết kế trang web (HTML & CSS)", pages: "Trang 85-91" },
  { id: "bai-14", num: 14, title: "Định dạng kiểu chữ và màu sắc bằng CSS", topic: "Chủ đề 4. Thiết kế trang web (HTML & CSS)", pages: "Trang 92-97" },
  { id: "bai-15", num: 15, title: "Mô hình hộp và bố cục trong CSS", topic: "Chủ đề 4. Thiết kế trang web (HTML & CSS)", pages: "Trang 98-105" },
  { id: "bai-16", num: 16, title: "Dự án: Xây dựng trang web bằng HTML và CSS", topic: "Chủ đề 4. Thiết kế trang web (HTML & CSS)", pages: "Trang 106-112" },
  { id: "bai-17", num: 17, title: "Nhóm nghề Phát triển phần mềm", topic: "Chủ đề 5. Hướng nghiệp với Tin học", pages: "Trang 113-118" },
  { id: "bai-18", num: 18, title: "Nhóm nghề Quản trị hệ thống và Mạng", topic: "Chủ đề 5. Hướng nghiệp với Tin học", pages: "Trang 119-124" },
  { id: "bai-19", num: 19, title: "Dịch vụ công nghệ thông tin và nghề liên quan", topic: "Chủ đề 5. Hướng nghiệp với Tin học", pages: "Trang 125-130" },
  { id: "bai-20", num: 20, title: "Các ngành đào tạo và yêu cầu nghề nghiệp trong lĩnh vực CNTT", topic: "Chủ đề 5. Hướng nghiệp với Tin học", pages: "Trang 131-137" },
  { id: "bai-21", num: 21, title: "Giao tiếp giữa các thiết bị số", topic: "Chủ đề 6. Kết nối thiết bị số", pages: "Trang 138-144" },
  { id: "bai-22", num: 22, title: "Thực hành: Kết nối và truyền dữ liệu giữa các thiết bị số", topic: "Chủ đề 6. Kết nối thiết bị số", pages: "Trang 145-151" },
  { id: "bai-23", num: 23, title: "Làm quen với Google Sites", topic: "Chủ đề 7. Tạo trang web với Google Sites", pages: "Trang 152-158" },
  { id: "bai-24", num: 24, title: "Tạo trang web cơ bản với Google Sites", topic: "Chủ đề 7. Tạo trang web với Google Sites", pages: "Trang 159-165" },
  { id: "bai-25", num: 25, title: "Nhúng liên kết và các tệp đa phương tiện", topic: "Chủ đề 7. Tạo trang web với Google Sites", pages: "Trang 166-172" },
  { id: "bai-26", num: 26, title: "Xây dựng cấu trúc điều hướng website", topic: "Chủ đề 7. Tạo trang web với Google Sites", pages: "Trang 173-179" },
  { id: "bai-27", num: 27, title: "Biểu mẫu thu thập ý kiến và tạo tương tác", topic: "Chủ đề 7. Tạo trang web với Google Sites", pages: "Trang 180-186" },
  { id: "bai-28", num: 28, title: "Dự án: Hoàn thiện website với Google Sites", topic: "Chủ đề 7. Tạo trang web với Google Sites", pages: "Trang 187-193" },
];

function formatRich(text) {
  if (!text) return '';
  return text
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}

function renderBlock(block) {
  switch (block.kind) {
    case 'text':
      return `<p>${formatRich(block.text)}</p>`;

    case 'note':
      return `
        <div class="info-box">
          <p>${formatRich(block.text)}</p>
        </div>`;

    case 'example':
      return `
        <div class="activity">
          <div class="activity-badge">💡 ${block.title || 'Ví dụ minh họa'}</div>
          <p>${formatRich(block.text)}</p>
        </div>`;

    case 'list':
      return `
        <ul>
          ${block.items.map(it => `<li>${formatRich(it)}</li>`).join('\n')}
        </ul>`;

    case 'steps':
      return `
        <div class="steps-container" style="display:flex; flex-direction:column; gap:12px; margin:16px 0;">
          ${block.items.map((s, i) => `
            <div style="background:var(--panel2); border-left:4px solid var(--cyan); border-radius:10px; padding:12px 16px;">
              <div style="display:flex; gap:8px; align-items:center; margin-bottom:4px;">
                <span style="background:var(--cyan); color:#000; font-weight:800; font-size:11px; padding:2px 8px; border-radius:12px;">${s.label || `Bước ${i+1}`}</span>
                <strong style="color:var(--text); font-size:15px;">${s.title}</strong>
              </div>
              <p style="margin:0; font-size:14.5px; color:#b0c4de;">${formatRich(s.text)}</p>
            </div>
          `).join('\n')}
        </div>`;

    case 'compare':
      return `
        <div class="img-side">
          <div class="img-half" style="background:rgba(242,104,60,0.08); border-color:rgba(242,104,60,0.3); padding:16px;">
            <div style="font-weight:700; color:var(--orange); font-size:15px; margin-bottom:10px;">${block.left.emoji || ''} ${block.left.title}</div>
            <ul style="padding-left:18px;">
              ${block.left.items.map(it => `<li style="font-size:14px; margin-bottom:6px;">${formatRich(it)}</li>`).join('')}
            </ul>
          </div>
          <div class="img-half" style="background:rgba(56,217,245,0.08); border-color:rgba(56,217,245,0.3); padding:16px;">
            <div style="font-weight:700; color:var(--cyan); font-size:15px; margin-bottom:10px;">${block.right.emoji || ''} ${block.right.title}</div>
            <ul style="padding-left:18px;">
              ${block.right.items.map(it => `<li style="font-size:14px; margin-bottom:6px;">${formatRich(it)}</li>`).join('')}
            </ul>
          </div>
        </div>`;

    case 'cards':
      return `
        <div class="field-grid">
          ${block.items.map(it => `
            <div class="field-card">
              <div class="icon">${it.emoji || '📌'}</div>
              <h4 style="margin:0 0 6px; color:var(--cyan2);">${it.title}</h4>
              <p style="margin:0; font-size:14px; color:#b0c4de;">${formatRich(it.text)}</p>
            </div>
          `).join('\n')}
        </div>`;

    case 'code':
      return `
        <div style="background:#060b14; border:1px solid var(--border); border-radius:12px; overflow:hidden; margin:16px 0; font-family:monospace;">
          ${block.caption ? `<div style="background:rgba(255,255,255,0.05); padding:6px 14px; font-size:12px; color:var(--muted); border-bottom:1px solid var(--border);">💻 ${block.caption}</div>` : ''}
          <pre style="padding:14px 16px; margin:0; font-size:14px; line-height:1.6; color:#7ce8fa; overflow-x:auto;"><code>${escapeHtml(block.code)}</code></pre>
        </div>`;

    case 'check':
      return `
        <div class="cau-hoi" style="margin:16px 0; border:1px solid rgba(56,217,245,0.3); background:rgba(56,217,245,0.04); border-radius:14px; padding:16px 20px;">
          <div class="q-num" style="background:var(--cyan); color:#000; font-weight:800; border-radius:50%; width:28px; height:28px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">?</div>
          <div style="flex:1;">
            <div class="q-text" style="font-weight:600; color:#fff; font-size:15.5px; margin-bottom:10px;">${formatRich(block.q)}</div>
            <div style="display:grid; grid-template-columns:1fr; gap:6px; margin-bottom:10px;">
              ${block.options.map((opt, i) => `
                <div style="background:rgba(255,255,255,0.04); border:1px solid var(--border); border-radius:8px; padding:6px 12px; font-size:14px; color:#c8d8ec;">
                  <b>${String.fromCharCode(65 + i)}.</b> ${formatRich(opt)}
                </div>
              `).join('')}
            </div>
            <details style="margin-top:8px;">
              <summary style="cursor:pointer; color:var(--cyan); font-size:13px; font-weight:600;">👉 Xem đáp án & giải thích</summary>
              <div style="margin-top:6px; padding:8px 12px; background:rgba(86,227,159,0.1); border-left:3px solid var(--green); border-radius:6px; font-size:13.5px; color:#a3e635;">
                <strong>Đáp án đúng: ${String.fromCharCode(65 + block.answer)}</strong><br>
                <span>${formatRich(block.explain)}</span>
              </div>
            </details>
          </div>
        </div>`;

    default:
      return '';
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function generateAll() {
  console.log('🚀 Bắt đầu tạo các tệp SGK HTML còn thiếu...');
  let createdCount = 0;

  for (const item of LESSONS) {
    const targetFile = path.join(process.cwd(), 'public', 'sgk', `${item.id}.html`);
    
    // Nếu file đã có từ trước (ví dụ bài 1, 2, 3, 4, 6) thì không ghi đè để giữ nguyên bản tay
    if (fs.existsSync(targetFile)) {
      console.log(`⏩ ${item.id}.html đã tồn tại, bỏ qua.`);
      continue;
    }

    // Đọc file lí thuyết tương ứng
    const theoryModulePath = `../data/theory/${item.id}.ts`;
    let theory;
    try {
      const mod = await import(theoryModulePath);
      theory = mod.default;
    } catch (err) {
      console.error(`❌ Không tìm thấy hoặc lỗi import ${theoryModulePath}:`, err.message);
      continue;
    }

    const prevLesson = LESSONS[item.num - 2];
    const nextLesson = LESSONS[item.num];

    const htmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${item.title} – Tin học 12 KNTT (SGK Điện tử)</title>
<meta name="description" content="SGK Tin học 12 Kết nối tri thức – ${item.title}. ${item.topic}.">
<style>
:root {
  --bg: #070b14; --bg2: #0d1423; --panel: #111a2e; --panel2: #162035; --border: #1e2f4d;
  --text: #e8eef8; --muted: #8899b8; --orange: #ff6b35; --orange2: #ff9a64;
  --cyan: #38d9f5; --cyan2: #7ce8fa; --yellow: #ffd060; --green: #56e39f; --pink: #f06dba; --purple: #a78bfa;
  --fs: 18px;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  background: radial-gradient(ellipse at 20% 10%, #0d1f3c 0%, #070b14 50%);
  color: var(--text); font-family: 'Inter','Segoe UI',-apple-system,BlinkMacSystemFont,'Roboto',Arial,sans-serif;
  font-size: var(--fs); line-height: 1.75; min-height: 100vh;
}
.app { display: grid; grid-template-columns: 280px 1fr; min-height: 100vh; }
.sidebar { position:sticky; top:0; height:100vh; overflow-y:auto; background:rgba(7,11,20,.97); border-right:1px solid var(--border); padding:24px 16px; backdrop-filter:blur(20px); }
.brand-box { margin-bottom:24px; }
.series-label { font-size:11px; letter-spacing:2px; text-transform:uppercase; color:var(--cyan); font-weight:700; margin-bottom:6px; }
.brand-title { font-size:20px; font-weight:900; color:#fff; line-height:1.2; }
.brand-title span { color:var(--orange); }
.brand-sub { color:var(--muted); font-size:12px; margin-top:5px; }
.toc-title { font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:var(--muted); font-weight:700; margin:20px 0 8px; padding:0 8px; }
.toc a { display:block; color:#9aaec8; text-decoration:none; padding:9px 12px; border-radius:10px; margin:2px 0; font-size:13.5px; font-weight:500; transition:all .2s; border-left:3px solid transparent; }
.toc a:hover { background:rgba(56,217,245,.07); color:var(--cyan); border-left-color:var(--cyan); }
.toc a.active { background:rgba(255,107,53,.1); color:var(--orange); border-left-color:var(--orange); }
.ctrl-box { margin-top:24px; padding:14px; border:1px solid var(--border); border-radius:14px; background:rgba(255,255,255,.03); }
.ctrl-box h4 { font-size:11px; letter-spacing:1px; text-transform:uppercase; color:var(--muted); margin-bottom:10px; }
.ctrl-row { display:flex; gap:8px; margin-bottom:8px; }
.ctrl-btn { flex:1; background:var(--panel2); border:1px solid var(--border); color:var(--text); border-radius:9px; padding:8px 6px; cursor:pointer; font-size:13px; font-weight:600; transition:all .2s; text-align:center; text-decoration:none; display:inline-block; }
.ctrl-btn:hover { background:var(--border); color:#fff; }
.progress-bar { height:4px; background:var(--panel2); border-radius:4px; overflow:hidden; margin-top:10px; }
.progress-fill { height:100%; width:0%; background:linear-gradient(90deg,var(--cyan),var(--orange)); transition:width .3s; border-radius:4px; }
.main { max-width:860px; margin:0 auto; padding:32px 28px 80px; }
.hero { background:linear-gradient(135deg,#0f2040 0%,#0a1628 60%,#131020 100%); border:1px solid var(--border); border-radius:24px; padding:36px 40px; margin-bottom:28px; box-shadow:0 24px 80px rgba(0,0,0,.5); position:relative; overflow:hidden; }
.hero::before { content:'${item.num}'; position:absolute; right:30px; top:20px; font-size:120px; font-weight:900; color:rgba(56,217,245,.05); line-height:1; user-select:none; }
.chu-de-tag { display:inline-flex; align-items:center; gap:8px; background:rgba(56,217,245,.12); border:1px solid rgba(56,217,245,.3); color:var(--cyan); font-size:13px; font-weight:700; padding:6px 14px; border-radius:20px; margin-bottom:16px; letter-spacing:.5px; }
.hero h1 { font-size:clamp(26px,4vw,38px); font-weight:900; line-height:1.2; background:linear-gradient(90deg,#fff 0%,var(--cyan2) 50%,var(--orange2) 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; margin-bottom:14px; }
.hero-desc { color:#b0c4de; font-size:15.5px; line-height:1.6; }
.section { background:rgba(11,17,30,.9); border:1px solid var(--border); border-radius:20px; padding:28px 32px 36px; margin-bottom:24px; scroll-margin-top:20px; position:relative; transition:border-color .3s; }
.section:hover { border-color:rgba(56,217,245,.2); }
.page-num { position:absolute; right:20px; bottom:14px; color:var(--muted); font-size:12px; font-weight:600; background:var(--panel2); padding:3px 10px; border-radius:10px; }
h2 { font-size:clamp(20px,2.5vw,26px); font-weight:800; color:#fff; margin:28px 0 14px; display:flex; align-items:center; gap:10px; }
h2::before { content:''; display:inline-block; width:4px; height:24px; background:linear-gradient(var(--orange),var(--cyan)); border-radius:2px; flex-shrink:0; }
p { color:#d0dcea; margin-bottom:14px; }
p:last-child { margin-bottom:0; }
strong { color:#fff; }
em { color:var(--cyan2); font-style:italic; }
code { background:rgba(255,255,255,0.08); color:var(--orange2); padding:2px 6px; border-radius:4px; font-size:0.9em; font-family:monospace; }
ul, ol { padding-left:22px; margin:12px 0; }
li { color:#c8d8ec; margin-bottom:8px; }
li::marker { color:var(--cyan); }
.info-box { background:linear-gradient(135deg,#071e2e,#071828); border:1px dashed rgba(56,217,245,.4); border-radius:14px; padding:18px 22px; margin:20px 0; }
.info-box p, .info-box li { color:#b8d8f0; }
.activity { background:linear-gradient(135deg,#1a120a,#130f0a); border:1px solid rgba(255,160,60,.3); border-left:4px solid var(--orange); border-radius:14px; padding:18px 22px; margin:20px 0; }
.activity-badge { display:inline-flex; align-items:center; gap:6px; background:var(--orange); color:#1a0a00; font-size:12px; font-weight:800; padding:4px 12px; border-radius:6px; margin-bottom:10px; letter-spacing:.5px; text-transform:uppercase; }
.ghi-nho { background:linear-gradient(135deg,#1a2a10,#0f1e0a); border:1px solid rgba(86,227,159,.3); border-left:4px solid var(--green); border-radius:14px; padding:20px 24px; margin:24px 0; }
.ghi-nho-title { color:var(--green); font-weight:800; font-size:15px; text-transform:uppercase; letter-spacing:1px; margin-bottom:10px; display:flex; align-items:center; gap:8px; }
.ghi-nho p, .ghi-nho li { color:#c8f0d8; }
.nav-btns { display:flex; gap:12px; margin:20px 0; }
.nav-btn { background:var(--panel); border:1px solid var(--border); color:var(--text); border-radius:10px; padding:10px 18px; text-decoration:none; font-size:14px; font-weight:600; transition:all .2s; flex:1; text-align:center; }
.nav-btn:hover { background:var(--panel2); border-color:var(--cyan); color:#fff; }
.field-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin:18px 0; }
.field-card { background:var(--panel2); border:1px solid var(--border); border-radius:14px; padding:16px 18px; }
.img-side { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin:18px 0; }
.img-half { border-radius:12px; border:1px solid var(--border); }
@media (max-width: 860px) {
  .app { grid-template-columns: 1fr; }
  .sidebar { display: none; }
  .main { padding: 20px 16px 60px; }
  .field-grid, .img-side { grid-template-columns: 1fr; }
}
</style>
</head>
<body>

<div class="app">

<!-- SIDEBAR -->
<aside class="sidebar">
  <div class="brand-box">
    <div class="series-label">KẾT NỐI TRI THỨC</div>
    <div class="brand-title">TIN HỌC <span>12</span></div>
    <div class="brand-sub">Sách Giáo Khoa Điện Tử (ICT)</div>
  </div>

  <div class="ctrl-box">
    <h4>Cỡ chữ & Giao diện</h4>
    <div class="ctrl-row">
      <button class="ctrl-btn" onclick="changeFont(-1)">A -</button>
      <button class="ctrl-btn" onclick="changeFont(1)">A +</button>
      <button class="ctrl-btn" onclick="toggleTheme()">🌓 Nền</button>
    </div>
    <div style="font-size:12px; color:var(--muted); margin-top:8px;" id="prog-label">Tiến độ đọc: 0%</div>
    <div class="progress-bar"><div class="progress-fill" id="prog"></div></div>
  </div>

  <div class="toc-title">Mục lục bài học</div>
  <nav class="toc">
    ${theory.sections.map((s, idx) => `
      <a href="#sec-${idx + 1}">${idx + 1}. ${s.heading}</a>
    `).join('')}
    <a href="#ghi-nho">📌 Ghi nhớ cốt lõi</a>
  </nav>

  <div class="ctrl-box" style="margin-top:20px;">
    <h4>Luyện tập</h4>
    <a href="/luyen/${item.id}" class="ctrl-btn" style="background:var(--cyan); color:#000; font-weight:700;">🎯 Vào Luyện Trắc Nghiệm</a>
  </div>
</aside>

<!-- MAIN CONTENT -->
<main class="main">
  <!-- HERO BANNER -->
  <div class="hero">
    <div class="chu-de-tag">${item.topic}</div>
    <h1>${item.title}</h1>
    <div class="hero-desc">${formatRich(theory.intro)}</div>
  </div>

  <!-- NÚT CHUYỂN BÀI -->
  <div class="nav-btns">
    ${prevLesson ? `<a href="/sgk/${prevLesson.id}.html" class="nav-btn">← ${prevLesson.title}</a>` : '<div style="flex:1;"></div>'}
    ${nextLesson ? `<a href="/sgk/${nextLesson.id}.html" class="nav-btn">${nextLesson.title} →</a>` : '<div style="flex:1;"></div>'}
  </div>

  <!-- CÁC MỤC NỘI DUNG -->
  ${theory.sections.map((s, idx) => `
    <section class="section" id="sec-${idx + 1}">
      <h2 id="heading-${idx + 1}">${s.emoji || '📖'} ${idx + 1}. ${s.heading}</h2>
      ${s.blocks.map(b => renderBlock(b)).join('\n')}
      <div class="page-num">${item.pages}</div>
    </section>
  `).join('\n')}

  <!-- HỘP GHI NHỚ CUỐI BÀI -->
  <section class="section" id="ghi-nho">
    <div class="ghi-nho">
      <div class="ghi-nho-title">📌 Em cần ghi nhớ</div>
      <ul style="padding-left:20px;">
        ${theory.summary.map(sum => `<li style="font-size:15.5px; line-height:1.7; margin-bottom:10px;">${formatRich(sum)}</li>`).join('\n')}
      </ul>
    </div>
  </section>

  <!-- NÚT CHUYỂN BÀI DƯỚI CÙNG -->
  <div class="nav-btns" style="margin-top:32px;">
    ${prevLesson ? `<a href="/sgk/${prevLesson.id}.html" class="nav-btn">← ${prevLesson.title}</a>` : '<div style="flex:1;"></div>'}
    <a href="/luyen/${item.id}" class="nav-btn" style="background:linear-gradient(90deg, var(--cyan), var(--orange)); color:#fff; border:none;">🎯 Luyện trắc nghiệm ngay</a>
    ${nextLesson ? `<a href="/sgk/${nextLesson.id}.html" class="nav-btn">${nextLesson.title} →</a>` : '<div style="flex:1;"></div>'}
  </div>
</main>

</div>

<script>
let fs = 18;
function changeFont(d) { fs = Math.min(28, Math.max(14, fs + d)); document.body.style.fontSize = fs + 'px'; }
let light = false;
function toggleTheme() {
  light = !light;
  document.documentElement.style.setProperty('--bg', light ? '#f0f4f8' : '#070b14');
  document.documentElement.style.setProperty('--text', light ? '#1a2540' : '#e8eef8');
  document.documentElement.style.setProperty('--panel', light ? '#fff' : '#111a2e');
  document.documentElement.style.setProperty('--panel2', light ? '#f5f8fc' : '#162035');
  document.documentElement.style.setProperty('--border', light ? '#d0daea' : '#1e2f4d');
  document.body.style.background = light
    ? 'radial-gradient(ellipse at 20% 10%, #d8e8f8 0%, #f0f4f8 60%)'
    : 'radial-gradient(ellipse at 20% 10%, #0d1f3c 0%, #070b14 50%)';
}
window.addEventListener('scroll', () => {
  const doc = document.documentElement;
  const scrolled = doc.scrollTop || document.body.scrollTop;
  const total = doc.scrollHeight - doc.clientHeight;
  const pct = total > 0 ? Math.round((scrolled / total) * 100) : 0;
  const p = document.getElementById('prog');
  const pl = document.getElementById('prog-label');
  if (p) p.style.width = pct + '%';
  if (pl) pl.textContent = 'Tiến độ đọc: ' + pct + '%';
});
</script>
</body>
</html>`;

    fs.writeFileSync(targetFile, htmlContent, 'utf-8');
    console.log(`✅ Đã tạo thành công: ${item.id}.html`);
    createdCount++;
  }

  console.log(`🎉 Hoàn tất! Đã tạo mới ${createdCount} tệp SGK HTML.`);
}

generateAll().catch(err => {
  console.error('Lỗi khi chạy script:', err);
});
