import { useState } from 'react';
import { Drum, Coins, Search, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useAuthStore } from '@/stores/auth-store';
import { cn } from '@/lib/utils';

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
  const { user, clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };
  const API_KEY = 'AIzaSyDqOUX5_9QZZzrfGxWqVrqZw_R-y3hKDb8';

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://youtube.googleapis.com/youtube/v3/search?` + 
        new URLSearchParams({
          part: 'snippet',
          maxResults: '5',
          q: query,
          type: 'video',
          key: API_KEY
        })
      );

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message);
      }
      
      setSearchResults(data.items || []);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white dark:bg-koya-card border-b">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-xl md:text-2xl font-bold text-koya-accent">
          <Drum className="lucide lucide-drum text-koya-accent" />
          <span className="hidden sm:inline">Ekowest TV</span>
        </Link>
        <div className="flex items-center gap-6">
          {user && (
            <div className="flex items-center">
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
                {isSearching && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-koya-card rounded-md shadow-lg z-50 max-h-[300px] overflow-y-auto">
                    {isLoading ? (
                      <div className="p-4 text-center">
                        <span className="animate-spin inline-block mr-2">⌛</span>
                        Searching...
                      </div>
                    ) : searchResults.length > 0 ? (
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
                    ) : (
                      <div className="p-4 text-center text-muted-foreground">
                        No results found
                      </div>
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
          )}
          {user ? (
            <>
              <Link to="/my-list" className="text-sm hover:underline">
                My List
              </Link>
              <Link to="/rewards" className="flex items-center gap-1 text-sm hover:underline">
                <Coins className="h-5 w-5" />
                Watch2Earn
              </Link>
              <Link to="/privacy" className="text-sm hover:underline">
                Privacy Policy
              </Link>
              <div className="flex items-center gap-4">
                <span className="text-sm">{user.email}</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link to="/watch2earn" className="text-sm hover:underline">
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
