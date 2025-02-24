import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Movie } from '@/types/movies';

const placeholderNewReleases = [
  {
    id: 'nr1',
    title: "Digital Innovation",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    category: "New Release"
  },
  {
    id: 'nr2',
    title: "Tech Frontiers",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    category: "New Release"
  },
  {
    id: 'nr3',
    title: "Future Tech",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    category: "New Release"
  },
  {
    id: 'nr4',
    title: "Code Masters",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    category: "New Release"
  },
  {
    id: 'nr5',
    title: "Digital Workspace",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    category: "New Release"
  },
  {
    id: 'nr6',
    title: "Tech Solutions",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    category: "New Release"
  },
  {
    id: 'nr7',
    title: "Innovation Hub",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    category: "New Release"
  },
  {
    id: 'nr8',
    title: "Digital Matrix",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    category: "New Release"
  },
  {
    id: 'nr9',
    title: "Cyber World",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
    category: "New Release"
  },
  {
    id: 'nr10',
    title: "Tech Evolution",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    category: "New Release"
  },
  {
    id: 'nr11',
    title: "Digital Future",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    category: "New Release"
  },
  {
    id: 'nr12',
    title: "Tech Vision",
    image: "https://images.unsplash.com/photo-1473091534298-04dcbce3278c",
    category: "New Release"
  }
];

const removeDuplicates = (videos: any[]): any[] => {
  const seen = new Set<string>();
  return videos.filter(video => {
    const duplicate = seen.has(video.video_id);
    seen.add(video.video_id);
    return !duplicate && video.video_id && video.is_available;
  }).slice(0, 12);
};

export const useNewReleases = () => {
  return useQuery({
    queryKey: ['newReleases'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('cached_videos')
          .select('*')
          .eq('category', 'New Release')
          .eq('is_available', true)
          .gt('expires_at', new Date().toISOString())
          .order('cached_at', { ascending: false })
          .limit(24); // Increased limit to ensure enough unique videos
        
        if (error) {
          console.error('Error fetching new releases:', error);
          toast.error('Failed to load new releases, showing placeholders');
          return placeholderNewReleases;
        }
        
        if (!data || data.length === 0) {
          console.log('No new releases found, using placeholders');
          return placeholderNewReleases;
        }

        // Filter for unique videos and ensure minimum count
        const uniqueVideos = removeDuplicates(data);
        
        if (uniqueVideos.length < 12) {
          console.log('Not enough unique videos, padding with placeholders');
          const neededPlaceholders = 12 - uniqueVideos.length;
          return [...uniqueVideos, ...placeholderNewReleases.slice(0, neededPlaceholders)];
        }

        // Increment access count for retrieved videos
        uniqueVideos.forEach(video => {
          supabase.rpc('increment_access_count', { video_id: video.id });
        });

        return uniqueVideos;
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