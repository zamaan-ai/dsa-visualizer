import test from 'node:test';
import assert from 'node:assert/strict';
import { SORTS } from '../src/algorithms/sorting.js';
import { generate, parseNumbers } from '../src/algorithms/generate.js';
import { fromList, insertFrames, deleteFrames, traverseFrames, searchFrames } from '../src/algorithms/bst.js';
import { stack, queue, list } from '../src/algorithms/linear.js';
import { graphFrames, parseEdges } from '../src/algorithms/graph.js';

const inputs = [[5, 2, 9, 1, 5, 6], [3, 3, 3], [-4, 10, 0, -4, 7], [1, 2, 3, 4], [9, 8, 7, 6, 5], [2, 1],
  ...['random', 'nearly', 'reversed', 'unique', 'sorted'].map(kind => generate({ kind, size: 40, min: -50, max: 50 }))];

for (const [key, s] of Object.entries(SORTS)) {
  test(`${key} sorts correctly and records valid frames`, () => {
    for (const inp of inputs) {
      const f = s.run(inp), last = f[f.length - 1];
      assert.deepEqual(last.arr, [...inp].sort((a, b) => a - b));
      assert.deepEqual(f[0].arr, inp);
      assert.equal(last.sorted.length, inp.length);
      assert.ok(f.every(x => x.arr.length === inp.length));
    }
  });
}

test('parseNumbers validates input', () => {
  assert.deepEqual(parseNumbers('4, 2  9;1').arr, [4, 2, 9, 1]);
  assert.ok(parseNumbers('4, x').error);
  assert.ok(parseNumbers('4.5, 2').error);
  assert.ok(parseNumbers('4', { min: 2 }).error);
});

const inorder = t => t ? [...inorder(t.l), t.v, ...inorder(t.r)] : [];
test('BST insert, search, delete, traversals', () => {
  let t = fromList([50, 30, 70, 20, 40, 60, 80]);
  assert.deepEqual(traverseFrames(t, 'in').at(-1).visited, [20, 30, 40, 50, 60, 70, 80]);
  assert.deepEqual(traverseFrames(t, 'pre').at(-1).visited, [50, 30, 20, 40, 70, 60, 80]);
  assert.deepEqual(traverseFrames(t, 'post').at(-1).visited, [20, 40, 30, 60, 80, 70, 50]);
  assert.deepEqual(traverseFrames(t, 'level').at(-1).visited, [50, 30, 70, 20, 40, 60, 80]);
  t = insertFrames(t, 65).at(-1).state; assert.deepEqual(inorder(t), [20, 30, 40, 50, 60, 65, 70, 80]);
  t = deleteFrames(t, 50).at(-1).state; assert.deepEqual(inorder(t), [20, 30, 40, 60, 65, 70, 80]);
  t = deleteFrames(t, 999).at(-1).state; assert.equal(inorder(t).length, 7);
  assert.match(searchFrames(t, 65).at(-1).msg, /Found/);
  assert.match(searchFrames(t, 1).at(-1).msg, /not in/);
});

test('stack, queue and list operations', () => {
  let s = stack.push([], 1).at(-1).state; s = stack.push(s, 2).at(-1).state;
  assert.deepEqual(stack.pop(s).at(-1).state, [1]);
  assert.match(stack.pop([]).at(-1).msg, /underflow/);
  assert.match(stack.push(Array(10).fill(0), 1).at(-1).msg, /overflow/);
  let q = queue.enqueue([], 1).at(-1).state; q = queue.enqueue(q, 2).at(-1).state;
  assert.deepEqual(queue.dequeue(q).at(-1).state, [2]);
  let l = list.insertTail([], 5).at(-1).state; l = list.insertHead(l, 4).at(-1).state;
  assert.deepEqual(l, [4, 5]);
  assert.deepEqual(list.remove(l, 5).at(-1).state, [4]);
  assert.match(list.search(l, 9).at(-1).msg, /not in/);
});

test('graph BFS and DFS orders', () => {
  const { edges } = parseEdges('0-1,0-2,1-3,1-4,2-5', 6);
  assert.deepEqual(graphFrames('bfs', 6, edges, 0).at(-1).visited, [0, 1, 2, 3, 4, 5]);
  assert.deepEqual(graphFrames('dfs', 6, edges, 0).at(-1).visited, [0, 1, 3, 4, 2, 5]);
  assert.ok(parseEdges('0-9', 6).error);
  assert.ok(parseEdges('a-b', 6).error);
});
