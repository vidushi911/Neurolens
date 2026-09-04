import React, { useState } from 'react';
import { 
  Database, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  FileSpreadsheet, 
  RefreshCw,
  HelpCircle,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { AnalysisState } from '../../types';
import { parseCustomGeneExpressionCSV } from '../../services/dataParser';
import { GSE63063_META } from '../../data/gse63063Dataset';

interface DatasetTabProps {
  state: AnalysisState;
  onUpdateState: (updates: Partial<AnalysisState>) => void;
  onResetToDemo: () => void;
}

export const DatasetTab: React.FC<DatasetTabProps> = ({
  state,
  onUpdateState,
  onResetToDemo
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
          setUploadError(parsed.error || 'Please map the diagnosis/label column under advanced settings.');
          setShowAdvanced(true);
        } else {
          setUploadError(parsed.error || 'Failed to parse file format.');
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
      setUploadError(parsed.error || 'Could not parse dataset with selected column mapping.');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold text-slate-900">Dataset Selection</h1>
        <p className="text-xs text-slate-500 mt-1">
          Choose our verified public Alzheimer&apos;s dataset or upload your experimental gene expression matrix.
        </p>
      </div>

      {/* Two Primary Choice Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Choice 1: Use Example Dataset */}
        <div
          className={`bg-white p-6 rounded-2xl border-2 transition-all space-y-5 shadow-sm ${
            !state.isCustomDataset
              ? 'border-cyan-500 ring-2 ring-cyan-500/10'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-700 text-[10px] font-mono font-bold uppercase border border-cyan-200">
              Option A: Benchmark Data
            </span>
            {!state.isCustomDataset && (
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Active Dataset
              </span>
            )}
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900">Alzheimer&apos;s Disease Benchmark Dataset</h3>
            <p className="text-xs text-slate-500 mt-1 font-mono">GEO Accession: {GSE63063_META.accessionId}</p>
          </div>

          <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400">Samples:</span>
              <span className="font-bold text-slate-900">{GSE63063_META.sampleCount} (50 AD / 50 Control)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Gene Features:</span>
              <span className="font-bold text-slate-900">{GSE63063_META.geneCount} Genes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Organism &amp; Tissue:</span>
              <span className="font-bold text-slate-900">{GSE63063_META.organism}</span>
            </div>
          </div>

          <button
            onClick={onResetToDemo}
            className="w-full py-3 bg-navy-950 hover:bg-navy-850 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
          >
            Use this dataset
          </button>
        </div>

        {/* Choice 2: Upload Your Own */}
        <div
          className={`bg-white p-6 rounded-2xl border-2 transition-all space-y-5 shadow-sm ${
            state.isCustomDataset
              ? 'border-indigo-500 ring-2 ring-indigo-500/10'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-mono font-bold uppercase border border-indigo-200">
              Option B: Custom File
            </span>
            {state.isCustomDataset && (
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Active Dataset
              </span>
            )}
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900">Upload Your Own Gene-Expression File</h3>
            <p className="text-xs text-slate-500 mt-1">Supports CSV or TSV normalized expression matrices.</p>
          </div>

          {/* Upload Drop Zone */}
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-5 text-center bg-slate-50/50 hover:border-indigo-400 transition-colors">
            <Upload className="w-6 h-6 text-indigo-600 mx-auto mb-1.5" />
            <span className="text-xs font-semibold text-slate-800 block">Drop your CSV / TSV file here</span>
            <label className="mt-2.5 inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Browse File</span>
              <input type="file" accept=".csv,.tsv,.txt" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {/* Format Help Button */}
          <div className="text-center pt-1">
            <button
              onClick={() => setShowFormatGuide(true)}
              className="text-xs text-cyan-600 hover:text-cyan-800 font-medium inline-flex items-center gap-1"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Not sure about the format?</span>
            </button>
          </div>
        </div>
      </div>

      {/* Validation Alert */}
      {uploadError && (
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl flex items-start gap-3 text-rose-900 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold text-rose-950">Data Validation Issue:</strong> {uploadError}
          </div>
        </div>
      )}

      {/* Expandable Technical Details Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full p-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors text-xs font-bold text-slate-800"
        >
          <span>Technical details &amp; Column Mapping</span>
          {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showAdvanced && (
          <div className="p-6 border-t border-slate-100 space-y-4 text-xs">
            <p className="text-slate-600">Map specific column names if auto-detection was uncertain:</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1">
                  Sample ID Column
                </label>
                <select
                  value={selectedSampleCol}
                  onChange={(e) => setSelectedSampleCol(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-300 rounded bg-white font-mono"
                >
                  <option value="">Auto Detect</option>
                  {fileColumns.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1">
                  Diagnosis Label Column
                </label>
                <select
                  value={selectedLabelCol}
                  onChange={(e) => setSelectedLabelCol(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-300 rounded bg-white font-mono"
                >
                  <option value="">Select Column...</option>
                  {fileColumns.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-500 mb-1">
                  AD Label String
                </label>
                <input
                  type="text"
                  value={adLabelVal}
                  onChange={(e) => setAdLabelVal(e.target.value)}
                  placeholder="e.g. AD or Case or 1"
                  className="w-full text-xs p-2 border border-slate-300 rounded bg-white font-mono"
                />
              </div>
            </div>

            <button
              onClick={handleApplyMapping}
              className="px-4 py-2 bg-navy-950 text-white rounded-lg text-xs font-bold hover:bg-navy-850"
            >
              Apply Column Mapping
            </button>
          </div>
        )}
      </div>

      {/* Format Guide Modal */}
      {showFormatGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Expected File Format Example</h3>
              <button onClick={() => setShowFormatGuide(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Provide a comma-separated (CSV) or tab-separated (TSV) matrix where rows are samples and columns are gene symbols (or vice versa):
            </p>

            {/* Code format preview box */}
            <div className="p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] overflow-x-auto space-y-1">
              <div className="text-cyan-400">Sample_ID, Diagnosis, APOE, APP, PSEN1, MAPT</div>
              <div>GSM101, AD, 10.4, 9.8, 8.9, 9.5</div>
              <div>GSM102, AD, 10.1, 9.5, 8.7, 9.2</div>
              <div>GSM201, Healthy, 7.2, 7.1, 6.8, 7.4</div>
              <div>GSM202, Healthy, 7.0, 6.9, 6.5, 7.1</div>
            </div>

            <button
              onClick={() => setShowFormatGuide(false)}
              className="w-full py-2.5 bg-navy-950 text-white font-bold text-xs rounded-xl"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
