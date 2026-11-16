/* 홈페이지 사례(2026-11-14): 인트라넷에서 고친 내용을 저장 즉시 보여 준다. 두 가지를 따로 관리한다.
   · 서비스별 사례(사진 위주) /api/store/cases?kind=cases → site_public_service_cases()
       서비스 상세 화면의 작업 사례 줄을 게시된 사례로 바꿈. 없거나 못 읽으면 빌드에 들어 있는 사례 그대로
   · 진행 사례(블로그)  ?kind=posts → 목록,  ?kind=post&slug= → 글 하나 (site_public_posts)
   (운영 사이트 Next.js 의 src/app/api/store/cases/route.ts. 초안 서버 함수 service-store.js 에도 ?action= 으로 같은 것이 있음)
       /work/ 목록 맨 앞에 글 카드, /work/p/<주소이름> 에 글 본문과 [이 구성으로 견적 담기]
       운영 사이트는 글 본문·머리 정보·구조화 데이터를 서버가 넣어 보냄(src/app/work/p/[slug]/route.ts, data-ssr).
       그때 이 스크립트는 견적 구성 칸([data-case-quote])만 채움. 예전 주소 /work/p/?c= 는 새 주소로 옮김
   글자는 모두 escape/textContent 로만 넣는다(HTML 실행 없음).
   다른 스크립트(service-detail·booklet-cases)는 window.paranCasesReady 가 끝난 뒤 사례 줄을 묶는다. */
