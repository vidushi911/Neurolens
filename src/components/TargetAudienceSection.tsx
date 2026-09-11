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
      desc: 'Learn explainable AI concepts (SHAP) and pathway enrichment through interactive visual tools.'
    }
  ];

  return (
    <section
      className="py-20 px-4 sm:px-6 lg:px-8 border-b"
      style={{ backgroundColor: 'rgba(181, 199, 235, 0.2)', borderColor: '#B5C7EB', color: '#0f172a' }}
    >
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border font-semibold shadow-xs"
            style={{ backgroundColor: '#ffffff', borderColor: '#B5C7EB', color: '#0000FF' }}
          >
            <Heart className="w-3.5 h-3.5 fill-[#0000FF] text-[#0000FF]" />
            <span>Built for Researchers</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold leading-tight" style={{ color: '#0000FF' }}>
            Designed for Bench Scientists
          </h2>

          <p className="text-base font-medium italic text-slate-700">
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
                className="p-6 rounded-2xl border bg-white transition-all duration-200 space-y-3 shadow-sm hover:shadow-md"
                style={{ borderColor: '#B5C7EB' }}
              >
                <div
                  className="p-2.5 rounded-xl w-fit border"
                  style={{ backgroundColor: 'rgba(181, 199, 235, 0.4)', borderColor: '#B5C7EB', color: '#0000FF' }}
                >
                  <Icon className="w-5 h-5 text-[#0000FF]" />
                </div>
                <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                <p className="text-xs leading-relaxed text-slate-600 font-medium">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
