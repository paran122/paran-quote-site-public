(() => {
  'use strict';
  // 메인 첫 화면 모션 후보 1.2 (1.1 + 포스터 중심 파생 세 안) — 자료집 상세(booklet-hero-layer)의 커서 클릭·손글씨 주석 방식을 메인 내용에 맞춤
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
      gsap.set(outs, {opacity: 0, filter: 'none'}); gsap.set(kv, {opacity: 0, scale: .9, filter: 'none'}); gsap.set([pill, photo, ...clones], {opacity: 0});
      gsap.set(links, {strokeDasharray: (i, el) => `${el.dataset.length}`, strokeDashoffset: (i, el) => el.dataset.length, opacity: .9});
      gsap.set(q('.hm-spark'), {opacity: 0});
      const t = gsap.timeline();
      t.to(kv, {opacity: 1, scale: 1, duration: .55, ease: 'back.out(1.5)'}, .2);
      let at = click(t, abs(kv, kv.offsetWidth / 2, kv.offsetHeight / 2), .9);
      t.to(kv, {scale: 1.06, duration: .16, yoyo: true, repeat: 1}, at);
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
      t.to(pill, {scale: .92, duration: .1, yoyo: true, repeat: 1}, at)
       .to([...outs, ...links], {filter: 'brightness(.45)', opacity: (i, el) => el.tagName === 'path' ? .25 : 1, duration: .5}, at + .1)
       .fromTo(photo, {opacity: 0, scale: .5, rotation: 0}, {opacity: 1, scale: 1, rotation: 2, duration: .8, ease: 'back.out(1.3)'}, at + .2)
       .to(cursor, {opacity: 0, duration: .3}, at + .5);
      anno(t, 'site', at + 1);
      t.to(q('.hm-spark'), {opacity: 1, duration: .3}, at + .9).to(q('.hm-spark'), {scale: 1.3, duration: .4, yoyo: true, repeat: 3}, at + 1.1);
      return [t, at + 4.4];
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
