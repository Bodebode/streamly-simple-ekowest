import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';

interface Reward {
  name: string;
  cost: number;
  icon: any;
  features: string[];
}

interface PremiumFeaturesProps {
  rewards: Reward[];
  points: number;
  formatCurrency: (ecoins: number) => string;
}

export const PremiumFeatures = ({ rewards, points, formatCurrency }: PremiumFeaturesProps) => {
  const { session } = useAuth();
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number }>({ 
    days: 60, 
    hours: 0, 
    minutes: 0 
  });

  useEffect(() => {
    // Set end date to 2 months from now
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 2);

    const timer = setInterval(() => {
      const now = new Date();
      const difference = endDate.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(timer);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeft({ days, hours, minutes });
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const handlePurchase = async (reward: Reward) => {
    if (!session?.user) {
      toast.error('Please login to make a purchase');
      return;
    }

    // If it's the Standard Reward during promotion period, handle it differently
    if (reward.name === 'Standard Reward') {
      toast.success('Standard Reward activated! Enjoy your free trial.');
      return;
    }

    try {
      const toastId = toast.loading('Processing your purchase...');
      
      const { data, error } = await supabase.functions.invoke('create-paypal-order', {
        body: {
          reward_id: reward.name,
          amount: (reward.cost / 1000) * 0.5,
          currency: navigator.language.includes('NG') ? 'NGN' : 'USD',
          user_id: session.user.id
        },
      });

      if (error) {
        toast.dismiss(toastId);
        toast.error('Failed to create payment order: ' + error.message);
        return;
      }

      if (!data?.id || !data?.links) {
        toast.dismiss(toastId);
        toast.error('Invalid payment response received');
        return;
      }

      const approveLink = data.links.find((link: any) => link.rel === 'approve')?.href;
      if (!approveLink) {
        toast.dismiss(toastId);
        toast.error('Payment link not found');
        return;
      }

      toast.dismiss(toastId);
      window.location.href = approveLink;
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to process payment. Please try again.');
    }
  };

  return (
    <div className="bg-white dark:bg-koya-card rounded-lg p-6 mb-16">
      <h2 className="text-2xl font-semibold mb-6">Premium Features</h2>
      <div className="grid gap-4">
        {rewards.map((reward) => (
          <div 
            key={reward.name} 
            className="flex items-center justify-between p-4 border rounded-lg 
                     transition-all duration-300 ease-in-out
                     hover:scale-[1.02] hover:shadow-lg hover:border-koya-accent
                     hover:bg-white/5"
          >
            <div className="flex items-center gap-4">
              <reward.icon className="h-6 w-6 text-koya-accent transition-transform duration-300 group-hover:scale-110" />
              <div>
                <span className="font-medium">{reward.name}</span>
                {reward.name === 'Standard Reward' && (
                  <div className="mt-1 text-sm text-green-500 font-medium">
                    Limited Time Offer: 100% OFF! 
                    <div className="text-xs text-gray-500">
                      Offer ends in: {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
                    </div>
                  </div>
                )}
                <ul className="mt-2 space-y-1">
                  {reward.features.map((feature, index) => (
                    <li 
                      key={index} 
                      className="flex items-center gap-2 text-sm text-muted-foreground
                               transition-opacity duration-200 hover:opacity-100"
                    >
                      <Check className="h-4 w-4 text-koya-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                {reward.name === 'Standard Reward' ? (
                  <>
                    <div className="font-semibold line-through text-gray-500">
                      {reward.cost.toLocaleString()} E-coins
                    </div>
                    <div className="text-green-500 font-bold">FREE</div>
                  </>
                ) : (
                  <>
                    <div className="font-semibold">{reward.cost.toLocaleString()} E-coins</div>
                    <div className="text-sm text-muted-foreground">≈ {formatCurrency(reward.cost)}</div>
                  </>
                )}
              </div>
              <Button 
                type="button"
                variant={points >= reward.cost ? "default" : "secondary"}
                onClick={() => handlePurchase(reward)}
                className={`transition-all duration-300 hover:scale-105 ${
                  reward.name === 'Standard Reward' ? 'bg-green-500 hover:bg-green-600' : ''
                }`}
              >
                {reward.name === 'Standard Reward' ? 'Claim Now' : 'Buy Now'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};