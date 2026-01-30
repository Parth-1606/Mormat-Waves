'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
    User, Bell, Shield, Wallet, Monitor, HelpCircle,
    ChevronRight, Camera, Mail, Lock
} from 'lucide-react';

export default function SettingsPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('account');

    // Redirect if not authenticated
    React.useEffect(() => {
        if (!isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) return null;

    const tabs = [
        { id: 'account', label: 'Account', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'privacy', label: 'Privacy & Security', icon: Shield },
        { id: 'billing', label: 'Billing', icon: Wallet },
        { id: 'display', label: 'Display', icon: Monitor },
        { id: 'help', label: 'Help & Support', icon: HelpCircle },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <Navbar />

            <main className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold mb-8">Settings</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="lg:w-64 flex-shrink-0">
                        <div className="space-y-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                                            ? 'bg-indigo-600/10 text-indigo-400'
                                            : 'text-white/60 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <tab.icon size={18} />
                                    {tab.label}
                                    {activeTab === tab.id && <ChevronRight size={14} className="ml-auto" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 bg-[#1a1a1a] border border-white/5 rounded-2xl p-6 md:p-8">
                        {activeTab === 'account' && (
                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-xl font-bold mb-1">Profile Details</h2>
                                    <p className="text-white/40 text-sm">Manage your public profile information.</p>
                                </div>

                                {/* Avatar */}
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center relative group cursor-pointer overflow-hidden">
                                        <User size={32} className="text-white/20" />
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Camera size={20} />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Profile Photo</h3>
                                        <p className="text-xs text-white/40 mt-1 mb-3">Recommended 400x400px</p>
                                        <div className="flex gap-3">
                                            <button className="px-4 py-1.5 bg-white/10 hover:bg-white/20 rounded-full text-xs font-medium transition-colors">
                                                Change
                                            </button>
                                            <button className="px-4 py-1.5 text-red-400 hover:bg-red-400/10 rounded-full text-xs font-medium transition-colors">
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Form */}
                                <div className="grid gap-6 max-w-xl">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-white/60">First Name</label>
                                            <input type="text" defaultValue="Parth" className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:border-indigo-500/50 outline-none transition-colors" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-white/60">Last Name</label>
                                            <input type="text" defaultValue="Pawar" className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:border-indigo-500/50 outline-none transition-colors" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-white/60">Email Address</label>
                                        <div className="relative">
                                            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                                            <input type="email" defaultValue={user?.email || ''} className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:border-indigo-500/50 outline-none transition-colors" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-white/60">Username</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm">@</span>
                                            <input type="text" defaultValue="parthpawar" className="w-full bg-black/40 border border-white/10 rounded-lg pl-8 pr-4 py-2.5 text-sm focus:border-indigo-500/50 outline-none transition-colors" />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-white/5 flex justify-end">
                                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="text-center py-20">
                                <Bell size={48} className="mx-auto text-white/20 mb-4" />
                                <h3 className="text-xl font-bold mb-2">Notifications</h3>
                                <p className="text-white/40">Manage how you receive notifications.</p>
                            </div>
                        )}
                        {/* Placeholders for other tabs */}
                        {!['account', 'notifications'].includes(activeTab) && (
                            <div className="text-center py-20">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                    {React.createElement(tabs.find(t => t.id === activeTab)?.icon || HelpCircle, { size: 32, className: 'text-white/20' })}
                                </div>
                                <h3 className="text-xl font-bold mb-2">Coming Soon</h3>
                                <p className="text-white/40">This section is currently under development.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
