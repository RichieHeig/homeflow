import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, User, ArrowLeft, Copy, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/stores/useStore';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface CreateHouseholdProps {
  onBack: () => void;
}

export default function CreateHousehold({ onBack }: CreateHouseholdProps) {
  const navigate = useNavigate();
  const { setHousehold, setMembers } = useStore();
  const { success, error: showError } = useToast();

  const [householdName, setHouseholdName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [joinCode, setJoinCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<{ householdName?: string; displayName?: string }>({});

  const validate = (): boolean => {
    const newErrors: { householdName?: string; displayName?: string } = {};

    if (!householdName.trim()) {
      newErrors.householdName = 'Le nom du foyer est requis';
    } else if (householdName.trim().length < 3) {
      newErrors.householdName = 'Le nom doit contenir au moins 3 caractères';
    } else if (householdName.trim().length > 100) {
      newErrors.householdName = 'Le nom ne peut pas dépasser 100 caractères';
    }

    if (!displayName.trim()) {
      newErrors.displayName = 'Votre prénom est requis';
    } else if (displayName.trim().length < 2) {
      newErrors.displayName = 'Le prénom doit contenir au moins 2 caractères';
    } else if (displayName.trim().length > 50) {
      newErrors.displayName = 'Le prénom ne peut pas dépasser 50 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        showError('Vous devez être connecté pour créer un foyer. Veuillez vous reconnecter.');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.rpc('create_household', {
        _household_name: householdName.trim(),
        _display_name: displayName.trim(),
      });

      if (error) throw error;

      if (data) {
        setHousehold(data.household);
        setMembers([data.member]);
        setJoinCode(data.household.join_code);
        success('Foyer créé avec succès!');
      }
    } catch (err: any) {
      console.error('Error creating household:', err);
      showError(err.message || 'Erreur lors de la création du foyer');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = async () => {
    if (joinCode) {
      await navigator.clipboard.writeText(joinCode);
      setCopied(true);
      success('Code copié dans le presse-papier');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleContinue = () => {
    navigate('/dashboard');
  };

  if (joinCode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 dark:from-gray-900 dark:via-indigo-950 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl">Foyer créé avec succès!</CardTitle>
            <CardDescription>
              Partagez ce code avec les membres de votre famille pour qu'ils puissent rejoindre votre foyer
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Code d'invitation</Label>
              <div className="flex gap-2">
                <Input
                  value={joinCode}
                  readOnly
                  className="font-mono text-center text-lg font-bold tracking-wider"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyCode}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                Conservez ce code en lieu sûr. Vous pourrez le retrouver dans les paramètres de votre foyer.
              </p>
            </div>

            <Button onClick={handleContinue} className="w-full" size="lg">
              Accéder au tableau de bord
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 dark:from-gray-900 dark:via-indigo-950 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>

        <Card>
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4">
              <Home className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Créer un nouveau foyer</CardTitle>
            <CardDescription>
              Commencez par donner un nom à votre foyer et vous identifier
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="householdName">
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    Nom du foyer
                  </div>
                </Label>
                <Input
                  id="householdName"
                  placeholder="Ex: Famille Dupont"
                  value={householdName}
                  onChange={(e) => {
                    setHouseholdName(e.target.value);
                    if (errors.householdName) {
                      setErrors({ ...errors, householdName: undefined });
                    }
                  }}
                  disabled={loading}
                  className={errors.householdName ? 'border-red-500' : ''}
                />
                {errors.householdName && (
                  <p className="text-sm text-red-500">{errors.householdName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayName">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Votre prénom
                  </div>
                </Label>
                <Input
                  id="displayName"
                  placeholder="Ex: Marie"
                  value={displayName}
                  onChange={(e) => {
                    setDisplayName(e.target.value);
                    if (errors.displayName) {
                      setErrors({ ...errors, displayName: undefined });
                    }
                  }}
                  disabled={loading}
                  className={errors.displayName ? 'border-red-500' : ''}
                />
                {errors.displayName && (
                  <p className="text-sm text-red-500">{errors.displayName}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? 'Création en cours...' : 'Créer le foyer'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
