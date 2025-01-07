export interface YorubaQueryCriteria {
  category: string;
  isAvailable: boolean;
  isEmbeddable: boolean;
  minDuration?: number;
  minViews: number;
  minLikeRatio?: number;
  requireAuthenticity?: boolean;
  requireCulturalElements?: boolean;
  videoQualities?: string[];
  limit: number;
}