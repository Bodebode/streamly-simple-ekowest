import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Home, Heart, MessageCircle, Share2, Repeat2 } from 'lucide-react';
import { format } from 'date-fns';

interface Post {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  likes_count: number;
  replies_count: number;
  profiles: {
    username: string;
    avatar_url: string;
  };
}

interface Reply {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  profiles: {
    username: string;
    avatar_url: string;
  };
}

const CommunityHub = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [newReply, setNewReply] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
    setupRealtimeSubscription();
  }, []);

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('public:posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
        fetchPosts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles (
          username,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
      return;
    }

    setPosts(data || []);
  };

  const fetchReplies = async (postId: string) => {
    const { data, error } = await supabase
      .from('post_replies')
      .select(`
        *,
        profiles (
          username,
          avatar_url
        )
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching replies:', error);
      return;
    }

    setReplies(data || []);
  };

  const createPost = async () => {
    if (!newPost.trim()) return;

    const { error } = await supabase
      .from('posts')
      .insert([{ content: newPost, user_id: user?.id }]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setNewPost('');
    toast({
      title: "Success",
      description: "Post created successfully!",
    });
  };

  const createReply = async () => {
    if (!newReply.trim() || !selectedPost) return;

    const { error } = await supabase
      .from('post_replies')
      .insert([{
        content: newReply,
        post_id: selectedPost,
        user_id: user?.id
      }]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create reply. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setNewReply('');
    fetchReplies(selectedPost);
    toast({
      title: "Success",
      description: "Reply added successfully!",
    });
  };

  const toggleLike = async (postId: string) => {
    const { data: existingLike, error: checkError } = await supabase
      .from('post_likes')
      .select()
      .eq('post_id', postId)
      .eq('user_id', user?.id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking like:', checkError);
      return;
    }

    if (existingLike) {
      const { error } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error removing like:', error);
        return;
      }
    } else {
      const { error } = await supabase
        .from('post_likes')
        .insert([{ post_id: postId, user_id: user?.id }]);

      if (error) {
        console.error('Error adding like:', error);
        return;
      }
    }

    fetchPosts();
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-koya-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Community Hub</h1>
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Button>
        </div>

        {/* Create Post */}
        <div className="bg-white dark:bg-koya-card rounded-lg p-6 mb-8 shadow">
          <Textarea
            placeholder="What's on your mind?"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="mb-4"
          />
          <Button onClick={createPost}>Post</Button>
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white dark:bg-koya-card rounded-lg p-6 shadow">
              <div className="flex items-start space-x-4 mb-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    {post.profiles?.avatar_url ? (
                      <img
                        src={post.profiles.avatar_url}
                        alt={post.profiles?.username}
                        className="w-12 h-12 rounded-full"
                      />
                    ) : (
                      <span className="text-xl">{post.profiles?.username?.[0]?.toUpperCase()}</span>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">{post.profiles?.username || 'Anonymous'}</span>
                    <span className="text-gray-500 text-sm">
                      {format(new Date(post.created_at), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <p className="mt-2">{post.content}</p>
                  <div className="flex items-center space-x-6 mt-4">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className="flex items-center space-x-2 text-gray-500 hover:text-red-500"
                    >
                      <Heart className="h-5 w-5" />
                      <span>{post.likes_count}</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPost(post.id);
                        fetchReplies(post.id);
                      }}
                      className="flex items-center space-x-2 text-gray-500 hover:text-blue-500"
                    >
                      <MessageCircle className="h-5 w-5" />
                      <span>{post.replies_count}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500">
                      <Repeat2 className="h-5 w-5" />
                    </button>
                    <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500">
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Replies Section */}
              {selectedPost === post.id && (
                <div className="mt-4 pl-16">
                  <div className="space-y-4">
                    {replies.map((reply) => (
                      <div key={reply.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-semibold">{reply.profiles?.username || 'Anonymous'}</span>
                          <span className="text-gray-500 text-sm">
                            {format(new Date(reply.created_at), 'MMM d, yyyy')}
                          </span>
                        </div>
                        <p>{reply.content}</p>
                      </div>
                    ))}
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Write a reply..."
                        value={newReply}
                        onChange={(e) => setNewReply(e.target.value)}
                      />
                      <Button onClick={createReply}>Reply</Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityHub;