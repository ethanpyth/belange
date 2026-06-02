import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function AmbientAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);

  // Stop sound on unmount
  useEffect(() => {
    return () => {
      stopAmbience();
    };
  }, []);

  const initAudio = () => {
    if (audioCtxRef.current) return;

    // Create AudioContext safely
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    audioCtxRef.current = ctx;

    // Create a filter to keep the sound warm and low-frequency
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(440, ctx.currentTime);
    filter.Q.setValueAtTime(1.5, ctx.currentTime);
    filterNodeRef.current = filter;

    // Create a main volume gain node
    const mainGain = ctx.createGain();
    mainGain.gain.setValueAtTime(0, ctx.currentTime);
    gainNodeRef.current = mainGain;

    // Connect nodes
    filter.connect(mainGain);
    mainGain.connect(ctx.destination);
  };

  const startAmbience = async () => {
    try {
      initAudio();
      
      const ctx = audioCtxRef.current;
      if (!ctx) return;

      // Resume context if suspended (browser security policy)
      if (ctx.state === "suspended") {
        await ctx.resume();
      }

      const mainGain = gainNodeRef.current;
      const filter = filterNodeRef.current;
      if (!mainGain || !filter) return;

      // Close previous oscillators just in case
      stopOscillators();

      // Root chord notes (C3, G3, C4, E4) -> Celestial pad harmonizer
      const freqs = [130.81, 196.00, 261.63, 329.63];
      const oscs: OscillatorNode[] = [];

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();

        // Use triangle waves for a very soft, woodwind-like timbre
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Add very subtle pitch drift (chorus effect)
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.frequency.setValueAtTime(freq + (idx * 0.4 - 0.8), ctx.currentTime);

        // Individual gains for balancing notes
        const individualGain = idx === 0 ? 0.3 : 0.2;
        oscGain.gain.setValueAtTime(individualGain, ctx.currentTime);

        osc.connect(oscGain);
        oscGain.connect(filter);
        osc.start();
        oscs.push(osc);
      });

      oscillatorsRef.current = oscs;

      // Create a subtle LFO (Low Frequency Oscillator) to modulate the filter frequency for a "shimmering star" effect
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.type = "sine";
      lfo.frequency.setValueAtTime(0.12, ctx.currentTime); // very slow: 8 seconds per sweep
      lfoGain.gain.setValueAtTime(120, ctx.currentTime); // sweep range +/- 120Hz

      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();
      oscillatorsRef.current.push(lfo);

      // Fade in smoothly over 2 seconds
      mainGain.gain.cancelScheduledValues(ctx.currentTime);
      mainGain.gain.setValueAtTime(mainGain.gain.value, ctx.currentTime);
      mainGain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 2.0); // Keep it extremely soft!

      setIsPlaying(true);
    } catch (e) {
      console.error("Web Audio failed to start:", e);
    }
  };

  const stopOscillators = () => {
    oscillatorsRef.current.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (err) {}
    });
    oscillatorsRef.current = [];
  };

  const stopAmbience = () => {
    const ctx = audioCtxRef.current;
    const mainGain = gainNodeRef.current;

    if (ctx && mainGain) {
      // Fade out smoothly over 1.2 seconds
      mainGain.gain.cancelScheduledValues(ctx.currentTime);
      mainGain.gain.setValueAtTime(mainGain.gain.value, ctx.currentTime);
      mainGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.2);

      // Stop oscillators after fade out completes
      setTimeout(() => {
        if (!isPlaying) {
          stopOscillators();
        }
      }, 1300);
    } else {
      stopOscillators();
    }
    setIsPlaying(false);
  };

  const togglePlayback = () => {
    if (isPlaying) {
      stopAmbience();
    } else {
      startAmbience();
    }
  };

  return (
    <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-4 py-2 hover:bg-white/10 transition-all duration-300 backdrop-blur-md">
      <button
        id="btn-bg-audio"
        onClick={togglePlayback}
        className="text-amber-300 hover:text-amber-200 focus:outline-none transition-colors"
        aria-label="Toggle ambient noise"
      >
        {isPlaying ? (
          <Volume2 className="h-5 w-5 animate-pulse" />
        ) : (
          <VolumeX className="h-5 w-5 text-slate-400" />
        )}
      </button>
      <div className="flex flex-col select-none">
        <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">
          {isPlaying ? "Musique céleste" : "Silence du désert"}
        </span>
        <span className="text-[9px] text-slate-500 font-mono">
          {isPlaying ? "Atmosphère stellaire" : "Activer la mélodie"}
        </span>
      </div>

      {isPlaying && (
        <div className="flex items-center gap-1.5 h-6 pl-1 pr-0.5">
          <span className="w-0.5 h-3 bg-amber-400/80 rounded-full animate-[bounce_1.2s_infinite_ease-in-out]" />
          <span className="w-0.5 h-4 bg-amber-400/60 rounded-full animate-[bounce_1.5s_infinite_ease-in-out_200ms]" />
          <span className="w-0.5 h-2.5 bg-amber-400/75 rounded-full animate-[bounce_1s_infinite_ease-in-out_400ms]" />
          <span className="w-0.5 h-5 bg-amber-400/90 rounded-full animate-[bounce_1.8s_infinite_ease-in-out] origin-bottom scale-75" />
        </div>
      )}
    </div>
  );
}
