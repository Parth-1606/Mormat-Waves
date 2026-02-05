'use client';

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Playlists from "@/components/Playlists";
import BeatsList from "@/components/BeatsList";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";

export default function Home() {
  return (
    <>
      <Preloader />
      <div className="min-h-screen bg-background text-white selection:bg-primary/30">
        <Navbar />
        <main>
          <Hero />
          <Playlists />
          <BeatsList />

          <Footer />
        </main>
      </div>
    </>
  );
}
