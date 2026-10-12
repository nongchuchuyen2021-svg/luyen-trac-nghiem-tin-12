// Quản lý đường dẫn slide bài giảng điện tử tương tác cho các bài học

const SLIDE_MAP: Record<string, string> = {
  "bai-05": "/bai-05-trinh-chieu.html",
  "bai-06": "/bai-06-trinh-chieu.html",
  "bai-07": "/bai-07-trinh-chieu.html",
};

export function getSlideUrl(lessonId: string): string | null {
  return SLIDE_MAP[lessonId] ?? null;
}
