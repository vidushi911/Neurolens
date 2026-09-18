import React from 'react';
import { Database, Cpu, HelpCircle, Network, FlaskConical, Download } from 'lucide-react';

export const WorkflowSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'GEO EXPRESSION DATA',
      subtitle: 'Public & Custom Matrices',
      icon: Database,
      desc: 'Select gene expression datasets from public NCBI repositories (GSE63063, GSE1297) or drop in custom matrices.'
    },
    {
      step: '02',
      title: 'MACHINE LEARNING',
      subtitle: 'XGBoost Classification',
      icon: Cpu,
      desc: 'Train machine-learning models (XGBoost) to distinguish Alzheimer\'s samples from healthy controls.'
    },
    {
      step: '03',
      title: 'EXPLAINABLE AI',
      subtitle: 'SHAP Driver Ranking',
      icon: HelpCircle,
      desc: 'Calculate exact driver gene contributions (SHAP feature attribution) to understand key biomarker drivers.'
    },
    {
      step: '04',
      title: 'BIOLOGICAL PATHWAYS',
      subtitle: 'Enrichr Pathway Mapping',
      icon: Network,
      desc: 'Connect top biomarker genes to biological processes (amyloid clearance, synaptic plasticity) via Enrichr.'
    },
    {
      step: '05',
      title: '3D TARGET DOCKING',
      subtitle: 'AutoDock Vina Engine',
      icon: FlaskConical,
      desc: 'Dock candidate drug molecules against 3D protein structures (PDB) and rank by binding energy (kcal/mol).'
    },
    {
      step: '06',
      title: 'RESEARCH EXPORT',
      subtitle: 'Data & Markdown Hub',
      icon: Download,
      desc: 'Export clean data tables for R/Python analysis or download a formatted research report for your lab notebook.'
    }
  ];

  return (
    <section
      className="relative py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200 overflow-hidden font-sans"
      style={{ backgroundColor: '#F5F8FC' }}
    >
      <div className="relative z-10 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider px-3.5 py-1 rounded-full bg-sky-100 text-sky-900 border border-sky-200 inline-block">
            Step-by-Step Analytical Narrative
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
            How NeuroLens Connects ML to Biology &amp; Target Docking
          </h2>
          <p className="text-sm max-w-2xl mx-auto text-slate-600 font-normal">
            A continuous, transparent workflow from gene expression profiling to 3D molecular candidate screening.
          </p>
        </div>

        {/* 6 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="p-4 rounded-2xl border border-slate-200 bg-white transition-all duration-300 flex flex-col justify-between shadow-2xs hover:border-sky-300 hover:shadow-xs"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-sky-900 bg-sky-100 px-2 py-0.5 rounded border border-sky-200">
                      STEP {s.step}
                    </span>
                    <div className="p-1.5 rounded-lg bg-[#3B5DBF] text-white">
                      <Icon className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold tracking-wide text-slate-900">{s.title}</h3>
                    <p className="text-[10px] font-mono text-[#3B5DBF] font-semibold">{s.subtitle}</p>
                  </div>

                  <p className="text-[11px] leading-relaxed text-slate-600 font-normal">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
