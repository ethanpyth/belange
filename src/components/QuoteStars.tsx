import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, Sparkles, BookOpen, Quote as QuoteIcon, X } from "lucide-react";
import { STARS_QUOTES } from "../data";
import { Quote, StarQuote } from "../types";

export default function QuoteStars() {
  const [stars, setStars] = useState<StarQuote[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  useEffect(() => {
    // Generate star positions randomly once on client mount
    const generatedStars: StarQuote[] = STARS_QUOTES.map((quote, idx) => {
      // Divide the sky grid so stars don't overlap too badly
      const segmentWidth = 100 / STARS_QUOTES.length;
      const x = Math.min(Math.max((idx * segmentWidth) + (Math.random() * (segmentWidth - 10)) + 5, 5), 95);
      const y = Math.min(Math.max((Math.random() * 60) + 10, 10), 75); // limit to upper 75% of sky background
      const size = Math.floor(Math.random() * 8) + 12; // 12px to 20px
      const delay = Math.random() * 4;

      return {
        id: `star-${quote.id}`,
        x,
        y,
        size,
        delay,
        quote
      };
    });
    setStars(generatedStars);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-10">
      {/* Tiny backdrop ambient stars (not clickable, purely aesthetic) */}
      <div className="absolute inset-0 bg-radial-[circle_at_top] from-indigo-900/10 via-transparent to-transparent opacity-80" />
      {[...Array(30)].map((_, idx) => {
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        const size = Math.random() * 2 + 1; // 1px to 3px
        const delay = Math.random() * 5;
        const duration = Math.random() * 3 + 2; // 2s to 5s

        return (
          <div
            key={`bg-star-${idx}`}
            className="absolute rounded-full bg-white opacity-40 animate-[pulse_infinite_ease-in-out]"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              width: `${size}px`,
              height: `${size}px`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`
            }}
          />
        );
      })}

      {/* Magical Interactive Wisdom Stars */}
      {stars.map((star) => (
        <motion.button
          key={star.id}
          id={`interactive-star-${star.id}`}
          onClick={() => setSelectedQuote(star.quote)}
          className="absolute text-amber-200 hover:text-amber-100 cursor-pointer pointer-events-auto flex items-center justify-center p-1.5 focus:outline-none transition-all group scale-100 hover:scale-125 z-20"
          style={{
            top: `${star.y}%`,
            left: `${star.x}%`
          }}
          initial={{ opacity: 0.1, scale: 0.8 }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.95, 1.05, 0.95]
          }}
          transition={{
            duration: 3 + star.delay % 4,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut"
          }}
        >
          {/* Glowing star back-shadow */}
          <span className="absolute -inset-1 rounded-full bg-amber-400/20 blur-sm opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-500" />
          
          <Star
            style={{ width: `${star.size}px`, height: `${star.size}px` }}
            className="fill-amber-300/40 group-hover:fill-amber-200 transition-colors cursor-pointer drop-shadow-[0_0_8px_rgba(253,224,71,0.6)]"
          />

          {/* Quick micro tooltip */}
          <span className="absolute top-full mt-1.5 opacity-0 group-hover:opacity-100 font-mono text-[9px] tracking-widest text-amber-200 uppercase bg-slate-900/70 backdrop-blur-md px-1.5 py-0.5 rounded border border-amber-500/20 shadow-lg pointer-events-none whitespace-nowrap transition-all duration-300 scale-90 group-hover:scale-100">
            Étoile de Sagesse
          </span>
        </motion.button>
      ))}

      {/* Quote display overlay */}
      <AnimatePresence>
        {selectedQuote && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md pointer-events-auto">
            {/* Modal card wrapper */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="relative max-w-xl w-full p-8 md:p-10 rounded-2xl bg-slate-900/90 border border-amber-400/30 shadow-[0_25px_50px_-12px_rgba(251,191,36,0.12)] overflow-hidden"
            >
              {/* Star-themed graphic border accents */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400/10 via-amber-400 to-amber-400/10" />
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-400/5 rounded-full blur-2xl" />

              {/* Close Button */}
              <button
                id="btn-close-quote-modal"
                onClick={() => setSelectedQuote(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full p-1.5 transition-all focus:outline-none"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-400/20 flex items-center justify-center mb-6">
                  <QuoteIcon className="w-4 h-4 text-amber-300 fill-amber-300/10" />
                </div>

                {/* French Version */}
                <span className="font-mono text-[10px] tracking-widest text-[#d97706] uppercase mb-1">
                  En français
                </span>
                <p className="font-serif text-lg md:text-xl text-slate-100 leading-relaxed font-medium mb-6">
                  « {selectedQuote.textFr} »
                </p>

                {/* Divider */}
                <div className="w-16 h-[1px] bg-slate-800 mb-6" />

                {/* English Version */}
                <span className="font-mono text-[10px] tracking-widest text-sky-400 uppercase mb-1">
                  In English
                </span>
                <p className="font-serif text-base text-slate-300 leading-relaxed italic mb-8">
                  &ldquo;{selectedQuote.textEn}&rdquo;
                </p>

                {/* Literary chapter details */}
                <div className="flex items-center gap-2 text-[11px] font-mono tracking-wider text-slate-500 bg-slate-950/40 border border-slate-800/60 rounded-full px-4 py-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-amber-300/70" />
                  <span>{selectedQuote.contextFr}</span>
                  <span className="text-slate-700">|</span>
                  <span className="text-slate-500 italic">{selectedQuote.contextEn}</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
