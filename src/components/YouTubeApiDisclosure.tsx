export const YouTubeApiDisclosure = () => {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">YouTube API Services Usage</h2>
      <div className="space-y-4">
        <p>
          Our service integrates with YouTube API Services to deliver video content. 
          This integration allows us to:
        </p>
        <ul className="list-disc pl-6">
          <li>Display YouTube videos</li>
          <li>Show video metadata (titles, descriptions)</li>
          <li>Provide search functionality</li>
          <li>Organize content by categories</li>
        </ul>
        <p>
          All data access and usage complies with:
          <a 
            href="https://developers.google.com/youtube/terms/api-services-terms-of-service"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-blue-500 hover:underline"
          >
            YouTube API Services Terms of Service
          </a>
        </p>
      </div>
    </section>
  );
};
