import { Coins, DollarSign } from 'lucide-react';

export const EarningPotential = () => {
  return (
    <div className="bg-koya-card p-8 rounded-lg">
      <h2 className="text-3xl font-bold mb-6">Earning Potential</h2>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Coins className="text-koya-accent" />
          <p>Earn 10 coins per minute of watch time</p>
        </div>
        <div className="flex items-center gap-4">
          <DollarSign className="text-koya-accent" />
          <p>1000 coins = ₦500 / $0.50 / £0.40</p>
        </div>
        <div className="border-t border-gray-700 pt-4 mt-6">
          <p className="text-lg">Watch just 2 hours daily to earn up to ₦15,000 monthly!</p>
        </div>
      </div>
    </div>
  );
};