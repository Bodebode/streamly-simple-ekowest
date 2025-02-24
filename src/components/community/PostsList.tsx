
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
  is_pinned?: boolean;
  image_url?: string;
  profiles: {
    username: string;
    display_name?: string;
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

  // Updated sort function to ensure pinned posts always stay at top
  const sortPosts = (postsToSort: PostData[]) => {
    return [...postsToSort].sort((a, b) => {
      // First sort by pinned status (pinned posts first)
      if ((a.is_pinned && b.is_pinned) || (!a.is_pinned && !b.is_pinned)) {
        // If both are pinned or both are not pinned, sort by date
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      // Put pinned posts first
      return a.is_pinned ? -1 : 1;
    });
  };

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:user_id (
            username,
            display_name,
            avatar_url,
            bio,
            location,
            website
          )
        `)
        .order('is_pinned', { ascending: false }) // First order by pinned status
        .order('created_at', { ascending: false }); // Then by creation date

      if (error) throw error;
      setPosts(sortPosts(data || []));
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
        event: 'INSERT', 
        schema: 'public', 
        table: 'posts' 
      }, async (payload) => {
        // Fetch the complete post data including profile information
        const { data: postData, error } = await supabase
          .from('posts')
          .select(`
            *,
            profiles:user_id (
              username,
              display_name,
              avatar_url,
              bio,
              location,
              website
            )
          `)
          .eq('id', payload.new.id)
          .single();

        if (!error && postData) {
          setPosts(currentPosts => sortPosts([postData, ...currentPosts]));
        }
      })
      .on('postgres_changes', { 
        event: 'DELETE', 
        schema: 'public', 
        table: 'posts' 
      }, (payload) => {
        setPosts(currentPosts => sortPosts(currentPosts.filter(post => post.id !== payload.old.id)));
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'posts'
      }, async (payload) => {
        // Re-fetch the updated post to get the complete data
        const { data: updatedPost, error } = await supabase
          .from('posts')
          .select(`
            *,
            profiles:user_id (
              username,
              display_name,
              avatar_url,
              bio,
              location,
              website
            )
          `)
          .eq('id', payload.new.id)
          .single();

        if (!error && updatedPost) {
          setPosts(currentPosts => {
            const updatedPosts = currentPosts.map(post => 
              post.id === updatedPost.id ? updatedPost : post
            );
            return sortPosts(updatedPosts);
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleNewPost = async (newPost: PostData) => {
    setPosts(currentPosts => sortPosts([newPost, ...currentPosts]));
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

      setPosts(currentPosts => sortPosts(currentPosts.filter(post => post.id !== postId)));
      
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
      <div className="space-y-0.5">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-card rounded-lg p-3 space-y-3">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-1.5">
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
    <div className="space-y-0.5">
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
