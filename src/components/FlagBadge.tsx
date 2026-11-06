import React from 'react';

interface FlagBadgeProps {
  countryCode: string;
  className?: string;
  showCode?: boolean;
}

export const FlagBadge: React.FC<FlagBadgeProps> = ({
  countryCode,
  className = 'w-5 h-3.5',
  showCode = false,
}) => {
  const code = countryCode.toUpperCase();

  // High quality SVG flag renders for key countries to avoid OS emoji letter fallbacks
  if (code === 'BD') {
    return (
      <span className="inline-flex items-center gap-1 shrink-0">
        <svg
          viewBox="0 0 20 12"
          className={`rounded-xs shadow-2xs shrink-0 overflow-hidden ${className}`}
          aria-label="Bangladesh Flag"
        >
          <rect width="20" height="12" fill="#006a4e" />
          <circle cx="9" cy="6" r="3.6" fill="#f42a41" />
        </svg>
        {showCode && <span className="font-bold text-[11px] leading-none">BD</span>}
      </span>
    );
  }

  if (code === 'IN') {
    return (
      <span className="inline-flex items-center gap-1 shrink-0">
        <svg viewBox="0 0 20 12" className={`rounded-xs shadow-2xs shrink-0 overflow-hidden ${className}`}>
          <rect width="20" height="4" fill="#FF9933" />
          <rect y="4" width="20" height="4" fill="#FFFFFF" />
          <rect y="8" width="20" height="4" fill="#128807" />
          <circle cx="10" cy="6" r="1.5" fill="#000080" />
        </svg>
        {showCode && <span className="font-bold text-[11px] leading-none">IN</span>}
      </span>
    );
  }

  if (code === 'US') {
    return (
      <span className="inline-flex items-center gap-1 shrink-0">
        <svg viewBox="0 0 20 12" className={`rounded-xs shadow-2xs shrink-0 overflow-hidden ${className}`}>
          <rect width="20" height="12" fill="#B22234" />
          <rect y="1.5" width="20" height="1.5" fill="#FFFFFF" />
          <rect y="4.5" width="20" height="1.5" fill="#FFFFFF" />
          <rect y="7.5" width="20" height="1.5" fill="#FFFFFF" />
          <rect y="10.5" width="20" height="1.5" fill="#FFFFFF" />
          <rect width="8" height="6.5" fill="#3C3B6E" />
        </svg>
        {showCode && <span className="font-bold text-[11px] leading-none">US</span>}
      </span>
    );
  }

  if (code === 'PK') {
    return (
      <span className="inline-flex items-center gap-1 shrink-0">
        <svg viewBox="0 0 20 12" className={`rounded-xs shadow-2xs shrink-0 overflow-hidden ${className}`}>
          <rect width="20" height="12" fill="#01411C" />
          <rect width="5" height="12" fill="#FFFFFF" />
          <circle cx="12.5" cy="6" r="3" fill="#FFFFFF" />
          <circle cx="13.2" cy="5.8" r="2.6" fill="#01411C" />
        </svg>
        {showCode && <span className="font-bold text-[11px] leading-none">PK</span>}
      </span>
    );
  }

  if (code === 'SA') {
    return (
      <span className="inline-flex items-center gap-1 shrink-0">
        <svg viewBox="0 0 20 12" className={`rounded-xs shadow-2xs shrink-0 overflow-hidden ${className}`}>
          <rect width="20" height="12" fill="#006C35" />
          <path d="M5 6h10" stroke="#FFFFFF" strokeWidth="1" />
        </svg>
        {showCode && <span className="font-bold text-[11px] leading-none">SA</span>}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 shrink-0">
      <span className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
        {code}
      </span>
    </span>
  );
};
