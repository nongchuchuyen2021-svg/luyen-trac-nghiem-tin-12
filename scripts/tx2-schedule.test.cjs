const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),ts=require('typescript');
const root=path.resolve(__dirname,'..'),resolve=Module._resolveFilename;
Module._resolveFilename=function(name,...args){return resolve.call(this,name.startsWith('@/')?path.join(root,name.slice(2)):name,...args)};
require.extensions['.ts']=(mod,file)=>mod._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true}}).outputText,file);
const {tx2Access,tx2DailyWindow,tx2Deadline,tx2CanSubmit}=require('../lib/tx2-schedule.ts');
const at=time=>Date.parse('2026-10-19T'+time+'+07:00');
test('daily Vietnam window includes exactly 07:10 through before 10:30, including weekends',()=>{
 for(const [time,open]of [['00:00:00',false],['07:09:59.999',false],['07:10:00',true],['10:29:59.999',true],['10:30:00',false],['23:59:59',false]])assert.equal(tx2Access(at(time)).open,open,time);
 assert.equal(tx2DailyWindow(at('00:00:00')).opensAt,at('07:10:00'));
 assert.equal(tx2DailyWindow(at('23:59:59')).closesAt,at('10:30:00'));
 assert.equal(tx2Access(Date.parse('2026-10-18T08:00:00+07:00')).open,true);
});
test('16-minute deadline is truncated at closing; transfer grace never opens new starts',()=>{
 assert.equal(tx2Deadline(at('08:00:00')),at('08:16:00'));
 assert.equal(tx2Deadline(at('10:25:00')),at('10:30:00'));
 assert.equal(tx2Deadline(at('07:09:59')),null);assert.equal(tx2Deadline(at('10:30:00')),null);
 assert.equal(tx2CanSubmit(at('10:30:00')),true);assert.equal(tx2CanSubmit(at('10:31:29.999')),true);assert.equal(tx2CanSubmit(at('10:31:30')),false);assert.equal(tx2CanSubmit(at('07:09:59')),false);
});
test('start API uses server time; late entry shortens time and invalid origins or identity fail',async()=>{
 const savedNow=Date.now;let now=at('06:00:00');Date.now=()=>now;
 const {GET,POST}=require('../app/api/tx2/access/route.ts');
 const call=async(body={hoTen:'Học Sinh Test',lop:'12A1'},origin='https://school.example')=>{const r=await POST(new Request('https://school.example/api/tx2/access',{method:'POST',headers:{origin},body:JSON.stringify(body)}));return {status:r.status,data:await r.json()}};
 try{const status=await GET();assert.match(status.headers.get('Cache-Control'),/no-store/);assert.equal((await status.json()).open,false);assert.equal((await call()).status,403);
 now=at('07:10:00');const good=await call();assert.equal(good.status,200);assert.equal(good.data.deadline,at('07:26:00'));assert.equal(good.data.serverNow,now);assert.equal((await call(null)).status,400);assert.equal((await call({hoTen:'A',lop:'1'})).status,400);assert.equal((await call(undefined,'https://foreign.invalid')).status,403);
 now=at('10:29:00');assert.equal((await call()).data.deadline,at('10:30:00'));now=at('10:30:00');assert.equal((await call()).status,403);
 }finally{Date.now=savedNow;}
});
test('submission API blocks TX2 before opening and after grace without blocking ordinary practice',async()=>{
 const savedNow=Date.now,savedFetch=global.fetch;let now=at('06:00:00'),writes=0;Date.now=()=>now;
 global.fetch=async()=>{writes++;return Response.json({ok:true})};
 const {POST}=require('../app/api/nop-bai/route.ts');
 const body={hoTen:'Kiểm Tra Lịch',lop:'12A1',baiId:'kiem-tra-tx2-12',tenBai:'Kiểm tra thường xuyên 2',dang:'Thường xuyên',diem:10,soCauDung:15,tongSoCau:15};
 const call=async(b=body)=>POST(new Request('https://school.example/api/nop-bai',{method:'POST',headers:{origin:'https://school.example'},body:JSON.stringify(b)}));
 try{assert.equal((await call()).status,403);assert.equal(writes,0);now=at('08:00:00');assert.equal((await call()).status,200);assert.equal(writes,1);now=at('10:30:01');assert.equal((await call()).status,200);now=at('10:31:30');assert.equal((await call()).status,403);assert.equal(writes,2);now=at('22:00:00');assert.equal((await call({...body,baiId:'bai-01',dang:'Trắc nghiệm',diem:100})).status,200);assert.equal(writes,3);}finally{Date.now=savedNow;global.fetch=savedFetch;}
});
