/**
 * ============================================================================
 * MÃ GOOGLE APPS SCRIPT LƯU KẾT QUẢ BÀI KIỂM TRA TIN HỌC 12 VÀO GOOGLE SHEET
 * ============================================================================
 * Hướng dẫn sử dụng (chỉ mất 1 phút):
 * 1. Mở file Google Sheet của thầy cô (hoặc tạo một file mới).
 * 2. Vào menu "Tiện ích mở rộng" (Extensions) -> chọn "Apps Script".
 * 3. Xoá hết mã có sẵn và dán toàn bộ đoạn mã này vào.
 * 4. Bấm "Triển khai" (Deploy) -> "Tùy chọn triển khai mới" (New deployment).
 * 5. Bấm vào biểu tượng bánh răng ⚙️ bên cạnh "Chọn loại", chọn: "Ứng dụng web" (Web app).
 * 6. Điền cấu hình:
 *    - Mô tả: Lưu điểm Tin 12
 *    - Thực thi dưới dạng (Execute as): "Tôi" (Me)
 *    - Ai có quyền truy cập (Who has access): "Bất kỳ ai" (Anyone) -> RẤT QUAN TRỌNG!
 * 7. Bấm "Triển khai" (Deploy), cấp quyền truy cập nếu Google hỏi, và COPY "URL ứng dụng web" (Web App URL).
 * 8. Dán URL đó vào biến môi trường `GOOGLE_SHEET_WEBAPP_URL` trên Vercel (hoặc file .env.local).
 */

function setupHeaders(sheet, isTx2) {
  var headers = isTx2
    ? ["Thời gian", "Họ tên", "Lớp", "Mã bài", "Tên bài", "Dạng", "Điểm /10", "Số câu đúng", "Tổng số câu"]
    : ["Thời gian", "Họ tên", "Lớp", "Mã bài", "Tên bài", "Dạng", "Điểm %", "Số câu đúng", "Tổng số câu"];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    var range = sheet.getRange(1, 1, 1, headers.length);
    range.setBackground(isTx2 ? "#7C3AED" : "#2563EB");
    range.setFontColor("#FFFFFF");
    range.setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
}

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var data = JSON.parse(e.postData.contents);

    var isTx2 = (data.baiId === "kiem-tra-tx2-12" || data.dang === "Thường xuyên" || data.tab === "TX2");
    var targetSheet;

    if (isTx2) {
      targetSheet = ss.getSheetByName("TX2") || ss.insertSheet("TX2");
    } else {
      targetSheet = ss.getActiveSheet();
    }

    setupHeaders(targetSheet, isTx2);

    var thoiGian = data.thoiGian || Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy HH:mm:ss");
    var hoTen = data.hoTen || "";
    var lop = data.lop || "";
    var baiId = data.baiId || "";
    var tenBai = data.tenBai || "";
    var dang = data.dang || (isTx2 ? "Thường xuyên" : "Trắc nghiệm");
    var diem = data.diem !== undefined ? data.diem : 0;
    var soCauDung = data.soCauDung !== undefined ? data.soCauDung : 0;
    var tongSoCau = data.tongSoCau !== undefined ? data.tongSoCau : (isTx2 ? 15 : 10);

    targetSheet.appendRow([
      thoiGian,
      hoTen,
      lop,
      baiId,
      tenBai,
      dang,
      diem,
      soCauDung,
      tongSoCau
    ]);

    return ContentService.createTextOutput(JSON.stringify({ ok: true, message: "Đã lưu kết quả thành công!" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ status: "active", message: "Google Apps Script Webhook Tin học 12 đang hoạt động!" }))
    .setMimeType(ContentService.MimeType.JSON);
}
