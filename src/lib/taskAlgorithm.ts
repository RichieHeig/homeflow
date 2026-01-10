import type { Task, TaskSuggestion } from '@/types';
import type { LeaderboardEntry } from '@/types/database.types';

export type EnergyLevel = 'low' | 'medium' | 'high';

interface SuggestTasksInput {
  tasks: Task[];
  availableTime: number;
  energyLevel: EnergyLevel;
  currentMemberId: string;
  leaderboard: LeaderboardEntry[];
}

interface ScoredTask extends TaskSuggestion {
  reasons: string[];
}

export function suggestTasks({
  tasks,
  availableTime,
  energyLevel,
  currentMemberId,
  leaderboard,
}: SuggestTasksInput): TaskSuggestion[] {
  const currentMember = leaderboard.find(m => m.member_id === currentMemberId);
  const currentPoints = currentMember?.total_points || 0;
  const averagePoints = leaderboard.length > 0
    ? leaderboard.reduce((sum, m) => sum + m.total_points, 0) / leaderboard.length
    : 0;
  const pointsDeficit = averagePoints - currentPoints;

  const eligibleTasks = tasks.filter(task =>
    !task.deleted_at && task.duration_min <= availableTime
  );

  const scoredTasks: ScoredTask[] = eligibleTasks.map(task => {
    let score = 0;
    const reasons: string[] = [];

    const urgencyScore = calculateUrgencyScore(task);
    score += urgencyScore.score;
    if (urgencyScore.reason) reasons.push(urgencyScore.reason);

    const energyScore = calculateEnergyScore(task.difficulty, energyLevel);
    score += energyScore.score;
    if (energyScore.reason) reasons.push(energyScore.reason);

    const balanceScore = calculateBalanceScore(pointsDeficit);
    score += balanceScore.score;
    if (balanceScore.reason) reasons.push(balanceScore.reason);

    const durationScore = calculateDurationBonus(task.duration_min, availableTime);
    score += durationScore.score;
    if (durationScore.reason) reasons.push(durationScore.reason);

    if (!task.last_completed_at) {
      score += 25;
      reasons.push('Jamais réalisée - nouvelle tâche');
    }

    return {
      id: task.id,
      household_id: task.household_id,
      title: task.title,
      category: task.category,
      duration_min: task.duration_min,
      difficulty: task.difficulty,
      score: Math.max(0, score),
      reason: reasons.join(' • '),
      reasons,
    };
  });

  return scoredTasks
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(({ reasons, ...task }) => task);
}

function calculateUrgencyScore(task: Task): { score: number; reason: string } {
  if (!task.frequency_days || !task.last_completed_at) {
    return { score: 0, reason: '' };
  }

  const lastCompleted = new Date(task.last_completed_at);
  const now = new Date();
  const daysSinceCompleted = Math.floor((now.getTime() - lastCompleted.getTime()) / (1000 * 60 * 60 * 24));
  const daysOverdue = daysSinceCompleted - task.frequency_days;

  if (daysOverdue >= 7) {
    return { score: 100, reason: '🚨 Très en retard (+7 jours)' };
  } else if (daysOverdue >= 3) {
    return { score: 60, reason: '⚠️ En retard (3-6 jours)' };
  } else if (daysOverdue >= 1) {
    return { score: 30, reason: '⏰ Légèrement en retard (1-2 jours)' };
  } else if (daysOverdue >= -1) {
    return { score: 20, reason: '📅 À faire bientôt' };
  }

  return { score: 0, reason: '' };
}

function calculateEnergyScore(difficulty: 1 | 2 | 3, energyLevel: EnergyLevel): { score: number; reason: string } {
  if (energyLevel === 'low') {
    if (difficulty === 1) {
      return { score: 40, reason: '😊 Tâche facile pour votre énergie' };
    } else if (difficulty === 2) {
      return { score: 0, reason: '' };
    } else {
      return { score: -30, reason: '' };
    }
  } else if (energyLevel === 'medium') {
    if (difficulty === 1) {
      return { score: 20, reason: '👍 Bon équilibre énergie/difficulté' };
    } else if (difficulty === 2) {
      return { score: 30, reason: '👍 Parfaitement adapté à votre énergie' };
    } else {
      return { score: 0, reason: '' };
    }
  } else {
    if (difficulty === 3) {
      return { score: 50, reason: '💪 Vous êtes en forme pour ce défi' };
    } else if (difficulty === 2) {
      return { score: 25, reason: '💪 Bonne correspondance avec votre énergie' };
    } else {
      return { score: 15, reason: '' };
    }
  }
}

function calculateBalanceScore(pointsDeficit: number): { score: number; reason: string } {
  if (pointsDeficit >= 100) {
    return { score: 30, reason: '⚖️ Vous aide à rattraper votre retard' };
  } else if (pointsDeficit >= 50) {
    return { score: 15, reason: '⚖️ Contribue à l\'équilibre du foyer' };
  }
  return { score: 0, reason: '' };
}

function calculateDurationBonus(taskDuration: number, availableTime: number): { score: number; reason: string } {
  if (taskDuration < 10 && availableTime < 20) {
    return { score: 20, reason: '⚡ Tâche rapide adaptée à votre temps' };
  }
  return { score: 0, reason: '' };
}
