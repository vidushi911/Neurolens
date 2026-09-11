import React from 'react';
import { Dna, Play, LayoutDashboard, Database, ArrowRight } from 'lucide-react';
import { AnalysisState } from '../types';
import { ALL_NCBI_DATASETS } from '../data/ncbiDatasets';

interface NavbarProps {
  currentView: 'landing' | 'workspace';
  setCurrentView: (view: 'landing' | 'workspace') => void;
  onSelectNCBIDataset: (accessionId: string) => void;
  state: AnalysisState;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  onSelectNCBIDataset,
  state
}) => {
  const handleNavigate = (view: 'landing' | 'workspace') => {
    if (view === 'workspace' && currentView === 'landing') {
      window.history.pushState({ view: 'workspace' }, '');
    } else if (view === 'landing' && currentView === 'workspace') {
      window.history.pushState({ view: 'landing' }, '');
    }
    setCurrentView(view);
  };

  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3 transition-colors border-b text-white shadow-md"
      style={{
        backgroundColor: currentView === 'landing' ? '#0000FF' : '#0f172a',
        borderColor: currentView === 'landing' ? 'rgba(181, 199, 235, 0.3)' : '#1e293b'
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & RUO Tag */}
        <div
          onClick={() => handleNavigate('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div
            className="p-2 rounded-xl border transition-colors shadow-sm"
            style={{ backgroundColor: 'rgba(181, 199, 235, 0.2)', borderColor: '#B5C7EB', color: '#FFFAFA' }}
          >
            <Dna className="w-4 h-4 text-cyan-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight block leading-none text-white">NeuroLens</span>
              <span
                className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border"
                style={{ backgroundColor: 'rgba(181, 199, 235, 0.25)', borderColor: '#B5C7EB', color: '#B5C7EB' }}
              >
                RUO Prototype
              </span>
            </div>
            <span className="text-[10px] font-mono" style={{ color: '#B5C7EB' }}>
              NCBI Dataset ML Trainer
            </span>
          </div>
        </div>

        {/* Center Pill: Active NCBI Dataset Selector Dropdown */}
        <div
          className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border shadow-xs"
          style={{ backgroundColor: 'rgba(181, 199, 235, 0.15)', borderColor: 'rgba(181, 199, 235, 0.3)', color: '#B5C7EB' }}
        >
          <Database className="w-3.5 h-3.5 text-cyan-300" />
          <span className="font-semibold text-white">NCBI Dataset:</span>
          <select
            value={state.datasetMeta.accessionId}
            onChange={(e) => onSelectNCBIDataset(e.target.value)}
            className="bg-navy-950 text-white font-bold text-xs p-1 rounded border border-blue-700 cursor-pointer"
          >
            <option value="GSE63063">GSE63063 (Blood PBMCs - 100 samples)</option>
            <option value="GSE1297">GSE1297 (Hippocampus - 31 samples)</option>
            <option value="GSE5281">GSE5281 (Entorhinal Cortex - 161 samples)</option>
          </select>
        </div>

        {/* Right Navigation & CTAs */}
        <div className="flex items-center gap-3 text-xs font-medium">
          {currentView === 'landing' ? (
            <>
              <button
                onClick={() => handleNavigate('workspace')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold border transition-all hover:scale-105"
                style={{ backgroundColor: 'rgba(181, 199, 235, 0.25)', borderColor: '#B5C7EB', color: '#FFFAFA' }}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-cyan-300" />
                <span>Open Studio</span>
              </button>

              <button
                onClick={() => {
                  onSelectNCBIDataset(state.datasetMeta.accessionId);
                  handleNavigate('workspace');
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold transition-all shadow-md hover:opacity-90"
                style={{ backgroundColor: '#B5C7EB', color: '#0000FF' }}
              >
                <Play className="w-3.5 h-3.5 fill-[#0000FF]" />
                <span>Train Model Now</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => handleNavigate('landing')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold border transition-all"
              style={{ backgroundColor: 'rgba(181, 199, 235, 0.2)', borderColor: '#B5C7EB', color: '#FFFAFA' }}
            >
              <span>Back to Landing</span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-300" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
