import type { ArenaGame, LessonGame, SortGame, TeamBattleGame, TimelineGame } from "@/lib/types";

// =====================================================================
// GAME 1: ĐẤU TRƯỜNG TRÍ TUỆ NHÂN TẠO (AI ARENA - THE OMEGA CHALLENGE)
// =====================================================================
const arenaGameAiSingularity: ArenaGame = {
  kind: "arena",
  id: "dau-truong-tri-tue-nhan-tao",
  title: "Đấu trường Trí tuệ Nhân tạo (AI Arena)",
  emoji: "⚔️",
  instructions:
    "Thuần hóa Siêu AI Omega trước khi nó chiếm quyền kiểm soát các phân hệ trọng yếu! Vận dụng kiến thức Bài 2 Tin 12 để giải mã thuật toán, bảo vệ độ ổn định hệ thống!",
  bossName: "A.I. OMEGA (Siêu Trí Tuệ Mất Kiểm Soát)",
  bossEmoji: "🤖",
  bossHp: 500,
  waves: [
    // ĐỢT 1: AI ĐỔI THAY CÁC NGÀNH NGHỀ
    {
      id: "wave-1",
      waveNumber: 1,
      name: "Đợt 1: AI Đổi thay Y học & Giao thông",
      subtitle: "Phân hệ kiểm soát bệnh viện và luồng xe tự hành đang bị thử thách",
      emoji: "🏥",
      threats: [
        {
          id: "threat-ai-med",
          threatType: "Healthcare",
          threatName: "Chẩn đoán y tế & Trợ lý ung thư IBM Watson",
          threatEmoji: "🔬",
          attackerTag: "Omega Healthcare Module",
          situation:
            "Hệ thống phân tích hình ảnh X-quang và MRI của bệnh viện đang gặp xung đột dữ liệu. Bác sĩ cần một phần mềm trí tuệ nhân tạo để phát hiện cấu trúc bất thường bên trong cơ thể và hỗ trợ phác đồ điều trị ung thư.",
          q: "Phần mềm AI tiêu biểu nào được nhắc đến trong SGK Tin học 12 đã góp phần nâng cao hiệu quả điều trị ung thư?",
          options: [
            "IBM Watson for Oncology",
            "AlphaGo DeepMind",
            "ChatGPT OpenAI",
            "Windows Defender Security",
          ],
          answer: 0,
          explain:
            "Theo SGK Tin học 12 (trang 9): Phần mềm IBM Watson for Oncology của IBM là ví dụ tiêu biểu cho ứng dụng AI trong y học, giúp làm nổi bật cấu trúc bất thường và hỗ trợ chẩn đoán, điều trị ung thư chính xác, kịp thời.",
          damage: 25,
          score: 150,
        },
        {
          id: "threat-ai-traffic",
          threatType: "Autonomous",
          threatName: "Mạng lưới điều phối phương tiện tự lái",
          threatEmoji: "🚗",
          attackerTag: "Omega Traffic Core",
          situation:
            "Đoàn ô tô tự lái và máy bay không người lái giao hàng (drone) trên đường phố đang cần hệ thống AI tự đưa ra quyết định chuyển hướng và tránh vật cản theo thời gian thực.",
          q: "Khẳng định nào sau đây là ĐÚNG NHẤT về vai trò của AI trong ngành giao thông vận tải?",
          options: [
            "Phương tiện tự lái và máy bay không người lái mấy năm gần đây không thể có được nếu không có AI",
            "AI chỉ làm tăng chi phí mua xe chứ không giúp ích gì cho việc tự động lái xe",
            "AI chỉ có tác dụng thay thế màu sơn xe cho đẹp hơn",
            "Xe tự lái hoạt động hoàn toàn dựa vào con người cầm lái từ xa qua sóng radio",
          ],
          answer: 0,
          explain:
            "SGK khẳng định: Ô tô tự lái, máy bay không người lái những năm gần đây không thể có được nếu không có AI, nhờ năng lực xử lý cảm biến, thị giác máy tính và định tuyến giao thông thông minh.",
          damage: 30,
          score: 160,
        },
      ],
    },

    // ĐỢT 2: CƠN SỐT AI TẠO SINH (GENERATIVE AI)
    {
      id: "wave-2",
      waveNumber: 2,
      name: "Đợt 2: Cơn sốt AI Tạo sinh (Generative AI)",
      subtitle: "Phân biệt rạch ròi giữa AI tạo sinh và AI truyền thống",
      emoji: "🎨",
      threats: [
        {
          id: "threat-ai-gen-vs-trad",
          threatType: "GenerativeAI",
          threatName: "Phân biệt bản chất AI tạo sinh vs. AI truyền thống",
          threatEmoji: "⚡",
          attackerTag: "Neural Synthesis Subsystem",
          situation:
            "Omega đang chạy hai thuật toán song song: Thuật toán 1 chuyên vẽ tranh theo mô tả văn bản; Thuật toán 2 chuyên phân loại email xem có phải thư rác (spam) hay không.",
          q: "Điểm khác biệt CỐT LÕI nhất giữa AI tạo sinh (Generative AI) và AI truyền thống là gì?",
          options: [
            "AI tạo sinh tự động tạo ra nội dung mới (hình ảnh, văn bản, âm thanh), còn AI truyền thống chỉ phân loại hoặc dự đoán trong các lựa chọn có sẵn",
            "AI tạo sinh luôn cần máy tính lớn hơn AI truyền thống gấp một nghìn lần",
            "AI tạo sinh chỉ làm việc trên điện thoại, còn AI truyền thống chỉ chạy trên máy chủ",
            "AI tạo sinh chỉ vẽ được tranh hoạt hình chứ không xử lý được chữ viết",
          ],
          answer: 0,
          explain:
            "Định nghĩa SGK Tin 12: AI tạo sinh tập trung xây dựng các mô hình có thể tự động TẠO RA NỘI DUNG HOÀN TOÀN MỚI (văn bản, hình ảnh, âm thanh, code) — thay vì chỉ phân loại hay dự đoán như AI truyền thống.",
          damage: 30,
          score: 180,
        },
        {
          id: "threat-ai-agri",
          threatType: "Autonomous",
          threatName: "Nông nghiệp thông minh & Thu hoạch tối ưu",
          threatEmoji: "🌾",
          attackerTag: "Smart Farm Grid",
          situation:
            "Một trang trại trồng thanh long công nghệ cao ứng dụng cảm biến IoT và AI để phân tích chất đất, độ ẩm và hình ảnh quả chín.",
          q: "Lợi ích nổi bật nhất của AI trong sản xuất nông nghiệp thông minh được SGK nêu ra là gì?",
          options: [
            "Theo dõi thời tiết, dịch bệnh đất đai, hợp lý hoá tưới tiêu và xác định thời điểm thu hoạch tối ưu",
            "Thay thế hoàn toàn giống cây trồng tự nhiên bằng cây nhân tạo",
            "Làm cho mặt trời luôn chiếu sáng suốt 24 giờ một ngày",
            "Tự động ép quả thanh long chín ngay lập tức trong vòng 5 phút",
          ],
          answer: 0,
          explain:
            "SGK Tin 12 (trang 10): Trong nông nghiệp, trang trại thông minh ứng dụng AI theo dõi thời tiết, đất đai, dịch bệnh, hợp lý hoá tưới tiêu, dự đoán mùa vụ và xác định thời điểm thu hoạch tối ưu.",
          damage: 25,
          score: 170,
        },
      ],
    },

    // ĐỢT 3: ĐÁNH THỨC SIÊU MÔ HÌNH CHATGPT
    {
      id: "wave-3",
      waveNumber: 3,
      name: "Đợt 3: Đánh thức Siêu mô hình Ngôn ngữ ChatGPT",
      subtitle: "Giải mã 4 năng lực cốt lõi của Large Language Model (LLM)",
      emoji: "💬",
      threats: [
        {
          id: "threat-chatgpt-cap",
          threatType: "LLM",
          threatName: "Khả năng học và suy luận của ChatGPT",
          threatEmoji: "🧠",
          attackerTag: "OpenAI GPT Core",
          situation:
            "Khi trò chuyện với người dùng, ChatGPT không chỉ trả lời câu hỏi hiện tại mà còn ghi nhớ ngữ cảnh những câu đã nói trước đó, tự điều chỉnh văn phong khi được yêu cầu: 'Hãy giải thích lại cho học sinh lớp 12 dễ hiểu'.",
          q: "Năng lực nào của ChatGPT được thể hiện qua hành vi tự điều chỉnh này?",
          options: [
            "Khả năng thích nghi theo phản hồi người dùng và trả lời linh hoạt theo ngữ cảnh",
            "Khả năng phát sóng wifi không dây xuyên tường",
            "Khả năng đọc trộm suy nghĩ của con người bằng sóng não",
            "Khả năng tự ngắt điện máy tính khi người dùng hỏi khó",
          ],
          answer: 0,
          explain:
            "SGK Tin 12 phân tích 4 năng lực của ChatGPT: (1) Hiểu và tạo văn bản, (2) Trả lời theo ngữ cảnh, (3) Xử lý thông tin phức tạp, (4) Thích nghi theo phản hồi người dùng qua tương tác nhiều lượt.",
          damage: 30,
          score: 200,
        },
        {
          id: "threat-agentic-ai",
          threatType: "LLM",
          threatName: "Bước tiến từ Trợ lý hỏi-đáp sang AI tác nhân (Agentic AI)",
          threatEmoji: "💻",
          attackerTag: "Autonomous Agent Subroutine",
          situation:
            "Thay vì chỉ ngồi trả lời từng câu hỏi gõ vào thanh chat, một hệ thống AI thế hệ mới được giao mục tiêu: 'Hãy kiểm tra toàn bộ mã nguồn website, tìm lỗi và tự chạy lệnh sửa rồi bàn giao sản phẩm'. Hệ thống tự động thực hiện chuỗi nhiều bước liên tiếp.",
          q: "Lớp ứng dụng AI tự thực hiện chuỗi nhiều bước để hoàn thành mục tiêu này gọi là gì?",
          options: [
            "AI tác nhân (Agentic AI)",
            "AI yếu không có bộ nhớ (Reactive Machine)",
            "Trình duyệt web thông thường",
            "Phần mềm giải nén file Zip",
          ],
          answer: 0,
          explain:
            "Từ năm 2025–2026, thế giới AI chứng kiến bước chuyển dịch từ hỏi-đáp sang AI tác nhân (Agentic AI) — người dùng giao một mục tiêu, AI tự lập kế hoạch chuỗi nhiều bước, dùng công cụ và trả về sản phẩm hoàn chỉnh.",
          damage: 35,
          score: 210,
        },
      ],
    },

    // ĐỢT 4: KHỦNG HOẢNG HỘP ĐEN & RỦI RO AN NINH AI
    {
      id: "wave-4",
      waveNumber: 4,
      name: "Đợt 4: Khủng hoảng Hộp đen & Rủi ro An ninh AI",
      subtitle: "Đối mặt với 4 mặt trái và nguy cơ lớn của trí tuệ nhân tạo",
      emoji: "📦",
      threats: [
        {
          id: "threat-black-box",
          threatType: "Security",
          threatName: "Vấn nạn 'Hộp đen' (Black Box) trong quyết định AI",
          threatEmoji: "🔒",
          attackerTag: "Black-Box Glitch Trigger",
          situation:
            "Một hệ thống AI ngân hàng từ chối cho một khách hàng vay vốn, nhưng khi được hỏi vì sao lại từ chối thì chính các kỹ sư lập trình cũng không thể giải thích được mô hình đã kết hợp các nơ-ron như thế nào để đưa ra kết luận đó.",
          q: "Hiện tượng thuật toán phức tạp đến mức con người không hiểu được cơ chế ra quyết định bên trong được gọi là gì?",
          options: [
            "Vấn đề 'Hộp đen' (Black box) — thiếu tính minh bạch và trách nhiệm giải trình",
            "Vấn đề hộp thư điện tử bị đầy bộ nhớ",
            "Lỗi đứt dây mạng cáp quang biển",
            "Tính năng bảo mật mã hóa đầu cuối thông thường",
          ],
          answer: 0,
          explain:
            "SGK Tin 12 mục 4: Các mô hình Học sâu hoạt động như 'hộp đen' (black box), rất khó hiểu cách thức AI đi đến kết luận, gây lo ngại sâu sắc về tính minh bạch và trách nhiệm pháp lý khi xảy ra sai sót.",
          damage: 35,
          score: 220,
        },
        {
          id: "threat-data-poison",
          threatType: "Security",
          threatName: "Nguy cơ đầu độc dữ liệu & Tấn công mô hình AI",
          threatEmoji: "☣️",
          attackerTag: "Adversarial Data Poisoner",
          situation:
            "Hacker cố tình cài cắm các dữ liệu sai lệch vào tập dữ liệu huấn luyện xe tự lái, khiến hệ thống AI nhận diện biển báo 'Dừng lại (STOP)' thành biển báo 'Tăng tốc'.",
          q: "Nguy cơ an toàn, an ninh của AI được SGK cảnh báo ở đây là gì?",
          options: [
            "Ứng dụng AI triển khai trực tuyến có thể bị tấn công, thay đổi dữ liệu huấn luyện dẫn tới quyết định sai lầm thảm khốc",
            "Màn hình ô tô sẽ bị nóng lên và tự vỡ",
            "AI sẽ lập tức biến thành robot hủy diệt bằng kim loại",
            "Xe tự lái sẽ tự động biến thành máy bay phản lực",
          ],
          answer: 0,
          explain:
            "SGK Tin 12 mục 4: Ứng dụng AI có thể bị tấn công mạng hoặc đầu độc dữ liệu huấn luyện, khiến AI đưa ra những quyết định sai lầm gây hậu quả nghiêm trọng về tính mạng và tài sản.",
          damage: 35,
          score: 230,
        },
      ],
    },

    // ĐỢT 5: TRẬN CHIẾN TỰ HÀNH OMEGA: KIỂM SOÁT SIÊU TRÍ TUỆ
    {
      id: "wave-5",
      waveNumber: 5,
      name: "Đợt 5: ĐẠI CHIẾN TỰ HÀNH: THUẦN HÓA A.I. OMEGA",
      subtitle: "Trận chiến cuối cùng: Bản chất Hệ chuyên gia và Định hướng Đạo đức AI",
      emoji: "👾",
      isBossWave: true,
      threats: [
        {
          id: "threat-expert-evolution",
          threatType: "TraditionalAI",
          threatName: "Khác biệt lịch sử của Hệ chuyên gia hiện đại",
          threatEmoji: "⚙️",
          attackerTag: "A.I. OMEGA Singularity Core",
          situation:
            "Omega tuyên bố: 'Hệ chuyên gia thời nay đã tiến hóa vượt bậc so với thời kỳ cổ điển!'. Để hóa giải lá chắn của Omega, em cần chỉ ra bước nhảy vọt quan trọng nhất của hệ chuyên gia ngày nay.",
          q: "Điểm khác biệt LỚN NHẤT của hệ chuyên gia thời nay so với hệ chuyên gia thời đầu là gì?",
          options: [
            "Nhờ Học máy (Machine Learning), hệ chuyên gia ngày nay tự học từ dữ liệu để tự hình thành luật và tri thức, không cần chuyên gia viết sẵn từng luật",
            "Hệ chuyên gia ngày nay không cần dùng điện năng để hoạt động",
            "Hệ chuyên gia ngày nay bắt buộc phải có hình dáng giống người thật",
            "Hệ chuyên gia ngày nay chỉ hoạt động được khi có 100 người điều khiển cùng lúc",
          ],
          answer: 0,
          explain:
            "SGK Tin 12 nhấn mạnh: Ban đầu hệ chuyên gia chỉ chạy theo luật do chuyên gia con người ngồi viết sẵn. Ngày nay nhờ Học máy (Machine Learning), hệ chuyên gia có thể tự học từ dữ liệu khổng lồ để tự hình thành luật và tri thức mới.",
          damage: 40,
          score: 280,
        },
        {
          id: "threat-ai-ethics-final",
          threatType: "Ethics",
          threatName: "Bộ chuẩn mực cân bằng Đạo đức & Phát triển AI",
          threatEmoji: "⚖️",
          attackerTag: "A.I. OMEGA Singularity Core",
          situation:
            "Omega chuẩn bị kích hoạt đợt tự trị toàn diện. Là Trưởng ban An toàn AI, em cần thiết lập cam kết phát triển trí tuệ nhân tạo nhân văn và bền vững.",
          q: "Thái độ và nhận thức đúng đắn của con người trước sự phát triển vượt bậc của AI là gì?",
          options: [
            "Tận dụng tối đa lợi ích to lớn của AI vào đời sống, đồng thời chủ động ban hành luật lệ kiểm soát rủi ro về việc làm, quyền riêng tư và bản quyền dữ liệu",
            "Cấm đoán hoàn toàn mọi nghiên cứu AI trên toàn thế giới",
            "Giao phó toàn bộ mọi quyết định sinh tử cho AI mà không cần con người giám sát",
            "Phớt lờ mọi cảnh báo vì AI không bao giờ có thể mắc sai lầm",
          ],
          answer: 0,
          explain:
            "Tổng kết Bài 2: AI là một phần không thể thiếu của cuộc sống hiện đại mang lại lợi ích khổng lồ. Tuy nhiên loài người cần chủ động quản lý các rủi ro (thất nghiệp, quyền riêng tư, hộp đen, an toàn và bản quyền) để AI phục vụ nhân loại an toàn.",
          damage: 45,
          score: 320,
        },
      ],
    },
  ],
};

