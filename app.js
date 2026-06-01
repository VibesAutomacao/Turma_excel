import { videos } from './videos.js';
import { getProva } from './provas.js';

const STORAGE_KEY = 'excelAvancadoProgress_v1';
const PROVAS_KEY = 'excelAvancadoProvas_v1';

function safeParse(json, fallback) {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

function getProgress() {
  const raw = localStorage.getItem(STORAGE_KEY);
  const base = { completed: {}, lastVideo: 1 };
  if (!raw) return base;
  const parsed = safeParse(raw, base);
  return {
    completed: parsed?.completed && typeof parsed.completed === 'object' ? parsed.completed : {},
    lastVideo: Number.isFinite(parsed?.lastVideo) ? parsed.lastVideo : 1,
  };
}

function setProgress(next) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

function clampVideo(n) {
  const max = videos.length;
  if (!Number.isFinite(n)) return 1;
  return Math.max(1, Math.min(max, n));
}

function getProvasState() {
  const raw = localStorage.getItem(PROVAS_KEY);
  const base = {
    currentLevel: 'easy',
    // lockUntil em ms (timestamp), quando bloqueado por reprovação
    lockUntil: 0,
    // histórico simples
    attempts: [],
    completedLevels: { easy: false, medium: false, hard: false },
  };
  if (!raw) return base;
  const parsed = safeParse(raw, base);
  return {
    currentLevel: parsed?.currentLevel === 'easy' || parsed?.currentLevel === 'medium' || parsed?.currentLevel === 'hard' ? parsed.currentLevel : 'easy',
    lockUntil: Number.isFinite(parsed?.lockUntil) ? parsed.lockUntil : 0,
    attempts: Array.isArray(parsed?.attempts) ? parsed.attempts : [],
    completedLevels: parsed?.completedLevels && typeof parsed.completedLevels === 'object' ? parsed.completedLevels : base.completedLevels,
  };
}

function setProvasState(next) {
  localStorage.setItem(PROVAS_KEY, JSON.stringify(next));
}

function formatTime(ts) {
  try {
    const d = new Date(ts);
    return d.toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });
  } catch {
    return '';
  }
}

function getLevelThreshold(level) {
  if (level === 'easy') return 7;
  if (level === 'medium') return 8;
  return 10;
}

function getNextLevel(level) {
  if (level === 'easy') return 'medium';
  if (level === 'medium') return 'hard';
  return 'hard';
}

function getNivelDisplay(level) {
  if (level === 'easy') return 'Fácil';
  if (level === 'medium') return 'Médio';
  return 'Difícil';
}

function isCourseCompleted(progress) {
  const completedCount = videos.reduce((acc, v) => acc + (progress.completed[String(v.n)] ? 1 : 0), 0);
  return completedCount >= videos.length;
}

function isProvasLocked(state) {
  const now = Date.now();
  return Number.isFinite(state?.lockUntil) && state.lockUntil > now;
}

function setProvasLockedForOneDay() {
  const state = getProvasState();
  state.lockUntil = Date.now() + 24 * 60 * 60 * 1000;
  setProvasState(state);
}

function finishLevelAndAdvance(level, passed) {
  const state = getProvasState();
  const nextState = { ...state };

  if (!passed) {
    nextState.lockUntil = Date.now() + 24 * 60 * 60 * 1000;
    setProvasState(nextState);
    return;
  }

  nextState.completedLevels = {
    ...(nextState.completedLevels || { easy: false, medium: false, hard: false }),
    [level]: true,
  };

  // avança se fácil/médio. ao aprovar difícil, marca concluído.
  if (level === 'easy' && !nextState.completedLevels.medium) nextState.currentLevel = 'medium';
  if (level === 'medium' && !nextState.completedLevels.hard) nextState.currentLevel = 'hard';
  if (level === 'hard') nextState.currentLevel = 'hard';

  setProvasState(nextState);
}

function buildVideoCard(video, progress) {
  const isCompleted = !!progress.completed[String(video.n)];


  const card = document.createElement('div');
  card.className = 'video-item';
  card.dataset.videoN = String(video.n);

  const statusPill = document.createElement('div');
  statusPill.className = 'pill ' + (isCompleted ? 'done' : 'todo');
  statusPill.textContent = isCompleted ? 'Completo' : 'Pendente';

  const title = document.createElement('div');
  title.className = 'video-title';
  title.textContent = video.title;

  const actions = document.createElement('div');
  actions.className = 'video-actions';

  const openBtn = document.createElement('button');
  openBtn.type = 'button';
  openBtn.className = 'btn secondary';
  openBtn.textContent = 'Assistir';
  openBtn.addEventListener('click', () => selectVideo(video.n));

  const completeBtn = document.createElement('button');
  completeBtn.type = 'button';
  completeBtn.className = 'btn primary';
  completeBtn.textContent = isCompleted ? 'Concluído ✓' : 'Completo';
  completeBtn.disabled = isCompleted;
  completeBtn.setAttribute('aria-disabled', isCompleted ? 'true' : 'false');

  completeBtn.addEventListener('click', () => {
    const p = getProgress();
    p.completed[String(video.n)] = true;
    p.lastVideo = clampVideo(video.n);
    setProgress(p);
    renderAll();
    // opcional: avançar automaticamente para próximo
    // const next = nextIncomplete(p, video.n);
    // if (next) selectVideo(next);
  });

  actions.appendChild(openBtn);
  actions.appendChild(completeBtn);

  card.appendChild(statusPill);
  card.appendChild(title);
  card.appendChild(actions);

  return card;
}

