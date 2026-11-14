/* 홈페이지 사례(2026-11-14): 인트라넷에서 고친 내용을 저장 즉시 보여 준다. 두 가지를 따로 관리한다.
   · 서비스별 사례(사진 위주) /api/store/cases?kind=cases → site_public_service_cases()
       서비스 상세 화면의 작업 사례 줄을 게시된 사례로 바꿈. 없거나 못 읽으면 빌드에 들어 있는 사례 그대로
   · 진행 사례(블로그)  ?kind=posts → 목록,  ?kind=post&slug= → 글 하나 (site_public_posts)
   (운영 사이트 Next.js 의 src/app/api/store/cases/route.ts. 초안 서버 함수 service-store.js 에도 ?action= 으로 같은 것이 있음)
       /work/ 목록 맨 앞에 글 카드, /work/p/?c=주소이름 에 글 본문과 [이 구성으로 견적 담기]
   글자는 모두 escape/textContent 로만 넣는다(HTML 실행 없음).
   다른 스크립트(service-detail·booklet-cases)는 window.paranCasesReady 가 끝난 뒤 사례 줄을 묶는다. */
(()=>{'use strict';
const API='/api/store/cases?kind=',WAIT=1800;
const STORE='https://aiarnrhftmuffmcninyl.supabase.co/storage/v1/object/public/site-cases/';
const ROLE={design:'디자인',mock:'목업',site:'현장 사진'};
const ARROW='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// DB 경로는 늘 'svc/…' 또는 'post/…'(SQL CHECK). '/'·http 로 시작하는 값은 시험 데이터용으로 그대로 씀
const url=p=>/^(https?:)?\//.test(p)?p:STORE+String(p).split('/').map(encodeURIComponent).join('/');
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
const onWork=/^\/work\/?$/.test(path),onPost=/^\/work\/p\/?$/.test(path);
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
 const key=s=>String(s||'').replace(/\s+/g,''),seen=new Set(list.map(c=>key(c.title)));
 const cards=[...grid.children],shown=list.filter(c=>c.cover);
 cards.forEach(a=>{const h=a.querySelector('h2,h3');if(h&&seen.has(key(h.textContent)))a.hidden=true});
 const tpl=cards[0],meta=c=>[c.client,c.date].filter(Boolean).join(' · ');
 // 기본 틀(.case-card)이 아니면(테마 레이아웃) 첫 카드를 본으로 복사해 사진·글·주소만 바꿈
 if(!tpl||tpl.classList.contains('case-card')){grid.insertAdjacentHTML('afterbegin',shown.map(c=>`<article class="case-card is-live"><a href="/work/p/?c=${encodeURIComponent(c.slug)}"><img src="${esc(url(c.cover))}" alt="${esc(c.title)} 사례" width="700" height="460" loading="lazy" decoding="async"><span>${esc(meta(c))}</span><h3>${esc(c.title)} ${ARROW}</h3>${c.summary?`<p>${esc(c.summary)}</p>`:''}</a></article>`).join(''));return}
 shown.slice().reverse().forEach(c=>{const n=tpl.cloneNode(true);n.hidden=false;n.classList.add('is-live');const img=n.querySelector('img');if(img){img.src=url(c.cover);img.alt=c.title+' 사례';img.removeAttribute('srcset')}
  const h=n.querySelector('h2,h3');if(h)h.textContent=c.title;const s=n.querySelector('span:not(.text)');if(s)s.textContent=meta(c);
  const p=n.querySelector('p');if(p){if(c.summary)p.textContent=c.summary;else p.remove()}
  n.querySelectorAll('a').forEach(a=>{a.href='/work/p/?c='+encodeURIComponent(c.slug);a.removeAttribute('target');a.removeAttribute('rel')});grid.prepend(n)});
}

// ---- 진행 사례 글 ----
function b64(json){return btoa(String.fromCharCode(...new TextEncoder().encode(json))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
// 글 블록: 빈 줄은 문단, 줄바꿈은 <br>. 모두 escape 뒤에 만듦
const paras=t=>String(t||'').trim().split(/\n{2,}/).map(x=>`<p>${esc(x).replace(/\n/g,'<br>')}</p>`).join('');
async function postView(){
 const box=document.querySelector('[data-case-view]');if(!box)return;
 const slug=new URLSearchParams(location.search).get('c')||'';
 const list=slug?await get('post',slug):null,c=list?.[0];
 if(!c){box.innerHTML=`<section class="page-intro wrap"><h1>사례를 찾을 수 없습니다.</h1><p>${list?'주소가 바뀌었거나 게시가 내려간 사례입니다.':'사례 정보를 불러오지 못했습니다. 잠시 후 다시 열어 주세요.'}</p><a class="button primary" href="/work/">진행 사례 전체 보기 ${ARROW}</a></section>`;return}
 document.title=c.title+' | 파란컴퍼니';
 const md=document.querySelector('meta[name="description"]');if(md&&c.summary)md.setAttribute('content',c.summary);
 const cat=await fetch('/assets/catalog.json',{cache:'no-cache'}).then(r=>r.ok?r.json():[]).catch(()=>[]),P=id=>cat.find(p=>p.id===id),Q=window.ParanQuote;
 // 빠진 옵션은 장바구니와 같은 기본값으로 채워 계산(장바구니 금액과 같게)
 const lines=(c.quote||[]).filter(q=>P(q.serviceId)).map(q=>{const p=P(q.serviceId),options=Object.fromEntries(p.options.map(o=>[o.key,q.options?.[o.key]??o.defaultValue??o.values?.[0]??'']));let price=0;
  try{const e=Q?.estimate(p,options,q.design||1,q.qty||1);price=e?.total?Math.round(e.total):0}catch{}
  const spec=p.options.filter(o=>options[o.key]&&options[o.key]!=='해당 없음').slice(0,3).map(o=>options[o.key]).join(' · ');
  return {p,q:{...q,options},price,spec}});
 const total=lines.reduce((a,l)=>a+l.price,0),unpriced=lines.some(l=>!l.price);
 const facts=[['발주',c.client],['행사일',c.date],['장소',c.venue]].filter(x=>x[1]);
 const F=c.files||{},img=id=>F[id];
 const body=(c.body||[]).map(b=>{
  if(b.t==='h')return b.text?`<h2>${esc(b.text)}</h2>`:'';
  if(b.t==='p')return paras(b.text);
  if(b.t==='img'){const fs=(b.files||[]).map(img).filter(Boolean);if(!fs.length)return '';
   return `<figure class="post-photos n${Math.min(fs.length,3)}">${fs.map(f=>`<a href="${esc(url(f.path))}" target="_blank" rel="noopener"><img src="${esc(url(f.path))}" alt="${esc(b.caption||c.title)}" ${f.w?`width="${f.w}" height="${f.h}"`:''} loading="lazy" decoding="async"></a>`).join('')}${b.caption?`<figcaption>${esc(b.caption)}</figcaption>`:''}</figure>`}
  return '';}).join('');
 box.innerHTML=`<article class="post">
  <header class="wrap post-head"><a class="text-link back" href="/work/">← 진행 사례</a><h1>${esc(c.title)}</h1>${c.summary?`<p class="post-lead">${esc(c.summary)}</p>`:''}
   ${facts.length?`<dl class="case-facts">${facts.map(([k,v])=>`<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>`:''}</header>
  ${c.cover?`<div class="wrap case-hero"><img src="${esc(url(c.cover))}" alt="${esc(c.title)} 대표 사진" width="1400" height="900" decoding="async"></div>`:''}
  <div class="wrap post-body">${body}</div></article>
  ${lines.length?`<section class="wrap case-quote" aria-labelledby="case-quote-h"><div><h2 id="case-quote-h">이 행사 구성으로 견적 받기</h2><p>파란이 이 행사에서 맡은 ${lines.length}가지 구성을 그대로 장바구니에 담습니다. 담은 뒤 수량·사양을 바꿀 수 있습니다.</p>
   <ul>${lines.map(l=>`<li><b>${esc(l.p.name)}</b>${l.q.label?` <span>${esc(l.q.label)}</span>`:''}<small>${esc(l.spec)}</small><em>${l.price?l.price.toLocaleString('ko-KR')+'원':'상담 후 확정'}</em></li>`).join('')}</ul>
   <p class="case-total">${total?`참고 금액 <b>${total.toLocaleString('ko-KR')}원</b>${unpriced?' + 상담 항목':''} <small>부가세 포함 · 확정 금액은 담당자 검토 후 안내</small>`:'금액은 담당자 검토 후 안내합니다.'}</p></div>
   <div class="case-actions"><a class="button primary" data-case-cart href="/cart/#add=${b64(JSON.stringify({from:c.slug,items:lines.map(l=>({serviceId:l.p.id,options:l.q.options,design:l.q.design||1,qty:l.q.qty||1}))}))}">이 구성으로 견적 담기 ${ARROW}</a><a class="button case-consult" href="/request/?mode=consult">이 행사처럼 상담하기</a></div></section>`:''}
  <section class="wrap"><div class="callout"><h2>비슷한 행사를 준비하고 계신가요?</h2><p>필요한 구성만 골라 맡기거나, 행사 전체를 상담할 수 있습니다.</p><a class="button primary" href="/request/?mode=consult">내 행사 상담하기 ${ARROW}</a></div></section>`;
}

if(onWork)get('posts').then(list=>ready(()=>workList(list)));
if(onPost)ready(postView);
})();
