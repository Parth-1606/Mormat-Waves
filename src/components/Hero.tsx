'use client';

import React, { useState, useRef } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { useClickOutside } from '@/hooks/useClickOutside';

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('General');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All Beats');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setShowCategoryDropdown(false));

  const categories = ['General', 'Hip-Hop', 'Pop', 'R&B', 'Electronic', 'Rock', 'Jazz'];
  const filters = ['All Beats', 'Beats Playlists', 'New Finds'];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery, 'in category:', category, 'filter:', activeFilter);
    // Add your search logic here
  };

  const handleCategorySelect = (cat: string) => {
    setCategory(cat);
    setShowCategoryDropdown(false);
  };

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    console.log('Filter changed to:', filter);
    // Add filter logic here
  };

  return (
    <section className="relative min-h-[70vh] flex flex-col items-center justify-center pt-24 pb-16 px-4 overflow-hidden">
      {/* Perspective Grid Background */}
      <div 
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(to right, #4f46e5 1px, transparent 1px), linear-gradient(to bottom, #4f46e5 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)',
          transform: 'perspective(1000px) rotateX(60deg) translateY(-100px) scale(2)',
        }}
      />
      
      {/* Floating Particles/Stars */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-4xl w-full text-center space-y-8">
        <div className="space-y-2">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white uppercase italic">
            Your Next Hit Awaits!
          </h2>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white uppercase flex items-center justify-center gap-4">
            Start Exploring <span className="text-fuchsia-500 inline-flex items-center gap-2 italic">Beats <span className="text-3xl not-italic opacity-50">|||</span></span> Now
          </h1>
        </div>

        <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex items-center bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden px-4 focus-within:border-indigo-500/50 transition-colors relative">
            <input 
              type="text" 
              placeholder="Search top beats" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent flex-1 py-4 outline-none text-lg"
            />
            <div className="h-6 w-[1px] bg-white/10 mx-4" />
            <div className="relative" ref={dropdownRef}>
              <button 
                type="button"
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
              >
                {category} <ChevronDown size={18} />
              </button>
              {showCategoryDropdown && (
                <div className="absolute top-full right-0 mt-2 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl min-w-[150px] z-50">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategorySelect(cat)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors ${
                        cat === category ? 'text-indigo-400' : 'text-white/60'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <button 
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {filters.map((tag) => (
            <button 
              key={tag}
              onClick={() => handleFilterClick(tag)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === tag
                  ? 'bg-indigo-600 text-white border border-indigo-500'
                  : 'bg-[#1a1a1a] border border-white/5 text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
