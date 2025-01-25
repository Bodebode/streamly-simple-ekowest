import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AuthUI } from '@/components/AuthUI';
import { useToast } from '@/hooks/use-toast';
import { AuthError } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';

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

    const handleAuthError = (error: AuthError) => {
      console.error('Auth error:', error);
      let errorMessage = "An error occurred during authentication. Please try again.";
      
      // Handle specific error cases
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = "Incorrect email or password. Please try again.";
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = "Please verify your email address before signing in.";
      } else if (error.message.includes('Password should be')) {
        errorMessage = "Password must be at least 6 characters long.";
      } else if (error.message.includes('Invalid email')) {
        errorMessage = "Please enter a valid email address.";
      } else if (error.message.includes('rate limit')) {
        errorMessage = "Too many login attempts. Please try again later.";
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
    });

    // Listen for authentication errors through the error callback
    const { data: { subscription: errorSubscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        const authError = (session as any)?.error;
        if (authError) {
          handleAuthError(authError as AuthError);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
      errorSubscription.unsubscribe();
    };
  }, [navigate, toast]);

  const handleContinueAsGuest = () => {
    toast({
      title: "Welcome Guest!",
      description: "You're browsing as a guest user. Some features may be limited.",
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-koya-background py-12 px-4 sm:px-6 lg:px-8">
      <AuthUI />
      <div className="mt-8 w-full max-w-[400px]">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-50 dark:bg-koya-background text-gray-500">
              or
            </span>
          </div>
        </div>
        <div className="mt-6">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleContinueAsGuest}
          >
            Continue as Guest
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;