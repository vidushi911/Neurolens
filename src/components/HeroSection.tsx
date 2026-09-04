import React, { useState, useRef } from 'react';
import { GeneticDoodles } from './GeneticDoodles';

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
      className="relative min-h-[92vh] text-white flex flex-col justify-center items-start px-6 sm:px-12 lg:px-16 py-24 overflow-hidden border-b border-blue-800 selection:bg-yellow-300 selection:text-blue-950"
      style={{ backgroundColor: '#0000CD' }}
    >
      {/* Storytelling Cursor Spotlight Reveal Lens (WHITE BACKGROUND FOR CRISP VISIBILITY) */}
      <div
        className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-200 opacity-100"
        style={{
          maskImage: `radial-gradient(circle 260px at ${mousePos.x}px ${mousePos.y}px, black 40%, transparent 90%)`,
          WebkitMaskImage: `radial-gradient(circle 260px at ${mousePos.x}px ${mousePos.y}px, black 40%, transparent 90%)`,
        }}
      >
        <div className="w-full h-full bg-white flex items-center justify-center p-6 relative shadow-inner">
          <svg className="w-full max-w-5xl h-[420px] overflow-visible" viewBox="0 0 900 420">
            {/* Cute Patient Doodle (Smiling Grandma in Cozy Armchair) */}
            <g transform="translate(180, 190)">
              {/* Cozy Armchair */}
              <path d="M -60 40 Q -60 -40 -35 -40 L 35 -40 Q 60 -40 60 40 L 50 90 L -50 90 Z" fill="#fef2f2" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
              {/* Grandma Head & Hair Bun */}
              <circle cx="0" cy="-45" r="22" fill="#ffffff" stroke="#1e293b" strokeWidth="3" />
              <circle cx="0" cy="-70" r="11" fill="#fef08a" stroke="#ca8a04" strokeWidth="2.5" />
              {/* Glasses */}
              <circle cx="-8" cy="-45" r="7" fill="none" stroke="#0284c7" strokeWidth="2.5" />
              <circle cx="8" cy="-45" r="7" fill="none" stroke="#0284c7" strokeWidth="2.5" />
              <line x1="-1" y1="-45" x2="1" y2="-45" stroke="#0284c7" strokeWidth="2.5" />
              {/* Smiling Face */}
              <circle cx="-5" cy="-50" r="1.5" fill="#1e293b" />
              <circle cx="5" cy="-50" r="1.5" fill="#1e293b" />
              <path d="M -7 -36 Q 0 -28 7 -36" fill="none" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
              <text x="-45" y="115" fill="#e11d48" fontSize="13" fontFamily="JetBrains Mono" fontWeight="bold">
                PATIENT (ALZHEIMER&apos;S)
              </text>
            </g>

            {/* Heart & Gene Bridge (Center) */}
            <g transform="translate(450, 190)">
              {/* Connected Pathway Curve */}
              <path d="M -170 0 C -80 -100 80 100 170 0" fill="none" stroke="#0ea5e9" strokeWidth="3" strokeDasharray="6 6" />
              {/* Central Glowing Heart */}
              <path d="M 0 -25 C -15 -45 -35 -25 0 20 C 35 -25 15 -45 0 -25" fill="#f43f5e" stroke="#be123c" strokeWidth="3" />
              {/* Gene Biomarker Pills */}
              <g transform="translate(0, 55)">
                <rect x="-65" y="-14" width="130" height="28" rx="14" fill="#0ea5e9" stroke="#0284c7" strokeWidth="2" />
                <text x="-52" y="4" fill="#ffffff" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">
                  APOE · APP · MAPT
                </text>
              </g>
            </g>

            {/* Proper Researcher Doodle (Friendly Scientist in Labcoat examining Gene Helix) */}
            <g transform="translate(720, 190)">
              {/* Scientist Body & Labcoat */}
              <path d="M -30 25 L -45 90 L 45 90 L 30 25 Z" fill="#f0fdf4" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" />
              <line x1="0" y1="25" x2="0" y2="90" stroke="#16a34a" strokeWidth="2" />
              {/* Head & Goggles */}
              <circle cx="0" cy="-35" r="20" fill="#ffffff" stroke="#1e293b" strokeWidth="3" />
              <rect x="-14" cy="-42" width="28" height="12" rx="6" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2.5" />
              {/* Smile */}
              <path d="M -6 -23 Q 0 -17 6 -23" fill="none" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
              {/* Examining DNA Strand */}
              <g transform="translate(-45, -15)">
                <path d="M -15 -35 Q 0 -15 15 -35 M -15 -15 Q 0 -35 15 -15 M -15 5 Q 0 -15 15 5" fill="none" stroke="#ca8a04" strokeWidth="3" strokeLinecap="round" />
              </g>
              <text x="-60" y="115" fill="#15803d" fontSize="13" fontFamily="JetBrains Mono" fontWeight="bold">
                BIOMEDICAL RESEARCHER
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* Floating Hand-Drawn Physics Doodles in Vibrant Colors */}
      <GeneticDoodles opacity={0.95} />

      {/* Extreme Left-Aligned Text Content Box */}
      <div className="relative z-10 max-w-4xl text-left space-y-8 pl-0">
        {/* Main Headline in Big Gwen Variable Font */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-gwen text-white leading-[1.05] tracking-tight">
          From gene expression <br className="hidden sm:block" />
          to biological insight
        </h1>

        {/* Subtitle in Gwen Variable Font */}
        <p className="text-lg sm:text-xl md:text-2xl text-blue-100 font-gwen font-normal max-w-3xl leading-relaxed">
          Explore Alzheimer&apos;s gene-expression data, understand what drives a prediction, and discover the biological pathways behind it. Here, AI predictions meet biological meaning.
        </p>

        {/* NO BUTTONS AS REQUESTED */}
      </div>
    </section>
  );
};
