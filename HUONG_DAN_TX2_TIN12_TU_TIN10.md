# Hướng dẫn làm Kiểm tra thường xuyên 2 Tin học 12 theo phiên bản Tin học 10

Ngày lập: 19/10/2026.

Tài liệu bàn giao để triển khai TX2 trong dự án `D:\du-an\luyen-trac-nghiem-tin-12`. Phần dưới giữ lại hướng dẫn bàn giao; cập nhật triển khai trong mã nguồn được ghi ngay sau đây.

## Cập nhật TX2 Tin 12 — phạm vi đã chốt

- Nguồn câu hỏi: 97 câu của bài 1, 2, 3, 4, 5, 6; đã phân loại và chỉnh một số câu thành tình huống vận dụng.
- 15 câu / 16 phút, thang 10: 6 nhận biết + 6 thông hiểu + 3 vận dụng. Mỗi bài luôn có 1 nhận biết và 1 thông hiểu; 3 bài khác nhau được bốc thêm câu vận dụng.
- Mã bài: `kiem-tra-tx2-12`; trang: `/kiem-tra/thuong-xuyen-2`.
- Ghi vào tab `TX2` của bảng tính Tin 12 đang cấu hình bằng Service Account; cột điểm ghi rõ `Điểm /10`. Tab được tạo khi nộp thật lần đầu, không ghi đè tab có tiêu đề khác.
- Có đảo phương án an toàn, đổi đề khi chuyển tab/thu nhỏ và giữ mốc hết giờ, tự động nộp với nút thử lại khi lỗi.
- Đã đạt 8 kiểm thử TX2 (1.000 đề, 100 đề thay thế, đảo đáp án, sự kiện tab, API, Sheets giả lập) và 8 kiểm thử đấu trường cũ.
- TypeScript đạt; bản phát hành Next.js đã build thành công trên bản sao cô lập với 37 trang, có route TX2.
- Đã thử giao diện Chrome: nhập thông tin, chọn đáp án, đổi đề/xóa lựa chọn bằng sự kiện visibility giả lập trong trang thật, tự động nộp một lần. Mọi yêu cầu nộp trong kiểm thử được chặn và giả lập; chưa thử chuyển tab bằng cửa sổ trình duyệt thông thường và chưa ghi Google Sheets thật.
- Chưa đẩy GitHub/Vercel trong lượt tạo TX2 Tin 12 này.

## 1. Kết quả cần đạt

Áp dụng cách làm đã triển khai ở Tin 10:

- Trang riêng `/kiem-tra/thuong-xuyen-2`, có lối vào từ trang chủ.
- Mặc định chỉ bốc đề ngẫu nhiên; học sinh không tự chọn đề cố định.
- Mẫu cấu hình: 15 câu, 16 phút, thang điểm 10.
- Bốc theo ma trận nhận biết, thông hiểu, vận dụng; không lấy ngẫu nhiên toàn bộ ngân hàng rồi mặc nhiên coi các đề có độ khó tương đương.
- Đảo thứ tự câu và các phương án độc lập, giữ đúng nội dung đáp án sau khi đảo.
- Khi trang làm bài bị ẩn do chuyển tab hoặc thu nhỏ trình duyệt: đổi đề, xóa câu trả lời cũ, giữ nguyên mốc hết giờ ban đầu.
- Tự động gửi kết quả khi nộp bài; hiển thị xác nhận lưu thành công hoặc lỗi có nút thử lại.
- Lưu vào bảng điểm Tin 12, không dùng bảng điểm hoặc địa chỉ Apps Script của Tin 10.

## 2. Thông tin phải chốt trước khi soạn đề Tin 12

| Nội dung | Trạng thái / cách xử lí |
|---|---|
| Phạm vi bài học của TX2 Tin 12 | Đã chốt: bài 1, 2, 3, 4, 5, 6. |
| Số câu và thời gian | Dùng mẫu 15 câu / 16 phút nếu thầy muốn giữ như Tin 10. |
| Ma trận | Nếu có 5 bài: mỗi bài 1 nhận biết + 1 thông hiểu + 1 vận dụng. Nếu phạm vi khác 5 bài, lập ma trận mới có tổng 15 câu. |
| Bảng điểm nhận kết quả | Xác minh cấu hình Tin 12 đang có; không sao chép cấu hình Tin 10. |
| Tab nhận điểm | Có thể lưu chung và lọc theo mã bài; khuyến nghị tab `TX2` riêng để rõ thang điểm 10. Cần triển khai việc chọn tab nếu dùng phương án này. |

