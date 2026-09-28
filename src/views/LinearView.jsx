import { useEffect, useState } from 'react';
import { stack, queue, list, CAP } from '../algorithms/linear.js';
import { usePlayer } from '../usePlayer.js';
import { Player, Inspector, StepLog } from '../components/Lab.jsx';
import ArrayGenerator from '../components/ArrayGenerator.jsx';

export default function LinearView() {
  const [kind, setKind] = useState('stack');
  const [base, setBase] = useState({ stack: [], queue: [], list: [] });
  const [frames, setFrames] = useState([]);
  const [val, setVal] = useState(7);
  const p = usePlayer(frames);
  useEffect(() => setFrames([]), [kind]);

  const f = frames.length ? p.frame : null;
  const state = f ? f.state : base[kind];
  const hl = f ? f.hl : [];

  const run = fn => {
    const fr = fn(base[kind], val);
    setFrames(fr);
    setBase({ ...base, [kind]: fr[fr.length - 1].state });
  };
  const load = arr => { setFrames([]); setBase({ ...base, [kind]: arr.slice(0, CAP) }); };
  const ops = {
    stack: [['Push', stack.push, true], ['Pop', stack.pop]],
    queue: [['Enqueue', queue.enqueue, true], ['Dequeue', queue.dequeue]],
    list: [['Insert at head', list.insertHead, true], ['Insert at tail', list.insertTail, true], ['Remove value', list.remove, true], ['Search', list.search, true]],
  }[kind];

  const rows = {
    stack: [['Size', `${state.length} of ${CAP}`], ['Top', state.length ? state[state.length - 1] : 'empty']],
    queue: [['Size', `${state.length} of ${CAP}`], ['Front', state.length ? state[0] : 'empty'], ['Rear', state.length ? state[state.length - 1] : 'empty']],
    list: [['Length', state.length], ['Head', state.length ? state[0] : 'null'], ['Tail', state.length ? state[state.length - 1] : 'null']],
  }[kind];

  return (
    <div className="grid2">
      <div>
        <div className="row">
          <label>Structure <select value={kind} onChange={e => setKind(e.target.value)}>
            <option value="stack">Stack (LIFO)</option><option value="queue">Queue (FIFO)</option><option value="list">Singly linked list</option></select></label>
          <label>Value <input type="number" value={val} onChange={e => setVal(Number(e.target.value))} /></label>
          {ops.map(([label, fn]) => <button key={label} className="primary" onClick={() => run(fn)}>{label}</button>)}
          <button onClick={() => { setFrames([]); setBase({ ...base, [kind]: [] }); }}>Clear</button>
        </div>
        <details><summary>Fill with your own values</summary>
          <ArrayGenerator onApply={load} />
        </details>

        <div className={`stage ${kind}`}>
          {kind === 'stack' && (
            <div className="stackbox">
              {[...state].map((v, i) => <div key={i} className={`item ${hl.includes(i) ? 'hl' : ''}`}>{v}{i === state.length - 1 && <em>top</em>}</div>).reverse()}
            </div>
          )}
          {kind === 'queue' && (
            <div className="queuebox">
              {state.map((v, i) => (
                <div key={i} className={`item ${hl.includes(i) ? 'hl' : ''}`}>{v}
                  {i === 0 && <em>front</em>}{i === state.length - 1 && i !== 0 && <em>rear</em>}</div>
              ))}
            </div>
          )}
          {kind === 'list' && (
            <div className="listbox">
              {state.map((v, i) => (
                <span className="lnode" key={i}>
                  <div className={`item ${hl.includes(i) ? 'hl' : ''}`}>{v}{i === 0 && <em>head</em>}</div><span className="arrow">→</span>
                </span>
              ))}
              <span className="nul">NULL</span>
            </div>
          )}
          {!state.length && <p className="empty">Empty. Use the buttons above to add a value.</p>}
        </div>
        <Player p={p} />
      </div>
      <div>
        <Inspector msg={f && f.msg} rows={[...rows, ['Contents', state.length ? state.join(', ') : 'empty']]} />
        <StepLog frames={frames} idx={p.idx} onPick={p.jump} />
      </div>
    </div>
  );
}