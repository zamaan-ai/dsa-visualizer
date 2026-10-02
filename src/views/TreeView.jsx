import { useState } from 'react';
import { fromList, insertFrames, deleteFrames, searchFrames, traverseFrames, count, height } from '../algorithms/bst.js';
import { usePlayer } from '../usePlayer.js';
import { Player, Inspector, StepLog } from '../components/Lab.jsx';
import ArrayGenerator from '../components/ArrayGenerator.jsx';

const W = 46, H = 64;
function layout(t) {
  const pos = new Map(); let x = 0, depth = 0;
  (function go(n, d) { if (!n) return; go(n.l, d + 1); pos.set(n.v, { x: x++, y: d }); go(n.r, d + 1); depth = Math.max(depth, d); })(t, 0);
  return { pos, cols: x, depth };
}
function edges(n, out = []) { if (!n) return out; [n.l, n.r].forEach(c => { if (c) { out.push([n.v, c.v]); edges(c, out); } }); return out; }

export default function TreeView() {
  const [base, setBase] = useState(() => fromList([50, 30, 70, 20, 40, 60, 80]));
  const [frames, setFrames] = useState([]);
  const [val, setVal] = useState(65);
  const p = usePlayer(frames);
  const f = frames.length ? p.frame : null;
  const tree = f ? f.state : base, hl = f ? f.hl : [], seen = f ? f.visited : [];

  const run = fn => { const fr = fn(base, val); setFrames(fr); setBase(fr[fr.length - 1].state); };
  const trav = k => { const fr = traverseFrames(base, k); setFrames(fr); };
  const load = arr => { setFrames([]); setBase(fromList(arr)); };

  const { pos, cols, depth } = layout(tree);
  const width = Math.max(cols * W + 20, 320), hgt = (depth + 1) * H + 30;
  const at = v => ({ x: pos.get(v).x * W + W / 2 + 10, y: pos.get(v).y * H + 30 });

  return (
    <div className="grid2">
      <div>
        <div className="row">
          <label>Value <input type="number" value={val} onChange={e => setVal(Number(e.target.value))} /></label>
          <button className="primary" onClick={() => run(insertFrames)}>Insert</button>
          <button onClick={() => run(deleteFrames)}>Delete</button>
          <button onClick={() => { setFrames(searchFrames(base, val)); }}>Search</button>
        </div>
        <div className="row">
          Traverse:
          {[['in', 'In-order'], ['pre', 'Pre-order'], ['post', 'Post-order'], ['level', 'Level-order']].map(([k, l]) => <button key={k} onClick={() => trav(k)}>{l}</button>)}
        </div>
        <details><summary>Build from your own values</summary><ArrayGenerator onApply={load} /></details>
        <div className="stage treewrap">
          {tree ? (
            <svg viewBox={`0 0 ${width} ${hgt}`} width={width} height={hgt} className="tsvg" style={{ minWidth: Math.min(width, cols * 30 + 20) }} role="img" aria-label="Binary search tree">
              {edges(tree).map(([a, b]) => <line key={`${a}-${b}`} x1={at(a).x} y1={at(a).y} x2={at(b).x} y2={at(b).y} className="edge" />)}
              {[...pos.keys()].map(v => (
                <g key={v}>
                  <circle cx={at(v).x} cy={at(v).y} r="17" className={`nd ${hl.includes(v) ? 'hl' : seen.includes(v) ? 'ok' : ''}`} />
                  <text x={at(v).x} y={at(v).y + 5} textAnchor="middle" className="ndt">{v}</text>
                </g>
              ))}
            </svg>
          ) : <p className="empty">The tree is empty. Insert a value to create the root.</p>}
        </div>
        <Player p={p} />
      </div>
      <div>
        <Inspector msg={f && f.msg} rows={[
          ['Nodes', count(tree)], ['Height', height(tree)], ['Root', tree ? tree.v : 'null'],
          ['Highlighted', hl.length ? hl.join(', ') : 'none'],
          ['Traversal output', seen.length ? seen.join(', ') : 'none yet'],
        ]} />
        <StepLog frames={frames} idx={p.idx} onPick={p.jump} />
      </div>
    </div>
  );
}