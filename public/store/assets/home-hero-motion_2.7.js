(() => {
  'use strict';
  // 메인 첫 화면 모션 후보 2.7 (real: 첫 장 실측 → 생성 사진 자재 준비, 과정 3장을 사진 왼쪽 위로) · 2.6 (포스터를 클릭하면 위 '포스터' 이름표가 사라짐) · 2.5 (data-end=real: direct와 같고 과정 3장을 포럼 실제 사진으로: 현장 실측·세팅 중·세팅 완료) · 2.4 (data-end=direct: 중간 3컷 없이 바로 완성 사진, 아래 과정 3장 순서대로, 체크는 직접 시공 문구 2개) · 2.3 (마지막 완성 장면 3안 data-end=wide/match/recap: 무대 정리 + 보정한 현장 사진) · 2.2 (설치 과정 3컷을 실사형 생성 사진으로: data-make=filmgen, 실제 사진 찾으면 교체) · 2.1 (설치 과정 3컷을 일러스트로: data-make=filmill) · 2.0 (실제 시공 사진 장면 data-make=shot/film/story, X배너·포토월 캡션 보이게) · 1.9 (제작·설치 장면 3안 data-make=steps/press/list) · 1.8 (커서 모양 3안 추가: hm-cursor-name/pen/dot, 동작은 1.7과 같음) · 1.7 (1.6 + 디자인 툴 시작의 색 입히기 방식 data-tool=drop/slide/brush: 마우스 클릭 대신 스포이드·조절 바·붓) — 자료집 상세(booklet-hero-layer)의 커서 클릭·손글씨 주석 방식을 메인 내용에 맞춤
  const fig = document.querySelector('.hm-motion');
  if (!fig || !window.gsap) return;
  const box = fig.querySelector('.hm-stage'), v = fig.dataset.variant;
  const q = s => [...fig.querySelectorAll(s)], one = s => fig.querySelector(s);
  const cursor = one('.hm-cursor'), burst = q('.hm-cursor .burst');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  q('.hm-lines path').forEach(p => { const n = Math.ceil(p.getTotalLength()) + 2; p.dataset.length = n; p.style.strokeDasharray = n; });
  const fit = () => { const r = fig.getBoundingClientRect(); if (r.width && r.height) box.style.setProperty('--hm-scale', Math.min(r.width / 600, r.height / 430).toFixed(4)); };
  const center = el => ({x: el.offsetLeft + el.offsetWidth / 2, y: el.offsetTop + el.offsetHeight / 2});
  const abs = (el, dx = 0, dy = 0) => { let x = 0, y = 0, n = el; while (n && n !== box) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; } return {x: x + dx, y: y + dy}; };
  function click(t, p, at) {
    t.to(cursor, {opacity: 1, x: p.x - 6, y: p.y - 4, duration: .45, ease: 'power2.inOut'}, at)
     .to(cursor, {scale: .82, duration: .08, yoyo: true, repeat: 1}, at + .45)
     .fromTo(burst, {opacity: 1, scale: .6, transformOrigin: '6px 4px'}, {opacity: 0, scale: 1.4, duration: .35}, at + .5);
    return at + .55;
  }
  function anno(t, k, at) {
    t.fromTo(q(`.hm-lines [data-anno="${k}"]`), {strokeDashoffset: (i, el) => el.dataset.length}, {strokeDashoffset: 0, duration: .55, ease: 'power2.inOut'}, at)
     .fromTo(q(`.hm-anno[data-anno="${k}"]`), {opacity: 0, y: 8}, {opacity: 1, y: 0, duration: .35}, at + .25);
  }
  function hideAnno() { q('.hm-lines path').forEach(p => p.style.strokeDashoffset = p.dataset.length); gsap.set(q('.hm-anno'), {opacity: 0}); }
  const pop = (t, els, at, from = {}) => t.fromTo(els, {opacity: 0, scale: .7, y: 18, ...from}, {opacity: 1, scale: 1, y: 0, x: 0, duration: .55, ease: 'back.out(1.6)', stagger: .12}, at);

  const build = {
    // 1안: 필요한 서비스를 눌러 담고 견적 요청
    cart() {
      const rows = q('.hm-row'), items = q('.hm-cart-row'), count = one('.hm-cart h3 em'), empty = one('.hm-cart-empty');
      const btn = one('.hm-cart-btn'), done = one('.hm-cart-btn .done'), pick = [0, 2, 3];
      gsap.set(items, {opacity: 0, height: 0, marginTop: 0, padding: 0}); gsap.set([empty], {opacity: 1, height: 'auto'});
      rows.forEach(r => r.classList.remove('on')); count.textContent = '0'; gsap.set(done, {opacity: 0}); gsap.set(q('.hm-spark'), {opacity: 0});
      const t = gsap.timeline();
      let at = .3;
      pick.forEach((r, i) => {
        at = click(t, abs(rows[r].querySelector('.plus'), 12, 12), at);
        t.call(() => { rows[r].classList.add('on'); count.textContent = String(i + 1); }, null, at - .05);
        if (!i) t.to(empty, {opacity: 0, height: 0, padding: 0, marginTop: 0, duration: .25}, at);
        t.to(items[i], {opacity: 1, height: 48, marginTop: 9, padding: 7, duration: .4, ease: 'power2.out'}, at);
        at += .35;
      });
      anno(t, 'pick', at - .2);
      at = click(t, abs(btn, 120, 20), at + .3);
      t.to(done, {opacity: 1, duration: .25}, at).to(btn, {scale: 1.05, duration: .15, yoyo: true, repeat: 1}, at)
       .to(q('.hm-spark'), {opacity: 1, duration: .3}, at).to(q('.hm-spark'), {scale: 1.3, duration: .4, yoyo: true, repeat: 3}, at + .2);
      anno(t, 'quote', at + .1);
      t.to(cursor, {opacity: 0, duration: .3}, at + .7);
      return [t, at + 3.4];
    },
    // 2안: 디자인 하나에서 행사 결과물 한 세트로
    set() {
      const src = one('.hm-src'), outs = q('.hm-out'), tags = q('.hm-out .hm-tag');
      gsap.set(outs, {opacity: 0}); gsap.set(src, {opacity: 1, scale: 1, y: 0}); gsap.set(q('.hm-spark'), {opacity: 0});
      const t = gsap.timeline();
      let at = click(t, abs(src, 150, 60), .3);
      t.to(src, {scale: 1.04, duration: .15, yoyo: true, repeat: 1}, at);
      outs.forEach((o, i) => {
        const c = center(src), d = center(o);
        t.fromTo(o, {opacity: 0, scale: .4, x: c.x - d.x, y: c.y - d.y, rotation: 0}, {opacity: 1, scale: 1, x: 0, y: 0, rotation: +(o.dataset.rot || 0), duration: .6, ease: 'back.out(1.4)'}, at + .2 + i * .28);
      });
      at += .2 + outs.length * .28 + .4;
      t.to(cursor, {opacity: 0, duration: .3}, at - .4);
      anno(t, 'set', at);
      t.to(q('.hm-spark'), {opacity: 1, duration: .3}, at).to(q('.hm-spark'), {scale: 1.3, duration: .4, yoyo: true, repeat: 3}, at + .2);
      return [t, at + 3.4];
    },
    // 3안: 디자인 시안이 현장 결과물이 됨
    site() {
      const win = one('.hm-design'), btn = one('.hm-make'), photo = one('.hm-site'), extras = q('.hm-extra');
      gsap.set([photo, ...extras], {opacity: 0}); gsap.set(win, {opacity: 1, x: 0, y: 0, scale: 1}); gsap.set(btn, {opacity: 1, scale: 1}); gsap.set(q('.hm-spark'), {opacity: 0});
      const t = gsap.timeline();
      anno(t, 'design', .3);
      let at = click(t, abs(btn, 50, 16), .9);
      t.to(btn, {scale: .92, duration: .1, yoyo: true, repeat: 1}, at)
       .to(win, {x: -14, y: -10, scale: .92, duration: .5, ease: 'power2.inOut'}, at + .1)
       .fromTo(photo, {opacity: 0, scale: .6, x: -150, y: -70, rotation: 0}, {opacity: 1, scale: 1, x: 0, y: 0, rotation: 3, duration: .8, ease: 'back.out(1.3)'}, at + .3);
      anno(t, 'site', at + 1.1);
      t.to(cursor, {opacity: 0, duration: .3}, at + .6);
      pop(t, extras, at + 1.6);
      t.to(q('.hm-spark'), {opacity: 1, duration: .3}, at + 1.2).to(q('.hm-spark'), {scale: 1.3, duration: .4, yoyo: true, repeat: 3}, at + 1.4)
       .to(photo, {keyframes: [{rotation: 1.5, y: -4}, {rotation: 3.5, y: -1}, {rotation: 3, y: 0}], duration: 1.8}, at + 2);
      return [t, at + 4.6];
    },
    // 키비주얼 1: 포스터를 누르면 시안물이 사방으로 펼쳐지고, 제작·설치를 누르면 현장 사진
    kv1() {
      const kv = one('.hm-kv'), outs = q('.hm-out'), pill = one('.hm-pill'), photo = one('.hm-site');
      gsap.set(outs, {opacity: 0}); gsap.set([kv, ...outs], {filter: 'none'}); gsap.set(kv, {opacity: 0, scale: .9}); gsap.set(pill, {opacity: 0}); gsap.set(photo, {opacity: 0}); gsap.set(q('.hm-spark'), {opacity: 0});
      const t = gsap.timeline();
      t.to(kv, {opacity: 1, scale: 1, duration: .5, ease: 'back.out(1.5)'}, .2);
      anno(t, 'kv', .5);
      let at = click(t, abs(kv, 60, 90), 1.1);
      t.to(kv, {scale: 1.05, duration: .15, yoyo: true, repeat: 1}, at);
      outs.forEach((o, i) => {
        const c = center(kv), d = center(o);
        t.fromTo(o, {opacity: 0, scale: .4, x: c.x - d.x, y: c.y - d.y, rotation: 0}, {opacity: 1, scale: 1, x: 0, y: 0, rotation: +(o.dataset.rot || 0), duration: .6, ease: 'back.out(1.4)'}, at + .15 + i * .22);
      });
      at += .15 + outs.length * .22 + .3;
      anno(t, 'outs', at);
      t.fromTo(pill, {opacity: 0, y: 8}, {opacity: 1, y: 0, duration: .3}, at + .3);
      at = click(t, abs(pill, 50, 16), at + .9);
      t.to(pill, {scale: .92, duration: .1, yoyo: true, repeat: 1}, at)
       .to([kv, ...outs], {filter: 'brightness(.45)', duration: .5}, at + .1)
       .fromTo(photo, {opacity: 0, scale: .5, rotation: 0}, {opacity: 1, scale: 1, rotation: 2, duration: .8, ease: 'back.out(1.3)'}, at + .2)
       .to(cursor, {opacity: 0, duration: .3}, at + .5);
      anno(t, 'site', at + 1);
      t.to(q('.hm-spark'), {opacity: 1, duration: .3}, at + .9).to(q('.hm-spark'), {scale: 1.3, duration: .4, yoyo: true, repeat: 3}, at + 1.1);
      return [t, at + 4.4];
    },
    // 키비주얼 2: 큰 액자 안에서 포스터가 한 장씩 다른 시안물로 바뀌고, 오른쪽에 완성 목록이 쌓임
    kv2() {
      const layers = q('.hm-layer'), made = q('.hm-made'), frame = one('.hm-frame');
      gsap.set(layers, {opacity: 0}); gsap.set(layers[0], {opacity: 1}); gsap.set(made, {opacity: 0, x: 20}); gsap.set(q('.hm-spark'), {opacity: 0});
      const t = gsap.timeline();
      anno(t, 'kv', .3);
      let at = click(t, abs(frame, 150, 150), .8);
      for (let i = 1; i < layers.length; i++) {
        t.to(frame, {scale: .97, duration: .12, yoyo: true, repeat: 1}, at)
         .to(layers[i - 1], {opacity: 0, duration: .3}, at + .1)
         .fromTo(layers[i], {opacity: 0, scale: .92}, {opacity: 1, scale: 1, duration: .4, ease: 'power2.out'}, at + .1);
        if (made[i - 1]) t.to(made[i - 1], {opacity: 1, x: 0, duration: .35, ease: 'power2.out'}, at + .25);
        if (i === layers.length - 1) { t.to(cursor, {opacity: 0, duration: .3}, at - .3); anno(t, 'site', at + .5); }
        at += i === layers.length - 2 ? 1.1 : .75;
      }
      t.to(q('.hm-spark'), {opacity: 1, duration: .3}, at - .4).to(q('.hm-spark'), {scale: 1.3, duration: .4, yoyo: true, repeat: 3}, at - .2);
      return [t, at + 3.2];
    },
    // 키비주얼 3: 키비주얼 → 시안물 → 현장, 왼쪽에서 오른쪽으로 점선이 이어짐
    kv3() {
      const kv = one('.hm-kv'), outs = q('.hm-out'), photo = one('.hm-site'), zones = q('.hm-zone');
      gsap.set([...outs, photo], {opacity: 0}); gsap.set(kv, {opacity: 0, y: 12}); gsap.set(zones, {opacity: .35}); gsap.set(q('.hm-spark'), {opacity: 0});
      const t = gsap.timeline();
      t.to(zones[0], {opacity: 1, duration: .3}, .2).to(kv, {opacity: 1, y: 0, duration: .45, ease: 'power2.out'}, .2);
      let at = click(t, abs(kv, 50, 80), .9);
      t.to(kv, {scale: 1.05, duration: .15, yoyo: true, repeat: 1}, at);
      anno(t, 'arrow1', at);
      t.to(zones[1], {opacity: 1, duration: .3}, at + .4);
      pop(t, outs, at + .5);
      at += .5 + outs.length * .12 + .6;
      anno(t, 'arrow2', at);
      t.to(zones[2], {opacity: 1, duration: .3}, at + .4)
       .fromTo(photo, {opacity: 0, x: -30, scale: .9}, {opacity: 1, x: 0, scale: 1, duration: .6, ease: 'back.out(1.4)'}, at + .45)
       .to(cursor, {opacity: 0, duration: .3}, at);
      anno(t, 'site', at + 1);
      t.to(q('.hm-spark'), {opacity: 1, duration: .3}, at + .9).to(q('.hm-spark'), {scale: 1.3, duration: .4, yoyo: true, repeat: 3}, at + 1.1);
      return [t, at + 4.2];
    },
    // 1.2 포스터 중심 파생: lines=포스터에서 점선이 뻗고 시안물이 나옴, clone=포스터 사본이 날아가 시안물로 바뀜, tree=왼쪽 포스터에서 가지가 뻗음
    derive() {
      const mode = fig.dataset.mode, kv = one('.hm-kv'), outs = q('.hm-out'), pill = one('.hm-pill'), photo = one('.hm-site');
      const links = q('.hm-links path'), clones = q('.hm-clone');
      links.forEach(p => { const n = Math.ceil(p.getTotalLength()) + 2; p.dataset.length = n; });
      gsap.set(outs, {opacity: 0, filter: 'none'}); gsap.set(q('.hm-out .hm-tag'), {opacity: 1}); gsap.set(q('.hm-out[data-to]'), {clearProps: 'clipPath,boxShadow'}); gsap.set(kv, {opacity: 0, scale: .9, filter: 'none'}); gsap.set([pill, photo, ...clones], {opacity: 0});
      gsap.set(links, {strokeDasharray: (i, el) => `${el.dataset.length}`, strokeDashoffset: (i, el) => el.dataset.length, opacity: .9});
      gsap.set(q('.hm-spark'), {opacity: 0}); gsap.set(q('.hm-kv .hm-tag'), {opacity: 1});
      const t = gsap.timeline();
      let at;
      if (intro[fig.dataset.intro]) at = intro[fig.dataset.intro](t, kv);
      else {
        t.to(kv, {opacity: 1, scale: 1, duration: .55, ease: 'back.out(1.5)'}, .2);
        at = click(t, abs(kv, kv.offsetWidth / 2, kv.offsetHeight / 2), .9);
        t.to(kv, {scale: 1.06, duration: .16, yoyo: true, repeat: 1}, at);
      }
      t.to(q('.hm-kv .hm-tag'), {opacity: 0, duration: .25}, at);
      const c = center(kv);
      outs.forEach((o, i) => {
        const d = center(o), s = at + .25 + i * .42;
        // 포스터가 매번 살짝 '찍어 내듯' 눌림
        t.to(kv, {scale: 1.03, duration: .1, yoyo: true, repeat: 1}, s - .05);
        if (links[i]) t.to(links[i], {strokeDashoffset: 0, duration: .4, ease: 'power2.out'}, s).set(links[i], {strokeDasharray: '2 7'}, s + .4);
        if (mode === 'clone') {
          const g = clones[i];
          t.set(g, {x: 0, y: 0, scale: 1, opacity: 1}, s)
           .to(g, {x: d.x - c.x, y: d.y - c.y, scaleX: o.offsetWidth / kv.offsetWidth, scaleY: o.offsetHeight / kv.offsetHeight, rotation: +(o.dataset.rot || 0), duration: .5, ease: 'power3.inOut'}, s)
           .fromTo(o, {opacity: 0, scale: 1, x: 0, y: 0, rotation: +(o.dataset.rot || 0)}, {opacity: 1, duration: .3}, s + .4)
           .to(g, {opacity: 0, duration: .25}, s + .5);
        } else {
          const from = mode === 'tree' ? {x: -40, y: 0} : {x: (c.x - d.x) * .35, y: (c.y - d.y) * .35};
          t.fromTo(o, {opacity: 0, scale: .5, ...from, rotation: 0}, {opacity: 1, scale: 1, x: 0, y: 0, rotation: +(o.dataset.rot || 0), duration: .5, ease: 'back.out(1.5)'}, s + .3);
        }
      });
      at += .25 + outs.length * .42 + .4;
      anno(t, 'outs', at);
      t.fromTo(pill, {opacity: 0, y: 8}, {opacity: 1, y: 0, duration: .3}, at + .3);
      at = click(t, abs(pill, 50, 16), at + 1);
      const site = fig.dataset.site || '', pins = q('.hm-pin');
      gsap.set(pins, {opacity: 0, scale: .4});
      t.to(pill, {scale: .92, duration: .1, yoyo: true, repeat: 1}, at).to(cursor, {opacity: 0, duration: .3}, at + .5);
      q('.hm-gone').forEach(o => o.classList.remove('hm-gone'));
      const mk = makeFx[fig.dataset.make];
      let makeEnd = null;
      if (mk && site) { const r = mk(t, at + .2, outs, pill); at = r.at; makeEnd = r.end; }
      if (!site) {
        t.to([...outs, ...links], {filter: 'brightness(.45)', opacity: (i, el) => el.tagName === 'path' ? .25 : 1, duration: .5}, at + .1)
         .fromTo(photo, {opacity: 0, scale: .5, rotation: 0}, {opacity: 1, scale: 1, rotation: 2, duration: .8, ease: 'back.out(1.3)'}, at + .2);
        anno(t, 'site', at + 1);
      } else {
        // 설치되는 목업(포토월·X배너)은 현장 사진 속 실제 위치로 날아가 붙고, 나머지는 어둡게
        const movers = site === 'fill' ? [] : outs.filter(o => o.dataset.to);
        const rest = [kv, pill, ...outs.filter(o => !movers.includes(o)), ...links], ef = endFx[fig.dataset.end];
        // 2.3 마지막 장면: 남은 시안물·배경 틀을 모두 걷어 내고 현장 사진만 남김
        if (ef) t.to([...q('.hm-ghost-back,.hm-ghost-bar,.hm-clone'), ...q('.hm-anno[data-anno="outs"]'), ...q('.hm-lines [data-anno="outs"]')], {opacity: 0, duration: .5}, at + .1);
        t.to(rest, {opacity: (i, el) => ef || el === pill || el.classList.contains('hm-gone') ? 0 : el.tagName === 'path' ? .15 : .35, filter: 'brightness(.5)', duration: .5}, at + .1)
         .set(photo, {opacity: 0, scale: 1, rotation: 0}, at);
        if (site === 'fill') t.fromTo(photo, {opacity: 0, scale: .25, transformOrigin: '50% 50%'}, {opacity: 1, scale: 1, duration: .8, ease: 'power3.out'}, at + .25);
        const P = {x: photo.offsetLeft, y: photo.offsetTop, w: photo.offsetWidth, h: photo.offsetHeight};
        movers.forEach((o, i) => {
          // data-in: 목업 사진 안에서 실물이 차지하는 영역. 그 영역만 남기고(clip) 사진 속 위치에 크기를 맞춤
          const [fx, fy, fw, fh] = o.dataset.to.split(',').map(Number), [ix, iy, iw, ih] = (o.dataset.in || '0,0,1,1').split(',').map(Number);
          const ow = o.offsetWidth, oh = o.offsetHeight, sx = fw * P.w / (iw * ow), sy = fh * P.h / (ih * oh), d = center(o);
          const cx = P.x + (fx + fw / 2) * P.w - (ix + iw / 2 - .5) * ow * sx, cy = P.y + (fy + fh / 2) * P.h - (iy + ih / 2 - .5) * oh * sy;
          const s0 = at + .2 + i * .15, pct = v => (v * 100).toFixed(1) + '%';
          t.to(o.querySelector('.hm-tag'), {opacity: 0, duration: .15}, s0)
           .fromTo(o, {clipPath: 'inset(0% 0% 0% 0%)'}, {clipPath: `inset(${pct(iy)} ${pct(1 - ix - iw)} ${pct(1 - iy - ih)} ${pct(ix)})`, duration: .35, immediateRender: false}, s0);
          t.to(o, {x: cx - d.x, y: cy - d.y, scaleX: sx, scaleY: sy, rotation: 0, boxShadow: 'none', duration: .75, ease: 'power3.inOut', zIndex: 12}, s0)
           .to(o, {opacity: 0, duration: .35}, at + 1.15 + i * .1);
        });
        if (movers.length) t.to(photo, {opacity: 1, duration: .45}, at + .85);
        const pinAt = at + (movers.length ? 1.35 : 1);
        t.to(pins, {opacity: 1, scale: 1, duration: .45, ease: 'back.out(2.2)', stagger: .2}, pinAt);
        anno(t, 'site', pinAt + .3);
        if (makeEnd) makeEnd(t, pinAt);
        if (ef) ef(t, pinAt, photo);
        at += movers.length ? .5 : .2;
      }
      t.to(q('.hm-spark'), {opacity: 1, duration: .3}, at + .9).to(q('.hm-spark'), {scale: 1.3, duration: .4, yoyo: true, repeat: 3}, at + 1.1);
      return [t, at + (['direct', 'real'].includes(fig.dataset.end) ? 6.5 : 4.4)];  // 2.4 완성 장면은 더 오래 보여 줌
    },
  };
  // 1.6 시작 장면: 포스터를 클릭하는 대신, 파란이 포스터를 디자인하는 과정을 짧게 보여 준 뒤 시안물로 파생
  const el = (cls, html = '', css = {}) => { const d = document.createElement('div'); d.className = cls; d.innerHTML = html; Object.assign(d.style, css); return d; };
  const K = () => { const k = one('.hm-kv'); return {x: k.offsetLeft, y: k.offsetTop, w: k.offsetWidth, h: k.offsetHeight}; };
  // 1.7 색 입히기: 흑백 포스터 위에 컬러 사본(.hm-color)을 얹고 도구마다 다른 모양으로 드러냄
  const ICON = {
    drop: '<svg viewBox="0 0 32 32"><path class="b" d="M21.5 4.5a3.5 3.5 0 0 1 5 5l-3 3 1.5 1.5-2 2-1.5-1.5-9.8 9.8-4.2 1.2 1.2-4.2 9.8-9.8-1.5-1.5 2-2 1.5 1.5z"/><circle class="d" cx="5.5" cy="27.5" r="2.6"/></svg>',
    brush: '<svg viewBox="0 0 32 32"><path class="b" d="M27 3.5 14.5 17.2l2.6 2.6L30 7.5c.9-.9.9-2.4 0-3.3s-2.1-.8-3 0z"/><path class="d" d="M13 18.6l2.9 2.9c-.2 2.8-1.6 5.2-4.4 6.3-2.4 1-5.6.9-8.5.2 2.2-1.4 2.2-3.3 2.6-5.1.6-2.9 3.9-4.7 7.4-4.3z"/></svg>'
  };
  function layer(kv, n) {
    const base = kv.querySelector('.hm-crop');
    let cs = [...kv.querySelectorAll('.hm-color')];
    if (!cs.length) for (let i = 0; i < n; i++) { const c = base.cloneNode(true); c.classList.add('hm-color'); kv.append(c); cs.push(c); }
    gsap.set(base, {filter: 'grayscale(1) brightness(.75)'});
    return {base, cs};
  }
  function icon(kind) {
    let ic = one(`.hm-ic-${kind}`);
    if (!ic) { ic = el(`hm-ic hm-ic-${kind}`, ICON[kind]); box.append(ic); }
    gsap.set(ic, {opacity: 0, x: 560, y: 400, rotation: 0});
    return ic;
  }
  const paint = {
    // 스포이드: 색상 칩에서 남색을 찍어 포스터에 떨어뜨리면 그 점에서 색이 번져 나감
    drop(t, kv, sw, at) {
      const k = K(), {cs} = layer(kv, 1), ic = icon('drop'), s = abs(sw, 9, 9), px = k.w * .5, py = k.h * .34;
      gsap.set(cs[0], {clipPath: `circle(0% at ${px}px ${py}px)`});
      t.to(ic, {opacity: 1, x: s.x - 2, y: s.y - 26, duration: .5, ease: 'power2.inOut'}, at)
       .to(sw, {scale: 1.3, duration: .15, yoyo: true, repeat: 1}, at + .5)
       .to(ic.querySelector('.d'), {fill: '#2a2f74', duration: .2}, at + .55)
       .to(ic, {x: k.x + px - 2, y: k.y + py - 26, duration: .6, ease: 'power2.inOut'}, at + .75)
       .to(ic, {y: '+=6', duration: .12, yoyo: true, repeat: 1}, at + 1.35)
       .to(cs[0], {clipPath: `circle(130% at ${px}px ${py}px)`, duration: .9, ease: 'power2.in'}, at + 1.45)
       .to(ic.querySelector('.d'), {fill: '#ffffff', duration: .2}, at + 1.5)
       .to(ic, {opacity: 0, duration: .3}, at + 2);
      return at + 2.3;
    },
    // 조절 바: 포스터 아래 '컬러' 바의 손잡이가 스르륵 움직이며 왼쪽부터 색이 채워짐
    slide(t, kv, sw, at) {
      const k = K(), {cs} = layer(kv, 1);
      let bar = one('.hm-slider');
      if (!bar) { bar = el('hm-slider', '<span>컬러</span><div><b></b><i></i></div><em>0%</em>', {left: k.x - 5 + 'px', top: k.y + k.h + 40 + 'px', width: k.w + 10 + 'px'}); box.append(bar); }
      const fill = bar.querySelector('b'), knob = bar.querySelector('i'), num = bar.querySelector('em'), o = {v: 0};
      gsap.set(cs[0], {clipPath: 'inset(0% 100% 0% 0%)'}); gsap.set(fill, {width: '0%'}); gsap.set(knob, {left: '0%'}); num.textContent = '0%';
      t.fromTo(bar, {opacity: 0, y: 6}, {opacity: 1, y: 0, duration: .3}, at)
       .to(o, {v: 100, duration: 1.3, ease: 'power2.inOut', onUpdate: () => {
         const v = o.v; fill.style.width = knob.style.left = v + '%'; num.textContent = Math.round(v) + '%'; cs[0].style.clipPath = `inset(0% ${100 - v}% 0% 0%)`;
       }}, at + .35)
       .to(sw, {scale: 1.3, duration: .15, yoyo: true, repeat: 1}, at + 1.6)
       .to(bar, {opacity: 0, duration: .3}, at + 2.1);
      return at + 2.1;
    },
    // 붓: 붓이 포스터 위를 지그재그로 칠하면 붓길을 따라 색이 들어감
    brush(t, kv, sw, at) {
      const k = K(), n = 5, {cs} = layer(kv, n), ic = icon('brush');
      cs.forEach((c, i) => gsap.set(c, {clipPath: `inset(${i * 20}% 100% ${100 - (i + 1) * 20}% 0%)`}));
      t.to(ic, {opacity: 1, x: k.x - 4, y: k.y + k.h * .1 - 30, duration: .45, ease: 'power2.inOut'}, at);
      let s = at + .45;
      cs.forEach((c, i) => {
        const ltr = i % 2 === 0, y = k.y + k.h * (i * .2 + .1) - 30, d = .34;
        const from = `inset(${i * 20}% ${ltr ? 100 : 0}% ${100 - (i + 1) * 20}% ${ltr ? 0 : 100}%)`, to = `inset(${i * 20}% 0% ${100 - (i + 1) * 20}% 0%)`;
        t.set(ic, {y}, s).fromTo(c, {clipPath: from}, {clipPath: to, duration: d, ease: 'none'}, s)
         .fromTo(ic, {x: ltr ? k.x - 4 : k.x + k.w - 4}, {x: ltr ? k.x + k.w - 4 : k.x - 4, rotation: ltr ? 8 : -8, duration: d, ease: 'none'}, s);
        s += d + .04;
      });
      t.to(ic, {opacity: 0, duration: .3}, s + .1);
      return s + .3;
    },
  };
  // 1.9 제작·설치 장면: '제작·설치'를 누른 뒤 현장 사진이 나오기 전에 인쇄·제작 과정을 보여 줌
  const outName = o => (o.querySelector('.hm-tag') || {}).textContent || '';
  const fadeOutsAnno = (t, at) => t.to([...q('.hm-anno[data-anno="outs"]'), ...q('.hm-lines [data-anno="outs"]')], {opacity: 0, duration: .3}, at);
  const resetOutsAnno = () => gsap.set(q('.hm-lines [data-anno="outs"]'), {opacity: 1});
  const IMG = n => `/assets/home-hero/${n}_1.0.webp`;
  const photoCard = (cls, src, cap, alt, css) => el(`hm-shot ${cls}`, `<img src="${src}" alt="${alt}"><p>${cap}</p>`, css);
  // 2.0 실제 시공 사진: 다른 행사에서 파란이 직접 설치한 사진
  const shotIn = (t, at, outs) => {
    let c = one('.hm-shot-main');
    if (!c) { c = photoCard('hm-shot-main', IMG('install-wall'), '<i></i>현장 시공 중', '사다리에 올라 대형 벽면 그래픽을 붙이는 파란 설치팀', {left: '200px', top: '58px', width: '200px'}); box.append(c); }
    gsap.set(c, {opacity: 0, y: 30, rotation: -6, scale: .9});
    fadeOutsAnno(t, at);
    t.to(outs, {filter: 'brightness(.45)', duration: .35}, at).to(c, {opacity: 1, y: 0, rotation: -2, scale: 1, duration: .55, ease: 'back.out(1.5)'}, at + .1);
    return c;
  };
  // 2.3 마지막 완성 장면 3안 (data-end). 공통: 보정한 현장 사진(site-final), 남은 요소 정리
  const endImg = () => { const i = one('.hm-site img'); if (i && !i.dataset.final) { i.dataset.final = 1; i.src = IMG('site-final'); i.alt = '중앙아시아 교육협력 포럼 현장에 파란이 설치한 포토월과 X배너'; const pw = one('.hm-pin'); if (pw) Object.assign(pw.style, {left: '56%', top: '60%'}); } };
  const endEl = (cls, html, css, parent = box) => { let d = one('.' + cls.split(' ').pop()); if (!d) { d = el(cls, html, css); parent.append(d); } return d; };
  const endFx = {
    // 1 크게·선명하게: 사진이 무대를 채우듯 커지고 '실제 설치 현장' 표시
    wide(t, at, photo) {
      const cap = endEl('hm-endcap', '<i></i>실제 설치 현장 · 경기도교육청 중앙아시아 교육협력 포럼', {}, photo);
      gsap.set(cap, {opacity: 0, y: -6});
      t.fromTo(photo, {scale: 1}, {scale: 1.1, duration: 1.4, ease: 'power2.out', transformOrigin: '50% 45%'}, at - .5)
       .to(photo, {boxShadow: '0 0 0 1px rgba(204,255,48,.55),0 30px 70px rgba(0,0,0,.7)', duration: .6}, at)
       .to(cap, {opacity: 1, y: 0, duration: .4}, at + .5);
    },
    // 2 시안 → 실물: 디자인 시안 카드가 옆에 붙고 사진 속 설치 위치로 선이 이어짐
    match(t, at, photo) {
      const P = {x: photo.offsetLeft, y: photo.offsetTop, w: photo.offsetWidth, h: photo.offsetHeight};
      const a = endEl('hm-src hm-src-pw', `<img src="/assets/service-photos/photo-wall/forum-design.webp" alt="포럼 포토월 디자인 시안"><p>포토월 시안</p>`, {left: '446px', top: '6px', width: '148px'});
      const b = endEl('hm-src hm-src-xb', `<img src="/assets/service-photos/banner/forum-xbanner.webp" alt="포럼 X배너 디자인 시안"><p>X배너 시안</p>`, {left: '6px', top: '14px', width: '92px'});
      let svg = one('.hm-srclines');
      if (!svg) {
        svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('class', 'hm-srclines'); svg.setAttribute('viewBox', '0 0 600 430');
        const px = P.x + .56 * P.w, py = P.y + .6 * P.h, xx = P.x + .08 * P.w, xy = P.y + .6 * P.h;
        svg.innerHTML = `<path d="M480 66C440 96 360 120 ${px + 16} ${py - 14}"/><path d="M52 118C60 150 46 190 ${xx + 2} ${xy - 16}"/>`;
        box.append(svg);
        svg.querySelectorAll('path').forEach(p => { const n = Math.ceil(p.getTotalLength()) + 2; p.dataset.length = n; p.style.strokeDasharray = `5 5`; });
      }
      const ps = [...svg.querySelectorAll('path')];
      gsap.set([a, b], {opacity: 0, y: 10}); gsap.set(ps, {opacity: 0});
      t.to(photo, {y: 14, duration: .6, ease: 'power2.out'}, at - .4)
       .to([a, b], {opacity: 1, y: 0, duration: .45, ease: 'back.out(1.6)', stagger: .2}, at + .1)
       .fromTo(ps, {opacity: 1, clipPath: 'inset(0 100% 0 0)'}, {clipPath: 'inset(0 0% 0 0)', duration: .6, stagger: .2}, at + .5);
    },
    // 3 과정 요약: 완성 사진 아래쪽에 자재 준비·시공·점검 3컷이 체크와 함께 정리됨
    recap(t, at, photo) {
      const strip = endEl('hm-recap', [['gen-prep', '자재 준비'], ['gen-install', '현장 시공'], ['gen-check', '점등·점검']].map(([n, c]) => `<figure><img src="${IMG(n)}" alt="${c} 과정 사진"><figcaption><i>✓</i>${c}</figcaption></figure>`).join(''), {}, photo);
      const fs = [...strip.querySelectorAll('figure')];
      gsap.set(fs, {opacity: 0, y: 14});
      t.to(fs, {opacity: 1, y: 0, duration: .4, ease: 'back.out(1.6)', stagger: .18}, at + .6);
    },
    // 4 바로 완성 + 과정 3장: 체크 문구는 '설치 항목' 대신 파란이 직접 설치한다는 내용
    real(t, at, photo) { endFx.direct(t, at, photo, [['gen-prep', '자재 준비'], ['real-setup', '현장 세팅'], ['real-done', '세팅 완료']]); },
    direct(t, at, photo, set) {
      const [a, b] = q('.hm-pin b');
      if (a && !a.dataset.d) { a.dataset.d = 1; a.textContent = '파란 설치팀 직접 시공'; b.textContent = '현장 배치·점검까지'; }
      const strip = endEl('hm-recap', (set || [['gen-prep', '자재 준비'], ['gen-install', '현장 시공'], ['gen-check', '점등·점검']]).map(([n, c]) => `<figure><img src="${IMG(n)}" alt="${c} 과정 사진"><figcaption><i>✓</i>${c}</figcaption></figure>`).join(''), {}, photo);
      const fs = [...strip.querySelectorAll('figure')];
      if (set) strip.classList.add('hm-recap-tl');
      gsap.set(fs, {opacity: 0, y: set ? -12 : 14});
      t.to(fs, {opacity: 1, y: 0, duration: .45, ease: 'back.out(1.6)', stagger: .45}, at + .5);
    },
  };
  if (endFx[fig.dataset.end]) endImg();
  const makeFx = {
    // 4 시공 컷: 실제 설치 작업 사진 한 장이 '현장 시공 중'으로 들어온 뒤, 완성된 현장 사진으로
    shot(t, at, outs) {
      resetOutsAnno();
      const c = shotIn(t, at, outs);
      t.to(c, {opacity: 0, scale: .92, y: -10, duration: .35}, at + 1.9);
      return {at: at + 1.9, end: null};
    },
    // 5 설치 과정 3컷: 자재 준비 → 현장 시공 → 점등·점검 사진이 차례로 놓인 뒤 완성 현장으로
    filmgen(t, at, outs) { return makeFx.film(t, at, outs, [['gen-prep', '① 자재 준비', '포럼 현수막 출력물을 펼쳐 자재를 준비하는 모습'], ['gen-install', '② 현장 시공', '사다리에 올라 포럼 포토월 그래픽을 붙이는 모습'], ['gen-check', '③ 점등·점검', '조명을 켜고 완성된 포토월을 점검하는 모습']]); },
    filmill(t, at, outs) { return makeFx.film(t, at, outs, [['ill-prep', '① 자재 준비', '포럼 현수막·포스터 출력물과 자재를 준비하는 일러스트'], ['ill-install', '② 현장 시공', '사다리에 올라 포럼 포토월 그래픽을 붙이는 일러스트'], ['ill-check', '③ 점등·점검', '조명을 켜고 완성된 포토월을 점검하는 일러스트']]); },
    film(t, at, outs, set) {
      resetOutsAnno();
      let cs = q('.hm-shot-film');
      if (!cs.length) {
        (set || [['install-prep', '① 자재 준비', '설치할 출력물과 자재를 행사장에 펼쳐 둔 모습'], ['install-wall', '② 현장 시공', '사다리에 올라 벽면 그래픽을 붙이는 모습'], ['install-led', '③ 점등·점검', '설치한 LED 화면과 벽면을 점검하는 모습']])
          .forEach(([n, cap, alt], i) => box.append(photoCard('hm-shot-film', IMG(n), cap, alt, {left: 52 + i * 172 + 'px', top: '82px', width: '152px'})));
        cs = q('.hm-shot-film');
      }
      gsap.set(cs, {opacity: 0, y: 24, rotation: 0});
      fadeOutsAnno(t, at);
      t.to(outs, {filter: 'brightness(.4)', duration: .35}, at);
      cs.forEach((c, i) => t.to(c, {opacity: 1, y: 0, rotation: [-3, 1.5, -1.5][i], duration: .45, ease: 'back.out(1.6)'}, at + .15 + i * .4));
      const e = at + .15 + cs.length * .4 + .9;
      t.to(cs, {opacity: 0, y: -10, duration: .35, stagger: .05}, e);
      return {at: e, end: null};
    },
    // 6 시공 → 완성 → 행사 당일: 시공 컷 뒤 완성 현장, 마지막에 같은 포토월 앞 행사 당일 사진
    story(t, at, outs) {
      resetOutsAnno();
      const c = shotIn(t, at, outs);
      let d = one('.hm-shot-day');
      if (!d) { d = photoCard('hm-shot-day', IMG('forum-day'), '행사 당일', '설치한 포토월 앞에서 찍은 포럼 참석자 단체 사진', {left: '394px', top: '262px', width: '190px'}); box.append(d); }
      gsap.set(d, {opacity: 0, y: 20, rotation: 0});
      t.to(c, {opacity: 0, scale: .92, y: -10, duration: .35}, at + 1.9);
      return {at: at + 1.9, end: (t, pinAt) => t.to(d, {opacity: 1, y: 0, rotation: 2.5, duration: .5, ease: 'back.out(1.6)'}, pinAt + 1.3)};
    },
    // 1 단계 표시: 위쪽에 디자인 → 인쇄 제작 → 현장 설치 단계가 차례로 켜지고, 시안물마다 '인쇄 완료' 표시
    steps(t, at, outs) {
      let bar = one('.hm-steps');
      if (!bar) {
        bar = el('hm-steps', ['디자인', '인쇄 제작', '현장 설치'].map((n, i) => `${i ? '<s></s>' : ''}<span data-s="${i}"><i>${i + 1}</i><b>${n}</b></span>`).join(''));
        box.append(bar);
        outs.forEach(o => o.append(el('hm-done', '✓ 인쇄 완료')));
      }
      const st = [...bar.querySelectorAll('[data-s]')], lines = [...bar.querySelectorAll('s')], done = q('.hm-done');
      resetOutsAnno(); st.forEach((x, i) => x.className = i ? '' : 'ok'); gsap.set(lines, {'--p': 0}); gsap.set(done, {opacity: 0, scale: .6}); gsap.set(bar, {opacity: 0, y: -8});
      fadeOutsAnno(t, at);
      t.to(bar, {opacity: 1, y: 0, duration: .35}, at + .1).to(lines[0], {'--p': 1, duration: .4}, at + .4).call(() => st[1].className = 'on', null, at + .75);
      let s = at + .85;
      done.forEach((d, i) => t.to(d, {opacity: 1, scale: 1, duration: .3, ease: 'back.out(2)'}, s + i * .16));
      s += done.length * .16 + .25;
      t.call(() => st[1].className = 'ok', null, s).to(lines[1], {'--p': 1, duration: .4}, s).call(() => st[2].className = 'on', null, s + .35).to(done, {opacity: 0, duration: .2}, s + .4);
      return {at: s + .4, end: (t, pinAt) => t.call(() => st[2].className = 'ok', null, pinAt + .2)};
    },
    // 2 인쇄기: 시안물이 차례로 인쇄기로 들어가고 '인쇄 완료' 용지가 나온 뒤, 포토월·X배너가 인쇄기에서 현장으로 날아감
    press(t, at, outs) {
      let pr = one('.hm-press');
      if (!pr) { pr = el('hm-press', '<em></em><p>인쇄 · 제작</p><u><i></i><i></i><i></i></u><div class="sheet">✓ 인쇄 완료</div>'); box.append(pr); }
      const sheet = pr.querySelector('.sheet'), lights = pr.querySelectorAll('u i');
      resetOutsAnno(); gsap.set(pr, {opacity: 0, y: 24}); gsap.set(sheet, {y: -30, opacity: 0}); gsap.set(lights, {opacity: .25});
      fadeOutsAnno(t, at);
      t.to(pr, {opacity: 1, y: 0, duration: .45, ease: 'back.out(1.4)'}, at + .05);
      const slot = {x: pr.offsetLeft + pr.offsetWidth / 2, y: pr.offsetTop + 8};
      let s = at + .5;
      outs.forEach((o, i) => {
        const d = center(o);
        if (!o.dataset.to) o.classList.add('hm-gone');
        t.to(o.querySelector('.hm-tag'), {opacity: 0, duration: .15}, s)
         .to(o, {x: slot.x - d.x, y: slot.y - d.y, scale: .12, rotation: 0, opacity: 0, duration: .5, ease: 'power2.in'}, s)
         .to(pr, {y: 3, duration: .08, yoyo: true, repeat: 1}, s + .45).to(lights[i % 3], {opacity: 1, duration: .1, yoyo: true, repeat: 1}, s + .45);
        s += .26;
      });
      s += .4;
      t.to(sheet, {y: 0, opacity: 1, duration: .45, ease: 'power2.out'}, s).to(lights, {opacity: 1, duration: .2}, s);
      // 설치할 시안물(포토월·X배너)은 인쇄기 위에서 다시 나타나 현장 사진으로 이동
      t.set(outs.filter(o => o.dataset.to), {opacity: 1, scale: .12}, s + .8);
      return {at: s + .8, end: (t, pinAt) => t.to(pr, {opacity: 0, y: 20, duration: .4}, pinAt - .9)};
    },
    // 3 진행표: 시안물별 제작 항목이 하나씩 체크되고, 마지막 '현장 설치'까지 체크
    list(t, at, outs) {
      let card = one('.hm-list');
      if (!card) {
        card = el('hm-list', '<p>제작 · 설치 진행</p>' + outs.map(o => `<div><i></i><span>${outName(o)}</span><em>${outName(o) === '포토월' ? '제작' : outName(o) === '자료집' ? '인쇄·제본' : '인쇄'}</em></div>`).join('') + '<div class="go"><i></i><span>현장 설치</span><em>설치</em></div>');
        box.append(card);
      }
      const rows = [...card.querySelectorAll('div')];
      resetOutsAnno(); rows.forEach(r => r.classList.remove('ok', 'on')); gsap.set(card, {opacity: 0, scale: .94});
      fadeOutsAnno(t, at);
      t.to(outs, {filter: 'brightness(.6)', duration: .3}, at).to(card, {opacity: 1, scale: 1, duration: .35, ease: 'back.out(1.5)'}, at + .1);
      let s = at + .55;
      outs.forEach((o, i) => {
        t.to(o, {filter: 'brightness(1)', duration: .15}, s).call(() => rows[i].classList.add('ok'), null, s + .1).to(o, {filter: 'brightness(.6)', duration: .2}, s + .3);
        s += .3;
      });
      const last = rows[rows.length - 1];
      t.call(() => last.classList.add('on'), null, s + .1).to(card, {opacity: 0, scale: .96, duration: .3}, s + .6);
      return {at: s + .55, end: (t, pinAt) => t.call(() => last.classList.add('ok'), null, pinAt)};
    },
  };
  const intro = {
    // 1 디자인 툴: 선택 상자·색상 패널이 뜨고, 색을 입히고 모서리를 끌어 크기를 맞춘 다음 시안물로
    tool(t, kv) {
      const k = K();
      let sel = one('.hm-sel'), tools = one('.hm-tools');
      if (!sel) {
        sel = el('hm-sel', '<i></i><i></i><i></i><i></i><b>포스터 편집 중</b>', {left: k.x - 5 + 'px', top: k.y - 5 + 'px', width: k.w + 10 + 'px', height: k.h + 10 + 'px'});
        tools = el('hm-tools', '<p>색상</p><span style="background:#ffffff"></span><span class="on" style="background:#2a2f74"></span><span style="background:#ccff30"></span><span style="background:#ff7a59"></span><p>글꼴</p><em>Aa</em>', {left: k.x + k.w + 22 + 'px', top: k.y + 26 + 'px'});
        box.append(sel, tools);
      }
      const sw = tools.querySelector('.on'), h = sel.querySelectorAll('i')[3], how = fig.dataset.tool;
      gsap.set([sel, tools], {opacity: 0}); gsap.set(sel, {scale: .9});
      let at;
      if (paint[how]) {
        gsap.set(kv, {opacity: 0, scale: .9, filter: 'none'});
        t.to(kv, {opacity: 1, duration: .45}, .2).to(sel, {opacity: 1, duration: .3}, .45).fromTo(tools, {opacity: 0, x: -10}, {opacity: 1, x: 0, duration: .35}, .6);
        at = paint[how](t, kv, sw, .9);
      } else {
        gsap.set(kv, {opacity: 0, scale: .9, filter: 'grayscale(1) brightness(.75)'});
        t.to(kv, {opacity: 1, duration: .45}, .2).to(sel, {opacity: 1, duration: .3}, .45).fromTo(tools, {opacity: 0, x: -10}, {opacity: 1, x: 0, duration: .35}, .6);
        at = click(t, abs(sw, 9, 9), .9);
        t.to(kv, {filter: 'grayscale(0) brightness(1)', duration: .6}, at).to(sw, {scale: 1.25, duration: .15, yoyo: true, repeat: 1}, at - .05);
      }
      // 모서리 손잡이를 잡아 끌어서 크기를 맞춤
      at = click(t, abs(h, 4, 4), at + .45);
      const tx = k.x + k.w + 5 - 6, ty = k.y + k.h + 5 - 4;
      t.to(cursor, {x: tx, y: ty, duration: .55, ease: 'power2.inOut'}, at).to([kv, sel], {scale: 1, duration: .55, ease: 'power2.inOut'}, at);
      at += .75;
      t.to([sel, tools], {opacity: 0, duration: .3}, at).to(kv, {scale: 1.05, duration: .16, yoyo: true, repeat: 1}, at);
      return at + .2;
    },
    // 2 레이어 쌓기: 빈 바탕 위에 지도·타이틀·행사 정보 레이어를 하나씩 켜서 포스터를 완성
    layers(t, kv) {
      const k = K();
      let panel = one('.hm-layers');
      if (!panel) {
        panel = el('hm-layers', '<p>레이어</p>' + ['행사 정보', '타이틀', '세계 지도', '배경'].map((n, i) => `<div data-l="${i}"><i></i><span>${n}</span></div>`).join(''), {left: '34px', top: k.y + 20 + 'px'});
        [[0, 44], [44, 18], [62, 38]].forEach(([y, hh], i) => kv.append(el('hm-veil', '', {top: y + '%', height: hh + '%'})));
        box.append(panel);
      }
      const rows = [...panel.querySelectorAll('[data-l]')], veils = [...kv.querySelectorAll('.hm-veil')];
      rows.forEach((r, i) => r.classList.toggle('on', i === 3));
      gsap.set(veils, {opacity: 1}); gsap.set(kv, {opacity: 0, scale: .96}); gsap.set(panel, {opacity: 0, x: -10});
      t.to(kv, {opacity: 1, scale: 1, duration: .45}, .2).to(panel, {opacity: 1, x: 0, duration: .35}, .4);
      let at = .8;
      [[2, 2], [1, 0], [0, 1]].forEach(([r, v]) => {
        at = click(t, abs(rows[r].querySelector('i'), 7, 6), at);
        t.call(() => rows[r].classList.add('on'), null, at - .05).to(veils[v], {opacity: 0, duration: .4}, at);
        at += .3;
      });
      t.to(panel, {opacity: 0, x: -10, duration: .3}, at + .2).to(kv, {scale: 1.05, duration: .16, yoyo: true, repeat: 1}, at + .2);
      return at + .4;
    },
    // 3 스케치 → 시안: 커서가 펜으로 포스터 구성을 먼저 그리고, 그 위에 완성 포스터가 채워짐
    sketch(t, kv) {
      const k = K(), W = k.w, H = k.h;
      let svg = one('.hm-sketch');
      if (!svg) {
        const P = (d) => `<path d="${d}"/>`;
        svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'hm-sketch'); svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
        Object.assign(svg.style, {left: k.x + 'px', top: k.y + 'px', width: W + 'px', height: H + 'px'});
        svg.innerHTML = P(`M4 4H${W - 4}V${H - 4}H4Z`) + P(`M${W * .2} ${H * .12}H${W * .8}`) + P(`M${W * .16} ${H * .2}H${W * .84}`) + P(`M${W * .2} ${H * .28}H${W * .8}`)
          + P(`M${W * .22} ${H * .38}H${W * .78}M${W * .3} ${H * .44}H${W * .7}`) + P(`M${W * .28} ${H * .54}H${W * .72}`)
          + P(`M${W * .12} ${H * .78}C${W * .2} ${H * .66} ${W * .34} ${H * .7} ${W * .42} ${H * .74}C${W * .52} ${H * .64} ${W * .7} ${H * .66} ${W * .88} ${H * .76}C${W * .8} ${H * .9} ${W * .5} ${H * .86} ${W * .3} ${H * .9}C${W * .18} ${H * .9} ${W * .1} ${H * .86} ${W * .12} ${H * .78}Z`);
        box.append(svg);
        [...svg.querySelectorAll('path')].forEach(p => { const n = Math.ceil(p.getTotalLength()) + 2; p.dataset.length = n; p.style.strokeDasharray = n; });
      }
      const paths = [...svg.querySelectorAll('path')];
      gsap.set(paths, {strokeDashoffset: (i, p) => p.dataset.length}); gsap.set(svg, {opacity: 1}); gsap.set(kv, {opacity: 0, scale: 1});
      let at = .3;
      paths.forEach((p, i) => {
        const a = p.getPointAtLength(0), b = p.getPointAtLength(p.getTotalLength() * (i ? 1 : .999)), d = i ? .24 : .6;
        t.to(cursor, {opacity: 1, x: k.x + a.x - 6, y: k.y + a.y - 4, duration: .22, ease: 'power2.inOut'}, at)
         .to(p, {strokeDashoffset: 0, duration: d, ease: 'none'}, at + .22)
         .to(cursor, {x: k.x + b.x - 6, y: k.y + b.y - 4, duration: d, ease: 'none'}, at + .22);
        at += .22 + d + .04;
      });
      // 스케치 위로 완성 포스터가 아래에서 위로 채워짐
      t.fromTo(kv, {opacity: 1, clipPath: 'inset(100% 0% 0% 0%)'}, {clipPath: 'inset(0% 0% 0% 0%)', duration: .7, ease: 'power2.inOut'}, at + .1)
       .to(svg, {opacity: 0, duration: .4}, at + .6).set(kv, {clearProps: 'clipPath'}, at + .85)
       .to(kv, {scale: 1.05, duration: .16, yoyo: true, repeat: 1}, at + .85);
      return at + 1;
    },
  };
  let tl = null, visible = true;
  // 한 번 끝나면 처음 상태로 되돌려 다시 재생. 화면 밖·숨은 탭에서는 멈춤
  function run() {
    fit(); hideAnno(); gsap.set(cursor, {opacity: 0, x: 560, y: 400, scale: 1});
    const [t, end] = build[v]();
    t.set({}, {}, end);
    tl = t;
    if (reduced.matches) { t.progress(1); gsap.set(cursor, {opacity: 0}); return; }
    t.eventCallback('onComplete', run);
    if (!visible) t.pause();
  }
  new ResizeObserver(fit).observe(fig);
  new IntersectionObserver(([e]) => { visible = e.isIntersecting && !document.hidden; if (tl) visible ? tl.play() : tl.pause(); }).observe(fig);
  document.addEventListener('visibilitychange', () => { visible = !document.hidden; if (tl) visible ? tl.play() : tl.pause(); });
  run();
})();
