export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications_enabled: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  task_reminders: boolean;
  leaderboard_updates: boolean;
  dashboard_view: 'compact' | 'comfortable' | 'spacious';
  quick_complete_enabled: boolean;
  show_in_leaderboard: boolean;
  language: 'fr' | 'en';
  show_task_suggestions: boolean;
  auto_refresh: boolean;
  sound_effects: boolean;
  reduced_motion: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notifications_enabled: true,
  email_notifications: true,
  push_notifications: false,
  task_reminders: true,
  leaderboard_updates: true,
  dashboard_view: 'comfortable',
  quick_complete_enabled: true,
  show_in_leaderboard: true,
  language: 'fr',
  show_task_suggestions: true,
  auto_refresh: true,
  sound_effects: false,
  reduced_motion: false,
};

const STORAGE_KEY = 'homeflow-preferences';

export function loadPreferences(): UserPreferences {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_PREFERENCES, ...parsed };
    }
  } catch (error) {
    console.error('Error loading preferences:', error);
  }
  return DEFAULT_PREFERENCES;
}

export function savePreferences(preferences: UserPreferences): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error('Error saving preferences:', error);
  }
}

export function applyTheme(theme: 'light' | 'dark' | 'auto'): void {
  const root = document.documentElement;

  if (theme === 'auto') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  } else if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export function resetPreferences(): UserPreferences {
  localStorage.removeItem(STORAGE_KEY);
  return DEFAULT_PREFERENCES;
}
