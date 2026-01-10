import { Menu, Home, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/stores/useStore';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/contexts/ToastContext';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  const { user, household, clearSession } = useStore();
  const navigate = useNavigate();
  const { success } = useToast();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    clearSession();
    success('Déconnexion réussie');
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-md">
              <Home className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-900 dark:text-white">
                HomeFlow
              </h1>
              {household && (
                <p className="text-xs text-muted-foreground">
                  {household.name}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {user?.email}
            </p>
            <p className="text-xs text-muted-foreground">
              Connecté
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Déconnexion</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
