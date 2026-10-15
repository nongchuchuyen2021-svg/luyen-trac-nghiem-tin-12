// All editable examples stay inside an opaque, script-free preview frame.
function preview(id,html){
  const policy="default-src 'none'; script-src 'none'; style-src 'unsafe-inline'; img-src data:; font-src 'none'; connect-src 'none'; form-action 'none'; base-uri 'none'";
  $(id).srcdoc=`<!DOCTYPE html><html lang="vi"><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${policy}"><style>html{color-scheme:light}body{font-family:system-ui,sans-serif;color:#18384b;background:#fff;margin:20px;font-size:21px;line-height:1.5;overflow-wrap:anywhere}h1{font-size:34px;line-height:1.25}h2{font-size:30px}h3{font-size:26px}h4{font-size:23px}h5{font-size:21px}h6{font-size:19px}p{font-size:21px}hr{margin:18px 0}</style></head><body>${html}</body></html>`;
}
function selected(selector,b){$$(selector).forEach(x=>x.setAttribute('aria-pressed',String(x===b)));}
function paint(selector,text){const el=$(selector);el.textContent=text;el.classList.remove('pop');void el.offsetWidth;el.classList.add('pop');}

let pipeTimers=[];
function resetPipe(){pipeTimers.forEach(clearTimeout);pipeTimers=[];$$('[data-pipe]').forEach(x=>x.classList.remove('lit'));$('#pipe-run').disabled=false;$('#pipe-run').textContent='▶ Quan sát từng bước';}
function onSlideLeave(previous,next){if(previous===1&&next!==1)resetPipe();}
$('#pipe-run').onclick=()=>{
  resetPipe();$('#pipe-run').disabled=true;
  const steps=['📄 Tệp nguồn chứa nội dung và các thẻ đánh dấu HTML.','🌐 Trình duyệt đọc mã và xác định cấu trúc, ý nghĩa các phần tử.','🖥️ Trình duyệt hiển thị tiêu đề và đoạn văn — không in nguyên các thẻ đánh dấu.'];
  for(let i=0;i<3;i++)pipeTimers.push(setTimeout(()=>{
    $$('[data-pipe]').forEach((x,j)=>x.classList.toggle('lit',j<=i));
    const output=$('#pipe-output');output.replaceChildren();
    if(i===2){const title=document.createElement('h3'),p=document.createElement('p');title.textContent='Lớp 12 thân mến!';p.textContent='Hôm nay chúng mình học HTML.';output.append(title,p);$('#pipe-run').disabled=false;$('#pipe-run').textContent='↺ Quan sát lại';}
    else output.textContent=steps[i];
    sound();
  },motion?i*650:0));
};
const parts=['Thẻ bắt đầu <p>: cho biết một đoạn văn bản bắt đầu ở đây.','Nội dung: phần chữ Xin chào lớp 12! mà người xem đọc được.','Thẻ kết thúc </p>: dấu / đánh dấu vị trí kết thúc phần tử p.'];
$$('[data-part]').forEach(b=>b.onclick=()=>{selected('[data-part]',b);paint('#part-info',parts[Number(b.dataset.part)]);sound();});

function classifier(prefix,items,selector,explain){
  let index=0,score=0,answered=false;
  const choices=$$(selector),progress=$(`#${prefix}-progress`),question=$(`#${prefix}-question`),feedback=$(`#${prefix}-feedback`),next=$(`#${prefix}-next`);
  function render(){
    answered=false;feedback.textContent='';feedback.classList.remove('good');
    const ended=index===items.length;
    progress.textContent=ended?`Hoàn thành · Đúng ${score}/${items.length}`:`Mục ${index+1}/${items.length} · Đúng ${score}`;
    question.textContent=ended?'Hoàn thành lượt phân loại!':items[index][0];
    choices.forEach(b=>b.disabled=ended);next.hidden=ended;next.disabled=true;
    next.textContent=index===items.length-1?'Xem kết quả':'Mục tiếp →';
    if(ended)feedback.textContent='Hãy chọn một ví dụ và giải thích vì sao em xếp vào nhóm đó.';
  }
  choices.forEach(b=>b.onclick=()=>{
    if(answered||index>=items.length)return;answered=true;
    const value=prefix==='tag'?b.dataset.tagKind:b.dataset.toolKind;
    const correct=value===items[index][1];if(correct)score++;
    choices.forEach(x=>x.disabled=true);feedback.textContent=(correct?'✓ Chính xác. ':'↪ Chưa đúng. ')+explain(items[index]);feedback.classList.toggle('good',correct);next.disabled=false;progress.textContent=`Mục ${index+1}/${items.length} · Đúng ${score}`;sound(correct?'good':'bad');
  });
  next.onclick=()=>{index++;render();};$(`#${prefix}-reset`).onclick=()=>{index=0;score=0;render();sound();};render();
}
classifier('tag',[['<p>','pair'],['<hr>','void'],['<title>','pair'],['<br>','void'],['<meta>','void'],['<em>','pair']],'[data-tag-kind]',item=>item[1]==='pair'?`${item[0]} thuộc nhóm thẻ đôi; trong các ví dụ của bài, viết kèm thẻ kết thúc tương ứng.`:`${item[0]} thuộc nhóm thẻ đơn, không có thẻ kết thúc tương ứng.`);
classifier('tool',[['Notepad','editor'],['Chrome','browser'],['Notepad++','editor'],['Firefox','browser'],['Sublime Text','editor'],['Microsoft Edge','browser']],'[data-tool-kind]',item=>`${item[0]} là ${item[1]==='editor'?'công cụ soạn thảo mã nguồn':'trình duyệt để xem trang web'}.`);

