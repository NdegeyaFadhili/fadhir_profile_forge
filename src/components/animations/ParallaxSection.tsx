import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
}

const ParallaxSection: React.FC<ParallaxSectionProps> = ({ 
  children, 
  className = '', 
  speed = 0.5 
}) => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50 * speed]);

  return (
    <motion.div
      style={{ y }}
      className={`relative ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default ParallaxSection;