Không mặc định phạm vi Tin 12 là các bài 1, 2, 7, 8, 9. Đó là phạm vi đã dùng cho Tin 10.

## 3. Những gì đã có trong dự án Tin 12

Đã kiểm tra mã nguồn tại thời điểm lập tài liệu:

| Thành phần | Tệp / trạng thái hiện tại |
|---|---|
| Ngân hàng câu hỏi | `lib/questions.ts` đăng ký các ngân hàng `data/questions/bai-XX.ts`. |
| Kiểu câu hỏi | `lib/types.ts`: có `id`, `q`, `code?`, `options`, `answer`, `explain`; chưa có mức độ nhận thức. |
| Thông tin học sinh | `lib/hocsinh.ts`. |
| Giao diện gửi kết quả | `components/NopBai.tsx`; hiện nhận dạng `Trắc nghiệm`, `Đúng/Sai`, `Thi thử`. |
| API nộp bài | `app/api/nop-bai/route.ts`; chưa nhận mã bài TX2 và dạng `Thường xuyên`. |
| Giới hạn mã bài | API chỉ chấp nhận biểu thức `^(bai-\d{2}|thi-thu)$`. |
| Giới hạn điểm | API dùng `soNguyen` để kiểm tra `diem` từ 0 đến 100. Chưa nhận điểm TX2 như 9,33/10. |
| Kết nối Sheets | `lib/google-sheets.ts`, hàm `themDong`; dùng Google Service Account. |
| Cột điểm hiện tại | `HUONG_DAN_NOP_BAI.md` mô tả cột `Điểm %`; cần phân biệt với điểm TX2 thang 10. |
| Kiểm tra tên miền | API đang dùng danh sách cố định và `VERCEL_URL`; cần tránh lỗi `Origin mismatch` khi dùng miền khác của cùng website. |
| Giới hạn lượt nộp | 20 lượt trong 10 phút theo IP; có thể ảnh hưởng nhiều học sinh chung mạng. Cần đánh giá khi dùng cho cả lớp. |

Đây là trạng thái khảo sát trước khi tạo TX2. Hiện đã bổ sung trang TX2, dữ liệu đề trong `data/de-kiem-tra/thuong-xuyen-2.ts`, các hàm xử lí trong `lib/tx2-*.ts` và bộ kiểm thử riêng.

## 4. Tệp tham khảo từ Tin 10

Dự án nguồn: `D:\du-an\luyen-trac-nghiem-tin-10`.

| Chức năng | Tệp tham khảo |
|---|---|
| Cấu hình và bốc đề | `data/de-kiem-tra/thuong-xuyen-2.ts` |
| Giao diện, đồng hồ, chuyển tab | `components/KiemTraTx2Client.tsx` |
| Rà soát và đảo phương án | `lib/tron-phuong-an.ts` |
| Theo dõi trạng thái tab, tính thời gian còn lại | `lib/tx2-visibility.ts` |
| Xác thực tên miền nộp bài | `lib/submission-origin.ts` |
| Tự động gửi và thử lại | `components/NopBai.tsx` với `autoSubmit` |
| Xác thực dữ liệu nộp | `app/api/nop-bai/route.ts` |
| Kiểm thử | `scripts/test-tx2.cjs` |

Các commit tham khảo trên GitHub Tin 10:

- `479aaac`: bốc theo mức độ, đảo phương án an toàn, thời gian 16 phút.
- `51f9060`: đổi đề khi chuyển tab và giữ nguyên mốc hết giờ.
- `6a7645e`: sửa lỗi tên miền nộp bài, gom luồng gửi TX2, kiểm tra xác nhận Apps Script.

Chỉ tái sử dụng cơ chế. Phải thay nội dung câu hỏi, tên lớp, mã bài, danh sách bài, tên miền và cấu hình lưu điểm cho đúng Tin 12.

## 5. Phân loại và bốc câu theo ma trận

1. Đọc `CACH_RA_DE.md` của Tin 12 trước khi sửa nội dung câu hỏi.
2. Thêm kiểu mức độ và trường tùy chọn vào `Question` để không làm hỏng các ngân hàng chưa phân loại:

```ts
export type QuestionDifficulty = "nhan-biet" | "thong-hieu" | "van-dung";
// Bổ sung trong Question:
// difficulty?: QuestionDifficulty;
// shuffleOptions?: boolean;
```

