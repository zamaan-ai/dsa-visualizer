import { useEffect, useState } from 'react';
import SortingView from './views/SortingView.jsx';
import LinearView from './views/LinearView.jsx';
import TreeView from './views/TreeView.jsx';
import GraphView from './views/GraphView.jsx';
import Icon, { Logo } from './components/Icon.jsx';

const TABS = [
  { k: 'sort', label: 'Sorting', short: 'Sorting', View: SortingView,
    blurb: 'Six classic sorts, frame by frame. Watch every comparison, swap and write as the array settles into order.' },
  { k: 'linear', label: 'Linear structures', short: 'Linear', View: LinearView,
    blurb: 'Push, pop, enqueue and walk pointers. See how stacks, queues and linked lists grow and shrink.' },
  { k: 'tree', label: 'Binary search tree', short: 'Tree', View: TreeView,
    blurb: 'Insert, delete and search on a tree that lays itself out, then replay any of the four traversals.' },
  { k: 'graph', label: 'Graph traversal', short: 'Graph', View: GraphView,
    blurb: 'Draw an undirected graph and trace how breadth-first and depth-first search spread from a start node.' },
];

const fromHash = () => {
  const k = window.location.hash.slice(1);
  return TABS.some(t => t.k === k) ? k : 'sort';
};

function useTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'dark');
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('theme', theme); } catch { /* storage unavailable */ }
  }, [theme]);
  return [theme, () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))];
}

export default function App() {
  const [tab, setTab] = useState(fromHash);
  const [theme, toggleTheme] = useTheme();

  useEffect(() => {
    const onHash = () => setTab(fromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const i = TABS.findIndex(t => t.k === tab);
  const { View, label, blurb } = TABS[i];
  return (
    <>
      <header className="top">
        <a className="brand" href="#sort" aria-label="DSA Visualizer home">
          <Logo />
          <span><b>DSA Visualizer</b><small>Step-through algorithm lab</small></span>
        </a>
        <nav aria-label="Topics" style={{ '--i': i }}>
          <span className="pill" aria-hidden="true" />
          {TABS.map(t => (
            <a key={t.k} href={`#${t.k}`} className={t.k === tab ? 'on' : ''} aria-current={t.k === tab ? 'page' : undefined}>
              <Icon name={t.k} /><span>{t.short}</span>
            </a>
          ))}
        </nav>
        <button className="theme icon" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} title="Toggle theme">
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
        </button>
      </header>
      <main>
        <section className="hero" key={tab}>
          <span className="eyebrow">{String(i + 1).padStart(2, '0')} <i>/</i> {String(TABS.length).padStart(2, '0')}</span>
          <h1>{label}</h1>
          <p>{blurb}</p>
        </section>
        <div className="view" key={`v-${tab}`}><View /></div>
      </main>
      <footer>
        <span><kbd>Space</kbd> play / pause</span>
        <span><kbd>←</kbd><kbd>→</kbd> step</span>
        <span><kbd>Home</kbd><kbd>End</kbd> first / last</span>
      </footer>
    </>
  );
}
