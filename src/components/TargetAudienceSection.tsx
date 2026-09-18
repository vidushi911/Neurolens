import React from 'react';
import { Microscope, Brain, GraduationCap, FlaskConical, Users } from 'lucide-react';

export const TargetAudienceSection: React.FC = () => {
  const audiences = [
    {
      icon: Microscope,
      title: 'Bench Biologists',
      desc: 'Explore machine-learning insights directly from experimental microarrays without waiting in bioinformatician queues.'
    },
    {
      icon: Brain,
      title: 'Neuroscience Researchers',
      desc: 'Identify candidate genes influencing Alzheimer\'s progression and validate microglial risk pathways.'
    },
    {
      icon: FlaskConical,
      title: 'Biomedical Scientists',
      desc: 'Perform rapid no-code hypothesis generation, combining machine learning (XGBoost) with biological pathway enrichment (Enrichr).'
    },
    {
      icon: GraduationCap,
      title: 'Students & Educators',
      desc: 'Learn explainable AI concepts (SHAP feature attribution) and 3D molecular docking through interactive visual tools.'
    }
  ];

  return (
    <section
      className="relative py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200 overflow-hidden font-sans"
      style={{ backgroundColor: '#F5F8FC' }}
    >
      <div className="relative z-10 max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border font-bold bg-sky-100 text-sky-900 border-sky-200">
            <Users className="w-3.5 h-3.5 text-sky-700" />
            <span>Built for Researchers</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
            Designed for Bench Scientists &amp; Drug Discovery Teams
          </h2>

          <p className="text-sm font-normal italic text-slate-600">
            &ldquo;You shouldn&apos;t need to write custom Python scripts just to understand what a machine-learning model learned from your gene-expression data.&rdquo;
          </p>
        </div>

        {/* 4 Audience Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {audiences.map(item => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="p-6 rounded-2xl border border-slate-200 bg-white transition-all duration-300 space-y-3 shadow-2xs hover:border-sky-300 hover:shadow-xs"
              >
                <div className="p-2.5 rounded-xl w-fit bg-[#3B5DBF] text-white">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs leading-relaxed text-slate-600 font-normal">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
