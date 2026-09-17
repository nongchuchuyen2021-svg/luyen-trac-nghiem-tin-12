import type { LessonGame, SortGame } from "@/lib/types";

// Game 1: Phân loại "Lợi ích hay Nguy cơ của AI?" — Bài 2, mục 1 & mục 4.
const sortGameLoiIchNguyCo: SortGame = {
  kind: "sort",
  id: "loi-ich-hay-nguy-co",
  title: "Lợi ích hay Nguy cơ của AI?",
  emoji: "⚖️",
  instructions:
    "Kéo (hoặc bấm nút) từng thẻ sang đúng khay: đây là LỢI ÍCH mà AI mang lại, hay là NGUY CƠ/CẢNH BÁO cần lưu ý về AI?",
  matchLabel: "Nguy cơ",
  matchEmoji: "⚠️",
  noMatchLabel: "Lợi ích",
  noMatchEmoji: "✅",
  items: [
    {
      id: "y-te",
      emoji: "🏥",
      label: "Cải thiện hình ảnh y tế, hỗ trợ chẩn đoán ung thư",
      isMatch: false,
      explain: "IBM Watson for Oncology góp phần nâng cao hiệu quả điều trị ung thư — lợi ích trong y học.",
    },
    {
      id: "giao-thong",
      emoji: "🚗",
      label: "Phát triển phương tiện tự lái, quản lí giao thông thông minh",
      isMatch: false,
      explain: "Ô tô tự lái, máy bay không người lái không thể có được nếu không có AI — lợi ích trong giao thông.",
    },
    {
      id: "tai-chinh",
      emoji: "🏦",
      label: "Phát hiện và ngăn chặn gian lận tài chính",
      isMatch: false,
      explain: "AI phân tích dữ liệu hỗ trợ quyết định đầu tư, phát hiện gian lận — lợi ích trong tài chính, ngân hàng.",
    },
    {
      id: "nong-nghiep",
      emoji: "🌾",
      label: "Trang trại thông minh dự đoán thời điểm thu hoạch tối ưu",
      isMatch: false,
      explain: "Theo dõi thời tiết, đất đai, dịch bệnh, hợp lí hoá tưới tiêu — lợi ích trong sản xuất nông nghiệp.",
    },
    {
      id: "giao-duc",
      emoji: "🎓",
      label: "Cá nhân hoá học tập, phản hồi tức thì cho người học",
      isMatch: false,
      explain: "Nền tảng học tập cá nhân hoá, trợ lí học tập ảo — lợi ích trong giáo dục.",
    },
    {
      id: "he-chuyen-gia",
      emoji: "🧠",
      label: "Hệ chuyên gia tự học từ dữ liệu để hình thành tri thức",
      isMatch: false,
      explain: "Nhờ Học máy, hệ chuyên gia ngày nay tự học thay vì cần chuyên gia viết sẵn từng luật — một tiến bộ của AI.",
    },
    {
      id: "that-nghiep",
      emoji: "💼",
      label: "Tự động hoá công việc dẫn đến áp lực thất nghiệp",
      isMatch: true,
      explain: "AI tự động hoá nhiều công việc, gây nguy cơ thất nghiệp cho người lao động.",
    },
    {
      id: "rieng-tu",
      emoji: "🔒",
      label: "Thu thập lượng lớn dữ liệu cá nhân, ảnh hưởng quyền riêng tư",
      isMatch: true,
      explain: "Nhiều ứng dụng AI hoạt động dựa vào thu thập dữ liệu cá nhân, làm tăng mối lo ngại về quyền riêng tư.",
    },
    {
      id: "hop-den",
      emoji: "📦",
      label: "Hoạt động như \"hộp đen\", thiếu minh bạch",
      isMatch: true,
      explain: "Khó hiểu được AI đưa ra quyết định như thế nào, dẫn đến thiếu trách nhiệm giải trình.",
    },
    {
      id: "an-ninh",
      emoji: "🛡️",
      label: "Có thể bị tấn công, thay đổi dữ liệu dẫn tới quyết định sai",
      isMatch: true,
      explain: "Ứng dụng AI triển khai trực tuyến có thể bị xâm nhập, gây quyết định sai — rủi ro an ninh, an toàn.",
    },
    {
      id: "deepfake",
      emoji: "🎭",
      label: "Deepfake: tạo ảnh, video, giọng nói giả để lừa đảo",
      isMatch: true,
      explain: "AI tạo sinh làm được ảnh/video/giọng nói giả gần như thật, bị kẻ xấu lợi dụng để lừa đảo, bôi nhọ.",
    },
    {
      id: "ban-quyen",
      emoji: "©️",
      label: "Tranh cãi bản quyền dữ liệu huấn luyện mô hình AI",
      isMatch: true,
      explain: "Mô hình học từ sách, bài báo, tranh ảnh có sẵn mà chưa chắc tác giả được hỏi ý kiến và trả công.",
    },
  ],
};

