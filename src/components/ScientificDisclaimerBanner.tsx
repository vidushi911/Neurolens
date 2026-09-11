import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';

export const ScientificDisclaimerBanner: React.FC = () => {
  return (
    <div className="bg-slate-950 text-slate-200 border-b border-amber-500/30 px-4 py-2 text-xs font-mono flex items-center justify-between z-50 sticky top-0 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center w-full flex-wrap">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 text-[10px] uppercase">
          <ShieldAlert className="w-3.5 h-3.5" />
          Research Prototype
        </span>
        <span className="text-slate-300 text-[11px]">
          <strong>For Research Use Only (RUO)</strong> — Outputs represent AD-associated molecular expression signatures, not clinical diagnosis.
        </span>
      </div>
    </div>
  );
};
