/* 2026-11-08 온라인 견적서(산출내역서) PDF.
   양식: 「10 견적서_작성_시스템 v2.5」 §7 (A4 가로, 맑은 고딕, 메타 6행, 구분|항목|세부항목|수량|단위|단가|횟수|금액|비고, 색 5종, 인감 86×89px 견적업체 옆)
   계산: 디자인 트랙 §6-2 — 공급가 소계 → 부가세 TRUNC 10% → 배송비 실비(§6-3, 부가세 없음) → 합계 만원 미만 절사.
   ui/app.js 가 넘겨주는 docTotals(calc)·byId(find)를 그대로 써서 장바구니·견적 요청 화면과 금액이 같다. */
(()=>{
 'use strict';
 const C={label:'#D6E4F0',navy:'#1F4E79',head:'#2E75B6',green:'#C5D9A4',note:'#595959'};
 const SELLER={name:'파란컴퍼니 주식회사',tel:'02-6342-2800(010-5944-1305) / cs@parancompany.co.kr',person:'김민영 대리'};
 const SPACE=new Set(['photo-wall','booth-graphic','booth-operation']);
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const n0=n=>Math.round(n).toLocaleString('ko-KR');
 function hangul(n){ // 1234000 -> 일백이십삼만사천
  const d=['','일','이','삼','사','오','육','칠','팔','구'],u=['','십','백','천'],big=['','만','억','조'];let out='',i=0;n=Math.floor(n);
  if(!n)return '영';
  while(n>0){const part=n%10000;if(part){let s='';String(part).padStart(4,'0').split('').forEach((c,k)=>{const v=+c;if(v)s+=d[v]+u[3-k]});out=s+big[i]+out}n=Math.floor(n/10000);i++}
  return out}
 function ymd(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}

 function rows(t){
  const groups={'디자인':[],'제작물(출력)':[],'공간 조성':[]};let ship=0,shipN=0;
  for(const {x,p,e} of t.lines){if(!p)continue;const hide=p.quote?.hide||{},opts=(p.options||[]).filter(o=>x.options?.[o.key]&&x.options[o.key]!=='해당 없음'&&o.key!=='scope'&&o.key!=='delivery'&&o.key!==p.quote?.install?.opt&&!Object.entries(hide[o.key]||{}).some(([k,v])=>Array.isArray(v)?v.includes(x.options[k]):x.options[k]===v)).map(o=>x.options[o.key]).join(' / ');
   if(!e){groups['디자인'].push({item:p.name,spec:opts||'사양 확인',qty:1,unit:'식',price:null,note:'담당자 확인 후 견적'});continue}
   const n=e.n||1,scope=x.options?.scope||'';
   groups['디자인'].push({item:p.name+' 디자인',spec:[opts,'시안 1개','수정 2회'].filter(Boolean).join(' / '),qty:n,unit:'식',price:Math.round(e.dU),note:''});
   if(e.make){const g=SPACE.has(p.id)?'공간 조성':p.category==='디지털 콘텐츠'?'디자인':'제작물(출력)';const q=p.quote?.print&&x.qty?`${x.qty}${p.quote.print.unit}`:'';
    const ins=e.inst||0;groups[g].push({item:p.name+' '+(p.quote?.install?'제작':e.part||'제작'),spec:[opts,q].filter(Boolean).join(' / '),qty:n,unit:'식',price:Math.round(e.mU-ins),note:''});
    if(ins)groups[g].push({item:p.name+' 설치·철거 출장',spec:x.options[p.quote.install.opt]||'',qty:1,unit:'식',price:Math.round(ins),note:'수도권 기준'})}
   if(e.ship){ship+=e.ship;shipN++}else if(e.quick){groups['제작물(출력)'].push({item:'퀵 배송',spec:p.name,qty:1,unit:'건',price:null,note:'실비 별도 안내'})}
  }
  return {groups,ship,shipN}}

 function sheet(o){
  const t=o.calc(o.items,o.find),{groups,ship,shipN}=rows(t),today=new Date(),until=new Date(today);until.setDate(until.getDate()+30);
  const td=(v,st='')=>`<td style="${st}">${v}</td>`;let body='';
  for(const [g,list] of Object.entries(groups)){if(!list.length)continue;
   list.forEach((r,i)=>{body+='<tr>'+(i?'':`<td rowspan="${list.length}" class="g">${esc(g)}</td>`)+td(esc(r.item),'text-align:left')+td(esc(r.spec),'text-align:left')+td(r.qty,'text-align:right')+td(r.unit)+td(r.price==null?'-':n0(r.price),'text-align:right')+td(1,'text-align:right')+td(r.price==null?'-':n0(r.price*r.qty),'text-align:right')+td(esc(r.note),'text-align:left;font-size:9pt;color:'+C.note)+'</tr>'});
   const sum=list.reduce((a,r)=>a+(r.price||0)*r.qty,0);body+=`<tr class="sub"><td colspan="7">${esc(g)} 소계</td><td style="text-align:right">${n0(sum)}</td><td></td></tr>`}
  if(ship)body+=`<tr><td class="g">배송 (실비)</td><td style="text-align:left">택배 배송</td><td style="text-align:left">인쇄물 택배</td><td style="text-align:right">${shipN}</td><td>건</td><td style="text-align:right">${n0(ship/shipN)}</td><td style="text-align:right">1</td><td style="text-align:right">${n0(ship)}</td><td style="text-align:left;font-size:9pt;color:${C.note}">실비 정산(부가세 제외)</td></tr>`;
  const sum=(l,v,cls,note='')=>`<tr class="${cls}"><td colspan="7">${l}</td><td style="text-align:right">${v}</td><td style="text-align:left;font-size:9pt">${note}</td></tr>`;
  body+=sum('소계',n0(t.sub),'tot')+sum('부가세 (10%)',n0(t.vat),'plain')+(ship?sum('배송비 (실비)',n0(ship),'plain','부가세 산정 제외'):'')+sum('합계금액',n0(t.total),'grand',t.cut?'만원 미만 절사':'');
  const meta=(l,v)=>`<tr><th>${l}</th><td colspan="8" style="text-align:left">${v}</td></tr>`;
  return `<div class="qs"><h1>산 출 내 역 서</h1><table class="meta">
   ${meta('수신',esc(o.to||'귀하'))}${meta('견적명',esc(o.title||'행사 디자인 서비스'))}
   <tr><th>작성일</th><td colspan="2" style="text-align:left">${ymd(today)}</td><th>유효기간</th><td colspan="5" style="text-align:left">작성일로부터 30일 (${ymd(until)}까지)</td></tr>
   <tr><th>견적업체</th><td colspan="3" style="text-align:left;position:relative">${SELLER.name}</td><th>연락처</th><td colspan="4" style="text-align:left">${SELLER.tel}</td></tr>
   ${meta('담당자',SELLER.person)}
   <tr class="amount"><th>견적금액</th><td colspan="8">금 ${hangul(t.total)}원정 (₩${n0(t.total)}) · 부가세 포함</td></tr></table>
   <table class="body"><colgroup><col style="width:12%"><col style="width:15%"><col style="width:33%"><col style="width:5%"><col style="width:5%"><col style="width:10%"><col style="width:5%"><col style="width:11%"><col style="width:15%"></colgroup>
   <thead><tr><th>구분</th><th>항목</th><th>세부항목</th><th>수량</th><th>단위</th><th>단가</th><th>횟수</th><th>금액</th><th>비고</th></tr></thead><tbody>${body}</tbody></table>
   <p class="foot">홈페이지에서 고른 구성 기준 견적서입니다. 상담에서 빠진 항목이 확인되면 그 부분만 조정합니다. 직인이 찍힌 견적서는 담당자에게 요청해 주세요. 퀵 배송·직접 입력한 사양은 별도 안내합니다.</p></div>`}

 const CSS=`.qs{width:1060px;padding:8px 6px;background:#fff;color:#000;font-family:'Malgun Gothic','맑은 고딕',sans-serif;font-size:10pt}
 .qs h1{margin:0 0 10px;text-align:center;font-size:18pt;letter-spacing:.3em;font-weight:700}
 .qs table{width:100%;border-collapse:collapse;table-layout:fixed}.qs th,.qs td{border:1px solid #7f7f7f;padding:4px 7px;vertical-align:middle;text-align:center;line-height:1.35;word-break:keep-all}
 .qs .meta{margin-bottom:12px;font-size:10pt}.qs .meta th{width:11%;background:${C.label};font-weight:700}
 .qs .meta .amount th,.qs .meta .amount td{background:${C.navy};color:#fff;font-size:12pt;font-weight:700;height:30px}
 .qs .seal{position:absolute;left:58%;top:1px;width:60px;height:60px;opacity:.95}
 .qs .body thead th{background:${C.head};color:#fff;font-size:10pt;height:24px}
 .qs .body td.g{background:#fff;font-weight:700}
 .qs .body .sub td{background:${C.label};font-size:10pt;font-weight:700}
 .qs .body .tot td{background:${C.green};font-weight:700}
 .qs .body .grand td{background:${C.navy};color:#fff;font-size:12pt;font-weight:700}
 .qs td.g.cont{border-top-style:hidden}
 .qs .foot{margin:10px 0 0;font-size:9pt;color:${C.note}}`;

 // 2026-11-09 여러 쪽: html2pdf 자동 쪽나눔은 구분 칸(rowspan)을 깨뜨림. 넘칠 때만 줄 단위로 직접 나누고 쪽마다 머리줄 반복.
 const PAGE_H=720; // A4 가로 여백 8mm 안쪽 높이 ≈ 733px(폭 1060px 기준)
 function paginate(qs){
  if(qs.getBoundingClientRect().height<=PAGE_H)return;
  const table=qs.querySelector('table.body'),tb=table.tBodies[0];let label='';
  for(const tr of tb.rows){const g=tr.querySelector('td.g[rowspan]');
   if(g){label=g.textContent;g.removeAttribute('rowspan');tr.dataset.g=label}
   else if(tr.cells.length===8&&!tr.className){const td=document.createElement('td');td.className='g cont';tr.prepend(td);tr.dataset.g=label}}
  const top=qs.getBoundingClientRect().top,headH=table.tHead.getBoundingClientRect().height,rows=[...tb.rows],hs=rows.map(r=>r.getBoundingClientRect().height);
  const pages=[[]];let used=tb.getBoundingClientRect().top-top;
  rows.forEach((r,i)=>{if(used+hs[i]>PAGE_H&&pages.at(-1).length){pages.push([]);used=16+headH}pages.at(-1).push(r);used+=hs[i]});
  const foot=qs.querySelector('.foot');if(used+foot.getBoundingClientRect().height+10>PAGE_H)pages.push([]);
  let after=qs;
  pages.slice(1).forEach((list,k)=>{const page=document.createElement('div');page.className='qs qs-cont';
   const t=table.cloneNode(false);t.append(table.querySelector('colgroup').cloneNode(true),table.tHead.cloneNode(true));const b=document.createElement('tbody');t.append(b);
   list.forEach((r,i)=>{if(!i){const c=r.querySelector('td.g.cont');if(c){c.className='g';c.textContent=r.dataset.g}}b.append(r)});
   if(list.length)page.append(t);if(k===pages.length-2)page.append(foot);after.after(page);after=page})}

 window.paranQuoteSheet=async function(o){
  const host=document.createElement('div');host.style.cssText='position:fixed;left:-10000px;top:0;z-index:-1';host.innerHTML=`<style>${CSS}</style><div class="qs-doc">`+sheet(o)+'</div>';document.body.append(host);paginate(host.querySelector('.qs'));
  const img=host.querySelector('.seal');if(img&&!img.complete)await new Promise(r=>{img.onload=img.onerror=r});
  const d=new Date(),name=`견적서_파란컴퍼니_${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}.pdf`;
  try{await window.html2pdf().set({margin:[8,8,8,8],filename:name,image:{type:'jpeg',quality:0.96},html2canvas:{scale:2,useCORS:true,backgroundColor:'#ffffff',scrollX:0,scrollY:0},jsPDF:{unit:'mm',format:'a4',orientation:'landscape'},pagebreak:{mode:['css'],before:'.qs-cont'}}).from(host.querySelector('.qs-doc')).save()}
  finally{host.remove()}
 };
})();