// =====================================================================
// GAME 2: PHÂN LOẠI LỢI ÍCH HAY NGUY CƠ CỦA AI (SORTGAME)
// =====================================================================
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
      label: "Lạm dụng tạo nội dung giả mạo tinh vi để bôi nhọ, lừa gạt",
      isMatch: true,
      explain: "Công nghệ sinh nội dung nếu bị kẻ xấu lợi dụng sẽ tạo ra nguy cơ đe dọa trật tự xã hội.",
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

// =====================================================================
// GAME 3: PHÂN LOẠI AI TẠO SINH HAY AI TRUYỀN THỐNG (SORTGAME)
// =====================================================================
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

// =====================================================================
// GAME 4: DÒNG LỊCH SỬ CÁC MỐC SON TRÍ TUỆ NHÂN TẠO (TIMELINEGAME)
// =====================================================================
const timelineGameAiHistory: TimelineGame = {
  kind: "timeline",
  id: "dong-thoi-gian-ai",
  title: "Dòng lịch sử: Các mốc son Trí tuệ Nhân tạo",
  emoji: "⏱️",
  instructions:
    "Kéo hoặc chạm để sắp xếp các sự kiện lịch sử mang tính bước ngoặt của Trí tuệ Nhân tạo thế giới theo đúng trình tự THỜI GIAN!",
  items: [
    {
      id: "time-turing",
      emoji: "👨‍🔬",
      label: "Alan Turing đề xuất 'Phép thử Turing' (Turing Test) để đánh giá máy tính có trí tuệ như người",
      year: "1950",
      explain: "Phép thử kinh điển đặt câu hỏi nền tảng: 'Liệu máy móc có thể suy nghĩ như con người được không?'",
    },
    {
      id: "time-dartmouth",
      emoji: "🏛️",
      label: "Hội thảo Dartmouth — Thuật ngữ 'Trí tuệ nhân tạo' (Artificial Intelligence) chính thức ra đời",
      year: "1956",
      explain: "Được tổ chức bởi John McCarthy và các cộng sự, đánh dấu sự ra đời của ngành khoa học AI.",
    },
    {
      id: "time-deepblue",
      emoji: "♟️",
      label: "Siêu máy tính Deep Blue của IBM đánh bại Đại kiện tướng cờ vua Garry Kasparov",
      year: "1997",
      explain: "Chiến thắng lịch sử của máy tính trước nhà vô địch cờ vua thế giới của nhân loại.",
    },
    {
      id: "time-alphago",
      emoji: "⚪",
      label: "AlphaGo của DeepMind đánh bại kỳ thủ cờ vây hàng đầu thế giới Lee Sedol",
      year: "2016",
      explain: "Đánh dấu bước đột phá ngoạn mục của mạng nơ-ron Học sâu (Deep Learning) trong trò chơi có số nước đi vô tận.",
    },
    {
      id: "time-chatgpt",
      emoji: "💬",
      label: "OpenAI ra mắt ChatGPT — Bước đột phá mở màn kỷ nguyên bùng nổ AI tạo sinh toàn cầu",
      year: "2022",
      explain: "SGK Tin 12 ghi nhận ChatGPT là bước đột phá của năm 2022, thay đổi cách làm việc và học tập.",
    },
    {
      id: "time-agentic",
      emoji: "🤖",
      label: "Bước chuyển dịch lên AI tác nhân (Agentic AI) tự chủ thực hiện chuỗi mục tiêu phức tạp",
      year: "2026",
      explain: "Từ việc chỉ trả lời hỏi-đáp, AI tiến hóa thành tác nhân tự động mở file, gọi tool và tạo ra sản phẩm hoàn chỉnh.",
    },
  ],
};

