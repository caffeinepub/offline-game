import type { LevelTheme } from './types';

const themes: Record<string, LevelTheme> = {
  beginner: {
    backgroundColor: ['oklch(0.95 0.02 40)', 'oklch(0.90 0.03 60)'],
    obstacleColor: 'oklch(0.55 0.12 120)',
    accentColor: 'oklch(0.70 0.15 60)',
  },
  intermediate: {
    backgroundColor: ['oklch(0.92 0.04 35)', 'oklch(0.85 0.06 50)'],
    obstacleColor: 'oklch(0.60 0.14 35)',
    accentColor: 'oklch(0.65 0.16 45)',
  },
  advanced: {
    backgroundColor: ['oklch(0.88 0.06 30)', 'oklch(0.80 0.08 40)'],
    obstacleColor: 'oklch(0.55 0.15 30)',
    accentColor: 'oklch(0.60 0.17 35)',
  },
  expert: {
    backgroundColor: ['oklch(0.85 0.08 25)', 'oklch(0.75 0.10 35)'],
    obstacleColor: 'oklch(0.50 0.16 25)',
    accentColor: 'oklch(0.55 0.18 30)',
  },
};

export function getLevelTheme(level: number): LevelTheme {
  if (level <= 3) return themes.beginner;
  if (level <= 6) return themes.intermediate;
  if (level <= 9) return themes.advanced;
  return themes.expert;
}
