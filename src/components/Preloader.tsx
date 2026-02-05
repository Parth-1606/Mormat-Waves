
'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const Preloader = () => {
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);

            // Remove from DOM after transition
            setTimeout(() => {
                setVisible(false);
            }, 500); // Wait for fade out transition
        }, 2000); // 2 seconds loading time

        return () => clearTimeout(timer);
    }, []);

    if (!visible) return null;

    return (
        <div
            className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] transition-opacity duration-500 ${loading ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
        >
            <div className="relative w-24 h-24 mb-6 animate-pulse">
                <Image
                    src="/logo.png"
                    alt="Mormat Waves"
                    fill
                    className="object-contain"
                    priority
                />
            </div>

            <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 animate-progress origin-left"></div>
            </div>

            <h1 className="mt-4 text-2xl font-bold tracking-widest text-white/20 animate-pulse">
                MORMAT WAVES
            </h1>

            <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 2s ease-in-out forwards;
        }
      `}</style>
        </div>
    );
};

export default Preloader;