// Game 2: Phân loại "AI tạo sinh hay AI truyền thống?" — Bài 2, mục 2.
const sortGameTaoSinh: SortGame = {
  kind: "sort",
  id: "tao-sinh-hay-truyen-thong",
  title: "AI tạo sinh hay AI truyền thống?",
  emoji: "🎨",
  instructions:
    "Kéo (hoặc bấm nút) từng thẻ sang đúng khay: AI đó TẠO RA nội dung hoàn toàn mới, hay chỉ PHÂN LOẠI/DỰ ĐOÁN trong các lựa chọn có sẵn?",
  matchLabel: "AI tạo sinh",
  matchEmoji: "🎨",
  noMatchLabel: "AI truyền thống",
  noMatchEmoji: "🔍",
  items: [
    {
      id: "ve-tranh",
      emoji: "🖼️",
      label: "Vẽ một bức tranh minh hoạ theo mô tả văn bản",
      isMatch: true,
      explain: "Tạo ra hình ảnh hoàn toàn mới chưa từng tồn tại — đúng bản chất AI tạo sinh.",
    },
    {
      id: "viet-tho",
      emoji: "✍️",
      label: "Viết một bài thơ theo chủ đề yêu cầu",
      isMatch: true,
      explain: "Tạo ra văn bản mới — một trong ba loại nội dung AI tạo sinh có thể làm ra (hình ảnh, âm thanh, văn bản).",
    },
    {
      id: "sang-tac-nhac",
      emoji: "🎵",
      label: "Sáng tác một đoạn nhạc mới",
      isMatch: true,
      explain: "Tạo ra âm thanh hoàn toàn mới — đúng bản chất AI tạo sinh.",
    },
    {
      id: "chatgpt-tro-chuyen",
      emoji: "💬",
      label: "ChatGPT trả lời và trò chuyện với người dùng",
      isMatch: true,
      explain: "ChatGPT là ví dụ điển hình của AI tạo sinh — tạo văn bản trả lời mới theo từng ngữ cảnh cụ thể.",
    },
    {
      id: "viet-code",
      emoji: "💻",
      label: "Tự viết một đoạn mã chương trình theo yêu cầu",
      isMatch: true,
      explain: "Tạo ra mã nguồn mới chưa từng có sẵn — thuộc về AI tạo sinh.",
    },
    {
      id: "giong-noi-moi",
      emoji: "🗣️",
      label: "Tạo giọng nói tổng hợp đọc một đoạn văn bản mới",
      isMatch: true,
      explain: "Tạo ra âm thanh (giọng nói) mới từ văn bản — thuộc về AI tạo sinh.",
    },
    {
      id: "loc-spam",
      emoji: "📧",
      label: "Lọc email spam vào đúng thư mục rác",
      isMatch: false,
      explain: "Chỉ phân loại email vào 1 trong 2 nhóm có sẵn (spam / không spam) — AI truyền thống, không tạo nội dung mới.",
    },
    {
      id: "nhan-dien-mat",
      emoji: "📷",
      label: "Nhận diện khuôn mặt để mở khoá điện thoại",
      isMatch: false,
      explain: "Chỉ so khớp và phân loại (đúng người / không đúng người) — không tạo ra nội dung mới.",
    },
    {
      id: "du-bao-thoi-tiet",
      emoji: "🌦️",
      label: "Dự báo thời tiết ngày mai dựa trên dữ liệu quá khứ",
      isMatch: false,
      explain: "Đây là bài toán dự đoán số liệu, không phải tạo ra nội dung hoàn toàn mới.",
    },
    {
      id: "goi-y-phim",
      emoji: "🎬",
      label: "Gợi ý phim tiếp theo dựa trên lịch sử xem",
      isMatch: false,
      explain: "Chỉ chọn ra phim có sẵn phù hợp nhất trong kho dữ liệu — không tạo ra phim mới.",
    },
    {
      id: "cham-tin-dung",
      emoji: "💳",
      label: "Chấm điểm tín dụng để quyết định duyệt vay",
      isMatch: false,
      explain: "Bài toán phân loại/dự đoán rủi ro dựa trên dữ liệu có sẵn — không tạo nội dung mới.",
    },
    {
      id: "den-giao-thong",
      emoji: "🚦",
      label: "Đèn giao thông tự động điều chỉnh theo mật độ xe",
      isMatch: false,
      explain: "Điều khiển theo quy tắc/dự đoán mật độ giao thông — không tạo ra nội dung mới.",
    },
  ],
};

const games: LessonGame[] = [sortGameLoiIchNguyCo, sortGameTaoSinh];

export default games;
