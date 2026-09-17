import type { LessonReview } from "@/lib/types";

const review: LessonReview = {
  summary:
    "Bài này trả lời AI đang làm thay đổi những gì — từ bệnh viện, ruộng đồng cho tới lớp học — và AI mang lại những nguy cơ nào mà cả thế giới đang phải lo giải quyết.",
  keyPoints: [
    "AI đang thay đổi mạnh mẽ nhiều lĩnh vực: hệ chuyên gia, y học, giao thông vận tải, tài chính – ngân hàng, sản xuất, giáo dục.",
    "Thành tựu AI hiện nay vẫn nằm trong phạm vi AI hẹp/yếu; AI tổng quát/mạnh vẫn là mục tiêu nghiên cứu.",
    "AI tạo sinh (Generative AI) tạo ra nội dung MỚI (hình ảnh, âm thanh, văn bản) — khác với AI truyền thống chỉ phân loại hay dự đoán.",
    "ChatGPT (OpenAI) là ví dụ điển hình AI tạo sinh, có 4 khả năng: hiểu & tạo văn bản, trả lời theo ngữ cảnh, xử lí thông tin phức tạp, thích nghi theo phản hồi.",
    "4 nguy cơ phải nhớ: áp lực thất nghiệp, ảnh hưởng quyền riêng tư, thiếu minh bạch (hộp đen), rủi ro an ninh an toàn — cùng 2 vấn đề mới nổi: deepfake và bản quyền dữ liệu huấn luyện.",
  ],
  commonMistakes: [
    {
      mistake: "Nghĩ rằng mọi ứng dụng AI đều là 'AI tạo sinh'.",
      fix: "Chỉ AI tạo ra nội dung MỚI (viết văn, vẽ tranh, sáng tác nhạc...) mới là AI tạo sinh. AI dùng để phân loại, dự đoán (lọc spam, nhận diện khuôn mặt, dự báo thời tiết) là AI truyền thống, không phải tạo sinh.",
    },
    {
      mistake: "Nhầm ChatGPT chỉ đơn giản là 'tra cứu thông tin có sẵn' giống công cụ tìm kiếm.",
      fix: "ChatGPT có khả năng suy luận và tạo văn bản MỚI theo ngữ cảnh — nó phân tích, tổng hợp và thích nghi theo phản hồi, khác hẳn việc chỉ tra cứu và liệt kê kết quả có sẵn.",
    },
    {
      mistake: "Nghĩ rằng deepfake và vấn đề bản quyền dữ liệu là 2 trong 4 cảnh báo chính thức của SGK.",
      fix: "4 cảnh báo gốc của SGK là: thất nghiệp, quyền riêng tư, thiếu minh bạch, rủi ro an ninh. Deepfake và bản quyền dữ liệu là 2 vấn đề MỚI NỔI sau này, cần biết thêm nhưng không thay thế 4 cảnh báo gốc.",
    },
  ],
  tips: [
    "Mẹo nhớ 4 khả năng ChatGPT: Hiểu & Tạo văn bản → Trả lời theo Ngữ cảnh → Xử lí thông tin Phức tạp → Thích nghi theo Phản hồi.",
    "Mẹo phân biệt AI tạo sinh: tự hỏi 'AI này có làm ra thứ hoàn toàn MỚI, chưa từng tồn tại không?' — nếu chỉ chọn/xếp loại/dự đoán trong các lựa chọn có sẵn thì không phải tạo sinh.",
  ],
  flashcards: [
    {
      front: "AI tạo sinh (Generative AI) là gì?",
      back: "Loại AI tập trung xây dựng thuật toán, mô hình có thể tự động tạo ra nội dung mới: hình ảnh, âm thanh, văn bản.",
    },
    {
      front: "ChatGPT do công ty nào phát triển?",
      back: "OpenAI.",
    },
    {
      front: "Kể 4 khả năng chính của ChatGPT?",
      back: "Hiểu & tạo văn bản, trả lời theo ngữ cảnh, xử lí thông tin phức tạp, thích nghi theo phản hồi.",
    },
    {
      front: "Kể 4 nguy cơ chính của AI theo SGK?",
      back: "Áp lực thất nghiệp, ảnh hưởng quyền riêng tư, thiếu minh bạch (hộp đen), rủi ro an ninh an toàn.",
    },
    {
      front: "Vì sao ứng dụng AI bị gọi là 'hộp đen'?",
      back: "Vì khó hiểu được AI đưa ra quyết định như thế nào, dẫn đến thiếu trách nhiệm giải trình.",
    },
    {
      front: "Deepfake là gì?",
      back: "Công nghệ AI tạo sinh làm ra ảnh, video, giọng nói giả gần như thật, có thể bị lợi dụng để lừa đảo, bôi nhọ.",
    },
    {
      front: "Ví dụ phần mềm AI hỗ trợ điều trị ung thư trong SGK?",
      back: "IBM Watson for Oncology.",
    },
    {
      front: "AIoT là gì?",
      back: "Sự kết hợp giữa AI và IoT, dùng để giám sát môi trường và biến đổi khí hậu.",
    },
  ],
  checklist: [
    "Tôi nêu được ít nhất 4 lĩnh vực mà AI đang làm thay đổi.",
    "Tôi phân biệt được AI tạo sinh với AI truyền thống (phân loại/dự đoán).",
    "Tôi nêu được 4 khả năng chính của ChatGPT.",
    "Tôi nêu được 4 nguy cơ của AI cần cảnh giác.",
  ],
  diagram: "ai-linh-vuc",
};

export default review;
