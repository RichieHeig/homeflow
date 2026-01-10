import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const TIME_OPTIONS = [10, 20, 30];

export default function QuickTaskButton() {
  const navigate = useNavigate();
  const [selectedTime, setSelectedTime] = useState(20);

  const handleFindTask = () => {
    navigate(`/task-flow?time=${selectedTime}`);
  };

  return (
    <Card className="overflow-hidden border-none shadow-lg">
      <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
        <CardContent className="p-0">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Prêt à contribuer?</h3>
                <p className="text-white/80 text-sm">Trouvez votre tâche idéale en quelques secondes</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-white/80" />
                <span className="text-sm text-white/80 font-medium">J'ai du temps disponible:</span>
              </div>

              <div className="flex gap-2">
                {TIME_OPTIONS.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`flex-1 py-2 px-3 rounded-lg font-semibold text-sm transition-all ${
                      selectedTime === time
                        ? 'bg-white text-purple-600 shadow-lg scale-105'
                        : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                    }`}
                  >
                    {time} min
                  </button>
                ))}
              </div>

              <Button
                onClick={handleFindTask}
                size="lg"
                className="w-full bg-white text-purple-600 hover:bg-white/90 shadow-lg font-semibold"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Trouver ma tâche idéale
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
