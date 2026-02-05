'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the Beat type matching what we use in BeatsList
interface Beat {
    id: number;
    title: string;
    producer: string;
    bpm: string;
    key: string;
    price: string;
    tags: string[];
    genre: string;
    mood: string;
    image: string;
}

interface FavoritesContextType {
    favorites: Beat[];
    toggleFavorite: (beat: Beat) => void;
    isFavorite: (beatId: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
    const [favorites, setFavorites] = useState<Beat[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('user_favorites');
            if (stored) {
                try {
                    setFavorites(JSON.parse(stored));
                } catch (error) {
                    console.error('Failed to parse favorites:', error);
                }
            }
        }
    }, []);

    // Save to localStorage whenever favorites change
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('user_favorites', JSON.stringify(favorites));
        }
    }, [favorites]);

    const toggleFavorite = (beat: Beat) => {
        setFavorites((prev) => {
            const exists = prev.some((f) => f.id === beat.id);
            if (exists) {
                return prev.filter((f) => f.id !== beat.id);
            } else {
                return [...prev, beat];
            }
        });
    };

    const isFavorite = (beatId: number) => {
        return favorites.some((f) => f.id === beatId);
    };

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    const context = useContext(FavoritesContext);
    if (context === undefined) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
}
