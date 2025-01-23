import { useRewardsStore } from '@/stores/rewards-store';
import { Button } from '@/components/ui/button';
import { Trophy, Clock, Gift, Home } from 'lucide-react';
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

        <div className="bg-white dark:bg-koya-card rounded-lg p-6">
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
      </div>
    </div>
  );
};

export default RewardsDashboard;