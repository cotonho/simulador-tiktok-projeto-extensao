/**
 * data.js
 * Dados estáticos da aplicação: categorias e pool de vídeos.
 */

const CATS = {
  tech:    { label: 'Tecnologia', icon: '💻', color: '#0a84ff' },
  humor:   { label: 'Humor',      icon: '😂', color: '#ff2d55' },
  music:   { label: 'Música',     icon: '🎵', color: '#ffd60a' },
  sports:  { label: 'Esportes',   icon: '⚽', color: '#32d74b' },
  food:    { label: 'Culinária',  icon: '🍕', color: '#ff9f0a' },
  science: { label: 'Ciência',    icon: '🔬', color: '#bf5af2' },
};

/**
 * Cada vídeo possui:
 *  id      – identificador único
 *  title   – título exibido
 *  cat     – chave de categoria (ver CATS)
 *  cr      – completion rate  (0–1)
 *  lr      – like rate        (0–1)
 *  rr      – replay rate      (0–1)
 *  creator – nome do criador
 */
const VIDEOS = [
  { id: 1,  title: 'Como a IA funciona',         cat: 'tech',    cr: 0.78, lr: 0.12, rr: 0.22, creator: 'TechBrasil'   },
  { id: 2,  title: 'Python em 5 minutos',        cat: 'tech',    cr: 0.82, lr: 0.09, rr: 0.18, creator: 'CodeNinja'    },
  { id: 3,  title: 'iPhone vs Android 2025',     cat: 'tech',    cr: 0.65, lr: 0.14, rr: 0.10, creator: 'GadgetBr'     },
  { id: 4,  title: 'ChatGPT: truques secretos',  cat: 'tech',    cr: 0.90, lr: 0.20, rr: 0.35, creator: 'AItips'       },
  { id: 5,  title: 'Meu gato odeia segundas',    cat: 'humor',   cr: 0.95, lr: 0.35, rr: 0.60, creator: 'PetComedy'    },
  { id: 6,  title: 'Reunião desnecessária',      cat: 'humor',   cr: 0.88, lr: 0.28, rr: 0.45, creator: 'OfficeLife'   },
  { id: 7,  title: 'Professores brasileiros',    cat: 'humor',   cr: 0.92, lr: 0.40, rr: 0.55, creator: 'EscolaCaos'   },
  { id: 8,  title: 'Compilação de fails épicos', cat: 'humor',   cr: 0.75, lr: 0.22, rr: 0.30, creator: 'FailZone'     },
  { id: 9,  title: 'Beat drop insano',           cat: 'music',   cr: 0.70, lr: 0.18, rr: 0.40, creator: 'BeatMaker'    },
  { id: 10, title: 'Aprenda guitarra hoje',      cat: 'music',   cr: 0.55, lr: 0.08, rr: 0.15, creator: 'GuitarPro'    },
  { id: 11, title: 'Funk que não sai da cabeça', cat: 'music',   cr: 0.85, lr: 0.30, rr: 0.65, creator: 'FunkBr'       },
  { id: 12, title: 'Piano solo emocionante',     cat: 'music',   cr: 0.60, lr: 0.15, rr: 0.20, creator: 'PianoVibe'    },
  { id: 13, title: 'Golaço impossível',          cat: 'sports',  cr: 0.92, lr: 0.38, rr: 0.70, creator: 'FutebolBr'    },
  { id: 14, title: 'Treino HIIT em 10 min',      cat: 'sports',  cr: 0.48, lr: 0.10, rr: 0.12, creator: 'FitBrasil'    },
  { id: 15, title: 'NBA Highlights da semana',   cat: 'sports',  cr: 0.72, lr: 0.20, rr: 0.30, creator: 'BasqueteBr'   },
  { id: 16, title: 'Surf no litoral brasileiro', cat: 'sports',  cr: 0.80, lr: 0.25, rr: 0.38, creator: 'SurfLife'     },
  { id: 17, title: 'Bolo de brigadeiro fácil',   cat: 'food',    cr: 0.85, lr: 0.22, rr: 0.28, creator: 'DoceVida'     },
  { id: 18, title: 'Pizza caseira do zero',      cat: 'food',    cr: 0.78, lr: 0.18, rr: 0.20, creator: 'ChefHome'     },
  { id: 19, title: 'Churrasco perfeito',         cat: 'food',    cr: 0.90, lr: 0.32, rr: 0.42, creator: 'AsadorBr'     },
  { id: 20, title: 'Sushi em casa funciona?',    cat: 'food',    cr: 0.68, lr: 0.15, rr: 0.18, creator: 'JaponêsAqui'  },
  { id: 21, title: 'Buracos negros explicados',  cat: 'science', cr: 0.72, lr: 0.16, rr: 0.25, creator: 'AstroFísica'  },
  { id: 22, title: 'Por que sonhamos?',          cat: 'science', cr: 0.80, lr: 0.19, rr: 0.30, creator: 'NeuroLab'     },
  { id: 23, title: 'Experiência com Coca-Cola',  cat: 'science', cr: 0.88, lr: 0.28, rr: 0.50, creator: 'QuímicaMais'  },
  { id: 24, title: 'O universo em escala',       cat: 'science', cr: 0.65, lr: 0.14, rr: 0.22, creator: 'CosmosTV'     },
];