function nextIncomplete(progress, fromN) {
  const start = clampVideo(fromN) + 1;
  for (let i = start; i <= videos.length; i++) {
    if (!progress.completed[String(i)]) return i;
  }
  for (let i = 1; i <= videos.length; i++) {
    if (!progress.completed[String(i)]) return i;
  }
  return null;
}

function selectVideo(n) {
  const video = videos.find(v => v.n === n);
  if (!video) return;

  const p = getProgress();
  p.lastVideo = clampVideo(n);
  setProgress(p);

  const frame = document.getElementById('playerFrame');
  frame.src = video.youtubeUrl + '?rel=0&modestbranding=1';

  // UI: destaque selecionado
  Array.from(document.querySelectorAll('.video-item')).forEach(el => {
    el.classList.toggle('selected', Number(el.dataset.videoN) === n);
  });
}

function renderAll() {
  const progress = getProgress();
  const completedCount = videos.reduce((acc, v) => acc + (progress.completed[String(v.n)] ? 1 : 0), 0);

  document.getElementById('progressText').textContent = `${completedCount}/${videos.length}`;

  const list = document.getElementById('videosList');
  list.innerHTML = '';

  for (const video of videos) {
    list.appendChild(buildVideoCard(video, progress));
  }

  // Selecionar vídeo atual
  const current = clampVideo(progress.lastVideo || 1);
  selectVideo(current);
}

function wireReset() {
  const btn = document.getElementById('resetProgress');
  if (!btn) return;
  btn.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    renderAll();
  });
}

function getCurrentLevelToTake(state) {
  // prioridade: próxima não concluída
  if (!state.completedLevels?.easy) return 'easy';
  if (!state.completedLevels?.medium) return 'medium';
  if (!state.completedLevels?.hard) return 'hard';
  return 'hard';
}

function setProvaLevelUI(level) {
  const label = document.getElementById('provaLevelLabel');
  const title = document.getElementById('provaLevelTitle');
  if (label) label.textContent = getNivelDisplay(level);
  if (title) title.textContent = getNivelDisplay(level);
}

function updateProvasUI() {
  const state = getProvasState();
  const progress = getProgress();
  const completedCourse = isCourseCompleted(progress);

  const locked = isProvasLocked(state);
  const openBtn = document.getElementById('openProvaBtn');

  const levelToTake = getCurrentLevelToTake(state);
  setProvaLevelUI(levelToTake);

  const statusText = document.getElementById('provasStatusText');
  const statusSub = document.getElementById('provasStatusSub');

  if (!completedCourse) {
    if (statusText) statusText.textContent = 'Bloqueada';
    if (statusSub) statusSub.textContent = 'Conclua as 21 aulas para liberar';
    if (openBtn) openBtn.disabled = true;
    return;
  }

  if (locked) {
    const unlockAt = state.lockUntil;
    if (statusText) statusText.textContent = 'Bloqueada';
    if (statusSub) statusSub.textContent = `Liberando em: ${formatTime(unlockAt)}`;
    if (openBtn) openBtn.disabled = true;
    return;
  }

  if (statusText) statusText.textContent = 'Liberada';
  if (statusSub) statusSub.textContent = `Nível atual: ${getNivelDisplay(levelToTake)}`;
  if (openBtn) openBtn.disabled = false;
}