// =====================================================================
// GAME 5: ĐẤU TRƯỜNG ĐẠI CHIẾN CÁC NHÓM (TEAM BATTLE ARENA)
// =====================================================================
export const teamBattleGameAiSingularity: TeamBattleGame = {
  kind: "team-battle",
  id: "dai-chien-cac-nhom-ai",
  title: "Đấu trường Đại chiến Các Nhóm: AI Showdown",
  emoji: "⚔️",
  instructions:
    "Chia lớp thành 2 - 4 nhóm thi đấu đối kháng trực tiếp trên màn hình máy chiếu! Bấm chuông nhanh giành quyền, giải mã thuật toán AI, kích hoạt khiên thuật toán và rinh Cúp Vàng!",
  questions: [
    {
      id: "tb-01",
      category: "AI trong Y học",
      q: "Phần mềm AI tiêu biểu nào được nhắc đến trong SGK Tin học 12 đã góp phần nâng cao hiệu quả chẩn đoán và điều trị ung thư?",
      options: [
        "IBM Watson for Oncology",
        "AlphaGo DeepMind",
        "ChatGPT OpenAI",
        "Windows Defender Antivirus",
      ],
      answer: 0,
      explain:
        "Theo SGK Tin học 12 (trang 9): Phần mềm IBM Watson for Oncology của IBM là ví dụ tiêu biểu cho ứng dụng AI trong y tế, giúp làm nổi bật cấu trúc bất thường và hỗ trợ bác sĩ chẩn đoán, điều trị ung thư kịp thời.",
      score: 100,
      damage: 25,
    },
    {
      id: "tb-02",
      category: "AI & Giao thông",
      q: "Thành tựu nào trong lĩnh vực giao thông vận tải những năm gần đây được SGK khẳng định là 'không thể có được nếu không có AI'?",
      options: [
        "Phương tiện tự lái (ô tô tự lái) và máy bay không người lái (drone)",
        "Đèn tín hiệu giao thông đếm lùi theo giây cố định",
        "Máy quét mã vạch trên vé xe buýt giấy",
        "Hệ thống định vị GPS chỉ hiển thị bản đồ tĩnh",
      ],
      answer: 0,
      explain:
        "SGK Tin 12 ghi nhận: Ô tô tự lái và máy bay không người lái những năm gần đây không thể có nếu không có AI, nhờ năng lực xử lý cảm biến, thị giác máy tính và thuật toán định tuyến giao thông tự hành.",
      score: 100,
      damage: 25,
    },
    {
      id: "tb-03",
      category: "Bản chất AI",
      q: "Điểm khác biệt CỐT LÕI nhất giữa AI tạo sinh (Generative AI) và AI truyền thống là gì?",
      options: [
        "AI tạo sinh tự động tạo ra nội dung hoàn toàn mới (ảnh, nhạc, văn bản, mã nguồn), còn AI truyền thống chỉ phân loại hoặc dự đoán",
        "AI tạo sinh luôn cần máy tính lớn hơn AI truyền thống gấp một triệu lần",
        "AI tạo sinh chỉ chạy được trên điện thoại thông minh, không dùng được trên máy tính",
        "AI tạo sinh chỉ làm thơ chứ không thể lập trình",
      ],
      answer: 0,
      explain:
        "Định nghĩa SGK Tin 12: AI tạo sinh tập trung xây dựng các mô hình có thể tự động TẠO RA NỘI DUNG MỚI (văn bản, hình ảnh, âm thanh, code) — thay vì chỉ phân loại hay dự đoán từ dữ liệu có sẵn như AI truyền thống.",
      score: 120,
      damage: 30,
    },
    {
      id: "tb-04",
      category: "AI Tạo Sinh",
      q: "Ứng dụng nào sau đây là đại diện tiêu biểu nhất cho công nghệ AI Tạo sinh (Generative AI)?",
      options: [
        "ChatGPT và Midjourney",
        "Bộ lọc chống thư rác của Gmail",
        "Hệ thống nhận dạng khuôn mặt mở khóa điện thoại",
        "Camera bắn tốc độ tự động trên quốc lộ",
      ],
      answer: 0,
      explain:
        "ChatGPT (tạo văn bản, thơ, code mới) và Midjourney (vẽ tranh nghệ thuật mới từ câu lệnh) là các công cụ AI tạo sinh điển hình. Các ứng dụng còn lại thuộc AI truyền thống (phân loại, nhận dạng).",
      score: 100,
      damage: 20,
    },
    {
      id: "tb-05",
      category: "Cảnh báo & Nguy cơ",
      q: "Nguy cơ nào sau đây KHÔNG PHẢI là một trong bốn nguy cơ chính của AI được cảnh báo trong SGK Tin học 12?",
      options: [
        "Làm tăng trọng lượng vật lý của máy tính và điện thoại",
        "Đe dọa việc làm của người lao động do tự động hóa",
        "Xâm phạm quyền riêng tư và an toàn dữ liệu cá nhân",
        "Thiếu tính minh bạch trong các quyết định (hộp đen AI)",
      ],
      answer: 0,
      explain:
        "SGK Tin 12 nêu rõ 4 nguy cơ trọng yếu: (1) Thất nghiệp và biến động việc làm, (2) Xâm phạm quyền riêng tư, (3) Thiếu minh bạch (hộp đen), (4) Nguy cơ an ninh, an toàn và phát tán nội dung giả mạo. Việc tăng trọng lượng vật lý là hoàn toàn sai.",
      score: 100,
      damage: 25,
    },
    {
      id: "tb-06",
      category: "Minh bạch AI",
      q: "Vấn đề 'Hộp đen' (Black-box) trong các mô hình Trí tuệ Nhân tạo phản ánh điều gì?",
      options: [
        "Con người không thể giải thích thấu đáo cách thức AI suy luận nội bộ để đưa ra kết quả cuối cùng",
        "Vỏ máy tính chứa AI phải được sơn màu đen để chống tia hồng ngoại",
        "AI luôn từ chối nhận câu lệnh của người dùng vào ban đêm",
        "Dữ liệu huấn luyện AI bị mã hóa thành màu đen không đọc được",
      ],
      answer: 0,
      explain:
        "Thuật ngữ 'Hộp đen' trong AI chỉ việc các mạng nơ-ron học sâu rất phức tạp với hàng tỷ tham số, khiến ngay cả các nhà khoa học chế tạo cũng khó giải thích chính xác chuỗi suy luận từng bước bên trong, gây khó khăn cho việc kiểm chứng và quy trách nhiệm.",
      score: 120,
      damage: 30,
    },
    {
      id: "tb-07",
      category: "An toàn & Xã hội",
      q: "Công nghệ Deepfake tạo ra nội dung giả mạo hình ảnh, video và giọng nói của người khác thuộc nguy cơ nào của AI?",
      options: [
        "Nguy cơ đe dọa trật tự an ninh, lừa đảo và bôi nhọ nhân phẩm",
        "Nguy cơ làm hỏng màn hình hiển thị của tivi",
        "Nguy cơ làm chập nguồn điện gia đình",
        "Nguy cơ làm mất tín hiệu sóng truyền hình cáp",
      ],
      answer: 0,
      explain:
        "Deepfake là nguy cơ nghiêm trọng liên quan đến an ninh và an toàn thông tin, khi kẻ xấu lợi dụng AI tạo sinh để làm giả bằng chứng, giả giọng người thân tống tiền hoặc xuyên tạc, bôi nhọ danh dự người khác.",
      score: 100,
      damage: 25,
    },
    {
      id: "tb-08",
      category: "Lịch sử AI",
      q: "Năm 1950, nhà bác học Alan Turing đã đề xuất phép thử nổi tiếng nào để đánh giá máy tính có trí tuệ như con người?",
      options: [
        "Phép thử Turing (Turing Test)",
        "Định luật Moore",
        "Kiến trúc Von Neumann",
        "Thuật toán Dijkstra",
      ],
      answer: 0,
      explain:
        "Alan Turing đề xuất 'Turing Test' vào năm 1950 với câu hỏi lịch sử: 'Liệu máy móc có thể suy nghĩ được không?'. Nếu người thẩm vấn không phân biệt được đang trò chuyện với người hay máy, cỗ máy được coi là có trí tuệ.",
      score: 120,
      damage: 30,
    },
    {
      id: "tb-09",
      category: "Lịch sử AI",
      q: "Thuật ngữ 'Trí tuệ nhân tạo' (Artificial Intelligence - AI) chính thức ra đời tại sự kiện lịch sử nào?",
      options: [
        "Hội thảo Dartmouth năm 1956",
        "Hội nghị Liên Hợp Quốc năm 1945",
        "Triển lãm Công nghệ Paris năm 1900",
        "Ngày ra mắt mạng World Wide Web năm 1991",
      ],
      answer: 0,
      explain:
        "Tại Hội thảo Dartmouth (Mỹ) năm 1956, John McCarthy và các nhà khoa học tiên phong đã chính thức đặt ra thuật ngữ 'Artificial Intelligence' (AI), đánh dấu sự khởi đầu của ngành khoa học trí tuệ nhân tạo.",
      score: 110,
      damage: 25,
    },
    {
      id: "tb-10",
      category: "Lịch sử AI",
      q: "Năm 1997, sự kiện chấn động thế giới nào đã chứng minh siêu máy tính có thể đánh bại nhà vô địch cờ vua loài người?",
      options: [
        "Siêu máy tính IBM Deep Blue đánh bại Đại kiện tướng thế giới Garry Kasparov",
        "AlphaGo đánh bại kỳ thủ cờ vây Lee Sedol",
        "Robot Asimo đi bộ lên cầu thang thành công",
        "ChatGPT đạt 100 triệu người dùng",
      ],
      answer: 0,
      explain:
        "Năm 1997, siêu máy tính Deep Blue của tập đoàn IBM đã đi vào lịch sử khi đánh bại nhà vô địch cờ vua thế giới Garry Kasparov sau trận đấu 6 ván căng thẳng.",
      score: 100,
      damage: 25,
    },
    {
      id: "tb-11",
      category: "Lịch sử AI",
      q: "Năm 2016, hệ thống AI nào của DeepMind đã đánh bại kỳ thủ cờ vây hàng đầu thế giới Lee Sedol, tạo nên bước ngoặt cho Học sâu (Deep Learning)?",
      options: [
        "AlphaGo",
        "Deep Blue",
        "Watson",
        "Siri",
      ],
      answer: 0,
      explain:
        "AlphaGo của Google DeepMind đã làm chấn động giới công nghệ năm 2016 khi đánh bại Lee Sedol với tỉ số 4-1 trong môn cờ vây — trò chơi vốn được coi là phức tạp vô tận vượt ngoài khả năng tính toán đơn thuần của máy tính.",
      score: 110,
      damage: 25,
    },
    {
      id: "tb-12",
      category: "Lịch sử AI",
      q: "Tháng 11 năm 2022, sự kiện công nghệ nào đã mở màn cho kỷ nguyên bùng nổ AI Tạo sinh trên toàn thế giới?",
      options: [
        "OpenAI chính thức phát hành ChatGPT",
        "Google ra mắt công cụ tìm kiếm Google Search",
        "Apple ra mắt chiếc iPhone thế hệ đầu tiên",
        "Wikipedia ra mắt bách khoa toàn thư mở",
      ],
      answer: 0,
      explain:
        "Tháng 11/2022, OpenAI ra mắt ChatGPT và nhanh chóng đạt 100 triệu người dùng chỉ sau 2 tháng, đưa công nghệ AI tạo sinh trở thành tâm điểm của nhân loại.",
      score: 100,
      damage: 20,
    },
    {
      id: "tb-13",
      category: "Bản quyền & Đạo đức",
      q: "Tranh cãi pháp lý và đạo đức lớn nhất hiện nay liên quan đến dữ liệu huấn luyện cho các mô hình AI tạo sinh là gì?",
      options: [
        "Sử dụng hàng triệu tác phẩm tranh ảnh, bài viết của con người mà không xin phép hoặc không trả thù lao bản quyền",
        "Các công ty AI mua quá nhiều giấy in để ghi lại văn bản",
        "AI sử dụng quá nhiều chữ cái tiếng Anh mà không dùng chữ số La Mã",
        "Dữ liệu huấn luyện AI bị lưu trên thẻ nhớ có dung lượng quá nhỏ",
      ],
      answer: 0,
      explain:
        "Nhiều họa sĩ, nhà văn, nhà báo đang khởi kiện các công ty AI vì đã thu thập hàng triệu tác phẩm có bản quyền trên Internet để 'dạy' cho mô hình AI mà không xin phép, trả thù lao hay ghi nhận công lao tác giả.",
      score: 110,
      damage: 25,
    },
    {
      id: "tb-14",
      category: "Hệ Chuyên Gia",
      q: "Hệ chuyên gia (Expert System) trong Trí tuệ nhân tạo được hiểu như thế nào?",
      options: [
        "Chương trình máy tính mô phỏng khả năng ra quyết định dựa trên tri thức và luật suy diễn của chuyên gia con người",
        "Chương trình chỉ dành cho các giáo sư tiến sĩ có bằng cấp cao sử dụng",
        "Hệ thống quản lý chấm công nhân viên tại các công ty công nghệ",
        "Trang web tìm kiếm danh sách số điện thoại của các chuyên gia",
      ],
      answer: 0,
      explain:
        "SGK Tin 12: Hệ chuyên gia (còn gọi là hệ thống dựa trên tri thức) là phần mềm mô phỏng khả năng giải quyết vấn đề và đưa ra quyết định của các chuyên gia trong một lĩnh vực hẹp cụ thể thông qua cơ sở tri thức và động cơ suy diễn.",
      score: 100,
      damage: 25,
    },
    {
      id: "tb-15",
      category: "Tài chính & Ngân hàng",
      q: "Trong lĩnh vực tài chính và ngân hàng, AI hỗ trợ nghiệp vụ nào mang lại giá trị bảo vệ an toàn cao nhất cho khách hàng?",
      options: [
        "Phát hiện và cảnh báo các giao dịch gian lận, rửa tiền bất thường theo thời gian thực",
        "In sổ tiết kiệm và in hóa đơn rút tiền tại quầy",
        "Đổi tiền lẻ cho khách hàng tới chi nhánh ngân hàng",
        "Lau dọn và bật máy lạnh trong phòng giao dịch",
      ],
      answer: 0,
      explain:
        "AI có khả năng phân tích hàng triệu giao dịch mỗi giây để phát hiện các dấu hiệu bất thường (địa điểm đăng nhập lạ, số tiền chuyển đột biến) giúp ngăn chặn tội phạm mạng và bảo vệ tài khoản khách hàng.",
      score: 100,
      damage: 20,
    },
    {
      id: "tb-16",
      category: "Nhận thức & Tương lai",
      q: "Thái độ đúng đắn và chủ động nhất của học sinh THPT trước sự phát triển bùng nổ của AI là gì?",
      options: [
        "Chủ động học hỏi, sử dụng AI như công cụ trợ thủ đắc lực, đồng thời rèn luyện tư duy phản biện và tuân thủ đạo đức, pháp luật",
        "Cấm đoán và tuyệt đối không bao giờ chạm vào bất kỳ công cụ AI nào",
        "Giao phó toàn bộ bài tập và quyết định cho AI làm hộ mà không cần suy nghĩ",
        "Phớt lờ mọi cảnh báo vì AI không bao giờ đưa ra thông tin sai lệch",
      ],
      answer: 0,
      explain:
        "Tổng kết Bài 2 Tin 12: AI là xu thế tất yếu mang lại lợi ích to lớn. Học sinh cần làm chủ công nghệ, sử dụng AI có trách nhiệm, trung thực trong học tập và luôn kiểm chứng thông tin với tư duy phản biện sắc bén.",
      score: 120,
      damage: 30,
    },
  ],
};

const games: LessonGame[] = [
  teamBattleGameAiSingularity,
  arenaGameAiSingularity,
  sortGameLoiIchNguyCo,
  sortGameTaoSinh,
  timelineGameAiHistory,
];

export default games;

