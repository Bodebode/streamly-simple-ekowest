import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { SearchModal } from './SearchModal';
import { Users, Search } from 'lucide-react';

export const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-koya-card border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold text-gray-900 dark:text-white">
              Ekowest TV
            </Link>
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/watch2earn" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Watch2Earn
              </Link>
              <Link to="/rewards" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Rewards
              </Link>
              <Link to="/community" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center gap-2">
                <Users className="h-4 w-4" />
                Community
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
              className="text-gray-600 dark:text-gray-300"
            >
              <Search className="h-5 w-5" />
            </Button>
            {user ? (
              <Button onClick={handleSignOut} variant="outline">
                Sign Out
              </Button>
            ) : (
              <Button onClick={() => navigate('/login')}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
      <SearchModal open={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </nav>
  );
};