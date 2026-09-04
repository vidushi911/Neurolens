import React from 'react';
import { X, User, TrendingUp, TrendingDown, CheckCircle2 } from 'lucide-react';
import { AnalysisState } from '../../types';

interface SampleInspectorModalProps {
  sampleId: string | null;
  onClose: () => void;
  state: AnalysisState;
  onOpenGeneModal: (symbol: string) => void;
}

export const SampleInspectorModal: React.FC<SampleInspectorModalProps> = ({
  sampleId,
  onClose,
  state,
  onOpenGeneModal
}) => {
  if (!sampleId) return null;

  const sampleExplanation = state.sampleExplanations[sampleId];
  if (!sampleExplanation) return null;

  const positivePush = sampleExplanation.contributions.filter(c => c.shapValue > 0);
  const negativePush = sampleExplanation.contributions.filter(c => c.shapValue < 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden space-y-6">
        {/* Modal Header */}
        <div className="p-6 bg-navy-900 text-white flex justify-between items-start">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-mono border border-indigo-500/30">
              <User className="w-3 h-3" />
              <span>Sample Prediction SHAP Inspector</span>
            </div>
            <h2 className="text-xl font-bold font-mono text-white leading-none">{sampleId}</h2>
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
          {/* Diagnostic Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-3 gap-4 text-center font-mono">
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Actual Label</span>
              <span className="font-bold text-slate-900 text-xs">{sampleExplanation.actualLabel}</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Predicted Label</span>
              <span className="font-bold text-indigo-700 text-xs flex items-center justify-center gap-1">
                {sampleExplanation.predictedLabel}
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase block">AD Probability</span>
              <span className="font-bold text-slate-900 text-xs">
                {(sampleExplanation.adProbability * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Probability Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-emerald-700">Healthy Control Prior (0.50)</span>
              <span className="font-bold text-slate-900">Total SHAP Shift: {sampleExplanation.totalShapSum}</span>
              <span className="text-rose-700">Alzheimer&apos;s Disease</span>
            </div>
            <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden flex">
              <div
                className="bg-emerald-500 h-full transition-all"
                style={{ width: `${(1 - sampleExplanation.adProbability) * 100}%` }}
              />
              <div
                className="bg-rose-500 h-full transition-all"
                style={{ width: `${sampleExplanation.adProbability * 100}%` }}
              />
            </div>
          </div>

          {/* Dual Column Feature Push Waterfall Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Positive Push */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-rose-900 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-rose-600" />
                <span>Pushing Toward AD (+ SHAP)</span>
              </span>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {positivePush.map(c => (
                  <div
                    key={c.geneSymbol}
                    onClick={() => onOpenGeneModal(c.geneSymbol)}
                    className="p-2 rounded bg-rose-50 border border-rose-100 hover:border-rose-300 flex items-center justify-between font-mono cursor-pointer transition-colors"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block">{c.geneSymbol}</span>
                      <span className="text-[9px] text-slate-500">Exp: {c.expressionValue}</span>
                    </div>
                    <span className="font-bold text-rose-700">+{c.shapValue}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Negative Push */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-emerald-900 flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pushing Toward Healthy (- SHAP)</span>
              </span>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {negativePush.map(c => (
                  <div
                    key={c.geneSymbol}
                    onClick={() => onOpenGeneModal(c.geneSymbol)}
                    className="p-2 rounded bg-emerald-50 border border-emerald-100 hover:border-emerald-300 flex items-center justify-between font-mono cursor-pointer transition-colors"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block">{c.geneSymbol}</span>
                      <span className="text-[9px] text-slate-500">Exp: {c.expressionValue}</span>
                    </div>
                    <span className="font-bold text-emerald-700">{c.shapValue}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
