import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const ScientificDisclaimerBanner: React.FC = () => {
  return (
    <div className="bg-slate-100 text-slate-800 border-b border-slate-200 px-4 py-2 text-xs font-mono flex items-center justify-between z-50 sticky top-0">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center w-full flex-wrap">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-sky-100 text-sky-900 font-bold border border-sky-300 text-[10px] uppercase">
          <ShieldAlert className="w-3.5 h-3.5 text-sky-700" />
          Research Prototype
        </span>
        <span className="text-slate-700 text-[11px] font-sans">
          <strong>For Research Use Only (RUO)</strong> — Molecular signatures and in-silico binding scores are research estimates, not clinical diagnosis.
        </span>
      </div>
    </div>
  );
};
