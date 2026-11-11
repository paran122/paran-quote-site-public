(()=>{
 const row=document.querySelector('#booklet-cases .case-row');
 if(row)[...row.children].forEach(li=>{const c=li.cloneNode(true);c.setAttribute('aria-hidden','true');c.querySelector('button').tabIndex=-1;row.append(c);});
 const all=[...document.querySelectorAll('#booklet-cases .case-card')],cards=all.slice(0,all.length/2),dialog=document.querySelector('.case-viewer');
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
 all.forEach(c=>c.addEventListener('click',e=>{if(dragged){e.preventDefault();return;}opener=c.closest('[aria-hidden]')?cards[+c.dataset.case]:c;open(+c.dataset.case);}));
 $('.cv-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
 dialog.addEventListener('close',()=>{document.documentElement.classList.remove('cv-lock');opener?.focus({preventScroll:true});});
 dialog.querySelectorAll('.cv-books button').forEach(bt=>bt.addEventListener('click',()=>{opener=cards[(book+ +bt.dataset.step+cards.length)%cards.length];open(book+ +bt.dataset.step);}));
 prev.addEventListener('click',()=>go(view-1));next.addEventListener('click',()=>go(view+1));
 dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();go(view+1);}else if(e.key==='ArrowLeft'){e.preventDefault();go(view-1);}});
 stage.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;down={x:e.clientX,y:e.clientY};});
 stage.addEventListener('pointerup',e=>{if(!down)return;const dx=e.clientX-down.x,dy=e.clientY-down.y;down=null;
  if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy))go(view+(dx<0?1:-1));
  else if(Math.abs(dx)<6&&Math.abs(dy)<6){const r=stage.getBoundingClientRect();go(view+(e.clientX>r.left+r.width/2?1:-1));}});
 stage.addEventListener('pointercancel',()=>{down=null;});

 // 표지 줄: 천천히 왼쪽으로 흐르고, 마우스를 올리거나 포커스·드래그·창 열림 중에는 부드럽게 멈춘다.
 const strip=document.querySelector('#booklet-cases .case-marquee');
 let offset=0,last=0,vel=0,hover=false,focus=false,visible=false,drag=null,dragged=false,glide=null;
 const cruise=()=>innerWidth<700?22:30,ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
 const step=()=>{const li=row.children[0],next=row.children[1];return next?next.getBoundingClientRect().left-li.getBoundingClientRect().left:0;};
 function loop(t){const dt=last?Math.min(t-last,64):0;last=t;const half=row.children[row.children.length/2],set=half?half.getBoundingClientRect().left-row.children[0].getBoundingClientRect().left:0;
  if(glide){const k=Math.min(1,(t-glide.t)/glide.d);offset=glide.from+glide.by*ease(k);if(k>=1)glide=null;vel=0;}
  else if(!drag){const run=!reduce.matches&&!hover&&!focus&&visible&&!dialog.open&&!document.hidden;
   vel+=((run?cruise():0)-vel)*Math.min(1,dt/450);offset-=vel*dt/1000;}
  // 복제본이 이어 붙어 있으므로 위치를 항상 (-한 벌, 0] 안으로 돌린다. 이동 중이면 출발점도 같이 옮긴다.
  if(set){const shift=((offset%set)-set)%set-offset;if(shift){offset+=shift;if(glide)glide.from+=shift;if(drag)drag.o+=shift;}}
  row.style.transform=`translate3d(${offset}px,0,0)`;requestAnimationFrame(loop);}
 // 좌우 버튼: 표지 한 권만큼 미끄러지듯 이동한 뒤 다시 흐른다.
 function push(dir){const from=glide?glide.from+glide.by:offset;glide={from:offset,by:(from-offset)-dir*step(),t:performance.now(),d:reduce.matches?1:650};}
 document.querySelectorAll('#booklet-cases .case-arrow').forEach(bt=>bt.addEventListener('click',()=>push(+bt.dataset.dir)));
 if(strip){
  strip.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')hover=true;});strip.addEventListener('pointerleave',()=>{hover=false;});
  strip.addEventListener('focusin',()=>{focus=true;});strip.addEventListener('focusout',()=>setTimeout(()=>{focus=strip.contains(document.activeElement);},0));
  strip.addEventListener('pointerdown',e=>{if(e.button!==0)return;glide=null;drag={x:e.clientX,o:offset,id:e.pointerId};dragged=false;});
  strip.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x;if(!dragged&&Math.abs(dx)>6){dragged=true;strip.setPointerCapture(drag.id);strip.classList.add('is-dragging');}if(dragged)offset=drag.o+dx;});
  const end=()=>{drag=null;vel=0;strip.classList.remove('is-dragging');setTimeout(()=>{dragged=false;},0);};
  strip.addEventListener('pointerup',end);strip.addEventListener('pointercancel',end);
  // 키보드로 원본 카드에 들어오면 그 카드가 보이도록 이동
  cards.forEach(c=>c.addEventListener('focus',()=>{const r=strip.getBoundingClientRect(),b=c.getBoundingClientRect();if(b.left<r.left||b.right>r.right)offset-=b.left-r.left-24;}));
  new IntersectionObserver(en=>{visible=en[0].isIntersecting;},{threshold:.2}).observe(strip);requestAnimationFrame(loop);}
 // 화면 폭이 바뀌면 같은 쪽을 유지하며 한 쪽/두 쪽 보기를 다시 만든다.
 narrow.addEventListener('change',()=>{if(!dialog.open)return;const src=views[view].slots.find(Boolean);open(book);const n=views.findIndex(v=>v.slots.includes(src));if(n>0)show(n);});
})();
