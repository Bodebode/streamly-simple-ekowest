
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Post } from './Post';
import { Skeleton } from '@/components/ui/skeleton';

interface PostData {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  likes_count: number;
  replies_count: number;
  category?: string;
  tags?: string[];
  is_edited?: boolean;
  profiles: {
    username: string;
    avatar_url: string | null;
    bio?: string;
    location?: string;
    website?: string;
  } | null;
}

export interface PostsListRef {
  handleNewPost: (post: PostData) => void;
}

export const PostsList = forwardRef<PostsListRef>((_, ref) => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url,
            bio,
            location,
            website
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load posts. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('public:posts')
      .on('postgres_changes', { 
        event: 'DELETE', 
        schema: 'public', 
        table: 'posts' 
      }, (payload) => {
        setPosts(currentPosts => currentPosts.filter(post => post.id !== payload.old.id));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleNewPost = (newPost: PostData) => {
    setPosts(currentPosts => [newPost, ...currentPosts]);
  };

  useImperativeHandle(ref, () => ({
    handleNewPost
  }));

  const handleDelete = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      setPosts(posts.filter(post => post.id !== postId));
      
      toast({
        title: "Post deleted",
        description: "Your post has been removed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-card rounded-lg p-6 space-y-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-20 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <Post
          key={post.id}
          post={post}
          currentUser={user}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
});

PostsList.displayName = 'PostsList';
