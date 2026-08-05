// Kho hình vẽ minh hoạ cho phần Lý thuyết.
//
// Tất cả đều là SVG viết tay, nhúng thẳng vào trang — không tải ảnh từ ngoài
// nên không phụ thuộc mạng, phóng to không vỡ, và màu ăn theo bảng màu lớp 12.
// Khối { kind: "figure", diagram: "<khoá>" } trong data/theory/* tra vào đây.
//
// Thêm hình mới: viết một component rồi khai báo thêm một dòng trong DIAGRAMS.

const C = {
  ink: "#12212B",
  inkSoft: "#4C5D6B",
  sea: "#0D7C86",
  seaDeep: "#075B63",
  coral: "#F2683C",
  leaf: "#0E9F6E",
  leafDeep: "#0B6E4F",
  gold: "#EFA31D",
  goldDeep: "#8F5D02",
  line: "#C9DDE0",
  white: "#FFFFFF",
};

// SVG không tự xuống dòng — mỗi phần tử của mảng là một dòng.
function Lines({
  x,
  y,
  lines,
  size = 13,
  fill = C.inkSoft,
  weight = 400,
  gap = 17,
  anchor = "middle",
}: {
  x: number;
  y: number;
  lines: string[];
  size?: number;
  fill?: string;
  weight?: number;
  gap?: number;
  anchor?: "start" | "middle" | "end";
}) {
  return (
    <text x={x} y={y} fontSize={size} fill={fill} fontWeight={weight} textAnchor={anchor}>
      {lines.map((l, i) => (
        <tspan key={i} x={x} dy={i === 0 ? 0 : gap}>
          {l}
        </tspan>
      ))}
    </text>
  );
}

function Frame({
  viewBox,
  children,
}: {
  viewBox: string;
  children: React.ReactNode;
}) {
  return (
    <svg
      viewBox={viewBox}
      className="h-auto w-full"
      role="img"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill={C.sea} />
        </marker>
        <marker id="arrow-soft" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill={C.line} />
        </marker>
      </defs>
      {children}
    </svg>
  );
}

// ── Phép thử Turing (Bài 1) ──────────────────────────────────────────────────
function TuringTest() {
  return (
    <Frame viewBox="0 0 640 330">
      {/* Giám khảo */}
      <rect x="14" y="105" width="150" height="110" rx="18" fill={C.sea} fillOpacity="0.1" stroke={C.sea} strokeWidth="2" />
      <text x="89" y="150" fontSize="34" textAnchor="middle">
        🧑‍⚖️
      </text>
      <Lines x={89} y={178} lines={["Giám khảo"]} size={14} weight={600} fill={C.seaDeep} />
      <Lines x={89} y={197} lines={["(là con người)"]} size={12} />

      {/* Đường trao đổi */}
      <path d="M168 140 L 300 105 L 372 78" stroke={C.line} strokeWidth="2.5" fill="none" markerEnd="url(#arrow-soft)" />
      <path d="M168 180 L 300 215 L 372 242" stroke={C.line} strokeWidth="2.5" fill="none" markerEnd="url(#arrow-soft)" />
      <rect x="228" y="140" width="146" height="40" rx="12" fill={C.white} stroke={C.line} strokeWidth="1.5" />
      <Lines x={301} y={156} lines={["💬 chỉ nhắn tin,", "không nhìn thấy mặt"]} size={12} gap={14} />

      {/* Hai phòng kín */}
      <rect x="378" y="42" width="248" height="74" rx="16" fill={C.leaf} fillOpacity="0.08" stroke={C.leaf} strokeWidth="2" />
      <text x="416" y="88" fontSize="28" textAnchor="middle">
        🧑
      </text>
      <Lines x={447} y={74} lines={["Phòng A"]} size={12} weight={700} fill={C.leafDeep} anchor="start" />
      <Lines x={447} y={94} lines={["một người thật"]} size={12} anchor="start" />

      <rect x="378" y="206" width="248" height="74" rx="16" fill={C.coral} fillOpacity="0.1" stroke={C.coral} strokeWidth="2" />
      <text x="416" y="252" fontSize="28" textAnchor="middle">
        🤖
      </text>
      <Lines x={447} y={238} lines={["Phòng B"]} size={12} weight={700} fill={C.coral} anchor="start" />
      <Lines x={447} y={258} lines={["một máy tính"]} size={12} anchor="start" />

      {/* Câu hỏi ở giữa */}
      <text x="502" y="172" fontSize="26" textAnchor="middle" fill={C.gold} fontWeight="700">
        ❓
      </text>
      <Lines x={502} y={148} lines={["Bên nào là máy?"]} size={12} weight={600} fill={C.goldDeep} />

      {/* Kết luận */}
      <rect x="14" y="290" width="612" height="34" rx="17" fill={C.gold} fillOpacity="0.14" />
      <Lines
        x={320}
        y={312}
        lines={["Giám khảo KHÔNG đoán ra bên nào là máy → máy đó được coi là có hành vi thông minh"]}
        size={12.5}
        weight={600}
        fill={C.goldDeep}
      />
    </Frame>
  );
}

