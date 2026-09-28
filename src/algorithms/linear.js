/* Every operation returns frames: { state:[...], hl:[indices], msg }.
   The last frame's state is the new structure. */
export const CAP = 10;
const F = (state, hl, msg) => ({ state, hl, msg });

export const stack = {
  push: (s, v) => s.length >= CAP
    ? [F(s, [s.length - 1], `Stack overflow: capacity is ${CAP}. Pop a value first.`)]
    : [F(s, [], `push(${v}): capacity check ${s.length}/${CAP} passes`), F([...s, v], [s.length], `Placed ${v} on top. Top index is now ${s.length}`)],
  pop: s => !s.length
    ? [F(s, [], 'Stack underflow: nothing to pop. Push a value first.')]
    : [F(s, [s.length - 1], `pop(): top value is ${s[s.length - 1]}`), F(s.slice(0, -1), [], `Removed ${s[s.length - 1]} from the top`)],
};

export const queue = {
  enqueue: (q, v) => q.length >= CAP
    ? [F(q, [q.length - 1], `Queue full: capacity is ${CAP}. Dequeue a value first.`)]
    : [F(q, [], `enqueue(${v}): capacity check ${q.length}/${CAP} passes`), F([...q, v], [q.length], `Added ${v} at the rear`)],
  dequeue: q => !q.length
    ? [F(q, [], 'Queue is empty: nothing to dequeue. Enqueue a value first.')]
    : [F(q, [0], `dequeue(): front value is ${q[0]}`), F(q.slice(1), [], `Removed ${q[0]} from the front`)],
};

const walk = (l, stop) => {
  const f = [];
  for (let i = 0; i < l.length; i++) {
    f.push(F(l, [i], `Visit node ${i} (value ${l[i]})`));
    if (stop(l[i])) return { f, at: i };
  }
  return { f, at: -1 };
};

export const list = {
  insertHead: (l, v) => [F(l, l.length ? [0] : [], `insertHead(${v}): new node will point to the old head`), F([v, ...l], [0], `${v} is now the head`)],
  insertTail: (l, v) => {
    const { f } = walk(l, () => false);
    return [...f, F([...l, v], [l.length], `Reached the end: linked ${v} after the last node`)];
  },
  remove: (l, v) => {
    const { f, at } = walk(l, x => x === v);
    if (at < 0) return [...f, F(l, [], `${v} is not in the list: nothing removed`)];
    return [...f, F(l.filter((_, i) => i !== at), [], `Found ${v} at node ${at}: unlinked it`)];
  },
  search: (l, v) => {
    const { f, at } = walk(l, x => x === v);
    return [...f, F(l, at >= 0 ? [at] : [], at >= 0 ? `Found ${v} at node ${at}` : `${v} is not in the list (${l.length} nodes checked)`)];
  },
};
