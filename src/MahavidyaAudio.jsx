import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import audioSrc from "./assets/atlasaudio-deep-meditation-588149.mp3";

const STORAGE_KEY = "mahavidya-audio-muted";
const GESTURES = ["pointerup", "click", "touchend", "keydown"];

export default function MahavidyaAudio() {
  const { pathname } = useLocation();
  const audioRef = useRef(null);
  const [muted, setMuted] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [silent, setSilent] = useState(false); // playing, but browser forced it muted

  const active = pathname === "/mahavidya" || pathname.startsWith("/mahavidya/");

  /* Create the audio element once */
  useEffect(() => {
    const audio = new Audio(audioSrc);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0.5;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  /* Autoplay on /mahavidya/*: try with sound, fall back to muted autoplay, unmute on first gesture */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!active || muted) {
      audio.pause();
      setSilent(false);
      return;
    }

    const remove = () => GESTURES.forEach((e) => window.removeEventListener(e, unlock));

    function unlock() {
      audio.muted = false;
      audio
        .play()
        .then(() => {
          setSilent(false);
          remove();
        })
        .catch(() => {});
    }

    audio.muted = false;
    audio
      .play()
      .then(() => {
        setSilent(false);
        remove();
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        // Sound blocked: start muted (always allowed), unmute on first gesture
        audio.muted = true;
        audio
          .play()
          .then(() => setSilent(true))
          .catch(() => setSilent(true));
      });

    GESTURES.forEach((e) => window.addEventListener(e, unlock));
    return remove;
  }, [active, muted]);

  const toggleMute = () => {
    const audio = audioRef.current;
    if (silent && audio) {
      audio.muted = false;
      audio.play().then(() => setSilent(false)).catch(() => {});
      return;
    }
    setMuted((m) => {
      const next = !m;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  if (!active) return null;

  const showMutedIcon = muted || silent;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3">
      {silent && !muted && (
        <span className="animate-pulse rounded-full border border-[#c9993a]/60 bg-[#1b1016]/90 px-3 py-1.5 text-xs text-[#e7c66b] backdrop-blur">
          Tap for sound
        </span>
      )}
      <button
        onClick={toggleMute}
        aria-label={muted ? "Play meditation music" : silent ? "Turn on sound" : "Mute meditation music"}
        aria-pressed={!showMutedIcon}
        title={muted ? "Play music" : silent ? "Turn on sound" : "Mute music"}
        className={`grid h-12 w-12 place-items-center rounded-full border border-[#c9993a] bg-[#1b1016]/85 text-[#e7c66b] shadow-lg backdrop-blur transition hover:bg-[#c9993a] hover:text-[#1b1016] focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
          silent && !muted ? "animate-pulse" : ""
        }`}
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M11 5 6 9H3v6h3l5 4V5Z" fill="currentColor" />
          {showMutedIcon ? (
            <>
              <line x1="16" y1="9" x2="22" y2="15" />
              <line x1="22" y1="9" x2="16" y2="15" />
            </>
          ) : (
            <>
              <path d="M15.5 8.5a5 5 0 0 1 0 7" />
              <path d="M18.5 5.5a9 9 0 0 1 0 13" />
            </>
          )}
        </svg>
      </button>
    </div>
  );
}