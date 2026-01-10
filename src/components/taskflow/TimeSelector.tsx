import { Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TimeSelectorProps {
  value: number;
  onChange: (minutes: number) => void;
}

const QUICK_TIMES = [5, 10, 15, 20, 30, 45, 60];

export default function TimeSelector({ value, onChange }: TimeSelectorProps) {
  return (
    <Card className="bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-800">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Temps disponible
            </h3>
            <p className="text-sm text-muted-foreground">
              Combien de temps avez-vous maintenant?
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-2">
            {QUICK_TIMES.map((time) => (
              <Button
                key={time}
                variant={value === time ? 'default' : 'outline'}
                onClick={() => onChange(time)}
                className={`h-12 ${
                  value === time
                    ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-none'
                    : 'hover:border-blue-300'
                }`}
              >
                {time} min
              </Button>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Ou personnalisez
              </label>
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {value} min
              </span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="5"
                max="120"
                step="5"
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-500"
                style={{
                  background: `linear-gradient(to right, rgb(59, 130, 246) 0%, rgb(59, 130, 246) ${((value - 5) / 115) * 100}%, rgb(229, 231, 235) ${((value - 5) / 115) * 100}%, rgb(229, 231, 235) 100%)`,
                }}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>5 min</span>
                <span>120 min</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
