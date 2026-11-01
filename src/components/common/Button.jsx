import React from 'react';
import { Link } from 'react-router-dom';

export default function Button({
  children,
  to,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  disabled = false,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer';

  const variants = {
    primary: 'bg-[#DC2626] text-white hover:bg-[#B91C1C] focus:ring-[#DC2626] shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0',
    secondary: 'bg-[#FEF2F2] text-[#DC2626] border border-red-200 hover:bg-red-100 focus:ring-[#DC2626]',
    outline: 'bg-white text-[#0F172A] border border-slate-200 hover:border-red-200 hover:bg-[#FEF2F2] hover:text-[#DC2626] focus:ring-red-400',
    emergency: 'bg-gradient-to-r from-[#DC2626] to-[#B91C1C] text-white shadow-md hover:shadow-red-500/25 hover:shadow-lg focus:ring-red-500 animate-pulse-subtle',
    ghost: 'text-slate-600 hover:text-[#DC2626] hover:bg-[#FEF2F2] focus:ring-red-300',
    white: 'bg-white text-[#DC2626] hover:bg-slate-50 shadow-sm hover:shadow-md focus:ring-white border border-slate-100'
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5 font-semibold'
  };

  const combinedClasses = `${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`;

  const content = (
    <>
      {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={combinedClasses} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={combinedClasses} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={combinedClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {content}
    </button>
  );
}
