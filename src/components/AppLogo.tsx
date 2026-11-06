import React from 'react';

interface AppLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const AppLogo: React.FC<AppLogoProps> = ({ className = '', size = 'md' }) => {
  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const dim = sizeMap[size];

  return (
    <div className={`relative rounded-2xl bg-gradient-to-tr from-teal-700 via-teal-600 to-sky-500 p-1.5 shadow-lg shadow-teal-600/30 flex items-center justify-center shrink-0 overflow-hidden ${dim} ${className}`}>
      <svg viewBox="0 0 512 512" className="w-full h-full drop-shadow-md">
        <defs>
          <linearGradient id="logoSunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient id="logoCloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
        </defs>

        {/* Orbit Ring */}
        <ellipse
          cx="256"
          cy="270"
          rx="210"
          ry="90"
          fill="none"
          stroke="#ffffff"
          strokeWidth="18"
          strokeDasharray="40 20"
          opacity="0.5"
          transform="rotate(-20 256 270)"
        />

        {/* Glowing Sun */}
        <circle cx="170" cy="170" r="85" fill="url(#logoSunGrad)" />

        {/* Cloud Body */}
        <path
          d="M 190 350 
             L 350 350 
             A 55 55 0 0 0 350 240 
             A 75 75 0 0 0 220 205 
             A 65 65 0 0 0 145 285 
             A 55 55 0 0 0 190 350 Z"
          fill="url(#logoCloudGrad)"
        />

        {/* Rain Drops */}
        <line x1="210" y1="375" x2="195" y2="420" stroke="#38bdf8" strokeWidth="22" strokeLinecap="round" />
        <line x1="270" y1="375" x2="255" y2="420" stroke="#38bdf8" strokeWidth="22" strokeLinecap="round" />
        <line x1="330" y1="375" x2="315" y2="420" stroke="#38bdf8" strokeWidth="22" strokeLinecap="round" />
      </svg>
    </div>
  );
};
