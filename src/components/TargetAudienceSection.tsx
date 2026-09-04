import React from 'react';
import { Microscope, Brain, GraduationCap, FlaskConical, Heart } from 'lucide-react';

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
      desc: 'Perform rapid no-code hypothesis generation, combining XGBoost biomarker prioritization with Enrichr.'
    },
    {
      icon: GraduationCap,
      title: 'Students & Educators',
      desc: 'Learn explainable AI concepts (SHAP) and pathway enrichment through interactive visual diagnostics.'
    }
  ];

  return (
    <section className="py-20 text-white px-4 sm:px-6 lg:px-8 border-b border-blue-800" style={{ backgroundColor: '#0000CD' }}>
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900/80 border border-yellow-300/40 text-yellow-300 text-xs font-mono">
            <Heart className="w-3.5 h-3.5 fill-yellow-300" />
            <span>Built for Researchers</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
            Designed for Bench Scientists
          </h2>

          <p className="text-base text-yellow-300 font-medium italic">
            &ldquo;You shouldn&apos;t need to write Python to explore what a machine-learning model learned from your gene-expression data.&rdquo;
          </p>
        </div>

        {/* 4 Audience Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {audiences.map(item => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-blue-900/60 p-6 rounded-2xl border border-white/20 hover:border-yellow-300/60 transition-all duration-200 space-y-3"
              >
                <div className="p-2.5 rounded-xl bg-blue-900 w-fit text-yellow-300 border border-white/20">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">{item.title}</h3>
                <p className="text-xs text-blue-100 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
