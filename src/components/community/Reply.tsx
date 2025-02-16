import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { User } from '@supabase/supabase-js';
import { MoreVertical, Trash2, Edit } from 'lucide-react';
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

interface ReplyProps {
  reply: {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    is_edited: boolean;
    profiles: {
      username: string;
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
  const isOwner = currentUser?.id === reply.user_id;

  const handleUpdate = () => {
    onUpdate(reply.id, editContent);
    setIsEditing(false);
  };

  const getAvatarUrl = (avatarPath: string | null) => {
    if (!avatarPath) return null;
    return getStorageUrl('avatars', avatarPath);
  };

  return (
    <div className="pl-8 pt-2 border-l border-border">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={getAvatarUrl(reply.profiles?.avatar_url) || undefined} />
            <AvatarFallback>
              {reply.profiles?.username?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="text-sm font-semibold">
              {reply.profiles?.username || 'Anonymous'}
            </h4>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
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
