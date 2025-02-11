
import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PenLine, Loader2 } from 'lucide-react';

export const CreatePost = () => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('posts')
        .insert([{ content: content.trim(), user_id: user?.id }]);

      if (error) throw error;

      setContent('');
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
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <Textarea
            placeholder="Share your thoughts about African cinema..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px] resize-none bg-background"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isSubmitting || !content.trim()}
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
    </form>
  );
};
