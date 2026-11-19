// 홈 '바로 문의' 칸 (2026-11-19). 서비스를 고르지 않고 남기는 상담 요청.
// 접수 길은 견적 요청 화면의 상담 모드(ui/app.js initRequest)와 같다: ParanStore.api('submit', {mode:'consult', items:[]}).
(() => {
  'use strict';
  const form = document.getElementById('hqi-form');
  if (!form) return;
  const HISTORY_KEY = 'paran.services.requests.v1';
  const errorBox = document.getElementById('hqi-error');
  const button = form.querySelector('.hqi-submit');
  const rules = {
    email: [v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), '이메일 주소 형식을 확인해 주세요. 예: name@agency.go.kr'],
    phone: [v => /^[+\d\s().-]{8,30}$/.test(v) && v.replace(/\D/g, '').length >= 8, '연락처를 숫자로 입력해 주세요. 예: 010-1234-5678'],
  };
  const uid = () => (crypto.randomUUID ? crypto.randomUUID() : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)));
  const newToken = () => Array.from(crypto.getRandomValues(new Uint8Array(32)), b => b.toString(16).padStart(2, '0')).join('');
  let requestId = uid(), token = newToken(), submitting = false;
  const need = () => (document.querySelector('input[name="hqi-need"]:checked') || {}).value || 'unsure';
  const topic = () => (need() === 'agency' ? 'event-agency' : '');
  const full = form.querySelector('[data-hqi-full]');
  const syncNeed = () => { if (full) full.href = '/request/?mode=consult' + (topic() ? '&service=' + topic() : ''); errorBox.hidden = true; };
  document.querySelectorAll('input[name="hqi-need"]').forEach(r => r.addEventListener('change', syncNeed));
  syncNeed();

  // 첨부: 끌어다 놓거나 눌러서 고른다. 규칙(개수·크기·종류)과 올리기는 견적 요청 화면과 같은 함수를 쓴다.
  const drop = document.getElementById('hqi-drop'), fileInput = document.getElementById('hqi-file');
  const fileList = document.getElementById('hqi-filelist'), fileNote = document.getElementById('hqi-file-note');
  let picked = [], uploaded = null, uploadedSig = '';
  const sig = () => picked.map(f => f.name + ':' + f.size + ':' + f.lastModified).join('|');
  const sizeText = n => (n >= 1048576 ? (n / 1048576).toFixed(1) + 'MB' : Math.max(1, Math.round(n / 1024)) + 'KB');
  const fileProblem = () => { const s = window.ParanStore; return s && s.fileProblem ? s.fileProblem(picked) : (picked.length > 5 ? '첨부는 최대 5개까지 가능합니다.' : ''); };
  function renderFiles() {
    fileList.textContent = '';
    picked.forEach((f, i) => {
      const li = document.createElement('li');
      const nm = document.createElement('span'); nm.className = 'nm'; nm.textContent = f.name;
      const sz = document.createElement('span'); sz.className = 'sz'; sz.textContent = sizeText(f.size);
      const rm = document.createElement('button'); rm.type = 'button'; rm.textContent = '빼기'; rm.setAttribute('aria-label', f.name + ' 빼기');
      rm.addEventListener('click', () => { picked.splice(i, 1); renderFiles(); (fileList.querySelector('button') || fileInput).focus(); });
      li.append(nm, sz, rm); fileList.append(li);
    });
    const p = fileProblem(); fileNote.textContent = p || ''; fileNote.hidden = !p;
  }
  function addFiles(list) {
    for (const f of list) if (!picked.some(x => x.name === f.name && x.size === f.size && x.lastModified === f.lastModified)) picked.push(f);
    renderFiles();
  }
  if (drop && fileInput) {
    fileInput.addEventListener('change', () => { addFiles([...fileInput.files]); fileInput.value = ''; });
    for (const t of ['dragenter', 'dragover']) drop.addEventListener(t, e => { e.preventDefault(); drop.classList.add('is-over'); });
    for (const t of ['dragleave', 'dragend']) drop.addEventListener(t, () => drop.classList.remove('is-over'));
    drop.addEventListener('drop', e => { e.preventDefault(); drop.classList.remove('is-over'); if (e.dataTransfer && e.dataTransfer.files.length) addFiles([...e.dataTransfer.files]); });
    // 칸 밖에 놓쳤을 때 브라우저가 파일을 열어 페이지를 떠나지 않게
    for (const t of ['dragover', 'drop']) form.addEventListener(t, e => { if (e.dataTransfer && [...e.dataTransfer.types].includes('Files')) e.preventDefault(); });
  }

  // 칸 바로 아래에 이유를 적는다(알림창 대신)
  function note(el) {
    const box = el.closest('.hqi-consent') || el;
    let n = box.nextElementSibling;
    if (!(n && n.classList.contains('hqi-note'))) {
      n = document.createElement('p');
      n.className = 'hqi-note';
      n.id = 'hqi-note-' + el.name;
      n.hidden = true;
      box.after(n);
      el.setAttribute('aria-describedby', n.id);
    }
    return n;
  }
  function check(el, showEmpty) {
    const n = note(el);
    const value = el.type === 'checkbox' ? (el.checked ? 'on' : '') : el.value.trim();
    let message = '';
    if (!value) message = showEmpty ? (el.type === 'checkbox' ? '동의가 필요합니다.' : '필수 항목입니다.') : '';
    else if (rules[el.name] && !rules[el.name][0](value)) message = rules[el.name][1];
    n.textContent = message;
    n.hidden = !message;
    if (message) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid');
    return !message;
  }
  const fields = [...form.querySelectorAll('[required]')];
  for (const el of fields) {
    el.addEventListener('blur', () => { if (el.type !== 'checkbox' && el.value.trim()) check(el, false); });
    el.addEventListener('input', () => { if (el.hasAttribute('aria-invalid')) check(el, false); });
    el.addEventListener('change', () => { if (el.hasAttribute('aria-invalid')) check(el, false); });
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (submitting) return;
    const bad = fields.filter(el => !check(el, true));
    if (bad.length) { bad[0].focus(); bad[0].scrollIntoView({ block: 'center' }); return; }
    if (fileProblem()) { renderFiles(); fileInput.focus(); drop.scrollIntoView({ block: 'center' }); return; }
    const store = window.ParanStore;
    if (!store || typeof store.api !== 'function') { location.assign('/request/?mode=consult'); return; }
    const data = Object.fromEntries(new FormData(form));
    submitting = true;
    errorBox.hidden = true;
    button.disabled = true;
    button.textContent = picked.length && (!uploaded || uploadedSig !== sig()) ? '파일을 올리고 있습니다…' : '접수하고 있습니다…';
    try {
      if (picked.length && (!uploaded || uploadedSig !== sig())) {
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
      button.disabled = false;
      button.textContent = '다시 접수하기';
      submitting = false;
    }
  });
})();