function setColor(value){$('#attr-color').textContent=value;preview('#attr-preview',`<p style="color:${value}">Xin chào lớp 12!</p>`);}
$$('[data-color]').forEach(b=>b.onclick=()=>{selected('[data-color]',b);setColor(b.dataset.color);paint('#attr-note',`Đã đổi giá trị của style thành color: ${b.dataset.color}. Nội dung “Xin chào lớp 12!” vẫn giữ nguyên.`);sound();});setColor('red');
const spaces=[
 ['<p>Xin       chào\nlớp 12!</p>','Nhiều dấu cách và Enter trong mã được gộp thành khoảng trắng khi hiển thị đoạn p thông thường này.'],
 ['<p>Xin chào<br>lớp 12!</p>','br tạo ngắt dòng ngay trong cùng một đoạn p.'],
 ['<p>Xin chào</p>\n<p>Lớp 12!</p>','Hai phần tử p tạo thành hai đoạn văn bản riêng.'],
];
function setSpace(i){$('#space-code').textContent=spaces[i][0];preview('#space-preview',spaces[i][0]);paint('#space-note',spaces[i][1]);}
$$('[data-space]').forEach(b=>b.onclick=()=>{selected('[data-space]',b);setSpace(Number(b.dataset.space));sound();});setSpace(0);
const structures={doctype:'DOCTYPE là khai báo kiểu tài liệu. Nó không phải phần tử và không phải gốc của cây HTML.',html:'Cặp thẻ html bao toàn bộ các phần tử của tài liệu. Đây là phần tử gốc.',head:'head chứa thông tin chung. meta khai báo mã hóa; title cung cấp tên trang trên tab.',body:'body chứa nội dung trang, ví dụ tiêu đề h1 và đoạn văn p.'};
$$('[data-structure]').forEach(b=>b.onclick=()=>{const region=b.dataset.structure;selected('[data-structure]',b);$$('[data-region]').forEach(line=>line.classList.toggle('highlight',line.dataset.region===region));paint('#structure-note',structures[region]);sound();});
function setTitles(){const t=$('#tab-title').value,h=$('#page-heading').value;$('#fake-tab').textContent=t||'(Tên tab đang để trống)';$('#fake-heading').textContent=h||'(Tiêu đề trang đang để trống)';$('#title-code').textContent=`<title>${esc(t)}</title>\n<h1>${esc(h)}</h1>`;}
$('#tab-title').oninput=setTitles;$('#page-heading').oninput=setTitles;setTitles();
const tree={html:{parent:null,children:['head','body']},head:{parent:'html',children:['meta','title']},body:{parent:'html',children:['h1','p']},meta:{parent:'head',children:[]},title:{parent:'head',children:[]},h1:{parent:'body',children:[]},p:{parent:'body',children:['em']},em:{parent:'p',children:[]}};
$$('[data-node]').forEach(b=>b.onclick=()=>{const id=b.dataset.node,node=tree[id];$$('[data-node]').forEach(x=>{x.classList.toggle('selected',x===b);x.classList.toggle('parent',x.dataset.node===node.parent);x.classList.toggle('child',node.children.includes(x.dataset.node));x.setAttribute('aria-pressed',String(x===b));});paint('#tree-note',`${id}: ${node.parent?'cha trực tiếp là '+node.parent:'là phần tử gốc, không có phần tử cha trong cây này'}. ${node.children.length?'Các phần tử con trực tiếp: '+node.children.join(', ')+'.':'Không có phần tử con trong ví dụ này.'}`);sound();});
function setNest(i){$('#nesting-code').textContent=i?'<p>Nhóm <em>bạn bè</em></p>':'<p>Nhóm <em>bạn bè</p></em>';$('#nesting-note').textContent=i?'✓ Thứ tự đúng: mở p → mở em → đóng em → đóng p.':'↪ em được mở sau nhưng chưa đóng thì p đã đóng. Hãy sửa thứ tự đóng thẻ.';$('#nesting-note').classList.toggle('good',i===1);}
$$('[data-nest]').forEach(b=>b.onclick=()=>{selected('[data-nest]',b);setNest(Number(b.dataset.nest));sound();});setNest(0);
function setHeading(n){const value=`<h${n}>Câu lạc bộ Tin học</h${n}>\n<p>Chúng mình cùng học HTML.</p>`;$('#heading-code').textContent=value;preview('#heading-preview',value);}
$$('[data-heading]').forEach(b=>b.onclick=()=>{selected('[data-heading]',b);setHeading(Number(b.dataset.heading));sound();});setHeading(1);
let commentOn=true;
function setComment(){const value='<h1>Xin chào!</h1>\n'+(commentOn?'<!-- Đây là lời chào của lớp 12 -->\n':'')+'<p>Chúng mình cùng học HTML.</p>';$('#comment-code').textContent=value;preview('#comment-preview',value);$('#comment-toggle').setAttribute('aria-pressed',String(commentOn));$('#comment-toggle').textContent=commentOn?'Ẩn chú thích khỏi mã':'Thêm lại chú thích vào mã';}
$('#comment-toggle').onclick=()=>{commentOn=!commentOn;setComment();sound();};setComment();

