import React, { useState } from 'react';
import { 
  Binary, 
  Play, 
  CheckCircle2, 
  Info, 
  BarChart2, 
  TrendingUp, 
  Sliders,
  Sparkles
} from 'lucide-react';
import { AnalysisState, XGBoostParams } from '../../types';
import { trainXGBoostModel } from '../../services/xgboostEngine';
import { calculateSHAPValues } from '../../services/shapEngine';

interface ClassificationTabProps {
  state: AnalysisState;
  onUpdateState: (updates: Partial<AnalysisState>) => void;
  onOpenSampleInspector: (sampleId: string) => void;
}

export const ClassificationTab: React.FC<ClassificationTabProps> = ({
  state,
  onUpdateState,
  onOpenSampleInspector
}) => {
  const [params, setParams] = useState<XGBoostParams>({
    numTrees: 25,
    maxDepth: 4,
    learningRate: 0.1,
    trainRatio: 0.8
  });

  const [isLoading, setIsLoading] = useState(false);
  const [selectedSampleId, setSelectedSampleId] = useState<string>(state.samples[0]?.sampleId || '');

  const handleRunClassifier = () => {
    setIsLoading(true);

    setTimeout(() => {
      try {
        const metrics = trainXGBoostModel(state.samples, state.genes, params);
        const { globalShap, sampleExplanations } = calculateSHAPValues(state.samples, state.genes);

        onUpdateState({
          classificationStatus: 'complete',
          shapStatus: 'complete',
          metrics,
          globalShap,
          sampleExplanations
        });
      } catch (err: any) {
        console.error('Classification error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 600);
  };

  const metrics = state.metrics;
  const currentPrediction = state.metrics?.predictions.find(p => p.sampleId === selectedSampleId) || state.metrics?.predictions[0];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold text-slate-900">XGBoost AD vs. Healthy Classifier</h1>
        <p className="text-xs text-slate-500 mt-1">
          Train a decision tree gradient boosting ensemble to distinguish Alzheimer&apos;s samples from healthy controls.
        </p>
      </div>

      {/* Positioning Disclaimer */}
      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-start gap-3 text-xs text-slate-700">
        <Info className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold text-slate-900">Scientific Diagnostic Note:</strong> This model measures how reliably gene-expression patterns distinguish Alzheimer&apos;s Disease from Healthy Controls in the selected dataset. It is designed for computational research and feature discovery rather than clinical diagnosis.
        </div>
      </div>

      {/* Execution Controls & Hyperparameter Box */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600" />
              <span>Model Hyperparameters &amp; Training Trigger</span>
            </h3>
            <p className="text-xs text-slate-500">Configure decision tree depth, ensemble iterations, and train/test split ratio.</p>
          </div>

          <button
            onClick={handleRunClassifier}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy-900 hover:bg-navy-800 text-white rounded-lg text-xs font-semibold shadow-md transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
                <span>Training XGBoost...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-cyan-400 text-cyan-400" />
                <span>Execute XGBoost Pipeline</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100 text-xs">
          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1">
              Ensemble Trees: <strong className="text-slate-800">{params.numTrees}</strong>
            </label>
            <input
              type="range"
              min={10}
              max={50}
              value={params.numTrees}
              onChange={(e) => setParams({ ...params, numTrees: Number(e.target.value) })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1">
              Max Depth: <strong className="text-slate-800">{params.maxDepth}</strong>
            </label>
            <input
              type="range"
              min={2}
              max={8}
              value={params.maxDepth}
              onChange={(e) => setParams({ ...params, maxDepth: Number(e.target.value) })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1">
              Learning Rate: <strong className="text-slate-800">{params.learningRate}</strong>
            </label>
            <select
              value={params.learningRate}
              onChange={(e) => setParams({ ...params, learningRate: Number(e.target.value) })}
              className="w-full p-1 border border-slate-200 rounded text-xs"
            >
              <option value={0.05}>0.05</option>
              <option value={0.1}>0.10</option>
              <option value={0.2}>0.20</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1">
              Train / Test Ratio: <strong className="text-slate-800">{params.trainRatio * 100}% Train</strong>
            </label>
            <select
              value={params.trainRatio}
              onChange={(e) => setParams({ ...params, trainRatio: Number(e.target.value) })}
              className="w-full p-1 border border-slate-200 rounded text-xs"
            >
              <option value={0.7}>70% Train / 30% Test</option>
              <option value={0.8}>80% Train / 20% Test</option>
            </select>
          </div>
        </div>
      </div>

      {/* Metrics Performance Cards */}
      {metrics && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Accuracy</span>
              <span className="text-2xl font-bold text-slate-900 font-mono">
                {(metrics.accuracy * 100).toFixed(1)}%
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Precision</span>
              <span className="text-2xl font-bold text-slate-900 font-mono">
                {(metrics.precision * 100).toFixed(1)}%
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">Recall (Sensitivity)</span>
              <span className="text-2xl font-bold text-slate-900 font-mono">
                {(metrics.recall * 100).toFixed(1)}%
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">F1-Score</span>
              <span className="text-2xl font-bold text-slate-900 font-mono">
                {metrics.f1Score.toFixed(3)}
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center col-span-2 sm:col-span-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 block">ROC-AUC</span>
              <span className="text-2xl font-bold text-cyan-600 font-mono">
                {metrics.rocAuc.toFixed(3)}
              </span>
            </div>
          </div>

          {/* Grid: Confusion Matrix & ROC Curve */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Confusion Matrix */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-indigo-600" />
                <span>Confusion Matrix</span>
              </h3>

              <div className="grid grid-cols-2 gap-3 text-center text-xs">
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg space-y-1">
                  <span className="text-[10px] font-mono font-semibold text-emerald-700 uppercase block">True Positive (AD)</span>
                  <span className="text-2xl font-bold text-emerald-950 font-mono">{metrics.confusionMatrix.truePositive}</span>
                  <span className="text-[10px] text-emerald-600 block">Correctly Classified AD</span>
                </div>

                <div className="bg-rose-50 border border-rose-200 p-4 rounded-lg space-y-1">
                  <span className="text-[10px] font-mono font-semibold text-rose-700 uppercase block">False Positive</span>
                  <span className="text-2xl font-bold text-rose-950 font-mono">{metrics.confusionMatrix.falsePositive}</span>
                  <span className="text-[10px] text-rose-600 block">Healthy misclassified as AD</span>
                </div>

                <div className="bg-rose-50 border border-rose-200 p-4 rounded-lg space-y-1">
                  <span className="text-[10px] font-mono font-semibold text-rose-700 uppercase block">False Negative</span>
                  <span className="text-2xl font-bold text-rose-950 font-mono">{metrics.confusionMatrix.falseNegative}</span>
                  <span className="text-[10px] text-rose-600 block">AD misclassified as Healthy</span>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg space-y-1">
                  <span className="text-[10px] font-mono font-semibold text-emerald-700 uppercase block">True Negative (Healthy)</span>
                  <span className="text-2xl font-bold text-emerald-950 font-mono">{metrics.confusionMatrix.trueNegative}</span>
                  <span className="text-[10px] text-emerald-600 block">Correctly Classified Control</span>
                </div>
              </div>
            </div>

            {/* ROC Curve Representation */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-600" />
                  <span>Receiver Operating Characteristic (ROC)</span>
                </h3>
                <span className="text-xs font-mono font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                  AUC = {metrics.rocAuc.toFixed(3)}
                </span>
              </div>

              {/* Simple SVG ROC Curve Plot */}
              <div className="h-48 w-full bg-slate-50 rounded-lg border border-slate-200 p-3 relative flex items-center justify-center">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Diagonal random line */}
                  <line x1="0" y1="100" x2="100" y2="0" stroke="#cbd5e1" strokeDasharray="3 3" strokeWidth="1" />
                  
                  {/* ROC Curve path */}
                  <path
                    d={`M 0 100 L ${metrics.rocCurveData.map(d => `${d.fpr * 100} ${100 - d.tpr * 100}`).join(' L ')}`}
                    fill="none"
                    stroke="#0ea5e9"
                    strokeWidth="2.5"
                  />
                </svg>

                <div className="absolute bottom-1 right-2 text-[9px] font-mono text-slate-400">False Positive Rate →</div>
                <div className="absolute top-1 left-2 text-[9px] font-mono text-slate-400">↑ True Positive Rate</div>
              </div>
            </div>
          </div>

          {/* Sample Prediction Inspector Widget */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Sample Prediction Inspector</h3>
                <p className="text-xs text-slate-500">Select any individual patient sample to view model probability estimation.</p>
              </div>

              <select
                value={selectedSampleId}
                onChange={(e) => setSelectedSampleId(e.target.value)}
                className="text-xs p-2 border border-slate-300 rounded-lg bg-white font-mono"
              >
                {state.samples.map(s => (
                  <option key={s.sampleId} value={s.sampleId}>
                    {s.sampleId} ({s.diagnosis})
                  </option>
                ))}
              </select>
            </div>

            {currentPrediction && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400">Model Predicted Class</span>
                    <div className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <span>{currentPrediction.predictedLabel}</span>
                      {currentPrediction.predictedLabel === currentPrediction.actualLabel && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400">Actual Clinical Diagnosis</span>
                    <div className="text-sm font-semibold text-slate-700">{currentPrediction.actualLabel}</div>
                  </div>

                  <button
                    onClick={() => onOpenSampleInspector(currentPrediction.sampleId)}
                    className="px-3 py-1.5 bg-cyan-600 text-white rounded text-xs font-semibold hover:bg-cyan-500 transition-colors"
                  >
                    Inspect SHAP Breakdown →
                  </button>
                </div>

                {/* Probability Gauge Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-emerald-700">Healthy Control</span>
                    <span className="font-bold text-slate-900">
                      Model-Estimated Probability: {(currentPrediction.adProbability * 100).toFixed(1)}% AD
                    </span>
                    <span className="text-rose-700">Alzheimer&apos;s Disease</span>
                  </div>

                  <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden flex">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-300"
                      style={{ width: `${(1 - currentPrediction.adProbability) * 100}%` }}
                    />
                    <div
                      className="bg-rose-500 h-full transition-all duration-300"
                      style={{ width: `${currentPrediction.adProbability * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
