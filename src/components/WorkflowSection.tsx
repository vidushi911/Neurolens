import React from 'react';
import { Database, Cpu, HelpCircle, Network, Download } from 'lucide-react';

export const WorkflowSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'BIOLOGY & NCBI DATA',
      subtitle: 'NCBI GEO Datasets',
      icon: Database,
      desc: 'Select NCBI GEO microarray datasets (GSE63063 blood, GSE1297 hippocampus) or drop in custom files.',
      color: 'text-[#0000FF]'
    },
    {
      step: '02',
      title: 'ML MODEL TRAINING',
      subtitle: 'XGBoost AD vs Control',
      icon: Cpu,
      desc: 'Train decision tree ensembles on normalized gene features to identify AD-associated signatures.',
      color: 'text-[#0000FF]'
    },
    {
      step: '03',
      title: 'TREE SHAP EXPLANATION',
      subtitle: 'Feature Attributions',
      icon: HelpCircle,
      desc: 'Quantify exact gene contributions at cohort and single-sample resolution without black-box opacity.',
      color: 'text-[#0000FF]'
    },
    {
      step: '04',
      title: 'BIOLOGICAL PATHWAYS',
      subtitle: 'Enrichr Mapping',
      icon: Network,
      desc: 'Query top SHAP-ranked genes against KEGG, GO, and Reactome biological pathway libraries.',
      color: 'text-[#0000FF]'
    },
    {
      step: '05',
      title: 'RESEARCH EXPORT',
      subtitle: 'CSV & Markdown Hub',
      icon: Download,
      desc: 'Export clean CSV tables for R/Python statistical analysis or generate a formatted report.',
      color: 'text-[#0000FF]'
    }
  ];

  return (
    <section
      className="py-20 px-4 sm:px-6 lg:px-8 border-b"
      style={{ backgroundColor: '#f8fafc', borderColor: '#B5C7EB', color: '#0f172a' }}
    >
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0000FF] bg-[#B5C7EB]/30 px-3 py-1 rounded-full border border-[#B5C7EB]">
            Biology → NCBI Data → ML → Biological Result Pipeline
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: '#0000FF' }}>
            How NeuroLens Connects ML to Biology
          </h2>
          <p className="text-sm max-w-xl mx-auto text-slate-600 font-medium">
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
                className="relative p-5 rounded-2xl border bg-white transition-all duration-200 group flex flex-col justify-between shadow-sm hover:shadow-md"
                style={{ borderColor: '#B5C7EB' }}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#0000FF]">
                      STEP {s.step}
                    </span>
                    <div className="p-1.5 rounded-lg bg-[#B5C7EB]/40 text-[#0000FF]">
                      <Icon className="w-4 h-4 text-[#0000FF]" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold tracking-wide text-slate-900">{s.title}</h3>
                    <p className="text-[11px] font-mono text-[#0000FF] font-semibold">{s.subtitle}</p>
                  </div>

                  <p className="text-xs leading-relaxed text-slate-600 pt-1">
                    {s.desc}
                  </p>
                </div>

                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-20 text-[#0000FF] font-bold">
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
