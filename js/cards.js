/**
 * cards.js — renders repeated sections from window.PORTFOLIO data
 * and wires up project-card 3D tilt.
 */
(function () {
  const data = window.PORTFOLIO;

  function el(tag, attrs = {}, text) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'class') node.className = v;
      else if (k.startsWith('data-')) node.dataset[k.replace('data-', '')] = v;
      else if (k === 'href' || k === 'download') node[k] = v;
      else node.setAttribute(k, v);
    }
    if (text != null) node.textContent = text;
    return node;
  }

  // ----- principles (about section) -----
  const principleList = document.getElementById('principleList');
  if (principleList) {
    data.principles.forEach((p) => {
      const li = el('li');
      li.appendChild(el('h3', {}, p.title));
      li.appendChild(el('p', {}, p.text));
      principleList.appendChild(li);
    });
  }

  // ----- skill matrix -----
  const skillsMatrix = document.getElementById('skillsMatrix');
  if (skillsMatrix) {
    data.skillGroups.forEach((group) => {
      const card = el('div', { class: 'skill-group' });

      const head = el('div', { class: 'skill-group-head' });
      head.appendChild(el('h3', {}, group.title));
      const dots = el('div', { class: 'depth-dots', 'aria-label': 'Working depth: ' + group.depth + ' of 4' });
      dots.appendChild(el('span', { class: 'depth-dots-label' }, 'depth'));
      for (let i = 0; i < 4; i++) {
        const d = el('span', { class: 'depth-dot' + (i < group.depth ? ' on' : '') + (i === group.depth - 1 && group.depth >= 3 ? ' hot' : '') });
        d.title = 'depth ' + (i + 1);
        dots.appendChild(d);
      }
      head.appendChild(dots);
      card.appendChild(head);

      const chips = el('div', { class: 'skill-chips' });
      group.chips.forEach((c, i) => chips.appendChild(el('span', { class: i === 0 ? 'key' : '' }, c)));
      card.appendChild(chips);

      skillsMatrix.appendChild(card);
    });
  }

  // ----- hero summary -----
  const summary = document.getElementById('hero-summary');
  if (summary) summary.textContent = data.identity.summary;

  // ================= 3D tilt =================
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;

  function attachTilt(card) {
    if (reducedMotion || coarsePointer) return;
    let raf = null;
    let rect = null;

    card.addEventListener('pointerenter', () => {
      rect = card.getBoundingClientRect();
      card.style.transition = 'none';
    });

    card.addEventListener('pointermove', (e) => {
      if (!rect) return;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform =
          `rotateX(${(-py * 7).toFixed(2)}deg) rotateY(${(px * 9).toFixed(2)}deg) translateZ(0)`;
      });
    });

    card.addEventListener('pointerleave', () => {
      if (raf) cancelAnimationFrame(raf);
      card.style.transition = 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.3s ease';
      card.style.transform = '';
      rect = null;
    });
  }

  // cert card tilt (same mechanism, lighter)
  const certCard = document.getElementById('certCard');
  if (certCard && !reducedMotion && !coarsePointer) attachTilt(certCard);
})();
