import { useState, useEffect, useRef } from 'react';

const FIELDS = new Set(['INPUT', 'SELECT', 'TEXTAREA']);
const CLICKABLE = new Set(['BUTTON', 'SUMMARY', 'A']);

/* Replays a list of frames: play, pause, step back/forward, jump, speed, keyboard shortcuts. */
export function usePlayer(frames) {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(70);
  const [source, setSource] = useState(frames);
  const last = Math.max(0, frames.length - 1);

  if (source !== frames) { setSource(frames); setIdx(0); setPlaying(frames.length > 1); }
  const active = playing && idx < last;

  useEffect(() => {
    if (!active) return undefined;
    const t = setTimeout(() => setIdx(i => Math.min(i + 1, last)), 20 + 900 * Math.pow(0.93, speed));
    return () => clearTimeout(t);
  }, [active, idx, last, speed]);

  const go = i => { setPlaying(false); setIdx(Math.max(0, Math.min(i, last))); };
  const api = {
    idx: Math.min(idx, last), last, playing: active, speed, setSpeed,
    frame: frames[Math.min(idx, last)],
    jump: go, next: () => go(idx + 1), prev: () => go(idx - 1),
    toggle: () => { if (active) setPlaying(false); else { if (idx >= last) setIdx(0); setPlaying(true); } },
  };

  const latest = useRef(api);
  useEffect(() => { latest.current = api; });

  useEffect(() => {
    const onKey = e => {
      const tag = e.target.tagName;
      if (e.altKey || e.ctrlKey || e.metaKey || FIELDS.has(tag) || e.target.isContentEditable) return;
      if (e.key === ' ' && CLICKABLE.has(tag)) return;
      const p = latest.current;
      if (p.last === 0) return;
      const act = { ' ': p.toggle, ArrowRight: p.next, ArrowLeft: p.prev, Home: () => p.jump(0), End: () => p.jump(p.last) }[e.key];
      if (act) { e.preventDefault(); act(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return api;
}
