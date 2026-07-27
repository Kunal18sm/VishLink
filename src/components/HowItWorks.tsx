import React from 'react';
import { Sparkles, Layout, Edit3, Share2 } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: 1,
      icon: Sparkles,
      title: 'Choose Wish Occasion',
      description: 'Select Birthday 3D Cake, Anniversary Love Story, or Proposal.'
    },
    {
      number: 2,
      icon: Layout,
      title: 'Pick Web Template',
      description: 'Choose your favorite interactive design & animations.'
    },
    {
      number: 3,
      icon: Edit3,
      title: 'Add Custom Details',
      description: 'Add Names, Personal Message, Photo Memories & Background Song.'
    },
    {
      number: 4,
      icon: Share2,
      title: 'Get & Share Link',
      description: 'Instant custom webpage link generated to share on WhatsApp!'
    }
  ];

  return (
    <section id="how-it-works" className="py-16 bg-white border-t border-slate-100">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Title */}
        <div className="text-center mb-14 space-y-2">
          <span className="text-[#e15b70] text-xs font-bold uppercase tracking-wider bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
            Easy 4-Step Process
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            How Wishing Links Work
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto">
            Create an unforgettable digital wishing surprise for your friends and family in under 60 seconds.
          </p>
        </div>

        {/* 4 Steps Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          
          {steps.map((step, idx) => {
            const IconComponent = step.icon;
            return (
              <div key={step.number} className="relative flex flex-col items-center text-center group">
                
                {/* Dashed connector line between steps for desktop */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] border-b-2 border-dashed border-slate-200 z-0" />
                )}

                {/* Circle Icon Container */}
                <div className="relative mb-5 z-10">
                  <div className="w-20 h-20 rounded-2xl bg-[#fff2f4] border border-rose-100 flex items-center justify-center text-[#e15b70] shadow-xs group-hover:scale-105 group-hover:bg-[#e15b70] group-hover:text-white transition-all duration-300">
                    <IconComponent className="w-9 h-9" />
                  </div>

                  {/* Step Number Badge */}
                  <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#e15b70] text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                    {step.number}
                  </span>
                </div>

                {/* Step Details */}
                <h3 className="font-bold text-slate-900 text-base mt-2">
                  {step.title}
                </h3>
                <p className="text-slate-500 text-xs mt-1.5 max-w-[200px] leading-relaxed">
                  {step.description}
                </p>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
};
