import React from 'react';
import { HelpCircle, Heart, ArrowRight } from 'lucide-react';

export const WhyExistsSection: React.FC = () => {
  return (
    <section
      className="relative py-24 px-4 sm:px-6 lg:px-8 border-b overflow-hidden"
      style={{ backgroundColor: '#FFFAFA', borderColor: '#B5C7EB' }}
    >
      {/* Background Brain Neural Network Artwork */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-25 pointer-events-none"
        style={{ backgroundImage: `url('/assets/brain_network_background.jpg')` }}
      />

      <div className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Left Column: The Problem Card */}
        <div className="p-8 rounded-3xl border bg-white/95 backdrop-blur-md shadow-md space-y-6" style={{ borderColor: '#B5C7EB' }}>
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono border font-semibold shadow-xs"
            style={{ backgroundColor: 'rgba(181, 199, 235, 0.4)', borderColor: '#0000FF', color: '#0000FF' }}
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#0000FF]" />
            <span>Beyond Black-Box Machine Learning</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-gwen leading-tight text-slate-900">
            Classification without explanation is incomplete science.
          </h2>

          <p className="text-sm leading-relaxed text-slate-700 font-medium">
            Machine-learning models can achieve high accuracy distinguishing Alzheimer&apos;s samples on NCBI datasets, but predictions alone do not tell researchers:
          </p>

          <ul className="space-y-3 text-xs text-slate-800 font-medium">
            <li className="flex items-start gap-2.5">
              <span className="text-[#0000FF] font-mono font-bold bg-[#B5C7EB]/40 px-1.5 py-0.2 rounded border border-[#B5C7EB]">?</span>
              <span>Which exact genes drove the model to evaluate an AD-associated profile?</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-[#0000FF] font-mono font-bold bg-[#B5C7EB]/40 px-1.5 py-0.2 rounded border border-[#B5C7EB]">?</span>
              <span>Did an upregulated gene push the prediction towards disease or control?</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-[#0000FF] font-mono font-bold bg-[#B5C7EB]/40 px-1.5 py-0.2 rounded border border-[#B5C7EB]">?</span>
              <span>Are model-ranked genes enriched in known microglial or neuroinflammatory pathways?</span>
            </li>
          </ul>
        </div>

        {/* Right Column: The Solution Card */}
        <div
          className="p-8 rounded-3xl border space-y-6 shadow-md relative overflow-hidden bg-white/95 backdrop-blur-md"
          style={{ borderColor: '#B5C7EB' }}
        >
          <h3 className="text-lg font-bold flex items-center gap-2 text-slate-900">
            <Heart className="w-5 h-5 text-[#0000FF] fill-[#0000FF]" />
            <span>The Explainable AI Continuum</span>
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <div
              className="p-3.5 rounded-xl border flex items-center justify-between font-bold"
              style={{ backgroundColor: 'rgba(181, 199, 235, 0.3)', borderColor: '#B5C7EB', color: '#0000FF' }}
            >
              <span>01. PREDICTION</span>
              <span className="text-[#0000FF]">XGBoost ML Classifier</span>
            </div>
            <div className="flex justify-center text-[#0000FF]">
              <ArrowRight className="w-4 h-4 rotate-90" />
            </div>
            <div
              className="p-3.5 rounded-xl border flex items-center justify-between font-bold"
              style={{ backgroundColor: 'rgba(181, 199, 235, 0.3)', borderColor: '#B5C7EB', color: '#0000FF' }}
            >
              <span>02. EXPLANATION</span>
              <span className="text-[#0000FF]">TreeSHAP Values</span>
            </div>
            <div className="flex justify-center text-[#0000FF]">
              <ArrowRight className="w-4 h-4 rotate-90" />
            </div>
            <div
              className="p-3.5 rounded-xl border flex items-center justify-between font-bold"
              style={{ backgroundColor: 'rgba(181, 199, 235, 0.3)', borderColor: '#B5C7EB', color: '#0000FF' }}
            >
              <span>03. INTERPRETATION</span>
              <span className="text-[#0000FF]">Enrichr Pathways</span>
            </div>
          </div>

          <p className="text-xs leading-relaxed pt-2 border-t text-slate-700 font-medium" style={{ borderColor: '#B5C7EB' }}>
            NeuroLens bridges computational statistics and molecular biology, enabling researchers to translate numerical weights directly into biological pathways.
          </p>
        </div>
      </div>
    </section>
  );
};
