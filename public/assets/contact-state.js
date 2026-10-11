export function isQrExpired(expiresAt, now = Date.now()) {
  const deadline = Date.parse(expiresAt);
  return !Number.isFinite(deadline) || now >= deadline;
}
