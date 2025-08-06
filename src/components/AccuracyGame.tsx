import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { ArrowLeft, Target, Zap } from "lucide-react";

interface GameStats {
  score: number;
  hits: number;
  misses: number;
  accuracy: number;
  timeLeft: number;
}

export function AccuracyGame({ onBack }: { onBack: () => void }) {
  const [gameStats, setGameStats] = useState<GameStats>({
    score: 0,
    hits: 0,
    misses: 0,
    accuracy: 0,
    timeLeft: 60
  });
  
  const [gameActive, setGameActive] = useState(false);
  const [targetPosition, setTargetPosition] = useState({ x: 50, y: 50 });
  const [showHit, setShowHit] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameActive && gameStats.timeLeft > 0) {
      interval = setInterval(() => {
        setGameStats(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);
    } else if (gameStats.timeLeft === 0) {
      setGameActive(false);
      setGameComplete(true);
    }
    return () => clearInterval(interval);
  }, [gameActive, gameStats.timeLeft]);

  // Move target randomly every 3 seconds
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameActive) {
      interval = setInterval(() => {
        setTargetPosition({
          x: Math.random() * 80 + 10,
          y: Math.random() * 60 + 20
        });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [gameActive]);

  const startGame = () => {
    setGameActive(true);
    setGameStats({
      score: 0,
      hits: 0,
      misses: 0,
      accuracy: 0,
      timeLeft: 60
    });
    setGameComplete(false);
  };

  const handleKick = (x: number, y: number) => {
    if (!gameActive) return;

    const targetX = targetPosition.x;
    const targetY = targetPosition.y;
    const distance = Math.sqrt(Math.pow(x - targetX, 2) + Math.pow(y - targetY, 2));
    
    if (distance < 15) {
      // Hit!
      const points = Math.max(100 - Math.floor(distance * 5), 10);
      setGameStats(prev => {
        const newHits = prev.hits + 1;
        const newScore = prev.score + points;
        const newAccuracy = Math.round((newHits / (newHits + prev.misses)) * 100);
        return {
          ...prev,
          score: newScore,
          hits: newHits,
          accuracy: newAccuracy
        };
      });
      setShowHit(true);
      setTimeout(() => setShowHit(false), 500);
      
      // Move target immediately after hit
      setTargetPosition({
        x: Math.random() * 80 + 10,
        y: Math.random() * 60 + 20
      });
    } else {
      // Miss
      setGameStats(prev => {
        const newMisses = prev.misses + 1;
        const newAccuracy = prev.hits > 0 ? Math.round((prev.hits / (prev.hits + newMisses)) * 100) : 0;
        return {
          ...prev,
          misses: newMisses,
          accuracy: newAccuracy
        };
      });
    }
  };

  const handleFieldClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    handleKick(x, y);
  };

  const getRank = (score: number) => {
    if (score >= 1500) return { rank: "Juara", emoji: "🥇", color: "text-yellow-600" };
    if (score >= 800) return { rank: "Ahli", emoji: "🥈", color: "text-gray-600" };
    if (score >= 300) return { rank: "Menengah", emoji: "🥉", color: "text-orange-600" };
    return { rank: "Pemula", emoji: "⚽", color: "text-green-600" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button onClick={onBack} variant="secondary" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <h1 className="text-3xl font-bold text-white">🎯 Tendangan Akurat</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Game Stats */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Statistik
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Skor</span>
                    <span className="font-bold text-lg">{gameStats.score}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Waktu</span>
                    <span className={gameStats.timeLeft <= 10 ? "text-red-600 font-bold" : ""}>
                      {gameStats.timeLeft}s
                    </span>
                  </div>
                  <Progress value={(gameStats.timeLeft / 60) * 100} className="mb-4" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{gameStats.hits}</div>
                    <div className="text-sm text-gray-600">Tepat Sasaran</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{gameStats.misses}</div>
                    <div className="text-sm text-gray-600">Meleset</div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600">{gameStats.accuracy}%</div>
                  <div className="text-sm text-gray-600">Akurasi</div>
                </div>

                {gameStats.score > 0 && (
                  <Badge className={getRank(gameStats.score).color}>
                    {getRank(gameStats.score).emoji} {getRank(gameStats.score).rank}
                  </Badge>
                )}
              </CardContent>
            </Card>

            {!gameActive && !gameComplete && (
              <Button onClick={startGame} className="w-full" size="lg">
                <Zap className="w-5 h-5 mr-2" />
                Mulai Permainan
              </Button>
            )}

            {gameComplete && (
              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800">🎉 Permainan Selesai!</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-green-600">{gameStats.score} Poin</div>
                    <div className={`text-lg ${getRank(gameStats.score).color}`}>
                      {getRank(gameStats.score).emoji} {getRank(gameStats.score).rank}
                    </div>
                    <Button onClick={startGame} className="mt-4">
                      Main Lagi
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Game Field */}
          <div className="lg:col-span-2">
            <Card className="h-96 lg:h-[500px]">
              <CardContent className="p-0 h-full">
                <div 
                  className="relative w-full h-full bg-gradient-to-b from-green-300 to-green-500 cursor-crosshair overflow-hidden rounded-lg"
                  onClick={handleFieldClick}
                  style={{ 
                    backgroundImage: `
                      linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
                      linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px'
                  }}
                >
                  {/* Goal Posts */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-16 border-4 border-white bg-white/20 rounded-t-lg"></div>
                  
                  {/* Target */}
                  {gameActive && (
                    <div
                      className="absolute w-8 h-8 bg-red-500 rounded-full border-4 border-white shadow-lg animate-pulse"
                      style={{
                        left: `${targetPosition.x}%`,
                        top: `${targetPosition.y}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <div className="absolute inset-1 bg-red-600 rounded-full"></div>
                    </div>
                  )}

                  {/* Hit Effect */}
                  {showHit && (
                    <div
                      className="absolute text-4xl animate-bounce"
                      style={{
                        left: `${targetPosition.x}%`,
                        top: `${targetPosition.y}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      💥
                    </div>
                  )}

                  {/* Ball */}
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-2xl">
                    ⚽
                  </div>

                  {!gameActive && !gameComplete && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="text-white text-center">
                        <h3 className="text-2xl font-bold mb-2">Siap untuk berlatih?</h3>
                        <p>Klik target merah untuk mencetak poin!</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}