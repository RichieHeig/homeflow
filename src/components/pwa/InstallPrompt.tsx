import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePWA } from '@/hooks/usePWA';

const STORAGE_KEY = 'homeflow-install-dismissed';
const DELAY_MS = 30000;

export default function InstallPrompt() {
  const { isInstallable, isInstalled, promptInstall } = usePWA();
  const [showPrompt, setShowPrompt] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    if (isInstallable && !isInstalled) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, DELAY_MS);

      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled]);

  const handleInstall = async () => {
    const accepted = await promptInstall();
    if (accepted) {
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setIsDismissed(true);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  if (!showPrompt || isDismissed || isInstalled || !isInstallable) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-in slide-in-from-bottom">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border-2 border-blue-500 dark:border-blue-600 p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
            <Download className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              Installer HomeFlow
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Installez l'application pour un accès rapide et une expérience optimale
            </p>
            <div className="flex gap-2">
              <Button onClick={handleInstall} size="sm" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Installer
              </Button>
              <Button onClick={handleDismiss} variant="outline" size="sm">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
