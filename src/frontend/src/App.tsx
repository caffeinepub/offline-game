import { useState, useEffect } from 'react';
import Game from './components/Game';
import HighScores from './components/HighScores';
import { Button } from './components/ui/button';
import { Trophy, Play, Info } from 'lucide-react';
import { SiCaffeine } from 'react-icons/si';
import { useGameStorage } from './hooks/useGameStorage';
import type { Difficulty } from './game/types';

type Screen = 'menu' | 'game' | 'highscores' | 'instructions';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium');
  const { getDifficulty, setDifficulty } = useGameStorage();

  useEffect(() => {
    // Load saved difficulty on mount
    const savedDifficulty = getDifficulty();
    setSelectedDifficulty(savedDifficulty);
  }, [getDifficulty]);

  const handleStartGame = () => {
    setDifficulty(selectedDifficulty);
    setCurrentScreen('game');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'game':
        return <Game onExit={() => setCurrentScreen('menu')} difficulty={selectedDifficulty} />;
      case 'highscores':
        return <HighScores onBack={() => setCurrentScreen('menu')} />;
      case 'instructions':
        return (
          <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
            <div className="w-full max-w-2xl space-y-6">
              <h1 className="text-4xl font-bold text-terracotta">How to Play</h1>
              <div className="space-y-4 rounded-2xl bg-card p-8 shadow-lg">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-amber">Controls</h2>
                  <p className="text-muted-foreground">
                    Use <kbd className="rounded bg-sage px-2 py-1 text-sm font-semibold text-foreground">←</kbd> and{' '}
                    <kbd className="rounded bg-sage px-2 py-1 text-sm font-semibold text-foreground">→</kbd> arrow keys
                    or <kbd className="rounded bg-sage px-2 py-1 text-sm font-semibold text-foreground">A</kbd> and{' '}
                    <kbd className="rounded bg-sage px-2 py-1 text-sm font-semibold text-foreground">D</kbd> to move
                    your character left and right.
                  </p>
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-amber">Objective</h2>
                  <p className="text-muted-foreground">
                    Dodge the falling obstacles for as long as possible. Each second you survive earns you points. The
                    game gets progressively harder as you level up!
                  </p>
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-amber">Power-Ups</h2>
                  <p className="text-muted-foreground">
                    Collect power-ups to gain temporary advantages: Speed Boost increases your movement speed, Shield
                    protects you from one collision, and Slow Motion reduces obstacle speed.
                  </p>
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-amber">Levels</h2>
                  <p className="text-muted-foreground">
                    Progress through levels as your score increases. Each level brings faster obstacles and new visual
                    themes. Reach milestones at levels 1, 5, and 10 to earn badges!
                  </p>
                </div>
              </div>
              <Button onClick={() => setCurrentScreen('menu')} size="lg" className="w-full">
                Back to Menu
              </Button>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
            <div className="w-full max-w-md space-y-8">
              <div className="text-center">
                <h1 className="mb-2 text-6xl font-bold text-terracotta">Sky Dodge</h1>
                <p className="text-lg text-muted-foreground">Navigate through the falling obstacles</p>
              </div>

              <div className="space-y-4 rounded-2xl bg-card p-6 shadow-lg">
                <h2 className="text-center text-xl font-semibold text-amber">Select Difficulty</h2>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    onClick={() => setSelectedDifficulty('easy')}
                    variant={selectedDifficulty === 'easy' ? 'default' : 'outline'}
                    className="w-full"
                  >
                    Easy
                  </Button>
                  <Button
                    onClick={() => setSelectedDifficulty('medium')}
                    variant={selectedDifficulty === 'medium' ? 'default' : 'outline'}
                    className="w-full"
                  >
                    Medium
                  </Button>
                  <Button
                    onClick={() => setSelectedDifficulty('hard')}
                    variant={selectedDifficulty === 'hard' ? 'default' : 'outline'}
                    className="w-full"
                  >
                    Hard
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <Button onClick={handleStartGame} size="lg" className="w-full" variant="default">
                  <Play className="mr-2 h-5 w-5" />
                  Start Game
                </Button>
                <Button
                  onClick={() => setCurrentScreen('highscores')}
                  size="lg"
                  className="w-full"
                  variant="outline"
                >
                  <Trophy className="mr-2 h-5 w-5" />
                  High Scores
                </Button>
                <Button
                  onClick={() => setCurrentScreen('instructions')}
                  size="lg"
                  className="w-full"
                  variant="outline"
                >
                  <Info className="mr-2 h-5 w-5" />
                  How to Play
                </Button>
              </div>

              <footer className="pt-8 text-center text-sm text-muted-foreground">
                <p>
                  Built with <SiCaffeine className="inline h-4 w-4 text-amber" /> using{' '}
                  <a
                    href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                      window.location.hostname
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-amber hover:underline"
                  >
                    caffeine.ai
                  </a>
                </p>
                <p className="mt-1">© {new Date().getFullYear()} Sky Dodge. Works offline!</p>
              </footer>
            </div>
          </div>
        );
    }
  };

  return renderScreen();
}

export default App;
