import { Scene, RectObject, TrumpAvatar } from '../systems/scene.js';
import { makePanel } from '../systems/ui.js';

export function createNuukScene(game) {
  const scene = new Scene(game, { key: 'nuuk', title: 'Nuuk – Harbor', bg: '#0a3558' });

  // Background props
  scene.add(new RectObject({ x: 40, y: 360, w: 880, h: 80, color: '#0d4d7d', label: 'Arctic Sea' }));
  scene.add(new RectObject({ x: 60, y: 300, w: 200, h: 60, color: '#184e77', label: 'Dock' }));

  // Helicopter pad
  scene.add(new RectObject({
    x: 700, y: 280, w: 180, h: 90, color: '#1a6aa3', label: 'Helicopter',
    onClick: (game) => {
      const panel = makePanel('Choose Destination', [
        { label: 'Ice Field', onClick: () => { game.closeOverlay(); game.loadScene('icefield'); game.say('Flying to the Ice Field…'); } },
      ]);
      panel.addEventListener('close', () => game.closeOverlay());
      game.openOverlay(panel);
    }
  }));

  // A few interactable current-affairs-ish objects (placeholder text)
  scene.add(new RectObject({
    x: 320, y: 260, w: 140, h: 80, color: '#205a86', label: 'News Stand',
    onClick: (game) => game.say('Headlines: Arctic policy, rare earths, climate talks.')
  }));

  scene.add(new RectObject({
    x: 120, y: 220, w: 150, h: 70, color: '#2a6f9e', label: 'Local Office',
    onClick: (game) => game.say('Meeting scheduled with local officials.')
  }));

  // Trump avatar as a visual anchor
  scene.add(new TrumpAvatar({ x: 130, y: 340 }));

  return scene;
}

