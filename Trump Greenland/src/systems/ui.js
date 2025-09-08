export function makePanel(title, items) {
  const panel = document.createElement('div');
  panel.className = 'panel';
  const h = document.createElement('h3');
  h.textContent = title;
  panel.appendChild(h);
  for (const it of items) {
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = it.label;
    btn.addEventListener('click', it.onClick);
    panel.appendChild(btn);
  }
  const close = document.createElement('button');
  close.className = 'btn small';
  close.textContent = 'Close';
  close.addEventListener('click', () => panel.dispatchEvent(new CustomEvent('close', { bubbles: true })));
  panel.appendChild(close);
  return panel;
}

