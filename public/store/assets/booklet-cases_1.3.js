(()=>{
 const row=document.querySelector('#booklet-cases .case-row');
 const all=[...document.querySelectorAll('#booklet-cases .case-card')],cards=all,dialog=document.querySelector('.case-viewer');
 if(!cards.length||!dialog)return;
 const $=s=>dialog.querySelector(s),books=cards.map(c=>JSON.parse(c.dataset.book));
 const spread=$('.cv-spread'),left=$('.cv-left'),right=$('.cv-right'),leaf=$('.cv-leaf'),front=$('.cv-front'),back=$('.cv-back');
 const prev=$('.cv-prev'),next=$('.cv-next'),where=$('.cv-where'),thumbs=$('.cv-thumbs'),stage=$('.cv-book');
 const narrow=matchMedia('(max-width:699px)'),reduce=matchMedia('(prefers-reduced-motion:reduce)');
 let book=0,views=[],view=0,busy=false,opener=null,down=null;

 // 펼침면 목록: 표지는 오른쪽에 혼자, 내지는 두 쪽씩, 뒤표지는 왼쪽에 혼자.
 function build(b){
  const pages=[b.cover,...b.inner,...(b.back?[b.back]:[])];
  if(narrow.matches)return pages.map((p,i)=>({slots:[null,p],label:i===0?'표지':b.back&&i===pages.length-1?'뒤표지':`내지 ${i}`}));
  const list=[{slots:[null,b.cover],label:'표지'}];
  for(let i=0;i<b.inner.length;i+=2)list.push({slots:[b.inner[i],b.inner[i+1]||null],label:b.inner[i+1]?`내지 ${i+1}–${i+2}`:`내지 ${i+1}`});
  if(b.back)list.push({slots:[b.back,null],label:'뒤표지'});
  return list;
 }
 function fill(el,src){el.classList.toggle('is-empty',!src);const img=el.querySelector('img');if(src)img.src=src;else img.removeAttribute('src');}
 function solo(v){const [l,r]=views[v].slots;return l&&r?'':l?'left':'right';}
 function sync(){
  prev.disabled=view===0;next.disabled=view===views.length-1;
  where.textContent=`${views[view].label} · ${view+1} / ${views.length}`;
  thumbs.querySelectorAll('button').forEach((t,i)=>t.setAttribute('aria-current',String(i===view)));
  thumbs.children[view]?.scrollIntoView({block:'nearest',inline:'center'});
 }
 function show(v){
  view=v;const [l,r]=views[v].slots;fill(left,l);fill(right,r);
  const s=solo(v);if(s)spread.dataset.solo=s;else delete spread.dataset.solo;sync();
 }
 function go(to){
  if(busy||to<0||to>=views.length||to===view)return;
  const from=view,dir=to>from?'next':'prev';
  if(narrow.matches||reduce.matches||Math.abs(to-from)>1){
   show(to);if(narrow.matches&&!reduce.matches){right.style.setProperty('--from',dir==='next'?'16px':'-16px');right.classList.remove('is-swap');void right.offsetWidth;right.classList.add('is-swap');}
   return;
  }
  busy=true;const a=views[from].slots,b=views[to].slots;
  // 넘어가는 낱장의 앞면은 지금 쪽, 뒷면은 다음 펼침면의 맞은편 쪽.
  if(dir==='next'){fill(front,a[1]);fill(back,b[0]);fill(left,a[0]);fill(right,b[1]);}
  else{fill(front,a[0]);fill(back,b[1]);fill(left,b[0]);fill(right,a[1]);}
  leaf.dataset.dir=dir;leaf.hidden=false;view=to;
  const s=solo(to);if(s)spread.dataset.solo=s;else delete spread.dataset.solo;sync();
  leaf.animate([{transform:'rotateY(0deg)'},{transform:`rotateY(${dir==='next'?-180:180}deg)`}],{duration:720,easing:'cubic-bezier(.45,.05,.25,1)'}).finished.then(()=>{leaf.hidden=true;show(to);busy=false;});
 }
 function open(i,keep){
  book=(i+books.length)%books.length;const b=books[book];
  dialog.toggleAttribute('data-single',narrow.matches);views=build(b);
  $('#case-viewer-kind').textContent=b.kind;$('#case-viewer-title').textContent=b.title;
  for(const k of ['size','pages','year']){const dd=$(`[data-fact=${k}]`),v=b[k];dd.textContent=v?(k==='pages'?`${v}쪽`:v):'확인 중';dd.classList.toggle('is-empty',!v);}
  thumbs.replaceChildren(...views.map((v,n)=>{const li=document.createElement('li'),bt=document.createElement('button');bt.type='button';bt.setAttribute('aria-label',v.label);
   for(const src of v.slots.filter(Boolean)){const im=document.createElement('img');im.src=src;im.alt='';im.loading='lazy';bt.append(im);}
   bt.addEventListener('click',()=>go(n));li.append(bt);return li;}));
  [b.cover,...b.inner,b.back].filter(Boolean).forEach(src=>{const im=new Image();im.src=src;});
  leaf.hidden=true;busy=false;show(Math.min(keep||0,views.length-1));
  if(!dialog.open){dialog.showModal();document.documentElement.classList.add('cv-lock');}
  stage.focus({preventScroll:true});
 }
 all.forEach(c=>c.addEventListener('click',()=>{if(+c.dataset.case!==cur){to(+c.dataset.case);return;}opener=c;open(+c.dataset.case);}));
 $('.cv-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
 dialog.addEventListener('close',()=>{document.documentElement.classList.remove('cv-lock');to(book);opener=cards[book];opener?.focus({preventScroll:true});sync();});
 dialog.querySelectorAll('.cv-books button').forEach(bt=>bt.addEventListener('click',()=>{opener=cards[(book+ +bt.dataset.step+cards.length)%cards.length];open(book+ +bt.dataset.step);}));
 prev.addEventListener('click',()=>go(view-1));next.addEventListener('click',()=>go(view+1));
 dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();go(view+1);}else if(e.key==='ArrowLeft'){e.preventDefault();go(view-1);}});
 stage.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;down={x:e.clientX,y:e.clientY};});
 stage.addEventListener('pointerup',e=>{if(!down)return;const dx=e.clientX-down.x,dy=e.clientY-down.y;down=null;
  if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy))go(view+(dx<0?1:-1));
  else if(Math.abs(dx)<6&&Math.abs(dy)<6){const r=stage.getBoundingClientRect();go(view+(e.clientX>r.left+r.width/2?1:-1));}});
 stage.addEventListener('pointercancel',()=>{down=null;});

 // 표지 줄(1.3, 2026-11-03 주인공 카드): 가운데 표지가 크게 2.2초 머문 뒤(넘어가는 0.8초 포함 한 권 약 3초) 다음 자료집이 가운데로 넘어옴.
 // 양옆은 작고 흐리게, 아래 막대가 남은 시간. 마우스를 올리거나 포커스·내지 보기 중·화면 밖에서는 멈춤. 옆 표지를 누르면 가운데로.
 const shelf=document.querySelector('#booklet-cases'),lis=[...row.children],n=lis.length,bars=[...shelf.querySelectorAll('.case-prog i')],HOLD=2200;
 let cur=0,timer=null,hover=false,focus=false,visible=!('IntersectionObserver' in window);
 const running=()=>!reduce.matches&&!hover&&!focus&&visible&&!dialog.open&&!document.hidden;
 function lay(){const w=lis[0].offsetWidth;row.style.height=lis[0].offsetHeight+20+'px';
  lis.forEach((li,i)=>{let o=((i-cur)%n+n)%n;if(o>n/2)o-=n;const a=Math.abs(o);
   li.style.transform=`translateX(calc(-50% + ${o*w*.78}px)) scale(${o?.78:1})`;li.style.zIndex=10-a;li.style.opacity=a>2?0:a===2?.35:1;
   li.classList.toggle('is-c',!o);li.toggleAttribute('inert',a>2);li.querySelector('.case-card').tabIndex=a>1?-1:0;
   if(!o){const im=li.querySelector('.case-cover img');im.style.animation='none';void im.offsetWidth;im.style.animation='';}});
  bars.forEach((b,i)=>{b.classList.remove('on');if(i===cur){void b.offsetWidth;b.classList.add('on');}});shelf.classList.toggle('is-held',!running());}
 function arm(){clearTimeout(timer);timer=null;if(running()&&n>1)timer=setTimeout(()=>go(1),HOLD);}
 function go(d){cur=(cur+d+n)%n;lay();arm();}
 function to(i){if(i===cur)return;cur=i;lay();arm();}
 function sync(){shelf.classList.toggle('is-held',!running());if(!running()){clearTimeout(timer);timer=null;}else if(!timer)arm();}
 document.querySelectorAll('#booklet-cases .case-arrow').forEach(bt=>bt.addEventListener('click',()=>go(+bt.dataset.dir)));
 row.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){hover=true;sync();}});row.addEventListener('pointerleave',()=>{hover=false;sync();});
 // 키보드로 들어온 포커스만 멈춤(마우스로 누르거나 창을 닫고 돌아온 포커스는 계속 흐름)
 const kf=()=>{focus=!!shelf.querySelector(':focus-visible');sync();};shelf.addEventListener('focusin',()=>setTimeout(kf,0));shelf.addEventListener('focusout',()=>setTimeout(kf,0));
 cards.forEach((c,i)=>c.addEventListener('focus',()=>{if(i!==cur&&c.matches(':focus-visible'))to(i);}));
 let sx=null;row.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')sx=e.clientX;});
 row.addEventListener('pointerup',e=>{if(sx===null)return;const dx=e.clientX-sx;sx=null;if(Math.abs(dx)>40)go(dx<0?1:-1);});
 // 스크롤로 이 섹션에 들어올 때마다 곧바로 한 권 넘어감(들어오는 순간 움직임이 보이게)
 if(!visible)new IntersectionObserver(en=>{const was=visible;visible=en[0].isIntersecting;if(visible&&!was&&running()&&n>1){clearTimeout(timer);timer=setTimeout(()=>go(1),300);}else sync();},{threshold:.35}).observe(row);
 document.addEventListener('visibilitychange',sync);let lw=innerWidth;addEventListener('resize',()=>{if(innerWidth!==lw){lw=innerWidth;lay();}});lay();arm();
 // 화면 폭이 바뀌면 같은 쪽을 유지하며 한 쪽/두 쪽 보기를 다시 만든다.
 narrow.addEventListener('change',()=>{if(!dialog.open)return;const src=views[view].slots.find(Boolean);open(book);const n=views.findIndex(v=>v.slots.includes(src));if(n>0)show(n);});
})();
