
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { User } from '@supabase/supabase-js';
import { MessageSquare, ThumbsUp, MoreVertical, Trash2, Edit } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PostProps {
  post: {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    likes_count: number;
    replies_count: number;
    profiles: {
      username: string;
      avatar_url: string | null;
    } | null;
  };
  currentUser: User | null;
  onDelete: (postId: string) => void;
}

export const Post = ({ post, currentUser, onDelete }: PostProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const { toast } = useToast();
  const isOwner = currentUser?.id === post.user_id;

  const handleLike = async () => {
    try {
      if (isLiked) {
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', post.id)
          .eq('user_id', currentUser?.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('post_likes')
          .insert([{ post_id: post.id, user_id: currentUser?.id }]);

        if (error) throw error;
      }
      setIsLiked(!isLiked);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update like status.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 space-y-4 transition-all duration-200 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={post.profiles?.avatar_url || undefined} />
            <AvatarFallback>
              {post.profiles?.username?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-foreground">
              {post.profiles?.username || 'Anonymous'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>
        {isOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(post.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <p className="text-foreground whitespace-pre-wrap">{post.content}</p>
      <div className="flex items-center space-x-4 pt-2">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "space-x-2",
            isLiked && "text-pink-500 hover:text-pink-600"
          )}
          onClick={handleLike}
        >
          <ThumbsUp className="h-4 w-4" />
          <span>{post.likes_count || 0}</span>
        </Button>
        <Button variant="ghost" size="sm" className="space-x-2">
          <MessageSquare className="h-4 w-4" />
          <span>{post.replies_count || 0}</span>
        </Button>
      </div>
    </div>
  );
};
