'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Upload, X, Loader2, Music, Image as ImageIcon } from 'lucide-react';
import { useBeats } from '@/contexts/BeatsContext';

export default function UploadPage() {
    const { user, isAuthenticated } = useAuth();
    const { addBeat } = useBeats();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const audioInputRef = React.useRef<HTMLInputElement>(null);
    const artworkInputRef = React.useRef<HTMLInputElement>(null);
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [artworkFile, setArtworkFile] = useState<File | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        bpm: '',
        key: '',
        price: '',
        genre: '',
        mood: '',
        tags: '',
    });

    if (!isAuthenticated) {
        // router.push('/login'); // In a real app we'd redirect, but let's just show waiting or null
        return null;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'audio' | 'artwork') => {
        if (e.target.files && e.target.files[0]) {
            if (type === 'audio') {
                setAudioFile(e.target.files[0]);
            } else {
                setArtworkFile(e.target.files[0]);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!audioFile) {
            alert('Please upload an audio file');
            return;
        }

        if (!artworkFile) {
            alert('Please upload artwork');
            return;
        }

        setLoading(true);

        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Create new beat object
        const newBeat = {
            title: formData.title,
            producer: user?.name || 'Unknown Producer',
            bpm: `${formData.bpm} BPM`,
            key: formData.key,
            price: formData.price,
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
            genre: formData.genre,
            mood: formData.mood,
            // Create a local URL for the uploaded image to display it immediately
            image: URL.createObjectURL(artworkFile),
            // In a real app, we'd upload the audio file and get a URL back
            audioUrl: URL.createObjectURL(audioFile),
        };

        addBeat(newBeat);
        setLoading(false);
        router.push('/dashboard'); // Redirect to dashboard beats list (if it exists, otherwise dashboard)
    };

    return (
        <div className="min-h-screen bg-background text-white pt-24 pb-20 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold">Upload New Beat</h1>
                    <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="bg-card border border-white/10 rounded-2xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* File Upload Mock */}
                        <div className="grid grid-cols-2 gap-6">
                            <input
                                type="file"
                                ref={audioInputRef}
                                className="hidden"
                                accept="audio/mpeg,audio/wav"
                                onChange={(e) => handleFileChange(e, 'audio')}
                            />
                            <div
                                onClick={() => audioInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer bg-white/5 ${audioFile ? 'border-primary/50 bg-primary/10' : 'border-white/10 hover:border-primary/50'}`}
                            >
                                <Music size={32} className={`mb-4 ${audioFile ? 'text-primary' : 'text-white/40'}`} />
                                <p className="font-bold mb-1">{audioFile ? 'Audio Selected' : 'Upload Audio'}</p>
                                <p className="text-xs text-white/40 truncate max-w-full px-2">{audioFile ? audioFile.name : 'MP3 or WAV'}</p>
                            </div>

                            <input
                                type="file"
                                ref={artworkInputRef}
                                className="hidden"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={(e) => handleFileChange(e, 'artwork')}
                            />
                            <div
                                onClick={() => artworkInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer bg-white/5 relative overflow-hidden ${artworkFile ? 'border-primary/50' : 'border-white/10 hover:border-primary/50'}`}
                            >
                                {artworkFile ? (
                                    <>
                                        <img src={URL.createObjectURL(artworkFile)} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                                        <div className="relative z-10 flex flex-col items-center">
                                            <ImageIcon size={32} className="text-white mb-2" />
                                            <p className="font-bold text-sm">Change Artwork</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <ImageIcon size={32} className="text-white/40 mb-4" />
                                        <p className="font-bold mb-1">Upload Artwork</p>
                                        <p className="text-xs text-white/40">JPG or PNG</p>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-white/60 mb-2">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-primary/50 focus:outline-none transition-colors"
                                    placeholder="Enter beat title"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-white/60 mb-2">BPM</label>
                                    <input
                                        type="number"
                                        name="bpm"
                                        value={formData.bpm}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-primary/50 focus:outline-none transition-colors"
                                        placeholder="e.g. 140"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/60 mb-2">Key</label>
                                    <input
                                        type="text"
                                        name="key"
                                        value={formData.key}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-primary/50 focus:outline-none transition-colors"
                                        placeholder="e.g. C Minor"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-white/60 mb-2">Genre</label>
                                    <select
                                        name="genre"
                                        value={formData.genre}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-primary/50 focus:outline-none transition-colors appearance-none"
                                        required
                                    >
                                        <option value="" disabled className="bg-[#1a1a1a] text-white">Select Genre</option>
                                        <option value="hip-hop" className="bg-[#1a1a1a] text-white">Hip Hop</option>
                                        <option value="trap" className="bg-[#1a1a1a] text-white">Trap</option>
                                        <option value="r&b" className="bg-[#1a1a1a] text-white">R&B</option>
                                        <option value="pop" className="bg-[#1a1a1a] text-white">Pop</option>
                                        <option value="rock" className="bg-[#1a1a1a] text-white">Rock</option>
                                        <option value="electronic" className="bg-[#1a1a1a] text-white">Electronic</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/60 mb-2">Mood</label>
                                    <select
                                        name="mood"
                                        value={formData.mood}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-primary/50 focus:outline-none transition-colors appearance-none"
                                        required
                                    >
                                        <option value="" disabled className="bg-[#1a1a1a] text-white">Select Mood</option>
                                        <option value="happy" className="bg-[#1a1a1a] text-white">Happy</option>
                                        <option value="sad" className="bg-[#1a1a1a] text-white">Sad</option>
                                        <option value="energetic" className="bg-[#1a1a1a] text-white">Energetic</option>
                                        <option value="aggressive" className="bg-[#1a1a1a] text-white">Aggressive</option>
                                        <option value="dark" className="bg-[#1a1a1a] text-white">Dark</option>
                                        <option value="calm" className="bg-[#1a1a1a] text-white">Calm</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/60 mb-2">Tags (comma separated)</label>
                                <input
                                    type="text"
                                    name="tags"
                                    value={formData.tags}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-primary/50 focus:outline-none transition-colors"
                                    placeholder="e.g. guitar, dark, hard"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/60 mb-2">Price (INR)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">₹</span>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-4 py-3 focus:border-primary/50 focus:outline-none transition-colors"
                                        placeholder="2999"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary/90 text-black font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-8 disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload size={20} />
                                    Upload Beat
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
