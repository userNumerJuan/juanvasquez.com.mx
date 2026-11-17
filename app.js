const app = document.querySelector('#app');
const backButton = document.querySelector('#back-button');
const progress = document.querySelector('#progress');

const links = {
  thursday: 'https://sonboletos.pagatusboletos.com/venta/es/entradas-teatro-el-lago-de-los-cisnes---nogales',
  friday: 'https://tix.soundrink.com/tours/lFVeNdyoD9jTTCJ5uMgBq3ymYQGvl4iq?direct=true'
};

const plans = {
  thursday: {
    day: 'Jueves', title: 'El lago de los cisnes', place: 'Teatro · Nogales', time: '7:30 p. m.', emoji: '🩰',
    choice: 'ir al teatro de Nogales',
    note: 'La función es a las 7:30 p. m. Habrá tutús, música y un poquito de cultura para equilibrar la semana. 🩰',
    link: links.thursday
  },
  friday: {
    day: 'Viernes', title: 'Concierto de Ladrones', place: 'Tucson', time: 'Por confirmar', emoji: '🎸',
    choice: 'Ladrones en Tucson',
    note: 'La verdad no los escucho, pero me ofrecieron boletos porque no podrán ir. Podemos descubrirlos juntos. 🎟️',
    link: links.friday
  },
  saturday: {
    day: 'Sábado', title: 'Comida', place: '', time: 'Sin tanto rush', emoji: '🍽️',
    choice: 'una comida',
    note: 'Día más tranqui y sin tanto rush. Mi recomendación para platicar con calma y disfrutar la comida. 😌'
  }
};

const state = {
  view: 'identity',
  identityReady: false,
  day: null,
  food: null,
  status: ''
};

const progressSteps = { identity: 1, day: 2, food: 2, review: 3, final: 4 };

function selectedPlan() {
  const plan = plans[state.day];
  if (!plan) return null;
  if (state.day !== 'saturday') return { ...plan };
  return { ...plan, title: state.food, place: state.food, choice: `comida en ${state.food}` };
}

function summaryText() {
  const plan = selectedPlan();
  const lines = [
    '✨ ¡Ya elegí mi plan! ✨',
    '',
    `📅 Día: ${plan.day}`,
    `${plan.emoji} Plan: ${plan.title}`,
    `📍 Lugar: ${plan.place}`
  ];
  if (state.day === 'thursday') lines.push(`🕢 Hora: ${plan.time}`);
  lines.push('', 'Confirmado con una sonrisa 😊');
  return lines.join('\n');
}

function headerFor(view) {
  backButton.hidden = view === 'identity' || view === 'exit';
  const step = progressSteps[view] || 0;
  if (step === 4) {
    progress.innerHTML = '<span class="progress-done" aria-label="Completado">✓</span>';
  } else if (step > 0) {
    progress.setAttribute('aria-label', `Paso ${step} de 3`);
    progress.innerHTML = [1, 2, 3].map(number => `<span class="progress-dot${number === step ? ' active' : ''}" aria-hidden="true"></span>`).join('');
  } else {
    progress.innerHTML = '';
    progress.removeAttribute('aria-label');
  }
}

function identityScreen() {
  return `
    <section class="screen" aria-labelledby="screen-title">
      <div class="hero-sticker" aria-hidden="true">🌱</div>
      <p class="eyebrow">Antes de empezar</p>
      <h1 id="screen-title" tabindex="-1">Tengo una preguntita…</h1>
      <p class="intro">Es muy importante. Casi tan importante como elegir qué vamos a comer. 😄</p>
      <h2>¿Eres Graceland?</h2>
      <div class="identity-options">
        <button class="choice-button${state.identityReady ? ' selected' : ''}" type="button" data-action="identity-yes">Sí, soy yo 🙋‍♀️</button>
        <button class="choice-button" type="button" data-action="identity-no">No 👀</button>
      </div>
      ${state.identityReady ? `
        <p class="success-note" role="status">Perfecto, presiona abajo para continuar.</p>
        <button class="primary-button continue-button" type="button" data-action="continue">Continuar <span aria-hidden="true">→</span></button>
      ` : '<p class="soft-note"><span aria-hidden="true">👆</span> Elige una respuesta para seguir.</p>'}
    </section>`;
}

function exitScreen() {
  return `
    <section class="screen exit-screen" aria-labelledby="screen-title">
      <div class="hero-sticker" aria-hidden="true">🙈</div>
      <p class="eyebrow">Un momento…</p>
      <h1 id="screen-title" tabindex="-1">Sal de aquí, por favor.</h1>
      <p class="intro">Only for Graceland.</p>
      <button class="secondary-button" type="button" data-action="try-again">← Volver a intentarlo</button>
    </section>`;
}

