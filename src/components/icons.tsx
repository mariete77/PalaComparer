export function PadelIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="10" rx="7" ry="9" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="9" y1="23" x2="15" y2="23" />
      <circle cx="10" cy="8" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="14" cy="8" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="12" cy="11" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="10" cy="13" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="14" cy="13" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TennisIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="9" rx="6" ry="8" />
      <line x1="12" y1="17" x2="12" y2="23" />
      <line x1="10" y1="23" x2="14" y2="23" />
      <line x1="10" y1="3" x2="10" y2="15" />
      <line x1="14" y1="3" x2="14" y2="15" />
      <line x1="7" y1="7" x2="17" y2="7" />
      <line x1="6.5" y1="11" x2="17.5" y2="11" />
    </svg>
  );
}

export function ScaleIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="3" x2="12" y2="21" />
      <polyline points="4,7 12,3 20,7" />
      <path d="M4 7l-1 7h6l-1-7" />
      <path d="M20 7l-1 7h6l-1-7" />
    </svg>
  );
}

export function SearchIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <line x1="16.5" y1="16.5" x2="21" y2="21" />
    </svg>
  );
}

export function NewsIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="7" y1="8" x2="17" y2="8" />
      <line x1="7" y1="12" x2="13" y2="12" />
      <line x1="7" y1="16" x2="15" y2="16" />
    </svg>
  );
}