// ── AI hẹp/yếu và AI tổng quát/mạnh (Bài 1) ─────────────────────────────────
function AiHepVaManh() {
  return (
    <Frame viewBox="0 0 640 280">
      {/* Bên trái: AI hẹp */}
      <rect x="10" y="20" width="270" height="200" rx="20" fill={C.sea} fillOpacity="0.09" stroke={C.sea} strokeWidth="2" />
      <text x="145" y="66" fontSize="30" textAnchor="middle">
        🎯
      </text>
      <Lines x={145} y={94} lines={["Trí tuệ nhân tạo hẹp"]} size={14.5} weight={700} fill={C.seaDeep} />
      <Lines x={145} y={113} lines={["(Trí tuệ nhân tạo yếu)"]} size={12} fill={C.sea} />
      <Lines
        x={145}
        y={143}
        lines={["Chỉ được thiết kế để làm", "GIỎI ĐÚNG MỘT việc cụ thể"]}
        size={12.5}
        gap={17}
      />
      <Lines
        x={145}
        y={186}
        lines={["Ví dụ: chương trình chơi cờ,", "nhận dạng khuôn mặt, dự báo thời tiết"]}
        size={12}
        gap={15}
        fill={C.inkSoft}
      />
      <rect x="72" y="228" width="146" height="28" rx="14" fill={C.leaf} fillOpacity="0.16" />
      <Lines x={145} y={247} lines={["✅ Toàn bộ AI hiện nay"]} size={12} weight={700} fill={C.leafDeep} />

      {/* Mũi tên */}
      <path d="M292 120 L 348 120" stroke={C.line} strokeWidth="3" fill="none" markerEnd="url(#arrow-soft)" />

      {/* Bên phải: AI mạnh */}
      <rect
        x="360"
        y="20"
        width="270"
        height="200"
        rx="20"
        fill={C.gold}
        fillOpacity="0.08"
        stroke={C.gold}
        strokeWidth="2"
        strokeDasharray="8 6"
      />
      <text x="495" y="66" fontSize="30" textAnchor="middle">
        🌟
      </text>
      <Lines x={495} y={94} lines={["Trí tuệ nhân tạo tổng quát"]} size={14.5} weight={700} fill={C.goldDeep} />
      <Lines x={495} y={113} lines={["(Trí tuệ nhân tạo mạnh)"]} size={12} fill={C.goldDeep} />
      <Lines
        x={495}
        y={143}
        lines={["Tự học, tự thích nghi và làm", "được NHIỀU việc như con người"]}
        size={12.5}
        gap={17}
      />
      <Lines
        x={495}
        y={186}
        lines={["Biết áp dụng tri thức của lĩnh vực này", "sang một lĩnh vực khác"]}
        size={12}
        gap={15}
        fill={C.inkSoft}
      />
      <rect x="399" y="228" width="192" height="28" rx="14" fill={C.coral} fillOpacity="0.16" />
      <Lines x={495} y={247} lines={["🎯 Mục tiêu dài hạn — CHƯA đạt được"]} size={12} weight={700} fill={C.coral} />
    </Frame>
  );
}

// ── AI len vào những lĩnh vực nào (Bài 2) ───────────────────────────────────
function AiLinhVuc() {
  const left = [
    { emoji: "🧠", title: "Hệ chuyên gia", desc: "tự học luật từ dữ liệu" },
    { emoji: "🏥", title: "Y học, sức khoẻ", desc: "chẩn đoán, đọc ảnh y tế" },
    { emoji: "🚗", title: "Giao thông vận tải", desc: "xe tự lái, định tuyến" },
  ];
  const right = [
    { emoji: "🏦", title: "Tài chính, ngân hàng", desc: "phát hiện gian lận" },
    { emoji: "🏭", title: "Sản xuất", desc: "robot, trang trại thông minh" },
    { emoji: "🎓", title: "Giáo dục", desc: "học tập cá nhân hoá" },
  ];
  const ys = [26, 142, 258];

  return (
    <Frame viewBox="0 0 640 350">
      {ys.map((y, i) => (
        <g key={`l${i}`}>
          <path d={`M198 ${y + 32} L 262 175`} stroke={C.line} strokeWidth="2" fill="none" />
          <rect x="10" y={y} width="188" height="64" rx="16" fill={C.white} stroke={C.line} strokeWidth="2" />
          <text x="38" y={y + 40} fontSize="22" textAnchor="middle">
            {left[i].emoji}
          </text>
          <Lines x={60} y={y + 28} lines={[left[i].title]} size={12.5} weight={700} fill={C.ink} anchor="start" />
          <Lines x={60} y={y + 46} lines={[left[i].desc]} size={12} anchor="start" />
        </g>
      ))}

      {ys.map((y, i) => (
        <g key={`r${i}`}>
          <path d={`M442 ${y + 32} L 378 175`} stroke={C.line} strokeWidth="2" fill="none" />
          <rect x="442" y={y} width="188" height="64" rx="16" fill={C.white} stroke={C.line} strokeWidth="2" />
          <text x="470" y={y + 40} fontSize="22" textAnchor="middle">
            {right[i].emoji}
          </text>
          <Lines x={492} y={y + 28} lines={[right[i].title]} size={12.5} weight={700} fill={C.ink} anchor="start" />
          <Lines x={492} y={y + 46} lines={[right[i].desc]} size={12} anchor="start" />
        </g>
      ))}

      <circle cx="320" cy="175" r="58" fill={C.sea} />
      <text x="320" y="170" fontSize="30" textAnchor="middle" fill={C.white} fontWeight="700">
        AI
      </text>
      <Lines x={320} y={192} lines={["Trí tuệ", "nhân tạo"]} size={12} gap={14} fill={C.white} />
    </Frame>
  );
}

