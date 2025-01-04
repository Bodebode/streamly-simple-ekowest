import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'

interface HighlyRatedVideo {
  id: number
  title: string
  image: string
  category: string
  videoId: string
  views: number
  comments: number
  publishedAt: string
}

const fetchHighlyRatedVideos = async (): Promise<HighlyRatedVideo[]> => {
  const { data, error } = await supabase.functions.invoke('get-highly-rated')
  
  if (error) {
    console.error('Error fetching highly rated videos:', error)
    toast.error('Failed to fetch highly rated videos')
    throw error
  }

  return data
}

export const useHighlyRated = () => {
  return useQuery({
    queryKey: ['highly-rated'],
    queryFn: fetchHighlyRatedVideos,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    retry: 2,
  })
}