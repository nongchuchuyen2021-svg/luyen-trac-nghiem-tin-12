# Đề cương ôn tập Tin học 12 — bài 1–8

Đường dẫn: `/on-tap/bai-1-8`. Truy cập từ thẻ Đề cương trên trang chủ.

## Ma trận tuyển chọn

| Dạng | Nhận biết | Thông hiểu | Vận dụng | Vận dụng cao | Tổng |
|---|---:|---:|---:|---:|---:|
| TNKQ | 24 | 18 | 12 | 6 | 60 |
| Đúng–sai (4 ý/câu) | 5 | 4 | 2 | 1 | 12 |
| Tự luận | 3 | 2 | 2 | 1 | 8 |
| Tổng câu | 32 | 24 | 16 | 8 | 80 |

Tỷ lệ được tính theo 80 câu; mỗi câu đúng–sai tính một câu trong ma trận. Các mức độ do người biên soạn phân loại; một số câu được mở rộng tình huống từ câu gốc để đáp ứng mức độ cao, có ghi chú trên web. Không sửa ngân hàng gốc. `data/review-1-8.ts` lưu nguồn, mức độ và toàn bộ danh sách tuyển chọn.

## Cách sử dụng

Học sinh xác nhận họ tên/lớp trước khi làm. Có bộ lọc bài học, mức độ và dạng câu; không giới hạn thời gian. TNKQ trộn phương án bằng bộ đảo an toàn đang dùng cho TX2, giữ nguyên những phương án phụ thuộc thứ tự. Kết quả lưu chỉ số phương án gốc nên không bị sai sau khi tải lại trang.

TNKQ và đúng–sai có giải thích sau khi kiểm tra. Tự luận nhập tối đa 2000 ký tự, xem gợi ý khi có ít nhất 20 ký tự, rồi tự đối chiếu 4 tiêu chí. Đây là tự đánh giá, không chấm tự động nội dung tự luận.

Điểm khách quan = số ý đúng / 108 × 10 (60 TNKQ + 48 ý đúng–sai, mỗi đơn vị trọng số bằng nhau). Câu chưa kiểm tra tính 0. Không dùng công thức chấm bài thi tốt nghiệp cho đề cương tự luyện này. Điểm tự luận tách riêng.

Tiến độ trên trình duyệt lưu theo phiên bản đề, họ tên và lớp. Học sinh dùng chung máy cần chọn đúng tên; đây không phải hệ thống tài khoản xác thực.

## Lưu kết quả và tổng hợp Google Sheets

`POST /api/on-tap` xác thực cấu trúc câu trả lời và tính điểm trên máy chủ, dùng kết nối Apps Script Tin 12 hiện có. Không đưa khóa Google vào trình duyệt. Lưu bằng nút hoặc sau 20 giây ngừng thao tác; lỗi mạng giữ lại tiến độ trên máy và cho phép thử lại.

Bản ghi có mã bài `on-tap-1-8`. Giữ cấu trúc 9 cột A:I tương thích webhook đang dùng; cột E chứa diễn giải tiến độ và phần `CHI_TIET_JSON:` gồm câu trả lời, tự luận, rubric và điểm từng dạng. Không tạo bảng tính mới.

Trong `Trang tính1`, K:O tổng hợp họ tên/lớp, điểm khách quan tốt nhất, số ý đúng tốt nhất và số bản ghi lưu. R:V tổng hợp số học sinh, trung bình điểm tốt nhất, cao nhất và thấp nhất theo lớp. Công thức đọc cả `Trang tính1` và `TX2` để tương thích webhook cũ ghi vào trang đang hoạt động. Các lần lưu tiến độ là bản ghi, không được coi là các lần thi độc lập. Điểm tự luận tự đánh giá nằm trong chi tiết từng bản ghi.

Mã lưu giúp tránh gửi trùng khi bấm lại trong một trang; máy chủ ghi nhớ chống trùng 30 phút trong cùng tiến trình. Không bảo đảm chống trùng tuyệt đối qua việc khởi động lại hay nhiều máy chủ đồng thời.

## Kiểm tra

- `node --test scripts/review.test.cjs`: nguồn đề, ma trận, đảo phương án, chấm điểm, validation, API, gửi lại và lỗi webhook (giả lập).
- `npm run test:tx2`, `npm run test:arena`: hồi quy chức năng cũ.
- `npm run build`: kiểm tra kiểu và dựng toàn bộ website.
