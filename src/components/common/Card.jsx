import React from 'react';

export default function Card({
  children,
  className = '',
  hoverEffect = true,
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-100 shadow-sm ${
        hoverEffect ? 'hover:shadow-md hover:border-red-100/60 transition-all duration-300' : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
