import { useState } from "react";
import { LandingPage } from "./components/LandingPage";
import { HomePage } from "./components/HomePage";
import { AccuracyGame } from "./components/AccuracyGame";
import { PowerGame } from "./components/PowerGame";
import { FreestyleGame } from "./components/FreestyleGame";
import { PenaltyGame } from "./components/PenaltyGame";
import { PlayerProfile } from "./components/PlayerProfile";
import { QuizPage } from "./components/QuizPage";
import { BadgesPage } from "./components/BadgesPage";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { User, Home, ArrowLeft, Mail, BookOpen, Users } from "lucide-react";

type AppMode = "landing" | "home" | "accuracy" | "power" | "freestyle" | "penalty" | "profile" | "quiz" | "badges" | "contact" | "teacher-info" | "credits";

export default function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>("landing");

  const handleModeSelect = (mode: string) => {
    if (mode === "accuracy") {
      setCurrentMode("accuracy");
    } else if (mode === "power") {
      setCurrentMode("power");
    } else if (mode === "freestyle") {
      setCurrentMode("freestyle");
    } else if (mode === "penalty") {
      setCurrentMode("penalty");
    }
  };

  const renderContactPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-600 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button onClick={() => setCurrentMode("landing")} variant="secondary" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <h1 className="text-3xl font-bold text-white">📞 Kontak</h1>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-6 h-6" />
              Hubungi Kami
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">⚽</div>
              <h2 className="text-2xl font-bold mb-4">Tendangan Juara</h2>
              <p className="text-gray-600 mb-6">
                Aplikasi pembelajaran PJOK interaktif untuk menguasai teknik tendangan sepak bola
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-blue-50">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-4">👨‍🏫</div>
                  <h3 className="font-bold mb-2">Tim Pengembang</h3>
                  <p className="text-sm text-gray-600">
                    Dikembangkan oleh tim guru PJOK untuk mendukung pembelajaran yang menyenangkan dan interaktif
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-green-50">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-4">🎓</div>
                  <h3 className="font-bold mb-2">Untuk Sekolah</h3>
                  <p className="text-sm text-gray-600">
                    Cocok untuk siswa SD, SMP, dan SMA sebagai media pembelajaran PJOK yang modern
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center space-y-4">
              <h3 className="text-xl font-bold">💌 Saran & Masukan</h3>
              <p className="text-gray-600">
                Kami sangat menghargai saran dan masukan untuk pengembangan aplikasi ini lebih baik lagi.
              </p>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  Email: tendangan.juara@sekolah.id<br />
                  WhatsApp: +62 812-3456-7890
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderTeacherInfoPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button onClick={() => setCurrentMode("landing")} variant="secondary" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <h1 className="text-3xl font-bold text-white">👨‍🏫 Info Guru</h1>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              Panduan untuk Guru
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-blue-800">🎯 Tujuan Pembelajaran</h3>
              <ul className="space-y-2 text-blue-700">
                <li>• Menguasai teknik dasar tendangan sepak bola</li>
                <li>• Meningkatkan koordinasi mata-kaki-tangan</li>
                <li>• Memahami konsep akurasi, power, dan timing</li>
                <li>• Mengembangkan kemampuan berpikir strategis</li>
              </ul>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-green-800">📚 Materi yang Dicakup</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-bold mb-2">Praktik:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Tendangan Akurasi</li>
                    <li>• Tendangan Power</li>
                    <li>• Tendangan Bebas</li>
                    <li>• Tendangan Penalti</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Teori:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Quiz interaktif</li>
                    <li>• Teknik tendangan</li>
                    <li>• Peraturan sepak bola</li>
                    <li>• Strategi permainan</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-purple-800">⏰ Saran Penggunaan</h3>
              <div className="space-y-3 text-purple-700">
                <div>
                  <strong>Durasi Sesi:</strong> 15-30 menit per sesi
                </div>
                <div>
                  <strong>Frekuensi:</strong> 2-3 kali per minggu
                </div>
                <div>
                  <strong>Evaluasi:</strong> Gunakan sistem poin dan lencana untuk memantau progress
                </div>
                <div>
                  <strong>Diferensiasi:</strong> Siswa dapat berlatih sesuai kemampuan masing-masing
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-yellow-800">🏆 Sistem Penilaian</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <strong>Aspek Psikomotor:</strong>
                  <ul className="mt-2 space-y-1">
                    <li>• Akurasi tendangan</li>
                    <li>• Kekuatan tendangan</li>
                    <li>• Konsistensi performance</li>
                  </ul>
                </div>
                <div>
                  <strong>Aspek Kognitif:</strong>
                  <ul className="mt-2 space-y-1">
                    <li>• Hasil quiz</li>
                    <li>• Pemahaman teknik</li>
                    <li>• Pengetahuan peraturan</li>
                  </ul>
                </div>
                <div>
                  <strong>Aspek Afektif:</strong>
                  <ul className="mt-2 space-y-1">
                    <li>• Kedisiplinan berlatih</li>
                    <li>• Sportivitas</li>
                    <li>• Motivasi belajar</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderCreditsPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-600 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button onClick={() => setCurrentMode("landing")} variant="secondary" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <h1 className="text-3xl font-bold text-white">👥 Credits</h1>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-6 h-6" />
              Tim Pengembangan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">⚽</div>
              <h2 className="text-3xl font-bold mb-2">Tendangan Juara</h2>
              <p className="text-gray-600">
                Aplikasi Gamifikasi Pembelajaran PJOK - Teknik Tendangan Sepak Bola
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-blue-50">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-blue-800">🎨 Design & Development</h3>
                  <div className="space-y-3">
                    <div>
                      <strong>UI/UX Design:</strong>
                      <p className="text-sm text-gray-600">Tim desainer pendidikan</p>
                    </div>
                    <div>
                      <strong>Game Development:</strong>
                      <p className="text-sm text-gray-600">Figma Make AI</p>
                    </div>
                    <div>
                      <strong>Educational Content:</strong>
                      <p className="text-sm text-gray-600">Guru PJOK bersertifikat</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-green-50">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-green-800">📚 Content Creation</h3>
                  <div className="space-y-3">
                    <div>
                      <strong>Materi Pembelajaran:</strong>
                      <p className="text-sm text-gray-600">Sesuai kurikulum PJOK nasional</p>
                    </div>
                    <div>
                      <strong>Quiz & Assessment:</strong>
                      <p className="text-sm text-gray-600">Berbasis kompetensi siswa</p>
                    </div>
                    <div>
                      <strong>Gamification:</strong>
                      <p className="text-sm text-gray-600">Sistem reward yang motivatif</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-purple-800">🛠️ Technology Stack</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <strong>Frontend:</strong>
                  <ul className="mt-2 space-y-1">
                    <li>• React + TypeScript</li>
                    <li>• Tailwind CSS</li>
                    <li>• Framer Motion</li>
                  </ul>
                </div>
                <div>
                  <strong>UI Components:</strong>
                  <ul className="mt-2 space-y-1">
                    <li>• Shadcn/ui</li>
                    <li>• Lucide Icons</li>
                    <li>• Recharts</li>
                  </ul>
                </div>
                <div>
                  <strong>Features:</strong>
                  <ul className="mt-2 space-y-1">
                    <li>• Interactive Games</li>
                    <li>• Progress Tracking</li>
                    <li>• Achievement System</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-yellow-800">🎯 Special Thanks</h3>
              <div className="text-center space-y-2">
                <p>Kepada semua guru PJOK yang telah memberikan masukan berharga</p>
                <p>Siswa-siswa yang telah menjadi beta tester aplikasi ini</p>
                <p>Keluarga besar pendidikan Indonesia</p>
              </div>
            </div>

            <div className="text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">🚀 Version 1.0</h3>
              <p className="text-blue-100">
                Dibuat dengan ❤️ untuk kemajuan pendidikan PJOK Indonesia
              </p>
              <p className="text-sm text-blue-200 mt-2">
                © 2024 Tendangan Juara - All Rights Reserved
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderCurrentMode = () => {
    switch (currentMode) {
      case "landing":
        return (
          <LandingPage 
            onStartGame={() => setCurrentMode("home")}
            onOpenQuiz={() => setCurrentMode("quiz")}
            onOpenBadges={() => setCurrentMode("badges")}
            onOpenContact={() => setCurrentMode("contact")}
            onOpenTeacherInfo={() => setCurrentMode("teacher-info")}
            onOpenCredits={() => setCurrentMode("credits")}
          />
        );
      case "home":
        return <HomePage onSelectMode={handleModeSelect} onBackToLanding={() => setCurrentMode("landing")} />;
      case "accuracy":
        return <AccuracyGame onBack={() => setCurrentMode("home")} />;
      case "power":
        return <PowerGame onBack={() => setCurrentMode("home")} />;
      case "freestyle":
        return <FreestyleGame onBack={() => setCurrentMode("home")} />;
      case "penalty":
        return <PenaltyGame onBack={() => setCurrentMode("home")} />;
      case "profile":
        return <PlayerProfile onBack={() => setCurrentMode("home")} />;
      case "quiz":
        return <QuizPage onBack={() => setCurrentMode("landing")} />;
      case "badges":
        return <BadgesPage onBack={() => setCurrentMode("landing")} />;
      case "contact":
        return renderContactPage();
      case "teacher-info":
        return renderTeacherInfoPage();
      case "credits":
        return renderCreditsPage();
      default:
        return (
          <LandingPage 
            onStartGame={() => setCurrentMode("home")}
            onOpenQuiz={() => setCurrentMode("quiz")}
            onOpenBadges={() => setCurrentMode("badges")}
            onOpenContact={() => setCurrentMode("contact")}
            onOpenTeacherInfo={() => setCurrentMode("teacher-info")}
            onOpenCredits={() => setCurrentMode("credits")}
          />
        );
    }
  };

  return (
    <div className="relative min-h-screen">
      {renderCurrentMode()}
      
      {/* Floating Navigation */}
      {currentMode === "home" && (
        <div className="fixed bottom-6 right-6 flex gap-3">
          <Button
            onClick={() => setCurrentMode("profile")}
            size="lg"
            className="rounded-full shadow-lg"
            variant="secondary"
          >
            <User className="w-5 h-5" />
          </Button>
        </div>
      )}
      
      {(currentMode !== "landing" && currentMode !== "home") && (
        <div className="fixed bottom-6 right-6">
          <Button
            onClick={() => {
              if (["quiz", "badges", "contact", "teacher-info", "credits"].includes(currentMode)) {
                setCurrentMode("landing");
              } else {
                setCurrentMode("home");
              }
            }}
            size="lg"
            className="rounded-full shadow-lg"
            variant="secondary"
          >
            <Home className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
}