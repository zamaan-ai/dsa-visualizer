/* Immutable BST. Frames: { state:tree, hl:[values], visited:[values], msg } */
export const node = (v, l = null, r = null) => ({ v, l, r });
export const insertPure = (t, v) => !t ? node(v) : v < t.v ? { ...t, l: insertPure(t.l, v) } : v > t.v ? { ...t, r: insertPure(t.r, v) } : t;
export function deletePure(t, v) {
  if (!t) return null;
  if (v < t.v) return { ...t, l: deletePure(t.l, v) };
  if (v > t.v) return { ...t, r: deletePure(t.r, v) };
  if (!t.l) return t.r;
  if (!t.r) return t.l;
  let m = t.r; while (m.l) m = m.l;
  return { v: m.v, l: t.l, r: deletePure(t.r, m.v) };
}
export const fromList = arr => arr.reduce(insertPure, null);
export const count = t => t ? 1 + count(t.l) + count(t.r) : 0;
export const height = t => t ? 1 + Math.max(height(t.l), height(t.r)) : 0;

const F = (state, hl, msg, visited = []) => ({ state, hl, msg, visited });

function path(t, v) {
  const p = []; let c = t;
  while (c) { p.push(c); if (v === c.v) break; c = v < c.v ? c.l : c.r; }
  return p;
}
const step = (v, n) => v === n.v ? `${v} equals ${n.v}` : `Compare ${v} with ${n.v}: ${v < n.v ? 'smaller, go left' : 'larger, go right'}`;

export function insertFrames(t, v) {
  if (!t) return [F(insertPure(t, v), [v], `Tree is empty: ${v} becomes the root`)];
  const p = path(t, v), f = p.map(n => F(t, [n.v], step(v, n)));
  if (p[p.length - 1].v === v) return [...f, F(t, [v], `${v} already exists. A BST keeps unique keys, so nothing changes`)];
  return [...f, F(insertPure(t, v), [v], `Empty slot found: inserted ${v}`)];
}
export function searchFrames(t, v) {
  const p = path(t, v), f = p.map(n => F(t, [n.v], step(v, n)));
  const found = p.length > 0 && p[p.length - 1].v === v;
  return [...(f.length ? f : [F(t, [], 'Tree is empty')]), F(t, found ? [v] : [], found ? `Found ${v}` : `${v} is not in the tree`)];
}
export function deleteFrames(t, v) {
  const p = path(t, v), f = p.map(n => F(t, [n.v], step(v, n)));
  const hit = p.length ? p[p.length - 1] : null;
  if (!hit || hit.v !== v) return [...(f.length ? f : [F(t, [], 'Tree is empty')]), F(t, [], `${v} is not in the tree: nothing deleted`)];
  const kind = !hit.l && !hit.r ? 'leaf: removed directly' : !hit.l || !hit.r ? 'one child: the child takes its place' : 'two children: replaced by its in-order successor';
  return [...f, F(deletePure(t, v), [], `Deleted ${v} (${kind})`)];
}
export function traverseFrames(t, kind) {
  if (!t) return [F(t, [], 'Tree is empty')];
  const f = [], out = [];
  const visit = n => { out.push(n.v); f.push(F(t, [n.v], `Visit ${n.v}`, [...out])); };
  const go = n => { if (!n) return; if (kind === 'pre') visit(n); go(n.l); if (kind === 'in') visit(n); go(n.r); if (kind === 'post') visit(n); };
  if (kind === 'level') { const q = [t]; while (q.length) { const n = q.shift(); visit(n); if (n.l) q.push(n.l); if (n.r) q.push(n.r); } } else go(t);
  f.push(F(t, [], `Done. Order: ${out.join(', ')}`, [...out]));
  return [F(t, [], `Start ${kind}-order traversal at the root`), ...f];
}