function dayScreen() {
  return `
    <section class="screen" aria-labelledby="screen-title">
      <p class="eyebrow">Lo importante viene ahora</p>
      <h1 id="screen-title" tabindex="-1">¿Qué día tienes libre?</h1>
      <p class="intro">Hay tres caminos. Todos terminan en un buen plan. ✨</p>
      <div class="option-list">
        <article class="option-card">
          <button class="option-select" type="button" data-day="thursday">
            <span class="option-heading"><span class="option-emoji" aria-hidden="true">🩰</span><span><span class="option-title">Jueves</span><span class="option-plan">El lago de los cisnes</span></span></span>
            <span class="option-meta" style="display:block">Ballet · Teatro de Nogales · 7:30 p. m.</span>
            <span class="option-con"><span aria-hidden="true">🌥️</span><span>Tal vez salgamos cansados del trabajo.</span></span>
          </button>
          <a class="external-link" href="${links.thursday}" target="_blank" rel="noopener noreferrer">Ver boletos e información ↗</a>
        </article>
        <article class="option-card">
          <button class="option-select" type="button" data-day="friday">
            <span class="option-heading"><span class="option-emoji" aria-hidden="true">🎸</span><span><span class="option-title">Viernes</span><span class="option-plan">Concierto de Ladrones</span></span></span>
            <span class="option-meta" style="display:block">Música en vivo · Tucson</span>
            <span class="option-con"><span aria-hidden="true">🚗</span><span>Es en Tucson y ha habido mucha cola para cruzar a USA.</span></span>
          </button>
          <a class="external-link" href="${links.friday}" target="_blank" rel="noopener noreferrer">Ver el concierto ↗</a>
        </article>
        <article class="option-card">
          <button class="option-select" type="button" data-day="saturday">
            <span class="option-heading"><span class="option-emoji" aria-hidden="true">🍽️</span><span><span class="option-title">Sábado</span><span class="option-plan">Comida</span></span></span>
            <span class="recommendation">Mi recomendación ✨</span>
            <span class="option-pro"><span aria-hidden="true">😌</span><span>Día más tranqui y sin tanto rush.</span></span>
          </button>
        </article>
      </div>
    </section>`;
}

function foodScreen() {
  return `
    <section class="screen" aria-labelledby="screen-title">
      <p class="eyebrow">Sábado tranquilo 😌</p>
      <h1 id="screen-title" tabindex="-1">Ahora, la decisión difícil…</h1>
      <p class="intro">Muy bien, elige una de estas tres opciones. Aquí no hay respuestas incorrectas. 😋</p>
      <div class="option-list">
        ${[
          ['Algun lugar de Mariscos con nombre de sinaloa', '🦐', 'Algo rico y sin complicarnos.'],
          ['Mi Casa', '🏡', 'Como sentirse en casa, pero sin lavar platos.'],
          ['Kazoku Sushi Bar', '🍣', 'Para cuando el antojo pide sushi.']
        ].map(([name, emoji, note]) => `
          <article class="option-card">
            <button class="option-select" type="button" data-food="${name}">
              <span class="option-heading"><span class="option-emoji" aria-hidden="true">${emoji}</span><span><span class="option-title">${name}</span><span class="option-plan">${note}</span></span></span>
            </button>
          </article>`).join('')}
      </div>
    </section>`;
}

function reviewScreen() {
  const plan = selectedPlan();
  return `
    <section class="screen" aria-labelledby="screen-title">
      <p class="eyebrow">¡Muy bien! ✨</p>
      <h1 id="screen-title" tabindex="-1">Has elegido ${plan.choice}.</h1>
      <p class="intro">Esta es tu selección. Puedes confirmarla o volver a mirar sin compromiso. 😄</p>
      <div class="summary-card">
        <dl>
          <dt>Día</dt><dd>${plan.day}</dd>
          <dt>Plan</dt><dd>${plan.title}</dd>
          <dt>Lugar</dt><dd>${plan.place}</dd>
          ${state.day === 'thursday' ? `<dt>Hora</dt><dd>${plan.time}</dd>` : ''}
        </dl>
        <p class="summary-note">${plan.note}</p>
      </div>
      ${plan.link ? `<a class="external-link review-link" href="${plan.link}" target="_blank" rel="noopener noreferrer">Revisar la información otra vez ↗</a>` : ''}
      <div class="review-actions">
        <button class="primary-button" type="button" data-action="confirm">Confirmar <span aria-hidden="true">✨</span></button>
        <button class="secondary-button" type="button" data-action="change">Revisar otras opciones</button>
      </div>
    </section>`;
}

