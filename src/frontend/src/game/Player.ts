import type { Player, Position, Size } from './types';

export class PlayerCharacter {
  position: Position;
  size: Size;
  velocity: number;
  canvasWidth: number;
  moveLeft: boolean = false;
  moveRight: boolean = false;
  hasShield: boolean = false;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth;
    this.size = { width: 40, height: 40 };
    this.position = {
      x: canvasWidth / 2 - this.size.width / 2,
      y: canvasHeight - this.size.height - 20,
    };
    this.velocity = 8;

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);

    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      this.moveLeft = true;
    }
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      this.moveRight = true;
    }
  }

  handleKeyUp(e: KeyboardEvent) {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      this.moveLeft = false;
    }
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      this.moveRight = false;
    }
  }

  update(speedMultiplier: number = 1) {
    const effectiveVelocity = this.velocity * speedMultiplier;
    
    if (this.moveLeft) {
      this.position.x -= effectiveVelocity;
    }
    if (this.moveRight) {
      this.position.x += effectiveVelocity;
    }

    // Keep player within bounds
    if (this.position.x < 0) {
      this.position.x = 0;
    }
    if (this.position.x + this.size.width > this.canvasWidth) {
      this.position.x = this.canvasWidth - this.size.width;
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    // Draw shield effect if active
    if (this.hasShield) {
      ctx.strokeStyle = 'oklch(0.70 0.15 200 / 0.6)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(
        this.position.x + this.size.width / 2,
        this.position.y + this.size.height / 2,
        this.size.width / 2 + 8,
        0,
        Math.PI * 2
      );
      ctx.stroke();
    }

    // Draw player as a rounded rectangle with gradient
    const gradient = ctx.createLinearGradient(
      this.position.x,
      this.position.y,
      this.position.x,
      this.position.y + this.size.height
    );
    gradient.addColorStop(0, 'oklch(0.65 0.15 40)'); // Terracotta
    gradient.addColorStop(1, 'oklch(0.55 0.15 40)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(this.position.x, this.position.y, this.size.width, this.size.height, 8);
    ctx.fill();

    // Add a highlight
    ctx.fillStyle = 'oklch(0.75 0.15 40 / 0.5)';
    ctx.beginPath();
    ctx.roundRect(this.position.x + 4, this.position.y + 4, this.size.width - 8, 8, 4);
    ctx.fill();
  }

  cleanup() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }

  getPlayer(): Player {
    return {
      position: this.position,
      size: this.size,
      velocity: this.velocity,
    };
  }
}
