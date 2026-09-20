import React, { useState } from 'react';
import { Dna, Play, Database, ArrowRight, Search } from 'lucide-react';
import { AnalysisState } from '../types';

interface NavbarProps {
  currentView: 'landing' | 'workspace';
  setCurrentView: (view: 'landing' | 'workspace') => void;
  onSelectNCBIDataset: (accessionId: string) => void;
  state: AnalysisState;
  onSearchSubmit?: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  onSelectNCBIDataset,
  state,
  onSearchSubmit
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleNavigate = (view: 'landing' | 'workspace') => {
    if (view === 'workspace' && currentView === 'landing') {
      window.history.pushState({ view: 'workspace' }, '');
    } else if (view === 'landing' && currentView === 'workspace') {
      window.history.pushState({ view: 'landing' }, '');
    }
    setCurrentView(view);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      if (onSearchSubmit) {
        onSearchSubmit(searchQuery.trim());
      }
      if (currentView === 'landing') {
        handleNavigate('workspace');
      }
    }
  };

  const isWorkspace = currentView === 'workspace';

  return (
    <header
      className={`sticky top-[33px] z-40 px-4 sm:px-6 lg:px-8 py-2.5 transition-colors border-b ${
        isWorkspace
          ? 'bg-white border-slate-200 text-slate-900 shadow-2xs'
          : 'bg-[#3B5DBF] border-[#3B5DBF]/40 text-white shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo & RUO Tag */}
        <div
          onClick={() => handleNavigate('landing')}
          className="flex items-center gap-3 cursor-pointer shrink-0 group"
        >
          <div
            className={`p-2 rounded-xl border transition-colors ${
              isWorkspace
                ? 'bg-sky-100 border-sky-200 text-sky-800'
                : 'bg-white/15 border-white/30 text-white'
            }`}
          >
            <Dna className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-base font-bold tracking-tight block leading-none ${isWorkspace ? 'text-slate-900' : 'text-white'}`}>
                NeuroLens
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${
                  isWorkspace
                    ? 'bg-sky-50 border-sky-200 text-sky-800'
                    : 'bg-white/20 border-white/30 text-white'
                }`}
              >
                RUO Platform
              </span>
            </div>
            <span className={`text-[10px] font-mono ${isWorkspace ? 'text-slate-500' : 'text-sky-100'}`}>
              Alzheimer's Gene &amp; Docking Platform
            </span>
          </div>
        </div>

        {/* Search Tool Bar */}
        <div className="flex-1 max-w-md relative hidden sm:block">
          <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${isWorkspace ? 'text-slate-400' : 'text-sky-200'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search gene symbol (e.g. APOE, BACE1, APP) or ask a question..."
            className={`w-full text-xs pl-8 pr-3 py-1.5 rounded-xl border transition-all focus:outline-none ${
              isWorkspace
                ? 'bg-slate-50 border-slate-200 text-slate-800 focus:bg-white focus:border-sky-500'
                : 'bg-white/15 border-white/25 text-white placeholder:text-sky-200/80 focus:bg-white/25 focus:border-white'
            }`}
          />
        </div>

        {/* Center Pill: Active NCBI Dataset Selector Dropdown */}
        <div
          className={`hidden lg:flex items-center gap-2 px-3 py-1 rounded-xl text-xs font-mono border shrink-0 ${
            isWorkspace
              ? 'bg-slate-50 border-slate-200 text-slate-700'
              : 'bg-white/10 border-white/20 text-white'
          }`}
        >
          <Database className={`w-3.5 h-3.5 ${isWorkspace ? 'text-sky-600' : 'text-sky-200'}`} />
          <span className="font-semibold">NCBI Dataset:</span>
          <select
            value={state.datasetMeta.accessionId}
            onChange={(e) => onSelectNCBIDataset(e.target.value)}
            className={`font-bold text-xs p-1 rounded border cursor-pointer ${
              isWorkspace
                ? 'bg-white text-slate-900 border-slate-300'
                : 'bg-[#2C489D] text-white border-sky-400/40'
            }`}
          >
            <option value="GSE63063">GSE63063 (Blood PBMCs - 100 samples)</option>
            <option value="GSE1297">GSE1297 (Hippocampus - 31 samples)</option>
            <option value="GSE5281">GSE5281 (Entorhinal Cortex - 161 samples)</option>
          </select>
        </div>

        {/* Right Navigation — Single Launch Studio Button */}
        <div className="flex items-center gap-3 text-xs font-medium shrink-0">
          {currentView === 'landing' ? (
            <button
              onClick={() => {
                onSelectNCBIDataset(state.datasetMeta.accessionId);
                handleNavigate('workspace');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold transition-all shadow-sm hover:opacity-95 bg-white text-[#3B5DBF] cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-[#3B5DBF]" />
              <span>Open Workbench</span>
            </button>
          ) : (
            <button
              onClick={() => handleNavigate('landing')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold border transition-all bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
            >
              <span>Back to Landing</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
