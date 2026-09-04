import React, { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';

interface HelpTooltipProps {
  term: 'xgboost' | 'shap' | 'pathway' | 'geo' | 'fold_change';
  children?: React.ReactNode;
}

const GLOSSARY: Record<string, { title: string; explanation: string }> = {
  xgboost: {
    title: 'What is XGBoost?',
    explanation: 'A machine-learning method used here to distinguish Alzheimer\'s and healthy samples based on gene-expression patterns.'
  },
  shap: {
    title: 'What is SHAP?',
    explanation: 'A method that helps us understand which genes influenced the model\'s prediction. Positive values push toward Alzheimer\'s, negative values push toward Healthy.'
  },
  pathway: {
    title: 'What is Pathway Enrichment?',
    explanation: 'A way of checking whether important genes identified by the model are concentrated in particular biological processes (like neuroinflammation or amyloid clearing).'
  },
  geo: {
    title: 'What is GEO?',
    explanation: 'NCBI Gene Expression Omnibus — a public repository where biomedical researchers share gene microarray and RNA sequencing data worldwide.'
  },
  fold_change: {
    title: 'What is Fold Change?',
    explanation: 'A ratio comparing average gene expression in Alzheimer\'s samples versus healthy controls.'
  }
};

export const HelpTooltip: React.FC<HelpTooltipProps> = ({ term, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const info = GLOSSARY[term] || GLOSSARY.shap;

  return (
    <span className="inline-flex items-center gap-1 relative">
      {children}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-0.5 rounded-full text-slate-400 hover:text-cyan-600 hover:bg-slate-100 transition-colors focus:outline-none"
        title="Click for plain-language explanation"
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-slate-900 text-white p-3 rounded-xl shadow-2xl text-xs z-50 animate-fade-in border border-slate-700">
          <div className="flex items-center justify-between border-b border-slate-700 pb-1 mb-1.5">
            <span className="font-bold text-cyan-400 text-[11px] font-mono">{info.title}</span>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
              <X className="w-3 h-3" />
            </button>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed font-sans">{info.explanation}</p>
        </div>
      )}
    </span>
  );
};
