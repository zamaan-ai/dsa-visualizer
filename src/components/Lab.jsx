import { useEffect, useRef } from 'react';
import Icon from './Icon.jsx';

const pct = (v, lo, hi) => `${hi > lo ? ((v - lo) / (hi - lo)) * 100 : 0}%`;

export function Player({ p }) {
  const empty = p.last === 0;
  const done = p.idx >= p.last && !empty;
  const mode = p.playing ? 'Pause' : done ? 'Replay' : 'Play';
  return (
    <div className={`player${empty ? ' idle' : ''}`}>
      <div className="pbtns">
        <button className="icon" onClick={() => p.jump(0)} disabled={empty || p.idx === 0} aria-label="Go to first step" title="First step (Home)"><Icon name="first" /></button>
        <button className="icon" onClick={p.prev} disabled={empty || p.idx === 0} aria-label="Step back" title="Step back (←)"><Icon name="prev" /></button>
        <button className={`play${p.playing ? ' on' : ''}`} onClick={p.toggle} disabled={empty} aria-label={mode} title={`${mode} (Space)`}>
          <Icon name={mode.toLowerCase()} size={20} />
        </button>
        <button className="icon" onClick={p.next} disabled={empty || p.idx >= p.last} aria-label="Step forward" title="Step forward (→)"><Icon name="next" /></button>
        <button className="icon" onClick={() => p.jump(p.last)} disabled={empty || p.idx >= p.last} aria-label="Go to last step" title="Last step (End)"><Icon name="last" /></button>
      </div>
      <div className="ptrack">
        <input className="scrub" type="range" min="0" max={p.last} value={p.idx} disabled={empty} onChange={e => p.jump(+e.target.value)} aria-label="Step position" style={{ '--pct': pct(p.idx, 0, p.last) }} />
        <div className="pmeta">
          <span className="stepno">{empty ? 'Idle' : <>Step <b>{p.idx + 1}</b> of {p.last + 1}</>}</span>
          <label className="speed" title="Playback speed">
            <Icon name="speed" size={16} /><span className="sr">Speed</span>
            <input type="range" min="1" max="100" value={p.speed} onChange={e => p.setSpeed(+e.target.value)} style={{ '--pct': pct(p.speed, 1, 100) }} />
          </label>
        </div>
      </div>
    </div>
  );
}

/* rows: [[label, value], ...]  - the live state of the current step */
export function Inspector({ msg, rows }) {
  return (
    <aside className="panel inspector">
      <div className="ph"><h3>State inspector</h3><span className={`live${msg ? ' on' : ''}`}>{msg ? 'Live' : 'Waiting'}</span></div>
      <p className="msg" aria-live="polite">{msg || 'Run an operation to see each step explained here.'}</p>
      <dl>{rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{String(v)}</dd></div>)}</dl>
    </aside>
  );
}

export function StepLog({ frames, idx, onPick }) {
  const box = useRef(null);
  useEffect(() => {
    const el = box.current && box.current.children[idx];
    if (el) box.current.scrollTop = el.offsetTop - box.current.clientHeight / 2;
  }, [idx]);
  if (frames.length < 2) return null;
  return (
    <div className="panel steplog">
      <div className="ph"><h3>Step log</h3><span className="count">{frames.length} steps</span></div>
      <ol ref={box}>
        {frames.map((f, i) => (
          <li key={i} className={i < idx ? 'past' : i === idx ? 'now' : ''}>
            <button className={i === idx ? 'cur' : ''} onClick={() => onPick(i)} aria-current={i === idx ? 'step' : undefined}>
              <span className="n">{i + 1}</span>{f.msg}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* items: [[className, label], ...] */
export function Legend({ items }) {
  return <div className="legend">{items.map(([c, l]) => <span key={l}><i className={c} />{l}</span>)}</div>;
}

export function Empty({ icon, children }) {
  return <div className="empty"><Icon name={icon} size={28} /><p>{children}</p></div>;
}

export function ErrorText({ text }) { return text ? <p className="error" role="alert">{text}</p> : null; }
