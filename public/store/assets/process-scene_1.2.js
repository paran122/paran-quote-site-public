/* 제작과정 장면 1.2(2026-11-04): 1.1에서 덜어 냄 — 밝은 바탕, 사람·반짝이·조명 빛줄기·연필·발광 없이 핵심만.
   1.1(2026-11-03): 어두운 무대 위에서 서비스가 만들어지는 과정을 보여 주고, 아래 단계 카드와 맞춰 진행.
   1.0 대비: 고급스러운 남색 무대·림라이트, 디자인 단계(디자인 프로그램 창에서 면별 대지를 배치) 추가.
   service_live.process가 section[data-ps=<장면 이름>]과 .ps-stage를 넣음. 화면에 보일 때만 움직이고, 움직임 줄이기 설정이면 완성 장면만. */
(()=>{
 const SCENES={
  // 부스·패널: 1 디자인(디자인 프로그램에서 면별 대지) → 2 도면에 맞춰 붙이기(격자·치수 → 벽에 디자인) → 3 제작·설치(완성된 벽 위로 빛이 한 번 지나감)
  booth(v='none'){
   const K=48,KZ=56,OX=430,OY=176;
   const P=(x,y,z=0)=>[OX+(x-y)*K,OY+(x+y)*K/2-z*KZ];
   const f=v=>v.toFixed(1);
   const pts=a=>a.map(p=>P(...p).map(f).join(',')).join(' ');
   const poly=(a,c='',st='')=>`<polygon class="${c}" points="${pts(a)}" ${st}/>`;
   const line=(a,c,st='')=>`<path class="${c}" pathLength="1" d="M${a.map(p=>P(...p).map(f).join(' ')).join('L')}" ${st}/>`;
   const IMG='/assets/service-photos/booth-graphic/kb-design.webp',IW=1600,IH=558,T=IW/3;
   const mat=(o,u,h,iw)=>{const a=P(...o),b=P(...u);return `matrix(${((b[0]-a[0])/iw).toFixed(5)},${((b[1]-a[1])/iw).toFixed(5)},0,${(h*KZ/IH).toFixed(5)},${f(a[0])},${f(a[1])})`};
   let s=`<defs>
    <radialGradient id="psBg" cx="50%" cy="38%" r="75%"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#f3f4f8"/><stop offset="1" stop-color="#eaecf2"/></radialGradient>
    <linearGradient id="psFloor" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="1"/><stop offset="1" stop-color="#f7f8fb" stop-opacity="1"/></linearGradient>
    <linearGradient id="psCone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffbe6" stop-opacity=".55"/><stop offset="1" stop-color="#fffbe6" stop-opacity="0"/></linearGradient>
    <linearGradient id="psWin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#f3f4f8"/></linearGradient>
    <filter id="psSoft" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#000" flood-opacity=".45"/></filter>
    <filter id="psGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>
    <clipPath id="psL"><rect width="${T.toFixed(0)}" height="${IH}"/></clipPath>
    <clipPath id="psB1"><rect width="${T.toFixed(0)}" height="${IH}"/></clipPath>
    <clipPath id="psB2"><rect x="${T.toFixed(0)}" width="${T.toFixed(0)}" height="${IH}"/></clipPath>
    ${[0,1,2].map(i=>`<clipPath id="psA${i}"><rect x="${306+i*150}" y="118" width="136" height="113" rx="2"/></clipPath>`).join('')}
    <linearGradient id="psSheen" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <clipPath id="psWalls"><polygon points="${pts([[0,3,0],[0,0,0],[0,0,2.5],[0,3,2.5]])}"/><polygon points="${pts([[0,0,0],[6,0,0],[6,0,2.5],[0,0,2.5]])}"/></clipPath>
   </defs>`;
   s+=`<rect x="120" y="-20" width="770" height="470" fill="url(#psBg)"/>`;
   // 무대 바닥의 은은한 점 격자
   let dots='';for(let x=140;x<890;x+=28)for(let y=0;y<450;y+=28)dots+=`M${x} ${y}h.01`;
   s+=`<path d="${dots}" stroke="#15141a" stroke-opacity="0" stroke-width="2" stroke-linecap="round"/>`;
   s+='<g class="cam"><g class="booth">';
   s+=`<ellipse cx="${f(P(3,1.5)[0])}" cy="${f(P(3,1.5)[1]+34)}" rx="300" ry="74" fill="#aab1c4" opacity=".35" filter="url(#psGlow)"/>`;
   s+=poly([[0,0],[6,0],[6,3],[0,3]],'fl','fill="url(#psFloor)" stroke="#d5d9e4" stroke-width="1.2"');
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
   s+=line([[0,3,2.5],[0,0,2.5],[6,0,2.5]],'rim','fill="none" stroke="#15141a" stroke-width="1.2" stroke-opacity=".5"')+line([[0,0,0],[0,0,2.5]],'rim','fill="none" stroke="#15141a" stroke-width="1" stroke-opacity=".25"');
   s+=line([[0,3,0.02],[0,0,0.02],[6,0,0.02]],'rim','fill="none" stroke="#15141a" stroke-width="1.2" stroke-opacity=".35"');
   // 3 제작·설치: 벽과 같은 남색으로 맞춘 앞 간판(두께 있는 띠 + 흰 글자 + 라임 실선)과 인포 데스크. 얇은 기둥 하나로 간판을 받침
   const NV='#10152b',NV2='#2b3566',NV3='#0a0d1c';  // NV2: 윗면·옆면을 조금 밝게 해 뒤 벽과 구분
   // 간판·인포 데스크(v): none(기본, 2026-11-04 사용자 결정으로 넣지 않음) / frame=사각 기둥 / tower=사인 타워 / top=뒷벽 위 간판
   const box=(x0,y0,x1,y1,z0,z1,cf,cs,ct)=>poly([[x0,y1,z0],[x1,y1,z0],[x1,y1,z1],[x0,y1,z1]],'',`fill="${cf}"`)+poly([[x1,y1,z0],[x1,y0,z0],[x1,y0,z1],[x1,y1,z1]],'',`fill="${cs}"`)+poly([[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]],'',`fill="${ct}"`);
   const label=(txt,x0,x1,y,z,size)=>{const a=P(x0,y,z),b=P(x1,y,z),ang=Math.atan2(b[1]-a[1],b[0]-a[0])*180/Math.PI,m=P((x0+x1)/2,y,z);return `<text text-anchor="middle" font-family="Pretendard,sans-serif" font-weight="700" font-size="${size}" letter-spacing="1.5" fill="#ffffff" transform="translate(${f(m[0])} ${f(m[1]+4)}) rotate(${ang.toFixed(2)})">${txt}</text>`};
   const TXT='국민건강보험공단  ·  AI 건강복지플랫폼';
   if(v==='top'){
    s+=`<g class="beam">`+box(0.6,0.02,5.4,0.2,2.5,2.92,NV,NV2,'#3a4578')+poly([[0.6,0.2,2.5],[5.4,0.2,2.5],[5.4,0.2,2.525],[0.6,0.2,2.525]],'','fill="#d1ff39"')+label(TXT,0.6,5.4,0.2,2.72,11.5)+`</g>`;
   }else if(v==='tower'){
    s+=`<g class="post">`+box(5.45,2.7,6,3,0,2.98,NV,NV2,'#3a4578')+poly([[5.53,3,0.3],[5.58,3,0.3],[5.58,3,2.4],[5.53,3,2.4]],'','fill="#d1ff39"')+`</g>`;
    s+=`<g class="beam">`+box(0,2.82,5.45,3,2.54,2.86,NV,NV2,'#2b3566')+poly([[0,3,2.54],[5.45,3,2.54],[5.45,3,2.565],[0,3,2.565]],'','fill="#d1ff39"')+label(TXT,0,5.45,3,2.66,11.5)+`</g>`;
   }else if(v==='frame'){
    s+=`<g class="post">`+box(5.84,2.84,6.06,3.06,0,0.035,'#c9cdd8','#b4b9c7','#e3e6ee')+box(5.9,2.9,6,3,0.035,2.86,NV,NV2,NV2)+poly([[5.9,3,0.035],[5.915,3,0.035],[5.915,3,2.86],[5.9,3,2.86]],'','fill="#ffffff" fill-opacity=".35"')+`</g>`;
    s+=`<g class="beam">`+box(0,2.82,6,3,2.54,2.86,NV,NV2,'#2b3566')+poly([[0,3,2.54],[6,3,2.54],[6,3,2.565],[0,3,2.565]],'','fill="#d1ff39"')+label(TXT,0,6,3,2.66,11.5)+`</g>`;
   }
   // 인포 데스크: 남색 몸체 + 밝은 상판(두께) + 아래 걸레받이, 앞면에 라임 선과 INFO
   const D=[2.3,2.2,3.9,2.85,0.95];
   if(v!=='none')s+=`<g class="counter">`
    +poly([[D[0],D[3],0],[D[2],D[3],0],[D[2],D[3],D[4]],[D[0],D[3],D[4]]],'',`fill="${NV}"`)
    +poly([[D[2],D[3],0],[D[2],D[1],0],[D[2],D[1],D[4]],[D[2],D[3],D[4]]],'',`fill="${NV2}"`)
    +poly([[D[0],D[3],0],[D[2],D[3],0],[D[2],D[3],0.07],[D[0],D[3],0.07]],'',`fill="${NV3}"`)
    +poly([[D[0]-0.05,D[1]-0.05,D[4]+0.06],[D[2]+0.05,D[1]-0.05,D[4]+0.06],[D[2]+0.05,D[3]+0.05,D[4]+0.06],[D[0]-0.05,D[3]+0.05,D[4]+0.06]],'','fill="#f4f5f9"')
    +poly([[D[0]-0.05,D[3]+0.05,D[4]],[D[2]+0.05,D[3]+0.05,D[4]],[D[2]+0.05,D[3]+0.05,D[4]+0.06],[D[0]-0.05,D[3]+0.05,D[4]+0.06]],'','fill="#dde0e8"')
    +poly([[D[2]+0.05,D[3]+0.05,D[4]],[D[2]+0.05,D[1]-0.05,D[4]],[D[2]+0.05,D[1]-0.05,D[4]+0.06],[D[2]+0.05,D[3]+0.05,D[4]+0.06]],'','fill="#c9cdd8"')
    +poly([[D[0]+0.25,D[3],0.52],[D[2]-0.25,D[3],0.52],[D[2]-0.25,D[3],0.545],[D[0]+0.25,D[3],0.545]],'','fill="#d1ff39"')
    +`<text font-family="Pretendard,sans-serif" font-weight="700" font-size="9.5" letter-spacing="2" fill="#ffffff" text-anchor="middle" transform="translate(${f(P(3.1,D[3],0.68)[0])} ${f(P(3.1,D[3],0.68)[1])}) rotate(26.57)">INFORMATION</text></g>`;
   const person=(x,y,c,cls)=>{const p=P(x,y);return `<g class="ppl ${cls}"><ellipse cx="${f(p[0])}" cy="${f(p[1])}" rx="13" ry="4.5" fill="#000" opacity=".35"/><path d="M${f(p[0]-11)} ${f(p[1])} c0-32 4-48 11-48 s11 16 11 48z" fill="${c}"/><circle cx="${f(p[0])}" cy="${f(p[1]-58)}" r="9" fill="${c}"/></g>`};
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
    <text class="note" x="306" y="262" display="none" font-family="Pretendard,sans-serif" font-size="11" font-weight="700" fill="#15141a">면별 그래픽이 이음부에서 끊기지 않게 맞춤</text>
    <rect class="note" x="306" y="272" width="54" height="16" rx="8" fill="#d1ff39"/><text class="note" x="333" y="284" text-anchor="middle" font-family="Pretendard,sans-serif" font-size="9.5" font-weight="800" fill="#15141a">시안 2차</text>
    <g class="cursor"><path d="M0 0v18l5-4.5 3.5 7.5 3-1.4-3.4-7.3H15z" fill="#15141a" stroke="#fff" stroke-width="1.2" stroke-linejoin="round"/></g>
   </g>`;
   const sp=(x,y,z,r,cls)=>{const p=P(x,y,z);return `<path class="spark ${cls}" d="M${f(p[0])} ${f(p[1]-r)}l${r*.28} ${r*.72} ${r*.72} ${r*.28}-${r*.72} ${r*.28}-${r*.28} ${r*.72}-${r*.28}-${r*.72}-${r*.72}-${r*.28} ${r*.72}-${r*.28}z" fill="#d1ff39"/>`};
   s+='</g>';
   // 3 완성: 벽 위로 빛이 한 번 지나감(설치 마무리). 그림 소품은 더하지 않음
   s+=`<g class="sheen" clip-path="url(#psWalls)"><rect x="-160" y="-20" width="120" height="470" fill="url(#psSheen)" transform="skewX(-18)"/></g>`;
   return s;},
  // 리플렛(예술인 권리보호 3단): 1 원고·접지 확인(종이 판·접는 선·규격) → 2 면별 편집(디자인 창의 세 면) → 3 교정·인쇄(인쇄된 펼침면이 놓이고 접힌 리플렛 묶음)
  leaflet(){
   const K=48,OX=430,OY=118;
   const P=(x,y,z=0)=>[OX+(x-y)*K,OY+(x+y)*K/2-z*56];
   const f=v=>v.toFixed(1);
   const pts=a=>a.map(p=>P(...p).map(f).join(',')).join(' ');
   const poly=(a,c='',st='')=>`<polygon class="${c}" points="${pts(a)}" ${st}/>`;
   const line=(a,c,st='')=>`<path class="${c}" pathLength="1" d="M${a.map(p=>P(...p).map(f).join(' ')).join('L')}" ${st}/>`;
   const OUT='/assets/service-photos/leaflet/artist-flat.webp',IW=1080,IH=764;
   const X0=0.4,Y0=0,W=5.2,D=W*IH/IW;           // 펼친 종이(바깥면)
   // 바닥면(z) 위에 이미지를 눕혀 붙이는 변환: 이미지 가로 → x축, 세로 → y축
   const plane=(x0,y0,w,d,iw,ih,z=0)=>{const o=P(x0,y0,z),u=[K*w/iw,K/2*w/iw],v=[-K*d/ih,K/2*d/ih];return `matrix(${u[0].toFixed(5)},${u[1].toFixed(5)},${v[0].toFixed(5)},${v[1].toFixed(5)},${f(o[0])},${f(o[1])})`};
   const BW=100,AH=Math.round(BW*IH/(IW/3));
   let s=`<defs>
    <radialGradient id="lfBg" cx="50%" cy="38%" r="75%"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#f3f4f8"/><stop offset="1" stop-color="#eaecf2"/></radialGradient>
    <linearGradient id="lfSheen" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".6"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <filter id="lfBlur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10"/></filter>
    <filter id="lfSoft" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#2a2f45" flood-opacity=".22"/></filter>
    <clipPath id="lfSheet"><polygon points="${pts([[X0,Y0],[X0+W,Y0],[X0+W,Y0+D],[X0,Y0+D]])}"/></clipPath>
    <clipPath id="lfCover"><rect x="${IW*2/3}" width="${IW/3}" height="${IH}"/></clipPath>
    ${[0,1,2].map(i=>`<clipPath id="lfA${i}"><rect x="${330+i*150}" y="104" width="${BW}" height="${AH}" rx="2"/></clipPath>`).join('')}
   </defs><rect x="120" y="-20" width="770" height="470" fill="url(#lfBg)"/>`;
   s+='<g class="lf-desk">';
   s+=`<ellipse cx="${f(P(X0+W/2,Y0+D/2)[0])}" cy="${f(P(X0+W/2,Y0+D/2)[1]+26)}" rx="270" ry="80" fill="#aab1c4" opacity=".3" filter="url(#lfBlur)"/>`;
   // 1 접지 계획: 종이 판 윤곽 → 접는 선 두 줄 → 규격
   s+=poly([[X0,Y0],[X0+W,Y0],[X0+W,Y0+D],[X0,Y0+D]],'lf-paper','fill="#ffffff" stroke="#d5d9e4" stroke-width="1.2"');
   s+=line([[X0,Y0],[X0+W,Y0],[X0+W,Y0+D],[X0,Y0+D],[X0,Y0]],'lf-bp');
   for(const k of [1,2])s+=line([[X0+W*k/3,Y0],[X0+W*k/3,Y0+D]],'lf-fold');
   const lab=(t,at,ang,cls='lf-dimt')=>{const p=P(...at);return `<text class="${cls}" text-anchor="middle" transform="translate(${f(p[0])} ${f(p[1])}) rotate(${ang})">${t}</text>`};
   s+=lab('안쪽 면',[X0+W/6,Y0+D/2],26.57,'lf-tag')+lab('뒷면',[X0+W/2,Y0+D/2],26.57,'lf-tag')+lab('표지',[X0+W*5/6,Y0+D/2],26.57,'lf-tag');
   s+=line([[X0,Y0+D+0.45],[X0+W,Y0+D+0.45]],'lf-dim')+line([[X0,Y0+D+0.3],[X0,Y0+D+0.6]],'lf-dim')+line([[X0+W,Y0+D+0.3],[X0+W,Y0+D+0.6]],'lf-dim');
   s+=line([[X0+W+0.45,Y0],[X0+W+0.45,Y0+D]],'lf-dim')+line([[X0+W+0.3,Y0],[X0+W+0.6,Y0]],'lf-dim')+line([[X0+W+0.3,Y0+D],[X0+W+0.6,Y0+D]],'lf-dim');
   s+=lab('297 mm · 3단 접지',[X0+W/2,Y0+D+0.95],26.57)+lab('210 mm',[X0+W+0.95,Y0+D/2],-26.57);
   // 3 인쇄: 바깥면 디자인이 종이 위에 내려앉음 + 접는 선이 라임으로 한 번
   s+=`<g class="lf-print" clip-path="url(#lfSheet)"><image href="${OUT}" width="${IW}" height="${IH}" transform="${plane(X0,Y0,W,D,IW,IH)}" preserveAspectRatio="none"/></g>`;
   for(const k of [1,2])s+=line([[X0+W*k/3,Y0],[X0+W*k/3,Y0+D]],'lf-crease','fill="none" stroke="#d1ff39" stroke-width="2.4"');
   // 접힌 리플렛 묶음(표지가 위로): 얇은 판 세 장
   const SW=0.95,SD=SW*IH/(IW/3),SX=X0+W+1.25,SY=Y0+D-SD;
   s+='<g class="lf-stack">';
   for(let n=0;n<3;n++){const z=n*0.07,h=0.06;
    s+=poly([[SX,SY+SD,z],[SX+SW,SY+SD,z],[SX+SW,SY+SD,z+h],[SX,SY+SD,z+h]],'','fill="#e4e6ee"')+poly([[SX+SW,SY+SD,z],[SX+SW,SY,z],[SX+SW,SY,z+h],[SX+SW,SY+SD,z+h]],'','fill="#cfd3de"');
    if(n===2)s+=`<g transform="${plane(SX,SY,SW,SD,IW/3,IH,z+h)}"><g clip-path="url(#lfCover)" transform="translate(${-IW*2/3} 0)"><image href="${OUT}" width="${IW}" height="${IH}" preserveAspectRatio="none"/></g></g>`;
    else s+=poly([[SX,SY,z+h],[SX+SW,SY,z+h],[SX+SW,SY+SD,z+h],[SX,SY+SD,z+h]],'','fill="#f4f5f9"');}
   s+='</g>';
   s+=`<g class="lf-sheen" clip-path="url(#lfSheet)"><rect x="-160" y="-20" width="120" height="470" fill="url(#lfSheen)" transform="skewX(-18)"/></g>`;
   s+='</g>';
   // 2 디자인 창: 세 면 대지가 빈 틀 → 실제 디자인
   s+=`<g class="lf-win" filter="url(#lfSoft)"><rect x="252" y="30" width="516" height="${AH+150}" rx="14" fill="#ffffff"/>
    <rect x="252" y="30" width="516" height="30" rx="14" fill="#e8eaf1"/><rect x="252" y="46" width="516" height="14" fill="#e8eaf1"/>
    <circle cx="272" cy="45" r="4.5" fill="#ff5f57"/><circle cx="287" cy="45" r="4.5" fill="#febc2e"/><circle cx="302" cy="45" r="4.5" fill="#28c840"/>
    <text x="510" y="49" text-anchor="middle" font-family="Pretendard,sans-serif" font-size="11.5" font-weight="700" fill="#5f5d6b">리플렛_예술인권리보호_3단_최종.ai</text>
    <rect x="260" y="70" width="30" height="${AH+100}" rx="8" fill="#f0f1f6"/>${[0,1,2,3,4].map(i=>`<rect x="268" y="${82+i*26}" width="14" height="14" rx="3" fill="${i===2?'#15141a':'#cfd3de'}"/>`).join('')}
    ${['안쪽 면','뒷면','표지'].map((t,i)=>`<text x="${330+i*150}" y="96" font-family="Pretendard,sans-serif" font-size="10.5" font-weight="700" fill="#8a8896">${t}</text><rect x="${330+i*150}" y="104" width="${BW}" height="${AH}" rx="2" fill="#e9ebf2"/>`).join('')}
    ${[0,1,2].map(i=>{const x=330+i*150;return `<g class="lf-wf"><rect x="${x+12}" y="118" width="${i===2?60:76}" height="12" rx="2" fill="#cfd3de"/><rect x="${x+12}" y="140" width="76" height="${i===2?110:50}" rx="3" fill="#dfe2ea"/>${i<2?`<rect x="${x+12}" y="200" width="76" height="6" rx="2" fill="#cfd3de"/><rect x="${x+12}" y="212" width="60" height="6" rx="2" fill="#cfd3de"/><rect x="${x+12}" y="224" width="70" height="6" rx="2" fill="#cfd3de"/>`:''}</g>`}).join('')}
    ${[0,1,2].map(i=>`<g clip-path="url(#lfA${i})"><image class="lf-art a${i}" href="${OUT}" x="${330+i*150-i*BW}" y="104" width="${BW*3}" height="${AH}" preserveAspectRatio="none"/></g>`).join('')}
    <path class="lf-guide" pathLength="1" d="M300 130H750M300 ${AH+92}H750" stroke="#d1ff39" stroke-width="1.4" stroke-dasharray="4 4" fill="none"/>
    <g class="lf-sel"><rect x="628" y="102" width="104" height="${AH+4}" fill="none" stroke="#2f5bea" stroke-width="1.6"/>${[[628,102],[732,102],[628,106+AH],[732,106+AH]].map(([x,y])=>`<rect x="${x-3.5}" y="${y-3.5}" width="7" height="7" fill="#fff" stroke="#2f5bea" stroke-width="1.4"/>`).join('')}</g>
    <g class="lf-cursor"><path d="M0 0v18l5-4.5 3.5 7.5 3-1.4-3.4-7.3H15z" fill="#15141a" stroke="#fff" stroke-width="1.2" stroke-linejoin="round"/></g>
   </g>`;
   return s;}
 };
 // 다른 장면 파일(process-leaflet 등)이 뒤에 실려도 쓰이도록, 문서가 다 읽힌 뒤 시작
 const run=()=>document.querySelectorAll('section[data-ps]').forEach(sec=>{
 // HTML 장면(window.PS_SCENES, 예: process-leaflet_1.0.js)이 있으면 그걸 먼저 씀
 const ext=(window.PS_SCENES||{})[sec.dataset.ps];
 const make=SCENES[sec.dataset.ps];const stage=sec.querySelector('.ps-stage');if(!(ext||make)||!stage)return;
 if(ext)stage.querySelector('svg').outerHTML=ext.html();else stage.querySelector('svg').innerHTML=make(sec.dataset.psV);
 if(sec.hasAttribute('data-ps-static')){stage.classList.add('s4');return}
 const cards=[...sec.querySelectorAll('.pdd-steps')];
 const DUR=(ext&&ext.dur)||{booth:[4200,4400,3200],leaflet:[3400,4800,3800]}[sec.dataset.ps]||[3500,4500,3500],HOLD=2800;
 if(matchMedia('(prefers-reduced-motion:reduce)').matches){stage.classList.add('s4');return}
 // 2026-11-04 단계 카드 대신 장면 위에 지금 단계 제목만
 const head=document.createElement('div');head.className='ps-head';head.setAttribute('aria-live','polite');
 // 장면이 제목을 따로 주면(ext.titles, 예: 리플렛 4단계) 그걸 씀. ext.split=3단계 안에서 4번째 제목으로 넘어가는 시점(ms)
 const names=(ext&&ext.titles)||cards.map(c=>(c.querySelector('h3')||c).textContent.trim());
 head.innerHTML=names.map((t,i)=>`<p class="ps-title"><b>${String(i+1).padStart(2,'0')}</b>${t}</p>`).join('');
 stage.before(head);sec.classList.add('ps-live');const titles=[...head.children];
 let k=0,tm=null,tt=null;
 function set(n){stage.classList.remove('s1','s2','s3','s4');void stage.offsetWidth;stage.classList.add('s'+n);
  cards.forEach((c,i)=>{c.classList.remove('ps-on');c.classList.toggle('ps-done',i<n-1||n===4);c.style.setProperty('--d',(DUR[i]||3000)+'ms')});
  if(n<4&&cards[n-1]){void cards[n-1].offsetWidth;cards[n-1].classList.add('ps-on')}
  const show=j=>titles.forEach((e,i)=>e.classList.toggle('on',i===j));clearTimeout(tt);
  show(Math.min(n,titles.length)-1);if(n===3&&titles.length>3&&ext.split)tt=setTimeout(()=>show(3),ext.split)}
 function next(){k=k%4+1;set(k);tm=setTimeout(next,k<4?DUR[k-1]:HOLD)}
 new IntersectionObserver(e=>{if(e[0].isIntersecting){if(!tm){k=0;next()}}else{clearTimeout(tm);clearTimeout(tt);tm=null}},{threshold:.3}).observe(stage);
 });
 if(document.readyState==='complete')run();else document.addEventListener('DOMContentLoaded',run);
})();
