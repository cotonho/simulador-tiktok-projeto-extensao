/**
 * main.js
 * Controlador principal da aplicação.
 * Orquestra o fluxo do algoritmo (4 etapas), o reset do usuário e a inicialização.
 * Dependências: todos os outros módulos JS.
 */

// ───────────────────────────────────────────────────
// HELPERS DE UI
// ───────────────────────────────────────────────────

/** Promessa simples de espera (ms) */
const wait = ms => new Promise(r => setTimeout(r, ms));

/**
 * Altera o estado visual de uma etapa na barra de progresso.
 * @param {string} id  – id do elemento DOM da etapa
 * @param {'active'|'done'} cls – classe a aplicar
 */
function setStep(id, cls) {
  const el = document.getElementById(id);
  if (cls === 'active') { el.classList.add('active');    el.classList.remove('done');   }
  if (cls === 'done')   { el.classList.remove('active'); el.classList.add('done');      }
}

// ───────────────────────────────────────────────────
// ALGORITMO PRINCIPAL (ASYNC — 4 ETAPAS)
// ───────────────────────────────────────────────────

/**
 * Executa as 4 etapas do algoritmo de recomendação com delays
 * visuais para que o usuário acompanhe cada fase.
 */
async function runAlgorithm() {
  if (running) return;
  running = true;

  const btn = document.getElementById('runBtn');
  btn.disabled    = true;
  btn.textContent = '⏳ Processando...';
  document.getElementById('refreshBtn').classList.remove('show');
  // clearLog();

  /* Reset visual das etapas */
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active', 'done'));
  renderPool();
  renderLegend();

  const avail = VIDEOS.filter(v => !user.history.has(v.id)).length;
  log(`<span class="lc">[INÍCIO]</span> Pool: <strong>${VIDEOS.length} vídeos</strong> | Histórico: <strong>${user.history.size} vistos</strong> | Elegíveis: <strong>${avail}</strong>`);

  await wait(500);

  // ── ETAPA 1 — Filtragem Colaborativa ──
  setStep('step1', 'active');
  log(`<span class="lc">[ETAPA 1]</span> Filtragem colaborativa — priorizando categorias de maior interesse do usuário...`);
  await wait(700);

  const candidates = step1(VIDEOS, user);
  renderPool(candidates.map(v => v.id));
  renderCandidates(candidates, false);
  log(`<span class="lc">[ETAPA 1]</span> ${avail} elegíveis → <strong>${candidates.length} candidatos</strong>. Mais relevante: "${candidates[0]?.title}"`);

  await wait(1500);
  setStep('step1', 'done');

  // ── ETAPA 2 — Pontuação Preditiva ──
  setStep('step2', 'active');
  log(`<span class="lo">[ETAPA 2]</span> Calculando pontuação — fórmula: completion×40% + likes×30% + replays×30%...`);
  await wait(700);

  const scored = step2(candidates, user);
  renderCandidates(scored, true);
  log(`<span class="lo">[ETAPA 2]</span> Pontuação concluída. Líder: <strong>"${scored[0]?.title}"</strong> com ${scored[0]?.score}pts`);

  await wait(1500);
  setStep('step2', 'done');

  // ── ETAPA 3 — Diversificação ──
  setStep('step3', 'active');
  log(`<span class="lp">[ETAPA 3]</span> Diversificando — evitando categorias repetidas + injetando vídeo surpresa...`);
  await wait(700);

  const feed = step3(scored);
  const disc = feed.find(v => v.isDiscovery);
  log(`<span class="lp">[ETAPA 3]</span> ${scored.length} candidatos → ${feed.length} vídeos no feed. Surpresa: <strong>"${disc?.title}"</strong> (${CATS[disc?.cat]?.label})`);

  await wait(800);
  setStep('step3', 'done');

  // ── ETAPA 4 — Feed + Feedback ──
  setStep('step4', 'active');
  renderFeed(feed);
  log(`<span class="lg">[ETAPA 4]</span> Feed pronto com <strong>${feed.length} vídeos</strong>! Interaja para ver o algoritmo aprender em tempo real →`);
  setStep('step4', 'done');

  btn.disabled    = false;
  btn.textContent = '↺ Regenerar Feed';
  running = false;
}

// ───────────────────────────────────────────────────
// RESET DO USUÁRIO
// ───────────────────────────────────────────────────

/** Reinicia o usuário e a UI para o estado inicial */
function resetUser() {
  resetUserState(); /* state.js */

  document.getElementById('runBtn').textContent = '▶ Gerar Feed';
  document.getElementById('refreshBtn').classList.remove('show');

  document.getElementById('procPanel').innerHTML =
    '<div class="empty"><div class="ei">⚙️</div><p>Clique em <strong>"Gerar Feed"</strong><br>para ver o algoritmo em ação</p></div>';

  document.getElementById('feedPanel').innerHTML =
    '<div class="empty"><div class="ei">📱</div><p>Seu feed personalizado<br>aparecerá aqui</p></div>';

  document.getElementById('procMeta').textContent = 'aguardando...';
  document.getElementById('feedMeta').textContent = 'aguardando...';

  document.querySelectorAll('.step').forEach(s => s.classList.remove('active', 'done'));

  renderPool();
  renderInterests();
  renderLegend();
  clearLog();

  log(`<span class="lc">[SISTEMA]</span> Usuário resetado — interesses e histórico limpos.`);
}

// ───────────────────────────────────────────────────
// INICIALIZAÇÃO
// ───────────────────────────────────────────────────

(function init() {
  renderPool();
  renderInterests();
  renderLegend();
  log(`<span class="lc">[SISTEMA]</span> Simulador FYP carregado — ${VIDEOS.length} vídeos em 6 categorias.`);
  log(`<span class="lm">[DICA]</span> Clique em <strong>"Gerar Feed"</strong> para ver as 4 etapas. Depois interaja com os vídeos para ver o feed se adaptar!`);
})();
