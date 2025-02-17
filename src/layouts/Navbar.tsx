
import { useState } from 'react';
import { Drum, Coins, Search, X, LogOut, User, MessageSquare, Home } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useAuth } from '@/components/AuthProvider';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/auth-store';

interface SearchResult {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: {
      default: {
        url: string;
      };
    };
  };
}

export const Navbar = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const profileData = useAuthStore((state) => state.profileData);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of your account.",
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: "Error logging out",
        description: "There was a problem signing you out.",
        variant: "destructive",
      });
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('search-videos', {
        body: { query }
      });

      if (error) {
        throw error;
      }
      
      setSearchResults(data || []);
    } catch (error) {
      console.error('Search failed:', error);
      toast({
        title: "Search failed",
        description: "There was a problem performing the search.",
        variant: "destructive",
      });
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const displayName = profileData?.display_name || profileData?.username || user?.email || 'User';
  const isHome = location.pathname === '/';

  return (
    <nav className="fixed top-0 w-full z-50 bg-white dark:bg-koya-card border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-xl md:text-2xl font-bold text-koya-accent">
          <Drum className="lucide lucide-drum text-koya-accent" />
          <span className="hidden sm:inline">Ekowest TV</span>
        </Link>
        <div className="flex items-center gap-6">
          {user ? (
            <>
              <div className="flex items-center gap-4">
                <div className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  isSearching ? "w-64" : "w-0"
                )}>
                  <div className="relative min-w-64">
                    <Input
                      placeholder="Search videos..."
                      className="pl-3 pr-8"
                      autoFocus={isSearching}
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        handleSearch(e.target.value);
                      }}
                    />
                    {isSearching && (
                      <button 
                        onClick={() => setIsSearching(false)}
                        className="absolute right-2 top-2.5"
                      >
                        <X className="h-4 w-4 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                  {isSearching && searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-koya-card rounded-md shadow-lg z-50 max-h-[300px] overflow-y-auto">
                      {isLoading ? (
                        <div className="p-4 text-center">Loading...</div>
                      ) : (
                        searchResults.map((video) => (
                          <div
                            key={video.id.videoId}
                            className="flex items-center gap-3 p-2 hover:bg-accent cursor-pointer"
                            onClick={() => {
                              navigate(`/watch/${video.id.videoId}`);
                              setIsSearching(false);
                              setSearchQuery('');
                            }}
                          >
                            <img 
                              src={video.snippet.thumbnails.default.url}
                              alt={video.snippet.title}
                              className="w-16 h-12 object-cover rounded"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{video.snippet.title}</p>
                              <p className="text-xs text-muted-foreground">{video.snippet.channelTitle}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsSearching(true)}
                >
                  <Search className="h-5 w-5" />
                </Button>
              </div>
              {!isHome && (
                <Link to="/" className="flex items-center gap-1 text-sm hover:underline">
                  <Home className="h-5 w-5" />
                  Home
                </Link>
              )}
              <Link to="/my-list" className="text-sm hover:underline">
                My List
              </Link>
              <Link to="/community" className="flex items-center gap-1 text-sm hover:underline">
                <MessageSquare className="h-5 w-5" />
                Community
              </Link>
              <Link to="/rewards" className="flex items-center gap-1 text-sm hover:underline">
                <Coins className="h-5 w-5" />
                Watch2Earn
              </Link>
              <div className="flex items-center gap-4">
                <Link 
                  to="/profile" 
                  className="flex items-center gap-2 text-sm hover:underline"
                >
                  <User className="h-5 w-5" />
                  <span>{displayName}</span>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link to="/watch2earn" className="flex items-center gap-1 text-sm hover:underline">
                <Coins className="h-5 w-5" />
                Watch2Earn
              </Link>
              <Link to="/privacy" className="text-sm hover:underline">
                Privacy Policy
              </Link>
              <Link to="/login" className="text-sm hover:underline">
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
