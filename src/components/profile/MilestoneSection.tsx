
import React from 'react';
import { Gift, Lock, CheckCircle, Trophy } from 'lucide-react';

interface MilestoneProps {
    totalSpent: number;
}

const MilestoneSection: React.FC<MilestoneProps> = ({ totalSpent }) => {
    const milestones = [
        {
            id: 1,
            target: 5000,
            reward: '3 Months Free Music Distribution',
            description: 'Spend ₹5,000 to unlock',
        },
        {
            id: 2,
            target: 9000,
            reward: '3 Months Free Music Distribution',
            description: 'Spend ₹9,000 to unlock',
        },
    ];

    return (
        <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-6">
                <Trophy className="text-yellow-500" size={24} />
                <h3 className="text-xl font-bold">Milestones & Rewards</h3>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {milestones.map((milestone) => {
                    const progress = Math.min((totalSpent / milestone.target) * 100, 100);
                    const isUnlocked = totalSpent >= milestone.target;

                    return (
                        <div
                            key={milestone.id}
                            className={`relative overflow-hidden rounded-xl border ${isUnlocked ? 'border-yellow-500/50 bg-yellow-500/5' : 'border-white/10 bg-white/5'
                                } p-5 transition-all duration-300`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-black/40 rounded-lg">
                                    <Gift size={24} className={isUnlocked ? 'text-yellow-400' : 'text-white/40'} />
                                </div>
                                {isUnlocked ? (
                                    <div className="flex items-center gap-1 text-green-400 text-xs font-bold bg-green-400/10 px-2 py-1 rounded-full">
                                        <CheckCircle size={12} />
                                        COMPLETED
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1 text-white/40 text-xs font-bold bg-white/5 px-2 py-1 rounded-full">
                                        <Lock size={12} />
                                        LOCKED
                                    </div>
                                )}
                            </div>

                            <h4 className="font-bold text-lg mb-1">{milestone.reward}</h4>
                            <p className="text-sm text-white/50 mb-4">{milestone.description}</p>

                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-medium">
                                    <span className="text-white/60">Progress</span>
                                    <span className={isUnlocked ? 'text-yellow-400' : 'text-white/60'}>
                                        ₹{totalSpent.toLocaleString()} / ₹{milestone.target.toLocaleString()}
                                    </span>
                                </div>
                                <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${isUnlocked ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-orange-600'
                                            }`}
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>

                            {isUnlocked && (
                                <button
                                    onClick={() => alert('Reward claimed successfully! Check your email for details.')}
                                    className="mt-4 w-full py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-lg transition-all active:scale-95"
                                >
                                    Claim Reward
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MilestoneSection;
