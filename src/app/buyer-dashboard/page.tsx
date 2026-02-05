'use client';

import React, { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
    Music, Heart, ShoppingBag, TrendingUp, Download,
    Bell, ShoppingCart, User, LogOut, Settings,
    CreditCard, ChevronDown, Play, Clock, Star
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useCart } from '@/contexts/CartContext';

export default function BuyerDashboardPage() {
    const { user, isAuthenticated, logout } = useAuth();
    const router = useRouter();
    const { favorites } = useFavorites();
    const { getItemCount } = useCart();
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const profileDropdownRef = useRef<HTMLDivElement>(null);
    const notificationRef = useRef<HTMLDivElement>(null);

    useClickOutside(profileDropdownRef as React.RefObject<HTMLElement>, () => setShowProfileDropdown(false));
    useClickOutside(notificationRef as React.RefObject<HTMLElement>, () => setShowNotifications(false));

    // Check if user is authenticated and is a buyer
    React.useEffect(() => {
        if (!isAuthenticated) {
            router.push('/');
            return;
        }

        // Check if user is a seller - prioritize user.role over legacy localStorage
        let isSeller = false;
        if (user?.role) {
            // User has a role defined - use it (this is the source of truth)
            isSeller = user.role === 'seller';
        } else {
            // No role defined - check legacy localStorage flag
            const isSellerLegacy = typeof window !== 'undefined' && localStorage.getItem('seller_profile');
            isSeller = !!isSellerLegacy;
        }

        if (isSeller) {
            // Sellers should go to seller dashboard
            router.push('/dashboard');
        }
    }, [isAuthenticated, user, router]);

    if (!isAuthenticated) {
        return null;
    }

    // Also return null if user is a seller (while redirecting)
    let isSellerCheck = false;
    if (user?.role) {
        isSellerCheck = user.role === 'seller';
    } else {
        const isSellerLegacy = typeof window !== 'undefined' && localStorage.getItem('seller_profile');
        isSellerCheck = !!isSellerLegacy;
    }
    const isSeller = isSellerCheck;

    if (isSeller) {
        return null;
    }

    // Mock data for buyer dashboard
    const recentPurchases = [
        { id: 1, title: 'Dark Trap Beat', producer: 'Metro Beats', price: 499, date: '2 days ago', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=100&h=100&fit=crop' },
        { id: 2, title: 'Chill Lofi Vibes', producer: 'LofiMaster', price: 299, date: '1 week ago', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop' },
        { id: 3, title: 'Drill Type Beat', producer: 'UK Drill Pro', price: 599, date: '2 weeks ago', image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=100&h=100&fit=crop' },
    ];

    const recommendedBeats = [
        { id: 1, title: 'Hard Trap Beat', producer: 'TrapKing', price: 449, plays: '12K', image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=200&h=200&fit=crop' },
        { id: 2, title: 'Melodic R&B', producer: 'SoulBeats', price: 399, plays: '8K', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&h=200&fit=crop' },
        { id: 3, title: 'Boom Bap Classic', producer: 'OldSchool', price: 349, plays: '15K', image: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=200&h=200&fit=crop' },
    ];

    return (
        <div className="min-h-screen bg-background text-white">
            {/* Top Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5 px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="relative w-8 h-8">
                            <Image
                                src="/logo.png"
                                alt="Mormat Waves"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="text-xl font-bold tracking-tight">Mormat Waves</span>
                    </Link>

                    <div className="hidden md:flex items-center bg-white/5 rounded-full px-4 py-1.5 border border-white/10 w-[400px]">
                        <input
                            type="text"
                            placeholder="Search beats"
                            className="bg-transparent flex-1 outline-none text-sm placeholder:text-white/20"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    <div className="relative" ref={notificationRef}>
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative"
                        >
                            <Bell size={20} className="text-white/60 hover:text-white" />
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                        </button>

                        {showNotifications && (
                            <div className="absolute top-full right-0 mt-2 w-80 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden">
                                <div className="p-3 border-b border-white/5 flex justify-between items-center">
                                    <span className="text-sm font-bold">Notifications</span>
                                    <button className="text-xs text-primary hover:text-primary/80">Mark all read</button>
                                </div>
                                <div className="max-h-80 overflow-y-auto">
                                    <div className="p-4 hover:bg-white/5 transition-colors border-b border-white/5 cursor-pointer">
                                        <div className="flex gap-3">
                                            <div className="w-10 h-10 rounded bg-red-500/20 flex items-center justify-center shrink-0">
                                                <span className="text-red-500 font-bold">!</span>
                                            </div>
                                            <div>
                                                <p className="text-sm text-white/90 leading-tight mb-1">
                                                    The beat <span className="font-bold">Fire Track</span> was deleted by the producer.
                                                </p>
                                                <p className="text-xs text-white/40">From your favorites • 2h ago</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 hover:bg-white/5 transition-colors cursor-pointer">
                                        <div className="flex gap-3">
                                            <div className="w-10 h-10 rounded bg-green-500/20 flex items-center justify-center shrink-0">
                                                <span className="text-green-500 font-bold">$</span>
                                            </div>
                                            <div>
                                                <p className="text-sm text-white/90 leading-tight mb-1">
                                                    Special Offer: Get 30% off sound kits
                                                </p>
                                                <p className="text-xs text-white/40">Limited time • 1h ago</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <Link href="/favorites" className="relative">
                        <Heart size={20} className="text-white/60 hover:text-primary transition-colors" />
                        {favorites.length > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-xs text-secondary font-bold">
                                {favorites.length}
                            </span>
                        )}
                    </Link>

                    <Link href="/cart" className="relative">
                        <ShoppingCart size={20} className="text-white/60 hover:text-white" />
                        {getItemCount() > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-xs text-secondary font-bold">
                                {getItemCount()}
                            </span>
                        )}
                    </Link>

                    <div className="relative" ref={profileDropdownRef}>
                        <button
                            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center overflow-hidden hover:bg-white/20 transition-colors"
                        >
                            <User size={18} />
                        </button>

                        {showProfileDropdown && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden">
                                {/* Account Type Badge */}
                                <div className="p-3 border-b border-white/5 bg-white/5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-white/60">Account Type</span>
                                        <span className="text-xs font-bold px-2 py-1 rounded bg-blue-500/20 text-blue-400">
                                            ♥ BUYER
                                        </span>
                                    </div>
                                </div>

                                <div className="p-2 border-b border-white/5">
                                    <p className="text-xs text-white/40 px-3 py-1">Account</p>
                                    <Link href="/profile" className="flex items-center gap-2 px-3 py-2 text-sm text-white/80 hover:bg-white/5 rounded-md transition-colors">
                                        <User size={14} /> Profile
                                    </Link>
                                    <Link href="/settings" className="flex items-center gap-2 px-3 py-2 text-sm text-white/80 hover:bg-white/5 rounded-md transition-colors">
                                        <Settings size={14} /> Settings
                                    </Link>
                                </div>
                                <div className="p-2 border-b border-white/5">
                                    <p className="text-xs text-white/40 px-3 py-1">Purchases</p>
                                    <Link href="/purchases" className="flex items-center gap-2 px-3 py-2 text-sm text-white/80 hover:bg-white/5 rounded-md transition-colors">
                                        <ShoppingBag size={14} /> My Purchases
                                    </Link>
                                </div>
                                <div className="p-2">
                                    <button
                                        onClick={logout}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-md transition-colors text-left"
                                    >
                                        <LogOut size={14} /> Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Secondary Navigation */}
            <nav className="fixed top-16 left-0 right-0 z-40 bg-background/60 backdrop-blur-sm border-b border-white/5 px-4 h-12 flex items-center gap-8">
                <Link href="/buyer-dashboard" className="text-sm font-medium text-white border-b-2 border-primary pb-3">
                    DASHBOARD
                </Link>
                <Link href="/purchases" className="text-sm font-medium text-white/60 hover:text-white transition-colors">
                    MY PURCHASES
                </Link>
                <Link href="/favorites" className="text-sm font-medium text-white/60 hover:text-white transition-colors">
                    FAVORITES
                </Link>
                <Link href="/" className="text-sm font-medium text-white/60 hover:text-white transition-colors">
                    BROWSE BEATS
                </Link>
            </nav>

            <main className="pt-28 px-4 md:px-8 pb-20">
                <div className="max-w-7xl mx-auto">
                    {/* Welcome Section */}
                    <div className="mb-12">
                        <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name}!</h1>
                        <p className="text-white/60">Here's what's happening with your music collection</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                        <div className="bg-card border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors">
                            <div className="flex items-center gap-3 mb-4">
                                <ShoppingBag size={24} className="text-primary" />
                                <span className="text-white/60">Total Purchases</span>
                            </div>
                            <div className="text-3xl font-bold">3</div>
                        </div>

                        <div className="bg-card border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors">
                            <div className="flex items-center gap-3 mb-4">
                                <Heart size={24} className="text-red-400" />
                                <span className="text-white/60">Favorites</span>
                            </div>
                            <div className="text-3xl font-bold">{favorites.length}</div>
                        </div>

                        <div className="bg-card border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors">
                            <div className="flex items-center gap-3 mb-4">
                                <Download size={24} className="text-green-400" />
                                <span className="text-white/60">Downloads</span>
                            </div>
                            <div className="text-3xl font-bold">3</div>
                        </div>

                        <div className="bg-card border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors">
                            <div className="flex items-center gap-3 mb-4">
                                <Music size={24} className="text-blue-400" />
                                <span className="text-white/60">Playlists</span>
                            </div>
                            <div className="text-3xl font-bold">2</div>
                        </div>
                    </div>

                    {/* Recent Purchases */}
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold">Recent Purchases</h2>
                            <Link href="/purchases" className="text-primary text-sm font-medium hover:underline">
                                View All
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {recentPurchases.map((purchase) => (
                                <div key={purchase.id} className="bg-card border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors flex items-center gap-4">
                                    <img src={purchase.image} alt={purchase.title} className="w-16 h-16 rounded-lg object-cover" />
                                    <div className="flex-1">
                                        <h3 className="font-bold text-white mb-1">{purchase.title}</h3>
                                        <p className="text-sm text-white/60">by {purchase.producer}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-primary">₹{purchase.price}</p>
                                        <p className="text-xs text-white/40">{purchase.date}</p>
                                    </div>
                                    <button className="bg-primary/20 hover:bg-primary/30 text-primary px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                                        <Download size={16} />
                                        Download
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recommended Beats */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold">Recommended For You</h2>
                            <Link href="/" className="text-primary text-sm font-medium hover:underline">
                                Browse All
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {recommendedBeats.map((beat) => (
                                <div key={beat.id} className="bg-card border border-white/10 rounded-xl overflow-hidden hover:border-primary/50 transition-all group">
                                    <div className="relative h-48">
                                        <img src={beat.image} alt={beat.title} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button className="w-12 h-12 rounded-full bg-primary flex items-center justify-center hover:scale-110 transition-transform">
                                                <Play size={20} className="text-black ml-1" />
                                            </button>
                                        </div>
                                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full text-xs flex items-center gap-1">
                                            <Play size={12} />
                                            {beat.plays}
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-white mb-1">{beat.title}</h3>
                                        <p className="text-sm text-white/60 mb-3">by {beat.producer}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-primary font-bold">₹{beat.price}</span>
                                            <button className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors">
                                                <Heart size={16} className="text-white/60" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
