import { useRewardsStore } from '@/stores/rewards-store';
import { Button } from '@/components/ui/button';
import { Trophy, Clock, Gift, Home, PlayCircle, PiggyBank, Coins, DollarSign, Users, Shield, Star, Check, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMemo } from 'react';

// Exchange rates (you might want to fetch these from an API in a production environment)
const EXCHANGE_RATES = {
  USD: 1,
  NGN: 1000, // 1 USD = 1000 NGN (approximate)
  GBP: 0.8,  // 1 USD = 0.8 GBP (approximate)
  EUR: 0.92, // 1 USD = 0.92 EUR (approximate)
};

export const RewardsDashboard = () => {
  const { points, watchTime } = useRewardsStore();

  // Get user's country (in a real app, you'd get this from a geolocation service or user settings)
  const userCountry = navigator.language || 'en-US';

  const formatCurrency = (ecoins: number) => {
    const baseUSDPrice = (ecoins / 1000) * 0.5; // 1000 coins = $0.50
    
    if (userCountry.includes('NG')) {
      return `₦${(baseUSDPrice * EXCHANGE_RATES.NGN).toLocaleString()}`;
    } else if (userCountry.includes('GB')) {
      return `£${(baseUSDPrice * EXCHANGE_RATES.GBP).toLocaleString()}`;
    } else if (userCountry.includes('EU')) {
      return `€${(baseUSDPrice * EXCHANGE_RATES.EUR).toLocaleString()}`;
    }
    // Default to USD
    return `$${baseUSDPrice.toLocaleString()}`;
  };

  const rewards = [
    { 
      name: 'Premium Movie Access', 
      cost: 20000, 
      icon: Trophy,
      features: ['Unlock exclusive content and features']
    },
    { 
      name: 'Ad-Free Watching', 
      cost: 30000, 
      icon: Gift,
      features: ['Remove all ads during video playback']
    },
    {
      name: 'VIP Community Pass',
      cost: 35000,
      icon: Shield,
      features: [
        'Premium Movie Access inclusive',
        'Go Ad-Free on all contents',
        'Unlock exclusive content and features',
        'Exclusive chat rooms with creators',
        'Priority customer support',
        'Early scope upcoming content'
      ]
    },
    {
      name: 'Creator Support Package',
      cost: 60000,
      icon: Star,
      features: [
        'VIP Community Pass inclusive',
        'Direct tip to content creators',
        'Unlock exclusive content and features',
        'Go completely Ad-Free on all contents including page',
        'Special badge on your profile',
        'Monthly newsletter from favorite creators'
      ]
    }
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
          <h2 className="text-2xl font-semibold mb-6">Premium Features</h2>
          <div className="grid gap-4">
            {rewards.map((reward) => (
              <div key={reward.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <reward.icon className="h-6 w-6 text-koya-accent" />
                  <div>
                    <span className="font-medium">{reward.name}</span>
                    <ul className="mt-2 space-y-1">
                      {reward.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check className="h-4 w-4 text-koya-accent" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-semibold">{reward.cost.toLocaleString()} E-coins</div>
                    <div className="text-sm text-muted-foreground">≈ {formatCurrency(reward.cost)}</div>
                  </div>
                  <Button 
                    variant="default"
                    disabled={points < reward.cost}
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

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