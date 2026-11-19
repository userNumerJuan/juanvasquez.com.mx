// Static, dependency-free portfolio.
import { zhTranslations } from './i18n-zh.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

// English is the default. Spanish is one click away; Chinese is an optional easter egg.
const languageButtons = $$('[data-language-toggle]');
const chineseButtons = $$('[data-chinese-toggle]');
const supportedLanguages = ['en', 'es', 'zh'];
const storedLanguage = localStorage.getItem('jv-language');
let language = supportedLanguages.includes(storedLanguage) ? storedLanguage : 'en';
const inChinese = (english) => zhTranslations[english] || english;

function applyLanguage(next) {
  language = supportedLanguages.includes(next) ? next : 'en';
  document.documentElement.lang = language;

  $$('[data-en]').forEach((element) => {
    if (!element.dataset.es) element.dataset.es = element.textContent.trim();
    const english = element.dataset.en;
    element.textContent = language === 'es' ? element.dataset.es : language === 'zh' ? inChinese(english) : english;
  });
  $$('[data-en-placeholder]').forEach((element) => {
    if (!element.dataset.esPlaceholder) element.dataset.esPlaceholder = element.placeholder;
    const english = element.dataset.enPlaceholder;
    element.placeholder = language === 'es' ? element.dataset.esPlaceholder : language === 'zh' ? inChinese(english) : english;
  });
  $$('[data-en-aria]').forEach((element) => {
    if (!element.dataset.esAria) element.dataset.esAria = element.getAttribute('aria-label') || '';
    const english = element.dataset.enAria;
    element.setAttribute('aria-label', language === 'es' ? element.dataset.esAria : language === 'zh' ? inChinese(english) : english);
  });

  languageButtons.forEach((button) => {
    button.textContent = language === 'en' ? 'ES' : 'EN';
    button.setAttribute('aria-label', language === 'en' ? 'Ver sitio en español' : language === 'es' ? 'View site in English' : 'Switch to English');
    button.setAttribute('aria-pressed', String(language !== 'en'));
  });
  chineseButtons.forEach((button) => {
    button.classList.toggle('is-active', language === 'zh');
    button.setAttribute('aria-label', language === 'zh' ? 'Switch to English' : '切换到中文');
    button.setAttribute('aria-pressed', String(language === 'zh'));
  });
  $$('[data-localized-cv]').forEach((link) => {
    link.href = language === 'es' ? '/assets/Juan-Vasquez-CV-ES.pdf' : '/assets/Juan-Vasquez-CV-EN.pdf';
  });
  const title = document.querySelector(`meta[name="title-${language}"]`) || document.querySelector('meta[name="title-en"]');
  if (title) document.title = title.content;
  localStorage.setItem('jv-language', language);
  document.dispatchEvent(new CustomEvent('languagechange', { detail: language }));
}

languageButtons.forEach((button) => button.addEventListener('click', () => applyLanguage(language === 'en' ? 'es' : 'en')));
chineseButtons.forEach((button) => button.addEventListener('click', () => applyLanguage(language === 'zh' ? 'en' : 'zh')));
applyLanguage(language);

