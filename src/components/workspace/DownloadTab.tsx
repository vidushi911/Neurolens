import React from 'react';
import { Download, FileText, Database, HelpCircle, Network, CheckCircle2 } from 'lucide-react';
import { AnalysisState } from '../../types';
import { 
  exportSHAPImportanceCSV, 
  exportPathwayResultsCSV, 
  exportPreprocessedDataCSV, 
  generateMarkdownReport,
  downloadCSV 
} from '../../services/exportUtils';

interface DownloadTabProps {
  state: AnalysisState;
}

export const DownloadTab: React.FC<DownloadTabProps> = ({ state }) => {
  const meta = state.datasetMeta;

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold text-slate-900">Download Results</h1>
        <p className="text-xs text-slate-500 mt-1">
          Export your model-driving genes, pathway analysis, and complete research summary report.
        </p>
      </div>

      {/* Main Downloads Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Download Gene Results */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:border-amber-400 transition-colors">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-700 w-fit border border-amber-200">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Download Gene Results</h3>
            <p className="text-xs text-slate-500 mt-1">
              CSV file containing all model-ranked genes, mean |SHAP| values, directional impact, and fold changes.
            </p>
          </div>
          <button
            onClick={() => exportSHAPImportanceCSV(state)}
            className="w-full py-2.5 bg-navy-950 hover:bg-navy-850 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Download Gene Results (.csv)</span>
          </button>
        </div>

        {/* Download Pathway Results */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:border-emerald-400 transition-colors">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 w-fit border border-emerald-200">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Download Pathway Results</h3>
            <p className="text-xs text-slate-500 mt-1">
              CSV file detailing Enrichr pathways, combined scores, adjusted p-values (FDR), and overlapping genes.
            </p>
          </div>
          <button
            onClick={() => exportPathwayResultsCSV(state)}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Pathway Results (.csv)</span>
          </button>
        </div>

        {/* Download Full Human Report */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:border-cyan-400 transition-colors">
          <div className="p-3 rounded-xl bg-cyan-50 text-cyan-700 w-fit border border-cyan-200">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Download Complete Summary Report</h3>
            <p className="text-xs text-slate-500 mt-1">
              Formatted Markdown research document with dataset metadata, model performance, top 10 genes, and pathways.
            </p>
          </div>
          <button
            onClick={() => {
              const md = generateMarkdownReport(state);
              downloadCSV(`NeuroLens_Research_Report_${meta.accessionId}.md`, md);
            }}
            className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Complete Report (.md)</span>
          </button>
        </div>

        {/* Download Raw Expression Matrix */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:border-indigo-400 transition-colors">
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-700 w-fit border border-indigo-200">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Download Expression Matrix</h3>
            <p className="text-xs text-slate-500 mt-1">
              Normalized log2 gene expression matrix for all {state.samples.length} bio-samples for R/Python analysis.
            </p>
          </div>
          <button
            onClick={() => exportPreprocessedDataCSV(state)}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Matrix (.csv)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
