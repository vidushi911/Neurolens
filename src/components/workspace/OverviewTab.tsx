import React, { useState } from 'react';
import { 
  Database, 
  Cpu, 
  HelpCircle, 
  Network, 
  Download, 
  ChevronRight, 
  ArrowRight,
  Info,
  CheckCircle2
} from 'lucide-react';
import { AnalysisState } from '../../types';
import { WorkspaceTab } from './WorkspaceNav';
import { HelpTooltip } from '../HelpTooltip';

interface OverviewTabProps {
  state: AnalysisState;
  setActiveTab: (tab: WorkspaceTab) => void;
  onOpenGeneModal: (symbol: string) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  state,
  setActiveTab,
  onOpenGeneModal
}) => {
  const [selectedStep, setSelectedStep] = useState<number>(1);

  const steps = [
    {
      num: 1,
      tabId: 'dataset' as WorkspaceTab,
      title: '1. Choose your data',
      short: 'Use our built-in Alzheimer\'s dataset or upload your own.',
      desc: 'Start with public NCBI GEO dataset GSE63063 (100 human samples: 50 Alzheimer\'s vs 50 Healthy Control) or drop in your own experimental CSV/TSV expression file.',
      icon: Database,
      cta: 'Go to Dataset →'
    },
    {
      num: 2,
      tabId: 'analyze' as WorkspaceTab,
      title: '2. Analyze',
      short: 'The platform learns patterns to distinguish AD from Healthy samples.',
      desc: 'Our machine-learning model (XGBoost) evaluates gene expression levels to distinguish Alzheimer\'s samples from healthy controls with high precision.',
      icon: Cpu,
      cta: 'Run Analysis →'
    },
    {
      num: 3,
      tabId: 'explain' as WorkspaceTab,
      title: '3. Understand (Which genes mattered?)',
      short: 'SHAP identifies which genes influenced the prediction.',
      desc: 'Instead of treating the model as a black box, SHAP ranks genes by how strongly they pushed predictions toward Alzheimer\'s or toward healthy control.',
      icon: HelpCircle,
      cta: 'View Important Genes →'
    },
    {
      num: 4,
      tabId: 'pathways' as WorkspaceTab,
      title: '4. Explore biology',
      short: 'Important genes are mapped to biological pathways.',
      desc: 'Connect top biomarker genes directly to established biological pathways (like neuroinflammation, amyloid processing, and synaptic plasticity) using Enrichr.',
      icon: Network,
      cta: 'Explore Pathways →'
    },
    {
      num: 5,
      tabId: 'download' as WorkspaceTab,
      title: '5. Download results',
      short: 'Save your genes, pathway results, and analysis summary.',
      desc: 'Export clean CSV tables for R/Python analysis or download a complete Markdown research report for your lab notebook.',
      icon: Download,
      cta: 'Download Files →'
    }
  ];

  const activeStepInfo = steps.find(s => s.num === selectedStep) || steps[0];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Friendly Researcher Greeting */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-cyan-700 font-mono text-xs uppercase tracking-wider font-semibold">
          <Info className="w-4 h-4 text-cyan-600" />
          <span>Getting Started with NeuroLens</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
          How to use this platform in 5 simple steps.
        </h1>

        <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
          Welcome! We handle the complicated machine-learning and bioinformatics computations in the background so you can focus on the biological interpretation.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveTab('dataset')}
            className="px-5 py-2.5 bg-navy-950 hover:bg-navy-850 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
          >
            <span>Start with Dataset</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
          </button>

          <button
            onClick={() => setActiveTab('analyze')}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors"
          >
            Skip to Analysis
          </button>
        </div>
      </div>

      {/* 5-Step Interactive Walkthrough Grid */}
      <div className="space-y-4">
        <h2 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
          Click any step to reveal instructions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {steps.map((s) => {
            const Icon = s.icon;
            const isSelected = selectedStep === s.num;
            return (
              <div
                key={s.num}
                onClick={() => setSelectedStep(s.num)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-navy-950 text-white border-navy-900 shadow-md font-bold'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`}>
                    STEP 0{s.num}
                  </span>
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                </div>

                <div>
                  <h3 className="text-xs font-bold leading-snug">{s.title}</h3>
                </div>

                <div className={`text-[10px] ${isSelected ? 'text-cyan-300' : 'text-slate-400'}`}>
                  {isSelected ? 'Selected' : 'Click to read →'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Step Explanation Detail Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 animate-fade-in">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                Active Step {activeStepInfo.num} Explanation
              </span>
              <h3 className="text-lg font-bold text-slate-900">{activeStepInfo.title}</h3>
            </div>

            <button
              onClick={() => setActiveTab(activeStepInfo.tabId)}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5 shrink-0"
            >
              <span>{activeStepInfo.cta}</span>
            </button>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
            {activeStepInfo.desc}
          </p>
        </div>
      </div>

      {/* Dataset Summary Snapshot */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-900">Current Dataset Snapshot</h3>
          <span className="text-xs font-mono text-cyan-700 bg-cyan-50 px-2.5 py-0.5 rounded border border-cyan-200">
            {state.datasetMeta.accessionId}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs p-4 bg-slate-50 rounded-xl font-mono">
          <div>
            <span className="text-slate-400 text-[10px] block">Samples</span>
            <span className="font-bold text-slate-900">{state.samples.length}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">AD / Healthy</span>
            <span className="font-bold text-slate-900">{state.datasetMeta.adCount} AD / {state.datasetMeta.controlCount} Control</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">Genes Features</span>
            <span className="font-bold text-slate-900">{state.genes.length} Genes</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">Organism</span>
            <span className="font-bold text-slate-900">{state.datasetMeta.organism}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
