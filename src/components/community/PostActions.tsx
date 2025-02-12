
import { ThumbsUp, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PostActionsProps {
  likesCount: number;
  repliesCount: number;
  isLiked: boolean;
  onLike: () => void;
  onToggleReplies: () => void;
}

export const PostActions = ({
  likesCount,
  repliesCount,
  isLiked,
  onLike,
  onToggleReplies,
}: PostActionsProps) => {
  return (
    <div className="flex items-center space-x-4 pt-2">
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "space-x-2",
          isLiked && "text-pink-500 hover:text-pink-600"
        )}
        onClick={onLike}
      >
        <ThumbsUp className="h-4 w-4" />
        <span>{likesCount || 0}</span>
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="space-x-2"
        onClick={onToggleReplies}
      >
        <MessageSquare className="h-4 w-4" />
        <span>{repliesCount || 0}</span>
      </Button>
    </div>
  );
};
