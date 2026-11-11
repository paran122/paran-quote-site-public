/* 서비스 상세 공통(책자 외): 첫 화면 레이어 정지, 작업 사례 주인공 카드와 크게 보기 */
(()=>{
 // 첫 화면 레이어: 화면 밖·숨김 탭에서는 멈추고, 스페이스 키로 정지·재생
 const layer=document.querySelector('.sv-layer,.sv-scene');
 if(layer){
  let held=false,seen=true;
  const sync=()=>layer.classList.toggle('is-paused',held||!seen||document.hidden);
  if('IntersectionObserver' in window)new IntersectionObserver(([e])=>{seen=e.isIntersecting;sync()}).observe(layer);
  document.addEventListener('visibilitychange',sync);
  layer.addEventListener('keydown',e=>{if(e.key===' '){e.preventDefault();held=!held;sync()}});
  // 포토월 장면: 한 바퀴 돌 때마다 다음 행사 사진으로
  const wall=layer.querySelector('[data-cycle]');
  if(wall&&layer.dataset.set!=null){const n=wall.children.length;wall.addEventListener('animationiteration',e=>{if(e.target===wall)layer.dataset.set=(+layer.dataset.set+1)%n})}
  // 홍보부스 운영: CSS가 올리는 --visits를 천 단위 쉼표로 표시
  const counts=[...layer.querySelectorAll('[data-count]')];
  if(counts.length){const fmt=new Intl.NumberFormat('ko-KR');const tick=()=>{for(const c of counts){if(!c.offsetParent)continue;const v=parseInt(getComputedStyle(c).getPropertyValue('--visits'),10);if(!isNaN(v)){const t=fmt.format(v);if(c.textContent!==t)c.textContent=t}}if(on)requestAnimationFrame(tick);else loop=false};/* 2026-11-09 화면에 보일 때만 매 프레임 갱신 */let on=false,loop=false;const io=new IntersectionObserver(en=>{on=en.some(x=>x.isIntersecting)&&!document.hidden;if(on&&!loop){loop=true;requestAnimationFrame(tick)}});counts.forEach(c=>io.observe(c))}
 }

 const root=document.querySelector('.sv-cases');if(!root)return;
 const row=root.querySelector('.sv-row'),lis=[...row.children],cards=[...root.querySelectorAll('.sv-card')],all=cards,n=lis.length;
 const reduce=matchMedia('(prefers-reduced-motion:reduce)'),dialog=document.querySelector('.sv-viewer'),bars=[...root.querySelectorAll('.sv-prog i')];
 // 작업 사례(2026-11-03 A안 '주인공 카드'): 가운데 사례가 크게 2.2초 머문 뒤(넘어가는 0.8초 포함 한 사례 약 3초) 다음 사례가 가운데로 넘어옴.
 // 양옆은 작고 흐리게, 가운데 사진은 천천히 줌아웃, 아래 막대가 남은 시간. 마우스를 올리거나 포커스·크게 보기 중·화면 밖에서는 멈춤.
 // 옆 카드를 누르면 그 사례가 가운데로, 가운데 카드를 누르면 크게 보기.
 const HOLD=2200,dragged=false;
 let cur=0,timer=null,hover=false,focus=false,visible=!('IntersectionObserver' in window);
 function lay(){
  const w=lis[0].offsetWidth;row.style.height=lis[0].offsetHeight+20+'px';root.style.setProperty('--w-cover',lis[0].querySelector('.sv-cover').offsetHeight+'px');
  lis.forEach((li,i)=>{let o=((i-cur)%n+n)%n;if(o>n/2)o-=n;const a=Math.abs(o);
   li.style.transform=`translateX(calc(-50% + ${o*w*.78}px)) scale(${o?.78:1})`;li.style.zIndex=10-a;li.style.opacity=a>2?0:a===2?.35:1;
   li.classList.toggle('is-c',!o);li.toggleAttribute('inert',a>2);
   const btn=li.querySelector('.sv-card');btn.tabIndex=a>1?-1:0;
   if(!o){const im=li.querySelector('.sv-cover img');im.style.animation='none';void im.offsetWidth;im.style.animation=''}});
  bars.forEach((b,i)=>{b.classList.remove('on');if(i===cur){void b.offsetWidth;b.classList.add('on')}});
  root.classList.toggle('is-held',!running());
 }
 const running=()=>!reduce.matches&&!hover&&!focus&&visible&&!(dialog&&dialog.open)&&!document.hidden;
 function arm(){clearTimeout(timer);timer=null;if(running()&&n>1)timer=setTimeout(()=>go(1),HOLD)}
 function go(d){cur=(cur+d+n)%n;lay();arm()}
 function to(i){if(i===cur)return;cur=i;lay();arm()}
 const sync=()=>{root.classList.toggle('is-held',!running());if(!running()){clearTimeout(timer);timer=null}else if(!timer)arm()};
 root.querySelectorAll('.sv-arrow').forEach(a=>a.addEventListener('click',()=>go(+a.dataset.dir)));
 cards.forEach((c,i)=>c.addEventListener('click',e=>{if(i!==cur){e.stopImmediatePropagation();to(i)}}));
 row.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){hover=true;sync()}});row.addEventListener('pointerleave',()=>{hover=false;sync()});
 // 키보드로 들어온 포커스만 멈춤(마우스로 누르거나 창을 닫고 돌아온 포커스는 계속 흐름)
 const kf=()=>{focus=!!root.querySelector(':focus-visible');sync()};root.addEventListener('focusin',()=>setTimeout(kf,0));root.addEventListener('focusout',()=>setTimeout(kf,0));
 cards.forEach((c,i)=>c.addEventListener('focus',()=>{if(i!==cur&&c.matches(':focus-visible'))to(i)}));
 // 손가락으로 밀어 넘기기
 let sx=null;row.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')sx=e.clientX});
 row.addEventListener('pointerup',e=>{if(sx===null)return;const dx=e.clientX-sx;sx=null;if(Math.abs(dx)>40)go(dx<0?1:-1)});
 // 스크롤로 이 섹션에 들어올 때마다 곧바로 한 사례 넘어감(들어오는 순간 움직임이 보이게)
 if(!visible)new IntersectionObserver(en=>{const was=visible;visible=en[0].isIntersecting;if(visible&&!was&&running()&&n>1){clearTimeout(timer);timer=setTimeout(()=>go(1),300)}else sync()},{threshold:.35}).observe(row);
 document.addEventListener('visibilitychange',sync);dialog?.addEventListener('close',()=>{sync()});
 /* 폭이 바뀔 때만 다시 배치(모바일 주소창 높이 변화는 무시) */let lw=innerWidth;addEventListener('resize',()=>{if(innerWidth!==lw){lw=innerWidth;lay()}});lay();arm();

 if(!dialog||!dialog.showModal)return;
 const $=s=>dialog.querySelector(s);
 const img=$('.sv-stage img'),cap=$('.sv-stage figcaption'),thumbs=$('.sv-thumbs'),where=$('.sv-where');
 let book=0,page=0,data=[],opener=null;
 const facts=$('.sv-facts');
 function show(i,dir=0){
  const items=data[book].items;page=Math.max(0,Math.min(items.length-1,i));
  const it=items[page];img.src=it.src;img.alt=it.alt||it.caption||'';cap.textContent=it.caption||'';
  if(dir){img.style.setProperty('--from',(dir*16)+'px');img.classList.remove('is-swap');void img.offsetWidth;img.classList.add('is-swap')}
  where.textContent=`${page+1} / ${items.length}`;
  $('.sv-prev').disabled=page===0;$('.sv-next').disabled=page===items.length-1;
  $('.sv-prev').hidden=$('.sv-next').hidden=where.hidden=items.length<2;
  thumbs.querySelectorAll('button').forEach((b,k)=>b.setAttribute('aria-current',String(k===page)));
  const next=items[page+1];if(next){const pre=new Image();pre.src=next.src}
 }
 function open(i){
  book=(i+data.length)%data.length;const b=data[book];
  $('.sv-kind').textContent=b.kind||'';$('h3').textContent=b.title;
  facts.innerHTML='';
  for(const [k,v] of b.facts||[]){const d=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=k;dd.textContent=v;d.append(dt,dd);facts.append(d)}
  thumbs.innerHTML='';
  b.items.forEach((it,k)=>{const li=document.createElement('li'),bt=document.createElement('button'),t=document.createElement('img');bt.type='button';bt.setAttribute('aria-label',`${k+1}번째 사진`);t.src=it.src;t.alt='';t.loading='lazy';bt.append(t);bt.addEventListener('click',()=>show(k,k>page?1:-1));li.append(bt);thumbs.append(li)});
  thumbs.hidden=b.items.length<2;
  show(0);
 }
 data=cards.map(c=>JSON.parse(c.dataset.case));
 all.forEach(c=>c.addEventListener('click',()=>{const i=+c.dataset.i;opener=cards[i];open(i);document.documentElement.classList.add('sv-lock');dialog.showModal();$('.sv-stage').focus()}));
 const close=()=>dialog.close();
 dialog.addEventListener('close',()=>{document.documentElement.classList.remove('sv-lock');to(book);opener=cards[book];opener?.focus({preventScroll:true})});
 dialog.addEventListener('click',e=>{if(e.target===dialog)close()});
 $('.sv-close').addEventListener('click',close);
 $('.sv-prev').addEventListener('click',()=>show(page-1,-1));
 $('.sv-next').addEventListener('click',()=>show(page+1,1));
 dialog.querySelectorAll('.sv-books button').forEach(b=>b.addEventListener('click',()=>open(book+Number(b.dataset.step))));
 $('.sv-books').hidden=data.length<2;
 dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight')show(page+1,1);if(e.key==='ArrowLeft')show(page-1,-1)});
 let x0=null;const stage=$('.sv-stage');
 stage.addEventListener('pointerdown',e=>{x0=e.clientX});
 stage.addEventListener('pointerup',e=>{if(x0===null)return;const dx=e.clientX-x0;x0=null;if(Math.abs(dx)>40)dx<0?show(page+1,1):show(page-1,-1)});
})();