function renderProvaQuestions(level) {
  const overlay = document.getElementById('provaOverlay');
  const questionsEl = document.getElementById('provaQuestions');
  const metaEl = document.getElementById('provaMeta');
  const counterEl = document.getElementById('provaCounter');
  const submitBtn = document.getElementById('submitProvaBtn');
  const resultEl = document.getElementById('provaResult');

  const prova = getProva(level);
  const threshold = getLevelThreshold(level);

  overlay.style.display = 'flex';
  questionsEl.innerHTML = '';
  resultEl.style.display = 'none';
  resultEl.innerHTML = '';

  metaEl.textContent = `10 questões • Precisa de ${threshold}/${10} para passar`;

  const answers = new Array(prova.length).fill(null);

  function updateCounter() {
    const answeredCount = answers.filter(Boolean).length;
    if (counterEl) counterEl.textContent = `${answeredCount}/${prova.length} respondidas`;
    if (submitBtn) submitBtn.disabled = answeredCount === 0;
  }

  prova.forEach((item, idx) => {
    const qWrap = document.createElement('div');
    qWrap.className = 'card';
    qWrap.style.padding = '12px';

    const qTitle = document.createElement('div');
    qTitle.style.fontWeight = '950';
    qTitle.style.marginBottom = '8px';
    qTitle.textContent = `${idx + 1}. ${item.q}`;

    const optionsWrap = document.createElement('div');
    optionsWrap.style.display = 'grid';
    optionsWrap.style.gridTemplateColumns = '1fr 1fr';
    optionsWrap.style.gap = '10px';

    const letters = ['A', 'B', 'C', 'D'];

    letters.forEach((letter, optIndex) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn secondary';
      btn.style.justifyContent = 'flex-start';
      btn.style.textAlign = 'left';
      btn.style.borderRadius = '12px';
      btn.dataset.qi = String(idx);
      btn.dataset.ai = String(optIndex);
      btn.textContent = `${letter}) ${item.options[optIndex]}`;

      btn.addEventListener('click', () => {
        answers[idx] = optIndex;

        // highlight selected
        Array.from(optionsWrap.querySelectorAll('button')).forEach(b => {
          b.style.borderColor = 'rgba(255,255,255,.18)';
          b.style.background = 'rgba(255,255,255,.05)';
        });

        btn.style.borderColor = 'rgba(124,92,255,.65)';
        btn.style.background = 'rgba(124,92,255,.22)';

        updateCounter();
      });

      optionsWrap.appendChild(btn);
    });

    qWrap.appendChild(qTitle);
    qWrap.appendChild(optionsWrap);
    questionsEl.appendChild(qWrap);
  });

  function gradeAndShowResult() {
    const prova2 = getProva(level);
    let correct = 0;

    for (let i = 0; i < prova2.length; i++) {
      const selected = answers[i];
      if (selected === prova2[i].correctIndex) correct++;
    }

    const threshold = getLevelThreshold(level);
    const passed = correct >= threshold;

    finishLevelAndAdvance(level, passed);

    const state = getProvasState();
    const lockedNow = isProvasLocked(state);

    const color = passed ? '#bbf7d0' : '#fecaca';
    const label = passed ? 'APROVADO' : 'REPROVADO';

    resultEl.style.display = 'block';
    resultEl.innerHTML = `
      <div style="color:${color}; font-weight:950; font-size:18px; margin-bottom:6px">${label}</div>
      <div style="color:var(--muted); font-weight:800">Você acertou <b style="color:var(--text)">${correct}/10</b>. Precisa de <b style="color:var(--text)">${threshold}/10</b>.</div>
      ${passed ? `<div style="margin-top:8px; color:var(--muted); font-weight:800">Próximo nível liberado.</div>` : `<div style="margin-top:8px; color:var(--muted); font-weight:800">Provas bloqueadas por 1 dia.</div><div style="margin-top:4px; color:var(--muted); font-weight:800">Desbloqueio: ${formatTime(state.lockUntil)}</div>`}
      <div style="margin-top:12px"><button id="closeAfterResult" class="btn primary" type="button">Fechar</button></div>
    `;

    const closeBtn = document.getElementById('closeAfterResult');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        overlay.style.display = 'none';
        updateProvasUI();
      });
    }

    updateProvasUI();
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.onclick = () => {
      // exigir que todas respondam
      if (answers.some(a => a === null)) {
        const msg = document.createElement('div');
        msg.style.color = '#fecaca';
        msg.style.fontWeight = '900';
        msg.style.marginTop = '10px';
        msg.textContent = 'Responda todas as 10 questões antes de enviar.';
        resultEl.style.display = 'block';
        resultEl.style.marginTop = '14px';
        resultEl.innerHTML = '';
        resultEl.appendChild(msg);
        return;
      }
      gradeAndShowResult();
    };
  }

  updateCounter();
}

function wireProvas() {
  const openBtn = document.getElementById('openProvaBtn');
  const overlay = document.getElementById('provaOverlay');
  const closeBtn = document.getElementById('closeProvaBtn');

  if (openBtn) {
    openBtn.addEventListener('click', () => {
      const state = getProvasState();
      const progress = getProgress();
      if (!isCourseCompleted(progress)) {
        updateProvasUI();
        return;
      }
      if (isProvasLocked(state)) {
        updateProvasUI();
        return;
      }
      const levelToTake = getCurrentLevelToTake(state);
      renderProvaQuestions(levelToTake);
    });
  }

  if (overlay && closeBtn) {
    closeBtn.addEventListener('click', () => {
      overlay.style.display = 'none';
    });
  }

  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.style.display = 'none';
    });
  }
}

function init() {
  renderAll();
  wireReset();
  wireProvas();
  updateProvasUI();

  // Respeitar hash opcional: #v=3
  const m = (location.hash || '').match(/v=(\d+)/i);
  if (m && m[1]) {
    const n = clampVideo(Number(m[1]));
    selectVideo(n);
  }
}

document.addEventListener('DOMContentLoaded', init);


