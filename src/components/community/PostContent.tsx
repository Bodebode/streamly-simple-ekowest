
interface PostContentProps {
  content: string;
  imageUrl?: string | null;
  isEditing: boolean;
  editContent: string;
  onEditContentChange: (content: string) => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
}

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export const PostContent = ({
  content,
  imageUrl,
  isEditing,
  editContent,
  onEditContentChange,
  onCancelEdit,
  onSaveEdit,
}: PostContentProps) => {
  if (isEditing) {
    return (
      <div className="space-y-2">
        <Textarea
          value={editContent}
          onChange={(e) => onEditContentChange(e.target.value)}
          className="min-h-[120px]"
        />
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancelEdit}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={onSaveEdit}
            disabled={!editContent.trim() || editContent === content}
          >
            Save
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-foreground whitespace-pre-wrap">{content}</p>
      {imageUrl && (
        <div className="relative group">
          <img 
            src={imageUrl} 
            alt="Post attachment" 
            className="rounded-lg max-h-96 w-auto object-contain"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
        </div>
      )}
    </div>
  );
};
