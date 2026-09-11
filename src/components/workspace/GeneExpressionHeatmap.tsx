import React, { useState } from 'react';
import { AnalysisState } from '../../types';
import { Layers, ZoomIn, ZoomOut, Info, ArrowUpDown } from 'lucide-react';

interface GeneExpressionHeatmapProps {
  state: AnalysisState;
  onOpenGeneModal?: (symbol: string) => void;
}

export const GeneExpressionHeatmap: React.FC<GeneExpressionHeatmapProps> = ({
  state,
  onOpenGeneModal
}) => {
  const [topGeneCount, setTopGeneCount] = useState<number>(15);
  const [sampleLimit, setSampleLimit] = useState<number>(30);
  const [hoveredCell, setHoveredCell] = useState<{
    sampleId: string;
    gene: string;
    exp: number;
    diagnosis: string;
    x: number;
    y: number;
  } | null>(null);

  // Filter top SHAP genes
  const topGenes = state.globalShap.slice(0, topGeneCount).map(g => g.geneSymbol);
  
  // Select balanced samples (AD and Control)
  const adSamples = state.samples.filter(s => s.diagnosis === 'Alzheimer\'s Disease').slice(0, Math.floor(sampleLimit / 2));
  const ctrlSamples = state.samples.filter(s => s.diagnosis === 'Healthy Control').slice(0, Math.ceil(sampleLimit / 2));
  const displayedSamples = [...adSamples, ...ctrlSamples];

  if (topGenes.length === 0 || displayedSamples.length === 0) {
    return (
      <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center text-xs text-slate-500 font-mono">
        Heatmap unavailable. Please run analysis to compute feature importance.
      </div>
    );
  }

  // Calculate min and max expression across displayed subset for color scaling
  let minExp = Infinity;
  let maxExp = -Infinity;
  displayedSamples.forEach(s => {
    topGenes.forEach(g => {
      const v = s.expressions[g] ?? 7.0;
      if (v < minExp) minExp = v;
      if (v > maxExp) maxExp = v;
    });
  });

  const getHeatmapColor = (val: number) => {
    if (maxExp === minExp) return '#3b82f6';
    const norm = (val - minExp) / (maxExp - minExp); // 0 to 1
    // Color gradient: Cool Blue (low) -> Neutral Gray-White (0.5) -> Vivid Crimson/Rose (high)
    if (norm < 0.5) {
      const ratio = norm * 2; // 0 to 1
      const r = Math.round(30 + ratio * (220 - 30));
      const g = Math.round(64 + ratio * (220 - 64));
      const b = Math.round(180 + ratio * (240 - 180));
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      const ratio = (norm - 0.5) * 2; // 0 to 1
      const r = Math.round(220 + ratio * (225 - 220));
      const g = Math.round(220 - ratio * (220 - 30));
      const b = Math.round(240 - ratio * (240 - 45));
      return `rgb(${r}, ${g}, ${b})`;
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-700 font-mono text-xs font-bold uppercase">
            <Layers className="w-4 h-4 text-cyan-600" />
            <span>Gene Expression Heatmap</span>
          </div>
          <h3 className="text-base font-bold text-slate-900 mt-0.5">
            Normalized Expression Matrix (Top Model-Driving Genes)
          </h3>
          <p className="text-xs text-slate-500">
            Log2 normalized expression across AD-associated vs Control sample cohorts.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div>
            <label className="text-[10px] text-slate-400 block uppercase">Genes: {topGeneCount}</label>
            <select
              value={topGeneCount}
              onChange={(e) => setTopGeneCount(Number(e.target.value))}
              className="p-1 border border-slate-300 rounded bg-white font-bold"
            >
              <option value={10}>Top 10</option>
              <option value={15}>Top 15</option>
              <option value={25}>Top 25</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block uppercase">Samples: {sampleLimit}</label>
            <select
              value={sampleLimit}
              onChange={(e) => setSampleLimit(Number(e.target.value))}
              className="p-1 border border-slate-300 rounded bg-white font-bold"
            >
              <option value={20}>20 Samples</option>
              <option value={30}>30 Samples</option>
              <option value={50}>50 Samples</option>
            </select>
          </div>
        </div>
      </div>

      {/* Color Scale Legend Bar */}
      <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
        <span className="font-semibold text-blue-700">Low Expression ({minExp.toFixed(1)})</span>
        <div className="h-3 w-48 rounded-full bg-gradient-to-r from-blue-600 via-slate-200 to-rose-600 shadow-inner" />
        <span className="font-semibold text-rose-700">High Expression ({maxExp.toFixed(1)})</span>
      </div>

      {/* Heatmap Matrix Table */}
      <div className="overflow-x-auto relative border border-slate-200 rounded-xl bg-slate-900 p-2">
        <table className="w-full border-collapse text-[10px] font-mono">
          <thead>
            <tr>
              <th className="p-2 text-left text-slate-300 font-bold bg-slate-900 sticky left-0 z-10 w-24">
                Gene / Sample
              </th>
              {displayedSamples.map(s => (
                <th
                  key={s.sampleId}
                  className={`p-1 text-center font-bold font-mono writing-mode-vertical max-w-[28px] ${
                    s.diagnosis === 'Alzheimer\'s Disease' ? 'text-rose-400 bg-rose-950/40' : 'text-emerald-400 bg-emerald-950/40'
                  }`}
                  title={`${s.sampleId} (${s.diagnosis})`}
                >
                  <span className="block truncate max-w-[28px]">{s.sampleId.replace('GSM1540', '')}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {topGenes.map(gene => (
              <tr key={gene} className="border-t border-slate-800 hover:bg-slate-850">
                <td
                  onClick={() => onOpenGeneModal && onOpenGeneModal(gene)}
                  className="p-2 font-bold text-slate-200 hover:text-cyan-400 cursor-pointer bg-slate-900 sticky left-0 z-10 whitespace-nowrap"
                >
                  {gene}
                </td>
                {displayedSamples.map(s => {
                  const val = s.expressions[gene] ?? 7.0;
                  const bgColor = getHeatmapColor(val);
                  return (
                    <td
                      key={`${s.sampleId}-${gene}`}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setHoveredCell({
                          sampleId: s.sampleId,
                          gene,
                          exp: val,
                          diagnosis: s.diagnosis,
                          x: rect.left,
                          y: rect.top
                        });
                      }}
                      onMouseLeave={() => setHoveredCell(null)}
                      className="p-0 text-center heatmap-cell cursor-crosshair h-7 w-7 min-w-[24px] border border-slate-900/60"
                      style={{ backgroundColor: bgColor }}
                    />
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Floating Hover Tooltip Detail */}
      {hoveredCell && (
        <div className="p-3 bg-slate-950 text-white rounded-xl shadow-2xl border border-cyan-500/40 font-mono text-xs max-w-xs space-y-1">
          <div className="flex justify-between items-center text-cyan-400 font-bold border-b border-slate-800 pb-1">
            <span>Gene: {hoveredCell.gene}</span>
            <span>{hoveredCell.sampleId}</span>
          </div>
          <div className="flex justify-between text-[11px] text-slate-300">
            <span>Log2 Expression:</span>
            <strong className="text-white font-bold">{hoveredCell.exp.toFixed(2)}</strong>
          </div>
          <div className="flex justify-between text-[11px]">
            <span>Profile Group:</span>
            <span className={hoveredCell.diagnosis === 'Alzheimer\'s Disease' ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
              {hoveredCell.diagnosis === 'Alzheimer\'s Disease' ? 'AD-associated' : 'Control'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