function finalScreen() {
  const plan = selectedPlan();
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(summaryText())}`;
  return `
    <section class="screen" aria-labelledby="screen-title">
      <div class="final-hero" aria-hidden="true">${plan.emoji}</div>
      <p class="eyebrow">Oficialmente elegido</p>
      <h1 id="screen-title" class="final-title" tabindex="-1">¡Entonces está decidido! 💚</h1>
      <p class="intro">Buena elección. Solo falta hacerme llegar tu respuesta. 🌟</p>
      <div class="summary-card final-summary">
        <dl>
          <dt>Día</dt><dd>${plan.day}</dd>
          <dt>Plan</dt><dd>${plan.title}</dd>
          <dt>Lugar</dt><dd>${plan.place}</dd>
          ${state.day === 'thursday' ? `<dt>Hora</dt><dd>${plan.time}</dd>` : ''}
        </dl>
      </div>
      <div class="final-actions">
        <a class="primary-button" id="whatsapp-share" href="${whatsappUrl}" target="_blank" rel="noopener noreferrer">Enviar por WhatsApp 💬</a>
        <p class="soft-note"><span aria-hidden="true">💌</span> Se abrirá WhatsApp con tu mensaje listo. Elige mi chat y pulsa enviar.</p>
        <div class="action-row">
          <button class="secondary-button" type="button" data-action="copy">Copiar 📋</button>
          <button class="secondary-button" type="button" data-action="download">Descargar ⬇️</button>
        </div>
        <p class="share-status" id="share-status" role="status">${state.status}</p>
        <button class="text-button" type="button" data-action="restart">Empezar de nuevo ↺</button>
      </div>
    </section>`;
}

const screens = { identity: identityScreen, exit: exitScreen, day: dayScreen, food: foodScreen, review: reviewScreen, final: finalScreen };

function render({ focus = false } = {}) {
  headerFor(state.view);
  app.innerHTML = screens[state.view]();
  document.title = state.view === 'final' ? 'Plan confirmado ✨' : 'Un pequeño plan ✨';
  if (focus) requestAnimationFrame(() => document.querySelector('#screen-title')?.focus({ preventScroll: true }));
}

function navigate(view, { push = true } = {}) {
  state.view = view;
  state.status = '';
  if (push) history.pushState({ view }, '', `#${view}`);
  render({ focus: true });
}

async function copyChoices() {
  const text = summaryText();
  try {
    await navigator.clipboard.writeText(text);
    state.status = '¡Copiado! Ya puedes pegarlo donde quieras. 📋';
  } catch {
    const field = document.createElement('textarea');
    field.value = text;
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.append(field);
    field.select();
    const copied = document.execCommand('copy');
    field.remove();
    state.status = copied ? '¡Copiado! Ya puedes pegarlo donde quieras. 📋' : 'No se pudo copiar. Usa la opción de descargar. ⬇️';
  }
  document.querySelector('#share-status').textContent = state.status;
}

function downloadChoices() {
  const blob = new Blob(['\ufeff', summaryText()], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'mi-plan-elegido.txt';
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  state.status = 'Archivo descargado: mi-plan-elegido.txt ⬇️';
  document.querySelector('#share-status').textContent = state.status;
}

app.addEventListener('click', event => {
  const dayButton = event.target.closest('[data-day]');
  const foodButton = event.target.closest('[data-food]');
  const actionButton = event.target.closest('[data-action]');
  if (dayButton) {
    state.day = dayButton.dataset.day;
    state.food = null;
    navigate(state.day === 'saturday' ? 'food' : 'review');
    return;
  }
  if (foodButton) {
    state.food = foodButton.dataset.food;
    navigate('review');
    return;
  }
  if (!actionButton) return;
  const actions = {
    'identity-yes': () => { state.identityReady = true; render({ focus: false }); document.querySelector('[data-action="continue"]').focus(); },
    'identity-no': () => navigate('exit'),
    'try-again': () => { state.identityReady = false; navigate('identity'); },
    'continue': () => navigate('day'),
    'confirm': () => navigate('final'),
    'change': () => { state.day = null; state.food = null; navigate('day'); },
    'copy': copyChoices,
    'download': downloadChoices,
    'restart': () => { state.identityReady = false; state.day = null; state.food = null; state.status = ''; navigate('identity'); }
  };
  actions[actionButton.dataset.action]?.();
});

app.addEventListener('click', event => {
  if (event.target.closest('#whatsapp-share')) {
    state.status = 'Mensaje listo. Elige mi chat en WhatsApp y pulsa enviar. 💌';
    document.querySelector('#share-status').textContent = state.status;
  }
});

backButton.addEventListener('click', () => history.back());
window.addEventListener('popstate', event => {
  const requested = event.state?.view || 'identity';
  state.view = screens[requested] && (requested !== 'review' && requested !== 'final' && requested !== 'food' || state.day) ? requested : 'identity';
  render({ focus: true });
});

history.replaceState({ view: 'identity' }, '', location.pathname + location.search);
render();
