import { Settings as SettingsIcon, Palette, Bell, Eye, Sliders, Shield, RotateCcw, User } from 'lucide-react';
import { usePreferences } from '@/hooks/usePreferences';
import { useMembers } from '@/hooks/useMembers';
import { useStore } from '@/stores/useStore';
import { Button } from '@/components/ui/button';
import SettingsSection from '@/components/settings/SettingsSection';
import SettingToggle from '@/components/settings/SettingToggle';
import SettingSelect from '@/components/settings/SettingSelect';
import ProfileEditor from '@/components/settings/ProfileEditor';
import DangerZone from '@/components/settings/DangerZone';
import { useToast } from '@/contexts/ToastContext';

export default function Settings() {
  const { preferences, updatePreference, resetPreferences } = usePreferences();
  const { household, user } = useStore();
  const { members, refetch: refetchMembers } = useMembers(household?.id || null);
  const { success } = useToast();

  const currentMember = members.find(m => m.id === user?.id);
  const userEmail = user?.email || '';

  const handleResetPreferences = () => {
    resetPreferences();
    success('Préférences réinitialisées');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
            <SettingsIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Paramètres
            </h1>
            <p className="text-muted-foreground">
              Personnalisez votre expérience HomeFlow
            </p>
          </div>
        </div>

        {currentMember && (
          <SettingsSection
            title="Profil"
            description="Gérez vos informations personnelles"
            icon={User}
          >
            <ProfileEditor
              member={currentMember}
              email={userEmail}
              onUpdate={refetchMembers}
            />
          </SettingsSection>
        )}

        <SettingsSection
          title="Apparence"
          description="Personnalisez l'apparence de l'application"
          icon={Palette}
        >
          <SettingSelect
            label="Thème"
            description="Choisissez le thème de l'application"
            value={preferences.theme}
            options={[
              { value: 'light', label: 'Clair' },
              { value: 'dark', label: 'Sombre' },
              { value: 'auto', label: 'Automatique (système)' },
            ]}
            onChange={(value) => updatePreference('theme', value as 'light' | 'dark' | 'auto')}
          />

          <SettingSelect
            label="Vue du tableau de bord"
            description="Ajustez la densité de l'affichage"
            value={preferences.dashboard_view}
            options={[
              { value: 'compact', label: 'Compact' },
              { value: 'comfortable', label: 'Confortable' },
              { value: 'spacious', label: 'Spacieux' },
            ]}
            onChange={(value) => updatePreference('dashboard_view', value as 'compact' | 'comfortable' | 'spacious')}
          />

          <SettingSelect
            label="Langue"
            description="Langue de l'interface"
            value={preferences.language}
            options={[
              { value: 'fr', label: 'Français' },
              { value: 'en', label: 'English' },
            ]}
            onChange={(value) => updatePreference('language', value as 'fr' | 'en')}
          />
        </SettingsSection>

        <SettingsSection
          title="Notifications"
          description="Configurez vos préférences de notifications"
          icon={Bell}
        >
          <SettingToggle
            label="Activer les notifications"
            description="Recevoir des notifications générales"
            checked={preferences.notifications_enabled}
            onChange={(value) => updatePreference('notifications_enabled', value)}
          />

          <SettingToggle
            label="Notifications par email"
            description="Recevoir des emails pour les événements importants"
            checked={preferences.email_notifications}
            onChange={(value) => updatePreference('email_notifications', value)}
            disabled={!preferences.notifications_enabled}
          />

          <SettingToggle
            label="Notifications push"
            description="Recevoir des notifications push sur vos appareils"
            checked={preferences.push_notifications}
            onChange={(value) => updatePreference('push_notifications', value)}
            disabled={!preferences.notifications_enabled}
          />

          <SettingToggle
            label="Rappels de tâches"
            description="Être notifié des tâches en retard"
            checked={preferences.task_reminders}
            onChange={(value) => updatePreference('task_reminders', value)}
            disabled={!preferences.notifications_enabled}
          />

          <SettingToggle
            label="Mises à jour du classement"
            description="Être notifié des changements dans le leaderboard"
            checked={preferences.leaderboard_updates}
            onChange={(value) => updatePreference('leaderboard_updates', value)}
            disabled={!preferences.notifications_enabled}
          />
        </SettingsSection>

        <SettingsSection
          title="Affichage"
          description="Options d'affichage et d'accessibilité"
          icon={Eye}
        >
          <SettingToggle
            label="Afficher les suggestions de tâches"
            description="Voir les suggestions intelligentes sur le dashboard"
            checked={preferences.show_task_suggestions}
            onChange={(value) => updatePreference('show_task_suggestions', value)}
          />

          <SettingToggle
            label="Mouvement réduit"
            description="Réduire les animations pour une meilleure accessibilité"
            checked={preferences.reduced_motion}
            onChange={(value) => updatePreference('reduced_motion', value)}
          />
        </SettingsSection>

        <SettingsSection
          title="Comportement"
          description="Personnalisez le comportement de l'application"
          icon={Sliders}
        >
          <SettingToggle
            label="Validation rapide"
            description="Permettre la validation rapide des tâches sans confirmation"
            checked={preferences.quick_complete_enabled}
            onChange={(value) => updatePreference('quick_complete_enabled', value)}
          />

          <SettingToggle
            label="Actualisation automatique"
            description="Actualiser automatiquement les données"
            checked={preferences.auto_refresh}
            onChange={(value) => updatePreference('auto_refresh', value)}
          />

          <SettingToggle
            label="Effets sonores"
            description="Jouer des sons lors des actions"
            checked={preferences.sound_effects}
            onChange={(value) => updatePreference('sound_effects', value)}
          />
        </SettingsSection>

        <SettingsSection
          title="Vie privée"
          description="Contrôlez vos données et votre visibilité"
          icon={Shield}
        >
          <SettingToggle
            label="Apparaître dans le classement"
            description="Afficher vos statistiques dans le leaderboard du foyer"
            checked={preferences.show_in_leaderboard}
            onChange={(value) => updatePreference('show_in_leaderboard', value)}
          />
        </SettingsSection>

        <div className="flex justify-center">
          <Button
            onClick={handleResetPreferences}
            variant="outline"
            size="lg"
            className="font-semibold"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Réinitialiser les préférences
          </Button>
        </div>

        <DangerZone />
      </div>
    </div>
  );
}
