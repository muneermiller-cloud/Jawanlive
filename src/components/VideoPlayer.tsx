import React, { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Volume1,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  Settings,
  Activity,
  Layers,
  Check,
  AlertCircle,
  Copy,
  ExternalLink,
  Tv,
  Radio,
  PictureInPicture,
} from 'lucide-react';
import { StreamSource, VideoQualityLevel, PlayerStats } from '../types';

interface VideoPlayerProps {
  title: string;
  subtitle?: string;
  sources: StreamSource[];
  activeSourceIndex: number;
  onSelectSource: (index: number) => void;
  poster?: string;
  isLive?: boolean;
  onClosePlayer?: () => void;
  isTheaterMode?: boolean;
  onToggleTheater?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  title,
  subtitle,
  sources,
  activeSourceIndex,
  onSelectSource,
  poster,
  isLive = false,
  isTheaterMode = false,
  onToggleTheater,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const hideControlsTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  // Quality levels
  const [qualities, setQualities] = useState<VideoQualityLevel[]>([]);
  const [currentQuality, setCurrentQuality] = useState<number>(-1); // -1 = Auto
  const [showQualityMenu, setShowQualityMenu] = useState(false);

  // Playback speeds
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  // Source selector menu
  const [showSourceMenu, setShowSourceMenu] = useState(false);

  // Stats for nerds
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState<PlayerStats>({
    resolution: '0x0',
    bitrateKbps: 0,
    bufferLengthSec: 0,
    droppedFrames: 0,
    decodedFrames: 0,
  });

  // Hover timeline preview
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<number>(0);
  const progressTrackRef = useRef<HTMLDivElement>(null);

  const currentSource = sources[activeSourceIndex] || sources[0];

  // Helper to format seconds into mm:ss or hh:mm:ss
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Reset controls hide timer
  const handleUserActivity = useCallback(() => {
    setShowControls(true);
    if (hideControlsTimerRef.current) {
      clearTimeout(hideControlsTimerRef.current);
    }
    if (isPlaying) {
      hideControlsTimerRef.current = setTimeout(() => {
        if (!showQualityMenu && !showSpeedMenu && !showSourceMenu && !showStats) {
          setShowControls(false);
        }
      }, 3500);
    }
  }, [isPlaying, showQualityMenu, showSpeedMenu, showSourceMenu, showStats]);

  // Load stream
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setIsLoading(true);
    setErrorMessage(null);
    setWarningMessage(null);
    setQualities([]);
    setCurrentQuality(-1);

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (!currentSource || !currentSource.url) {
      setErrorMessage('No valid stream source found for this match.');
      setIsLoading(false);
      return;
    }

    // Check if the stream source title indicates upcoming match or note
    if (currentSource.name?.toLowerCase().includes('note') || currentSource.title?.includes('kickoff')) {
      setWarningMessage(currentSource.title || 'Feed will usually come online right before kickoff.');
    }

    const streamUrl = currentSource.url;

