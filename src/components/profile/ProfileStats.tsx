
import { Trophy, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ProfileStatsProps {
  points: number;
  watchTime: number;
}

export const ProfileStats = ({ points, watchTime }: ProfileStatsProps) => {
  return (
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
  );
};
