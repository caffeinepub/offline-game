import { PlayerCharacter } from './Player';
import type { Obstacle, Difficulty, DifficultyConfig, PowerUp, ActivePowerUp, PowerUpType } from './types';
import { getLevelTheme } from './themes';

const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: { spawnInterval: 2000, obstacleSpeed: 2.5 },
  medium: { spawnInterval: 1500, obstacleSpeed: 3 },
  hard: { spawnInterval: 1000, obstacleSpeed: 4 },
};

interface AudioCallbacks {
  playCollision: () => void;
  playPowerUp: () => void;
  playScoreMilestone: () => void;
}

export class GameEngine {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  player: PlayerCharacter;
  obstacles: Obstacle[] = [];
  powerUps: PowerUp[] = [];
  activePowerUps: ActivePowerUp[] = [];
  score: number = 0;
  currentLevel: number = 1;
  isPaused: boolean = false;
  isGameOver: boolean = false;
  lastObstacleTime: number = 0;
  lastPowerUpTime: number = 0;
  obstacleInterval: number;
  baseObstacleSpeed: number;
  gameStartTime: number;
  onGameOver: (score: number) => void;
  difficulty: Difficulty;
  lastScoreMilestone: number = 0;
  audioCallbacks?: AudioCallbacks;
  powerUpImages: Record<PowerUpType, HTMLImageElement> = {} as Record<PowerUpType, HTMLImageElement>;
  imagesLoaded: boolean = false;
  currentTheme = getLevelTheme(1);
  themeTransition: { from: string[]; to: string[]; progress: number } | null = null;

  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    onGameOver: (score: number) => void,
    difficulty: Difficulty = 'medium',
    audioCallbacks?: AudioCallbacks
  ) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.player = new PlayerCharacter(canvas.width, canvas.height);
    this.gameStartTime = Date.now();
    this.onGameOver = onGameOver;
    this.difficulty = difficulty;
    this.audioCallbacks = audioCallbacks;

    const config = DIFFICULTY_CONFIGS[difficulty];
    this.obstacleInterval = config.spawnInterval;
    this.baseObstacleSpeed = config.obstacleSpeed;

    this.loadPowerUpImages();
  }

  loadPowerUpImages() {
    const powerUpTypes: PowerUpType[] = ['speedBoost', 'shield', 'slowMotion'];
    const imageMap: Record<PowerUpType, string> = {
      speedBoost: '/assets/generated/powerup-speed.dim_64x64.png',
      shield: '/assets/generated/powerup-shield.dim_64x64.png',
      slowMotion: '/assets/generated/powerup-slowmo.dim_64x64.png',
    };

    let loadedCount = 0;
    powerUpTypes.forEach((type) => {
      const img = new Image();
      img.src = imageMap[type];
      img.onload = () => {
        loadedCount++;
        if (loadedCount === powerUpTypes.length) {
          this.imagesLoaded = true;
        }
      };
      this.powerUpImages[type] = img;
    });
  }

  spawnObstacle() {
    const now = Date.now();
    if (now - this.lastObstacleTime > this.obstacleInterval) {
      const width = 40 + Math.random() * 40;

      this.obstacles.push({
        position: {
          x: Math.random() * (this.canvas.width - width),
          y: -50,
        },
        size: {
          width,
          height: 40,
        },
        velocity: this.baseObstacleSpeed + Math.floor(this.currentLevel / 2) * 0.5,
        color: this.currentTheme.obstacleColor,
      });

      this.lastObstacleTime = now;
      // Increase difficulty over time
      this.obstacleInterval = Math.max(
        300,
        DIFFICULTY_CONFIGS[this.difficulty].spawnInterval - Math.floor(this.currentLevel / 2) * 100
      );
    }
  }

  spawnPowerUp() {
    const now = Date.now();
    const powerUpInterval = 10000 + Math.random() * 5000; // 10-15 seconds

    if (now - this.lastPowerUpTime > powerUpInterval && this.powerUps.length < 2) {
      const types: PowerUpType[] = ['speedBoost', 'shield', 'slowMotion'];
      const type = types[Math.floor(Math.random() * types.length)];

      this.powerUps.push({
        type,
        position: {
          x: Math.random() * (this.canvas.width - 32),
          y: -32,
        },
        size: {
          width: 32,
          height: 32,
        },
        collected: false,
      });

      this.lastPowerUpTime = now;
    }
  }

  checkCollision(obstacle: Obstacle): boolean {
    const playerData = this.player.getPlayer();
    return (
      playerData.position.x < obstacle.position.x + obstacle.size.width &&
      playerData.position.x + playerData.size.width > obstacle.position.x &&
      playerData.position.y < obstacle.position.y + obstacle.size.height &&
      playerData.position.y + playerData.size.height > obstacle.position.y
    );
  }

  checkPowerUpCollision(powerUp: PowerUp): boolean {
    const playerData = this.player.getPlayer();
    return (
      playerData.position.x < powerUp.position.x + powerUp.size.width &&
      playerData.position.x + playerData.size.width > powerUp.position.x &&
      playerData.position.y < powerUp.position.y + powerUp.size.height &&
      playerData.position.y + playerData.size.height > powerUp.position.y
    );
  }

  activatePowerUp(type: PowerUpType) {
    const duration = 5000; // 5 seconds
    this.activePowerUps.push({
      type,
      expiresAt: Date.now() + duration,
    });

    if (type === 'shield') {
      this.player.hasShield = true;
    }

    if (this.audioCallbacks) {
      this.audioCallbacks.playPowerUp();
    }
  }

  getSpeedMultiplier(): number {
    return this.activePowerUps.some((p) => p.type === 'speedBoost') ? 1.5 : 1;
  }

  getSlowMotionMultiplier(): number {
    return this.activePowerUps.some((p) => p.type === 'slowMotion') ? 0.5 : 1;
  }

  update() {
    if (this.isPaused || this.isGameOver) return;

    // Update score based on time survived
    this.score = Math.floor((Date.now() - this.gameStartTime) / 100);

    // Update level
    const newLevel = Math.floor(this.score / 100) + 1;
    if (newLevel !== this.currentLevel) {
      const oldTheme = this.currentTheme;
      this.currentLevel = newLevel;
      this.currentTheme = getLevelTheme(this.currentLevel);
      
      // Start theme transition
      if (oldTheme.backgroundColor[0] !== this.currentTheme.backgroundColor[0]) {
        this.themeTransition = {
          from: oldTheme.backgroundColor,
          to: this.currentTheme.backgroundColor,
          progress: 0,
        };
      }
    }

    // Update theme transition
    if (this.themeTransition) {
      this.themeTransition.progress += 0.02;
      if (this.themeTransition.progress >= 1) {
        this.themeTransition = null;
      }
    }

    // Check for score milestones
    const currentMilestone = Math.floor(this.score / 100) * 100;
    if (currentMilestone > this.lastScoreMilestone && currentMilestone > 0) {
      this.lastScoreMilestone = currentMilestone;
      if (this.audioCallbacks) {
        this.audioCallbacks.playScoreMilestone();
      }
    }

    // Update active power-ups
    const now = Date.now();
    this.activePowerUps = this.activePowerUps.filter((powerUp) => {
      if (now >= powerUp.expiresAt) {
        if (powerUp.type === 'shield') {
          this.player.hasShield = false;
        }
        return false;
      }
      return true;
    });

    // Update player
    this.player.update(this.getSpeedMultiplier());

    // Spawn obstacles and power-ups
    this.spawnObstacle();
    this.spawnPowerUp();

    const slowMotion = this.getSlowMotionMultiplier();

    // Update obstacles
    this.obstacles = this.obstacles.filter((obstacle) => {
      obstacle.position.y += obstacle.velocity * slowMotion;

      // Check collision
      if (this.checkCollision(obstacle)) {
        if (this.player.hasShield) {
          // Shield absorbs one hit
          this.player.hasShield = false;
          this.activePowerUps = this.activePowerUps.filter((p) => p.type !== 'shield');
          if (this.audioCallbacks) {
            this.audioCallbacks.playCollision();
          }
          return false; // Remove obstacle
        } else {
          this.isGameOver = true;
          if (this.audioCallbacks) {
            this.audioCallbacks.playCollision();
          }
          this.onGameOver(this.score);
          return false;
        }
      }

      // Remove obstacles that are off screen
      return obstacle.position.y < this.canvas.height + 50;
    });

    // Update power-ups
    this.powerUps = this.powerUps.filter((powerUp) => {
      if (powerUp.collected) return false;

      powerUp.position.y += 2 * slowMotion;

      // Check collision with player
      if (this.checkPowerUpCollision(powerUp)) {
        this.activatePowerUp(powerUp.type);
        return false;
      }

      // Remove power-ups that are off screen
      return powerUp.position.y < this.canvas.height + 50;
    });
  }

  render() {
    // Clear canvas with gradient background
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    
    if (this.themeTransition) {
      // Interpolate between themes
      const t = this.themeTransition.progress;
      gradient.addColorStop(0, this.interpolateColor(this.themeTransition.from[0], this.themeTransition.to[0], t));
      gradient.addColorStop(1, this.interpolateColor(this.themeTransition.from[1], this.themeTransition.to[1], t));
    } else {
      gradient.addColorStop(0, this.currentTheme.backgroundColor[0]);
      gradient.addColorStop(1, this.currentTheme.backgroundColor[1]);
    }
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Render obstacles
    this.obstacles.forEach((obstacle) => {
      this.ctx.fillStyle = obstacle.color;
      this.ctx.beginPath();
      this.ctx.roundRect(obstacle.position.x, obstacle.position.y, obstacle.size.width, obstacle.size.height, 8);
      this.ctx.fill();

      // Add shadow
      this.ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      this.ctx.shadowBlur = 10;
      this.ctx.shadowOffsetY = 4;
    });

    // Reset shadow
    this.ctx.shadowColor = 'transparent';
    this.ctx.shadowBlur = 0;
    this.ctx.shadowOffsetY = 0;

    // Render power-ups
    if (this.imagesLoaded) {
      this.powerUps.forEach((powerUp) => {
        const img = this.powerUpImages[powerUp.type];
        if (img.complete) {
          this.ctx.drawImage(img, powerUp.position.x, powerUp.position.y, powerUp.size.width, powerUp.size.height);
        }
      });
    }

    // Render player
    this.player.render(this.ctx);
  }

  interpolateColor(from: string, to: string, t: number): string {
    // Simple color interpolation for OKLCH colors
    // This is a simplified version - in production you'd want proper OKLCH interpolation
    return t < 0.5 ? from : to;
  }

  togglePause() {
    this.isPaused = !this.isPaused;
  }

  cleanup() {
    this.player.cleanup();
  }
}