    // Check if HLS is supported
    if (Hls.isSupported() && (streamUrl.includes('.m3u8') || !streamUrl.endsWith('.mp4'))) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 60,
      });

      hlsRef.current = hls;

      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (_event, data) => {
        setIsLoading(false);
        const parsedQualities: VideoQualityLevel[] = data.levels.map((lvl, index) => ({
          id: index,
          height: lvl.height,
          width: lvl.width,
          bitrate: lvl.bitrate,
          label: lvl.height ? `${lvl.height}p` : `Level ${index + 1}`,
        }));
        setQualities(parsedQualities);

        // Auto play on load
        video.play().then(() => setIsPlaying(true)).catch(() => {
          setIsPlaying(false);
        });
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_event, data) => {
        const lvl = hls.levels[data.level];
        if (lvl) {
          setStats((prev) => ({
            ...prev,
            resolution: `${lvl.width}x${lvl.height}`,
            bitrateKbps: Math.round(lvl.bitrate / 1000),
          }));
        }
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        console.warn('HLS Event Error:', data);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setErrorMessage('Network connection lost or stream source currently offline.');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              setErrorMessage('Unable to playback this stream. The channel may be offline before kickoff.');
              break;
          }
          setIsLoading(false);
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl') || streamUrl.endsWith('.mp4')) {
      // Native HLS (Safari) or standard MP4
      video.src = streamUrl;
      video.load();
      video.play().then(() => {
        setIsPlaying(true);
        setIsLoading(false);
      }).catch(() => {
        setIsPlaying(false);
        setIsLoading(false);
      });
    } else {
      setErrorMessage('Your browser does not support playing this stream format.');
      setIsLoading(false);
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [currentSource]);

  // Video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (video.buffered.length > 0) {
        setBuffered(video.buffered.end(video.buffered.length - 1));
      }

      // Update telemetry
      if (showStats) {
        const quality = (video as any).getVideoPlaybackQuality?.();
        setStats((prev) => ({
          ...prev,
          resolution: `${video.videoWidth}x${video.videoHeight}`,
          bufferLengthSec: Math.max(0, Math.round((buffered - video.currentTime) * 10) / 10),
          droppedFrames: quality?.droppedVideoFrames || 0,
          decodedFrames: quality?.totalVideoFrames || 0,
        }));
      }
    };

    const onDurationChange = () => {
      setDuration(video.duration);
    };

    const onWaiting = () => setIsLoading(true);
    const onPlaying = () => {
      setIsLoading(false);
      setIsPlaying(true);
      setErrorMessage(null);
    };
    const onPause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('durationchange', onDurationChange);
    video.addEventListener('waiting', onWaiting);
    video.addEventListener('playing', onPlaying);
    video.addEventListener('pause', onPause);

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('durationchange', onDurationChange);
      video.removeEventListener('waiting', onWaiting);
      video.removeEventListener('playing', onPlaying);
      video.removeEventListener('pause', onPause);
    };
  }, [buffered, showStats]);

  // Handle play / pause toggle
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(console.error);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  // Skip time (+/- 10s)
  const skip = (delta: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(video.currentTime + delta, duration || Infinity));
  };

  // Volume change
  const handleVolumeChange = (newVolume: number) => {
    const video = videoRef.current;
    if (!video) return;
    const clamped = Math.max(0, Math.min(1, newVolume));
    video.volume = clamped;
    setVolume(clamped);
    if (clamped === 0) {
      video.muted = true;
      setIsMuted(true);
    } else {
      video.muted = false;
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isMuted) {
      video.muted = false;
      setIsMuted(false);
      if (volume === 0) {
        video.volume = 0.5;
        setVolume(0.5);
      }
    } else {
      video.muted = true;
      setIsMuted(true);
    }
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.error);
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.error);
    }
  };

  // Picture in Picture toggle
  const togglePiP = async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (videoRef.current && document.pictureInPictureEnabled) {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (e) {
      console.warn('PiP error:', e);
    }
  };

  // Quality switch
  const handleQualitySelect = (qualityId: number) => {
    setCurrentQuality(qualityId);
    if (hlsRef.current) {
      hlsRef.current.currentLevel = qualityId;
    }
    setShowQualityMenu(false);
  };

  // Playback speed switch
  const handleSpeedSelect = (speed: number) => {
    const video = videoRef.current;
    if (video) {
      video.playbackRate = speed;
      setPlaybackSpeed(speed);
    }
    setShowSpeedMenu(false);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'p':
          e.preventDefault();
          togglePiP();
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'arrowleft':
          e.preventDefault();
          skip(-10);
          break;
        case 'arrowright':
          e.preventDefault();
          skip(10);
          break;
        case 'arrowup':
          e.preventDefault();
          handleVolumeChange(volume + 0.1);
          break;
        case 'arrowdown':
          e.preventDefault();
          handleVolumeChange(volume - 0.1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, volume, isMuted, duration]);

  // Timeline hover calculation
  const handleTimelineMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressTrackRef.current || !duration) return;
    const rect = progressTrackRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setHoverPosition(pos * 100);
    setHoverTime(pos * duration);
  };

  const handleTimelineMouseLeave = () => {
    setHoverTime(null);
  };

  const handleTimelineSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressTrackRef.current || !videoRef.current || !duration) return;
    const rect = progressTrackRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    videoRef.current.currentTime = pos * duration;
  };

  const handleCopyLink = () => {
    if (currentSource?.url) {
      navigator.clipboard.writeText(currentSource.url);
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferedPercent = duration > 0 ? (buffered / duration) * 100 : 0;

  return (
    <div
      id="hd-video-player-container"
      ref={containerRef}
      onMouseMove={handleUserActivity}
      onClick={handleUserActivity}
      className={`relative w-full overflow-hidden bg-black select-none group transition-all duration-300 ${
        isTheaterMode
          ? 'h-[75vh] md:h-[82vh] rounded-none'
          : 'aspect-video max-h-[72vh] rounded-2xl shadow-2xl border border-zinc-800'
      }`}
    >
      {/* Video element */}
      <video
        id="html5-main-video"
        ref={videoRef}
        poster={poster}
        playsInline
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
      />

      {/* Loading Spinner */}
      {isLoading && !errorMessage && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xs pointer-events-none z-20">
          <div className="w-14 h-14 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-3" />
          <p className="text-xs text-zinc-300 font-medium tracking-wide">Buffering HD Stream...</p>
        </div>
      )}

      {/* Error / Pre-Kickoff Overlay */}
      {errorMessage && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/90 p-6 z-30 text-center">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mb-4 text-rose-400">
            <AlertCircle size={32} />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Stream Offline or Not Ready</h3>
          <p className="text-sm text-zinc-400 max-w-md mb-6 leading-relaxed">
            {warningMessage || errorMessage}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              id="retry-stream-button"
              onClick={() => {
                setErrorMessage(null);
                setIsLoading(true);
                if (hlsRef.current && currentSource?.url) {
                  hlsRef.current.loadSource(currentSource.url);
                  hlsRef.current.startLoad();
                }
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
            >
              Retry Connection
            </button>
            {sources.length > 1 && (
              <button
                id="switch-stream-source-btn"
                onClick={() => onSelectSource((activeSourceIndex + 1) % sources.length)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg border border-zinc-700 transition-colors"
              >
                Try Mirror Source ({activeSourceIndex + 1}/{sources.length})
              </button>
            )}
            <button
              id="copy-stream-url-btn"
              onClick={handleCopyLink}
              className="px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium rounded-lg border border-zinc-800 flex items-center gap-1.5 transition-colors"
            >
              <Copy size={13} />
              Copy Direct Stream URL
            </button>
          </div>
        </div>
      )}

      {/* Top Header Bar */}
      <div
        className={`absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent z-20 flex items-center justify-between transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-3 truncate pr-4">
          {isLive ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-600/90 text-white rounded-md text-xs font-bold uppercase tracking-wider animate-pulse">
              <Radio size={12} className="animate-ping" />
              LIVE
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-600/80 text-white rounded-md text-xs font-bold uppercase tracking-wider">
              RECAP
            </div>
          )}
          <div className="truncate">
            <h2 className="text-sm md:text-base font-semibold text-white truncate drop-shadow-sm">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-zinc-300 truncate drop-shadow-sm">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Stats for nerds toggle */}
          <button
            id="toggle-stats-hud-btn"
            onClick={() => setShowStats(!showStats)}
            title="Toggle Stream Telemetry"
            className={`p-2 rounded-lg text-xs font-medium transition-colors ${
              showStats
                ? 'bg-indigo-600 text-white'
                : 'bg-black/40 hover:bg-black/60 text-zinc-300 border border-white/10'
            }`}
          >
            <Activity size={15} />
          </button>

          {/* Sources Dropdown */}
          {sources.length > 1 && (
            <div className="relative">
              <button
                id="source-selector-toggle-btn"
                onClick={() => setShowSourceMenu(!showSourceMenu)}
                className="px-2.5 py-1.5 bg-black/50 hover:bg-black/70 text-zinc-200 border border-white/10 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Layers size={13} />
                <span>{currentSource?.name || `Server ${activeSourceIndex + 1}`}</span>
              </button>

              {showSourceMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-zinc-900/95 backdrop-blur-md border border-zinc-700 rounded-xl p-1.5 shadow-2xl z-30">
                  <div className="px-2.5 py-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-800 mb-1">
                    Stream Sources
                  </div>
                  {sources.map((src, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        onSelectSource(idx);
                        setShowSourceMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        activeSourceIndex === idx
                          ? 'bg-indigo-600/30 text-indigo-300 font-medium'
                          : 'text-zinc-300 hover:bg-zinc-800'
                      }`}
                    >
                      <span className="truncate">{src.name || `Source ${idx + 1}`}</span>
                      {activeSourceIndex === idx && <Check size={13} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Telemetry Stats Overlay */}
      {showStats && (
        <div className="absolute top-16 right-4 bg-black/85 backdrop-blur-md border border-zinc-800 rounded-xl p-3 text-[11px] font-mono text-zinc-300 z-20 w-64 shadow-xl pointer-events-none">
          <div className="text-zinc-400 font-semibold mb-1 pb-1 border-b border-zinc-800">
            Stream Diagnostics
          </div>
          <div className="grid grid-cols-2 gap-y-1 text-xs">
            <span className="text-zinc-500">Resolution:</span>
            <span className="text-zinc-200 font-medium">{stats.resolution || 'Auto'}</span>
            <span className="text-zinc-500">Bitrate:</span>
            <span className="text-zinc-200 font-medium">
              {stats.bitrateKbps ? `${stats.bitrateKbps} kbps` : 'Calculating...'}
            </span>
            <span className="text-zinc-500">Buffer Size:</span>
            <span className="text-zinc-200 font-medium">{stats.bufferLengthSec}s</span>
            <span className="text-zinc-500">Dropped Frames:</span>
            <span className="text-zinc-200 font-medium">{stats.droppedFrames}</span>
            <span className="text-zinc-500">Playback Speed:</span>
            <span className="text-zinc-200 font-medium">{playbackSpeed}x</span>
          </div>
        </div>
      )}

      {/* Center Play/Pause Large Action (on hover when paused) */}
      {!isPlaying && !isLoading && !errorMessage && (
        <button
          id="center-play-button"
          onClick={togglePlay}
          className="absolute inset-0 m-auto w-20 h-20 bg-indigo-600/90 hover:bg-indigo-500 text-white rounded-full flex items-center justify-center transition-all transform hover:scale-110 shadow-2xl z-20 cursor-pointer"
        >
          <Play size={36} className="ml-1" fill="currentColor" />
        </button>
      )}

      {/* Bottom Controls Bar */}
      <div
        className={`absolute bottom-0 inset-x-0 px-4 pb-4 pt-8 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-20 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Progress Bar (interactive for VOD/recaps) */}
        <div
          ref={progressTrackRef}
          onMouseMove={handleTimelineMouseMove}
          onMouseLeave={handleTimelineMouseLeave}
          onClick={handleTimelineSeek}
          className="relative w-full h-2 hover:h-3 bg-zinc-700/50 rounded-full cursor-pointer transition-all mb-3 group/progress"
        >
          {/* Buffered track */}
          <div
            className="absolute top-0 left-0 h-full bg-zinc-500/40 rounded-full pointer-events-none"
            style={{ width: `${bufferedPercent}%` }}
          />
          {/* Played track */}
          <div
            className="absolute top-0 left-0 h-full bg-indigo-500 rounded-full pointer-events-none"
            style={{ width: `${progressPercent}%` }}
          />
          {/* Scrubber head */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-md pointer-events-none opacity-0 group-hover/progress:opacity-100 transition-opacity"
            style={{ left: `${progressPercent}%` }}
          />

          {/* Hover timestamp tooltip */}
          {hoverTime !== null && (
            <div
              className="absolute -top-8 -translate-x-1/2 px-2 py-0.5 bg-zinc-900 border border-zinc-700 text-white text-[11px] rounded shadow pointer-events-none font-mono"
              style={{ left: `${hoverPosition}%` }}
            >
              {formatTime(hoverTime)}
            </div>
          )}
        </div>

        {/* Action Controls Row */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            {/* Play/Pause */}
            <button
              id="control-play-pause-btn"
              onClick={togglePlay}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-zinc-100 hover:text-white"
              title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            >
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
            </button>

            {/* Replay 10s */}
            <button
              id="control-replay-10s-btn"
              onClick={() => skip(-10)}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-zinc-300 hover:text-white"
              title="Seek backward 10s (←)"
            >
              <RotateCcw size={18} />
            </button>

            {/* Forward 10s */}
            <button
              id="control-forward-10s-btn"
              onClick={() => skip(10)}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-zinc-300 hover:text-white"
              title="Seek forward 10s (→)"
            >
              <RotateCw size={18} />
            </button>

            {/* Volume control */}
            <div className="flex items-center gap-1.5 group/volume">
              <button
                id="control-mute-toggle-btn"
                onClick={toggleMute}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-zinc-300 hover:text-white"
                title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX size={19} />
                ) : volume < 0.5 ? (
                  <Volume1 size={19} />
                ) : (
                  <Volume2 size={19} />
                )}
              </button>
              <input
                id="control-volume-slider"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-16 md:w-20 h-1 bg-zinc-600 rounded-lg accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Time display */}
            <div className="text-xs text-zinc-300 font-mono tracking-tight pl-2">
              {isLive ? (
                <span className="flex items-center gap-1.5 text-red-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  LIVE
                </span>
              ) : (
                <span>
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Speed Selector */}
            <div className="relative">
              <button
                id="control-speed-menu-btn"
                onClick={() => {
                  setShowSpeedMenu(!showSpeedMenu);
                  setShowQualityMenu(false);
                }}
                className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded-md text-xs font-semibold text-zinc-200 transition-colors"
                title="Playback Speed"
              >
                {playbackSpeed}x
              </button>

              {showSpeedMenu && (
                <div className="absolute bottom-9 right-0 bg-zinc-900/95 backdrop-blur-md border border-zinc-700 rounded-xl p-1 shadow-2xl z-30 min-w-28">
                  <div className="px-2 py-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                    Speed
                  </div>
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => handleSpeedSelect(spd)}
                      className={`w-full text-left px-2.5 py-1 rounded text-xs flex items-center justify-between transition-colors ${
                        playbackSpeed === spd
                          ? 'bg-indigo-600 text-white font-medium'
                          : 'text-zinc-300 hover:bg-zinc-800'
                      }`}
                    >
                      <span>{spd}x</span>
                      {playbackSpeed === spd && <Check size={12} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quality Selector */}
            {qualities.length > 0 && (
              <div className="relative">
                <button
                  id="control-quality-menu-btn"
                  onClick={() => {
                    setShowQualityMenu(!showQualityMenu);
                    setShowSpeedMenu(false);
                  }}
                  className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded-md text-xs font-semibold text-zinc-200 flex items-center gap-1 transition-colors"
                  title="Resolution Quality"
                >
                  <Settings size={13} />
                  <span>
                    {currentQuality === -1
                      ? 'Auto'
                      : qualities.find((q) => q.id === currentQuality)?.label || 'HD'}
                  </span>
                </button>

                {showQualityMenu && (
                  <div className="absolute bottom-9 right-0 bg-zinc-900/95 backdrop-blur-md border border-zinc-700 rounded-xl p-1 shadow-2xl z-30 min-w-32">
                    <div className="px-2 py-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                      Quality
                    </div>
                    <button
                      onClick={() => handleQualitySelect(-1)}
                      className={`w-full text-left px-2.5 py-1.5 rounded text-xs flex items-center justify-between transition-colors ${
                        currentQuality === -1
                          ? 'bg-indigo-600 text-white font-medium'
                          : 'text-zinc-300 hover:bg-zinc-800'
                      }`}
                    >
                      <span>Auto (Adaptive HD)</span>
                      {currentQuality === -1 && <Check size={13} />}
                    </button>
                    {qualities.map((q) => (
                      <button
                        key={q.id}
                        onClick={() => handleQualitySelect(q.id)}
                        className={`w-full text-left px-2.5 py-1.5 rounded text-xs flex items-center justify-between transition-colors ${
                          currentQuality === q.id
                            ? 'bg-indigo-600 text-white font-medium'
                            : 'text-zinc-300 hover:bg-zinc-800'
                        }`}
                      >
                        <span>{q.label}</span>
                        {currentQuality === q.id && <Check size={13} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Picture-in-Picture Toggle */}
            <button
              id="control-pip-toggle-btn"
              onClick={togglePiP}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-zinc-300 hover:text-white"
              title="Picture in Picture (P)"
            >
              <PictureInPicture size={18} />
            </button>

            {/* Theater Mode Toggle */}
            {onToggleTheater && (
              <button
                id="control-theater-toggle-btn"
                onClick={onToggleTheater}
                className={`p-1.5 rounded-lg transition-colors ${
                  isTheaterMode
                    ? 'text-indigo-400 bg-indigo-500/20'
                    : 'text-zinc-300 hover:text-white hover:bg-white/10'
                }`}
                title={isTheaterMode ? 'Standard View' : 'Theater Mode'}
              >
                <Tv size={18} />
              </button>
            )}

            {/* Fullscreen Toggle */}
            <button
              id="control-fullscreen-toggle-btn"
              onClick={toggleFullscreen}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-zinc-300 hover:text-white"
              title={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
            >
              {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
