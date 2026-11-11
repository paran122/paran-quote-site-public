/* 제작과정 장면 7종(2026-11-04): 포스터·현수막·PPT·카드뉴스·포토월·홍보부스 운영·책자.
   리플렛(process-leaflet_1.0.js)과 같은 밝은 무대와 흐름 — 1 원고·규격 확인(빈 대지·규격·원고 파일) → 2 디자인(영역별로 채움)
   → 3 교정(세 군데 동그라미·체크) → 4 완성 모습. process-scene_1.2.js 엔진이 부름(window.PS_SCENES). 제목 4개는 titles, 3단계 안에서 4번째로 넘어가는 시점은 split. */
(()=>{
 const A='/assets/service-photos/';
 const CUR='<svg viewBox="0 0 16 22"><path d="M0 0v18l5-4.5 3.5 7.5 3-1.4-3.4-7.3H15z" fill="#15141a" stroke="#fff" stroke-width="1.2" stroke-linejoin="round"/></svg>';
 const LINES='<i class="pk-lines"><u></u><u></u><u></u><u></u><u></u></i>';
 // 원고 파일 아이콘: k=순서(0~2), 도착 위치 tx/ty(cqw)
 const file=(k,ext,color,name,tx,ty,photo)=>`<span class="pk-file d${k}" style="--tx:${tx}cqw;--ty:${ty}cqw"><span class="pk-doc">${photo?`<i class="pk-photo" style="background-image:url(${photo})"></i>`:LINES}<b style="background:${color}">${ext}</b></span><em>${name}</em></span>`;
 // 디자인 영역: [위,오른쪽,아래,왼쪽](%) · 순서 k · 가로로 채우면 h
 const area=(img,[t,r,b,l],d,h)=>`<i class="pk-wf" style="top:${t}%;right:${r}%;bottom:${b}%;left:${l}%;--d:${d}s"><u></u><u></u><u></u></i><i class="pk-band${h?' h':''}" style="background-image:url(${img});--t:${t}%;--r:${r}%;--b:${b}%;--l:${l}%;--d:${d}s"></i><i class="pk-hl" style="top:${t}%;right:${r}%;bottom:${b}%;left:${l}%;--d:${d}s"><span>${CUR}</span></i>`;
 const design=(img,areas,start=.75,gap=1.3,h)=>areas.map((a,i)=>area(img,a,+(start+gap*i).toFixed(2),h)).join('');
 // 교정: 세 군데 [왼쪽,위](%) 동그라미 → 체크, 칩
 const ring=([l,t],i,w)=>`<span class="pk-pm p${i+1}" style="left:${l}%;top:${t}%${w?`;--w:${w}cqw`:''}"><svg viewBox="0 0 60 44"><ellipse class="pk-ring" cx="30" cy="22" rx="27" ry="19" pathLength="1"/></svg><b>✓</b></span>`;
 const proof=(spots,w,chip='교정 확인 3곳',off=0)=>`<div class="pk-proof">${spots.map((s,i)=>ring(s,i+off,w)).join('')}${chip?`<span class="pk-chip">${chip}</span>`:''}</div>`;
 const zone=([t,r,b,l],label)=>`<i class="pk-zone" style="top:${t}%;right:${r}%;bottom:${b}%;left:${l}%"><em>${label}</em></i>`;
 const dims=(x,y)=>(x?`<span class="pk-dimx"><em>${x}</em></span>`:'')+(y?`<span class="pk-dimy"><em>${y}</em></span>`:'');
 // 1단계 확인 메모(2026-11-11): 대지 옆에서 확인 내용이 한 줄씩 체크되고, 받은 자료는 꼬리표로. files=[[확장자,색,이름]]
 const MCHK='<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4.5 10.5l4 4 7.5-9" pathLength="1"/></svg>';
 const memo=(rows,files)=>`<div class="pk-memo"><b class="pk-mt">확인 내용</b><ul>${rows.map((t,i)=>`<li class="r${i+1}"><i>${MCHK}</i><span>${t}</span></li>`).join('')}</ul><b class="pk-mt t2">받은 자료</b><p class="pk-mf">${files.map(([e,c,n],i)=>`<span class="f${i+1}"><u style="background:${c}">${e}</u>${n}</span>`).join('')}</p></div>`;
 const T=(titles,extra)=>Object.assign({dur:[5600,5600,7500],titles,split:2300},extra||{});
 const S=window.PS_SCENES=window.PS_SCENES||{};

 // ── 포스터: 빈 대지(제목·비주얼·정보 영역) → 영역별 디자인 → 교정 → 인쇄되어 벽에 게시 ──
 const PO=A+'poster/jh-poster-1.webp';
 S.poster=T(['내용·규격 확인','시안 디자인','교정 확인','포스터 인쇄·게시'],{html:()=>`<div class="pk pk-poster">
  <i class="pk-floor"></i><i class="pk-sh pf-sh1"></i><i class="pk-sh pf-sh2"></i>
  <div class="pk-3d">
   <div class="pf-stw"><div class="pf-stack">${[0,1,2,3].map(k=>`<i style="background-image:url(${PO})"></i>`).join('')}</div></div>
   <div class="pk-obj pf-sheet"><i class="pk-blank"></i>
    ${zone([2,4,66,4],'제목·일시')+zone([36,4,16,4],'메인 비주얼')+zone([86,4,2,4],'로고·문의')}
    ${design(PO,[[0,0,64,0],[36,0,14,0],[86,0,0,0]])}
    <i class="pf-scan"></i><i class="pk-gloss"></i>
    ${dims('A2 · 420 mm','594 mm')}
    ${proof([[6,15],[4,33],[36,90]],5.4)}
   </div>
  </div>
  ${memo(['크기·게시 위치','행사명·일정·장소','인쇄 수량·납품일'],[['HWP','#2f5bea','행사계획서'],['AI','#ff9a00','기관로고'],['PNG','#15141a','신청QR']])}
 </div>`});

 // ── 현수막·X배너: 설치 위치별 대지 → 디자인 → 교정 → 출력해 거치대에 세우고 현수막을 걺 ──
 const BW=A+'banner/kyogwon-wide.webp',BX=A+'banner/kyogwon-x1.webp';
 S.banner=T(['현장 조건 확인','시안 디자인','교정 확인','출력·설치'],{html:()=>`<div class="pk pk-banner">
  <i class="pk-floor"></i><i class="pk-sh pb-sh"></i><i class="pk-sh pb-sh m2"></i><i class="pk-sh pb-sh m3"></i>
  <div class="pk-3d">
   <div class="pk-obj pb-wide"><svg class="pb-rope" viewBox="0 0 112 40" preserveAspectRatio="none"><path pathLength="1" d="M6.6 40L1 0M105.4 40L111 0"/></svg><i class="pk-blank"></i>${zone([10,1,10,1],'현수막 · 행사장 입구')}${design(BW,[[0,0,0,0]],.75,1.3,true)}<i class="pb-eye l"></i><i class="pb-eye r"></i>${proof([[52,8]],4.6,'')}</div>
   ${[2,3].map(n=>`<div class="pb-more m${n}"><svg class="pb-stand" viewBox="0 0 140 100" preserveAspectRatio="none"><path d="M44 0L6 100M96 0L134 100"/></svg><i class="pb-rod l"></i><i class="pb-rod r"></i><i class="pb-art" style="background-image:url(${A}banner/kyogwon-x${n}.webp)"></i></div>`).join('')}
   <div class="pk-obj pb-x"><svg class="pb-stand" viewBox="0 0 140 100" preserveAspectRatio="none"><path pathLength="1" d="M44 0L6 100M96 0L134 100"/></svg><i class="pb-rod l"></i><i class="pb-rod r"></i><i class="pk-blank"></i>${zone([3,6,72,6],'X배너 · 등록대 옆')}${design(BX,[[0,0,60,0],[40,0,20,0],[80,0,0,0]],2.05,1)}${dims('600 mm','1800 mm')}${proof([[8,18],[14,64]],4.6,'교정 확인 3곳',1)}</div>
  </div>
  ${memo(['설치 위치·크기','문구·로고','수량·마감'],[['HWP','#2f5bea','행사안내'],['AI','#ff9a00','기관로고'],['JPG','#15141a','설치위치']])}
 </div>`});

 // ── 행사 진행 PPT: 빈 화면·식순 원고 → 슬라이드를 한 장씩 → 교정 → 무대 스크린에서 차례로 넘어감 ──
 const P=n=>A+`ppt/kc-ppt-${n}.webp`;
 const slides=['cover','order','seat','speaker'];
 S.ppt=T(['원고·화면 확인','슬라이드 디자인','교정 확인','현장 화면 재생'],{html:()=>`<div class="pk pk-ppt">
  <i class="pk-floor"></i>
  <div class="pt-win"><i class="pt-bar"><u></u><u></u><u></u><em>행사진행_최종.pptx</em></i>
   <div class="pt-thumbs">${slides.map((n,k)=>`<i class="pt-th k${k}"><b style="background-image:url(${P(n)})"></b></i>`).join('')}<i class="pt-th e"></i><i class="pt-th e"></i></div>
   <div class="pk-obj pt-canvas"><i class="pk-blank"></i>${zone([8,6,8,6],'행사장 스크린 비율 16:10')}
    ${slides.map((n,k)=>area(P(n),[0,0,0,0],+(.75+.95*k).toFixed(2))).join('')}
    ${proof([[25,41],[63,41],[63,66]],6.2)}</div>
  </div>
  <div class="pt-show"><i class="pt-glow"></i><div class="pt-screen">${['cover','order','speaker'].map((n,k)=>`<i class="pt-s s${k}" style="background-image:url(${P(n)})"></i>`).join('')}</div><i class="pt-leg l"></i><i class="pt-leg r"></i><span class="pt-play">▶ 슬라이드 쇼</span></div>
  ${memo(['스크린 비율','식순·연사','필요한 화면 수'],[['HWP','#2f5bea','식순'],['XLS','#1d6f42','연사명단'],['AI','#ff9a00','기관로고']])}
 </div>`});

 // ── 카드뉴스: 카드 5장 구성 → 카드별 디자인 → 일정 카드 교정 → 휴대폰 피드에 게시 ──
 const C=n=>A+`card-news/seoul-0${n}.webp`;
 const tags=['표지','행사 안내','체험존','프로그램','이벤트'];
 S['card-news']=T(['주제·구성 확인','카드별 디자인','교정 확인','파일 전달·게시'],{html:()=>`<div class="pk pk-card">
  <i class="pk-floor"></i>
  <div class="pc-row">${[1,2,3,4,5].map((n,k)=>`<div class="pk-obj pc-c k${k}"><i class="pk-blank"></i>${zone([6,8,6,8],`${n} ${tags[k]}`)}${area(C(n),[0,0,0,0],+(.6+.75*k).toFixed(2))}${k===1?proof([[10,35],[46,44],[10,54]],3.4):''}</div>`).join('')}
   <span class="pk-dimx pc-dim"><em>카드 5장 · 세로형</em></span></div>
  <div class="pc-phone"><i class="pc-notch"></i><div class="pc-feed"><i class="pc-head"><u></u><b></b><b></b></i><div class="pc-view">${[1,2,3].map((n,k)=>`<i class="pc-pic p${k}" style="background-image:url(${C(n)})"></i>`).join('')}</div><i class="pc-dots"><u></u><u></u><u></u><u></u><u></u></i><i class="pc-act"><span class="pc-heart">♥</span><u></u><u></u></i><i class="pc-cap"><u></u><u></u></i></div></div>
  ${memo(['화면 규격','주제·카드 구성','카드 장수'],[['HWP','#2f5bea','카드뉴스_원고'],['JPG','#15141a','행사사진'],['PNG','#ff9a00','기관로고']])}
 </div>`});

 // ── 포토월: 벽면 규격·촬영 위치 → 배경 디자인 → 교정 → 세워지고 사진 촬영 ──
 const W=A+'photo-wall/kls-design.webp';
 // 2026-11-11 1단계: 벽 도면 옆 확인 메모가 한 줄씩 체크되고, 그때마다 도면에 그 내용(치수 강조·촬영 위치·단체 인원)이 나타남
 const PZ_MAN='<svg viewBox="0 0 24 60" aria-hidden="true"><circle cx="12" cy="6.2" r="5.2"/><path d="M12 13.2C7 13.2 4 16.2 4 21v13q0 2 2 2h.5L7 56q0 2.5 2.3 2.5T11.6 56L12 40l.4 16q0 2.5 2.3 2.5T17 56l.5-20h.5q2 0 2-2V21c0-4.8-3-7.8-8-7.8z"/></svg>';
 const PZ_CAM='<svg viewBox="0 0 40 30" aria-hidden="true"><rect x="2" y="7" width="36" height="21" rx="4" fill="#15141a"/><rect x="13" y="2" width="14" height="7" rx="2" fill="#15141a"/><circle cx="20" cy="17.5" r="7" fill="#fff"/><circle cx="20" cy="17.5" r="4.2" fill="#2f5bea"/></svg>';
 S['photo-wall']=T(['공간·촬영 조건 확인','배경 디자인','교정 확인','제작·설치'],{html:()=>`<div class="pk pk-wall">
  <i class="pk-floor"></i><i class="pk-sh pz-sh"></i>
  <div class="pk-3d"><div class="pz-in"><div class="pk-obj pz-wall"><i class="pz-side"></i><i class="pk-blank"></i>
   ${zone([6,30,62,30],'행사명·로고')+zone([50,28,6,28],'포즈 공간')}
   ${design(W,[[0,66,0,0],[0,33,0,34],[0,0,0,67]],.75,1.3,true)}
   ${dims('벽면 가로 실측','높이')}${proof([[24,10],[50,28],[55,52]],5.6)}
   <span class="pz-shot"><i></i>${PZ_CAM}<em>촬영 위치</em></span><span class="pz-crowd"><b class="back">${PZ_MAN.repeat(4)}</b><b class="front">${PZ_MAN.repeat(5)}</b></span></div></div></div>
  ${memo(['설치 폭·높이','촬영 거리·위치','단체 촬영 인원'],[['AI','#ff9a00','행사명_로고'],['JPG','#15141a','키비주얼'],['HWP','#2f5bea','문구']])}
  <i class="pz-vf"><u></u><u></u><u></u><u></u></i><i class="pz-flash"></i>
 </div>`});

 // ── 홍보부스 운영: 상담(대화·확인 목록) → 역할·범위 표 → 부스 준비 → 방문객 응대 ──
 const op=[['홍보 목적','#2f5bea'],['현장 여건','#15141a'],['맡길 업무','#ff9a00']];
 const roles=[['안내·접수',4,60],['체험 진행',18,78],['경품·설문',40,58]];
 S['booth-operation']=T(['운영 내용 상담','역할·범위 확정','현장 준비','현장 운영'],{html:()=>`<div class="pk pk-op">
  <i class="pk-floor"></i>
  <div class="po-chat"><i class="po-b q"><em>홍보부스 운영을 맡기고 싶어요</em></i><i class="po-b a"><em>목적과 현장 여건부터 함께 정리할게요</em></i><i class="po-b q2"><em>체험이랑 경품 행사도 있어요</em></i></div>
  <div class="po-list"><b>상담 정리</b>${op.map(([t,c],k)=>`<span class="po-li k${k}"><i></i>${t}</span>`).join('')}</div>
  <div class="po-plan"><b>운영 계획</b><span class="po-axis"><em>오전</em><em>점심</em><em>오후</em></span>
   ${roles.map(([t,s,w],k)=>`<span class="po-row k${k}"><em>${t}</em><i style="left:calc(11cqw + (100% - 11cqw)*${s/100});width:calc((100% - 11cqw)*${w/100})"></i></span>`).join('')}</div>
  <div class="po-scope"><b>포함 범위</b>${['운영 인력','준비물','제작물','설치·철거'].map((t,k)=>`<span class="po-li k${k}"><i></i>${t}</span>`).join('')}</div>
  <div class="po-map"><svg class="po-line" viewBox="0 0 640 400" preserveAspectRatio="none"><path pathLength="1" d="M160 400H480M600 400H640V0H0V400H40"/></svg>
   ${[['안내·접수','z0'],['체험존','z1'],['경품·설문','z2']].map(([n,c])=>`<i class="po-z ${c}"><em>${n}</em><b class="po-desk"></b></i>`).join('')}
   <i class="po-ic tab a"></i><i class="po-ic tab b"></i><i class="po-ic gift a"></i><i class="po-ic gift b"></i>
   ${[0,1,2].map(k=>`<i class="po-st s${k}"></i>`).join('')}
   ${[0,1,2,3,4,5,6,7].map(k=>`<i class="po-v v${k}"></i>`).join('')}
   <svg class="po-route" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M12 106L13 62L17 60L44 64L56 60L80 62L85 64L86 96L86 106"/></svg><span class="po-legend"><i class="st"></i>운영 인력<i class="vi"></i>방문객</span><span class="po-door in">입구</span><span class="po-door out">출구</span>
   <span class="po-pop c0">체험 안내</span><span class="po-pop c1">경품 증정</span><span class="po-pop c2">설문 참여</span></div>
 </div>`});

 // ── 책자: 원고 전달·판형 → 페이지 구성 → 교정 → 인쇄·제본된 책 ──
 const BK='/assets/booklet-motion/',BS='/assets/booklet-showcase/';
 const pages=[BK+'cover.webp',BK+'contents.webp',BK+'program.webp',BK+'slides.webp',BS+'forum-1.webp',BS+'forum-2.webp'];
 S.booklet=T(['자료 전달','구성·시안 확인','교정 확인','인쇄·제본 납품'],{html:()=>`<div class="pk pk-book">
  <i class="pk-floor"></i>
  <div class="pk-3d">
   <div class="bk-in"><div class="pk-obj bk-spread"><i class="pk-blank"></i><i class="bk-gutter"></i>
    ${zone([5,54,5,4],'목차')+zone([5,4,5,54],'본문')}
    ${area(pages[1],[0,50,0,0],.75)+area(pages[2],[0,0,0,50],2.05)}
    ${dims('A4 · 210 mm × 2','297 mm')}${proof([[60,26],[62,44],[60,62]],5.2)}</div></div>
   <div class="bk-thumbs">${pages.map((p,k)=>`<i class="bk-th k${k}" style="background-image:url(${p})"></i>`).join('')}</div>
   <i class="bk-sh a"></i><i class="bk-sh b"></i><div class="bk-bin"><div class="bk-book"><i class="bk-f" style="background-image:url(${pages[0]})"><b class="pk-gloss on"></b></i><i class="bk-bk"></i><i class="bk-sp"></i><i class="bk-ed"></i><i class="bk-tp"></i><i class="bk-bt"></i></div></div>
   <div class="bk-bin b2"><div class="bk-book"><i class="bk-f" style="background-image:url(${pages[0]})"><b class="pk-gloss on"></b></i><i class="bk-bk"></i><i class="bk-sp"></i><i class="bk-ed"></i><i class="bk-tp"></i><i class="bk-bt"></i></div></div>
  </div>
  ${memo(['판형·쪽수','목차·원고','인쇄 부수·납품일'],[['HWP','#2f5bea','원고'],['PPT','#d24726','발표자료'],['JPG','#15141a','행사사진']])}
 </div>`});
})();
