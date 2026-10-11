import contact from './contact-config.js';
import {initProjects} from './projects.js?v=portal-v4';
initProjects(document.querySelector('#projects'));
import {initMembers} from './members.js?v=members-v3-20261011';
initMembers(document.querySelector('#members'));
import { isQrExpired } from './contact-state.js';
import { initAperture } from './aperture-interaction.js';
import { initIrisAnimator } from './iris-animation.js?v=logo-rigid-20261011';

const apertureControl=document.querySelector('.aperture-control');
if(apertureControl)initAperture(apertureControl,initIrisAnimator(apertureControl.querySelector('.aperture-svg')).setActive);

const header = document.querySelector('.site-header');
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');
nav.querySelectorAll('a').forEach(a=>{if(new URL(a.href).pathname===location.pathname)a.setAttribute('aria-current','page');});
header.classList.add('menu-enabled');
menu.hidden = false;
const closeMenu = () => {
  menu.setAttribute('aria-expanded', 'false');
  menu.querySelector('.sr-only').textContent = '打开导航';
  nav.dataset.open = 'false';
  document.body.classList.remove('menu-open');
};
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  menu.querySelector('.sr-only').textContent = open ? '关闭导航' : '打开导航';
  nav.dataset.open = String(open);
  document.body.classList.toggle('menu-open', open);
});
nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); }
});
document.addEventListener('click', event => { if (!header.contains(event.target)) closeMenu(); });
window.matchMedia('(max-width: 680px)').addEventListener('change', closeMenu);

const copyButton = document.querySelector('.copy-button');
const feedback = document.querySelector('.copy-feedback');
if(copyButton)copyButton.hidden = false;
copyButton?.addEventListener('click', async () => {
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(contact.phone);
    feedback.textContent = '号码已复制。';
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(document.querySelector('.phone'));
    selection.removeAllRanges();
    selection.addRange(range);
    feedback.textContent = '请长按或按 Ctrl / ⌘ + C 复制已选中的号码。';
  }
});

let expiryTimer;
function updateQr() {
  if(!document.querySelector('.qr-active'))return;
  clearTimeout(expiryTimer);
  const expired = isQrExpired(contact.qrExpiresAt);
  document.querySelector('.qr-active').hidden = expired;
  document.querySelector('.qr-expired').hidden = !expired;
  if (!expired) {
    // Recheck at the deadline even when the visitor leaves this page open.
    expiryTimer = setTimeout(updateQr, Math.min(Date.parse(contact.qrExpiresAt) - Date.now(), 2147483647));
  }
}
updateQr();
document.addEventListener('visibilitychange', () => { if (!document.hidden) updateQr(); });
