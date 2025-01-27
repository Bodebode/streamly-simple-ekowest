export const DataHandlingDisclosure = () => {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Data Collection & Usage</h2>
      <div className="space-y-4">
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
          <h3 className="font-semibold mb-2">Personal Information We Collect:</h3>
          <ul className="list-disc pl-6">
            <li>Email address (for account creation and communication)</li>
            <li>Username or display name</li>
            <li>Authentication data (password hashes, not actual passwords)</li>
            <li>Profile information (if provided)</li>
          </ul>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
          <h3 className="font-semibold mb-2">YouTube API Data Collection:</h3>
          <ul className="list-disc pl-6">
            <li>Video viewing history and preferences</li>
            <li>Watch time and engagement metrics</li>
            <li>Playlist interactions and saved videos</li>
            <li>Video interactions (likes, comments, shares)</li>
            <li>Channel subscriptions and preferences</li>
          </ul>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
          <h3 className="font-semibold mb-2">How We Use Your Data:</h3>
          <ul className="list-disc pl-6">
            <li>To personalize your video recommendations</li>
            <li>To maintain your watch history and playlists</li>
            <li>To provide watch-to-earn rewards and track progress</li>
            <li>To improve our service and content curation</li>
            <li>To communicate important updates and information</li>
          </ul>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
          <h3 className="font-semibold mb-2">Data Retention & Deletion:</h3>
          <ul className="list-disc pl-6">
            <li>Personal account data is retained until account deletion</li>
            <li>YouTube API data is automatically deleted after 30 days</li>
            <li>Watch history can be manually cleared at any time</li>
            <li>You can request complete data deletion by contacting support</li>
          </ul>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
          <h3 className="font-semibold mb-2">Third-Party Data Sharing:</h3>
          <ul className="list-disc pl-6">
            <li>YouTube API Services (for video playback and features)</li>
            <li>Analytics providers (anonymized usage data)</li>
            <li>Cloud service providers (for hosting and storage)</li>
            <li>We never sell your personal data to third parties</li>
          </ul>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
          By using our service, you acknowledge and consent to the collection and use of your data as described above. 
          You can revoke access to YouTube data through your{" "}
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
    </section>
  );
};