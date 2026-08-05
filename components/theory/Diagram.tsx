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
        <marker id="arrow-coral" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill={C.coral} />
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

// ── Hub phát tán, switch nối đúng cặp cổng (Bài 3) ──────────────────────────
// Một nửa khung là hub, một nửa là switch, cùng một tình huống: máy A gửi dữ
// liệu cho máy C. Nhìn số mũi tên cam là thấy ngay vì sao hub dễ xung đột.
function HubSwitchPanel({
  px,
  title,
  subtitle,
  accent,
  toAll,
  note,
}: {
  px: number;
  title: string;
  subtitle: string;
  accent: string;
  toAll: boolean;
  note: string[];
}) {
  const names = ["A", "B", "C", "D"];
  const pcX = [px + 7, px + 85, px + 163, px + 241]; // góc trái mỗi máy
  const center = (i: number) => pcX[i] + 29;
  const conn = (i: number) => px + 92 + 40 * i; // điểm nối dưới thiết bị

  return (
    <g>
      <rect x={px} y="8" width="304" height="294" rx="18" fill={accent} fillOpacity="0.05" stroke={accent} strokeWidth="2" />
      <Lines x={px + 152} y={34} lines={[title]} size={15} weight={700} fill={accent} />
      <Lines x={px + 152} y={52} lines={[subtitle]} size={12} />

      {/* Thiết bị */}
      <rect x={px + 72} y="70" width="160" height="38" rx="10" fill={accent} />
      <Lines x={px + 152} y={94} lines={[title.split(" ")[0]]} size={14} weight={700} fill={C.white} />

      {/* Cáp mạng nối tới cả 4 máy */}
      {names.map((_, i) => (
        <path key={`c${i}`} d={`M${conn(i)} 108 L ${center(i)} 178`} stroke={C.line} strokeWidth="2" fill="none" />
      ))}

      {/* Máy A gửi dữ liệu đi */}
      <path
        d={`M${center(0)} 178 L ${conn(0)} 112`}
        stroke={C.coral}
        strokeWidth="3"
        fill="none"
        markerEnd="url(#arrow-coral)"
      />
      {/* Thiết bị chuyển tiếp: hub ra mọi cổng, switch chỉ ra cổng của máy C */}
      {[1, 2, 3]
        .filter((i) => toAll || i === 2)
        .map((i) => (
          <path
            key={`o${i}`}
            d={`M${conn(i)} 108 L ${center(i)} 174`}
            stroke={C.coral}
            strokeWidth="3"
            fill="none"
            markerEnd="url(#arrow-coral)"
          />
        ))}

      {/* Bốn máy tính */}
      {names.map((n, i) => {
        const active = i === 0 || toAll || i === 2;
        return (
          <g key={n}>
            <rect
              x={pcX[i]}
              y="178"
              width="58"
              height="52"
              rx="12"
              fill={C.white}
              stroke={active ? C.coral : C.line}
              strokeWidth="2"
            />
            <text x={center(i)} y="203" fontSize="19" textAnchor="middle">
              💻
            </text>
            <Lines x={center(i)} y={222} lines={[n]} size={12} weight={700} fill={active ? C.coral : C.inkSoft} />
          </g>
        );
      })}
      <Lines x={center(0)} y={248} lines={["máy gửi"]} size={12} weight={600} fill={C.coral} />
      <Lines x={center(2)} y={248} lines={["máy nhận"]} size={12} weight={600} fill={C.coral} />

      <Lines x={px + 152} y={274} lines={note} size={12} gap={16} fill={C.ink} />
    </g>
  );
}

function HubVsSwitch() {
  return (
    <Frame viewBox="0 0 640 310">
      <HubSwitchPanel
        px={8}
        title="HUB (bộ chia tín hiệu)"
        subtitle="Máy A gửi dữ liệu cho máy C"
        accent={C.coral}
        toAll
        note={["Tín hiệu phát tán ra TẤT CẢ các cổng còn lại.", "Càng nhiều máy, nguy cơ xung đột càng cao."]}
      />
      <HubSwitchPanel
        px={328}
        title="SWITCH (bộ chuyển mạch)"
        subtitle="Máy A gửi dữ liệu cho máy C"
        accent={C.sea}
        toAll={false}
        note={["Chỉ mở kênh truyền tạm thời giữa đúng cặp", "cổng gửi – nhận, truyền xong thì huỷ kênh."]}
      />
    </Frame>
  );
}

