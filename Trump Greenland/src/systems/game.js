import { Scene } from './scene.js';

export class Game {
  constructor({ canvas, locationEl, textboxEl, overlayEl, scenes }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.locationEl = locationEl;
    this.textboxEl = textboxEl;
    this.overlayEl = overlayEl;
    this.width = canvas.width;
    this.height = canvas.height;
    this.lastTime = 0;
    this.pointer = { x: 0, y: 0, down: false, clicked: false };
    this.current = null; // current scene
    this.running = false;
    this.scenes = scenes; // { key: factory(game) }

    this._bindInput();
  }

  _bindInput() {
    const rect = () => this.canvas.getBoundingClientRect();
    this.canvas.addEventListener('mousemove', (e) => {
      const r = rect();
      this.pointer.x = ((e.clientX - r.left) / r.width) * this.width;
      this.pointer.y = ((e.clientY - r.top) / r.height) * this.height;
    });
    this.canvas.addEventListener('mousedown', () => {
      this.pointer.down = true;
    });
    this.canvas.addEventListener('mouseup', () => {
      this.pointer.down = false;
      this.pointer.clicked = true;
    });
  }

  start() {
    if (this.running) return;
    this.running = true;
    requestAnimationFrame((t) => this._loop(t));
  }

  _loop(t) {
    const dt = Math.min(0.05, (t - this.lastTime) / 1000 || 0); // clamp 50ms
    this.lastTime = t;
    if (this.current) this.current.update(dt, this.pointer);
    this._render();
    // reset per-frame click
    this.pointer.clicked = false;
    if (this.running) requestAnimationFrame((nt) => this._loop(nt));
  }

  _render() {
    const c = this.ctx;
    c.clearRect(0, 0, this.width, this.height);
    if (this.current) this.current.render(c);
  }

  loadScene(key) {
    const factory = this.scenes[key];
    if (!factory) throw new Error(`Unknown scene: ${key}`);
    this.current = factory(this);
    this.locationEl.textContent = this.current.title || key;
  }

  say(text, duration = 3) {
    this.textboxEl.textContent = text;
    this.textboxEl.classList.remove('hidden');
    clearTimeout(this._sayTimeout);
    this._sayTimeout = setTimeout(() => {
      this.textboxEl.classList.add('hidden');
    }, duration * 1000);
  }

  openOverlay(node) {
    this.overlayEl.innerHTML = '';
    this.overlayEl.appendChild(node);
    this.overlayEl.classList.remove('hidden');
  }

  closeOverlay() {
    this.overlayEl.classList.add('hidden');
    this.overlayEl.innerHTML = '';
  }
}

