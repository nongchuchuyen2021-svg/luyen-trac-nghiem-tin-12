import type { LessonGame, SortGame, TimelineGame } from "@/lib/types";

// Game 1: Phân loại "Ứng dụng AI hay Phần mềm truyền thống?"
const sortGameAiHayTruyenThong: SortGame = {
  kind: "sort",
  id: "ai-hay-truyen-thong",
  title: "Ứng dụng AI hay Phần mềm truyền thống?",
  emoji: "🤖",
  instructions:
    "Kéo từng ứng dụng sang đúng nhóm: đây là ứng dụng có tích hợp Trí tuệ nhân tạo (AI) có khả năng tự học/nhận dạng, hay là Phần mềm truyền thống hoạt động theo thuật toán cố định?",
  matchLabel: "Ứng dụng AI",
  matchEmoji: "🤖",
  noMatchLabel: "Phần mềm truyền thống",
  noMatchEmoji: "💻",
  items: [
    {
      id: "ai-chatgpt",
      emoji: "💬",
      label: "ChatGPT, Gemini: Tự hiểu câu hỏi tự nhiên và sinh văn bản hồi đáp mới",
      isMatch: true,
      explain: "Ứng dụng AI — sử dụng mô hình ngôn ngữ lớn (LLM) để hiểu ngữ cảnh và tạo văn bản tự nhiên.",
    },
    {
      id: "tt-calculator",
      emoji: "🔢",
      label: "Ứng dụng máy tính cầm tay (Calculator): Cộng trừ nhân chia theo công thức",
      isMatch: false,
      explain: "Phần mềm truyền thống — chỉ thực hiện phép toán theo quy tắc lập trình cứng, không có khả năng tự học.",
    },
    {
      id: "ai-faceid",
      emoji: "👁️",
      label: "FaceID: Nhận diện khuôn mặt người dùng để mở khóa điện thoại thông minh",
      isMatch: true,
      explain: "Ứng dụng AI — sử dụng thị giác máy tính và mạng nơ-ron nhận dạng đặc trưng khuôn mặt.",
    },
    {
      id: "tt-word",
      emoji: "📝",
      label: "Microsoft Word: Soạn thảo văn bản và định dạng font chữ cơ bản",
      isMatch: false,
      explain: "Phần mềm truyền thống — xử lý văn bản theo lệnh cố định của người dùng.",
    },
    {
      id: "ai-autopilot",
      emoji: "🚗",
      label: "Hệ thống tự lái xe Tesla: Tự phát hiện làn đường, chướng ngại vật và biển báo",
      isMatch: true,
      explain: "Ứng dụng AI — xe tự hành sử dụng thị giác máy tính và học máy để ra quyết định lái xe thời gian thực.",
    },
    {
      id: "tt-timer",
      emoji: "⏰",
      label: "Đồng hồ bấm giờ và báo thức đếm ngược trên điện thoại",
      isMatch: false,
      explain: "Phần mềm truyền thống — đếm nhịp xung nhịp theo hàm thời gian định sẵn.",
    },
    {
      id: "ai-watson",
      emoji: "🔬",
      label: "Hệ thống phân tích ảnh chụp X-quang, MRI để phát hiện dấu hiệu ung thư sớm",
      isMatch: true,
      explain: "Ứng dụng AI — ứng dụng học sâu trong y học phân tích hình ảnh hỗ trợ bác sĩ chẩn đoán.",
    },
    {
      id: "tt-excel-sum",
      emoji: "📊",
      label: "Hàm =SUM(A1:A10) trong Microsoft Excel tính tổng một dãy ô",
      isMatch: false,
      explain: "Phần mềm truyền thống — phép tính cộng dồn số học thuần tuý theo công thức xác định.",
    },
  ],
};