// Mobile navigation remains keyboard and touch accessible.
const menuButton = $('[data-menu-button]');
const navigation = $('#site-navigation');
if (menuButton && navigation) {
  const closeMenu = () => {
    navigation.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
  };
  menuButton.addEventListener('click', () => {
    const open = navigation.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  $$('a', navigation).forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

// Public contact alias: assembled only after an intentional action.
$$('[data-reveal-email]').forEach((button) => {
  button.addEventListener('click', () => {
    const email = atob(button.dataset.revealEmail);
    const link = document.createElement('a');
    link.className = 'contact-email';
    link.href = `mailto:${email}`;
    link.textContent = email;
    const aria = language === 'es' ? `Enviar correo a ${email}` : language === 'zh' ? `发送邮件至 ${email}` : `Email ${email}`;
    link.setAttribute('aria-label', aria);
    button.replaceWith(link);
    link.focus();
  });
});

// Optional curiosity puzzle. It never gates contact information or the CV.
const puzzleDialog = $('#curiosity-puzzle');
const puzzleForm = $('#puzzle-form');
if (puzzleDialog && puzzleForm) {
  const answer = $('#puzzle-answer');
  const feedback = $('#puzzle-feedback');
  const reward = $('#puzzle-reward');
  const openPuzzle = () => {
    feedback.textContent = '';
    answer.value = '';
    puzzleDialog.showModal();
    answer.focus();
  };
  $$('[data-open-puzzle]').forEach((button) => button.addEventListener('click', openPuzzle));
  $('[data-close-puzzle]')?.addEventListener('click', () => puzzleDialog.close());
  puzzleDialog.addEventListener('click', (event) => {
    if (event.target === puzzleDialog) puzzleDialog.close();
  });
  $('[data-show-hint]')?.addEventListener('click', (event) => {
    const hint = $('#puzzle-hint');
    hint.hidden = false;
    event.currentTarget.disabled = true;
    hint.focus();
  });
  puzzleForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (answer.value.trim() === '21') {
      feedback.textContent = language === 'es'
        ? 'Correcto. Cada número suma los dos anteriores.'
        : language === 'zh'
          ? '正确。每个数字都是前两个数字之和。'
          : 'Correct. Each number is the sum of the previous two.';
      reward.hidden = false;
      document.body.classList.add('fractal-mode');
      localStorage.setItem('jv-fractal-mode', 'true');
      document.dispatchEvent(new CustomEvent('fractalunlocked'));
    } else {
      feedback.textContent = language === 'es'
        ? 'Aún no. Observa la relación entre cada par de números.'
        : language === 'zh'
          ? '还不对。观察相邻数字之间的关系。'
          : 'Not yet. Look at how each pair relates to the next number.';
      reward.hidden = true;
    }
  });
}
if (localStorage.getItem('jv-fractal-mode') === 'true') document.body.classList.add('fractal-mode');

// Decorative recursive system: deterministic, lightweight and optional.
const canvas = $('#fractal-canvas');
if (canvas) {
  const context = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let animationId;
  let width = 0;
  let height = 0;
  let density = localStorage.getItem('jv-fractal-mode') === 'true' ? 7 : 6;

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const bounds = canvas.getBoundingClientRect();
    width = bounds.width;
    height = bounds.height;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    draw(0);
  }

  function branch(x, y, length, angle, depth, time) {
    if (depth === 0 || length < 5) return;
    const sway = reduceMotion.matches ? 0 : Math.sin(time * 0.00035 + depth) * 0.035;
    const endX = x + Math.cos(angle + sway) * length;
    const endY = y + Math.sin(angle + sway) * length;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(endX, endY);
    context.strokeStyle = `rgba(151, 240, 183, ${0.055 + depth * 0.018})`;
    context.lineWidth = Math.max(0.55, depth * 0.22);
    context.stroke();
    branch(endX, endY, length * 0.73, angle - 0.43, depth - 1, time);
    branch(endX, endY, length * 0.69, angle + 0.49, depth - 1, time);
  }

  function draw(time) {
    context.clearRect(0, 0, width, height);
    branch(width * 0.91, height * 0.96, Math.min(width, height) * 0.23, -Math.PI / 2, density, time);
    branch(width * 0.06, height * 0.82, Math.min(width, height) * 0.14, -Math.PI / 2.6, Math.max(4, density - 2), time);
  }

  function animate(time) {
    draw(time);
    if (!reduceMotion.matches) animationId = requestAnimationFrame(animate);
  }

  function start() {
    cancelAnimationFrame(animationId);
    if (reduceMotion.matches) draw(0);
    else animationId = requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize, { passive: true });
  reduceMotion.addEventListener('change', start);
  document.addEventListener('fractalunlocked', () => { density = 8; draw(0); });
  resize();
  start();
}

// Native share/copy feedback for checklist resource.
$$('[data-copy-link]').forEach((button) => {
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      const original = button.textContent;
      button.textContent = language === 'es' ? 'Enlace copiado' : language === 'zh' ? '链接已复制' : 'Link copied';
      setTimeout(() => { button.textContent = original; }, 1800);
    } catch {
      window.location.hash = 'contenido';
    }
  });
});