3. Phân loại đầy đủ các câu thuộc phạm vi TX2:
   - Nhận biết: nhớ hoặc nhận diện khái niệm, thuật ngữ, thành phần.
   - Thông hiểu: phân biệt, giải thích, diễn giải quan hệ hoặc ý nghĩa.
   - Vận dụng: dùng kiến thức để giải quyết một tình huống hoặc bài toán cụ thể.
4. Không chỉ gắn nhãn `van-dung` cho câu hỏi định nghĩa. Nếu thiếu câu vận dụng, phải soạn thêm hoặc chỉnh nội dung phù hợp, đồng thời cập nhật phương án và giải thích.
5. Mỗi ô bài học × mức độ cần ít nhất 2 câu nếu muốn đề sau khi chuyển tab không lặp câu của đề ngay trước đó.
6. Bốc đúng số câu trong từng ô ma trận, sau đó mới đảo thứ tự toàn đề.
7. Thiếu nhóm mức độ hoặc có câu chưa phân loại phải được phát hiện trong kiểm thử. Không âm thầm bốc thiếu câu hay đổi tỉ lệ ma trận.
8. Khi đổi đề, loại các mã câu của đề vừa hủy trước khi bốc trong từng nhóm; nếu ngân hàng không đủ, bổ sung trước khi đưa vào sử dụng.

Cùng cơ cấu nhận thức giúp đề cân bằng hơn nhưng không bảo đảm mọi câu có độ khó thực nghiệm bằng nhau. Cần giáo viên duyệt nội dung.

## 6. Đảo câu và phương án an toàn

- Đảo trên bản sao, không sửa mảng ngân hàng gốc.
- Khi đảo 4 phương án, lưu ánh xạ chỉ số cũ sang mới. Chấm theo chỉ số mới tương ứng với nội dung đáp án đúng gốc.
- Giữ nguyên trường `code`, lời dẫn và giải thích của câu.
- Rà soát cả lời dẫn lẫn phương án có tham chiếu nhãn/vị trí: `Cả A và B`, `Phương án A`, `Tất cả các phương án trên`, `Hai phương án đầu tiên`...
- Ưu tiên viết lại thành các phương án độc lập. Nếu chưa viết lại, đặt `shuffleOptions: false` và giữ nguyên thứ tự.
- Có thể tham khảo bộ phát hiện trong `lib/tron-phuong-an.ts`; biểu thức phát hiện không thay thế việc duyệt nội dung.
- Không tuyên bố “chống nhìn bài 100%” hay “mọi đề hoàn toàn khác nhau”. Các lượt bốc độc lập có thể trùng câu; riêng đề thay thế phải được kiểm tra theo quy tắc ở mục 5.

## 7. Đồng hồ 16 phút và đổi đề khi chuyển tab

- Thời điểm bắt đầu: lưu mốc `deadline = Date.now() + 16 * 60 * 1000`.
- Thời gian còn lại: `Math.max(0, Math.ceil((deadline - Date.now()) / 1000))`.
- Không chỉ trừ một giây mỗi lần bộ đếm chạy: tab nền có thể bị trì hoãn thực thi.
- Theo dõi `visibilitychange` và `document.hidden` trong giai đoạn đang làm bài.
- Khi chuyển sang trạng thái ẩn và còn thời gian:
  1. Bốc đề thay thế đúng ma trận, tránh các câu của đề vừa hủy.
  2. Xóa toàn bộ lựa chọn; chuyển về câu đầu tiên.
  3. Đóng hộp xác nhận nộp cũ; cập nhật thông báo số lần đổi đề.
  4. Giữ nguyên thông tin học sinh và mốc hết giờ ban đầu.
  5. Không gửi điểm của đề bị hủy lên Sheets.
- Một lần chuyển sang ẩn chỉ đổi đề một lần; sự kiện lặp khi vẫn ẩn không đổi thêm.
- Khi quay lại, cập nhật đồng hồ theo thời gian thực. Nếu đã hết giờ, kết thúc/nộp theo trạng thái đề hiện tại; không cấp lại 16 phút.
- Sau khi nộp hoặc rời component, gỡ listener. Không đổi đề đã nộp và không gửi thêm lần nữa do sự kiện hết giờ.
- Hiển thị rõ quy định trước nút bắt đầu và thông báo sau mỗi lần đổi đề.

