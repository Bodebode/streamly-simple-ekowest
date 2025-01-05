let currentApiKey = 'primary';

export async function getYouTubeApiKey(): Promise<string> {
  const primaryKey = Deno.env.get('YOUTUBE_API_KEY');
  const secondaryKey = Deno.env.get('YOUTUBE_API_KEY_SECONDARY');
  
  if (!primaryKey || !secondaryKey) {
    throw new Error('YouTube API keys not configured');
  }

  // Switch between primary and secondary keys
  if (currentApiKey === 'primary') {
    currentApiKey = 'secondary';
    console.log('Using secondary YouTube API key');
    return secondaryKey;
  } else {
    currentApiKey = 'primary';
    console.log('Using primary YouTube API key');
    return primaryKey;
  }
}

export async function fetchWithKeyRotation(url: string): Promise<Response> {
  try {
    // Try with first key
    const firstKey = await getYouTubeApiKey();
    console.log('Attempting request with first key...');
    const response = await fetch(`${url}&key=${firstKey}`);
    
    if (response.status === 403 || response.status === 429) {
      console.log('First key quota exceeded, trying second key...');
      const secondKey = await getYouTubeApiKey();
      const secondResponse = await fetch(`${url}&key=${secondKey}`);
      
      if (secondResponse.status === 403 || secondResponse.status === 429) {
        console.log('Both API keys quota exceeded, falling back to cache');
        throw new Error('YouTube API quota exceeded for both keys');
      }
      
      return secondResponse;
    }
    
    return response;
  } catch (error) {
    console.error('Error in fetchWithKeyRotation:', error);
    throw error;
  }
}