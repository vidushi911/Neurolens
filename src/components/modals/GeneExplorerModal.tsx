import React from 'react';
import { X, ExternalLink, Dna, TrendingUp, TrendingDown, Info } from 'lucide-react';
import { AnalysisState } from '../../types';
import { ALZHEIMER_GENE_INFO } from '../../data/gse63063Dataset';

interface GeneExplorerModalProps {
  geneSymbol: string | null;
  onClose: () => void;
  state: AnalysisState;
}

export const GeneExplorerModal: React.FC<GeneExplorerModalProps> = ({
  geneSymbol,
  onClose,
  state
}) => {
  if (!geneSymbol) return null;

  const geneShap = state.globalShap.find(g => g.geneSymbol === geneSymbol);
  const description = ALZHEIMER_GENE_INFO[geneSymbol] || geneShap?.description || `Gene expression feature ${geneSymbol}.`;

  // Calculate sample expression values for this gene across AD vs Control
  const adSamples = state.samples.filter(s => s.diagnosis === 'Alzheimer\'s Disease');
  const ctrlSamples = state.samples.filter(s => s.diagnosis === 'Healthy Control');

  const adExprs = adSamples.map(s => s.expressions[geneSymbol] ?? 0);
  const ctrlExprs = ctrlSamples.map(s => s.expressions[geneSymbol] ?? 0);

  const adAvg = adExprs.length > 0 ? (adExprs.reduce((a, b) => a + b, 0) / adExprs.length).toFixed(2) : '—';
  const ctrlAvg = ctrlExprs.length > 0 ? (ctrlExprs.reduce((a, b) => a + b, 0) / ctrlExprs.length).toFixed(2) : '—';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden space-y-6">
        {/* Modal Header */}
        <div className="p-6 bg-navy-900 text-white flex justify-between items-start">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-[10px] font-mono border border-cyan-500/30">
              <Dna className="w-3 h-3" />
              <span>Biomarker Feature Explorer</span>
            </div>
            <h2 className="text-2xl font-bold font-mono text-white leading-none">{geneSymbol}</h2>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 pt-0 text-xs">
          {/* Functional Annotation */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <strong className="text-[10px] font-mono uppercase text-slate-400 block">Biological Annotation:</strong>
            <p className="text-slate-700 leading-relaxed font-medium">{description}</p>
          </div>

          {/* SHAP Metrics Box */}
          {geneShap && (
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 font-mono">
                <span className="text-[10px] uppercase text-slate-400 block">SHAP Global Importance</span>
                <span className="text-lg font-bold text-slate-900">|SHAP|: {geneShap.meanAbsShap}</span>
                <span className="text-[10px] text-slate-500 block">Rank #{geneShap.rank} of {state.genes.length}</span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 font-mono">
                <span className="text-[10px] uppercase text-slate-400 block">Model Impact Direction</span>
                <div className="flex items-center gap-1.5 mt-1">
                  {geneShap.direction === 'Up in AD' ? (
                    <>
                      <TrendingUp className="w-4 h-4 text-rose-500" />
                      <span className="font-bold text-rose-700">Elevated in AD</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-4 h-4 text-emerald-500" />
                      <span className="font-bold text-emerald-700">Decreased in AD</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* AD vs Healthy Expression Comparison */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Expression Levels (Log2 Normalized)</span>

            <div className="grid grid-cols-2 gap-3 font-mono text-center">
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200">
                <span className="text-[10px] text-rose-700 uppercase font-semibold block">AD Cohort Mean</span>
                <span className="text-xl font-bold text-rose-950">{adAvg}</span>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] text-emerald-700 uppercase font-semibold block">Control Cohort Mean</span>
                <span className="text-xl font-bold text-emerald-950">{ctrlAvg}</span>
              </div>
            </div>
          </div>

          {/* External Links */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-cyan-600 font-medium">
            <a
              href={`https://www.ncbi.nlm.nih.gov/gene/?term=${geneSymbol}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:underline"
            >
              <span>NCBI Gene Entry</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <a
              href={`https://www.genecards.org/cgi-bin/carddisp.pl?gene=${geneSymbol}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:underline"
            >
              <span>GeneCards Database</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
