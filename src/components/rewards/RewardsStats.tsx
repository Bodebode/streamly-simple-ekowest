import { Trophy, Clock } from 'lucide-react';

interface RewardsStatsProps {
  points: number;
  watchTime: number;
}

export const RewardsStats = ({ points, watchTime }: RewardsStatsProps) => {
  return (
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
  );
};