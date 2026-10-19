/** Webhook Tin 12: cột E chỉ chứa tên bài; chi tiết ôn tập ở ghi chú cột J. */
function reviewCell(data) {
  var review = data.review;
  if (!review || data.baiId !== 'on-tap-1-8') return null;
  if (!/^[-a-zA-Z0-9]{8,80}$/.test(review.saveId || '')) throw new Error('Mã lưu không hợp lệ');
  var s = review.summary;
  if (!s || !review.answers) throw new Error('Thiếu chi tiết ôn tập');
  return {
    value: 'TNKQ ' + s.mcDone + '/60; ĐS ' + s.tfDone + '/12; TL ' + s.essayDone + '/8; tự đánh giá TL ' + (s.essaySelf === null ? 'chưa có' : s.essaySelf + '/10') + ' | ' + review.saveId,
    note: JSON.stringify(review)
  };
}
function setupHeaders(sheet) {
  var headers = ['Thời gian','Họ tên','Lớp','Mã bài','Tên bài','Dạng','Điểm /10','Số câu đúng','Tổng số câu'];
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1,1,1,9).setValues([headers]);
    sheet.getRange(1,1,1,9).setBackground('#7C3AED').setFontColor('#FFFFFF').setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
}
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    // Chọn tab ổn định để việc giáo viên mở tab khác không đổi nơi nhận kết quả.
    var sheet = ss.getSheetByName('Trang tính1') || ss.getSheets()[0];
    setupHeaders(sheet);
    var detail = reviewCell(data);
    if (detail) {
      var header = sheet.getRange(1,10).getValue();
      if (header && header !== 'Chi tiết ôn tập') throw new Error('Cột J đang dùng cho dữ liệu khác; chưa ghi đè');
      if (!header) sheet.getRange(1,10).setValue('Chi tiết ôn tập');
      if (sheet.getLastRow() > 1) {
        var existing = sheet.getRange(2,10,sheet.getLastRow()-1,1).createTextFinder(data.review.saveId).matchCase(true).useRegularExpression(false).findNext();
        if (existing) {
          var oldStudent = sheet.getRange(existing.getRow(),2,1,2).getValues()[0];
          if (existing.getNote() !== detail.note || oldStudent[0] !== data.hoTen || oldStudent[1] !== data.lop) throw new Error('Mã lưu đã dùng cho kết quả khác');
          return jsonReply({ok:true,reviewSaved:true,duplicate:true});
        }
      }
    }
    var title = data.baiId === 'on-tap-1-8' ? 'Ôn tập bài 1–8 — Tin học 12' : (data.tenBai || '');
    var row = [data.thoiGian || Utilities.formatDate(new Date(),'GMT+7','dd/MM/yyyy HH:mm:ss'),data.hoTen || '',data.lop || '',data.baiId || '',title,data.dang || 'Thường xuyên',data.diem === undefined ? 0 : data.diem,data.soCauDung === undefined ? 0 : data.soCauDung,data.tongSoCau === undefined ? 15 : data.tongSoCau];
    if (detail) row.push(detail.value);
    var rowNumber = sheet.getLastRow()+1;
    sheet.getRange(rowNumber,1,1,row.length).setValues([row]);
    if (detail) sheet.getRange(rowNumber,10).setNote(detail.note).setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);
    return jsonReply({ok:true,reviewSaved:!!detail,message:'Đã lưu kết quả thành công!'});
  } catch (error) {
    return jsonReply({ok:false,error:String(error)});
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}
function jsonReply(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
function doGet() {
  return jsonReply({status:'active',version:'review-details-v2',message:'Webhook Tin học 12 đang hoạt động!'});
}
