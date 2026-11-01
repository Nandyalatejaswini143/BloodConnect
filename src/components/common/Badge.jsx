import React from 'react';

export default function Badge({
  children,
  variant = 'red',
  size = 'md',
  dot = false,
  className = ''
}) {
  const variants = {
    red: 'bg-[#FEF2F2] text-[#DC2626] border-red-200',
    darkRed: 'bg-[#B91C1C] text-white border-transparent',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200'
  };

  const dotColors = {
    red: 'bg-[#DC2626]',
    darkRed: 'bg-white',
    slate: 'bg-slate-500',
    green: 'bg-emerald-500',
    amber: 'bg-amber-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500'
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 font-semibold'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border transition-colors ${variants[variant] || variants.red} ${sizes[size] || sizes.md} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotColors[variant] || 'bg-[#DC2626]'} animate-pulse`}
        />
      )}
      {children}
    </span>
  );
}
