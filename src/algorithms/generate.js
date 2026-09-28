const r = (a, b) => a + Math.floor(Math.random() * (b - a + 1));

/* kind: random | sorted | reversed | nearly | unique */
export function generate({ kind = 'random', size = 16, min = 5, max = 99 }) {
  let a = Array.from({ length: size }, () => r(min, max));
  if (kind === 'sorted' || kind === 'nearly' || kind === 'reversed') a.sort((x, y) => x - y);
  if (kind === 'reversed') a.reverse();
  if (kind === 'nearly') for (let k = 0; k < Math.max(1, size >> 3); k++) {
    const i = r(0, size - 1), j = r(0, size - 1); [a[i], a[j]] = [a[j], a[i]];
  }
  if (kind === 'unique') { const pool = Array.from({ length: 4 }, () => r(min, max)); a = a.map(() => pool[r(0, 3)]); }
  return a;
}

export function parseNumbers(text, { min = 1, max = 60 } = {}) {
  const parts = text.split(/[\s,;]+/).filter(Boolean);
  if (parts.length < min) return { error: `Enter at least ${min} number${min > 1 ? 's' : ''}.` };
  if (parts.length > max) return { error: `Use at most ${max} numbers.` };
  const nums = parts.map(Number);
  if (nums.some(n => !Number.isInteger(n))) return { error: 'Use whole numbers only, separated by commas or spaces.' };
  if (nums.some(n => Math.abs(n) > 9999)) return { error: 'Keep values between -9999 and 9999.' };
  return { arr: nums };
}
