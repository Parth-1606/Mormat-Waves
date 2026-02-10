'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Play, ShoppingCart, BadgeCheck, ChevronRight, Pause, Download, Share2, Heart } from 'lucide-react';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
// Removed unused useClickOutside hook
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { usePurchases } from '@/contexts/PurchasesContext';
import { useSearch } from '@/contexts/SearchContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { initiatePayment } from '@/lib/payment';
import PaymentSuccessModal from '@/components/PaymentSuccessModal';
import { useRouter } from 'next/navigation';
import { useBeats } from '@/contexts/BeatsContext';

const BeatsList = () => {
  const { beats } = useBeats();
  const { playBeat, currentBeat, isPlaying, setBeats } = useAudioPlayer();
  const { user, isAuthenticated } = useAuth();
  const { addToCart, isInCart, removeFromCart } = useCart();
  const { canDownload, getPurchaseByBeatId, addPurchase } = usePurchases();
  const { searchQuery, setSearchQuery, category, setCategory } = useSearch();
  const { toggleFavorite, isFavorite } = useFavorites();
  const router = useRouter();
  const [processingPayment, setProcessingPayment] = useState<number | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<{
    beatTitle: string;
    amount: number;
    orderId: string;
  } | null>(null);


  useEffect(() => {
    setBeats(beats);
  }, [setBeats, beats]);

  // Filter beats based on search query and category
  const filteredBeats = beats.filter((beat) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      beat.title.toLowerCase().includes(query) ||
      beat.producer.toLowerCase().includes(query) ||
      beat.genre.toLowerCase().includes(query) ||
      beat.mood.toLowerCase().includes(query) ||
      beat.tags.some(tag => tag.toLowerCase().includes(query));

    const matchesCategory =
      category === 'All' ||
      beat.genre.toLowerCase() === category.toLowerCase() ||
      beat.mood.toLowerCase() === category.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const handlePlayClick = (e: React.MouseEvent, beat: typeof beats[0]) => {
    e.stopPropagation();
    playBeat(beat);
  };

  const handleAddToCart = (e: React.MouseEvent, beat: typeof beats[0]) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      alert('Please sign in to add items to cart');
      return;
    }
    addToCart({
      id: beat.id,
      title: beat.title,
      producer: beat.producer,
      price: beat.price,
      image: beat.image,
      bpm: beat.bpm,
      key: beat.key,
    });
  };

  const handleBuyClick = async (e: React.MouseEvent, beat: typeof beats[0]) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      alert('Please sign in to purchase beats');
      return;
    }

    if (!user) {
      alert('User information not available');
      return;
    }

    setProcessingPayment(Number(beat.id));

    try {
      const amount = parseFloat(beat.price) * 100; // Convert to paise

      await initiatePayment({
        amount: amount,
        currency: 'INR',
        beatId: beat.id,
        beatTitle: beat.title,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
      });

      // Payment successful - add to purchases
      const orderId = `order_${Date.now()}`;
      addPurchase({
        id: `purchase_${Date.now()}_${beat.id}`,
        orderId: orderId,
        beatId: beat.id,
        beatTitle: beat.title,
        producer: beat.producer,
        price: parseFloat(beat.price),
        image: beat.image,
        purchaseDate: new Date().toISOString(),
        downloadUrl: `https://example.com/download/${beat.id}`,
      });

      // Show success modal
      setPaymentDetails({
        beatTitle: beat.title,
        amount: amount,
        orderId: orderId,
      });
      setShowSuccessModal(true);
    } catch (error: any) {
      console.error('Payment error:', error);
      if (error.message !== 'Payment cancelled by user') {
        const errorMessage = error.message || 'Unknown error occurred';
        alert(`Payment Failed\n\n${errorMessage}\n\nNote: This is demo mode. In production, ensure your Razorpay keys are configured correctly.`);
      }
    } finally {
      setProcessingPayment(null);
    }
  };

  const handleDownload = (e: React.MouseEvent, beat: typeof beats[0]) => {
    e.stopPropagation();
    if (!canDownload(beat.id)) {
      alert('Please purchase this beat to download it');
      return;
    }
    const purchase = getPurchaseByBeatId(beat.id);
    if (purchase) {
      const link = document.createElement('a');
      link.href = purchase.downloadUrl || `https://example.com/download/${beat.id}`;
      link.download = `${beat.title}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShare = async (e: React.MouseEvent, beat: typeof beats[0]) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/beat/${beat.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Check out this beat: ${beat.title}`,
          text: `Listen to "${beat.title}" by ${beat.producer} on Beat22!`,
          url: shareUrl,
        });
      } catch (error) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };



  const handleSeeAll = () => {
    console.log('See All beats clicked');
    // Add navigation logic here
  };

  const handleBeatClick = (beat: typeof beats[0]) => {
    playBeat(beat);
  };

  const isCurrentBeat = (beatId: number | string) => currentBeat?.id === beatId;

  return (
    <section id="beats" className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          Trending <span className="text-primary">Beats</span>
        </h2>
        <button
          onClick={handleSeeAll}
          className="flex items-center gap-1 text-sm text-white/60 hover:text-white transition-colors border border-white/10 px-4 py-1.5 rounded-full hover:border-primary/50"
        >
          See All <ChevronRight size={16} />
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search by genre (rock, pop), mood (happy, sad), or beat name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-[#1a1a1a] border border-white/10 rounded-xl px-6 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
        >
          <option value="All">All Categories</option>
          <option value="rock">Rock</option>
          <option value="pop">Pop</option>
          <option value="hip-hop">Hip-Hop</option>
          <option value="r&b">R&B</option>
          <option value="electronic">Electronic</option>
          <option value="ambient">Ambient</option>
          <option value="happy">Happy</option>
          <option value="sad">Sad</option>
          <option value="energetic">Energetic</option>
          <option value="calm">Calm</option>
        </select>
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-white/60">
        {filteredBeats.length} {filteredBeats.length === 1 ? 'beat' : 'beats'} found
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBeats.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <p className="text-white/40 text-lg mb-2">No beats found</p>
            <p className="text-white/20 text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredBeats.map((beat) => (
            <div
              key={beat.id}
              onClick={() => handleBeatClick(beat)}
              className={`group relative bg-[#1a1a1a] rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 ${isCurrentBeat(beat.id)
                ? 'border-primary/50 ring-1 ring-primary/50'
                : 'border-white/5 hover:border-primary/30'
                }`}
            >
              {/* Image Container */}
              <div
                className="relative aspect-square overflow-hidden cursor-pointer"
                onClick={(e) => handlePlayClick(e, beat)}
              >
                <img
                  src={beat.image}
                  alt={beat.title}
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isCurrentBeat(beat.id) && isPlaying ? 'scale-105' : ''
                    }`}
                />

                {/* Overlay */}
                <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${isCurrentBeat(beat.id) && isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}>
                  <div className="w-14 h-14 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center text-black shadow-lg transform transition-transform duration-300 hover:scale-110">
                    {isCurrentBeat(beat.id) && isPlaying ? (
                      <Pause size={24} fill="currentColor" />
                    ) : (
                      <Play size={24} fill="currentColor" className="ml-1" />
                    )}
                  </div>
                </div>

                {/* Top Right Actions */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(beat);
                    }}
                    className="p-2 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-primary hover:text-black transition-colors"
                  >
                    <Heart size={18} className={isFavorite(beat.id) ? 'fill-current text-primary hover:text-black' : ''} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare(e, beat);
                    }}
                    className="p-2 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-primary hover:text-black transition-colors"
                  >
                    <Share2 size={18} />
                  </button>
                </div>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {beat.id === 1 && (
                    <span className="px-2 py-1 rounded-md bg-yellow-500/90 backdrop-blur-sm text-black text-xs font-bold shadow-lg">
                      Trending
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 space-y-4">
                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={`font-bold text-lg leading-tight truncate ${isCurrentBeat(beat.id) ? 'text-primary' : 'text-white'
                      }`}>
                      {beat.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5 text-white/60 text-sm">
                    <span className="truncate hover:text-primary transition-colors cursor-pointer">
                      {beat.producer}
                    </span>
                    <BadgeCheck size={14} className="text-primary" />
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs font-medium text-white/40">
                  <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                    {beat.bpm} BPM
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                    <span className="text-primary">♪</span>
                    {beat.key}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 h-6 overflow-hidden">
                  {beat.tags.slice(0, 3).map((tag, tagIndex) => (
                    <span key={tagIndex} className="text-[10px] px-2 py-0.5 bg-white/5 rounded-full text-white/50 border border-white/5">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center gap-2">
                  {canDownload(beat.id) ? (
                    <button
                      onClick={(e) => handleDownload(e, beat)}
                      className="flex-1 bg-green-500/10 hover:bg-green-500 hover:text-black border border-green-500/50 text-green-500 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 group/btn"
                    >
                      <Download size={16} className="group-hover/btn:-translate-y-0.5 transition-transform" />
                      Download
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={(e) => handleBuyClick(e, beat)}
                        disabled={processingPayment === beat.id}
                        className="flex-1 bg-white hover:bg-primary hover:scale-[1.02] active:scale-[0.98] text-black py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/5"
                      >
                        {processingPayment === beat.id ? (
                          <span className="animate-pulse">Processing...</span>
                        ) : (
                          <>
                            <span>Get for</span>
                            <span>₹{beat.price}</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={(e) => handleAddToCart(e, beat)}
                        className={`p-2.5 rounded-xl border transition-all ${isInCart(beat.id)
                          ? 'bg-red-500/10 border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white'
                          : 'bg-white/5 border-white/10 text-white hover:bg-white hover:text-black hover:border-white'
                          }`}
                      >
                        <ShoppingCart size={20} className={isInCart(beat.id) ? "fill-current" : ""} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {paymentDetails && (
        <PaymentSuccessModal
          open={showSuccessModal}
          onOpenChange={setShowSuccessModal}
          beatTitle={paymentDetails.beatTitle}
          amount={paymentDetails.amount}
          orderId={paymentDetails.orderId}
        />
      )}
    </section>
  );
};

export default BeatsList;
