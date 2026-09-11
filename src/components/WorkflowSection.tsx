import React from 'react';
import { Database, Cpu, HelpCircle, Network, Download } from 'lucide-react';

export const WorkflowSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'BIOLOGY & NCBI DATA',
      subtitle: 'NCBI GEO Datasets',
      icon: Database,
      desc: 'Select NCBI GEO microarray datasets (GSE63063 blood, GSE1297 hippocampus) or drop in custom files.'
    },
    {
      step: '02',
      title: 'ML MODEL TRAINING',
      subtitle: 'XGBoost AD vs Control',
      icon: Cpu,
      desc: 'Train decision tree ensembles on normalized gene features to identify AD-associated signatures.'
    },
    {
      step: '03',
      title: 'TREE SHAP EXPLANATION',
      subtitle: 'Feature Attributions',
      icon: HelpCircle,
      desc: 'Quantify exact gene contributions at cohort and single-sample resolution without black-box opacity.'
    },
    {
      step: '04',
      title: 'BIOLOGICAL PATHWAYS',
      subtitle: 'Enrichr Mapping',
      icon: Network,
      desc: 'Query top SHAP-ranked genes against KEGG, GO, and Reactome biological pathway libraries.'
    },
    {
      step: '05',
      title: 'RESEARCH EXPORT',
      subtitle: 'CSV & Markdown Hub',
      icon: Download,
      desc: 'Export clean CSV tables for R/Python statistical analysis or generate a formatted report.'
    }
  ];

  return (
    <section
      className="relative py-24 px-4 sm:px-6 lg:px-8 border-b overflow-hidden"
      style={{ backgroundColor: '#f8fafc', borderColor: '#B5C7EB' }}
    >
      {/* Background Scientific Artwork Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-20 pointer-events-none"
        style={{ backgroundImage: `url('/assets/gene_dna_background.jpg')` }}
      />

      <div className="relative z-10 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span
            className="text-xs font-mono font-bold uppercase tracking-wider px-3.5 py-1 rounded-full border shadow-xs"
            style={{ backgroundColor: '#ffffff', borderColor: '#B5C7EB', color: '#0000FF' }}
          >
            Biology → NCBI Data → ML → Biological Result Pipeline
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-gwen text-slate-900 leading-tight">
            How NeuroLens Connects ML to Biology
          </h2>
          <p className="text-sm max-w-xl mx-auto text-slate-700 font-medium">
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
                className="relative p-5 rounded-2xl border bg-white/95 backdrop-blur-md transition-all duration-300 group flex flex-col justify-between shadow-sm hover:shadow-xl hover:-translate-y-1"
                style={{ borderColor: '#B5C7EB' }}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#0000FF] bg-[#B5C7EB]/30 px-2 py-0.5 rounded border border-[#B5C7EB]">
                      STEP {s.step}
                    </span>
                    <div className="p-1.5 rounded-lg bg-[#0000FF] text-white shadow-xs">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold tracking-wide text-slate-900">{s.title}</h3>
                    <p className="text-[11px] font-mono text-[#0000FF] font-semibold">{s.subtitle}</p>
                  </div>

                  <p className="text-xs leading-relaxed text-slate-700 pt-1 font-medium">
                    {s.desc}
                  </p>
                </div>

                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-[#0000FF] font-bold text-base bg-white rounded-full p-0.5 border border-[#B5C7EB] shadow-xs">
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
