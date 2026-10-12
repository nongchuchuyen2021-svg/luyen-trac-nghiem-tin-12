import type { LessonGame, SortGame, TimelineGame, ClassifyGame } from "@/lib/types";

// 3 trò chơi ôn bài tương tác chuẩn SGK Tin học 12 (Kết nối tri thức)
const games: LessonGame[] = [
  {
    "kind": "classify",
    "id": "cac-nganh-dao-tao-cntt",
    "title": "Các ngành đào tạo Đại học trong lĩnh vực CNTT",
    "emoji": "🎓",
    "instructions": "Xếp các đặc trưng đào tạo vào đúng ngành tương ứng tại các trường Đại học!",
    "categories": [
      {
        "id": "cs",
        "emoji": "🧠",
        "name": "Khoa học máy tính (Computer Science)",
        "subtitle": "Thuật toán, Trí tuệ nhân tạo, Nền tảng lý thuyết"
      },
      {
        "id": "se",
        "emoji": "💻",
        "name": "Kỹ thuật phần mềm (Software Engineering)",
        "subtitle": "Quy trình làm ứng dụng, lập trình thực chiến"
      },
      {
        "id": "is",
        "emoji": "📊",
        "name": "Hệ thống thông tin (Information Systems)",
        "subtitle": "Kết nối công nghệ với nghiệp vụ kinh doanh"
      },
      {
        "id": "isec",
        "emoji": "🔒",
        "name": "An toàn thông tin (Cyber Security)",
        "subtitle": "Phòng chống hacker, mã hóa, an ninh mạng"
      }
    ],
    "items": [
      {
        "id": "nd-ai",
        "label": "Nghiên cứu mô hình toán học và thuật toán học sâu cho Trí tuệ nhân tạo",
        "categoryId": "cs",
        "explain": "Khoa học máy tính chuyên sâu về thuật toán và AI."
      },
      {
        "id": "nd-app",
        "label": "Học cách viết ứng dụng di động Android/iOS theo chuẩn công nghiệp",
        "categoryId": "se",
        "explain": "Kỹ thuật phần mềm đào tạo kỹ sư làm app thực tế."
      },
      {
        "id": "nd-bank",
        "label": "Ứng dụng phần mềm quản lý kho và dòng tiền trong các ngân hàng",
        "categoryId": "is",
        "explain": "Hệ thống thông tin kết hợp CNTT với quản trị doanh nghiệp."
      },
      {
        "id": "nd-hack",
        "label": "Kỹ thuật phòng thủ và săn lỗ hổng bảo mật chống tội phạm mạng",
        "categoryId": "isec",
        "explain": "An toàn thông tin đào tạo chuyên gia an ninh mạng."
      }
    ]
  },
  {
    "kind": "sort",
    "id": "to-chat-nganh-cntt",
    "title": "Tố chất cần có hay Quan niệm sai lầm về nghề CNTT?",
    "emoji": "💡",
    "instructions": "Đánh giá các nhận định về việc học và làm nghề Công nghệ thông tin!",
    "matchLabel": "Quan niệm sai lầm (Cần tránh)",
    "matchEmoji": "❌",
    "noMatchLabel": "Tố chất phù hợp (Nên phát huy)",
    "noMatchEmoji": "🌟",
    "items": [
      {
        "id": "tc-logic",
        "emoji": "🧠",
        "label": "Tư duy logic tốt, thích tìm tòi giải quyết vấn đề khúc mắc",
        "isMatch": false,
        "explain": "Tố chất vàng để học lập trình và công nghệ."
      },
      {
        "id": "tc-fix",
        "emoji": "🛠️",
        "label": "Học CNTT ra trường là chỉ để đi cài win và sửa máy in dạo",
        "isMatch": true,
        "explain": "Quan niệm hạn hẹp sai lầm về ngành CNTT hiện đại."
      },
      {
        "id": "tc-learn",
        "emoji": "📖",
        "label": "Khả năng tự học bền bỉ vì công nghệ liên tục thay đổi hàng năm",
        "isMatch": false,
        "explain": "Ngành CNTT đòi hỏi tinh thần học tập suốt đời."
      },
      {
        "id": "tc-game",
        "emoji": "🎮",
        "label": "Chỉ cần thích chơi game giỏi là chắc chắn sẽ lập trình giỏi",
        "isMatch": true,
        "explain": "Chơi game và lập trình game là hai lĩnh vực hoàn toàn khác nhau."
      }
    ]
  },
  {
    "kind": "sort",
    "id": "moi-truong-lam-viec",
    "title": "Môi trường Công ty công nghệ hay Làm việc tự do (Freelance)?",
    "emoji": "🏢",
    "instructions": "Phân biệt giữa làm việc tại Công ty công nghệ tập trung và Làm việc tự do (Freelancer)?",
    "matchLabel": "Làm việc tự do (Freelancer)",
    "matchEmoji": "🏖️",
    "noMatchLabel": "Công ty công nghệ (Doanh nghiệp)",
    "noMatchEmoji": "🏢",
    "items": [
      {
        "id": "mt-corp",
        "emoji": "🏢",
        "label": "Làm việc theo giờ hành chính, có bảo hiểm xã hội và phúc lợi công ty",
        "isMatch": false,
        "explain": "Môi trường doanh nghiệp ổn định."
      },
      {
        "id": "mt-free",
        "emoji": "☕",
        "label": "Tự nhận dự án từ khách hàng nước ngoài, làm việc tại quán cà phê",
        "isMatch": true,
        "explain": "Đặc trưng linh hoạt của Freelancer."
      },
      {
        "id": "mt-team",
        "emoji": "👥",
        "label": "Quy trình dự án lớn hàng trăm người cùng phối hợp bài bản",
        "isMatch": false,
        "explain": "Môi trường công ty phần mềm lớn."
      },
      {
        "id": "mt-own",
        "emoji": "🌍",
        "label": "Tự quản lý thời gian và tự chịu trách nhiệm tìm kiếm dự án",
        "isMatch": true,
        "explain": "Freelancer tự chủ toàn bộ thu nhập và công việc."
      }
    ]
  }
];

export default games;
