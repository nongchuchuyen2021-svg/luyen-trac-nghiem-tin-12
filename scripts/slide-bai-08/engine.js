let current = 0;
let audioEnabled = false;
let audioContext;
let motion = !matchMedia('(prefers-reduced-motion: reduce)').matches;
let liveTimer;
let toastTimer;
const reveals = sections.map(()=>0);
$('#deck').innerHTML = sections.map((s,i)=>`<section class="slide" id="slide-${i+1}" ${i?'hidden':''} aria-labelledby="title-${i+1}"><div class="slide-head"><div class="heading"><p class="eyebrow">${s.tag}</p><h${i?2:1} id="title-${i+1}" tabindex="-1">${s.title}</h${i?2:1}><p class="lead">${s.lead}</p></div><div class="reveal-tools"><span class="count"></span><button class="action reveal-one">+ Hiện ý</button><button class="action reveal-all">Hiện hết</button></div></div><div class="body">${s.html}</div></section>`).join('');
$('#toc-grid').innerHTML = sections.map((s,i)=>`<button class="action" data-goto="${i}">${String(i+1).padStart(2,'0')} · ${s.title}</button>`).join('');

function sound(kind='click') {
  if (!audioEnabled) return;
  try {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return;
    audioContext ||= new Audio();
    if(audioContext.state==='suspended') audioContext.resume().catch(()=>{});
    const now=audioContext.currentTime;
    (kind==='good'?[523,659,784]:kind==='bad'?[240]:[560]).forEach((f,i)=>{
      const o=audioContext.createOscillator(),g=audioContext.createGain();
      o.type='sine';o.frequency.value=f;o.connect(g);g.connect(audioContext.destination);
      g.gain.setValueAtTime(.045,now+i*.075);g.gain.exponentialRampToValueAtTime(.001,now+i*.075+.13);
      o.start(now+i*.075);o.stop(now+i*.075+.14);
    });
  } catch { /* Audio is optional: interactions remain available. */ }
}
function notify(message) {
  $('#toast').textContent=message;$('#toast').hidden=false;clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>$('#toast').hidden=true,3500);
}
function syncReveal() {
  const slide=$(`#slide-${current+1}`),items=$$('.reveal',slide),count=reveals[current];
  items.forEach((el,i)=>{const shown=i<count;el.classList.toggle('shown',shown);el.inert=!shown;el.setAttribute('aria-hidden',String(!shown));});
  $('.reveal-tools',slide).hidden=!items.length;
  $('.count',slide).textContent=`${count} / ${items.length}`;
  $('.reveal-one',slide).disabled=count===items.length;
  $('.reveal-all',slide).disabled=count===items.length;
  $('#next-idea').textContent=count<items.length?'Hiện ý tiếp ↓':current===sections.length-1?'Về đầu bài ↺':'Trang tiếp →';
  $('#all-ideas').hidden=!items.length;$('#all-ideas').disabled=count===items.length;
  $('#reveal-counter').textContent=items.length?`Ý ${count}/${items.length}`:'';
}
function reveal(all=false) {
  const length=$$('.reveal',$(`#slide-${current+1}`)).length;
  if(reveals[current]>=length)return false;
  reveals[current]=all?length:reveals[current]+1;syncReveal();sound();return true;
}
function showSlide(index,focus=true) {
  if(index<0||index>=sections.length)return;
  if(typeof onSlideLeave === "function")onSlideLeave(current,index);
  current=index;
  $$('.slide').forEach((s,i)=>{s.hidden=i!==index;s.classList.toggle('active',i===index);});
  $('#stage').scrollTop=0;$('#counter').textContent=`${String(index+1).padStart(2,'0')} / ${sections.length}`;
  $('#progress').style.width=`${(index+1)/sections.length*100}%`;
  $('#prev').disabled=index===0;$('#next').disabled=index===sections.length-1;
  $$('[data-goto]').forEach((b,i)=>b.setAttribute('aria-current',i===index?'step':'false'));
  syncReveal();if(focus)$(`#title-${index+1}`).focus({preventScroll:true});
}
function nextIdea(){if(!reveal()){sound();showSlide(current===sections.length-1?0:current+1);}}
$('#prev').onclick=()=>{sound();showSlide(current-1);};$('#next').onclick=()=>{sound();showSlide(current+1);};$('#next-idea').onclick=nextIdea;
$('#all-ideas').onclick=()=>reveal(true);
$$('.reveal-one').forEach(b=>b.onclick=()=>reveal());$$('.reveal-all').forEach(b=>b.onclick=()=>reveal(true));
$('#contents').onclick=()=>$('#toc').showModal();$('#close-toc').onclick=()=>$('#toc').close();
$$('[data-goto]').forEach(b=>b.onclick=()=>{$('#toc').close();showSlide(Number(b.dataset.goto));sound();});
$('#sound').onclick=()=>{audioEnabled=!audioEnabled;$('#sound').setAttribute('aria-pressed',String(audioEnabled));$('#sound').textContent=audioEnabled?'🔊 Âm thanh: Bật':'🔇 Âm thanh: Tắt';sound();};
function syncMotion(){document.body.classList.toggle('motion-off',!motion);$('#motion').setAttribute('aria-pressed',String(motion));$('#motion').textContent=motion?'✨ Hiệu ứng: Bật':'✨ Hiệu ứng: Tắt';}
$('#motion').onclick=()=>{motion=!motion;syncMotion();};syncMotion();
async function fullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();else notify('Trình duyệt này chưa hỗ trợ toàn màn hình. Hãy mở slide ở tab riêng.');}catch{notify('Hãy mở slide ở tab riêng để dùng chế độ toàn màn hình.');}}
$('#fullscreen').onclick=fullscreen;
document.addEventListener('keydown',e=>{
  if($('#toc').open||e.altKey||e.ctrlKey||e.metaKey||e.target.closest('input,textarea,select,[contenteditable="true"]'))return;
  if(e.code==='Space'&&e.target.closest('button,a'))return;
  const key=e.key.toLowerCase();
  if(['arrowright','pagedown'].includes(key)){e.preventDefault();nextIdea();}
  else if(key===' '){e.preventDefault();nextIdea();}
  else if(['arrowleft','pageup'].includes(key)){e.preventDefault();showSlide(current-1);}
  else if(key==='arrowdown'){e.preventDefault();reveal();}
  else if(key==='arrowup'){e.preventDefault();reveals[current]=Math.max(0,reveals[current]-1);syncReveal();}
  else if(key==='home'){e.preventDefault();showSlide(0);}
  else if(key==='end'){e.preventDefault();showSlide(sections.length-1);}
  else if(key==='f'){e.preventDefault();fullscreen();}
  else if(key==='m'){e.preventDefault();$('#sound').click();}
});


