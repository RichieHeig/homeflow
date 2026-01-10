import { useState, useMemo } from 'react';
import { Plus, ListTodo } from 'lucide-react';
import { useStore } from '@/stores/useStore';
import { useTasks } from '@/hooks/useTasks';
import { useToast } from '@/contexts/ToastContext';
import { createTask, updateTask, deleteTask, getCategoryConfig } from '@/lib/tasks';
import { Button } from '@/components/ui/button';
import TaskCard from '@/components/tasks/TaskCard';
import TaskForm, { type TaskFormData } from '@/components/tasks/TaskForm';
import TaskFilters, { type TaskFiltersState } from '@/components/tasks/TaskFilters';
import type { Task } from '@/types/database.types';

export default function Tasks() {
  const { household, user, members } = useStore();
  const { tasks, loading, completeTask, refetch } = useTasks(household?.id || null);
  const { success, error: showError } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState<TaskFiltersState>({
    search: '',
    category: 'all',
    difficulty: 'all',
    sortBy: 'recent',
  });

  const currentMember = members.find(m => m.id === user?.id);

  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(task =>
        task.title.toLowerCase().includes(searchLower)
      );
    }

    if (filters.category !== 'all') {
      result = result.filter(task => task.category === filters.category);
    }

    if (filters.difficulty !== 'all') {
      result = result.filter(task => task.difficulty === parseInt(filters.difficulty));
    }

    switch (filters.sortBy) {
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'duration':
        result.sort((a, b) => a.duration_min - b.duration_min);
        break;
      case 'difficulty':
        result.sort((a, b) => a.difficulty - b.difficulty);
        break;
      case 'recent':
      default:
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    return result;
  }, [tasks, filters]);

  const tasksByCategory = useMemo(() => {
    const grouped: Record<string, Task[]> = {};

    filteredAndSortedTasks.forEach(task => {
      if (!grouped[task.category]) {
        grouped[task.category] = [];
      }
      grouped[task.category].push(task);
    });

    return grouped;
  }, [filteredAndSortedTasks]);

  const handleCreateOrUpdate = async (data: TaskFormData) => {
    if (!household?.id) return;

    try {
      if (editingTask) {
        await updateTask(editingTask.id, data);
        success('Tâche modifiée avec succès');
      } else {
        await createTask({
          ...data,
          household_id: household.id,
        });
        success('Tâche créée avec succès');
      }

      setShowForm(false);
      setEditingTask(null);
      refetch();
    } catch (err) {
      console.error('Error saving task:', err);
      showError('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm('Voulez-vous vraiment supprimer cette tâche?')) return;

    try {
      await deleteTask(taskId);
      success('Tâche supprimée avec succès');
      refetch();
    } catch (err) {
      console.error('Error deleting task:', err);
      showError('Erreur lors de la suppression');
    }
  };

  const handleComplete = async (taskId: string) => {
    if (!currentMember?.id) return;

    try {
      await completeTask(taskId, currentMember.id);
      success('Tâche complétée avec succès');
    } catch (err) {
      console.error('Error completing task:', err);
      showError('Erreur lors de la complétion');
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <ListTodo className="w-8 h-8" />
              Gestion des tâches
            </h1>
            <p className="text-lg text-muted-foreground mt-1">
              Organisez et suivez toutes les tâches du foyer
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingTask(null);
              setShowForm(true);
            }}
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nouvelle tâche
          </Button>
        </div>

        <TaskFilters
          filters={filters}
          onFiltersChange={setFilters}
          resultCount={filteredAndSortedTasks.length}
        />

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-white dark:bg-gray-800 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filteredAndSortedTasks.length === 0 ? (
          <div className="text-center py-16">
            <ListTodo className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Aucune tâche trouvée
            </h3>
            <p className="text-muted-foreground mb-6">
              {tasks.length === 0
                ? 'Commencez par créer votre première tâche'
                : 'Essayez de modifier vos filtres'
              }
            </p>
            {tasks.length === 0 && (
              <Button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Plus className="w-5 h-5 mr-2" />
                Créer une tâche
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(tasksByCategory).map(([categoryValue, categoryTasks]) => {
              const category = getCategoryConfig(categoryValue);
              return (
                <div key={categoryValue}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`${category.color} text-white px-3 py-1.5 rounded-lg flex items-center gap-2`}>
                      <span className="text-xl">{category.emoji}</span>
                      <span className="font-semibold">{category.label}</span>
                      <span className="bg-white/20 px-2 py-0.5 rounded text-sm">
                        {categoryTasks.length}
                      </span>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {categoryTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onComplete={handleComplete}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {showForm && household?.id && (
          <TaskForm
            task={editingTask}
            householdId={household.id}
            onSubmit={handleCreateOrUpdate}
            onClose={handleCloseForm}
          />
        )}
      </div>
    </div>
  );
}
