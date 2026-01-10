import { useMemo } from 'react';
import { Crown, Medal } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { LeaderboardEntry } from '@/types/database.types';

interface LeaderboardCardProps {
  leaderboard: LeaderboardEntry[];
}

const RANK_EMOJIS = ['🥇', '🥈', '🥉'];
const PROGRESS_COLORS = [
  'bg-blue-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-amber-500',
  'bg-green-500',
];

export default function LeaderboardCard({ leaderboard }: LeaderboardCardProps) {
  const rankedLeaderboard = useMemo(() => {
    const maxScore = Math.max(...leaderboard.map(e => e.score_total), 1);

    return leaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1,
      percentage: (entry.score_total / maxScore) * 100,
      color: PROGRESS_COLORS[index % PROGRESS_COLORS.length],
    }));
  }, [leaderboard]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (leaderboard.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Classement</CardTitle>
          <CardDescription>Les membres les plus actifs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-muted-foreground">
            Aucun membre à afficher
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Classement</CardTitle>
        <CardDescription>Les membres les plus actifs</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rankedLeaderboard.map((entry) => (
            <div
              key={entry.member_id}
              className="flex items-center gap-4 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="relative flex-shrink-0">
                  {entry.avatar_url ? (
                    <img
                      src={entry.avatar_url}
                      alt={entry.display_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                      {getInitials(entry.display_name)}
                    </div>
                  )}
                  {entry.rank <= 3 && (
                    <div className="absolute -top-1 -right-1 text-lg">
                      {RANK_EMOJIS[entry.rank - 1]}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900 dark:text-white truncate">
                      {entry.display_name}
                    </span>
                    {entry.role === 'admin' && (
                      <Badge variant="secondary" className="flex items-center gap-1 px-1.5 py-0">
                        <Crown className="w-3 h-3" />
                        <span className="text-xs">Admin</span>
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${entry.color} transition-all duration-500`}
                        style={{ width: `${entry.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {entry.percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {entry.score_total}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Medal className="w-3 h-3" />
                  <span>{entry.tasks_completed} tâches</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
