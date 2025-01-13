import { Toast } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { Coins } from "lucide-react";

export const useRewardsToast = () => {
  const { toast } = useToast();

  const showRewardEarned = (points: number) => {
    toast({
      title: "Points Earned!",
      description: `You earned ${points} points for watching`,
      icon: <Coins className="h-4 w-4 text-yellow-500" />,
      duration: 3000,
    });
  };

  return { showRewardEarned };
};
