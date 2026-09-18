import React from 'react';
import { X, ExternalLink, Dna, TrendingUp, TrendingDown, Eye, Sparkles } from 'lucide-react';
import { AnalysisState } from '../../types';
import { ALZHEIMER_GENE_INFO } from '../../data/gse63063Dataset';
import { getProteinTargetForGene } from '../../data/dockingTargetsAndLigands';
import { Protein3DViewer } from '../workspace/Protein3DViewer';

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

  const targetInfo = getProteinTargetForGene(geneSymbol);

  // Calculate sample expression values for this gene across AD vs Control
  const adSamples = state.samples.filter(s => s.diagnosis === 'Alzheimer\'s Disease');
  const ctrlSamples = state.samples.filter(s => s.diagnosis === 'Healthy Control');

  const adExprs = adSamples.map(s => s.expressions[geneSymbol] ?? 0);
  const ctrlExprs = ctrlSamples.map(s => s.expressions[geneSymbol] ?? 0);

  const adAvg = adExprs.length > 0 ? (adExprs.reduce((a, b) => a + b, 0) / adExprs.length).toFixed(2) : '—';
  const ctrlAvg = ctrlExprs.length > 0 ? (ctrlExprs.reduce((a, b) => a + b, 0) / ctrlExprs.length).toFixed(2) : '—';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in font-sans">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6">
        {/* Modal Header */}
        <div className="p-5 bg-[#3B5DBF] text-white flex justify-between items-start sticky top-0 z-20">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-white/20 text-white text-[10px] font-mono border border-white/30">
              <Dna className="w-3 h-3 text-sky-200" />
              <span>3D Protein Structure &amp; Biomarker Inspector</span>
            </div>
            <h2 className="text-2xl font-bold font-mono text-white leading-none flex items-center gap-2">
              <span>{geneSymbol}</span>
              <span className="text-xs font-mono font-normal opacity-80">(PDB: {targetInfo.pdbId})</span>
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 pt-0 text-xs">
          {/* 3D Protein Structure Viewer */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                3D Molecular Structure (3Dmol.js / PDB {targetInfo.pdbId})
              </span>
              <span className="text-[10px] text-sky-800 font-mono font-semibold bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                Res: {targetInfo.resolution}
              </span>
            </div>

            <Protein3DViewer
              target={targetInfo}
              className="h-[300px]"
            />
          </div>

          {/* Molecular Level Details Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span>Molecular Pocket &amp; Active Site Details:</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              {targetInfo.activeSiteDescription}
            </p>
            <div className="flex flex-wrap gap-1 pt-1">
              <span className="text-[10px] font-mono text-slate-500 font-semibold mr-1">Active Site Residues:</span>
              {targetInfo.activeSiteResidueNames.map(res => (
                <span key={res} className="px-2 py-0.5 rounded bg-sky-100 text-sky-900 text-[10px] font-mono font-bold border border-sky-300">
                  {res}
                </span>
              ))}
            </div>
          </div>

          {/* Functional Annotation */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <strong className="text-[10px] font-mono uppercase text-slate-400 block">Biological Role in Alzheimer's Pathophysiology:</strong>
            <p className="text-slate-700 leading-relaxed font-medium text-[11px]">{description}</p>
          </div>

          {/* SHAP Metrics Box */}
          {geneShap && (
            <div className="grid grid-cols-2 gap-4 font-mono">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase text-slate-400 block">SHAP Global Importance</span>
                <span className="text-base font-bold text-slate-900">|SHAP|: {geneShap.meanAbsShap}</span>
                <span className="text-[10px] text-slate-500 block">Rank #{geneShap.rank} of {state.genes.length}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase text-slate-400 block">Model Impact Direction</span>
                <div className="flex items-center gap-1.5 mt-1 text-xs">
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

          {/* Expression Comparison */}
          <div className="space-y-2 font-mono">
            <span className="text-[10px] uppercase text-slate-400 block">Expression Levels (Log2 Normalized)</span>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
                <span className="text-[10px] text-rose-700 uppercase font-semibold block">AD Cohort Mean</span>
                <span className="text-lg font-bold text-rose-950">{adAvg}</span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] text-emerald-700 uppercase font-semibold block">Control Cohort Mean</span>
                <span className="text-lg font-bold text-emerald-950">{ctrlAvg}</span>
              </div>
            </div>
          </div>

          {/* External Links */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-sky-700 font-semibold text-[11px]">
            <a
              href={`https://www.rcsb.org/structure/${targetInfo.pdbId}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:underline"
            >
              <span>RCSB PDB ({targetInfo.pdbId})</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <a
              href={`https://www.ncbi.nlm.nih.gov/gene/?term=${geneSymbol}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:underline"
            >
              <span>NCBI Gene</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <a
              href={`https://www.uniprot.org/uniprotkb/${targetInfo.uniprotId}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:underline"
            >
              <span>UniProt ({targetInfo.uniprotId})</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
