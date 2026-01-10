import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface SettingsSectionProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

export default function SettingsSection({
  title,
  description,
  icon: Icon,
  children,
}: SettingsSectionProps) {
  return (
    <Card className="border-2 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {title}
            </h2>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        <div className="space-y-4">{children}</div>
      </CardContent>
    </Card>
  );
}