(()=>{'use strict';
const API='/api/store/cases?kind=',WAIT=1800;
// 이 스크립트와 같은 판(?v=)의 CSS. 서비스 상세는 CSS 를 안 불러 두므로 필요할 때 붙임
const VER=((document.currentScript&&document.currentScript.src)||'').match(/\?v=[\w]+/)?.[0]||'';
const STORE='https://aiarnrhftmuffmcninyl.supabase.co/storage/v1/object/public/site-cases/';
const ROLE={design:'디자인',mock:'목업',site:'현장 사진'};
const ARROW='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// DB 경로는 늘 'svc/…' 또는 'post/…'(SQL CHECK). '/'·http 로 시작하는 값은 시험 데이터용으로 그대로 씀
const url=p=>/^(https?:)?\//.test(p)?p:STORE+String(p).split('/').map(encodeURIComponent).join('/');
// 목록·카드용 작은 사진(Supabase 이미지 변환, 자르지 않음)
const thumb=(p,w=640)=>/^(https?:)?\//.test(p)?p:STORE.replace('/object/','/render/image/')+String(p).split('/').map(encodeURIComponent).join('/')+`?width=${w}&resize=contain&quality=80`;
const local=/^(localhost|127\.0\.0\.1)$/.test(location.hostname);
// 로컬 미리보기(정적 서버)에는 함수가 없음. ?cases=<폴더 주소> 로 시험 데이터(cases.json, posts.json, post-<주소이름>.json)를 줄 수 있음
const test=new URLSearchParams(location.search).get('cases');
function get(kind,slug){
 const src=test?`${test.replace(/\/$/,'')}/${kind==='post'?'post-'+slug:kind}.json`:local?null:API+kind+(slug?'&slug='+encodeURIComponent(slug):'');
 if(!src)return Promise.resolve(null);
 const ctl='AbortController' in window?new AbortController():null,t=setTimeout(()=>ctl&&ctl.abort(),WAIT);
 return fetch(src,{signal:ctl?.signal,headers:{Accept:'application/json'}}).then(r=>r.ok?r.json():null).then(d=>Array.isArray(d)?d:Array.isArray(d?.items)?d.items:null).catch(()=>null).finally(()=>clearTimeout(t));
}
const path=location.pathname,pageId=(path.match(/^\/services\/([a-z0-9-]+)\/?$/)||[])[1];
const onWork=/^\/work\/?$/.test(path),onPost=/^\/work\/p(\/[a-z0-9-]+)?\/?$/.test(path);
// 글 주소: 운영은 /work/p/<주소이름>(서버가 그림), 로컬 정적 미리보기는 /work/p/?c=<주소이름>
const postHref=slug=>local||test?'/work/p/?c='+encodeURIComponent(slug):'/work/p/'+encodeURIComponent(slug);
const ready=fn=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn):fn();

// ---- 서비스 상세: 작업 사례 줄 바꾸기 (다른 스크립트가 묶기 전에) ----
window.paranCasesReady=(pageId?get('cases'):Promise.resolve(null)).then(list=>{
 const rows=(list||[]).filter(c=>c.service===pageId&&c.files?.length);if(!rows.length)return;
 if(pageId==='booklet')return booklet(rows);
 const root=document.querySelector('.sv-cases .sv-row');if(!root)return;
 const paper=root.querySelector('.sv-cover.is-paper')?' is-paper':'';
 root.innerHTML=rows.map((c,n)=>{
  const items=c.files.map(f=>({src:url(f.path),caption:[ROLE[f.role],f.caption].filter(Boolean).join(' · '),alt:f.caption||c.title+' '+ROLE[f.role]}));
  const facts=[['발주',c.client],['연도',c.year?String(c.year):'']].filter(x=>x[1]);
  const payload={title:c.title,kind:c.note||'',facts,items};
  const count=items.length>1?`<span class="sv-count">사진 ${items.length}</span>`:'';
  return `<li><button type="button" class="sv-card" data-i="${n}" data-case='${esc(JSON.stringify(payload))}' aria-haspopup="dialog" aria-label="${esc(c.title)} 사진 크게 보기"><span class="sv-cover${paper}"><img src="${esc(items[0].src)}" alt="${esc(items[0].alt)}" width="640" height="480" loading="${n<3?'eager':'lazy'}" decoding="async">${count}<span class="sv-open" aria-hidden="true">크게 보기</span></span><span class="sv-meta"><strong>${esc(c.title)}</strong></span></button></li>`;
 }).join('');
 const prog=document.querySelector('.sv-cases .sv-prog');if(prog)prog.innerHTML='<i></i>'.repeat(rows.length);
}).catch(()=>{});

function booklet(rows){
 const row=document.querySelector('#booklet-cases .case-row');if(!row)return;
 const books=rows.map(c=>{const cover=c.files.find(f=>f.role==='mock')||c.files[0];
  const pages=[...c.files.filter(f=>f.role==='design'),...c.files.filter(f=>f.role!=='design')].filter(f=>f!==cover).map(f=>url(f.path));
  return {c,data:{title:c.title,kind:c.note||'',year:c.year?String(c.year):'',size:'',pages:'',cover:url(cover.path),inner:pages.slice(0,24),back:''}}});
 row.innerHTML=books.map((b,n)=>`<li><button type="button" class="case-card" data-case="${n}" data-book='${esc(JSON.stringify(b.data))}' aria-haspopup="dialog" aria-label="${esc(b.c.title)} 내지 보기"><span class="case-cover"><img src="${esc(b.data.cover)}" alt="" width="460" height="650" loading="lazy" decoding="async"><span class="case-open" aria-hidden="true">내지 보기</span></span><span class="case-meta"><strong>${esc(b.c.title)}</strong></span></button></li>`).join('');
 const prog=document.querySelector('#booklet-cases .case-prog');if(prog)prog.innerHTML='<i></i>'.repeat(books.length);
}

// ---- 진행 사례 목록 ----
function workList(list){
 const grid=document.querySelector('[data-cases-live]');if(!grid||!list?.length)return;
 // 운영 사이트는 서버(work-list)가 이미 카드를 넣어 보냄
 if(grid.hasAttribute('data-cases-ssr'))return;
 const key=s=>String(s||'').replace(/\s+/g,''),seen=new Set(list.map(c=>key(c.title)));
 const cards=[...grid.children],shown=list.filter(c=>c.cover);
 cards.forEach(a=>{const h=a.querySelector('h2,h3');if(h&&seen.has(key(h.textContent)))a.hidden=true});
 const tpl=cards[0],meta=c=>[c.client,c.date].filter(Boolean).join(' · ');
 // 기본 틀(.case-card)이 아니면(테마 레이아웃) 첫 카드를 본으로 복사해 사진·글·주소만 바꿈
 if(!tpl||tpl.classList.contains('case-card')){grid.insertAdjacentHTML('afterbegin',shown.map(c=>`<article class="case-card is-live"><a href="${esc(postHref(c.slug))}"><img src="${esc(thumb(c.cover,800))}" alt="${esc(c.title)} 사례" width="700" height="460" loading="lazy" decoding="async"><span>${esc(meta(c))}</span><h3>${esc(c.title)} ${ARROW}</h3>${c.summary?`<p>${esc(c.summary)}</p>`:''}</a></article>`).join(''));return}
 shown.slice().reverse().forEach(c=>{const n=tpl.cloneNode(true);n.hidden=false;n.classList.add('is-live');const img=n.querySelector('img');if(img){img.src=thumb(c.cover,800);img.alt=c.title+' 사례';img.removeAttribute('srcset')}
  const h=n.querySelector('h2,h3');if(h)h.textContent=c.title;const s=n.querySelector('span:not(.text)');if(s)s.textContent=meta(c);
  const p=n.querySelector('p');if(p){if(c.summary)p.textContent=c.summary;else p.remove()}
  n.querySelectorAll('a').forEach(a=>{a.href=postHref(c.slug);a.removeAttribute('target');a.removeAttribute('rel')});grid.prepend(n)});
}

// ---- 진행 사례 글 ----
function b64(json){return btoa(String.fromCharCode(...new TextEncoder().encode(json))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
// 글 블록: 빈 줄은 문단, 줄바꿈은 <br>. 모두 escape 뒤에 만듦
const paras=t=>String(t||'').trim().split(/\n{2,}/).map(x=>`<p>${esc(x).replace(/\n/g,'<br>')}</p>`).join('');
// 사진 대체 문구: 사진마다 쓴 alt → 묶음 설명 → 제목 + 순번 (서버 casePosts.ts altOf 와 같게)
const altOf=(c,f,cap,n)=>String(f?.alt||'').trim()||String(cap||'').trim()||`${c.title} 사진 ${n}`;
async function quoteHtml(c){
 const cat=await fetch('/assets/catalog.json',{cache:'no-cache'}).then(r=>r.ok?r.json():[]).catch(()=>[]),P=id=>cat.find(p=>p.id===id),Q=window.ParanQuote;
 // 빠진 옵션은 장바구니와 같은 기본값으로 채워 계산(장바구니 금액과 같게)
 const lines=(c.quote||[]).filter(q=>P(q.serviceId)).map(q=>{const p=P(q.serviceId),options=Object.fromEntries(p.options.map(o=>[o.key,q.options?.[o.key]??o.defaultValue??o.values?.[0]??'']));let price=0;
  try{const e=Q?.estimate(p,options,q.design||1,q.qty||1);price=e?.total?Math.round(e.total):0}catch{}
  const spec=p.options.filter(o=>options[o.key]&&options[o.key]!=='해당 없음').slice(0,3).map(o=>options[o.key]).join(' · ');
  return {p,q:{...q,options},price,spec}});
 if(!lines.length)return '';
 // 참고 금액은 글에서 켠 경우만(사례 규격이 홈페이지 선택지와 달라 금액이 실제와 다를 수 있음)
 const show=!!c.show_price;
 const total=lines.reduce((a,l)=>a+l.price,0),unpriced=lines.some(l=>!l.price);
 return `<section class="wrap case-quote" aria-labelledby="case-quote-h"><div><h2 id="case-quote-h">이 행사 구성으로 견적 받기</h2><p>파란이 이 행사에서 맡은 ${lines.length}가지 구성을 비슷한 사양으로 장바구니에 담습니다. 담은 뒤 수량·사양을 바꿀 수 있습니다.</p>
   <ul>${lines.map(l=>`<li><b>${esc(l.p.name)}</b>${l.q.label?` <span>${esc(l.q.label)}</span>`:''}<small>${esc(l.spec)}</small>${show?`<em>${l.price?l.price.toLocaleString('ko-KR')+'원':'상담 후 확정'}</em>`:''}</li>`).join('')}</ul>
   ${(()=>{const sp=(c.overview||[]).find(r=>/^규격/.test(String(r?.k||'').trim()))?.v;return sp?`<p class="case-spec-note">홈페이지 선택지 중 이 사례와 가장 가까운 사양으로 담습니다. 실제 사례 규격은 <b>${esc(sp)}</b>입니다. 담은 뒤 바꾸거나 상담 때 말씀해 주세요.</p>`:''})()}
   <p class="case-total">${!show?'금액은 고르신 사양·수량으로 담당자가 검토해 안내합니다.':total?`참고 금액 <b>${total.toLocaleString('ko-KR')}원</b>${unpriced?' + 상담 항목':''} <small>부가세 포함 · 확정 금액은 담당자 검토 후 안내</small>`:'금액은 담당자 검토 후 안내합니다.'}</p></div>
   <div class="case-actions"><a class="button primary" data-case-cart href="/cart/#add=${b64(JSON.stringify({from:c.slug,items:lines.map(l=>({serviceId:l.p.id,options:l.q.options,design:l.q.design||1,qty:l.q.qty||1}))}))}">이 구성으로 견적 담기 ${ARROW}</a><a class="button case-consult" href="/request/?mode=consult">이 행사처럼 상담하기</a></div></section>`;
}
async function postView(){
 const box=document.querySelector('[data-case-view]');if(!box)return;
 const qs=new URLSearchParams(location.search).get('c')||'',seg=(path.match(/^\/work\/p\/([a-z0-9-]+)\/?$/)||[])[1]||'';
 // 예전 주소(/work/p/?c=)로 들어오면 새 주소로(운영만)
 if(!seg&&qs&&!local&&!test){location.replace(postHref(qs));return}
 const slug=seg||qs,ssr=box.dataset.ssr;
 if(ssr==='missing')return;
 const list=slug?await get('post',slug):null,c=list?.[0];
 if(ssr&&ssr===slug){if(c){const q=box.querySelector('[data-case-quote]');if(q)q.innerHTML=await quoteHtml(c)}return}
 if(!c){box.innerHTML=`<section class="page-intro wrap"><h1>사례를 찾을 수 없습니다.</h1><p>${list?'주소가 바뀌었거나 게시가 내려간 사례입니다.':'사례 정보를 불러오지 못했습니다. 잠시 후 다시 열어 주세요.'}</p><a class="button primary" href="/work/">진행 사례 전체 보기 ${ARROW}</a></section>`;return}
 document.title=c.title+' | 파란컴퍼니';
 const md=document.querySelector('meta[name="description"]');if(md&&c.summary)md.setAttribute('content',c.summary);
 const facts=[['발주',c.client],['일정',c.date],['장소',c.venue]].filter(x=>x[1]);
 const F=c.files||{},img=id=>F[id];let n=0;const faqs=[];
 const body=(c.body||[]).map(b=>{
  if(b.t==='h')return b.text?`<h2>${esc(b.text)}</h2>`:'';
  if(b.t==='p')return paras(b.text);
  if(b.t==='faq'){if(String(b.q||'').trim()&&String(b.a||'').trim())faqs.push(`<div class="post-faq-item"><h3>${esc(b.q)}</h3>${paras(b.a)}</div>`);return ''}
  if(b.t==='img'){const fs=(b.files||[]).map(id=>({f:img(id),n:++n})).filter(x=>x.f);if(!fs.length)return '';
   return `<figure class="post-photos n${Math.min(fs.length,3)}">${fs.map(({f,n})=>`<a href="${esc(url(f.path))}" target="_blank" rel="noopener"><img src="${esc(url(f.path))}" alt="${esc(altOf(c,f,b.caption,n))}" ${f.w?`width="${f.w}" height="${f.h}"`:''} loading="lazy" decoding="async"></a>`).join('')}${b.caption?`<figcaption>${esc(b.caption)}</figcaption>`:''}</figure>`}
  return '';}).join('');
 box.innerHTML=`<article class="post">
  <header class="wrap post-head"><a class="text-link back" href="/work/">← 진행 사례</a><h1>${esc(c.title)}</h1>${c.summary?`<p class="post-lead">${esc(c.summary)}</p>`:''}
   ${facts.length?`<dl class="case-facts">${facts.map(([k,v])=>`<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>`:''}</header>
  ${c.cover?`<div class="wrap case-hero"><img src="${esc(url(c.cover))}" alt="${esc(String(c.cover_alt||'').trim()||c.title+' 대표 사진')}" width="1400" height="900" decoding="async"></div>`:''}
  <div class="wrap post-body">${body}${faqs.length?`<section class="post-faq" aria-labelledby="post-faq-h"><h2 id="post-faq-h">자주 묻는 질문</h2>${faqs.join('')}</section>`:''}</div></article>
  <div data-case-quote>${await quoteHtml(c)}</div>
  ${(c.quote||[]).length?'':`<section class="wrap"><div class="callout"><h2>비슷한 결과물이 필요하신가요?</h2><p>필요한 서비스만 골라 상담하세요. 사양과 수량을 정하면 견적을 안내합니다.</p><a class="button primary" href="/request/?mode=consult">상담 요청하기 ${ARROW}</a></div></section>`}`;
}

// ---- 서비스 상세: 이 서비스로 진행한 사례 글 (FAQ 앞) ----
function servicePosts(list){
 const rows=(list||[]).filter(c=>c.cover&&(c.services||[]).includes(pageId)).slice(0,6);if(!rows.length)return;
 const before=document.querySelector('[data-detail-kind="faq"]');if(!before||document.querySelector('.svc-posts'))return;
 if(!document.querySelector('link[href*="site-cases_1.0.css"]')){const l=document.createElement('link');l.rel='stylesheet';l.href='/assets/site-cases_1.0.css'+VER;document.head.append(l)}
 const sec=document.createElement('section');sec.className='svc-posts';sec.setAttribute('aria-labelledby','svc-posts-h');
 sec.innerHTML=`<div class="svc-posts-in"><h2 id="svc-posts-h">이 서비스로 진행한 사례</h2><ul>${rows.map(c=>`<li><a href="${esc(postHref(c.slug))}"><span class="svc-post-img"><img src="${esc(thumb(c.cover))}" alt="${esc(String(c.cover_alt||'').trim()||c.title+' 사례')}" loading="lazy" decoding="async"></span><strong>${esc(c.title)}</strong>${c.summary?`<small>${esc(c.summary)}</small>`:''}</a></li>`).join('')}</ul><a class="svc-posts-all" href="/work/">진행 사례 전체 보기 ${ARROW}</a></div>`;
 before.before(sec);
}

if(onWork)get('posts').then(list=>ready(()=>workList(list)));
if(pageId)get('posts').then(list=>ready(()=>servicePosts(list)));
// ---- 글 사진 크게 보기 ----
const ICON={x:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',prev:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>',next:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>',zoom:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5M11 8v6M8 11h6"/></svg>'};
function lightbox(){
 if(!window.HTMLDialogElement)return;
 let d=null,list=[],i=0;
 const items=()=>[...document.querySelectorAll('.post-photos a')].map(a=>{const img=a.querySelector('img'),fig=a.closest('figure');return{src:a.getAttribute('href'),alt:img?.alt||'',cap:fig?.querySelector('figcaption')?.textContent||''}});
 function build(){
  d=document.createElement('dialog');d.className='post-lb';d.setAttribute('aria-label','사진 크게 보기');
  d.innerHTML=`<div class="post-lb-bar"><span class="post-lb-n" aria-live="polite"></span><button type="button" data-lb="zoom" aria-pressed="false">${ICON.zoom}<span>원본 크기</span></button><button type="button" data-lb="close" aria-label="닫기">${ICON.x}</button></div><div class="post-lb-stage"><img alt=""></div><div class="post-lb-foot"><button type="button" data-lb="prev" aria-label="이전 사진">${ICON.prev}</button><p class="post-lb-cap"></p><button type="button" data-lb="next" aria-label="다음 사진">${ICON.next}</button></div>`;
  document.body.append(d);
  d.addEventListener('click',e=>{const b=e.target.closest('[data-lb]');if(b){const k=b.dataset.lb;if(k==='close')d.close();else if(k==='zoom')zoom();else show(i+(k==='next'?1:-1))}else if(e.target.matches('.post-lb-stage img'))zoom()});
  d.addEventListener('keydown',e=>{if(e.key==='ArrowRight')show(i+1);else if(e.key==='ArrowLeft')show(i-1)});
  d.addEventListener('close',()=>{d.classList.remove('is-zoom');document.documentElement.style.overflow=''});
 }
 function zoom(){const on=!d.classList.contains('is-zoom');d.classList.toggle('is-zoom',on);d.querySelector('[data-lb="zoom"]').setAttribute('aria-pressed',on);d.querySelector('[data-lb="zoom"] span').textContent=on?'화면에 맞추기':'원본 크기'}
 function show(n){
  i=(n+list.length)%list.length;const it=list[i],img=d.querySelector('.post-lb-stage img');
  d.classList.remove('is-zoom');d.querySelector('[data-lb="zoom"]').setAttribute('aria-pressed','false');d.querySelector('[data-lb="zoom"] span').textContent='원본 크기';
  img.src=it.src;img.alt=it.alt;d.querySelector('.post-lb-cap').textContent=it.cap||it.alt;
  d.querySelector('.post-lb-n').textContent=`${i+1} / ${list.length}`;
  const many=list.length>1;d.querySelectorAll('[data-lb="prev"],[data-lb="next"]').forEach(b=>b.hidden=!many);
  d.querySelector('.post-lb-stage').scrollTo(0,0);
 }
 document.addEventListener('click',e=>{
  const a=e.target.closest('.post-photos a');if(!a||e.ctrlKey||e.metaKey||e.shiftKey||e.button)return;
  e.preventDefault();list=items();if(!d)build();
  show(list.findIndex(x=>x.src===a.getAttribute('href')));document.documentElement.style.overflow='hidden';d.showModal();
 });
}

if(onPost)ready(postView);
if(onPost)ready(lightbox);
})();
