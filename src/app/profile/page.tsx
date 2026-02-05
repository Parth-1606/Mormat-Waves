'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import { User, MapPin, Calendar, Music, Heart, Share2, Edit3, Camera, Save, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import MilestoneSection from '@/components/profile/MilestoneSection';
import VerifyIdentitySection from '@/components/profile/VerifyIdentitySection';

export default function ProfilePage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    const [isEditing, setIsEditing] = React.useState(false);
    const [bio, setBio] = React.useState('Music producer and sound designer based in Los Angeles. Creating waves with every beat.');
    const [location, setLocation] = React.useState('Los Angeles, CA');
    const [displayName, setDisplayName] = React.useState(''); // Will init with user name

    // Mock total spent for milestones demo
    const totalSpent = 6500;

    // Redirect if not authenticated
    React.useEffect(() => {
        if (!isAuthenticated) {
            router.push('/');
        } else if (user?.name) {
            setDisplayName(user.name);
        }
    }, [isAuthenticated, router, user]);

    if (!isAuthenticated) return null;

    const handleSaveProfile = () => {
        // Here you would typically attempt to save to backend
        setIsEditing(false);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <Navbar />

            <main className="pt-20 pb-20">
                {/* Profile Header */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative mb-20">
                        {/* Cover Image */}
                        <div className="h-64 md:h-80 w-full rounded-2xl bg-gradient-to-r from-orange-900 via-red-900 to-orange-900 overflow-hidden relative group">
                            <div className="absolute inset-0 bg-black/20" />
                            {isEditing && (
                                <button className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="flex items-center gap-2 bg-black/60 px-4 py-2 rounded-full backdrop-blur-sm">
                                        <Camera size={20} />
                                        <span>Change Cover</span>
                                    </div>
                                </button>
                            )}
                        </div>

                        {/* Avatar & Info */}
                        <div className="absolute -bottom-12 left-8 md:bottom-auto md:top-full md:-mt-16 flex items-end gap-6">
                            <div className="relative">
                                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#0a0a0a] bg-[#1a1a1a] flex items-center justify-center relative z-10 overflow-hidden group">
                                    <User size={64} className="text-white/20" />
                                    {isEditing && (
                                        <button className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                            <Camera size={24} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="mb-2 md:mb-16 z-10 flex-1">
                                {isEditing ? (
                                    <div className="flex flex-col gap-2 bg-[#1a1a1a]/80 p-2 rounded-lg backdrop-blur-md border border-white/10">
                                        <input
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            className="bg-transparent text-2xl font-bold border-b border-white/20 focus:border-orange-500 outline-none pb-1"
                                            placeholder="Display Name"
                                        />
                                        <p className="text-white/60 text-lg">@{user?.email?.split('@')[0] || 'username'}</p>
                                    </div>
                                ) : (
                                    <>
                                        <h1 className="text-3xl font-bold">{displayName || user?.name || 'User'}</h1>
                                        <p className="text-white/60 text-lg">@{user?.email?.split('@')[0] || 'username'}</p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="absolute top-full mt-4 right-0 md:top-full md:-mt-14 flex gap-3">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-full font-medium transition-colors flex items-center gap-2 border border-red-500/20"
                                    >
                                        <X size={16} />
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveProfile}
                                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-medium transition-colors flex items-center gap-2 shadow-lg shadow-green-600/20"
                                    >
                                        <Save size={16} />
                                        Save Changes
                                    </button>
                                </>
                            ) : (
                                <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2 rounded-full font-medium transition-colors flex items-center gap-2">
                                    <Share2 size={16} />
                                    Share
                                </button>
                            )}

                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-full font-medium transition-colors flex items-center gap-2"
                                >
                                    <Edit3 size={16} />
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-24 md:mt-12">
                        {/* Left Column: Info */}
                        <div className="space-y-6">
                            <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6">
                                <h3 className="text-lg font-bold mb-4">About</h3>
                                {isEditing ? (
                                    <div className="space-y-4">
                                        <textarea
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-orange-500 outline-none resize-none h-32"
                                            placeholder="Tell us about yourself..."
                                        />
                                        <div className="flex items-center gap-2 bg-black/20 border border-white/10 rounded-lg p-2">
                                            <MapPin size={16} className="text-white/40" />
                                            <input
                                                value={location}
                                                onChange={(e) => setLocation(e.target.value)}
                                                className="bg-transparent text-sm w-full outline-none"
                                                placeholder="Location"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-white/60 text-sm leading-relaxed mb-6">
                                            {bio}
                                        </p>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 text-white/60 text-sm">
                                                <MapPin size={16} />
                                                <span>{location}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-white/60 text-sm">
                                                <Calendar size={16} />
                                                <span>Joined January 2026</span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6">
                                <h3 className="text-lg font-bold mb-4">Stats</h3>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div className="p-3 bg-white/5 rounded-xl">
                                        <div className="text-xl font-bold text-orange-400">12</div>
                                        <div className="text-xs text-white/40">Tracks</div>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-xl">
                                        <div className="text-xl font-bold text-red-400">1.2k</div>
                                        <div className="text-xs text-white/40">Followers</div>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-xl">
                                        <div className="text-xl font-bold text-orange-400">85</div>
                                        <div className="text-xs text-white/40">Following</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Content */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* NEW SECTIONS */}
                            <MilestoneSection totalSpent={totalSpent} />
                            <VerifyIdentitySection />

                            <div className="space-y-6">
                                {/* Tabs */}
                                <div className="flex gap-6 border-b border-white/10 pb-4">
                                    <button className="text-white font-medium border-b-2 border-orange-500 pb-4 -mb-4.5">Tracks</button>
                                    <button className="text-white/60 hover:text-white transition-colors">Albums</button>
                                    <button className="text-white/60 hover:text-white transition-colors">Playlists</button>
                                    <button className="text-white/60 hover:text-white transition-colors">Likes</button>
                                </div>

                                {/* Empty State for now */}
                                <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                        <Music size={32} className="text-white/20" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">No tracks yet</h3>
                                    <p className="text-white/40 max-w-sm mb-6">
                                        Upload your first track to get started and share your music with the world.
                                    </p>
                                    <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-full font-medium transition-colors">
                                        Upload Track
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
