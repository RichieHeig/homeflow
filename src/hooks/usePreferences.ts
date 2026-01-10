import { useState, useEffect } from 'react';
import {
  loadPreferences,
  savePreferences,
  applyTheme,
  resetPreferences as resetPrefs,
  type UserPreferences,
} from '@/lib/preferences';

export function usePreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(loadPreferences());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const prefs = loadPreferences();
    setPreferences(prefs);
    applyTheme(prefs.theme);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (preferences.theme === 'auto') {
        applyTheme('auto');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [preferences.theme]);

  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    const updated = { ...preferences, [key]: value };
    setPreferences(updated);
    savePreferences(updated);

    if (key === 'theme') {
      applyTheme(value as UserPreferences['theme']);
    }
  };

  const resetPreferences = () => {
    const defaults = resetPrefs();
    setPreferences(defaults);
    applyTheme(defaults.theme);
  };

  return {
    preferences,
    loading,
    updatePreference,
    resetPreferences,
  };
}
