
import { Plus, Check } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface MovieCardActionsProps {
  id: string;
  userId: string | undefined;
  isInList: boolean;
  isLoading: boolean;
}

export const MovieCardActions = ({ id, userId, isInList, isLoading }: MovieCardActionsProps) => {
  const toggleMyList = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!userId) {
      toast.error('Please login to add movies to your list');
      return;
    }

    try {
      if (isInList) {
        await supabase
          .from('user_movie_lists')
          .delete()
          .eq('user_id', userId)
          .eq('movie_id', id);
        
        toast.success('Removed from My List');
      } else {
        await supabase
          .from('user_movie_lists')
          .insert([{ user_id: userId, movie_id: id }]);
        
        toast.success('Added to My List');
      }
    } catch (error) {
      console.error('Error toggling movie in list:', error);
      toast.error('Failed to update My List');
    }
  };

  return (
    <button
      onClick={toggleMyList}
      disabled={isLoading}
      className={`absolute top-2 right-2 z-10 p-1.5 rounded-full 
        transition-all duration-200 
        ${isInList ? 'bg-green-500 hover:bg-green-600' : 'bg-black/50 hover:bg-black/70'}
        ${isLoading ? 'cursor-not-allowed' : ''}`}
    >
      {isInList ? (
        <Check className="w-4 h-4 text-white" />
      ) : (
        <Plus className="w-4 h-4 text-white" />
      )}
    </button>
  );
};
