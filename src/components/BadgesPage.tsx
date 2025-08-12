import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { ArrowLeft, Trophy, Award, Star, Target, Zap } from "lucide-react";

interface BadgeItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export function BadgesPage({ onBack }: { onBack: () => void }) {
  // Mock badges data - in real app this would come from backend/state
  const badges: BadgeItem[] = [
    {
      id: 'first_kick',
      name: 'Tendangan Pertama',
      description: 'Lakukan tendangan pertama kamu',
      icon: '⚽',
      category: 'Pemula',
      unlocked: true,
      rarity: 'common'
    },
    {
      id: 'accuracy_master',
      name: 'Master Akurasi',
      description: 'Capai akurasi 90% dalam permainan',
      icon: '🎯',
      category: 'Skill',
      unlocked: true,
      rarity: 'rare'
    },
    {
      id: 'power_striker',
      name: 'Power Striker',
      description: 'Cetak 5 tendangan dengan power 95%+',
      icon: '💪',
      category: 'Power',
      unlocked: true,
      progress: 3,
      maxProgress: 5,
      rarity: 'epic'
    },
    {
      id: 'quiz_champion',
      name: 'Juara Quiz',
      description: 'Dapatkan nilai A dalam quiz PJOK',
      icon: '🧠',
      category: 'Pengetahuan',
      unlocked: true,
      rarity: 'rare'
    },
    {
      id: 'penalty_expert',
      name: 'Ahli Penalti',
      description: 'Menang 3 penalty shootout berturut-turut',
      icon: '🏆',
      category: 'Kompetisi',
      unlocked: false,
      progress: 1,
      maxProgress: 3,
      rarity: 'epic'
    },
    {
      id: 'freestyle_legend',
      name: 'Legenda Tendangan Bebas',
      description: 'Cetak 10 goal dari tendangan bebas',
      icon: '⭐',
      category: 'Skill',
      unlocked: false,
      progress: 6,
      maxProgress: 10,
      rarity: 'legendary'
    },
    {
      id: 'speed_demon',
      name: 'Speed Demon',
      description: 'Selesaikan 10 tantangan dalam waktu record',
      icon: '⚡',
      category: 'Speed',
      unlocked: false,
      progress: 4,
      maxProgress: 10,
      rarity: 'epic'
    },
    {
      id: 'perfect_score',
      name: 'Skor Sempurna',
      description: 'Dapatkan skor 100% dalam satu permainan',
      icon: '💯',
      category: 'Prestasi',
      unlocked: false,
      rarity: 'legendary'
    },
    {
      id: 'consistent_player',
      name: 'Pemain Konsisten',
      description: 'Main selama 7 hari berturut-turut',
      icon: '📅',
      category: 'Dedikasi',
      unlocked: false,
      progress: 3,
      maxProgress: 7,
      rarity: 'rare'
    },
    {
      id: 'goal_machine',
      name: 'Mesin Pencetak Goal',
      description: 'Cetak total 100 goal di semua mode',
      icon: '🔥',
      category: 'Prestasi',
      unlocked: false,
      progress: 67,
      maxProgress: 100,
      rarity: 'legendary'
    },
    {
      id: 'teacher_favorite',
      name: 'Kesayangan Guru',
      description: 'Selesaikan semua materi pembelajaran',
      icon: '👨‍🏫',
      category: 'Pembelajaran',
      unlocked: false,
      progress: 2,
      maxProgress: 5,
      rarity: 'epic'
    },
    {
      id: 'ultimate_champion',
      name: 'Juara Sejati',
      description: 'Buka semua lencana lainnya',
      icon: '👑',
      category: 'Ultimate',
      unlocked: false,
      progress: 4,
      maxProgress: 11,
      rarity: 'legendary'
    }
  ];

  const getRarityColor = (rarity: BadgeItem['rarity']) => {
    switch (rarity) {
      case 'common': return 'border-gray-400 bg-gray-50';
      case 'rare': return 'border-blue-400 bg-blue-50';
      case 'epic': return 'border-purple-400 bg-purple-50';
      case 'legendary': return 'border-yellow-400 bg-yellow-50';
    }
  };

  const getRarityText = (rarity: BadgeItem['rarity']) => {
    switch (rarity) {
      case 'common': return 'Umum';
      case 'rare': return 'Langka';
      case 'epic': return 'Epik';
      case 'legendary': return 'Legendaris';
    }
  };

