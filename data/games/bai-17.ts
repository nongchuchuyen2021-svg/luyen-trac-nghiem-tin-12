import type { LessonGame, SortGame, TimelineGame, ClassifyGame } from "@/lib/types";

// 3 trò chơi ôn bài tương tác chuẩn SGK Tin học 12 (Kết nối tri thức)
const games: LessonGame[] = [
  {
    "kind": "classify",
    "id": "vi-tri-nghe-nghiep-phan-mem",
    "title": "Các vị trí nghề nghiệp trong Phát triển phần mềm",
    "emoji": "🧑‍💻",
    "instructions": "Xếp từng nhiệm vụ vào đúng vị trí công việc tương ứng trong công ty phần mềm!",
    "categories": [
      {
        "id": "frontend",
        "emoji": "🎨",
        "name": "Lập trình viên Giao diện (Front-end)",
        "subtitle": "HTML, CSS, JS, tương tác người dùng"
      },
      {
        "id": "backend",
        "emoji": "⚙️",
        "name": "Lập trình viên Phía sau (Back-end)",
        "subtitle": "Máy chủ, Cơ sở dữ liệu, Logic nghiệp vụ"
      },
      {
        "id": "tester",
        "emoji": "🔍",
        "name": "Kỹ sư Kiểm thử (Tester / QA)",
        "subtitle": "Tìm lỗi, đảm bảo chất lượng phần mềm"
      },
      {
        "id": "pm",
        "emoji": "📋",
        "name": "Quản trị dự án (Project Manager)",
        "subtitle": "Lên kế hoạch, điều phối tiến độ nhóm"
      }
    ],
    "items": [
      {
        "id": "vt-fe",
        "label": "Thiết kế nút bấm, hiệu ứng chuyển trang mượt mà trên trình duyệt",
        "categoryId": "frontend",
        "explain": "Lập trình viên Front-end lo phần giao diện người dùng nhìn thấy."
      },
      {
        "id": "vt-be",
        "label": "Viết mã xử lý lưu điểm thi của học sinh vào Cơ sở dữ liệu an toàn",
        "categoryId": "backend",
        "explain": "Back-end xử lý dữ liệu và logic trên máy chủ."
      },
      {
        "id": "vt-qa",
        "label": "Thử gõ sai mật khẩu 10 lần để kiểm tra hệ thống có bị treo không",
        "categoryId": "tester",
        "explain": "Tester tìm kiếm các lỗ hổng và trường hợp lỗi phần mềm."
      },
      {
        "id": "vt-pm",
        "label": "Họp phân công công việc và theo dõi tiến độ hoàn thành trước hạn chót",
        "categoryId": "pm",
        "explain": "Project Manager quản lý nhân lực và tiến độ dự án."
      }
    ]
  },
  {
    "kind": "sort",
    "id": "ky-nang-cung-hay-mem",
    "title": "Kỹ năng chuyên môn hay Kỹ năng mềm của lập trình viên?",
    "emoji": "💡",
    "instructions": "Phân loại các kỹ năng cần thiết của người làm phần mềm vào Kỹ năng chuyên môn (Hard skills) hay Kỹ năng mềm (Soft skills)?",
    "matchLabel": "Kỹ năng mềm (Soft skills)",
    "matchEmoji": "🤝",
    "noMatchLabel": "Kỹ năng chuyên môn (Hard skills)",
    "noMatchEmoji": "💻",
    "items": [
      {
        "id": "kn-code",
        "emoji": "⌨️",
        "label": "Thành thạo ngôn ngữ lập trình Python, Java, JavaScript",
        "isMatch": false,
        "explain": "Kỹ năng chuyên môn kỹ thuật."
      },
      {
        "id": "kn-team",
        "emoji": "👥",
        "label": "Làm việc nhóm và lắng nghe ý kiến đồng nghiệp",
        "isMatch": true,
        "explain": "Kỹ năng mềm giao tiếp và phối hợp."
      },
      {
        "id": "kn-db",
        "emoji": "🗄️",
        "label": "Hiểu biết cấu trúc dữ liệu và truy vấn cơ sở dữ liệu SQL",
        "isMatch": false,
        "explain": "Kỹ năng chuyên môn công nghệ thông tin."
      },
      {
        "id": "kn-time",
        "emoji": "⏰",
        "label": "Quản lý thời gian cá nhân và chịu được áp lực hạn chót",
        "isMatch": true,
        "explain": "Kỹ năng mềm kỷ luật và tổ chức công việc."
      }
    ]
  },
  {
    "kind": "timeline",
    "id": "vong-doi-phan-mem",
    "title": "Vòng đời phát triển phần mềm (SDLC)",
    "emoji": "🔄",
    "instructions": "Sắp xếp các giai đoạn phát triển phần mềm theo đúng trình tự khoa học chuẩn quốc tế!",
    "items": [
      {
        "id": "sd-1",
        "emoji": "1️⃣",
        "label": "Khảo sát và Phân tích yêu cầu khách hàng",
        "year": "Giai đoạn 1",
        "explain": "Tìm hiểu xem khách hàng muốn phần mềm làm được những gì."
      },
      {
        "id": "sd-2",
        "emoji": "2️⃣",
        "label": "Thiết kế kiến trúc hệ thống và giao diện người dùng",
        "year": "Giai đoạn 2",
        "explain": "Lên bản vẽ kiến trúc cơ sở dữ liệu và màn hình."
      },
      {
        "id": "sd-3",
        "emoji": "3️⃣",
        "label": "Lập trình và Viết mã nguồn (Coding)",
        "year": "Giai đoạn 3",
        "explain": "Hiện thực hóa thiết kế thành các dòng lệnh chạy được."
      },
      {
        "id": "sd-4",
        "emoji": "4️⃣",
        "label": "Kiểm thử tìm lỗi và nghiệm thu chất lượng (Testing)",
        "year": "Giai đoạn 4",
        "explain": "Đảm bảo phần mềm chạy ổn định không có lỗi nghiêm trọng."
      },
      {
        "id": "sd-5",
        "emoji": "5️⃣",
        "label": "Triển khai cài đặt và Bảo trì, nâng cấp định kỳ",
        "year": "Giai đoạn 5",
        "explain": "Đưa vào vận hành thực tế và hỗ trợ người dùng."
      }
    ]
  }
];

export default games;
