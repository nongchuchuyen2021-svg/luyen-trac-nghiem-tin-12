/**
 * ============================================================================
 * MÃ GOOGLE APPS SCRIPT GHI ĐIỂM TRỰC TIẾP VÀO SHEET ĐANG MỞ (DIEM TX2 KHOI 12)
 * ============================================================================
 * Ghi thẳng vào trang tính đang mở của thầy (không tạo thêm tab TX2 riêng)
 */

function setupHeaders(sheet) {
  var headers = [
    "Thời gian",
    "Họ tên",
    "Lớp",
    "Mã bài",
    "Tên bài",
    "Dạng",
    "Điểm /10",
    "Số câu đúng",
    "Tổng số câu"
  ];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    var range = sheet.getRange(1, 1, 1, headers.length);
    range.setBackground("#7C3AED");
    range.setFontColor("#FFFFFF");
    range.setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
}

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    // Ghi thẳng vào trang tính đầu tiên / trang tính đang mở của thầy
    var sheet = ss.getActiveSheet() || ss.getSheets()[0];

    setupHeaders(sheet);

    var data = JSON.parse(e.postData.contents);
    var thoiGian = data.thoiGian || Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy HH:mm:ss");
    var hoTen = data.hoTen || "";
    var lop = data.lop || "";
    var baiId = data.baiId || "";
    var tenBai = data.tenBai || "";
    var dang = data.dang || "Thường xuyên";
    var diem = data.diem !== undefined ? data.diem : 0;
    var soCauDung = data.soCauDung !== undefined ? data.soCauDung : 0;
    var tongSoCau = data.tongSoCau !== undefined ? data.tongSoCau : 15;

    sheet.appendRow([
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
  return ContentService.createTextOutput(JSON.stringify({ status: "active", message: "Webhook Tin học 12 đang hoạt động!" }))
    .setMimeType(ContentService.MimeType.JSON);
}
