'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CheckCircle2 } from 'lucide-react';

interface PaymentSuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  beatTitle: string;
  amount: number;
  orderId: string;
}

const PaymentSuccessModal: React.FC<PaymentSuccessModalProps> = ({
  open,
  onOpenChange,
  beatTitle,
  amount,
  orderId,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a1a1a] border-white/10 text-white max-w-md">
        <DialogHeader>
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle2 size={40} className="text-green-500" />
            </div>
            <DialogTitle className="text-2xl font-bold text-center">
              Payment Successful!
            </DialogTitle>
            <DialogDescription className="text-white/60 text-center">
              Your purchase has been completed successfully.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-white/60">Beat:</span>
              <span className="font-medium">{beatTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Amount:</span>
              <span className="font-medium">₹{(amount / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Order ID:</span>
              <span className="font-mono text-xs">{orderId}</span>
            </div>
          </div>

          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4">
            <p className="text-sm text-white/80 text-center">
              Your beat is now available for download. Check your email for the download link.
            </p>
          </div>

          <button
            onClick={() => onOpenChange(false)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentSuccessModal;
