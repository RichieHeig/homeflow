import { useState } from 'react';
import { Users as UsersIcon, LogOut, AlertTriangle } from 'lucide-react';
import { useStore } from '@/stores/useStore';
import { useMembers } from '@/hooks/useMembers';
import { useToast } from '@/contexts/ToastContext';
import {
  promoteToAdmin,
  demoteFromAdmin,
  removeMember,
  leaveHousehold,
  regenerateJoinCode,
} from '@/lib/members';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import MemberCard from '@/components/members/MemberCard';
import InviteCard from '@/components/members/InviteCard';
import MemberStats from '@/components/members/MemberStats';

export default function Members() {
  const { household, user, setHousehold } = useStore();
  const { members, loading, isAdmin, refetch } = useMembers(household?.id || null, user?.id);
  const { success, error: showError } = useToast();
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handlePromote = async (memberId: string) => {
    if (!confirm('Voulez-vous promouvoir ce membre en tant qu\'administrateur?')) return;

    try {
      await promoteToAdmin(memberId);
      success('Membre promu administrateur');
      refetch();
    } catch (err) {
      console.error('Error promoting member:', err);
      showError('Erreur lors de la promotion');
    }
  };

  const handleDemote = async (memberId: string) => {
    if (!confirm('Voulez-vous retirer les droits d\'administrateur à ce membre?')) return;

    try {
      await demoteFromAdmin(memberId);
      success('Droits administrateur retirés');
      refetch();
    } catch (err) {
      console.error('Error demoting member:', err);
      showError('Erreur lors de la rétrogradation');
    }
  };

  const handleRemove = async (memberId: string) => {
    if (!confirm('Voulez-vous vraiment retirer ce membre du foyer? Cette action est irréversible.')) return;

    try {
      await removeMember(memberId);
      success('Membre retiré du foyer');
      refetch();
    } catch (err) {
      console.error('Error removing member:', err);
      showError('Erreur lors du retrait');
    }
  };

  const handleLeave = async () => {
    if (!confirm('Voulez-vous vraiment quitter ce foyer? Vous perdrez l\'accès à toutes les données.')) return;

    try {
      await leaveHousehold();
      success('Vous avez quitté le foyer');
      setHousehold(null);
      window.location.href = '/onboarding';
    } catch (err) {
      console.error('Error leaving household:', err);
      showError('Erreur lors de la sortie du foyer');
    }
  };

  const handleRegenerate = async () => {
    if (!household?.id) return;
    if (!confirm('Voulez-vous régénérer le code d\'invitation? L\'ancien code ne fonctionnera plus.')) return;

    try {
      setIsRegenerating(true);
      const newCode = await regenerateJoinCode(household.id);
      setHousehold({ ...household, join_code: newCode });
      success('Code d\'invitation régénéré');
    } catch (err) {
      console.error('Error regenerating code:', err);
      showError('Erreur lors de la régénération');
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <UsersIcon className="w-8 h-8" />
            Gestion des membres
          </h1>
          <p className="text-lg text-muted-foreground mt-1">
            Gérez les membres de votre foyer et suivez leurs contributions
          </p>
        </div>

        <MemberStats members={members} />

        {isAdmin && household?.join_code && (
          <InviteCard
            joinCode={household.join_code}
            onRegenerate={handleRegenerate}
            isRegenerating={isRegenerating}
          />
        )}

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-white dark:bg-gray-800 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : members.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <UsersIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Aucun membre
              </h3>
              <p className="text-muted-foreground">
                Invitez des personnes à rejoindre votre foyer
              </p>
            </CardContent>
          </Card>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Membres ({members.length})
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {members.map((member, index) => (
                <MemberCard
                  key={member.member_id}
                  member={member}
                  rank={index + 1}
                  isCurrentUser={member.member_id === user?.id}
                  isAdmin={isAdmin}
                  onPromote={handlePromote}
                  onDemote={handleDemote}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          </div>
        )}

        <Card className="border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-red-900 dark:text-red-200 mb-1">
                  Zone de danger
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                  Quitter le foyer supprimera définitivement votre accès à toutes les données.
                  Cette action est irréversible.
                </p>
                <Button
                  onClick={handleLeave}
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Quitter le foyer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
