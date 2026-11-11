/* 2026-11-08 제작 전 확인사항 카드: 화면에 30% 들어오면 차례로 떠오름(.nt-in), 벗어나면 처음으로. 움직임 줄이기면 그대로 보임 */
(()=>{const s=document.querySelector('#service-notes.nt-cards'),g=s&&s.querySelector('.nt7');if(!g)return;
if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;s.classList.add('nt-anim');
new IntersectionObserver(e=>{if(!e[0].isIntersecting)s.classList.remove('nt-in');else if(e[0].intersectionRatio>=.3)s.classList.add('nt-in')},{threshold:[0,.3]}).observe(g)})();
