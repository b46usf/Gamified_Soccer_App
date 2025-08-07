import { useState, useEffect } from "react";
import { HomePage } from "./components/HomePage";
import { AccuracyGame } from "./components/AccuracyGame";
import { PowerGame } from "./components/PowerGame";
import { FreestyleGame } from "./components/FreestyleGame";
import { PenaltyGame } from "./components/PenaltyGame";
import { PlayerProfile } from "./components/PlayerProfile";
import { Button } from "./components/ui/button";
import { User, Home } from "lucide-react";

type GameMode = "home" | "accuracy" | "power" | "freestyle" | "penalty" | "profile";

export default function App() {
  const [currentMode, setCurrentMode] = useState<GameMode>("home");

  const handleModeSelect = (mode: string) => {
    console.log("[DEBUG] Mode selected by user:", mode);
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

  const renderCurrentMode = () => {
    console.log("[DEBUG] Rendering mode:", currentMode);
    switch (currentMode) {
      case "home":
        return <HomePage onSelectMode={handleModeSelect} />;
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
      default:
        return <HomePage onSelectMode={handleModeSelect} />;
    }
  };

  useEffect(() => {
    console.log("[DEBUG] Current game mode updated to:", currentMode);
  }, [currentMode]);

  return (
    <div className="relative min-h-screen bg-gray-50">
      {renderCurrentMode()}

      {/* Floating Navigation */}
      {currentMode === "home" && (
        <div className="fixed bottom-6 right-6 flex gap-3">
          <Button
            onClick={() => {
              console.log("[DEBUG] Navigating to profile mode");
              setCurrentMode("profile");
            }}
            size="lg"
            className="rounded-full shadow-lg"
            variant="secondary"
          >
            <User className="w-5 h-5" />
          </Button>
        </div>
      )}

      {currentMode !== "home" && (
        <div className="fixed bottom-6 right-6">
          <Button
            onClick={() => {
              console.log("[DEBUG] Navigating back to home");
              setCurrentMode("home");
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
