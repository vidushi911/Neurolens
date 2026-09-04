import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  ArrowUpDown, 
  User, 
  ExternalLink,
  Info,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { AnalysisState, GeneSHAP } from '../../types';

interface ExplainabilityTabProps {
  state: AnalysisState;
  onOpenGeneModal: (symbol: string) => void;
  onOpenSampleInspector: (sampleId: string) => void;
}

export const ExplainabilityTab: React.FC<ExplainabilityTabProps> = ({
  state,
  onOpenGeneModal,
  onOpenSampleInspector
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [directionFilter, setDirectionFilter] = useState<'All' | 'Up in AD' | 'Down in AD'>('All');
  const [selectedSampleId, setSelectedSampleId] = useState<string>(state.samples[0]?.sampleId || '');

  const globalShap = state.globalShap;

  const filteredGenes = globalShap.filter(gene => {
    const matchesSearch = gene.geneSymbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (gene.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDir = directionFilter === 'All' || gene.direction === directionFilter;
    return matchesSearch && matchesDir;
  });

  const maxShapVal = globalShap.length > 0 ? Math.max(...globalShap.map(g => g.meanAbsShap)) : 1.0;
  const currentSampleShap = state.sampleExplanations[selectedSampleId];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold text-slate-900">SHAP Explainability &amp; Feature Importance</h1>
        <p className="text-xs text-slate-500 mt-1">
          Unpack the XGBoost classifier to understand which genes drive Alzheimer&apos;s predictions globally and locally per patient.
        </p>
      </div>

      {/* Educational Callout: What is SHAP? */}
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3 text-xs text-amber-900">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="font-semibold text-amber-950">What is SHAP (SHapley Additive exPlanations)?</strong>
          <p className="text-slate-700 leading-relaxed">
            SHAP calculates the exact marginal contribution of each gene feature to the model&apos;s prediction score. Positive SHAP values push the sample toward an <strong>Alzheimer&apos;s Disease</strong> classification, whereas negative SHAP values push it toward a <strong>Healthy Control</strong> classification.
          </p>
        </div>
      </div>

      {/* Global Feature Importance Chart Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-500" />
              <span>Global SHAP Feature Importance Ranking</span>
            </h3>
            <p className="text-xs text-slate-500">Average absolute SHAP value across all {state.samples.length} bio-samples.</p>
          </div>

          {/* Search & Direction Filters */}
          <div className="flex flex-wrap items-center gap-3">
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
              className="text-xs p-1.5 border border-slate-200 rounded-lg bg-white"
            >
              <option value="All">All Directions</option>
              <option value="Up in AD">Elevated in AD</option>
              <option value="Down in AD">Decreased in AD</option>
            </select>
          </div>
        </div>

        {/* Global Horizontal SHAP Bar Chart Table */}
        <div className="space-y-3 pt-2">
          {filteredGenes.slice(0, 20).map((gene) => {
            const barPercentage = Math.max(5, (gene.meanAbsShap / maxShapVal) * 100);
            return (
              <div
                key={gene.geneSymbol}
                onClick={() => onOpenGeneModal(gene.geneSymbol)}
                className="group p-3 rounded-lg border border-slate-100 hover:border-slate-300 hover:bg-slate-50/80 transition-all cursor-pointer space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-mono font-bold flex items-center justify-center">
                      #{gene.rank}
                    </span>
                    <span className="font-bold font-mono text-slate-900 group-hover:text-cyan-700">
                      {gene.geneSymbol}
                    </span>
                    <span
                      className={`text-[9px] font-semibold px-1.5 py-0.2 rounded ${
                        gene.direction === 'Up in AD'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {gene.direction}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="text-slate-500 text-[11px]">
                      AD Avg: {gene.adExpressionAvg} vs Ctrl: {gene.controlExpressionAvg}
                    </span>
                    <span className="font-bold text-slate-900">
                      |SHAP|: {gene.meanAbsShap}
                    </span>
                  </div>
                </div>

                {/* Bar Visualizer */}
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      gene.direction === 'Up in AD' ? 'bg-rose-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${barPercentage}%` }}
                  />
                </div>

                {gene.description && (
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    {gene.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Local Sample SHAP Waterfall Section */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-600" />
              <span>Local Sample SHAP Contribution Waterfall</span>
            </h3>
            <p className="text-xs text-slate-500">Why did the XGBoost model classify a specific patient sample?</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-mono">Select Sample:</span>
            <select
              value={selectedSampleId}
              onChange={(e) => setSelectedSampleId(e.target.value)}
              className="text-xs p-1.5 border border-slate-300 rounded-lg font-mono bg-white"
            >
              {state.samples.map(s => (
                <option key={s.sampleId} value={s.sampleId}>
                  {s.sampleId} ({s.diagnosis})
                </option>
              ))}
            </select>
          </div>
        </div>

        {currentSampleShap && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400">Sample Identifier</span>
                <div className="font-bold font-mono text-slate-900 text-sm">{currentSampleShap.sampleId}</div>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400">Clinical Diagnosis</span>
                <div className="font-semibold text-slate-800">{currentSampleShap.actualLabel}</div>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400">XGBoost Estimated AD Prob</span>
                <div className="font-mono font-bold text-indigo-700 text-sm">
                  {(currentSampleShap.adProbability * 100).toFixed(1)}%
                </div>
              </div>

              <button
                onClick={() => onOpenSampleInspector(currentSampleShap.sampleId)}
                className="px-3 py-1.5 bg-navy-900 text-white rounded text-xs font-medium hover:bg-navy-800"
              >
                Open Full Waterfall Inspector
              </button>
            </div>

            {/* Top Push AD vs Top Push Healthy Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pushing towards AD */}
              <div className="p-4 rounded-lg bg-rose-50/70 border border-rose-200 space-y-3">
                <h4 className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-rose-600" />
                  <span>Genes Pushing Prediction Toward AD (+)</span>
                </h4>

                <div className="space-y-2">
                  {currentSampleShap.contributions
                    .filter(c => c.shapValue > 0)
                    .slice(0, 5)
                    .map(c => (
                      <div key={c.geneSymbol} className="flex justify-between text-xs bg-white p-2 rounded border border-rose-100">
                        <span className="font-bold font-mono text-slate-900">{c.geneSymbol}</span>
                        <span className="font-mono font-semibold text-rose-700">+{c.shapValue}</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Pushing towards Healthy */}
              <div className="p-4 rounded-lg bg-emerald-50/70 border border-emerald-200 space-y-3">
                <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Genes Pushing Prediction Toward Healthy (-)</span>
                </h4>

                <div className="space-y-2">
                  {currentSampleShap.contributions
                    .filter(c => c.shapValue < 0)
                    .slice(0, 5)
                    .map(c => (
                      <div key={c.geneSymbol} className="flex justify-between text-xs bg-white p-2 rounded border border-emerald-100">
                        <span className="font-bold font-mono text-slate-900">{c.geneSymbol}</span>
                        <span className="font-mono font-semibold text-emerald-700">{c.shapValue}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
