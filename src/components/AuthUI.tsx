import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';

export const AuthUI = () => {
  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-koya-card rounded-lg shadow-lg">
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
        }}
        providers={[]}
      />
    </div>
  );
};