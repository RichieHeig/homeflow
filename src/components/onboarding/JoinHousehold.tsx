import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key, User, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/stores/useStore';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface JoinHouseholdProps {
  onBack: () => void;
}

export default function JoinHousehold({ onBack }: JoinHouseholdProps) {
  const navigate = useNavigate();
  const { setHousehold, setMembers } = useStore();
  const { success, error: showError } = useToast();

  const [joinCode, setJoinCode] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ joinCode?: string; displayName?: string }>({});

  const validate = (): boolean => {
    const newErrors: { joinCode?: string; displayName?: string } = {};

    if (!joinCode.trim()) {
      newErrors.joinCode = 'Le code d\'invitation est requis';
    } else if (joinCode.trim().length < 6) {
      newErrors.joinCode = 'Le code doit contenir au moins 6 caractères';
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
        showError('Vous devez être connecté pour rejoindre un foyer. Veuillez vous reconnecter.');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.rpc('join_household_via_code', {
        _join_code: joinCode.trim().toUpperCase(),
        _display_name: displayName.trim(),
      });

      if (error) throw error;

      if (data) {
        setHousehold(data.household);

        const { data: membersData } = await supabase
          .from('members')
          .select('*')
          .eq('household_id', data.household.id);

        if (membersData) {
          setMembers(membersData);
        }

        success('Vous avez rejoint le foyer avec succès!');
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('Error joining household:', err);

      if (err.message?.includes('Invalid join code')) {
        showError('Code d\'invitation invalide');
      } else if (err.message?.includes('already a member')) {
        showError('Vous êtes déjà membre de ce foyer');
      } else {
        showError(err.message || 'Erreur lors de la jonction au foyer');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setJoinCode(value);
    if (errors.joinCode) {
      setErrors({ ...errors, joinCode: undefined });
    }
  };

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
              <Key className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Rejoindre un foyer</CardTitle>
            <CardDescription>
              Entrez le code d'invitation que vous avez reçu et présentez-vous
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="joinCode">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    Code d'invitation
                  </div>
                </Label>
                <Input
                  id="joinCode"
                  placeholder="ABC123"
                  value={joinCode}
                  onChange={handleJoinCodeChange}
                  disabled={loading}
                  className={`font-mono text-center text-lg font-bold tracking-wider uppercase ${
                    errors.joinCode ? 'border-red-500' : ''
                  }`}
                  maxLength={20}
                />
                {errors.joinCode && (
                  <p className="text-sm text-red-500">{errors.joinCode}</p>
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
                  placeholder="Ex: Pierre"
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
                {loading ? 'Connexion en cours...' : 'Rejoindre le foyer'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
