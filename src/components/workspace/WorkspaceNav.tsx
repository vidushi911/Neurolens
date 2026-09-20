import React from 'react';
import { 
  BookOpen, 
  Database, 
  Cpu, 
  HelpCircle, 
  Network, 
  FlaskConical,
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

export type WorkspaceTab = 'overview' | 'dataset' | 'analyze' | 'explain' | 'pathways' | 'docking' | 'results' | 'download';

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
    { id: 'docking', num: '06', label: 'Docking', icon: FlaskConical },
    { id: 'results', num: '07', label: 'Results', icon: FileText },
    { id: 'download', num: '08', label: 'Download', icon: Download },
  ];

  const getStageStatusIcon = (status: 'idle' | 'running' | 'complete' | 'error') => {
    if (status === 'complete') return <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />;
    if (status === 'running') return <Clock className="w-3 h-3 text-amber-500 animate-spin shrink-0" />;
    if (status === 'error') return <AlertCircle className="w-3 h-3 text-rose-500 shrink-0" />;
    return <span className="w-2 h-2 rounded-full bg-slate-300 shrink-0" />;
  };

  return (
    <aside
      className={`bg-white border-r border-slate-200 flex flex-col justify-between transition-all duration-300 z-30 sticky top-[57px] h-[calc(100vh-57px)] shrink-0 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Top Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        {!collapsed && (
          <button onClick={onBackToLanding} className="flex items-center gap-2.5 text-left group overflow-hidden">
            <div className="p-1.5 rounded-xl bg-sky-100 text-sky-800 border border-sky-200 shrink-0">
              <Dna className="w-4 h-4 text-sky-600" />
            </div>
            <div className="truncate">
              <span className="text-sm font-bold text-slate-900 tracking-tight block leading-none truncate">NeuroLens</span>
              <span className="text-[10px] text-slate-500 font-mono truncate block">Analytics</span>
            </div>
          </button>
        )}

        {collapsed && (
          <button onClick={onBackToLanding} className="mx-auto p-1.5 rounded-xl bg-sky-100 text-sky-800 border border-sky-200 shrink-0">
            <Dna className="w-4 h-4 text-sky-600" />
          </button>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Pipeline Progress Status Bar */}
      {!collapsed && (
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 space-y-2 overflow-hidden">
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider truncate">
            Pipeline Progression
          </div>
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-700">
            <div className="flex items-center gap-1 truncate" title="Data Status">
              {getStageStatusIcon(state.preprocessingStatus)}
              <span className="truncate">Data</span>
            </div>
            <span className="text-slate-300 shrink-0">→</span>
            <div className="flex items-center gap-1 truncate" title="Model Status">
              {getStageStatusIcon(state.classificationStatus)}
              <span className="truncate">Analyze</span>
            </div>
            <span className="text-slate-300 shrink-0">→</span>
            <div className="flex items-center gap-1 truncate" title="SHAP Status">
              {getStageStatusIcon(state.shapStatus)}
              <span className="truncate">Explain</span>
            </div>
            <span className="text-slate-300 shrink-0">→</span>
            <div className="flex items-center gap-1 truncate" title="Docking Status">
              <CheckCircle2 className="w-3 h-3 text-sky-600 shrink-0" />
              <span className="truncate">Docking</span>
            </div>
          </div>
        </div>
      )}

      {/* 8 Flat Rounded-Rectangle Tabs with Proper Pill Padding & Containment */}
      <nav className="p-3 space-y-1.5 flex-1 overflow-y-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs transition-all duration-150 box-border overflow-hidden ${
                isActive
                  ? 'bg-[#D6EFFA] text-sky-950 border border-sky-300 font-bold shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium border border-transparent'
              } ${collapsed ? 'justify-center px-0' : ''}`}
              title={tab.label}
            >
              <span className={`font-mono text-[10px] shrink-0 ${isActive ? 'text-sky-800 font-bold' : 'text-slate-400'}`}>
                {tab.num}
              </span>
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-sky-700' : 'text-slate-500'}`} />
              {!collapsed && (
                <span className="truncate text-left flex-1 min-w-0 font-sans tracking-tight">
                  {tab.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Metadata Card */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-200 bg-slate-50 text-[10px] text-slate-500 space-y-1 overflow-hidden">
          <div className="font-semibold text-slate-800 truncate">{state.datasetMeta.name}</div>
          <div className="font-mono text-slate-400 truncate">Accession: {state.datasetMeta.accessionId}</div>
        </div>
      )}
    </aside>
  );
};
