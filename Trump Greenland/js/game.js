// Main Game Module
import { gameState } from './gameState.js';
import { UI } from './ui.js';
import { Player } from './player.js';
import { SceneManager } from './scenes.js';
import { InputManager } from './input.js';

class Game {
  constructor() {
    this.ui = new UI();
    this.player = new Player();
    this.sceneManager = new SceneManager();
    this.inputManager = new InputManager();
    
    this.isRunning = false;
  }

  init() {
    // Setup input handlers
    this.inputManager.setupEventListeners(gameState, this.player, this.ui, this.sceneManager);
    
    // Build initial scene
    this.sceneManager.buildScene(gameState, this.player, this.ui);
    
    // Start game loop
    this.start();
    
    // Setup intersection observer for performance
    this.setupPerformanceOptimization();
  }

  start() {
    this.isRunning = true;
    this.gameLoop();
  }

  gameLoop() {
    if (!this.isRunning) return;
    
    // Update player movement
    this.inputManager.updatePlayerMovement(gameState, this.player);
    
    // Update player position
    this.player.setPosition(gameState.player.x);
    
    // Update camera
    this.sceneManager.updateCamera(gameState);
    
    // Update UI (show interaction prompt)
    const nearestHotspot = this.sceneManager.findNearestHotspot(gameState);
    this.ui.showPrompt(!!nearestHotspot);
    
    // Continue loop
    requestAnimationFrame(() => this.gameLoop());
  }

  setupPerformanceOptimization() {
    // Pause when game is not visible to save CPU
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting && !this.isRunning) {
          this.start();
        } else if (!entry.isIntersecting && this.isRunning) {
          this.isRunning = false;
        }
      }
    }, { threshold: 0.2 });
    
    observer.observe(document.getElementById('game'));
  }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const game = new Game();
  game.init();
});