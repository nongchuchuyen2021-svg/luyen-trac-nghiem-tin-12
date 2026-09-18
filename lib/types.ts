export type Question = {
  id: string;
  q: string;
  // Đoạn code minh hoạ (hiển thị khối chữ mono riêng dưới câu hỏi), nếu có
  code?: string;
  options: [string, string, string, string];
  // Chỉ số đáp án đúng trong mảng options (0-3). Khi luyện, thứ tự phương án
  // được trộn ngẫu nhiên — xem QuizClient.
  answer: 0 | 1 | 2 | 3;
  explain: string;
};

// Câu trắc nghiệm đúng/sai 4 mệnh đề (dạng D2 đề thi tốt nghiệp THPT từ 2025):
// một lời dẫn tình huống + 4 ý a/b/c/d, đánh giá đúng/sai từng ý độc lập.
export type TFStatement = {
  text: string;
  answer: boolean; // true = Đúng, false = Sai
  explain: string;
};

export type TFQuestion = {
  id: string;
  context: string; // lời dẫn tình huống (3 dòng trở lên, có ngữ cảnh sinh động)
  code?: string;
  statements: TFStatement[]; // luôn 4 ý
};

// Câu tự luận: đề bài + gợi ý trả lời để học sinh tự đối chiếu
export type EssayQuestion = {
  id: string;
  q: string;
  code?: string;
  answer: string; // gợi ý đáp án, xuống dòng bằng \n
};

// Bộ câu hỏi bổ sung của một bài (ngoài trắc nghiệm 4 phương án)
export type LessonExtra = {
  tf: TFQuestion[];
  essay: EssayQuestion[];
};

// ─── Lý thuyết tự học ────────────────────────────────────────────────────────
// Bài lí thuyết được ghép từ các "khối" (block) thay vì một đoạn văn dài, để
// mỗi ý đứng riêng trong một hình thức trực quan phù hợp: thẻ màu, bảng so
// sánh, dòng thời gian, hình vẽ SVG… Học sinh lướt tới đâu hiểu tới đó.

// Màu nền của thẻ/hộp — dùng tên màu trong tailwind.config.ts.
export type Tone = "sea" | "coral" | "leaf" | "gold" | "berry";

export type TheoryCard = {
  emoji: string;
  title: string;
  text: string;
};

export type TheoryBlock =
  // Đoạn văn thường. Bọc **…** để in đậm một cụm từ khoá.
  | { kind: "text"; text: string }
  | { kind: "list"; items: string[]; ordered?: boolean }
  // Lưới thẻ có emoji — dùng cho các nhóm ngang hàng (đặc trưng, lĩnh vực…)
  | { kind: "cards"; tone?: Tone; items: TheoryCard[] }
  // Bảng so sánh hai cột, kiểu "cái này khác cái kia chỗ nào"
  | {
      kind: "compare";
      left: { title: string; emoji: string; items: string[] };
      right: { title: string; emoji: string; items: string[] };
    }
  // Dòng thời gian / quy trình các bước
  | { kind: "steps"; items: { label: string; title: string; text: string }[] }
  // Hình vẽ SVG, khoá tra trong components/theory/Diagram.tsx
  | { kind: "figure"; diagram: string; caption: string }
  // Khối mã HTML/CSS. preview = true thì hiện thêm khung "kết quả trên trình duyệt".
  // tall = true thì khung xem trước cao gấp đôi — dành cho biểu mẫu nhiều dòng
  // (Bài 12) hay bảng dài, những thứ không lọt vừa khung 180px mặc định.
  | { kind: "code"; code: string; caption?: string; preview?: boolean; tall?: boolean }
  // Hộp ví dụ đời thường, nền xanh biển nhạt
  | { kind: "example"; title: string; text: string }
  // Hộp ghi nhớ, nền vàng — lấy đúng kết luận đóng khung trong SGK
  | { kind: "note"; text: string }
  // Hộp "Cập nhật 2026": chỗ SGK đã lạc hậu so với thực tế, hoặc kiến thức
  // mới xuất hiện sau khi sách in. CỐ Ý để màu và viền khác hẳn mọi hộp
  // khác, kèm nhãn "đề thi không hỏi phần này" — đề thi tốt nghiệp bám SGK,
  // học sinh phải phân biệt được đâu là phần thi, đâu là phần biết thêm.
  | { kind: "update"; title: string; text: string; items?: TheoryCard[] }
  // Câu hỏi kiểm tra nhanh xen giữa bài, trả lời xong hiện giải thích ngay
  | {
      kind: "check";
      q: string;
      options: string[];
      answer: number;
      explain: string;
    };

export type TheorySection = {
  id: string;
  emoji: string;
  heading: string;
  blocks: TheoryBlock[];
};

export type LessonTheory = {
  intro: string; // 1-2 câu dẫn nhập, nói bài này học gì
  minutes: number; // ước lượng thời gian đọc
  sections: TheorySection[];
  summary: string[]; // "Ghi nhớ nhanh" cuối bài, 3-5 gạch đầu dòng
};

