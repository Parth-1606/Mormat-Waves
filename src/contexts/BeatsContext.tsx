'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Beat {
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

interface BeatsContextType {
    beats: Beat[];
    addBeat: (beat: Omit<Beat, 'id'>) => void;
    deleteBeat: (id: number) => void;
}

const BeatsContext = createContext<BeatsContextType | undefined>(undefined);

const initialBeats: Beat[] = [
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

export const BeatsProvider = ({ children }: { children: ReactNode }) => {
    const [beats, setBeats] = useState<Beat[]>(initialBeats);

    // Load beats from localStorage on mount to persist user added beats
    useEffect(() => {
        const storedBeats = localStorage.getItem('user_beats');
        if (storedBeats) {
            try {
                const parsedBeats = JSON.parse(storedBeats);
                // Merge stored beats with initial beats, avoiding duplicates if IDs conflict (for simplicity, we assume new IDs are unique timestamps)
                const newBeats = [...initialBeats, ...parsedBeats];
                // In a real app, you'd fetch all from API. Here we just append user beats to initial ones
                setBeats(newBeats);
            } catch (e) {
                console.error('Failed to parse user beats', e);
            }
        }
    }, []);

    const addBeat = (beatData: Omit<Beat, 'id'>) => {
        const newBeat: Beat = {
            ...beatData,
            id: Date.now(), // Generate a unique ID
        };

        const existingUserBeats = JSON.parse(localStorage.getItem('user_beats') || '[]');
        // Optional: deduplication could happen here if we had unique constraints, but we rely on ID.
        localStorage.setItem('user_beats', JSON.stringify([...existingUserBeats, newBeat]));

        setBeats((prev) => {
            return [newBeat, ...prev]; // Add new beat to the top
        });
    };

    const deleteBeat = (id: number) => {
        setBeats((prev) => prev.filter((beat) => beat.id !== id));

        const existingUserBeats = JSON.parse(localStorage.getItem('user_beats') || '[]');
        const updatedUserBeats = existingUserBeats.filter((beat: Beat) => beat.id !== id);
        localStorage.setItem('user_beats', JSON.stringify(updatedUserBeats));
    };

    return (
        <BeatsContext.Provider value={{ beats, addBeat, deleteBeat }}>
            {children}
        </BeatsContext.Provider>
    );
};

export const useBeats = () => {
    const context = useContext(BeatsContext);
    if (!context) {
        throw new Error('useBeats must be used within a BeatsProvider');
    }
    return context;
};
