import { motion } from "motion/react";
import { Compass, Sparkles, Star, Milestone } from "lucide-react";
import AmbientAudio from "./components/AmbientAudio";
import QuoteStars from "./components/QuoteStars";
import ExtractReader from "./components/ExtractReader";

export default function App() {
  return (
    <div className="relative min-h-screen bg-midnight text-sand selection:bg-gold/30 selection:text-sand overflow-x-hidden p-0 m-0 flex flex-col font-sans">
      {/* Immersive Starlit Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080B1A] via-[#0D1226] to-[#050711] pointer-events-none z-0" />
      
      {/* Decorative Moon Or Giant Astéroïde B-612 Silhouette */}
      <div className="absolute top-20 right-[-100px] w-[500px] h-[500px] bg-gold/5 rounded-full blur-[100px] pointer-events-none select-none z-0" />
      <div className="absolute left-[-150px] bottom-1/4 w-[400px] h-[400px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none select-none z-0" />

      {/* Floating Interactive Star Sky Overlay */}
      <QuoteStars />

      {/* Primary Landing Page Container */}
      <header className="relative w-full max-w-7xl mx-auto px-6 py-6 md:py-8 z-20">
        <nav className="flex flex-col md:flex-row justify-between items-center md:items-baseline border-b border-white/10 pb-6 gap-4">
          <div className="text-[10px] font-semibold tracking-[0.3em] uppercase text-gold">
            Antoine de Saint-Exupéry
          </div>
          <div className="font-serif italic text-2xl text-sand hover:text-gold transition-colors duration-300">
            Le Petit Prince
          </div>
          <div className="flex items-center gap-6">
            <div className="text-[10px] font-semibold tracking-widest uppercase text-slate-400 hidden lg:block">
              1943 — New York
            </div>
            <AmbientAudio />
          </div>
        </nav>
      </header>

      {/* Huge Typographic Headline Banner from Design Theme */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12 md:py-16 flex flex-col justify-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative z-10"
        >
          {/* Subtle backdrop massive decorative quote mark */}
          <span className="font-serif text-[180px] md:text-[260px] text-gold/10 select-none absolute -top-28 md:-top-36 -left-4 md:-left-8 pointer-events-none">
            “
          </span>

          <h2 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-[130px] font-black uppercase leading-[0.85] tracking-tighter text-sand">
            L'ESSENTIEL
          </h2>
          <h2 
            className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-[130px] font-black uppercase leading-[0.85] tracking-tighter ml-12 sm:ml-24 md:ml-36 text-transparent" 
            style={{ WebkitTextStroke: "1px var(--color-gold)", textStroke: "1px var(--color-gold)" }}
          >
            EST INVISIBLE
          </h2>

          <div className="mt-8 ml-12 sm:ml-23 md:ml-36 max-w-xl">
            <p className="font-serif italic text-lg md:text-xl text-gold leading-relaxed">
              « Adieu, dit le renard. Voici mon secret. Il est très simple : on ne voit bien qu'avec le cœur. L'essentiel est invisible pour les yeux. »
            </p>
            <div className="w-16 h-[1px] bg-gold my-4" />
            <p className="text-xs tracking-wider opacity-60 uppercase font-mono text-sand">
              « — L'essentiel est invisible pour les yeux, répéta le petit prince, afin de se souvenir. »
            </p>
          </div>
        </motion.div>
      </section>

      {/* Main Core Literary Readers Deck */}
      <main className="relative flex-1 w-full z-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <ExtractReader />
        </motion.div>
      </main>

      {/* Cozy Book Dedication Footer with Styled Circle Icon and layout from Blueprint */}
      <footer className="relative w-full bg-[#050711]/90 border-t border-white/10 py-12 px-6 md:px-12 z-20 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-end gap-8">
          
          {/* Left part: Stellar Coordinate Icon and Labels */}
          <div className="flex gap-4 items-center">
            <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center shrink-0">
              <div className="w-2.5 h-2.5 bg-gold rounded-full animate-pulse" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-400">Coordonnées Stellaires</p>
              <p className="text-sm font-mono tracking-widest text-[#d97706] font-bold">ASTÉROÏDE B-612</p>
            </div>
          </div>

          {/* Center part: Classic childhood citation */}
          <div className="text-center max-w-md hidden lg:block">
            <p className="font-serif text-sm text-slate-400 italic">
              « Toutes les grandes personnes ont d'abord été des enfants. Mais peu d'entre elles s'en souviennent. »
            </p>
          </div>

          {/* Right part: Author's Note and citation background info */}
          <div className="text-center md:text-right max-w-sm">
            <p className="text-[10px] uppercase tracking-widest font-semibold text-gold mb-2">Note de l'auteur</p>
            <p className="text-xs leading-relaxed text-slate-300 italic font-serif">
              « C’est le temps que tu as perdu pour ta rose qui fait ta rose si importante. Les hommes ont oublié cette vérité, dit le renard. Mais tu ne dois pas l’oublier. »
            </p>
          </div>

        </div>
      </footer>
    </div>
  );
}
