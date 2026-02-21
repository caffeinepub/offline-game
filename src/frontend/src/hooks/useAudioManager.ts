import { useCallback, useEffect, useRef, useState } from 'react';

interface AudioSettings {
  musicVolume: number;
  sfxVolume: number;
  isMuted: boolean;
}

const AUDIO_SETTINGS_KEY = 'sky-dodge-audio-settings';

export function useAudioManager() {
  const [settings, setSettings] = useState<AudioSettings>(() => {
    try {
      const stored = localStorage.getItem(AUDIO_SETTINGS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading audio settings:', error);
    }
    return { musicVolume: 0.5, sfxVolume: 0.7, isMuted: false };
  });

  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);
  const collisionSoundRef = useRef<HTMLAudioElement | null>(null);
  const powerUpSoundRef = useRef<HTMLAudioElement | null>(null);
  const milestoneSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Preload audio files
    backgroundMusicRef.current = new Audio('/assets/audio/background-music.mp3');
    backgroundMusicRef.current.loop = true;
    backgroundMusicRef.current.volume = settings.musicVolume;

    collisionSoundRef.current = new Audio('/assets/audio/collision.mp3');
    collisionSoundRef.current.volume = settings.sfxVolume;

    powerUpSoundRef.current = new Audio('/assets/audio/powerup.mp3');
    powerUpSoundRef.current.volume = settings.sfxVolume;

    milestoneSoundRef.current = new Audio('/assets/audio/score-milestone.mp3');
    milestoneSoundRef.current.volume = settings.sfxVolume;

    return () => {
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // Save settings to localStorage
    try {
      localStorage.setItem(AUDIO_SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving audio settings:', error);
    }

    // Update volumes
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.volume = settings.isMuted ? 0 : settings.musicVolume;
    }
    if (collisionSoundRef.current) {
      collisionSoundRef.current.volume = settings.isMuted ? 0 : settings.sfxVolume;
    }
    if (powerUpSoundRef.current) {
      powerUpSoundRef.current.volume = settings.isMuted ? 0 : settings.sfxVolume;
    }
    if (milestoneSoundRef.current) {
      milestoneSoundRef.current.volume = settings.isMuted ? 0 : settings.sfxVolume;
    }
  }, [settings]);

  const playBackgroundMusic = useCallback(() => {
    if (backgroundMusicRef.current && !settings.isMuted) {
      backgroundMusicRef.current.play().catch(() => {
        // Ignore autoplay errors
      });
    }
  }, [settings.isMuted]);

  const pauseBackgroundMusic = useCallback(() => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.pause();
    }
  }, []);

  const stopBackgroundMusic = useCallback(() => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.pause();
      backgroundMusicRef.current.currentTime = 0;
    }
  }, []);

  const playCollision = useCallback(() => {
    if (collisionSoundRef.current && !settings.isMuted) {
      collisionSoundRef.current.currentTime = 0;
      collisionSoundRef.current.play().catch(() => {
        // Ignore errors
      });
    }
  }, [settings.isMuted]);

  const playPowerUp = useCallback(() => {
    if (powerUpSoundRef.current && !settings.isMuted) {
      powerUpSoundRef.current.currentTime = 0;
      powerUpSoundRef.current.play().catch(() => {
        // Ignore errors
      });
    }
  }, [settings.isMuted]);

  const playScoreMilestone = useCallback(() => {
    if (milestoneSoundRef.current && !settings.isMuted) {
      milestoneSoundRef.current.currentTime = 0;
      milestoneSoundRef.current.play().catch(() => {
        // Ignore errors
      });
    }
  }, [settings.isMuted]);

  const setMusicVolume = useCallback((volume: number) => {
    setSettings((prev) => ({ ...prev, musicVolume: volume }));
  }, []);

  const setSfxVolume = useCallback((volume: number) => {
    setSettings((prev) => ({ ...prev, sfxVolume: volume }));
  }, []);

  const toggleMute = useCallback(() => {
    setSettings((prev) => ({ ...prev, isMuted: !prev.isMuted }));
  }, []);

  return {
    settings,
    playBackgroundMusic,
    pauseBackgroundMusic,
    stopBackgroundMusic,
    playCollision,
    playPowerUp,
    playScoreMilestone,
    setMusicVolume,
    setSfxVolume,
    toggleMute,
  };
}
