import React from 'react';
import { 
  FileText, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  HelpCircle, 
  Network,
  Database,
  ArrowRight,
  ShieldAlert,
  BookOpen,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';
import { AnalysisState, ScientificReference, ResearchLimitation } from '../../types';
import { WorkspaceTab } from './WorkspaceNav';
import { GeneExpressionHeatmap } from './GeneExpressionHeatmap';

interface ResultsTabProps {
  state: AnalysisState;
  onResetAnalysis: () => void;
  setActiveTab: (tab: WorkspaceTab) => void;
  onOpenGeneModal?: (symbol: string) => void;
}

export const ResultsTab: React.FC<ResultsTabProps> = ({
  state,
  onResetAnalysis,
  setActiveTab,
  onOpenGeneModal
}) => {
  const meta = state.datasetMeta;
  const metrics = state.metrics;
  const topGenes = state.globalShap.slice(0, 5);
  const topPathways = state.pathways.slice(0, 3);

  const scientificReferences: ScientificReference[] = [
    {
      id: 'ref1',
      authors: 'Sood S, et al.',
      year: 2015,
      title: 'A novel biomarker profile for Alzheimer\'s Disease based on peripheral blood gene expression.',
      journal: 'Genome Biology, 16:185',
      url: 'https://doi.org/10.1186/s13059-015-0750-x',
      relevance: 'Primary source of GEO GSE63063 peripheral blood microarray dataset.'
    },
    {
      id: 'ref2',
      authors: 'Lundberg SM, Lee SI.',
      year: 2017,
      title: 'A Unified Approach to Interpreting Model Predictions.',
      journal: 'Advances in Neural Information Processing Systems (NeurIPS), 30',
      url: 'https://arxiv.org/abs/1705.07874',
      relevance: 'Foundational TreeSHAP game-theoretic feature attribution method.'
    },
    {
      id: 'ref3',
      authors: 'Chen T, Guestrin C.',
      year: 2016,
      title: 'XGBoost: A Scalable Tree Boosting System.',
      journal: 'ACM SIGKDD International Conference on Knowledge Discovery and Data Mining',
      url: 'https://doi.org/10.1145/2939672.2939785',
      relevance: 'Gradient boosting algorithm powering the classification engine.'
    },
    {
      id: 'ref4',
      authors: 'Kuleshov MV, et al.',
      year: 2016,
      title: 'Enrichr: a comprehensive gene set enrichment analysis web server 2016 update.',
      journal: 'Nucleic Acids Research, 44(W1):W90-W97',
      url: 'https://doi.org/10.1093/nar/gkw377',
      relevance: 'Fisher exact test pathway enrichment analysis engine.'
    }
  ];

  const researchLimitations: ResearchLimitation[] = [
    {
      title: 'Microarray Probe Resolution',
      category: 'Platform',
      description: 'Expression levels are derived from Illumina BeadChip probes, which may be susceptible to hybridization background noise compared to RNA-seq.'
    },
    {
      title: 'Cohort Sample Size',
      category: 'Cohort Size',
      description: 'The GSE63063 benchmark dataset consists of 100 human peripheral blood samples. Generalizability across larger heterogeneous populations requires external cohort validation.'
    },
    {
      title: 'Non-Diagnostic RUO Scope',
      category: 'Non-Diagnostic',
      description: 'Outputs represent AD-associated molecular expression patterns and machine-learning feature importance. This platform is strictly for research exploration and not for patient clinical diagnosis.'
    }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Research Analysis Summary</h1>
          <p className="text-xs text-slate-500 mt-1">
            Consolidated overview of dataset provenance, model performance, expression heatmap, limitations, and citations.
          </p>
        </div>

        <button
          onClick={onResetAnalysis}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors font-mono"
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
              Pipeline Execution Complete
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-1">{meta.name}</h2>
          </div>

          <div className="text-right text-xs font-mono text-emerald-600 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Complete</span>
          </div>
        </div>

        {/* 4 Summary Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Section 1: Dataset */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-cyan-600" />
              <span>Active Dataset Provenance</span>
            </h3>
            <div className="font-mono text-slate-600 space-y-1">
              <div>Accession: {meta.accessionId}</div>
              <div>Samples: {meta.sampleCount} ({meta.adCount} AD Profile / {meta.controlCount} Ctrl Profile)</div>
              <div>Organism: {meta.organism}</div>
            </div>
          </div>

          {/* Section 2: Model Classification */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              <span>Model Classification Metrics</span>
            </h3>
            <div className="font-mono text-slate-600 space-y-1">
              <div>Algorithm: XGBoost Decision Ensemble</div>
              <div>Accuracy: {metrics ? `${(metrics.accuracy * 100).toFixed(1)}%` : 'Ready'}</div>
              <div>ROC-AUC: {metrics ? metrics.rocAuc.toFixed(3) : 'Ready'}</div>
            </div>
          </div>

          {/* Section 3: Top Biomarker Genes */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-amber-500" />
              <span>Top Model-Driving Biomarker Genes</span>
            </h3>
            <div className="flex flex-wrap gap-1">
              {topGenes.map(g => (
                <span key={g.geneSymbol} className="px-2 py-0.5 bg-white border border-slate-200 rounded font-mono font-bold text-slate-800 text-[11px]">
                  {g.geneSymbol}
                </span>
              ))}
            </div>
          </div>

          {/* Section 4: Top Biological Pathways */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
              <Network className="w-4 h-4 text-emerald-600" />
              <span>Top Enriched Pathways</span>
            </h3>
            <div className="space-y-1 text-[11px] text-slate-700 font-mono">
              {topPathways.map(p => (
                <div key={p.pathwayName} className="truncate">• {p.pathwayName}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-wrap gap-3">
          <button
            onClick={() => setActiveTab('explain')}
            className="px-4 py-2.5 bg-navy-950 hover:bg-navy-850 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <span>View SHAP gene explanations</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
          </button>

          <button
            onClick={() => setActiveTab('pathways')}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <span>Explore biological pathways</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setActiveTab('download')}
            className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download research report</span>
          </button>
        </div>
      </div>

      {/* Interactive Expression Heatmap */}
      <GeneExpressionHeatmap state={state} onOpenGeneModal={onOpenGeneModal} />

      {/* Research Limitations Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span>Research Scope &amp; Limitations</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
          {researchLimitations.map(item => (
            <div key={item.title} className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/60 space-y-1.5">
              <span className="text-[9px] font-mono font-bold uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                {item.category}
              </span>
              <h4 className="font-bold text-slate-900 text-xs">{item.title}</h4>
              <p className="text-slate-600 text-[11px] leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scientific References Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <BookOpen className="w-4 h-4 text-cyan-600" />
          <span>Scientific References &amp; Literature Citations</span>
        </h3>

        <div className="space-y-3 text-xs">
          {scientificReferences.map((ref) => (
            <div key={ref.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 font-mono">
              <div className="flex justify-between items-start gap-2">
                <span className="font-bold text-slate-900">{ref.authors} ({ref.year})</span>
                {ref.url && (
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-700 hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <span>View Publication</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <p className="text-slate-800 font-sans italic text-xs">&ldquo;{ref.title}&rdquo;</p>
              <div className="text-slate-500 text-[10px]">{ref.journal} — {ref.relevance}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