// Số câu từng dạng của một bài, đếm sẵn ở phía máy chủ rồi truyền xuống trang
// chủ. Làm vậy để trang chủ không phải nạp cả ngân hàng câu hỏi vào trình duyệt
// chỉ để đếm số câu.
export type LessonCounts = {
  mcq: number;
  tf: number;
  essay: number;
  theory: boolean;
};

export type Lesson = {
  id: string; // slug dùng trong URL, vd "bai-01"
  title: string; // vd "Bài 1. Thông tin và xử lí thông tin"
  available: boolean; // false = chưa có câu hỏi, hiện mờ trên trang chủ
};

// ─── Game kéo-thả ôn bài ─────────────────────────────────────────────────────
// Một thẻ trong game phân loại 2 nhóm (đúng/sai, có/không,...)
export type SortGameItem = {
  id: string;
  emoji: string;
  label: string;
  isMatch: boolean; // true = thuộc nhóm bên phải (label "match"), false = nhóm bên trái
  explain: string;
};

// Game kéo-thả phân loại 2 nhóm, vd "Lợi ích hay Nguy cơ của AI?"
export type SortGame = {
  kind: "sort";
  id: string; // slug duy nhất trong 1 bài, dùng làm key khi chọn game
  title: string;
  emoji: string;
  instructions: string; // hướng dẫn ngắn hiển thị đầu game
  matchLabel: string; // nhãn khay bên phải
  matchEmoji: string;
  noMatchLabel: string; // nhãn khay bên trái
  noMatchEmoji: string;
  items: SortGameItem[];
};

// Một mốc trong game sắp xếp dòng thời gian — thứ tự đúng chính là thứ tự
// xuất hiện trong mảng `items` của TimelineGame (không cần trường "order" riêng).
export type TimelineItem = {
  id: string;
  emoji: string;
  label: string;
  year: string; // hiển thị sau khi kiểm tra, vd "1957"
  explain: string;
};

// Game kéo-thả (hoặc chạm) sắp xếp các mốc theo đúng trình tự thời gian
export type TimelineGame = {
  kind: "timeline";
  id: string;
  title: string;
  emoji: string;
  instructions: string;
  items: TimelineItem[]; // đã đúng thứ tự thời gian sẵn trong data — game sẽ tự xáo khi chơi
};

// Một nút thiết bị cố định trên sơ đồ mạng — vị trí/thứ tự đã đúng sẵn theo
// mảng `nodes`, học sinh phải ghép đúng THẺ HÀNH ĐỘNG vào đúng thiết bị (khác
// TimelineGame ở chỗ thử thách là "ai làm gì" chứ không phải "trước/sau").
export type TopologyNode = {
  id: string;
  node: string; // tên thiết bị hiển thị cố định trên sơ đồ, vd "Switch A"
  emoji: string;
  action: string; // hành động xảy ra tại thiết bị này — nội dung thẻ cần ghép đúng
  explain: string;
};

// Game kéo-thả (hoặc chạm) ghép hành động vào đúng thiết bị trên sơ đồ mạng
export type TopologyGame = {
  kind: "topology";
  id: string;
  title: string;
  emoji: string;
  instructions: string;
  nodes: TopologyNode[]; // đúng thứ tự vật lý cố định của sơ đồ (đầu → cuối)
  endLabel?: string; // nhãn thiết bị đích cuối cùng, chỉ trang trí, vd "💻 Máy B (đích)"
};

// Một lớp đóng gói dữ liệu (Ethernet / IP / TCP) — hiển thị như một "phong bì"
// lồng vào phong bì lớp ngoài, đúng theo thứ tự đóng gói thật của TCP/IP.
export type EncapsulationLayerId = "ethernet" | "ip" | "tcp";

export type EncapsulationLayer = {
  id: EncapsulationLayerId;
  emoji: string;
  name: string; // vd "Khung Ethernet"
  subtitle: string; // giải thích ngắn lớp này lo việc gì
};

// Một mẩu thông tin cần phân loại đúng vào lớp phụ trách nó
export type EncapsulationItem = {
  id: string;
  label: string;
  layerId: EncapsulationLayerId;
  explain: string;
};

// Game xếp các mẩu thông tin vào đúng lớp đóng gói (Ethernet ⊃ IP ⊃ TCP) —
// toàn bộ hiện ra một lần (không chia câu hỏi tuần tự) để thấy được TOÀN BỘ
// bức tranh phân tầng cùng lúc, đúng tinh thần "vì sao cần tới 3 giao thức".
export type EncapsulationGame = {
  kind: "encapsulation";
  id: string;
  title: string;
  emoji: string;
  instructions: string;
  layers: [EncapsulationLayer, EncapsulationLayer, EncapsulationLayer]; // đúng 3 lớp, NGOÀI (Ethernet) → TRONG (TCP)
  dataLabel: string; // nhãn ô trong cùng, chỉ trang trí — dữ liệu gốc trước khi đóng gói
  items: EncapsulationItem[];
};

// Một dòng trong bảng định tuyến cố định hiển thị suốt game
export type RoutingRule = {
  id: string;
  label: string; // tên nhóm địa chỉ/mạng đích, vd "Quảng Ninh"
  port: string; // cổng ra tương ứng, vd "Đường 37"
};

