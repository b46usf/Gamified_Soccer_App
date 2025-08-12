import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Play, BookOpen, Trophy } from "lucide-react";

interface LandingPageProps {
  onStartGame: () => void;
  onOpenQuiz: () => void;
  onOpenBadges: () => void;
  onOpenContact: () => void;
  onOpenTeacherInfo: () => void;
  onOpenCredits: () => void;
}

export function LandingPage({ 
  onStartGame, 
  onOpenQuiz, 
  onOpenBadges,
  onOpenContact,
  onOpenTeacherInfo,
  onOpenCredits
}: LandingPageProps) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Sky Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-300 via-blue-400 to-blue-500"></div>
      
      {/* Clouds */}
      <div className="absolute inset-0">
        {/* Cloud decorations */}
        <div className="absolute top-20 left-10 w-24 h-16 bg-white/80 rounded-full opacity-90"></div>
        <div className="absolute top-16 left-16 w-16 h-10 bg-white/70 rounded-full"></div>
        <div className="absolute top-32 right-20 w-32 h-20 bg-white/75 rounded-full"></div>
        <div className="absolute top-28 right-28 w-20 h-12 bg-white/60 rounded-full"></div>
        <div className="absolute top-48 left-1/4 w-28 h-18 bg-white/70 rounded-full"></div>
        <div className="absolute top-44 left-1/3 w-18 h-12 bg-white/50 rounded-full"></div>
        <div className="absolute bottom-40 right-10 w-36 h-24 bg-white/65 rounded-full"></div>
        <div className="absolute bottom-44 right-20 w-24 h-16 bg-white/45 rounded-full"></div>
      </div>

      {/* Grass Background */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-500 to-green-400"></div>
      
      {/* Grass texture spots */}
      <div className="absolute bottom-2 left-8 w-3 h-4 bg-green-600 rounded-full opacity-40"></div>
      <div className="absolute bottom-1 left-20 w-2 h-3 bg-green-600 rounded-full opacity-30"></div>
      <div className="absolute bottom-3 right-12 w-4 h-5 bg-green-600 rounded-full opacity-35"></div>
      <div className="absolute bottom-0 right-32 w-3 h-4 bg-green-600 rounded-full opacity-25"></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        {/* Character and Title Section */}
        <div className="mb-8 relative">
          {/* Title Banner */}
          <div className="bg-blue-600 text-white px-8 py-4 rounded-2xl shadow-lg relative">
            <h1 className="text-4xl md:text-5xl font-bold text-center">Tendangan</h1>
            <h1 className="text-4xl md:text-5xl font-bold text-center mt-1">Juara</h1>
            
            {/* Football Character */}
            <div className="absolute -left-16 top-1/2 transform -translate-y-1/2">
              <div className="w-24 h-24 relative">
                {/* Football body */}
                <div className="w-20 h-20 bg-white rounded-full border-4 border-black relative shadow-lg">
                  {/* Football pattern */}
                  <div className="absolute inset-0 rounded-full overflow-hidden">
                    <div className="absolute top-2 left-2 w-4 h-8 bg-black rounded-full transform rotate-12"></div>
                    <div className="absolute top-3 right-2 w-4 h-8 bg-black rounded-full transform -rotate-12"></div>
                    <div className="absolute bottom-2 left-3 w-4 h-8 bg-black rounded-full transform -rotate-12"></div>
                    <div className="absolute bottom-2 right-3 w-4 h-8 bg-black rounded-full transform rotate-12"></div>
                    <div className="absolute top-6 left-6 w-4 h-8 bg-black rounded-full"></div>
                  </div>
                  
                  {/* Eyes */}
                  <div className="absolute top-4 left-3 w-3 h-3 bg-black rounded-full"></div>
                  <div className="absolute top-4 right-3 w-3 h-3 bg-black rounded-full"></div>
                  <div className="absolute top-4 left-3.5 w-1.5 h-1.5 bg-white rounded-full"></div>
                  <div className="absolute top-4 right-3.5 w-1.5 h-1.5 bg-white rounded-full"></div>
                  
                  {/* Mouth */}
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-6 h-3 bg-red-500 rounded-full"></div>
                  <div className="absolute top-8.5 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-white rounded-full"></div>
                </div>
                
                {/* Arms */}
                <div className="absolute top-6 -left-4 w-6 h-3 bg-white rounded-full border-2 border-black transform -rotate-45"></div>
                <div className="absolute top-4 -right-2 w-6 h-3 bg-white rounded-full border-2 border-black transform rotate-45"></div>
                
                {/* Thumbs up gesture */}
                <div className="absolute top-2 -right-1 w-2 h-4 bg-white border-2 border-black rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Buttons */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Button 
            onClick={onStartGame}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-2xl text-xl font-bold shadow-lg transform hover:scale-105 transition-all"
          >
            <Play className="w-6 h-6 mr-3 fill-white" />
            Mulai Game
          </Button>
          
          <Button 
            onClick={onOpenQuiz}
            size="lg" 
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 rounded-2xl text-xl font-bold shadow-lg transform hover:scale-105 transition-all"
          >
            <BookOpen className="w-6 h-6 mr-3" />
            Quiz
          </Button>
        </div>

        <div className="mb-8">
          <Button 
            onClick={onOpenBadges}
            size="lg"
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-6 rounded-2xl text-xl font-bold shadow-lg transform hover:scale-105 transition-all"
          >
            <Trophy className="w-6 h-6 mr-3" />
            Lencana
          </Button>
        </div>

        {/* Description Card */}
        <Card className="bg-yellow-100/90 border-none shadow-lg max-w-2xl mx-auto mb-12 backdrop-blur-sm">
          <CardContent className="p-6">
            <p className="text-center text-gray-800 text-lg leading-relaxed">
              Latih teknik menendang bola dengan menyenangkan sambil belajar PJOK secara interaktif.
            </p>
          </CardContent>
        </Card>

        {/* Footer Navigation */}
        <div className="flex flex-wrap justify-center gap-8 text-blue-800">
          <button 
            onClick={onOpenContact}
            className="hover:text-blue-600 transition-colors text-lg font-medium hover:underline"
          >
            Kontak
          </button>
          <button 
            onClick={onOpenTeacherInfo}
            className="hover:text-blue-600 transition-colors text-lg font-medium hover:underline"
          >
            Info Guru
          </button>
          <button 
            onClick={onOpenCredits}
            className="hover:text-blue-600 transition-colors text-lg font-medium hover:underline"
          >
            Credits
          </button>
        </div>
      </div>
    </div>
  );
}