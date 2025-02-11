
import { User, ArrowLeft, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { getStorageUrl } from "@/utils/supabase-url";
import { Mail, Calendar } from "lucide-react";

interface ProfileHeaderProps {
  user: SupabaseUser | null;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  uploading: boolean;
}

export const ProfileHeader = ({ user, handleFileUpload, uploading }: ProfileHeaderProps) => {
  const navigate = useNavigate();

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
            {user?.user_metadata?.avatar_url ? (
              <img 
                src={getStorageUrl('avatars', user.user_metadata.avatar_url)}
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
    </>
  );
};
