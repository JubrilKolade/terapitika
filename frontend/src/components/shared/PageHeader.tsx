import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  actions?: ReactNode;
  gradient?: boolean;
}

export function PageHeader({ title, subtitle, icon: Icon, actions, gradient = false }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start space-x-4">
          {Icon && (
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-therapy-500 to-calm-500 flex items-center justify-center flex-shrink-0">
              <Icon className="w-6 h-6 text-white" />
            </div>
          )}
          <div>
            <h1 className={`text-4xl font-display font-bold mb-2 ${gradient ? 'bg-gradient-to-r from-therapy-400 to-calm-400 bg-clip-text text-transparent' : ''}`}>
              {title}
            </h1>
            {subtitle && <p className="text-gray-400 text-lg">{subtitle}</p>}
          </div>
        </div>
        {actions && <div className="flex items-center space-x-3">{actions}</div>}
      </div>
    </motion.div>
  );
}
