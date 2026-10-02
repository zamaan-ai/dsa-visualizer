import { useEffect, useState } from 'react';
import SortingView from './views/SortingView.jsx';
import LinearView from './views/LinearView.jsx';
import TreeView from './views/TreeView.jsx';
import GraphView from './views/GraphView.jsx';

const TABS = [
  ['sort', 'Sorting', SortingView],
  ['linear', 'Linear structures', LinearView],
  ['tree', 'Binary search tree', TreeView],
  ['graph', 'Graph', GraphView],
];

const fromHash = () => {
  const k = window.location.hash.slice(1);
  return TABS.some(t => t[0] === k) ? k : 'sort';
};

export default function App() {
  const [tab, setTab] = useState(fromHash);

  useEffect(() => {
    const onHash = () => setTab(fromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const View = TABS.find(t => t[0] === tab)[2];
  return (
    <>
      <header>
        <h1>DSA Visualizer</h1>
        <nav aria-label="Topics">
          {TABS.map(([k, label]) => (
            <a key={k} href={`#${k}`} className={k === tab ? 'on' : ''} aria-current={k === tab ? 'page' : undefined}>{label}</a>
          ))}
        </nav>
      </header>
      <main><View key={tab} /></main>
      <footer>
        Keyboard: <kbd>Space</kbd> play / pause, <kbd>←</kbd> <kbd>→</kbd> step, <kbd>Home</kbd> <kbd>End</kbd> first / last
      </footer>
    </>
  );
}