// ── Router, cổng LAN và cổng WAN (Bài 3) ────────────────────────────────────
function RouterLanWan() {
  return (
    <Frame viewBox="0 0 640 350">
      {/* LAN của máy gửi */}
      <rect x="8" y="18" width="228" height="86" rx="20" fill={C.leaf} fillOpacity="0.08" stroke={C.leaf} strokeWidth="2" />
      <text x="52" y="62" fontSize="24" textAnchor="middle">
        💻
      </text>
      <text x="96" y="62" fontSize="20" textAnchor="middle">
        🔀
      </text>
      <Lines x={168} y={54} lines={["LAN nhà em"]} size={13} weight={700} fill={C.leafDeep} />
      <Lines x={168} y={74} lines={["máy tính nối qua switch"]} size={12} />

      <path d="M240 58 L 274 58" stroke={C.coral} strokeWidth="3" fill="none" markerEnd="url(#arrow-coral)" />

      {/* Router bên gửi */}
      <rect x="278" y="26" width="150" height="70" rx="14" fill={C.white} stroke={C.sea} strokeWidth="2.5" />
      <Lines x={353} y={46} lines={["ROUTER"]} size={13} weight={700} fill={C.seaDeep} />
      <rect x="288" y="56" width="62" height="30" rx="8" fill={C.leaf} fillOpacity="0.16" />
      <Lines x={319} y={70} lines={["cổng", "LAN"]} size={12} gap={13} weight={600} fill={C.leafDeep} />
      <rect x="356" y="56" width="62" height="30" rx="8" fill={C.gold} fillOpacity="0.2" />
      <Lines x={387} y={70} lines={["cổng", "WAN"]} size={12} gap={13} weight={600} fill={C.goldDeep} />

      <path d="M432 60 L 466 60" stroke={C.coral} strokeWidth="3" fill="none" markerEnd="url(#arrow-coral)" />

      {/* Internet */}
      <ellipse cx="556" cy="112" rx="76" ry="60" fill={C.sea} fillOpacity="0.09" stroke={C.sea} strokeWidth="2" strokeDasharray="7 5" />
      <text x="556" y="92" fontSize="26" textAnchor="middle">
        🌐
      </text>
      <Lines x={556} y={116} lines={["Internet"]} size={14} weight={700} fill={C.seaDeep} />
      <Lines x={556} y={136} lines={["dữ liệu trung chuyển", "qua nhiều router"]} size={12} gap={15} />

      <path d="M556 174 L 556 210" stroke={C.coral} strokeWidth="3" fill="none" markerEnd="url(#arrow-coral)" />

      {/* Router bên nhận */}
      <rect x="352" y="214" width="150" height="70" rx="14" fill={C.white} stroke={C.sea} strokeWidth="2.5" />
      <Lines x={427} y={234} lines={["ROUTER"]} size={13} weight={700} fill={C.seaDeep} />
      <rect x="362" y="244" width="62" height="30" rx="8" fill={C.leaf} fillOpacity="0.16" />
      <Lines x={393} y={258} lines={["cổng", "LAN"]} size={12} gap={13} weight={600} fill={C.leafDeep} />
      <rect x="430" y="244" width="62" height="30" rx="8" fill={C.gold} fillOpacity="0.2" />
      <Lines x={461} y={258} lines={["cổng", "WAN"]} size={12} gap={13} weight={600} fill={C.goldDeep} />

      <path d="M348 248 L 314 248" stroke={C.coral} strokeWidth="3" fill="none" markerEnd="url(#arrow-coral)" />

      {/* LAN của máy nhận */}
      <rect x="80" y="206" width="228" height="86" rx="20" fill={C.leaf} fillOpacity="0.08" stroke={C.leaf} strokeWidth="2" />
      <text x="268" y="250" fontSize="24" textAnchor="middle">
        💻
      </text>
      <Lines x={172} y={242} lines={["LAN trường em"]} size={13} weight={700} fill={C.leafDeep} />
      <Lines x={172} y={262} lines={["dữ liệu tới máy nhận"]} size={12} />

      {/* Kết luận */}
      <rect x="8" y="308" width="624" height="34" rx="17" fill={C.gold} fillOpacity="0.14" />
      <Lines
        x={320}
        y={330}
        lines={["Định tuyến = router chọn cổng thích hợp để dữ liệu đi tới được đúng LAN của máy nhận"]}
        size={12.5}
        weight={600}
        fill={C.goldDeep}
      />
    </Frame>
  );
}

