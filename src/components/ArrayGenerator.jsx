import { useState } from 'react';
import { generate, parseNumbers } from '../algorithms/generate.js';
import { ErrorText } from './Lab.jsx';

const KINDS = [['random', 'Random'], ['nearly', 'Nearly sorted'], ['reversed', 'Reversed'], ['sorted', 'Already sorted'], ['unique', 'Few unique values']];

export default function ArrayGenerator({ onApply }) {
  const [kind, setKind] = useState('random');
  const [size, setSize] = useState(16);
  const [min, setMin] = useState(5);
  const [max, setMax] = useState(99);
  const [text, setText] = useState('');
  const [err, setErr] = useState('');

  const make = () => {
    if (min > max) return setErr('Min must not be larger than max.');
    setErr(''); onApply(generate({ kind, size, min, max }));
  };
  const custom = () => {
    const r = parseNumbers(text, { min: 2, max: 60 });
    if (r.error) return setErr(r.error);
    setErr(''); onApply(r.arr);
  };
  const num = set => e => set(Number(e.target.value));

  return (
    <div className="panel gen">
      <div className="ph"><h3>Input array</h3></div>
      <div className="row">
        <label>Type <select value={kind} onChange={e => setKind(e.target.value)}>{KINDS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></label>
        <label>Size <input type="number" min="2" max="60" value={size} onChange={e => setSize(Math.max(2, Math.min(60, Number(e.target.value) || 2)))} /></label>
        <label>Min <input type="number" value={min} onChange={num(setMin)} /></label>
        <label>Max <input type="number" value={max} onChange={num(setMax)} /></label>
        <button className="primary" onClick={make}>Generate</button>
      </div>
      <div className="row">
        <label className="grow">Your own values <input type="text" placeholder="e.g. 42, 7, 19, 3, 88" value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && custom()} /></label>
        <button onClick={custom}>Use these values</button>
      </div>
      <ErrorText text={err} />
    </div>
  );
}