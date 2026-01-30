'use client';

import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ShoppingCart, X, Trash2, IndianRupee, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { initiatePayment } from '@/lib/payment';
import { usePurchases } from '@/contexts/PurchasesContext';
import PaymentSuccessModal from '@/components/PaymentSuccessModal';

export default function CartPage() {
  const { items, removeFromCart, clearCart, getTotalPrice } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { addPurchase } = usePurchases();
  const router = useRouter();
  const [processingPayment, setProcessingPayment] = React.useState(false);
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [paymentDetails, setPaymentDetails] = React.useState<{
    beatTitle: string;
    amount: number;
    orderId: string;
  } | null>(null);

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleCheckout = async () => {
    if (!user || items.length === 0) return;

    setProcessingPayment(true);

    try {
      // Process payment for all items
      const totalAmount = getTotalPrice() * 100; // Convert to paise

      await initiatePayment({
        amount: totalAmount,
        currency: 'INR',
        beatId: items[0].id, // For demo, use first item
        beatTitle: items.length === 1 ? items[0].title : `${items.length} beats`,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
      });

      // Add all items to purchases
      const orderId = `order_${Date.now()}`;
      items.forEach((item, index) => {
        addPurchase({
          id: `purchase_${Date.now()}_${item.id}_${index}`,
          orderId: orderId,
          beatId: item.id,
          beatTitle: item.title,
          producer: item.producer,
          price: parseFloat(item.price),
          image: item.image,
          purchaseDate: new Date().toISOString(),
          downloadUrl: `https://example.com/download/${item.id}`,
        });
      });

      // Show success modal
      setPaymentDetails({
        beatTitle: items.length === 1 ? items[0].title : `${items.length} beats`,
        amount: totalAmount,
        orderId: orderId,
      });
      setShowSuccessModal(true);

      // Clear cart after successful payment
      clearCart();
    } catch (error: any) {
      console.error('Payment error:', error);
      if (error.message !== 'Payment cancelled by user') {
        alert('Payment failed: ' + (error.message || 'Unknown error'));
      }
    } finally {
      setProcessingPayment(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-20 px-4 md:px-8 pb-20">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white mb-8">
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <ShoppingCart size={32} />
          <h1 className="text-4xl font-bold">Shopping Cart</h1>
          <span className="text-white/60">({items.length} items)</span>
        </div>

        {items.length === 0 ? (
          <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-12 text-center">
            <ShoppingCart size={64} className="mx-auto mb-4 text-white/20" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-white/60 mb-6">Add some beats to get started!</p>
            <Link href="/">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium">
                Browse Beats
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6 flex items-center gap-6"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                  <p className="text-white/60 mb-2">{item.producer}</p>
                  {item.bpm && item.key && (
                    <p className="text-sm text-white/40">
                      {item.bpm} • {item.key}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-indigo-400">
                      <IndianRupee size={24} className="inline" />
                      {item.price}
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-white/40 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}

            <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6 mt-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xl font-bold">Total</span>
                <div className="text-3xl font-bold text-indigo-400">
                  <IndianRupee size={32} className="inline" />
                  {getTotalPrice().toFixed(2)}
                </div>
              </div>
              <button
                onClick={handleCheckout}
                disabled={processingPayment}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-lg font-bold text-lg transition-colors"
              >
                {processingPayment ? 'Processing Payment...' : 'Proceed to Checkout'}
              </button>
            </div>
          </div>
        )}

        {paymentDetails && (
          <PaymentSuccessModal
            open={showSuccessModal}
            onOpenChange={(open) => {
              setShowSuccessModal(open);
              if (!open) {
                router.push('/purchases');
              }
            }}
            beatTitle={paymentDetails.beatTitle}
            amount={paymentDetails.amount}
            orderId={paymentDetails.orderId}
          />
        )}
      </div>
    </div>
  );
}
