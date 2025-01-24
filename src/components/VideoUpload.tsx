import { useState } from 'react';
import { Button } from './ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';

export const VideoUpload = () => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      
      if (!file) {
        toast.error('Please select a file to upload');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('video/')) {
        toast.error('Please upload a video file');
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('hero_videos')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('hero_videos')
        .getPublicUrl(filePath);

      toast.success('Video uploaded successfully!');
      
      // Refresh the page to show the new video
      window.location.reload();
    } catch (error) {
      console.error('Error uploading video:', error);
      toast.error('Error uploading video');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        id="video-upload"
        accept="video/*"
        onChange={handleUpload}
        className="hidden"
        disabled={uploading}
      />
      <label
        htmlFor="video-upload"
        className={`cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 ${
          uploading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <Upload className="w-4 h-4 mr-2" />
        {uploading ? 'Uploading...' : 'Upload Hero Video'}
      </label>
    </div>
  );
};