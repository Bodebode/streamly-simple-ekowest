import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRewardsStore } from "@/stores/rewards-store";
import { Trophy, Clock, Gift, Mail, Calendar, User, ArrowLeft, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const Profile = () => {
  const { user } = useAuth();
  const { points, watchTime } = useRewardsStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const rewards = [
    { name: 'Premium Movie Access', cost: 100, icon: Trophy },
    { name: 'Ad-Free Watching', cost: 200, icon: Gift },
    { name: 'Exclusive Content', cost: 500, icon: Gift }
  ];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      
      if (!file) return;
      
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file",
          variant: "destructive",
        });
        return;
      }

      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: filePath })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile picture",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Profile Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-shrink-0 relative">
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {user?.user_metadata?.avatar_url ? (
                    <img 
                      src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/avatars/${user.user_metadata.avatar_url}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-gray-400" />
                  )}
                </div>
                <label 
                  htmlFor="avatar-upload" 
                  className="absolute bottom-0 right-0 p-2 bg-white dark:bg-koya-card rounded-full shadow-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Camera className="h-4 w-4" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                </label>
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
