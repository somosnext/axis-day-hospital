"use client";

import Image from "next/image";
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
    <div className="relative order-1 aspect-video w-full overflow-hidden border border-white/15 bg-black shadow-[0_32px_80px_rgba(0,0,0,.3)] lg:order-2">
      {isAvailable ? <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          controls
          preload="auto"
          poster="/images/RCZ_2199-HDR.jpg"
          aria-label="Vídeo institucional do Axis Day Hospital"
          onError={() => setIsAvailable(false)}
          className="h-full w-full object-contain"
        >
          <source src="/videos/axis-day.mp4" type="video/mp4" />
          Seu navegador não oferece suporte à reprodução deste vídeo.
        </video> : (
        <Image src="/images/RCZ_2199-HDR.jpg" alt="Ambiente cirúrgico do Axis Day Hospital" fill sizes="(min-width:1024px) 56vw,100vw" className="object-cover" />
      )}

      {isAvailable ? (
        <button
          type="button"
          onClick={toggleAudio}
          aria-label={isMuted ? "Ativar som do vídeo" : "Silenciar vídeo"}
          aria-pressed={!isMuted}
          className="absolute right-3 top-3 z-[2] inline-flex min-h-11 items-center gap-2 border border-white/35 bg-navy-950/75 px-4 text-xs font-medium tracking-wide text-white backdrop-blur-md transition-colors hover:bg-navy-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:right-5 sm:top-5"
        >
          {isMuted ? <VolumeX size={17} aria-hidden="true" /> : <Volume2 size={17} aria-hidden="true" />}
          {isMuted ? "Ativar som" : "Silenciar"}
        </button>
      ) : null}
    </div>
  );
}
