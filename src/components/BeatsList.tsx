'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Play, ShoppingCart, MoreVertical, BadgeCheck, ChevronRight, Pause, Download, Share2 } from 'lucide-react';
import { useAudioPlayer } from '@/contexts/AudioPlayerContext';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { usePurchases } from '@/contexts/PurchasesContext';
import { initiatePayment } from '@/lib/payment';
import PaymentSuccessModal from '@/components/PaymentSuccessModal';
import { useRouter } from 'next/navigation';

const beats = [
  { id: 1, title: 'slyrat', producer: 'ProdTrendyB', bpm: '150 BPM', key: 'D Major', price: '699', tags: ['bouncy', 'happy', 'dance'], image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=100' },
  { id: 2, title: 'Neon Lights', producer: 'LxK Beats', bpm: '118 BPM', key: 'C# Major', price: '599', tags: ['Indian Pop Beat', 'Pop Type Beat', 'Electronic Pop'], image: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=100' },
  { id: 3, title: 'EVEN', producer: 'Exnegytressss', bpm: '125 BPM', key: 'B Major', price: '999', tags: ['JUICE WRLD', 'LIL PEEP', 'MC INSANE'], image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=100' },
  { id: 4, title: 'Lost in you', producer: 'Itz_DS77', bpm: '76 BPM', key: 'G# Minor', price: '699', tags: ['Romantic', 'hiphop', 'soft'], image: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=100' },
  { id: 5, title: 'GANGSTAR KARAN AUJLA', producer: 'MAXXRANGEBEATZ', bpm: '95 BPM', key: 'A Minor', price: '999', tags: ['@KARANAUJLA', '@CHEEMAY'], image: 'https://images.unsplash.com/photo-1514525253361-bee87184919a?auto=format&fit=crop&q=80&w=100' },
];

const BeatsList = () => {
  const { playBeat, currentBeat, isPlaying, setBeats } = useAudioPlayer();
  const { user, isAuthenticated } = useAuth();
  const { addToCart, isInCart, removeFromCart } = useCart();
  const { canDownload, getPurchaseByBeatId, addPurchase } = usePurchases();
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
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          Trending <span className="text-indigo-400">Beats</span>
        </h2>
        <button
          onClick={handleSeeAll}
          className="flex items-center gap-1 text-sm text-white/60 hover:text-white transition-colors border border-white/10 px-4 py-1.5 rounded-full hover:border-indigo-500/50"
        >
          See All <ChevronRight size={16} />
        </button>
      </div>

      <div className="space-y-2">
        {beats.map((beat) => (
          <div
            key={beat.id}
            onClick={() => handleBeatClick(beat)}
            className={`group flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer border ${isCurrentBeat(beat.id)
              ? 'bg-indigo-500/10 border-indigo-500/30'
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
                      className="bg-orange-600 hover:bg-orange-700 active:scale-95 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold text-sm transition-all whitespace-nowrap"
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
                        className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold text-sm transition-all whitespace-nowrap"
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
                        console.log('Add to Playlist:', beat.title);
                        setShowMoreMenu(null);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-white/60 hover:bg-white/5 transition-colors"
                    >
                      Add to Playlist
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
        ))}
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
