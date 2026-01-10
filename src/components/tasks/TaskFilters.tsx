import { Search, RotateCcw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TASK_CATEGORIES, DIFFICULTY_LABELS } from '@/lib/tasks';

export interface TaskFiltersState {
  search: string;
  category: string;
  difficulty: string;
  sortBy: 'title' | 'duration' | 'difficulty' | 'recent';
}

interface TaskFiltersProps {
  filters: TaskFiltersState;
  onFiltersChange: (filters: TaskFiltersState) => void;
  resultCount: number;
}

const SORT_OPTIONS = [
  { value: 'recent', label: 'Plus récentes' },
  { value: 'title', label: 'Titre (A-Z)' },
  { value: 'duration', label: 'Durée' },
  { value: 'difficulty', label: 'Difficulté' },
] as const;

export default function TaskFilters({ filters, onFiltersChange, resultCount }: TaskFiltersProps) {
  const handleReset = () => {
    onFiltersChange({
      search: '',
      category: 'all',
      difficulty: 'all',
      sortBy: 'recent',
    });
  };

  const hasActiveFilters =
    filters.search !== '' ||
    filters.category !== 'all' ||
    filters.difficulty !== 'all' ||
    filters.sortBy !== 'recent';

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={filters.search}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
              placeholder="Rechercher..."
              className="pl-10"
            />
          </div>

          <select
            value={filters.category}
            onChange={(e) => onFiltersChange({ ...filters, category: e.target.value })}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
          >
            <option value="all">Toutes les catégories</option>
            {TASK_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.emoji} {cat.label}
              </option>
            ))}
          </select>

          <select
            value={filters.difficulty}
            onChange={(e) => onFiltersChange({ ...filters, difficulty: e.target.value })}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
          >
            <option value="all">Toutes difficultés</option>
            {Object.entries(DIFFICULTY_LABELS).map(([level, diff]) => (
              <option key={level} value={level}>
                {diff.icon} {diff.label}
              </option>
            ))}
          </select>

          <select
            value={filters.sortBy}
            onChange={(e) => onFiltersChange({ ...filters, sortBy: e.target.value as TaskFiltersState['sortBy'] })}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                Trier par: {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-muted-foreground">
            {resultCount} tâche{resultCount !== 1 ? 's' : ''} trouvée{resultCount !== 1 ? 's' : ''}
          </span>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-blue-600 hover:text-blue-700"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Réinitialiser
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
