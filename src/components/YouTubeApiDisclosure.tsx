export const YouTubeApiDisclosure = () => {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">YouTube API Services Usage</h2>
      <div className="space-y-4">
        <p>
          Our service integrates with YouTube API Services to deliver video content. By using our service, 
          you are agreeing to be bound by the{" "}
          <a 
            href="https://www.youtube.com/t/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            YouTube Terms of Service
          </a>
          .
        </p>
        <p>This integration allows us to:</p>
        <ul className="list-disc pl-6">
          <li>Display YouTube videos and their metadata</li>
          <li>Show video information (titles, descriptions, thumbnails)</li>
          <li>Provide search functionality</li>
          <li>Organize content by categories</li>
        </ul>
        <p>
          Your data is handled in accordance with{" "}
          <a 
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Google's Privacy Policy
          </a>
          .
        </p>
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
          <h3 className="font-semibold mb-2">Data Collection & Usage:</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Watch history (stored for 24 hours)</li>
            <li>Video preferences</li>
            <li>Search queries</li>
            <li>Viewing statistics</li>
          </ul>
        </div>
      </div>
    </section>
  );
};