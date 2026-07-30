import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Marcus Bennett',
    role: 'Proposed to Sophia',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    review: 'She cried tears of happiness when she scanned the QR code attached to her ring box. Hearing our song play while reading my letter made the proposal unforgettable!'
  },
  {
    name: 'Chloe Jenkins',
    role: 'Gifted to Her Best Friend',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    review: 'I created a birthday memory box with voice notes from all 8 of our college friends. The template looked like an award-winning website!'
  },
  {
    name: 'David Harrison Jr.',
    role: '50th Golden Anniversary Gift',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    review: 'My grandparents were amazed when they held their iPad up to the gift tag. Seeing photos from 1976 alongside our voice messages was priceless.'
  }
];

export const TestimonialSection: React.FC = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-neutral-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Loved By Thousands of Gift Givers
          </h2>
          <p className="text-base sm:text-lg text-neutral-400">
            Real stories from people who created unforgettable emotional moments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, idx) => (
            <div key={idx} className="p-8 rounded-3xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-neutral-300 font-serif italic leading-relaxed mb-6">
                  "{item.review}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-neutral-800">
                <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full object-cover border border-neutral-700" />
                <div>
                  <h4 className="text-sm font-bold text-white">{item.name}</h4>
                  <p className="text-xs text-rose-400">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
