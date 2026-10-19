# Lịch mở kiểm tra thường xuyên 2 — Tin 12

- Tất cả các ngày, kể cả thứ Bảy/Chủ nhật: **07:10 ≤ giờ bắt đầu < 10:30**, giờ Việt Nam (UTC+7).
- Ngoài giờ vẫn xem được thông tin bài, nhưng không bắt đầu làm được. Trạng thái tự cập nhật mỗi 15 giây.
- Mỗi bài tối đa 16 phút, chậm nhất kết thúc lúc 10:30. Ví dụ vào lúc 10:25 thì còn 5 phút.
- Máy chủ xác nhận lại giờ khi bấm bắt đầu, nên trang mở sẵn từ trước không bỏ qua lịch. Đồng hồ bài dùng thời gian đã xác nhận từ máy chủ và bộ đếm đơn điệu; đổi ngày/giờ trên máy học sinh không cộng thêm phút.
- Hết giờ tự kết thúc kể cả khi trang đang ẩn. Chuyển tab vẫn thay đề và xóa đáp án như thiết lập trước, không đặt lại đồng hồ.
- Cho phép chuyển kết quả trong 90 giây sau 10:30 để tránh từ chối lượt tự nộp do độ trễ mạng. Đây không phải thời gian được bắt đầu hay làm tiếp. Sau 10:31:30, API không nhận bài TX2 của ngày đó.
- Phần ôn tập bài 1–8 và luyện tập từng bài không bị giới hạn giờ.

Cấu hình ở `lib/tx2-schedule.ts`; API trạng thái/bắt đầu: `/api/tx2/access`; chặn nộp ngoài giờ tại `/api/nop-bai`.

Giới hạn này kiểm soát khung giờ làm/nộp qua website; không bổ sung xác thực tài khoản học sinh hay thay đổi cách chấm điểm phía trình duyệt hiện có. Nếu cần quản lý lượt thi duy nhất hoặc xác minh danh tính, cần bổ sung cơ chế riêng.

Kiểm thử: `node --test scripts/tx2-schedule.test.cjs scripts/tx2.test.cjs`. Các kiểm tra ghi Sheets dùng giả lập, không thêm bản ghi thật.
