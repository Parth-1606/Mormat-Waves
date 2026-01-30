'use client';

import React from 'react';
import { ChevronRight, BadgeCheck } from 'lucide-react';

const playlists = [
  { id: 1, title: 'For Hip-Hop Artists', followers: '430', beats: '333', image: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=400' },
  { id: 2, title: 'For Pop Artists', followers: '198', beats: '388', image: 'https://images.unsplash.com/photo-1514525253361-bee87184919a?auto=format&fit=crop&q=80&w=400' },
  { id: 3, title: 'For RnB Artists', followers: '115', beats: '105', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=400' },
  { id: 4, title: 'For Alternative Hip-Hop Art', followers: '121', beats: '1.7k', image: 'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?auto=format&fit=crop&q=80&w=400' },
  { id: 5, title: 'Experimental Stuff', followers: '74', beats: '118', image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=400' },
];

const Playlists = () => {
  const handlePlaylistClick = (playlist: typeof playlists[0]) => {
    console.log('Playlist clicked:', playlist.title);
    // Add navigation to playlist page logic here
  };

  const handleSeeAll = () => {
    console.log('See All playlists clicked');
    // Add navigation logic here
  };

  return (
    <section id="sound-kits" className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          Sound <span className="text-indigo-400">Kits</span>
        </h2>
        <button
          onClick={handleSeeAll}
          className="flex items-center gap-1 text-sm text-white/60 hover:text-white transition-colors border border-white/10 px-4 py-1.5 rounded-full hover:border-indigo-500/50"
        >
          See All <ChevronRight size={16} />
        </button>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            onClick={() => handlePlaylistClick(playlist)}
            className="min-w-[280px] group cursor-pointer active:scale-[0.98] transition-transform"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden mb-4">
              <img
                src={playlist.image}
                alt={playlist.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-xl font-bold text-white leading-tight uppercase">{playlist.title}</h3>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-white/40 font-medium">
                {playlist.followers} Followers - {playlist.beats} Beats
              </p>
              <h4 className="font-bold text-white line-clamp-1">{playlist.title}</h4>
              <div className="flex items-center gap-1 text-xs text-white/60">
                <span>Beat22</span>
                <BadgeCheck size={14} className="text-indigo-400" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Playlists;
