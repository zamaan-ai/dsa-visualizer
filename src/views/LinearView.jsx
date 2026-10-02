import { useState } from 'react';
import { stack, queue, list, CAP } from '../algorithms/linear.js';
import { usePlayer } from '../usePlayer.js';
import { Player, Inspector, StepLog, Legend, Empty } from '../components/Lab.jsx';
import ArrayGenerator from '../components/ArrayGenerator.jsx';

const KINDS = [['stack', 'Stack', 'LIFO'], ['queue', 'Queue', 'FIFO'], ['list', 'Linked list', 'Singly']];

export default function LinearView() {
  const [kind, setKind] = useState('stack');
  const [base, setBase] = useState({ stack: [], queue: [], list: [] });
  const [frames, setFrames] = useState([]);
  const [val, setVal] = useState(7);
  const p = usePlayer(frames);

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
      <div className="col">
        <section className="panel">
          <div className="ph"><h3>Structure</h3></div>
          <div className="chips" role="group" aria-label="Structure">
            {KINDS.map(([k, l, tag]) => (
              <button key={k} className={`chip${k === kind ? ' on' : ''}`} aria-pressed={k === kind} onClick={() => { setKind(k); setFrames([]); }}>
                {l}<small>{tag}</small>
              </button>
            ))}
          </div>
          <div className="row">
            <label>Value <input type="number" value={val} onChange={e => setVal(Number(e.target.value))} /></label>
            {ops.map(([label, fn]) => <button key={label} className="primary" onClick={() => run(fn)}>{label}</button>)}
            <button className="ghost" onClick={() => { setFrames([]); setBase({ ...base, [kind]: [] }); }}>Clear</button>
          </div>
          <details className="fold"><summary>Fill with your own values</summary>
            <ArrayGenerator onApply={load} />
          </details>
        </section>

        <section className="panel stagecard">
          <div className={`stage ${kind}`}>
            {kind === 'stack' && state.length > 0 && (
              <div className="stackbox">
                {[...state].map((v, i) => <div key={i} className={`item ${hl.includes(i) ? 'hl' : ''}`}>{v}{i === state.length - 1 && <em>top</em>}</div>).reverse()}
              </div>
            )}
            {kind === 'queue' && state.length > 0 && (
              <div className="queuebox">
                {state.map((v, i) => (
                  <div key={i} className={`item ${hl.includes(i) ? 'hl' : ''}`}>{v}
                    {i === 0 && <em>front</em>}{i === state.length - 1 && i !== 0 && <em>rear</em>}</div>
                ))}
              </div>
            )}
            {kind === 'list' && state.length > 0 && (
              <div className="listbox">
                {state.map((v, i) => (
                  <span className="lnode" key={i}>
                    <div className={`item ${hl.includes(i) ? 'hl' : ''}`}>{v}{i === 0 && <em>head</em>}</div><span className="arrow">→</span>
                  </span>
                ))}
                <span className="nul">NULL</span>
              </div>
            )}
            {!state.length && <Empty icon="linear">Empty. Use the buttons above to add a value.</Empty>}
          </div>
          <Legend items={[['', 'Element'], ['hl', 'Being touched this step']]} />
          <Player p={p} />
        </section>
      </div>
      <div className="col">
        <Inspector msg={f && f.msg} rows={[...rows, ['Contents', state.length ? state.join(', ') : 'empty']]} />
        <StepLog frames={frames} idx={p.idx} onPick={p.jump} />
      </div>
    </div>
  );
}
