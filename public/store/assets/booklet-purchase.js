(() => {
 const panel=document.querySelector('.booklet-quote-column');
 const bar=document.querySelector('.booklet-mobile-quote');
 if(!panel||!bar)return;
 const root=document.documentElement,narrow=matchMedia('(max-width:1099px)');
 // 2026-11-11 좁은 화면: 옵션 폼을 페이지 맨 아래 대신 아래에서 올라오는 창으로. 하단 바 금액은 고른 옵션대로 바뀜
 const backdrop=document.createElement('div');backdrop.className='bq-backdrop';document.body.append(backdrop);
 const closeBtn=document.createElement('button');closeBtn.type='button';closeBtn.className='bq-close';closeBtn.setAttribute('aria-label','옵션 창 닫기');closeBtn.textContent='×';panel.prepend(closeBtn);
 let opener=null;
 const isOpen=()=>root.classList.contains('bq-open');
 function open(from){opener=from||null;panel.scrollTop=0;root.classList.add('bq-open');panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-label','요청할 구성 선택');closeBtn.focus({preventScroll:true})}
 function close(){if(!isOpen())return;root.classList.remove('bq-open');panel.removeAttribute('role');panel.removeAttribute('aria-modal');panel.removeAttribute('aria-label');opener?.focus?.({preventScroll:true});opener=null}
 backdrop.addEventListener('click',close);closeBtn.addEventListener('click',close);
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&isOpen()&&!e.defaultPrevented)close()});
 narrow.addEventListener('change',()=>{if(!narrow.matches)close()});
 // 하단 바 금액: 옵션 폼의 예상금액을 그대로 따라감
 const priceOut=bar.querySelector('span');
 // 옵션 창 아래 고정: 옵션이 길어도 금액과 담기 버튼이 항상 보이게(좁은 화면에서만 보임)
 const foot=document.createElement('div');foot.className='bq-foot';foot.hidden=true;foot.innerHTML='<div><small>예상금액 · 부가세 포함</small><b></b></div><button type="button" class="button primary"></button>';panel.append(foot);
 const footPrice=foot.querySelector('b'),footBtn=foot.querySelector('button');
 footBtn.addEventListener('click',()=>{const form=panel.querySelector('form.config-form');if(!form)return;form.requestSubmit?form.requestSubmit():form.querySelector('.commit')?.click();setTimeout(()=>{const err=form.querySelector('.config-error:not([hidden])')||panel.querySelector('.added-link');err?.scrollIntoView({block:'center',behavior:'smooth'})},50)});
 const syncPrice=()=>{const s=panel.querySelector('.config-price strong'),c=panel.querySelector('form.config-form .commit');const t=s?s.textContent.trim():'';if(t&&priceOut){const v=t+' · 부가세 포함';if(priceOut.textContent!==v)priceOut.textContent=v}if(t&&footPrice.textContent!==t)footPrice.textContent=t;if(c&&footBtn.textContent!==c.textContent)footBtn.textContent=c.textContent;if(foot.hidden!==!c)foot.hidden=!c};
 new MutationObserver(syncPrice).observe(panel,{subtree:true,childList:true,characterData:true});syncPrice();
 new IntersectionObserver(entries=>{if(!narrow.matches)bar.hidden=entries[0].isIntersecting;else bar.hidden=false;},{threshold:0}).observe(panel);
 document.querySelectorAll('.booklet-sales a[href="#configure"]').forEach(link=>link.addEventListener('click',event=>{
  const target=document.querySelector('#configure');
  if(!target)return;
  event.preventDefault();
  if(narrow.matches){open(link);return}
  const sticky=document.querySelector('.booklet-quote-sticky');
  const behavior=matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth';
  sticky.scrollTop=0;
  const rect=sticky.getBoundingClientRect();
  if(rect.top<0||rect.bottom<160||rect.top>innerHeight-80)panel.scrollIntoView({block:'start',behavior});
  const input=target.querySelector('button,input,select,a');
  input?.focus({preventScroll:true});
 }));
})();
