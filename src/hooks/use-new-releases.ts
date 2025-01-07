import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const placeholderNewReleases = [
  {
    id: 'nr1',
    title: "Latest Nollywood Drama",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728",
    category: "New Release",
    videoId: undefined
  },
  {
    id: 'nr2',
    title: "Family Ties",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1",
    category: "New Release",
    videoId: undefined
  },
  {
    id: 'nr3',
    title: "Love & Life",
    image: "https://images.unsplash.com/photo-1542204165-65bf26472b9b",
    category: "New Release",
    videoId: undefined
  },
  {
    id: 'nr4',
    title: "Village Chronicles",
    image: "https://images.unsplash.com/photo-1516475429286-465d815a0df7",
    category: "New Release",
    videoId: undefined
  },
  {
    id: 'nr5',
    title: "City Dreams",
    image: "https://images.unsplash.com/photo-1533488765986-dfa2a9939acd",
    category: "New Release",
    videoId: undefined
  },
  {
    id: 'nr6',
    title: "Royal Destiny",
    image: "https://images.unsplash.com/photo-1533561052604-c3beb6d55b8d",
    category: "New Release",
    videoId: undefined
  }
];

export const useNewReleases = () => {
  return useQuery({
    queryKey: ['newReleases'],
    queryFn: async () => {
      try {
        const { data: cachedVideos, error: cacheError } = await supabase
          .from('cached_videos')
          .select('*')
          .eq('category', 'New Release')
          .eq('is_available', true)
          .eq('is_embeddable', true)
          .gt('expires_at', new Date().toISOString())
          .gte('views', 20000)
          .in('video_quality', ['1080p', '1440p', '2160p'])
          .order('cached_at', { ascending: false })
          .limit(12);
        
        if (cacheError) {
          console.error('Error fetching new releases:', cacheError);
          toast.error('Failed to load new releases, showing placeholders');
          return placeholderNewReleases;
        }
        
        if (!cachedVideos || cachedVideos.length === 0) {
          console.log('No new releases found, using placeholders');
          return placeholderNewReleases;
        }

        // Increment access count for retrieved videos
        cachedVideos.forEach(video => {
          supabase.rpc('increment_access_count', { video_id: video.id });
        });

        // If we have data but less than 6 items, pad with placeholders
        if (cachedVideos.length < 6) {
          const neededPlaceholders = 6 - cachedVideos.length;
          return [...cachedVideos, ...placeholderNewReleases.slice(0, neededPlaceholders)];
        }

        return cachedVideos;
      } catch (error) {
        console.error('Error in new releases query:', error);
        toast.error('Failed to load new releases, showing placeholders');
        return placeholderNewReleases;
      }
    },
    staleTime: 1000 * 60 * 15, // Consider data fresh for 15 minutes
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
    retry: 1,
  });
};