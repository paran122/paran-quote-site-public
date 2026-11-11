(()=>{
 const root=document.querySelector('#booklet-gallery'),stage=root.querySelector('.mock-stage'),slides=[...root.querySelectorAll('.mock-slide')],pause=root.querySelector('.mock-pause'),reduce=matchMedia('(prefers-reduced-motion: reduce)');
 let index=0,timer,paused=reduce.matches,visible=false,down=null,keyboardFocus=false;
 const stop=()=>clearTimeout(timer);
 function schedule(){stop();if(!paused&&visible&&!document.hidden&&!keyboardFocus&&!down)timer=setTimeout(()=>move(1,false),4500);}
 function move(delta,manual=true){index=(index+delta+slides.length)%slides.length;slides.forEach((s,i)=>{s.toggleAttribute('data-current',i===index);s.setAttribute('aria-hidden',String(i!==index));});root.querySelectorAll('.mock-caption').forEach((c,i)=>{c.hidden=i!==index;});root.dataset.index=String(index);if(manual)root.querySelector('.mock-status').textContent=`목업 ${index+1} / ${slides.length}`;schedule();}
 function updatePause(){pause.textContent=paused?'자동 재생':'일시정지';pause.setAttribute('aria-label',paused?'자동 넘김 시작':'자동 넘김 일시정지');schedule();}
 pause.addEventListener('click',()=>{paused=!paused;updatePause();});
 root.querySelector('.mock-prev').addEventListener('click',()=>move(-1));root.querySelector('.mock-next').addEventListener('click',()=>move(1));
 stage.addEventListener('keydown',e=>{keyboardFocus=true;stop();if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();move(e.key==='ArrowLeft'?-1:1);}});
 stage.addEventListener('focusin',e=>{keyboardFocus=e.target.matches(':focus-visible');schedule();});stage.addEventListener('focusout',()=>setTimeout(()=>{keyboardFocus=stage.contains(document.activeElement);schedule();},0));
 stage.addEventListener('pointerdown',e=>{keyboardFocus=false;if(e.target.closest('button')||e.button!==0){schedule();return;}down={x:e.clientX,y:e.clientY};stop();stage.setPointerCapture(e.pointerId);});
 stage.addEventListener('pointerup',e=>{if(!down)return;const dx=e.clientX-down.x,dy=e.clientY-down.y;down=null;if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy))move(dx<0?1:-1);else schedule();});
 stage.addEventListener('pointercancel',()=>{down=null;schedule();});stage.addEventListener('lostpointercapture',()=>{down=null;schedule();});
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();},{threshold:.35}).observe(stage);document.addEventListener('visibilitychange',schedule);reduce.addEventListener('change',()=>{paused=reduce.matches;updatePause();});updatePause();move(0,false);
})();
