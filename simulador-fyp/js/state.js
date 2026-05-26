/**
 * state.js
 * Estado global do usuário e flags de controle da aplicação.
 * Centraliza os dados mutáveis para facilitar reset e rastreamento.
 */

/** Interesses iniciais do usuário (escala 0–1) */
const DEFAULT_INTERESTS = {
  tech:    0.80,
  humor:   0.30,
  music:   0.50,
  sports:  0.20,
  food:    0.40,
  science: 0.70,
};

/**
 * Cria um objeto de estado fresco para o usuário.
 * @returns {{ interests: Object, history: Set }}
 */
function createDefaultUser() {
  return {
    interests: { ...DEFAULT_INTERESTS },
    history:   new Set(),
  };
}

/** Estado ativo do usuário (mutável) */
let user = createDefaultUser();

/** Flag que impede execuções simultâneas do algoritmo */
let running = false;

/**
 * Reseta o estado do usuário para os valores padrão.
 * Retorna o novo objeto de estado.
 */
function resetUserState() {
  user    = createDefaultUser();
  running = false;
  return user;
}
