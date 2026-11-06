"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Hls from "hls.js";
import { Play, Pause, Volume2, VolumeOff, Expand, Compress, SkipBack, SkipForward, Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

interface VideoPlayerProps {
  videoUrl: string;
  isHls?: boolean;
  poster?: string;
  subtitleTracks?: Array<{ label: string; url: string }>;
  qualityOptions?: Array<{ label: string; url: string; isHls?: boolean }>;
  onQualityChange?: (label: string) => void;
  className?: string;
}

export function VideoPlayer({
  videoUrl,
  isHls = false,
  poster,
  subtitleTracks = [],
  qualityOptions,
  onQualityChange,
  className,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState<string | null>(null);
  const [selectedSubtitle, setSelectedSubtitle] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [loading, setLoading] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);

  const destroyHls = useCallback(() => {
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
  }, []);

  const loadSource = useCallback((url: string, hls: boolean) => {
    destroyHls();
    const video = videoRef.current;
    if (!video) return;

    video.removeAttribute("src");
    video.load();

    if (hls && Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLoading(false);
        video.play().catch(() => {});
      });
    } else {
      video.src = url;
      video.oncanplay = () => setLoading(false);
      video.play().catch(() => {});
    }
  }, [destroyHls]);

  // Subtitle track
  useEffect(() => {
    const video = videoRef.current;
    if (!video || subtitleTracks.length === 0) return;

    subtitleTracks.forEach((track, index) => {
      const textTrack = video.addTextTrack("subtitles", track.label, "en");
      textTrack.mode = index === 0 ? "showing" : "hidden";
    });
  }, [subtitleTracks]);

  useEffect(() => {
    if (!videoUrl) return;
    loadSource(videoUrl, isHls);
    return destroyHls;
  }, [videoUrl, isHls, loadSource, destroyHls]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime || 0);
    };
    const handleDurationChange = () => {
      setDuration(video.duration || 0);
    };
    const handleLoaded = () => setLoading(false);
    const handleError = () => setLoading(false);

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("durationchange", handleDurationChange);
    video.addEventListener("loadeddata", handleLoaded);
    video.addEventListener("error", handleError);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("durationchange", handleDurationChange);
      video.removeEventListener("loadeddata", handleLoaded);
      video.removeEventListener("error", handleError);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    setIsMuted(!isMuted);
    video.muted = !isMuted;
  };

  const setVolumeLevel = (val: number) => {
    const video = videoRef.current;
    if (!video) return;
    setVolume(val);
    video.muted = false;
    setIsMuted(false);
    video.volume = val;
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;
    if (!isFullscreen) {
      container.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.();
    }
  };

  const seek = (delta: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(duration, (video.currentTime || 0) + delta));
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    if (!video) return;
    video.currentTime = pos * duration;
  };

  const handleFullscreenChange = () => {
    setIsFullscreen(document.fullscreenElement === containerRef.current);
  };

  useEffect(() => {
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handleMouseEnter = () => {
    setShowControls(true);
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
  };

  const handleMouseLeave = () => {
    if (!isPlaying) return;
    controlsTimeout.current = setTimeout(() => setShowControls(false), 3000);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => setShowControls(false), 3000);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-white/10 ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        poster={poster}
        playsInline
        preload="metadata"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
      <div className="absolute inset-0 flex items-center justify-center">
        {!isPlaying && !loading && (
          <div className="w-12 h-12 rounded-full bg-black/60 flex items-center justify-center backdrop-blur-sm hover:bg-black/80 transition-colors" onClick={togglePlay}>
            <Play size={24} className="text-white ml-1" />
          </div>
        )}
        {loading && (
          <div className="flex flex-col items-center gap-2">
            <RefreshCw size={24} className="text-violet-400 animate-spin" />
            <p className="text-xs text-muted-foreground">Loading...</p>
          </div>
        )}
      </div>

      {/* Controls Overlay */}
      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-transparent to-transparent">
          <div className="space-y-3">
            {/* Progress */}
            <div className="relative h-1.5 bg-gray-600 rounded-full cursor-pointer group" onClick={handleProgressClick}>
              <div
                className="h-full bg-violet-600 rounded-full"
                style={{ width: duration > 0 ? (currentTime / duration) * 100 : 0 }}
              />
              <div className="absolute -top-2 left-0 transform -translate-x-1/2 w-3 h-3 rounded-full bg-violet-400 opacity-0 group-hover:opacity-100 transition-opacity" style={{ left: duration > 0 ? (currentTime / duration) * 100 : 0 }} />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => seek(-10)}
                  className="w-8 h-8 rounded-full bg-gray-700/80 flex items-center justify-center text-white hover:bg-gray-600 transition-colors"
                >
                  <SkipBack size={16} />
                </button>
                <button
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center text-white hover:bg-violet-700 transition-colors"
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <button
                  onClick={() => seek(10)}
                  className="w-8 h-8 rounded-full bg-gray-700/80 flex items-center justify-center text-white hover:bg-gray-600 transition-colors"
                >
                  <SkipForward size={16} />
                </button>
              </div>

              <div className="flex items-center gap-3">
                {/* Quality */}
                {qualityOptions && qualityOptions.length > 1 && (
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-gray-400" />
                    <Select
                      value={selectedQuality || qualityOptions[0]?.label || "Auto"}
                      onValueChange={(val) => {
                        setSelectedQuality(val);
                        const opt = qualityOptions.find((o) => o.label === val);
                        if (opt) {
                          loadSource(opt.url, opt.isHls || false);
                          onQualityChange?.(val);
                        }
                      }}
                      className="w-32 bg-gray-800 border-gray-600 text-xs text-gray-200"
                    >
                      {qualityOptions.map((q) => (
                        <option key={q.label} value={q.label}>{q.label}</option>
                      ))}
                    </Select>
                  </div>
                )}

                {/* Subtitles */}
                {subtitleTracks.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Select
                      value={selectedSubtitle || "Off"}
                      onValueChange={(val) => setSelectedSubtitle(val === "Off" ? null : val)}
                      className="w-32 bg-gray-800 border-gray-600 text-xs text-gray-200"
                    >
                      <option value="Off">Off</option>
                      {subtitleTracks.map((t) => (
                        <option key={t.label} value={t.label}>{t.label}</option>
                      ))}
                    </Select>
                  </div>
                )}

                {/* Volume */}
                <button
                  onClick={toggleMute}
                  className="w-8 h-8 rounded-full bg-gray-700/80 flex items-center justify-center text-white hover:bg-gray-600 transition-colors"
                >
                  {isMuted || volume === 0 ? <VolumeOff size={16} /> : <Volume2 size={16} />}
                </button>

                {/* Fullscreen */}
                <button
                  onClick={toggleFullscreen}
                  className="w-8 h-8 rounded-full bg-gray-700/80 flex items-center justify-center text-white hover:bg-gray-600 transition-colors"
                >
                  {isFullscreen ? <Compress size={16} /> : <Expand size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
