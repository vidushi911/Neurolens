import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  PlusCircle, 
  Check, 
  ExternalLink, 
  TrendingUp, 
  TrendingDown,
  Info,
  Layers,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { AnalysisState, GeneSHAP } from '../../types';
import { HelpTooltip } from '../HelpTooltip';
import { ALZHEIMER_GENE_INFO } from '../../data/gse63063Dataset';

interface ExplainTabProps {
  state: AnalysisState;
  onOpenGeneModal: (symbol: string) => void;
  myPathwayGenes: string[];
  setMyPathwayGenes: React.Dispatch<React.SetStateAction<string[]>>;
}

export const ExplainTab: React.FC<ExplainTabProps> = ({
  state,
  onOpenGeneModal,
  myPathwayGenes,
  setMyPathwayGenes
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [directionFilter, setDirectionFilter] = useState<'All' | 'Up in AD' | 'Down in AD'>('All');
  const [viewMode, setViewMode] = useState<'bar' | 'beeswarm'>('bar');
  const [selectedGene, setSelectedGene] = useState<GeneSHAP | null>(state.globalShap[0] || null);
  const [viewPerspective, setViewPerspective] = useState<'model' | 'biology'>('model');

  const globalShap = state.globalShap;

  const filteredGenes = globalShap.filter(gene => {
    const matchesSearch = gene.geneSymbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (gene.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDir = directionFilter === 'All' || gene.direction === directionFilter;
    return matchesSearch && matchesDir;
  });

  const maxShapVal = globalShap.length > 0 ? Math.max(...globalShap.map(g => g.meanAbsShap)) : 1.0;

  const toggleMyPathwayGene = (geneSymbol: string) => {
    if (myPathwayGenes.includes(geneSymbol)) {
      setMyPathwayGenes(myPathwayGenes.filter(g => g !== geneSymbol));
    } else {
      setMyPathwayGenes([...myPathwayGenes, geneSymbol]);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-slate-900">Why did the model classify this profile?</h1>
          <HelpTooltip term="shap" />
        </div>
        <p className="text-xs text-slate-500 mt-1">
          TreeSHAP attributions reveal exact gene feature weights driving AD-associated profile predictions.
        </p>
      </div>

      {/* Perspective Toggle Bar (Model Explanation vs Biological Interpretation) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-700">Perspective Mode:</span>
          <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-mono">
            <button
              onClick={() => setViewPerspective('model')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                viewPerspective === 'model'
                  ? 'bg-navy-950 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Model Explanation (SHAP Weights)
            </button>
            <button
              onClick={() => setViewPerspective('biology')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                viewPerspective === 'biology'
                  ? 'bg-[#0000FF] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Biological Interpretation (Biomarkers)
            </button>
          </div>
        </div>

        {/* View mode toggle (Bar vs Beeswarm) */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">View Plot:</span>
          <button
            onClick={() => setViewMode('bar')}
            className={`px-2.5 py-1 rounded-lg border font-bold ${
              viewMode === 'bar' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200'
            }`}
          >
            Bar Importance
          </button>
          <button
            onClick={() => setViewMode('beeswarm')}
            className={`px-2.5 py-1 rounded-lg border font-bold ${
              viewMode === 'beeswarm' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200'
            }`}
          >
            SHAP Summary Dots
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Gene Importance Visualization */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {viewPerspective === 'model' ? 'Top Model-Driving Gene Attributions' : 'Prioritized Biomarker Genes'}
              </h3>
              <p className="text-xs text-slate-500">Click any gene row to inspect UniProt/NCBI annotations or add to pathway list.</p>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search gene..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-cyan-500"
                />
              </div>

              <select
                value={directionFilter}
                onChange={(e) => setDirectionFilter(e.target.value as any)}
                className="text-xs p-1.5 border border-slate-200 rounded-lg bg-white font-mono"
              >
                <option value="All">All Impact Directions</option>
                <option value="Up in AD">Push AD (+)</option>
                <option value="Down in AD">Push Control (-)</option>
              </select>
            </div>
          </div>

          {/* Gene List */}
          <div className="space-y-3">
            {filteredGenes.slice(0, 15).map((gene) => {
              const isSelected = selectedGene?.geneSymbol === gene.geneSymbol;
              const isSaved = myPathwayGenes.includes(gene.geneSymbol);
              const barWidth = Math.max(8, (gene.meanAbsShap / maxShapVal) * 100);

              return (
                <div
                  key={gene.geneSymbol}
                  onClick={() => setSelectedGene(gene)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-50/30 shadow-sm ring-1 ring-cyan-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-mono font-bold flex items-center justify-center">
                        #{gene.rank}
                      </span>
                      <span className="font-bold font-mono text-slate-900 text-sm">{gene.geneSymbol}</span>

                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          gene.direction === 'Up in AD'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {gene.direction === 'Up in AD' ? 'Push AD Profile (+)' : 'Push Control Profile (-)'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-slate-900">
                        |SHAP|: {gene.meanAbsShap}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMyPathwayGene(gene.geneSymbol);
                        }}
                        className={`p-1 rounded-md text-xs font-medium transition-colors ${
                          isSaved
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                        }`}
                        title={isSaved ? 'Remove from My Pathway List' : 'Add to My Pathway List'}
                      >
                        {isSaved ? <Check className="w-3.5 h-3.5" /> : <PlusCircle className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Visual Bar or Dot Plot */}
                  {viewMode === 'bar' ? (
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          gene.direction === 'Up in AD' ? 'bg-rose-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 py-1">
                      {/* Beeswarm dots simulation */}
                      {Array.from({ length: 8 }).map((_, i) => (
                        <span
                          key={i}
                          className={`w-2 h-2 rounded-full inline-block opacity-80 ${
                            gene.direction === 'Up in AD' ? 'bg-rose-500' : 'bg-emerald-500'
                          }`}
                          style={{
                            transform: `translateX(${(i - 4) * 3}px)`
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Gene Detail Inspector Panel */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 self-start sticky top-[80px]">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
            <span>Biomarker Context Card</span>
            {selectedGene && (
              <button
                onClick={() => onOpenGeneModal(selectedGene.geneSymbol)}
                className="text-xs text-cyan-700 hover:underline flex items-center gap-1 font-mono"
              >
                <span>Full Card</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </h3>

          {selectedGene ? (
            <div className="space-y-5 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Gene Symbol</span>
                  <h4 className="text-2xl font-bold font-mono text-slate-900">{selectedGene.geneSymbol}</h4>
                </div>

                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    selectedGene.direction === 'Up in AD'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {selectedGene.direction}
                </span>
              </div>

              {/* Biological Annotation */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <strong className="text-[10px] font-mono uppercase text-slate-400 block">Biological Role &amp; Pathophysiology</strong>
                <p className="text-slate-700 leading-relaxed">
                  {ALZHEIMER_GENE_INFO[selectedGene.geneSymbol] || selectedGene.description || 'Key regulatory transcript implicated in cortical microglial and neuronal maintenance.'}
                </p>
              </div>

              {/* Expression Comparison */}
              <div className="grid grid-cols-2 gap-3 text-center font-mono">
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200">
                  <span className="text-[9px] text-rose-700 uppercase block font-semibold">AD Avg Exp</span>
                  <span className="text-base font-bold text-rose-950">{selectedGene.adExpressionAvg}</span>
                </div>

                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                  <span className="text-[9px] text-emerald-700 uppercase block font-semibold">Ctrl Avg Exp</span>
                  <span className="text-base font-bold text-emerald-950">{selectedGene.controlExpressionAvg}</span>
                </div>
              </div>

              {/* Add to My Pathway List Button */}
              <button
                onClick={() => toggleMyPathwayGene(selectedGene.geneSymbol)}
                className={`w-full py-3 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 ${
                  myPathwayGenes.includes(selectedGene.geneSymbol)
                    ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                    : 'bg-navy-950 text-white hover:bg-navy-850'
                }`}
              >
                {myPathwayGenes.includes(selectedGene.geneSymbol) ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>In My Pathway List</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4 text-cyan-400" />
                    <span>Add to My Pathway List</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <p className="text-xs text-slate-400">Select a gene from the left to view details.</p>
          )}
        </div>
      </div>
    </div>
  );
};
