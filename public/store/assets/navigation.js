/* Source desktop menus switch immediately; mobile drawer slides for 300ms. */
(()=>{
 'use strict';
 const host=document.querySelector('#paran-header');if(!host)return;
 const media=matchMedia('(max-width:950px)'),reduced=matchMedia('(prefers-reduced-motion:reduce)');
 let states,stage='desktop',mobile=media.matches,animation=null,revision=0,desktopToggle=null,suppressFocus=false;
 const count=()=>{let n=0;try{const x=JSON.parse(localStorage.getItem('paran.services.cart.v1')||'[]');n=Array.isArray(x)?x.length:0}catch{}host.querySelectorAll('[data-cart-count]').forEach(e=>e.textContent=n)};
 const cancel=()=>{revision++;animation?.cancel();animation=null};
 function render(next,slide=true){
  const previous=stage;cancel();stage=next;host.innerHTML=states[next];desktopToggle=null;
  const panel=host.querySelector('.sc-54142215-1');
  if(panel){const open=next!=='closed';panel.inert=!open;panel.setAttribute('aria-hidden',String(!open));host.querySelector('.open')?.setAttribute('aria-expanded',String(open));
   if(slide&&previous==='closed'&&open&&!reduced.matches)animation=panel.animate([{left:'100%'},{left:'0px'}],{duration:300,easing:'ease-in-out'});
  }
  document.body.style.overflow=mobile&&next!=='closed'?'hidden':'';
  // 2026-11-08 모바일 헤더에도 장바구니 아이콘과 개수(쇼핑몰 기본)
  if(mobile&&next==='closed'){const o=host.querySelector('.open');if(o&&!host.querySelector('.paran-cart-m'))o.insertAdjacentHTML('beforebegin','<a class="paran-cart-m" href="/cart/" aria-label="장바구니"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h9.3a1 1 0 0 0 1-.8L20.5 8H6.2"/><circle cx="9.5" cy="20" r="1.3"/><circle cx="17.5" cy="20" r="1.3"/></svg><b data-cart-count>0</b></a>')}
  if(next==='desktop'){
   const menu=host.querySelector('.has_sub_menu'),panel=menu.querySelector('.sub_menu'),trigger=menu.querySelector('a');
   trigger.setAttribute('aria-haspopup','true');
   desktopToggle=open=>{panel.style.display=open?'block':'none';panel.inert=!open;trigger.setAttribute('aria-expanded',String(open));menu.classList.toggle('visible',open);menu.classList.toggle('hidden',!open)};
   desktopToggle(false);
   // 2026-11-08 마우스가 잠깐 벗어나도 바로 닫히지 않게: 0.4초 뒤 닫고, 그 안에 돌아오면 유지
   let shut=null;const hold=()=>{clearTimeout(shut);shut=null};
   menu.addEventListener('mouseenter',()=>{hold();desktopToggle(true)});
   menu.addEventListener('mouseleave',()=>{hold();shut=setTimeout(()=>{if(!menu.contains(document.activeElement))desktopToggle(false)},400)});
   menu.addEventListener('focusin',()=>{if(!suppressFocus)desktopToggle(true)});menu.addEventListener('focusout',e=>{if(!menu.contains(e.relatedTarget))desktopToggle(false)});
   trigger.addEventListener('keydown',e=>{if(e.key==='ArrowDown'){e.preventDefault();desktopToggle(true);panel.querySelector('a')?.focus()}});
  }
  count();
 }
 const focusPanel=()=>host.querySelector('.sc-54142215-1 .close')?.focus({preventScroll:true});
 function close(){
  const panel=host.querySelector('.sc-54142215-1');if(!panel||stage==='closed')return;
  // Continue from an interrupted opening, so repeated taps never jump the panel.
  const left=getComputedStyle(panel).left;cancel();const token=revision;
  const finish=()=>{if(token!==revision)return;render('closed',false);host.querySelector('.open')?.focus({preventScroll:true})};
  if(reduced.matches){finish();return}
  panel.inert=true;animation=panel.animate([{left},{left:'100%'}],{duration:300,easing:'ease-in-out',fill:'forwards'});animation.finished.then(finish,()=>{});
 }
 host.addEventListener('click',e=>{if(!states)return;const t=e.target;if(t.closest('.open')){render('root');focusPanel();return}if(t.closest('.close')){close();return}if(t.closest('.sc-96a8d10a-1')){render(stage==='services'?'root':'services');focusPanel();return}const arrow=t.closest('.nav-item > span');if(arrow?.querySelector('svg')){const key=arrow.closest('[data-nav-group]')?.dataset.navGroup||(stage==='root'?'services':null);if(key&&states[key]){render(key);focusPanel()}}});
 host.addEventListener('keydown',e=>{
  if(e.key==='Escape'){e.preventDefault();if(mobile&&stage!=='closed')close();else if(desktopToggle){desktopToggle(false);suppressFocus=true;host.querySelector('.has_sub_menu>a')?.focus();suppressFocus=false}}
  if(['Enter',' '].includes(e.key)&&e.target.matches('[role=button]')){e.preventDefault();e.target.click()}
  if(e.key==='Tab'&&mobile&&stage!=='closed'){const list=[...host.querySelectorAll('.sc-54142215-1 a[href],.sc-54142215-1 button,.sc-54142215-1 [tabindex="0"]')].filter(x=>x.getBoundingClientRect().width),first=list[0],last=list.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}}
 });
 media.addEventListener('change',e=>{mobile=e.matches;if(states)render(mobile?'closed':'desktop',false)});
 reduced.addEventListener('change',()=>{if(reduced.matches&&animation){animation.finish()}});
 window.addEventListener('storage',count);
 fetch('/assets/navigation.json').then(r=>{if(!r.ok)throw Error();return r.json()}).then(data=>{states=data;render(mobile?'closed':'desktop',false)}).catch(()=>{host.classList.add('navigation-fallback');document.body.style.overflow=''});
})();

