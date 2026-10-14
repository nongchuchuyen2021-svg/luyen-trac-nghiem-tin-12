// Quản lý đường dẫn slide bài giảng điện tử tương tác cho các bài học

const SLIDE_MAP: Record<string, string> = {
  "bai-05": "/bai-05-trinh-chieu.html",
  "bai-06": "/bai-06-trinh-chieu.html",
  "bai-07": "/bai-07-trinh-chieu.html",
  "bai-08": "/bai-08-trinh-chieu.html",
  "bai-09": "/bai-09-trinh-chieu.html",
  "bai-10": "/bai-10-trinh-chieu.html",
  "bai-11": "/bai-11-trinh-chieu.html",
  "bai-12": "/bai-12-trinh-chieu.html",
  "bai-13": "/bai-13-trinh-chieu.html",
  "bai-14": "/bai-14-trinh-chieu.html",
  "bai-15": "/bai-15-trinh-chieu.html",
  "bai-16": "/bai-16-trinh-chieu.html",
  "bai-17": "/bai-17-trinh-chieu.html",
  "bai-18": "/bai-18-trinh-chieu.html",
  "bai-19": "/bai-19-trinh-chieu.html",
  "bai-20": "/bai-20-trinh-chieu.html",
  "bai-21": "/bai-21-trinh-chieu.html",
  "bai-22": "/bai-22-trinh-chieu.html",
  "bai-23": "/bai-23-trinh-chieu.html",
  "bai-24": "/bai-24-trinh-chieu.html",
  "bai-25": "/bai-25-trinh-chieu.html",
  "bai-26": "/bai-26-trinh-chieu.html",
};

export function getSlideUrl(lessonId: string): string | null {
  return SLIDE_MAP[lessonId] ?? null;
}
