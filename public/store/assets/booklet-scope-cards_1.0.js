/* 2026-11-08 의뢰 범위 카드: 화면에 들어오면 파일 아이콘이 하나씩, 인쇄물 위로 빛이 한 번(.fx-in). 벗어나면 처음으로 */
(()=>{const s=document.querySelector('#booklet-scope.sa-scope'),a=s&&s.querySelector('.fx-files');if(!a)return;
const on=v=>s.classList.toggle('fx-in',v);
if(matchMedia('(prefers-reduced-motion: reduce)').matches){on(true);return}
new IntersectionObserver(e=>{if(!e[0].isIntersecting)on(false);else if(e[0].intersectionRatio>=.4)on(true)},{threshold:[0,.4]}).observe(a)})();
