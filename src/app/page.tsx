'use client';

import { AudioPlayerProvider } from "@/contexts/AudioPlayerContext";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Playlists from "@/components/Playlists";
import BeatsList from "@/components/BeatsList";
import AudioPlayer from "@/components/AudioPlayer";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <AudioPlayerProvider>
      <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-indigo-500/30">
        <Navbar />
        <main>
          <Hero />
          <Playlists />
          <BeatsList />

          <Footer />
        </main>

        <AudioPlayer />
      </div>
    </AudioPlayerProvider>
  );
}
