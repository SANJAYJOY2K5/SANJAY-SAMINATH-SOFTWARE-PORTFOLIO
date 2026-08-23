import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show custom cursor on fine pointer devices (desktop)
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const onMouseDown = () => setIsClicked(true);
    const onMouseUp = () => setIsClicked(false);
    const onMouseLeave = () => setIsVisible(false);

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a') || target.classList.contains('clickable'))) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseover', onOver);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseover', onOver);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer Glowing Ring */}
      <div
        className={`fixed top-0 left-0 pointer-events-none z-[9999] transition-transform duration-100 ease-out -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/60 ${
          isHovered ? 'w-12 h-12 bg-cyan-500/10 border-cyan-300 scale-125' : 'w-8 h-8'
        } ${isClicked ? 'scale-75 border-purple-400 bg-purple-500/20' : ''}`}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`,
        }}
      />
      {/* Inner Glowing Center Dot */}
      <div
        className={`fixed top-0 left-0 pointer-events-none z-[9999] w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#06b6d4] transition-transform duration-75 ease-out -translate-x-1/2 -translate-y-1/2 ${
          isHovered ? 'scale-150 bg-cyan-300 shadow-[0_0_15px_#00f0ff]' : ''
        }`}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`,
        }}
      />
    </>
  );
};
