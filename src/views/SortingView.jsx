import { useMemo, useState } from 'react';
import { SORTS } from '../algorithms/sorting.js';
import { generate } from '../algorithms/generate.js';
import { usePlayer } from '../usePlayer.js';
import { Player, Inspector, StepLog } from '../components/Lab.jsx';
import ArrayGenerator from '../components/ArrayGenerator.jsx';

export default function SortingView() {
  const [arr, setArr] = useState(() => generate({ kind: 'random', size: 16 }));
  const [key, setKey] = useState('bubble');
  const frames = useMemo(() => SORTS[key].run(arr), [key, arr]);
  const p = usePlayer(frames);
  const f = p.frame, info = SORTS[key];
  const lo = Math.min(...arr), hi = Math.max(...arr), span = hi - lo || 1;
  const cls = i => f.swap.includes(i) ? 'swp' : f.cmp.includes(i) ? 'cmp' : f.pivot === i ? 'pvt' : f.sorted.includes(i) ? 'ok' : '';

  return (
    <div className="grid2">
      <div>
        <ArrayGenerator onApply={setArr} />
        <div className="row">
          <label>Algorithm <select value={key} onChange={e => setKey(e.target.value)}>
            {Object.entries(SORTS).map(([k, s]) => <option key={k} value={k}>{s.name}</option>)}</select></label>
        </div>
        <p className="about">{info.about}</p>
        <table className="cx"><thead><tr><th>Best</th><th>Average</th><th>Worst</th><th>Space</th><th>Stable</th></tr></thead>
          <tbody><tr><td>{info.best}</td><td>{info.avg}</td><td>{info.worst}</td><td>{info.space}</td><td>{info.stable}</td></tr></tbody></table>
        <div className="bars" role="img" aria-label={`Bar chart of array: ${f.arr.join(', ')}`}>
          {f.arr.map((v, i) => (
            <div key={i} className={`bar ${cls(i)}`} style={{ height: `${8 + ((v - lo) / span) * 92}%` }}>
              {arr.length <= 30 && <span>{v}</span>}
            </div>
          ))}
        </div>
        <div className="legend"><i className="cmp" />Comparing <i className="swp" />Swapped or written <i className="pvt" />Pivot or minimum <i className="ok" />In final position</div>
        <Player p={p} />
      </div>
      <div>
        <Inspector msg={f.msg} rows={[
          ['Comparing', f.cmp.length ? f.cmp.map(i => `a[${i}]=${f.arr[i]}`).join(' vs ') : 'none'],
          ['Comparisons so far', f.stats.comparisons],
          ['Swaps so far', f.stats.swaps],
          ['Writes so far', f.stats.writes],
          ['Sorted positions', `${f.sorted.length} of ${f.arr.length}`],
        ]} />
        <div className="cells" aria-label="Array contents">
          {f.arr.map((v, i) => <div key={i} className={`cellbox ${cls(i)}`}><b>{v}</b><small>{i}</small></div>)}
        </div>
        <StepLog frames={frames} idx={p.idx} onPick={p.jump} />
      </div>
    </div>
  );
}