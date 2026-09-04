import React from 'react';
import { HelpCircle, CheckCircle2, Heart, ArrowRight } from 'lucide-react';

export const WhyExistsSection: React.FC = () => {
  return (
    <section className="py-20 text-white px-4 sm:px-6 lg:px-8 border-b border-blue-800" style={{ backgroundColor: '#0000CD' }}>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Column: The Problem */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/80 border border-red-300/40 text-red-200 text-xs font-mono">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Beyond Black-Box Predictions</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
            Classification without explanation is incomplete science.
          </h2>

          <p className="text-sm text-blue-100 leading-relaxed">
            Machine-learning models can achieve high accuracy classifying Alzheimer&apos;s samples, but predictions alone do not tell researchers:
          </p>

          <ul className="space-y-3 text-xs text-blue-100">
            <li className="flex items-start gap-2.5">
              <span className="text-yellow-300 font-mono font-bold">?</span>
              <span>Which exact genes drove the model to classify a sample as Alzheimer&apos;s?</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-yellow-300 font-mono font-bold">?</span>
              <span>Did an upregulated gene push the prediction towards disease or health?</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-yellow-300 font-mono font-bold">?</span>
              <span>Are model-ranked genes enriched in known neuroinflammatory pathways?</span>
            </li>
          </ul>
        </div>

        {/* Right Column: The Solution */}
        <div className="bg-blue-900/80 p-6 sm:p-8 rounded-3xl border border-white/30 space-y-6 shadow-2xl relative overflow-hidden">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-yellow-300 fill-yellow-300" />
            <span>The Human Research Continuum</span>
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-blue-950/80 border border-white/20 flex items-center justify-between text-white">
              <span>01. PREDICTION</span>
              <span className="text-yellow-300 font-semibold">XGBoost Classifier</span>
            </div>
            <div className="flex justify-center text-blue-200">
              <ArrowRight className="w-4 h-4 rotate-90" />
            </div>
            <div className="p-3.5 rounded-xl bg-blue-950/80 border border-white/20 flex items-center justify-between text-white">
              <span>02. EXPLANATION</span>
              <span className="text-red-300 font-semibold">TreeSHAP Values</span>
            </div>
            <div className="flex justify-center text-blue-200">
              <ArrowRight className="w-4 h-4 rotate-90" />
            </div>
            <div className="p-3.5 rounded-xl bg-blue-950/80 border border-white/20 flex items-center justify-between text-white">
              <span>03. INTERPRETATION</span>
              <span className="text-emerald-300 font-semibold">Enrichr Pathways</span>
            </div>
          </div>

          <p className="text-xs text-blue-100 leading-relaxed pt-2 border-t border-blue-700">
            NeuroLens bridges computational statistics and molecular biology, enabling researchers to translate numerical weights directly into biological pathways.
          </p>
        </div>
      </div>
    </section>
  );
};
