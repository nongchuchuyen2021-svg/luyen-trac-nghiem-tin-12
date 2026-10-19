# Sửa cột Tên bài và lưu chi tiết ôn tập

Website đã tách `tenBai` (tên ngắn) khỏi `review` (câu trả lời, tiến độ và tự đánh giá).

Webhook Apps Script cũ chỉ đọc 9 trường đầu. Vì vậy bản website mới báo rõ “đã lưu điểm khách quan; chi tiết vẫn trên máy” nếu webhook chưa trả về `reviewSaved: true`. Không báo sai rằng chi tiết đã được lưu.

Để lưu cả chi tiết lên Sheets:

1. Trong bảng Tin 12, mở **Tiện ích mở rộng → Apps Script**.
2. Thay nội dung bằng toàn bộ tệp `scripts/google-apps-script.js`, rồi lưu.
3. Chọn **Triển khai → Quản lý bản triển khai → Chỉnh sửa**, chọn **Phiên bản mới**, rồi **Triển khai**. Giữ nguyên URL ứng dụng web đang dùng; không cần thay kết nối Vercel.

Bản này giữ cột A:I. Cột E luôn là “Ôn tập bài 1–8 — Tin học 12”; cột J là “Chi tiết ôn tập”, hiển thị tóm tắt ngắn và lưu toàn bộ JSON trong ghi chú ô (di chuột để xem). Cột J đã có dữ liệu khác thì webhook báo lỗi, không ghi đè. Tổng hợp K:O và R:V không đổi.

Dùng tab nhận ổn định `Trang tính1`, không phụ thuộc tab giáo viên đang xem. Các lần gửi lại cùng mã lưu, cùng học sinh và cùng nội dung được nhận diện để không thêm dòng trùng.

Không đưa khóa Google vào mã nguồn. Hiện không thể cập nhật bản Apps Script đang chạy bằng kết nối Sheets; thay tệp trong GitHub không tự cập nhật bản triển khai Apps Script.
