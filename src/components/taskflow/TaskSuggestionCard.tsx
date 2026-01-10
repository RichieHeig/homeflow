import { CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { TaskSuggestion } from '@/types';
import { getCategoryConfig, DIFFICULTY_LABELS } from '@/lib/tasks';

interface TaskSuggestionCardProps {
  suggestion: TaskSuggestion;
  rank: number;
  onSelect: (taskId: string) => void;
}

const RANK_EMOJI = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];

export default function TaskSuggestionCard({ suggestion, rank, onSelect }: TaskSuggestionCardProps) {
  const category = getCategoryConfig(suggestion.category);
  const difficulty = DIFFICULTY_LABELS[suggestion.difficulty];
  const reasons = suggestion.reason.split(' • ').filter(r => r.trim());

  const getRankColor = () => {
    if (rank === 1) return 'from-yellow-400 to-orange-500';
    if (rank === 2) return 'from-gray-300 to-gray-500';
    if (rank === 3) return 'from-orange-400 to-orange-600';
    return 'from-blue-400 to-blue-600';
  };

  return (
    <Card className="relative overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 hover:border-blue-400">
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${getRankColor()}`} />

      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br ${getRankColor()} flex items-center justify-center text-3xl shadow-lg`}>
            {RANK_EMOJI[rank - 1] || '⭐'}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {suggestion.title}
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={`${category.color} text-white`}>
                    {category.emoji} {category.label}
                  </Badge>
                  <Badge className={difficulty.color}>
                    {difficulty.icon} {difficulty.label}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {suggestion.duration_min} min
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {suggestion.score}
                </div>
                <div className="text-xs text-muted-foreground">points</div>
              </div>
            </div>

            {reasons.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
                  Pourquoi cette tâche?
                </h4>
                <ul className="space-y-2">
                  {reasons.map((reason, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-blue-800 dark:text-blue-300">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button
              onClick={() => onSelect(suggestion.id)}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold h-12 text-base shadow-lg"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Je fais cette tâche
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
