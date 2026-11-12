const app = document.getElementById('app');
const toastEl = document.getElementById('toast');
const gradeColors = ['#29b9e9', '#18b981', '#ff9d24', '#ff5b79', '#9b70f5', '#2461d9'];
const gradeTints = ['#e0f6ff', '#dcf8ea', '#fff0d6', '#ffe4ea', '#eee6ff', '#e3eaff'];

/* CONTENIDO: viene de js/contenido.js (Word) y js/actividades2.js (2.º grado) */
const topics = { Geografía: [], Historia: [] };
const contenidosPorGrado = {};
for (let g = 1; g <= 6; g++) {
  contenidosPorGrado[g] = {};
  for (const a of Object.keys(topics)) contenidosPorGrado[g][a] = [...((WORD[g] || {})[a] || []), ...(g === 2 ? topics2[a] : [])];
}
for (const g in contenidosPorGrado) for (const a in contenidosPorGrado[g]) contenidosPorGrado[g][a].forEach(t => { t.photo = FOTOS[g + '|' + t.title] || FOTOS[t.title] || t.photo; });
function listFor(g, a) { return contenidosPorGrado[g]?.[a] || []; }

/* ============================================================
   ESTADO Y UTILIDADES
   ============================================================ */
const state = { screen: 'inicio', grade: 1, area: 'Geografía', topicIndex: 0, questionIndex: 0, answers: [], selected: null, locked: false, lastResult: null };
const saved = loadSaved();

