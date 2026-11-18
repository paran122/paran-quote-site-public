(() => {
  'use strict';
  // 실제 상세 첫 화면(booklet-layer 1.6 확정본) — 1.5 '한 장씩 변신'을 빠르게 하고, 손글씨 고리 주석과 클릭 커서를 더함
  const stage = document.querySelector('.booklet-layer');
  if (!stage || !window.gsap) return;
  const box = stage.querySelector('.ly-stage');
  const flow = stage.dataset.flow;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const q = selector => [...stage.querySelectorAll(selector)];
  const items = q('.ly-before'), pages = q('.ly-spread img'), spread = stage.querySelector('.ly-spread');
  const cover = stage.querySelector('.ly-cover'), sparks = q('.ly-spark');
  const step = n => n === 1 ? q('.ly-step[data-step="1"], .ly-pile-label') : q(`.ly-step[data-step="${n}"]`);
  const cursor = stage.querySelector('.ly-cursor'), burst = q('.ly-burst'), mode = stage.dataset.cursor || '';
  const annoLine = k => q(`.ly-anno-line[data-anno="${k}"]`), annoText = k => q(`.ly-anno[data-anno="${k}"]`);
  q('.ly-anno-line').forEach(path => { const n = Math.ceil(path.getTotalLength()) + 2; path.dataset.length = n; path.style.strokeDasharray = n; });
  const home = {x: 560, y: 400};
  // 손글씨 고리 선을 그리고 문구를 띄움
  function drawAnno(t, k, at) {
    t.fromTo(annoLine(k), {strokeDashoffset: (i, el) => el.dataset.length}, {strokeDashoffset: 0, duration: .55, ease: 'power2.inOut'}, at)
     .fromTo(annoText(k), {opacity: 0, y: 8}, {opacity: 1, y: 0, duration: .35}, at + .25);
  }
  // 커서가 대상 위로 가서 누르고, 클릭 선이 튐
  function click(t, x, y, at) {
    t.to(cursor, {opacity: 1, x: x - 6, y: y - 4, duration: .4, ease: 'power2.inOut'}, at)
     .to(cursor, {scale: .82, duration: .08, yoyo: true, repeat: 1}, at + .4)
     .fromTo(burst, {opacity: 1, scale: .6, transformOrigin: '6px 4px'}, {opacity: 0, scale: 1.4, duration: .35}, at + .45);
    return at + .5;
  }
  let visible = true, paused = false, tl = null, movers = [];

  function fit() {
    const r = stage.getBoundingClientRect();
    if (r.width && r.height) box.style.setProperty('--ly-scale', Math.min(r.width / 600, r.height / 430).toFixed(4));
  }
  // 스테이지 좌표(600x430) 기준 요소 중심
  const center = el => ({x: el.offsetLeft + el.offsetWidth / 2, y: el.offsetTop + el.offsetHeight / 2});
  const rot = el => +(el.dataset.rot || 0);

  function reset() {
    gsap.set(items, {x: 0, y: 0, scale: 1, opacity: 1, rotation: (i, el) => rot(el)});
    gsap.set(pages, {opacity: 0});
    gsap.set(cover, {opacity: 0, x: 60, y: 0, rotation: rot(cover) + 8, scale: .9});
    gsap.set([...step(2), ...step(3), ...sparks], {opacity: 0, y: 6});
    q('.ly-anno-line').forEach(path => path.style.strokeDashoffset = path.dataset.length);
    gsap.set([...q('.ly-anno'), ...q('.ly-doodle')], {opacity: 0});
    if (cursor) gsap.set(cursor, {opacity: 0, x: home.x, y: home.y, scale: 1});
  }
  function finale(t, at) {
    t.to(spread, {scale: 1.04, duration: .2, yoyo: true, repeat: 1}, at)
     // '흩어진 발표자료' 문구는 남은 자료가 다 빨려 들어가는 순간 함께 사라짐
     .to(step(1), {opacity: 0, duration: .35}, at - .1)
     .to(step(2), {opacity: 1, y: 0, duration: .4}, at)
     .to(cover, {opacity: 1, x: 0, rotation: rot(cover), scale: 1, duration: .8, ease: 'back.out(1.5)'}, at + .5);
    if (annoLine('spread').length) drawAnno(t, 'spread', at + .1);
    let coverAt = at + 1;
    if (mode === 'cover') {
      const c = center(cover);
      coverAt = click(t, c.x, c.y + 40, at + 1.1);
      t.to(cover, {scale: 1.05, duration: .15, yoyo: true, repeat: 1}, coverAt - .05);
    }
    if (annoLine('cover').length) drawAnno(t, 'cover', coverAt);
    // 연필이 밑줄 시작점에서 끝까지 따라가며 긋고, 끝에서 살짝 끄적임
    const pencil = stage.querySelector('.ly-pencil');
    if (pencil) t.fromTo(pencil, {x: -94, y: 6, rotation: 0}, {x: 0, y: 0, duration: .55, ease: 'power2.inOut'}, coverAt)
      .to(pencil, {rotation: -12, x: -4, y: -3, duration: .22, yoyo: true, repeat: 5, ease: 'sine.inOut'}, coverAt + .6);
    if (cursor) t.to(cursor, {opacity: 0, duration: .3}, coverAt + .6);
    // 좌측 상단 장식: 선은 그려지고, 별은 반짝임
    t.to([...q('.ly-doodle'), ...q('.ly-doodle-text')], {opacity: 1, duration: .25}, coverAt + .1);
    q('.ly-doodle path:not(.ly-fill)').forEach((path, i) => {
      const n = Math.ceil(path.getTotalLength()) + 2;
      t.fromTo(path, {strokeDasharray: n, strokeDashoffset: n}, {strokeDashoffset: 0, duration: .5, ease: 'power2.inOut'}, coverAt + .15 + i * .35);
    });
    const stars = q('.ly-twinkle .ly-fill');
    if (stars.length) t.fromTo(stars, {scale: .2, transformOrigin: '50% 50%'}, {scale: 1, duration: .45, stagger: .12, ease: 'back.out(2.4)'}, coverAt + .1)
      .to(stars, {scale: .7, duration: .35, yoyo: true, repeat: 3, stagger: .15, ease: 'sine.inOut'}, coverAt + .7);
    t.to([...step(3), ...sparks], {opacity: 1, y: 0, duration: .4}, coverAt)
     .to(sparks, {scale: 1.3, duration: .4, yoyo: true, repeat: 3}, at + 1.3)
     .to(cover, {keyframes: [{rotation: '-=2', y: -5}, {rotation: '+=3.5', y: -2}, {rotation: '-=1.5', y: 0}], duration: 1.8}, at + 1.6);
    return at + 4.4; // 완성 화면을 잠시 보여 준 뒤 처음으로
  }
  function restart(t, at) {
    t.to([cover, ...pages, ...step(2), ...step(3), ...sparks, ...q('.ly-anno'), ...q('.ly-anno-line'), ...q('.ly-doodle')], {opacity: 0, duration: .4}, at)
     .set(q('.ly-anno-line'), {opacity: 1, strokeDashoffset: (i, el) => el.dataset.length}, at + .4)
     .set(items, {x: 0, y: -14, scale: 1, rotation: (i, el) => rot(el)}, at + .4)
     .to(items, {opacity: 1, y: 0, duration: .45, stagger: .06}, at + .45)
     .to(step(1), {opacity: 1, duration: .3}, at + .45);
  }
  // 빠른 변신: 가운데로 오면서 바로 깔끔한 페이지로 바뀌고 곧장 내지 자리로 이동 (한 장 약 1.3초)
  function fastMorph(t, k, at, s, spot, clean) {
    const el = items[k], c = center(el), p = pages[k];
    const target = {x: spread.offsetLeft + p.offsetLeft + p.offsetWidth / 2 - s.x, y: spread.offsetTop + p.offsetTop + p.offsetHeight / 2 - s.y};
    if (mode === 'files') at = click(t, c.x, c.y, at);
    t.to(el, {x: s.x - c.x, y: s.y - c.y, rotation: 0, scale: 1.2, duration: .4, ease: 'power2.inOut'}, at)
     .to(el, {opacity: 0, scale: 1.35, duration: .25}, at + .35)
     .fromTo(clean[k], {opacity: 0, scale: .88}, {opacity: 1, scale: 1, duration: .3, ease: 'back.out(1.8)'}, at + .38);
    if (k === 0 && annoLine('morph').length) drawAnno(t, 'morph', at + .45);
    t.to(clean[k], {x: target.x, y: target.y, scale: p.offsetWidth / spot.offsetWidth, duration: .45, ease: 'power2.inOut'}, at + .8)
     .set(p, {opacity: 1}, at + 1.25)
     .set(clean[k], {opacity: 0, x: 0, y: 0, scale: 1}, at + 1.25);
    if (k === 1 && annoLine('morph').length) t.to([...annoLine('morph'), ...annoText('morph')], {opacity: 0, duration: .3}, at + 1.1)
     .set(annoLine('morph'), {opacity: 1, strokeDashoffset: (i, e) => e.dataset.length}, at + 1.45);
    return at + 1.35;
  }
  const flows = {
    // 파일이 하나씩 '편집' 통로로 들어가면 내지가 채워짐
    pipe(t) {
      const gate = {x: +stage.dataset.gx, y: +stage.dataset.gy}, chev = q('.ly-gate i');
      items.forEach((el, i) => {
        const c = center(el), at = 1.5 + i * .32;
        t.to(el, {x: gate.x - c.x, y: gate.y - c.y, scale: .2, rotation: 0, opacity: 0, duration: .55, ease: 'power2.in'}, at)
         .to(chev, {opacity: 1, duration: .12, stagger: .05, yoyo: true, repeat: 1}, at + .4);
      });
      const done = 1.5 + items.length * .32 + .3;
      t.to(pages[0], {opacity: 1, duration: .4}, done - 1.1).to(pages[1], {opacity: 1, duration: .4}, done - .4);
      return finale(t, done);
    },
    // 파일이 가운데로 와서 깔끔한 페이지로 바뀐 뒤 내지 자리로 이동
    morph(t) {
      const spot = stage.querySelector('.ly-morph'), clean = q('.ly-morph img'), badge = spot.querySelector('span');
      const s = center(spot);
      gsap.set(clean, {opacity: 0, x: 0, y: 0, scale: 1});
      const fast = stage.dataset.fast === '1';
      let at = 1.2;
      [0, 1].forEach(k => {
        if (fast) { at = fastMorph(t, k, at, s, spot, clean); return; }
        const el = items[k], c = center(el), p = pages[k];
        const target = {x: spread.offsetLeft + p.offsetLeft + p.offsetWidth / 2 - s.x, y: spread.offsetTop + p.offsetTop + p.offsetHeight / 2 - s.y};
        t.to(el, {x: s.x - c.x, y: s.y - c.y, rotation: 0, scale: 1.25, duration: .7, ease: 'power2.inOut'}, at)
         .to(badge, {opacity: 1, duration: .2}, at + .5)
         .to(el, {opacity: 0, scale: 1.4, filter: 'blur(4px)', duration: .45}, at + .8)
         .fromTo(clean[k], {opacity: 0, scale: .85}, {opacity: 1, scale: 1, duration: .5, ease: 'back.out(1.6)'}, at + .85)
         .to(badge, {opacity: 0, duration: .2}, at + 1.5)
         .to(clean[k], {x: target.x, y: target.y, scale: p.offsetWidth / spot.offsetWidth, duration: .7, ease: 'power2.inOut'}, at + 1.7)
         .set(p, {opacity: 1}, at + 2.4)
         .set(clean[k], {opacity: 0, x: 0, y: 0, scale: 1}, at + 2.4)
         .set(el, {filter: 'none'}, at + 2.4);
        at += 2.5;
      });
      // 파일을 다 누른 뒤 커서는 바로 사라짐
      if (cursor && mode === 'files') t.to(cursor, {opacity: 0, duration: .25}, at - .2);
      items.slice(2).forEach((el, i) => {
        const c = center(el), sc = center(spread);
        t.to(el, {x: sc.x - c.x, y: sc.y - c.y, scale: .2, rotation: 0, opacity: 0, duration: .5, ease: 'power2.in'}, at + i * .15);
      });
      return finale(t, at + .6);
    },
    // 라임색 선이 지나간 자리마다 흩어진 자료가 깔끔한 내지로 바뀜
    sweep(t) {
      const scan = stage.querySelector('.ly-scan'), pile = stage.querySelector('.ly-pile'), zone = stage.querySelector('.ly-cleanzone');
      const x0 = +stage.dataset.x0, x1 = +stage.dataset.x1, p = {v: 0};
      const draw = () => {
        const x = x0 + (x1 - x0) * p.v;
        scan.style.left = x + 'px';
        pile.style.clipPath = `inset(0 0 0 ${x}px)`;
        zone.style.clipPath = `inset(0 ${600 - x}px 0 0)`;
      };
      t.call(() => { p.v = 0; draw(); gsap.set(pages, {opacity: 1}); }, null, 0)
       .to(scan, {opacity: 1, duration: .3}, 1.5)
       .to(p, {v: 1, duration: 2.6, ease: 'power1.inOut', onUpdate: draw}, 1.6)
       .to(scan, {opacity: 0, duration: .3}, 4.2);
      const end = finale(t, 4.3);
      t.to(zone, {opacity: 0, duration: .4}, end)
       .call(() => { p.v = 0; draw(); }, null, end + .45)
       .set(zone, {opacity: 1}, end + .5)
      return end;
    }
  };
  function build() {
    tl?.kill();
    if (reduced.matches) { // 동작 줄이기: 완성된 장면만 보여 줌
      gsap.set(items, {opacity: 0}); gsap.set(pages, {opacity: 1}); gsap.set(cover, {opacity: 1, rotation: rot(cover)});
      q('.ly-pile').forEach(el => el.style.clipPath = 'inset(0 0 0 600px)');
      q('.ly-cleanzone').forEach(el => el.style.clipPath = 'none');
      return;
    }
    reset();
    tl = gsap.timeline({repeat: -1, defaults: {ease: 'power2.out'}});
    restart(tl, flows[flow](tl));
    // 첫 진입에는 흩어진 자료만 서 있는 대기 구간을 건너뛰고 바로 움직임 시작 (반복 때는 그대로 쉼)
    if (!build.started) { tl.time(flow === 'morph' ? 1.1 : 1.4); build.started = true; }
    movers = q('[data-depth]').map(el => ({depth: +el.dataset.depth,
      x: gsap.quickTo(el, 'xPercent', {duration: .9, ease: 'power2.out'}), y: gsap.quickTo(el, 'yPercent', {duration: .9, ease: 'power2.out'})}));
    updatePlayback();
  }
  function updatePlayback() {
    const play = visible && !paused && !document.hidden && !reduced.matches;
    if (tl) play ? tl.resume() : tl.pause();
    stage.dataset.motion = play ? 'playing' : 'paused';
  }
  stage.addEventListener('pointermove', event => {
    if (!finePointer.matches || reduced.matches || paused) return;
    const r = stage.getBoundingClientRect();
    const dx = (event.clientX - r.left) / r.width - .5, dy = (event.clientY - r.top) / r.height - .5;
    movers.forEach(m => { m.x(dx * m.depth * 2.4); m.y(dy * m.depth * 2.4); });
  });
  stage.addEventListener('pointerleave', () => movers.forEach(m => { m.x(0); m.y(0); }));
  stage.addEventListener('keydown', event => {
    if (event.code !== 'Space') return;
    event.preventDefault(); paused = !paused; updatePlayback();
  });
  new ResizeObserver(fit).observe(stage);
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; updatePlayback(); }, {threshold: .1}).observe(stage);
  document.addEventListener('visibilitychange', updatePlayback);
  reduced.addEventListener('change', build);
  fit(); build();
})();
