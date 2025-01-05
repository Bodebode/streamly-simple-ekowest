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
    return primaryKey;
  } else {
    currentApiKey = 'primary';
    return secondaryKey;
  }
}