let quizIndex=0;const quizAnswers=quizQuestions.map(()=>null);
function renderQuiz(){
  const score=quizAnswers.filter((a,i)=>a===quizQuestions[i][2]).length,done=quizAnswers.filter(a=>a!==null).length;
  if(quizIndex===quizQuestions.length){$('#quiz').innerHTML=`<div class="card quiz-end"><div class="score-big">${score} / ${quizQuestions.length}</div><h3>Điểm của lượt chơi</h3><p>${score===quizQuestions.length?'Em đã vận dụng tốt. Hãy nêu một ví dụ ngoài đời!':'Xem lại lời giải, rồi thử một lượt mới nhé.'}</p><button class="action primary" id="quiz-reset">↺ Làm lại toàn bộ</button></div>`;$('#quiz-reset').onclick=resetQuiz;return;}
  const [q,options,correct,explain]=quizQuestions[quizIndex],picked=quizAnswers[quizIndex],answered=picked!==null;
  $('#quiz').innerHTML=`<div class="quiz-meta"><span>Câu ${quizIndex+1} / ${quizQuestions.length}</span><span>Đã làm ${done} · Đúng ${score}</span><button class="action" id="quiz-reset">↺ Làm lại</button></div><div class="card"><h3 class="quiz-question">${esc(q)}</h3><div class="quiz-options">${options.map((o,i)=>`<button class="choice ${answered?(i===correct?'correct':i===picked?'wrong':''):''}" data-quiz="${i}" ${answered?'disabled':''}><span class="letter">${answered&&i===correct?'✓':'ABCD'[i]}</span><span>${esc(o)}</span></button>`).join('')}</div><div class="feedback ${picked===correct?'good':''}">${answered?(picked===correct?'✓ Chính xác. ':'↪ Chưa đúng. ')+esc(explain):''}</div><div class="quiz-actions"><button class="action" id="quiz-prev" ${quizIndex===0?'disabled':''}>← Câu trước</button><button class="action primary" id="quiz-next" ${answered?'':'disabled'}>${quizIndex===quizQuestions.length-1?'Xem tổng điểm':'Câu tiếp →'}</button></div></div>`;
  $('#quiz-reset').onclick=resetQuiz;$('#quiz-prev').onclick=()=>{quizIndex--;renderQuiz();};$('#quiz-next').onclick=()=>{quizIndex++;renderQuiz();if(quizIndex===quizQuestions.length){sound('good');if(score===quizQuestions.length)confetti();}};
  $$('[data-quiz]').forEach(b=>b.onclick=()=>{if(quizAnswers[quizIndex]!==null)return;quizAnswers[quizIndex]=Number(b.dataset.quiz);sound(quizAnswers[quizIndex]===correct?'good':'bad');renderQuiz();$('#quiz-next').focus({preventScroll:true});});
}
function resetQuiz(){quizAnswers.fill(null);quizIndex=0;renderQuiz();sound();}renderQuiz();


let celebrationTimer;
function confetti(){if(!motion||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const layer=$('#confetti');clearTimeout(celebrationTimer);layer.replaceChildren();const colors=['#65e8e0','#ffcf77','#ffa7c4','#91e8b7'];for(let i=0;i<65;i++){const p=document.createElement('i');p.style.left=`${Math.random()*100}%`;p.style.animationDelay=`${Math.random()*.45}s`;p.style.background=colors[i%4];layer.append(p);}celebrationTimer=setTimeout(()=>layer.replaceChildren(),2500);}
