export interface VideoStats {
  id: string;
  statistics: {
    viewCount: string;
    commentCount: string;
  };
}

export interface SearchResult {
  id: { videoId: string };
  snippet: {
    title: string;
    thumbnails: {
      maxres?: { url: string };
      high: { url: string };
    };
  };
}

export const fetchYouTubeVideos = async (apiKey: string): Promise<SearchResult[]> => {
  const searchResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=Nollywood+movie+full&type=video&videoDuration=long&videoDefinition=high&key=${apiKey}`
  );

  if (!searchResponse.ok) {
    throw new Error(`YouTube search API error: ${searchResponse.status}`);
  }

  const searchData = await searchResponse.json();
  return searchData.items;
};

export const processBatch = async (videoIds: string[], apiKey: string, batchSize: number = 10) => {
  const batches = [];
  
  for (let i = 0; i < videoIds.length; i += batchSize) {
    await new Promise(resolve => setTimeout(resolve, 200)); // Rate limiting
    const batch = videoIds.slice(i, i + batchSize);
    
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${batch.join(',')}&key=${apiKey}`
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('YouTube API error:', errorData);
      throw new Error(`YouTube API error: ${response.status}`);
    }
    
    const data = await response.json();
    batches.push(data);
  }
  
  return batches;
};

export const filterHighlyRatedVideos = (videos: VideoStats[]): VideoStats[] => {
  return videos.filter(video => {
    const stats = video.statistics;
    return parseInt(stats.viewCount) >= 500000 && parseInt(stats.commentCount) >= 100;
  });
};