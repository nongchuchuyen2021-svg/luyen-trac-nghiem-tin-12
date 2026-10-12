import type { LessonGame, SortGame, TimelineGame, ClassifyGame } from "@/lib/types";

// 3 trò chơi ôn bài tương tác chuẩn SGK Tin học 12 (Kết nối tri thức)
const games: LessonGame[] = [
  {
    "kind": "sort",
    "id": "quan-tri-he-thong-hay-mang",
    "title": "Quản trị Hệ thống (SysAdmin) hay Quản trị Mạng (NetworkAdmin)?",
    "emoji": "🖥️",
    "instructions": "Phân loại nhiệm vụ: Công việc thiên về Quản trị máy chủ/hệ điều hành (SysAdmin) hay Thiết bị đường truyền mạng (NetworkAdmin)?",
    "matchLabel": "Quản trị Mạng (Network Admin)",
    "matchEmoji": "🌐",
    "noMatchLabel": "Quản trị Hệ thống (System Admin)",
    "noMatchEmoji": "🖥️",
    "items": [
      {
        "id": "sn-route",
        "emoji": "🧭",
        "label": "Cấu hình router, switch và định tuyến gói tin giữa các chi nhánh",
        "isMatch": true,
        "explain": "Nhiệm vụ cốt lõi của kỹ sư quản trị mạng."
      },
      {
        "id": "sn-user",
        "emoji": "👤",
        "label": "Tạo tài khoản và phân quyền thư mục cho nhân viên mới trên máy chủ",
        "isMatch": false,
        "explain": "SysAdmin quản lý người dùng và dịch vụ máy chủ."
      },
      {
        "id": "sn-wifi",
        "emoji": "📶",
        "label": "Lắp đặt điểm truy cập Wi-Fi và tối ưu sóng không dây trong tòa nhà",
        "isMatch": true,
        "explain": "Hạ tầng mạng không dây thuộc Network Admin."
      },
      {
        "id": "sn-backup",
        "emoji": "💾",
        "label": "Sao lưu (Backup) dữ liệu máy chủ hàng ngày chống mất mát",
        "isMatch": false,
        "explain": "SysAdmin chịu trách nhiệm sao lưu dữ liệu hệ thống."
      }
    ]
  },
  {
    "kind": "sort",
    "id": "nhiem-vu-an-toan-thong-tin",
    "title": "Hành động Bảo vệ An toàn hay Nguy cơ Rủi ro Bảo mật?",
    "emoji": "🛡️",
    "instructions": "Đánh giá các biện pháp quản trị mạng và hệ thống!",
    "matchLabel": "Nguy cơ Rủi ro Bảo mật",
    "matchEmoji": "⚠️",
    "noMatchLabel": "Hành động Bảo vệ An toàn",
    "noMatchEmoji": "🛡️",
    "items": [
      {
        "id": "an-firewall",
        "emoji": "🧱",
        "label": "Cài đặt tường lửa (Firewall) ngăn chặn các truy cập trái phép",
        "isMatch": false,
        "explain": "Biện pháp phòng vệ thiết yếu của người quản trị mạng."
      },
      {
        "id": "an-pass-weak",
        "emoji": "🔓",
        "label": "Dùng chung một mật khẩu '123456' cho tất cả tài khoản quản trị",
        "isMatch": true,
        "explain": "Lỗ hổng bảo mật chết người."
      },
      {
        "id": "an-patch",
        "emoji": "🔄",
        "label": "Cập nhật các bản vá lỗi bảo mật định kỳ cho hệ điều hành",
        "isMatch": false,
        "explain": "Hành động chuẩn mực bảo vệ an ninh mạng."
      },
      {
        "id": "an-share-all",
        "emoji": "📂",
        "label": "Mở chia sẻ dữ liệu Everyone toàn quyền trên mạng không có mật khẩu",
        "isMatch": true,
        "explain": "Nguy cơ lộ lọt toàn bộ bí mật nội bộ."
      }
    ]
  },
  {
    "kind": "sort",
    "id": "chung-chi-nghe-nghiep",
    "title": "Chứng chỉ Mạng quốc tế (Cisco/CCNA) hay Chứng chỉ Văn phòng (MOS)?",
    "emoji": "📜",
    "instructions": "Phân loại các chứng chỉ kỹ năng công nghệ thông tin!",
    "matchLabel": "Chứng chỉ Mạng quốc tế (CCNA, CompTIA Network+)",
    "matchEmoji": "🌐",
    "noMatchLabel": "Chứng chỉ Tin học Văn phòng (MOS, ICDL)",
    "noMatchEmoji": "📄",
    "items": [
      {
        "id": "cc-ccna",
        "emoji": "🎖️",
        "label": "Cisco Certified Network Associate (CCNA): Chuyên sâu thiết bị mạng",
        "isMatch": true,
        "explain": "Chứng chỉ mạng quốc tế uy tín hàng đầu của hãng Cisco."
      },
      {
        "id": "cc-word",
        "emoji": "📝",
        "label": "Microsoft Office Specialist (MOS Word, Excel): Soạn thảo văn bản",
        "isMatch": false,
        "explain": "Chứng chỉ tin học văn phòng đại chúng."
      },
      {
        "id": "cc-sec",
        "emoji": "🔒",
        "label": "CompTIA Security+: Kiến thức nền tảng an ninh mạng toàn cầu",
        "isMatch": true,
        "explain": "Chứng chỉ an toàn thông tin chuyên nghiệp."
      },
      {
        "id": "cc-icdl",
        "emoji": "🖥️",
        "label": "ICDL: Kỹ năng sử dụng máy tính và internet căn bản",
        "isMatch": false,
        "explain": "Chứng chỉ chuẩn kỹ năng số phổ cập."
      }
    ]
  }
];

export default games;
