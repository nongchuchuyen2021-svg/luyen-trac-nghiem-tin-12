import type { LessonGame, SortGame, TimelineGame, ClassifyGame } from "@/lib/types";

// 3 trò chơi ôn bài tương tác chuẩn SGK Tin học 12 (Kết nối tri thức)
const games: LessonGame[] = [
  {
    "kind": "sort",
    "id": "the-doi-hay-the-don",
    "title": "Thẻ đôi hay Thẻ đơn?",
    "emoji": "🏷️",
    "instructions": "Kéo từng thẻ HTML sang đúng khay: đây là THẺ ĐÔI (phải có thẻ đóng </...>) hay THẺ ĐƠN (chỉ có thẻ mở)?",
    "matchLabel": "Thẻ đơn",
    "matchEmoji": "➖",
    "noMatchLabel": "Thẻ đôi",
    "noMatchEmoji": "🔗",
    "items": [
      {
        "id": "t-p",
        "emoji": "📝",
        "label": "<p>: Đoạn văn bản",
        "isMatch": false,
        "explain": "Thẻ đôi — cần cặp thẻ <p>...</p>."
      },
      {
        "id": "t-hr",
        "emoji": "➖",
        "label": "<hr>: Kẻ đường ngang phân cách",
        "isMatch": true,
        "explain": "Thẻ đơn — không có thẻ đóng và không có nội dung con."
      },
      {
        "id": "t-h1",
        "emoji": "📌",
        "label": "<h1>: Tiêu đề cấp 1",
        "isMatch": false,
        "explain": "Thẻ đôi — cần cặp thẻ <h1>...</h1>."
      },
      {
        "id": "t-br",
        "emoji": "↵",
        "label": "<br>: Ngắt xuống dòng mới",
        "isMatch": true,
        "explain": "Thẻ đơn — dùng để buộc trình duyệt xuống dòng."
      },
      {
        "id": "t-em",
        "emoji": "🖋️",
        "label": "<em>: In nghiêng nhấn mạnh",
        "isMatch": false,
        "explain": "Thẻ đôi — cần cặp thẻ <em>...</em>."
      },
      {
        "id": "t-img",
        "emoji": "🖼️",
        "label": "<img>: Chèn hình ảnh",
        "isMatch": true,
        "explain": "Thẻ đơn — chỉ chứa thuộc tính nguồn ảnh, không có nội dung con."
      },
      {
        "id": "t-div",
        "emoji": "📦",
        "label": "<div>: Khối phân chia bố cục",
        "isMatch": false,
        "explain": "Thẻ đôi — dùng bao bọc các phần tử con bên trong."
      },
      {
        "id": "t-meta",
        "emoji": "⚙️",
        "label": "<meta>: Khai báo cấu hình trang web",
        "isMatch": true,
        "explain": "Thẻ đơn — nằm trong thẻ <head>."
      }
    ]
  },
  {
    "kind": "sort",
    "id": "head-hay-body",
    "title": "Nằm trong <head> hay trong <body>?",
    "emoji": "🧱",
    "instructions": "Kéo từng phần tử sang đúng vị trí: phần tử này thuộc phần cấu hình (<head>) hay phần hiển thị ra màn hình (<body>)?",
    "matchLabel": "Thuộc <body> (Hiển thị)",
    "matchEmoji": "👁️",
    "noMatchLabel": "Thuộc <head> (Cấu hình)",
    "noMatchEmoji": "🧠",
    "items": [
      {
        "id": "hb-title",
        "emoji": "🏷️",
        "label": "<title>: Tên trang web trên tab trình duyệt",
        "isMatch": false,
        "explain": "Thuộc <head> — mô tả tên trang hiển thị trên tab."
      },
      {
        "id": "hb-h1",
        "emoji": "📢",
        "label": "<h1>: Tiêu đề bài viết chính trên trang",
        "isMatch": true,
        "explain": "Thuộc <body> — nội dung người xem nhìn thấy."
      },
      {
        "id": "hb-charset",
        "emoji": "🔤",
        "label": "<meta charset=\"utf-8\">: Cấu hình mã tiếng Việt",
        "isMatch": false,
        "explain": "Thuộc <head> — thông tin kỹ thuật của trang web."
      },
      {
        "id": "hb-p",
        "emoji": "📄",
        "label": "<p>: Đoạn văn bản giới thiệu bản thân",
        "isMatch": true,
        "explain": "Thuộc <body> — nội dung trang web."
      },
      {
        "id": "hb-style",
        "emoji": "🎨",
        "label": "<style>: Khai báo mã định dạng CSS nội bộ",
        "isMatch": false,
        "explain": "Thuộc <head> — định nghĩa quy tắc kiểu dáng cho cả trang."
      },
      {
        "id": "hb-img",
        "emoji": "🏞️",
        "label": "<img>: Hình ảnh kỷ yếu lớp học",
        "isMatch": true,
        "explain": "Thuộc <body> — thành phần giao diện trực quan."
      },
      {
        "id": "hb-script",
        "emoji": "⚡",
        "label": "<script>: Liên kết tệp mã lệnh JavaScript",
        "isMatch": false,
        "explain": "Thường nằm trong <head> hoặc cuối <body>, ở đây đóng vai trò cấu hình kịch bản."
      },
      {
        "id": "hb-table",
        "emoji": "📊",
        "label": "<table>: Bảng điểm học tập của học sinh",
        "isMatch": true,
        "explain": "Thuộc <body> — hiển thị bảng dữ liệu trên trang."
      }
    ]
  },
  {
    "kind": "timeline",
    "id": "khung-suon-html",
    "title": "Cấu trúc khung sườn tệp HTML từ ngoài vào trong",
    "emoji": "🏗️",
    "instructions": "Sắp xếp các dòng mã theo đúng thứ tự xuất hiện chuẩn từ đầu tệp đến cuối tệp HTML!",
    "items": [
      {
        "id": "ks-1",
        "emoji": "1️⃣",
        "label": "<!DOCTYPE html> (Khai báo kiểu tệp)",
        "year": "Dòng 1",
        "explain": "Dòng đầu tiên thông báo chuẩn HTML5 cho trình duyệt."
      },
      {
        "id": "ks-2",
        "emoji": "2️⃣",
        "label": "<html> (Phần tử gốc bao bọc cả trang)",
        "year": "Dòng 2",
        "explain": "Thẻ gốc chứa toàn bộ các thẻ con khác."
      },
      {
        "id": "ks-3",
        "emoji": "3️⃣",
        "label": "<head> (Phần đầu chứa cấu hình và tiêu đề tab)",
        "year": "Dòng 3",
        "explain": "Chứa <meta> và <title>."
      },
      {
        "id": "ks-4",
        "emoji": "4️⃣",
        "label": "<body> (Phần thân chứa toàn bộ nội dung hiển thị)",
        "year": "Dòng 4",
        "explain": "Chứa các thẻ văn bản, hình ảnh, âm thanh người xem thấy."
      },
      {
        "id": "ks-5",
        "emoji": "5️⃣",
        "label": "</html> (Thẻ đóng kết thúc tệp)",
        "year": "Dòng cuối",
        "explain": "Đóng phần tử gốc, hoàn tất tệp HTML."
      }
    ]
  }
];

export default games;