// ── Modem đứng giữa tín hiệu số và tín hiệu tương tự (Bài 3) ────────────────
function ModemSoTuongTu() {
  // Sóng vuông = tín hiệu số, sóng hình sin = tín hiệu tương tự.
  const song = "M0 12 L 12 12 L 12 0 L 26 0 L 26 12 L 40 12 L 40 0 L 54 0 L 54 12 L 66 12";
  const sin = "M0 6 Q 8 -8 16 6 T 32 6 T 48 6 T 64 6";

  return (
    <Frame viewBox="0 0 640 430">
      <rect x="40" y="8" width="560" height="74" rx="18" fill={C.leaf} fillOpacity="0.09" stroke={C.leaf} strokeWidth="2" />
      <text x="84" y="52" fontSize="25" textAnchor="middle">
        💻
      </text>
      <Lines x={118} y={36} lines={["Máy tính trong LAN"]} size={13.5} weight={700} fill={C.leafDeep} anchor="start" />
      <Lines x={118} y={56} lines={["tín hiệu số (digital): các giá trị logic 0 và 1"]} size={12} anchor="start" />
      <g transform="translate(508, 38)">
        <path d={song} stroke={C.leafDeep} strokeWidth="2.5" fill="none" />
      </g>

      <path d="M304 86 L 304 112" stroke={C.sea} strokeWidth="2.5" fill="none" markerEnd="url(#arrow)" />
      <path d="M336 112 L 336 86" stroke={C.sea} strokeWidth="2.5" fill="none" markerEnd="url(#arrow)" />

      <rect x="40" y="118" width="560" height="74" rx="18" fill={C.sea} fillOpacity="0.09" stroke={C.sea} strokeWidth="2" />
      <text x="84" y="162" fontSize="25" textAnchor="middle">
        📡
      </text>
      <Lines x={118} y={146} lines={["Router"]} size={13.5} weight={700} fill={C.seaDeep} anchor="start" />
      <Lines x={118} y={166} lines={["chỉ hướng luồng dữ liệu tới đích, KHÔNG chuyển đổi tín hiệu"]} size={12} anchor="start" />

      <path d="M304 196 L 304 222" stroke={C.sea} strokeWidth="2.5" fill="none" markerEnd="url(#arrow)" />
      <path d="M336 222 L 336 196" stroke={C.sea} strokeWidth="2.5" fill="none" markerEnd="url(#arrow)" />

      <rect x="40" y="228" width="560" height="82" rx="18" fill={C.coral} fillOpacity="0.11" stroke={C.coral} strokeWidth="2.5" />
      <text x="84" y="276" fontSize="25" textAnchor="middle">
        🔄
      </text>
      <Lines x={118} y={254} lines={["MODEM"]} size={13.5} weight={700} fill={C.coral} anchor="start" />
      <Lines
        x={118}
        y={274}
        lines={["đổi tín hiệu số ↔ tín hiệu tương tự.", "Chỉ đổi DẠNG tín hiệu, không làm thay đổi dữ liệu."]}
        size={12}
        gap={16}
        anchor="start"
      />

      <path d="M304 314 L 304 340" stroke={C.sea} strokeWidth="2.5" fill="none" markerEnd="url(#arrow)" />
      <path d="M336 340 L 336 314" stroke={C.sea} strokeWidth="2.5" fill="none" markerEnd="url(#arrow)" />

      <rect x="40" y="346" width="560" height="74" rx="18" fill={C.gold} fillOpacity="0.12" stroke={C.gold} strokeWidth="2" />
      <text x="84" y="390" fontSize="25" textAnchor="middle">
        🌐
      </text>
      <Lines x={118} y={374} lines={["Nhà cung cấp dịch vụ Internet"]} size={13.5} weight={700} fill={C.goldDeep} anchor="start" />
      <Lines x={118} y={394} lines={["tín hiệu tương tự (analog): cáp quang, sóng 3G/4G/5G…"]} size={12} anchor="start" />
      <g transform="translate(508, 378)">
        <path d={sin} stroke={C.goldDeep} strokeWidth="2.5" fill="none" />
      </g>
    </Frame>
  );
}

const DIAGRAMS: Record<string, () => JSX.Element> = {
  "turing-test": TuringTest,
  "ai-hep-va-manh": AiHepVaManh,
  "ai-linh-vuc": AiLinhVuc,
  "chatgpt-flow": ChatGptFlow,
  "hub-vs-switch": HubVsSwitch,
  "router-lan-wan": RouterLanWan,
  "modem-so-tuong-tu": ModemSoTuongTu,
};

export default function Diagram({ name }: { name: string }) {
  const Cmp = DIAGRAMS[name];
  if (!Cmp) return null;
  return <Cmp />;
}
