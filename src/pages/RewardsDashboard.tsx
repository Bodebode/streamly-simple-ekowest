import { useRewardsStore } from '@/stores/rewards-store';
import { Award, Shield, Star, Video } from 'lucide-react';
import { RewardsHeader } from '@/components/rewards/RewardsHeader';
import { RewardsStats } from '@/components/rewards/RewardsStats';
import { PremiumFeatures } from '@/components/rewards/PremiumFeatures';
import { RewardFeatures } from '@/components/rewards/RewardFeatures';
import { EarningPotential } from '@/components/rewards/EarningPotential';

export const RewardsDashboard = () => {
  const { points, watchTime } = useRewardsStore();
  
  // Check both language and timezone for more accurate location detection
  const userLanguage = navigator.language || 'en-US';
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const isNigerianTimezone = userTimezone.includes('Lagos') || userTimezone.includes('Africa/Lagos');
  const isNigerianLanguage = userLanguage.includes('NG') || userLanguage.includes('ng');

  const EXCHANGE_RATES = {
    USD: 1,
    NGN: 1000,
    GBP: 0.8,
    EUR: 0.92,
  };

  const formatCurrency = (ecoins: number) => {
    const baseUSDPrice = (ecoins / 1000) * 0.5;
    
    // Prioritize Nigerian users based on either timezone or language
    if (isNigerianTimezone || isNigerianLanguage) {
      return `₦${(baseUSDPrice * EXCHANGE_RATES.NGN).toLocaleString()}`;
    } else if (userLanguage.includes('GB')) {
      return `£${(baseUSDPrice * EXCHANGE_RATES.GBP).toLocaleString()}`;
    } else if (userLanguage.includes('EU')) {
      return `€${(baseUSDPrice * EXCHANGE_RATES.EUR).toLocaleString()}`;
    }
    return `$${baseUSDPrice.toLocaleString()}`;
  };

  const rewards = [
    {
      name: 'Standard Reward',
      cost: 7500,
      icon: Award,
      features: [
        'Rewarding you for your time spent watching on Ekowest',
        'Earn points for every minute watched',
        'Track your watching progress and rewards'
      ]
    },
    {
      name: 'Premium Package',
      cost: 37500,
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
      cost: 75000,
      icon: Star,
      features: [
        'All Premium Package features included',
        'Exclusive chat rooms with creators',
        'Priority customer support',
        'Special badge on your profile',
        'Direct tip to content creators',
        'Early scoop on upcoming content and events',
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