// Game 2: Phân loại "Khả năng của AI hay Giới hạn của AI?"
const sortGameKhaNangGioiHan: SortGame = {
  kind: "sort",
  id: "kha-nang-hay-gioi-han",
  title: "Khả năng hay Giới hạn của AI hiện nay?",
  emoji: "🎯",
  instructions:
    "Kéo từng đặc điểm sang đúng khay: đây là ĐIỂM MẠNH VƯỢT TRỘI của AI, hay là ĐIỀU AI CHƯA THỂ THAY THẾ con người?",
  matchLabel: "Giới hạn (Chưa làm được)",
  matchEmoji: "⛔",
  noMatchLabel: "Khả năng vượt trội",
  noMatchEmoji: "⚡",
  items: [
    {
      id: "kn-toc-do",
      emoji: "⚡",
      label: "Phân tích hàng triệu giao dịch ngân hàng mỗi giây để tìm gian lận",
      isMatch: false,
      explain: "Khả năng vượt trội — AI xử lý dữ liệu lớn (Big Data) với tốc độ và độ chính xác con người không thể so kịp.",
    },
    {
      id: "gh-cam-xuc",
      emoji: "❤️",
      label: "Cảm nhận sự đồng cảm thật sự, tình yêu thương và rung động tâm hồn",
      isMatch: true,
      explain: "Giới hạn — AI chỉ mô phỏng phản hồi từ ngữ, hoàn toàn không có cảm xúc hay tâm hồn của con người.",
    },
    {
      id: "kn-choi-co",
      emoji: "♟️",
      label: "Tính toán hàng triệu nước cờ vây, cờ vua và đánh bại đại kiện tướng thế giới",
      isMatch: false,
      explain: "Khả năng vượt trội — Deep Blue, AlphaGo đã chứng minh sức mạnh tính toán và học tăng cường của AI.",
    },
    {
      id: "gh-dao-duc",
      emoji: "⚖️",
      label: "Tự chịu trách nhiệm pháp lý và đưa ra phán quyết đạo đức lương tâm",
      isMatch: true,
      explain: "Giới hạn — AI không có tư cách pháp nhân, con người sáng tạo và vận hành AI phải chịu trách nhiệm.",
    },
    {
      id: "kn-dich-thuat",
      emoji: "🌐",
      label: "Dịch thuật tức thời giữa hơn 100 ngôn ngữ khác nhau trên thế giới",
      isMatch: false,
      explain: "Khả năng vượt trội — dịch máy thần kinh (Neural Machine Translation) hỗ trợ giao tiếp đa ngữ vượt bậc.",
    },
    {
      id: "gh-sang-tao-goc",
      emoji: "💡",
      label: "Đột phá tạo ra định luật khoa học hoàn toàn mới khi chưa có dữ liệu nạp sẵn",
      isMatch: true,
      explain: "Giới hạn — AI học dựa trên dữ liệu quá khứ, chưa thể tự tư duy triết học hay phát minh đột phá độc lập ngoài tập dữ liệu.",
    },
    {
      id: "kn-nhan-dien-giong",
      emoji: "🎙️",
      label: "Nhận dạng giọng nói tiếng Việt thành văn bản bất kể phương ngữ vùng miền",
      isMatch: false,
      explain: "Khả năng vượt trội — xử lý ngôn ngữ và âm thanh cho phép trợ lý ảo hiểu lệnh tiếng nói chính xác.",
    },
    {
      id: "gh-y-thuc",
      emoji: "🧠",
      label: "Tự nhận thức về sự tồn tại của chính mình (ý thức bản ngã)",
      isMatch: true,
      explain: "Giới hạn — AI hiện tại chỉ là AI hẹp (Narrow AI), không có ý thức hay nhận thức về bản thân.",
    },
  ],
};

// Game 3: Dòng thời gian lịch sử phát triển của AI
const timelineGameLichSuAi: TimelineGame = {
  kind: "timeline",
  id: "lich-su-phat-trien-ai",
  title: "Dòng thời gian các mốc son lịch sử AI",
  emoji: "⏳",
  instructions:
    "Sắp xếp các sự kiện lịch sử quan trọng đánh dấu bước tiến của Trí tuệ nhân tạo (AI) theo đúng thứ tự thời gian từ quá khứ đến hiện đại!",
  items: [
    {
      id: "ls-1950",
      emoji: "🧑‍⚖️",
      label: "Alan Turing đề xuất Phép thử Turing (Turing Test) để đánh giá trí tuệ máy móc",
      year: "1950",
      explain: "Năm 1950, nhà toán học Alan Turing đặt câu hỏi: 'Máy móc có thể suy nghĩ được không?' và đề xuất phép thử Turing.",
    },
    {
      id: "ls-1956",
      emoji: "🏛️",
      label: "Thuật ngữ 'Trí tuệ nhân tạo' (Artificial Intelligence) chính thức ra đời tại Hội thảo Dartmouth",
      year: "1956",
      explain: "Năm 1956, John McCarthy cùng các nhà khoa học đã khai sinh ra thuật ngữ AI tại trường Dartmouth.",
    },
    {
      id: "ls-1997",
      emoji: "♟️",
      label: "Siêu máy tính Deep Blue của IBM đánh bại nhà vô địch cờ vua thế giới Garry Kasparov",
      year: "1997",
      explain: "Năm 1997, lần đầu tiên một cỗ máy AI đánh bại đương kim vô địch cờ vua thế giới trong một trận đấu tiêu chuẩn.",
    },
    {
      id: "ls-2016",
      emoji: "⚪",
      label: "AlphaGo của DeepMind đánh bại kỳ thủ cờ vây thế giới Lee Sedol với tỉ số 4 - 1",
      year: "2016",
      explain: "Năm 2016, AlphaGo tạo địa chấn công nghệ khi chinh phục môn cờ vây — trò chơi có số lượng nước đi nhiều hơn số nguyên tử trong vũ trụ.",
    },
    {
      id: "ls-2022",
      emoji: "🚀",
      label: "ChatGPT của OpenAI ra mắt, mở màn cho làn sóng bùng nổ Trí tuệ nhân tạo tạo sinh (GenAI)",
      year: "2022",
      explain: "Cuối năm 2022, ChatGPT đưa AI tiếp cận hàng trăm triệu người dùng đại chúng chỉ sau vài tuần, mở ra kỷ nguyên AI tạo sinh.",
    },
  ],
};

const games: LessonGame[] = [sortGameAiHayTruyenThong, sortGameKhaNangGioiHan, timelineGameLichSuAi];

export default games;
