import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, actionHref, onAction }: EmptyStateProps) {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-therapy-500/5 to-calm-500/5 rounded-3xl blur-2xl" />
      <div className="relative p-12 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-therapy-500/20 to-calm-500/20 rounded-full flex items-center justify-center">
          <Icon className="w-8 h-8 text-therapy-400" />
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-400 mb-6 max-w-md mx-auto">{description}</p>
        {(actionLabel && (actionHref || onAction)) && (
          <>
            {actionHref ? (
              <Link href={actionHref}>
                <Button className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600">
                  {actionLabel}
                </Button>
              </Link>
            ) : (
              <Button
                onClick={onAction}
                className="bg-gradient-to-r from-therapy-500 to-calm-500 hover:from-therapy-600 hover:to-calm-600"
              >
                {actionLabel}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
