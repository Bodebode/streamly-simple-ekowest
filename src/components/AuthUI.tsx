import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const AuthUI = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGuestAccess = () => {
    navigate('/');
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-koya-card rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Welcome to Ekowest TV</h2>
      <Auth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#FF5733',
                brandAccent: '#E64A2E',
                inputText: 'white',
                inputBackground: '#1f1f1f',
                inputBorder: '#333333',
                inputBorderFocus: '#FF5733',
              },
            },
          },
          style: {
            input: {
              color: 'white',
              backgroundColor: '#1f1f1f',
              borderColor: '#333333',
            },
            label: {
              color: 'white',
            },
            message: {
              color: '#FF5733',
            },
          },
        }}
        localization={{
          variables: {
            sign_in: {
              email_input_placeholder: 'Your email address',
              password_input_placeholder: 'Your password',
              email_label: 'Email',
              password_label: 'Password',
              button_label: 'Sign In',
              loading_button_label: 'Signing in ...',
              social_provider_text: 'Sign in with {{provider}}',
              link_text: "Already have an account? Sign in",
            },
            sign_up: {
              email_input_placeholder: 'Your email address',
              password_input_placeholder: 'Your password',
              email_label: 'Email',
              password_label: 'Password',
              button_label: 'Sign Up',
              loading_button_label: 'Signing up ...',
              social_provider_text: 'Sign up with {{provider}}',
              link_text: "Don't have an account? Sign up",
            },
          },
        }}
        showLinks={true}
        providers={['google', 'twitter']}
        redirectTo={window.location.origin}
      />
      <div className="mt-6 text-center">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-koya-card text-gray-500">Or</span>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="mt-4 w-full"
          onClick={handleGuestAccess}
        >
          Continue as Guest
        </Button>
      </div>
    </div>
  );
};