// Native scrolling retains the source carousel layout without its React runtime.
document.querySelectorAll('.paran-case-carousel').forEach(section=>{
 const track=section.querySelector('.swiper-wrapper'),prev=section.querySelector('.swiper-prev'),next=section.querySelector('.swiper-next');
 if(!track||!prev||!next)return;
 track.setAttribute('aria-label','파란 진행 사례');
 const update=()=>{prev.disabled=track.scrollLeft<2;next.disabled=track.scrollLeft+track.clientWidth>=track.scrollWidth-2;};
 const move=direction=>track.scrollBy({left:direction*((track.firstElementChild?.getBoundingClientRect().width||300)+24),behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'});
 prev.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));track.addEventListener('scroll',update,{passive:true});new ResizeObserver(update).observe(track);update();
});
document.querySelectorAll('.fj-category-dropdown').forEach(dropdown=>{
 const summary=dropdown.querySelector('summary');
 const sync=()=>{const selected=dropdown.querySelector('[aria-pressed=true]');summary.textContent=selected?.dataset.categoryFilter||'전체 분류'};
 dropdown.addEventListener('click',event=>{if(event.target.closest('[data-category-filter]')){dropdown.open=false;setTimeout(sync,0)}});
 document.querySelector('[data-reset-filters]')?.addEventListener('click',()=>setTimeout(sync,0));setTimeout(sync,0);
});
// Source footer uses collapsible link groups on small screens.
(()=>{const media=matchMedia('(max-width:767px)'),headings=[...document.querySelectorAll('.fj-footer-toggle')];
 const sync=()=>headings.forEach(h=>{h.setAttribute('aria-expanded',String(!media.matches));h.tabIndex=media.matches?0:-1;if(media.matches)h.setAttribute('role','button');else h.removeAttribute('role')});
 headings.forEach(h=>{const toggle=()=>{if(media.matches)h.setAttribute('aria-expanded',String(h.getAttribute('aria-expanded')!=='true'))};h.addEventListener('click',toggle);h.addEventListener('keydown',e=>{if(media.matches&&['Enter',' '].includes(e.key)){e.preventDefault();toggle()}})});media.addEventListener('change',sync);sync();})();

/* The source reveals graphic surfaces, not forms or whole text sections. */
(()=>{
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 const surfaces=[...document.querySelectorAll('.fj-detail-visual,.fj-benefit-photos,.sc-7bf0bb16-0 .paran-real-photo,.sc-fba22d56-0 .paran-real-photo')];
 const running=new Set();
 const observer=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{
  if(!isIntersecting)return;observer.unobserve(target);
  if(reduced.matches)return;
  const animation=target.animate([{opacity:0},{opacity:1}],{duration:300,easing:'ease-in-out'});
  running.add(animation);animation.finished.then(()=>running.delete(animation),()=>running.delete(animation));
 }),{threshold:0.1});
 surfaces.forEach(el=>observer.observe(el));
 reduced.addEventListener('change',()=>{if(reduced.matches)running.forEach(a=>a.finish())});
})();
