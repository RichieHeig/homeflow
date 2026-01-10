import { useState } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface InviteCardProps {
  joinCode: string;
  onRegenerate: () => void;
  isRegenerating?: boolean;
}

export default function InviteCard({ joinCode, onRegenerate, isRegenerating }: InviteCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(joinCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white border-none shadow-xl">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold mb-1">Inviter des membres</h3>
            <p className="text-white/80 text-sm">
              Partagez ce code pour inviter d'autres personnes à rejoindre votre foyer
            </p>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="text-xs text-white/70 mb-1">Code d'invitation</div>
              <div className="font-mono text-3xl font-bold tracking-wider">
                {joinCode}
              </div>
            </div>

            <Button
              onClick={handleCopy}
              className={`${
                copied
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-white/20 hover:bg-white/30'
              } backdrop-blur-sm text-white border-none shadow-lg transition-all`}
              size="lg"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Copié!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5 mr-2" />
                  Copier
                </>
              )}
            </Button>
          </div>

          <Button
            onClick={onRegenerate}
            disabled={isRegenerating}
            variant="outline"
            className="w-full bg-white/10 hover:bg-white/20 border-white/30 text-white backdrop-blur-sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRegenerating ? 'animate-spin' : ''}`} />
            {isRegenerating ? 'Régénération...' : 'Régénérer le code'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
