/* 제작과정 장면(2026-11-03): 섹션 위에 그 서비스가 만들어지는 과정을 그림으로 보여 주고, 아래 단계 카드와 맞춰 1→2→3 차례로 진행.
   service_live.process가 section[data-ps=<장면 이름>]과 .ps-stage를 넣음. 화면에 보일 때만 움직이고, 움직임 줄이기 설정이면 완성 장면만 보여 줌. */
(()=>{
 const SCENES={
  // 부스·패널: 아이소메트릭 부스. 바닥 도면·치수 → 실제 부스 디자인(kb-design)이 벽에 붙음 → 기둥·간판·카운터·조명·방문객
  booth(){
  const K=48,KZ=56,OX=430,OY=170;
  const P=(x,y,z=0)=>[OX+(x-y)*K,OY+(x+y)*K/2-z*KZ];
  const pts=a=>a.map(p=>P(...p).map(v=>v.toFixed(1)).join(',')).join(' ');
  const poly=(a,c='',st='')=>`<polygon class="${c}" points="${pts(a)}" ${st}/>`;
  const line=(a,c,extra='')=>`<path class="${c}" pathLength="1" d="M${a.map(p=>P(...p).map(v=>v.toFixed(1)).join(' ')).join('L')}" ${extra}/>`;
  const IMG='/assets/service-photos/booth-graphic/kb-design.webp',IW=1600,IH=558,T=IW/3;
  // 벽면에 이미지를 붙이는 변환: 왼위 꼭짓점, 가로 방향(1단위당), 세로(높이 전체)
  const mat=(o,u,w,h,iw)=>{const a=P(...o),b=P(...u);return `matrix(${((b[0]-a[0])/iw).toFixed(5)},${((b[1]-a[1])/iw).toFixed(5)},0,${(h*KZ/IH).toFixed(5)},${a[0].toFixed(1)},${a[1].toFixed(1)})`};
  let s='<defs><clipPath id="cl"><rect x="0" y="0" width="'+T.toFixed(0)+'" height="'+IH+'"/></clipPath><clipPath id="cb1"><rect x="0" y="0" width="'+T.toFixed(0)+'" height="'+IH+'"/></clipPath><clipPath id="cb2"><rect x="'+T.toFixed(0)+'" y="0" width="'+T.toFixed(0)+'" height="'+IH+'"/></clipPath>'
   +'<linearGradient id="cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d1ff39" stop-opacity=".55"/><stop offset="1" stop-color="#d1ff39" stop-opacity="0"/></linearGradient></defs>';
  s+='<g class="cam">';
  s+=`<ellipse class="shadow" cx="${P(3,1.5)[0]}" cy="${P(3,1.5)[1]+30}" rx="290" ry="70"/>`;
  s+=poly([[0,0],[6,0],[6,3],[0,3]],'fl');
  // 1단계: 바닥 격자·벽 도면·치수
  let g='';for(let x=1;x<6;x++)g+=line([[x,0],[x,3]],'grid');for(let y=1;y<3;y++)g+=line([[0,y],[6,y]],'grid');s+=g;
  s+=line([[0,3,0],[0,0,0],[6,0,0]],'bp')+line([[0,3,2.5],[0,0,2.5],[6,0,2.5]],'bp')+line([[0,3,0],[0,3,2.5]],'bp')+line([[0,0,0],[0,0,2.5]],'bp')+line([[6,0,0],[6,0,2.5]],'bp');
  s+=line([[0,3.6],[6,3.6]],'dim')+line([[0,3.4],[0,3.8]],'dim')+line([[6,3.4],[6,3.8]],'dim');
  s+=line([[6.6,0],[6.6,3]],'dim')+line([[6.4,0],[6.8,0]],'dim')+line([[6.4,3],[6.8,3]],'dim');
  s+=line([[6.5,0,0],[6.5,0,2.5]],'dim');
  const lab=(t,at,ang)=>{const p=P(...at);return `<text class="dimt" text-anchor="middle" transform="translate(${p[0].toFixed(1)} ${p[1].toFixed(1)}) rotate(${ang})">${t}</text>`};
  s+=lab('6,000',[3,4.05],26.57)+lab('3,000',[7.05,1.5],-26.57)+`<text class="dimt" x="${P(6.5,0,1.25)[0]+12}" y="${P(6.5,0,1.25)[1]}">2,500</text>`;
  const pc=P(6,3.6);s+=`<g class="pencil" transform="translate(${pc[0]-40} ${pc[1]-70})"><g><path d="M0 70 46 24l12 12-46 46-15 3z" fill="#d1ff39" stroke="#15141a" stroke-width="2.6" stroke-linejoin="round"/><path d="M38 32l12 12M-3 85l6-4" stroke="#15141a" stroke-width="2.6" stroke-linecap="round"/></g></g>`;
  // 2단계: 벽이 서고 그래픽이 위에서 내려와 붙음
  s+=poly([[0,3,0],[0,0,0],[0,0,2.5],[0,3,2.5]],'wall','fill="#1b2340"');
  s+=poly([[0,0,0],[6,0,0],[6,0,2.5],[0,0,2.5]],'wall','fill="#1b2340"');
  s+=`<g transform="${mat([0,3,2.5],[0,0,2.5],3,2.5,T)}"><g clip-path="url(#cl)"><image class="gfx g1" href="${IMG}" x="0" y="0" width="${IW}" height="${IH}" preserveAspectRatio="none"/></g></g>`;
  s+=`<g transform="${mat([0,0,2.5],[6,0,2.5],6,2.5,2*T)}"><g clip-path="url(#cb1)"><image class="gfx g2" href="${IMG}" x="${-T}" y="0" width="${IW}" height="${IH}" preserveAspectRatio="none"/></g><g clip-path="url(#cb2)"><image class="gfx g3" href="${IMG}" x="${-T}" y="0" width="${IW}" height="${IH}" preserveAspectRatio="none"/></g></g>`;
  s+=poly([[0,3,0],[0,0,0],[0,0,2.5],[0,3,2.5]],'shade','fill="#000" fill-opacity=".14"');
  s+=line([[0,0,0],[0,0,2.5]],'seam','stroke="#d1ff39" stroke-width="3" fill="none" stroke-dasharray="6 6"')+line([[3,0,0],[3,0,2.5]],'seam','stroke="#d1ff39" stroke-width="3" fill="none" stroke-dasharray="6 6"');
  // 벽 윗면 두께
  s+=poly([[0,3,2.5],[0,0,2.5],[0.12,0,2.5],[0.12,3,2.5]],'wall','fill="#e8eaf2"')+poly([[0,0,2.5],[6,0,2.5],[6,0.12,2.5],[0.12,0.12,2.5]],'wall','fill="#e8eaf2"');
  // 3단계: 기둥·앞 간판·조명·카운터·모니터·방문객
  s+=poly([[5.88,3,0],[6,3,0],[6,3,2.9],[5.88,3,2.9]],'post','fill="#cfd3de"')+poly([[6,3,0],[6,2.88,0],[6,2.88,2.9],[6,3,2.9]],'post','fill="#b7bccb"');
  s+=poly([[0,3,2.5],[6,3,2.5],[6,3,2.95],[0,3,2.95]],'beam','fill="#ffffff" stroke="#15141a" stroke-width="1.6"')+poly([[0,3,2.5],[6,3,2.5],[6,3,2.57],[0,3,2.57]],'beam','fill="#d1ff39"');  // 앞 간판: 흰 바탕(뒤 어두운 벽과 구분) + 라임 띠
  {const a=P(0,3,2.95),b=P(6,3,2.95);const ang=Math.atan2(b[1]-a[1],b[0]-a[0])*180/Math.PI;const m=P(3,3,2.72);
   s+=`<text class="beam" text-anchor="middle" font-family="Pretendard,sans-serif" font-weight="800" font-size="13.5" fill="#15141a" transform="translate(${m[0].toFixed(1)} ${(m[1]+5).toFixed(1)}) rotate(${ang.toFixed(2)})">국민건강보험공단 · AI 건강복지플랫폼</text>`;}
  for(const x of [1.2,3,4.8]){const l=P(x,3,2.5);s+=`<polygon class="cone" fill="url(#cone)" points="${l[0]-8},${l[1]} ${l[0]+8},${l[1]} ${P(x,0.6,0.4)[0]+38},${P(x,0.6,0.4)[1]} ${P(x,0.6,0.4)[0]-38},${P(x,0.6,0.4)[1]}"/><rect class="lamp" x="${l[0]-7}" y="${l[1]-2}" width="14" height="9" rx="3" fill="#15141a"/>`;}
  // 카운터(윗면 라임)
  const cb=[2,2.1,4.4,2.9,1.05];
  s+=`<g class="counter">`+poly([[cb[0],cb[3],0],[cb[2],cb[3],0],[cb[2],cb[3],cb[4]],[cb[0],cb[3],cb[4]]],'','fill="#ffffff" stroke="#15141a" stroke-width="1.6"')+poly([[cb[2],cb[3],0],[cb[2],cb[1],0],[cb[2],cb[1],cb[4]],[cb[2],cb[3],cb[4]]],'','fill="#e6e8ef" stroke="#15141a" stroke-width="1.6"')+poly([[cb[0],cb[1],cb[4]],[cb[2],cb[1],cb[4]],[cb[2],cb[3],cb[4]],[cb[0],cb[3],cb[4]]],'','fill="#d1ff39" stroke="#15141a" stroke-width="1.6"')
   +`<text font-family="Pretendard,sans-serif" font-weight="800" font-size="12" fill="#15141a" text-anchor="middle" transform="translate(${P(3.2,2.9,0.5)[0].toFixed(1)} ${P(3.2,2.9,0.5)[1].toFixed(1)}) rotate(26.57)">상담·체험</text></g>`;
  // 모니터 스탠드
  s+=`<g class="mon">`+line([[1,2.4,0],[1,2.4,1.25]],'','stroke="#15141a" stroke-width="3" fill="none"')+poly([[0.55,2.4,1.25],[1.45,2.4,1.25],[1.45,2.4,1.95],[0.55,2.4,1.95]],'','fill="#141a33" stroke="#15141a" stroke-width="1.6"')+line([[0.7,2.4,1.45],[1.3,2.4,1.45]],'','stroke="#d1ff39" stroke-width="3" fill="none"')+line([[0.7,2.4,1.62],[1.15,2.4,1.62]],'','stroke="#8ea2ff" stroke-width="3" fill="none"')+`</g>`;
  // 방문객 두 명
  const person=(x,y,c,cls)=>{const p=P(x,y);return `<g class="ppl ${cls}"><ellipse cx="${p[0]}" cy="${p[1]}" rx="14" ry="5" fill="#000" opacity=".12"/><path d="M${p[0]-12} ${p[1]} c0-34 4-52 12-52 s12 18 12 52z" fill="${c}"/><circle cx="${p[0]}" cy="${p[1]-62}" r="10" fill="#15141a"/></g>`};
  s+=person(2.6,4.3,'#2f5bea','a')+person(4.9,3.9,'#15141a','b');
  const sp=(x,y,z,r,cls)=>{const p=P(x,y,z);return `<path class="spark ${cls}" d="M${p[0]} ${p[1]-r}l${r*.3} ${r*.7} ${r*.7} ${r*.3}-${r*.7} ${r*.3}-${r*.3} ${r*.7}-${r*.3}-${r*.7}-${r*.7}-${r*.3} ${r*.7}-${r*.3}z" fill="#d1ff39" stroke="#15141a" stroke-width="2" stroke-linejoin="round"/>`};
  s+=sp(6.6,0.4,3.2,16,'a')+sp(-0.5,3.4,3.1,11,'b');
  s+='</g>';
  return s;}
 };
 const sec=document.querySelector('section[data-ps]');if(!sec)return;
 const make=SCENES[sec.dataset.ps];const stage=sec.querySelector('.ps-stage');if(!make||!stage)return;
 stage.querySelector('svg').innerHTML=make();
 const cards=[...sec.querySelectorAll('.pdd-steps')];
 cards.forEach(c=>c.insertAdjacentHTML('beforeend','<span class="ps-bar" aria-hidden="true"><i></i></span>'));
 const DUR=[3000,2800,3800],HOLD=2200;
 const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
 if(reduce){stage.classList.add('s4');return}
 let k=0,tm=null;
 function set(n){stage.className='ps-stage';void stage.offsetWidth;stage.classList.add('s'+n);
  cards.forEach((c,i)=>{c.classList.remove('ps-on');c.classList.toggle('ps-done',i<n-1||n===4);c.style.setProperty('--d',(DUR[i]||3000)+'ms')});
  if(n<4&&cards[n-1]){void cards[n-1].offsetWidth;cards[n-1].classList.add('ps-on')}}
 function next(){k=k%4+1;set(k);tm=setTimeout(next,k<4?DUR[k-1]:HOLD)}
 new IntersectionObserver(e=>{if(e[0].isIntersecting){if(!tm){k=0;next()}}else{clearTimeout(tm);tm=null}},{threshold:.3}).observe(stage);
})();
