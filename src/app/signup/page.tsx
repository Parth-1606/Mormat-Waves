'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Music, Users, IndianRupee, BarChart3, Check, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function SignupPage() {
    const router = useRouter();
    const { register, loginWithGoogle } = useAuth();
    const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        gender: 'not_specified'
    });

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        try {
            const result = await loginWithGoogle(role);
            if (result.success) {
                // Determine redirect based on role
                if (role === 'seller') {
                    localStorage.setItem('seller_profile', 'true');
                    router.push('/onboarding');
                } else {
                    // Buyers go to buyer dashboard
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Register with role info
            const result = await register(formData.email, formData.password, formData.name, role);

            if (result.success) {
                // Save role specific info
                if (role === 'seller') {
                    localStorage.setItem('seller_profile', 'true'); // Flag as seller
                    // Redirect to onboarding for sellers
                    router.push('/onboarding');
                } else {
                    // Redirect to buyer dashboard for buyers
                    router.push('/buyer-dashboard');
                }
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error('Signup error:', error);
            alert('Something went wrong');
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
                        <h1 className="text-3xl font-bold mb-2">Create an Account</h1>
                        <p className="text-white/60">Join our platform and start {role === 'seller' ? 'selling your beats' : 'your musical journey'}.</p>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                        className="w-full bg-white text-black font-bold py-3 rounded-xl flex items-center justify-center gap-3 mb-8 hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 size={20} className="animate-spin" /> : <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />}
                        {isLoading ? 'Signing in...' : 'Sign up with Google'}
                    </button>

                    <div className="relative mb-8 text-center">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <span className="relative bg-[#111] px-4 text-sm text-white/40">Or sign up with email</span>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                name="name"
                                placeholder="Name*"
                                required
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3.5 focus:border-primary/50 focus:outline-none transition-colors"
                            />
                        </div>

                        <div>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email*"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3.5 focus:border-primary/50 focus:outline-none transition-colors"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Phone Number"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3.5 focus:border-primary/50 focus:outline-none transition-colors"
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="New Password*"
                                required
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-3.5 focus:border-primary/50 focus:outline-none transition-colors"
                            />
                        </div>

                        {/* Gender Selection */}
                        <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-4">
                            <label className="text-sm text-white/60 mb-2 block">Gender*</label>
                            <div className="flex flex-wrap gap-4">
                                {['Male', 'Female', 'Other', 'Not Specified'].map((g) => (
                                    <label key={g} className="flex items-center gap-2 cursor-pointer group">
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.gender === g ? 'border-primary' : 'border-white/20 group-hover:border-white/40'}`}>
                                            {formData.gender === g && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                                        </div>
                                        <input
                                            type="radio"
                                            name="gender"
                                            value={g}
                                            checked={formData.gender === g}
                                            onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                                            className="hidden"
                                        />
                                        <span className="text-sm text-white/80">{g}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Role Toggle */}
                        <div className="flex items-center gap-4 mt-6">
                            <span className="font-bold text-white">Who are you?*</span>
                            <div className="bg-[#0a0a0a] p-1 rounded-lg border border-white/10 flex">
                                <button
                                    type="button"
                                    onClick={() => setRole('buyer')}
                                    className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${role === 'buyer' ? 'bg-primary text-black shadow-lg' : 'text-white/60 hover:text-white'}`}
                                >
                                    Buyer
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('seller')}
                                    className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${role === 'seller' ? 'bg-primary text-black shadow-lg' : 'text-white/60 hover:text-white'}`}
                                >
                                    Seller
                                </button>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 mt-6">
                            <input type="checkbox" id="terms" required className="mt-1 w-4 h-4 rounded border-white/20 bg-transparent text-primary focus:ring-primary" />
                            <label htmlFor="terms" className="text-xs text-white/40 leading-relaxed">
                                I hereby state that I have read and agree to the <a href="#" className="text-primary hover:underline">Terms and Conditions</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-white text-black font-bold text-lg py-4 rounded-xl mt-6 hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isLoading && <Loader2 size={20} className="animate-spin" />}
                            Signup for Free
                        </button>
                    </form>

                    <p className="text-center text-white/40 text-sm mt-6">
                        Already have an account? <Link href="/login" className="text-[#FF6B35] font-bold hover:underline">Login</Link>
                    </p>
                </div>

                {/* Right Side: Info Panel */}
                <div className="hidden md:flex flex-col justify-center px-8 md:px-12 space-y-12">
                    <div>
                        <h1 className="text-5xl lg:text-6xl font-black mb-6 leading-tight">
                            Join <span className="text-primary">Mormat Waves</span>, It is <span className="text-primary">FREE!</span>
                        </h1>
                        <p className="text-xl text-white/60">
                            {role === 'seller'
                                ? 'Sell your music to a global audience and grow your fanbase.'
                                : 'Discover and buy premium beats from top producers worldwide.'}
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <button className="bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors">Pricing & Features</button>
                        <button className="bg-transparent border border-white/20 text-white px-6 py-3 rounded-lg font-bold hover:bg-white/10 transition-colors">Login</button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <Music size={32} className="text-white mb-2" />
                            <h3 className="text-xl font-bold">
                                {role === 'seller' ? 'Sell Your Beats' : 'Explore Library'}
                            </h3>
                            <p className="text-white/40 text-sm leading-relaxed">
                                {role === 'seller'
                                    ? 'Upload your beats and start selling to a worldwide audience.'
                                    : 'Access thousands of high-quality beats for your next hit.'}
                            </p>
                        </div>

                        <div className="space-y-3">
                            <Users size={32} className="text-white mb-2" />
                            <h3 className="text-xl font-bold">Connect with {role === 'seller' ? 'Customers' : 'Producers'}</h3>
                            <p className="text-white/40 text-sm leading-relaxed">
                                {role === 'seller'
                                    ? 'Engage with your customers and build lasting relationships.'
                                    : 'Follow your favorite producers and get updates on new drops.'}
                            </p>
                        </div>

                        <div className="space-y-3">
                            <IndianRupee size={32} className="text-white mb-2" />
                            <h3 className="text-xl font-bold">{role === 'seller' ? 'Earn More' : 'Best Prices'}</h3>
                            <p className="text-white/40 text-sm leading-relaxed">
                                {role === 'seller'
                                    ? 'Maximize your earnings by selling your beats on our platform.'
                                    : 'Get competitive pricing and various licensing options.'}
                            </p>
                        </div>

                        <div className="space-y-3">
                            <BarChart3 size={32} className="text-white mb-2" />
                            <h3 className="text-xl font-bold">{role === 'seller' ? 'Track Performance' : 'Secure Secure'}</h3>
                            <p className="text-white/40 text-sm leading-relaxed">
                                {role === 'seller'
                                    ? 'Monitor your sales, earnings, and other key metrics.'
                                    : 'Safe and secure transactions with multiple payment methods.'}
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
