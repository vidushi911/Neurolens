import React from 'react';
import { Database, Cpu, HelpCircle, Network, Download } from 'lucide-react';

export const WorkflowSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'DATA',
      subtitle: 'Gene Expression Matrix',
      icon: Database,
      desc: 'Load public Alzheimer\'s GEO datasets or upload custom CSV/TSV expression files.',
      color: 'text-yellow-300',
      borderColor: 'border-white/20'
    },
    {
      step: '02',
      title: 'ANALYZE',
      subtitle: 'XGBoost AD vs Control',
      icon: Cpu,
      desc: 'Train decision tree ensembles to distinguish AD patients from healthy controls.',
      color: 'text-sky-300',
      borderColor: 'border-white/20'
    },
    {
      step: '03',
      title: 'EXPLAIN',
      subtitle: 'SHAP Feature Impact',
      icon: HelpCircle,
      desc: 'Quantify exact gene contributions at cohort and single-sample resolution.',
      color: 'text-red-300',
      borderColor: 'border-white/20'
    },
    {
      step: '04',
      title: 'INTERPRET',
      subtitle: 'Enrichr Pathway Mapping',
      icon: Network,
      desc: 'Query top SHAP-ranked genes against GO, KEGG, and Reactome databases.',
      color: 'text-emerald-300',
      borderColor: 'border-white/20'
    },
    {
      step: '05',
      title: 'DOWNLOAD',
      subtitle: 'Researcher Export Hub',
      icon: Download,
      desc: 'Export clean CSV tables for R/Python analysis or download a full report.',
      color: 'text-amber-300',
      borderColor: 'border-white/20'
    }
  ];

  return (
    <section className="py-20 text-white px-4 sm:px-6 lg:px-8 border-b border-blue-800" style={{ backgroundColor: '#0000CD' }}>
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono text-yellow-300 font-bold uppercase tracking-wider">Five Simple Steps</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">How NeuroLens Connects ML to Biology</h2>
          <p className="text-sm text-blue-100 max-w-xl mx-auto">
            Designed so bench biologists can understand the full analytical progression within seconds.
          </p>
        </div>

        {/* 5 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className={`relative bg-blue-900/60 p-5 rounded-2xl border ${s.borderColor} flex flex-col justify-between hover:bg-blue-900 transition-all duration-200 group`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-blue-200">
                      STEP {s.step}
                    </span>
                    <Icon className={`w-5 h-5 ${s.color}`} />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white tracking-wide">{s.title}</h3>
                    <p className="text-xs font-medium text-blue-200">{s.subtitle}</p>
                  </div>

                  <p className="text-xs text-blue-100 leading-relaxed pt-1">
                    {s.desc}
                  </p>
                </div>

                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-20 text-blue-300">
                    →
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
