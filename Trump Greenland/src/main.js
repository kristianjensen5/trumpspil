import { Game } from './systems/game.js';
import { createNuukScene } from './scenes/nuuk.js';
import { createIceFieldScene } from './scenes/icefield.js';

// Registry of scenes by key, to make adding destinations easy.
const scenes = {
  nuuk: createNuukScene,
  icefield: createIceFieldScene,
};

const canvas = document.getElementById('game');
const locationEl = document.getElementById('location');
const textboxEl = document.getElementById('textbox');
const overlayEl = document.getElementById('overlay');

const game = new Game({ canvas, locationEl, textboxEl, overlayEl, scenes });
game.loadScene('nuuk');
game.start();

