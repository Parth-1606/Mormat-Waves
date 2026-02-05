'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import { useCart } from '@/contexts/CartContext';
import { Play, Pause, ShoppingCart, Heart, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function FavoritesPage() {
    const { favorites, toggleFavorite } = useFavorites();
    const { playBeat, currentBeat, isPlaying } = useAudioPlayer();
    const { addToCart, isInCart, removeFromCart } = useCart();

    const handlePlayClick = (e: React.MouseEvent, beat: any) => {
        e.stopPropagation();
        playBeat(beat);
    };

    return (
        <div className="min-h-screen bg-background text-white selection:bg-primary/30">
            <Navbar />

            <main className="pt-24 pb-20 px-4 max-w-7xl mx-auto min-h-[60vh]">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Heart className="text-primary fill-primary" />
                        Your Favorites
                    </h1>
                    <p className="text-white/60 mt-2">Manage your liked beats and save them for later.</p>
                </div>

                {favorites.length === 0 ? (
                    <div className="text-center py-20 bg-[#111] rounded-2xl border border-white/5">
                        <Heart size={48} className="mx-auto text-white/20 mb-4" />
                        <h2 className="text-xl font-bold mb-2">No favorites yet</h2>
                        <p className="text-white/40 mb-6">Start exploring beats and add them to your collection.</p>
                        <Link href="/" className="bg-primary text-black px-6 py-3 rounded-full font-bold hover:bg-orange-600 transition-colors">
                            Browse Beats
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {favorites.map((beat) => (
                            <div
                                key={beat.id}
                                className="group flex items-center gap-4 p-4 bg-[#111] border border-white/5 hover:border-white/10 rounded-xl transition-all"
                            >
                                {/* Image & Play */}
                                <div
                                    className="relative w-16 h-16 flex-shrink-0 cursor-pointer rounded-lg overflow-hidden"
                                    onClick={(e) => handlePlayClick(e, beat)}
                                >
                                    <img src={beat.image} alt={beat.title} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        {currentBeat?.id === beat.id && isPlaying ? (
                                            <Pause size={24} className="text-white" />
                                        ) : (
                                            <Play size={24} className="text-white ml-1" />
                                        )}
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-lg truncate text-white">{beat.title}</h3>
                                    <p className="text-sm text-white/60 truncate">{beat.producer} • {beat.bpm} • {beat.key}</p>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => toggleFavorite(beat)}
                                        className="p-2 text-primary hover:bg-white/5 rounded-full transition-colors"
                                        title="Remove from favorites"
                                    >
                                        <Heart className="fill-primary" size={20} />
                                    </button>

                                    {isInCart(beat.id) ? (
                                        <button
                                            onClick={() => removeFromCart(beat.id)}
                                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 whitespace-nowrap"
                                        >
                                            <Trash2 size={16} /> Remove
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => addToCart({ ...beat, price: beat.price.toString() })}
                                            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 whitespace-nowrap"
                                        >
                                            <ShoppingCart size={16} /> Add to Cart
                                        </button>
                                    )}

                                    <div className="font-bold text-primary min-w-[60px] text-right">
                                        ₹{beat.price}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
