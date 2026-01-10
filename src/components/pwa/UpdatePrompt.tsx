import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRegisterSW } from 'virtual:pwa-register/react';

export default function UpdatePrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered:', r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  useEffect(() => {
    if (needRefresh) {
      setShowPrompt(true);
    }
  }, [needRefresh]);

  const handleUpdate = () => {
    updateServiceWorker(true);
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-in slide-in-from-top">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-2xl p-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <RefreshCw className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white mb-1">
              Mise à jour disponible
            </h3>
            <p className="text-sm text-blue-100 mb-2">
              Une nouvelle version est disponible
            </p>
          </div>
          <Button
            onClick={handleUpdate}
            variant="secondary"
            size="sm"
            className="flex-shrink-0"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Mettre à jour
          </Button>
        </div>
      </div>
    </div>
  );
}
