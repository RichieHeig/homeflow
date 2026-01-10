import { Users, Crown, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { LeaderboardEntry } from '@/types/database.types';

interface MemberStatsProps {
  members: LeaderboardEntry[];
}

export default function MemberStats({ members }: MemberStatsProps) {
  const totalMembers = members.length;
  const adminCount = members.filter(m => m.role === 'admin').length;
  const avgPoints = totalMembers > 0
    ? Math.round(members.reduce((sum, m) => sum + m.total_points, 0) / totalMembers)
    : 0;

  const stats = [
    {
      label: 'Total membres',
      value: totalMembers,
      icon: Users,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      darkBgGradient: 'dark:from-blue-950 dark:to-cyan-950',
    },
    {
      label: 'Administrateurs',
      value: adminCount,
      icon: Crown,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
      darkBgGradient: 'dark:from-purple-950 dark:to-pink-950',
    },
    {
      label: 'Points moyens',
      value: avgPoints,
      icon: TrendingUp,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50',
      darkBgGradient: 'dark:from-green-950 dark:to-emerald-950',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.label}
            className={`bg-gradient-to-br ${stat.bgGradient} ${stat.darkBgGradient} border-none shadow-lg hover:shadow-xl transition-all duration-200`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-4xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
