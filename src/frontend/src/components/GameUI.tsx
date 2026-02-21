import { Trophy, Zap, Shield, Clock } from 'lucide-react';
import type { ActivePowerUp } from '../game/types';

interface GameUIProps {
  score: number;
  highScore: number;
  isPaused: boolean;
  currentLevel: number;
  activePowerUps: ActivePowerUp[];
}

export default function GameUI({ score, highScore, isPaused, currentLevel, activePowerUps }: GameUIProps) {
  const getPowerUpIcon = (type: string) => {
    switch (type) {
      case 'speedBoost':
        return <Zap className="h-4 w-4" />;
      case 'shield':
        return <Shield className="h-4 w-4" />;
      case 'slowMotion':
        return <Clock className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getPowerUpName = (type: string) => {
    switch (type) {
      case 'speedBoost':
        return 'Speed Boost';
      case 'shield':
        return 'Shield';
      case 'slowMotion':
        return 'Slow Motion';
      default:
        return '';
    }
  };

  const getTimeRemaining = (expiresAt: number) => {
    const remaining = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
    return `${remaining}s`;
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-6 rounded-xl bg-card px-6 py-3 shadow-lg">
        <div className="text-center">
          <p className="text-sm font-medium text-muted-foreground">Level</p>
          <p className="text-2xl font-bold text-terracotta">{currentLevel}</p>
        </div>
        <div className="h-10 w-px bg-border" />
        <div className="text-center">
          <p className="text-sm font-medium text-muted-foreground">Score</p>
          <p className="text-2xl font-bold text-amber">{score}</p>
        </div>
        <div className="h-10 w-px bg-border" />
        <div className="flex items-center gap-2 text-center">
          <Trophy className="h-5 w-5 text-terracotta" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Best</p>
            <p className="text-xl font-bold text-terracotta">{highScore}</p>
          </div>
        </div>
      </div>

      {activePowerUps.length > 0 && (
        <div className="flex gap-2">
          {activePowerUps.map((powerUp, index) => (
            <div
              key={index}
              className="flex items-center gap-2 rounded-lg bg-card px-3 py-2 shadow-md ring-2 ring-amber/50"
            >
              <div className="text-amber">{getPowerUpIcon(powerUp.type)}</div>
              <div className="text-xs">
                <p className="font-semibold text-foreground">{getPowerUpName(powerUp.type)}</p>
                <p className="text-muted-foreground">{getTimeRemaining(powerUp.expiresAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
