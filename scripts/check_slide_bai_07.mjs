import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const src='scripts/slide-bai-07/';
const ctx={};vm.createContext(ctx);
vm.runInContext(fs.readFileSync(src+'content.js','utf8')+'\n'+fs.readFileSync(src+'upgrade-content.js','utf8')+'\n'+fs.readFileSync(src+'review.js','utf8')+'\nthis.api={sections,teacherNotes,lessonMissions,assemblyPieces,readLessonHTML,checkLessonWork,quizQuestions,repairTasks};',ctx);
const a=ctx.api;assert.equal(a.sections.length,20);assert.equal(a.teacherNotes.length,20);assert.equal(a.quizQuestions.length,8);
const full='<!DOCTYPE html>\n<html lang="vi"><head><meta charset="utf-8"><title>Trang của em</title></head><body><h1>Lớp 12A</h1><p>Cùng học <em>HTML</em><br>thật vui.</p><p>Hẹn gặp lại!</p></body></html>';
assert.ok(a.checkLessonWork(full,'create').complete);
for(const [mission,t] of Object.entries(a.lessonMissions))assert.ok(!a.checkLessonWork(t.starter,mission).complete,mission+' starter must require work');
const justHeading=a.checkLessonWork('<h1>Trang lớp 12A</h1>');assert.ok(!justHeading.complete);assert.ok(!justHeading.checks.find(c=>c.key==='title').ok);assert.ok(!justHeading.checks.find(c=>c.key==='p').ok);
const examples=[
 ['crossing','<p>A <em>B</p></em>',true],['missing','<p>A',true],['void close','<p>A<br></br>B</p>',true],['quote','<p style="color:red>A</p>',true],['comment','<!-- missing',true],
 ['valid fragment','<p>A <em>B</em><br>C</p>',false],['comment markup','<!-- <p><em> -->\n<p>X</p>',false],['quoted greater','<p title="2 > 1">X</p>',false],['case','<P>X<BR>Y</P>',false],
 ['raw style','<style>p::before{content:"<x>"}</style><p>X</p>',false],['self close','<p/>',true]
];examples.forEach(([name,html,bad])=>assert.equal(a.readLessonHTML(html).issues.length>0,bad,name));
assert.ok(a.readLessonHTML('<html><!DOCTYPE html></html>').issues.length);assert.ok(a.readLessonHTML('<!DOCTYPE html><!DOCTYPE html>').issues.length);
assert.ok(!a.checkLessonWork(full.replace('<title>Trang của em</title>',''),'create').complete);
assert.ok(!a.checkLessonWork(full.replace('<head><meta charset="utf-8"><title>Trang của em</title></head>','<head><meta charset="utf-8"></head>').replace('<body>','<body><title>Wrong place</title>'),'create').checks.find(c=>c.key==='title').ok);
assert.ok(!a.checkLessonWork(full.replace('charset="utf-8"','charset="windows-1252"'),'create').checks.find(c=>c.key==='charset').ok);
assert.ok(!a.checkLessonWork(full.replace('<p>Hẹn gặp lại!</p>',''),'create').checks.find(c=>c.key==='p').ok);
assert.ok(!a.checkLessonWork(full.replace('<em>HTML</em>','HTML'),'create').checks.find(c=>c.key==='em').ok);
assert.ok(!a.checkLessonWork(full.replace('<br>',''),'create').checks.find(c=>c.key==='br').ok);
const commentOnly=full.replace('Trang của em','<!-- name -->').replace('Lớp 12A','<!-- greeting -->');assert.ok(!a.checkLessonWork(commentOnly).checks.find(c=>c.key==='h1').ok);
assert.ok(!a.checkLessonWork(full.replace('Lớp 12A','&nbsp;')).checks.find(c=>c.key==='h1').ok);
assert.ok(a.checkLessonWork(full.toUpperCase(),'create').complete);
assert.equal(a.readLessonHTML('<p>A</p><p>B <em>C</em></p>').nodes.find(n=>n.tag==='em').parent.tag,'p');
const practice=fs.readFileSync(src+'practice.js','utf8');vm.runInContext(practice.slice(practice.indexOf('function assessRepair'),practice.indexOf("$('#repair-task').onchange"))+'\nthis.assess=assessRepair;',ctx);
assert.ok(!ctx.assess(a.repairTasks[0].starter,0).ok);assert.ok(ctx.assess('<p>Cùng học <em>HTML</em></p>',0).ok);
assert.ok(!ctx.assess(a.repairTasks[1].starter,1).ok);assert.ok(ctx.assess(full,1).ok);
assert.ok(!ctx.assess(a.repairTasks[2].starter,2).ok);assert.ok(ctx.assess('<p>Dòng thứ nhất<br>Dòng thứ hai</p>',2).ok);assert.ok(!ctx.assess('<p><br>Dòng thứ nhất Dòng thứ hai</p>',2).ok);
assert.ok(a.checkLessonWork(a.assemblyPieces.map(p=>p.text).join('\n')).complete);
const html=fs.readFileSync('public/bai-07-trinh-chieu.html','utf8');assert.ok(!html.includes('Giao tiếp và ứng xử trong không gian mạng'));new vm.Script(html.match(/<script>([\s\S]*)<\/script>/)[1]);assert.ok(!/<(?:script|link)[^>]+(?:src|href)="https?:/i.test(html));
console.log('PASS: 20 slides, 20 teacher notes, 3 incomplete starters, 8 quiz questions, HTML checks, diagnostic lines, comments/raw text/attributes, 3 repair tasks, assembly and offline bundle.');
