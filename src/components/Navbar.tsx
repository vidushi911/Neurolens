import React from 'react';
import { Dna, Play, LayoutDashboard, Database, ArrowRight } from 'lucide-react';
import { AnalysisState } from '../types';

interface NavbarProps {
  currentView: 'landing' | 'workspace';
  setCurrentView: (view: 'landing' | 'workspace') => void;
  onTryExampleDataset: () => void;
  state: AnalysisState;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  onTryExampleDataset,
  state
}) => {
  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-md border-b border-blue-800 text-white px-4 sm:px-6 lg:px-8 py-3 transition-colors"
      style={{ backgroundColor: '#0000CD' }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => setCurrentView('landing')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="p-2 rounded-xl bg-blue-900 border border-white/30 text-yellow-300 group-hover:border-yellow-300 transition-colors">
            <Dna className="w-4 h-4" />
          </div>
          <div>
            <span className="text-base font-bold text-white tracking-tight block leading-none">NeuroLens</span>
            <span className="text-[10px] text-blue-200 font-mono">Research Studio</span>
          </div>
        </div>

        {/* Center Pill: Active Dataset Status */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/80 border border-blue-700 text-xs font-mono text-blue-100">
          <Database className="w-3.5 h-3.5 text-yellow-300" />
          <span>Data: <strong>{state.datasetMeta.accessionId}</strong></span>
          <span className="text-blue-300">({state.samples.length} samples)</span>
        </div>

        {/* Right Navigation & CTAs */}
        <div className="flex items-center gap-3 text-xs font-medium">
          {currentView === 'landing' ? (
            <>
              <button
                onClick={() => setCurrentView('workspace')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-900 hover:bg-blue-850 text-white border border-white/30 transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-yellow-300" />
                <span>Open Studio</span>
              </button>

              <button
                onClick={onTryExampleDataset}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-yellow-300 hover:bg-yellow-200 text-blue-950 font-bold transition-all shadow-md shadow-yellow-300/20"
              >
                <Play className="w-3.5 h-3.5 fill-blue-950" />
                <span>Try Demo Data</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setCurrentView('landing')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-900 hover:bg-blue-850 text-white border border-white/30 transition-colors"
            >
              <span>Back to Landing</span>
              <ArrowRight className="w-3.5 h-3.5 text-blue-200" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
