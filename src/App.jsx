import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  ChevronDown, 
  Loader2, 
  Download,
  Sparkles,
  Maximize2,
  Minimize2,
  Image as ImageIcon,
  Palette,
  Sliders,
  RotateCcw
} from 'lucide-react';

/**
 * ESTUDIO MAESTRO V2.7.3 - ACTUALIZACIÓN DE FLUJO
 * Función de Reinicio de Estudio + Controles de Precisión
 * Acento: Gris Azulado Profundo (#334155)
 */

const App = () => {
  // --- Estados de Aplicación ---
  const [selectedStyle, setSelectedStyle] = useState('ÓLEO A ESPÁTULA');
  const [imagePreview, setImagePreview] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // --- Controles de Precisión ---
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  
  // --- Metadatos Técnicos ---
  const [metadata, setMetadata] = useState({
    id: "---",
    dimension: "0 x 0",
    format: "---",
    size: "0 MB",
    status: "STANDBY"
  });

  const styles = [
    'ÓLEO A ESPÁTULA',
    'CARBONCILLO CLÁSICO',
    'LÁPIZ TÉCNICO',
    'ÓLEO EMPASTADO',
    'ARTÍSTICO MODERNO',
    'B/N VINTAGE'
  ];

  // --- Tokens de Diseño Neomórfico ---
  const neoOuter = "shadow-[6px_6px_12px_#b8b9be,-6px_-6px_12px_#ffffff]";
  const neoInner = "shadow-[inset_6px_6px_12px_#b8b9be,inset_-6px_-6px_12px_#ffffff]";
  const neoButton = "transition-all duration-300 hover:shadow-[8px_8px_16px_#b8b9be,-8px_-8px_16px_#ffffff] active:shadow-[inset_4px_4px_8px_#b8b9be,inset_-4px_-4px_8px_#ffffff] active:scale-[0.98]";

  // --- Lógica de Negocio ---

  // Inicializar/Limpiar el estudio
  const resetStudio = () => {
    setImagePreview(null);
    setGeneratedImage(null);
    setBrightness(100);
    setContrast(100);
    setMetadata({
      id: "---",
      dimension: "0 x 0",
      format: "---",
      size: "0 MB",
      status: "STANDBY"
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setGeneratedImage(null);
        setMetadata(prev => ({ 
          ...prev, 
          status: "READY", 
          id: `REQ-${Math.floor(Math.random() * 9000) + 1000}` 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const transformImage = async () => {
    if (!imagePreview) return;
    setIsProcessing(true);
    setMetadata(prev => ({ ...prev, status: "RENDERING..." }));
    
    try {
      const apiKey = ""; 
      const stylePrompts = {
        'LÁPIZ TÉCNICO': 'Detailed technical pencil drawing, architectural style, high precision.',
        'ÓLEO A ESPÁTULA': 'Thick oil painting, heavy palette knife texture, impasto.',
        'CARBONCILLO CLÁSICO': 'Smudged charcoal drawing, artistic contrast, deep shadows.',
        'B/N VINTAGE': 'Classic silver gelatin photography print, fine film grain.'
      };
      
      const fullPrompt = `${stylePrompts[selectedStyle] || 'Professional artistic execution.'} Settings: Brightness ${brightness}%, Contrast ${contrast}%. Preserve 100% identity.`;
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: fullPrompt },
              { inlineData: { mimeType: "image/png", data: imagePreview.split(',')[1] } }
            ]
          }],
          generationConfig: { responseModalities: ['TEXT', 'IMAGE'] }
        })
      });

      const result = await response.json();
      const base64Data = result.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;
      
      if (base64Data) {
        setGeneratedImage(`data:image/png;base64,${base64Data}`);
        setMetadata({
          id: `ART-${Math.floor(Math.random() * 90000) + 10000}`,
          dimension: "1024 x 1024 px",
          format: "PNG (Lossless)",
          size: `${(base64Data.length * 0.75 / 1024 / 1024).toFixed(2)} MB`,
          status: "OPTIMIZED"
        });
      }
    } catch (error) {
      setMetadata(prev => ({ ...prev, status: "ERROR" }));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E0E5EC] text-slate-700 font-sans flex flex-col overflow-hidden selection:bg-slate-300">
      {/* HEADER */}
      <header className={`px-10 py-6 flex justify-between items-center z-50 transition-all duration-500 ${isFullscreen ? 'opacity-0 -translate-y-full' : 'opacity-100'}`}>
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-xl bg-[#E0E5EC] ${neoOuter}`}>
            <Palette size={18} className="text-slate-600" />
          </div>
          <h1 className="text-[14px] font-black uppercase tracking-[0.4em] text-slate-600">
            Architect <span className="text-slate-400 font-light tracking-[0.2em]">Studio</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={resetStudio}
            className={`p-3 rounded-xl ${neoOuter} ${neoButton} text-slate-400 hover:text-red-400`}
            title="Reiniciar Estudio"
          >
            <RotateCcw size={18} />
          </button>
          <button 
            onClick={() => setIsFullscreen(true)}
            className={`p-3 rounded-xl ${neoOuter} ${neoButton} text-slate-400 hover:text-slate-600`}
          >
            <Maximize2 size={18} />
          </button>
        </div>
      </header>

      <main className="flex flex-col md:flex-row flex-1 overflow-hidden p-8 gap-10">
        {/* PANEL DE CONTROL IZQUIERDO */}
        <aside className={`w-full md:w-[360px] flex flex-col shrink-0 transition-all duration-700 ${isFullscreen ? 'opacity-0 -translate-x-full absolute' : 'opacity-100'}`}>
          <div className={`flex-1 rounded-[2.5rem] p-8 flex flex-col space-y-8 ${neoOuter} bg-[#E0E5EC] overflow-y-auto no-scrollbar`}>
            
            {/* INPUT SECTION */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <ImageIcon size={14} className="text-slate-500" />
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Origen de Imagen</h2>
              </div>
              <div className={`group relative aspect-[4/3] rounded-3xl flex items-center justify-center cursor-pointer overflow-hidden transition-all ${neoInner}`}>
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    style={{ filter: `brightness(${brightness}%) contrast(${contrast}%)` }}
                    className="w-full h-full object-cover p-3 rounded-[2.2rem] transition-all duration-300" 
                    alt="Source" 
                  />
                ) : (
                  <div className="text-center">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 bg-[#E0E5EC] ${neoOuter} group-hover:scale-110 transition-transform`}>
                      <Upload className="w-6 h-6 text-slate-400" />
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Cargar Archivo</span>
                  </div>
                )}
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} />
              </div>
            </section>

            {/* PRECISION CONTROLS */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 px-1">
                <Sliders size={14} className="text-slate-500" />
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Ajustes de Precisión</h2>
              </div>
              
              <div className="space-y-5">
                <div className="space-y-3">
                  <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                    <span>Brillo</span>
                    <span className="text-slate-600 font-mono">{brightness}%</span>
                  </div>
                  <input 
                    type="range" min="50" max="150" value={brightness} 
                    onChange={(e) => setBrightness(e.target.value)}
                    className="w-full h-1.5 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-slate-600"
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                    <span>Contraste</span>
                    <span className="text-slate-600 font-mono">{contrast}%</span>
                  </div>
                  <input 
                    type="range" min="50" max="150" value={contrast} 
                    onChange={(e) => setContrast(e.target.value)}
                    className="w-full h-1.5 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-slate-600"
                  />
                </div>
              </div>
            </section>

            {/* STYLE SECTION */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <Sparkles size={14} className="text-slate-500" />
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Filtro Estético</h2>
              </div>
              <div className="relative">
                <select 
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className={`w-full bg-[#E0E5EC] rounded-2xl px-6 py-5 text-[12px] font-bold appearance-none outline-none focus:text-slate-900 transition-all tracking-wide cursor-pointer ${neoOuter}`}
                >
                  {styles.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </section>

            {/* CONSOLA DE DATOS */}
            <section className="mt-auto pt-4">
              <div className={`p-6 rounded-3xl text-[10px] font-mono space-y-3 ${neoInner} bg-[#E0E5EC]/30 text-slate-500`}>
                <div className="flex justify-between border-b border-slate-300/40 pb-2">
                  <span className="opacity-50 uppercase">Project_ID:</span>
                  <span className="font-bold">{metadata.id}</span>
                </div>
                <div className="flex justify-between border-b border-slate-300/40 pb-2">
                  <span className="opacity-50 uppercase">Resolución:</span>
                  <span>{metadata.dimension}</span>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <div className={`w-2.5 h-2.5 rounded-full shadow-sm ${isProcessing ? 'bg-amber-400 animate-pulse' : 'bg-slate-400'}`}></div>
                  <span className="text-[9px] font-bold tracking-widest uppercase italic">Sistema: {metadata.status}</span>
                </div>
              </div>
            </section>
          </div>
        </aside>

        {/* LIENZO DE TRABAJO */}
        <section className="flex-1 flex flex-col items-center justify-center relative">
          <div className={`w-full h-full flex flex-col items-center transition-all duration-700 ${isFullscreen ? 'max-w-5xl' : 'max-w-3xl'}`}>
            <div className={`bg-[#E0E5EC] rounded-[3rem] p-10 flex flex-col items-center justify-center relative flex-1 w-full transition-all duration-700 ${neoOuter} ${isProcessing ? 'scale-[0.97]' : 'scale-100'}`}>
              
              {isFullscreen && (
                <button 
                  onClick={() => setIsFullscreen(false)}
                  className={`absolute top-8 right-8 p-4 rounded-2xl z-20 text-slate-400 hover:text-red-500 transition-colors ${neoOuter} ${neoButton}`}
                >
                  <Minimize2 size={24} />
                </button>
              )}

              <div className={`w-full h-full rounded-[2.2rem] overflow-hidden flex items-center justify-center ${neoInner} bg-[#E0E5EC]/60`}>
                {generatedImage ? (
                  <img src={generatedImage} alt="Render" className="w-full h-full object-contain p-6 animate-in fade-in zoom-in-95 duration-700" />
                ) : (
                  <div className="text-center space-y-6 opacity-30">
                    <div className="text-6xl font-serif italic text-slate-400 select-none">Canvas</div>
                    <div className="flex justify-center gap-3">
                      {[1,2,3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-slate-400"></div>)}
                    </div>
                  </div>
                )}
              </div>

              {isProcessing && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#E0E5EC]/40 backdrop-blur-md z-10 rounded-[3rem]">
                  <div className={`px-10 py-8 rounded-[2rem] bg-[#E0E5EC] ${neoOuter} flex flex-col items-center gap-5`}>
                    <Loader2 className="w-10 h-10 text-slate-600 animate-spin" />
                    <span className="text-[11px] font-black tracking-[0.3em] uppercase text-slate-600">Procesando...</span>
                  </div>
                </div>
              )}
            </div>

            {/* BARRA DE ACCIONES */}
            <div className={`w-full h-32 flex items-center justify-center gap-10 transition-all duration-500 ${isFullscreen ? 'opacity-0 pointer-events-none h-0' : 'opacity-100'}`}>
              <button 
                onClick={transformImage}
                disabled={!imagePreview || isProcessing}
                className={`group flex items-center gap-4 px-16 py-5 rounded-2xl text-[12px] font-black uppercase tracking-[0.3em] bg-white text-slate-700 shadow-[8px_8px_16px_#b8b9be,-8px_-8px_16px_#ffffff] hover:shadow-[12px_12px_24px_#b8b9be,-12px_-12px_24px_#ffffff] active:scale-[0.97] transition-all disabled:opacity-40`}
              >
                {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} className="group-hover:text-slate-900" />}
                Renderizar
              </button>

              {generatedImage && !isProcessing && (
                <button 
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = generatedImage;
                    link.download = `art_${metadata.id}.png`;
                    link.click();
                  }}
                  className={`p-5 rounded-2xl bg-[#E0E5EC] text-slate-500 hover:text-slate-800 ${neoOuter} ${neoButton}`}
                >
                  <Download size={22} />
                </button>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;