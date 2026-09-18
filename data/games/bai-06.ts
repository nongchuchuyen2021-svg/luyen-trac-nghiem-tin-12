import type { LessonGame, SortGame, ClassifyGame } from "@/lib/types";

// Game 1: Phân loại "Nhân văn hay Thiếu nhân văn?" — lấy đúng các tình huống
// đã có trong SGK (Hoạt động 2, hai câu hỏi trang 38, phần "Ứng xử nhân văn
// trong một số tình huống cụ thể") để học sinh luyện phán đoán đúng trục nội
// dung chính của cả bài: đâu là ứng xử nhân văn, đâu là hành vi cần tránh.
const sortGameNhanVan: SortGame = {
  kind: "sort",
  id: "nhan-van-hay-thieu-nhan-van",
  title: "Nhân văn hay Thiếu nhân văn?",
  emoji: "💗",
  instructions:
    "Kéo (hoặc bấm nút) từng tình huống sang đúng khay: đây là cách ứng xử NHÂN VĂN trong không gian mạng, hay là hành vi THIẾU NHÂN VĂN cần tránh?",
  matchLabel: "Thiếu nhân văn",
  matchEmoji: "🚫",
  noMatchLabel: "Nhân văn",
  noMatchEmoji: "💗",
  items: [
    {
      id: "nv-anh-xau",
      emoji: "🚫",
      label: "Đưa lên mạng ảnh chụp bạn trong một tư thế không đẹp",
      isMatch: true,
      explain: "Thiếu nhân văn — đây là xâm phạm quyền riêng tư và làm bạn bị tổn thương, không có sự cho phép của người trong ảnh.",
    },
    {
      id: "nv-ngan-video",
      emoji: "💗",
      label: "Ngăn không cho bạn gửi lên mạng video quay cảnh hai bạn trong lớp đánh nhau",
      isMatch: false,
      explain: "Nhân văn — hành động này giúp ngăn một nội dung có hại lan truyền, bảo vệ những người xuất hiện trong video.",
    },
    {
      id: "nv-khiem-nha",
      emoji: "🚫",
      label: "Dùng ngôn từ khiếm nhã để phê phán bạn trên mạng xã hội",
      isMatch: true,
      explain: "Thiếu nhân văn — phê phán là có thể, nhưng phải lịch sự; ngôn từ khiếm nhã vi phạm nguyên tắc lịch sự khi ứng xử.",
    },
    {
      id: "nv-nhat-ki",
      emoji: "🚫",
      label: "Chụp đoạn nhật kí riêng tư của bạn rồi gửi cho các bạn khác xem",
      isMatch: true,
      explain: "Thiếu nhân văn — đây là xâm phạm nghiêm trọng quyền riêng tư, phát tán thông tin cá nhân mà không được phép.",
    },
    {
      id: "nv-tin-rac",
      emoji: "🚫",
      label: "Liên tục gửi các tin nhắn vô thưởng vô phạt, làm phiền người khác",
      isMatch: true,
      explain: "Thiếu nhân văn — đây chính là kiểu thư rác/tin nhắn không liên quan mà SGK khuyên nên tránh.",
    },
    {
      id: "nv-guong-tot",
      emoji: "💗",
      label: "Chia sẻ thông tin về thành công của bạn bè, những tấm gương sống đẹp",
      isMatch: false,
      explain: "Nhân văn — đây là chia sẻ thông tin tích cực, đáng tin cậy, không gây hại cho ai.",
    },
    {
      id: "nv-chia-se-tt-ca-nhan",
      emoji: "🚫",
      label: "Chia sẻ thông tin cá nhân của người khác mà không được phép",
      isMatch: true,
      explain: "Thiếu nhân văn — vi phạm trực tiếp nguyên tắc tôn trọng quyền riêng tư của người khác.",
    },
    {
      id: "nv-de-doa",
      emoji: "🚫",
      label: "Nói xấu hoặc đe doạ người khác trên mạng xã hội",
      isMatch: true,
      explain: "Thiếu nhân văn — đây là hành vi gây tổn thương trực tiếp, hoàn toàn trái với tinh thần tôn trọng và lịch sự.",
    },
    {
      id: "nv-ton-trong-y-kien",
      emoji: "💗",
      label: "Tôn trọng ý kiến và quan điểm của người khác dù không đồng ý",
      isMatch: false,
      explain: "Nhân văn — không đồng ý vẫn có thể tôn trọng, chỉ cần đưa lí do và phản bác một cách lịch sự.",
    },
    {
      id: "nv-tho-tuc",
      emoji: "🚫",
      label: "Dùng từ ngữ thô tục, xúc phạm để thể hiện sự bất bình",
      isMatch: true,
      explain: "Thiếu nhân văn — thể hiện sự bất bình là bình thường, nhưng cách thể hiện bằng từ ngữ thô tục thì không.",
    },
    {
      id: "nv-tim-hieu-truoc",
      emoji: "💗",
      label: "Đọc kĩ bài viết của người khác trước khi đưa ra ý kiến của mình",
      isMatch: false,
      explain: "Nhân văn — đây là biểu hiện của sự thấu hiểu, tránh phán xét vội vàng khi thảo luận trên mạng xã hội.",
    },
    {
      id: "nv-che-bai",
      emoji: "🚫",
      label: "Chê bai việc làm của người khác mà không góp ý xây dựng",
      isMatch: true,
      explain: "Thiếu nhân văn — chê bai đơn thuần không giúp ích gì, trái với tinh thần tôn trọng và hỗ trợ lẫn nhau.",
    },
    {
      id: "nv-quyen-rieng-tu-tin-nhan",
      emoji: "💗",
      label: "Không chia sẻ nội dung tin nhắn riêng với bên thứ ba khi chưa được phép",
      isMatch: false,
      explain: "Nhân văn — tôn trọng quyền riêng tư của người nhắn tin với mình, đúng nguyên tắc SGK nêu khi viết thư/tin nhắn.",
    },
    {
      id: "nv-kiem-tra-truoc-khi-dang",
      emoji: "💗",
      label: "Kiểm tra tính chính xác của thông tin trước khi đăng lên mạng xã hội",
      isMatch: false,
      explain: "Nhân văn — tránh làm tổn hại danh tiếng hoặc quyền riêng tư của người khác vì tin sai lệch.",
    },
  ],
};

