'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Purchase {
  id: string;
  orderId: string;
  beatId: number;
  beatTitle: string;
  producer: string;
  price: number;
  image: string;
  purchaseDate: string;
  downloadUrl?: string;
}

interface PurchasesContextType {
  purchases: Purchase[];
  addPurchase: (purchase: Purchase) => void;
  getPurchaseByBeatId: (beatId: number) => Purchase | undefined;
  canDownload: (beatId: number) => boolean;
}

const PurchasesContext = createContext<PurchasesContextType | undefined>(undefined);

export const usePurchases = () => {
  const context = useContext(PurchasesContext);
  if (!context) {
    throw new Error('usePurchases must be used within PurchasesProvider');
  }
  return context;
};

interface PurchasesProviderProps {
  children: ReactNode;
}

export const PurchasesProvider: React.FC<PurchasesProviderProps> = ({ children }) => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  // Load purchases from localStorage on mount
  useEffect(() => {
    const savedPurchases = localStorage.getItem('user_purchases');
    if (savedPurchases) {
      try {
        setPurchases(JSON.parse(savedPurchases));
      } catch (error) {
        console.error('Failed to load purchases from localStorage:', error);
      }
    }
  }, []);

  // Save purchases to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('user_purchases', JSON.stringify(purchases));
  }, [purchases]);

  const addPurchase = (purchase: Purchase) => {
    setPurchases((prev) => {
      // Check if purchase already exists
      if (prev.some((p) => p.orderId === purchase.orderId)) {
        return prev;
      }
      return [...prev, purchase];
    });
  };

  const getPurchaseByBeatId = (beatId: number): Purchase | undefined => {
    return purchases.find((p) => p.beatId === beatId);
  };

  const canDownload = (beatId: number): boolean => {
    return purchases.some((p) => p.beatId === beatId);
  };

  return (
    <PurchasesContext.Provider
      value={{
        purchases,
        addPurchase,
        getPurchaseByBeatId,
        canDownload,
      }}
    >
      {children}
    </PurchasesContext.Provider>
  );
};
