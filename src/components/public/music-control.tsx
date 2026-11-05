"use client";

import { useRef, useState } from "react";

export function MusicControl() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      setMessage(null);
      return;
    }

    try {
      await audio.play();
      setIsPlaying(true);
      setMessage(null);
    } catch (error) {
      if (error instanceof DOMException && error.name === "NotAllowedError") {
        setMessage("Browser memblokir pemutaran. Coba tekan tombol lagi.");
        return;
      }

      console.error("Gagal memutar musik:", error);
      setMessage("Musik tidak dapat diputar.");
    }
  }

  return (
    <>
      <audio
        ref={audioRef}
        src="/music/good-day.mp3"
        loop
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => setMessage("File musik tidak dapat dimuat.")}
      />
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
        {message && (
          <p
            className="max-w-64 rounded-xl bg-white px-3 py-2 text-xs text-slate-600 shadow-lg"
            role="status"
          >
            {message}
          </p>
        )}
        <button
          type="button"
          onClick={toggleMusic}
          aria-label={isPlaying ? "Matikan musik" : "Putar musik"}
          aria-pressed={isPlaying}
          className="rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-fajar-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fajar-700"
        >
          {isPlaying ? "Matikan musik" : "Putar musik"}
        </button>
      </div>
    </>
  );
}
