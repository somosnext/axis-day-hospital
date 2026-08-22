"use client";

import { useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);

  async function toggleAudio() {
    const video = videoRef.current;
    if (!video) return;

    const shouldMute = !isMuted;
    video.muted = shouldMute;
    video.volume = 1;

    if (!shouldMute) {
      try {
        await video.play();
      } catch {
        video.muted = true;
        setIsMuted(true);
        return;
      }
    }

    setIsMuted(shouldMute);
  }

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        preload="auto"
        poster="/images/RCZ_2199-HDR.jpg"
        aria-hidden="true"
        tabIndex={-1}
        onError={() => setIsAvailable(false)}
        className="absolute inset-0 z-[1] h-full w-full object-cover object-center motion-reduce:hidden"
      >
        <source src="/videos/axis-day.mp4" type="video/mp4" />
      </video>

      {isAvailable ? (
        <button
          type="button"
          onClick={toggleAudio}
          aria-label={isMuted ? "Ativar som do vídeo" : "Silenciar vídeo"}
          aria-pressed={!isMuted}
          className="absolute bottom-6 left-6 z-[4] inline-flex min-h-11 items-center gap-2 border border-white/35 bg-navy-950/55 px-4 text-xs font-medium tracking-wide text-white backdrop-blur-md transition-colors hover:bg-navy-950/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:hidden"
        >
          {isMuted ? <VolumeX size={17} aria-hidden="true" /> : <Volume2 size={17} aria-hidden="true" />}
          {isMuted ? "Ativar som" : "Silenciar"}
        </button>
      ) : null}
    </>
  );
}
