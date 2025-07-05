import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Gradient Definitions */}
        <defs>
          <linearGradient id="bagGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <linearGradient id="planeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3"/>
          </filter>
        </defs>

        {/* Travel Bag */}
        <g filter="url(#shadow)">
          {/* Bag Body */}
          <rect
            x="25"
            y="35"
            width="35"
            height="45"
            rx="4"
            fill="url(#bagGradient)"
          />
          
          {/* Bag Handle */}
          <path
            d="M35 35 Q35 25 45 25 Q55 25 55 35"
            stroke="url(#bagGradient)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          
          {/* Bag Details */}
          <rect x="30" y="45" width="25" height="2" rx="1" fill="rgba(255,255,255,0.3)" />
          <rect x="30" y="55" width="20" height="2" rx="1" fill="rgba(255,255,255,0.3)" />
          <circle cx="52" cy="65" r="2" fill="rgba(255,255,255,0.4)" />
        </g>

        {/* Airplane */}
        <g filter="url(#shadow)">
          {/* Plane Body */}
          <ellipse
            cx="70"
            cy="25"
            rx="18"
            ry="4"
            fill="url(#planeGradient)"
            transform="rotate(25 70 25)"
          />
          
          {/* Wings */}
          <ellipse
            cx="65"
            cy="28"
            rx="8"
            ry="2"
            fill="url(#planeGradient)"
            transform="rotate(25 65 28)"
          />
          
          {/* Tail */}
          <path
            d="M55 35 L60 32 L58 38 Z"
            fill="url(#planeGradient)"
          />
          
          {/* Contrail */}
          <path
            d="M45 40 Q35 45 25 50"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="3,2"
          />
        </g>

        {/* Motion Lines */}
        <g opacity="0.4">
          <path d="M15 20 L25 20" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" />
          <path d="M10 30 L20 30" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
          <path d="M12 40 L22 40" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
};