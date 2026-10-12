import type { LessonGame, SortGame, TimelineGame, ClassifyGame } from "@/lib/types";

// 3 trò chơi ôn bài tương tác chuẩn SGK Tin học 12 (Kết nối tri thức)
const games: LessonGame[] = [
  {
    "kind": "sort",
    "id": "forms-hay-sheets",
    "title": "Google Forms (Biểu mẫu) hay Google Sheets (Bảng tính)?",
    "emoji": "📊",
    "instructions": "Phân biệt nhiệm vụ: Thu thập ý kiến của người xem (Forms) hay Lưu trữ và thống kê kết quả (Sheets)?",
    "matchLabel": "Google Sheets (Bảng tính lưu trữ)",
    "matchEmoji": "📈",
    "noMatchLabel": "Google Forms (Biểu mẫu thu thập)",
    "noMatchEmoji": "📝",
    "items": [
      {
        "id": "fs-input",
        "emoji": "✍️",
        "label": "Giao diện các câu hỏi để học sinh điền họ tên và tích chọn ý kiến",
        "isMatch": false,
        "explain": "Forms là giao diện thu thập dữ liệu người dùng."
      },
      {
        "id": "fs-grid",
        "emoji": "📊",
        "label": "Bảng dữ liệu hàng cột tự động ghi lại câu trả lời theo thời gian thực",
        "isMatch": true,
        "explain": "Sheets lưu trữ kết quả gửi về từ biểu mẫu."
      },
      {
        "id": "fs-chart",
        "emoji": "🥧",
        "label": "Vẽ biểu đồ tròn phân tích tỷ lệ phần trăm các ý kiến đóng góp",
        "isMatch": true,
        "explain": "Tính năng phân tích thống kê của Sheets."
      },
      {
        "id": "fs-embed",
        "emoji": "📥",
        "label": "Nhúng trực tiếp vào website để người xem bấm 'Gửi' (Submit)",
        "isMatch": false,
        "explain": "Biểu mẫu Forms nhúng vào web để tương tác."
      }
    ]
  },
  {
    "kind": "sort",
    "id": "cau-hoi-mot-hay-nhieu-lua-chon",
    "title": "Trắc nghiệm 1 đáp án (Radio) hay Hộp kiểm nhiều đáp án (Checkbox)?",
    "emoji": "🔘",
    "instructions": "Khi thiết kế câu hỏi khảo sát trong Google Forms: Chọn loại Trắc nghiệm một lựa chọn hay Hộp kiểm nhiều lựa chọn?",
    "matchLabel": "Hộp kiểm nhiều đáp án (Checkboxes)",
    "matchEmoji": "☑️",
    "noMatchLabel": "Trắc nghiệm 1 đáp án (Multiple choice)",
    "noMatchEmoji": "🔘",
    "items": [
      {
        "id": "mc-class",
        "emoji": "🏫",
        "label": "Em đang học khối lớp nào: Khối 10, Khối 11 hay Khối 12?",
        "isMatch": false,
        "explain": "Mỗi học sinh chỉ thuộc 1 khối lớp duy nhất."
      },
      {
        "id": "mc-interest",
        "emoji": "🎨",
        "label": "Những chủ đề em quan tâm: Thể thao, Âm nhạc, Tin học, Đọc sách",
        "isMatch": true,
        "explain": "Có thể chọn nhiều sở thích cùng lúc."
      },
      {
        "id": "mc-rate",
        "emoji": "⭐",
        "label": "Mức độ hài lòng của em về website: Rất hài lòng, Hài lòng, Chưa hài lòng",
        "isMatch": false,
        "explain": "Đánh giá mức độ chọn duy nhất 1 mức."
      },
      {
        "id": "mc-skills",
        "emoji": "💡",
        "label": "Các kỹ năng em muốn phát triển thêm: Lập trình, Thuyết trình, Tiếng Anh",
        "isMatch": true,
        "explain": "Được chọn nhiều kỹ năng muốn rèn luyện."
      }
    ]
  },
  {
    "kind": "sort",
    "id": "nhung-form-hay-gui-link",
    "title": "Nhúng Form trực tiếp vào web hay Gửi link Form ngoài?",
    "emoji": "📥",
    "instructions": "Đánh giá trải nghiệm người dùng: Nhúng form vào trang web hay gửi đường link riêng?",
    "matchLabel": "Nhúng Form trực tiếp trong trang web",
    "matchEmoji": "🌟",
    "noMatchLabel": "Mở đường link rời ở tab khác",
    "noMatchEmoji": "↗️",
    "items": [
      {
        "id": "nf-stay",
        "emoji": "🏠",
        "label": "Người xem điền phản hồi ngay tại chỗ mà không bị rời khỏi website trường",
        "isMatch": true,
        "explain": "Trải nghiệm liền mạch và giữ chân người truy cập."
      },
      {
        "id": "nf-leave",
        "emoji": "🚪",
        "label": "Người dùng phải bấm mở tab mới, dễ bị xao nhãng và quên quay lại",
        "isMatch": false,
        "explain": "Bất tiện khi gửi link rời."
      },
      {
        "id": "nf-auto",
        "emoji": "📱",
        "label": "Biểu mẫu tự động co giãn vừa vặn với kích thước màn hình đang xem",
        "isMatch": true,
        "explain": "Google Forms nhúng tương thích giao diện web rất tốt."
      },
      {
        "id": "nf-copy",
        "emoji": "📋",
        "label": "Phải sao chép đường dẫn dài dằng dặc gửi cho từng người",
        "isMatch": false,
        "explain": "Bất tiện trong việc chia sẻ."
      }
    ]
  }
];

export default games;
