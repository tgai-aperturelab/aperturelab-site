import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { isQrExpired } from '../public/assets/contact-state.js';
const config = JSON.parse(fs.readFileSync(new URL('../site.config.json', import.meta.url)));
test('QR remains available until the exact Beijing-time expiry', () => {
  assert.equal(isQrExpired(config.contact.qrExpiresAt, Date.parse('2026-09-26T23:59:59.999+08:00')), false);
  assert.equal(isQrExpired(config.contact.qrExpiresAt, Date.parse('2026-09-27T00:00:00+08:00')), true);
  assert.equal(isQrExpired(config.contact.qrExpiresAt, Date.parse('2026-09-26T16:00:00Z')), true);
});
test('an invalid QR date never advertises the QR as valid', () => {
  assert.equal(isQrExpired('not-a-date'), true);
});
