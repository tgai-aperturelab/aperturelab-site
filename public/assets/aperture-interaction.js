export function initAperture(control, setActive = () => {}) {
  if (!control) return;
  const label = document.querySelector('.aperture-state');
  const fineHover = window.matchMedia('(hover: hover) and (pointer: fine)');
  let hovered = false;
  let latched = false;
  const render = () => {
    const active = hovered || latched;
    control.dataset.active = String(active);
    control.setAttribute('aria-pressed', String(active));
    if (label) label.textContent = active ? 'FOCUS' : 'OPEN';
    setActive(active);
  };
  control.addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse' && fineHover.matches) {
      hovered = true;
      control.dataset.input = 'hover';
      render();
    }
  });
  control.addEventListener('pointerleave', () => { hovered = false; render(); });
  control.addEventListener('click', event => {
    // Desktop uses hover; touch and keyboard toggle the same rigid shutter state.
    if (event.detail === 0 || event.pointerType !== 'mouse' || !fineHover.matches) {
      latched = !latched;
      control.dataset.input = event.detail === 0 ? 'keyboard' : 'touch';
      render();
    }
  });
  control.addEventListener('blur', () => { latched = false; render(); });
  control.addEventListener('keydown', event => {
    if (event.key === 'Escape') { hovered = false; latched = false; render(); }
  });
  fineHover.addEventListener('change', () => { hovered = false; latched = false; render(); });
  render();
}
