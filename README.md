# DSA Visualizer

An interactive web app that demonstrates sorting algorithms and linear and non-linear data structures in real time, with step-by-step state inspection.

**Built with:** React 18 · Vite · CSS3 · JavaScript (ES modules)

## What it does

| Area | Included |
|---|---|
| Sorting | Bubble, Selection, Insertion, Merge, Quick, Heap. Live bar chart, comparison / swap / write counters, and a complexity table (best, average, worst, space, stable) |
| Linear structures | Stack (push, pop), Queue (enqueue, dequeue), Singly linked list (insert head, insert tail, remove value, search). Overflow and underflow are handled and explained |
| Non-linear structures | Binary search tree (insert, delete, search, in / pre / post / level-order traversal) and an undirected graph (BFS and DFS) |

### Step-by-step state inspection

Every algorithm and operation is recorded as a list of **frames** before it is shown. That gives you full control over playback:

- Play, pause, replay, step back, step forward, jump to first or last step
- A scrubber to drag to any step, and a speed slider
- A **state inspector** panel that explains the current step in words and shows live values (comparisons, swaps, sorted positions, top / front / head, tree height, queue or stack contents, visited nodes, adjacency list)
- A clickable **step log**: click any line to jump straight to that step

### Custom array generation

- Generate by type: random, nearly sorted, reversed, already sorted, or few unique values
- Choose size (2 to 60) and the minimum and maximum value
- Or type your own values, for example `42, 7, 19, 3, 88` (whole numbers from -9999 to 9999, separated by commas or spaces)
- The same generator can fill the stack, queue, or linked list, and build a BST
- Invalid input shows a clear message instead of failing silently

### Graph input

Choose 2 to 12 nodes and type edges as `0-1, 0-2, 1-3`. Pick a start node and run BFS or DFS.

## Getting started

Requires Node.js 18 or newer.

```bash
npm install
npm run dev        # open the URL that Vite prints (usually http://localhost:5173)
```

Other commands:

```bash
npm run build      # production build in dist/
npm run preview    # serve the production build locally
npm test           # run the algorithm tests (no install needed for these)
```

## Project structure

```
src/
  algorithms/        Pure logic, no React. Fully unit-tested.
    sorting.js       Sorting algorithms that record frames
    generate.js      Array generator and input parser
    linear.js        Stack, queue, linked list operations
    bst.js           Binary search tree operations and traversals
    graph.js         Edge parser, BFS and DFS
  components/
    Lab.jsx          Player controls, State inspector, Step log
    ArrayGenerator.jsx
  views/             One view per topic (Sorting, Linear, Tree, Graph)
  usePlayer.js       Hook that replays frames (play, pause, step, scrub)
  App.jsx, main.jsx, styles.css
tests/algorithms.test.js
```

## How it works

1. An algorithm runs to completion once and returns an array of frames, for example `{ arr, cmp, swap, sorted, stats, msg }`.
2. The `usePlayer` hook walks through those frames on a timer, or when you step manually.
3. A view draws whatever frame is current. Because playback is just an index into a list, stepping backwards and scrubbing cost nothing.

## Adding your own sorting algorithm

In `src/algorithms/sorting.js`, add an entry to `SORTS`. Use the helpers `cmp`, `swap`, `write`, `mark`, and `note`. Each helper records one frame:

```js
shell: {
  name: 'My Sort', best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: 'No',
  about: 'One sentence describing the idea.',
  run: x => build(x, ({ a, cmp, swap }) => {
    // your loops here: call cmp(i, j) to compare, swap(i, j) to swap
  }),
},
```

It appears in the dropdown automatically.

## Testing

`npm test` checks that every sort produces a correctly sorted result on random, duplicate, negative, sorted, and reversed inputs; BST insert / delete / traversal orders; stack, queue, and list operations including overflow and underflow; graph BFS / DFS order; and input validation.

## Notes and limits

- Arrays are limited to 60 values, stack and queue to 10 items, and graphs to 12 nodes, so every frame stays readable.
- The BST stores unique keys. Inserting a duplicate is explained in the inspector and ignored.
- The BST does not self-balance (it is a plain BST, not AVL or red-black).
