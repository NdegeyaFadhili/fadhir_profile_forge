import React from 'react';
import { motion } from 'framer-motion';

interface InteractiveButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'secondary';
  className?: string;
}

const InteractiveButton: React.FC<InteractiveButtonProps> = ({
  children,
  onClick,
  href,
  variant = 'primary',
  className = '',
}) => {
  const baseClasses = `
    relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium 
    h-10 px-4 py-2 overflow-hidden group transition-all duration-300 cursor-pointer
  `;
  
  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  };

  const buttonContent = (
    <motion.div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 -translate-x-full"
        animate={{
          translateX: ['100%', '200%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
          ease: 'easeInOut',
        }}
      />
      <span className="relative z-10">{children}</span>
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} className="inline-block">
        {buttonContent}
      </a>
    );
  }

  return (
    <button onClick={onClick} className="inline-block">
      {buttonContent}
    </button>
  );
};

export default InteractiveButton;