import React, { useState, useRef } from 'react';
import { GeneticDoodles } from './GeneticDoodles';
import { ShieldAlert, Database, Cpu, Network, FlaskConical, ArrowRight } from 'lucide-react';

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
      className="relative min-h-[85vh] text-white flex flex-col justify-center items-start px-6 sm:px-12 lg:px-16 py-20 overflow-hidden border-b selection:bg-sky-200 selection:text-[#3B5DBF]"
      style={{ backgroundColor: '#3B5DBF', borderColor: 'rgba(255, 255, 255, 0.25)', color: '#FFFFFF' }}
    >
      {/* Storytelling Cursor Spotlight Reveal Lens */}
      <div
        className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-200 opacity-100"
        style={{
          maskImage: `radial-gradient(circle 260px at ${mousePos.x}px ${mousePos.y}px, black 40%, transparent 90%)`,
          WebkitMaskImage: `radial-gradient(circle 260px at ${mousePos.x}px ${mousePos.y}px, black 40%, transparent 90%)`,
        }}
      >
        <div className="w-full h-full bg-[#F5F8FC] flex items-center justify-center p-6 relative shadow-inner">
          <svg className="w-full max-w-5xl h-[420px] overflow-visible" viewBox="0 0 900 420">
            {/* Patient Sample Doodle */}
            <g transform="translate(180, 190)">
              <path d="M -60 40 Q -60 -40 -35 -40 L 35 -40 Q 60 -40 60 40 L 50 90 L -50 90 Z" fill="#ffffff" stroke="#3B5DBF" strokeWidth="3" strokeLinecap="round" />
              <circle cx="0" cy="-45" r="22" fill="#ffffff" stroke="#1e293b" strokeWidth="3" />
              <circle cx="0" cy="-70" r="11" fill="#D6EFFA" stroke="#3B5DBF" strokeWidth="2.5" />
              <circle cx="-8" cy="-45" r="7" fill="none" stroke="#3B5DBF" strokeWidth="2.5" />
              <circle cx="8" cy="-45" r="7" fill="none" stroke="#3B5DBF" strokeWidth="2.5" />
              <line x1="-1" y1="-45" x2="1" y2="-45" stroke="#3B5DBF" strokeWidth="2.5" />
              <circle cx="-5" cy="-50" r="1.5" fill="#1e293b" />
              <circle cx="5" cy="-50" r="1.5" fill="#1e293b" />
              <path d="M -7 -36 Q 0 -28 7 -36" fill="none" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
              <text x="-75" y="115" fill="#3B5DBF" fontSize="12" fontFamily="JetBrains Mono" fontWeight="bold">
                NCBI GEO AD DATASET
              </text>
            </g>

            {/* Gene Bridge (Center) */}
            <g transform="translate(450, 190)">
              <path d="M -170 0 C -80 -100 80 100 170 0" fill="none" stroke="#3B5DBF" strokeWidth="3" strokeDasharray="6 6" />
              <path d="M 0 -25 C -15 -45 -35 -25 0 20 C 35 -25 15 -45 0 -25" fill="#3B5DBF" stroke="#3B5DBF" strokeWidth="3" />
              <g transform="translate(0, 55)">
                <rect x="-95" y="-14" width="190" height="28" rx="14" fill="#3B5DBF" stroke="#D6EFFA" strokeWidth="2" />
                <text x="-85" y="4" fill="#FFFFFF" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">
                  BACE1 · APOE · APP · PSEN1
                </text>
              </g>
            </g>

            {/* Researcher Doodle */}
            <g transform="translate(720, 190)">
              <path d="M -30 25 L -45 90 L 45 90 L 30 25 Z" fill="#ffffff" stroke="#3B5DBF" strokeWidth="3" strokeLinecap="round" />
              <line x1="0" y1="25" x2="0" y2="90" stroke="#3B5DBF" strokeWidth="2" />
              <circle cx="0" cy="-35" r="20" fill="#ffffff" stroke="#1e293b" strokeWidth="3" />
              <rect x="-14" cy="-42" width="28" height="12" rx="6" fill="#D6EFFA" stroke="#3B5DBF" strokeWidth="2.5" />
              <path d="M -6 -23 Q 0 -17 6 -23" fill="none" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
              <g transform="translate(-45, -15)">
                <path d="M -15 -35 Q 0 -15 15 -35 M -15 -15 Q 0 -35 15 -15 M -15 5 Q 0 -15 15 5" fill="none" stroke="#3B5DBF" strokeWidth="3" strokeLinecap="round" />
              </g>
              <text x="-70" y="115" fill="#3B5DBF" fontSize="12" fontFamily="JetBrains Mono" fontWeight="bold">
                EXPLAINABLE AI &amp; DOCKING
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* Floating Physics Doodles */}
      <GeneticDoodles opacity={0.65} />

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl text-left space-y-8 pl-0">
        {/* Research RUO Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono border font-semibold bg-white/15 border-white/30 text-white backdrop-blur-md">
          <ShieldAlert className="w-3.5 h-3.5 text-sky-200" />
          <span>Research Prototype — For Research Use Only (RUO) — Non-Diagnostic</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold font-sans leading-[1.08] tracking-tight text-white">
          From gene expression <br className="hidden sm:block" />
          to biological insight &amp; target docking
        </h1>

        {/* Subtitle with Plain-Language First Explanations */}
        <p className="text-base sm:text-lg md:text-xl font-sans font-normal max-w-3xl leading-relaxed text-sky-100">
          Explore Alzheimer's gene-expression data, train machine-learning models (XGBoost) on public NCBI GEO datasets, reveal exact driver genes using explainable AI (SHAP), and dock candidate drug molecules against 3D target protein structures.
        </p>

        {/* Linear Pipeline Summary Card */}
        <div className="p-4 rounded-2xl border max-w-3xl space-y-2 bg-white/10 border-white/20 backdrop-blur-md">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-sky-200">
            Linear Discovery Pipeline
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-sans text-white">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-sky-200 shrink-0" />
              <span>1. GEO Expression Data</span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-sky-200 shrink-0" />
              <span>2. XGBoost Learning</span>
            </div>
            <div className="flex items-center gap-2">
              <Network className="w-4 h-4 text-sky-200 shrink-0" />
              <span>3. SHAP Biomarkers</span>
            </div>
            <div className="flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-sky-200 shrink-0" />
              <span>4. AutoDock Vina</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
