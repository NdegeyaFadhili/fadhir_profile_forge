import React from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from '@/components/animations/ScrollReveal';

const Footer = () => {
  return (
    <ScrollReveal direction="up">
      <footer className="border-t py-8 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
            <p className="text-muted-foreground">&copy; 2024 Ndegeya Fadhiri. All rights reserved.</p>
          </motion.div>
        </div>
      </footer>
    </ScrollReveal>
  );
};

export default Footer;