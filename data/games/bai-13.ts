import type { LessonGame, SortGame, TimelineGame, ClassifyGame } from "@/lib/types";

// 3 trò chơi ôn bài tương tác chuẩn SGK Tin học 12 (Kết nối tri thức)
const games: LessonGame[] = [
  {
    "kind": "classify",
    "id": "ba-cach-chen-css",
    "title": "Ba cách chèn mã CSS vào trang web",
    "emoji": "🎨",
    "instructions": "Phân loại các trường hợp vào đúng cách viết CSS: Nội tuyến (Inline), Nội bộ (Internal) hay Tệp riêng ngoài (External)!",
    "categories": [
      {
        "id": "inline",
        "emoji": "🏷️",
        "name": "CSS Nội tuyến (Inline)",
        "subtitle": "Viết trong thuộc tính style của thẻ"
      },
      {
        "id": "internal",
        "emoji": "📄",
        "name": "CSS Nội bộ (Internal)",
        "subtitle": "Viết trong cặp thẻ <style> ở <head>"
      },
      {
        "id": "external",
        "emoji": "📁",
        "name": "CSS Tệp ngoài (External)",
        "subtitle": "Lưu tệp .css riêng và dùng <link>"
      }
    ],
    "items": [
      {
        "id": "cc-inline1",
        "label": "<p style=\"color: red;\">Đoạn văn này màu đỏ</p>",
        "categoryId": "inline",
        "explain": "Dùng trực tiếp thuộc tính style ngay trên thẻ."
      },
      {
        "id": "cc-inter1",
        "label": "<style> h1 { font-size: 24px; } </style> đặt trong phần <head>",
        "categoryId": "internal",
        "explain": "CSS nội bộ viết trong thẻ <style> của trang HTML."
      },
      {
        "id": "cc-exter1",
        "label": "<link rel=\"stylesheet\" href=\"style.css\">",
        "categoryId": "external",
        "explain": "Liên kết với tệp kiểu dáng bên ngoài."
      },
      {
        "id": "cc-inline2",
        "label": "Chỉ định dạng riêng cho duy nhất một thẻ cụ thể tức thời",
        "categoryId": "inline",
        "explain": "CSS nội tuyến có độ ưu tiên cao nhưng chỉ tác dụng 1 thẻ."
      },
      {
        "id": "cc-exter2",
        "label": "Áp dụng một bộ giao diện đồng bộ cho hàng trăm trang web của trường",
        "categoryId": "external",
        "explain": "Dùng tệp CSS ngoài giúp tái sử dụng và quản lý dễ nhất."
      }
    ]
  },
  {
    "kind": "sort",
    "id": "bo-chon-class-hay-id",
    "title": "Bộ chọn Lớp (.class) hay Bộ chọn Định danh (#id)?",
    "emoji": "🎯",
    "instructions": "Phân biệt Bộ chọn theo Lớp (.class - dùng cho nhiều phần tử) và Bộ chọn theo ID (#id - duy nhất một phần tử)!",
    "matchLabel": "Bộ chọn Định danh (#id)",
    "matchEmoji": "🆔",
    "noMatchLabel": "Bộ chọn Lớp (.class)",
    "noMatchEmoji": "👥",
    "items": [
      {
        "id": "ci-multi",
        "emoji": "👥",
        "label": "Có thể đặt cùng một tên cho NHIỀU phần tử khác nhau trên trang",
        "isMatch": false,
        "explain": "Class dùng để gom nhóm nhiều phần tử chung kiểu."
      },
      {
        "id": "ci-single",
        "emoji": "🆔",
        "label": "Chỉ được phép xuất hiện DUY NHẤT một lần trên toàn bộ trang web",
        "isMatch": true,
        "explain": "Id là mã định danh duy nhất của phần tử."
      },
      {
        "id": "ci-dot",
        "emoji": "🔘",
        "label": "Khai báo trong CSS bắt đầu bằng dấu chấm: .hop-tin",
        "isMatch": false,
        "explain": "Dấu chấm (.) là ký hiệu của Class trong CSS."
      },
      {
        "id": "ci-hash",
        "emoji": "#️⃣",
        "label": "Khai báo trong CSS bắt đầu bằng dấu thăng: #banner-chinh",
        "isMatch": true,
        "explain": "Dấu thăng (#) là ký hiệu của ID trong CSS."
      },
      {
        "id": "ci-nut",
        "emoji": "🔘",
        "label": "Định dạng cho 5 nút bấm cùng có màu xanh lá cây trên trang",
        "isMatch": false,
        "explain": "Nhiều nút bấm cùng màu nên dùng .btn (Class)."
      }
    ]
  },
  {
    "kind": "sort",
    "id": "thuoc-tinh-hay-gia-tri-css",
    "title": "Thuộc tính CSS hay Giá trị CSS?",
    "emoji": "⚙️",
    "instructions": "Phân biệt giữa Thuộc tính CSS (Property) và Giá trị tương ứng (Value)?",
    "matchLabel": "Giá trị CSS (Value)",
    "matchEmoji": "💎",
    "noMatchLabel": "Thuộc tính CSS (Property)",
    "noMatchEmoji": "🔧",
    "items": [
      {
        "id": "pv-color",
        "emoji": "🎨",
        "label": "color: Tên thuộc tính đổi màu chữ",
        "isMatch": false,
        "explain": "color là thuộc tính CSS."
      },
      {
        "id": "pv-red",
        "emoji": "🔴",
        "label": "red, #FF0000, rgb(255,0,0): Giá trị màu",
        "isMatch": true,
        "explain": "Đây là giá trị gán cho thuộc tính màu."
      },
      {
        "id": "pv-size",
        "emoji": "📏",
        "label": "font-size: Tên thuộc tính chỉnh cỡ chữ",
        "isMatch": false,
        "explain": "font-size là thuộc tính CSS."
      },
      {
        "id": "pv-20px",
        "emoji": "📐",
        "label": "20px, 1.5rem: Giá trị kích thước",
        "isMatch": true,
        "explain": "Đây là giá trị kích cỡ gán cho thuộc tính."
      }
    ]
  }
];

export default games;
