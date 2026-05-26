/**
 * render.js
 * Funções responsáveis por gerar e atualizar o DOM.
 * Dependências: CATS (data.js), user (state.js).
 */

// ───────────────────────────────────────────────────
// POOL DE VÍDEOS
// ───────────────────────────────────────────────────

/**
 * Renderiza o grid de vídeos do pool.
 * @param {number[]|null} highlights – ids dos vídeos a destacar (null = todos normais)
 */
function renderPool(highlights = null) {
  const avail = VIDEOS.filter(v => !user.history.has(v.id)).length;
  document.getElementById('poolMeta').textContent = `${avail} disponíveis / ${VIDEOS.length}`;

  document.getElementById('vgrid').innerHTML = VIDEOS.map(v => {
    const cat   = CATS[v.cat];
    const isDim = highlights && !highlights.includes(v.id);
    const isHi  = highlights &&  highlights.includes(v.id);
    const seen  = user.history.has(v.id);

    return `<div class="vchip ${isDim ? 'dim' : ''} ${isHi ? 'hi' : ''}"
      style="background:${cat.color}16;${isHi ? `border-color:${cat.color}55;` : ''}"
      title="${v.title} | @${v.creator} | Completion: ${Math.round(v.cr * 100)}% | Likes: ${Math.round(v.lr * 100)}%">
      <span class="icon">${cat.icon}</span>
      <div class="vtit">${v.title}</div>
      ${seen ? '<div class="vseen">✓ visto</div>' : ''}
    </div>`;
  }).join('');
}

// ───────────────────────────────────────────────────
// LEGENDA DE CATEGORIAS
// ───────────────────────────────────────────────────

/** Renderiza as pílulas de categoria com os % de interesse atuais */
function renderLegend() {
  document.getElementById('catLeg').innerHTML = Object.entries(CATS)
    .map(([k, c]) =>
      `<span class="cat-pill" style="color:${c.color};border-color:${c.color}55;background:${c.color}12">
        ${c.icon} ${c.label} ${Math.round(user.interests[k] * 100)}%
      </span>`
    ).join('');
}

// ───────────────────────────────────────────────────
// CANDIDATOS (painel de processamento)
// ───────────────────────────────────────────────────

/**
 * Renderiza a lista de candidatos no painel central.
 * @param {Array}   list      – candidatos retornados pelo algoritmo
 * @param {boolean} showScore – true = exibir pontuação; false = exibir relevância %
 */
function renderCandidates(list, showScore) {
  document.getElementById('procMeta').textContent = `${list.length} candidatos`;

  document.getElementById('procPanel').innerHTML =
    `<div class="clist">${list.map((v, i) => {
      const cat = CATS[v.cat];
      const val = showScore
        ? v.score.toFixed(1) + 'pts'
        : Math.round((v.relevance || 0) * 100) + '%';
      const pct = showScore ? v.score : Math.round((v.relevance || 0) * 100);

      return `<div class="ccard" style="animation-delay:${i * 0.04}s;border-left:3px solid ${cat.color};">
        <div class="icon">${cat.icon}</div>
        <div class="cinfo">
          <div class="ctit">${v.title}</div>
          <div class="cmeta">@${v.creator} · ${cat.label}</div>
        </div>
        <div class="swrap">
          <div class="snum">${val}</div>
          <div class="strk"><div class="sfil" style="width:${pct}%;background:${cat.color}"></div></div>
        </div>
      </div>`;
    }).join('')}</div>`;
}

// ───────────────────────────────────────────────────
// FEED FINAL
// ───────────────────────────────────────────────────

/** Renderiza o feed gerado no painel da direita */
function renderFeed(feed) {
  document.getElementById('feedMeta').textContent = `${feed.length} vídeos`;

  document.getElementById('feedPanel').innerHTML =
    `<div class="flist">${feed.map((v, i) => {
      const cat = CATS[v.cat];

      return `<div class="fcard ${v.isDiscovery ? 'disc' : ''}" id="fc-${v.id}"
        style="animation-delay:${i * 0.06}s;border-left:3px solid ${cat.color};">
        <div class="fcrd-top">
          <div class="icon">${cat.icon}</div>
          <div class="finf">
            <div class="ftit">${v.title}</div>
            <div class="fcrt">@${v.creator} · ${cat.label}</div>
          </div>
          <div class="frt">
            <span class="fpts">${v.score}pts</span>
            ${v.isDiscovery
              ? '<span class="fpill fpill-d">★ Descoberta</span>'
              : `<span class="fpill fpill-r">#${i + 1}</span>`}
          </div>
        </div>
        <div class="faction">
          <button class="abtn wa" onclick="interact(${v.id},'${v.cat}','watch',this)">✓ Assistiu</button>
          <button class="abtn li" onclick="interact(${v.id},'${v.cat}','like',this)">♥ Curtiu</button>
          <button class="abtn sk" onclick="interact(${v.id},'${v.cat}','skip',this)">⏭ Pulou</button>
        </div>
      </div>`;
    }).join('')}</div>`;
}

// ───────────────────────────────────────────────────
// PERFIL DO USUÁRIO — BARRAS DE INTERESSE
// ───────────────────────────────────────────────────

/** Renderiza as barras de interesse do perfil */
function renderInterests() {
  document.getElementById('intGrid').innerHTML = Object.entries(user.interests)
    .map(([k, v]) => {
      const cat = CATS[k];
      return `<div>
        <div class="int-lbl">
          <span class="int-nm">${cat.icon} ${cat.label}</span>
          <span class="int-pct" id="ipct-${k}">${Math.round(v * 100)}%</span>
        </div>
        <div class="int-trk">
          <div class="int-fil" id="ibar-${k}" style="width:${v * 100}%;background:${cat.color}"></div>
        </div>
      </div>`;
    }).join('');
}

/**
 * Atualiza apenas a barra de interesse de uma categoria específica.
 * Mais eficiente que re-renderizar tudo após cada interação.
 * @param {string} k – chave da categoria
 */
function updateInterestBar(k) {
  const v   = user.interests[k];
  const bar = document.getElementById(`ibar-${k}`);
  const pct = document.getElementById(`ipct-${k}`);
  if (bar) bar.style.width   = (v * 100) + '%';
  if (pct) pct.textContent   = Math.round(v * 100) + '%';
  renderLegend();
}
