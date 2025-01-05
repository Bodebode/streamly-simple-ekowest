let currentApiKey = 'primary';

export async function getYouTubeApiKey(): Promise<string> {
  const primaryKey = Deno.env.get('YOUTUBE_API_KEY');
  const secondaryKey = Deno.env.get('YOUTUBE_API_KEY_SECONDARY');
  
  if (!primaryKey || !secondaryKey) {
    throw new Error('YouTube API keys not configured');
  }

  // Log which key we're using for debugging
  console.log('Using YouTube API key:', currentApiKey);

  // Switch between primary and secondary keys
  if (currentApiKey === 'primary') {
    currentApiKey = 'secondary';
    return primaryKey;
  } else {
    currentApiKey = 'primary';
    return secondaryKey;
  }
}

// Add a function to handle YouTube API errors and retry with the other key if needed
export async function fetchWithKeyRotation(url: string): Promise<Response> {
  try {
    const firstKey = await getYouTubeApiKey();
    const response = await fetch(`${url}&key=${firstKey}`);
    
    if (response.status === 403) {
      console.log('First key quota exceeded, trying secondary key...');
      const secondKey = await getYouTubeApiKey();
      return await fetch(`${url}&key=${secondKey}`);
    }
    
    return response;
  } catch (error) {
    console.error('Error in fetchWithKeyRotation:', error);
    throw error;
  }
}