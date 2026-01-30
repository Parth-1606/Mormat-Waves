'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

interface StartSellingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const musicGenres = [
  'Hip-Hop', 'Pop', 'R&B', 'Electronic', 'Rock', 'Jazz', 
  'Country', 'Classical', 'Reggae', 'Metal', 'Folk', 'Blues'
];

const licenseTypes = [
  { value: 'basic', label: 'Basic License', desc: 'Personal use only' },
  { value: 'premium', label: 'Premium License', desc: 'Commercial use, up to 10k streams' },
  { value: 'exclusive', label: 'Exclusive License', desc: 'Full commercial rights' },
];

const StartSellingModal: React.FC<StartSellingModalProps> = ({ open, onOpenChange }) => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    isArtist: false,
    musicTypes: [] as string[],
    license: '',
    bio: '',
    socialLinks: {
      instagram: '',
      twitter: '',
      youtube: '',
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleMusicTypeToggle = (type: string) => {
    setFormData(prev => ({
      ...prev,
      musicTypes: prev.musicTypes.includes(type)
        ? prev.musicTypes.filter(t => t !== type)
        : [...prev.musicTypes, type]
    }));
  };

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (formData.musicTypes.length === 0) {
        setError('Please select at least one music type');
        return;
      }
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // In production, this would be an API call to save the seller profile
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      console.log('Seller profile created:', {
        userId: user?.id,
        ...formData,
      });

      // Update user context with seller info
      // In production, this would update the user object in the backend
      
      onOpenChange(false);
      setStep(1);
      setFormData({
        isArtist: false,
        musicTypes: [],
        license: '',
        bio: '',
        socialLinks: {
          instagram: '',
          twitter: '',
          youtube: '',
        },
      });
      
      // Store seller info in localStorage
      localStorage.setItem('seller_profile', JSON.stringify({
        userId: user?.id,
        ...formData,
        createdAt: new Date().toISOString(),
      }));
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError('Failed to create seller profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Sign In Required
            </DialogTitle>
            <DialogDescription className="text-white/60 text-center">
              Please sign in to start selling on Beat22.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 text-center">
            <p className="text-white/60 mb-4">You need to be signed in to become a seller.</p>
            <button
              onClick={() => onOpenChange(false)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a1a1a] border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Start Selling on Beat22
          </DialogTitle>
          <DialogDescription className="text-white/60">
            Step {step} of 3 - Let's set up your seller profile
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
          {step === 1 && (
            <div className="space-y-6 mt-4">
              <div>
                <label className="block text-sm font-medium mb-3">
                  Are you an artist or producer?
                </label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 bg-[#0a0a0a] border border-white/10 rounded-lg cursor-pointer hover:border-indigo-500/50 transition-colors">
                    <input
                      type="radio"
                      name="isArtist"
                      checked={formData.isArtist === true}
                      onChange={() => setFormData(prev => ({ ...prev, isArtist: true }))}
                      className="w-4 h-4 text-indigo-600"
                    />
                    <div>
                      <div className="font-medium">Yes, I'm an artist</div>
                      <div className="text-sm text-white/60">I create and perform music</div>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 bg-[#0a0a0a] border border-white/10 rounded-lg cursor-pointer hover:border-indigo-500/50 transition-colors">
                    <input
                      type="radio"
                      name="isArtist"
                      checked={formData.isArtist === false}
                      onChange={() => setFormData(prev => ({ ...prev, isArtist: false }))}
                      className="w-4 h-4 text-indigo-600"
                    />
                    <div>
                      <div className="font-medium">No, I'm a producer</div>
                      <div className="text-sm text-white/60">I create beats and instrumentals</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 mt-4">
              <div>
                <label className="block text-sm font-medium mb-3">
                  What type of music do you create? (Select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {musicGenres.map((genre) => (
                    <label
                      key={genre}
                      className={`flex items-center gap-2 p-3 bg-[#0a0a0a] border rounded-lg cursor-pointer transition-colors ${
                        formData.musicTypes.includes(genre)
                          ? 'border-indigo-500 bg-indigo-500/10'
                          : 'border-white/10 hover:border-indigo-500/50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.musicTypes.includes(genre)}
                        onChange={() => handleMusicTypeToggle(genre)}
                        className="w-4 h-4 text-indigo-600"
                      />
                      <span className="text-sm">{genre}</span>
                    </label>
                  ))}
                </div>
                {error && <div className="text-red-400 text-sm mt-2">{error}</div>}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 mt-4">
              <div>
                <label className="block text-sm font-medium mb-3">
                  Default License Type
                </label>
                <div className="space-y-3">
                  {licenseTypes.map((license) => (
                    <label
                      key={license.value}
                      className={`flex items-start gap-3 p-4 bg-[#0a0a0a] border rounded-lg cursor-pointer transition-colors ${
                        formData.license === license.value
                          ? 'border-indigo-500 bg-indigo-500/10'
                          : 'border-white/10 hover:border-indigo-500/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="license"
                        value={license.value}
                        checked={formData.license === license.value}
                        onChange={(e) => setFormData(prev => ({ ...prev, license: e.target.value }))}
                        className="w-4 h-4 text-indigo-600 mt-0.5"
                        required
                      />
                      <div>
                        <div className="font-medium">{license.label}</div>
                        <div className="text-sm text-white/60">{license.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Bio (Optional)
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full px-4 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg focus:outline-none focus:border-indigo-500 min-h-[100px]"
                  placeholder="Tell us about yourself and your music..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">
                  Social Links (Optional)
                </label>
                <div className="space-y-3">
                  <input
                    type="url"
                    value={formData.socialLinks.instagram}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, instagram: e.target.value }
                    }))}
                    className="w-full px-4 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg focus:outline-none focus:border-indigo-500"
                    placeholder="Instagram URL"
                  />
                  <input
                    type="url"
                    value={formData.socialLinks.twitter}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, twitter: e.target.value }
                    }))}
                    className="w-full px-4 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg focus:outline-none focus:border-indigo-500"
                    placeholder="Twitter/X URL"
                  />
                  <input
                    type="url"
                    value={formData.socialLinks.youtube}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, youtube: e.target.value }
                    }))}
                    className="w-full px-4 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg focus:outline-none focus:border-indigo-500"
                    placeholder="YouTube URL"
                  />
                </div>
              </div>
            </div>
          )}

          {error && step === 3 && (
            <div className="text-red-400 text-sm text-center">{error}</div>
          )}

          <div className="flex items-center justify-between mt-6">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 1}
              className="px-4 py-2 text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Back
            </button>
            <div className="flex gap-2">
              {step < 3 ? (
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  {loading ? 'Creating Profile...' : 'Complete Setup'}
                </button>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StartSellingModal;
