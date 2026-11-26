import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, RotateCcw } from "lucide-react";

interface CustomVideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

export function CustomVideoPlayer({ src, poster, className = "" }: CustomVideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [hasEnded, setHasEnded] = useState(false);

  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    if (isPlaying) {
      hideTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2500);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      resetHideTimer();
    } else {
      setShowControls(true);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    }
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [isPlaying, resetHideTimer]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (hasEnded) {
      video.currentTime = 0;
      setHasEnded(false);
      video.play().catch(() => {});
      setIsPlaying(true);
      return;
    }

    if (video.paused) {
      video.play().catch(() => {});
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [hasEnded]);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const toggleFullscreen = async () => {
    const container = containerRef.current;
    if (!container) return;

    try {
      if (!document.fullscreenElement) {
        await container.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Fallback para navegadores antiguos
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const newTime = Number(e.target.value);
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    setDuration(video.duration);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setHasEnded(true);
    setShowControls(true);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      onMouseMove={resetHideTimer}
      onTouchStart={resetHideTimer}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className={`relative aspect-video w-full select-none overflow-hidden bg-black ${className}`}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        playsInline
        preload="metadata"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        className="h-full w-full cursor-pointer object-cover"
      >
        Tu navegador no soporta la reproducción de video HTML5.
      </video>

      {/* Botón central grande de Play / Replay cuando está pausado */}
      {(!isPlaying || hasEnded) && (
        <button
          type="button"
          onClick={togglePlay}
          aria-label={hasEnded ? "Reiniciar video" : "Reproducir video"}
          className="absolute inset-0 m-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#5b4bdb] text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-[#4a3bc2] active:scale-95"
        >
          {hasEnded ? (
            <RotateCcw size={32} />
          ) : (
            <Play size={34} className="ml-1 fill-current" />
          )}
        </button>
      )}

      {/* Barra de controles flotante minimalista (sin degradado de fondo que oscurezca el video) */}
      <div
        className={`absolute bottom-3 left-3 right-3 flex flex-col gap-2 rounded-2xl border border-white/10 bg-slate-950/85 px-4 py-2.5 text-white shadow-2xl backdrop-blur-md transition-opacity duration-300 ${
          showControls ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {/* Barra de progreso / Seek interactivo */}
        <div className="relative flex items-center">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            aria-label="Progreso del video"
            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-white/20 accent-[#5b4bdb] transition-all hover:h-2.5"
            style={{
              background: `linear-gradient(to right, #5b4bdb 0%, #5b4bdb ${progressPercent}%, rgba(255,255,255,0.2) ${progressPercent}%, rgba(255,255,255,0.2) 100%)`,
            }}
          />
        </div>

        {/* Botones de control inferiores */}
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pausar" : "Reproducir"}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/90 transition hover:bg-white/10 hover:text-white"
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5 fill-current" />}
            </button>

            <span className="font-mono text-xs text-white/80">
              {formatTime(currentTime)} <span className="text-white/40">/</span> {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? "Activar sonido" : "Silenciar"}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/90 transition hover:bg-white/10 hover:text-white"
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/90 transition hover:bg-white/10 hover:text-white"
            >
              {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
