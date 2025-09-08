export class Scene {
  constructor(game, { key, title, bg = '#073251' } = {}) {
    this.game = game;
    this.key = key;
    this.title = title || key;
    this.bg = bg;
    this.objects = []; // clickable items
  }

  add(obj) { this.objects.push(obj); return obj; }

  update(dt, pointer) {
    for (const o of this.objects) if (o.update) o.update(dt);
    if (pointer.clicked) {
      for (let i = this.objects.length - 1; i >= 0; i--) {
        const o = this.objects[i];
        if (o.hitTest && o.hitTest(pointer.x, pointer.y)) {
          if (o.onClick) o.onClick(this.game, this);
          break;
        }
      }
    }
  }

  render(c) {
    c.fillStyle = this.bg;
    c.fillRect(0, 0, this.game.width, this.game.height);
    for (const o of this.objects) if (o.render) o.render(c);
  }
}

export class RectObject {
  constructor({ x, y, w, h, color = '#1a4566', label, onClick }) {
    this.x = x; this.y = y; this.w = w; this.h = h;
    this.color = color; this.label = label; this.onClick = onClick;
  }
  hitTest(px, py) { return px >= this.x && px <= this.x + this.w && py >= this.y && py <= this.y + this.h; }
  render(c) {
    c.fillStyle = this.color;
    c.fillRect(this.x, this.y, this.w, this.h);
    if (this.label) {
      c.fillStyle = '#e6edf3';
      c.font = '16px system-ui';
      c.fillText(this.label, this.x + 8, this.y + 24);
    }
  }
}

export class TrumpAvatar {
  constructor({ x, y }) { this.x = x; this.y = y; this.bob = 0; }
  update(dt) { this.bob += dt; }
  render(c) {
    // Simple placeholder avatar: a suit with a red tie and yellow hair
    const x = this.x, y = this.y;
    // body
    c.fillStyle = '#0a2a45';
    c.fillRect(x - 12, y - 28, 24, 40);
    // head
    c.fillStyle = '#f0c08b';
    c.fillRect(x - 10, y - 48, 20, 20);
    // hair
    c.fillStyle = '#f2cd4d';
    c.fillRect(x - 10, y - 50, 20, 6);
    // tie
    c.fillStyle = '#d7423f';
    c.fillRect(x - 3, y - 10, 6, 12);
  }
}

