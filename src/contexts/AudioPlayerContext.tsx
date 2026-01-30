'use client';

import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';

interface Beat {
  id: number;
  title: string;
  producer: string;
  bpm: string;
  key: string;
  price: string;
  tags: string[];
  image: string;
  audioUrl?: string;
}

interface AudioPlayerContextType {
  currentBeat: Beat | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playBeat: (beat: Beat) => void;
  pause: () => void;
  resume: () => void;
  togglePlayPause: () => void;
  setCurrentTime: (time: number) => void;
  setVolume: (volume: number) => void;
  nextBeat: () => void;
  previousBeat: () => void;
  beats: Beat[];
  setBeats: (beats: Beat[]) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within AudioPlayerProvider');
  }
  return context;
};

interface AudioPlayerProviderProps {
  children: ReactNode;
}

export const AudioPlayerProvider: React.FC<AudioPlayerProviderProps> = ({ children }) => {
  const [currentBeat, setCurrentBeat] = useState<Beat | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [beats, setBeats] = useState<Beat[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;

      const audio = audioRef.current;

      const updateTime = () => setCurrentTime(audio.currentTime);
      const updateDuration = () => setDuration(audio.duration);
      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };

      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadedmetadata', updateDuration);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('loadedmetadata', updateDuration);
        audio.removeEventListener('ended', handleEnded);
        audio.pause();
      };
    }
  }, []);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const playBeat = (beat: Beat) => {
    if (audioRef.current) {
      // For demo purposes, we'll use a placeholder audio URL
      // In production, you'd use the actual beat.audioUrl
      const audioUrl = beat.audioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
      
      if (currentBeat?.id === beat.id && isPlaying) {
        pause();
      } else {
        setCurrentBeat(beat);
        audioRef.current.src = audioUrl;
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch((error) => {
          console.error('Error playing audio:', error);
        });
      }
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resume = () => {
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((error) => {
        console.error('Error resuming audio:', error);
      });
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      resume();
    }
  };

  const handleSetCurrentTime = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleSetVolume = (newVolume: number) => {
    setVolume(newVolume);
  };

  const nextBeat = () => {
    if (currentBeat && beats.length > 0) {
      const currentIndex = beats.findIndex(b => b.id === currentBeat.id);
      const nextIndex = (currentIndex + 1) % beats.length;
      playBeat(beats[nextIndex]);
    }
  };

  const previousBeat = () => {
    if (currentBeat && beats.length > 0) {
      const currentIndex = beats.findIndex(b => b.id === currentBeat.id);
      const prevIndex = currentIndex === 0 ? beats.length - 1 : currentIndex - 1;
      playBeat(beats[prevIndex]);
    }
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        currentBeat,
        isPlaying,
        currentTime,
        duration,
        volume,
        playBeat,
        pause,
        resume,
        togglePlayPause,
        setCurrentTime: handleSetCurrentTime,
        setVolume: handleSetVolume,
        nextBeat,
        previousBeat,
        beats,
        setBeats,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};
