/* 제작과정 장면 1.1(2026-11-03): 어두운 무대 위에서 서비스가 만들어지는 과정을 보여 주고, 아래 단계 카드와 맞춰 진행.
   1.0 대비: 고급스러운 남색 무대·림라이트, 디자인 단계(디자인 프로그램 창에서 면별 대지를 배치) 추가.
   service_live.process가 section[data-ps=<장면 이름>]과 .ps-stage를 넣음. 화면에 보일 때만 움직이고, 움직임 줄이기 설정이면 완성 장면만. */
(()=>{
 const SCENES={
  // 부스·패널: 1 도면(바닥 격자·치수) → 2 디자인(면별 대지 배치 → 벽으로 옮겨 붙음) → 3 제작·설치(기둥·간판·카운터·조명)
  booth(){
   const K=48,KZ=56,OX=430,OY=176;
   const P=(x,y,z=0)=>[OX+(x-y)*K,OY+(x+y)*K/2-z*KZ];
   const f=v=>v.toFixed(1);
   const pts=a=>a.map(p=>P(...p).map(f).join(',')).join(' ');
   const poly=(a,c='',st='')=>`<polygon class="${c}" points="${pts(a)}" ${st}/>`;
   const line=(a,c,st='')=>`<path class="${c}" pathLength="1" d="M${a.map(p=>P(...p).map(f).join(' ')).join('L')}" ${st}/>`;
   const IMG='/assets/service-photos/booth-graphic/kb-design.webp',IW=1600,IH=558,T=IW/3;
   const mat=(o,u,h,iw)=>{const a=P(...o),b=P(...u);return `matrix(${((b[0]-a[0])/iw).toFixed(5)},${((b[1]-a[1])/iw).toFixed(5)},0,${(h*KZ/IH).toFixed(5)},${f(a[0])},${f(a[1])})`};
   let s=`<defs>
    <radialGradient id="psBg" cx="50%" cy="38%" r="75%"><stop offset="0" stop-color="#26305a"/><stop offset=".55" stop-color="#151a33"/><stop offset="1" stop-color="#0b0e1c"/></radialGradient>
    <linearGradient id="psFloor" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".14"/><stop offset="1" stop-color="#ffffff" stop-opacity=".04"/></linearGradient>
    <linearGradient id="psCone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffbe6" stop-opacity=".55"/><stop offset="1" stop-color="#fffbe6" stop-opacity="0"/></linearGradient>
    <linearGradient id="psWin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#f3f4f8"/></linearGradient>
    <filter id="psSoft" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#000" flood-opacity=".45"/></filter>
    <filter id="psGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>
    <clipPath id="psL"><rect width="${T.toFixed(0)}" height="${IH}"/></clipPath>
    <clipPath id="psB1"><rect width="${T.toFixed(0)}" height="${IH}"/></clipPath>
    <clipPath id="psB2"><rect x="${T.toFixed(0)}" width="${T.toFixed(0)}" height="${IH}"/></clipPath>
    ${[0,1,2].map(i=>`<clipPath id="psA${i}"><rect x="${306+i*150}" y="118" width="136" height="113" rx="2"/></clipPath>`).join('')}
   </defs>`;
   s+=`<rect x="120" y="-20" width="770" height="470" fill="url(#psBg)"/>`;
   // 무대 바닥의 은은한 점 격자
   let dots='';for(let x=140;x<890;x+=28)for(let y=0;y<450;y+=28)dots+=`M${x} ${y}h.01`;
   s+=`<path d="${dots}" stroke="#ffffff" stroke-opacity=".07" stroke-width="2" stroke-linecap="round"/>`;
   s+='<g class="cam"><g class="booth">';
   s+=`<ellipse cx="${f(P(3,1.5)[0])}" cy="${f(P(3,1.5)[1]+34)}" rx="300" ry="74" fill="#000" opacity=".45" filter="url(#psGlow)"/>`;
   s+=poly([[0,0],[6,0],[6,3],[0,3]],'fl','fill="url(#psFloor)" stroke="#ffffff" stroke-opacity=".22" stroke-width="1.2"');
   // 1 도면
   let g='';for(let x=1;x<6;x++)g+=line([[x,0],[x,3]],'grid');for(let y=1;y<3;y++)g+=line([[0,y],[6,y]],'grid');s+=g;
   s+=line([[0,3,0],[0,0,0],[6,0,0]],'bp')+line([[0,3,2.5],[0,0,2.5],[6,0,2.5]],'bp')+line([[0,3,0],[0,3,2.5]],'bp')+line([[0,0,0],[0,0,2.5]],'bp')+line([[6,0,0],[6,0,2.5]],'bp')+line([[3,0,0],[3,0,2.5]],'bp');
   s+=line([[0,3.6],[6,3.6]],'dim')+line([[0,3.4],[0,3.8]],'dim')+line([[6,3.4],[6,3.8]],'dim')+line([[6.6,0],[6.6,3]],'dim')+line([[6.4,0],[6.8,0]],'dim')+line([[6.4,3],[6.8,3]],'dim')+line([[6.5,0,0],[6.5,0,2.5]],'dim');
   const lab=(t,at,ang)=>{const p=P(...at);return `<text class="dimt" text-anchor="middle" transform="translate(${f(p[0])} ${f(p[1])}) rotate(${ang})">${t}</text>`};
   s+=lab('6,000',[3,4.05],26.57)+lab('3,000',[7.05,1.5],-26.57)+`<text class="dimt" x="${f(P(6.5,0,1.25)[0]+12)}" y="${f(P(6.5,0,1.25)[1])}">2,500</text>`;
   const pc=P(6,3.6);s+=`<g class="pencil" transform="translate(${f(pc[0]-40)} ${f(pc[1]-70)})"><g><path d="M0 70 46 24l12 12-46 46-15 3z" fill="#d1ff39" stroke="#0b0e1c" stroke-width="2.4" stroke-linejoin="round"/><path d="M38 32l12 12" stroke="#0b0e1c" stroke-width="2.4" stroke-linecap="round"/></g></g>`;
   // 2 벽 + 디자인이 붙음
   s+=poly([[0,3,0],[0,0,0],[0,0,2.5],[0,3,2.5]],'wall','fill="#10152b"')+poly([[0,0,0],[6,0,0],[6,0,2.5],[0,0,2.5]],'wall','fill="#10152b"');
   s+=`<g transform="${mat([0,3,2.5],[0,0,2.5],2.5,T)}"><g clip-path="url(#psL)"><image class="gfx g1" href="${IMG}" width="${IW}" height="${IH}" preserveAspectRatio="none"/></g></g>`;
   s+=`<g transform="${mat([0,0,2.5],[6,0,2.5],2.5,2*T)}"><g clip-path="url(#psB1)"><image class="gfx g2" href="${IMG}" x="${-T}" width="${IW}" height="${IH}" preserveAspectRatio="none"/></g><g clip-path="url(#psB2)"><image class="gfx g3" href="${IMG}" x="${-T}" width="${IW}" height="${IH}" preserveAspectRatio="none"/></g></g>`;
   s+=poly([[0,3,0],[0,0,0],[0,0,2.5],[0,3,2.5]],'shade','fill="#000" fill-opacity=".22"');
   // 림라이트: 벽 윗선·모서리에 얇은 빛
   s+=line([[0,3,2.5],[0,0,2.5],[6,0,2.5]],'rim','fill="none" stroke="#ffffff" stroke-width="1.6" stroke-opacity=".8"')+line([[0,0,0],[0,0,2.5]],'rim','fill="none" stroke="#ffffff" stroke-width="1.2" stroke-opacity=".35"');
   s+=line([[0,3,0.02],[0,0,0.02],[6,0,0.02]],'rim','fill="none" stroke="#d1ff39" stroke-width="2" stroke-opacity=".9"');
   // 3 제작·설치
   s+=poly([[5.9,3,0],[6,3,0],[6,3,2.95],[5.9,3,2.95]],'post','fill="#e9ebf2"')+poly([[6,3,0],[6,2.9,0],[6,2.9,2.95],[6,3,2.95]],'post','fill="#b9bfd0"');
   s+=poly([[0,3,2.5],[6,3,2.5],[6,3,2.95],[0,3,2.95]],'beam','fill="#ffffff"')+poly([[0,3,2.5],[6,3,2.5],[6,3,2.56],[0,3,2.56]],'beam','fill="#d1ff39"');
   {const a=P(0,3,2.95),b=P(6,3,2.95),ang=Math.atan2(b[1]-a[1],b[0]-a[0])*180/Math.PI,m=P(3,3,2.72);
    s+=`<text class="beam" text-anchor="middle" font-family="Pretendard,sans-serif" font-weight="800" font-size="13" letter-spacing=".5" fill="#10152b" transform="translate(${f(m[0])} ${f(m[1]+5)}) rotate(${ang.toFixed(2)})">국민건강보험공단 · AI 건강복지플랫폼</text>`;}
   for(const x of [1.2,3,4.8]){const l=P(x,3,2.5),b=P(x,0.7,0.3);
    s+=`<polygon class="cone" fill="url(#psCone)" points="${f(l[0]-6)},${f(l[1])} ${f(l[0]+6)},${f(l[1])} ${f(b[0]+44)},${f(b[1])} ${f(b[0]-44)},${f(b[1])}"/><circle class="lamp" cx="${f(l[0])}" cy="${f(l[1]+3)}" r="4.5" fill="#fffbe6" filter="url(#psGlow)"/><rect class="lamp" x="${f(l[0]-6)}" y="${f(l[1]-1)}" width="12" height="7" rx="3" fill="#0b0e1c"/>`;}
   const cb=[2,2.1,4.4,2.9,1.05];
   s+=`<g class="counter">`+poly([[cb[0],cb[3],0],[cb[2],cb[3],0],[cb[2],cb[3],cb[4]],[cb[0],cb[3],cb[4]]],'','fill="#f4f5f9"')+poly([[cb[2],cb[3],0],[cb[2],cb[1],0],[cb[2],cb[1],cb[4]],[cb[2],cb[3],cb[4]]],'','fill="#c6cbd9"')+poly([[cb[0],cb[1],cb[4]],[cb[2],cb[1],cb[4]],[cb[2],cb[3],cb[4]],[cb[0],cb[3],cb[4]]],'','fill="#d1ff39"')
    +`<text font-family="Pretendard,sans-serif" font-weight="800" font-size="11" fill="#10152b" text-anchor="middle" transform="translate(${f(P(3.2,2.9,0.5)[0])} ${f(P(3.2,2.9,0.5)[1])}) rotate(26.57)">상담·체험</text></g>`;
   s+=`<g class="mon">`+line([[1,2.4,0],[1,2.4,1.25]],'','stroke="#e9ebf2" stroke-width="3" fill="none"')+poly([[0.55,2.4,1.25],[1.45,2.4,1.25],[1.45,2.4,1.95],[0.55,2.4,1.95]],'','fill="#0b0e1c" stroke="#e9ebf2" stroke-width="1.4"')+line([[0.7,2.4,1.45],[1.3,2.4,1.45]],'','stroke="#d1ff39" stroke-width="3" fill="none"')+line([[0.7,2.4,1.62],[1.15,2.4,1.62]],'','stroke="#8fb3ff" stroke-width="3" fill="none"')+`</g>`;
   const person=(x,y,c,cls)=>{const p=P(x,y);return `<g class="ppl ${cls}"><ellipse cx="${f(p[0])}" cy="${f(p[1])}" rx="13" ry="4.5" fill="#000" opacity=".35"/><path d="M${f(p[0]-11)} ${f(p[1])} c0-32 4-48 11-48 s11 16 11 48z" fill="${c}"/><circle cx="${f(p[0])}" cy="${f(p[1]-58)}" r="9" fill="${c}"/></g>`};
   s+=person(2.6,4.3,'#e9ebf2','a')+person(4.9,3.9,'#8fb3ff','b');
   s+='</g>'; // booth
   // 2 디자인: 디자인 프로그램 창에서 면별 대지(왼쪽·가운데·오른쪽 면)를 배치
   s+=`<g class="win" filter="url(#psSoft)"><rect x="252" y="44" width="516" height="300" rx="14" fill="url(#psWin)"/>
    <rect x="252" y="44" width="516" height="30" rx="14" fill="#e8eaf1"/><rect x="252" y="60" width="516" height="14" fill="#e8eaf1"/>
    <circle cx="272" cy="59" r="4.5" fill="#ff5f57"/><circle cx="287" cy="59" r="4.5" fill="#febc2e"/><circle cx="302" cy="59" r="4.5" fill="#28c840"/>
    <text x="510" y="63" text-anchor="middle" font-family="Pretendard,sans-serif" font-size="11.5" font-weight="700" fill="#5f5d6b">부스그래픽_국민건강보험공단_최종.ai</text>
    <rect x="260" y="84" width="30" height="250" rx="8" fill="#f0f1f6"/>${[0,1,2,3,4].map(i=>`<rect x="268" y="${96+i*26}" width="14" height="14" rx="3" fill="${i===1?'#15141a':'#cfd3de'}"/>`).join('')}
    ${['왼쪽 면','가운데 면','오른쪽 면'].map((t,i)=>`<text x="${306+i*150}" y="110" font-family="Pretendard,sans-serif" font-size="10.5" font-weight="700" fill="#8a8896">${t}</text><rect x="${306+i*150}" y="118" width="136" height="113" rx="2" fill="#e9ebf2"/>`).join('')}
    ${[0,1,2].map(i=>{const x=306+i*150;return `<g class="wf"><rect x="${x+10}" y="128" width="${i===1?116:90}" height="12" rx="2" fill="#cfd3de"/><rect x="${x+10}" y="148" width="116" height="48" rx="3" fill="#dfe2ea"/><rect x="${x+10}" y="204" width="70" height="6" rx="2" fill="#cfd3de"/><rect x="${x+10}" y="215" width="52" height="6" rx="2" fill="#cfd3de"/></g>`}).join('')}
    ${[0,1,2].map(i=>`<g clip-path="url(#psA${i})"><image class="art a${i}" href="${IMG}" x="${306+i*150-i*136}" y="118" width="${136*3}" height="113" preserveAspectRatio="none"/></g>`).join('')}
    <path class="guide" pathLength="1" d="M300 140H750M300 196H750" stroke="#d1ff39" stroke-width="1.4" stroke-dasharray="4 4" fill="none"/>
    <g class="sel"><rect x="454" y="116" width="140" height="117" fill="none" stroke="#2f5bea" stroke-width="1.6"/>${[[454,116],[594,116],[454,233],[594,233]].map(([x,y])=>`<rect x="${x-3.5}" y="${y-3.5}" width="7" height="7" fill="#fff" stroke="#2f5bea" stroke-width="1.4"/>`).join('')}</g>
    <text class="note" x="306" y="262" font-family="Pretendard,sans-serif" font-size="11" font-weight="700" fill="#15141a">면별 그래픽이 이음부에서 끊기지 않게 맞춤</text>
    <rect class="note" x="306" y="272" width="54" height="16" rx="8" fill="#d1ff39"/><text class="note" x="333" y="284" text-anchor="middle" font-family="Pretendard,sans-serif" font-size="9.5" font-weight="800" fill="#15141a">시안 2차</text>
    <g class="cursor"><path d="M0 0v18l5-4.5 3.5 7.5 3-1.4-3.4-7.3H15z" fill="#15141a" stroke="#fff" stroke-width="1.2" stroke-linejoin="round"/></g>
   </g>`;
   const sp=(x,y,z,r,cls)=>{const p=P(x,y,z);return `<path class="spark ${cls}" d="M${f(p[0])} ${f(p[1]-r)}l${r*.28} ${r*.72} ${r*.72} ${r*.28}-${r*.72} ${r*.28}-${r*.28} ${r*.72}-${r*.28}-${r*.72}-${r*.72}-${r*.28} ${r*.72}-${r*.28}z" fill="#d1ff39"/>`};
   s+=sp(6.7,0.3,3.3,14,'a')+sp(-0.5,3.4,3.2,10,'b');
   s+='</g>';
   return s;}
 };
 const sec=document.querySelector('section[data-ps]');if(!sec)return;
 const make=SCENES[sec.dataset.ps];const stage=sec.querySelector('.ps-stage');if(!make||!stage)return;
 stage.querySelector('svg').innerHTML=make();
 const cards=[...sec.querySelectorAll('.pdd-steps')];
 cards.forEach(c=>c.insertAdjacentHTML('beforeend','<span class="ps-bar" aria-hidden="true"><i></i></span>'));
 const DUR=[3200,5200,4000],HOLD=2600;
 if(matchMedia('(prefers-reduced-motion:reduce)').matches){stage.classList.add('s4');return}
 let k=0,tm=null;
 function set(n){stage.classList.remove('s1','s2','s3','s4');void stage.offsetWidth;stage.classList.add('s'+n);
  cards.forEach((c,i)=>{c.classList.remove('ps-on');c.classList.toggle('ps-done',i<n-1||n===4);c.style.setProperty('--d',(DUR[i]||3000)+'ms')});
  if(n<4&&cards[n-1]){void cards[n-1].offsetWidth;cards[n-1].classList.add('ps-on')}}
 function next(){k=k%4+1;set(k);tm=setTimeout(next,k<4?DUR[k-1]:HOLD)}
 new IntersectionObserver(e=>{if(e[0].isIntersecting){if(!tm){k=0;next()}}else{clearTimeout(tm);tm=null}},{threshold:.3}).observe(stage);
})();
