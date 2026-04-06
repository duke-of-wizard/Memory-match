import { motion } from 'framer-motion';

interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export function Button({
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'md',
  children,
  className = '',
}: ButtonProps) {
  const base = 'font-semibold rounded-full transition-all duration-200 cursor-pointer inline-flex items-center justify-center gap-2 select-none';

  const variants = {
    primary: `bg-primary text-white
      shadow-[0_1px_3px_rgba(21,195,154,0.3)]
      hover:bg-primary-dark hover:shadow-[0_2px_8px_rgba(21,195,154,0.35)]`,
    secondary: `bg-surface-alt text-text-primary border border-border
      hover:bg-white hover:border-primary/30 hover:text-primary`,
    ghost: `bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-alt`,
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'h-12 px-8 text-sm tracking-wide',
  };

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-30 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </motion.button>
  );
}
