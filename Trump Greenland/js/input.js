// Input Management
import { clamp } from './gameState.js';

export class InputManager {
  constructor() {
    this.left = false;
    this.right = false;
  }

  setupEventListeners(gameState, player, ui, sceneManager) {
    window.addEventListener('keydown', (e) => {
      if (e.repeat) return;
      
      // Movement
      if (e.key === 'ArrowLeft') this.left = true;
      if (e.key === 'ArrowRight') this.right = true;
      
      // UI controls
      if (e.key === 'i' || e.key === 'I') ui.toggleInventory(gameState);
      if (e.key === '1') player.useItem(0, gameState, ui);
      if (e.key === '2') player.useItem(1, gameState, ui);
      if (e.key === '3') player.useItem(2, gameState, ui);
      if (e.key === 'Escape') ui.closeAllDialogs(gameState);
      
      // Tweet with T key
      if (e.key === 't' || e.key === 'T') {
        gameState.hasTweeted = true;
        player.tweet(gameState, ui);
      }
      
      // Interaction
      if (e.key === ' ') {
        const h = sceneManager.findNearestHotspot(gameState);
        if (h && typeof h.onInteract === 'function') {
          h.onInteract();
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowLeft') this.left = false;
      if (e.key === 'ArrowRight') this.right = false;
    });
  }

  updatePlayerMovement(gameState, player) {
    const isMoving = this.left || this.right;
    
    if (isMoving) {
      player.startWalking();
    } else {
      player.stopWalking();
    }
    
    if (gameState.scene === 'GL') {
      if (this.left) gameState.player.x -= gameState.player.speed;
      if (this.right) gameState.player.x += gameState.player.speed;
      gameState.player.x = clamp(gameState.player.x, 0, 1170); // Updated for 1200px width
    } else {
      // Oval office - full movement
      if (this.left) gameState.player.x -= gameState.player.speed;
      if (this.right) gameState.player.x += gameState.player.speed;
      gameState.player.x = clamp(gameState.player.x, 0, 1170); // Allow full movement in 1200px width
    }
  }
}