const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const originalResolve = Module._resolveFilename;
Module._resolveFilename = function (name, ...args) {
  return originalResolve.call(
    this,
    name.startsWith('@/') ? path.join(root, name.slice(2)) : name,
    ...args
  );
};

require.extensions['.ts'] = (mod, file) =>
  mod._compile(
    ts.transpileModule(fs.readFileSync(file, 'utf8'), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
        esModuleInterop: true,
      },
    }).outputText,
    file
  );

const {
  REVIEW_MC,
  REVIEW_TF,
  REVIEW_ESSAYS,
} = require('../data/review-1-8.ts');

const {
  taoDeGiuaKi1,
  GIUA_KI_1_ID,
  GIUA_KI_1_TITLE,
  GIUA_KI_1_MC_COUNT,
  GIUA_KI_1_TF_COUNT,
  GIUA_KI_1_ESSAY_COUNT,
  GIUA_KI_1_TOTAL_QUESTIONS,
} = require('../data/de-kiem-tra/giua-ki-1.ts');

const {
  tinhDiemGiuaKi1,
  tinhDiemMotCauTF,
} = require('../lib/giua-ki-1.ts');

test('Cấu trúc đề thi giữa kì 1: đúng 16 TNKQ, 3 TNĐS, 2 Tự luận từ nguồn đề cương', () => {
  const de = taoDeGiuaKi1();
  assert.equal(de.mc.length, 16);
  assert.equal(de.tf.length, 3);
  assert.equal(de.essay.length, 2);
  assert.equal(
    de.mc.length + de.tf.length + de.essay.length,
    GIUA_KI_1_TOTAL_QUESTIONS
  );

  // Mọi câu hỏi đều phải lấy từ nguồn đề cương bài 1-8
  for (const q of de.mc) {
    assert.ok(REVIEW_MC.some((src) => src.id === q.id));
    assert.equal(q.shuffledOptions.length, 4);
    assert.equal(q.shuffledOptions[q.correctIndex], q.options[q.answer]);
  }
  for (const q of de.tf) {
    assert.ok(REVIEW_TF.some((src) => src.id === q.id));
    assert.equal(q.statements.length, 4);
  }
  for (const q of de.essay) {
    assert.ok(REVIEW_ESSAYS.some((src) => src.id === q.id));
    assert.equal(q.rubric.length, 4);
  }

  // 16 câu TNKQ phủ đủ 8 bài học (mỗi bài đúng 2 câu)
  for (let lesson = 1; lesson <= 8; lesson++) {
    const mcInLesson = de.mc.filter((q) => q.lesson === lesson);
    assert.equal(mcInLesson.length, 2, `Bài ${lesson} phải có đúng 2 câu TNKQ`);
  }

  // 3 câu TNĐS từ 3 bài khác nhau
  const tfLessons = new Set(de.tf.map((q) => q.lesson));
  assert.equal(tfLessons.size, 3);

  // 2 câu tự luận từ 2 bài khác nhau
  const essayLessons = new Set(de.essay.map((q) => q.lesson));
  assert.equal(essayLessons.size, 2);
});

test('Chức năng chuyển tab: sinh đề mới hoàn toàn, tránh trùng đề cũ', () => {
  const de1 = taoDeGiuaKi1();
  const oldIds = [
    ...de1.mc.map((q) => q.id),
    ...de1.tf.map((q) => q.id),
    ...de1.essay.map((q) => q.id),
  ];

  // Giả lập học sinh chuyển tab -> hệ thống sinh đề mới với previousIds = oldIds
  const de2 = taoDeGiuaKi1(oldIds);
  assert.notEqual(de1.id, de2.id);

  // Số lượng câu vẫn tuyệt đối chính xác
  assert.equal(de2.mc.length, 16);
  assert.equal(de2.tf.length, 3);
  assert.equal(de2.essay.length, 2);

  // Kiểm tra đề 2 đã thay đổi câu hỏi
  const newIds = new Set([
    ...de2.mc.map((q) => q.id),
    ...de2.tf.map((q) => q.id),
    ...de2.essay.map((q) => q.id),
  ]);
  const overlap = oldIds.filter((id) => newIds.has(id));
  // Vì ngân hàng TNKQ có 60 câu (8 bài x 7-8 câu) và mỗi bài chỉ chọn 2 câu,
  // khi đổi đề thì hầu hết hoặc tất cả câu hỏi đều mới
  assert.ok(overlap.length < oldIds.length / 2, 'Đề mới phải khác biệt rõ rệt');
});

