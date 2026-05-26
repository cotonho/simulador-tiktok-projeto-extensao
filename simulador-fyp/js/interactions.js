/**
 * interactions.js
 * Lida com as interações do usuário nos vídeos do feed
 * e com as funções utilitárias de log.
 * Dependências: CATS, DELTA, user (state.js), render.js.
 */

/** Variação de interesse por tipo de interação */
const DELTA = { watch: 0.07, like: 0.10, skip: -0.08 };

/** Rótulos legíveis para o log */
const ILBL  = { watch: '✓ assistiu', like: '♥ curtiu', skip: '⏭ pulou' };

let contador = 0;

// ───────────────────────────────────────────────────
// INTERAÇÕES DO FEED
// ───────────────────────────────────────────────────

/**
 * Processa a interação do usuário com um vídeo do feed.
 * Atualiza o estado, a UI e registra no log.
 *
 * @param {number} videoId – id do vídeo
 * @param {string} cat     – categoria do vídeo
 * @param {string} action  – 'watch' | 'like' | 'skip'
 * @param {HTMLElement} btn – botão clicado (para desabilitar os irmãos)
 */
function interact(videoId, cat, action, btn) {
  const card = document.getElementById(`fc-${videoId}`);

  /* Desabilita todos os botões do card */
  card.querySelectorAll('.abtn').forEach(b => (b.disabled = true));
  card.classList.add('used');

  /* Atualiza interesse */
  const delta = DELTA[action];
  user.interests[cat] = Math.max(0.05, Math.min(1.0, user.interests[cat] + delta));
  updateInterestBar(cat);
  user.history.add(videoId);
  renderPool();

  /* Log */
  const title = card.querySelector('.ftit').textContent;
  const sign  = delta > 0 ? '+' : '';
  const cls   = delta > 0 ? 'lg' : 'lp';
  log(`<span class="${cls}">[INTERAÇÃO]</span> ${ILBL[action]} "${title}" → ${CATS[cat].label} <span class="${cls}">${sign}${Math.round(delta * 100)}%</span>`);

  document.getElementById('refreshBtn').classList.add('show');
  contador++;

  if (contador == 6) {
    runAlgorithm();
    contador = 0;
  }
}

// ───────────────────────────────────────────────────
// LOG DO ALGORITMO
// ───────────────────────────────────────────────────

/**
 * Adiciona uma linha ao painel de log com timestamp.
 * @param {string} html – conteúdo HTML da linha
 */
function log(html) {
  const panel = document.getElementById('logPanel');
  const time  = new Date().toLocaleTimeString('pt-BR');
  const line  = document.createElement('div');
  line.className = 'log-line';
  line.innerHTML = `<span class="lm">[${time}]</span> ${html}`;
  panel.appendChild(line);
  panel.scrollTop = panel.scrollHeight;
}

/** Remove todas as linhas do log */
function clearLog() {
  document.getElementById('logPanel').innerHTML = '';
}
