/* eslint-disable */
/* 견적 계산식 — 화면(ui/app.js)과 서버(site/functions/service-store.js)가 함께 쓰는 단 하나의 원본.
   2026-11-11 전에는 두 파일에 같은 식이 따로 있어 매번 둘 다 고쳐야 했음. 이제 여기만 고치면 됨.
   빌드(build.py)가 이 파일을 /assets/quote-core.js(브라우저)와 site/data/quote-core.js(서버 함수)로 복사함.
   금액 규칙·단가는 여기 없음: 카탈로그의 p.prices(가격표)와 p.quote(price_table.py RULES)에서 옴. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.ParanQuote=factory()})(typeof self!=='undefined'?self:this,function(){'use strict';
// 견적 상자 계산: 가격표(p.prices) + 서비스별 규칙(p.quote). 화면은 부가세 포함, 견적 합계는 공급가 기준(docTotals)
function man(n){n=Math.round(n);if(n<10000)return n.toLocaleString('ko-KR')+'원';if(n%1000===0)return (Number.isInteger(n/10000)?(n/10000).toLocaleString('ko-KR'):(n/10000).toFixed(1))+'만 원';return Math.floor(n/10000).toLocaleString('ko-KR')+'만 '+(n%10000).toLocaleString('ko-KR')+'원'}
function num(t){const m=String(t||'').replace(/(\d),(?=\d{3})/g,'$1').match(/\d+(?:\.\d+)?/);return m?parseFloat(m[0]):0}
// 길이 읽기: 숫자마다 단위(mm·cm·m)를 보고 미터로. 단위가 한 군데만 있으면 나머지도 같은 단위, 아예 없으면 1000 이상=mm, 20 초과=cm, 그 밖=m
function sides(t){const s=String(t||'').replace(/(\d),(?=\d{3})/g,'$1'),r=/(\d+(?:\.\d+)?)\s*(mm|cm|m)?/gi,a=[];let m;while((m=r.exec(s)))a.push([parseFloat(m[1]),(m[2]||'').toLowerCase()]);const u=(a.find(x=>x[1])||[])[1]||'';return a.map(([n,x])=>{x=x||u;return x==='mm'?n/1000:x==='cm'?n/100:x==='m'?n:n>=1000?n/1000:n>20?n/100:n})}
// 기본은 첫 숫자(가로), long=true면 긴 변(현수막은 '0.9m × 5m'처럼 순서가 바뀌어도 긴 쪽이 길이)
function meters(t,long=false){const a=sides(t);return a.length?(long?Math.max(...a):a[0]):0}
function isMake(p,v){const s=p.prices?.[v.scope];return Boolean(s&&s.addon)}
function estimateBase(p,v,count=1,qty=1,raw=false){const q=p.quote,pr=p.prices;if(!q||!pr)return null;if(v.scope!==undefined&&!pr[v.scope])return null;const all=Object.values(pr),d=all[0],s=pr[v.scope]||d,make=Boolean(s.addon);
 // raw=true: 공급가(견적서용, 부가세 별도) / false: 사이트 표시가(부가세 포함)
 const own=x=>raw?x.own_s:x.own,ex_=x=>(raw?x.own_extra_s:x.own_extra)||0,B=raw&&q.banner_s?q.banner_s:q.banner;let dU=own(d),mU=make?own(s):0,mX=make?ex_(s):0;
 if(B){const x=v.kind==='X배너';dU=x?B.x.design:B.h.design;if(make){const g=v.kind==='대형 현수막'&&B.big;if(x)mU=B.x.make+(v.stand==='실내 거치대'?B.x.stand:0);else if(g){/* 폭 3m 통천: 두 변이 모두 폭 이내면 짧은 변이 길이, 아니면 긴 변 */const a=sides(v.bigSize),hi=a.length?Math.max(...a):g.tiers[0][0],L=a.length>1&&hi<=g.width+1e-9?Math.min(...a):hi,t=g.tiers,k=t.find(y=>L<=y[0]+1e-9),z=t[t.length-1];mU=k?k[1]:z[1]+Math.ceil((L-z[0])*2-1e-9)*g.overHalf}else mU=Math.ceil((meters(v.size,true)||1)-1e-9)*B.h.perM;mU*=qty}}
 else{if(q.len){const ex=Math.max(0,Math.ceil(meters(v[q.len.opt])-q.len.base-1e-9));dU+=ex*ex_(d);if(make)mU+=ex*ex_(s)}
  if(q.pages){const ex=Math.max(0,num(v[q.pages.opt])-q.pages.base);dU+=ex*ex_(d)}
  if(q.scale){const k=Object.keys(q.scale.map).find(k=>String(v[q.scale.opt]||'').startsWith(k));dU*=k?q.scale.map[k]:1}
  if(make){const k=q.sizes&&Object.keys(q.sizes.map).find(k=>String(v[q.sizes.opt]||'').startsWith(k)),z=k?q.sizes.map[k]:null;if(z){mU=raw?z.own_s:z.own;mX=raw?z.ex_s:z.ex}const pm=z&&z.pp_s!=null?z:(!z&&q.pmake)||null,pg=q.pages&&num(v[q.pages.opt]);if(pm&&pg>0){const dp=pg-q.pages.base;mU+=dp*(raw?pm.pp_s:pm.pp);mX+=dp*(raw?pm.ppx_s:pm.ppx);mU=Math.round(mU/1000)*1000;mX=Math.round(mX/1000)*1000}}
  if(make)for(const a of q.adj||[])if(String(v[a.opt]||'').startsWith(a.val)){mU+=raw?a.own_s:a.own;mX+=raw?a.ex_s:a.ex}
  if(make&&q.print){mU+=Math.max(0,Math.ceil((qty-q.print.base)/q.print.step))*mX}}
 const ship=make&&q.parcel&&v.delivery!=='퀵 배송'?q.parcel:0;
 const iz=make&&q.install&&!(q.install.not||[]).includes(v.scope)?q.install.map[v[q.install.opt]]:null,inst=iz?(raw?iz.fee_s:iz.fee):0;mU+=inst;
 const n=q.count?count:1;return {total:(dU+mU)*n+ship,dU,mU,inst,n,make,part:s.part,ship,quick:make&&q.parcel&&!ship}}
