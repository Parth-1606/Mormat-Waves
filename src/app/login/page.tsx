'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Music, Users, IndianRupee, BarChart3, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
    const router = useRouter();
    const { login, loginWithGoogle } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await login(formData.email, formData.password);

            if (result.success) {
                // Check if user is a seller
                const isSeller = localStorage.getItem('seller_profile');
                if (isSeller) {
                    router.push('/dashboard');
                } else {
                    router.push('/buyer-dashboard');
                }
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        try {
            const result = await loginWithGoogle();
            if (result.success) {
                // Check if user is a seller
                const isSeller = localStorage.getItem('seller_profile');
                if (isSeller) {
                    router.push('/dashboard');
                } else {
                    router.push('/buyer-dashboard');
                }
            } else {
                alert(result.error);
            }
        } catch (error: any) {
            console.error('Google Sign-in error:', error);
            alert(`Google Sign-in Error: ${error?.message || error}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4">
            <div className="max-w-[1200px] w-full grid md:grid-cols-2 gap-8 items-stretch">

                {/* Left Side: Form */}
                <div className="bg-[#111] border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                        <p className="text-white/60">Sign in to continue your musical journey.</p>
                    </div>

                    <button
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                        className="w-full bg-white text-black font-bold py-3 rounded-xl flex items-center justify-center gap-3 mb-8 hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 size={20} className="animate-spin" /> : <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />}
                        {isLoading ? 'Signing in...' : 'Sign in with Google'}
                    </button>

                    <div className="relative mb-8 text-center">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <span className="relative bg-[#111] px-4 text-sm text-white/40">Or sign in with email</span>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email*"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3.5 focus:border-[#FF6B35]/50 focus:outline-none transition-colors placeholder:text-white/40"
                            />
                        </div>

                        <div>
                            <input
                                type="password"
                                name="password"
                                placeholder="Password*"
                                required
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3.5 focus:border-[#FF6B35]/50 focus:outline-none transition-colors placeholder:text-white/40"
                            />
                        </div>

                        <div className="flex justify-end">
                            <Link href="/forgot-password" className="text-sm text-white/40 hover:text-[#FF6B35] transition-colors">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-white text-black font-bold text-lg py-4 rounded-xl mt-6 hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isLoading && <Loader2 size={20} className="animate-spin" />}
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <p className="text-center text-white/40 text-sm mt-6">
                        Don't have an account? <Link href="/signup" className="text-[#FF6B35] font-bold hover:underline">Sign up</Link>
                    </p>
                </div>

                {/* Right Side: Info Panel */}
                <div className="hidden md:flex flex-col justify-center px-8 md:px-12 space-y-12">
                    <div>
                        <h1 className="text-5xl lg:text-6xl font-black mb-6 leading-tight">
                            Welcome to <span className="text-[#FF6B35]">Mormat Waves</span>
                        </h1>
                        <p className="text-xl text-white/60">
                            Your gateway to premium beats and global music connections.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <Music size={32} className="text-white mb-2" />
                            <h3 className="text-xl font-bold">Premium Beats</h3>
                            <p className="text-white/40 text-sm leading-relaxed">
                                Access thousands of high-quality beats for your next hit.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <Users size={32} className="text-white mb-2" />
                            <h3 className="text-xl font-bold">Global Community</h3>
                            <p className="text-white/40 text-sm leading-relaxed">
                                Connect with producers and artists from around the world.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <IndianRupee size={32} className="text-white mb-2" />
                            <h3 className="text-xl font-bold">Best Prices</h3>
                            <p className="text-white/40 text-sm leading-relaxed">
                                Get competitive pricing and various licensing options.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <BarChart3 size={32} className="text-white mb-2" />
                            <h3 className="text-xl font-bold">Secure Trading</h3>
                            <p className="text-white/40 text-sm leading-relaxed">
                                Safe and secure transactions with multiple payment methods.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
