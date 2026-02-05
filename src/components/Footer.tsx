import React from 'react';
import {
    Check, CreditCard, ChevronDown, Facebook, Instagram, Twitter,
    Linkedin, Youtube, Smartphone, Upload
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="bg-background text-white pt-20 border-t border-white/5 relative overflow-hidden">

            {/* SECTION 1: Licensing Options */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 mb-24">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Get To Choose From 3 Easy Licensing Options</h2>
                    <p className="text-primary font-medium">Easy yet effective!</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Option 1: WAV */}
                    <div className="bg-card border border-white/5 rounded-2xl overflow-hidden hover:-translate-y-2 transition-transform duration-300">
                        <div className="bg-primary/80 p-6 text-center">
                            <h3 className="text-2xl font-bold">WAV</h3>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="flex items-center gap-3 text-white/80">
                                <div className="p-1 rounded bg-white/10"><Check size={14} /></div>
                                <span>Non Exclusive</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/80">
                                <div className="p-1 rounded bg-white/10"><Check size={14} /></div>
                                <span>Rights Sharing</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/80">
                                <div className="p-1 rounded bg-white/10"><Check size={14} /></div>
                                <span>1-99 Yr License Period</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/80">
                                <div className="p-1 rounded bg-white/10"><Check size={14} /></div>
                                <span>Wav File</span>
                            </div>
                        </div>
                    </div>

                    {/* Option 2: WAV + STEMS */}
                    <div className="bg-card border border-white/5 rounded-2xl overflow-hidden relative hover:-translate-y-2 transition-transform duration-300 transform scale-105 shadow-2xl shadow-primary/20 z-10">
                        <div className="bg-gradient-to-r from-primary to-orange-600 p-6 text-center">
                            <h3 className="text-2xl font-bold">WAV + STEMS</h3>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="flex items-center gap-3 text-white/80">
                                <div className="p-1 rounded bg-white/10"><Check size={14} /></div>
                                <span>Non Exclusive</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/80">
                                <div className="p-1 rounded bg-white/10"><Check size={14} /></div>
                                <span>Rights Sharing</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/80">
                                <div className="p-1 rounded bg-white/10"><Check size={14} /></div>
                                <span>1-99 Yr License Period</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/80">
                                <div className="p-1 rounded bg-white/10"><Check size={14} /></div>
                                <span>Wav + Stems File</span>
                            </div>
                        </div>
                    </div>

                    {/* Option 3: Exclusive */}
                    <div className="bg-card border border-white/5 rounded-2xl overflow-hidden hover:-translate-y-2 transition-transform duration-300">
                        <div className="bg-gradient-to-r from-orange-400 to-yellow-500 p-6 text-center">
                            <h3 className="text-2xl font-bold">Exclusive</h3>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="flex items-center gap-3 text-white/80">
                                <div className="p-1 rounded bg-white/10"><Check size={14} /></div>
                                <span>Exclusive</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/80">
                                <div className="p-1 rounded bg-white/10"><Check size={14} /></div>
                                <span>Rights Sharing Optional</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/80">
                                <div className="p-1 rounded bg-white/10"><Check size={14} /></div>
                                <span>Lifetime</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/80">
                                <div className="p-1 rounded bg-white/10"><Check size={14} /></div>
                                <span>Wav + Stems File</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 2: App Marketing / Payments */}
            <div className="bg-background py-24 relative overflow-hidden">
                {/* Background Text Effect */}
                <div className="absolute inset-0 flex items-center justify-center p-select-none pointer-events-none opacity-5">
                    <span className="text-[20vw] font-black tracking-widest text-white">BEATS</span>
                </div>

                <div className="max-w-7xl mx-auto px-4 md:px-8 text-center relative z-10">
                    <h2 className="text-3xl font-bold mb-4">Take beats on the go!</h2>
                    <p className="text-white/60 mb-8">Pay via multiple payment methods, all at Mormat Waves marketplace.</p>

                    <div className="flex flex-wrap justify-center gap-4 mb-16">
                        {['Credit Card', 'UPI', 'Discover', 'Mastercard', 'Visa', 'Amex'].map((brand) => (
                            <div key={brand} className="bg-white/5 border border-white/10 rounded px-4 py-2 flex items-center gap-2">
                                <CreditCard size={16} className="text-white/60" />
                                <span className="text-xs font-bold text-white/80">{brand}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-12">
                        <div className="relative w-64 h-[500px] border-4 border-[#222] rounded-[3rem] bg-black overflow-hidden shadow-2xl rotate-[-5deg] hover:rotate-0 transition-all duration-500">
                            {/* Phone screen simulation */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#222] rounded-b-xl z-20"></div>
                            <div className="w-full h-full bg-primary/10 pt-12 px-4">
                                <div className="w-full h-32 bg-primary/80 rounded-xl mb-4 animate-pulse opacity-50"></div>
                                <div className="w-full h-12 bg-white/10 rounded-lg mb-2"></div>
                                <div className="w-full h-12 bg-white/10 rounded-lg mb-2"></div>
                                <div className="w-full h-12 bg-white/10 rounded-lg mb-2"></div>
                            </div>
                        </div>
                        <div className="relative w-64 h-[500px] border-4 border-[#222] rounded-[3rem] bg-black overflow-hidden shadow-2xl translate-y-12 rotate-[5deg] hover:rotate-0 transition-all duration-500">
                            {/* Phone screen simulation */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#222] rounded-b-xl z-20"></div>
                            <div className="w-full h-full bg-primary/20 pt-12 px-4">
                                <div className="w-full h-48 bg-primary rounded-xl mb-4 animate-pulse opacity-50"></div>
                                <div className="w-2/3 h-4 bg-white/20 rounded mb-2"></div>
                                <div className="w-1/2 h-4 bg-white/20 rounded mb-8"></div>
                                <div className="w-full h-12 bg-primary/90 rounded-full flex items-center justify-center text-sm font-bold">Play Beat</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 3: Monetization CTA */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-24 flex flex-col md:flex-row items-center gap-16">
                <div className="flex-1">
                    <h2 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
                        YOUR BEATS NEED ATTENTION AND <br />
                        MOST IMPORTANTLY <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">MONETIZATION</span>
                    </h2>
                    <p className="text-xl text-white/60 mb-8">Get paid directly to your bank account.</p>
                    <button className="bg-transparent border border-primary hover:bg-primary/10 text-primary font-medium px-8 py-4 rounded-xl transition-all flex items-center gap-3">
                        <Upload size={20} /> Start Selling Now
                    </button>
                </div>
                <div className="flex-1 relative">
                    {/* Abstract Dashboard Graphic */}
                    <div className="bg-card border border-white/5 rounded-xl p-6 shadow-2xl w-full max-w-lg mx-auto transform hover:scale-105 transition-transform duration-500">
                        <div className="flex items-center justify-between mb-8">
                            <div className="space-y-1">
                                <div className="w-24 h-2 bg-white/10 rounded"></div>
                                <div className="w-16 h-2 bg-white/10 rounded"></div>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-primary/20"></div>
                        </div>
                        <div className="flex gap-4 mb-8">
                            <div className="flex-1 bg-white/5 rounded-lg p-4 h-32 relative overflow-hidden">
                                <span className="text-xs text-white/40">Revenue</span>
                                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-primary/20 to-transparent"></div>
                            </div>
                            <div className="flex-1 bg-white/5 rounded-lg p-4 h-32 relative overflow-hidden">
                                <span className="text-xs text-white/40">Sales</span>
                                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-orange-400/20 to-transparent"></div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-12 bg-white/5 rounded-lg flex items-center px-4 justify-between">
                                    <div className="w-32 h-2 bg-white/10 rounded"></div>
                                    <div className="w-12 h-4 bg-primary/20 rounded"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 4: Links */}
            <div className="bg-background pt-20 pb-12 px-4 md:px-8 border-t border-white/5">
                <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
                    <div className="col-span-2 lg:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="relative w-8 h-8">
                                <Image src="/logo.png" alt="Logo" fill className="object-contain" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight">Mormat</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-bold text-lg mb-2">Company</h4>
                        <ul className="space-y-2 text-sm text-white/40">
                            <li><Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
                            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/refund" className="hover:text-white transition-colors">Refund Policy</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-bold text-lg mb-2">Support</h4>
                        <ul className="space-y-2 text-sm text-white/40">
                            <li><Link href="/blog" className="hover:text-white transition-colors">License Blog</Link></li>
                            <li><a href="#" className="hover:text-white transition-colors">WhatsApp Support</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Help Desk</a></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-bold text-lg mb-2">Explore</h4>
                        <ul className="space-y-2 text-sm text-white/40">
                            <li><Link href="#" className="hover:text-white transition-colors">WAV under ₹999</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Wav + Stems under ₹1,999</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Beat With Exclusive</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Trending Beats</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                        </ul>
                    </div>

                    <div className="col-span-2 lg:col-span-1">
                        <div className="bg-white/5 border border-white/10 rounded-lg p-1 flex items-center mb-8">
                            <input type="text" placeholder="Search top beats" className="bg-transparent border-none outline-none text-sm px-3 py-2 flex-1 w-full" />
                            <div className="bg-primary px-3 py-1.5 rounded text-xs font-medium cursor-pointer">General</div>
                        </div>

                        <h5 className="font-bold text-sm mb-4">We accept following payment systems</h5>
                        <div className="grid grid-cols-3 gap-2 mb-8">
                            {['Card', 'UPI', 'Disc', 'Master', 'Visa', 'Amex'].map((brand) => (
                                <div key={brand} className="bg-white/5 rounded h-8 flex items-center justify-center text-[10px] border border-white/5">
                                    {brand}
                                </div>
                            ))}
                        </div>

                        <h5 className="font-bold text-sm mb-4">Follow Us</h5>
                        <div className="flex gap-4 text-white/60">
                            <Facebook size={18} className="hover:text-white cursor-pointer" />
                            <Instagram size={18} className="hover:text-white cursor-pointer" />
                            <Twitter size={18} className="hover:text-white cursor-pointer" />
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
                    <p>Mormat Waves Productions Private Limited</p>
                    <p>2026 All Rights Reserved</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
