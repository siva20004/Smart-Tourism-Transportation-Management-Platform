import React from 'react';

export const FujiLogo: React.FC<{ size?: number; className?: string }> = ({ size = 38, className = "" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer gold refined border */}
      <circle cx="50" cy="50" r="47" stroke="#c59b27" strokeWidth="2.5" fill="#0c1b33" />
      <circle cx="50" cy="50" r="44" stroke="#c59b27" strokeWidth="0.8" strokeDasharray="2 2" fill="none" opacity="0.6" />

      {/* Sun disk behind mountain */}
      <circle cx="50" cy="38" r="18" fill="#be123c" />

      {/* Mount Fuji symmetric silhouette */}
      <path
        d="M16 78L39 36C43 31 57 31 61 36L84 78H16Z"
        fill="#1e3a68"
      />

      {/* Snow cap */}
      <path
        d="M39 36C43 31 57 31 61 36L67 47C63 50 60 48 56 46C53 45 49 49 45 47C41 46 38 49 33 47L39 36Z"
        fill="#ffffff"
      />

      {/* Classic Gold Wave Lines below peak */}
      <path
        d="M26 82C36 84 44 80 50 82C56 84 64 80 74 82"
        stroke="#c59b27"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M32 86C40 87 46 85 50 86C54 87 60 85 68 86"
        stroke="#d4af37"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
};
