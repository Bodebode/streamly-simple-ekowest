export const getYouTubeApiKey = async () => {
  const PRIMARY_KEY = Deno.env.get('YOUTUBE_API_KEY');
  const SECONDARY_KEY = Deno.env.get('YOUTUBE_API_KEY_SECONDARY');
  
  if (!PRIMARY_KEY && !SECONDARY_KEY) {
    throw new Error('No YouTube API keys configured');
  }

  // Try to use the primary key first
  if (PRIMARY_KEY) {
    try {
      const testUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&key=${PRIMARY_KEY}`;
      const response = await fetch(testUrl);
      const data = await response.json();
      
      if (!data.error) {
        console.log('Using primary API key');
        return PRIMARY_KEY;
      }
      
      if (data.error?.errors?.[0]?.reason === 'quotaExceeded') {
        console.log('Primary key quota exceeded, trying secondary key');
        if (SECONDARY_KEY) {
          // Test secondary key
          const testSecondaryUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&key=${SECONDARY_KEY}`;
          const secondaryResponse = await fetch(testSecondaryUrl);
          const secondaryData = await secondaryResponse.json();
          
          if (!secondaryData.error) {
            console.log('Using secondary API key');
            return SECONDARY_KEY;
          }
        }
      }
    } catch (error) {
      console.error('Error with primary key:', error);
    }
  }

  // Fallback to secondary key without testing if primary key failed
  if (SECONDARY_KEY) {
    console.log('Using secondary API key');
    return SECONDARY_KEY;
  }

  throw new Error('All API keys exhausted');
};