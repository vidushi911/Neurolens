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
  TrendingUp
} from 'lucide-react';
import { AnalysisState, XGBoostParams } from '../../types';
import { trainXGBoostModel } from '../../services/xgboostEngine';
import { calculateSHAPValues } from '../../services/shapEngine';
import { HelpTooltip } from '../HelpTooltip';
import { WorkspaceTab } from './WorkspaceNav';

interface AnalyzeTabProps {
  state: AnalysisState;
  onUpdateState: (updates: Partial<AnalysisState>) => void;
  setActiveTab: (tab: WorkspaceTab) => void;
  onOpenSampleInspector: (sampleId: string) => void;
}

export const AnalyzeTab: React.FC<AnalyzeTabProps> = ({
  state,
  onUpdateState,
  setActiveTab,
  onOpenSampleInspector
}) => {
  const [params, setParams] = useState<XGBoostParams>({
    numTrees: 25,
    maxDepth: 4,
    learningRate: 0.1,
    trainRatio: 0.8
  });

  const [isLoading, setIsLoading] = useState(false);
  const [progressStep, setProgressStep] = useState<number>(0);
  const [showTechnical, setShowTechnical] = useState(false);
  const [selectedSampleId, setSelectedSampleId] = useState<string>(state.samples[0]?.sampleId || '');

  const progressMessages = [
    'Preparing your data...',
    'Learning expression patterns...',
    'Checking the model\'s predictions...',
    'Finding the genes that mattered...',
    'Connecting genes to biology...',
    'Done.'
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

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold text-slate-900">What does the model see?</h1>
        <p className="text-xs text-slate-500 mt-1">
          Evaluate machine-learning predictions on your active dataset without touching code.
        </p>
      </div>

      {/* Dataset Selection Status */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200 uppercase">
            Dataset Selected
          </span>
          <h2 className="text-base font-bold text-slate-900 mt-1">{state.datasetMeta.name}</h2>
          <p className="text-xs text-slate-500 font-mono">
            {state.samples.length} bio-samples | {state.genes.length} gene features
          </p>
        </div>

        <button
          onClick={handleRunAnalysis}
          disabled={isLoading}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3 bg-navy-950 hover:bg-navy-850 text-white rounded-xl font-bold text-xs shadow-md transition-all disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
              <span>Analyzing dataset...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-cyan-400 text-cyan-400" />
              <span>Run analysis</span>
            </>
          )}
        </button>
      </div>

      {/* Step-by-Step Progress Sequence Box */}
      {isLoading && (
        <div className="bg-navy-950 p-6 rounded-2xl text-white space-y-4 shadow-xl border border-navy-850 animate-fade-in">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>Executing Computational Pipeline</span>
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
          {/* Primary Simple Human Result Card */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Analysis Output</span>
              <h3 className="text-xl font-bold text-slate-900">Sample Classification Overview</h3>
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
                          {s.sampleId} ({s.diagnosis})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Actual Diagnosis Label</span>
                    <span className="text-xs font-bold text-slate-800">{currentPrediction.actualLabel}</span>
                  </div>
                </div>

                {/* Primary Human Result Statement */}
                <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                  <div className="text-sm font-bold text-slate-900">
                    This sample is <span className="text-cyan-700 underline">more similar to the Alzheimer&apos;s Disease group</span>.
                  </div>
                  <div className="text-xs text-slate-600 font-mono">
                    Model-estimated probability: <strong>{(currentPrediction.adProbability * 100).toFixed(1)}% AD</strong>
                  </div>

                  {/* Probability Gauge Bar */}
                  <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden flex mt-2">
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

          {/* Expandable Technical Details Section */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <button
              onClick={() => setShowTechnical(!showTechnical)}
              className="w-full p-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors text-xs font-bold text-slate-800"
            >
              <span>Technical details &amp; XGBoost Model Metrics</span>
              {showTechnical ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showTechnical && (
              <div className="p-6 border-t border-slate-100 space-y-6 text-xs">
                {/* 5 Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-center">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[9px] text-slate-400 block">Accuracy</span>
                    <span className="font-bold text-slate-900 text-base">{(metrics.accuracy * 100).toFixed(1)}%</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[9px] text-slate-400 block">Precision</span>
                    <span className="font-bold text-slate-900 text-base">{(metrics.precision * 100).toFixed(1)}%</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[9px] text-slate-400 block">Recall</span>
                    <span className="font-bold text-slate-900 text-base">{(metrics.recall * 100).toFixed(1)}%</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[9px] text-slate-400 block">F1-Score</span>
                    <span className="font-bold text-slate-900 text-base">{metrics.f1Score.toFixed(3)}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 col-span-2 sm:col-span-1">
                    <span className="text-[9px] text-slate-400 block">ROC-AUC</span>
                    <span className="font-bold text-cyan-600 text-base">{metrics.rocAuc.toFixed(3)}</span>
                  </div>
                </div>

                {/* Hyperparameter Adjustments */}
                <div className="p-4 bg-slate-50 rounded-xl space-y-3">
                  <span className="font-bold text-slate-900 block">Hyperparameters:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-500 mb-1 font-mono">
                        Ensemble Trees: {params.numTrees}
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
                      <label className="block text-[10px] text-slate-500 mb-1 font-mono">
                        Max Depth: {params.maxDepth}
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
                      <label className="block text-[10px] text-slate-500 mb-1 font-mono">
                        Train Ratio: {params.trainRatio * 100}%
                      </label>
                      <select
                        value={params.trainRatio}
                        onChange={(e) => setParams({ ...params, trainRatio: Number(e.target.value) })}
                        className="w-full text-xs p-1 border border-slate-300 rounded"
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
        </div>
      )}
    </div>
  );
};
