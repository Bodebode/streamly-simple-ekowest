
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { CreatePost } from '@/components/community/CreatePost';
import { PostsList } from '@/components/community/PostsList';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';

export const Community = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [postsList, setPostsList] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      toast({
        title: "Authentication required",
        description: "Please sign in to access the community features.",
      });
    }
  }, [user, navigate, toast]);

  // Store the PostsList ref when it's rendered
  const handlePostsListMount = (ref: any) => {
    setPostsList(ref);
  };

  if (!user) return null;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="flex flex-col gap-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Ekowest Community
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Join the conversation about African cinema, share your thoughts, and connect with fellow enthusiasts.
            </p>
          </div>
          <CreatePost onNewPost={(post) => postsList?.handleNewPost(post)} />
          <PostsList ref={handlePostsListMount} />
        </div>
      </div>
    </MainLayout>
  );
};

export default Community;