// ── ChatGPT hoạt động thế nào (Bài 2) ───────────────────────────────────────
function ChatGptFlow() {
  return (
    <Frame viewBox="0 0 640 400">
      <rect x="60" y="8" width="520" height="66" rx="18" fill={C.leaf} fillOpacity="0.09" stroke={C.leaf} strokeWidth="2" />
      <text x="106" y="50" fontSize="26" textAnchor="middle">
        📚
      </text>
      <Lines x={140} y={34} lines={["Kho văn bản khổng lồ"]} size={13.5} weight={700} fill={C.leafDeep} anchor="start" />
      <Lines x={140} y={54} lines={["hàng vạn văn bản: sách, bài báo, trang web…"]} size={12} anchor="start" />

      <path d="M320 78 L 320 106" stroke={C.sea} strokeWidth="2.5" fill="none" markerEnd="url(#arrow)" />

      <rect x="60" y="112" width="520" height="66" rx="18" fill={C.sea} fillOpacity="0.09" stroke={C.sea} strokeWidth="2" />
      <text x="106" y="154" fontSize="26" textAnchor="middle">
        ⚙️
      </text>
      <Lines x={140} y={138} lines={["Huấn luyện"]} size={13.5} weight={700} fill={C.seaDeep} anchor="start" />
      <Lines x={140} y={158} lines={["máy tự HỌC quy luật của ngôn ngữ từ kho dữ liệu đó"]} size={12} anchor="start" />

      <path d="M320 182 L 320 210" stroke={C.sea} strokeWidth="2.5" fill="none" markerEnd="url(#arrow)" />

      <rect x="60" y="216" width="520" height="84" rx="18" fill={C.coral} fillOpacity="0.1" stroke={C.coral} strokeWidth="2" />
      <text x="106" y="266" fontSize="26" textAnchor="middle">
        🤖
      </text>
      <Lines x={140} y={244} lines={["ChatGPT"]} size={13.5} weight={700} fill={C.coral} anchor="start" />
      <Lines
        x={140}
        y={264}
        lines={["một hệ thống CÓ TRI THỨC, biết SUY LUẬN,", "hiểu được ngữ cảnh của câu hỏi"]}
        size={12}
        gap={16}
        anchor="start"
      />

      <path d="M296 304 L 296 334" stroke={C.sea} strokeWidth="2.5" fill="none" markerEnd="url(#arrow)" />
      <path d="M344 334 L 344 304" stroke={C.sea} strokeWidth="2.5" fill="none" markerEnd="url(#arrow)" />
      <Lines x={430} y={324} lines={["hỏi – đáp qua lại nhiều lượt"]} size={12} anchor="start" />

      <rect x="60" y="338" width="520" height="56" rx="18" fill={C.white} stroke={C.line} strokeWidth="2" />
      <text x="106" y="374" fontSize="26" textAnchor="middle">
        🧑‍🎓
      </text>
      <Lines x={140} y={362} lines={["Người dùng"]} size={13.5} weight={700} fill={C.ink} anchor="start" />
      <Lines x={140} y={381} lines={["hỏi bằng ngôn ngữ thường ngày, không cần câu lệnh"]} size={12} anchor="start" />
    </Frame>
  );
}

const DIAGRAMS: Record<string, () => JSX.Element> = {
  "turing-test": TuringTest,
  "ai-hep-va-manh": AiHepVaManh,
  "ai-linh-vuc": AiLinhVuc,
  "chatgpt-flow": ChatGptFlow,
};

export default function Diagram({ name }: { name: string }) {
  const Cmp = DIAGRAMS[name];
  if (!Cmp) return null;
  return <Cmp />;
}
