import React, { useRef, useState, useEffect } from "react";
import { Paintbrush, Eraser, RotateCcw, Cloud, Star, Sparkles, Wand2 } from "lucide-react";

export default function Sketchpad() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#2a3543"); // Charcoal grey by default
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [activeTool, setActiveTool] = useState<"pencil" | "eraser">("pencil");
  const [feedback, setFeedback] = useState<string>("");
  const [feedbackMood, setFeedbackMood] = useState<"neutral" | "happy" | "critical">("neutral");

  // Keep track of coordinates
  const lastXRef = useRef(0);
  const lastYRef = useRef(0);

  // Initialize and resize canvas
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      // Save drawing state to restore after resizing
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext("2d");
      if (tempCtx) {
        tempCtx.drawImage(canvas, 0, 0);
      }

      // Resize canvas to fill the container nicely
      canvas.width = container.clientWidth;
      canvas.height = 360;

      // Setup styles on resized canvas
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        // Restore contents
        ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, 0, 0, canvas.width, canvas.height);
      }
    };

    handleResize();

    // Create a resize observer for accurate container measurements
    const observer = new ResizeObserver(() => handleResize());
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const getCoordinates = (e: MouseEvent | TouchEvent): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    
    if ("touches" in e) {
      if (e.touches.length === 0) return null;
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const coords = getCoordinates(e.nativeEvent);
    if (!coords) return;

    setIsDrawing(true);
    lastXRef.current = coords.x;
    lastYRef.current = coords.y;

    // Draw single dot on click
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      ctx.beginPath();
      ctx.arc(coords.x, coords.y, strokeWidth / 2, 0, Math.PI * 2);
      ctx.fillStyle = activeTool === "eraser" ? "#fbf8ef" : color; // Paper background color match #fbf8ef
      ctx.fill();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();

    const coords = getCoordinates(e.nativeEvent);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!coords || !canvas || !ctx) return;

    ctx.beginPath();
    ctx.moveTo(lastXRef.current, lastYRef.current);
    ctx.lineTo(coords.x, coords.y);
    
    ctx.strokeStyle = activeTool === "eraser" ? "#fbf8ef" : color;
    ctx.lineWidth = strokeWidth;
    ctx.stroke();

    lastXRef.current = coords.x;
    lastYRef.current = coords.y;
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setFeedback("");
    setFeedbackMood("neutral");
  };

  // Preset templates
  const drawCrateTemplate = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    clearCanvas();

    const w = canvas.width;
    const h = canvas.height;

    ctx.beginPath();
    ctx.strokeStyle = "#4b5563"; // Dark charcoal
    ctx.lineWidth = strokeWidth;

    // Outer rectangle (crate)
    const boxX = w / 2 - 100;
    const boxY = h / 2 - 60;
    const boxW = 200;
    const boxH = 120;

    // Draw crate walls with classic hand-drawn sketch style
    ctx.strokeRect(boxX, boxY, boxW, boxH);

    // Three breathing holes (as Saint-Exupéry drew them!)
    ctx.beginPath();
    ctx.arc(boxX + 50, boxY + boxH / 2, 10, 0, Math.PI * 2);
    ctx.arc(boxX + 100, boxY + boxH / 2, 10, 0, Math.PI * 2);
    ctx.arc(boxX + 150, boxY + boxH / 2, 10, 0, Math.PI * 2);
    ctx.fillStyle = "#2a3543";
    ctx.fill();

    // Plank separation lines to make it look like crate planks
    ctx.beginPath();
    ctx.moveTo(boxX, boxY + 40);
    ctx.lineTo(boxX + boxW, boxY + 40);
    ctx.moveTo(boxX, boxY + 80);
    ctx.lineTo(boxX + boxW, boxY + 80);
    ctx.stroke();

    // Labels
    ctx.font = "italic 14px 'EB Garamond', Georgia, serif";
    ctx.fillStyle = "#6b7280";
    ctx.fillText("La caisse secrète du Petit Prince", boxX + 10, boxY - 15);
    ctx.fillText("« Le mouton que tu veux est dedans. »", boxX - 10, boxY + boxH + 30);

    setFeedbackMood("happy");
    setFeedback(
      "« C'est tout à fait comme ça que je le voulais ! Le mouton est à l'intérieur, bien au chaud et endormi dans sa boîte... »"
    );
  };

  const drawContourTemplate = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    clearCanvas();

    const w = canvas.width;
    const h = canvas.height;
    const midX = w / 2;
    const midY = h / 2;

    ctx.beginPath();
    ctx.strokeStyle = "#9ca3af"; // Light gray guideline
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]); // Dashed line so they can trace

    // Draw a lovely bubbly fluffy sheep guide
    // Head oval
    ctx.arc(midX - 30, midY, 15, 0, Math.PI * 2);
    // Body cloud shape (several overlapping arcs)
    ctx.arc(midX + 10, midY, 35, 0, Math.PI * 2);
    ctx.arc(midX + 40, midY - 10, 25, 0, Math.PI * 2);
    ctx.arc(midX + 40, midY + 15, 25, 0, Math.PI * 2);
    ctx.stroke();

    // Reset dashed lines
    ctx.setLineDash([]);

    // Face / eye dots (permanent guide)
    ctx.beginPath();
    ctx.arc(midX - 35, midY - 3, 2, 0, Math.PI * 2);
    ctx.fillStyle = "#2a3543";
    ctx.fill();

    // Legend
    ctx.font = "italic 13px 'EB Garamond', Georgia, serif";
    ctx.fillStyle = "#9ca3af";
    ctx.textAlign = "center";
    ctx.fillText("Suis les pointillés pour dessiner un mouton timide", midX, midY + 90);

    setFeedback("");
  };

  const submitToPrince = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check pixel density to see if they actually drew something
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let pixelCount = 0;
    // Iterate through alpha values
    for (let i = 3; i < imgData.data.length; i += 4) {
      if (imgData.data[i] > 20) {
        pixelCount++;
      }
    }

    if (pixelCount < 100) {
      setFeedbackMood("critical");
      setFeedback(
        "« Mais voyons... Ta feuille est presque blanche ! S'il te plaît, dessine-moi un vrai mouton qui vive longtemps... »"
      );
    } else if (feedbackMood === "happy" && feedback.includes("caisse")) {
      // Already has crate template
      // Keep state
    } else if (pixelCount < 1800) {
      setFeedbackMood("neutral");
      setFeedback(
        "« Ah non ! Celui-là est déjà bien fatigué ou trop pressé... Fais-en un plus grand, ou construis une caisse pour qu'il ne s'échappe pas ! »"
      );
    } else {
      setFeedbackMood("happy");
      setFeedback(
        "« Oh ! Regarde ! Ses oreilles s'agitent, il me plaît énormément. Dis... crois-tu qu'il faille beaucoup d'herbe à ce mouton ? Parce que chez moi, c'est tout petit. »"
      );
    }
  };

  return (
    <div className="flex flex-col gap-5 h-full rounded-2xl bg-[#fbf8ef] border border-[#eadaab]/60 shadow-[0_4px_24px_rgba(30,20,5,0.06)] overflow-hidden">
      {/* Header and tools */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#eadaab]/40 bg-[#fbf8ef] px-6 py-4">
        <div className="flex flex-col">
          <span className="font-display text-sm tracking-widest text-[#5c4a3c] font-bold">CARNET DE SKETCH</span>
          <span className="font-serif text-xs italic text-[#8c7a6b]">« Dessine-moi un mouton... »</span>
        </div>

        {/* Tools panel */}
        <div className="flex items-center gap-2">
          {/* Active drawing tool tab */}
          <div className="flex rounded-lg bg-stone-200/50 p-1 border border-stone-300/30">
            <button
              id="draft-tool-pencil"
              onClick={() => {
                setActiveTool("pencil");
                setColor("#2a3543");
              }}
              className={`p-2 rounded-md transition-all ${
                activeTool === "pencil" && color === "#2a3543"
                  ? "bg-white shadow-sm text-amber-800"
                  : "text-stone-600 hover:text-stone-900"
              }`}
              title="Pinceau fusain"
            >
              <Paintbrush className="w-4 h-4" />
            </button>
            <button
              id="draft-tool-rose"
              onClick={() => {
                setActiveTool("pencil");
                setColor("#e11d48"); // Rose Red
              }}
              className={`p-2 rounded-md transition-all ${
                activeTool === "pencil" && color === "#e11d48"
                  ? "bg-white shadow-sm text-red-600"
                  : "text-stone-600 hover:text-red-500"
              }`}
              title="Crayon Rose"
            >
              <Cloud className="w-4 h-4 fill-red-200/50" />
            </button>
            <button
              id="draft-tool-star"
              onClick={() => {
                setActiveTool("pencil");
                setColor("#d97706"); // Star yellow-orange
              }}
              className={`p-2 rounded-md transition-all ${
                activeTool === "pencil" && color === "#d97706"
                  ? "bg-white shadow-sm text-amber-600"
                  : "text-stone-600 hover:text-amber-500"
              }`}
              title="Pinceau Étoile"
            >
              <Star className="w-4 h-4 fill-amber-200/50" />
            </button>
            <button
              id="draft-tool-eraser"
              onClick={() => setActiveTool("eraser")}
              className={`p-2 rounded-md transition-all ${
                activeTool === "eraser"
                  ? "bg-white shadow-sm text-amber-800"
                  : "text-stone-600 hover:text-stone-900"
              }`}
              title="Gomme"
            >
              <Eraser className="w-4 h-4" />
            </button>
          </div>

          {/* Stroke size selector */}
          <div className="flex items-center gap-2 pl-2">
            <div className="flex gap-1.5 items-end h-8">
              {[2, 4, 8].map((size) => (
                <button
                  key={size}
                  onClick={() => setStrokeWidth(size)}
                  className={`rounded-full transition-all flex items-center justify-center ${
                    strokeWidth === size ? "bg-amber-100 ring-2 ring-amber-400" : "hover:bg-stone-200"
                  }`}
                  style={{ width: `${size + 14}px`, height: `${size + 14}px` }}
                >
                  <span
                    className="bg-stone-700 rounded-full"
                    style={{ width: `${size}px`, height: `${size}px` }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Templates and reset */}
        <div className="flex items-center gap-2">
          <button
            id="btn-crate-template"
            onClick={drawCrateTemplate}
            className="flex items-center gap-1 px-3 py-1.5 border border-amber-200/70 rounded-full text-xs font-serif italic text-amber-800 bg-amber-50/50 hover:bg-amber-50 hover:border-amber-300 transition-colors"
          >
            <Wand2 className="w-3.5 h-3.5" />
            La Caisse de Saint-Exupéry
          </button>
          <button
            id="btn-outline-template"
            onClick={drawContourTemplate}
            className="flex items-center gap-1 px-3 py-1.5 border border-stone-200 rounded-full text-xs font-serif text-stone-600 bg-white hover:bg-stone-50 transition-colors"
          >
            Guide Pointillés
          </button>
          <button
            id="btn-clear-canvas"
            onClick={clearCanvas}
            className="p-1 px-2.5 border border-dashed border-stone-300 hover:border-red-300 hover:bg-red-50 text-stone-500 hover:text-red-600 rounded-full transition-colors font-mono text-xs"
            title="Effacer le carnet"
          >
            <RotateCcw className="w-3.5 h-3.5 inline mr-1" />
            Effacer
          </button>
        </div>
      </div>

      {/* Canvas workspace with sketched paper texture */}
      <div className="relative px-6 flex-1 flex flex-col justify-center min-h-[300px]" ref={containerRef}>
        {/* Gritty overlay mock paper background */}
        <div className="absolute inset-x-0 bottom-0 top-0 pointer-events-none opacity-[0.06] bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]" />
        
        {/* Lined notebook decoration */}
        <div className="absolute inset-y-0 left-12 w-[1px] bg-red-200 pointer-events-none" />
        <div className="absolute inset-x-0 top-1/4 h-[1px] bg-sky-200/30 pointer-events-none" />
        <div className="absolute inset-x-0 top-2/4 h-[1px] bg-sky-200/30 pointer-events-none" />
        <div className="absolute inset-x-0 top-3/4 h-[1px] bg-sky-200/30 pointer-events-none" />

        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="relative max-w-full bg-[#fbf8ef] cursor-crosshair rounded-lg border border-transparent select-none touch-none"
        />
      </div>

      {/* Control panel and Prince Feedback */}
      <div className="border-t border-[#eadaab]/40 bg-[#faf5e6] px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1 text-center md:text-left">
          {feedback ? (
            <div className={`p-3 rounded-lg border flex items-start gap-2 text-sm italic font-serif leading-relaxed ${
              feedbackMood === "happy" 
                ? "bg-emerald-50 border-emerald-100 text-emerald-800" 
                : feedbackMood === "critical"
                  ? "bg-rose-50 border-rose-100 text-rose-800"
                  : "bg-amber-50 border-amber-200/50 text-amber-800"
            }`}>
              <Sparkles className={`w-4 h-4 shrink-0 mt-0.5 ${feedbackMood === "happy" ? "text-emerald-500 animate-bounce" : "text-amber-500"}`} />
              <p>{feedback}</p>
            </div>
          ) : (
            <p className="text-sm font-serif text-stone-500 italic">
              Commence à esquisser, dessine un mouton doux ou utilise un modèle, puis présente-le !
            </p>
          )}
        </div>

        <button
          id="btn-submit-paint"
          onClick={submitToPrince}
          className="w-full md:w-auto flex items-center justify-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-serif rounded-lg text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-200" />
          Présenter au Petit Prince
        </button>
      </div>
    </div>
  );
}
