const PATHS = {
  first: <><path d="M6 5v14" /><path d="M18 6l-8 6 8 6z" fill="currentColor" /></>,
  prev: <path d="M15 6l-6 6 6 6" />,
  next: <path d="M9 6l6 6-6 6" />,
  last: <><path d="M18 5v14" /><path d="M6 6l8 6-8 6z" fill="currentColor" /></>,
  play: <path d="M8 5.5l11 6.5-11 6.5z" fill="currentColor" />,
  pause: <><rect x="7" y="5" width="3.5" height="14" rx="1" fill="currentColor" /><rect x="13.5" y="5" width="3.5" height="14" rx="1" fill="currentColor" /></>,
  replay: <><path d="M4 12a8 8 0 1 0 2.4-5.7" /><path d="M4 4v4.5h4.5" /></>,
  sort: <><path d="M5 20v-6" /><path d="M10 20V9" /><path d="M15 20V4" /><path d="M20 20v-9" /></>,
  linear: <><rect x="3" y="9" width="5" height="6" rx="1.2" /><rect x="10" y="9" width="5" height="6" rx="1.2" /><path d="M17 12h4" /><path d="M19 10l2 2-2 2" /></>,
  tree: <><circle cx="12" cy="5" r="2.2" /><circle cx="6" cy="18" r="2.2" /><circle cx="18" cy="18" r="2.2" /><path d="M11 7l-4 9M13 7l4 9" /></>,
  graph: <><circle cx="5" cy="7" r="2.2" /><circle cx="19" cy="6" r="2.2" /><circle cx="12" cy="18" r="2.2" /><path d="M7 7h10M6 9l5 7M18 8l-5 8" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  moon: <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />,
  speed: <><path d="M4 18a8 8 0 1 1 16 0" /><path d="M12 18l4-5" /></>,
  spark: <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6" />,
  list: <><path d="M9 6h11M9 12h11M9 18h11" /><circle cx="4.5" cy="6" r="1" /><circle cx="4.5" cy="12" r="1" /><circle cx="4.5" cy="18" r="1" /></>,
};

export default function Icon({ name, size = 18 }) {
  return (
    <svg className="ic" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {PATHS[name]}
    </svg>
  );
}

export function Logo({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" className="logo">
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#8b5cf6" /><stop offset="1" stopColor="#22d3ee" /></linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill="url(#lg)" />
      <rect x="9" y="22" width="5" height="9" rx="1.5" fill="#fff" opacity=".7" />
      <rect x="17.5" y="15" width="5" height="16" rx="1.5" fill="#fff" opacity=".85" />
      <rect x="26" y="9" width="5" height="22" rx="1.5" fill="#fff" />
    </svg>
  );
}
