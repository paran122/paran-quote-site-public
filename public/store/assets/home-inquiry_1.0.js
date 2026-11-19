// 홈 '견적·문의' 칸 (2026-11-19). 서비스를 고르지 않고 남기는 문의.
// 접수 길은 견적 요청 화면의 상담 모드(ui/app.js initRequest)와 같다: ParanStore.api('submit', {mode:'consult', items:[]}).
(() => {
  'use strict';
  const form = document.getElementById('hqi-form');
  if (!form) return;
  const HISTORY_KEY = 'paran.services.requests.v1';
  const DRAFT_KEY = 'paran.hqi.draft'; // '자세히 적기'로 넘어갈 때 적은 내용을 들고 간다(ui/app.js initRequest 가 읽고 지움)
  const section = document.getElementById('quick-inquiry');
  const errorBox = document.getElementById('hqi-error');
  const button = form.querySelector('.hqi-submit');
  const live = document.getElementById('hqi-live');
  const rules = {
    email: [v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), '이메일 주소 형식을 확인해 주세요. 예: name@agency.go.kr'],
    phone: [v => /^[+\d\s().-]{8,30}$/.test(v) && v.replace(/\D/g, '').length >= 8, '연락처는 숫자 8자리 이상으로 적어 주세요. 예: 010-1234-5678'],
  };
  const EMPTY = { title: '행사명 또는 작업명을 적어 주세요.', brief: '문의 내용을 적어 주세요.', organization: '기관·회사명을 적어 주세요.', name: '담당자 이름을 적어 주세요.', phone: '연락처를 적어 주세요.', email: '이메일을 적어 주세요.', consent: '동의가 필요합니다.' };
  const uid = () => (crypto.randomUUID ? crypto.randomUUID() : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)));
  const newToken = () => Array.from(crypto.getRandomValues(new Uint8Array(32)), b => b.toString(16).padStart(2, '0')).join('');
  let requestId = uid(), token = newToken(), submitting = false, tried = false;

  // ── 필요한 일 고르기
  const radios = [...document.querySelectorAll('input[name="hqi-need"]')];
  const need = () => (radios.find(r => r.checked) || {}).value || 'unsure';
  const topic = () => (need() === 'agency' ? 'event-agency' : '');
  const full = form.querySelector('[data-hqi-full]');
  const quotePanel = section.querySelector('.hqi-quote');
  const narrow = () => matchMedia('(max-width:900px)').matches;
  function syncNeed(fromUser) {
    if (full) full.href = '/request/?mode=consult' + (topic() ? '&service=' + topic() : '');
    errorBox.hidden = true;
    if (!fromUser) return;
    tried = false;
    form.querySelectorAll('.hqi-note').forEach(n => { if (n.id !== 'hqi-file-note') { n.hidden = true; n.textContent = ''; } });
    form.querySelectorAll('[aria-invalid]').forEach(el => el.removeAttribute('aria-invalid'));
    const n = need();
    if (live) live.textContent = n === 'design' ? '서비스 고르기 안내가 보입니다.' : (n === 'agency' ? '행사 대행 문의 양식이 보입니다.' : '문의 양식이 보입니다.');
    // 폰에서는 고른 결과가 화면 아래에 있어 그쪽으로 데려간다
    if (narrow()) (n === 'design' ? quotePanel : form).scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'auto' : 'smooth' });
  }
  radios.forEach(r => r.addEventListener('change', () => syncNeed(true)));
  syncNeed(false);
  // 견적 칸의 '문의 남기기': 문의 양식으로 바꾸고 첫 칸으로
  const ask = section.querySelector('[data-hqi-ask]');
  if (ask) ask.addEventListener('click', () => {
    document.getElementById('hqi-need-unsure').checked = true;
    syncNeed(true);
    form.elements.title.focus({ preventScroll: narrow() });
  });
  // '자세히 적기': 적던 내용을 들고 간다(첨부 제외)
  function saveDraft() {
    try {
      const d = Object.fromEntries(new FormData(form));
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ title: d.title || '', brief: d.brief || '', organization: d.organization || '', name: d.name || '', phone: d.phone || '', email: d.email || '' }));
    } catch (_) { /* 저장이 막혀도 이동은 한다 */ }
  }
  if (full) full.addEventListener('click', saveDraft);

  // ── 칸 바로 아래에 이유를 적는다(알림창 대신)
  function note(el) {
    const hint = el.nextElementSibling && el.nextElementSibling.classList.contains('hqi-hint') ? el.nextElementSibling : null;
    const box = el.closest('.hqi-consent') || hint || el;
    let n = box.nextElementSibling;
    if (!(n && n.classList.contains('hqi-note'))) {
      n = document.createElement('p');
      n.className = 'hqi-note';
      n.id = 'hqi-note-' + el.name;
      n.hidden = true;
      box.after(n);
      el.setAttribute('aria-describedby', [el.getAttribute('aria-describedby'), n.id].filter(Boolean).join(' '));
    }
    return n;
  }
  function check(el, showEmpty) {
    const n = note(el);
    const value = el.type === 'checkbox' ? (el.checked ? 'on' : '') : el.value.trim();
    let message = '';
    if (!value) message = showEmpty ? (EMPTY[el.name] || '필수 항목입니다.') : '';
    else if (rules[el.name] && !rules[el.name][0](value)) message = rules[el.name][1];
    n.textContent = message;
    n.hidden = !message;
    if (message) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid');
    return !message;
  }
  const fields = [...form.querySelectorAll('[required]')];
  for (const el of fields) {
    el.addEventListener('blur', () => { if (tried) check(el, true); else if (el.type !== 'checkbox' && el.value.trim()) check(el, false); });
    // 한 번 접수를 눌렀으면 빈 칸 안내를 계속 보여 준다(썼다 지워도 사라지지 않게)
    const again = () => { if (tried || el.hasAttribute('aria-invalid')) check(el, tried); };
    el.addEventListener('input', again);
    el.addEventListener('change', again);
  }

  // ── 첨부: 끌어다 놓거나 눌러서 고른다. 규칙(개수·크기·종류)과 올리기는 견적 요청 화면과 같은 함수를 쓴다.
  const drop = document.getElementById('hqi-drop'), fileInput = document.getElementById('hqi-file');
  const fileList = document.getElementById('hqi-filelist'), fileNote = document.getElementById('hqi-file-note');
  let picked = [], uploaded = null, uploadedSig = '';
  const sig = () => picked.map(f => f.name + ':' + f.size + ':' + f.lastModified).join('|');
  const sizeText = n => (n >= 1048576 ? (n / 1048576).toFixed(1) + 'MB' : Math.max(1, Math.round(n / 1024)) + 'KB');
  const fileProblem = () => { const s = window.ParanStore; return s && s.fileProblem ? s.fileProblem(picked) : (picked.length > 5 ? '첨부는 최대 5개까지 가능합니다. ' + (picked.length - 5) + '개를 빼 주세요.' : ''); };
  function renderFiles(focusIndex) {
    fileList.textContent = '';
    picked.forEach((f, i) => {
      const li = document.createElement('li');
      const nm = document.createElement('span'); nm.className = 'nm'; nm.textContent = f.name; nm.title = f.name;
      const sz = document.createElement('span'); sz.className = 'sz'; sz.textContent = sizeText(f.size);
      const rm = document.createElement('button'); rm.type = 'button'; rm.textContent = '빼기'; rm.setAttribute('aria-label', f.name + ' 빼기');
      rm.addEventListener('click', () => { picked.splice(i, 1); renderFiles(Math.min(i, picked.length - 1)); if (live) live.textContent = f.name + ' 뺐습니다. 첨부 ' + picked.length + '개.'; });
      li.append(nm, sz, rm); fileList.append(li);
    });
    const p = fileProblem(); fileNote.textContent = p || ''; fileNote.hidden = !p;
    if (focusIndex != null) (fileList.querySelectorAll('button')[focusIndex] || fileInput).focus();
  }
  function addFiles(list) {
    let added = 0;
    for (const f of list) if (!picked.some(x => x.name === f.name && x.size === f.size && x.lastModified === f.lastModified)) { picked.push(f); added++; }
    renderFiles();
    if (live && added) live.textContent = '첨부 ' + picked.length + '개.';
  }
  if (drop && fileInput) {
    fileInput.addEventListener('change', () => { addFiles([...fileInput.files]); fileInput.value = ''; });
    for (const t of ['dragenter', 'dragover']) drop.addEventListener(t, e => { e.preventDefault(); drop.classList.add('is-over'); });
    for (const t of ['dragleave', 'dragend']) drop.addEventListener(t, () => drop.classList.remove('is-over'));
    drop.addEventListener('drop', e => { e.preventDefault(); drop.classList.remove('is-over'); if (e.dataTransfer && e.dataTransfer.files.length) addFiles([...e.dataTransfer.files]); });
    // 칸 밖에 놓쳤을 때 브라우저가 파일을 열어 페이지를 떠나지 않게
    for (const t of ['dragover', 'drop']) form.addEventListener(t, e => { if (e.dataTransfer && [...e.dataTransfer.types].includes('Files')) e.preventDefault(); });
  }

  // ── 접수
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (submitting) return;
    tried = true;
    const bad = fields.filter(el => !check(el, true));
    if (bad.length) { bad[0].focus(); bad[0].scrollIntoView({ block: 'center' }); return; }
    if (fileProblem()) { renderFiles(); fileInput.focus(); drop.scrollIntoView({ block: 'center' }); return; }
    const store = window.ParanStore;
    if (!store || typeof store.api !== 'function') { saveDraft(); location.assign(full ? full.href : '/request/?mode=consult'); return; }
    const data = Object.fromEntries(new FormData(form));
    submitting = true;
    errorBox.hidden = true;
    button.disabled = true;
    const mustUpload = () => picked.length && (!uploaded || uploadedSig !== sig());
    button.textContent = mustUpload() ? '파일을 올리고 있습니다…' : '접수하고 있습니다…';
    try {
      if (mustUpload()) {
        if (!store.uploadFiles) throw new Error('첨부를 올릴 수 없습니다. 파일을 빼고 접수하거나 자세히 적기 화면을 이용해 주세요.');
        uploaded = await store.uploadFiles(picked); uploadedSig = sig();
      }
      if (!picked.length) { uploaded = null; uploadedSig = ''; }
      button.textContent = '접수하고 있습니다…';
      let done;
      const send = async () => {
        done = await store.api('submit', {
          attachments: uploaded || [], id: requestId, token, mode: 'consult', topic: topic(),
          customer: { name: data.name, organization: data.organization, email: data.email, phone: data.phone },
          event: { title: data.title, date: '', due: '', location: '', budget: '미정', brief: data.brief },
          items: [], consent: data.consent === 'on', website: data.website || '',
        });
      };
      try { await send(); } catch (err) {
        if (err.status !== 409) throw err;
        requestId = uid(); token = newToken(); await send();
      }
      try {
        const old = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
        const entry = { id: requestId, token, title: data.title, at: new Date().toISOString(), receipt: (done && done.request) || null, link: done && typeof done.link === 'string' ? done.link : null };
        localStorage.setItem(HISTORY_KEY, JSON.stringify([entry, ...(Array.isArray(old) ? old : [])].slice(0, 30)));
      } catch (_) { /* 저장이 막힌 브라우저에서도 접수 화면으로는 넘어간다 */ }
      try {
        if (window.gtag) window.gtag('event', 'generate_lead', { event_category: 'conversion', form_id: 'home-inquiry', lead_type: 'consult', need: need(), items: 0 });
        (window.dataLayer = window.dataLayer || []).push({ event: 'generate_lead', form_id: 'home-inquiry' });
      } catch (_) {}
      location.assign('/requests/#' + requestId + '.' + token);
    } catch (err) {
      errorBox.textContent = (err && err.message) || '접수하지 못했습니다. 잠시 후 다시 시도해 주세요.';
      errorBox.hidden = false;
      errorBox.scrollIntoView({ block: 'center' });
      button.disabled = false;
      button.textContent = '다시 접수하기';
      submitting = false;
    }
  });
})();

// 2026-11-20 '잘 모르겠어요'를 고르면 문의 내용 안내도 그에 맞게
(() => {
  const hint = document.getElementById('hqi-brief-hint');
  if (!hint) return;
  const base = hint.textContent;
  const unsure = '어떤 행사인지, 지금 정해진 것(일정·장소·인원)을 아는 만큼만 적어 주세요. 무엇을 맡기면 좋을지 함께 정리해 드립니다. 주민등록번호 등 민감정보는 적지 마세요.';
  const sync = () => { const u = document.getElementById('hqi-need-unsure'); hint.textContent = u && u.checked ? unsure : base; };
  document.querySelectorAll('input[name="hqi-need"]').forEach(r => r.addEventListener('change', sync));
  sync();
})();
