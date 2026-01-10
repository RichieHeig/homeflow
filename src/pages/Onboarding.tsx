import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Home, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useStore } from '@/stores/useStore';
import CreateHousehold from '@/components/onboarding/CreateHousehold';
import JoinHousehold from '@/components/onboarding/JoinHousehold';
import AuthMagicLink from '@/components/onboarding/AuthMagicLink';

type OnboardingStep = 'choose' | 'auth' | 'create' | 'join';
type Intention = 'create' | 'join';

export default function Onboarding() {
  const [searchParams] = useSearchParams();
  const { user } = useStore();
  const [step, setStep] = useState<OnboardingStep>('choose');
  const [intention, setIntention] = useState<Intention>('create');

  useEffect(() => {
    const intentionParam = searchParams.get('intention') as Intention | null;

    if (user && intentionParam) {
      if (intentionParam === 'create') {
        setStep('create');
      } else if (intentionParam === 'join') {
        setStep('join');
      }
    }
  }, [user, searchParams]);

  const handleChoose = (choice: Intention) => {
    setIntention(choice);

    if (!user) {
      setStep('auth');
    } else {
      setStep(choice);
    }
  };

  if (step === 'auth') {
    return <AuthMagicLink onBack={() => setStep('choose')} intention={intention} />;
  }

  if (step === 'create') {
    return <CreateHousehold onBack={() => setStep('choose')} />;
  }

  if (step === 'join') {
    return <JoinHousehold onBack={() => setStep('choose')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 dark:from-gray-900 dark:via-indigo-950 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Home className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Bienvenue sur HomeFlow
          </h1>
          <p className="text-muted-foreground">
            Gérez les tâches domestiques en famille de manière équilibrée
          </p>
        </div>

        <div className="space-y-4">
          <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer group">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Home className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Créer un foyer</CardTitle>
                  <CardDescription>Commencez un nouveau foyer et invitez votre famille</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => handleChoose('create')}
                className="w-full"
                size="lg"
              >
                Créer mon foyer
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer group">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Rejoindre un foyer</CardTitle>
                  <CardDescription>Utilisez un code d'invitation pour rejoindre un foyer existant</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => handleChoose('join')}
                variant="outline"
                className="w-full"
                size="lg"
              >
                Rejoindre un foyer
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
