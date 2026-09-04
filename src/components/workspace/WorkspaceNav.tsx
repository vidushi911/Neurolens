import React from 'react';
import { 
  BookOpen, 
  Database, 
  Cpu, 
  HelpCircle, 
  Network, 
  FileText, 
  Download,
  ChevronLeft, 
  ChevronRight,
  Dna,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { AnalysisState } from '../../types';

export type WorkspaceTab = 'overview' | 'dataset' | 'analyze' | 'explain' | 'pathways' | 'results' | 'download';

interface WorkspaceNavProps {
  activeTab: WorkspaceTab;
  setActiveTab: (tab: WorkspaceTab) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  state: AnalysisState;
  onBackToLanding: () => void;
}

export const WorkspaceNav: React.FC<WorkspaceNavProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  state,
  onBackToLanding
}) => {
  const tabs: Array<{ id: WorkspaceTab; num: string; label: string; icon: any }> = [
    { id: 'overview', num: '01', label: 'Overview', icon: BookOpen },
    { id: 'dataset', num: '02', label: 'Dataset', icon: Database },
    { id: 'analyze', num: '03', label: 'Analyze', icon: Cpu },
    { id: 'explain', num: '04', label: 'Explain', icon: HelpCircle },
    { id: 'pathways', num: '05', label: 'Pathways', icon: Network },
    { id: 'results', num: '06', label: 'Results', icon: FileText },
    { id: 'download', num: '07', label: 'Download', icon: Download },
  ];

  const getStageStatusIcon = (status: 'idle' | 'running' | 'complete' | 'error') => {
    if (status === 'complete') return <CheckCircle2 className="w-3 h-3 text-emerald-500" />;
    if (status === 'running') return <Clock className="w-3 h-3 text-amber-500 animate-spin" />;
    if (status === 'error') return <AlertCircle className="w-3 h-3 text-rose-500" />;
    return <span className="w-2 h-2 rounded-full bg-slate-300" />;
  };

  return (
    <aside
      className={`bg-white border-r border-slate-200/80 flex flex-col justify-between transition-all duration-300 z-30 sticky top-[57px] h-[calc(100vh-57px)] shrink-0 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Top Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        {!collapsed && (
          <button onClick={onBackToLanding} className="flex items-center gap-2 text-left group">
            <div className="p-1.5 rounded-lg bg-navy-950 text-cyan-400">
              <Dna className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 tracking-tight block leading-none">NeuroLens</span>
              <span className="text-[10px] text-slate-400 font-mono">Research Studio</span>
            </div>
          </button>
        )}

        {collapsed && (
          <button onClick={onBackToLanding} className="mx-auto p-1.5 rounded-lg bg-navy-950 text-cyan-400">
            <Dna className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Progress Status Bar */}
      {!collapsed && (
        <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-100 space-y-2">
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            Pipeline Progression
          </div>
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-700">
            <div className="flex items-center gap-1" title="Data Status">
              {getStageStatusIcon(state.preprocessingStatus)}
              <span>Data</span>
            </div>
            <span className="text-slate-300">→</span>
            <div className="flex items-center gap-1" title="Model Status">
              {getStageStatusIcon(state.classificationStatus)}
              <span>Analyze</span>
            </div>
            <span className="text-slate-300">→</span>
            <div className="flex items-center gap-1" title="SHAP Status">
              {getStageStatusIcon(state.shapStatus)}
              <span>Explain</span>
            </div>
            <span className="text-slate-300">→</span>
            <div className="flex items-center gap-1" title="Pathways Status">
              {getStageStatusIcon(state.enrichrStatus)}
              <span>Pathways</span>
            </div>
          </div>
        </div>
      )}

      {/* 7 Tabs Navigation */}
      <nav className="p-2 space-y-1 flex-1 overflow-y-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-all duration-150 ${
                isActive
                  ? 'bg-navy-950 text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium'
              } ${collapsed ? 'justify-center px-0' : ''}`}
              title={tab.label}
            >
              <span className={`font-mono text-[10px] ${isActive ? 'text-cyan-400' : 'text-slate-400'}`}>
                {tab.num}
              </span>
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              {!collapsed && <span>{tab.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer Meta */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-100 bg-slate-50 text-[10px] text-slate-500 space-y-1">
          <div className="font-semibold text-slate-800 truncate">{state.datasetMeta.name}</div>
          <div className="font-mono text-slate-400">Accession: {state.datasetMeta.accessionId}</div>
        </div>
      )}
    </aside>
  );
};