test('Quy chế chấm điểm chuẩn GDPT 2018: TNKQ 4.0đ, TNĐS 3.0đ, Tự luận 3.0đ (Tổng 10.0đ)', () => {
  // Thang điểm Bộ GD&ĐT cho Đúng/Sai
  assert.equal(tinhDiemMotCauTF(0), 0);
  assert.equal(tinhDiemMotCauTF(1), 0.1);
  assert.equal(tinhDiemMotCauTF(2), 0.25);
  assert.equal(tinhDiemMotCauTF(3), 0.5);
  assert.equal(tinhDiemMotCauTF(4), 1.0);

  const de = taoDeGiuaKi1();
  const activeMcIds = de.mc.map((q) => q.id);
  const activeTfIds = de.tf.map((q) => q.id);
  const activeEssayIds = de.essay.map((q) => q.id);

  // Trường hợp làm đúng 100%
  const answersAllCorrect = {
    mc: {},
    tf: {},
    essay: {},
  };
  de.mc.forEach((q) => {
    answersAllCorrect.mc[q.id] = q.answer;
  });
  de.tf.forEach((q) => {
    answersAllCorrect.tf[q.id] = q.statements.map((s) => s.answer);
  });
  de.essay.forEach((q) => {
    answersAllCorrect.essay[q.id] = {
      text: 'Bài làm tự luận đầy đủ kiến thức',
      rubric: [true, true, true, true],
    };
  });

  const resPerfect = tinhDiemGiuaKi1(
    answersAllCorrect,
    activeMcIds,
    activeTfIds,
    activeEssayIds
  );

  assert.equal(resPerfect.mcCorrect, 16);
  assert.equal(resPerfect.mcScore, 4.0);
  assert.equal(resPerfect.tfCorrectStatements, 12);
  assert.equal(resPerfect.tfScore, 3.0);
  assert.equal(resPerfect.essayScore, 3.0);
  assert.equal(resPerfect.totalScore, 10.0);
  assert.equal(resPerfect.completedQuestions, 21);

  // Trường hợp làm đúng một phần
  const answersPartial = {
    mc: {},
    tf: {},
    essay: {},
  };
  // Đúng 8/16 câu TNKQ = 2.0đ
  de.mc.forEach((q, idx) => {
    answersPartial.mc[q.id] = idx < 8 ? q.answer : (q.answer + 1) % 4;
  });
  // Câu 1: đúng 4 ý = 1.0đ; Câu 2: đúng 2 ý = 0.25đ; Câu 3: đúng 1 ý = 0.10đ -> Tổng TF = 1.35đ
  de.tf.forEach((q, idx) => {
    if (idx === 0) {
      answersPartial.tf[q.id] = q.statements.map((s) => s.answer);
    } else if (idx === 1) {
      answersPartial.tf[q.id] = q.statements.map((s, sIdx) =>
        sIdx < 2 ? s.answer : !s.answer
      );
    } else {
      answersPartial.tf[q.id] = q.statements.map((s, sIdx) =>
        sIdx < 1 ? s.answer : !s.answer
      );
    }
  });
  // Câu 1: 4/4 rubric = 1.5đ; Câu 2: 2/4 rubric = 0.75đ -> Tổng TL = 2.25đ
  de.essay.forEach((q, idx) => {
    answersPartial.essay[q.id] = {
      text: 'Đoạn mã HTML mẫu',
      rubric: idx === 0 ? [true, true, true, true] : [true, true, false, false],
    };
  });

  const resPartial = tinhDiemGiuaKi1(
    answersPartial,
    activeMcIds,
    activeTfIds,
    activeEssayIds
  );

  assert.equal(resPartial.mcCorrect, 8);
  assert.equal(resPartial.mcScore, 2.0);
  assert.equal(resPartial.tfScore, 1.35);
  assert.equal(resPartial.essayScore, 2.25);
  assert.equal(resPartial.totalScore, 5.6);
});

