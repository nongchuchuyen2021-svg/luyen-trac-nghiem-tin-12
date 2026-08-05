export type Question = {
  id: string;
  q: string;
  // Đoạn code minh hoạ (hiển thị khối chữ mono riêng dưới câu hỏi), nếu có
  code?: string;
  options: [string, string, string, string];
  // Chỉ số đáp án đúng trong mảng options (0-3). Khi luyện, thứ tự phương án
  // được trộn ngẫu nhiên — xem QuizClient.
  answer: 0 | 1 | 2 | 3;
  explain: string;
};

// Câu trắc nghiệm đúng/sai 4 mệnh đề (dạng D2 đề thi tốt nghiệp THPT từ 2025):
// một lời dẫn tình huống + 4 ý a/b/c/d, đánh giá đúng/sai từng ý độc lập.
export type TFStatement = {
  text: string;
  answer: boolean; // true = Đúng, false = Sai
  explain: string;
};

export type TFQuestion = {
  id: string;
  context: string; // lời dẫn tình huống (3 dòng trở lên, có ngữ cảnh sinh động)
  code?: string;
  statements: TFStatement[]; // luôn 4 ý
};

// Câu tự luận: đề bài + gợi ý trả lời để học sinh tự đối chiếu
export type EssayQuestion = {
  id: string;
  q: string;
  code?: string;
  answer: string; // gợi ý đáp án, xuống dòng bằng \n
};

// Bộ câu hỏi bổ sung của một bài (ngoài trắc nghiệm 4 phương án)
export type LessonExtra = {
  tf: TFQuestion[];
  essay: EssayQuestion[];
};

export type Lesson = {
  id: string; // slug dùng trong URL, vd "bai-01"
  title: string; // vd "Bài 1. Thông tin và xử lí thông tin"
  available: boolean; // false = chưa có câu hỏi, hiện mờ trên trang chủ
};

export type Topic = {
  id: string;
  name: string;
  emoji: string;
  lessons: Lesson[];
};

export type LessonProgress = {
  best: number; // điểm cao nhất, phần trăm 0-100
  attempts: number;
  lastAt: string; // ISO date
};

export type ProgressMap = Record<string, LessonProgress>;
