import { useState } from 'react';
import { Crown, MoreVertical, Shield, ShieldOff, UserMinus, Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { LeaderboardEntry } from '@/types/database.types';

interface MemberCardProps {
  member: LeaderboardEntry;
  rank: number;
  isCurrentUser: boolean;
  isAdmin: boolean;
  onPromote?: (memberId: string) => void;
  onDemote?: (memberId: string) => void;
  onRemove?: (memberId: string) => void;
}

const RANK_COLORS = {
  1: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
  2: 'bg-gradient-to-br from-gray-300 to-gray-500',
  3: 'bg-gradient-to-br from-orange-400 to-orange-600',
};

const RANK_ICONS = {
  1: '🥇',
  2: '🥈',
  3: '🥉',
};

export default function MemberCard({
  member,
  rank,
  isCurrentUser,
  isAdmin,
  onPromote,
  onDemote,
  onRemove,
}: MemberCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const getRankBadge = () => {
    if (rank <= 3) {
      return (
        <div className={`absolute -top-2 -right-2 w-10 h-10 rounded-full ${RANK_COLORS[rank as 1 | 2 | 3]} flex items-center justify-center text-2xl shadow-lg z-10 border-4 border-white dark:border-gray-800`}>
          {RANK_ICONS[rank as 1 | 2 | 3]}
        </div>
      );
    }
    return null;
  };

  const contributionPercent = member.contribution_percent || 0;
  const progressColor = contributionPercent >= 30 ? 'bg-green-500' : contributionPercent >= 20 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-200">
      {getRankBadge()}
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {member.avatar_url ? (
                <img src={member.avatar_url} alt={member.display_name} className="w-full h-full rounded-full object-cover" />
              ) : (
                member.display_name.charAt(0).toUpperCase()
              )}
            </div>
            {rank <= 3 && (
              <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 rounded-full p-1">
                <Trophy className="w-4 h-4 text-yellow-500" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">
                {member.display_name}
              </h3>
              {member.role === 'admin' && (
                <Badge className="bg-purple-500 text-white flex items-center gap-1 px-2 py-0.5">
                  <Crown className="w-3 h-3" />
                  Admin
                </Badge>
              )}
              {isCurrentUser && (
                <Badge variant="secondary" className="px-2 py-0.5">
                  Vous
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {member.total_points}
                </div>
                <div className="text-xs text-muted-foreground">Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {member.tasks_completed}
                </div>
                <div className="text-xs text-muted-foreground">Tâches</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {contributionPercent.toFixed(0)}%
                </div>
                <div className="text-xs text-muted-foreground">Contrib.</div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Contribution</span>
                <span>{contributionPercent.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className={`${progressColor} h-full transition-all duration-500 rounded-full`}
                  style={{ width: `${Math.min(contributionPercent, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {isAdmin && !isCurrentUser && (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowMenu(!showMenu)}
              >
                <MoreVertical className="w-4 h-4" />
              </Button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 top-10 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-20 min-w-[180px]">
                    {member.role === 'member' ? (
                      <button
                        onClick={() => {
                          onPromote?.(member.member_id);
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-sm"
                      >
                        <Shield className="w-4 h-4 text-purple-600" />
                        Promouvoir admin
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          onDemote?.(member.member_id);
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-sm"
                      >
                        <ShieldOff className="w-4 h-4 text-gray-600" />
                        Retirer admin
                      </button>
                    )}
                    <button
                      onClick={() => {
                        onRemove?.(member.member_id);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 text-sm text-red-600"
                    >
                      <UserMinus className="w-4 h-4" />
                      Retirer du foyer
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
