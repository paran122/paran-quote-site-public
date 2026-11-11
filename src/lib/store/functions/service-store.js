/* eslint-disable */
'use strict';
const crypto=require('node:crypto');
const CATALOG=require('../data/catalog.json');
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const TOKEN=/^[0-9a-f]{64}$/i;
const STATUSES=['received','reviewing','contacted','closed'];
const hash=v=>crypto.createHash('sha256').update(v).digest('hex');
function fail(message,status=400){throw Object.assign(new Error(message),{status})}
function text(v,name,max,required=true){if(typeof v!=='string')v='';v=v.trim();if((required&&!v)||v.length>max)fail(name+' 항목을 확인해 주세요.');return v}
// 2026-11-08 견적 금액: 화면(ui/app.js estimate)과 같은 규칙으로 서버에서 다시 계산해 접수에 저장. 카탈로그 금액은 부가세 포함
const VAT=0.1;
// 견적 계산식은 ui/quote-core.js가 원본(빌드가 ../data/quote-core.js로 복사). 화면과 같은 파일
const {man,num,sides,meters,estimate,docTotals}=require('../data/quote-core.js');
function estimateLine(p,v,qty,count=1){const e=estimate(p,v,count,qty);if(!e)return null;return {price:Math.round(e.total),label:Math.round(e.total).toLocaleString('ko-KR')+'원',basis:'디자인 '+man(e.dU)+(e.make?' + '+(p.quote.install?'제작':e.part||'제작')+' '+man(e.mU-(e.inst||0)):'')+(e.inst?' + '+p.quote.install.label+' '+man(e.inst):'')+(e.ship?' + 택배 '+man(e.ship):'')+(e.quick?' + 퀵 배송 실비':''),make:e.make}}
function quoteTotals(items){const t=docTotals(items,id=>CATALOG.find(p=>p.id===id));return {supply:t.sub,vat:t.vat,ship:t.ship,total:t.total,cut:t.cut,unpriced:t.unpriced,priceDate:CATALOG.find(p=>p.priceDate)?.priceDate||null}}
function normalize(b){
 if(!UUID.test(b.id||'')||!TOKEN.test(b.token||''))fail('접수 식별값이 올바르지 않습니다. 페이지를 새로 열어 주세요.');
 if(b.website)fail('요청을 처리할 수 없습니다.');if(b.consent!==true)fail('개인정보 수집·이용 동의가 필요합니다.');
 if(!['services','consult'].includes(b.mode))fail('요청 유형이 올바르지 않습니다.');
 const c=b.customer||{},e=b.event||{};
 const customer={name:text(c.name,'이름',60),organization:text(c.organization,'기관명',100),email:text(c.email,'이메일',160).toLowerCase(),phone:text(c.phone,'연락처',30)};
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email))fail('이메일 주소를 확인해 주세요.');if(!/^[+\d\s().-]{8,30}$/.test(customer.phone)||customer.phone.replace(/\D/g,'').length<8)fail('연락처를 확인해 주세요.');
 const event={title:text(e.title,'행사·작업명',120),date:text(e.date,'날짜',10,false),location:text(e.location,'장소',200,false),budget:text(e.budget,'예산',100,false),brief:text(e.brief,'요청사항',4000,b.mode==='consult')};
 if(event.date&&(!/^\d{4}-\d{2}-\d{2}$/.test(event.date)||new Date(event.date+'T00:00:00Z').toISOString().slice(0,10)!==event.date))fail('날짜를 확인해 주세요.');
 if(!Array.isArray(b.items)||b.items.length>60||b.mode==='services'&&!b.items.length||b.mode==='consult'&&b.items.length)fail('요청 구성을 확인해 주세요.');
 const items=b.items.map(x=>{const p=CATALOG.find(p=>p.id===x?.serviceId);const scope0=typeof x?.options?.scope==='string'?x.options.scope.trim():x?.options?.scope;if(!p)fail('서비스 목록이 변경되었습니다. 장바구니를 다시 확인해 주세요.');if(!Number.isInteger(x.qty)||x.qty<1||x.qty>100000||!Number.isInteger(x.design)||x.design<1||x.design>1000)fail('수량을 확인해 주세요.');const options={};for(const o of p.options){const v=p.digitalScope&&scope0===p.digitalScope&&p.printOnlyOptions?.includes(o.key)?'해당 없음':text(x.options?.[o.key]??o.legacyDefault??o.defaultValue??o.values?.[0],o.label,300);if(!o.allowCustom&&o.values?.length&&!o.values.includes(v)&&v!==o.legacyDefault&&!(v==='해당 없음'&&p.printOnlyOptions?.includes(o.key)))fail(o.label+'의 선택값이 올바르지 않습니다.');options[o.key]=v}const design=p.type==='item'&&p.category!=='현장·운영'?x.design:1;const Q=p.prices&&p.quote,makeQ=Boolean(Q&&p.prices[options.scope]?.addon);if(Q&&Q.print&&makeQ&&x.qty<Q.print.base)fail(Q.print.label+'은 '+Q.print.base+Q.print.unit+' 이상으로 선택해 주세요.');const qtyQ=Q?(Q.print&&makeQ?x.qty:1):null;const est=Q?estimateLine(p,options,qtyQ,Q.count?design:1):null;const hid=k=>(p.digitalScope&&options.scope===p.digitalScope&&p.printOnlyOptions?.includes(k))||Object.entries(Q?.hide?.[k]||{}).some(([a,b])=>Array.isArray(b)?b.includes(options[a]):options[a]===b);if(Q?.maxSize){const o=p.options.find(o=>o.key===Q.maxSize.opt),val=String(options[Q.maxSize.opt]||'');if(o&&!o.values?.includes(val)&&!hid(o.key)){const a=[...val.replace(/(\d),(?=\d{3})/g,'$1').matchAll(/(\d+(?:\.\d+)?)\s*(mm|cm|m)?/gi)].map(m=>parseFloat(m[1])*({cm:10,m:1000}[(m[2]||'').toLowerCase()]||1)).sort((x,y)=>y-x);if(a.length>1&&(a[0]>Q.maxSize.mm[0]||a[1]>Q.maxSize.mm[1]))fail(Q.maxSize.msg||o.label+'는 '+Q.maxSize.mm[0]+' × '+Q.maxSize.mm[1]+'mm 이하로 입력해 주세요.')}}return {estimate:est,serviceId:p.id,name:p.name,unit:p.unit,category:p.category,type:p.type,options,qty:p.digitalScope&&options.scope===p.digitalScope?1:x.qty,design,summary:p.options.filter(o=>!hid(o.key)).map(o=>o.label+': '+options[o.key]).join(' · '),counts:Q?[Q.pages?String(options[Q.pages.opt]||''):'',Q.print&&makeQ?Q.print.label+' '+x.qty+Q.print.unit:''].filter(Boolean).join(' · ')||'기본 구성':p.digitalScope&&options.scope===p.digitalScope?`디자인 ${design}종 · ${p.digitalLabel||'PDF 납품'}`:(p.type==='item'&&p.category!=='현장·운영'?`디자인 ${design}종 · `:'')+`수량 ${x.qty}${p.unit}`,priceMode:est?'ref':'quote'}});
 if(items.length)items.push({serviceId:'_totals',name:'참고 견적 합계',totals:quoteTotals(items)});
 return {customer,event,items,mode:b.mode};
}
exports.normalize=normalize;
