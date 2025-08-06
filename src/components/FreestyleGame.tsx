import { useState, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Slider } from "./ui/slider";
import { ArrowLeft, Star, Wind, Target } from "lucide-react";

interface GameStats {
  score: number;
  attempts: number;
  goals: number;
  timeLeft: number;
  bestDistance: number;
}

interface GameState {
  distance: number;
  windSpeed: number;
  windDirection: 'left' | 'right' | 'none';
  angle: number;
  power: number;
  goalKeeperPosition: number;
  wallHeight: number;
}

export function FreestyleGame({ onBack }: { onBack: () => void }) {
  const [gameStats, setGameStats] = useState<GameStats>({
    score: 0,
    attempts: 0,
    goals: 0,
    timeLeft: 90,
    bestDistance: 0
  });
  
  const [gameActive, setGameActive] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    distance: 20,
    windSpeed: 0,
    windDirection: 'none',
    angle: 0,
    power: 50,
    goalKeeperPosition: 50,
    wallHeight: 60
  });
  
  const [isKicking, setIsKicking] = useState(false);
  const [ballPosition, setBallPosition] = useState({ x: 50, y: 90 });
  const [kickResult, setKickResult] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameActive && gameStats.timeLeft > 0 && !gameComplete) {
      interval = setInterval(() => {
        setGameStats(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);
    } else if (gameStats.timeLeft === 0 && gameActive) {
      setGameActive(false);
      setGameComplete(true);
    }
    return () => clearInterval(interval);
  }, [gameActive, gameStats.timeLeft, gameComplete]);

  // Generate new free kick setup
  const generateNewKick = useCallback(() => {
    const distances = [18, 20, 25, 30, 35];
    const newDistance = distances[Math.floor(Math.random() * distances.length)];
    const windSpeed = Math.random() * 15; // 0-15 km/h
    const windDirections: ('left' | 'right' | 'none')[] = ['left', 'right', 'none'];
    const windDirection = windDirections[Math.floor(Math.random() * windDirections.length)];
    
    setGameState({
      distance: newDistance,
      windSpeed: windSpeed,
      windDirection: windDirection,
      angle: 0,
      power: 50,
      goalKeeperPosition: Math.random() * 60 + 20, // 20-80% position
      wallHeight: 40 + (newDistance - 18) * 2 // Wall gets higher with distance
    });

    setBallPosition({ x: 50, y: 90 });
    setKickResult(null);
  }, []);

  const startGame = () => {
    setGameActive(true);
    setGameComplete(false);
    setCountdown(3);
    
    setGameStats({
      score: 0,
      attempts: 0,
      goals: 0,
      timeLeft: 90,
      bestDistance: 0
    });

    // Countdown before first kick
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setCountdown(0);
          generateNewKick();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const simulateKick = useCallback(() => {
    if (isKicking || !gameActive) return;
    
    setIsKicking(true);
    
    // Calculate trajectory based on angle, power, wind, and distance
    const baseTrajectory = {
      x: 50 + (gameState.angle * 1.5), // Angle affects horizontal position
      y: 20 + ((100 - gameState.power) * 0.3) // Power affects height
    };

    // Apply wind effect
    let windEffect = 0;
    if (gameState.windDirection === 'left') {
      windEffect = -gameState.windSpeed * 0.3;
    } else if (gameState.windDirection === 'right') {
      windEffect = gameState.windSpeed * 0.3;
    }

    const finalX = Math.max(0, Math.min(100, baseTrajectory.x + windEffect));
    const finalY = Math.max(10, Math.min(90, baseTrajectory.y));

    // Animate ball trajectory
    let animationStep = 0;
    const animationSteps = 20;
    const startX = 50;
    const startY = 90;

    const animationInterval = setInterval(() => {
      animationStep++;
      const progress = animationStep / animationSteps;
      
      // Parabolic trajectory
      const currentX = startX + (finalX - startX) * progress;
      const currentY = startY - (startY - finalY) * progress - Math.sin(progress * Math.PI) * 20;
      
      setBallPosition({ x: currentX, y: Math.max(10, currentY) });

      if (animationStep >= animationSteps) {
        clearInterval(animationInterval);
        evaluateKick(finalX, finalY);
      }
    }, 50);
  }, [gameActive, gameState, isKicking]);

  const evaluateKick = (finalX: number, finalY: number) => {
    let points = 0;
    let result = "";
    let isGoal = false;

    // Check if ball clears the wall (must be high enough)
    const wallClearance = finalY < gameState.wallHeight;
    
    // Check if ball is on target (goal area is roughly 20-80% horizontally, 10-60% vertically)
    const inGoalX = finalX >= 20 && finalX <= 80;
    const inGoalY = finalY >= 10 && finalY <= 60;
    
    // Check goalkeeper save (if ball is near goalkeeper position)
    const goalKeeperReach = 15; // Goalkeeper can reach 15% in either direction
    const goalKeeperSave = Math.abs(finalX - gameState.goalKeeperPosition) < goalKeeperReach && finalY > 30;

    if (!wallClearance) {
      result = "🧱 TERTAHAN DINDING!";
      points = 0;
    } else if (!inGoalX || !inGoalY) {
      result = "📏 MELESET!";
      points = Math.max(50 - Math.abs(finalX - 50), 0);
    } else if (goalKeeperSave) {
      result = "🥅 DITANGKAP KIPER!";
      points = 100;
    } else {
      // GOAL!
      isGoal = true;
      const distanceBonus = gameState.distance * 10;
      const windBonus = gameState.windSpeed > 0 ? Math.floor(gameState.windSpeed) * 5 : 0;
      const accuracyBonus = Math.max(100 - Math.abs(finalX - 50) * 2, 0);
      
      points = 300 + distanceBonus + windBonus + accuracyBonus;
      
      if (gameState.distance >= 30) {
        result = "🚀 GOAL SPEKTAKULER!";
      } else if (gameState.windSpeed > 10) {
        result = "🌪️ GOAL MELAWAN ANGIN!";
      } else {
        result = "⚽ GOOOAL!";
      }
    }

    setKickResult(result);

    // Update stats
    setGameStats(prev => ({
      ...prev,
      score: prev.score + points,
      attempts: prev.attempts + 1,
      goals: isGoal ? prev.goals + 1 : prev.goals,
      bestDistance: isGoal ? Math.max(prev.bestDistance, gameState.distance) : prev.bestDistance
    }));

    // Reset for next kick after delay
    setTimeout(() => {
      setIsKicking(false);
      setKickResult(null);
      if (gameActive && !gameComplete) {
        generateNewKick();
      }
    }, 3000);
  };

  const getWindIcon = () => {
    if (gameState.windDirection === 'left') return '🡸';
    if (gameState.windDirection === 'right') return '🡺';
    return '🡻';
  };

  const getWindDescription = () => {
    if (gameState.windSpeed < 5) return 'Tenang';
    if (gameState.windSpeed < 10) return 'Lemah';
    if (gameState.windSpeed < 15) return 'Sedang';
    return 'Kencang';
  };

  const getRank = (score: number) => {
    if (score >= 3000) return { rank: "Free Kick Master", emoji: "🌟", color: "text-purple-600" };
    if (score >= 2000) return { rank: "Set Piece Specialist", emoji: "⭐", color: "text-blue-600" };
    if (score >= 1000) return { rank: "Free Kick Pro", emoji: "🎯", color: "text-green-600" };
    return { rank: "Pemula", emoji: "⚽", color: "text-gray-600" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-600 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button onClick={onBack} variant="secondary" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <h1 className="text-3xl font-bold text-white">⭐ Tendangan Bebas</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Game Stats & Controls */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
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
                    <span className={gameStats.timeLeft <= 15 ? "text-red-600 font-bold" : ""}>
                      {Math.floor(gameStats.timeLeft / 60)}:{(gameStats.timeLeft % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                  <Progress value={(gameStats.timeLeft / 90) * 100} className="mb-4" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{gameStats.goals}</div>
                    <div className="text-sm text-gray-600">Goal</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{gameStats.attempts}</div>
                    <div className="text-sm text-gray-600">Percobaan</div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-xl font-bold text-purple-600">{gameStats.bestDistance}m</div>
                  <div className="text-sm text-gray-600">Jarak Terjauh</div>
                </div>

                {gameStats.score > 0 && (
                  <Badge className={getRank(gameStats.score).color}>
                    {getRank(gameStats.score).emoji} {getRank(gameStats.score).rank}
                  </Badge>
                )}
              </CardContent>
            </Card>

            {!gameActive && (
              <Button onClick={startGame} className="w-full" size="lg">
                <Star className="w-5 h-5 mr-2" />
                Mulai Permainan
              </Button>
            )}

            {gameComplete && (
              <Card className="bg-purple-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="text-purple-800">🎉 Permainan Selesai!</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-purple-600">{gameStats.score} Poin</div>
                    <div className={`text-lg ${getRank(gameStats.score).color}`}>
                      {getRank(gameStats.score).emoji} {getRank(gameStats.score).rank}
                    </div>
                    <div className="text-sm text-gray-600">
                      Goal: {gameStats.goals}/{gameStats.attempts}
                    </div>
                    <Button onClick={startGame} className="mt-4">
                      Main Lagi
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Game Conditions */}
            {gameActive && countdown === 0 && (
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-800 text-sm">📊 Kondisi Lapangan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Jarak:</span>
                    <Badge variant="outline">{gameState.distance}m</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm flex items-center gap-1">
                      <Wind className="w-3 h-3" />
                      Angin:
                    </span>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {getWindIcon()} {Math.round(gameState.windSpeed)} km/h
                      </div>
                      <div className="text-xs text-gray-600">{getWindDescription()}</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Kiper:</span>
                    <span className="text-sm font-medium">{Math.round(gameState.goalKeeperPosition)}% posisi</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Controls */}
            {gameActive && countdown === 0 && !isKicking && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">🎯 Kontrol Tendangan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Sudut: {gameState.angle > 0 ? 'Kanan' : gameState.angle < 0 ? 'Kiri' : 'Tengah'} ({gameState.angle}°)
                    </label>
                    <Slider
                      value={[gameState.angle]}
                      onValueChange={([value]) => setGameState(prev => ({ ...prev, angle: value }))}
                      min={-30}
                      max={30}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Kekuatan: {gameState.power}%
                    </label>
                    <Slider
                      value={[gameState.power]}
                      onValueChange={([value]) => setGameState(prev => ({ ...prev, power: value }))}
                      min={20}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>
                  <Button 
                    onClick={simulateKick} 
                    className="w-full" 
                    size="lg"
                    disabled={isKicking}
                  >
                    <Target className="w-4 h-4 mr-2" />
                    TENDANG!
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Game Field */}
          <div className="lg:col-span-2">
            <Card className="h-96 lg:h-[500px]">
              <CardContent className="p-0 h-full relative">
                {countdown > 0 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
                    <div className="text-center text-white">
                      <div className="text-6xl font-bold animate-bounce mb-4">
                        {countdown}
                      </div>
                      <div className="text-xl font-bold">Bersiap-siap...</div>
                    </div>
                  </div>
                )}

                <div className="relative w-full h-full bg-gradient-to-b from-green-300 to-green-500 overflow-hidden rounded-lg">
                  {/* Field markings */}
                  <div 
                    className="absolute inset-0"
                    style={{ 
                      backgroundImage: `
                        linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
                        linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)
                      `,
                      backgroundSize: '20px 20px'
                    }}
                  ></div>

                  {/* Goal */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-20 border-4 border-white bg-white/10"></div>
                  
                  {/* Goal nets */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-20 opacity-30"
                       style={{
                         backgroundImage: `
                           repeating-linear-gradient(0deg, white 0px, white 1px, transparent 1px, transparent 8px),
                           repeating-linear-gradient(90deg, white 0px, white 1px, transparent 1px, transparent 8px)
                         `
                       }}>
                  </div>

                  {/* Goalkeeper */}
                  {gameActive && countdown === 0 && (
                    <div
                      className="absolute top-12 w-6 h-6 bg-yellow-400 rounded-full border-2 border-black animate-pulse"
                      style={{
                        left: `${gameState.goalKeeperPosition}%`,
                        transform: 'translateX(-50%)'
                      }}
                    >
                      🧤
                    </div>
                  )}

                  {/* Player Wall */}
                  {gameActive && countdown === 0 && (
                    <div
                      className="absolute flex gap-2 justify-center"
                      style={{
                        top: `${gameState.wallHeight}%`,
                        left: '35%',
                        width: '30%'
                      }}
                    >
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="w-4 h-6 bg-blue-600 rounded-sm"></div>
                      ))}
                    </div>
                  )}

                  {/* Free kick spot */}
                  {gameActive && countdown === 0 && (
                    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
                  )}

                  {/* Ball */}
                  {gameActive && countdown === 0 && (
                    <div
                      className="absolute w-4 h-4 text-lg transition-all duration-100"
                      style={{
                        left: `${ballPosition.x}%`,
                        top: `${ballPosition.y}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      ⚽
                    </div>
                  )}

                  {/* Wind indicator */}
                  {gameActive && countdown === 0 && gameState.windSpeed > 0 && (
                    <div className="absolute top-4 right-4 bg-white/80 p-2 rounded">
                      <div className="text-sm font-medium flex items-center gap-1">
                        <Wind className="w-4 h-4" />
                        {getWindIcon()} {Math.round(gameState.windSpeed)} km/h
                      </div>
                    </div>
                  )}

                  {/* Distance marker */}
                  {gameActive && countdown === 0 && (
                    <div className="absolute bottom-4 left-4 bg-white/80 p-2 rounded">
                      <div className="text-sm font-medium">{gameState.distance}m</div>
                    </div>
                  )}

                  {/* Kick result */}
                  {kickResult && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                      <div className="text-center text-white">
                        <div className="text-4xl font-bold animate-bounce mb-2">
                          {kickResult}
                        </div>
                      </div>
                    </div>
                  )}

                  {!gameActive && !gameComplete && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="text-white text-center">
                        <h3 className="text-2xl font-bold mb-2">Siap untuk tantangan?</h3>
                        <p>Master teknik tendangan bebas profesional!</p>
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