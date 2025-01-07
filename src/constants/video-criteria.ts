import { YorubaQueryCriteria } from '@/types/video-criteria';

export const STRICT_CRITERIA: YorubaQueryCriteria = {
  category: 'Yoruba Movies',
  isAvailable: true,
  isEmbeddable: true,
  minDuration: 2700,
  minViews: 100000,
  minLikeRatio: 0.005,
  requireAuthenticity: true,
  requireCulturalElements: true,
  videoQualities: ['1080p', '2160p', '1440p'],
  limit: 12,
};

export const RELAXED_QUALITY_CRITERIA: YorubaQueryCriteria = {
  category: 'Yoruba Movies',
  isAvailable: true,
  isEmbeddable: true,
  minDuration: 2700,
  minViews: 100000,
  limit: 12,
};

export const RELAXED_DURATION_CRITERIA: YorubaQueryCriteria = {
  category: 'Yoruba Movies',
  isAvailable: true,
  isEmbeddable: true,
  minViews: 100000,
  limit: 12,
};