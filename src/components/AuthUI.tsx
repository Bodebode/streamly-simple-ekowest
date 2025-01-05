import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';

export const AuthUI = () => {
  return (
    <div className="w-full max-w-[400px] mx-auto">
      <Auth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#FF0000',
                brandAccent: '#FF0000',
              },
            },
          },
          className: {
            container: 'auth-container',
            button: 'auth-button',
            input: 'auth-input',
          },
        }}
        providers={['google']}
        redirectTo={`${window.location.origin}/auth/callback`}
      />
      <div className="mt-6 text-center">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
};