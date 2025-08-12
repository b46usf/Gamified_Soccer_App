import { useState, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { ArrowLeft, Trophy, Timer, Target } from "lucide-react";

interface GameStats {
  score: number;
  round: number;
  playerGoals: number;
  computerGoals: number;
  totalShots: number;
  goalsScored: number;
}

interface PenaltyState {
  isPlayerTurn: boolean;
  goalKeeperPosition: number;
  targetPosition: { x: number, y: number } | null;
  ballPosition: { x: number, y: number };
  pressure: number;
  round: number;
  gamePhase: 'selecting' | 'shooting' | 'result' | 'computer-turn';
}

export function PenaltyGame({ onBack }: { onBack: () => void }) {
  const [gameStats, setGameStats] = useState<GameStats>({
    score: 0,
    round: 1,
    playerGoals: 0,
    computerGoals: 0,
    totalShots: 0,
    goalsScored: 0
  });
  
  const [gameActive, setGameActive] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [penaltyState, setPenaltyState] = useState<PenaltyState>({
    isPlayerTurn: true,
    goalKeeperPosition: 50,
    targetPosition: null,
    ballPosition: { x: 50, y: 85 },
    pressure: 0,
    round: 1,
    gamePhase: 'selecting'
  });
  
  const [countdown, setCountdown] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [pressureTimer, setPressureTimer] = useState(5);
  const [isKicking, setIsKicking] = useState(false);

  // Goalkeeper movement
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameActive && penaltyState.gamePhase === 'selecting' && penaltyState.isPlayerTurn) {
      interval = setInterval(() => {
        setPenaltyState(prev => ({
          ...prev,
          goalKeeperPosition: 30 + Math.sin(Date.now() / 500) * 15 + 15 // Oscillates between 30-60
        }));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [gameActive, penaltyState.gamePhase, penaltyState.isPlayerTurn]);

  // Pressure timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameActive && penaltyState.gamePhase === 'selecting' && penaltyState.isPlayerTurn && pressureTimer > 0) {
      interval = setInterval(() => {
        setPressureTimer(prev => {
          if (prev <= 1) {
            // Auto shoot at center if time runs out
            handleShoot(50, 40);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameActive, penaltyState.gamePhase, penaltyState.isPlayerTurn, pressureTimer]);

  const startGame = () => {
    setGameActive(true);
    setGameComplete(false);
    setCountdown(3);
    
    setGameStats({
      score: 0,
      round: 1,
      playerGoals: 0,
      computerGoals: 0,
      totalShots: 0,
      goalsScored: 0
    });

    setPenaltyState({
      isPlayerTurn: true,
      goalKeeperPosition: 50,
      targetPosition: null,
      ballPosition: { x: 50, y: 85 },
      pressure: 0,
      round: 1,
      gamePhase: 'selecting'
    });

    // Countdown before first penalty
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setCountdown(0);
          setPressureTimer(5);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleGoalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!gameActive || penaltyState.gamePhase !== 'selecting' || !penaltyState.isPlayerTurn) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Only allow shots within goal area (roughly 20-80% horizontally, 20-70% vertically)
    const clampedX = Math.max(20, Math.min(80, x));
    const clampedY = Math.max(20, Math.min(70, y));
    
    setPenaltyState(prev => ({
      ...prev,
      targetPosition: { x: clampedX, y: clampedY }
    }));
  };

  const handleShoot = useCallback((targetX?: number, targetY?: number) => {
    if (!gameActive || penaltyState.gamePhase !== 'selecting' || !penaltyState.isPlayerTurn || isKicking) return;

    const finalTarget = targetX && targetY ? 
      { x: targetX, y: targetY } : 
      penaltyState.targetPosition;

    if (!finalTarget) return;

    setIsKicking(true);
    setPenaltyState(prev => ({ ...prev, gamePhase: 'shooting' }));

    // Animate ball to target
    let animationStep = 0;
    const animationSteps = 15;
    const startX = 50;
    const startY = 85;

    const animationInterval = setInterval(() => {
      animationStep++;
      const progress = animationStep / animationSteps;
      
      const currentX = startX + (finalTarget.x - startX) * progress;
      const currentY = startY + (finalTarget.y - startY) * progress;
      
      setPenaltyState(prev => ({
        ...prev,
        ballPosition: { x: currentX, y: currentY }
      }));

      if (animationStep >= animationSteps) {
        clearInterval(animationInterval);
        evaluatePenalty(finalTarget.x, finalTarget.y);
      }
    }, 80);
  }, [gameActive, penaltyState.gamePhase, penaltyState.isPlayerTurn, penaltyState.targetPosition, isKicking]);

  const evaluatePenalty = (targetX: number, targetY: number) => {
    const goalKeeperReach = 25; // Goalkeeper can reach 25% in either direction
    const isInGoal = targetX >= 20 && targetX <= 80 && targetY >= 20 && targetY <= 70;
    const goalKeeperSave = Math.abs(targetX - penaltyState.goalKeeperPosition) < goalKeeperReach && targetY > 40;
    
    let isGoal = false;
    let resultText = "";
    let points = 0;

    if (!isInGoal) {
      resultText = "📏 MELESET!";
      points = 0;
    } else if (goalKeeperSave) {
      resultText = "🧤 DITANGKAP KIPER!";
      points = 50;
    } else {
      isGoal = true;
      points = 200 + (pressureTimer * 50); // Bonus for quick decision
      
      // Special goals
      if ((targetX < 30 || targetX > 70) && targetY < 40) {
        resultText = "🚀 GOAL SUDUT ATAS!";
        points += 100;
      } else if (targetY < 35) {
        resultText = "⚡ GOAL ATAS!";
        points += 50;
      } else {
        resultText = "⚽ GOOOAL!";
      }
    }

    setResult(resultText);
    setPenaltyState(prev => ({ ...prev, gamePhase: 'result' }));

    // Update stats
    setGameStats(prev => ({
      ...prev,
      score: prev.score + points,
      totalShots: prev.totalShots + 1,
      goalsScored: isGoal ? prev.goalsScored + 1 : prev.goalsScored,
      playerGoals: isGoal ? prev.playerGoals + 1 : prev.playerGoals
    }));

    // Move to computer turn after delay
    setTimeout(() => {
      setResult(null);
      setIsKicking(false);
      computerTurn();
    }, 2500);
  };

  const computerTurn = () => {
    setPenaltyState(prev => ({ 
      ...prev, 
      isPlayerTurn: false, 
      gamePhase: 'computer-turn',
      ballPosition: { x: 50, y: 85 },
      targetPosition: null
    }));

    // Computer shoots after 2 seconds
    setTimeout(() => {
      const computerAccuracy = 0.7; // 70% chance to score
      const isComputerGoal = Math.random() < computerAccuracy;
      
      if (isComputerGoal) {
        setResult("🤖 KOMPUTER MENCETAK GOAL!");
        setGameStats(prev => ({ ...prev, computerGoals: prev.computerGoals + 1 }));
      } else {
        setResult("❌ KOMPUTER GAGAL!");
      }

      setTimeout(() => {
        setResult(null);
        nextRound();
      }, 2000);
    }, 2000);
  };

  const nextRound = () => {
    const nextRoundNum = penaltyState.round + 1;
    
    // Check if game should end (best of 5, or sudden death after 5)
    if (nextRoundNum > 5) {
      if (gameStats.playerGoals !== gameStats.computerGoals) {
        endGame();
        return;
      }
      // Continue to sudden death
    }

    setPenaltyState(prev => ({
      ...prev,
      isPlayerTurn: true,
      gamePhase: 'selecting',
      round: nextRoundNum,
      targetPosition: null,
      ballPosition: { x: 50, y: 85 },
      goalKeeperPosition: 50
    }));

    setGameStats(prev => ({ ...prev, round: nextRoundNum }));
    setPressureTimer(5);
  };

  const endGame = () => {
    setGameActive(false);
    setGameComplete(true);
    
    const isWinner = gameStats.playerGoals > gameStats.computerGoals;
    setResult(isWinner ? "🏆 KAMU MENANG!" : "😢 KAMU KALAH!");
  };

  const getRank = (score: number) => {
    if (score >= 1500) return { rank: "Penalty Master", emoji: "🏆", color: "text-gold-600" };
    if (score >= 1000) return { rank: "Penalty Expert", emoji: "⭐", color: "text-purple-600" };
    if (score >= 500) return { rank: "Penalty Pro", emoji: "🎯", color: "text-blue-600" };
    return { rank: "Pemula", emoji: "⚽", color: "text-green-600" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-600 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button onClick={onBack} variant="secondary" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <h1 className="text-3xl font-bold text-white">🏆 Tendangan Penalti</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Game Stats & Controls */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Skor Penalty Shootout
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">
                    {gameStats.playerGoals} - {gameStats.computerGoals}
                  </div>
                  <div className="text-sm text-gray-600">
                    Round {gameStats.round} {gameStats.round > 5 ? "(Sudden Death)" : "/ 5"}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-600">{gameStats.totalShots}</div>
                    <div className="text-sm text-gray-600">Total Tendangan</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-600">{gameStats.goalsScored}</div>
                    <div className="text-sm text-gray-600">Goal Tercetak</div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{gameStats.score}</div>
                  <div className="text-sm text-gray-600">Poin Total</div>
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
                <Trophy className="w-5 h-5 mr-2" />
                Mulai Penalty Shootout
              </Button>
            )}

            {gameComplete && (
              <Card className="bg-purple-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="text-purple-800">🎉 Penalty Shootout Selesai!</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold mb-2">
                      {gameStats.playerGoals > gameStats.computerGoals ? "🏆 MENANG!" : "😢 KALAH!"}
                    </div>
                    <div className="text-2xl font-bold text-purple-600">{gameStats.score} Poin</div>
                    <div className={`text-lg ${getRank(gameStats.score).color}`}>
                      {getRank(gameStats.score).emoji} {getRank(gameStats.score).rank}
                    </div>
                    <div className="text-sm text-gray-600">
                      Akurasi: {gameStats.totalShots > 0 ? Math.round((gameStats.goalsScored / gameStats.totalShots) * 100) : 0}%
                    </div>
                    <Button onClick={startGame} className="mt-4">
                      Main Lagi
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Pressure Timer */}
            {gameActive && penaltyState.isPlayerTurn && penaltyState.gamePhase === 'selecting' && countdown === 0 && (
              <Card className="bg-red-50 border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-800 flex items-center gap-2">
                    <Timer className="w-4 h-4" />
                    Tekanan Waktu!
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600 mb-2">{pressureTimer}</div>
                    <Progress value={(pressureTimer / 5) * 100} className="mb-2" />
                    <div className="text-sm text-red-600">Pilih target dan tendang sebelum waktu habis!</div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Instructions */}
            {gameActive && penaltyState.isPlayerTurn && penaltyState.gamePhase === 'selecting' && countdown === 0 && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="text-center">
                    <h3 className="font-bold text-blue-800 mb-2">🎯 Instruksi</h3>
                    <div className="text-sm text-blue-600 space-y-1">
                      <p>1. Klik pada area gawang untuk memilih target</p>
                      <p>2. Tekan tombol TENDANG untuk menendang</p>
                      <p>3. Hindari jangkauan kiper yang bergerak!</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Game Field */}
          <div className="lg:col-span-2">
            <Card className="h-96 lg:h-[500px]">
              <CardContent className="p-0 h-full relative">
                {countdown > 0 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                    <div className="text-center text-white">
                      <div className="text-6xl font-bold animate-bounce mb-4">{countdown}</div>
                      <div className="text-xl font-bold">Penalty Shootout dimulai...</div>
                    </div>
                  </div>
                )}

                <div className="relative w-full h-full bg-gradient-to-b from-green-300 to-green-500 overflow-hidden rounded-lg">
                  {/* Field markings */}
                  <div className="absolute inset-0"
                       style={{ 
                         backgroundImage: `
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)
                         `,
                         backgroundSize: '20px 20px'
                       }}>
                  </div>

                  {/* Goal */}
                  <div 
                    className="absolute top-0 left-1/2 transform -translate-x-1/2 w-48 h-32 border-4 border-white bg-white/10 cursor-crosshair"
                    onClick={handleGoalClick}
                  >
                    {/* Goal net pattern */}
                    <div className="absolute inset-0 opacity-30"
                         style={{
                           backgroundImage: `
                             repeating-linear-gradient(0deg, white 0px, white 1px, transparent 1px, transparent 8px),
                             repeating-linear-gradient(90deg, white 0px, white 1px, transparent 1px, transparent 8px)
                           `
                         }}>
                    </div>
                  </div>

                  {/* Goalkeeper */}
                  {gameActive && countdown === 0 && (
                    <div
                      className="absolute top-24 w-8 h-12 transition-all duration-100"
                      style={{
                        left: `${penaltyState.goalKeeperPosition}%`,
                        transform: 'translateX(-50%)'
                      }}
                    >
                      <div className="text-2xl">🧤</div>
                    </div>
                  )}

                  {/* Target indicator */}
                  {penaltyState.targetPosition && penaltyState.gamePhase === 'selecting' && (
                    <div
                      className="absolute w-6 h-6 bg-red-500 rounded-full border-2 border-white animate-pulse"
                      style={{
                        left: `${penaltyState.targetPosition.x}%`,
                        top: `${penaltyState.targetPosition.y}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <div className="absolute inset-1 bg-red-600 rounded-full"></div>
                    </div>
                  )}

                  {/* Ball */}
                  {gameActive && countdown === 0 && (
                    <div
                      className="absolute w-6 h-6 text-2xl transition-all duration-100"
                      style={{
                        left: `${penaltyState.ballPosition.x}%`,
                        top: `${penaltyState.ballPosition.y}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      ⚽
                    </div>
                  )}

                  {/* Penalty spot */}
                  <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white rounded-full"></div>

                  {/* Kick button */}
                  {gameActive && penaltyState.isPlayerTurn && penaltyState.gamePhase === 'selecting' && penaltyState.targetPosition && countdown === 0 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                      <Button
                        onClick={() => handleShoot(100, 200)}
                        size="lg"
                        className="bg-red-600 hover:bg-red-700 animate-pulse"
                        disabled={isKicking}
                      >
                        <Target className="w-4 h-4 mr-2" />
                        TENDANG!
                      </Button>
                    </div>
                  )}

                  {/* Turn indicator */}
                  {gameActive && countdown === 0 && (
                    <div className="absolute top-4 left-4 bg-white/90 p-3 rounded-lg">
                      <div className="text-sm font-medium">
                        {penaltyState.isPlayerTurn ? (
                          penaltyState.gamePhase === 'selecting' ? '🎯 Giliran Kamu - Pilih Target!' : 
                          penaltyState.gamePhase === 'shooting' ? '⚽ Menendang...' : ''
                        ) : (
                          '🤖 Giliran Komputer...'
                        )}
                      </div>
                    </div>
                  )}

                  {/* Result display */}
                  {result && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                      <div className="text-center text-white">
                        <div className="text-4xl font-bold animate-bounce mb-4">{result}</div>
                      </div>
                    </div>
                  )}

                  {!gameActive && !gameComplete && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="text-white text-center">
                        <h3 className="text-2xl font-bold mb-2">Siap untuk Penalty Shootout?</h3>
                        <p>Tunjukkan kemampuan tendangan penalti terbaikmu!</p>
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