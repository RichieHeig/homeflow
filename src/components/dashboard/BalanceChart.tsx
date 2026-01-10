import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { LeaderboardEntry } from '@/types/database.types';

interface BalanceChartProps {
  leaderboard: LeaderboardEntry[];
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

export default function BalanceChart({ leaderboard }: BalanceChartProps) {
  const { chartData, balanceStatus } = useMemo(() => {
    if (leaderboard.length === 0) {
      return { chartData: [], balanceStatus: { gap: 0, status: 'balanced' as const } };
    }

    const maxScore = Math.max(...leaderboard.map(e => e.score_total));
    const minScore = Math.min(...leaderboard.map(e => e.score_total));
    const gap = maxScore > 0 ? ((maxScore - minScore) / maxScore) * 100 : 0;

    let status: 'balanced' | 'warning' | 'unbalanced';
    if (gap < 15) status = 'balanced';
    else if (gap < 30) status = 'warning';
    else status = 'unbalanced';

    const data = leaderboard.map(entry => ({
      name: entry.display_name,
      score: entry.score_total,
      percentage: maxScore > 0 ? (entry.score_total / maxScore) * 100 : 0,
    }));

    return {
      chartData: data,
      balanceStatus: { gap: Math.round(gap), status },
    };
  }, [leaderboard]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;

    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
        <p className="font-semibold text-gray-900 dark:text-white">{data.name}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Score: <span className="font-bold">{data.score}</span>
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {data.percentage.toFixed(1)}% du maximum
        </p>
      </div>
    );
  };

  const getBalanceIcon = () => {
    switch (balanceStatus.status) {
      case 'balanced':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'unbalanced':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getBalanceText = () => {
    switch (balanceStatus.status) {
      case 'balanced':
        return 'Excellent équilibre';
      case 'warning':
        return 'Équilibre à surveiller';
      case 'unbalanced':
        return 'Déséquilibre important';
    }
  };

  const getBalanceColor = () => {
    switch (balanceStatus.status) {
      case 'balanced':
        return 'text-green-600 dark:text-green-400';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'unbalanced':
        return 'text-red-600 dark:text-red-400';
    }
  };

  if (leaderboard.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Équilibre des contributions</CardTitle>
          <CardDescription>Distribution des scores entre les membres</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            Aucune donnée disponible
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Équilibre des contributions</CardTitle>
            <CardDescription>Distribution des scores entre les membres</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {getBalanceIcon()}
            <span className={`text-sm font-semibold ${getBalanceColor()}`}>
              {getBalanceText()}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
            <Bar dataKey="score" radius={[8, 8, 0, 0]}>
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-muted-foreground text-center">
            Écart entre le plus haut et le plus bas score: <span className="font-semibold">{balanceStatus.gap}%</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
