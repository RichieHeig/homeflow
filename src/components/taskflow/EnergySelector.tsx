import { Battery, BatteryMedium, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { EnergyLevel } from '@/lib/taskAlgorithm';

interface EnergySelectorProps {
  value: EnergyLevel;
  onChange: (level: EnergyLevel) => void;
}

export default function EnergySelector({ value, onChange }: EnergySelectorProps) {
  const energyOptions = [
    {
      level: 'low' as EnergyLevel,
      label: 'Fatigué',
      emoji: '😴',
      gradient: 'from-red-400 to-orange-500',
      icon: Battery,
      description: 'Petites tâches seulement',
    },
    {
      level: 'medium' as EnergyLevel,
      label: 'Normal',
      emoji: '😊',
      gradient: 'from-yellow-400 to-orange-400',
      icon: BatteryMedium,
      description: 'Énergie habituelle',
    },
    {
      level: 'high' as EnergyLevel,
      label: 'En forme',
      emoji: '💪',
      gradient: 'from-green-400 to-emerald-500',
      icon: Zap,
      description: 'Prêt pour tout',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Niveau d'énergie
          </h3>
          <p className="text-sm text-muted-foreground">
            Comment vous sentez-vous en ce moment?
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {energyOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = value === option.level;

          return (
            <Card
              key={option.level}
              className={`cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'ring-4 ring-purple-500 ring-offset-2 shadow-xl scale-105'
                  : 'hover:shadow-lg hover:scale-102'
              }`}
              onClick={() => onChange(option.level)}
            >
              <CardContent className={`p-6 bg-gradient-to-br ${option.gradient} text-white`}>
                <div className="text-center space-y-3">
                  <div className="text-5xl">{option.emoji}</div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-2">
                      <Icon className="w-5 h-5" />
                      <h4 className="text-xl font-bold">{option.label}</h4>
                    </div>
                    <p className="text-sm text-white/90">{option.description}</p>
                  </div>
                  {isSelected && (
                    <div className="pt-2">
                      <div className="w-8 h-8 mx-auto rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-white" />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
