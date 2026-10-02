import { useMemo, useState } from 'react';
import { graphFrames, parseEdges, adjacency } from '../algorithms/graph.js';
import { usePlayer } from '../usePlayer.js';
import { Player, Inspector, StepLog, ErrorText, Legend } from '../components/Lab.jsx';

export default function GraphView() {
  const [n, setN] = useState(7);
  const [text, setText] = useState('0-1, 0-2, 1-3, 1-4, 2-5, 2-6, 4-6');
  const [graph, setGraph] = useState({ n: 7, edges: parseEdges('0-1, 0-2, 1-3, 1-4, 2-5, 2-6, 4-6', 7).edges });
  const [start, setStart] = useState(0);
  const [frames, setFrames] = useState([]);
  const [err, setErr] = useState('');
  const p = usePlayer(frames);
  const f = frames.length ? p.frame : null;

  const pts = useMemo(() => Array.from({ length: graph.n }, (_, i) => {
    const a = (2 * Math.PI * i) / graph.n - Math.PI / 2;
    return { x: 200 + 135 * Math.cos(a), y: 165 + 135 * Math.sin(a) };
  }), [graph.n]);
  const adj = useMemo(() => adjacency(graph.n, graph.edges), [graph]);

  const apply = () => {
    if (n < 2 || n > 12) return setErr('Use between 2 and 12 nodes.');
    const r = parseEdges(text, n);
    if (r.error) return setErr(r.error);
    setErr(''); setFrames([]); setGraph({ n, edges: r.edges }); setStart(s => Math.min(s, n - 1));
  };
  const run = kind => setFrames(graphFrames(kind, graph.n, graph.edges, Math.min(start, graph.n - 1)));
  const cls = i => !f ? '' : f.current === i ? 'hl' : f.frontier.includes(i) ? 'fr' : f.visited.includes(i) ? 'ok' : '';

  return (
    <div className="grid2">
      <div className="col">
        <section className="panel">
          <div className="ph"><h3>Graph</h3></div>
          <div className="row">
            <label>Nodes <input type="number" min="2" max="12" value={n} onChange={e => setN(Number(e.target.value))} /></label>
            <label className="grow">Edges <input type="text" value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && apply()} /></label>
            <button onClick={apply}>Update graph</button>
          </div>
          <ErrorText text={err} />
          <div className="row">
            <label>Start node <input type="number" min="0" max={graph.n - 1} value={start} onChange={e => setStart(Math.max(0, Math.min(graph.n - 1, Number(e.target.value))))} /></label>
            <button className="primary" onClick={() => run('bfs')}>Run BFS</button>
            <button className="primary" onClick={() => run('dfs')}>Run DFS</button>
          </div>
        </section>
        <section className="panel stagecard">
          <div className="stage">
            <svg viewBox="0 0 400 330" className="gsvg" role="img" aria-label="Undirected graph">
              {graph.edges.map(([a, b], i) => <line key={i} x1={pts[a].x} y1={pts[a].y} x2={pts[b].x} y2={pts[b].y} className={`edge${f && f.visited.includes(a) && f.visited.includes(b) ? ' ok' : ''}`} />)}
              {pts.map((q, i) => (
                <g key={i}><circle cx={q.x} cy={q.y} r="18" className={`nd ${cls(i)}`} /><text x={q.x} y={q.y + 5} textAnchor="middle" className="ndt">{i}</text></g>
              ))}
            </svg>
          </div>
          <Legend items={[['hl', 'Current'], ['fr', 'In queue or stack'], ['ok', 'Visited']]} />
          <Player p={p} />
        </section>
      </div>
      <div className="col">
        <Inspector msg={f && f.msg} rows={[
          ['Current node', f && f.current !== null ? f.current : 'none'],
          ['Queue or stack', f ? (f.frontier.join(', ') || 'empty') : 'not started'],
          ['Visited (in order)', f ? (f.visited.join(', ') || 'none') : 'not started'],
          ['Adjacency list', adj.map((l, i) => `${i}: ${l.join(',') || '-'}`).join('   ')],
        ]} />
        <StepLog frames={frames} idx={p.idx} onPick={p.jump} />
      </div>
    </div>
  );
}
