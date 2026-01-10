import { useState } from 'react';
import { User, Mail, Save, X, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useStore } from '@/stores/useStore';
import { useToast } from '@/contexts/ToastContext';
import { updateMemberProfile } from '@/lib/members';

interface ProfileEditorProps {
  member: {
    id: string;
    display_name: string;
    avatar_url: string | null;
  };
  email: string;
  onUpdate: () => void;
}

export default function ProfileEditor({ member, email, onUpdate }: ProfileEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(member.display_name);
  const [avatarUrl, setAvatarUrl] = useState(member.avatar_url || '');
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();

  const handleSave = async () => {
    if (!displayName.trim()) {
      error('Le nom d\'affichage ne peut pas être vide');
      return;
    }

    try {
      setLoading(true);
      await updateMemberProfile(member.id, {
        display_name: displayName.trim(),
        avatar_url: avatarUrl.trim() || null,
      });
      success('Profil mis à jour avec succès');
      setIsEditing(false);
      onUpdate();
    } catch (err) {
      console.error('Error updating profile:', err);
      error('Erreur lors de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setDisplayName(member.display_name);
    setAvatarUrl(member.avatar_url || '');
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg">
            {avatarUrl && isEditing ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : member.avatar_url ? (
              <img
                src={member.avatar_url}
                alt={member.display_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-12 h-12 text-white" />
            )}
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <Label htmlFor="displayName" className="text-sm font-medium">
              Nom d'affichage
            </Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              disabled={!isEditing}
              className="mt-1"
            />
          </div>

          {isEditing && (
            <div>
              <Label htmlFor="avatarUrl" className="text-sm font-medium">
                URL de l'avatar
              </Label>
              <Input
                id="avatarUrl"
                type="url"
                placeholder="https://example.com/avatar.jpg"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="mt-1"
              />
            </div>
          )}

          <div>
            <Label className="text-sm font-medium flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </Label>
            <Input
              type="email"
              value={email}
              disabled
              className="mt-1 bg-gray-50 dark:bg-gray-900"
            />
            <p className="text-xs text-muted-foreground mt-1">
              L'email ne peut pas être modifié
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        {isEditing ? (
          <>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              Enregistrer
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              disabled={loading}
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              Annuler
            </Button>
          </>
        ) : (
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            className="w-full"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Modifier le profil
          </Button>
        )}
      </div>
    </div>
  );
}
