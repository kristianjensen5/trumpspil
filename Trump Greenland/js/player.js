// Player Management
import { clamp } from './gameState.js';

export class Player {
  constructor() {
    this.playerEl = null;
    this.walkAnimFrame = 0;
    this.isWalking = false;
    this.walkTimer = null;
  }

  create(world, gameState) {
    this.playerEl = document.createElement('div');
    this.playerEl.className = 'player';
    this.playerEl.innerHTML = `
      <div class="p-legs"></div>
      <div class="p-body"></div>
      <div class="p-head" id="head"></div>
      <div class="p-hair"></div>
      <div class="p-cap" id="cap"></div>
      <div class="p-trophy" id="tro"></div>
      <div class="p-phone"></div>
    `;
    world.appendChild(this.playerEl);
    this.updateAppearance(gameState);
  }

  updateAppearance(gameState) {
    if (!this.playerEl) return;
    
    const head = this.playerEl.querySelector('#head');
    const cap = this.playerEl.querySelector('#cap');
    const tro = this.playerEl.querySelector('#tro');
    
    // Skin tone -> lerp base to orange
    const base = [242, 210, 182];
    const orange = [255, 160, 80];
    const t = clamp(gameState.player.tan, 0, 1);
    const mix = (a, b) => Math.round(a + (b - a) * t);
    
    head.style.setProperty('--skin', 
      `rgb(${mix(base[0], orange[0])},${mix(base[1], orange[1])},${mix(base[2], orange[2])})`);
    cap.style.display = gameState.player.cap ? 'block' : 'none';
    tro.style.display = gameState.player.trophy ? 'block' : 'none';
  }

  setPosition(x) {
    if (this.playerEl) {
      this.playerEl.style.left = `${x}px`;
    }
  }

  startWalking() {
    if (!this.isWalking) {
      this.isWalking = true;
      this.animateWalk();
    }
  }

  stopWalking() {
    this.isWalking = false;
    if (this.walkTimer) {
      clearTimeout(this.walkTimer);
      this.walkTimer = null;
    }
    // Reset to neutral position
    if (this.playerEl) {
      const legs = this.playerEl.querySelector('.p-legs');
      if (legs) {
        legs.className = 'p-legs';
      }
    }
  }

  animateWalk() {
    if (!this.isWalking || !this.playerEl) return;
    
    const legs = this.playerEl.querySelector('.p-legs');
    if (legs) {
      this.walkAnimFrame = (this.walkAnimFrame + 1) % 4;
      
      if (this.walkAnimFrame === 0 || this.walkAnimFrame === 2) {
        legs.className = 'p-legs';
      } else if (this.walkAnimFrame === 1) {
        legs.className = 'p-legs walk-left';
      } else {
        legs.className = 'p-legs walk-right';
      }
    }
    
    this.walkTimer = setTimeout(() => this.animateWalk(), 200);
  }

  useItem(slotIndex, gameState, ui) {
    const id = ['tanner', 'trophy', 'maga'][slotIndex];
    if (!id) return;
    
    if (id === 'tanner') {
      gameState.player.tan = clamp(gameState.player.tan + 0.25, 0, 1);
      this.updateAppearance(gameState);
      ui.say('A healthy (orange) glow!', 'player');
    }
    
    if (id === 'trophy') {
      gameState.player.trophy = !gameState.player.trophy;
      this.updateAppearance(gameState);
      ui.say(gameState.player.trophy ? 'Hoisting the big cup!' : 'Put the trophy away.', 'player');
    }
    
    if (id === 'maga') {
      gameState.player.cap = !gameState.player.cap;
      this.updateAppearance(gameState);
      ui.say(gameState.player.cap ? 'Hat on.' : 'Hat off.', 'player');
    }
    
    // Visual feedback on inventory slot
    const slots = [...document.getElementById('inv').querySelectorAll('.slot')];
    slots.forEach(s => s.classList.remove('emph'));
    slots[slotIndex]?.classList.add('emph');
    setTimeout(() => slots[slotIndex]?.classList.remove('emph'), 450);
  }

  tweet(gameState, ui) {
    let message;
    
    if (gameState.scene === 'GL') {
      // Greenland tweets
      if (gameState.flags > 0) {
        message = 'Greenland is ours now. 🇺🇸';
      } else if (gameState.bearDown) {
        message = 'Just had to deal with a polar bear. Totally legal!';
      } else {
        message = 'Beautiful Greenland! Should be ours!';
      }
    } else {
      // Oval Office tweets
      message = 'Working hard from the Oval Office.';
      if (gameState.player.cap) message += ' #MAGA';
    }
    
    ui.tweet(message);
  }
}