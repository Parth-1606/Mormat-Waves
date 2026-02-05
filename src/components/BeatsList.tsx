'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Play, ShoppingCart, MoreVertical, BadgeCheck, ChevronRight, Pause, Download, Share2, Heart } from 'lucide-react';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { usePurchases } from '@/contexts/PurchasesContext';
import { useSearch } from '@/contexts/SearchContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { initiatePayment } from '@/lib/payment';
import PaymentSuccessModal from '@/components/PaymentSuccessModal';
import { useRouter } from 'next/navigation';

const beats = [
  { id: 1, title: 'slyrat', producer: 'ProdTrendyB', bpm: '150 BPM', key: 'D Major', price: '699', tags: ['bouncy', 'happy', 'dance'], genre: 'electronic', mood: 'happy', image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=100' },
  { id: 2, title: 'Neon Lights', producer: 'LxK Beats', bpm: '118 BPM', key: 'C# Major', price: '599', tags: ['Indian Pop Beat', 'Pop Type Beat', 'Electronic Pop'], genre: 'pop', mood: 'energetic', image: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=100' },
  { id: 3, title: 'EVEN', producer: 'Exnegytressss', bpm: '125 BPM', key: 'B Major', price: '999', tags: ['JUICE WRLD', 'LIL PEEP', 'MC INSANE'], genre: 'hip-hop', mood: 'dark', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=100' },
  { id: 4, title: 'Lost in you', producer: 'Itz_DS77', bpm: '76 BPM', key: 'G# Minor', price: '699', tags: ['Romantic', 'hiphop', 'soft'], genre: 'r&b', mood: 'sad', image: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=100' },
  { id: 5, title: 'GANGSTAR KARAN AUJLA', producer: 'MAXXRANGEBEATZ', bpm: '95 BPM', key: 'A Minor', price: '999', tags: ['@KARANAUJLA', '@CHEEMAY'], genre: 'hip-hop', mood: 'aggressive', image: 'https://images.unsplash.com/photo-1514525253361-bee87184919a?auto=format&fit=crop&q=80&w=100' },
  { id: 6, title: 'Thunder Strike', producer: 'RockMaster99', bpm: '140 BPM', key: 'E Minor', price: '799', tags: ['rock', 'electric', 'powerful'], genre: 'rock', mood: 'energetic', image: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&q=80&w=100' },
  { id: 7, title: 'Sunset Dreams', producer: 'ChillVibes', bpm: '85 BPM', key: 'F Major', price: '549', tags: ['chill', 'relaxing', 'ambient'], genre: 'electronic', mood: 'calm', image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=100' },
  { id: 8, title: 'Pop Sensation', producer: 'HitMaker', bpm: '128 BPM', key: 'C Major', price: '899', tags: ['catchy', 'upbeat', 'commercial'], genre: 'pop', mood: 'happy', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=100' },
  { id: 9, title: 'Midnight Blues', producer: 'SoulBeats', bpm: '70 BPM', key: 'A Minor', price: '649', tags: ['blues', 'emotional', 'deep'], genre: 'r&b', mood: 'sad', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=100' },
  { id: 10, title: 'Rock Anthem', producer: 'GuitarHero', bpm: '160 BPM', key: 'D Minor', price: '849', tags: ['rock', 'anthem', 'guitar'], genre: 'rock', mood: 'energetic', image: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&q=80&w=100' },
  { id: 11, title: 'Happy Days', producer: 'SunnyBeats', bpm: '120 BPM', key: 'G Major', price: '599', tags: ['happy', 'uplifting', 'positive'], genre: 'pop', mood: 'happy', image: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=100' },
  { id: 12, title: 'Tears Fall', producer: 'EmotionalBeats', bpm: '65 BPM', key: 'E Minor', price: '699', tags: ['sad', 'emotional', 'piano'], genre: 'r&b', mood: 'sad', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=100' },
  { id: 13, title: 'Electric Storm', producer: 'EDMKing', bpm: '135 BPM', key: 'A Major', price: '749', tags: ['edm', 'festival', 'drop'], genre: 'electronic', mood: 'energetic', image: 'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?auto=format&fit=crop&q=80&w=100' },
  { id: 14, title: 'Hip Hop Vibes', producer: 'TrapLord', bpm: '90 BPM', key: 'F# Minor', price: '799', tags: ['trap', 'hip-hop', '808'], genre: 'hip-hop', mood: 'aggressive', image: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=100' },
  { id: 15, title: 'Peaceful Mind', producer: 'ZenBeats', bpm: '75 BPM', key: 'C Major', price: '549', tags: ['calm', 'meditation', 'peaceful'], genre: 'ambient', mood: 'calm', image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=100' },
  { id: 16, title: 'Party Starter', producer: 'ClubMaster', bpm: '126 BPM', key: 'D Major', price: '699', tags: ['party', 'club', 'dance'], genre: 'pop', mood: 'happy', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=100' },
  { id: 17, title: 'Broken Heart', producer: 'SadBoiBeats', bpm: '68 BPM', key: 'B Minor', price: '649', tags: ['heartbreak', 'emotional', 'melancholic'], genre: 'r&b', mood: 'sad', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=100' },
  { id: 18, title: 'Rock Revolution', producer: 'MetalHead', bpm: '155 BPM', key: 'E Minor', price: '849', tags: ['rock', 'metal', 'heavy'], genre: 'rock', mood: 'aggressive', image: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&q=80&w=100' },
  { id: 19, title: 'Summer Vibes', producer: 'BeachBeats', bpm: '110 BPM', key: 'A Major', price: '599', tags: ['summer', 'tropical', 'feel-good'], genre: 'pop', mood: 'happy', image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=100' },
  { id: 20, title: 'Dark Nights', producer: 'ShadowBeats', bpm: '80 BPM', key: 'C# Minor', price: '749', tags: ['dark', 'mysterious', 'atmospheric'], genre: 'hip-hop', mood: 'dark', image: 'https://images.unsplash.com/photo-1514525253361-bee87184919a?auto=format&fit=crop&q=80&w=100' },
];

const BeatsList = () => {
  const { playBeat, currentBeat, isPlaying, setBeats } = useAudioPlayer();
  const { user, isAuthenticated } = useAuth();
  const { addToCart, isInCart, removeFromCart } = useCart();
  const { canDownload, getPurchaseByBeatId, addPurchase } = usePurchases();
  const { searchQuery, setSearchQuery, category, setCategory } = useSearch();
  const { toggleFavorite, isFavorite } = useFavorites();
  const router = useRouter();
  const [showMoreMenu, setShowMoreMenu] = useState<number | null>(null);
  const [processingPayment, setProcessingPayment] = useState<number | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<{
    beatTitle: string;
    amount: number;
    orderId: string;
  } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef as React.RefObject<HTMLElement>, () => setShowMoreMenu(null));

  useEffect(() => {
    setBeats(beats);
  }, [setBeats]);

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

    setProcessingPayment(beat.id);

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

  const handleMoreClick = (e: React.MouseEvent, beatId: number) => {
    e.stopPropagation();
    setShowMoreMenu(showMoreMenu === beatId ? null : beatId);
  };

  const handleSeeAll = () => {
    console.log('See All beats clicked');
    // Add navigation logic here
  };

  const handleBeatClick = (beat: typeof beats[0]) => {
    playBeat(beat);
  };

  const isCurrentBeat = (beatId: number) => currentBeat?.id === beatId;

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

      <div className="space-y-2">
        {filteredBeats.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-white/40 text-lg mb-2">No beats found</p>
            <p className="text-white/20 text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredBeats.map((beat) => (
            <div
              key={beat.id}
              onClick={() => handleBeatClick(beat)}
              className={`group flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer border ${isCurrentBeat(beat.id)
                ? 'bg-primary/10 border-primary/30'
                : 'border-transparent hover:border-white/5'
                }`}
            >
              <div
                className="relative w-12 h-12 flex-shrink-0 group-hover:scale-105 transition-transform"
                onClick={(e) => handlePlayClick(e, beat)}
              >
                <img src={beat.image} alt={beat.title} className="w-full h-full object-cover rounded-lg" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                  {isCurrentBeat(beat.id) && isPlaying ? (
                    <Pause size={20} fill="currentColor" className="text-white" />
                  ) : (
                    <Play size={20} fill="currentColor" className="text-white ml-1" />
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-3 items-center gap-4">
                <div className="flex flex-col">
                  <h3 className="font-bold text-white truncate flex items-center gap-1">
                    {beat.title}
                    {beat.id === 1 && <span className="text-[10px] bg-white/10 px-1 rounded">✨</span>}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-white/40">
                    <span className="truncate">{beat.producer}</span>
                    <BadgeCheck size={14} className="text-orange-400" />
                  </div>
                </div>

                <div className="hidden md:flex items-center gap-6 text-sm text-white/40">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-[1px] bg-white/20" />
                    <span>{beat.bpm}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg leading-none">♪</span>
                    <span>{beat.key}</span>
                  </div>
                </div>

                <div className="hidden lg:flex flex-wrap gap-2">
                  {beat.tags.map((tag, tagIndex) => (
                    <span key={`${beat.id}-tag-${tagIndex}`} className="text-[10px] px-2 py-0.5 bg-white/5 rounded-full text-white/60 border border-white/5">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 relative">
                {canDownload(beat.id) ? (
                  <>
                    <button
                      onClick={(e) => handleDownload(e, beat)}
                      className="bg-green-600 hover:bg-green-700 active:scale-95 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold text-sm transition-all whitespace-nowrap"
                    >
                      <Download size={16} />
                      Download
                    </button>
                    <button
                      onClick={(e) => handleShare(e, beat)}
                      className="bg-white/10 hover:bg-white/20 active:scale-95 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold text-sm transition-all whitespace-nowrap"
                    >
                      <Share2 size={16} />
                      Share
                    </button>
                  </>
                ) : (
                  <>
                    {isInCart(beat.id) ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromCart(beat.id);
                        }}
                        className="bg-red-600 hover:bg-red-700 active:scale-95 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold text-sm transition-all whitespace-nowrap"
                      >
                        <ShoppingCart size={16} />
                        Remove from Cart
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={(e) => handleAddToCart(e, beat)}
                          className="bg-white/10 hover:bg-white/20 active:scale-95 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold text-sm transition-all whitespace-nowrap"
                        >
                          <ShoppingCart size={16} />
                          Add to Cart
                        </button>
                        <button
                          onClick={(e) => handleBuyClick(e, beat)}
                          disabled={processingPayment === beat.id}
                          className="bg-primary hover:bg-orange-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-black px-4 py-2 rounded-lg flex items-center gap-2 font-bold text-sm transition-all whitespace-nowrap"
                        >
                          <ShoppingCart size={16} />
                          {processingPayment === beat.id ? 'Processing...' : `₹${beat.price}`}
                        </button>
                      </>
                    )}
                  </>
                )}
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={(e) => handleMoreClick(e, beat.id)}
                    className="text-white/40 hover:text-white transition-colors"
                  >
                    <MoreVertical size={20} />
                  </button>
                  {showMoreMenu === beat.id && (
                    <div className="absolute right-0 top-full mt-2 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl min-w-[150px] z-50">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(beat);
                          setShowMoreMenu(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-white/60 hover:bg-white/5 transition-colors flex items-center gap-2"
                      >
                        <Heart size={16} className={isFavorite(beat.id) ? 'fill-primary text-primary' : ''} />
                        {isFavorite(beat.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                      </button>
                      {canDownload(beat.id) ? (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(e, beat);
                              setShowMoreMenu(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-white/60 hover:bg-white/5 transition-colors"
                          >
                            Download
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare(e, beat);
                              setShowMoreMenu(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-white/60 hover:bg-white/5 transition-colors"
                          >
                            Share
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare(e, beat);
                            setShowMoreMenu(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-white/60 hover:bg-white/5 transition-colors"
                        >
                          Share
                        </button>
                      )}
                    </div>
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
