import React, { useRef, useEffect, useState } from 'react';
import { SkipBack, Play, Pause, SkipForward, Repeat, Volume2, Volume1, VolumeX } from './icons';

interface Beat {
  id: string;
  title: string;
  producer: string;
  audioPreviewUrl: string;
  artworkUrl: string;
}

interface AudioPlayerProps {
  currentBeat: Beat | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  isLooping: boolean;
  onToggleLoop: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ currentBeat, isPlaying, onPlayPause, onNext, onPrevious, isLooping, onToggleLoop }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLInputElement>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying && currentBeat) {
      if (audio.src !== currentBeat.audioPreviewUrl) {
        audio.src = currentBeat.audioPreviewUrl;
      }
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          if (error.name !== 'AbortError') {
            console.error("Audio play failed:", error);
          }
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, currentBeat]);
  
  useEffect(() => {
    if(audioRef.current) audioRef.current.loop = isLooping;
  }, [isLooping]);
  
  useEffect(() => {
    if(audioRef.current) audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const setAudioData = () => {
      if (audio.duration && isFinite(audio.duration)) setDuration(audio.duration);
    };
    const setAudioTime = () => {
      if (audio.duration && isFinite(audio.duration)) setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };
    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('durationchange', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    return () => {
        audio.removeEventListener('loadeddata', setAudioData);
        audio.removeEventListener('loadedmetadata', setAudioData);
        audio.removeEventListener('durationchange', setAudioData);
        audio.removeEventListener('timeupdate', setAudioTime);
    }
  }, []);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) audioRef.current.currentTime = Number(e.target.value);
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVolume = parseFloat(e.target.value);
      setVolume(newVolume);
      if (newVolume > 0 && isMuted) setIsMuted(false);
  };
  
  const toggleMute = () => setIsMuted(!isMuted);
  
  const VolumeIcon = () => {
      if(isMuted || volume === 0) return <VolumeX className="w-5 h-5" />;
      if(volume < 0.5) return <Volume1 className="w-5 h-5" />;
      return <Volume2 className="w-5 h-5" />;
  }

  if (!currentBeat) return null;

  const formatTime = (time: number) => {
    if (isNaN(time) || !isFinite(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <audio ref={audioRef} onEnded={onNext} />
      
      {/* Background: Dark Purple (matching the requested aesthetic) */}
      <div className="bg-[#0b0118]/95 backdrop-blur-xl border-t border-green-500/20 grid grid-cols-3 w-full p-3 px-6 items-center shadow-[0_-5px_20px_rgba(88,28,135,0.3)]">
          
          {/* Left: Beat Info - Mono Font & Neon Green */}
          <div className="flex flex-col justify-center overflow-hidden">
             <div className="flex items-center gap-2">
                 <div className="w-1 h-8 bg-green-500/50 rounded-sm animate-pulse hidden md:block"></div>
                 <div className="overflow-hidden">
                     <p className="font-bold truncate text-sm md:text-base text-green-400 font-mono tracking-widest uppercase drop-shadow-[0_0_5px_rgba(74,222,128,0.4)]">
                        {currentBeat.title}
                     </p>
                     <p className="text-xs text-green-700/80 font-mono tracking-wide uppercase truncate">
                        Prod. {currentBeat.producer}
                     </p>
                 </div>
             </div>
          </div>

          {/* Center: Controls & Progress */}
          <div className="flex flex-col items-center justify-center px-4">
              <div className="flex items-center gap-8 text-green-700 mb-2">
                <button onClick={onPrevious} className="hover:text-green-400 transition-colors"><SkipBack className="w-5 h-5" /></button>
                
                {/* Play Button: Neon Green with Black Icon */}
                <button onClick={onPlayPause} className="w-12 h-12 flex items-center justify-center text-black bg-green-500 hover:bg-green-400 rounded-full transition-all duration-200 shadow-[0_0_15px_rgba(74,222,128,0.4)] hover:scale-105 active:scale-95">
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
                </button>
                
                <button onClick={onNext} className="hover:text-green-400 transition-colors"><SkipForward className="w-5 h-5" /></button>
              </div>
              
              <div className="flex items-center justify-center gap-3 w-full max-w-xl">
                <span className="text-[10px] text-green-600 w-10 text-right font-mono tracking-wider">{formatTime(currentTime)}</span>
                <div className="relative w-full h-4 flex items-center">
                  <div className="absolute h-1 rounded-full bg-green-900/30 left-0 right-0 top-1/2 -translate-y-1/2"></div>
                  <div className="absolute h-1 rounded-full bg-green-400 left-0 top-1/2 -translate-y-1/2" style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}></div>
                  <input
                      type="range"
                      ref={progressRef}
                      min="0"
                      max={duration || 0}
                      value={currentTime}
                      onChange={handleSeek}
                      className="player-progress relative z-10 w-full h-1 appearance-none cursor-pointer rounded-full"
                  />
                </div>
                <span className="text-[10px] text-green-600 w-10 text-left font-mono tracking-wider">{formatTime(duration)}</span>
              </div>
          </div>

          {/* Right: Loop & Volume */}
          <div className="flex items-center justify-end gap-6">
             <button 
                onClick={onToggleLoop} 
                className={`transition-colors ${isLooping ? 'text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.6)]' : 'text-green-800 hover:text-green-500'}`}
                title={isLooping ? "Desativar Repetição" : "Ativar Repetição"}
             >
                <Repeat className="w-5 h-5" />
             </button>
             <div className="hidden md:flex items-center gap-3 w-32 group">
                <button onClick={toggleMute} className="text-green-800 group-hover:text-green-500 transition-colors">
                    <VolumeIcon />
                </button>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="player-progress w-full h-1"
                    aria-label="Volume"
                />
             </div>
          </div>
      </div>
    </div>
  );
};

export default AudioPlayer;