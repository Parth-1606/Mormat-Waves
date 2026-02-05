'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import { Check, Star, Zap, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PlansPage() {
    const router = useRouter();

    const handleSelectPlan = (planName: string) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('user_current_plan', planName);
        }
        router.push('/dashboard');
    };

    const plans = [
        {
            name: 'Free',
            price: '$0',
            period: '/month',
            description: 'Perfect for getting started',
            features: [
                '5 Beat Uploads',
                'Basic Analytics',
                '70% Sales Commission',
                'Standard Support'
            ],
            highlight: false,
            buttonText: 'Current Plan'
        },
        {
            name: 'Pro',
            price: '$19.99',
            period: '/month',
            description: 'For serious producers growing their brand',
            features: [
                'Unlimited Uploads',
                'Advanced Analytics',
                '100% Sales Commission',
                'Priority Support',
                'Custom Storefront',
                'Instant Payouts'
            ],
            highlight: true,
            buttonText: 'Upgrade to Pro'
        },
        {
            name: 'Agency',
            price: '$49.99',
            period: '/month',
            description: 'Maximum power for labels and teams',
            features: [
                'Everything in Pro',
                'Team Management',
                'White-label Player',
                'API Access',
                'Dedicated Manager',
                'Legal Templates'
            ],
            highlight: false,
            buttonText: 'Contact Sales'
        }
    ];

    return (
        <div className="min-h-screen bg-background text-white selection:bg-primary/30">
            <Navbar />

            <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/60">
                        Choose your plan
                    </h1>
                    <p className="text-xl text-white/40">
                        Unlock the full potential of Mormat Waves with our flexible pricing plans designed for producers of all levels.
                    </p>
                </div>

                <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 relative z-10">
                    {/* Background Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full -z-10" />

                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative rounded-3xl p-8 border backdrop-blur-sm transition-transform hover:-translate-y-2 duration-300 ${plan.highlight
                                ? 'bg-white/10 border-primary/50 shadow-2xl shadow-primary/10'
                                : 'bg-card/80 border-white/10 hover:border-white/20'
                                }`}
                        >
                            {plan.highlight && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-orange-400 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                                <p className="text-white/40 text-sm mb-6 h-10">{plan.description}</p>
                                <div className="flex items-baseline">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    <span className="text-white/40 ml-1 text-sm">{plan.period}</span>
                                </div>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-3 text-sm text-white/80">
                                        <div className={`mt-0.5 rounded-full p-0.5 ${plan.highlight ? 'bg-primary' : 'bg-white/20'}`}>
                                            <Check size={10} className="text-white" />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleSelectPlan(plan.name)}
                                className={`w-full py-3 rounded-xl font-medium transition-all ${plan.highlight
                                    ? 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25'
                                    : 'bg-white/10 hover:bg-white/20 text-white'
                                    }`}
                            >
                                {plan.buttonText}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="max-w-4xl mx-auto mt-24 bg-card border border-white/5 rounded-2xl p-8 md:p-12">
                    <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-orange-400 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <Shield size={32} className="text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold mb-2">Secure & Reliable</h3>
                            <p className="text-white/40 mb-0">
                                All payments are processed securely via Stripe. You can cancel your subscription at any time. No hidden fees.
                            </p>
                        </div>
                        <button className="text-white/60 hover:text-white font-medium border-b border-white/20 hover:border-white pb-0.5 transition-all">
                            Contact Support
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
