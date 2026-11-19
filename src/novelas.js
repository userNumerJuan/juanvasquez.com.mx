const buttons = [...document.querySelectorAll('[data-nv-language]')];
const stored = localStorage.getItem('nv-language');
let language = stored === 'es' ? 'es' : 'en';

function applyLanguage(next) {
  language = next === 'es' ? 'es' : 'en';
  document.documentElement.lang = language;
  document.querySelectorAll('[data-es]').forEach((element) => {
    if (!element.dataset.en) element.dataset.en = element.textContent.trim();
    element.textContent = language === 'es' ? element.dataset.es : element.dataset.en;
  });
  document.querySelectorAll('[data-es-aria]').forEach((element) => {
    if (!element.dataset.enAria) element.dataset.enAria = element.getAttribute('aria-label') || '';
    element.setAttribute('aria-label', language === 'es' ? element.dataset.esAria : element.dataset.enAria);
  });
  buttons.forEach((button) => {
    button.textContent = language === 'en' ? 'ES' : 'EN';
    button.setAttribute('aria-label', language === 'en' ? 'Ver en español' : 'View in English');
    button.setAttribute('aria-pressed', String(language === 'es'));
  });
  const title = document.querySelector(`meta[name="nv-title-${language}"]`);
  if (title) document.title = title.content;
  localStorage.setItem('nv-language', language);
}

buttons.forEach((button) => button.addEventListener('click', () => applyLanguage(language === 'en' ? 'es' : 'en')));
applyLanguage(language);

// Reveal the contact alias only after an intentional action; no form or tracking.
document.querySelectorAll('[data-nv-email]').forEach((button) => {
  button.addEventListener('click', () => {
    const email = atob(button.dataset.nvEmail);
    const link = document.createElement('a');
    link.className = 'nv-button nv-button-dark';
    link.href = `mailto:${email}`;
    link.textContent = email;
    link.setAttribute('aria-label', language === 'es' ? `Enviar correo a ${email}` : `Email ${email}`);
    button.replaceWith(link);
    link.focus();
  });
});
