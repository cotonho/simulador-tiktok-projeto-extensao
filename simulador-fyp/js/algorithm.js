/**
 * algorithm.js
 * As 3 etapas centrais do algoritmo de recomendação.
 * Funções puras — não alteram estado externo.
 */

/**
 * ETAPA 1 — Filtragem Colaborativa
 * Remove vídeos já vistos e prioriza categorias de maior interesse.
 *
 * @param {Array}  videos  – pool completo de vídeos
 * @param {Object} user    – estado do usuário (interests + history)
 * @returns {Array} top 10 candidatos com campo `relevance`
 */
function step1(videos, user) {
  const eligible = videos.filter(v => !user.history.has(v.id));

  return eligible
    .map(v => ({
      ...v,
      relevance: user.interests[v.cat] * 0.65
               + v.cr * 0.20
               + Math.random() * 0.15,
    }))
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 10);
}

/**
 * ETAPA 2 — Pontuação Preditiva de Engajamento
 * Combina interesse do usuário com métricas reais do vídeo.
 * Fórmula: completion×40% + likes×30% + replays×30%
 *
 * @param {Array}  candidates – saída da etapa 1
 * @param {Object} user       – estado do usuário
 * @returns {Array} candidatos ordenados por `score` (descendente)
 */
function step2(candidates, user) {
  return candidates
    .map(v => {
      const interest   = user.interests[v.cat];
      const engagement = v.cr * 0.40 + v.lr * 0.30 + v.rr * 0.30;
      const score      = Math.round((interest * 0.40 + engagement * 0.60) * 100 * 10) / 10;
      return { ...v, score };
    })
    .sort((a, b) => b.score - a.score);
}

/**
 * ETAPA 3 — Diversificação + Vídeo Surpresa
 * Evita categorias repetidas consecutivas e injeta um conteúdo
 * de descoberta no final do feed.
 *
 * @param {Array} scored – saída da etapa 2
 * @returns {Array} feed final com até 6 vídeos
 */
function step3(scored) {
  const feed     = [];
  const usedCats = new Set();

  /* Preenche o feed evitando dois vídeos da mesma categoria seguidos */
  for (const v of scored) {
    if (feed.length >= 5) break;
    const last = feed[feed.length - 1];
    if (!last || last.cat !== v.cat) {
      feed.push(v);
      usedCats.add(v.cat);
    }
  }

  /* Completa até 5 vídeos caso necessário */
  for (const v of scored) {
    if (feed.length >= 5) break;
    if (!feed.find(f => f.id === v.id)) feed.push(v);
  }

  /* Vídeo surpresa: menor pontuação, preferencialmente categoria nova */
  const discovery = scored
    .slice()
    .reverse()
    .find(v => !feed.find(f => f.id === v.id) && !usedCats.has(v.cat))
    ?? scored[scored.length - 1];

  if (discovery && !feed.find(f => f.id === discovery.id)) {
    feed.push({ ...discovery, isDiscovery: true });
  }

  return feed.slice(0, 6);
}
