import { useState, useEffect } from 'react';

/* Replays a list of frames: play, pause, step back/forward, jump, speed. */
export function usePlayer(frames) {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(70);
  const last = Math.max(0, frames.length - 1);

  useEffect(() => { setIdx(0); setPlaying(frames.length > 1); }, [frames]);

  useEffect(() => {
    if (!playing) return undefined;
    if (idx >= last) { setPlaying(false); return undefined; }
    const t = setTimeout(() => setIdx(i => Math.min(i + 1, last)), 20 + 900 * Math.pow(0.93, speed));
    return () => clearTimeout(t);
  }, [playing, idx, last, speed]);

  const go = i => { setPlaying(false); setIdx(Math.max(0, Math.min(i, last))); };
  return {
    idx: Math.min(idx, last), last, playing, speed, setSpeed,
    frame: frames[Math.min(idx, last)],
    jump: go, next: () => go(idx + 1), prev: () => go(idx - 1),
    toggle: () => { if (playing) setPlaying(false); else { if (idx >= last) setIdx(0); setPlaying(true); } },
  };
}
