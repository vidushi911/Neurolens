import React, { useState } from 'react';
import { Network, Dna, Cpu, ArrowRight } from 'lucide-react';
import { EnrichrPathway } from '../types';

interface PathwayNetworkGraphProps {
  topGenes: string[];
  pathways: EnrichrPathway[];
  onOpenGeneModal: (symbol: string) => void;
}

export const PathwayNetworkGraph: React.FC<PathwayNetworkGraphProps> = ({
  topGenes,
  pathways,
  onOpenGeneModal
}) => {
  const [hoveredGene, setHoveredGene] = useState<string | null>(null);
  const [hoveredPathway, setHoveredPathway] = useState<string | null>(null);

  const displayGenes = topGenes.slice(0, 6);
  const displayPathways = pathways.slice(0, 4);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Network className="w-4 h-4 text-emerald-600" />
            <span>Interactive Biological Connection Network</span>
          </h3>
          <p className="text-xs text-slate-500">
            Hover over nodes to trace connections from <strong className="text-indigo-700">Model</strong> → <strong className="text-amber-700">Genes</strong> → <strong className="text-emerald-700 font-bold">Pathways</strong>.
          </p>
        </div>

        <div className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
          Interactive Diagram
        </div>
      </div>

      {/* Network Container */}
      <div className="relative py-6 px-4 bg-slate-50/70 rounded-xl border border-slate-200/80 min-h-[320px] flex flex-col justify-between">
        {/* Layer 1: Model Root Node */}
        <div className="flex justify-center">
          <div className="px-5 py-2.5 rounded-xl bg-navy-950 text-white font-mono text-xs font-bold shadow-md flex items-center gap-2 border border-slate-700">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>XGBoost AD Classifier</span>
          </div>
        </div>

        <div className="flex justify-center my-2 text-slate-300">
          <ArrowRight className="w-4 h-4 rotate-90" />
        </div>

        {/* Layer 2: Important Genes Nodes */}
        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block text-center">
            SHAP Biomarker Genes
          </span>
          <div className="flex flex-wrap justify-center gap-3">
            {displayGenes.map((gene) => {
              const isHovered = hoveredGene === gene;
              return (
                <button
                  key={gene}
                  onClick={() => onOpenGeneModal(gene)}
                  onMouseEnter={() => setHoveredGene(gene)}
                  onMouseLeave={() => setHoveredGene(null)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
                    isHovered
                      ? 'bg-amber-500 text-white border-amber-600 scale-105 shadow-md'
                      : 'bg-white text-slate-800 border-slate-300 hover:border-amber-400'
                  }`}
                >
                  {gene}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center my-2 text-slate-300">
          <ArrowRight className="w-4 h-4 rotate-90" />
        </div>

        {/* Layer 3: Biological Pathways Nodes */}
        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block text-center">
            Biological Pathways (Enrichr)
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
            {displayPathways.map((path) => {
              const isConnected = hoveredGene ? path.overlappingGenes.includes(hoveredGene) : false;
              const isHovered = hoveredPathway === path.pathwayName;

              return (
                <div
                  key={path.pathwayName}
                  onMouseEnter={() => setHoveredPathway(path.pathwayName)}
                  onMouseLeave={() => setHoveredPathway(null)}
                  className={`p-3 rounded-xl border text-xs transition-all ${
                    isConnected || isHovered
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-md font-semibold'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="font-bold truncate">{path.pathwayName}</div>
                  <div className="text-[10px] opacity-80 font-mono mt-0.5">
                    Genes: {path.overlappingGenes.join(', ')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