Giới hạn cần hiểu đúng: cơ chế này dựa vào trạng thái hiển thị trang, không phát hiện được mọi hình thức mở ứng dụng khác, chia đôi màn hình hoặc dùng thiết bị thứ hai. Chỉ bấm sang một ô nhập trong trang không được coi là chuyển tab. Cơ chế mẫu chưa cung cấp lưu bền lượt làm qua tải lại trang hay xác thực chống can thiệp phía máy chủ.

## 8. Lưu kết quả Tin 12 vào Google Sheets

### Hợp đồng dữ liệu

- Chọn mã riêng, ví dụ `kiem-tra-tx2-12`, và dùng thống nhất ở giao diện, API, kiểm thử, bảng điểm.
- Bổ sung dạng `Thường xuyên` vào cả kiểu của `NopBai` và danh sách API cho phép.
- Bổ sung đúng mã TX2 vào kiểm tra mã bài; không bỏ toàn bộ xác thực mã bài hiện có.
- Với TX2: `soCauDung` và `tongSoCau` là số nguyên, `diem` là số hữu hạn từ 0 đến 10, làm tròn 2 chữ số thập phân.
- Giữ hợp đồng điểm phần luyện tập hiện có. Không đổi toàn bộ API từ thang 100 sang thang 10.
- Bảo đảm tên cột thể hiện rõ thang điểm: nếu lưu tab TX2 riêng, dùng `Điểm /10`; nếu lưu chung, phải có quy ước/cột phân biệt để 9,33/10 không bị hiểu là 9,33%.
- Mốc thời gian lưu do máy chủ tạo theo múi giờ Việt Nam.

### Chỉ một luồng gửi kết quả

- TX2 dùng một component nộp bài duy nhất có chế độ tự động sau khi chấm.
- Không vừa gửi trong `nopBai()` của trang vừa cho component khác gửi lại độc lập.
- Khóa thao tác khi đang gửi. Chỉ hiển thị “Đã lưu” khi API trả HTTP thành công và `ok: true`.
- Khi lỗi: giữ nguyên kết quả và thông tin học sinh, hiển thị lỗi có thể hiểu được, cho bấm thử lại.
- Nếu muốn chống trùng cả khi mạng ngắt sau khi máy chủ đã ghi, cần mã lượt nộp và cơ chế chống ghi lặp phía máy chủ; khóa nút trên trình duyệt chưa bảo đảm điều đó.

### Kết nối và tên miền

- Tin 12 đang dùng Service Account qua `themDong`; giữ phương thức này nếu cấu hình đang hoạt động.
- Không sao chép URL Apps Script dự phòng hay Sheet ID của Tin 10.
- Chỉ xác nhận thành công khi dịch vụ ghi điểm trả kết quả hợp lệ. Nếu bổ sung Apps Script sau này, kiểm tra cả nội dung phản hồi, không chỉ HTTP 200.
- Sửa kiểm tra Origin để chấp nhận chính tên miền website đang nhận yêu cầu và các miền triển khai hợp lệ; vẫn từ chối nguồn ngoài không được phép.
- Kiểm tra miền chính, miền phụ và preview thực tế. Không chỉ thêm một miền cứng rồi giả định mọi địa chỉ Vercel sẽ hoạt động.
- Không dùng wildcard cho mọi tên miền `*.vercel.app` và không tin tùy ý header chuyển tiếp do người gọi tự gửi.
- Nếu chia tab: chỉ rõ tên tab trong vùng ghi, ví dụ `'TX2'!A:I`; không giả định tab đang mở trong trình duyệt sẽ là nơi API ghi.
- Đánh giá giới hạn 20 lượt/10 phút/IP với tình huống cả lớp dùng chung Internet trước khi dùng chính thức.

## 9. Kiểm thử và điều kiện nghiệm thu

### Kiểm thử cục bộ

