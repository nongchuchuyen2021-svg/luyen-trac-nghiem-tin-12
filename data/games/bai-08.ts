import type { LessonGame, SortGame, TimelineGame, ClassifyGame } from "@/lib/types";

// 3 trò chơi ôn bài tương tác chuẩn SGK Tin học 12 (Kết nối tri thức)
const games: LessonGame[] = [
  {
    "kind": "sort",
    "id": "tieu-de-hay-doan-van",
    "title": "Thẻ Tiêu đề (h1-h6) hay Thẻ Đoạn văn (p)?",
    "emoji": "📝",
    "instructions": "Phân loại đặc điểm và cách dùng: đây là đặc điểm của nhóm thẻ tiêu đề (<h1> - <h6>) hay thẻ đoạn văn (<p>)?",
    "matchLabel": "Thẻ Tiêu đề (h1 - h6)",
    "matchEmoji": "📌",
    "noMatchLabel": "Thẻ Đoạn văn (<p>)",
    "noMatchEmoji": "📄",
    "items": [
      {
        "id": "td-lon-nhat",
        "emoji": "👑",
        "label": "<h1>: Tiêu đề quan trọng và có cỡ chữ lớn nhất",
        "isMatch": true,
        "explain": "Thuộc nhóm thẻ tiêu đề <h1>-<h6>."
      },
      {
        "id": "td-doan",
        "emoji": "✍️",
        "label": "<p>: Chứa một đoạn văn bản hoàn chỉnh",
        "isMatch": false,
        "explain": "Thẻ <p> dùng cho các đoạn văn thông thường."
      },
      {
        "id": "td-nho-dan",
        "emoji": "📉",
        "label": "Có 6 cấp độ giảm dần từ cấp 1 đến cấp 6",
        "isMatch": true,
        "explain": "Nhóm thẻ tiêu đề gồm chính xác 6 cấp: h1, h2, h3, h4, h5, h6."
      },
      {
        "id": "td-tu-xuong-dong",
        "emoji": "↵",
        "label": "Tự động ngắt đoạn và có khoảng cách trên dưới",
        "isMatch": false,
        "explain": "Thẻ đoạn văn <p> có lề trên dưới mặc định của trình duyệt."
      },
      {
        "id": "td-h3",
        "emoji": "🏷️",
        "label": "<h3>: Thường dùng làm tiêu đề mục con",
        "isMatch": true,
        "explain": "Tiêu đề cấp 3 nhỏ hơn h1 và h2."
      },
      {
        "id": "td-chu-thuong",
        "emoji": "📖",
        "label": "Nội dung thường là chữ thường, cỡ chữ chuẩn 16px",
        "isMatch": false,
        "explain": "Đặc điểm hiển thị chuẩn của văn bản đoạn <p>."
      }
    ]
  },
  {
    "kind": "sort",
    "id": "dinh-dang-chu",
    "title": "In đậm (strong) hay In nghiêng (em)?",
    "emoji": "🖋️",
    "instructions": "Kéo từng thẻ sang đúng ý nghĩa định dạng: Thẻ mang ý nghĩa in đậm nhấn mạnh (strong/b) hay in nghiêng (em/i)?",
    "matchLabel": "In đậm (<strong>, <b>)",
    "matchEmoji": "💪",
    "noMatchLabel": "In nghiêng (<em>, <i>)",
    "noMatchEmoji": "📐",
    "items": [
      {
        "id": "dd-strong",
        "emoji": "⭐",
        "label": "<strong>: Nhấn mạnh tầm quan trọng (chữ đậm)",
        "isMatch": true,
        "explain": "<strong> vừa làm đậm vừa mang ý nghĩa ngữ nghĩa nhấn mạnh."
      },
      {
        "id": "dd-em",
        "emoji": "✨",
        "label": "<em>: Nhấn mạnh ngữ điệu câu (chữ nghiêng)",
        "isMatch": false,
        "explain": "<em> hiển thị dạng chữ in nghiêng."
      },
      {
        "id": "dd-b",
        "emoji": "🔲",
        "label": "<b>: Đơn thuần làm chữ in đậm không đổi ngữ nghĩa",
        "isMatch": true,
        "explain": "Thẻ <b> là viết tắt của Bold (chữ đậm)."
      },
      {
        "id": "dd-i",
        "emoji": "🖊️",
        "label": "<i>: Đơn thuần làm chữ in nghiêng (Italic)",
        "isMatch": false,
        "explain": "Thẻ <i> là viết tắt của Italic."
      },
      {
        "id": "dd-chu-y",
        "emoji": "⚠️",
        "label": "Dùng để lưu ý học sinh về từ khóa then chốt quan trọng",
        "isMatch": true,
        "explain": "Từ khóa then chốt thường dùng <strong>."
      },
      {
        "id": "dd-chu-thich",
        "emoji": "💬",
        "label": "Dùng cho trích dẫn hoặc câu thoại nhân vật",
        "isMatch": false,
        "explain": "Trích dẫn hoặc lời thoại thường dùng <em>."
      }
    ]
  },
  {
    "kind": "sort",
    "id": "ten-the-hay-thuoc-tinh",
    "title": "Tên thẻ hay Thuộc tính HTML?",
    "emoji": "🧩",
    "instructions": "Phân biệt giữa Tên thẻ HTML (Tag name) và Thuộc tính bổ sung (Attribute)?",
    "matchLabel": "Thuộc tính (Attribute)",
    "matchEmoji": "⚙️",
    "noMatchLabel": "Tên thẻ (Tag name)",
    "noMatchEmoji": "🏷️",
    "items": [
      {
        "id": "tt-p",
        "emoji": "📄",
        "label": "p (paragraph)",
        "isMatch": false,
        "explain": "Tên thẻ tạo đoạn văn bản."
      },
      {
        "id": "tt-style",
        "emoji": "🎨",
        "label": "style=\"color: red\": Thiết lập kiểu dáng inline",
        "isMatch": true,
        "explain": "Thuộc tính bổ sung gán giá trị cho thẻ."
      },
      {
        "id": "tt-h1",
        "emoji": "📢",
        "label": "h1 (heading 1)",
        "isMatch": false,
        "explain": "Tên thẻ tiêu đề cấp 1."
      },
      {
        "id": "tt-id",
        "emoji": "🆔",
        "label": "id=\"phan-dau\": Định danh duy nhất cho phần tử",
        "isMatch": true,
        "explain": "Thuộc tính id gán mã định danh duy nhất."
      },
      {
        "id": "tt-hr",
        "emoji": "➖",
        "label": "hr (horizontal rule)",
        "isMatch": false,
        "explain": "Tên thẻ đường kẻ ngang."
      },
      {
        "id": "tt-class",
        "emoji": "🏷️",
        "label": "class=\"hop-thong-tin\": Gán lớp phong cách",
        "isMatch": true,
        "explain": "Thuộc tính class dùng để định dạng CSS theo nhóm."
      }
    ]
  }
];

export default games;
