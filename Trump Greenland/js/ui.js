// UI Management
export class UI {
  constructor() {
    this.elPrompt = document.getElementById('prompt');
    this.elInv = document.getElementById('inv');
    this.elBubble = document.getElementById('bubble');
    this.elCard = document.getElementById('card');
    this.elFade = document.getElementById('fade');
  }

  showPrompt(on) {
    this.elPrompt.classList.toggle('show', !!on);
  }

  say(text, speaker = 'system', ms = 1800) {
    if (speaker === 'player') {
      this.showCharacterBubble(text, 'trump', ms);
    } else if (speaker === 'mette') {
      this.showCharacterBubble(text, 'mette', ms);
    } else {
      // Fallback to center bubble for system messages
      this.elBubble.textContent = text;
      this.elBubble.style.display = 'block';
      const t = setTimeout(() => {
        this.elBubble.style.display = 'none';
      }, ms);
      return {
        close: () => {
          clearTimeout(t);
          this.elBubble.style.display = 'none';
        }
      };
    }
  }

  showCharacterBubble(text, character, ms = 1800) {
    // Don't remove existing bubbles immediately - let them coexist briefly
    
    // Create new bubble
    const bubble = document.createElement('div');
    bubble.className = `char-bubble char-bubble-${character}`;
    bubble.textContent = text;
    
    // Add arrow
    const arrow = document.createElement('div');
    arrow.className = 'bubble-arrow';
    bubble.appendChild(arrow);
    
    // Append to game container instead of document.body
    const gameEl = document.getElementById('game');
    gameEl.appendChild(bubble);
    
    // Position bubble based on character
    this.positionCharacterBubble(bubble, character);
    
    // Auto-remove after timeout
    setTimeout(() => {
      if (bubble.parentNode) bubble.remove();
    }, ms);
    
    return {
      close: () => {
        if (bubble.parentNode) bubble.remove();
      }
    };
  }

  positionCharacterBubble(bubble, character) {
    const gameEl = document.getElementById('game');
    const worldEl = document.getElementById('world');
    
    // Character positions within the game world (relative to world, not game)
    const positions = {
      trump: { x: 220, y: 500 }, // Default positions - adjusted for taller viewport
      mette: { x: 950, y: 500 }
    };
    
    // Get actual character positions relative to the world
    const playerEl = document.querySelector('.player');
    if (playerEl && character === 'trump') {
      const worldRect = worldEl.getBoundingClientRect();
      const playerRect = playerEl.getBoundingClientRect();
      positions.trump.x = playerRect.left - worldRect.left + playerRect.width / 2;
      positions.trump.y = playerRect.top - worldRect.top;
    }
    
    const metteEl = document.querySelector('.mette');
    if (metteEl && character === 'mette') {
      const worldRect = worldEl.getBoundingClientRect();
      const metteRect = metteEl.getBoundingClientRect();
      positions.mette.x = metteRect.left - worldRect.left + metteRect.width / 2;
      positions.mette.y = metteRect.top - worldRect.top;
    }
    
    const pos = positions[character];
    const bubbleWidth = 200;
    const bubbleHeight = 60;
    
    // Position above character with some offset (relative to game container)
    let x = pos.x - bubbleWidth / 2;
    let y = pos.y - bubbleHeight - 20;
    
    // Check for existing bubbles and avoid overlap
    const existingBubbles = gameEl.querySelectorAll('.char-bubble');
    for (const existing of existingBubbles) {
      if (existing === bubble) continue; // Skip self
      
      const existingRect = {
        left: parseInt(existing.style.left),
        top: parseInt(existing.style.top),
        right: parseInt(existing.style.left) + bubbleWidth,
        bottom: parseInt(existing.style.top) + bubbleHeight
      };
      
      const newRect = {
        left: x,
        top: y,
        right: x + bubbleWidth,
        bottom: y + bubbleHeight
      };
      
      // Check if bubbles would overlap
      if (!(newRect.right < existingRect.left || 
            newRect.left > existingRect.right || 
            newRect.bottom < existingRect.top || 
            newRect.top > existingRect.bottom)) {
        // Overlap detected - adjust position
        if (character === 'trump') {
          // Move Trump's bubble to the left
          x = existingRect.left - bubbleWidth - 20;
        } else {
          // Move other character's bubble up or down
          y = existingRect.top - bubbleHeight - 10;
          if (y < 10) y = existingRect.bottom + 10; // If too high, move below
        }
      }
    }
    
    // Keep within game bounds (1200px wide, 800px tall)
    x = Math.max(10, Math.min(x, 1200 - bubbleWidth - 10));
    y = Math.max(10, Math.min(y, 800 - bubbleHeight - 10));
    
    bubble.style.left = x + 'px';
    bubble.style.top = y + 'px';
    
    // Position arrow to point to character
    const arrow = bubble.querySelector('.bubble-arrow');
    const arrowX = pos.x - x - 6; // 6px is half arrow width
    arrow.style.left = Math.max(10, Math.min(arrowX, bubbleWidth - 20)) + 'px';
  }

  tweet(text) {
    // Just show a brief speech bubble instead of a dialog
    this.say(`Tweet: "${text}"`, 'player', 2000);
  }

  async fadeTo(sceneId, gameState, buildScene) {
    this.elFade.style.opacity = '1';
    await new Promise(r => setTimeout(r, gameState.reduced ? 30 : 300));
    gameState.scene = sceneId;
    buildScene();
    this.elFade.style.opacity = '0';
  }

  toggleInventory(gameState) {
    gameState.invOpen = !gameState.invOpen;
    this.elInv.style.display = gameState.invOpen ? 'flex' : 'none';
  }

  closeAllDialogs(gameState) {
    this.elCard.style.display = 'none';
    this.elBubble.style.display = 'none';
    this.elInv.style.display = 'none';
    gameState.invOpen = false;
  }
}