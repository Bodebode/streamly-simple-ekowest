
import { Trophy, Gift } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProfileRewardsProps {
  points: number;
}

export const ProfileRewards = ({ points }: ProfileRewardsProps) => {
  const rewards = [
    { name: 'Premium Movie Access', cost: 100, icon: Trophy },
    { name: 'Ad-Free Watching', cost: 200, icon: Gift },
    { name: 'Exclusive Content', cost: 500, icon: Gift }
  ];

  return (
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
  );
};
