
export const NOLLYWOOD_QUALITY_CRITERIA = {
  category: 'Nollywood Movies',
  isAvailable: true,
  isEmbeddable: true,
  minDuration: 2700,
  minViews: 100000,
  limit: 12
}

export const NOLLYWOOD_DURATION_CRITERIA = {
  category: 'Nollywood Movies',
  isAvailable: true,
  isEmbeddable: true,
  minViews: 100000,
  limit: 12
}

export const NOLLYWOOD_NEW_RELEASES_CRITERIA = {
  category: 'Nollywood Movies',
  isAvailable: true,
  isEmbeddable: true,
  minViews: 50000,
  limit: 12,
  publishedAfter: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString() // Last 90 days
}

export const NOLLYWOOD_SERIES_CRITERIA = {
  category: 'Nollywood Series',
  isAvailable: true,
  isEmbeddable: true,
  minDuration: 1800, // 30 minutes minimum for series episodes
  minViews: 75000,
  limit: 12,
  contentTags: ['nollywood series', 'nigerian series', 'african series']
}
