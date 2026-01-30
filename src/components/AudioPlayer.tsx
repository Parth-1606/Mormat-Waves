'use client';

import React from 'react';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

const AudioPlayer = () => {
  const {
    currentBeat,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlayPause,
    setCurrentTime,
    setVolume,
    nextBeat,
    previousBeat,
  } = useAudioPlayer();

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    setCurrentTime(newTime);
  };

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    setVolume(percentage);
  };

  if (!currentBeat) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-[#121212]/95 backdrop-blur-xl border-t border-white/10 z-[60] px-4 flex items-center justify-between">
      <div className="flex items-center gap-4 w-1/3">
        <img 
          src={currentBeat.image} 
          className="w-12 h-12 rounded object-cover"
          alt={currentBeat.title}
        />
        <div className="flex flex-col">
          <span className="font-bold text-sm">{currentBeat.title}</span>
          <span className="text-xs text-white/40">{currentBeat.producer}</span>
        </div>
      </div>
      
      <div className="flex flex-col items-center gap-2 w-1/3">
        <div className="flex items-center gap-6">
          <button 
            onClick={previousBeat}
            className="text-white/40 hover:text-white transition-colors"
            aria-label="Previous track"
          >
            <SkipBack size={20} />
          </button>
          <button 
            onClick={togglePlayPause}
            className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
          </button>
          <button 
            onClick={nextBeat}
            className="text-white/40 hover:text-white transition-colors"
            aria-label="Next track"
          >
            <SkipForward size={20} />
          </button>
        </div>
        <div 
          className="w-full max-w-md bg-white/10 h-1 rounded-full overflow-hidden cursor-pointer relative group"
          onClick={handleProgressClick}
        >
          <div className="bg-indigo-500 h-full transition-all" style={{ width: `${progressPercentage}%` }} />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[10px] text-white/60">{formatTime(currentTime)} / {formatTime(duration)}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-end gap-6 w-1/3">
        <div className="flex items-center gap-2">
          <Volume2 size={18} className="text-white/40" />
          <div 
            className="w-24 bg-white/10 h-1 rounded-full overflow-hidden cursor-pointer relative"
            onClick={handleVolumeClick}
          >
            <div className="bg-white/60 h-full transition-all" style={{ width: `${volume * 100}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
