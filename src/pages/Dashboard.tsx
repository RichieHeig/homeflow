import { useStore } from '@/stores/useStore';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import BalanceChart from '@/components/dashboard/BalanceChart';
import LeaderboardCard from '@/components/dashboard/LeaderboardCard';
import QuickTaskButton from '@/components/dashboard/QuickTaskButton';

export default function Dashboard() {
  const { household, user, members } = useStore();
  const { leaderboard, loading } = useLeaderboard(household?.id || null);

  const currentMember = members.find(m => m.id === user?.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Bonjour {currentMember?.display_name || 'vous'} 👋
          </h1>
          <p className="text-lg text-muted-foreground">
            Voici un aperçu de l'activité de votre foyer
          </p>
        </div>

        <QuickTaskButton />

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="h-96 bg-white dark:bg-gray-800 rounded-lg animate-pulse" />
            <div className="h-96 bg-white dark:bg-gray-800 rounded-lg animate-pulse" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <BalanceChart leaderboard={leaderboard} />
            <LeaderboardCard leaderboard={leaderboard} />
          </div>
        )}
      </div>
    </div>
  );
}
