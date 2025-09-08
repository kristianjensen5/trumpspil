// Scene Management
export class SceneManager {
  constructor() {
    this.elScene = document.getElementById('scene');
    this.elWorld = document.getElementById('world');
    this.HS = []; // Hotspots array
  }

  clearWorld() {
    this.elWorld.innerHTML = '';
    this.HS.length = 0;
  }

  makeHotspot(x, y, el, hint, onInteract, id) {
    const wrap = document.createElement('div');
    wrap.className = 'hs';
    wrap.style.left = `${x}px`;
    wrap.style.bottom = `${y}px`;
    
    const h = document.createElement('div');
    h.className = 'hint';
    h.textContent = hint;
    
    wrap.appendChild(el);
    wrap.appendChild(h);
    this.elWorld.appendChild(wrap);
    
    const box = {
      id: (id || hint),
      x, y,
      w: el.offsetWidth || 40,
      h: el.offsetHeight || 20,
      el: wrap,
      hint: h,
      near: false,
      onInteract
    };
    this.HS.push(box);
    return box;
  }

  buildGreenland(gameState, player, ui) {
    // Mountains/Icebergs - spread across viewport
    const mountains = [
      { className: 'berg small', left: '100px' },
      { className: 'berg', left: '400px' },
      { className: 'berg small', left: '800px' },
      { className: 'berg small', left: '1000px' }
    ];
    
    mountains.forEach(mountain => {
      const berg = document.createElement('div');
      berg.className = mountain.className;
      berg.style.left = mountain.left;
      this.elWorld.appendChild(berg);
    });

    // Mine with flag claiming
    const mine = document.createElement('div');
    mine.className = 'mine';
    let flagPlaced = false;
    
    this.makeHotspot(520, 140, mine, 'Space: Claim site', async () => {
      if (flagPlaced) return ui.say('Already claimed!', 'player');
      
      // Just do it immediately - no confirmation needed
      const f = document.createElement('div');
      f.className = 'flag';
      mine.appendChild(f);
      flagPlaced = true;
      gameState.flags++;
      ui.say('This is American land now!', 'player');
    }, 'mine');

    // Phone removed - Trump now carries it

    // Decorative rock
    const rock = document.createElement('div');
    rock.className = 'rock';
    this.makeHotspot(520, 140, rock, 'A fine rock', () => 
      ui.say('Very fine rock. The best.', 'player'), 'rock');

    // Bear interaction
    const bear = document.createElement('div');
    bear.className = 'bear';
    bear.innerHTML = `
      <div class="bear-legs"></div>
      <div class="bear-snout"></div>
    `;
    const updateBear = () => bear.classList.toggle('down', gameState.bearDown);
    
    this.makeHotspot(660, 140, bear, 
      gameState.nonViolent ? 'Space: Take selfie' : 'Space: Don\'t!', () => {
        if (gameState.nonViolent) {
          ui.say('Cheeeeese! 📸', 'player');
        } else {
          gameState.bearDown = !gameState.bearDown;
          updateBear();
          ui.say(gameState.bearDown ? 'Bang! (totally legal)' : 'Bear recovers…', 'player');
        }
      }, 'bear');
    updateBear();

    // Mette (Danish PM)
    const mette = document.createElement('div');
    mette.className = 'mette';
    this.makeHotspot(950, 140, mette, 'Space: Talk', () => {
      // Mette speaks first
      if (gameState.flags === 0 && !gameState.hasTweeted) {
        ui.say('Greenland is not for sale.', 'mette', 1800);
      } else if (gameState.flags > 0 && !gameState.hasTweeted) {
        ui.say('Seriously, stop planting flags.', 'mette', 1800);
      } else if (gameState.hasTweeted) {
        ui.say('Please stop tweeting about our island.', 'mette', 2000);
      }
      
      // Then Trump responds
      setTimeout(() => {
        if (gameState.player.trophy) {
          ui.say('Look at this beautiful trophy. Everyone loves me!', 'player');
        } else if (gameState.player.cap) {
          ui.say('Nasty... but we\'ll make Greenland great again!', 'player');
        } else {
          ui.say('Awful woman!', 'player');
        }
      }, 1200);
    }, 'mette');

    // Helicopter for scene transition
    const heli = document.createElement('div');
    heli.className = 'heli';
    this.makeHotspot(1050, 140, heli, 'Space: Helicopter', () => {
      ui.elCard.innerHTML = `
        <div style="font-weight:700;margin-bottom:6px">Helikopter</div>
        <div>1 = Bliv · 2 = Flyv til Oval Office</div>
        <div class="choices" style="margin-top:10px">
          <button class="btn" id="b1">1</button>
          <button class="btn" id="b2">2</button>
        </div>`;
      ui.elCard.style.display = 'block';
      
      const close = () => ui.elCard.style.display = 'none';
      document.getElementById('b1').onclick = close;
      document.getElementById('b2').onclick = () => {
        close();
        ui.fadeTo('OVAL', gameState, () => this.buildScene(gameState, player, ui));
      };
      
      const key = (e) => {
        if (e.key === '1') close();
        if (e.key === '2') {
          close();
          ui.fadeTo('OVAL', gameState, () => this.buildScene(gameState, player, ui));
        }
        if (e.key === 'Escape') close();
      };
      window.addEventListener('keydown', key, { once: true });
    }, 'heli');

    // Create player
    player.create(this.elWorld, gameState);
  }

  buildOvalOffice(gameState, player, ui) {
    // Background elements
    const elements = [
      { className: 'oval-bg' },
      { className: 'window' },
      { className: 'flagL' },
      { className: 'flagR' },
      { className: 'desk' }
    ];
    
    elements.forEach(element => {
      const el = document.createElement('div');
      el.className = element.className;
      this.elWorld.appendChild(el);
    });

    // Desk phone removed - Trump carries his phone

    // Exit to Greenland
    const exit = document.createElement('div');
    exit.className = 'rock';
    this.makeHotspot(1000, 160, exit, 'Space: Fly back', () => 
      ui.fadeTo('GL', gameState, () => this.buildScene(gameState, player, ui)), 'back');

    // Create player at desk
    player.create(this.elWorld, gameState);
    gameState.player.x = 520;
  }

  buildScene(gameState, player, ui) {
    this.clearWorld();
    if (gameState.scene === 'GL') {
      this.buildGreenland(gameState, player, ui);
    } else {
      this.buildOvalOffice(gameState, player, ui);
    }
  }

  findNearestHotspot(gameState) {
    const px = gameState.player.x + 12;
    const py = 160;
    let best = null;
    let bestd = 1e9;
    
    for (const h of this.HS) {
      const cx = h.x + h.w / 2;
      const cy = h.y + h.h / 2;
      const dx = Math.abs(cx - px);
      const dy = Math.abs(cy - py);
      const d = Math.hypot(dx, dy);
      const near = d < 90;
      
      h.el.classList.toggle('near', near);
      if (near && d < bestd) {
        best = h;
        bestd = d;
      }
    }
    return best;
  }

  updateCamera(gameState) {
    // Fixed camera - no scrolling, show all objects at once
    this.elWorld.style.left = '0px';
  }
}