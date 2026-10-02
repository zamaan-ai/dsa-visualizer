import { useEffect, useRef } from 'react';

export function Player({ p }) {
  const empty = p.last === 0;
  return (
    <div className="player">
      <div className="pbtns">
        <button onClick={() => p.jump(0)} disabled={empty || p.idx === 0} aria-label="Go to first step">First</button>
        <button onClick={p.prev} disabled={empty || p.idx === 0}>Step back</button>
        <button className="primary" onClick={p.toggle} disabled={empty}>
          {p.playing ? 'Pause' : p.idx >= p.last && !empty ? 'Replay' : 'Play'}
        </button>
        <button onClick={p.next} disabled={empty || p.idx >= p.last}>Step forward</button>
        <button onClick={() => p.jump(p.last)} disabled={empty || p.idx >= p.last} aria-label="Go to last step">Last</button>
      </div>
      <input className="scrub" type="range" min="0" max={p.last} value={p.idx} disabled={empty} onChange={e => p.jump(+e.target.value)} aria-label="Step position" />
      <div className="pmeta">
        <span className="stepno">Step {p.idx + 1} of {p.last + 1}</span>
        <label>Speed <input type="range" min="1" max="100" value={p.speed} onChange={e => p.setSpeed(+e.target.value)} /></label>
      </div>
    </div>
  );
}

/* rows: [[label, value], ...]  - the live state of the current step */
export function Inspector({ msg, rows }) {
  return (
    <aside className="inspector">
      <h3>State inspector</h3>
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
    <div className="steplog">
      <h3>Step log</h3>
      <ol ref={box}>
        {frames.map((f, i) => (
          <li key={i}><button className={i === idx ? 'cur' : ''} onClick={() => onPick(i)}>{f.msg}</button></li>
        ))}
      </ol>
    </div>
  );
}

export function ErrorText({ text }) { return text ? <p className="error" role="alert">{text}</p> : null; }