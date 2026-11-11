/* '맡기고, 집중하세요' 장점 아이콘(9개 서비스 공통). 랜딩 '행사를 아는 팀' 아이콘과 같은 방식:
   스크롤해 오면 제목 → 왼쪽부터 한 칸씩 떠오름, 화면 밖으로 완전히 나가면 처음 상태로.
   보이는 동안 왼쪽부터 하나씩 동작(선 그리기 + 라임 톡, 아이콘별 망치질·이동·흔들림)을 반복, 마우스를 올려도 동작. */
(()=>{
 const s=document.querySelector('.benefit-a');if(!s)return;
 const lis=[...s.querySelectorAll('li')];if(!lis.length)return;
 if(matchMedia('(prefers-reduced-motion:reduce)').matches||!('IntersectionObserver' in window))return;
 lis.forEach(li=>li.querySelectorAll('svg :is(path,rect,circle,ellipse,line,polyline)').forEach(el=>el.setAttribute('pathLength','1')));
 document.documentElement.classList.add('bx-on');
 const play=li=>{li.classList.remove('go');void li.offsetWidth;li.classList.add('go')};
 lis.forEach(l=>l.addEventListener('mouseenter',()=>play(l)));
 let k=0,t=null;const tick=()=>{play(lis[k]);k=(k+1)%lis.length;t=setTimeout(tick,1500)};
 new IntersectionObserver(es=>{if(es[0].isIntersecting){if(!t){k=0;t=setTimeout(tick,900)}}else{clearTimeout(t);t=null}},{threshold:.5}).observe(s.querySelector('ul'));
 const h=s.querySelector('h2'),els=[h,...lis].filter(Boolean);let on=false,tm=[];
 const reset=()=>{tm.forEach(clearTimeout);tm=[];s.classList.add('bx-rs');els.forEach(e=>e.classList.remove('in'));void s.offsetWidth;s.classList.remove('bx-rs')};
 new IntersectionObserver(es=>{const e=es[0];if(!e.isIntersecting){if(on){on=false;reset()}return}if(on||e.intersectionRatio<.35)return;on=true;els.forEach((x,j)=>tm.push(setTimeout(()=>x.classList.add('in'),j?150+(j-1)*180:0)))},{threshold:[0,.35]}).observe(s);
})();
