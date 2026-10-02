import { useMemo, useState } from 'react';
import { SORTS } from '../algorithms/sorting.js';
import { generate } from '../algorithms/generate.js';
import { usePlayer } from '../usePlayer.js';
import { useWidth } from '../useWidth.js';
import { Player, Inspector, StepLog, Legend } from '../components/Lab.jsx';
import ArrayGenerator from '../components/ArrayGenerator.jsx';

export default function SortingView() {
  const [arr, setArr] = useState(() => generate({ kind: 'random', size: 16 }));
  const [key, setKey] = useState('bubble');
  const frames = useMemo(() => SORTS[key].run(arr), [key, arr]);
  const p = usePlayer(frames);
  const [barsRef, barsWidth] = useWidth();
  const labels = barsWidth / arr.length >= 22;
  const f = p.frame, info = SORTS[key];
  const lo = Math.min(...arr), hi = Math.max(...arr), span = hi - lo || 1;
  const cls = i => f.swap.includes(i) ? 'swp' : f.cmp.includes(i) ? 'cmp' : f.pivot === i ? 'pvt' : f.sorted.includes(i) ? 'ok' : '';

  return (
    <div className="grid2">
      <div className="col">
        <section className="panel">
          <div className="ph"><h3>Algorithm</h3></div>
          <div className="chips" role="group" aria-label="Algorithm">
            {Object.entries(SORTS).map(([k, s]) => (
              <button key={k} className={`chip${k === key ? ' on' : ''}`} aria-pressed={k === key} onClick={() => setKey(k)}>{s.name.replace(/ Sort$/, '')}</button>
            ))}
          </div>
          <p className="about">{info.about}</p>
          <dl className="cx">
            {[['Best', info.best], ['Average', info.avg], ['Worst', info.worst], ['Space', info.space], ['Stable', info.stable]].map(([k, v]) => (
              <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
            ))}
          </dl>
        </section>
        <section className="panel stagecard">
          <div ref={barsRef} className={`bars${arr.length > 40 ? ' dense' : ''}`} role="img" aria-label={`Bar chart of array: ${f.arr.join(', ')}`}>
            {f.arr.map((v, i) => (
              <div key={i} className={`bar ${cls(i)}`} style={{ height: `${8 + ((v - lo) / span) * 92}%` }}>
                {labels && <span>{v}</span>}
              </div>
            ))}
          </div>
          <Legend items={[['cmp', 'Comparing'], ['swp', 'Swapped or written'], ['pvt', 'Pivot or minimum'], ['ok', 'In final position']]} />
          <Player p={p} />
        </section>
        <ArrayGenerator onApply={setArr} />
      </div>
      <div className="col">
        <div className="stats">
          {[['Comparisons', f.stats.comparisons], ['Swaps', f.stats.swaps], ['Writes', f.stats.writes]].map(([k, v]) => (
            <div key={k}><b>{v}</b><small>{k}</small></div>
          ))}
        </div>
        <Inspector msg={f.msg} rows={[
          ['Comparing', f.cmp.length ? f.cmp.map(i => `a[${i}]=${f.arr[i]}`).join(' vs ') : 'none'],
          ['Sorted positions', `${f.sorted.length} of ${f.arr.length}`],
        ]} />
        <section className="panel">
          <div className="ph"><h3>Memory</h3><span className="count">{f.arr.length} cells</span></div>
          <div className="cells" aria-label="Array contents">
            {f.arr.map((v, i) => <div key={i} className={`cellbox ${cls(i)}`}><b>{v}</b><small>{i}</small></div>)}
          </div>
        </section>
        <StepLog frames={frames} idx={p.idx} onPick={p.jump} />
      </div>
    </div>
  );
}
