import React from 'react';
import { Compass, Clock, Database, Sparkles, AlertCircle } from 'lucide-react';

export const FutureScopeSection: React.FC = () => {
  return (
    <section className="py-20 px-6 sm:px-12 lg:px-16 bg-[#F5F8FC] border-t border-slate-200 text-slate-900 font-sans">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Honest Current Capability & Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-900 border border-sky-200 text-xs font-mono font-bold uppercase">
            <Compass className="w-3.5 h-3.5 text-sky-700" />
            <span>Product Vision Roadmap</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Where This Is Headed — Future Scope
          </h2>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-700 shadow-2xs text-left sm:text-center leading-relaxed">
            <strong>Current Capabilities:</strong> NeuroLens uses gene-expression data, machine learning, and explainable AI (SHAP) to identify genes and biological pathways associated with Alzheimer's. It produces a molecular profile — not a diagnosis.
          </div>
        </div>

        {/* 3 Future Scope Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between hover:border-sky-300 transition-colors">
            <div className="space-y-3">
              <div className="p-2.5 w-fit rounded-xl bg-sky-100 text-sky-800 border border-sky-200">
                <Clock className="w-5 h-5 text-sky-700" />
              </div>
              <span className="text-[10px] font-mono font-bold text-sky-800 uppercase tracking-wider block">
                Future Capability 01
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Early Detection &amp; Staging
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                NeuroLens currently classifies samples as Alzheimer's-associated or healthy. Because gene-expression changes can appear before symptoms do, a future version could estimate disease stage or progression risk instead of a simple yes/no — giving researchers an early-warning signal, not just a label.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[10px] font-mono text-slate-400 font-semibold">
              Status: Proposed Analytical Extension
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between hover:border-sky-300 transition-colors">
            <div className="space-y-3">
              <div className="p-2.5 w-fit rounded-xl bg-sky-100 text-sky-800 border border-sky-200">
                <Database className="w-5 h-5 text-sky-700" />
              </div>
              <span className="text-[10px] font-mono font-bold text-sky-800 uppercase tracking-wider block">
                Future Capability 02
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Richer, Longitudinal Data
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Right now, NeuroLens uses gene-expression data alone. Adding blood biomarkers, clinical information, and especially samples collected from the same patients over several years would let the model track how disease-associated patterns change over time — not just compare two static groups.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[10px] font-mono text-slate-400 font-semibold">
              Status: Multi-Omic &amp; Cohort Integration
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3 flex flex-col justify-between hover:border-sky-300 transition-colors">
            <div className="space-y-3">
              <div className="p-2.5 w-fit rounded-xl bg-sky-100 text-sky-800 border border-sky-200">
                <Sparkles className="w-5 h-5 text-sky-700" />
              </div>
              <span className="text-[10px] font-mono font-bold text-sky-800 uppercase tracking-wider block">
                Future Capability 03
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Therapeutic Leads (Hypotheses Only)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Once important genes and pathways are identified, a future extension could suggest potential therapeutic targets or drug-repurposing candidates — flagged clearly as research hypotheses for scientists to investigate further, never as treatment recommendations.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[10px] font-mono text-slate-400 font-semibold">
              Status: In-Silico Screening Hypothesis
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
