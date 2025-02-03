import { useRewardsStore } from '@/stores/rewards-store';
import { Award, Shield, Star, Trophy, Video } from 'lucide-react';
import { RewardsHeader } from '@/components/rewards/RewardsHeader';
import { RewardsStats } from '@/components/rewards/RewardsStats';
import { PremiumFeatures } from '@/components/rewards/PremiumFeatures';
import { RewardFeatures } from '@/components/rewards/RewardFeatures';
import { EarningPotential } from '@/components/rewards/EarningPotential';

export const RewardsDashboard = () => {
  const { points, watchTime } = useRewardsStore();
  const userCountry = navigator.language || 'en-US';

  const EXCHANGE_RATES = {
    USD: 1,
    NGN: 1000,
    GBP: 0.8,
    EUR: 0.92,
  };

  const formatCurrency = (ecoins: number) => {
    const baseUSDPrice = (ecoins / 1000) * 0.5;
    
    if (userCountry.includes('NG')) {
      return `₦${(baseUSDPrice * EXCHANGE_RATES.NGN).toLocaleString()}`;
    } else if (userCountry.includes('GB')) {
      return `£${(baseUSDPrice * EXCHANGE_RATES.GBP).toLocaleString()}`;
    } else if (userCountry.includes('EU')) {
      return `€${(baseUSDPrice * EXCHANGE_RATES.EUR).toLocaleString()}`;
    }
    return `$${baseUSDPrice.toLocaleString()}`;
  };

  const rewards = [
    {
      name: 'Standard_Reward',
      cost: 10000,
      icon: Award,
      features: [
        'Rewarding you for your time spent watching on Ekowest',
        'Earn points for every minute watched',
        'Track your watching progress and rewards'
      ]
    },
    { 
      name: 'Premium Movie Access', 
      cost: 20000, 
      icon: Trophy,
      features: ['Unlock exclusive content and features']
    },
    {
      name: 'Ad-Free Watching',
      cost: 30000,
      icon: Video,
      features: [
        'Remove all ads during video playback',
        'Uninterrupted viewing experience',
        'Support content creators while enjoying ad-free content'
      ]
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
        'Early scoop on upcoming content and events'
      ]
    },
    {
      name: 'Creator Support Package',
      cost: 60000,
      icon: Star,
      features: [
        'VIP Community Pass inclusive',
        'Unlock exclusive content and features',
        'Go completely Ad-Free on all contents including page',
        'Special badge on your profile',
        'Monthly newsletter from favorite creators',
        'Direct tip to content creators'
      ]
    }
  ];

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <RewardsHeader />
        <RewardsStats points={points} watchTime={watchTime} />
        <PremiumFeatures 
          rewards={rewards} 
          points={points} 
          formatCurrency={formatCurrency} 
        />
        <RewardFeatures />
        <div className="mt-16">
          <EarningPotential />
        </div>
      </div>
    </div>
  );
};

export default RewardsDashboard;