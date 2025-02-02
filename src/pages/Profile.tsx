import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { useRewardsStore } from '@/stores/rewards-store';
import { Trophy, Clock, Gift, User, Mail, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';

export const Profile = () => {
  const { user } = useAuth();
  const { points, watchTime } = useRewardsStore();

  const rewards = [
    { name: 'Premium Movie Access', cost: 100, icon: Trophy },
    { name: 'Ad-Free Watching', cost: 200, icon: Gift },
    { name: 'Exclusive Content', cost: 500, icon: Gift }
  ];

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Profile</h1>
        
        {/* User Profile Section */}
        <Card className="p-6 mb-8">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-gray-500 dark:text-gray-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold mb-4">{user?.email?.split('@')[0] || 'User'}</h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>Joined {format(new Date(user?.created_at || new Date()), 'MMMM yyyy')}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Rewards Dashboard Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Your Rewards</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <Trophy className="h-8 w-8 text-yellow-500" />
                <div>
                  <h3 className="text-lg font-semibold">Total Points</h3>
                  <p className="text-3xl font-bold text-yellow-500">{points}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <Clock className="h-8 w-8 text-blue-500" />
                <div>
                  <h3 className="text-lg font-semibold">Watch Time</h3>
                  <p className="text-3xl font-bold text-blue-500">{watchTime} min</p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6">Available Rewards</h3>
            <div className="grid gap-4">
              {rewards.map((reward) => (
                <div key={reward.name} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <reward.icon className="h-6 w-6 text-yellow-500" />
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
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;