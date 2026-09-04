import React, { useState, useEffect } from 'react';
import { 
  Network, 
  Sparkles, 
  Database, 
  ExternalLink, 
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';
import { AnalysisState, EnrichrPathway } from '../../types';
import { runEnrichrPathwayAnalysis } from '../../services/enrichrService';
import { PathwayNetworkGraph } from '../PathwayNetworkGraph';
import { HelpTooltip } from '../HelpTooltip';

interface PathwaysTabProps {
  state: AnalysisState;
  onUpdateState: (updates: Partial<AnalysisState>) => void;
  onOpenGeneModal: (symbol: string) => void;
  myPathwayGenes: string[];
}

export const PathwaysTab: React.FC<PathwaysTabProps> = ({
  state,
  onUpdateState,
  onOpenGeneModal,
  myPathwayGenes
}) => {
  const [topGeneCount, setTopGeneCount] = useState<number>(state.topShapCount || 25);
  const [selectedDb, setSelectedDb] = useState<'GO Biological Process 2023' | 'KEGG 2021 Human' | 'Reactome 2022'>(
    state.selectedDatabase || 'KEGG 2021 Human'
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedPathway, setSelectedPathway] = useState<EnrichrPathway | null>(state.pathways[0] || null);
  const [showStats, setShowStats] = useState<boolean>(false);

  const activeGenes = myPathwayGenes.length > 0
    ? myPathwayGenes
    : state.globalShap.slice(0, topGeneCount).map(g => g.geneSymbol);

  const handleRunEnrichment = async () => {
    if (activeGenes.length === 0) return;
    setIsLoading(true);

    try {
      const pathways = await runEnrichrPathwayAnalysis(activeGenes, selectedDb);
      onUpdateState({
        enrichrStatus: 'complete',
        topShapCount: topGeneCount,
        selectedDatabase: selectedDb,
        pathways
      });
      setSelectedPathway(pathways[0] || null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (state.pathways.length === 0 && state.globalShap.length > 0) {
      handleRunEnrichment();
    }
  }, []);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-slate-900">What biology is hiding in these genes?</h1>
          <HelpTooltip term="pathway" />
        </div>
        <p className="text-xs text-slate-500 mt-1">
          We query top model-driving genes against established biological pathway databases (KEGG, Reactome, GO).
        </p>
      </div>

      {/* Interactive Pathway Network Connection Graph */}
      <PathwayNetworkGraph
        topGenes={activeGenes}
        pathways={state.pathways}
        onOpenGeneModal={onOpenGeneModal}
      />

      {/* Query Parameters Box */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600" />
              <span>Pathway Query Configuration</span>
            </h3>
            <p className="text-xs text-slate-500">
              Evaluating {activeGenes.length} genes against {selectedDb}.
            </p>
          </div>

          <button
            onClick={handleRunEnrichment}
            disabled={isLoading}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Searching pathways...</span>
              </>
            ) : (
              <>
                <Network className="w-4 h-4" />
                <span>Search Biological Pathways</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1">
              Input Gene Source ({activeGenes.length} genes)
            </label>
            <div className="flex items-center gap-2">
              {[10, 25, 50].map((num) => (
                <button
                  key={num}
                  onClick={() => setTopGeneCount(num)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                    topGeneCount === num && myPathwayGenes.length === 0
                      ? 'bg-navy-950 text-white'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  Top {num} SHAP
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1">
              Target Pathway Library
            </label>
            <select
              value={selectedDb}
              onChange={(e) => setSelectedDb(e.target.value as any)}
              className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white font-medium"
            >
              <option value="KEGG 2021 Human">KEGG 2021 Human (Canonical Pathways)</option>
              <option value="Reactome 2022">Reactome 2022 (Molecular Reactions)</option>
              <option value="GO Biological Process 2023">GO Biological Process 2023</option>
            </select>
          </div>
        </div>
      </div>

      {/* Interactive Pathway Cards Grid */}
      {state.pathways.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Cards List */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Enriched Pathways Overview</h3>

            <div className="space-y-3">
              {state.pathways.map((path) => {
                const isSelected = selectedPathway?.pathwayName === path.pathwayName;
                return (
                  <div
                    key={path.pathwayName}
                    onClick={() => setSelectedPathway(path)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/40 shadow-sm ring-1 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-slate-400">RANK #{path.rank}</span>
                        <h4 className="text-base font-bold text-slate-900 leading-snug">{path.pathwayName}</h4>
                      </div>

                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full font-mono shrink-0">
                        Score: {path.combinedScore}
                      </span>
                    </div>

                    {/* Overlapping Genes List */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {path.overlappingGenes.map(gene => (
                        <span key={gene} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono font-bold text-slate-800">
                          {gene}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Pathway Detail View */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 self-start sticky top-[80px]">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              Pathway Detail View
            </h3>

            {selectedPathway ? (
              <div className="space-y-5 text-xs">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Pathway Name</span>
                  <h4 className="font-bold text-slate-900 text-sm">{selectedPathway.pathwayName}</h4>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <strong className="text-[10px] font-mono uppercase text-slate-400 block">Why did this appear?</strong>
                  <p className="text-slate-700 leading-relaxed">
                    Several genes that strongly influenced the model are also associated with this biological process.
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-900 block">Genes involved in this pathway:</span>
                  <div className="space-y-1">
                    {selectedPathway.overlappingGenes.map(gene => (
                      <div
                        key={gene}
                        onClick={() => onOpenGeneModal(gene)}
                        className="p-2 rounded-lg bg-slate-50 border border-slate-200 hover:border-cyan-500 font-mono font-bold text-slate-900 flex justify-between items-center cursor-pointer transition-colors"
                      >
                        <span>{gene}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expandable Technical Statistics */}
                <div className="pt-2">
                  <button
                    onClick={() => setShowStats(!showStats)}
                    className="text-[11px] text-slate-500 hover:text-slate-800 font-medium inline-flex items-center gap-1"
                  >
                    <span>{showStats ? 'Hide detailed statistics' : 'Show detailed statistics'}</span>
                    {showStats ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>

                  {showStats && (
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-[10px] space-y-1 mt-2">
                      <div>Raw P-value: {selectedPathway.pValue.toExponential(3)}</div>
                      <div>Adjusted P-value (FDR): {selectedPathway.adjustedPValue.toExponential(3)}</div>
                      <div>Combined Score: {selectedPathway.combinedScore}</div>
                      <div>Total Pathway Genes: {selectedPathway.totalPathwayGenes}</div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Select a pathway card to view details.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
