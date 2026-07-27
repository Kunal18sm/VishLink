import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { TESTIMONIALS } from '../data/mockData';
import whyHamperImg from '../assets/images/why_vishlink_hamper_1785132294091.jpg';

export const TestimonialsSlider: React.FC = () => {
  const [activeDot, setActiveDot] = useState(0);

  const handlePrev = () => {
    setActiveDot(prev => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveDot(prev => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-16 bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            What Our Customers Say
          </h2>
        </div>

        {/* Slider & Right Image Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Slider Cards Column */}
          <div className="lg:col-span-9 relative px-2 md:px-8">
            
            {/* Navigation Arrows */}
            <button
              onClick={handlePrev}
              aria-label="Previous testimonial"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-700 hover:text-[#e15b70] hover:border-[#e15b70] transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={handleNext}
              aria-label="Next testimonial"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-700 hover:text-[#e15b70] hover:border-[#e15b70] transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Testimonials Grid / Track */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {TESTIMONIALS.map((test, index) => (
                <div
                  key={test.id}
                  className={`bg-[#fff8f7] border rounded-2xl p-6 shadow-xs transition-all duration-300 flex flex-col justify-between ${
                    index === activeDot ? 'border-rose-300 ring-2 ring-rose-100 shadow-md bg-white' : 'border-rose-100/60'
                  }`}
                >
                  <div>
                    {/* Stars */}
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(test.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="text-slate-700 text-xs leading-relaxed italic font-medium">
                      {test.quote}
                    </p>
                  </div>

                  {/* Customer Avatar & Name */}
                  <div className="flex items-center gap-3 mt-6 pt-4 border-t border-rose-100/80">
                    <img
                      src={test.avatar}
                      alt={test.author}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover border border-rose-200"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        {test.author}
                      </h4>
                      {test.role && (
                        <p className="text-[10px] text-slate-400">{test.role}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Dots */}
            <div className="flex items-center justify-center gap-2 mt-8">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveDot(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    activeDot === i ? 'w-6 bg-[#0d1222]' : 'w-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>

          </div>

          {/* Right Floating Gift Box */}
          <div className="lg:col-span-3 flex justify-center">
            <div className="w-full max-w-[220px] aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border-2 border-white relative group">
              <img
                src={whyHamperImg}
                alt="VishLink Customer Delight"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