  const getRarityTextColor = (rarity: BadgeItem['rarity']) => {
    switch (rarity) {
      case 'common': return 'text-gray-600';
      case 'rare': return 'text-blue-600';
      case 'epic': return 'text-purple-600';
      case 'legendary': return 'text-yellow-600';
    }
  };

  const categories = [...new Set(badges.map(badge => badge.category))];
  const unlockedCount = badges.filter(badge => badge.unlocked).length;
  const totalCount = badges.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-600 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button onClick={onBack} variant="secondary" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <h1 className="text-3xl font-bold text-white">🏆 Koleksi Lencana</h1>
        </div>

        {/* Progress Overview */}
        <Card className="bg-white/95 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-6 h-6" />
              Progress Koleksi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="text-2xl font-bold text-purple-600">
                {unlockedCount}/{totalCount}
              </div>
              <div className="text-sm text-gray-600">
                {Math.round((unlockedCount / totalCount) * 100)}% Selesai
              </div>
            </div>
            <Progress value={(unlockedCount / totalCount) * 100} className="h-3" />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center">
                <div className="text-xl font-bold text-gray-600">
                  {badges.filter(b => b.rarity === 'common' && b.unlocked).length}/
                  {badges.filter(b => b.rarity === 'common').length}
                </div>
                <div className="text-sm text-gray-600">Umum</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">
                  {badges.filter(b => b.rarity === 'rare' && b.unlocked).length}/
                  {badges.filter(b => b.rarity === 'rare').length}
                </div>
                <div className="text-sm text-blue-600">Langka</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-purple-600">
                  {badges.filter(b => b.rarity === 'epic' && b.unlocked).length}/
                  {badges.filter(b => b.rarity === 'epic').length}
                </div>
                <div className="text-sm text-purple-600">Epik</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-yellow-600">
                  {badges.filter(b => b.rarity === 'legendary' && b.unlocked).length}/
                  {badges.filter(b => b.rarity === 'legendary').length}
                </div>
                <div className="text-sm text-yellow-600">Legendaris</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        {categories.map(category => (
          <div key={category} className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              {category === 'Pemula' && <Target className="w-6 h-6" />}
              {category === 'Skill' && <Star className="w-6 h-6" />}
              {category === 'Power' && <Zap className="w-6 h-6" />}
              {category === 'Pengetahuan' && <Award className="w-6 h-6" />}
              {category === 'Kompetisi' && <Trophy className="w-6 h-6" />}
              {category === 'Speed' && <Zap className="w-6 h-6" />}
              {category === 'Prestasi' && <Award className="w-6 h-6" />}
              {category === 'Dedikasi' && <Star className="w-6 h-6" />}
              {category === 'Pembelajaran' && <Award className="w-6 h-6" />}
              {category === 'Ultimate' && <Trophy className="w-6 h-6" />}
              {category}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {badges.filter(badge => badge.category === category).map(badge => (
                <Card 
                  key={badge.id} 
                  className={`${getRarityColor(badge.rarity)} border-2 ${
                    badge.unlocked ? '' : 'opacity-60 grayscale'
                  } transition-all hover:scale-105`}
                >
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className={`text-4xl mb-3 ${badge.unlocked ? '' : 'grayscale'}`}>
                        {badge.icon}
                      </div>
                      <h3 className="font-bold text-lg mb-2">{badge.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{badge.description}</p>
                      
                      <Badge 
                        variant="secondary" 
                        className={getRarityTextColor(badge.rarity)}
                      >
                        {getRarityText(badge.rarity)}
                      </Badge>
                      
                      {badge.unlocked ? (
                        <div className="mt-3">
                          <Badge className="bg-green-100 text-green-800">
                            ✓ Terbuka
                          </Badge>
                        </div>
                      ) : badge.progress && badge.maxProgress ? (
                        <div className="mt-3">
                          <Progress 
                            value={(badge.progress / badge.maxProgress) * 100} 
                            className="h-2 mb-2"
                          />
                          <div className="text-xs text-gray-600">
                            {badge.progress}/{badge.maxProgress}
                          </div>
                        </div>
                      ) : (
                        <div className="mt-3">
                          <Badge variant="outline">
                            🔒 Terkunci
                          </Badge>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {/* Motivational Message */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold mb-2">🚀 Terus Berlatih!</h3>
            <p className="text-blue-100">
              Kumpulkan semua lencana dengan menguasai berbagai teknik tendangan sepak bola. 
              Setiap pencapaian adalah langkah menuju menjadi pemain yang lebih baik!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}