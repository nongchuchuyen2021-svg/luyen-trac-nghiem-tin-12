import type { LessonGame, SortGame, TimelineGame, ClassifyGame } from "@/lib/types";

// 3 trò chơi ôn bài tương tác chuẩn SGK Tin học 12 (Kết nối tri thức)
const games: LessonGame[] = [
  {
    "kind": "sort",
    "id": "dam-may-hay-tai-cho",
    "title": "Điện toán đám mây (Cloud) hay Hạ tầng tại chỗ (On-Premise)?",
    "emoji": "☁️",
    "instructions": "Phân loại mô hình dịch vụ CNTT: Dịch vụ đám mây thuê ngoài hay Máy chủ tự đầu tư đặt tại văn phòng?",
    "matchLabel": "Dịch vụ Đám mây (Cloud Computing)",
    "matchEmoji": "☁️",
    "noMatchLabel": "Hạ tầng tại chỗ (On-Premise)",
    "noMatchEmoji": "🏢",
    "items": [
      {
        "id": "cp-ggdrive",
        "emoji": "📁",
        "label": "Google Drive, OneDrive: Lưu trữ dữ liệu trên mạng truy cập mọi nơi",
        "isMatch": true,
        "explain": "Dịch vụ lưu trữ đám mây SaaS."
      },
      {
        "id": "cp-local",
        "emoji": "🗄️",
        "label": "Cụm máy chủ mua về đặt trong phòng máy có điều hòa riêng",
        "isMatch": false,
        "explain": "Hạ tầng tại chỗ On-premise tốn chi phí đầu tư ban đầu."
      },
      {
        "id": "cp-aws",
        "emoji": "🚀",
        "label": "Thuê máy chủ ảo Amazon AWS, Google Cloud nâng cấp cấu hình tức thì",
        "isMatch": true,
        "explain": "Điện toán đám mây co giãn dung lượng linh hoạt theo nhu cầu."
      },
      {
        "id": "cp-ups",
        "emoji": "🔋",
        "label": "Tự mua máy phát điện và bộ lưu điện UPS đề phòng mất điện văn phòng",
        "isMatch": false,
        "explain": "Đặc điểm của phòng máy chủ tại chỗ."
      }
    ]
  },
  {
    "kind": "sort",
    "id": "ho-tro-ky-thuat-helpdesk",
    "title": "Hỗ trợ Kỹ thuật (Helpdesk) hay Chuyên gia Tư vấn Giải pháp?",
    "emoji": "🎧",
    "instructions": "Phân biệt nhiệm vụ của nhân viên Hỗ trợ người dùng (Helpdesk/IT Support) và Chuyên gia giải pháp (Solution Architect)?",
    "matchLabel": "Chuyên gia Giải pháp (Consultant / Architect)",
    "matchEmoji": "👔",
    "noMatchLabel": "Hỗ trợ Kỹ thuật (IT Support / Helpdesk)",
    "noMatchEmoji": "🛠️",
    "items": [
      {
        "id": "hd-printer",
        "emoji": "🖨️",
        "label": "Hỗ trợ nhân viên văn phòng cài driver máy in và sửa lỗi kẹt giấy",
        "isMatch": false,
        "explain": "Công việc hàng ngày của IT Support."
      },
      {
        "id": "hd-erp",
        "emoji": "💼",
        "label": "Tư vấn cho ban giám đốc giải pháp chuyển đổi số toàn diện công ty",
        "isMatch": true,
        "explain": "Chuyên gia tư vấn chiến lược công nghệ."
      },
      {
        "id": "hd-win",
        "emoji": "💻",
        "label": "Cài lại hệ điều hành Windows và phần mềm diệt virus cho máy tính bàn",
        "isMatch": false,
        "explain": "Kỹ thuật viên Helpdesk hỗ trợ phần cứng/phần mềm người dùng."
      },
      {
        "id": "hd-cloud",
        "emoji": "☁️",
        "label": "Lập đề án chuyển đổi toàn bộ hệ thống sang đám mây tiết kiệm 30% chi phí",
        "isMatch": true,
        "explain": "Chuyên gia thiết kế kiến trúc giải pháp CNTT."
      }
    ]
  },
  {
    "kind": "sort",
    "id": "cac-mo-hinh-dich-vu-dam-may",
    "title": "Mô hình SaaS (Phần mềm) hay IaaS (Hạ tầng)?",
    "emoji": "🌐",
    "instructions": "Phân loại mô hình dịch vụ: Phần mềm dùng ngay qua web (SaaS) hay Thuê hạ tầng máy chủ thô (IaaS)?",
    "matchLabel": "Mô hình Hạ tầng (IaaS - Infrastructure as a Service)",
    "matchEmoji": "🖥️",
    "noMatchLabel": "Mô hình Phần mềm (SaaS - Software as a Service)",
    "noMatchEmoji": "📦",
    "items": [
      {
        "id": "si-gmail",
        "emoji": "✉️",
        "label": "Gmail, Google Docs: Vào trình duyệt là dùng ngay không cần cài đặt",
        "isMatch": false,
        "explain": "SaaS là phần mềm dịch vụ hoàn chỉnh cho người dùng cuối."
      },
      {
        "id": "si-vm",
        "emoji": "💾",
        "label": "Thuê máy chủ ảo trắng gồm CPU, RAM, ổ cứng rồi tự cài hệ điều hành",
        "isMatch": true,
        "explain": "IaaS cung cấp hạ tầng máy ảo cơ bản."
      },
      {
        "id": "si-zoom",
        "emoji": "📹",
        "label": "Zoom, Microsoft Teams họp trực tuyến trả phí hàng tháng",
        "isMatch": false,
        "explain": "SaaS ứng dụng liên lạc đám mây."
      },
      {
        "id": "si-storage",
        "emoji": "🗄️",
        "label": "Thuê 10 Terabyte dung lượng ổ cứng khối ảo trên đám mây",
        "isMatch": true,
        "explain": "IaaS hạ tầng lưu trữ."
      }
    ]
  }
];

export default games;
