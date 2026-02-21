export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Player {
  position: Position;
  size: Size;
  velocity: number;
}

export interface Obstacle {
  position: Position;
  size: Size;
  velocity: number;
  color: string;
}

export interface GameState {
  score: number;
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  currentLevel: number;
}

export interface ScoreEntry {
  id: string;
  score: number;
  date: number;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface DifficultyConfig {
  spawnInterval: number;
  obstacleSpeed: number;
}

export type PowerUpType = 'speedBoost' | 'shield' | 'slowMotion';

export interface PowerUp {
  type: PowerUpType;
  position: Position;
  size: Size;
  collected: boolean;
}

export interface ActivePowerUp {
  type: PowerUpType;
  expiresAt: number;
}

export interface LevelTheme {
  backgroundColor: string[];
  obstacleColor: string;
  accentColor: string;
}
