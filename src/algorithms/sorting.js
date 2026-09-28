/* Each sort runs once and records a list of "frames" (one per step).
   Frame: { arr, cmp:[i,j], swap:[i,j], pivot, sorted:[...], stats, msg }
   The UI replays frames, so play / pause / step back / scrub come for free. */
function build(input, body) {
  const a = [...input], done = new Set(), steps = [];
  let c = 0, s = 0, w = 0;
  const push = o => steps.push({
    arr: [...a], cmp: [], swap: [], pivot: null, sorted: [...done],
    stats: { comparisons: c, swaps: s, writes: w }, msg: '', ...o,
  });
  const ctx = {
    a,
    note: (msg, o = {}) => push({ msg, ...o }),
    cmp: (i, j, o = {}) => { c++; push({ cmp: [i, j], msg: `Compare a[${i}] = ${a[i]} with a[${j}] = ${a[j]}`, ...o }); },
    swap: (i, j, o = {}) => { [a[i], a[j]] = [a[j], a[i]]; s++; push({ swap: [i, j], msg: `Swap a[${i}] and a[${j}]. Now ${a[i]} and ${a[j]}`, ...o }); },
    write: (k, v, msg, o = {}) => { a[k] = v; w++; push({ swap: [k], msg, ...o }); },
    mark: (...idx) => idx.forEach(i => done.add(i)),
  };
  push({ msg: 'Initial array' });
  body(ctx);
  a.forEach((_, i) => done.add(i));
  push({ msg: 'Array is sorted' });
  return steps;
}

export const SORTS = {
  bubble: {
    name: 'Bubble Sort', best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: 'Yes',
    about: 'Repeatedly swaps adjacent out-of-order pairs. Each pass floats the largest remaining value to the end.',
    run: x => build(x, ({ a, cmp, swap, mark }) => {
      const n = a.length;
      for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        for (let j = 0; j < n - 1 - i; j++) { cmp(j, j + 1); if (a[j] > a[j + 1]) { swap(j, j + 1); swapped = true; } }
        mark(n - 1 - i);
        if (!swapped) break;
      }
    }),
  },
  selection: {
    name: 'Selection Sort', best: 'O(n²)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: 'No',
    about: 'Finds the smallest unsorted value and swaps it into the next position.',
    run: x => build(x, ({ a, cmp, swap, mark }) => {
      for (let i = 0; i < a.length - 1; i++) {
        let m = i;
        for (let j = i + 1; j < a.length; j++) { cmp(j, m, { pivot: m }); if (a[j] < a[m]) m = j; }
        if (m !== i) swap(i, m);
        mark(i);
      }
    }),
  },
  insertion: {
    name: 'Insertion Sort', best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: 'Yes',
    about: 'Grows a sorted prefix by sliding each new value left until it sits in place.',
    run: x => build(x, ({ a, cmp, swap }) => {
      for (let i = 1; i < a.length; i++)
        for (let j = i; j > 0; j--) { cmp(j - 1, j); if (a[j - 1] > a[j]) swap(j - 1, j); else break; }
    }),
  },
  merge: {
    name: 'Merge Sort', best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)', stable: 'Yes',
    about: 'Splits the array in halves, sorts each, then merges the two sorted halves.',
    run: x => build(x, ({ a, cmp, write }) => {
      const ms = (l, r) => {
        if (l >= r) return;
        const m = (l + r) >> 1; ms(l, m); ms(m + 1, r);
        const L = a.slice(l, m + 1), R = a.slice(m + 1, r + 1);
        let i = 0, j = 0, k = l;
        while (i < L.length && j < R.length) {
          cmp(l + i, m + 1 + j, { msg: `Merge [${l}..${r}]: compare ${L[i]} (left) with ${R[j]} (right)` });
          const v = L[i] <= R[j] ? L[i++] : R[j++]; write(k, v, `Write ${v} to a[${k}]`); k++;
        }
        while (i < L.length) { const v = L[i++]; write(k, v, `Copy leftover ${v} to a[${k}]`); k++; }
        while (j < R.length) { const v = R[j++]; write(k, v, `Copy leftover ${v} to a[${k}]`); k++; }
      };
      ms(0, a.length - 1);
    }),
  },
  quick: {
    name: 'Quick Sort', best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)', stable: 'No',
    about: 'Picks the last value as pivot, moves smaller values before it, then sorts each side.',
    run: x => build(x, ({ a, cmp, swap, mark, note }) => {
      const qs = (lo, hi) => {
        if (lo > hi) return;
        if (lo === hi) { mark(lo); return; }
        const p = a[hi]; let i = lo;
        note(`Partition [${lo}..${hi}] with pivot ${p}`, { pivot: hi });
        for (let j = lo; j < hi; j++) {
          cmp(j, hi, { pivot: hi, msg: `Compare a[${j}] = ${a[j]} with pivot ${p}` });
          if (a[j] < p) { if (i !== j) swap(i, j, { pivot: hi }); i++; }
        }
        if (i !== hi) swap(i, hi); else note(`Pivot ${p} already in place`, { pivot: hi });
        mark(i); qs(lo, i - 1); qs(i + 1, hi);
      };
      qs(0, a.length - 1);
    }),
  },
  heap: {
    name: 'Heap Sort', best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)', stable: 'No',
    about: 'Builds a max-heap, then repeatedly moves the largest value to the end and repairs the heap.',
    run: x => build(x, ({ a, cmp, swap, mark, note }) => {
      const sift = (i, n) => {
        for (;;) {
          const l = 2 * i + 1, r = l + 1; let m = i;
          if (l < n) { cmp(l, m); if (a[l] > a[m]) m = l; }
          if (r < n) { cmp(r, m); if (a[r] > a[m]) m = r; }
          if (m === i) return;
          swap(i, m); i = m;
        }
      };
      note('Build a max-heap');
      for (let i = (a.length >> 1) - 1; i >= 0; i--) sift(i, a.length);
      for (let e = a.length - 1; e > 0; e--) { swap(0, e); mark(e); sift(0, e); }
    }),
  },
};
