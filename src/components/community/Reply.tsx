
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { User } from '@supabase/supabase-js';
import { MoreVertical, Trash2, Edit, Pin, PinOff } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { getStorageUrl } from '@/utils/supabase-url';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ReplyProps {
  reply: {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    is_edited: boolean;
    is_pinned: boolean | null;
    profiles: {
      username: string;
      display_name?: string;
      avatar_url: string | null;
    } | null;
  };
  currentUser: User | null;
  onDelete: (replyId: string) => void;
  onUpdate: (replyId: string, content: string) => void;
}

export const Reply = ({ reply, currentUser, onDelete, onUpdate }: ReplyProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(reply.content);
  const [isPinned, setIsPinned] = useState(reply.is_pinned || false);
  const isOwner = currentUser?.id === reply.user_id;
  const { toast } = useToast();

  const handleUpdate = () => {
    onUpdate(reply.id, editContent);
    setIsEditing(false);
  };

  const togglePin = async () => {
    try {
      const { error } = await supabase
        .from('post_replies')
        .update({ is_pinned: !isPinned })
        .eq('id', reply.id);

      if (error) throw error;

      setIsPinned(!isPinned);
      toast({
        title: isPinned ? "Reply unpinned" : "Reply pinned",
        description: isPinned ? "The reply has been unpinned." : "The reply has been pinned to the top.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update pin status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getAvatarUrl = (avatarPath: string | null) => {
    if (!avatarPath) return null;
    return getStorageUrl('avatars', avatarPath);
  };

  return (
    <div className={`pl-8 pt-2 border-l border-border ${isPinned ? 'bg-muted/30' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={getAvatarUrl(reply.profiles?.avatar_url) || undefined} />
            <AvatarFallback>
              {(reply.profiles?.display_name?.[0] || reply.profiles?.username?.[0] || 'U').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold">
                {reply.profiles?.display_name || reply.profiles?.username || 'Anonymous'}
              </h4>
              {isPinned && (
                <Pin className="h-3 w-3 text-muted-foreground" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              @{reply.profiles?.username || 'anonymous'} · {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
              {reply.is_edited && ' (edited)'}
            </p>
          </div>
        </div>
        {isOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Edit className="h-3 w-3 mr-1.5" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={togglePin}>
                {isPinned ? (
                  <>
                    <PinOff className="h-3 w-3 mr-1.5" />
                    Unpin
                  </>
                ) : (
                  <>
                    <Pin className="h-3 w-3 mr-1.5" />
                    Pin
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(reply.id)}
              >
                <Trash2 className="h-3 w-3 mr-1.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      {isEditing ? (
        <div className="mt-1.5 space-y-1.5">
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="min-h-[60px]"
          />
          <div className="flex justify-end gap-1.5">
            <Button
              variant="outline"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => {
                setIsEditing(false);
                setEditContent(reply.content);
              }}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={handleUpdate}
              disabled={!editContent.trim() || editContent === reply.content}
            >
              Save
            </Button>
          </div>
        </div>
      ) : (
        <p className="mt-1 text-sm text-foreground">{reply.content}</p>
      )}
    </div>
  );
};
