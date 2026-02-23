"use client";

import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { cn } from "@/lib/utils";

interface VideoBackgroundProps {
  src: string;
  className?: string;
  overlay?: boolean;
  overlayOpacity?: number;
}

export interface VideoBackgroundRef {
  isMuted: boolean;
  toggleMute: () => boolean; // 返回新的静音状态
}

export const VideoBackground = forwardRef<VideoBackgroundRef, VideoBackgroundProps>(
  function VideoBackground(
    { src, className, overlay = true, overlayOpacity = 0.5 },
    ref
  ) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isMuted, setIsMuted] = useState(true);

    useEffect(() => {
      if (videoRef.current) {
        videoRef.current.play().catch(() => {
          // Autoplay was prevented
        });
      }
    }, []);

    const toggleMute = (): boolean => {
      const video = videoRef.current;
      if (video) {
        const newMutedState = !video.muted;
        video.muted = newMutedState;
        setIsMuted(newMutedState);
        
        if (!newMutedState) {
          video.volume = 1;
        }
        
        return newMutedState;
      }
      return true;
    };

    useImperativeHandle(ref, () => ({
      get isMuted() {
        return isMuted;
      },
      toggleMute,
    }), [isMuted]);

    return (
      <div className={cn("fixed inset-0 -z-10 overflow-hidden", className)}>
        {/* Video */}
        <video
          ref={videoRef}
          autoPlay
          loop
          playsInline
          muted={isMuted}
          className="w-full h-full object-cover"
        >
          <source src={src} type="video/mp4" />
        </video>

        {/* Overlay */}
        {overlay && (
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: overlayOpacity }}
          />
        )}

        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/50" />
      </div>
    );
  }
);
