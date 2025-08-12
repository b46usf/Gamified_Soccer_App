import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { ArrowLeft, BookOpen, CheckCircle, XCircle } from "lucide-react";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export function QuizPage({ onBack }: { onBack: () => void }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);

  const questions: QuizQuestion[] = [
    {
      id: 1,
      question: "Apa nama teknik menendang bola dengan bagian dalam kaki?",
      options: ["Inside Kick", "Outside Kick", "Instep Kick", "Heel Kick"],
      correctAnswer: 0,
      explanation: "Inside kick adalah teknik menendang dengan bagian dalam kaki, yang memberikan akurasi tinggi dan kontrol yang baik."
    },
    {
      id: 2,
      question: "Berapa jarak titik penalti dari garis gawang?",
      options: ["10 meter", "11 meter", "12 meter", "15 meter"],
      correctAnswer: 2,
      explanation: "Titik penalti berada pada jarak 12 meter dari garis gawang sesuai dengan peraturan FIFA."
    },
    {
      id: 3,
      question: "Bagian kaki mana yang digunakan untuk tendangan keras dan jarak jauh?",
      options: ["Punggung kaki", "Kaki bagian dalam", "Ujung kaki", "Tumit"],
      correctAnswer: 0,
      explanation: "Punggung kaki (instep) digunakan untuk tendangan keras dan jarak jauh karena memberikan power maksimal."
    },
    {
      id: 4,
      question: "Apa yang harus dilakukan saat melakukan tendangan bebas?",
      options: ["Berlari secepat mungkin", "Mengamati posisi kiper dan dinding", "Langsung menendang", "Menunggu wasit"],
      correctAnswer: 1,
      explanation: "Sebelum tendangan bebas, penting untuk mengamati posisi kiper dan dinding pemain untuk menentukan strategi terbaik."
    },
    {
      id: 5,
      question: "Teknik mana yang paling baik untuk tendangan akurat ke sudut gawang?",
      options: ["Tendangan keras", "Tendangan dengan bagian dalam kaki", "Tendangan dengan ujung kaki", "Tendangan dengan tumit"],
      correctAnswer: 1,
      explanation: "Tendangan dengan bagian dalam kaki memberikan kontrol dan akurasi terbaik untuk menempatkan bola ke sudut gawang."
    },
    {
      id: 6,
      question: "Apa fungsi follow-through dalam teknik menendang?",
      options: ["Menambah kecepatan lari", "Menjaga keseimbangan", "Melanjutkan gerakan kaki setelah menendang", "Mempersiapkan tendangan berikutnya"],
      correctAnswer: 2,
      explanation: "Follow-through adalah melanjutkan gerakan kaki setelah menendang bola untuk memastikan power dan akurasi maksimal."
    },
    {
      id: 7,
      question: "Posisi badan yang benar saat menendang bola adalah?",
      options: ["Condong ke belakang", "Tegak lurus", "Sedikit condong ke depan", "Miring ke samping"],
      correctAnswer: 2,
      explanation: "Posisi badan sedikit condong ke depan membantu menjaga keseimbangan dan memberikan power yang optimal saat menendang."
    },
    {
      id: 8,
      question: "Kapan sebaiknya menggunakan tendangan luar kaki?",
      options: ["Saat ingin menendang keras", "Saat ingin memberikan efek melengkung pada bola", "Saat jarak dekat ke gawang", "Saat tendangan penalti"],
      correctAnswer: 1,
      explanation: "Tendangan luar kaki digunakan untuk memberikan efek melengkung (curve) pada bola, berguna untuk mengatasi dinding atau kiper."
    }
  ];

  useEffect(() => {
    setUserAnswers(new Array(questions.length).fill(null));
  }, []);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestion] = selectedAnswer;
    setUserAnswers(newUserAnswers);

    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    setShowResult(true);

    setTimeout(() => {
      setShowResult(false);
      setSelectedAnswer(null);
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setQuizComplete(true);
      }
    }, 2500);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setQuizComplete(false);
    setUserAnswers(new Array(questions.length).fill(null));
  };

  const getScoreGrade = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 90) return { grade: "A", emoji: "🏆", color: "text-yellow-600", message: "Luar Biasa!" };
    if (percentage >= 80) return { grade: "B", emoji: "⭐", color: "text-blue-600", message: "Bagus Sekali!" };
    if (percentage >= 70) return { grade: "C", emoji: "👍", color: "text-green-600", message: "Cukup Baik!" };
    if (percentage >= 60) return { grade: "D", emoji: "📚", color: "text-orange-600", message: "Perlu Belajar Lagi" };
    return { grade: "E", emoji: "💪", color: "text-red-600", message: "Jangan Menyerah!" };
  };

  if (quizComplete) {
    const scoreGrade = getScoreGrade();
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button onClick={onBack} variant="secondary" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
            <h1 className="text-3xl font-bold text-white">📊 Hasil Quiz</h1>
          </div>

          <Card className="bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-4xl mb-4">
                {scoreGrade.emoji} {scoreGrade.message}
              </CardTitle>
              <div className="text-6xl font-bold mb-4 text-blue-600">
                {score}/{questions.length}
              </div>
              <div className={`text-3xl font-bold ${scoreGrade.color}`}>
                Nilai: {scoreGrade.grade}
              </div>
              <div className="text-lg text-gray-600 mt-2">
                Persentase: {Math.round((score / questions.length) * 100)}%
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex justify-center gap-4 mb-6">
                <Button onClick={restartQuiz} size="lg">
                  🔄 Ulangi Quiz
                </Button>
                <Button onClick={onBack} variant="secondary" size="lg">
                  🏠 Kembali ke Menu
                </Button>
              </div>

              {/* Review Answers */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-center mb-4">📋 Review Jawaban</h3>
                {questions.map((question, index) => (
                  <Card key={question.id} className="bg-gray-50">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {userAnswers[index] === question.correctAnswer ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          ) : (
                            <XCircle className="w-6 h-6 text-red-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium mb-2">
                            {index + 1}. {question.question}
                          </h4>
                          <div className="text-sm space-y-1">
                            <div className="text-green-600">
                              ✓ Jawaban benar: {question.options[question.correctAnswer]}
                            </div>
                            {userAnswers[index] !== question.correctAnswer && userAnswers[index] !== null && (
                              <div className="text-red-600">
                                ✗ Jawaban kamu: {question.options[userAnswers[index]!]}
                              </div>
                            )}
                            <div className="text-gray-600 mt-2 italic">
                              💡 {question.explanation}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button onClick={onBack} variant="secondary" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <h1 className="text-3xl font-bold text-white">📚 Quiz PJOK - Teknik Tendangan</h1>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-6 h-6" />
                Pertanyaan {currentQuestion + 1} dari {questions.length}
              </CardTitle>
              <Badge variant="secondary">
                Skor: {score}/{questions.length}
              </Badge>
            </div>
            <Progress value={((currentQuestion + 1) / questions.length) * 100} className="mb-4" />
          </CardHeader>

          <CardContent className="space-y-6">
            {!showResult ? (
              <>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h2 className="text-xl font-bold mb-4 text-blue-900">
                    {questions[currentQuestion].question}
                  </h2>
                </div>

                <div className="space-y-3">
                  {questions[currentQuestion].options.map((option, index) => (
                    <Button
                      key={index}
                      variant={selectedAnswer === index ? "default" : "outline"}
                      className={`w-full p-4 text-left justify-start text-wrap h-auto ${
                        selectedAnswer === index ? "bg-blue-600 text-white" : "hover:bg-blue-50"
                      }`}
                      onClick={() => handleAnswerSelect(index)}
                    >
                      <span className="font-bold mr-3">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      {option}
                    </Button>
                  ))}
                </div>

                <div className="text-center">
                  <Button
                    onClick={handleNextQuestion}
                    disabled={selectedAnswer === null}
                    size="lg"
                    className="px-8"
                  >
                    {currentQuestion === questions.length - 1 ? "Selesai" : "Lanjut"}
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center space-y-4">
                <div className="text-6xl mb-4">
                  {selectedAnswer === questions[currentQuestion].correctAnswer ? "✅" : "❌"}
                </div>
                <div className="text-2xl font-bold mb-4">
                  {selectedAnswer === questions[currentQuestion].correctAnswer ? (
                    <span className="text-green-600">Benar!</span>
                  ) : (
                    <span className="text-red-600">Salah!</span>
                  )}
                </div>
                
                {selectedAnswer !== questions[currentQuestion].correctAnswer && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="font-medium text-green-800 mb-2">
                      Jawaban yang benar: {questions[currentQuestion].options[questions[currentQuestion].correctAnswer]}
                    </div>
                  </div>
                )}
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-blue-800">
                    <strong>💡 Penjelasan:</strong><br />
                    {questions[currentQuestion].explanation}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}