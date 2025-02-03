import { PlayCircle, Trophy, PiggyBank } from 'lucide-react';

export const RewardFeatures = () => {
  return (
    <div className="space-y-16 border-t border-gray-700 pt-16">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-koya-card p-6 rounded-lg space-y-4">
          <PlayCircle className="w-12 h-12 text-koya-accent" />
          <h3 className="text-xl font-bold">Watch Movies</h3>
          <p>Stream your favorite Nollywood content like you always do. Every minute counts towards your earnings.</p>
        </div>
        <div className="bg-koya-card p-6 rounded-lg space-y-4">
          <Trophy className="w-12 h-12 text-koya-accent" />
          <h3 className="text-xl font-bold">Earn Points</h3>
          <p>Accumulate Ekowest coins based on your watch time. Bonus points for completing movies and sharing reviews!</p>
        </div>
        <div className="bg-koya-card p-6 rounded-lg space-y-4">
          <PiggyBank className="w-12 h-12 text-koya-accent" />
          <h3 className="text-xl font-bold">Get Paid</h3>
          <p>Convert your coins to real money - Naira, Dollars, or Pounds. Withdraw straight to your bank account!</p>
        </div>
      </div>
    </div>
  );
};