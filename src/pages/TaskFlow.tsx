import { useState } from 'react';
import { Sparkles, ArrowRight, PartyPopper } from 'lucide-react';
import { useStore } from '@/stores/useStore';
import { useTasks } from '@/hooks/useTasks';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { useToast } from '@/contexts/ToastContext';
import { suggestTasks, type EnergyLevel } from '@/lib/taskAlgorithm';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import TimeSelector from '@/components/taskflow/TimeSelector';
import EnergySelector from '@/components/taskflow/EnergySelector';
import TaskSuggestionCard from '@/components/taskflow/TaskSuggestionCard';
import type { TaskSuggestion } from '@/types';

export default function TaskFlow() {
  const { household, user } = useStore();
  const { tasks, loading: tasksLoading, completeTask } = useTasks(household?.id || null);
  const { leaderboard, loading: leaderboardLoading } = useLeaderboard(household?.id || null);
  const { success, error } = useToast();

  const [step, setStep] = useState<1 | 2>(1);
  const [availableTime, setAvailableTime] = useState(20);
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>('medium');
  const [suggestions, setSuggestions] = useState<TaskSuggestion[]>([]);

  const handleFindTasks = () => {
    if (!user?.id) return;

    const results = suggestTasks({
      tasks,
      availableTime,
      energyLevel,
      currentMemberId: user.id,
      leaderboard,
    });

    setSuggestions(results);
    setStep(2);
  };

  const handleSelectTask = async (taskId: string) => {
    if (!user?.id) return;

    try {
      await completeTask(taskId, user.id);
      success('Tâche terminée! Bravo!');

      setSuggestions(prev => prev.filter(s => s.id !== taskId));

      if (suggestions.length <= 1) {
        setStep(1);
      }
    } catch (err) {
      console.error('Error completing task:', err);
      error('Erreur lors de la validation de la tâche');
    }
  };

  const handleReset = () => {
    setStep(1);
    setSuggestions([]);
  };

  const loading = tasksLoading || leaderboardLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 shadow-2xl mb-4">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            TaskFlow
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Trouvez la tâche parfaite pour vous, maintenant
          </p>
        </div>

        {loading ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4" />
              <p className="text-muted-foreground">Chargement...</p>
            </CardContent>
          </Card>
        ) : step === 1 ? (
          <div className="space-y-6">
            <TimeSelector value={availableTime} onChange={setAvailableTime} />
            <EnergySelector value={energyLevel} onChange={setEnergyLevel} />

            <Card className="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 border-none shadow-2xl">
              <CardContent className="p-8 text-center text-white">
                <h3 className="text-2xl font-bold mb-3">Prêt à être productif?</h3>
                <p className="text-white/90 mb-6 text-lg">
                  Notre algorithme va analyser {tasks.length} tâche{tasks.length > 1 ? 's' : ''} pour trouver les meilleures suggestions
                </p>
                <Button
                  onClick={handleFindTasks}
                  disabled={tasks.length === 0}
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 font-bold text-lg h-14 px-8 shadow-xl"
                >
                  <Sparkles className="w-6 h-6 mr-2" />
                  Trouver mes tâches idéales
                  <ArrowRight className="w-6 h-6 ml-2" />
                </Button>
                {tasks.length === 0 && (
                  <p className="text-white/70 mt-4 text-sm">
                    Aucune tâche disponible. Créez des tâches d'abord!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            <Card className="bg-gradient-to-r from-green-500 to-emerald-500 border-none shadow-xl">
              <CardContent className="p-6 text-white">
                <div className="flex items-center gap-4">
                  <PartyPopper className="w-12 h-12 flex-shrink-0" />
                  <div>
                    <h3 className="text-2xl font-bold mb-1">
                      {suggestions.length} suggestion{suggestions.length > 1 ? 's' : ''} trouvée{suggestions.length > 1 ? 's' : ''}!
                    </h3>
                    <p className="text-white/90">
                      Voici les tâches les plus adaptées à votre situation actuelle
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {suggestions.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Plus de suggestions
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Vous avez terminé toutes les tâches suggérées!
                  </p>
                  <Button onClick={handleReset} variant="outline">
                    Recommencer
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="space-y-4">
                  {suggestions.map((suggestion, index) => (
                    <TaskSuggestionCard
                      key={suggestion.id}
                      suggestion={suggestion}
                      rank={index + 1}
                      onSelect={handleSelectTask}
                    />
                  ))}
                </div>

                <div className="flex justify-center">
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    size="lg"
                    className="font-semibold"
                  >
                    Ajuster mes critères
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
