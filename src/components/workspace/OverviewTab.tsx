import React, { useState } from 'react';
import { 
  Database, 
  Cpu, 
  HelpCircle, 
  Network, 
  FlaskConical,
  Download, 
  ArrowRight,
  Info
} from 'lucide-react';
import { AnalysisState } from '../../types';
import { WorkspaceTab } from './WorkspaceNav';

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
      title: '1. Choose your dataset',
      short: 'Select an Alzheimer\'s GEO expression matrix or drop in your own file.',
      desc: 'Start with public NCBI GEO dataset GSE63063 (100 human samples: 50 Alzheimer\'s vs 50 Healthy Control) or drop in your own experimental CSV/TSV expression file.',
      icon: Database,
      cta: 'Go to Dataset →'
    },
    {
      num: 2,
      tabId: 'analyze' as WorkspaceTab,
      title: '2. Train & Analyze',
      short: 'Train machine-learning models to classify AD vs. Control samples.',
      desc: 'Our XGBoost model evaluates thousands of gene expression values simultaneously to distinguish Alzheimer\'s cases from control samples.',
      icon: Cpu,
      cta: 'Run Analysis →'
    },
    {
      num: 3,
      tabId: 'explain' as WorkspaceTab,
      title: '3. Explain (SHAP Biomarkers)',
      short: 'Identify top biomarker genes pushing predictions toward AD.',
      desc: 'Instead of treating the model as a black box, SHAP calculates exact marginal contributions to reveal key driver genes like BACE1, APOE, APP, and PSEN1.',
      icon: HelpCircle,
      cta: 'View Biomarker Genes →'
    },
    {
      num: 4,
      tabId: 'pathways' as WorkspaceTab,
      title: '4. Map Pathways',
      short: 'Connect biomarker genes to biological pathways.',
      desc: 'Map driver genes into KEGG, Reactome, and GO biological processes (amyloid clearance, tau hyperphosphorylation, neuroinflammation) via Enrichr API.',
      icon: Network,
      cta: 'Explore Pathways →'
    },
    {
      num: 5,
      tabId: 'docking' as WorkspaceTab,
      title: '5. Molecular Docking',
      short: 'Dock candidate drugs against 3D target protein structures.',
      desc: 'Fetch target 3D structures from RCSB PDB, run AutoDock Vina binding energy scoring, evaluate Lipinski Rule of 5 drug-likeness, and track lead compounds.',
      icon: FlaskConical,
      cta: 'Launch Docking Studio →'
    },
    {
      num: 6,
      tabId: 'download' as WorkspaceTab,
      title: '6. Export Results',
      short: 'Download data tables and complete lab reports.',
      desc: 'Export high-resolution figures, docking poses, binding energies, and complete Markdown research reports for your lab notebook.',
      icon: Download,
      cta: 'Download Files →'
    }
  ];

  const activeStepInfo = steps.find(s => s.num === selectedStep) || steps[0];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 font-sans">
      {/* Researcher Greeting Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-sky-800 font-mono text-xs uppercase tracking-wider font-semibold">
          <Info className="w-4 h-4 text-sky-600" />
          <span>NeuroLens Scientific Workflow</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
          From Gene Expression to 3D Target Docking.
        </h1>

        <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
          NeuroLens integrates gene expression profiling, SHAP explainable AI, biological pathway enrichment, and 3D AutoDock Vina molecular docking into a unified scientific interface.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveTab('dataset')}
            className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <span>Start with Dataset</span>
            <ArrowRight className="w-3.5 h-3.5 text-sky-200" />
          </button>

          <button
            onClick={() => setActiveTab('docking')}
            className="px-4 py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FlaskConical className="w-3.5 h-3.5 text-sky-600" />
            <span>Go directly to Docking</span>
          </button>
        </div>
      </div>

      {/* 6-Step Interactive Walkthrough Grid */}
      <div className="space-y-4">
        <h2 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
          Click any step to reveal instructions
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {steps.map((s) => {
            const Icon = s.icon;
            const isSelected = selectedStep === s.num;
            return (
              <div
                key={s.num}
                onClick={() => setSelectedStep(s.num)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-3 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#D6EFFA] text-sky-950 border-sky-300 font-bold'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-sky-800' : 'text-slate-400'}`}>
                    STEP 0{s.num}
                  </span>
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-sky-700' : 'text-slate-500'}`} />
                </div>

                <div>
                  <h3 className="text-xs font-bold leading-snug">{s.title}</h3>
                </div>

                <div className={`text-[10px] ${isSelected ? 'text-sky-800 font-semibold' : 'text-slate-400'}`}>
                  {isSelected ? 'Active' : 'View details →'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Step Explanation Detail Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 animate-fade-in">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                Step {activeStepInfo.num} Overview
              </span>
              <h3 className="text-lg font-bold text-slate-900">{activeStepInfo.title}</h3>
            </div>

            <button
              onClick={() => setActiveTab(activeStepInfo.tabId)}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
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
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-900">Loaded Dataset Snapshot</h3>
          <span className="text-xs font-mono text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded border border-sky-200">
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
            <span className="text-slate-400 text-[10px] block">Gene Features</span>
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
