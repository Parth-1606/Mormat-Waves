'use client';

import React from 'react';
import { usePurchases } from '@/contexts/PurchasesContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Download, Share2, Music, ArrowLeft, IndianRupee } from 'lucide-react';
import Link from 'next/link';

export default function PurchasesPage() {
  const { purchases } = usePurchases();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleDownload = (beatId: number, beatTitle: string) => {
    // In production, this would download from actual URL
    // For demo, we'll simulate download
    const link = document.createElement('a');
    link.href = `https://example.com/download/${beatId}`;
    link.download = `${beatTitle}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert(`Download started for: ${beatTitle}`);
  };

  const handleShare = async (beatId: number, beatTitle: string) => {
    const shareUrl = `${window.location.origin}/beat/${beatId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Check out this beat: ${beatTitle}`,
          text: `I just purchased "${beatTitle}" on Beat22!`,
          url: shareUrl,
        });
      } catch (error) {
        // User cancelled or error occurred
        console.log('Share cancelled');
      }
    } else {
      // Fallback: Copy to clipboard
      await navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-20 px-4 md:px-8 pb-20">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white mb-8">
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <Music size={32} />
          <h1 className="text-4xl font-bold">My Purchases</h1>
          <span className="text-white/60">({purchases.length} beats)</span>
        </div>

        {purchases.length === 0 ? (
          <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-12 text-center">
            <Music size={64} className="mx-auto mb-4 text-white/20" />
            <h2 className="text-2xl font-bold mb-2">No purchases yet</h2>
            <p className="text-white/60 mb-6">Start buying beats to see them here!</p>
            <Link href="/">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium">
                Browse Beats
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {purchases.map((purchase) => (
              <div
                key={purchase.id}
                className="bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden hover:border-indigo-500/50 transition-colors"
              >
                <img
                  src={purchase.image}
                  alt={purchase.beatTitle}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{purchase.beatTitle}</h3>
                  <p className="text-white/60 mb-2">{purchase.producer}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-white/40">
                      Purchased: {new Date(purchase.purchaseDate).toLocaleDateString()}
                    </span>
                    <span className="text-lg font-bold text-green-400">
                      <IndianRupee size={18} className="inline" />
                      {purchase.price}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownload(purchase.beatId, purchase.beatTitle)}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2"
                    >
                      <Download size={18} />
                      Download
                    </button>
                    <button
                      onClick={() => handleShare(purchase.beatId, purchase.beatTitle)}
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2"
                    >
                      <Share2 size={18} />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
