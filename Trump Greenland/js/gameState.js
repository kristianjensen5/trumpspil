// Game State Management
export const gameState = {
  scene: 'GL',         // 'GL' | 'OVAL'
  player: { x: 220, facing: 1, speed: 3.5, tan: 0, cap: false, trophy: false },
  invOpen: false,
  inventory: ['tanner', 'trophy', 'maga'],
  flags: 0,
  bearDown: false,
  hasTweeted: false,   // track if player has tweeted
  reduced: window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  nonViolent: false,    // set true for selfie instead of "bang"
};

// Utility functions
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));