import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  onClose: (id: string) => void;
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    className: 'bg-green-50 border-green-200 text-green-900',
    iconClassName: 'text-green-500',
    progressClassName: 'bg-green-500',
  },
  error: {
    icon: XCircle,
    className: 'bg-red-50 border-red-200 text-red-900',
    iconClassName: 'text-red-500',
    progressClassName: 'bg-red-500',
  },
  warning: {
    icon: AlertTriangle,
    className: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    iconClassName: 'text-yellow-500',
    progressClassName: 'bg-yellow-500',
  },
  info: {
    icon: Info,
    className: 'bg-blue-50 border-blue-200 text-blue-900',
    iconClassName: 'text-blue-500',
    progressClassName: 'bg-blue-500',
  },
};

export function Toast({ id, message, type, duration = 5000, onClose }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);
  const config = toastConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (remaining === 0) {
        clearInterval(interval);
      }
    }, 16);

    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onClose(id), 300);
    }, duration);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [id, duration, onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose(id), 300);
  };

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border shadow-lg transition-all duration-300 min-w-[320px] max-w-md',
        config.className,
        isExiting
          ? 'opacity-0 translate-x-full'
          : 'opacity-100 translate-x-0 animate-in slide-in-from-right'
      )}
    >
      <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', config.iconClassName)} />

      <div className="flex-1">
        <p className="text-sm font-medium leading-relaxed">{message}</p>

        <div className="mt-2 h-1 w-full bg-white/30 rounded-full overflow-hidden">
          <div
            className={cn('h-full transition-all duration-100 ease-linear', config.progressClassName)}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <button
        onClick={handleClose}
        className="flex-shrink-0 text-current opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Fermer"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
