import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Trophy, Award, ArrowLeft } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

interface PlayerStats {
  totalPoints: number;
  gamesPlayed: number;
  bestAccuracy: number;
  totalGoals: number;
  currentStreak: number;
  bestStreak: number;
}

export function PlayerProfile({ onBack }: { onBack: () => void }) {
  // Mock player data - in real app this would come from backend
  const playerStats: PlayerStats = {
    totalPoints: 1250,
    gamesPlayed: 23,
    bestAccuracy: 87,
    totalGoals: 156,
    currentStreak: 5,
    bestStreak: 12
  };

  const achievements: Achievement[] = [
    {
      id: "first_goal",
      title: "Goal Pertama",
      description: "Cetak goal pertama kamu",
      icon: "⚽",
      unlocked: true
    },
    {
      id: "accuracy_master",
      title: "Master Akurasi",
      description: "Capai akurasi 90% dalam satu permainan",
      icon: "🎯",
      unlocked: true
    },
    {
      id: "streak_5",
      title: "Streak 5",
      description: "Cetak 5 goal berturut-turut",
      icon: "🔥",
      unlocked: true
    },
    {
      id: "hundred_goals",
      title: "Ratus Goal",
      description: "Cetak 100 goal total",
      icon: "💯",
      unlocked: true
    },
    {
      id: "power_striker",
      title: "Power Striker",
      description: "Cetak goal dengan kekuatan maksimal",
      icon: "⚡",
      unlocked: false,
      progress: 3,
      maxProgress: 5
    },
    {
      id: "champion",
      title: "Juara Sejati",
      description: "Capai 2000 poin total",
      icon: "👑",
      unlocked: false,
      progress: 1250,
      maxProgress: 2000
    }
  ];

  const getRank = (points: number) => {
    if (points >= 1500) return { rank: "Juara", emoji: "🥇", color: "bg-yellow-100 text-yellow-800", progress: 100 };
    if (points >= 800) return { rank: "Ahli", emoji: "🥈", color: "bg-gray-100 text-gray-800", progress: (points - 800) / 7 };
    if (points >= 300) return { rank: "Menengah", emoji: "🥉", color: "bg-orange-100 text-orange-800", progress: (points - 300) / 5 };
    return { rank: "Pemula", emoji: "⚽", color: "bg-green-100 text-green-800", progress: points / 3 };
  };

  const currentRank = getRank(playerStats.totalPoints);
  const nextRankPoints = playerStats.totalPoints >= 1500 ? 2000 : 
                        playerStats.totalPoints >= 800 ? 1500 :
                        playerStats.totalPoints >= 300 ? 800 : 300;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button onClick={onBack} variant="secondary" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <h1 className="text-3xl font-bold text-white">👤 Profil Pemain</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Player Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                  👤
                </div>
                <CardTitle>Pemain Juara</CardTitle>
                <Badge className={currentRank.color}>
                  {currentRank.emoji} {currentRank.rank}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Total Poin</span>
                      <span className="font-bold">{playerStats.totalPoints}</span>
                    </div>
                    <Progress value={currentRank.progress} />
                    <div className="text-sm text-gray-600 mt-1">
                      {nextRankPoints - playerStats.totalPoints} poin lagi ke rank berikutnya
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Statistik
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{playerStats.gamesPlayed}</div>
                    <div className="text-sm text-gray-600">Permainan</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{playerStats.totalGoals}</div>
                    <div className="text-sm text-gray-600">Total Goal</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{playerStats.bestAccuracy}%</div>
                    <div className="text-sm text-gray-600">Akurasi Terbaik</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{playerStats.bestStreak}</div>
                    <div className="text-sm text-gray-600">Streak Terbaik</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Achievements */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Pencapaian
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-lg border-2 ${
                        achievement.unlocked
                          ? "bg-green-50 border-green-200"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`text-2xl ${!achievement.unlocked ? "grayscale" : ""}`}>
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-medium ${achievement.unlocked ? "text-green-800" : "text-gray-600"}`}>
                            {achievement.title}
                          </h4>
                          <p className={`text-sm ${achievement.unlocked ? "text-green-600" : "text-gray-500"}`}>
                            {achievement.description}
                          </p>
                          
                          {!achievement.unlocked && achievement.progress && achievement.maxProgress && (
                            <div className="mt-2">
                              <Progress 
                                value={(achievement.progress / achievement.maxProgress) * 100} 
                                className="h-2"
                              />
                              <div className="text-xs text-gray-500 mt-1">
                                {achievement.progress}/{achievement.maxProgress}
                              </div>
                            </div>
                          )}
                          
                          {achievement.unlocked && (
                            <Badge variant="secondary" className="mt-2 bg-green-100 text-green-800">
                              ✓ Terbuka
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Leaderboard */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Papan Peringkat Mingguan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { rank: 1, name: "Ahmad Striker", points: 2350, badge: "🥇" },
                    { rank: 2, name: "Sari Juara", points: 1890, badge: "🥈" },
                    { rank: 3, name: "Budi Champion", points: 1650, badge: "🥉" },
                    { rank: 4, name: "Kamu", points: playerStats.totalPoints, badge: "⚽", isPlayer: true },
                    { rank: 5, name: "Rina Teknik", points: 1100, badge: "⚡" }
                  ].map((player) => (
                    <div
                      key={player.rank}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        player.isPlayer ? "bg-blue-50 border-2 border-blue-200" : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-lg font-bold w-8">#{player.rank}</div>
                        <div className="text-xl">{player.badge}</div>
                        <div>
                          <div className={player.isPlayer ? "font-bold text-blue-800" : "font-medium"}>
                            {player.name}
                          </div>
                        </div>
                      </div>
                      <div className="font-bold text-lg">{player.points}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}