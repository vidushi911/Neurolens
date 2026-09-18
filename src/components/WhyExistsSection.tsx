import React from 'react';
import { HelpCircle, Layers, ArrowRight, Brain, CheckCircle2 } from 'lucide-react';

export const WhyExistsSection: React.FC = () => {
  return (
    <section
      className="relative py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200 overflow-hidden font-sans"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      <div className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Left Column: The Problem Card */}
        <div className="p-8 rounded-3xl border border-slate-200 bg-[#F5F8FC] shadow-2xs space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono border font-bold bg-sky-100 text-sky-900 border-sky-200">
            <HelpCircle className="w-3.5 h-3.5 text-sky-700" />
            <span>Beyond Black-Box Machine Learning</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
            Classification without explanation is incomplete science.
          </h2>

          <p className="text-sm leading-relaxed text-slate-600 font-normal">
            Machine-learning models can achieve high precision distinguishing Alzheimer's samples on NCBI datasets, but predictions alone do not tell researchers:
          </p>

          <ul className="space-y-3 text-xs text-slate-700 font-medium">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <span>Which exact genes drove the model to evaluate an Alzheimer's-associated profile?</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <span>Did an altered gene push the prediction towards disease or control state?</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <span>Are model-ranked genes enriched in known microglial, amyloid, or neuroinflammatory pathways?</span>
            </li>
          </ul>
        </div>

        {/* Right Column: The Solution Card */}
        <div className="p-8 rounded-3xl border border-slate-200 bg-white space-y-6 shadow-2xs">
          <h3 className="text-lg font-bold flex items-center gap-2 text-slate-900">
            <Layers className="w-5 h-5 text-[#3B5DBF]" />
            <span>The Explainable AI Continuum</span>
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3.5 rounded-xl border border-sky-200 bg-sky-50 flex items-center justify-between font-bold text-sky-950">
              <span>01. PREDICTION</span>
              <span className="text-[#3B5DBF]">XGBoost ML Classifier</span>
            </div>
            <div className="flex justify-center text-[#3B5DBF]">
              <ArrowRight className="w-4 h-4 rotate-90" />
            </div>
            <div className="p-3.5 rounded-xl border border-sky-200 bg-sky-50 flex items-center justify-between font-bold text-sky-950">
              <span>02. EXPLANATION</span>
              <span className="text-[#3B5DBF]">TreeSHAP Driver Ranking</span>
            </div>
            <div className="flex justify-center text-[#3B5DBF]">
              <ArrowRight className="w-4 h-4 rotate-90" />
            </div>
            <div className="p-3.5 rounded-xl border border-sky-200 bg-sky-50 flex items-center justify-between font-bold text-sky-950">
              <span>03. INTERPRETATION</span>
              <span className="text-[#3B5DBF]">Enrichr &amp; 3D Docking</span>
            </div>
          </div>

          <p className="text-xs leading-relaxed pt-2 border-t border-slate-200 text-slate-600 font-normal">
            NeuroLens bridges computational statistics and molecular biology, enabling researchers to translate numerical weights directly into biological pathways and 3D target protein structures.
          </p>
        </div>
      </div>
    </section>
  );
};
