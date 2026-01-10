import { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle2, AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AuthMagicLinkProps {
  onBack: () => void;
  intention: 'create' | 'join';
}

export default function AuthMagicLink({ onBack, intention }: AuthMagicLinkProps) {
  const { success, error: showError } = useToast();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState('');
  const [errors, setErrors] = useState<{ email?: string }>({});

  const publicAppUrl = import.meta.env.VITE_PUBLIC_APP_URL;

  const validate = (): boolean => {
    const newErrors: { email?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'L\'adresse email est requise';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'L\'adresse email n\'est pas valide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    if (!publicAppUrl) {
      showError('URL publique de l\'application non configurée. Veuillez définir VITE_PUBLIC_APP_URL.');
      return;
    }

    setLoading(true);

    try {
      const finalRedirectUrl = `${publicAppUrl}/onboarding?intention=${intention}`;

      console.log('[Magic Link] Public App URL:', publicAppUrl);
      console.log('[Magic Link] Redirect URL:', finalRedirectUrl);

      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: finalRedirectUrl,
        },
      });

      if (error) throw error;

      setRedirectUrl(finalRedirectUrl);
      setEmailSent(true);
      success('Lien de connexion envoyé ! Vérifiez votre boîte email.');
    } catch (err: any) {
      console.error('Error sending magic link:', err);
      showError(err.message || 'Erreur lors de l\'envoi du lien de connexion');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 dark:from-gray-900 dark:via-indigo-950 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl">Email envoyé !</CardTitle>
            <CardDescription>
              Nous venons d'envoyer un lien de connexion à {email}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-900 dark:text-blue-100 mb-2">
                <strong>Étapes suivantes :</strong>
              </p>
              <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside ml-2">
                <li>Ouvrez votre boîte email</li>
                <li>Cliquez sur le lien de connexion <strong>(le plus récent)</strong></li>
                <li>Vous serez automatiquement redirigé vers l'application</li>
              </ol>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <p className="text-sm text-amber-900 dark:text-amber-100 font-medium mb-1">
                Plusieurs emails reçus ?
              </p>
              <p className="text-sm text-amber-800 dark:text-amber-200">
                Utilisez toujours le lien le plus récent. Les anciens liens peuvent expirer ou rediriger vers une URL obsolète.
              </p>
            </div>

            {redirectUrl && (
              <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">
                  URL de redirection :
                </p>
                <p className="text-xs text-gray-700 dark:text-gray-300 font-mono break-all">
                  {redirectUrl}
                </p>
              </div>
            )}

            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              <p>Vous ne trouvez pas l'email ?</p>
              <p className="mt-1">Vérifiez vos spams ou réessayez avec une autre adresse.</p>
            </div>

            <Button
              variant="outline"
              onClick={onBack}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
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
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Connexion par email</CardTitle>
            <CardDescription>
              {intention === 'create'
                ? 'Connectez-vous pour créer votre foyer'
                : 'Connectez-vous pour rejoindre un foyer'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!publicAppUrl && (
              <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-900 dark:text-red-100 mb-1">
                      Configuration manquante
                    </p>
                    <p className="text-sm text-red-800 dark:text-red-200">
                      URL publique de l'application non configurée. Veuillez définir <code className="bg-red-100 dark:bg-red-900/40 px-1 py-0.5 rounded">VITE_PUBLIC_APP_URL</code> dans votre fichier .env
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Adresse email
                  </div>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre.email@exemple.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) {
                      setErrors({ ...errors, email: undefined });
                    }
                  }}
                  disabled={loading}
                  className={errors.email ? 'border-red-500' : ''}
                  autoComplete="email"
                  autoFocus
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  Nous vous enverrons un lien de connexion sécurisé par email. Aucun mot de passe nécessaire.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? 'Envoi en cours...' : 'Recevoir le lien de connexion'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
