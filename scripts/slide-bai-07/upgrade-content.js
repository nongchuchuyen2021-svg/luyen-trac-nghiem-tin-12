const lessonMissions={
 foundation:{name:'1. Hoàn thiện khung',goal:'Tự điền tên tab, lời chào h1 và đoạn giới thiệu. Thêm khai báo mã hóa tiếng Việt.',starter:'<!DOCTYPE html>\n<html lang="vi">\n<head>\n  <!-- Thêm meta charset tại đây -->\n  <title></title>\n</head>\n<body>\n  <h1></h1>\n  <p></p>\n</body>\n</html>',hint:'Tên tab viết trong title ở head. Lời chào h1 và đoạn p nằm trong body. Nhớ meta charset="utf-8".'},
 repair:{name:'2. Sửa trang bị lỗi',goal:'Sửa thứ tự đóng thẻ và chuyển title về đúng phần. Giữ một cụm từ được nhấn mạnh trong đoạn.',starter:'<!DOCTYPE html>\n<html lang="vi">\n<head>\n  <meta charset="utf-8">\n</head>\n<body>\n  <title>Câu lạc bộ lớp 12</title>\n  <h1>Chào lớp mình!</h1>\n  <p>Cùng học <em>HTML</p></em>\n</body>\n</html>',hint:'Có hai chỗ chính cần sửa: title thuộc head; em đang mở sau p thì phải đóng trước p.'},
 create:{name:'3. Trang lớp của em',goal:'Tự tạo trang có tên tab, h1, hai đoạn p, một cụm em và một lần ngắt dòng br trong đoạn. Dùng UTF-8.',starter:'<!-- Tự viết tài liệu HTML của em từ đây. -->\n',hint:'Vẽ khung html chứa head và body trước. Head có meta và title. Body có h1, hai p; lồng em và br trong đoạn.'}
};
const assemblyPieces=[
 {id:'doc',text:'<!DOCTYPE html>',why:'Khai báo kiểu tài liệu ở đầu tệp.'},
 {id:'html',text:'<html lang="vi">',why:'Mở phần tử gốc trước head và body.'},
 {id:'head',text:'<head><meta charset="utf-8"><title>Lớp 12</title></head>',why:'Head chứa mã hóa và tên tab, đóng lại trước body.'},
 {id:'body',text:'<body>',why:'Mở phần nội dung sau khi head đã đóng.'},
 {id:'h1',text:'<h1>Chào lớp mình!</h1>',why:'Tiêu đề trang nằm trong body, trước đoạn giới thiệu theo mẫu này.'},
 {id:'p',text:'<p>Chúng mình cùng học HTML.</p>',why:'Theo mẫu nhiệm vụ này, đoạn giới thiệu nằm sau h1.'},
 {id:'end-body',text:'</body>',why:'Đóng body sau các nội dung của nó.'},
 {id:'end-html',text:'</html>',why:'Đóng html cuối cùng, sau body.'}
];
const repairTasks=[
 {title:'1. Hai thẻ đóng bị đảo',goal:'Đoạn p phải chứa em có nội dung. Đóng phần tử con trước phần tử cha.',starter:'<p>Cùng học <em>HTML</p></em>',hint:'Em được mở sau p. Thẻ đóng nào phải xuất hiện trước?',kind:'nest'},
 {title:'2. Tên tab bị đặt trong body',goal:'Chuyển title vào head. Giữ h1 trong body để người xem thấy lời chào.',starter:'<!DOCTYPE html>\n<html>\n<head><meta charset="utf-8"></head>\n<body>\n  <title>Lớp 12A</title>\n  <h1>Chào lớp mình!</h1>\n</body>\n</html>',hint:'Title cung cấp tên tab. Nó là con của head, khác vị trí của h1.',kind:'title'},
 {title:'3. Enter chưa làm ngắt dòng',goal:'Giữ hai câu trong cùng một p, đặt br giữa “Dòng thứ nhất” và “Dòng thứ hai”.',starter:'<p>Dòng thứ nhất\nDòng thứ hai</p>',hint:'Giữ một cặp p. Chèn thẻ đơn br vào giữa hai câu, không viết thẻ đóng br.',kind:'break'}
];
// Preserve the first fourteen slides and add guided practice before the quiz.
sections[13].lead='Chọn nhiệm vụ, tự viết mã rồi kiểm tra từng yêu cầu. Bản nháp được giữ trên trình duyệt này.';
sections[13].html=`<div class="editor-toolbar"><label for="mission">Nhiệm vụ</label><select id="mission">${Object.entries(lessonMissions).map(([key,m])=>`<option value="${key}">${m.name}</option>`).join('')}</select><button class="action primary" id="run-code">▶ Chạy và kiểm tra</button><button class="action" id="editor-hint">💡 Gợi ý</button><button class="action" id="restore-code">↺ Mẫu nhiệm vụ</button><button class="action" id="download-code">↓ Tải .html</button></div><p class="mission-goal" id="mission-goal"></p><div class="grid two editor-layout"><div class="code-editor"><label for="code-editor">Mã của em · Ctrl + Enter để kiểm tra</label><textarea id="code-editor" spellcheck="false" aria-describedby="editor-status"></textarea></div>${frame('editor-preview','Kết quả mã HTML do em viết')}</div><div class="work-review" id="editor-review" aria-live="polite"></div><p class="teacher-note" id="editor-status" role="status"></p><div class="practice-hint" id="editor-hint-text" hidden></div>`;
sections.splice(14,0,
 {tag:'14 · LẮP RÁP KHUNG HTML',title:'Tự lắp một trang từ những mảnh mã',lead:'Chọn hoặc kéo mảnh mã vào vùng bên phải. Dùng nút lên, xuống để sửa thứ tự.',html:`<div class="assembly-layout"><div><h3 class="panel-label">Kho mảnh mã</h3><div class="piece-bank" id="piece-bank"></div></div><div><h3 class="panel-label">Tệp của em · xếp theo mẫu head trước body, h1 trước p</h3><ol class="piece-slots" id="piece-slots" aria-label="Thứ tự các mảnh HTML"></ol></div></div><div class="pills"><button class="action primary" id="assembly-check">Kiểm tra thứ tự</button><button class="action" id="assembly-hint">💡 Gợi ý bước kế</button><button class="action" id="assembly-reset">↺ Xếp lại</button></div><div id="assembly-feedback" class="feedback" role="status"></div>`},
 {tag:'15 · XƯỞNG SĂN LỖI',title:'Trang vẫn hiện chưa chắc mã đã đạt yêu cầu',lead:'Sửa trực tiếp đoạn mã. Kiểm tra để biết lỗi nào còn lại, rồi thử tiếp.',html:`<div class="repair-toolbar"><label for="repair-task">Tình huống</label><select id="repair-task">${repairTasks.map((t,i)=>`<option value="${i}">${t.title}</option>`).join('')}</select><button class="action primary" id="repair-check">Kiểm tra bản sửa</button><button class="action" id="repair-hint">💡 Gợi ý</button><button class="action" id="repair-reset">↺ Mã ban đầu</button></div><p class="mission-goal" id="repair-goal"></p><div class="grid two repair-layout"><label class="code-editor" for="repair-code">Mã cần sửa<textarea id="repair-code" spellcheck="false"></textarea></label>${frame('repair-preview','Xem kết quả sau khi tự sửa')}</div><div class="feedback" id="repair-feedback" role="status"></div><div class="practice-hint" id="repair-hint-text" hidden></div>`},
 {tag:'16 · CÂY THAY ĐỔI THEO MÃ',title:'Em đổi mã, cây giải thích cấu trúc',lead:'Thêm một em vào p, hoặc chuyển h1. Dựng cây rồi chạm nút để tìm cha và con.',html:`<div class="live-tree-toolbar"><button class="action primary" id="live-tree-build">Dựng cây từ mã</button><button class="action" id="live-tree-reset">↺ Mẫu ban đầu</button><span class="teacher-note">Cây thể hiện các phần tử em viết trong mã.</span></div><div class="grid two live-tree-layout"><label class="code-editor" for="live-tree-code">Mã nguồn có thể sửa<textarea id="live-tree-code" spellcheck="false"></textarea></label><div class="live-tree-box"><div id="live-tree" aria-label="Cây phần tử từ mã học sinh"></div><div id="live-tree-note" class="feedback" role="status"></div></div></div><p class="teacher-note">Nếu thiếu thẻ đóng hoặc lồng sai, hãy sửa theo phản hồi trước khi dựng cây. Cây này chưa hiển thị các nút văn bản.</p>`},
 {tag:'17 · DỰ ÁN NHÓM 3 PHÚT',title:'Tạo trang giới thiệu lớp và tự nghiệm thu',lead:'Một bạn viết, một bạn kiểm tra yêu cầu, một bạn giải thích cấu trúc.',html:`<div class="grid two"><div class="card project-brief"><h3>Sản phẩm của nhóm</h3><p>Tệp HTML có tên tab, lời chào h1, hai đoạn giới thiệu, một cụm nhấn mạnh em và ngắt dòng br. Có khai báo UTF-8.</p><div class="pills"><button class="action primary" id="project-open">Mở nhiệm vụ 3 để làm</button><button class="action" id="project-review">Đọc kết quả kiểm tra</button></div></div><div class="card project-timer"><output id="project-time">03:00</output><div class="pills"><button class="action primary" id="project-start">▶ Bắt đầu</button><button class="action" id="project-reset">↺ 3 phút</button></div><p class="teacher-note" id="project-time-status">Đồng hồ chạy ở slide này và xưởng nhiệm vụ 3.</p></div></div><div id="project-feedback" class="feedback" role="status">Làm nhiệm vụ 3, chạy kiểm tra, rồi quay lại đây đối chiếu.</div>`}
);
sections[18].tag='18 · KIỂM TRA VÀ GIẢI THÍCH';sections[19].tag='19 · TỔNG KẾT VÀ VẬN DỤNG';
const teacherNotes=[
 'Hỏi học sinh dự đoán trình duyệt làm gì với mã nguồn. Chưa cho các em chạy mã ngay.',
 'Cho học sinh nói kết quả dự kiến, sau đó mới bật mô phỏng ba bước.',
 'Yêu cầu chỉ riêng thẻ mở, thẻ đóng và toàn bộ phần tử. Cho một ví dụ mới ngoài mẫu.',
 'Sau mỗi lượt phân loại, yêu cầu giải thích có hay không có thẻ đóng.',
 'Phân biệt thuộc tính HTML style với thuộc tính CSS color nằm trong giá trị của style.',
 'Cho lớp dự đoán ba kết quả: Enter, br và hai p. Chốt bằng ví dụ các em tự gõ.',
 'Học sinh chỉ head và body cùng cấp, rồi xác định thông tin nào dành cho tên tab.',
 'Cho hai em đổi title và h1 thành hai câu khác nhau, giải thích nơi xuất hiện.',
 'Hỏi cha trực tiếp và con trực tiếp của từng nút. Sau đó đối chiếu bằng mã nguồn.',
 'Không coi việc trang vẫn hiển thị là bằng chứng mã đã đúng. Cho học sinh đọc thứ tự đóng thẻ.',
 'Giải thích cấp tiêu đề dùng cho thứ bậc nội dung. Không chọn h chỉ để đổi cỡ chữ.',
 'Cho học sinh thêm một chú thích riêng và dự đoán kết quả hiển thị.',
 'Phân biệt nhiệm vụ của trình soạn thảo và trình duyệt, rồi nêu quy trình lưu UTF-8, mở tệp HTML.',
 'Ba mức nhiệm vụ: hoàn thiện khung, sửa lỗi, tự tạo. Cho học sinh đọc từng phản hồi và sửa một việc mỗi lượt. Bộ kiểm tra theo yêu cầu bài học, không thay thế trình kiểm định toàn bộ chuẩn HTML.',
 'Cho học sinh tự xếp trước khi gợi ý. Mẫu nhiệm vụ quy định head trước body, h1 trước p. Dùng các nút lên, xuống nếu thiết bị không kéo được.',
 'Mỗi nhóm xử lí một tình huống, giải thích lỗi trước khi sửa. Không đọc sẵn đáp án. Sau đó đổi nhóm kiểm tra chéo.',
 'Đây là cây phần tử được viết rõ trong mã, không mô phỏng toàn bộ cơ chế tự sửa lỗi của trình duyệt. Dùng hai đoạn p cùng cấp và em lồng trong một p để phân biệt cha, con, anh em.',
 'Bật đồng hồ, rồi sang xưởng nhiệm vụ 3. Đồng hồ chạy ở hai trang này và dừng khi rời hoạt động. Cho nhóm tự chạy kiểm tra, sau đó giải thích một điều đã sửa.',
 'Tám câu củng cố. Yêu cầu học sinh giải thích đáp án, không chỉ nêu chữ cái.',
 'Đối chiếu sản phẩm nhóm với các tiêu chí tự kiểm tra. Giao trang giới thiệu của câu lạc bộ làm bài tiếp nối.'
];
