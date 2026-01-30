'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
  Music, FileText, Hammer, IndianRupee,
  TrendingUp, Upload, BarChart3, Users,
  Bell, ShoppingCart, Zap, User
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'stats' | 'analytics' | 'leads'>('stats');

  // Check if user is authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  // Mock stats data
  const stats = {
    activeBeats: 0,
    maxBeats: 20,
    totalOrders: 0,
    beatsSold: 0,
    totalEarnings: 0,
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5 px-4 h-16 flex items-center justify-between">
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
              className="bg-transparent flex-1 outline-none text-sm"
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
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full text-sm">
            <Zap size={16} className="text-yellow-400" />
            <span>Basic</span>
            <span className="text-white/60">0</span>
          </button>
          <Link href="/cart" className="relative">
            <ShoppingCart size={20} className="text-white/60 hover:text-white" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-xs">0</span>
          </Link>
          <Link href="/upload">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full text-sm font-medium relative">
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[8px] px-1.5 py-0.5 rounded uppercase">NEW</span>
              <span className="flex items-center gap-2">
                <Upload size={16} />
                Upload
              </span>
            </button>
          </Link>
          <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <User size={18} />
          </button>
        </div>
      </nav>

      {/* Secondary Navigation */}
      <nav className="fixed top-16 left-0 right-0 z-40 bg-[#0a0a0a]/60 backdrop-blur-sm border-b border-white/5 px-4 h-12 flex items-center gap-8">
        <Link href="/dashboard" className="text-sm font-medium text-white border-b-2 border-indigo-500 pb-3">
          DASHBOARD
        </Link>
        <Link href="/dashboard/beats" className="text-sm font-medium text-white/60 hover:text-white transition-colors">
          BEATS
        </Link>
        <Link href="/dashboard/sound-kits" className="text-sm font-medium text-white/60 hover:text-white transition-colors flex items-center gap-2">
          SOUND KITS
          <span className="bg-purple-500/20 text-purple-400 text-[10px] px-1.5 py-0.5 rounded uppercase flex items-center gap-1">
            <span>★</span> NEW
          </span>
        </Link>
        <Link href="/" className="text-sm font-medium text-white/60 hover:text-white transition-colors">
          BROWSE
        </Link>
      </nav>

      <main className="pt-28 px-4 md:px-8 pb-20">
        {/* PRO Plan Promo Section */}
        <div className="max-w-7xl mx-auto mb-12 grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">
              Kick start your music career with{' '}
              <span className="text-orange-400 inline-flex items-center gap-2">
                PRO Plan <span className="text-2xl">★</span>
              </span>{' '}
              today
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
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
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium">
              Get Started with PRO
            </button>
          </div>
          <div className="hidden md:block">
            <div className="w-full h-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=800"
                alt="Music Studio"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex gap-4 border-b border-white/10">
            {[
              { id: 'stats', label: 'Basic Stats' },
              { id: 'analytics', label: 'Analytics' },
              { id: 'leads', label: 'Lead Generation' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 font-medium transition-colors ${activeTab === tab.id
                    ? 'text-white border-b-2 border-indigo-500'
                    : 'text-white/60 hover:text-white'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'stats' && (
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">BASIC STATS</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Music size={24} className="text-indigo-400" />
                  <span className="text-white/60">Active Beats</span>
                </div>
                <div className="text-3xl font-bold mb-2">
                  {stats.activeBeats} / {stats.maxBeats}
                </div>
                <p className="text-sm text-white/40">Upgrade to PRO</p>
              </div>

              <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FileText size={24} className="text-indigo-400" />
                  <span className="text-white/60">Total Orders</span>
                </div>
                <div className="text-3xl font-bold">{stats.totalOrders}</div>
              </div>

              <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Hammer size={24} className="text-indigo-400" />
                  <span className="text-white/60">Beats Sold</span>
                </div>
                <div className="text-3xl font-bold">{stats.beatsSold}</div>
              </div>

              <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <IndianRupee size={24} className="text-green-400" />
                  <span className="text-white/60">Total Earnings</span>
                </div>
                <div className="text-3xl font-bold text-green-400">₹{stats.totalEarnings}</div>
              </div>
            </div>

            {/* Subscribe to PRO Section */}
            <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-xl p-12 text-center backdrop-blur-sm">
              <p className="text-xl mb-6 text-white/80">
                Subscribe to PRO to access more features and grow your sales
              </p>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium">
                Upgrade to PRO
              </button>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">ANALYTICS</h1>
            <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-12 text-center">
              <BarChart3 size={64} className="mx-auto mb-4 text-white/20" />
              <p className="text-white/60">Analytics data will appear here</p>
            </div>
          </div>
        )}

        {activeTab === 'leads' && (
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">LEAD GENERATION</h1>
            <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-12 text-center">
              <Users size={64} className="mx-auto mb-4 text-white/20" />
              <p className="text-white/60">Lead generation data will appear here</p>
            </div>
          </div>
        )}

        {/* Leaderboard Section */}
        <div className="max-w-7xl mx-auto mt-12">
          <h1 className="text-4xl font-bold mb-8">LEADERBOARD</h1>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">TOP STREAMING</h3>
              <div className="flex gap-2 mb-4">
                {['7D', '30D', '90D'].map((period) => (
                  <button
                    key={period}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${period === '90D'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                      }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
              <p className="text-orange-400 mb-2">Data unavailable!</p>
              <p className="text-white/60 text-sm">
                Next steps: Upload more beats to increase your reach and visibility.
              </p>
            </div>

            <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">UPLOADED BEATS</h3>
              <p className="text-orange-400 mb-4">You have not uploaded any beats yet!</p>
              <Link href="/upload">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium">
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
