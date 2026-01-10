import { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showStatus, setShowStatus] = useState(false);
  const [justReconnected, setJustReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowStatus(true);
      setJustReconnected(true);

      setTimeout(() => {
        setShowStatus(false);
        setJustReconnected(false);
      }, 5000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowStatus(true);
      setJustReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (!navigator.onLine) {
      setShowStatus(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showStatus) {
    return null;
  }

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top">
      <div
        className={`
          px-4 py-2 rounded-full shadow-lg flex items-center gap-2 font-medium text-sm
          ${
            isOnline
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          }
        `}
      >
        {isOnline ? (
          <>
            <Wifi className="w-4 h-4" />
            <span>De nouveau en ligne</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4" />
            <span>Mode hors ligne</span>
          </>
        )}
      </div>
    </div>
  );
}
