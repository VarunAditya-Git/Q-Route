import React from 'react';

interface BadgeProps {
  variant?: 'cyan' | 'purple' | 'emerald' | 'amber' | 'outline' | 'simulation';
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'cyan',
  children,
  className = '',
  icon,
}) => {
  const baseStyle = "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase backdrop-blur-md border transition-all duration-200";
  
  const variants = {
    cyan: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]",
    purple: "bg-purple-500/10 text-purple-300 border-purple-500/30 shadow-[0_0_12px_rgba(168,85,247,0.15)]",
    emerald: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]",
    amber: "bg-amber-500/10 text-amber-300 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.15)]",
    outline: "bg-slate-900/60 text-slate-300 border-slate-700/60",
    simulation: "bg-cyan-950/80 text-cyan-400 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)] animate-pulse-subtle",
  };

  return (
    <span className={`${baseStyle} ${variants[variant]} ${className}`}>
      {icon && <span className="text-current">{icon}</span>}
      {children}
    </span>
  );
};
