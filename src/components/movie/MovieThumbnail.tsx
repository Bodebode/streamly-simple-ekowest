import { Play } from 'lucide-react';
import { useState, useEffect } from 'react';
import { truncateTitle } from '@/lib/utils';
import { toast } from 'sonner';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface MovieThumbnailProps {
  title: string;
  image: string;
  category: string;
  videoId?: string;
  isHovered: boolean;
  isVideoPlaying: boolean;
}

export const MovieThumbnail = ({ title, image, category, videoId, isHovered, isVideoPlaying }: MovieThumbnailProps) => {
  const [thumbnailError, setThumbnailError] = useState(false);
  const [thumbnailQuality, setThumbnailQuality] = useState<'max' | 'high' | 'fallback'>('max');
  const [isLoading, setIsLoading] = useState(true);
  
  // Array of fallback images for when the main thumbnail is missing
  const fallbackImages = [
    'https://images.unsplash.com/photo-1485846234645-a62644f84728',
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    'https://images.unsplash.com/photo-1518770660439-4636190af475',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6'
  ];
  
  // Get a consistent fallback image based on the movie title
  const getFallbackImage = () => {
    const index = title.length % fallbackImages.length;
    return `${fallbackImages[index]}?auto=format&fit=crop&w=400&q=75`;
  };

  useEffect(() => {
    if (videoId) {
      const maxResUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      const img = new Image();
      img.onload = () => {
        if (img.width === 120 && img.height === 90) {
          setThumbnailQuality('high');
          console.log(`[Thumbnail Quality Check] Low quality thumbnail detected for: "${title}" (${videoId})`);
        } else {
          setThumbnailQuality('max');
        }
        setIsLoading(false);
      };
      img.onerror = () => {
        setThumbnailQuality('high');
        setIsLoading(false);
        console.log(`[Thumbnail] Falling back to hqdefault for: ${title} (${videoId})`);
      };
      img.src = maxResUrl;
    } else {
      setThumbnailQuality('fallback');
      setIsLoading(false);
    }
  }, [videoId, title]);
  
  const thumbnailUrl = videoId 
    ? `https://img.youtube.com/vi/${videoId}/${thumbnailQuality === 'max' ? 'maxresdefault' : 'hqdefault'}.jpg`
    : (image || getFallbackImage());

  // Add query parameters for image optimization
  const optimizedUrl = new URL(thumbnailUrl);
  if (!thumbnailUrl.includes('youtube.com')) {
    optimizedUrl.searchParams.set('auto', 'format');
    optimizedUrl.searchParams.set('fit', 'crop');
    optimizedUrl.searchParams.set('w', '400');
    optimizedUrl.searchParams.set('q', '75');
  }

  return (
    <AspectRatio ratio={16 / 9} className="w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse rounded-lg" />
      )}
      <img
        src={optimizedUrl.toString()}
        alt={title}
        className={`w-full h-full object-cover rounded-lg transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onError={() => {
          console.log(`[Thumbnail] Error loading thumbnail for: ${title}`);
          setThumbnailError(true);
        }}
        loading="lazy"
      />
      {isHovered && !isVideoPlaying && (
        <div className="absolute inset-0 bg-black bg-opacity-75 p-4 flex flex-col justify-end rounded-lg">
          <h3 className="text-lg font-bold">{truncateTitle(title)}</h3>
          <p className="text-sm text-koya-subtext mb-2">{category}</p>
          {videoId && (
            <button className="bg-koya-accent hover:bg-opacity-80 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <Play className="w-4 h-4" />
              Watch Now
            </button>
          )}
        </div>
      )}
    </AspectRatio>
  );
};