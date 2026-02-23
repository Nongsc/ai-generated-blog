"use client";

import { useRef, useState, createContext, useContext } from "react";
import { VideoBackground, VideoBackgroundRef } from "./VideoBackground";
import { Volume2, VolumeX } from "lucide-react";
import { useBasicConfig } from "@/contexts/SiteConfigContext";

interface GlobalBackgroundContextType {
  isMuted: boolean;
  toggleMute: () => void;
}

const GlobalBackgroundContext = createContext<GlobalBackgroundContextType>({
  isMuted: true,
  toggleMute: () => {},
});

export const useGlobalBackground = () => useContext(GlobalBackgroundContext);

interface GlobalBackgroundProps {
  children: React.ReactNode;
}

export function GlobalBackground({ children }: GlobalBackgroundProps) {
  const videoRef = useRef<VideoBackgroundRef>(null);
  const [isMuted, setIsMuted] = useState(true);
  const basicConfig = useBasicConfig();

  // 从配置获取背景设置
  const backgroundType = basicConfig?.backgroundType || 'none';
  const backgroundUrl = basicConfig?.backgroundUrl || '';
  const overlayOpacity = basicConfig?.overlayOpacity ?? 0.5;

  const toggleMute = () => {
    if (videoRef.current) {
      const newMutedState = videoRef.current.toggleMute();
      setIsMuted(newMutedState);
    }
  };

  // 渲染背景内容
  const renderBackground = () => {
    if (backgroundType === 'none' || !backgroundUrl) {
      // 默认渐变背景
      return (
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900" />
      );
    }

    if (backgroundType === 'video') {
      return (
        <VideoBackground
          ref={videoRef}
          src={backgroundUrl}
          overlayOpacity={overlayOpacity}
        />
      );
    }

    if (backgroundType === 'image') {
      return (
        <div className="fixed inset-0 -z-10 overflow-hidden">
          {/* Image */}
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${backgroundUrl})` }}
          />
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: overlayOpacity }}
          />
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/50" />
        </div>
      );
    }

    return null;
  };

  return (
    <GlobalBackgroundContext.Provider value={{ isMuted, toggleMute }}>
      {renderBackground()}

      {/* Sound Control Button - 仅视频背景时显示 */}
      {backgroundType === 'video' && backgroundUrl && (
        <button
          onClick={toggleMute}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-colors"
          title={isMuted ? "开启声音" : "关闭声音"}
          type="button"
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </button>
      )}

      {children}
    </GlobalBackgroundContext.Provider>
  );
}
