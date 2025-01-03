import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AuthUI } from '@/components/AuthUI';
import { useToast } from '@/hooks/use-toast';
import { AuthError } from '@supabase/supabase-js';

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if there's an error message in the URL
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const error = hashParams.get('error_description');
    if (error) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: error,
      });
    }

    const handleError = (error: AuthError) => {
      console.error('Auth error:', error);
      let errorMessage = "Failed to authenticate. Please try again.";
      
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = "Incorrect email or password. Please try again.";
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = "Please verify your email address before signing in.";
      } else if (error.message.includes('Password should be')) {
        errorMessage = "Password must be at least 6 characters long.";
      }
      
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: errorMessage,
      });
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event);
      
      if (event === 'SIGNED_IN' && session) {
        navigate('/');
      } else if (event === 'SIGNED_OUT') {
        navigate('/auth');
      } else if (event === 'PASSWORD_RECOVERY') {
        toast({
          title: "Password Recovery",
          description: "Please check your email for password reset instructions.",
        });
      } else if (event === 'USER_UPDATED') {
        toast({
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        });
      }

      // Handle any errors that occur during authentication
      if (session?.error) {
        handleError(session.error);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-koya-background py-12 px-4 sm:px-6 lg:px-8">
      <AuthUI />
    </div>
  );
};

export default Auth;