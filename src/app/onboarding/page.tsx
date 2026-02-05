'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { User, Music, FileText, ArrowRight, ShieldCheck } from 'lucide-react';

export default function OnboardingPage() {
    const { user, completeOnboarding } = useAuth();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        artistName: '',
        bio: '',
        genres: [] as string[],
        role: 'producer', // producer, artist, label
    });

    const handleGenreToggle = (genre: string) => {
        setFormData(prev => ({
            ...prev,
            genres: prev.genres.includes(genre)
                ? prev.genres.filter(g => g !== genre)
                : [...prev.genres, genre]
        }));
    };

    // Redirect buyers away from onboarding
    React.useEffect(() => {
        if (user && user.role === 'buyer') {
            router.push('/buyer-dashboard');
        }
    }, [user, router]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (step < 3) {
            setStep(step + 1);
            return;
        }

        // Complete onboarding
        await completeOnboarding(formData);
        router.push('/dashboard');
    };

    const genres = ['Hip Hop', 'Trap', 'R&B', 'Pop', 'Electronic', 'Rock', 'Lofi', 'Drill'];

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-600/10 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-2xl w-full bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 md:p-12 relative z-10 animate-slide-up">
                {/* Progress Bar */}
                <div className="flex items-center gap-2 mb-8">
                    {[1, 2, 3].map((s) => (
                        <div
                            key={s}
                            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${s <= step ? 'bg-primary' : 'bg-white/10'
                                }`}
                        />
                    ))}
                </div>

                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold mb-2">Welcome to Mormat Waves</h1>
                    <p className="text-white/60">Let's set up your artist profile to get you started.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {step === 1 && (
                        <div className="space-y-6 animate-fade-in">
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-2">
                                    What should we call you?
                                </label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                                    <input
                                        type="text"
                                        required
                                        value={formData.artistName}
                                        onChange={(e) => setFormData({ ...formData, artistName: e.target.value })}
                                        placeholder="Artist / Producer Name"
                                        className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder:text-white/30 focus:border-primary focus:outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-2">
                                    What's your primary role?
                                </label>
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { id: 'producer', label: 'Producer' },
                                        { id: 'artist', label: 'Artist' },
                                        { id: 'label', label: 'Label' },
                                    ].map((role) => (
                                        <button
                                            key={role.id}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, role: role.id })}
                                            className={`py-3 rounded-xl border transition-all ${formData.role === role.id
                                                ? 'bg-primary/20 border-primary text-white'
                                                : 'bg-black/20 border-white/10 text-white/60 hover:bg-white/5'
                                                }`}
                                        >
                                            {role.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-fade-in">
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-4">
                                    What genres do you specialize in?
                                </label>
                                <div className="flex flex-wrap gap-3">
                                    {genres.map((genre) => (
                                        <button
                                            key={genre}
                                            type="button"
                                            onClick={() => handleGenreToggle(genre)}
                                            className={`px-4 py-2 rounded-full border text-sm transition-all ${formData.genres.includes(genre)
                                                ? 'bg-primary text-black border-primary font-medium'
                                                : 'bg-black/20 border-white/10 text-white/60 hover:border-white/20'
                                                }`}
                                        >
                                            {genre}
                                        </button>
                                    ))}
                                </div>
                                {formData.genres.length === 0 && (
                                    <p className="text-red-400 text-xs mt-2">* Please select at least one genre</p>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-fade-in">
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-2">
                                    Tell us a bit about yourself (Bio)
                                </label>
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    placeholder="I've been making beats since..."
                                    rows={4}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-white/30 focus:border-primary focus:outline-none transition-colors resize-none"
                                />
                            </div>

                            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex gap-3">
                                <ShieldCheck className="text-primary shrink-0" size={24} />
                                <div>
                                    <h4 className="font-bold text-sm text-primary mb-1">Verify your identity later</h4>
                                    <p className="text-xs text-primary/80">
                                        You can verify your identity in settings later to unlock Pro features and withdrawals.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 flex items-center justify-between">
                        {step > 1 ? (
                            <button
                                type="button"
                                onClick={() => setStep(step - 1)}
                                className="text-white/60 hover:text-white px-4 py-2 text-sm font-medium transition-colors"
                            >
                                Back
                            </button>
                        ) : (
                            <div />
                        )}

                        <button
                            type="submit"
                            disabled={step === 2 && formData.genres.length === 0}
                            className="bg-primary hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-black px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 group"
                        >
                            {step === 3 ? 'Complete Setup' : 'Continue'}
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
