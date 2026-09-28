export function parseEdges(text, n) {
  const edges = [];
  for (const t of text.split(/[\s,;]+/).filter(Boolean)) {
    const m = t.match(/^(\d+)-(\d+)$/);
    if (!m) return { error: `"${t}" is not an edge. Write edges like 0-1, separated by commas.` };
    const a = +m[1], b = +m[2];
    if (a >= n || b >= n) return { error: `Edge ${t} uses a node outside 0 to ${n - 1}.` };
    if (a !== b) edges.push([a, b]);
  }
  return { edges };
}
export function adjacency(n, edges) {
  const adj = Array.from({ length: n }, () => []);
  edges.forEach(([a, b]) => { if (!adj[a].includes(b)) adj[a].push(b); if (!adj[b].includes(a)) adj[b].push(a); });
  adj.forEach(l => l.sort((x, y) => x - y));
  return adj;
}
/* Frame: { current, frontier, visited, msg } */
export function graphFrames(kind, n, edges, start) {
  const adj = adjacency(n, edges), visited = [], frames = [];
  const F = (current, frontier, msg) => frames.push({ current, frontier: [...frontier], visited: [...visited], msg });
  if (kind === 'bfs') {
    const q = [start], seen = new Set([start]);
    F(null, q, `Start BFS at node ${start}: put it in the queue`);
    while (q.length) {
      const u = q.shift(); visited.push(u); F(u, q, `Dequeue ${u} and visit it`);
      for (const v of adj[u]) {
        if (seen.has(v)) F(u, q, `Neighbour ${v} already seen: skip`);
        else { seen.add(v); q.push(v); F(u, q, `Neighbour ${v} is new: enqueue it`); }
      }
    }
  } else {
    const stack = [];
    const go = u => {
      stack.push(u); visited.push(u); F(u, stack, `Visit ${u} (depth ${stack.length})`);
      for (const v of adj[u]) {
        if (visited.includes(v)) F(u, stack, `Neighbour ${v} already visited: skip`);
        else { F(u, stack, `Go deeper to unvisited neighbour ${v}`); go(v); }
      }
      stack.pop(); F(u, stack, `All neighbours of ${u} done: backtrack`);
    };
    go(start);
  }
  F(null, [], `Finished. Visit order: ${visited.join(', ')}`);
  return frames;
}
