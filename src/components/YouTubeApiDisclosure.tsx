export const YouTubeApiDisclosure = () => {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">YouTube API Services Usage</h2>
      <div className="space-y-4">
        <p>
          Our service utilizes YouTube API Services to deliver video content. By using our service, 
          you explicitly agree to be bound by the{" "}
          <a 
            href="https://www.youtube.com/t/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            YouTube Terms of Service
          </a>.
        </p>

        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
          <h3 className="font-semibold mb-2">Data Collection & Usage:</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Video metadata (titles, descriptions, view counts)</li>
            <li>Playback preferences and watch history (stored for 30 days maximum)</li>
            <li>User interaction data with YouTube content</li>
            <li>Video thumbnails and preview images</li>
          </ul>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
          <h3 className="font-semibold mb-2">Data Sharing:</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Video interaction data is shared with YouTube Analytics</li>
            <li>Content preferences may be used to improve recommendations</li>
            <li>No personal data is sold to third parties</li>
          </ul>
        </div>

        <p>
          This service is subject to{" "}
          <a 
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Google's Privacy Policy
          </a>. All YouTube data is refreshed or deleted after 30 days in accordance with YouTube API Services policies.
        </p>
      </div>
    </section>
  );
};