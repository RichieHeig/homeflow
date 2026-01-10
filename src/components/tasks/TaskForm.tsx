import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TASK_CATEGORIES, DIFFICULTY_LABELS, FREQUENCY_OPTIONS } from '@/lib/tasks';
import type { Task } from '@/types/database.types';

interface TaskFormProps {
  task?: Task | null;
  householdId: string;
  onSubmit: (data: TaskFormData) => void;
  onClose: () => void;
}

export interface TaskFormData {
  title: string;
  category: string;
  duration_min: number;
  difficulty: 1 | 2 | 3;
  frequency_days: number | null;
}

export default function TaskForm({ task, householdId, onSubmit, onClose }: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: task?.title || '',
    category: task?.category || 'autre',
    duration_min: task?.duration_min || 20,
    difficulty: task?.difficulty || 2,
    frequency_days: task?.frequency_days || null,
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        category: task.category,
        duration_min: task.duration_min,
        difficulty: task.difficulty,
        frequency_days: task.frequency_days,
      });
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {task ? 'Modifier la tâche' : 'Nouvelle tâche'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Titre de la tâche</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Faire la vaisselle"
              required
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label>Catégorie</Label>
            <div className="grid grid-cols-2 gap-3">
              {TASK_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat.value })}
                  className={`p-3 rounded-lg border-2 transition-all flex items-center gap-3 ${
                    formData.category === cat.value
                      ? `${cat.color} text-white border-transparent shadow-lg scale-105`
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <span className="text-2xl">{cat.emoji}</span>
                  <span className="font-medium">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Durée estimée: {formData.duration_min} min</Label>
            <input
              id="duration"
              type="range"
              min="5"
              max="120"
              step="5"
              value={formData.duration_min}
              onChange={(e) => setFormData({ ...formData, duration_min: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>5 min</span>
              <span>120 min</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Difficulté</Label>
            <div className="grid grid-cols-3 gap-3">
              {(Object.entries(DIFFICULTY_LABELS) as [string, typeof DIFFICULTY_LABELS[1]][]).map(([level, diff]) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFormData({ ...formData, difficulty: parseInt(level) as 1 | 2 | 3 })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.difficulty === parseInt(level)
                      ? `${diff.color} border-transparent shadow-lg scale-105`
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="text-3xl mb-1">{diff.icon}</div>
                  <div className="text-sm font-medium">{diff.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency">Fréquence</Label>
            <select
              id="frequency"
              value={formData.frequency_days === null ? 'null' : formData.frequency_days}
              onChange={(e) => setFormData({
                ...formData,
                frequency_days: e.target.value === 'null' ? null : parseInt(e.target.value)
              })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {FREQUENCY_OPTIONS.map((opt) => (
                <option key={opt.value === null ? 'null' : opt.value} value={opt.value === null ? 'null' : opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Annuler
            </Button>
            <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              {task ? 'Modifier' : 'Créer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
