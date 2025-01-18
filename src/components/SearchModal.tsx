import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '@/hooks/use-debounce';

export const SearchModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 500);
  const navigate = useNavigate();

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    // Mock search results for now
    const mockResults = [
      { id: { videoId: '12345' }, snippet: { title: 'Sample Video 1', channelTitle: 'Channel 1', thumbnails: { default: { url: 'https://via.placeholder.com/120x90' } } } },
      { id: { videoId: '67890' }, snippet: { title: 'Sample Video 2', channelTitle: 'Channel 2', thumbnails: { default: { url: 'https://via.placeholder.com/120x90' } } } },
    ];
    setResults(mockResults);
    setIsLoading(false);
  };

  useEffect(() => {
    if (debouncedSearch) {
      handleSearch(debouncedSearch);
    }
  }, [debouncedSearch]);

  const handleVideoSelect = (videoId: string) => {
    navigate(`/watch/${videoId}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search videos..."
              className="pl-10 pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="max-h-[400px] overflow-y-auto space-y-2">
              {results.map((video: any) => (
                <div
                  key={video.id.videoId}
                  className="flex gap-3 p-2 hover:bg-accent rounded-lg cursor-pointer"
                  onClick={() => handleVideoSelect(video.id.videoId)}
                >
                  <img 
                    src={video.snippet.thumbnails.default.url}
                    alt={video.snippet.title}
                    className="w-24 h-18 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-medium line-clamp-2">{video.snippet.title}</h3>
                    <p className="text-sm text-muted-foreground">{video.snippet.channelTitle}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};