const templates={basic,tags:'<h1>Hai dòng trong một đoạn</h1>\n<p>Dòng thứ nhất<br>Dòng thứ hai</p>\n<hr>\n<p>Đây là đoạn văn mới.</p>',nesting:'<h1>Trang của nhóm em</h1>\n<p>Trang này do <em>nhóm bạn bè</em> cùng tạo.</p>\n<p>Chúng mình cùng học HTML.</p>'};
let downloadUrl;
function runCode(){const value=$('#code-editor').value;if(value.length>30000){$('#editor-status').textContent='Đoạn mã quá dài cho ví dụ này. Em rút gọn dưới 30.000 kí tự nhé.';return;}preview('#editor-preview',value);$('#editor-status').textContent='Đã chạy mã. Đối chiếu phần em vừa sửa với kết quả bên cạnh.';}
function loadTemplate(){const key=$('#template').value;$('#code-editor').value=templates[key];runCode();}
$('#template').onchange=()=>{loadTemplate();sound();};$('#restore-code').onclick=()=>{loadTemplate();sound();};$('#run-code').onclick=()=>{runCode();sound();};
$('#code-editor').addEventListener('input',()=>$('#editor-status').textContent='Mã đã thay đổi. Bấm “Chạy mã” để cập nhật kết quả.');
$('#code-editor').addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();runCode();sound();}});
$('#download-code').onclick=()=>{if(downloadUrl)URL.revokeObjectURL(downloadUrl);downloadUrl=URL.createObjectURL(new Blob(['\uFEFF',$('#code-editor').value],{type:'text/html;charset=utf-8'}));const link=document.createElement('a');link.href=downloadUrl;link.download='index.html';document.body.append(link);link.click();link.remove();$('#editor-status').textContent='Đã tạo tệp index.html. Mở tệp đã lưu bằng trình duyệt để kiểm tra.';};
window.addEventListener('pagehide',()=>{if(downloadUrl)URL.revokeObjectURL(downloadUrl);resetPipe();});loadTemplate();
$('#back-editor').onclick=()=>showSlide(13);
$$('.check').forEach(b=>b.onclick=()=>{const on=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',String(on));$('.check-icon',b).textContent=on?'✓':'○';const count=$$('.check[aria-pressed="true"]').length;$('#badge').textContent=count===3?'🏅':'🌱';$('#check-status').textContent=count===3?'3 / 3 · Sẵn sàng tạo trang web đầu tiên!':`${count} / 3 việc đã tự kiểm tra`;$('#celebrate').disabled=count!==3;sound();});
$('#celebrate').onclick=()=>{sound('good');confetti();notify('🏅 Hoàn thành Bài 7! Hãy tạo một trang giới thiệu của riêng em.');};
showSlide(0,false);
