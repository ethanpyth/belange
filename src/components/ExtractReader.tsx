import { useState } from "react";
import { BookOpen, Globe, Type, Volume2, Square, Sparkles } from "lucide-react";
import { LiteraryExtract } from "../types";
import { LITERARY_EXTRACTS } from "../data";
import Sketchpad from "./Sketchpad";

export default function ExtractReader() {
  const [activeExtractId, setActiveExtractId] = useState<string>("la-rose");
  const [readingLanguage, setReadingLanguage] = useState<"fr" | "en" | "bilingual">("bilingual");
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg" | "xl">("lg");
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);

  const activeExtract = LITERARY_EXTRACTS.find(ext => ext.id === activeExtractId) || LITERARY_EXTRACTS[0];

  // Speech synthesis controller
  const handleStartSpeaking = (paragraphs: string[], index: number, langCode: string) => {
    if (!("speechSynthesis" in window)) {
      alert("Votre navigateur ne prend pas en charge la synthèse vocale.");
      return;
    }

    window.speechSynthesis.cancel(); // Stop any active speech

    if (speakingIndex === index) {
      setSpeakingIndex(null);
      return;
    }

    const textToSpeak = paragraphs[index];
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = langCode === "fr" ? "fr-FR" : "en-US";
    utterance.rate = 0.9; // Calm, storybook speed

    utterance.onend = () => {
      setSpeakingIndex(null);
    };

    utterance.onerror = () => {
      setSpeakingIndex(null);
    };

    setSpeakingIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  const handleStopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
    }
  };

  // Map font weight classes
  const fontSizesClasses = {
    sm: "text-sm leading-relaxed",
    base: "text-base leading-relaxed md:text-lg md:leading-relaxed",
    lg: "text-lg leading-loose md:text-xl md:leading-loose",
    xl: "text-xl leading-loose md:text-2xl md:leading-loose",
  };

  return (
    <div className="w-full flex flex-col gap-8 max-w-7xl mx-auto px-4 py-6 md:px-8">
      {/* Chapter Tabs / Quick Selector */}
      <div className="flex flex-col md:flex-row items-center justify-between border-b border-white/10 pb-6 gap-6">
        <div className="flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-amber-300" />
          <div className="flex flex-col">
            <h2 className="font-display text-lg tracking-widest text-white uppercase font-bold">
              Extraits à Explorer
            </h2>
            <span className="font-serif text-xs text-slate-400 italic">
              Naviguez entre les chapitres légendaires
            </span>
          </div>
        </div>

        {/* Dynamic Buttons for Chapters */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-900/.4 border border-white/5 p-1 rounded-xl backdrop-blur-md">
          {LITERARY_EXTRACTS.map((extract) => (
            <button
              key={extract.id}
              id={`tab-chapter-${extract.id}`}
              onClick={() => {
                setActiveExtractId(extract.id);
                handleStopSpeaking();
              }}
              className={`px-4 py-2 rounded-lg font-serif text-xs md:text-sm tracking-wide transition-all duration-300 ${
                activeExtractId === extract.id
                  ? "bg-amber-400/90 hover:bg-amber-400 text-slate-950 font-semibold shadow-lg"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="opacity-70 text-[10px] uppercase font-mono block pb-0.5">
                {extract.chapter}
              </span>
              {extract.id === "la-rose" && "La Rose"}
              {extract.id === "le-renard" && "Le Renard"}
              {extract.id === "dessine-moi-un-mouton" && "Dessine un mouton"}
            </button>
          ))}
        </div>
      </div>

      {/* Main Core Editor / Reader Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Aspect: Illustration or Whiteboard Interactive Block */}
        <div className="lg:col-span-5 flex flex-col gap-6 w-full lg:sticky lg:top-24">
          {activeExtractId === "dessine-moi-un-mouton" ? (
            /* Load interactive whiteboard sketching sheet */
            <Sketchpad />
          ) : (
            /* Displays framed beautiful hand-drawn watercolors */
            <div className="group relative rounded-2xl overflow-hidden bg-slate-950/40 border border-amber-300/20 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.5)] transition-all duration-500 hover:border-amber-300/40">
              <div className="absolute top-2 left-2 right-2 bottom-2 border border-amber-400/10 rounded-xl pointer-events-none" />
              
              <div className="aspect-[4/3] rounded-lg overflow-hidden border border-slate-800 relative bg-slate-900/50">
                <img
                  src={activeExtract.illustrationUrl}
                  alt={activeExtract.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Floating caption detail */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-4 pt-12">
                  <span className="font-mono text-[9px] tracking-widest text-[#d97706] uppercase block">
                    Aquarelle Poétique
                  </span>
                  <span className="font-serif text-xs text-slate-300 italic">
                    Dans le style original d'Antoine de Saint-Exupéry
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Inspirational block banner */}
          <div className="rounded-xl bg-gradient-to-br from-indigo-950/30 to-slate-900/40 border border-white/5 p-6 backdrop-blur-md">
            <span className="text-[#d97706] text-xs font-mono tracking-widest uppercase block mb-2">
              Le Secret de la Sagesse
            </span>
            <p className="font-serif text-sm italic text-slate-300 leading-relaxed">
              {activeExtract.quote}
            </p>
          </div>
        </div>

        {/* Right Aspect: Immersive translation book story sheet */}
        <div className="lg:col-span-7 flex flex-col gap-6 bg-slate-900/20 border border-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-md">
          {/* Controls Bar (Languages & Font utilities) */}
          <div className="flex flex-wrap items-center justify-between border-b border-white/5 pb-4 gap-4">
            {/* Bilingual settings */}
            <div className="flex items-center gap-1.5 bg-slate-950/40 p-1 border border-white/5 rounded-lg text-xs font-mono text-slate-400">
              <span className="p-1.5"><Globe className="w-3.5 h-3.5 text-slate-500" /></span>
              <button
                id="btn-lang-fr"
                onClick={() => setReadingLanguage("fr")}
                className={`px-2.5 py-1 rounded transition-colors ${
                  readingLanguage === "fr" ? "bg-amber-400/20 text-amber-200 font-semibold" : "hover:text-white"
                }`}
              >
                FR (Original)
              </button>
              <button
                id="btn-lang-en"
                onClick={() => setReadingLanguage("en")}
                className={`px-2.5 py-1 rounded transition-colors ${
                  readingLanguage === "en" ? "bg-amber-400/20 text-amber-200 font-semibold" : "hover:text-white"
                }`}
              >
                EN (English)
              </button>
              <button
                id="btn-lang-bilingual"
                onClick={() => setReadingLanguage("bilingual")}
                className={`px-2.5 py-1 rounded transition-colors ${
                  readingLanguage === "bilingual" ? "bg-amber-400/20 text-amber-200 font-semibold" : "hover:text-white"
                }`}
              >
                Bilingue
              </button>
            </div>

            {/* Accessibility features */}
            <div className="flex items-center gap-4">
              {/* Font size picker */}
              <div className="flex items-center gap-1 bg-slate-950/40 p-1 border border-white/5 rounded-lg text-xs font-mono text-slate-400">
                <span className="p-1"><Type className="w-3.5 h-3.5 text-slate-500" /></span>
                {(["sm", "base", "lg", "xl"] as const).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setFontSize(sz)}
                    className={`w-7 h-6 rounded flex items-center justify-center transition-all ${
                      fontSize === sz ? "bg-amber-400/20 text-amber-200 font-bold" : "hover:text-white"
                    }`}
                  >
                    {sz === "sm" && "A-"}
                    {sz === "base" && "A"}
                    {sz === "lg" && "A+"}
                    {sz === "xl" && "A++"}
                  </button>
                ))}
              </div>

              {speakingIndex !== null && (
                <button
                  id="btn-mute-speech"
                  onClick={handleStopSpeaking}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 rounded-lg text-xs transition-all animate-pulse"
                >
                  <Square className="w-3 h-3 fill-rose-300" />
                  S'arrêter
                </button>
              )}
            </div>
          </div>

          {/* Heading */}
          <div className="flex flex-col">
            <span className="font-mono text-[10px] tracking-widest text-[#d97706] uppercase font-bold">
              {activeExtract.chapter}
            </span>
            <h1 className="font-display text-2xl md:text-3xl font-semibold text-slate-100 tracking-wide mt-1">
              {activeExtract.title}
            </h1>
            <p className="font-serif text-sm italic text-slate-400 mt-1">
              {activeExtract.subtitle}
            </p>
          </div>

          {/* Core Story Reading Deck */}
          <div className="flex flex-col gap-6 md:gap-8 mt-4">
            {readingLanguage === "fr" && (
              <div className="flex flex-col gap-6">
                {activeExtract.textFr.map((para, index) => (
                  <div key={`fr-${index}`} className="group relative pl-2 border-l border-transparent hover:border-amber-400/30 transition-all duration-300">
                    <p className={`font-serif text-slate-300/90 hover:text-slate-100 transition-colors ${fontSizesClasses[fontSize]}`}>
                      {para}
                    </p>
                    <button
                      onClick={() => handleStartSpeaking(activeExtract.textFr, index, "fr")}
                      className={`absolute right-4 top-2 p-1.5 rounded-full bg-slate-950/80 border border-white/5 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity cursor-pointer ${
                        speakingIndex === index ? "opacity-100 text-amber-300" : "text-slate-400 hover:text-white"
                      }`}
                      title="Lire ce paragraphe"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {readingLanguage === "en" && (
              <div className="flex flex-col gap-6">
                {activeExtract.textEn.map((para, index) => (
                  <div key={`en-${index}`} className="group relative pl-2 border-l border-transparent hover:border-amber-400/30 transition-all duration-300">
                    <p className={`font-serif text-slate-300/95 hover:text-slate-100 transition-colors ${fontSizesClasses[fontSize]} italic`}>
                      {para}
                    </p>
                    <button
                      onClick={() => handleStartSpeaking(activeExtract.textEn, index, "en")}
                      className={`absolute right-4 top-2 p-1.5 rounded-full bg-slate-950/80 border border-white/5 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity cursor-pointer ${
                        speakingIndex === index ? "opacity-100 text-amber-300" : "text-slate-400 hover:text-white"
                      }`}
                      title="Read this paragraph"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {readingLanguage === "bilingual" && (
              <div className="flex flex-col gap-8 md:gap-10 split-align-bilingual">
                {activeExtract.textFr.map((paraFr, index) => {
                  const paraEn = activeExtract.textEn[index] || "";
                  return (
                    <div
                      key={`bi-${index}`}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 border-b border-white/5 pb-6 last:border-0 hover:bg-white/[0.01] rounded-xl p-2 transition-all group/bilingual"
                    >
                      {/* French Aspect */}
                      <div className="relative pl-3 border-l-2 border-amber-300/20 group-hover/bilingual:border-amber-300/50 transition-colors">
                        <span className="font-mono text-[9px] text-[#d97706] tracking-wider absolute -top-4 left-3 uppercase">
                          Français
                        </span>
                        <p className={`font-serif text-slate-200 ${fontSizesClasses[fontSize]}`}>
                          {paraFr}
                        </p>
                        <button
                          onClick={() => handleStartSpeaking(activeExtract.textFr, index, "fr")}
                          className={`absolute right-2 bottom-0 p-1.5 rounded-full bg-slate-950/80 border border-[#d97706]/30 opacity-0 group-hover/bilingual:opacity-100 transition-opacity cursor-pointer ${
                            speakingIndex === index ? "opacity-100 text-amber-300" : "text-slate-400 hover:text-white"
                          }`}
                          title="Écouter en français"
                        >
                          <Volume2 className="w-3 w-3" />
                        </button>
                      </div>

                      {/* English Aspect */}
                      <div className="relative pl-3 border-l-2 border-sky-500/10 group-hover/bilingual:border-sky-500/30 transition-colors pt-4 md:pt-0">
                        <span className="font-mono text-[9px] text-sky-400 tracking-wider absolute -top-4 left-3 uppercase">
                          English
                        </span>
                        <p className={`font-serif text-slate-400 italic ${fontSizesClasses[fontSize]}`}>
                          {paraEn}
                        </p>
                        <button
                          onClick={() => handleStartSpeaking(activeExtract.textEn, index, "en")}
                          className="absolute right-2 bottom-0 p-1.5 rounded-full bg-slate-950/80 border border-sky-400/20 opacity-0 group-hover/bilingual:opacity-100 transition-opacity cursor-pointer text-slate-400 hover:text-white"
                          title="Listen in English"
                        >
                          <Volume2 className="w-3 w-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
