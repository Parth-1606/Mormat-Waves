'use client';

import React, { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
  Music, FileText, Hammer, IndianRupee,
  TrendingUp, Upload, BarChart3, Users,
  Bell, ShoppingCart, Zap, User, Check,
  LogOut, Settings, CreditCard, ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useClickOutside } from '@/hooks/useClickOutside';

export default function DashboardPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'stats' | 'analytics' | 'leads'>('stats');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(profileDropdownRef as React.RefObject<HTMLElement>, () => setShowProfileDropdown(false));

  // Check if user is authenticated and onboarded
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    } else {
      // Check if user is a seller - prioritize user.role over legacy localStorage
      // If user.role is explicitly set, use it. Otherwise fall back to localStorage
      let isSeller = false;
      if (user?.role) {
        // User has a role defined - use it (this is the source of truth)
        isSeller = user.role === 'seller';
      } else {
        // No role defined - check legacy localStorage flag
        const isSellerLegacy = typeof window !== 'undefined' && localStorage.getItem('seller_profile');
        isSeller = !!isSellerLegacy;
      }

      if (!isSeller) {
        // Buyers don't have access to seller dashboard
        router.push('/buyer-dashboard');
        return;
      }

      if (user && !user.isOnboarded) {
        router.push('/onboarding');
      } else {
        // Check for plan
        if (typeof window !== 'undefined') {
          const plan = localStorage.getItem('user_current_plan');
          if (plan) {
            setSelectedPlan(plan);
          }
          setIsLoading(false);
        }
      }
    }
  }, [isAuthenticated, user, router]);

  const handleSelectPlan = (planName: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_current_plan', planName);
    }
    setSelectedPlan(planName);
  };

  if (!isAuthenticated || isLoading) {
    return null;
  }

  // Also return null if user is not a seller (while redirecting)
  let isSellerCheck = false;
  if (user?.role) {
    isSellerCheck = user.role === 'seller';
  } else {
    const isSellerLegacy = typeof window !== 'undefined' && localStorage.getItem('seller_profile');
    isSellerCheck = !!isSellerLegacy;
  }
  const isSeller = isSellerCheck;

  if (!isSeller) {
    return null;
  }

  // Plan Selection UI
  if (!selectedPlan) {
    return (
      <div className="min-h-screen bg-background text-white pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/60">
            Select Your Plan
          </h1>
          <p className="text-xl text-white/40">
            Choose a plan to access your dashboard features.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <div className="bg-card border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all cursor-pointer group" onClick={() => handleSelectPlan('Free')}>
            <h3 className="text-2xl font-bold mb-2">Free</h3>
            <p className="text-white/40 mb-6">Perfect for starters</p>
            <div className="text-4xl font-bold mb-8">$0<span className="text-sm text-white/40 font-normal">/mo</span></div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3 text-sm text-white/80"><Check size={16} className="text-primary" /> 5 Beat Uploads</li>
              <li className="flex items-center gap-3 text-sm text-white/80"><Check size={16} className="text-primary" /> Basic Analytics</li>
              <li className="flex items-center gap-3 text-sm text-white/80"><Check size={16} className="text-primary" /> Standard Support</li>
            </ul>
            <button className="w-full py-3 bg-white/10 rounded-xl font-medium group-hover:bg-white/20 transition-all">Select Free</button>
          </div>

          {/* Pro Plan */}
          <div className="bg-card border border-primary/50 rounded-3xl p-8 relative hover:-translate-y-2 transition-transform duration-300 cursor-pointer shadow-2xl shadow-primary/10" onClick={() => handleSelectPlan('Pro')}>
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-secondary text-xs font-bold px-4 py-1 rounded-full uppercase">Most Popular</div>
            <h3 className="text-2xl font-bold mb-2">Pro</h3>
            <p className="text-white/40 mb-6">For serious producers</p>
            <div className="text-4xl font-bold mb-8">$19.99<span className="text-sm text-white/40 font-normal">/mo</span></div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3 text-sm text-white/80"><Check size={16} className="text-primary" /> Unlimited Uploads</li>
              <li className="flex items-center gap-3 text-sm text-white/80"><Check size={16} className="text-primary" /> Advanced Analytics</li>
              <li className="flex items-center gap-3 text-sm text-white/80"><Check size={16} className="text-primary" /> 100% Sales Commission</li>
              <li className="flex items-center gap-3 text-sm text-white/80"><Check size={16} className="text-primary" /> Priority Support</li>
            </ul>
            <button className="w-full py-3 bg-primary text-secondary rounded-xl font-bold hover:bg-primary/90 transition-all">Select Pro</button>
          </div>

          {/* Agency Plan */}
          <div className="bg-card border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all cursor-pointer group" onClick={() => handleSelectPlan('Agency')}>
            <h3 className="text-2xl font-bold mb-2">Agency</h3>
            <p className="text-white/40 mb-6">For teams & labels</p>
            <div className="text-4xl font-bold mb-8">$49.99<span className="text-sm text-white/40 font-normal">/mo</span></div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3 text-sm text-white/80"><Check size={16} className="text-primary" /> Everything in Pro</li>
              <li className="flex items-center gap-3 text-sm text-white/80"><Check size={16} className="text-primary" /> Team Management</li>
              <li className="flex items-center gap-3 text-sm text-white/80"><Check size={16} className="text-primary" /> API Access</li>
            </ul>
            <button className="w-full py-3 bg-white/10 rounded-xl font-medium group-hover:bg-white/20 transition-all">Select Agency</button>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Stats Logic based on Plan
  const isPro = selectedPlan === 'Pro' || selectedPlan === 'Agency';

  const stats = {
    activeBeats: isPro ? 48 : 5,
    maxBeats: isPro ? 'Unlimited' : 5,
    totalOrders: isPro ? 124 : 2,
    beatsSold: isPro ? 86 : 1,
    totalEarnings: isPro ? 12450 : 150,
  };

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
              placeholder="Search top beats"
              className="bg-transparent flex-1 outline-none text-sm placeholder:text-white/20"
            />
            <div className="h-4 w-[1px] bg-white/20 mx-3" />
            <button className="flex items-center gap-1 text-xs text-white/60 hover:text-white transition-colors">
              General
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative">
            <Bell size={20} className="text-white/60 hover:text-white" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full text-sm hover:bg-white/10 transition-colors" onClick={() => setSelectedPlan(null)}>
            <Zap size={16} className="text-primary" />
            <span>{selectedPlan}</span>
            <span className="text-white/60">{isPro ? '★' : '0'}</span>
          </button>
          <Link href="/cart" className="relative">
            <ShoppingCart size={20} className="text-white/60 hover:text-white" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-xs text-secondary font-bold">0</span>
          </Link>
          <Link href="/upload">
            <button className="bg-primary hover:bg-primary/90 text-secondary px-4 py-2 rounded-full text-sm font-bold relative transition-colors shadow-lg shadow-primary/20">
              <span className="absolute -top-2 -right-2 bg-white text-black text-[8px] px-1.5 py-0.5 rounded uppercase font-extrabold">NEW</span>
              <span className="flex items-center gap-2">
                <Upload size={16} />
                Upload
              </span>
            </button>
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
                    <span className="text-xs font-bold px-2 py-1 rounded bg-primary/20 text-primary">
                      ★ SELLER
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
                  <p className="text-xs text-white/40 px-3 py-1">Billing</p>
                  <Link href="/plans" className="flex items-center gap-2 px-3 py-2 text-sm text-white/80 hover:bg-white/5 rounded-md transition-colors">
                    <CreditCard size={14} /> Plans & Billing
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
        <Link href="/dashboard" className="text-sm font-medium text-white border-b-2 border-primary pb-3">
          DASHBOARD
        </Link>
        <Link href="/dashboard/beats" className="text-sm font-medium text-white/60 hover:text-white transition-colors">
          BEATS
        </Link>
        <Link href="/dashboard/sound-kits" className="text-sm font-medium text-white/60 hover:text-white transition-colors flex items-center gap-2">
          SOUND KITS
          <span className="bg-primary/20 text-primary text-[10px] px-1.5 py-0.5 rounded uppercase flex items-center gap-1">
            <span>★</span> NEW
          </span>
        </Link>
        <Link href="/" className="text-sm font-medium text-white/60 hover:text-white transition-colors">
          BROWSE
        </Link>
      </nav>

      <main className="pt-28 px-4 md:px-8 pb-20">
        {/* PRO Plan Promo Section - Only show if NOT Pro */}
        {!isPro && (
          <div className="max-w-7xl mx-auto mb-12 grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-white/5 to-white/5 border border-white/10 rounded-2xl p-8 relative overflow-hidden group hover:border-primary/50 transition-colors">
              <div className="absolute top-0 right-0 p-32 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
              <h2 className="text-3xl font-bold mb-4 relative z-10">
                Kick start your music career with{' '}
                <span className="text-primary inline-flex items-center gap-2">
                  PRO Plan <span className="text-2xl">★</span>
                </span>{' '}
                today
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
                {[
                  'Unlimited Beat Uploads',
                  'Advanced Analytical Insights',
                  'Retain 100% Sales',
                  'Lead Generation',
                  'Negotiations',
                  'Golden Verification',
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => handleSelectPlan('Pro')}
                className="bg-primary hover:bg-primary/90 text-secondary px-6 py-3 rounded-lg font-bold transition-all relative z-10"
              >
                Get Started with PRO
              </button>
            </div>
            <div className="hidden md:block">
              <div className="w-full h-full bg-card border border-white/10 rounded-2xl overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                <img
                  src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800"
                  alt="Stage"
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex gap-4 border-b border-white/10">
            {[
              { id: 'stats', label: 'Basic Stats', locked: false },
              { id: 'analytics', label: 'Analytics', locked: !isPro },
              { id: 'leads', label: 'Lead Generation', locked: !isPro },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => !tab.locked && setActiveTab(tab.id as any)}
                className={`px-6 py-3 font-medium transition-colors flex items-center gap-2 ${activeTab === tab.id
                  ? 'text-white border-b-2 border-primary'
                  : tab.locked
                    ? 'text-white/30 cursor-not-allowed'
                    : 'text-white/60 hover:text-white'
                  }`}
              >
                {tab.label}
                {tab.locked && <span className="text-xs bg-white/10 px-1.5 py-0.5 rounded text-white/40">LOCKED</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'stats' && (
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 uppercase tracking-wide">
              {isPro ? 'Pro Dashboard' : 'Basic Stats'}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-card border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <Music size={24} className="text-primary" />
                  <span className="text-white/60">Active Beats</span>
                </div>
                <div className="text-3xl font-bold mb-2">
                  {stats.activeBeats} / {stats.maxBeats}
                </div>
                {!isPro && <p className="text-sm text-primary cursor-pointer hover:underline" onClick={() => handleSelectPlan('Pro')}>Upgrade to Unlimited</p>}
              </div>

              <div className="bg-card border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <FileText size={24} className="text-primary" />
                  <span className="text-white/60">Total Orders</span>
                </div>
                <div className="text-3xl font-bold">{stats.totalOrders}</div>
              </div>

              <div className="bg-card border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <Hammer size={24} className="text-primary" />
                  <span className="text-white/60">Beats Sold</span>
                </div>
                <div className="text-3xl font-bold">{stats.beatsSold}</div>
              </div>

              <div className="bg-card border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <IndianRupee size={24} className="text-green-400" />
                  <span className="text-white/60">Total Earnings</span>
                </div>
                <div className="text-3xl font-bold text-green-400">₹{stats.totalEarnings}</div>
              </div>
            </div>

            {/* Subscribe to PRO Section - Only if Free */}
            {!isPro && (
              <div className="bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 rounded-xl p-12 text-center backdrop-blur-sm relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-xl mb-6 text-white/90 font-medium">
                    Subscribe to PRO to access more features and grow your sales
                  </p>
                  <button
                    onClick={() => handleSelectPlan('Pro')}
                    className="bg-primary hover:bg-primary/90 text-secondary px-8 py-3 rounded-lg font-bold shadow-lg shadow-primary/20 transition-all"
                  >
                    Upgrade to PRO
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Pro Content */}
        {activeTab === 'analytics' && isPro && (
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">ANALYTICS</h1>
            <div className="grid grid-cols-2 gap-8">
              <div className="bg-card border border-white/10 rounded-xl p-8 h-80 flex flex-col justify-center items-center text-center">
                <BarChart3 size={48} className="text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Revenue Growth</h3>
                <p className="text-white/40">Your revenue is up 24% this month!</p>
              </div>
              <div className="bg-card border border-white/10 rounded-xl p-8 h-80 flex flex-col justify-center items-center text-center">
                <Users size={48} className="text-blue-400 mb-4" />
                <h3 className="text-xl font-bold mb-2">Visitor Traffic</h3>
                <p className="text-white/40">1,240 unique visitors this week.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'leads' && isPro && (
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">LEAD GENERATION</h1>
            <div className="bg-card border border-white/10 rounded-xl p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold">Recent Leads</h3>
                <button className="text-primary text-sm font-bold">Export CSV</button>
              </div>
              <div className="space-y-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">U</div>
                      <div>
                        <p className="font-bold">User {i}</p>
                        <p className="text-xs text-white/40">user{i}@example.com</p>
                      </div>
                    </div>
                    <span className="text-sm text-green-400">Interested</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard Section */}
        <div className="max-w-7xl mx-auto mt-12">
          <h1 className="text-4xl font-bold mb-8">LEADERBOARD</h1>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card border border-white/10 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">TOP STREAMING</h3>
              <div className="flex gap-2 mb-4">
                {['7D', '30D', '90D'].map((period) => (
                  <button
                    key={period}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${period === '90D'
                      ? 'bg-primary text-secondary font-bold'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                      }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
              <p className="text-primary mb-2">Data unavailable!</p>
              <p className="text-white/60 text-sm">
                Next steps: Upload more beats to increase your reach and visibility.
              </p>
            </div>

            <div className="bg-card border border-white/10 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">UPLOADED BEATS</h3>
              <p className="text-primary mb-4">You have not uploaded any beats yet!</p>
              <Link href="/upload">
                <button className="bg-primary hover:bg-primary/90 text-secondary px-6 py-2 rounded-lg font-bold">
                  Upload now!
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
