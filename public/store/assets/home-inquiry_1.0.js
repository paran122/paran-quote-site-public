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
    const store = window.ParanStore;
    if (!store || typeof store.api !== 'function') { location.assign('/request/?mode=consult'); return; }
    const data = Object.fromEntries(new FormData(form));
    submitting = true;
    errorBox.hidden = true;
    button.disabled = true;
    button.textContent = '접수하고 있습니다…';
    try {
      let done;
      const send = async () => {
        done = await store.api('submit', {
          attachments: [], id: requestId, token, mode: 'consult', topic: '',
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
        if (window.gtag) window.gtag('event', 'generate_lead', { event_category: 'conversion', form_id: 'home-inquiry', lead_type: 'consult', items: 0 });
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
