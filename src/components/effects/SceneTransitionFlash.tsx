import React, { useEffect, useState } from 'react';

interface Props {
  triggerKey: string | number | null;
  label?: string;
}

export const SceneTransitionFlash: React.FC<Props> = ({ triggerKey }) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!triggerKey) return;
    setActive(true);
    const timer = setTimeout(() => {
      setActive(false);
    }, 280);

    return () => clearTimeout(timer);
  }, [triggerKey]);

  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      {/* Subtle modern soft glow backdrop */}
      <div className="absolute inset-0 bg-cyan-500/10 backdrop-blur-[1px] transition-opacity duration-200" />

      {/* Clean elegant light beam sweep */}
      <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#38bdf8] animate-pulse" />
    </div>
  );
};
