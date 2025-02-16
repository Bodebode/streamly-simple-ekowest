
import { User, ArrowLeft, Camera, Mail, Calendar, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { getStorageUrl } from "@/utils/supabase-url";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProfileData {
  username: string | null;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
}

interface ProfileHeaderProps {
  user: SupabaseUser | null;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  uploading: boolean;
}

export const ProfileHeader = ({ user, handleFileUpload, uploading }: ProfileHeaderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    username: null,
    email: null,
    display_name: null,
    avatar_url: null,
  });

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, email, display_name, avatar_url')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      if (data) {
        setProfileData(data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: profileData.username,
          display_name: profileData.display_name,
        })
        .eq('id', user.id);

      if (error) throw error;

      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Button 
        variant="ghost" 
        className="mb-4"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0 relative">
          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {profileData.avatar_url ? (
              <img 
                src={getStorageUrl('avatars', profileData.avatar_url)}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-16 h-16 text-gray-400" />
            )}
          </div>
          <label 
            htmlFor="avatar-upload" 
            className="absolute bottom-0 right-0 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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
        <div className="space-y-4 flex-1">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              {isEditing ? (
                <div className="space-y-2">
                  <Input
                    placeholder="Display name"
                    value={profileData.display_name || ''}
                    onChange={(e) => setProfileData(prev => ({ ...prev, display_name: e.target.value }))}
                    className="max-w-md"
                  />
                  <Input
                    placeholder="Username"
                    value={profileData.username || ''}
                    onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                    className="max-w-md"
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-semibold">
                    {profileData.display_name || profileData.username || 'User'}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    @{profileData.username || 'username'}
                  </p>
                </>
              )}
            </div>
            {!isEditing ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            ) : (
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                >
                  Save
                </Button>
              </div>
            )}
          </div>
          <div>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </p>
            <p className="text-lg font-medium">{profileData.email || user?.email}</p>
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
    </>
  );
};
