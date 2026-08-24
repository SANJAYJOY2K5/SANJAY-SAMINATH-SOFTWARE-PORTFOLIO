import React from 'react';

interface SJLogoProps {
  className?: string;
  size?: number | string;
  withGlow?: boolean;
}

export const SJLogo: React.FC<SJLogoProps> = ({
  className = '',
  size = 40,
  withGlow = true,
}) => {
  const width = typeof size === 'number' ? `${size}px` : size;
  const height = typeof size === 'number' ? `${size}px` : size;

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none overflow-hidden rounded-xl bg-slate-950 border border-cyan-500/30 ${
        withGlow ? 'shadow-[0_0_15px_rgba(6,182,212,0.4)]' : ''
      } ${className}`}
      style={{ width, height }}
    >
      <img
        src="/sj_logo.png"
        alt="SJ Logo"
        className="w-full h-full object-cover rounded-xl transition-transform duration-300 hover:scale-105"
      />
    </div>
  );
};
