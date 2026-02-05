
import React, { useState, useRef } from 'react';
import { ShieldCheck, Upload, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

const VerifyIdentitySection = () => {
    const [aadhaarNumber, setAadhaarNumber] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<'idle' | 'submitting' | 'submitted'>('idle');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!aadhaarNumber || !file) return;

        setStatus('submitting');

        // Simulate API upload
        setTimeout(() => {
            setStatus('submitted');
            // Reset after showing success for a while if needed, or leave as submitted
        }, 2000);
    };

    return (
        <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-6">
                <ShieldCheck className="text-orange-400" size={24} />
                <h3 className="text-xl font-bold">Verify Identity</h3>
            </div>

            {status === 'submitted' ? (
                <div className="text-center py-8 bg-green-500/5 rounded-xl border border-green-500/20">
                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 size={32} className="text-green-400" />
                    </div>
                    <h4 className="text-xl font-bold text-green-400 mb-2">Verification Submitted!</h4>
                    <p className="text-white/60 max-w-md mx-auto">
                        Thank you for submitting your details. Our team will manually verify your Aadhaar card within 24-48 hours.
                    </p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 flex gap-3 text-orange-300 text-sm">
                        <AlertCircle className="shrink-0" size={20} />
                        <p>
                            To ensure platform safety and monetization eligibility, we require a valid government ID. Your data is encrypted and stored securely.
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                            Aadhaar Card Number
                        </label>
                        <input
                            type="text"
                            value={aadhaarNumber}
                            onChange={(e) => setAadhaarNumber(e.target.value)}
                            placeholder="XXXX XXXX XXXX"
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:border-orange-500 focus:outline-none transition-colors"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">
                            Upload Aadhaar Card (Front & Back)
                        </label>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${file ? 'border-orange-500 bg-orange-500/5' : 'border-white/10 hover:border-orange-500/50 hover:bg-white/5'
                                }`}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*,.pdf"
                            />

                            {file ? (
                                <div className="flex flex-col items-center">
                                    <FileText size={40} className="text-orange-400 mb-2" />
                                    <span className="font-medium text-orange-300">{file.name}</span>
                                    <span className="text-xs text-orange-300/60 mt-1">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </span>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setFile(null);
                                        }}
                                        className="mt-4 text-xs text-red-400 hover:text-red-300 hover:underline"
                                    >
                                        Remove file
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <Upload size={40} className="text-white/30 mb-2" />
                                    <span className="font-medium text-white/60">Click to upload or drag and drop</span>
                                    <span className="text-xs text-white/40 mt-1">SVG, PNG, JPG or PDF (max. 10MB)</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'submitting' || !file || !aadhaarNumber}
                        className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-bold transition-colors flex items-center gap-2"
                    >
                        {status === 'submitting' ? 'Submitting...' : 'Submit for Verification'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default VerifyIdentitySection;