// 2026-11-12 화면 표시가도 견적서와 같은 식으로: 공급가 × 1.1 + 배송비. 예전엔 천 원 단위로 반올림한 표시가를 써서 품목 금액과 합계가 몇백 원 달랐음
function estimate(p,v,count=1,qty=1,raw=false){const e=estimateBase(p,v,count,qty,true);if(!e||raw)return e;const sub=Math.round(e.dU+e.mU)*e.n;return {...e,dU:e.dU*1.1,mU:e.mU*1.1,inst:(e.inst||0)*1.1,total:sub+Math.trunc(sub*0.1)+e.ship}}
/* 견적 합계(회사 견적서 규칙 v2.5 디자인 트랙): 공급가 합 → 부가세 TRUNC 10% → 배송비 실비(부가세 없음) → 합계(절사 없음, 2026-11-12) */
function docTotals(items,find){const lines=items.map(x=>{const p=find(x.serviceId);const e=p&&estimate(p,x.options||{},x.design||1,x.qty||1,true);return {x,p,e}});const priced=lines.filter(l=>l.e);
 const sub=priced.reduce((a,l)=>a+Math.round(l.e.dU+l.e.mU)*l.e.n,0),vat=Math.trunc(sub*0.1),ship=priced.reduce((a,l)=>a+l.e.ship,0),total=sub+vat+ship;
 return {lines,sub,vat,ship,total,unpriced:lines.length-priced.length}}
return {man,num,sides,meters,isMake,estimate,docTotals}});