- [ ] Sinh ít nhất 1.000 đề: đúng số câu, đúng từng ô ma trận, không trùng mã câu trong một đề.
- [ ] Các lượt sinh có thay đổi tập câu, không chỉ thay vị trí.
- [ ] Sinh ít nhất 100 đề thay thế liên tiếp: đúng ma trận, không trùng đề ngay trước theo quy tắc đã chọn.
- [ ] Kiểm tra đủ 24 hoán vị phương án của từng câu độc lập: nội dung đáp án đúng không đổi.
- [ ] Câu phụ thuộc A/B/C/D hoặc vị trí và câu có `shuffleOptions: false` không bị đảo.
- [ ] Ngân hàng nguồn không bị thay đổi sau khi bốc và đảo.
- [ ] Đồng hồ là 960 giây; thời gian nền vẫn bị trừ; không trở thành số âm.
- [ ] Chuyển tab xóa đáp án cũ, đóng xác nhận nộp cũ và quay về câu đầu; không ghi Sheets cho đề hủy.
- [ ] Quay lại không đổi đề thêm; đã nộp thì chuyển tab không tác động.
- [ ] Mã TX2, dạng `Thường xuyên` và điểm thập phân được API chấp nhận; dữ liệu sai bị từ chối.
- [ ] Nguồn cùng website được chấp nhận; nguồn ngoài bị từ chối.
- [ ] Phản hồi lưu điểm lỗi/không hợp lệ không hiện thành công; có thể thử lại.
- [ ] Chạy kiểm tra TypeScript và bộ kiểm thử sẵn có của dự án nếu phần sửa có liên quan.
- [ ] Thử trên trình duyệt thật: bắt đầu, chọn đáp án, chuyển tab, quay lại, hết giờ, nộp bài.

Kiểm thử sự kiện bằng dữ liệu giả không thay thế việc thử thao tác trong trình duyệt thật.

### Kiểm tra sau triển khai

- [ ] Xác minh GitHub có đúng commit; Vercel triển khai thành công đúng commit đó.
- [ ] Trang công khai hiển thị đúng lớp 12, phạm vi bài, 16 phút và quy định chuyển tab.
- [ ] Sau khi được phép thử ghi, gửi đúng một dòng có nhãn TEST từ tên miền học sinh dùng.
- [ ] Đọc lại bảng điểm Tin 12: có đúng một dòng TEST, đúng tab, mã bài, thang điểm và thời gian.
- [ ] Phân biệt rõ “đã cấu hình”, “API báo thành công” và “đã nhìn thấy dòng trong Sheets”. Chỉ kết luận lưu được khi đã đối chiếu dữ liệu.
- [ ] Nếu người dùng còn ở màn hình kết quả bị lỗi, hướng dẫn bấm thử lại sau khi sửa máy chủ; tránh bắt tải lại trang làm mất kết quả.

## 10. Trình tự triển khai đề xuất

1. Xác nhận phạm vi TX2 Tin 12 và bảng điểm nhận kết quả.
2. Kiểm tra GitHub mới nhất, đọc hướng dẫn dự án và bảo toàn các thay đổi đang có.
3. Phân loại ngân hàng, bổ sung câu còn thiếu và lập ma trận.
4. Tạo cấu hình, trang TX2 và lối vào từ trang chủ.
5. Thêm bốc đề, đảo phương án, đồng hồ và đổi đề khi chuyển tab.
6. Điều chỉnh hợp đồng API, kiểu `NopBai`, thang điểm và luồng tự động gửi.
7. Kiểm tra tên miền và nơi lưu; không chạm vào khóa bí mật ngoài phạm vi cần thiết.
8. Hoàn thành kiểm thử và rà soát thay đổi.
9. Khi được yêu cầu triển khai: chỉ commit các tệp liên quan, đẩy GitHub, đợi Vercel thành công rồi xác minh trang công khai và Sheets.

Không dùng đẩy ép để xử lí nhánh cũ hơn GitHub. Nếu checkout hiện tại không cập nhật được, dùng một checkout sạch của bản mới nhất để mang đúng phần thay đổi vào; giữ nguyên công việc gốc.

## 11. Các điểm chưa xác định của lần bàn giao này

- Phạm vi đã chốt: bài 1–6.
- Cấu hình đã chọn: 15 câu / 16 phút / 6 bài; ma trận 6 nhận biết, 6 thông hiểu, 3 vận dụng.
- Tab đã chọn: `TX2` trong bảng tính Tin 12 hiện cấu hình; cần đối chiếu bằng một lượt ghi thật sau khi được phép.
- Có bổ sung lưu chi tiết lượt làm và chống ghi lặp phía máy chủ hay không.

Lưu chi tiết mã câu, thứ tự phương án, lựa chọn, số lần đổi đề và mã lượt làm là hướng mở rộng hữu ích; không được mô tả là tính năng đã có sẵn ở mẫu Tin 10.
