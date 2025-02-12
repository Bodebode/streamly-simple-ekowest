import { useState, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import { Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Reply } from './Reply';
import { PostHeader } from './PostHeader';
import { PostContent } from './PostContent';
import { PostActions } from './PostActions';

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
      const { error } = await supabase
        .from('post_replies')
        .insert([{
          content: newReply.trim(),
          post_id: post.id,
          user_id: currentUser?.id
        }]);

      if (error) throw error;

      setNewReply('');
      fetchReplies();
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

  const handleDeleteReply = async (replyId: string) => {
    try {
      const { error } = await supabase
        .from('post_replies')
        .delete()
        .eq('id', replyId);

      if (error) throw error;

      setReplies(replies.filter(reply => reply.id !== replyId));
      toast({
        title: "Success",
        description: "Reply deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete reply.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateReply = async (replyId: string, content: string) => {
    try {
      const { error } = await supabase
        .from('post_replies')
        .update({ 
          content,
          is_edited: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', replyId);

      if (error) throw error;

      setReplies(replies.map(reply => 
        reply.id === replyId 
          ? { ...reply, content, is_edited: true } 
          : reply
      ));

      toast({
        title: "Success",
        description: "Reply updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update reply.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 space-y-4 transition-all duration-200 hover:shadow-lg">
      <PostHeader
        profile={post.profiles}
        createdAt={post.created_at}
        isEdited={post.is_edited || false}
        isOwner={isOwner}
        onEdit={() => setIsEditing(true)}
        onDelete={() => onDelete(post.id)}
      />

      <PostContent
        content={post.content}
        imageUrl={post.image_url}
        isEditing={isEditing}
        editContent={editContent}
        onEditContentChange={setEditContent}
        onCancelEdit={() => {
          setIsEditing(false);
          setEditContent(post.content);
        }}
        onSaveEdit={handleUpdate}
      />

      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <PostActions
        likesCount={post.likes_count}
        repliesCount={post.replies_count}
        isLiked={isLiked}
        onLike={handleLike}
        onToggleReplies={() => setShowReplies(!showReplies)}
      />

      {showReplies && (
        <div className="space-y-4 mt-4">
          {isLoadingReplies ? (
            <div className="text-center text-muted-foreground">
              Loading replies...
            </div>
          ) : (
            <>
              {replies.map((reply) => (
                <Reply
                  key={reply.id}
                  reply={reply}
                  currentUser={currentUser}
                  onDelete={handleDeleteReply}
                  onUpdate={handleUpdateReply}
                />
              ))}
              <div className="flex items-start gap-4 pt-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser?.user_metadata?.avatar_url} />
                  <AvatarFallback>
                    {currentUser?.email?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Textarea
                    ref={replyInputRef}
                    placeholder="Write a reply..."
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      onClick={handleReply}
                      disabled={!newReply.trim()}
                    >
                      <Send className="h-4 w-4 mr-2" />
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
