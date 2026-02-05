'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Search, MapPin, User, Check, SlidersHorizontal } from 'lucide-react';
import Image from 'next/image';

// Mock Data for Producers
const producersData = [
    {
        id: 1,
        name: 'Kaivalaya o',
        handle: '@kaivalayao',
        location: 'India, IN',
        image: null,
        initials: 'K',
        color: 'bg-indigo-600'
    },
    {
        id: 2,
        name: 'Mark Steven',
        handle: '@markmusic',
        location: 'United States, US',
        image: 'https://images.unsplash.com/photo-1549488497-60dc98ad53ee?w=400&h=400&fit=crop', // Placeholder
        initials: 'MS',
        color: 'bg-purple-600'
    },
    {
        id: 3,
        name: 'Alone Insight',
        handle: '@aloneinsight',
        location: 'India, IN',
        image: null,
        initials: 'A',
        color: 'bg-orange-600'
    },
    {
        id: 4,
        name: 'Vatsal Kumar',
        handle: '@vatsalkumar',
        location: 'India, IN',
        image: null,
        initials: 'V',
        color: 'bg-slate-600'
    },
    {
        id: 5,
        name: 'SpyderForever',
        handle: '@shubhamtambe',
        location: 'India, IN',
        image: 'https://images.unsplash.com/photo-1563539308-41076b3f7f18?w=400&h=400&fit=crop',
        initials: 'S',
        color: 'bg-green-600'
    },
    {
        id: 6,
        name: 'D6theproducer',
        handle: '@d6theproducer',
        location: 'Canada, CA',
        image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&h=400&fit=crop',
        initials: 'DP',
        color: 'bg-blue-600'
    },
    {
        id: 7,
        name: 'ProdByZack',
        handle: '@zackbeats',
        location: 'UK, GB',
        image: null,
        initials: 'P',
        color: 'bg-red-600'
    },
    {
        id: 8,
        name: 'NeonWave',
        handle: '@neonwavemusic',
        location: 'Germany, DE',
        image: null,
        initials: 'N',
        color: 'bg-pink-600'
    }
];

export default function ProducersPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showWithImageOnly, setShowWithImageOnly] = useState(false);

    // Filter producers logic
    const filteredProducers = producersData.filter(producer => {
        const matchesSearch =
            producer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            producer.handle.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesImage = showWithImageOnly ? (producer.image !== null) : true;

        return matchesSearch && matchesImage;
    });

    return (
        <div className="min-h-screen bg-background text-white selection:bg-primary/30">
            <Navbar />

            <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

                {/* Header Section */}
                <div className="text-center space-y-4 mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        Find Music Producers & Audio Engineers
                    </h1>
                    <p className="text-white/60 max-w-3xl mx-auto text-lg">
                        Explore talented music producers and audio engineers on Mormat Waves, offering their high-quality beats and versatile styles. From hip-hop to drill, trap, and more, find the perfect match for your music needs.
                    </p>
                </div>

                {/* Search & Filter Section */}
                <div className="max-w-2xl mx-auto space-y-4 mb-16">
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Search Producers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl py-4 pl-6 pr-14 text-white placeholder:text-white/40 outline-none focus:border-white/20 transition-all hover:bg-white/5"
                        />
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                            <Search size={20} />
                        </button>
                    </div>

                    <div className="flex items-center justify-center gap-2">
                        <button
                            onClick={() => setShowWithImageOnly(!showWithImageOnly)}
                            className={`flex items-center gap-2 text-sm transition-colors ${showWithImageOnly ? 'text-white' : 'text-white/60 hover:text-white'}`}
                        >
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${showWithImageOnly ? 'bg-white border-white' : 'border-white/20 bg-transparent'}`}>
                                {showWithImageOnly && <Check size={14} className="text-black" />}
                            </div>
                            Show only profiles with image
                        </button>
                    </div>
                </div>

                {/* Producers Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredProducers.map((producer) => (
                        <div
                            key={producer.id}
                            className="group bg-[#111] hover:bg-[#161616] border border-white/5 hover:border-white/10 rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1"
                        >
                            {/* Avatar */}
                            <div className="mb-4 relative">
                                <div className={`w-24 h-24 rounded-full overflow-hidden flex items-center justify-center text-3xl font-bold border-4 border-[#1a1a1a] ${producer.image ? 'bg-black' : producer.color}`}>
                                    {producer.image ? (
                                        <Image
                                            src={producer.image}
                                            alt={producer.name}
                                            width={96}
                                            height={96}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span>{producer.initials}</span>
                                    )}
                                </div>
                            </div>

                            {/* Info */}
                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors cursor-pointer">
                                {producer.name}
                            </h3>
                            <p className="text-sm text-white/40 mb-3 hover:text-white/60 transition-colors cursor-pointer">
                                {producer.handle}
                            </p>

                            <div className="flex items-center gap-1.5 text-xs text-white/30 uppercase tracking-wider mb-6">
                                <MapPin size={12} />
                                {producer.location}
                            </div>

                            {/* Follow Button */}
                            <button className="w-full py-2.5 bg-white text-black font-bold rounded-lg hover:bg-primary hover:text-white transition-colors duration-300 text-sm">
                                Follow
                            </button>
                        </div>
                    ))}
                </div>

                {filteredProducers.length === 0 && (
                    <div className="text-center py-20">
                        <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <User size={32} className="text-white/20" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No producers found</h3>
                        <p className="text-white/40">Try adjusting your search criteria</p>
                    </div>
                )}

            </main>

            <Footer />
        </div>
    );
}
