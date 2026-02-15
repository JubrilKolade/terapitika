import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
  delay?: number;
}

export function GlassCard({ children, className, hover = true, gradient = false, delay = 0 }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={cn('group relative', className)}
    >
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-therapy-500/10 to-calm-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
      )}
      <div
        className={cn(
          'relative p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl transition-all',
          hover && 'hover:border-therapy-500/50',
          className
        )}
      >
        {children}
      </div>
    </motion.div>
  );
}