import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

export const AuthUI = () => {
  const navigate = useNavigate();

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
              },
            },
          },
          className: {
            container: 'auth-container',
            button: 'auth-button',
            input: 'auth-input',
          },
        }}
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