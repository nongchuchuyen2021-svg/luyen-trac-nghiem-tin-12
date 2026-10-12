import type { LessonGame, SortGame, TimelineGame, ClassifyGame } from "@/lib/types";

// 3 trò chơi ôn bài tương tác chuẩn SGK Tin học 12 (Kết nối tri thức)
const games: LessonGame[] = [
  {
    "kind": "sort",
    "id": "font-hay-color",
    "title": "Thuộc tính Kiểu chữ (font) hay Màu sắc (color)?",
    "emoji": "🔤",
    "instructions": "Phân loại các thuộc tính CSS vào nhóm Định dạng chữ (Font) hay nhóm Màu sắc (Color)?",
    "matchLabel": "Thuộc tính Màu sắc (Color)",
    "matchEmoji": "🎨",
    "noMatchLabel": "Thuộc tính Kiểu chữ (Font)",
    "noMatchEmoji": "🔤",
    "items": [
      {
        "id": "fc-family",
        "emoji": "🖋️",
        "label": "font-family: Chọn họ phông chữ (Arial, Roboto...)",
        "isMatch": false,
        "explain": "font-family quy định họ phông chữ."
      },
      {
        "id": "fc-color",
        "emoji": "🌈",
        "label": "color: Màu hiển thị của chữ cái",
        "isMatch": true,
        "explain": "color quy định màu chữ."
      },
      {
        "id": "fc-weight",
        "emoji": "💪",
        "label": "font-weight: Độ đậm nhạt của nét chữ (bold, 700)",
        "isMatch": false,
        "explain": "font-weight chỉnh độ đậm của font."
      },
      {
        "id": "fc-bg",
        "emoji": "🖼️",
        "label": "background-color: Màu nền của phần tử",
        "isMatch": true,
        "explain": "background-color quy định màu nền."
      },
      {
        "id": "fc-style",
        "emoji": "📐",
        "label": "font-style: Kiểu chữ in nghiêng (italic)",
        "isMatch": false,
        "explain": "font-style chỉnh kiểu chữ nghiêng/thẳng."
      },
      {
        "id": "fc-opacity",
        "emoji": "👻",
        "label": "opacity: Độ trong suốt của màu sắc",
        "isMatch": true,
        "explain": "opacity quy định độ mờ/trong suốt."
      }
    ]
  },
  {
    "kind": "sort",
    "id": "don-vi-tuyet-doi-hay-tuong-doi",
    "title": "Đơn vị đo Tuyệt đối (px) hay Tương đối (%, rem)?",
    "emoji": "📏",
    "instructions": "Phân biệt đơn vị đo kích thước: Tuyệt đối cố định (px, pt) hay Tương đối co giãn theo màn hình (%, rem, em, vw)?",
    "matchLabel": "Đơn vị Tương đối (Co giãn linh hoạt)",
    "matchEmoji": "📱",
    "noMatchLabel": "Đơn vị Tuyệt đối (Cố định điểm ảnh)",
    "noMatchEmoji": "📐",
    "items": [
      {
        "id": "dr-px",
        "emoji": "🧱",
        "label": "px (pixel): Điểm ảnh cố định trên màn hình",
        "isMatch": false,
        "explain": "px là đơn vị tuyệt đối phổ biến nhất."
      },
      {
        "id": "dr-pct",
        "emoji": "📊",
        "label": "% (phần trăm): Tính theo kích thước của phần tử cha",
        "isMatch": true,
        "explain": "% là đơn vị tương đối co giãn theo thẻ cha."
      },
      {
        "id": "dr-pt",
        "emoji": "📄",
        "label": "pt (point): Đơn vị đo điểm in ấn truyền thống",
        "isMatch": false,
        "explain": "pt là đơn vị tuyệt đối dùng trong in ấn."
      },
      {
        "id": "dr-rem",
        "emoji": "🌱",
        "label": "rem: Tính tỷ lệ theo cỡ chữ gốc của thẻ <html>",
        "isMatch": true,
        "explain": "rem là Root EM, co giãn chuẩn theo font gốc."
      },
      {
        "id": "dr-vw",
        "emoji": "💻",
        "label": "vw / vh: Tỷ lệ theo chiều rộng/cao khung nhìn màn hình",
        "isMatch": true,
        "explain": "vw/vh thay đổi linh hoạt theo kích thước màn hình thiết bị."
      }
    ]
  },
  {
    "kind": "classify",
    "id": "bieu-dien-mau-css",
    "title": "Các cách biểu diễn màu sắc trong CSS",
    "emoji": "🎨",
    "instructions": "Xếp các mã màu vào đúng định dạng biểu diễn màu tương ứng trong CSS!",
    "categories": [
      {
        "id": "name",
        "emoji": "🔤",
        "name": "Tên màu tiếng Anh",
        "subtitle": "Keyword màu có sẵn"
      },
      {
        "id": "hex",
        "emoji": "#️⃣",
        "name": "Mã Hex (#RRGGBB)",
        "subtitle": "Hệ cơ số 16 bắt đầu bằng #"
      },
      {
        "id": "rgb",
        "emoji": "🌈",
        "name": "Hàm rgb() / rgba()",
        "subtitle": "3 kênh Red-Green-Blue (0-255)"
      }
    ],
    "items": [
      {
        "id": "m-red",
        "label": "red, blue, green, yellow",
        "categoryId": "name",
        "explain": "Dùng trực tiếp tên màu tiếng Anh."
      },
      {
        "id": "m-hex1",
        "label": "#FF0000 (Đỏ rực)",
        "categoryId": "hex",
        "explain": "Mã thập lục phân 6 ký tự bắt đầu bằng #."
      },
      {
        "id": "m-rgb1",
        "label": "rgb(255, 0, 0) (Đỏ tuyệt đối)",
        "categoryId": "rgb",
        "explain": "Hàm rgb() với 3 chỉ số từ 0 đến 255."
      },
      {
        "id": "m-white",
        "label": "white, black, transparent",
        "categoryId": "name",
        "explain": "Tên màu chuẩn trình duyệt nhận biết."
      },
      {
        "id": "m-hex2",
        "label": "#0D7C86 (Màu xanh ngọc THPT Na Rì)",
        "categoryId": "hex",
        "explain": "Mã hex định danh màu chính xác."
      },
      {
        "id": "m-rgba",
        "label": "rgba(13, 124, 134, 0.5) (Có độ mờ)",
        "categoryId": "rgb",
        "explain": "rgba thêm kênh Alpha điều chỉnh độ trong suốt."
      }
    ]
  }
];

export default games;
