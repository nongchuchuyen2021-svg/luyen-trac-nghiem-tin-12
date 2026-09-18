// Bản đồ sách điện tử (SGK) theo từng bài — file HTML tĩnh đặt trong public/sgk/.
// Muốn thêm SGK cho bài mới: bỏ file .html vào public/sgk/ rồi đăng ký thêm dòng dưới đây.
export const SGK_EBOOK: Record<string, string> = {
  "bai-01": "/sgk/bai-01.html",
  "bai-02": "/sgk/bai-02.html",
  "bai-03": "/sgk/bai-03.html",
  "bai-04": "/sgk/bai-04.html",
  "bai-06": "/sgk/bai-06.html",
};

export function getSgkUrl(lessonId: string): string | null {
  return SGK_EBOOK[lessonId] ?? null;
}
