/* 제작과정 장면: 리플렛(2026-11-04). process-scene_1.2.js 엔진이 부름(window.PS_SCENES.leaflet).
   SVG가 아니라 HTML 3D로 실제 종이처럼: 1 원고·접지 확인(빈 3단 종이·접는 선·규격, 원고 파일이 놓임)
   → 2 면별 편집(대지 세 면을 차례로 디자인 → 종이를 뒤집어 표지·뒷면) → 3 교정·인쇄(교정 표시 → 프린터로 들어갔다 인쇄되어 나옴 → 3단으로 접힘). */
(()=>{
 const IN='/assets/service-photos/leaflet/artist-flat-2.webp',OUT='/assets/service-photos/leaflet/artist-flat.webp';
 // 한 장(3면) 구조: 오른쪽 면 안에 가운데 면, 가운데 면 안에 왼쪽 면이 들어 있어 접는 선(경첩)마다 접힘
 const face=(src,pos,cls)=>`<i class="${cls}" style="background-image:url(${src});background-position:${pos}% 0"></i>`;
 const design=(pos,k)=>`<i class="lx-back"><b class="lx-wf"><u></u><u></u><u></u><u></u></b><b class="lx-img lx-i${k}" style="background-image:url(${IN});background-position:${pos}% 0"></b><b class="lx-hl lx-h${k}"></b></i>`;
 const sheet=(cls,withDesign)=>`<div class="${cls}"><div class="lx-p lx-R">${withDesign?'':'<i class="lx-copy c4"></i><i class="lx-copy c3"></i><i class="lx-copy c2"></i><i class="lx-copy c1"></i>'}${face(OUT,100,'lx-front')}${withDesign?design(0,0):face(IN,0,'lx-back')}
   <div class="lx-p lx-M">${face(OUT,50,'lx-front')}${withDesign?design(50,1):face(IN,50,'lx-back')}
    <div class="lx-p lx-L">${face(OUT,0,'lx-front')}${withDesign?design(100,2):face(IN,100,'lx-back')}</div></div></div></div>`;
 window.PS_SCENES=window.PS_SCENES||{};
 window.PS_SCENES.leaflet={dur:[5600,5600,7500],titles:['원고·접지 확인','면별 편집','교정 확인','리플렛 인쇄'],split:2300,html(){
  return `<div class="lx">
   <div class="lx-desk"></div>
   <div class="lx-stage3d">${sheet('lx-sheet',true)}</div>
   <div class="lx-guides"><span class="lx-fold f1"></span><span class="lx-fold f2"></span>
    <span class="lx-tag t0">대지 1</span><span class="lx-tag t1">대지 2</span><span class="lx-tag t2">대지 3</span>
    <span class="lx-dimx"><em>297 mm · 3단 접지</em></span><span class="lx-dimy"><em>210 mm</em></span></div>
   <div class="pk-memo"><b class="pk-mt">확인 내용</b><ul><li class="r1"><i><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4.5 10.5l4 4 7.5-9" pathLength="1"/></svg></i><span>크기·접는 방식</span></li><li class="r2"><i><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4.5 10.5l4 4 7.5-9" pathLength="1"/></svg></i><span>면별 내용</span></li><li class="r3"><i><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4.5 10.5l4 4 7.5-9" pathLength="1"/></svg></i><span>인쇄 수량</span></li></ul><b class="pk-mt t2">받은 자료</b><p class="pk-mf"><span class="f1"><u style="background:#2f5bea">HWP</u>교육안내_원고</span><span class="f2"><u style="background:#15141a">JPG</u>현장사진_03</span><span class="f3"><u style="background:#e5322d">PDF</u>신청방법_안내</span></p></div>
   <span class="lx-cursor"><svg viewBox="0 0 16 22"><path d="M0 0v18l5-4.5 3.5 7.5 3-1.4-3.4-7.3H15z" fill="#15141a" stroke="#fff" stroke-width="1.2" stroke-linejoin="round"/></svg></span>
   <div class="lx-proof"><span class="lx-pm p1"><svg viewBox="0 0 60 44"><ellipse class="lx-ring" cx="30" cy="22" rx="27" ry="19" pathLength="1"/></svg><b>✓</b></span><span class="lx-pm p2"><svg viewBox="0 0 60 44"><ellipse class="lx-ring" cx="30" cy="22" rx="27" ry="19" pathLength="1"/></svg><b>✓</b></span><span class="lx-pm p3"><svg viewBox="0 0 60 44"><ellipse class="lx-ring" cx="30" cy="22" rx="27" ry="19" pathLength="1"/></svg><b>✓</b></span><span class="lx-chip">교정 확인 3곳</span></div>
   <div class="lx-printer"><i class="lx-slot"></i><i class="lx-led"></i><i class="lx-tray"></i></div>
   <i class="lx-mshadow"></i><i class="lx-contact a"></i><i class="lx-contact b"></i><div class="lx-out3d">${sheet('lx-out',false)}<div class="lx-stack"><i></i><i></i></div></div>
  </div>`;}};
})();
