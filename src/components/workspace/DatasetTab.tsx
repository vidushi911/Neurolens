import React, { useState } from 'react';
import { 
  Database, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  FileSpreadsheet, 
  HelpCircle,
  X,
  ChevronDown,
  ChevronUp,
  Search,
  ExternalLink,
  Table,
  Play
} from 'lucide-react';
import { AnalysisState } from '../../types';
import { parseCustomGeneExpressionCSV } from '../../services/dataParser';
import { ALL_NCBI_DATASETS } from '../../data/ncbiDatasets';

interface DatasetTabProps {
  state: AnalysisState;
  onUpdateState: (updates: Partial<AnalysisState>) => void;
  onSelectNCBIDataset: (accessionId: string) => void;
}

export const DatasetTab: React.FC<DatasetTabProps> = ({
  state,
  onUpdateState,
  onSelectNCBIDataset
}) => {
  const [showFormatGuide, setShowFormatGuide] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fileColumns, setFileColumns] = useState<string[]>([]);
  const [rawFileText, setRawFileText] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const [selectedSampleCol, setSelectedSampleCol] = useState<string>('');
  const [selectedLabelCol, setSelectedLabelCol] = useState<string>('');
  const [adLabelVal, setAdLabelVal] = useState<string>('AD');

  // Matrix Preview Controls
  const [previewSearch, setPreviewSearch] = useState<string>('');
  const [previewFilter, setPreviewFilter] = useState<'All' | 'AD' | 'Control'>('All');
  const [previewPage, setPreviewPage] = useState<number>(0);
  const pageSize = 8;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setUploadError(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      setRawFileText(text);

      const parsed = parseCustomGeneExpressionCSV(text, file.name);

      if (!parsed.success) {
        if (parsed.columns && parsed.columns.length > 0) {
          setFileColumns(parsed.columns);
          setUploadError(
            `Data format validation failed: ${parsed.error || 'Missing or unmapped diagnosis column'}. Please check line format or map columns below.`
          );
          setShowAdvanced(true);
        } else {
          setUploadError(parsed.error || 'Failed to parse file matrix format. Ensure header row contains gene symbols.');
        }
      } else if (parsed.samples && parsed.datasetMeta && parsed.genes) {
        onUpdateState({
          datasetMeta: parsed.datasetMeta,
          samples: parsed.samples,
          genes: parsed.genes,
          isCustomDataset: true,
          classificationStatus: 'idle',
          shapStatus: 'idle',
          enrichrStatus: 'idle',
          metrics: null,
          globalShap: [],
          sampleExplanations: {},
          pathways: []
        });
      }
    };
    reader.readAsText(file);
  };

  const handleApplyMapping = () => {
    if (!rawFileText) return;
    const parsed = parseCustomGeneExpressionCSV(rawFileText, fileName, {
      sampleIdCol: selectedSampleCol || undefined,
      labelCol: selectedLabelCol || undefined,
      adLabelValue: adLabelVal || undefined
    });

    if (parsed.success && parsed.samples && parsed.datasetMeta && parsed.genes) {
      setUploadError(null);
      onUpdateState({
        datasetMeta: parsed.datasetMeta,
        samples: parsed.samples,
        genes: parsed.genes,
        isCustomDataset: true,
        classificationStatus: 'idle',
        shapStatus: 'idle',
        enrichrStatus: 'idle',
        metrics: null,
        globalShap: [],
        sampleExplanations: {},
        pathways: []
      });
    } else {
      setUploadError(parsed.error || 'Could not parse dataset with selected column mapping. Ensure numerical expression values.');
    }
  };

  // Preview samples filtering
  const filteredSamples = state.samples.filter(s => {
    const matchesFilter =
      previewFilter === 'All' ||
      (previewFilter === 'AD' && s.diagnosis === 'Alzheimer\'s Disease') ||
      (previewFilter === 'Control' && s.diagnosis === 'Healthy Control');
    const matchesSearch = s.sampleId.toLowerCase().includes(previewSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const paginatedSamples = filteredSamples.slice(previewPage * pageSize, (previewPage + 1) * pageSize);
  const previewGenes = state.genes.slice(0, 8); // top 8 genes for tabular preview

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold text-slate-900">NCBI Datasets &amp; Custom Matrix Selection</h1>
        <p className="text-xs text-slate-500 mt-1">
          Select real NCBI GEO benchmark transcriptomics datasets or upload your experimental matrix.
        </p>
      </div>

      {/* NCBI GEO Dataset Selection Suite */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Database className="w-4 h-4 text-[#0000FF]" />
          <span>NCBI GEO Benchmark Datasets Suite</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.values(ALL_NCBI_DATASETS).map(ds => {
            const isActive = !state.isCustomDataset && state.datasetMeta.accessionId === ds.meta.accessionId;
            return (
              <div
                key={ds.meta.accessionId}
                className={`p-5 rounded-2xl border-2 transition-all flex flex-col justify-between space-y-4 shadow-xs ${
                  isActive
                    ? 'border-[#0000FF] bg-blue-50/40 ring-2 ring-[#0000FF]/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#B5C7EB]/40 text-[#0000FF] border border-[#B5C7EB]">
                      {ds.meta.accessionId}
                    </span>
                    {isActive && (
                      <span className="text-[11px] text-emerald-600 font-mono font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Active
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 leading-snug">{ds.meta.name}</h4>
                  <p className="text-[11px] text-slate-500">{ds.meta.tissueType}</p>
                </div>

                <div className="space-y-1.5 text-[11px] font-mono text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Samples:</span>
                    <strong className="text-slate-900">{ds.meta.sampleCount} ({ds.meta.adCount} AD / {ds.meta.controlCount} Ctrl)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tissue:</span>
                    <strong className="text-slate-900">{ds.meta.organism.includes('Human') ? 'Human Tissue' : 'Human'}</strong>
                  </div>
                </div>

                <button
                  onClick={() => onSelectNCBIDataset(ds.meta.accessionId)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 ${
                    isActive
                      ? 'bg-[#0000FF] text-white shadow-sm'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Train Model on {ds.meta.accessionId}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Option B: Custom Matrix File Upload */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-mono font-bold uppercase border border-indigo-200">
            Custom File Upload Option
          </span>
          {state.isCustomDataset && (
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 font-mono">
              <CheckCircle2 className="w-4 h-4" />
              Active Custom Matrix
            </span>
          )}
        </div>

        <div>
          <h3 className="text-base font-bold text-slate-900">Upload Your Own Gene-Expression Matrix</h3>
          <p className="text-xs text-slate-500 mt-1">Upload normalized CSV/TSV expression matrix to train XGBoost.</p>
        </div>

        {/* Upload Box */}
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-5 text-center bg-slate-50/50 hover:border-indigo-400 transition-colors">
          <Upload className="w-6 h-6 text-indigo-600 mx-auto mb-1.5" />
          <span className="text-xs font-semibold text-slate-800 block">Drop your CSV / TSV matrix file here</span>
          <label className="mt-2.5 inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Browse File</span>
            <input type="file" accept=".csv,.tsv,.txt" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Actionable Error Message */}
      {uploadError && (
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl space-y-2 text-rose-900 text-xs animate-fade-in">
          <div className="flex items-center gap-2 font-bold text-rose-950">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>File Parsing &amp; Validation Error</span>
          </div>
          <p className="font-mono text-[11px] leading-relaxed text-rose-800">{uploadError}</p>
        </div>
      )}

      {/* Dataset Matrix Preview Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-800">
            <Table className="w-4 h-4 text-cyan-600" />
            <span>Active Expression Matrix Preview ({state.samples.length} Samples, {state.genes.length} Features)</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search sample ID..."
                value={previewSearch}
                onChange={(e) => { setPreviewSearch(e.target.value); setPreviewPage(0); }}
                className="text-xs pl-8 pr-3 py-1 border border-slate-200 rounded-lg font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <select
              value={previewFilter}
              onChange={(e) => { setPreviewFilter(e.target.value as any); setPreviewPage(0); }}
              className="text-xs p-1 border border-slate-200 rounded-lg font-mono bg-white"
            >
              <option value="All">All Groups</option>
              <option value="AD">AD Profile</option>
              <option value="Control">Control Profile</option>
            </select>
          </div>
        </div>

        {/* Matrix Table */}
        <div className="border border-slate-200 rounded-xl overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-600 text-[10px] uppercase border-b border-slate-200">
              <tr>
                <th className="p-2.5">Sample ID</th>
                <th className="p-2.5">Group Signature</th>
                {previewGenes.map(g => (
                  <th key={g} className="p-2.5 text-center">{g}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedSamples.map(s => (
                <tr key={s.sampleId} className="hover:bg-slate-50">
                  <td className="p-2.5 font-bold text-slate-900">{s.sampleId}</td>
                  <td className="p-2.5">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        s.diagnosis === 'Alzheimer\'s Disease'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {s.diagnosis === 'Alzheimer\'s Disease' ? 'AD-associated' : 'Control'}
                    </span>
                  </td>
                  {previewGenes.map(g => (
                    <td key={g} className="p-2.5 text-center font-mono text-slate-700">
                      {(s.expressions[g] ?? 7.0).toFixed(2)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="flex justify-between items-center text-xs font-mono text-slate-500 pt-1">
          <span>Showing {paginatedSamples.length} of {filteredSamples.length} samples</span>
          <div className="flex gap-2">
            <button
              disabled={previewPage === 0}
              onClick={() => setPreviewPage(p => Math.max(0, p - 1))}
              className="px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-50 font-bold"
            >
              Previous
            </button>
            <button
              disabled={(previewPage + 1) * pageSize >= filteredSamples.length}
              onClick={() => setPreviewPage(p => p + 1)}
              className="px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-50 font-bold"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
