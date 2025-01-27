export const YouTubeApiDisclosure = () => {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">YouTube API Services Usage</h2>
      <div className="space-y-4">
        <p>
          Our service utilizes YouTube API Services to deliver video content and enhance your viewing experience. 
          By using our service, you explicitly agree to be bound by the{" "}
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
          <h3 className="font-semibold mb-2">YouTube API Data We Access:</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Video content and metadata (titles, descriptions, thumbnails)</li>
            <li>Your watch history and video interactions when logged in</li>
            <li>Channel information and video statistics</li>
            <li>Playlist data and preferences</li>
            <li>Comments and engagement metrics</li>
          </ul>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
          <h3 className="font-semibold mb-2">How We Use YouTube API Data:</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>To provide personalized video recommendations</li>
            <li>To maintain your watch history and playlists</li>
            <li>To track video engagement for rewards</li>
            <li>To improve content curation and user experience</li>
            <li>To ensure content quality and relevance</li>
          </ul>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
          <h3 className="font-semibold mb-2">Data Protection & Privacy:</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>All YouTube API data is stored securely</li>
            <li>Data is automatically deleted after 30 days</li>
            <li>You can revoke access at any time</li>
            <li>We never share your YouTube data with third parties</li>
          </ul>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This service is subject to{" "}
            <a 
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Google's Privacy Policy
            </a>. You can revoke our access to your YouTube data at any time through your{" "}
            <a 
              href="https://security.google.com/settings/security/permissions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Google Security Settings
            </a>.
          </p>
        </div>
      </div>
    </section>
  );
};