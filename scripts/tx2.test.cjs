const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const resolve = Module._resolveFilename;
Module._resolveFilename = function(name, ...args) { return resolve.call(this, name.startsWith('@/') ? path.join(root, name.slice(2)) : name, ...args); };
require.extensions['.ts'] = (mod, file) => mod._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText, file);
const { TX2_LESSONS, taoDeTx2 } = require('../data/de-kiem-tra/thuong-xuyen-2.ts');
const { TX2_ID, TX2_COUNT, TX2_MINUTES, TX2_HEADERS, diemTx2 } = require('../lib/tx2-config.ts');
const { tronPhuongAn, phuThuocThuTu } = require('../lib/tron-phuong-an.ts');
const { soGiayTx2ConLai, theoDoiTabTx2 } = require('../lib/tx2-visibility.ts');
const { docBaiNop } = require('../lib/submission-data.ts');
const { dungMienNopBai } = require('../lib/submission-origin.ts');
const bank = TX2_LESSONS.flatMap(l => l.questions);
const levels = ['nhan-biet', 'thong-hieu', 'van-dung'];
function validate(exam) {
  assert.equal(exam.length, 15);
  assert.equal(new Set(exam.map(q => q.id)).size, 15);
  for (const [level, count] of [['nhan-biet',6],['thong-hieu',6],['van-dung',3]]) assert.equal(exam.filter(q => q.difficulty === level).length, count);
  assert.equal(new Set(exam.filter(q => q.difficulty === 'van-dung').map(q => q.lessonId)).size, 3);
  for (const lesson of TX2_LESSONS) {
    for (const level of levels.slice(0,2)) assert.equal(exam.filter(q => q.lessonId === lesson.id && q.difficulty === level).length, 1);
  }
  for (const q of exam) { const original=bank.find(item=>item.id===q.id);assert.ok(original);assert.equal(q.code,original.code);assert.equal(q.shuffledOptions[q.correctIndex],original.options[original.answer]); }
}
test('97 classified questions produce 1,000 balanced exams covering all six lessons', () => {
  assert.equal(bank.length,97); assert.equal(new Set(bank.map(q=>q.id)).size,97); assert.equal(TX2_COUNT,15);assert.equal(TX2_MINUTES,16);
  const original=JSON.stringify(bank), sets=new Set(), applicationLessons=new Set();
  for(const lesson of TX2_LESSONS)for(const level of levels)assert.ok(lesson.questions.filter(q=>q.difficulty===level).length>=2);
  for(let i=0;i<1000;i++){ const exam=taoDeTx2();validate(exam);sets.add(exam.map(q=>q.id).sort().join(','));for(const q of exam)if(q.difficulty==='van-dung')applicationLessons.add(q.lessonId); }
  assert.ok(sets.size>1);assert.equal(applicationLessons.size,6);assert.equal(JSON.stringify(bank),original);
});
test('100 replacements keep matrix and exclude every question from the previous exam',()=>{let previous=taoDeTx2();for(let i=0;i<100;i++){const ids=previous.map(q=>q.id);const next=taoDeTx2(ids);validate(next);assert.ok(next.every(q=>!ids.includes(q.id)));previous=next;}});
test('all 24 option permutations preserve answers; position references stay fixed',()=>{
  for(const q of bank){assert.ok(levels.includes(q.difficulty));assert.equal(new Set(q.options).size,4);if(phuThuocThuTu(q)){assert.deepEqual(tronPhuongAn(q).shuffledOptions,q.options);continue;} const permutations=new Set();for(let a=0;a<4;a++)for(let b=0;b<3;b++)for(let c=0;c<2;c++){const values=[(a+.5)/4,(b+.5)/3,(c+.5)/2];const result=tronPhuongAn(q,()=>values.shift());assert.equal(result.shuffledOptions[result.correctIndex],q.options[q.answer]);permutations.add(JSON.stringify(result.shuffledOptions));}assert.equal(permutations.size,24);}
  for(const text of ['Cả A và B','Phương án A','Tất cả các phương án trên','Cả bốn ý trên','Hai phương án đầu tiên']){const q={...bank[0],options:['Một','Hai','Ba',text]};assert.deepEqual(tronPhuongAn(q,()=>{throw Error('Must not shuffle');}).shuffledOptions,q.options);}
  assert.deepEqual(tronPhuongAn({...bank[0],shuffleOptions:false}).shuffledOptions,bank[0].options);
});
test('tab changes fire once per transition, clean up and use real deadlines',()=>{const listeners=new Set(),events=[];const doc={hidden:false,addEventListener:(type,fn)=>listeners.add(fn),removeEventListener:(type,fn)=>listeners.delete(fn)};const stop=theoDoiTabTx2(doc,v=>events.push(v));const emit=()=>[...listeners].forEach(fn=>fn());emit();doc.hidden=true;emit();emit();doc.hidden=false;emit();assert.deepEqual(events,[true,false]);stop();doc.hidden=true;emit();assert.equal(events.length,2);assert.equal(listeners.size,0);assert.equal(soGiayTx2ConLai(961000,1000),960);assert.equal(soGiayTx2ConLai(961000,61000),900);assert.equal(soGiayTx2ConLai(961000,961001),0);});
test('missing difficulty pools fail before producing an incomplete exam',()=>{const lesson=TX2_LESSONS[0],saved=lesson.questions;try{lesson.questions=saved.filter(q=>q.difficulty!=='van-dung');assert.throws(()=>taoDeTx2(),/thiếu câu/);}finally{lesson.questions=saved;}});
const body={hoTen:'Học Sinh Test',lop:'12A1',baiId:TX2_ID,tenBai:'TX2 Tin học 12',dang:'Thường xuyên',tongSoCau:15,soCauDung:14,diem:9.33};
test('TX2 accepts decimal /10 while preserving integer /100 practice scores',()=>{assert.equal(docBaiNop(body).diem,9.33);assert.equal(diemTx2(1),.67);for(const bad of [null,[],{...body,diem:93},{...body,diem:NaN},{...body,diem:Infinity},{...body,diem:9.34},{...body,tongSoCau:18},{...body,dang:'Thi thử'},{...body,baiId:'unknown'}])assert.equal(docBaiNop(bad),null);assert.equal(docBaiNop({...body,baiId:'bai-01',dang:'Trắc nghiệm',diem:93}).diem,93);assert.equal(docBaiNop({...body,baiId:'bai-01',dang:'Trắc nghiệm'}),null);});
test('same-site and configured origins pass, unrelated and null origins fail',()=>{for(const host of ['luyen-trac-nghiem-tin-12.vercel.app','school.example','preview-123.vercel.app'])assert.equal(dungMienNopBai(new Request('https://'+host+'/api/nop-bai',{headers:{origin:'https://'+host}}),{}),true);for(const origin of ['null','bad url','https://unrelated.example'])assert.equal(dungMienNopBai(new Request('https://school.example/api/nop-bai',{headers:{origin}}),{}),false);});
// Tất cả yêu cầu Google dưới đây được giả lập; không đọc khóa thật, không ghi Sheets thật.
test('API writes /10 into a dedicated TX2 tab; classroom IPs work; failures stay errors',async()=>{
  const savedFetch=global.fetch,keys=['GOOGLE_SERVICE_ACCOUNT_EMAIL','GOOGLE_PRIVATE_KEY','GOOGLE_SHEET_ID'],saved=keys.map(k=>process.env[k]);
  const {privateKey}=crypto.generateKeyPairSync('rsa',{modulusLength:2048,privateKeyEncoding:{type:'pkcs8',format:'pem'},publicKeyEncoding:{type:'spki',format:'pem'}});
  process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL='test@example.invalid';process.env.GOOGLE_PRIVATE_KEY=privateKey;process.env.GOOGLE_SHEET_ID='mock-sheet';
  let tabExists=false,header=[],failAppend=false;const rows=[];
  global.fetch=async(url,init={})=>{url=String(url);if(url.includes('oauth2.googleapis.com'))return Response.json({access_token:'mock',expires_in:3600});if(url.includes('?fields='))return Response.json({sheets:tabExists?[{properties:{title:'TX2'}}]:[]});if(url.endsWith(':batchUpdate')){tabExists=true;return Response.json({replies:[{}]});}if(url.includes(':append')){if(failAppend)return new Response('failed',{status:503});rows.push({url,row:JSON.parse(init.body).values[0]});return Response.json({updates:{updatedRows:1}});}if(init.method==='PUT'){header=JSON.parse(init.body).values[0];return Response.json({updatedRows:1});}return Response.json({values:header.length?[header]:[]});};
  try{const {POST}=require('../app/api/nop-bai/route.ts');const call=async(b,origin='https://school.example')=>{const response=await POST(new Request('https://school.example/api/nop-bai',{method:'POST',headers:{origin,'content-type':'application/json','x-forwarded-for':'192.0.2.100'},body:JSON.stringify(b)}));return {status:response.status,body:await response.json()};};
    assert.equal((await call(body,'https://attacker.example')).status,403);assert.equal((await call(null)).status,400);assert.equal(rows.length,0);
    const first=await call(body);assert.equal(first.status,200);assert.equal(first.body.ok,true);assert.ok(tabExists);assert.deepEqual(header,TX2_HEADERS);assert.ok(decodeURIComponent(rows[0].url).includes("'TX2'!A:I"));assert.equal(rows[0].row[6],9.33);
    for(let i=0;i<35;i++)assert.equal((await call({...body,hoTen:'Học Sinh '+i})).status,200);
    for(let i=1;i<20;i++)assert.equal((await call(body)).status,200);assert.equal((await call(body)).status,429);
    assert.equal((await call({...body,hoTen:'Luyện Tập',baiId:'bai-01',dang:'Trắc nghiệm',diem:93})).status,200);assert.ok(rows.at(-1).url.includes('/values/A:I:append'));assert.equal(rows.at(-1).row[6],93);
    failAppend=true;const failed=await call({...body,hoTen:'Lỗi Máy Chủ'});assert.equal(failed.status,502);assert.equal(failed.body.ok,false);
    failAppend=false;header=['Cột cũ không đúng cấu trúc'];const before=rows.length;const badHeader=await call({...body,hoTen:'Kiểm Tra Tiêu Đề'});assert.equal(badHeader.status,502);assert.equal(rows.length,before);assert.deepEqual(header,['Cột cũ không đúng cấu trúc']);
  }finally{global.fetch=savedFetch;keys.forEach((k,i)=>{if(saved[i]===undefined)delete process.env[k];else process.env[k]=saved[i];});}
});