test('API POST /api/kiem-tra-giua-ki-1: xác thực cấu trúc, tính điểm máy chủ và lưu Google Sheets', async () => {
  const originalFetch = global.fetch;
  const postedRows = [];

  global.fetch = async (url, init) => {
    assert.ok(String(url).includes('script.google.com'));
    postedRows.push(JSON.parse(init.body));
    return Response.json({ ok: true, message: 'Đã lưu kết quả thành công!' });
  };

  const { POST } = require('../app/api/kiem-tra-giua-ki-1/route.ts');
  const de = taoDeGiuaKi1();
  const activeMcIds = de.mc.map((q) => q.id);
  const activeTfIds = de.tf.map((q) => q.id);
  const activeEssayIds = de.essay.map((q) => q.id);

  const answers = { mc: {}, tf: {}, essay: {} };
  de.mc.forEach((q) => (answers.mc[q.id] = q.answer));
  de.tf.forEach((q) => (answers.tf[q.id] = q.statements.map((s) => s.answer)));
  de.essay.forEach(
    (q) =>
      (answers.essay[q.id] = {
        text: 'Nội dung bài làm tự luận của em',
        rubric: [true, true, true, true],
      })
  );

  const validBody = {
    hoTen: 'Nguyễn Văn An',
    lop: '12A1',
    saveId: 'save-giua-ki-1-test-001',
    answers,
    activeMcIds,
    activeTfIds,
    activeEssayIds,
    soLanDoiDe: 1,
    thoiGianLamBai: 1800,
  };

  const makeReq = async (body, origin = 'https://school.example') => {
    const res = await POST(
      new Request('https://school.example/api/kiem-tra-giua-ki-1', {
        method: 'POST',
        headers: { origin, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
    );
    return { status: res.status, data: await res.json() };
  };

  try {
    // 1. Chặn domain lạ
    const badOrigin = await makeReq(validBody, 'https://hacker.com');
    assert.equal(badOrigin.status, 403);

    // 2. Chặn thiếu họ tên/lớp
    const missingName = await makeReq({ ...validBody, hoTen: '' });
    assert.equal(missingName.status, 400);

    // 3. Gửi hợp lệ thành công
    const okRes = await makeReq(validBody);
    assert.equal(okRes.status, 200);
    assert.equal(okRes.data.ok, true);
    assert.equal(okRes.data.scoring.totalScore, 10.0);

    // Kiểm tra hàng gửi về Apps Script Google Sheets
    assert.equal(postedRows.length, 1);
    const row = postedRows[0];
    assert.equal(row.hoTen, 'Nguyễn Văn An');
    assert.equal(row.lop, '12A1');
    assert.equal(row.baiId, GIUA_KI_1_ID);
    assert.equal(row.tenBai, GIUA_KI_1_TITLE);
    assert.equal(row.dang, 'Giữa kì 1');
    assert.equal(row.diem, 10.0);
    assert.equal(row.tongSoCau, 21);
    assert.equal(row.detail.soLanDoiDe, 1);

    // 4. Chống nộp lặp (idempotency)
    const repeatRes = await makeReq(validBody);
    assert.equal(repeatRes.status, 200);
    assert.equal(postedRows.length, 1, 'Không gửi lại trùng vào Google Sheets');
  } finally {
    global.fetch = originalFetch;
  }
});
