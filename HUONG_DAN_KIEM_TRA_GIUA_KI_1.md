# Hướng dẫn Web Kiểm tra giữa kì 1 — Tin học 12

Hệ thống kiểm tra định kì giữa học kì 1 trực tuyến dành cho học sinh lớp 12 theo **Chương trình Giáo dục phổ thông 2018**.

Đường dẫn truy cập:
- `/kiem-tra/giua-ki-1`
- Hoặc bấm vào thẻ **"⏱️ Kiểm tra giữa kì 1 — Tin học 12"** trên trang chủ.

---

## 1. Nguồn câu hỏi & Ma trận đề thi

Toàn bộ câu hỏi được trích xuất và tuyển chọn từ ngân hàng **Đề cương ôn tập bài 1–8** (`data/review-1-8.ts`):
- Tổng cộng: **21 câu hỏi**, làm trong **45 phút**.

| Phần thi | Dạng câu hỏi | Số lượng | Điểm từng câu | Tổng điểm | Nguồn đề cương |
|---|---|:---:|:---:|:---:|---|
| **Phần I** | Trắc nghiệm khách quan (TNKQ) | **16 câu** | 0,25 điểm / câu | **4,0 điểm** | Lấy từ 60 câu TNKQ (8 bài × 2 câu/bài) |
| **Phần II** | Trắc nghiệm Đúng / Sai (TNĐS) | **3 câu** | Tối đa 1,0 điểm / câu | **3,0 điểm** | Lấy từ 12 câu TNĐS (3 câu từ 3 bài khác nhau) |
| **Phần III** | Tự luận (Thực hành & Vận dụng) | **2 câu** | 1,5 điểm / câu | **3,0 điểm** | Lấy từ 8 câu tự luận (2 câu từ 2 bài khác nhau) |
| **TỔNG CỘNG** | **Đầy đủ 3 phần** | **21 câu** | | **10,0 điểm** | |

### Quy chế chấm điểm Đúng / Sai chuẩn Bộ GD&ĐT:
Mỗi câu hỏi Đúng / Sai gồm 4 mệnh đề độc lập $a, b, c, d$:
- Đúng **1 ý**: được **0,10 điểm**
- Đúng **2 ý**: được **0,25 điểm**
- Đúng **3 ý**: được **0,50 điểm**
- Đúng **4 ý**: được **1,00 điểm**

### Quy chế tự luận:
Mỗi câu tự luận có 4 tiêu chí rubric (mỗi tiêu chí tương ứng $1,5 / 4 = 0,375$ điểm). Sau khi nộp bài, học sinh tự đối chiếu với đáp án gợi ý chính thức và tích các tiêu chí đạt được; điểm số tự luận tự động cập nhật và đồng bộ lên Google Sheets.

---

## 2. Tính năng chống gian lận: Tự động đổi đề mới khi chuyển tab

- **Cơ chế**: Khi học sinh đang trong trạng thái làm bài (`dang-lam`), nếu **chuyển sang tab khác, mở ứng dụng khác hoặc thu nhỏ trình duyệt**, hệ thống (`visibilitychange`) sẽ ngay lập tức:
  1. Phát âm thanh cảnh báo vi phạm.
  2. **Hủy toàn bộ bài làm hiện tại** và xóa sạch các phương án đã chọn trước đó.
  3. **Tự động tải lại một ĐỀ THI MỚI HOÀN TOÀN** (ngẫu nhiên bốc 16 câu TNKQ mới, 3 câu TNĐS mới, 2 câu tự luận mới từ ngân hàng, tránh trùng lặp với đề cũ vừa hủy).
  4. Đưa học sinh về câu hỏi số 1.
  5. Tăng biến đếm vi phạm: `soLanDoiDe + 1`.
  6. Hiển thị hộp thoại cảnh báo vi phạm màu đỏ yêu cầu học sinh xác nhận và nghiêm túc làm bài.
  7. Số lần vi phạm chuyển tab được ghi nhận và gửi cùng kết quả bài làm lên Google Sheets để giáo viên nắm bắt.

---

## 3. Tự động lưu kết quả về Google Sheets

Khi học sinh bấm **"Nộp bài"** (hoặc khi hết 45 phút, hệ thống tự động nộp bài):
- Hệ thống gửi dữ liệu lên máy chủ `/api/kiem-tra-giua-ki-1`.
- Máy chủ thẩm định cấu trúc, tính điểm độc lập và ghi một dòng mới vào Google Sheets:
  - **Cột A (Thời gian)**: Thời gian nộp bài (`dd/MM/yyyy HH:mm:ss`)
  - **Cột B (Họ tên)**: Họ và tên học sinh
  - **Cột C (Lớp)**: Lớp của học sinh (ví dụ: `12A1`)
  - **Cột D (Mã bài)**: `kiem-tra-giua-ki-1`
  - **Cột E (Tên bài)**: `Kiểm tra giữa kì 1 — Tin học 12`
  - **Cột F (Dạng)**: `Giữa kì 1`
  - **Cột G (Điểm /10)**: Điểm tổng kết trên thang điểm 10 (ví dụ `8.75`)
  - **Cột H (Số câu đúng)**: Số câu/ý trắc nghiệm đúng
  - **Cột I (Tổng số câu)**: `21`
  - **Cột J / Ghi chú chi tiết**: Ghi nhận số lần chuyển tab, thời gian làm bài, điểm từng phần và nội dung bài làm tự luận.

---

## 4. Kiểm thử hệ thống

Chạy lệnh kiểm thử tự động:
```bash
npm run test:giua-ki-1
```
Bao gồm kiểm tra:
1. Đủ 16 TNKQ, 3 TNĐS, 2 Tự luận đúng theo ngân hàng đề cương.
2. Kiểm tra tính năng chuyển tab đổi đề mới hoàn toàn.
3. Kiểm tra công thức chấm điểm Bộ GD&ĐT cho cả 3 phần.
4. Kiểm tra API bảo mật và gửi dữ liệu về Google Sheets.
