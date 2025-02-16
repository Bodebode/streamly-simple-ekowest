import { useState, useRef, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { User } from '@supabase/supabase-js';
import { MessageSquare, ThumbsUp, MoreVertical, Trash2, Edit, Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Reply } from './Reply';
import { getStorageUrl } from '@/utils/supabase-url';

interface PostProps {
  post: {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    likes_count: number;
    replies_count: number;
    category?: string;
    tags?: string[];
    is_edited?: boolean;
    image_url?: string | null;
    profiles: {
      username: string;
      display_name?: string;
      avatar_url: string | null;
      bio?: string;
      location?: string;
      website?: string;
    } | null;
  };
  currentUser: User | null;
  onDelete: (postId: string) => void;
}

export const Post = ({ post, currentUser, onDelete }: PostProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<any[]>([]);
  const [newReply, setNewReply] = useState('');
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);
  const { toast } = useToast();
  const isOwner = currentUser?.id === post.user_id;
  const replyInputRef = useRef<HTMLTextAreaElement>(null);

  const fetchReplies = async () => {
    if (!showReplies) return;
    
    setIsLoadingReplies(true);
    try {
      const { data, error } = await supabase
        .from('post_replies')
        .select(`
          *,
          profiles:user_id (
            username,
            display_name,
            avatar_url
          )
        `)
        .eq('post_id', post.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setReplies(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load replies.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingReplies(false);
    }
  };

  useEffect(() => {
    if (showReplies) {
      fetchReplies();
    }
  }, [showReplies]);

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

  const handleUpdate = async () => {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ 
          content: editContent,
          is_edited: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', post.id);

      if (error) throw error;

      setIsEditing(false);
      toast({
        title: "Success",
        description: "Post updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update post.",
        variant: "destructive",
      });
    }
  };

  const handleReply = async () => {
    if (!newReply.trim()) return;

    try {
      // First get the current user's profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', currentUser?.id)
        .single();

      if (profileError) throw profileError;

      const { error } = await supabase
        .from('post_replies')
        .insert([{
          content: newReply.trim(),
          post_id: post.id,
          user_id: currentUser?.id
        }]);

      if (error) throw error;

      // Add optimistic reply
      setReplies([...replies, {
        id: crypto.randomUUID(),
        content: newReply.trim(),
        created_at: new Date().toISOString(),
        user_id: currentUser?.id,
        profiles: profileData
      }]);

      setNewReply('');
      toast({
        title: "Success",
        description: "Reply added successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add reply.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-card rounded-lg p-4 space-y-2 transition-all duration-200 hover:shadow-xl border border-border/50 hover:border-border hover:scale-[1.01]">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.profiles?.avatar_url ? getStorageUrl('avatars', post.profiles.avatar_url) : undefined} />
            <AvatarFallback>
              {(post.profiles?.display_name?.[0] || post.profiles?.username?.[0] || 'U').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-foreground">
              {post.profiles?.display_name || post.profiles?.username || 'Anonymous'}
            </h3>
            <p className="text-xs text-muted-foreground">
              @{post.profiles?.username || 'anonymous'} · {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              {post.is_edited && ' (edited)'}
            </p>
          </div>
        </div>
        {isOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
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

      {isEditing ? (
        <div className="space-y-2">
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex justify-end gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsEditing(false);
                setEditContent(post.content);
              }}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleUpdate}
              disabled={!editContent.trim() || editContent === post.content}
            >
              Save
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-foreground whitespace-pre-wrap">{post.content}</p>
          {post.image_url && (
            <div className="relative group">
              <img 
                src={post.image_url} 
                alt="Post attachment" 
                className="rounded-lg max-h-96 w-auto object-contain"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
            </div>
          )}
        </div>
      )}

      <div className="flex items-center space-x-1.5">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-7 px-2 space-x-1",
            isLiked && "text-pink-500 hover:text-pink-600"
          )}
          onClick={handleLike}
        >
          <ThumbsUp className="h-3.5 w-3.5" />
          <span className="text-sm">{post.likes_count || 0}</span>
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-7 px-2 space-x-1"
          onClick={() => setShowReplies(!showReplies)}
        >
          <MessageSquare className="h-3.5 w-3.5" />
          <span className="text-sm">{post.replies_count || 0}</span>
        </Button>
      </div>

      {showReplies && (
        <div className="space-y-3 mt-1.5">
          {isLoadingReplies ? (
            <div className="text-center text-muted-foreground text-sm">
              Loading replies...
            </div>
          ) : (
            <>
              {replies.map((reply) => (
                <Reply
                  key={reply.id}
                  reply={reply}
                  currentUser={currentUser}
                  onDelete={() => handleReply}
                  onUpdate={() => {}}
                />
              ))}
              <div className="flex items-start gap-3 pt-1.5">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={currentUser?.user_metadata?.avatar_url} />
                  <AvatarFallback>
                    {currentUser?.email?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1.5">
                  <Textarea
                    ref={replyInputRef}
                    placeholder="Write a reply..."
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    className="min-h-[60px]"
                  />
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      className="h-7 px-2"
                      onClick={handleReply}
                      disabled={!newReply.trim()}
                    >
                      <Send className="h-3.5 w-3.5 mr-1.5" />
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
