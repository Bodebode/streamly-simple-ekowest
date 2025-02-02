import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRewardsStore } from "@/stores/rewards-store";
import { Trophy, Clock, Gift, Mail, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

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
        {/* Profile Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-16 h-16 text-gray-400" />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Username</p>
                  <p className="text-lg font-medium">{user?.email?.split('@')[0]}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </p>
                  <p className="text-lg font-medium">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Member Since
                  </p>
                  <p className="text-lg font-medium">
                    {format(new Date(user?.created_at || new Date()), 'MMMM dd, yyyy')}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rewards Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Trophy className="h-8 w-8 text-yellow-500" />
                <div>
                  <h3 className="text-lg font-semibold">Total Points</h3>
                  <p className="text-3xl font-bold text-yellow-500">{points}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Clock className="h-8 w-8 text-blue-500" />
                <div>
                  <h3 className="text-lg font-semibold">Watch Time</h3>
                  <p className="text-3xl font-bold text-blue-500">{watchTime} min</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Available Rewards */}
        <Card>
          <CardHeader>
            <CardTitle>Available Rewards</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;