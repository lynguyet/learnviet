'use client';

import { ButtonHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button 
      className={twMerge(
        'rounded-full font-medium transition-colors duration-200',
        variant === 'primary' ? '!bg-primary text-white hover:!bg-secondary' : '',
        variant === 'secondary' ? 'bg-secondary text-black hover:!bg-secondary-dark' : '',
        variant === 'outline' ? 'border border-primary text-primary hover:!border-secondary' : '',
        size === 'sm' ? 'px-3 py-1.5 text-sm' : '',
        size === 'md' ? 'px-4 py-2' : '',
        size === 'lg' ? 'px-6 py-3 text-lg' : '',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      {...props}
      style={{
        backgroundColor: variant === 'primary' ? '#00341c' : undefined,
        ...props.style
      }}
    >
      {children}
    </button>
  );
}