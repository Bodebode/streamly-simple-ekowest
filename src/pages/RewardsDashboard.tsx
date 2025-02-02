import { useRewardsStore } from '@/stores/rewards-store';
import { Button } from '@/components/ui/button';
import { Trophy, Clock, Gift, Home, PlayCircle, PiggyBank, Coins, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RewardsDashboard = () => {
  const { points, watchTime } = useRewardsStore();

  const rewards = [
    { name: 'Premium Movie Access', cost: 100, icon: Trophy },
    { name: 'Ad-Free Watching', cost: 200, icon: Gift },
    { name: 'Exclusive Content', cost: 500, icon: Gift }
  ];

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Your Rewards Dashboard</h1>
          <Button variant="outline" size="sm" asChild>
            <Link to="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-koya-card rounded-lg p-6">
            <div className="flex items-center gap-4">
              <Trophy className="h-8 w-8 text-koya-accent" />
              <div>
                <h3 className="text-lg font-semibold">Total Points</h3>
                <p className="text-3xl font-bold text-koya-accent">{points}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-koya-card rounded-lg p-6">
            <div className="flex items-center gap-4">
              <Clock className="h-8 w-8 text-koya-accent" />
              <div>
                <h3 className="text-lg font-semibold">Watch Time</h3>
                <p className="text-3xl font-bold text-koya-accent">{watchTime} min</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-koya-card rounded-lg p-6 mb-16">
          <h2 className="text-2xl font-semibold mb-6">Available Rewards</h2>
          <div className="grid gap-4">
            {rewards.map((reward) => (
              <div key={reward.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <reward.icon className="h-6 w-6 text-koya-accent" />
                  <span className="font-medium">{reward.name}</span>
                </div>
                <Button 
                  disabled={points < reward.cost}
                  variant={points >= reward.cost ? "default" : "outline"}
                >
                  {reward.cost} Points
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Marketing Content Section */}
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
        </div>
      </div>
    </div>
  );
};

export default RewardsDashboard;