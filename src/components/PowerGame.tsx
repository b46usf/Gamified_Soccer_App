import { useState, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { ArrowLeft, Zap, Timer } from "lucide-react";

interface GameStats {
  score: number;
  kicks: number;
  perfectKicks: number;
  averagePower: number;
  timeLeft: number;
  bestPower: number;
}

export function PowerGame({ onBack }: { onBack: () => void }) {
  const [gameStats, setGameStats] = useState<GameStats>({
    score: 0,
    kicks: 0,
    perfectKicks: 0,
    averagePower: 0,
    timeLeft: 60,
    bestPower: 0
  });
  
  const [gameActive, setGameActive] = useState(false);
  const [powerMeter, setPowerMeter] = useState(0);
  const [meterDirection, setMeterDirection] = useState(1);
  const [meterSpeed, setMeterSpeed] = useState(2);
  const [canKick, setCanKick] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [lastKickPower, setLastKickPower] = useState<number | null>(null);
  const [kickEffect, setKickEffect] = useState<string | null>(null);
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
      setCanKick(false);
    }
    return () => clearInterval(interval);
  }, [gameActive, gameStats.timeLeft, gameComplete]);

  // Power meter animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameActive && canKick && !gameComplete) {
      interval = setInterval(() => {
        setPowerMeter(prev => {
          const newValue = prev + meterDirection * meterSpeed;
          if (newValue >= 100) {
            setMeterDirection(-1);
            return 100;
          } else if (newValue <= 0) {
            setMeterDirection(1);
            return 0;
          }
          return newValue;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [gameActive, canKick, meterDirection, meterSpeed, gameComplete]);

  const startGame = () => {
    setGameActive(true);
    setGameComplete(false);
    setCanKick(false);
    setPowerMeter(0);
    setMeterDirection(1);
    setMeterSpeed(2);
    setLastKickPower(null);
    setKickEffect(null);
    setCountdown(3);
    
    setGameStats({
      score: 0,
      kicks: 0,
      perfectKicks: 0,
      averagePower: 0,
      timeLeft: 60,
      bestPower: 0
    });

    // Countdown before first kick
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setCountdown(0);
          setCanKick(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleKick = useCallback(() => {
    if (!canKick || !gameActive || gameComplete) return;

    const kickPower = Math.round(powerMeter);
    setLastKickPower(kickPower);
    setCanKick(false);

    // Calculate score based on power
    let points = 0;
    let effect = "";
    
    if (kickPower >= 95) {
      points = 500;
      effect = "🔥 PERFECT!";
    } else if (kickPower >= 85) {
      points = 300;
      effect = "💪 HEBAT!";
    } else if (kickPower >= 70) {
      points = 200;
      effect = "👍 BAGUS!";
    } else if (kickPower >= 50) {
      points = 100;
      effect = "⚡ LUMAYAN";
    } else {
      points = 50;
      effect = "😅 LEMAH";
    }

    setKickEffect(effect);
    setTimeout(() => setKickEffect(null), 1500);

    // Update stats
    setGameStats(prev => {
      const newKicks = prev.kicks + 1;
      const newPerfectKicks = kickPower >= 95 ? prev.perfectKicks + 1 : prev.perfectKicks;
      const newScore = prev.score + points;
      const newTotalPower = (prev.averagePower * prev.kicks) + kickPower;
      const newAveragePower = newKicks > 0 ? Math.round(newTotalPower / newKicks) : 0;
      const newBestPower = Math.max(prev.bestPower, kickPower);

      return {
        ...prev,
        score: newScore,
        kicks: newKicks,
        perfectKicks: newPerfectKicks,
        averagePower: newAveragePower,
        bestPower: newBestPower
      };
    });

    // Increase difficulty slightly
    setMeterSpeed(prev => Math.min(prev + 0.2, 4));

    // Reset for next kick after 2 seconds
    setTimeout(() => {
      if (gameActive && !gameComplete) {
        setPowerMeter(0);
        setMeterDirection(1);
        setLastKickPower(null);
        setCanKick(true);
      }
    }, 2000);
  }, [canKick, gameActive, powerMeter, gameComplete]);

  // Keyboard event for spacebar
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        handleKick();
      }
    };

    if (gameActive && canKick) {
      window.addEventListener('keydown', handleKeyPress);
      return () => {
        window.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, [handleKick, gameActive, canKick]);

  const getPowerColor = (power: number) => {
    if (power >= 95) return "bg-red-500";
    if (power >= 85) return "bg-orange-500";
    if (power >= 70) return "bg-yellow-500";
    if (power >= 50) return "bg-blue-500";
    return "bg-gray-500";
  };

  const getPowerZone = (power: number) => {
    if (power >= 95) return "PERFECT";
    if (power >= 85) return "HEBAT";
    if (power >= 70) return "BAGUS";
    if (power >= 50) return "LUMAYAN";
    return "LEMAH";
  };

  const getRank = (score: number) => {
    if (score >= 2000) return { rank: "Power Master", emoji: "🔥", color: "text-red-600" };
    if (score >= 1200) return { rank: "Strong Striker", emoji: "💪", color: "text-orange-600" };
    if (score >= 600) return { rank: "Power Player", emoji: "⚡", color: "text-yellow-600" };
    return { rank: "Pemula", emoji: "⚽", color: "text-green-600" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button onClick={onBack} variant="secondary" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <h1 className="text-3xl font-bold text-white">⚡ Tendangan Kuat</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Game Stats */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
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
                    <div className="text-2xl font-bold text-blue-600">{gameStats.kicks}</div>
                    <div className="text-sm text-gray-600">Total Tendangan</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{gameStats.perfectKicks}</div>
                    <div className="text-sm text-gray-600">Perfect Kicks</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-600">{gameStats.averagePower}%</div>
                    <div className="text-sm text-gray-600">Rata-rata Power</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-purple-600">{gameStats.bestPower}%</div>
                    <div className="text-sm text-gray-600">Power Terbaik</div>
                  </div>
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
                <Zap className="w-5 h-5 mr-2" />
                Mulai Permainan
              </Button>
            )}

            {gameComplete && (
              <Card className="bg-orange-50 border-orange-200">
                <CardHeader>
                  <CardTitle className="text-orange-800">🎉 Permainan Selesai!</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-orange-600">{gameStats.score} Poin</div>
                    <div className={`text-lg ${getRank(gameStats.score).color}`}>
                      {getRank(gameStats.score).emoji} {getRank(gameStats.score).rank}
                    </div>
                    <div className="text-sm text-gray-600">
                      Perfect Kicks: {gameStats.perfectKicks}/{gameStats.kicks}
                    </div>
                    <Button onClick={startGame} className="mt-4">
                      Main Lagi
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {gameActive && canKick && (
              <Card className="bg-red-50 border-red-200 animate-pulse">
                <CardContent className="p-4">
                  <div className="text-center">
                    <h3 className="font-bold text-red-800 mb-2">🎯 SIAP TENDANG!</h3>
                    <p className="text-sm text-red-600">Tekan tombol TENDANG atau SPASI saat meter di zona hijau!</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Game Area */}
          <div className="lg:col-span-2">
            <Card className="h-96 lg:h-[500px]">
              <CardContent className="p-6 h-full flex flex-col justify-center">
                {countdown > 0 && (
                  <div className="text-center">
                    <div className="text-6xl font-bold text-red-600 animate-bounce mb-4">
                      {countdown}
                    </div>
                    <div className="text-xl font-bold text-gray-600">Bersiap-siap...</div>
                  </div>
                )}

                {gameActive && countdown === 0 && (
                  <>
                    {/* Power Meter */}
                    <div className="mb-8">
                      <div className="text-center mb-4">
                        <h3 className="text-2xl font-bold mb-2">Power Meter</h3>
                        {lastKickPower !== null && (
                          <div className="text-lg font-bold">
                            Tendangan Terakhir: {lastKickPower}% - {getPowerZone(lastKickPower)}
                          </div>
                        )}
                      </div>
                      
                      {/* Power Gauge */}
                      <div className="relative">
                        <div className="h-8 bg-gray-200 rounded-full overflow-hidden mb-4">
                          {/* Perfect Zone (95-100%) */}
                          <div 
                            className="absolute top-0 h-full bg-green-400 opacity-50"
                            style={{ left: '95%', width: '5%' }}
                          ></div>
                          {/* Great Zone (85-95%) */}
                          <div 
                            className="absolute top-0 h-full bg-yellow-400 opacity-50"
                            style={{ left: '85%', width: '10%' }}
                          ></div>
                          {/* Good Zone (70-85%) */}
                          <div 
                            className="absolute top-0 h-full bg-orange-400 opacity-50"
                            style={{ left: '70%', width: '15%' }}
                          ></div>
                          
                          {/* Power Bar */}
                          <div 
                            className={`h-full transition-all duration-75 ${getPowerColor(powerMeter)}`}
                            style={{ width: `${powerMeter}%` }}
                          ></div>
                        </div>
                        
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>0%</span>
                          <span>50%</span>
                          <span className="text-orange-600">70%</span>
                          <span className="text-yellow-600">85%</span>
                          <span className="text-green-600">95%</span>
                          <span>100%</span>
                        </div>
                      </div>

                      {/* Current Power Display */}
                      <div className="text-center mb-6">
                        <div className="text-4xl font-bold mb-2">{Math.round(powerMeter)}%</div>
                        <div className={`text-lg font-bold ${
                          powerMeter >= 95 ? 'text-green-600' :
                          powerMeter >= 85 ? 'text-yellow-600' :
                          powerMeter >= 70 ? 'text-orange-600' :
                          'text-gray-600'
                        }`}>
                          {getPowerZone(powerMeter)}
                        </div>
                      </div>
                    </div>

                    {/* Kick Button */}
                    <div className="text-center mb-4">
                      {canKick ? (
                        <Button 
                          onClick={handleKick}
                          size="lg"
                          className="px-12 py-6 text-xl font-bold bg-red-600 hover:bg-red-700 animate-pulse"
                        >
                          ⚽ TENDANG!
                        </Button>
                      ) : (
                        <div className="text-gray-500">
                          <Timer className="w-6 h-6 mx-auto mb-2" />
                          Bersiap untuk tendangan berikutnya...
                        </div>
                      )}
                    </div>

                    {/* Instructions */}
                    {canKick && (
                      <div className="text-center text-sm text-gray-600 bg-yellow-100 p-3 rounded-lg">
                        <div className="font-bold mb-1">💡 Cara Bermain:</div>
                        <div>Tekan tombol <strong>TENDANG</strong> saat meter berada di zona hijau (95-100%)</div>
                        <div>Atau tekan tombol <strong>SPASI</strong> di keyboard</div>
                      </div>
                    )}
                  </>
                )}

                {/* Kick Effect */}
                {kickEffect && (
                  <div className="text-center mt-4">
                    <div className="text-3xl font-bold animate-bounce text-red-600">
                      {kickEffect}
                    </div>
                  </div>
                )}

                {!gameActive && !gameComplete && (
                  <div className="text-center text-gray-500">
                    <div className="text-2xl mb-4">⚽</div>
                    <div className="text-lg">Tekan "Mulai Permainan" untuk bermain</div>
                    <div className="text-sm mt-2">Uji kemampuan timing dan kekuatan tendanganmu!</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}