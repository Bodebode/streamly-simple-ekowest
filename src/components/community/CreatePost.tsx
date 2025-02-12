
import { useState, useRef } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PenLine, Loader2, ImagePlus, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CATEGORIES = [
  'General',
  'Reviews',
  'Recommendations',
  'News',
  'Discussion',
  'Other'
];

interface CreatePostProps {
  onNewPost?: (post: any) => void;
}

export const CreatePost = ({ onNewPost }: CreatePostProps) => {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Error",
          description: "Image size should be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      setSelectedImage(file);
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !selectedImage) return;

    setIsSubmitting(true);
    try {
      let imageUrl = null;

      if (selectedImage) {
        const fileExt = selectedImage.name.split('.').pop();
        const filePath = `${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('post_images')
          .upload(filePath, selectedImage);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('post_images')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      const postData = {
        content: content.trim(),
        user_id: user?.id,
        category: category || 'General',
        image_url: imageUrl,
      };

      // Create an optimistic post with temporary ID and user profile data
      const optimisticPost = {
        ...postData,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        likes_count: 0,
        replies_count: 0,
        profiles: {
          username: user?.user_metadata?.username || user?.email,
          avatar_url: user?.user_metadata?.avatar_url,
        }
      };

      // Call onNewPost immediately for instant UI update
      onNewPost?.(optimisticPost);

      // Clear the form
      setContent('');
      setCategory('');
      removeImage();

      // Then perform the actual database insert
      const { error } = await supabase
        .from('posts')
        .insert([postData]);

      if (error) throw error;

      toast({
        title: "Post created",
        description: "Your post has been shared with the community.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-lg p-4 space-y-4">
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <Textarea
              placeholder="Share your thoughts about African cinema..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyPress}
              className="min-h-[60px] resize-none bg-background"
            />
          </div>
        </div>

        {imagePreview && (
          <div className="relative inline-block">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="max-h-32 rounded-lg"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="flex justify-end items-center gap-4">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImagePlus className="h-4 w-4" />
          </Button>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            type="submit" 
            disabled={isSubmitting || (!content.trim() && !selectedImage)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <PenLine className="h-4 w-4 mr-2" />
            )}
            Post
          </Button>
        </div>
      </div>
    </form>
  );
};
