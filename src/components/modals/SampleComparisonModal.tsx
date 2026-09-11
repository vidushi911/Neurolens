import React, { useState } from 'react';
import { X, ArrowRight, GitCompare, CheckCircle2, TrendingUp, TrendingDown } from 'lucide-react';
import { AnalysisState, GeneExpressionSample } from '../../types';

interface SampleComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: AnalysisState;
  onOpenGeneModal?: (symbol: string) => void;
}

export const SampleComparisonModal: React.FC<SampleComparisonModalProps> = ({
  isOpen,
  onClose,
  state,
  onOpenGeneModal
}) => {
  if (!isOpen) return null;

  const samples = state.samples;
  const adSamples = samples.filter(s => s.diagnosis === 'Alzheimer\'s Disease');
  const ctrlSamples = samples.filter(s => s.diagnosis === 'Healthy Control');

  const [sampleIdA, setSampleIdA] = useState<string>(adSamples[0]?.sampleId || samples[0]?.sampleId || '');
  const [sampleIdB, setSampleIdB] = useState<string>(ctrlSamples[0]?.sampleId || samples[1]?.sampleId || '');

  const sampleA = samples.find(s => s.sampleId === sampleIdA);
  const sampleB = samples.find(s => s.sampleId === sampleIdB);

  const expA = state.sampleExplanations[sampleIdA];
  const expB = state.sampleExplanations[sampleIdB];

  const topGenes = state.globalShap.slice(0, 10).map(g => g.geneSymbol);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-indigo-700 font-mono text-xs font-bold uppercase">
            <GitCompare className="w-5 h-5 text-indigo-600" />
            <span>Sample-to-Sample Expression &amp; SHAP Comparison</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sample Pickers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sample A */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <label className="block text-[10px] font-mono uppercase text-slate-500 font-bold">
              Select Sample A (Primary)
            </label>
            <select
              value={sampleIdA}
              onChange={(e) => setSampleIdA(e.target.value)}
              className="w-full text-xs font-bold font-mono p-2 border border-slate-300 rounded-lg bg-white"
            >
              {samples.map(s => (
                <option key={s.sampleId} value={s.sampleId}>
                  {s.sampleId} ({s.diagnosis === 'Alzheimer\'s Disease' ? 'AD Profile' : 'Control Profile'})
                </option>
              ))}
            </select>

            {sampleA && (
              <div className="text-xs font-mono pt-1 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Group Label:</span>
                  <span className={sampleA.diagnosis === 'Alzheimer\'s Disease' ? 'font-bold text-rose-600' : 'font-bold text-emerald-600'}>
                    {sampleA.diagnosis === 'Alzheimer\'s Disease' ? 'AD-associated' : 'Control'}
                  </span>
                </div>
                {expA && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Model Probability:</span>
                    <strong className="text-slate-900">{(expA.adProbability * 100).toFixed(1)}% AD</strong>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sample B */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <label className="block text-[10px] font-mono uppercase text-slate-500 font-bold">
              Select Sample B (Comparator)
            </label>
            <select
              value={sampleIdB}
              onChange={(e) => setSampleIdB(e.target.value)}
              className="w-full text-xs font-bold font-mono p-2 border border-slate-300 rounded-lg bg-white"
            >
              {samples.map(s => (
                <option key={s.sampleId} value={s.sampleId}>
                  {s.sampleId} ({s.diagnosis === 'Alzheimer\'s Disease' ? 'AD Profile' : 'Control Profile'})
                </option>
              ))}
            </select>

            {sampleB && (
              <div className="text-xs font-mono pt-1 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Group Label:</span>
                  <span className={sampleB.diagnosis === 'Alzheimer\'s Disease' ? 'font-bold text-rose-600' : 'font-bold text-emerald-600'}>
                    {sampleB.diagnosis === 'Alzheimer\'s Disease' ? 'AD-associated' : 'Control'}
                  </span>
                </div>
                {expB && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Model Probability:</span>
                    <strong className="text-slate-900">{(expB.adProbability * 100).toFixed(1)}% AD</strong>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Side-by-Side Expression & Local SHAP Comparison Table */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold font-mono uppercase text-slate-700">
            Top Biomarker Differential Expression &amp; SHAP Impact
          </h4>

          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-100 text-slate-600 font-mono text-[10px] uppercase">
                <tr>
                  <th className="p-3">Gene</th>
                  <th className="p-3 text-center">{sampleIdA} Log2 Exp</th>
                  <th className="p-3 text-center">{sampleIdB} Log2 Exp</th>
                  <th className="p-3 text-center">Δ Expression</th>
                  <th className="p-3 text-center">{sampleIdA} SHAP Force</th>
                  <th className="p-3 text-center">{sampleIdB} SHAP Force</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {topGenes.map((gene) => {
                  const valA = sampleA?.expressions[gene] ?? 0;
                  const valB = sampleB?.expressions[gene] ?? 0;
                  const diff = valA - valB;

                  const shapA = expA?.contributions.find(c => c.geneSymbol === gene)?.shapValue ?? 0;
                  const shapB = expB?.contributions.find(c => c.geneSymbol === gene)?.shapValue ?? 0;

                  return (
                    <tr key={gene} className="hover:bg-slate-50">
                      <td
                        onClick={() => onOpenGeneModal && onOpenGeneModal(gene)}
                        className="p-3 font-bold text-cyan-700 hover:underline cursor-pointer"
                      >
                        {gene}
                      </td>
                      <td className="p-3 text-center font-bold text-slate-900">{valA.toFixed(2)}</td>
                      <td className="p-3 text-center font-bold text-slate-900">{valB.toFixed(2)}</td>
                      <td className={`p-3 text-center font-bold ${diff > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {diff > 0 ? `+${diff.toFixed(2)}` : diff.toFixed(2)}
                      </td>
                      <td className={`p-3 text-center font-bold ${shapA > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {shapA > 0 ? `+${shapA.toFixed(3)}` : shapA.toFixed(3)}
                      </td>
                      <td className={`p-3 text-center font-bold ${shapB > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {shapB > 0 ? `+${shapB.toFixed(3)}` : shapB.toFixed(3)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800"
        >
          Close Comparison
        </button>
      </div>
    </div>
  );
};
