import { useCallback } from 'react';
import type { ScoreEntry, Difficulty } from '../game/types';

const HIGH_SCORES_KEY = 'sky-dodge-high-scores';
const DIFFICULTY_KEY = 'sky-dodge-difficulty';
const CURRENT_LEVEL_KEY = 'sky-dodge-current-level';
const MAX_SCORES = 10;

export function useGameStorage() {
  const getHighScores = useCallback((): ScoreEntry[] => {
    try {
      const stored = localStorage.getItem(HIGH_SCORES_KEY);
      if (!stored) return [];
      return JSON.parse(stored) as ScoreEntry[];
    } catch (error) {
      console.error('Error loading high scores:', error);
      return [];
    }
  }, []);

  const saveScore = useCallback((score: number) => {
    try {
      const scores = getHighScores();
      const newEntry: ScoreEntry = {
        id: `${Date.now()}-${Math.random()}`,
        score,
        date: Date.now(),
      };

      scores.push(newEntry);
      scores.sort((a, b) => b.score - a.score);
      const topScores = scores.slice(0, MAX_SCORES);

      localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(topScores));
    } catch (error) {
      console.error('Error saving score:', error);
    }
  }, [getHighScores]);

  const getHighScore = useCallback((): number => {
    const scores = getHighScores();
    return scores.length > 0 ? scores[0].score : 0;
  }, [getHighScores]);

  const clearScores = useCallback(() => {
    try {
      localStorage.removeItem(HIGH_SCORES_KEY);
    } catch (error) {
      console.error('Error clearing scores:', error);
    }
  }, []);

  const getDifficulty = useCallback((): Difficulty => {
    try {
      const stored = localStorage.getItem(DIFFICULTY_KEY);
      if (!stored) return 'medium';
      return stored as Difficulty;
    } catch (error) {
      console.error('Error loading difficulty:', error);
      return 'medium';
    }
  }, []);

  const setDifficulty = useCallback((difficulty: Difficulty) => {
    try {
      localStorage.setItem(DIFFICULTY_KEY, difficulty);
    } catch (error) {
      console.error('Error saving difficulty:', error);
    }
  }, []);

  const getCurrentLevel = useCallback((): number => {
    try {
      const stored = localStorage.getItem(CURRENT_LEVEL_KEY);
      if (!stored) return 1;
      return parseInt(stored, 10);
    } catch (error) {
      console.error('Error loading current level:', error);
      return 1;
    }
  }, []);

  const setCurrentLevel = useCallback((level: number) => {
    try {
      localStorage.setItem(CURRENT_LEVEL_KEY, level.toString());
    } catch (error) {
      console.error('Error saving current level:', error);
    }
  }, []);

  return {
    getHighScores,
    saveScore,
    getHighScore,
    clearScores,
    getDifficulty,
    setDifficulty,
    getCurrentLevel,
    setCurrentLevel,
  };
}
