'use client';

import React, { useState, useRef } from 'react';
import { Search, ChevronDown, ShoppingCart, LogOut, User, LayoutDashboard, Settings, CreditCard } from 'lucide-react';
import Image from 'next/image';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import AuthModal from '@/components/AuthModal';
import StartSellingModal from '@/components/StartSellingModal';
import Link from 'next/link';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { getItemCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('General');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showStartSellingModal, setShowStartSellingModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef as React.RefObject<HTMLElement>, () => setShowCategoryDropdown(false));
  useClickOutside(profileDropdownRef as React.RefObject<HTMLElement>, () => setShowProfileDropdown(false));

  // Check if user is a seller
  const [isSeller, setIsSeller] = useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsSeller(!!localStorage.getItem('seller_profile'));
    }
  }, [isAuthenticated]);

  const categories = ['General', 'Hip-Hop', 'Pop', 'R&B', 'Electronic', 'Rock', 'Jazz'];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery, 'in category:', category);
    // Add your search logic here
  };

  const handleCategorySelect = (cat: string) => {
    setCategory(cat);
    setShowCategoryDropdown(false);
  };

  const handleNavClick = (section: string) => {
    // If not on home page, navigate to home with hash
    if (window.location.pathname !== '/') {
      window.location.href = `/#${section}`;
      return;
    }

    // Scroll to section
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSignIn = () => {
    setShowAuthModal(true);
  };

  const handleStartSelling = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      setShowStartSellingModal(true);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5 px-4 h-16 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link
          href="/"
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <div className="relative w-10 h-10">
            <Image
              src="/logo.png"
              alt="Mormat Waves"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="text-xl font-bold tracking-tight">Mormat Waves</span>
        </Link>

        <form onSubmit={handleSearch} className="hidden md:flex items-center bg-white/5 rounded-full px-4 py-1.5 border border-white/10 w-[400px] focus-within:border-indigo-500/50 transition-colors">
          <input
            type="text"
            placeholder="Search top beats"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent flex-1 outline-none text-sm"
          />
          <div className="h-4 w-[1px] bg-white/20 mx-3" />
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="flex items-center gap-1 text-xs text-white/60 hover:text-white transition-colors"
            >
              {category} <ChevronDown size={14} />
            </button>
            {showCategoryDropdown && (
              <div className="absolute top-full right-0 mt-2 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl min-w-[150px] z-50">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategorySelect(cat)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-white/5 transition-colors ${cat === category ? 'text-indigo-400' : 'text-white/60'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </form>
      </div>

      <div className="flex items-center gap-6">
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-white/60">
          <button
            onClick={() => handleNavClick('beats')}
            className="hover:text-white transition-colors"
          >
            BEATS
          </button>
          <button
            onClick={() => handleNavClick('sound-kits')}
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            SOUND KITS <span className="bg-orange-500/20 text-orange-400 text-[10px] px-1.5 py-0.5 rounded uppercase">New</span>
          </button>
        </nav>

        <div className="flex items-center gap-6">
          {isAuthenticated && (
            <>
              <Link href="/cart" className="relative p-2 hover:bg-white/10 rounded-full transition-colors group" title="Cart">
                <ShoppingCart size={20} className="text-white/60 group-hover:text-white transition-colors" />
                {getItemCount() > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">
                    {getItemCount()}
                  </span>
                )}
              </Link>

              {isSeller && (
                <Link href="/dashboard" className="flex items-center gap-2 p-2 px-3 hover:bg-white/10 rounded-full transition-colors group">
                  <LayoutDashboard size={18} className="text-white/60 group-hover:text-white transition-colors" />
                  <span className="text-sm font-medium text-white/60 group-hover:text-white transition-colors">
                    Dashboard
                  </span>
                </Link>
              )}

              {/* User Dropdown */}
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center gap-2 p-2 px-3 hover:bg-white/10 rounded-full transition-colors group"
                >
                  <User size={18} className="text-white/60 group-hover:text-white transition-colors" />
                  <span className="hidden md:inline text-sm text-white/60 group-hover:text-white transition-colors">
                    {user?.name || user?.email}
                  </span>
                  <ChevronDown size={14} className={`text-white/60 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showProfileDropdown && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden">
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
            </>
          )}
          {!isAuthenticated && (
            <button
              onClick={handleSignIn}
              className="text-sm font-medium hover:text-white transition-colors"
            >
              Sign In
            </button>
          )}
          {!isSeller && (
            <button
              onClick={handleStartSelling}
              className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white px-5 py-2 rounded-full text-sm font-medium transition-all"
            >
              Start Selling
            </button>
          )}
        </div>
      </div>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
      <StartSellingModal open={showStartSellingModal} onOpenChange={setShowStartSellingModal} />
    </nav>
  );
};

export default Navbar;
