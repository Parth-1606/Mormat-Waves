'use client';

import React from 'react';
import { ChevronRight, Music, Users } from 'lucide-react';
import { useSearch } from '@/contexts/SearchContext';
import Link from 'next/link';

const Hero = () => {
  const { setCategory } = useSearch();

  const handleBrowse = () => {
    const beatsSection = document.getElementById('beats');
    if (beatsSection) {
      beatsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center pt-24 pb-16 px-4 overflow-hidden">
      {/* Animated Perspective Grid Background */}
      <div
        className="absolute inset-0 z-0 animate-in-fade"
        style={{
          backgroundImage: `linear-gradient(to right, #ff6b00 1px, transparent 1px), linear-gradient(to bottom, #ff6b00 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)',
          transform: 'perspective(1000px) rotateX(60deg) translateY(-100px) scale(2)',
          opacity: 0.2, // Base opacity for when animation finishes
        }}
      />

      {/* Floating Particles/Stars with Animation */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none animate-in-scale" />

      <div className="relative z-10 max-w-5xl w-full text-center space-y-8">
        <div className="space-y-4">
          {/* Welcome Text */}
          <h2 className="text-xl md:text-2xl font-medium tracking-widest text-primary uppercase animate-in-up delay-100">
            Welcome to Waves by Mormat
          </h2>

          {/* Main Title with Scale Animation */}
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase drop-shadow-2xl animate-in-up delay-200">
            Beast for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400 inline-block">
              Beats!
            </span>
          </h1>

          {/* Description */}
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/60 leading-relaxed animate-in-up delay-300">
            Buy premium-quality beats at affordable prices—anywhere in the world.
            Pay securely with UPI and other payment methods.
            Choose INR or USD with clear, transparent pricing.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4 animate-in-up delay-400">
          <button
            onClick={handleBrowse}
            className="group relative px-8 py-4 bg-primary text-black font-black text-lg uppercase tracking-wider rounded-none hover:bg-orange-400 transition-all clip-path-slant min-w-[200px] hover:scale-105 active:scale-95 duration-200"
            style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 80%, 90% 100%, 0 100%, 0 20%)' }}
          >
            <span className="flex items-center justify-center gap-2">
              Browse Beats <Music size={20} />
            </span>
          </button>

          <Link href="/producers">
            <button
              className="group relative px-8 py-4 bg-transparent text-white font-black text-lg uppercase tracking-wider rounded-none border border-white/20 hover:border-primary hover:text-primary transition-all min-w-[200px] hover:scale-105 active:scale-95 duration-200"
              style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 80%, 90% 100%, 0 100%, 0 20%)' }}
            >
              <span className="flex items-center justify-center gap-2">
                View Producers <Users size={20} />
              </span>
            </button>
          </Link>
        </div>

        {/* Stats / Social Proof */}
        <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center border-t border-white/5 mt-12">
          {[
            { label: 'Beats Uploaded', value: '5,000+' },
            { label: 'Producers', value: '1,200+' },
            { label: 'Happy Artists', value: '15k+' },
            { label: 'Countries', value: '50+' },
          ].map((stat, i) => (
            <div
              key={i}
              className={`space-y-1 hover:scale-110 transition-transform duration-300 animate-in-up delay-${500 + i * 100}`}
            >
              <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-xs md:text-sm text-white/40 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
