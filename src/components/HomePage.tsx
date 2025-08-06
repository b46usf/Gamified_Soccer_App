import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Trophy, Target, Zap, Star } from "lucide-react";

interface GameMode {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  difficulty: string;
  points: number;
  color: string;
}

export function HomePage({ onSelectMode }: { onSelectMode: (mode: string) => void }) {
  const gameModes: GameMode[] = [
    {
      id: "accuracy",
      title: "Tendangan Akurat",
      description: "Latih akurasi tendangan ke target sasaran",
      icon: <Target className="w-8 h-8" />,
      difficulty: "Pemula",
      points: 100,
      color: "bg-green-500"
    },
    {
      id: "power",
      title: "Tendangan Kuat",
      description: "Uji kekuatan tendangan dengan power meter",
      icon: <Zap className="w-8 h-8" />,
      difficulty: "Menengah",
      points: 200,
      color: "bg-yellow-500"
    },
    {
      id: "freestyle",
      title: "Tendangan Bebas",
      description: "Master teknik tendangan bebas profesional",
      icon: <Star className="w-8 h-8" />,
      difficulty: "Ahli",
      points: 300,
      color: "bg-red-500"
    },
    {
      id: "penalty",
      title: "Tendangan Penalti",
      description: "Simulasi tendangan penalti seperti juara",
      icon: <Trophy className="w-8 h-8" />,
      difficulty: "Juara",
      points: 500,
      color: "bg-purple-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">⚽ Tendangan Juara</h1>
          <p className="text-xl text-white/90">Master Teknik Tendangan Sepak Bola</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {gameModes.map((mode) => (
            <Card key={mode.id} className="hover:scale-105 transition-transform cursor-pointer">
              <CardHeader className="text-center">
                <div className={`${mode.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white`}>
                  {mode.icon}
                </div>
                <CardTitle className="text-lg">{mode.title}</CardTitle>
                <CardDescription>{mode.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <Badge variant="secondary">{mode.difficulty}</Badge>
                  <span className="text-sm font-medium text-green-600">{mode.points} pts</span>
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => onSelectMode(mode.id)}
                >
                  Mulai Latihan
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-center">🏆 Sistem Pencapaian</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
              <div className="text-center">
                <div className="bg-bronze-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  🥉
                </div>
                <h4>Pemula</h4>
                <p className="text-sm text-white/70">0 - 500 poin</p>
              </div>
              <div className="text-center">
                <div className="bg-silver-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  🥈
                </div>
                <h4>Ahli</h4>
                <p className="text-sm text-white/70">501 - 1500 poin</p>
              </div>
              <div className="text-center">
                <div className="bg-gold-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                  🥇
                </div>
                <h4>Juara</h4>
                <p className="text-sm text-white/70">1500+ poin</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}