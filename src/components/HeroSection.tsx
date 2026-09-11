import React, { useState, useRef } from 'react';
import { GeneticDoodles } from './GeneticDoodles';
import { Sparkles, ShieldAlert, Database, Cpu, Network } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: -500, y: -500 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[90vh] text-white flex flex-col justify-center items-start px-6 sm:px-12 lg:px-16 py-20 overflow-hidden border-b selection:bg-[#B5C7EB] selection:text-[#0000FF]"
      style={{ backgroundColor: '#0000FF', borderColor: 'rgba(181, 199, 235, 0.35)', color: '#FFFAFA' }}
    >
      {/* Storytelling Cursor Spotlight Reveal Lens */}
      <div
        className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-200 opacity-100"
        style={{
          maskImage: `radial-gradient(circle 260px at ${mousePos.x}px ${mousePos.y}px, black 40%, transparent 90%)`,
          WebkitMaskImage: `radial-gradient(circle 260px at ${mousePos.x}px ${mousePos.y}px, black 40%, transparent 90%)`,
        }}
      >
        <div className="w-full h-full bg-white flex items-center justify-center p-6 relative shadow-inner">
          <svg className="w-full max-w-5xl h-[420px] overflow-visible" viewBox="0 0 900 420">
            {/* Patient Sample Doodle */}
            <g transform="translate(180, 190)">
              <path d="M -60 40 Q -60 -40 -35 -40 L 35 -40 Q 60 -40 60 40 L 50 90 L -50 90 Z" fill="#fef2f2" stroke="#0000FF" strokeWidth="3" strokeLinecap="round" />
              <circle cx="0" cy="-45" r="22" fill="#ffffff" stroke="#1e293b" strokeWidth="3" />
              <circle cx="0" cy="-70" r="11" fill="#B5C7EB" stroke="#0000FF" strokeWidth="2.5" />
              <circle cx="-8" cy="-45" r="7" fill="none" stroke="#0000FF" strokeWidth="2.5" />
              <circle cx="8" cy="-45" r="7" fill="none" stroke="#0000FF" strokeWidth="2.5" />
              <line x1="-1" y1="-45" x2="1" y2="-45" stroke="#0000FF" strokeWidth="2.5" />
              <circle cx="-5" cy="-50" r="1.5" fill="#1e293b" />
              <circle cx="5" cy="-50" r="1.5" fill="#1e293b" />
              <path d="M -7 -36 Q 0 -28 7 -36" fill="none" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
              <text x="-75" y="115" fill="#0000FF" fontSize="12" fontFamily="JetBrains Mono" fontWeight="bold">
                NCBI GEO SAMPLE
              </text>
            </g>

            {/* Gene Bridge (Center) */}
            <g transform="translate(450, 190)">
              <path d="M -170 0 C -80 -100 80 100 170 0" fill="none" stroke="#0000FF" strokeWidth="3" strokeDasharray="6 6" />
              <path d="M 0 -25 C -15 -45 -35 -25 0 20 C 35 -25 15 -45 0 -25" fill="#0000FF" stroke="#0000FF" strokeWidth="3" />
              <g transform="translate(0, 55)">
                <rect x="-85" y="-14" width="170" height="28" rx="14" fill="#0000FF" stroke="#B5C7EB" strokeWidth="2" />
                <text x="-74" y="4" fill="#FFFAFA" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">
                  APOE · APP · MAPT · TREM2
                </text>
              </g>
            </g>

            {/* Researcher Doodle */}
            <g transform="translate(720, 190)">
              <path d="M -30 25 L -45 90 L 45 90 L 30 25 Z" fill="#f0fdf4" stroke="#0000FF" strokeWidth="3" strokeLinecap="round" />
              <line x1="0" y1="25" x2="0" y2="90" stroke="#0000FF" strokeWidth="2" />
              <circle cx="0" cy="-35" r="20" fill="#ffffff" stroke="#1e293b" strokeWidth="3" />
              <rect x="-14" cy="-42" width="28" height="12" rx="6" fill="#B5C7EB" stroke="#0000FF" strokeWidth="2.5" />
              <path d="M -6 -23 Q 0 -17 6 -23" fill="none" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
              <g transform="translate(-45, -15)">
                <path d="M -15 -35 Q 0 -15 15 -35 M -15 -15 Q 0 -35 15 -15 M -15 5 Q 0 -15 15 5" fill="none" stroke="#0000FF" strokeWidth="3" strokeLinecap="round" />
              </g>
              <text x="-70" y="115" fill="#0000FF" fontSize="12" fontFamily="JetBrains Mono" fontWeight="bold">
                TREE SHAP REASONING
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* Floating Hand-Drawn Physics Doodles */}
      <GeneticDoodles opacity={0.95} />

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl text-left space-y-8 pl-0">
        {/* Research RUO Badge */}
        <div
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono border font-semibold backdrop-blur-md"
          style={{ backgroundColor: 'rgba(181, 199, 235, 0.25)', borderColor: '#B5C7EB', color: '#FFFAFA' }}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
          <span>Research Prototype — For Research Use Only (RUO) — Non-Diagnostic</span>
        </div>

        {/* Main Headline */}
        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-gwen leading-[1.05] tracking-tight"
          style={{ color: '#FFFAFA' }}
        >
          From gene expression <br className="hidden sm:block" />
          to biological insight
        </h1>

        {/* Subtitle */}
        <p
          className="text-lg sm:text-xl md:text-2xl font-gwen font-normal max-w-3xl leading-relaxed"
          style={{ color: '#B5C7EB' }}
        >
          Explore Alzheimer&apos;s gene-expression data, train XGBoost ML models on NCBI GEO datasets, and uncover TreeSHAP feature attributions and Enrichr biological pathways.
        </p>

        {/* Pipeline Card */}
        <div
          className="p-4 rounded-2xl border max-w-3xl space-y-2 backdrop-blur-md"
          style={{ backgroundColor: 'rgba(181, 199, 235, 0.15)', borderColor: 'rgba(181, 199, 235, 0.35)' }}
        >
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-300">
            Biology → NCBI Data → ML → Result Pipeline
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono" style={{ color: '#FFFAFA' }}>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-300" />
              <span>1. NCBI GEO Data</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-300" />
              <span>2. XGBoost ML</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-300" />
              <span>3. TreeSHAP Weights</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-300" />
              <span>4. Enrichr Pathways</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
