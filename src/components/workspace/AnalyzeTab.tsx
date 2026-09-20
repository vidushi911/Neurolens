import React, { useState } from 'react';
import { 
  Cpu, 
  Play, 
  CheckCircle2, 
  Info, 
  ArrowRight, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  BarChart2,
  TrendingUp,
  GitCompare,
  Layers,
  ShieldAlert
} from 'lucide-react';
import { AnalysisState, XGBoostParams, getNonDiagnosticLabel } from '../../types';
import { trainXGBoostModel } from '../../services/xgboostEngine';
import { calculateSHAPValues } from '../../services/shapEngine';
import { HelpTooltip } from '../HelpTooltip';
import { WorkspaceTab } from './WorkspaceNav';

interface AnalyzeTabProps {
  state: AnalysisState;
  onUpdateState: (updates: Partial<AnalysisState>) => void;
  setActiveTab: (tab: WorkspaceTab) => void;
  onOpenSampleInspector: (sampleId: string) => void;
  onOpenSampleComparison?: () => void;
}

export const AnalyzeTab: React.FC<AnalyzeTabProps> = ({
  state,
  onUpdateState,
  setActiveTab,
  onOpenSampleInspector,
  onOpenSampleComparison
}) => {
  const [params, setParams] = useState<XGBoostParams>({
    numTrees: 25,
    maxDepth: 4,
    learningRate: 0.1,
    trainRatio: 0.8
  });

  const [isLoading, setIsLoading] = useState(false);
  const [progressStep, setProgressStep] = useState<number>(0);
  const [showTechnical, setShowTechnical] = useState(true);
  const [selectedSampleId, setSelectedSampleId] = useState<string>(state.samples[0]?.sampleId || '');
  const [selectedThreshold, setSelectedThreshold] = useState<number>(0.5);

  const progressMessages = [
    '01. Preprocessing expression matrix & Z-score normalization...',
    '02. Training Gradient Boosted Decision Ensemble (XGBoost)...',
    '03. Computing TreeSHAP exact local & global attributions...',
    '04. Evaluating ROC-AUC & Confusion Matrix metrics...',
    '05. Benchmarking against Random Forest & Logistic Regression...',
    'Done. Pipeline execution complete.'
  ];

  const handleRunAnalysis = () => {
    setIsLoading(true);
    setProgressStep(0);

    const interval = setInterval(() => {
      setProgressStep((prev) => {
        if (prev >= progressMessages.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 450);

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
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }, 2800);
  };

  const metrics = state.metrics;
  const currentPrediction = state.metrics?.predictions.find(p => p.sampleId === selectedSampleId) || state.metrics?.predictions[0];

  const cm = metrics?.confusionMatrix || { truePositive: 46, falsePositive: 3, falseNegative: 4, trueNegative: 47 };
  const totalSamples = cm.truePositive + cm.falsePositive + cm.falseNegative + cm.trueNegative;
  const sensitivity = cm.truePositive / (cm.truePositive + cm.falseNegative || 1);
  const specificity = cm.trueNegative / (cm.trueNegative + cm.falsePositive || 1);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold text-slate-900">What does the model see?</h1>
        <p className="text-xs text-slate-500 mt-1">
          Evaluate machine-learning molecular signatures on your active dataset without writing code.
        </p>
      </div>

      {/* Input -> Processing -> Output Diagram Box */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">
          Analytical Architecture: Input → Processing → Output
        </span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[10px] text-slate-400 block font-bold">1. INPUT DATA MATRIX</span>
            <div className="font-bold text-slate-900">{state.datasetMeta.accessionId} ({state.samples.length} Samples)</div>
            <p className="text-[11px] text-slate-500 font-sans">Normalized Log2 Gene Expression Levels</p>
          </div>

          <div className="p-3 bg-slate-900 text-white rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] text-cyan-400 block font-bold">2. PROCESSING &amp; AI</span>
            <div className="font-bold text-cyan-300">XGBoost + TreeSHAP</div>
            <p className="text-[11px] text-slate-400 font-sans">Gradient boosting ensemble &amp; feature attribution</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[10px] text-slate-400 block font-bold">3. OUTPUT SIGNATURE</span>
            <div className="font-bold text-slate-900">AD-associated Molecular Signature</div>
            <p className="text-[11px] text-slate-500 font-sans">Non-diagnostic research profile &amp; pathways</p>
          </div>
        </div>
      </div>

      {/* Dataset Selection Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200 uppercase">
            Active Dataset Selected
          </span>
          <h2 className="text-base font-bold text-slate-900 mt-1">{state.datasetMeta.name}</h2>
          <p className="text-xs text-slate-500 font-mono">
            {state.samples.length} bio-samples | {state.genes.length} gene features
          </p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          {onOpenSampleComparison && (
            <button
              onClick={onOpenSampleComparison}
              className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <GitCompare className="w-4 h-4 text-slate-600" />
              <span>Compare Samples</span>
            </button>
          )}

          <button
            onClick={handleRunAnalysis}
            disabled={isLoading}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2.5 px-7 py-3 bg-navy-950 hover:bg-navy-850 text-white rounded-xl font-bold text-xs shadow-md transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
                <span>Running pipeline...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-cyan-400 text-cyan-400" />
                <span>Run analysis</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Step-by-Step Progress Sequence */}
      {isLoading && (
        <div className="bg-navy-950 p-6 rounded-2xl text-white space-y-4 shadow-xl border border-navy-850 animate-fade-in">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>Executing Multi-Stage Computational Pipeline</span>
          </div>

          <div className="space-y-2">
            {progressMessages.map((msg, idx) => (
              <div
                key={msg}
                className={`flex items-center gap-3 text-xs font-mono transition-opacity duration-300 ${
                  idx <= progressStep ? 'opacity-100 text-white font-semibold' : 'opacity-30 text-slate-400'
                }`}
              >
                {idx < progressStep ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : idx === progressStep ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
                ) : (
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-700 shrink-0" />
                )}
                <span>{msg}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analysis Result Card */}
      {metrics && !isLoading && (
        <div className="space-y-6">
          {/* Primary Result Overview */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Analysis Output</span>
              <h3 className="text-xl font-bold text-slate-900">Sample Molecular Profile Overview</h3>
            </div>

            {currentPrediction && (
              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Inspected Sample ID</span>
                    <select
                      value={selectedSampleId}
                      onChange={(e) => setSelectedSampleId(e.target.value)}
                      className="text-xs font-bold font-mono text-slate-900 border border-slate-300 rounded p-1 bg-white"
                    >
                      {state.samples.map(s => (
                        <option key={s.sampleId} value={s.sampleId}>
                          {s.sampleId} ({getNonDiagnosticLabel(s.diagnosis)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Sample Phenotype Group</span>
                    <span className="text-xs font-bold text-slate-800">{getNonDiagnosticLabel(currentPrediction.actualLabel)}</span>
                  </div>
                </div>

                {/* Primary Result Statement */}
                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                  <div className="text-sm font-bold text-slate-900">
                    {currentPrediction.predictedLabel === "Alzheimer's Disease" ? (
                      <>
                        This sample displays an{' '}
                        <span className="text-cyan-700 underline font-extrabold">AD-associated molecular expression profile</span>.
                      </>
                    ) : (
                      <>
                        This sample displays a{' '}
                        <span className="text-emerald-700 underline font-extrabold">Control-associated molecular expression profile</span>, consistent with healthy gene-expression patterns.
                      </>
                    )}
                  </div>
                  <div className="text-xs text-slate-600 font-mono">
                    Model-estimated probability score: <strong>{(currentPrediction.adProbability * 100).toFixed(1)}% AD Profile</strong>
                  </div>

                  {/* Probability Gauge Bar */}
                  <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden flex mt-2">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-300"
                      style={{ width: `${(1 - currentPrediction.adProbability) * 100}%` }}
                      title="Control Profile Score"
                    />
                    <div
                      className="bg-rose-500 h-full transition-all duration-300"
                      style={{ width: `${currentPrediction.adProbability * 100}%` }}
                      title="AD Profile Score"
                    />
                  </div>
                </div>

                {/* Next Action CTA */}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setActiveTab('explain')}
                    className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2"
                  >
                    <span>Why did the model think this? Explore genes →</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Model Metrics & Interactive Evaluation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 2x2 Confusion Matrix */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-indigo-600" />
                  <span>Confusion Matrix (2x2 Grid)</span>
                </h4>
                <span className="text-[10px] font-mono text-slate-500">{totalSamples} Total Samples</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center font-mono text-xs">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                  <span className="text-[9px] text-emerald-800 uppercase block font-bold">True AD (TP)</span>
                  <span className="text-2xl font-bold text-emerald-950">{cm.truePositive}</span>
                  <span className="text-[10px] text-emerald-700 block">Correct AD Profile</span>
                </div>

                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
                  <span className="text-[9px] text-rose-800 uppercase block font-bold">False AD (FP)</span>
                  <span className="text-2xl font-bold text-rose-950">{cm.falsePositive}</span>
                  <span className="text-[10px] text-rose-700 block">Type I Error</span>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                  <span className="text-[9px] text-amber-800 uppercase block font-bold">False Control (FN)</span>
                  <span className="text-2xl font-bold text-amber-950">{cm.falseNegative}</span>
                  <span className="text-[10px] text-amber-700 block">Type II Error</span>
                </div>

                <div className="p-4 bg-cyan-50 border border-cyan-200 rounded-xl space-y-1">
                  <span className="text-[9px] text-cyan-800 uppercase block font-bold">True Control (TN)</span>
                  <span className="text-2xl font-bold text-cyan-950">{cm.trueNegative}</span>
                  <span className="text-[10px] text-cyan-700 block">Correct Control Profile</span>
                </div>
              </div>

              <div className="flex justify-between text-xs font-mono text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>Sensitivity (TPR): <strong>{(sensitivity * 100).toFixed(1)}%</strong></div>
                <div>Specificity (TNR): <strong>{(specificity * 100).toFixed(1)}%</strong></div>
              </div>
            </div>

            {/* Interactive SVG ROC Curve */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-600" />
                  <span>ROC Curve &amp; AUC Performance</span>
                </h4>
                <span className="text-xs font-bold font-mono text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                  AUC = {metrics.rocAuc.toFixed(3)}
                </span>
              </div>

              {/* ROC Plot SVG */}
              <div className="relative flex justify-center py-2">
                <svg className="w-full max-w-[260px] h-[220px] bg-slate-900 rounded-xl p-3 overflow-visible" viewBox="0 0 200 200">
                  {/* Grid Lines */}
                  <line x1="20" y1="20" x2="20" y2="180" stroke="#334155" strokeWidth="1" />
                  <line x1="20" y1="180" x2="180" y2="180" stroke="#334155" strokeWidth="1" />

                  {/* Random Chance Diagonal */}
                  <line x1="20" y1="180" x2="180" y2="20" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4 4" />

                  {/* ROC Curve Path */}
                  <path
                    d={`M 20 180 ${metrics.rocCurveData.map(d => `L ${20 + d.fpr * 160} ${180 - d.tpr * 160}`).join(' ')}`}
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="3"
                  />

                  {/* Points */}
                  {metrics.rocCurveData.map(d => (
                    <circle
                      key={d.threshold}
                      cx={20 + d.fpr * 160}
                      cy={180 - d.tpr * 160}
                      r="4"
                      fill="#06b6d4"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                  ))}
                </svg>
              </div>

              <div className="text-[11px] text-slate-500 font-mono text-center">
                Dashed line = Random chance (AUC = 0.50). Cyan line = XGBoost classifier trajectory.
              </div>
            </div>
          </div>

          {/* Model Comparison Benchmark Table */}
          {metrics.benchmarks && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-sm font-bold text-slate-900">
                  Model Comparison Benchmark (XGBoost vs Traditional ML)
                </h4>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                  Illustrative benchmark — for demonstration purposes
                </span>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-x-auto text-xs font-mono">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 text-slate-600 text-[10px] uppercase border-b border-slate-200">
                    <tr>
                      <th className="p-3">Algorithm</th>
                      <th className="p-3 text-center">Accuracy</th>
                      <th className="p-3 text-center">Precision</th>
                      <th className="p-3 text-center">Recall</th>
                      <th className="p-3 text-center">F1-Score</th>
                      <th className="p-3 text-center">ROC-AUC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {metrics.benchmarks.map(b => (
                      <tr key={b.modelName} className={b.isPrimary ? 'bg-cyan-50/50 font-bold' : 'hover:bg-slate-50'}>
                        <td className="p-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-900">{b.modelName}</span>
                            {b.isPrimary && (
                              <span className="px-1.5 py-0.2 rounded bg-cyan-600 text-white text-[9px]">Active</span>
                            )}
                          </div>
                        </td>
                        <td className="p-3 text-center text-slate-900">{(b.accuracy * 100).toFixed(1)}%</td>
                        <td className="p-3 text-center text-slate-900">{(b.precision * 100).toFixed(1)}%</td>
                        <td className="p-3 text-center text-slate-900">{(b.recall * 100).toFixed(1)}%</td>
                        <td className="p-3 text-center text-slate-900">{b.f1Score.toFixed(3)}</td>
                        <td className="p-3 text-center text-cyan-700 font-bold">{b.rocAuc.toFixed(3)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Hyperparameter Settings */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              Hyperparameter Tuning
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div>
                <label className="block text-slate-500 mb-1">
                  Ensemble Trees: <strong>{params.numTrees}</strong>
                </label>
                <input
                  type="range"
                  min={10}
                  max={50}
                  value={params.numTrees}
                  onChange={(e) => setParams({ ...params, numTrees: Number(e.target.value) })}
                  className="w-full accent-cyan-600"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">
                  Max Depth: <strong>{params.maxDepth}</strong>
                </label>
                <input
                  type="range"
                  min={2}
                  max={8}
                  value={params.maxDepth}
                  onChange={(e) => setParams({ ...params, maxDepth: Number(e.target.value) })}
                  className="w-full accent-cyan-600"
                />
              </div>

              <div>
                <label className="block text-slate-500 mb-1">
                  Train / Test Split Ratio: <strong>{(params.trainRatio * 100).toFixed(0)}%</strong>
                </label>
                <select
                  value={params.trainRatio}
                  onChange={(e) => setParams({ ...params, trainRatio: Number(e.target.value) })}
                  className="w-full text-xs p-1.5 border border-slate-300 rounded bg-white"
                >
                  <option value={0.7}>70% Train / 30% Test</option>
                  <option value={0.8}>80% Train / 20% Test</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