function loadSaved() {
  const base = { completed: [], badges: [], attempts: 0, correct: 0 };
  try { return Object.assign(base, JSON.parse(localStorage.getItem('misionPanamaProgress'))); } catch (e) { return base; }
}
function save() { try { localStorage.setItem('misionPanamaProgress', JSON.stringify(saved)); } catch (e) { } }
function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function toast(msg) { toastEl.textContent = msg; toastEl.classList.add('show'); setTimeout(() => toastEl.classList.remove('show'), 2400); }
function go(screen) { state.screen = screen; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
function slug(s) { return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }

function topicList() { return listFor(state.grade, state.area); }
function currentTopic() { return topicList()[state.topicIndex] || topicList()[0]; }
function artOf(t) { return t.art || ''; }
function doneKey() { return `${state.grade}-${state.area}-${state.topicIndex}`; }
function isDone(g, a, i) { return saved.completed.includes(`${g}-${a}-${i}`); }
function gradePercent(g) {
  let all = 0, done = 0;
  for (const a of Object.keys(topics)) listFor(g, a).forEach((t, i) => { all++; if (isDone(g, a, i)) done++; });
  return all ? Math.round(done / all * 100) : 0;
}

// ESPACIO PARA IMAGEN: muestra la imagen; si no existe, un recuadro punteado indica qué archivo poner.
function slot(src, cls, emoji, alt) {
  return `<img class="slot ${cls}" src="${esc(src)}" alt="${esc(alt || '')}" onerror="this.outerHTML='<div class=&quot;ph ${cls}&quot;>${emoji}<small>Pon tu imagen aquí:<br>${esc(src)}</small></div>'">`;
}

/* ============================================================
   PANTALLAS
   ============================================================ */
function render() {
  const nav = state.screen === 'progreso' || state.screen === 'insignias' ? 'progreso' : 'inicio';
  document.querySelectorAll('.nav-link').forEach(b => b.classList.toggle('active', b.dataset.go === nav));
  ({ inicio: renderHome, juego: renderGame, areas: renderAreas, temas: renderTopics, leccion: renderLesson, preprueba: renderQuizIntro, prueba: renderQuiz, resultado: renderResult, progreso: renderProgress, insignias: renderBadges }[state.screen] || renderHome)();
  hydrate();
}

function renderHome() {
  const icons = ['📘', '🔎', '🌟', '🧩', '🧭', '🏅'];
  const subs = ['Primeros descubrimientos', 'Nuevos conocimientos', 'Explora y aprende', 'Retos para pensar', 'Conecta las ideas', 'Conviértete en experto'];
  app.innerHTML = `<section class="hero"><div class="hero-content">
    <div class="hero-art">🧭 🌎 ⭐</div>
    <div class="eyebrow">¡Tu aventura comienza aquí!</div>
    <h1>Misión Panamá</h1>
    <p>Explora la historia y geografía de nuestro país. Aprende, supera retos y gana insignias mientras te diviertes.</p>
    <div style="max-width:380px;height:200px;margin:0 auto 18px"><img src="https://upload.wikimedia.org/wikipedia/commons/a/ab/Flag_of_Panama.svg" alt="Bandera de Panamá" style="max-height:200px;border-radius:16px" onerror="this.style.display='none'"></div>
<button class="btn btn-orange" data-go="areas" data-grade="1" style="margin-top: 25px;">🚀 ¡Empezar aventura!</button>
    <div class="section-head"><div><h2>¿En qué grado estás?</h2><p>Elige tu nivel para comenzar a explorar.</p></div><span class="pill">1.º a 6.º grado</span></div>
    <section class="grade-grid">${Array.from({ length: 6 }, (_, n) => { const g = n + 1, p = gradePercent(g);
      return `<button class="grade-card" data-go="areas" data-grade="${g}" style="--accent:${gradeColors[n]};--tint:${gradeTints[n]}"><div class="grade-top"><span class="grade-emoji">${icons[n]}</span><span class="grade-number">NIVEL ${g}</span></div><h3>${g}.º Grado</h3><p>${subs[n]}</p><div class="progress-line"><span style="width:${p}%"></span></div><div class="grade-bottom"><span>${p}% completado</span><span>Entrar →</span></div></button>`; }).join('')}</section>
    <div class="section-head"><div><h2>Tu aventura</h2><p>Continúa aprendiendo a tu ritmo.</p></div><button class="small-link" data-go="progreso">Ver mi progreso →</button></div>
    <section class="panel" style="display:flex;align-items:center;gap:18px;flex-wrap:wrap"><div style="font-size:46px">🏆</div><div style="flex:1;min-width:180px"><h3 style="margin:0 0 5px">¡Cada reto cuenta!</h3><p class="empty-note" style="margin:0">Completa temas y pruebas para desbloquear insignias.</p></div><button class="btn btn-light" data-go="insignias">Ver mis insignias</button></section>`;
}

function renderAreas() {
  app.innerHTML = `<button class="back-btn" data-go="inicio">← Volver a los grados</button><div class="panel"><span class="pill">GRADO ${state.grade}.º</span><h1 class="page-title">¿Qué quieres explorar?</h1><p class="page-subtitle">Elige un área para descubrir los temas de este grado.</p>
    <div class="area-grid"><button class="area-card geo" data-area="Geografía"><span class="big-emoji">🌎</span><h3>Geografía</h3><p>Conoce lugares, mapas, naturaleza y nuestro territorio.</p><span class="white-chip">Explorar →</span></button>
    <button class="area-card hist" data-area="Historia"><span class="big-emoji">📜</span><h3>Historia</h3><p>Viaja por el pasado, las tradiciones y los símbolos patrios.</p><span class="white-chip">Explorar →</span></button></div></div>`;
}

function renderTopics() {
  app.innerHTML = `<button class="back-btn" data-go="areas">← Volver a las áreas</button>
    <div class="section-head" style="margin-top:0"><div><span class="pill">${state.grade}.º grado · ${state.area}</span><h1 class="page-title">Elige una misión</h1><p class="page-subtitle" style="margin-bottom:0">Mira las imágenes, aprende algo nuevo y escoge la mejor respuesta.</p></div></div>
    <section class="topic-grid">${topicList().map((t, i) => `<button class="topic-card" data-topic="${i}">
      <div class="topic-thumb">${/* IMAGEN 2: miniatura de cada tema (usa la misma imagen de la lección) */ `<span class="ph big" ${t.photo ? '' : `data-q="${esc((t.imgs || [t.title])[0])}"`}><i>${t.emoji}</i>${t.photo ? `<img src="${esc(t.photo)}" alt="${esc(t.title)}">` : ''}</span>`}</div>
      <h3>${esc(t.title)}</h3><p>${esc(t.desc)}</p><div class="topic-meta">${isDone(state.grade, state.area, i) ? '✅ ¡Completado!' : '📖 Lección + prueba'}</div></button>`).join('')}</section>`;
}

function renderLesson() {
  const t = currentTopic();
  if (t.games) return renderActLesson(t);
  app.innerHTML = `<button class="back-btn" data-go="temas">← Volver a los temas</button>
    <div class="section-head" style="margin-top:0"><div><span class="pill">${state.grade}.º grado · ${state.area}</span><h1 class="page-title">${esc(t.title)}</h1><p class="page-subtitle">Mira la imagen y aprende con frases cortitas.</p></div></div>
    <div class="lesson-layout"><div class="lesson-visual">${/* IMAGEN 3: imagen grande de la lección */ slot(artOf(t), 'lesson-img', t.emoji, 'Ilustración de ' + t.title)}</div>
    <article class="panel lesson-copy"><h2>📚 ¿Qué aprenderemos?</h2><p>${esc(t.lesson)}</p><h3>⭐ Recuerda</h3><ul>${t.points.map(p => `<li>${esc(p)}</li>`).join('')}</ul>
    <div class="tip">💡 <b>¡Consejo!</b> Trata de explicar con tus propias palabras lo que aprendiste. Así lo recordarás mejor.</div>
    <div class="button-row"><button class="btn btn-green" data-go="preprueba">📝 ¡Hacer la prueba!</button><button class="btn btn-light" data-go="temas">Ver otros temas</button></div></article></div>`;
}

function renderQuizIntro() {
  const t = currentTopic();
  app.innerHTML = `<button class="back-btn" data-go="leccion">← Volver a la lección</button>
    <section class="quiz-banner"><div style="font-size:46px">🎯 ✨</div><h2>¿Listo para demostrar lo aprendido?</h2><p>Responde las preguntas sobre «${esc(t.title)}» y gana puntos.</p><button class="btn btn-orange" data-action="start-quiz">🚀 ¡Empezar!</button></section>
    <section class="panel"><h3>¿Cómo funciona?</h3><p class="empty-note">Observa las imágenes y toca la mejor respuesta. Verás enseguida si acertaste.</p></section>`;
}

function startQuiz() { Object.assign(state, { questionIndex: 0, answers: [], selected: null, locked: false, screen: 'prueba' }); render(); }

function renderQuiz() {
  const t = currentTopic(), q = t.questions[state.questionIndex], num = state.questionIndex + 1, total = t.questions.length;
  const hasImg = !!q.images, right = state.locked && state.selected === q.a;
  app.innerHTML = `<button class="back-btn" data-go="leccion">← Salir de la prueba</button>
    <div class="quiz-progress-head"><span>Pregunta ${num} de ${total}</span><span>${Math.round((num - 1) / total * 100)}% completado</span></div>
    <div class="progress-line" style="margin-bottom:20px"><span style="width:${(num - 1) / total * 100}%;background:var(--green)"></span></div>
    <section class="question-card"><span class="pill">${state.area} · ${state.grade}.º grado</span><div class="question-art">${t.emoji}</div><h2>${esc(q.q)}</h2>
    <div class="answer-list ${hasImg ? 'with-img' : ''}">${q.opts.map((opt, i) => {
      let cls = '';
      if (state.locked) cls = i === q.a ? 'correct' : (i === state.selected ? 'wrong' : '');
      return `<button class="answer-option ${cls}" data-answer="${i}" ${state.locked ? 'disabled' : ''}><span class="option-letter">${String.fromCharCode(65 + i)}</span>${hasImg ? slot(q.images[i], 'answer-image', '🖼️', opt) : ''}<span class="answer-text">${esc(opt)}</span></button>`; }).join('')}</div>
    ${state.locked ? `<div class="feedback ${right ? 'good' : 'bad'}">${right ? '🎉 ¡Correcto! ' : '🤔 ¡Casi! '}${esc(q.why)}</div>` : ''}
    <div class="quiz-footer"><span class="empty-note">👀 Mira las imágenes y elige.</span><button class="btn btn-primary" data-action="next-question" ${state.locked ? '' : 'disabled'}>${num === total ? 'Ver resultado 🏁' : 'Siguiente →'}</button></div></section>`;
}

function answer(i) { if (state.locked) return; state.selected = i; state.locked = true; render(); }
function nextQuestion() {
  if (!state.locked) { toast('Elige una respuesta para continuar.'); return; }
  state.answers[state.questionIndex] = state.selected;
  if (state.questionIndex < currentTopic().questions.length - 1) { state.questionIndex++; state.selected = null; state.locked = false; render(); }
  else finishQuiz();
}

function finishQuiz() {
  const t = currentTopic(), score = state.answers.reduce((n, a, i) => n + (a === t.questions[i].a ? 1 : 0), 0), pct = Math.round(score / t.questions.length * 100);
  saved.attempts++; saved.correct += score;
  const key = doneKey(); if (!saved.completed.includes(key)) saved.completed.push(key);
  const give = id => { if (!saved.badges.includes(id)) saved.badges.push(id); };
  give('primer-paso'); if (pct >= 60) give('mente-curiosa'); if (pct === 100) give('perfecto');
  save(); state.lastResult = { score, total: t.questions.length, pct }; go('resultado');
}

function renderResult() {
  const r = state.lastResult || { score: 0, total: 3, pct: 0 }, ok = r.pct >= 60;
  app.innerHTML = `<section class="result-hero"><div class="result-emoji">${r.pct === 100 ? '🏆' : ok ? '🎉' : '💪'}</div><h1>${r.pct === 100 ? '¡Excelente trabajo!' : ok ? '¡Buen trabajo!' : '¡Sigue practicando!'}</h1><p>${r.pct === 100 ? 'Respondiste todo correctamente.' : ok ? 'Has avanzado en tu misión.' : 'Repasa la lección e inténtalo de nuevo. ¡Tú puedes!'}</p></section>
    <div class="result-stats"><div class="stat-card"><strong>${r.score}/${r.total}</strong><span>Respuestas correctas</span></div><div class="stat-card"><strong>${r.pct}%</strong><span>Aciertos</span></div><div class="stat-card"><strong>+${r.score * 10}</strong><span>Puntos ganados</span></div></div>
    <section class="panel"><h2 style="margin-top:0">🏅 Tus insignias</h2><p class="empty-note">${saved.badges.includes('perfecto') ? '¡Tienes la insignia Mente brillante!' : saved.badges.includes('mente-curiosa') ? '¡Tienes la insignia Explorador del saber!' : 'Cada prueba te ayuda a aprender algo nuevo.'}</p>
    <div class="button-row"><button class="btn btn-green" data-action="retry">🔄 Intentar otra vez</button><button class="btn btn-primary" data-go="temas">Seguir aprendiendo →</button><button class="btn btn-outline" data-go="progreso">🏆 Mi progreso</button></div></section>`;
}

function renderProgress() {
  const completed = saved.completed.length, pct = gradePercent(state.grade);
  app.innerHTML = `<div class="hero" style="background:linear-gradient(120deg,#7c5cff,#d94fd0)"><div class="hero-content"><div class="hero-art">🏆 ⭐</div><h1>Mi progreso</h1><p>Mira cuánto has aprendido y sigue avanzando.</p></div></div>
    <div class="section-head"><div><h2>Resumen de aprendizaje</h2><p>Tu avance se guarda en este navegador.</p></div></div>
    <div class="result-stats"><div class="stat-card"><strong>${completed}</strong><span>Temas completados</span></div><div class="stat-card"><strong>${pct}%</strong><span>Progreso del ${state.grade}.º grado</span></div><div class="stat-card"><strong>${saved.badges.length}</strong><span>Insignias ganadas</span></div></div>
    <div class="progress-summary"><section class="summary-card"><h3>📊 Progreso por área (${state.grade}.º grado)</h3>${Object.keys(topics).map(a => {
      const list = listFor(state.grade, a), done = list.filter((_, i) => isDone(state.grade, a, i)).length, p = list.length ? Math.round(done / list.length * 100) : 0;
      return `<div class="area-progress"><div class="line-label"><span>${a === 'Geografía' ? '🌎' : '📜'} ${a}</span><span>${p}%</span></div><div class="progress-line"><span style="width:${p}%;background:${a === 'Geografía' ? 'var(--green)' : 'var(--orange)'}"></span></div></div>`; }).join('')}</section>
    <section class="summary-card"><h3>🌟 Tu recorrido</h3><p class="empty-note">${completed ? `¡Ya completaste ${completed} tema(s)! Sigue con el siguiente reto.` : 'Aún no completas temas. Elige un grado, estudia una lección y haz la prueba.'}</p>
    <div class="button-row"><button class="btn btn-primary" data-go="inicio">${completed ? 'Seguir aprendiendo' : 'Comenzar aventura'}</button><button class="btn btn-light" data-go="insignias">Ver insignias</button></div></section></div>`;
}

function renderBadges() {
  const badges = [['primer-paso', '🌱', 'Primer paso', 'Completa tu primera prueba.'], ['mente-curiosa', '🧭', 'Explorador del saber', 'Consigue 60% o más en una prueba.'], ['perfecto', '🌟', 'Mente brillante', 'Responde bien todas las preguntas.'], ['constante', '🔥', 'Siempre adelante', 'Completa cinco temas.'], ['geografo', '🌎', 'Pequeño geógrafo', 'Completa un tema de Geografía.'], ['historiador', '📜', 'Detective de la historia', 'Completa un tema de Historia.']];
  const earnedOf = id => saved.badges.includes(id) || (id === 'constante' && saved.completed.length >= 5) || (id === 'geografo' && saved.completed.some(k => k.includes('-Geografía-'))) || (id === 'historiador' && saved.completed.some(k => k.includes('-Historia-')));
  const count = badges.filter(b => earnedOf(b[0])).length;
  app.innerHTML = `<button class="back-btn" data-go="progreso">← Volver a mi progreso</button><div class="section-head" style="margin-top:0"><div><h1 class="page-title">🏅 Mis insignias</h1><p class="page-subtitle">Cada insignia reconoce un logro en tu aventura.</p></div><span class="pill">${count}/${badges.length} logros</span></div>
    <section class="badge-grid">${badges.map(([id, emoji, title, desc]) => { const e = earnedOf(id); return `<article class="badge-card ${e ? 'earned' : ''}"><div class="badge-icon">${emoji}</div><h3>${title}</h3><p>${e ? '¡Insignia obtenida!' : desc}</p></article>`; }).join('')}</section>`;
}

/* ============================================================
   EVENTOS (un solo manejador para toda la página)
   ============================================================ */
document.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  const d = b.dataset;
  if (b.id === 'profileBtn') { toast('¡Hola, explorador! Tu progreso se guarda en este navegador.'); return; }
  if (d.g) { gameClick(b); return; }
  if (d.grade) state.grade = Number(d.grade);
  if (d.area) { state.area = d.area; go('temas'); return; }
  if (d.topic !== undefined) { state.topicIndex = Number(d.topic); go('leccion'); return; }
  if (d.answer !== undefined) { answer(Number(d.answer)); return; }
  if (d.action === 'start-game') { startGame(); return; }
  if (d.action === 'retry') { currentTopic().games ? startGame() : startQuiz(); return; }
  if (d.action === 'start-quiz') { startQuiz(); return; }
  if (d.action === 'next-question') { nextQuestion(); return; }
  if (d.go) go(d.go);
});

render();
