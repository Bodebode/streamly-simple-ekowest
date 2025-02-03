import { useRewardsStore } from '@/stores/rewards-store';
import { Award, Shield, Star, Video } from 'lucide-react';
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
      name: 'Ad-Free Watching',
      cost: 37500, // £15 equivalent
      icon: Video,
      features: [
        'Remove all ads during video playback',
        'Unlock premium movie access',
        'Uninterrupted viewing experience',
        'Access exclusive content and features',
        'Support content creators while enjoying ad-free content'
      ]
    },
    {
      name: 'VIP Creator Package',
      cost: 75000, // £30 equivalent
      icon: Star,
      features: [
        'All Ad-Free Watching features included',
        'Exclusive chat rooms with creators',
        'Priority customer support',
        'Special badge on your profile',
        'Monthly newsletter from favorite creators',
        'Direct tip to content creators',
        'Early access to upcoming content and events'
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