import React from 'react';
import { 
  FileText, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  HelpCircle, 
  Network,
  Database,
  ArrowRight
} from 'lucide-react';
import { AnalysisState } from '../../types';
import { WorkspaceTab } from './WorkspaceNav';

interface ResultsTabProps {
  state: AnalysisState;
  onResetAnalysis: () => void;
  setActiveTab: (tab: WorkspaceTab) => void;
}

export const ResultsTab: React.FC<ResultsTabProps> = ({
  state,
  onResetAnalysis,
  setActiveTab
}) => {
  const meta = state.datasetMeta;
  const metrics = state.metrics;
  const topGenes = state.globalShap.slice(0, 5);
  const topPathways = state.pathways.slice(0, 3);

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Your Analysis Summary</h1>
          <p className="text-xs text-slate-500 mt-1">
            Consolidated overview of dataset provenance, model predictions, top genes, and pathways.
          </p>
        </div>

        <button
          onClick={onResetAnalysis}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Analysis</span>
        </button>
      </div>

      {/* Main Results Summary Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <span className="text-[10px] font-mono font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200 uppercase">
              Analysis Completed
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-1">{meta.name}</h2>
          </div>

          <div className="text-right text-xs font-mono text-emerald-600 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Complete</span>
          </div>
        </div>

        {/* 4 Summary Sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Section 1: Dataset */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-cyan-600" />
              <span>Active Dataset</span>
            </h3>
            <div className="font-mono text-slate-600 space-y-1">
              <div>Accession: {meta.accessionId}</div>
              <div>Samples: {meta.sampleCount} ({meta.adCount} AD / {meta.controlCount} Ctrl)</div>
              <div>Organism: {meta.organism}</div>
            </div>
          </div>

          {/* Section 2: Model Prediction */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              <span>Model Classification</span>
            </h3>
            <div className="font-mono text-slate-600 space-y-1">
              <div>Model: XGBoost Decision Ensemble</div>
              <div>Accuracy: {metrics ? `${(metrics.accuracy * 100).toFixed(1)}%` : 'Ready'}</div>
              <div>ROC-AUC: {metrics ? metrics.rocAuc.toFixed(3) : 'Ready'}</div>
            </div>
          </div>

          {/* Section 3: Top Genes */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-amber-500" />
              <span>Top Biomarker Genes</span>
            </h3>
            <div className="flex flex-wrap gap-1">
              {topGenes.map(g => (
                <span key={g.geneSymbol} className="px-2 py-0.5 bg-white border border-slate-200 rounded font-mono font-bold text-slate-800 text-[11px]">
                  {g.geneSymbol}
                </span>
              ))}
            </div>
          </div>

          {/* Section 4: Top Pathways */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
              <Network className="w-4 h-4 text-emerald-600" />
              <span>Top Pathways</span>
            </h3>
            <div className="space-y-1 text-[11px] text-slate-700">
              {topPathways.map(p => (
                <div key={p.pathwayName} className="truncate">• {p.pathwayName}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="pt-2 flex flex-wrap gap-3">
          <button
            onClick={() => setActiveTab('explain')}
            className="px-4 py-2.5 bg-navy-950 hover:bg-navy-850 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <span>View full explanation</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
          </button>

          <button
            onClick={() => setActiveTab('pathways')}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <span>View pathways</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setActiveTab('download')}
            className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download results</span>
          </button>
        </div>
      </div>
    </div>
  );
};
