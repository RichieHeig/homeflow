import { Clock, Pencil, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getCategoryConfig, DIFFICULTY_LABELS } from '@/lib/tasks';
import type { Task } from '@/types/database.types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onComplete: (taskId: string) => void;
}

export default function TaskCard({ task, onEdit, onDelete, onComplete }: TaskCardProps) {
  const category = getCategoryConfig(task.category);
  const difficulty = DIFFICULTY_LABELS[task.difficulty];

  const isOverdue = task.frequency_days && task.last_completed_at
    ? new Date().getTime() - new Date(task.last_completed_at).getTime() > task.frequency_days * 24 * 60 * 60 * 1000
    : false;

  return (
    <Card className="group hover:shadow-lg transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                  {task.title}
                </h3>
              </div>
              <Badge className={`${category.color} text-white flex items-center gap-1 px-2 py-0.5 flex-shrink-0`}>
                <span>{category.emoji}</span>
                <span className="text-xs">{category.label}</span>
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{task.duration_min} min</span>
              </div>

              <Badge variant="secondary" className={`${difficulty.color} flex items-center gap-1 px-2 py-0.5`}>
                <span>{difficulty.icon}</span>
                <span className="text-xs">{difficulty.label}</span>
              </Badge>

              {task.frequency_days && (
                <span className="text-xs">
                  Tous les {task.frequency_days} jour{task.frequency_days > 1 ? 's' : ''}
                </span>
              )}

              {isOverdue && (
                <Badge variant="destructive" className="flex items-center gap-1 px-2 py-0.5">
                  <AlertCircle className="w-3 h-3" />
                  <span className="text-xs">En retard</span>
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={() => onEdit(task)}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => onDelete(task.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
              onClick={() => onComplete(task.id)}
            >
              <CheckCircle className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
