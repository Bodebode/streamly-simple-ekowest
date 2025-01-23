export const DataHandlingDisclosure = () => {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Data Handling & Storage</h2>
      <div className="space-y-4">
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
          <h3 className="font-semibold mb-2">Data Collection:</h3>
          <ul className="list-disc pl-6">
            <li>Video viewing preferences and history</li>
            <li>User interaction patterns with content</li>
            <li>Device and browser information</li>
            <li>Performance and usage analytics</li>
          </ul>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
          <h3 className="font-semibold mb-2">Data Storage & Retention:</h3>
          <ul className="list-disc pl-6">
            <li>All YouTube API data is stored for a maximum of 30 days</li>
            <li>Watch history is automatically cleared after 30 days</li>
            <li>User preferences are stored locally in your browser</li>
            <li>Cache is automatically refreshed or deleted after 30 days</li>
          </ul>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
          <h3 className="font-semibold mb-2">Data Sharing:</h3>
          <ul className="list-disc pl-6">
            <li>Usage data is shared with YouTube Analytics</li>
            <li>Anonymous analytics data may be shared with service providers</li>
            <li>No personal information is sold to third parties</li>
          </ul>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          You can manually clear your data at any time through your browser settings.
        </p>
      </div>
    </section>
  );
};