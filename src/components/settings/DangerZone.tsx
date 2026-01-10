import { useState } from 'react';
import { AlertTriangle, LogOut, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/contexts/ToastContext';
import { leaveHousehold } from '@/lib/members';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/stores/useStore';
import { useNavigate } from 'react-router-dom';

export default function DangerZone() {
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();
  const { clearSession } = useStore();
  const navigate = useNavigate();

  const handleLeaveHousehold = async () => {
    try {
      setLoading(true);
      await leaveHousehold();
      success('Vous avez quitté le foyer');
      clearSession();
      navigate('/onboarding');
    } catch (err) {
      console.error('Error leaving household:', err);
      error('Erreur lors de la sortie du foyer');
    } finally {
      setLoading(false);
      setShowLeaveConfirm(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'SUPPRIMER') {
      error('Veuillez taper "SUPPRIMER" pour confirmer');
      return;
    }

    try {
      setLoading(true);

      const { error: deleteError } = await supabase.rpc('delete_account');

      if (deleteError) throw deleteError;

      await supabase.auth.signOut();

      success('Votre compte a été supprimé');
      clearSession();
      navigate('/');
    } catch (err) {
      console.error('Error deleting account:', err);
      error('Erreur lors de la suppression du compte');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
      setDeleteConfirmText('');
    }
  };

  return (
    <Card className="border-2 border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20">
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-red-500 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-red-900 dark:text-red-200 mb-1">
              Zone dangereuse
            </h2>
            <p className="text-sm text-red-700 dark:text-red-300">
              Actions irréversibles - procéder avec prudence
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Quitter le foyer
                </h3>
                <p className="text-sm text-muted-foreground">
                  Vous quitterez ce foyer et perdrez l'accès à toutes les données partagées.
                </p>
              </div>
            </div>

            {showLeaveConfirm ? (
              <div className="space-y-3">
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                  Êtes-vous sûr de vouloir quitter ce foyer?
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={handleLeaveHousehold}
                    disabled={loading}
                    variant="destructive"
                    size="sm"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Confirmer
                  </Button>
                  <Button
                    onClick={() => setShowLeaveConfirm(false)}
                    variant="outline"
                    size="sm"
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                onClick={() => setShowLeaveConfirm(true)}
                variant="outline"
                size="sm"
                className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Quitter le foyer
              </Button>
            )}
          </div>

          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-red-300 dark:border-red-800">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Supprimer le compte
                </h3>
                <p className="text-sm text-muted-foreground">
                  Supprimez définitivement votre compte et toutes vos données. Cette action est irréversible.
                </p>
              </div>
            </div>

            {showDeleteConfirm ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-red-600 dark:text-red-400 font-medium mb-2">
                    Tapez "SUPPRIMER" pour confirmer la suppression définitive de votre compte:
                  </p>
                  <Input
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder="SUPPRIMER"
                    className="border-red-300 dark:border-red-800"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleDeleteAccount}
                    disabled={loading || deleteConfirmText !== 'SUPPRIMER'}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer définitivement
                  </Button>
                  <Button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteConfirmText('');
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                onClick={() => setShowDeleteConfirm(true)}
                variant="destructive"
                size="sm"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer le compte
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