// Một gói tin cần định tuyến — đúng 1 trong các rule, hoặc đi cổng mặc định
// (dùng id đặc biệt "default" khi không khớp rule nào)
export type RoutingQuestion = {
  id: string;
  destination: string; // mô tả địa chỉ/đích đến hiển thị cho học sinh
  correctRuleId: string; // trùng RoutingRule.id, hoặc "default"
  explain: string;
};

// Game mô phỏng bảng định tuyến: bảng cố định luôn hiển thị, học sinh chọn
// đúng cổng ra cho từng gói tin đến — kể cả nhận biết khi nào phải đi cổng mặc định
export type RoutingGame = {
  kind: "routing";
  id: string;
  title: string;
  emoji: string;
  instructions: string;
  routerName: string; // tên router/trạm hiển thị phía trên bảng, vd "Bưu cục Hải Dương"
  rules: RoutingRule[]; // các dòng có tên trong bảng (KHÔNG gồm dòng mặc định)
  defaultPort: string; // nhãn cổng mặc định, vd "Đường số 5 (mặc định, về Hà Nội)"
  questions: RoutingQuestion[];
};

// Một thử thách "tìm đường trong menu": từ một mục tiêu thao tác, học sinh
// phải ghép đúng thứ tự các cấp menu cần đi qua — trong túi thẻ CÓ LẪN vài
// mục menu thật nhưng thuộc quy trình khác (decoys), không được đặt vào.
export type MenuPathQuestion = {
  id: string;
  goal: string; // mục tiêu thao tác, vd "Bật cho các máy khác nhìn thấy máy này"
  path: string[]; // đúng thứ tự các cấp menu cần đi qua, đầu → cuối
  decoys: string[]; // các mục menu có thật (ở quy trình khác) nhưng KHÔNG thuộc đường đi này
  explain: string;
};

// Game ghép chuỗi bước menu đúng thứ tự, tránh các "bẫy" là mục menu thật của
// quy trình khác — khác TopologyGame ở chỗ vị trí không cố định sẵn, học sinh
// phải tự dựng cả thứ tự lẫn tránh bẫy cùng lúc.
export type MenuPathGame = {
  kind: "menupath";
  id: string;
  title: string;
  emoji: string;
  instructions: string;
  questions: MenuPathQuestion[];
};

// Một nhóm phân loại phẳng (KHÔNG lồng nhau, khác EncapsulationGame) — hiển
// thị dạng lưới thẻ song song, mỗi thẻ có nhãn + mô tả ngắn.
export type ClassifyCategory = {
  id: string;
  emoji: string;
  name: string;
  subtitle: string;
};

// Một mẩu (hành vi, tình huống, phát biểu…) cần xếp đúng vào 1 trong các nhóm
export type ClassifyItem = {
  id: string;
  label: string;
  categoryId: string; // trùng ClassifyCategory.id
  explain: string;
};

// Game xếp các mẩu vào đúng nhóm phân loại (2-6 nhóm song song) — toàn bộ
// hiện ra một lần, chấm điểm một lượt, giống EncapsulationGame về tương tác
// nhưng KHÔNG mang ý nghĩa lồng nhau nên hiển thị dạng lưới phẳng.
export type ClassifyGame = {
  kind: "classify";
  id: string;
  title: string;
  emoji: string;
  instructions: string;
  categories: ClassifyCategory[];
  items: ClassifyItem[];
};

export type LessonGame = SortGame | TimelineGame | TopologyGame | EncapsulationGame | RoutingGame | MenuPathGame | ClassifyGame;

// ─── Ôn tập tổng kết ─────────────────────────────────────────────────────────
// Trang ôn nhanh trước khi kiểm tra: thẻ lật ghi nhớ, lỗi hay gặp, mẹo nhớ và
// một checklist tự đánh giá. Khác với Lý thuyết (đọc hiểu lần đầu), trang này
// dành cho lúc đã học xong, chỉ cần ôn lại nhanh những điểm cốt lõi.
export type ReviewFlashcard = {
  front: string; // mặt trước: câu hỏi hoặc khái niệm
  back: string; // mặt sau: câu trả lời ngắn gọn
};

export type ReviewMistake = {
  mistake: string; // lỗi/nhầm lẫn hay gặp
  fix: string; // cách hiểu/sửa đúng
};

export type LessonReview = {
  summary: string; // 1-2 câu tổng kết cả bài
  keyPoints: string[]; // ý cốt lõi, 4-6 gạch đầu dòng
  commonMistakes: ReviewMistake[];
  tips: string[]; // mẹo ghi nhớ nhanh
  flashcards: ReviewFlashcard[];
  checklist: string[]; // học sinh tự tick "tôi đã..."
  diagram?: string; // khoá tra trong components/theory/Diagram.tsx, hình tổng kết (nếu có)
};

export type Topic = {
  id: string;
  name: string;
  emoji: string;
  lessons: Lesson[];
};

export type LessonProgress = {
  best: number; // điểm cao nhất, phần trăm 0-100
  attempts: number;
  lastAt: string; // ISO date
};

export type ProgressMap = Record<string, LessonProgress>;
