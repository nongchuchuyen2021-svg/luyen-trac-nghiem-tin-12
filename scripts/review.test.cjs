const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),ts=require('typescript');
const root=path.resolve(__dirname,'..'),resolve=Module._resolveFilename;
Module._resolveFilename=function(name,...args){return resolve.call(this,name.startsWith('@/')?path.join(root,name.slice(2)):name,...args)};
require.extensions['.ts']=(mod,file)=>mod._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true}}).outputText,file);
const {REVIEW_MC:mc,REVIEW_TF:tf,REVIEW_ESSAYS:es,REVIEW_QUESTIONS:all,REVIEW_VERSION}=require('../data/review-1-8.ts');
const {emptyReviewAnswers,validateReviewAnswers,reviewSummary,reviewStorageKey}=require('../lib/review-1-8.ts');
const {tronPhuongAn,phuThuocThuTu}=require('../lib/tron-phuong-an.ts');
const levels=['nhan-biet','thong-hieu','van-dung','van-dung-cao'];
test('80 unique source-grounded questions have the exact 40/30/20/10 matrix',()=>{
 for(const [bank,counts]of [[mc,[24,18,12,6]],[tf,[5,4,2,1]],[es,[3,2,2,1]],[all,[32,24,16,8]]])assert.deepEqual(levels.map(l=>bank.filter(q=>q.level===l).length),counts);
 assert.equal(new Set(all.map(q=>q.id)).size,80);
 for(let lesson=1;lesson<=8;lesson++){
  const bank=require('../data/questions/bai-'+String(lesson).padStart(2,'0')+'.ts').default;
  const extra=require('../data/extra/bai-'+String(lesson).padStart(2,'0')+'.ts').default;
  assert.equal(es.filter(q=>q.lesson===lesson).length,1);
  for(const q of all.filter(q=>q.lesson===lesson))assert.ok((q.kind==='mc'?bank:q.kind==='tf'?extra.tf:extra.essay).some(o=>o.id===q.sourceId));
 }
 for(const q of tf)assert.equal(q.statements.length,4);
 for(const q of es)assert.equal(q.rubric.length,4);
});
test('all options remain distinct and randomization preserves the answer and source',()=>{
 for(const q of mc){assert.equal(new Set(q.options).size,4);const before=JSON.stringify(q);for(let n=0;n<50;n++){const mixed=tronPhuongAn(q);assert.equal(mixed.shuffledOptions[mixed.correctIndex],q.options[q.answer]);if(phuThuocThuTu(q))assert.deepEqual(mixed.shuffledOptions,q.options);}assert.equal(JSON.stringify(q),before);}
});
test('server derives /10 from 108 objective units; essays remain separate',()=>{
 const a=emptyReviewAnswers();assert.equal(reviewSummary(a).completed,0);
 for(const q of mc)a.mc[q.id]={choice:q.answer,checked:true};
 for(const q of tf)a.tf[q.id]={choices:q.statements.map(s=>s.answer),checked:true};
 for(const q of es)a.essays[q.id]={text:'Bài làm thử có ít nhất hai mươi ký tự.',rubric:[true,true,false,false],reviewed:true};
 assert.ok(validateReviewAnswers(a));const s=reviewSummary(a);assert.equal(s.completed,80);assert.equal(s.correct,108);assert.equal(s.objectiveScore,10);assert.equal(s.essaySelf,5);
 a.mc[mc[0].id].checked=false;assert.equal(reviewSummary(a).correct,107);assert.equal(reviewSummary(a).objectiveScore,9.91);
 a.tf[tf[0].id].checked=false;assert.equal(reviewSummary(a).tfUnits,44);
 assert.notEqual(reviewStorageKey('Bạn Một','12A1'),reviewStorageKey('Bạn Hai','12A1'));
 assert.notEqual(reviewStorageKey('Bạn Một','12A1'),reviewStorageKey('Bạn Một','12A2'));
 assert.equal(reviewStorageKey(' Bạn  Một ','12a1'),reviewStorageKey('bạn một','12A1'));
});
test('invalid question IDs, unchecked answers and invalid essay shapes are rejected',()=>{
 assert.equal(validateReviewAnswers(null),null);
 for(const patch of [{mc:{unknown:{choice:0,checked:true}}},{mc:{[mc[0].id]:{choice:null,checked:true}}},{tf:{[tf[0].id]:{choices:[true,null,false,false],checked:true}}},{essays:{[es[0].id]:{text:'short',rubric:[true,true,true,true],reviewed:true}}}])assert.equal(validateReviewAnswers({...emptyReviewAnswers(),...patch}),null);
});
test('API validates origin, computes score, deduplicates retries and surfaces upstream failures',async()=>{
 const originalFetch=global.fetch;let rows=[],fail=false,missing=false;
 global.fetch=async(url,init)=>{assert.ok(String(url).includes('script.google.com'));if(fail)return new Response('failed',{status:503});if(missing)return Response.json({});rows.push(JSON.parse(init.body));return Response.json({ok:true});};
 const {POST}=require('../app/api/on-tap/route.ts');
 const answers=emptyReviewAnswers();answers.mc[mc[0].id]={choice:mc[0].answer,checked:true};
 const body={hoTen:'Kiểm Tra Test',lop:'12TEST',version:REVIEW_VERSION,saveId:'test-save-0001',answers,diem:10};
 const call=async(b,origin='https://school.example')=>{const r=await POST(new Request('https://school.example/api/on-tap',{method:'POST',headers:{origin,'content-type':'application/json'},body:JSON.stringify(b)}));return {status:r.status,body:await r.json()};};
 try{assert.equal((await call(body,'https://foreign.example')).status,403);assert.equal((await call({...body,answers:emptyReviewAnswers()})).status,400);
 const good=await call(body);assert.equal(good.status,200);assert.equal(good.body.summary.objectiveScore,.09);assert.equal(rows.length,1);assert.equal(rows[0].diem,.09);assert.equal(rows[0].tongSoCau,108);assert.ok(rows[0].tenBai.includes('CHI_TIET_JSON:'));
 assert.equal((await call(body)).status,200);assert.equal(rows.length,1);
 const changed=JSON.parse(JSON.stringify(body));changed.answers.mc[mc[0].id].choice=(mc[0].answer+1)%4;assert.equal((await call(changed)).status,409);
 fail=true;assert.equal((await call({...body,saveId:'test-save-0002'})).status,502);fail=false;assert.equal((await call({...body,saveId:'test-save-0002'})).status,200);
 missing=true;assert.equal((await call({...body,saveId:'test-save-0003'})).status,502);
 }finally{global.fetch=originalFetch;}
});
