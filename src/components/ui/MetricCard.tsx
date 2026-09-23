import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface MetricCardProps {
  title: string;
  value: number | string;
  unit?: string;
  subtitle?: string;
  icon: React.ReactNode;
  accentColor?: 'cyan' | 'purple' | 'emerald' | 'amber';
  isSimulated?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit = '',
  subtitle,
  icon,
  accentColor = 'cyan',
  isSimulated = true,
}) => {
  const [displayValue, setDisplayValue] = useState<number | string>(
    typeof value === 'number' ? 0 : value
  );

  useEffect(() => {
    if (typeof value === 'number') {
      let start = 0;
      const end = value;
      const duration = 1200; // ms
      const startTime = performance.now();

      const updateCounter = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing out quad
        const easeProgress = progress * (2 - progress);
        const currentVal = Math.floor(start + (end - start) * easeProgress);
        
        setDisplayValue(currentVal);

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          setDisplayValue(end);
        }
      };

      requestAnimationFrame(updateCounter);
    } else {
      setDisplayValue(value);
    }
  }, [value]);

  const borderColors = {
    cyan: 'border-cyan-500/20 hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]',
    purple: 'border-purple-500/20 hover:border-purple-500/40 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]',
    emerald: 'border-emerald-500/20 hover:border-emerald-500/40 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]',
    amber: 'border-amber-500/20 hover:border-amber-500/40 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]',
  };

  const iconColors = {
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`glass-card p-5 rounded-2xl border ${borderColors[accentColor]} relative overflow-hidden group`}
    >
      {/* Background ambient glow */}
      <div className="absolute -top-10 -right-10 w-28 h-28 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-colors" />

      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl border ${iconColors[accentColor]} transition-transform group-hover:scale-110`}>
          {icon}
        </div>
      </div>

      <div className="flex items-baseline gap-1.5 my-1">
        <span className="text-3xl font-extrabold text-white tracking-tight font-mono">
          {typeof displayValue === 'number' ? displayValue.toLocaleString() : displayValue}
        </span>
        {unit && <span className="text-sm font-semibold text-slate-400 font-mono">{unit}</span>}
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-xs">
        {subtitle && <span className="text-slate-400">{subtitle}</span>}
        {isSimulated && (
          <span className="text-[10px] font-mono text-cyan-400/80 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20">
            SIMULATION
          </span>
        )}
      </div>
    </motion.div>
  );
};
