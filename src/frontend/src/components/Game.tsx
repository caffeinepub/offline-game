import { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from './ui/button';
import { Pause, Play, X } from 'lucide-react';
import GameUI from './GameUI';
import LevelBadge from './LevelBadge';
import AudioControls from './AudioControls';
import { useGameStorage } from '../hooks/useGameStorage';
import { useAudioManager } from '../hooks/useAudioManager';
import { GameEngine } from '../game/GameEngine';
import type { GameState, Difficulty } from '../game/types';

interface GameProps {
  onExit: () => void;
  difficulty: Difficulty;
}

export default function Game({ onExit, difficulty }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    isPlaying: false,
    isPaused: false,
    isGameOver: false,
    currentLevel: 1,
  });
  const { saveScore, getHighScore, setCurrentLevel } = useGameStorage();
  const {
    playBackgroundMusic,
    pauseBackgroundMusic,
    stopBackgroundMusic,
    playCollision,
    playPowerUp,
    playScoreMilestone,
  } = useAudioManager();

  const handleGameOver = useCallback(
    (finalScore: number) => {
      saveScore(finalScore);
      stopBackgroundMusic();
      setGameState((prev) => ({ ...prev, isGameOver: true, isPlaying: false }));
    },
    [saveScore, stopBackgroundMusic]
  );

  const startGame = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = Math.min(600, window.innerWidth - 32);
    canvas.height = Math.min(800, window.innerHeight - 200);

    gameEngineRef.current = new GameEngine(canvas, ctx, handleGameOver, difficulty, {
      playCollision,
      playPowerUp,
      playScoreMilestone,
    });

    setGameState({
      score: 0,
      isPlaying: true,
      isPaused: false,
      isGameOver: false,
      currentLevel: 1,
    });

    playBackgroundMusic();

    const gameLoop = () => {
      if (gameEngineRef.current && !gameEngineRef.current.isPaused) {
        gameEngineRef.current.update();
        gameEngineRef.current.render();
        setGameState((prev) => ({
          ...prev,
          score: gameEngineRef.current?.score || 0,
          currentLevel: gameEngineRef.current?.currentLevel || 1,
        }));

        // Save level progress
        if (gameEngineRef.current) {
          setCurrentLevel(gameEngineRef.current.currentLevel);
        }
      }
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoop();
  }, [handleGameOver, difficulty, playBackgroundMusic, playCollision, playPowerUp, playScoreMilestone, setCurrentLevel]);

  const togglePause = useCallback(() => {
    if (gameEngineRef.current) {
      gameEngineRef.current.togglePause();
      setGameState((prev) => ({ ...prev, isPaused: !prev.isPaused }));

      if (gameEngineRef.current.isPaused) {
        pauseBackgroundMusic();
      } else {
        playBackgroundMusic();
      }
    }
  }, [pauseBackgroundMusic, playBackgroundMusic]);

  const restartGame = useCallback(() => {
    if (animationFrameRef.current !== undefined) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    startGame();
  }, [startGame]);

  const exitGame = useCallback(() => {
    if (animationFrameRef.current !== undefined) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (gameEngineRef.current) {
      gameEngineRef.current.cleanup();
    }
    stopBackgroundMusic();
    onExit();
  }, [onExit, stopBackgroundMusic]);

  useEffect(() => {
    startGame();

    return () => {
      if (animationFrameRef.current !== undefined) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (gameEngineRef.current) {
        gameEngineRef.current.cleanup();
      }
      stopBackgroundMusic();
    };
  }, [startGame, stopBackgroundMusic]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="relative">
        <div className="mb-4 flex items-center justify-between gap-4">
          <Button onClick={exitGame} variant="outline" size="icon">
            <X className="h-5 w-5" />
          </Button>
          <GameUI
            score={gameState.score}
            highScore={getHighScore()}
            isPaused={gameState.isPaused}
            currentLevel={gameState.currentLevel}
            activePowerUps={gameEngineRef.current?.activePowerUps || []}
          />
          <Button onClick={togglePause} variant="outline" size="icon" disabled={gameState.isGameOver}>
            {gameState.isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
          </Button>
        </div>

        <canvas
          ref={canvasRef}
          className="rounded-2xl border-4 border-terracotta shadow-2xl"
          style={{ display: 'block' }}
        />

        <LevelBadge level={gameState.currentLevel} />

        {gameState.isGameOver && (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-background/90 backdrop-blur-sm">
            <div className="space-y-6 text-center">
              <div>
                <h2 className="mb-2 text-4xl font-bold text-terracotta">Game Over!</h2>
                <p className="text-2xl text-amber">Score: {gameState.score}</p>
                <p className="text-lg text-sage">Level: {gameState.currentLevel}</p>
                {gameState.score === getHighScore() && gameState.score > 0 && (
                  <p className="mt-2 text-lg font-semibold text-sage">New High Score! 🎉</p>
                )}
              </div>
              <div className="flex gap-3">
                <Button onClick={restartGame} size="lg">
                  Play Again
                </Button>
                <Button onClick={exitGame} variant="outline" size="lg">
                  Exit
                </Button>
              </div>
            </div>
          </div>
        )}

        {gameState.isPaused && !gameState.isGameOver && (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-background/80 backdrop-blur-sm">
            <div className="space-y-6 text-center">
              <h2 className="mb-4 text-3xl font-bold text-amber">Paused</h2>
              <AudioControls />
              <Button onClick={togglePause} size="lg">
                Resume
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