// Game 2: Khía Cạnh Nào Của Ứng Xử Nhân Văn? — 4 yếu tố (Tôn trọng, Lịch sự,
// Thấu hiểu, Hỗ trợ) rất dễ nhầm lẫn vì đều "nghe có vẻ tích cực giống nhau".
// Game này buộc học sinh phân biệt RÕ RÀNG hành vi cụ thể thuộc khía cạnh nào,
// thay vì chỉ nhớ chung chung 4 từ khoá.
const classifyGameKhiaCanh: ClassifyGame = {
  kind: "classify",
  id: "khia-canh-nhan-van",
  title: "Khía Cạnh Nào Của Ứng Xử Nhân Văn?",
  emoji: "🧭",
  instructions:
    "Bốn khía cạnh này rất dễ nhầm vì đều \"nghe tích cực\" như nhau. Chạm chọn 1 hành vi rồi chạm vào đúng khía cạnh nó thể hiện rõ nhất.",
  categories: [
    { id: "ton-trong", emoji: "🤝", name: "Tôn trọng", subtitle: "Quyền riêng tư và quan điểm của người khác" },
    { id: "lich-su", emoji: "💬", name: "Lịch sự", subtitle: "Ngôn từ đúng mực, thông tin đáng tin cậy" },
    { id: "thau-hieu", emoji: "💗", name: "Thấu hiểu", subtitle: "Đặt mình vào hoàn cảnh của người khác" },
    { id: "ho-tro", emoji: "🫶", name: "Hỗ trợ", subtitle: "Sẵn lòng giúp đỡ khi người khác gặp khó khăn" },
  ],
  items: [
    {
      id: "kc-khong-phat-tan",
      label: "Không phát tán thông tin riêng tư của người khác khi chưa được phép",
      categoryId: "ton-trong",
      explain: "Đây chính là tôn trọng quyền riêng tư — một trong hai nội dung chính của khía cạnh Tôn trọng.",
    },
    {
      id: "kc-khong-ep-quan-diem",
      label: "Không bắt buộc bạn phải chấp nhận hoặc chia sẻ quan điểm của mình",
      categoryId: "ton-trong",
      explain: "Tôn trọng còn bao gồm tôn trọng quan điểm và suy nghĩ của mỗi người, không ép buộc ai phải đồng ý.",
    },
    {
      id: "kc-ngon-tu-dung-muc",
      label: "Dùng ngôn từ đúng mực khi tranh luận trên diễn đàn, không lăng mạ hay phân biệt đối xử",
      categoryId: "lich-su",
      explain: "Đây là biểu hiện rõ nhất của Lịch sự — sử dụng ngôn từ đúng mực, không nhạy cảm hay phân biệt.",
    },
    {
      id: "kc-tranh-thu-rac",
      label: "Tránh gửi thư rác hoặc quảng cáo không liên quan trong cuộc trò chuyện",
      categoryId: "lich-su",
      explain: "Lịch sự cũng bao gồm việc không làm phiền người khác bằng nội dung không liên quan.",
    },
    {
      id: "kc-dat-minh-vao-hoan-canh",
      label: "Đặt mình vào hoàn cảnh của bạn để hiểu vì sao bạn đang buồn",
      categoryId: "thau-hieu",
      explain: "Đây là định nghĩa cốt lõi của Thấu hiểu — cố gắng đặt mình vào hoàn cảnh người khác.",
    },
    {
      id: "kc-hieu-kho-khan-truoc-nhan-xet",
      label: "Cố gắng hiểu khó khăn của người khác trước khi đưa ra nhận xét",
      categoryId: "thau-hieu",
      explain: "Thấu hiểu nghĩa là hiểu được suy nghĩ, tình cảm, vấn đề của người khác trước khi phản ứng.",
    },
    {
      id: "kc-dong-vien",
      label: "Nhắn tin động viên khi thấy bạn đăng bài buồn trên mạng xã hội",
      categoryId: "ho-tro",
      explain: "Đây đúng là ví dụ SGK nêu cho Hỗ trợ — lời động viên chân thành, tin nhắn an ủi kịp thời.",
    },
    {
      id: "kc-giup-tim-tai-lieu",
      label: "Giúp bạn tìm tài liệu hướng dẫn khi bạn gặp một tình huống khó xử trên mạng",
      categoryId: "ho-tro",
      explain: "Sẵn lòng giúp đỡ khi người khác gặp khó khăn chính là nội dung của khía cạnh Hỗ trợ.",
    },
  ],
};

const games: LessonGame[] = [sortGameNhanVan, classifyGameKhiaCanh];

export default games;
