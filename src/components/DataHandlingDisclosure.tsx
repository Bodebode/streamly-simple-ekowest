export const DataHandlingDisclosure = () => {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Data Handling & Storage</h2>
      <div className="space-y-4">
        <p>We handle your data with utmost care and transparency:</p>
        <ul className="list-disc pl-6">
          <li>Video preferences are stored locally in your browser</li>
          <li>Watch history is maintained for 24 hours only</li>
          <li>All YouTube data is refreshed or deleted after 30 days</li>
          <li>No personal data is shared with third parties except as required for YouTube API Services integration</li>
          <li>Cache is automatically cleared every 24 hours</li>
          <li>You can manually clear cached data at any time</li>
        </ul>
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
          <h3 className="font-semibold mb-2">Data Sharing:</h3>
          <ul className="list-disc pl-6">
            <li>Internal use: Watch history and preferences for personalization</li>
            <li>External parties: Only with YouTube API Services for video functionality</li>
            <li>No data selling or unauthorized sharing</li>
          </ul>
        </div>
        <p>
          Data retention period: Maximum 30 days for YouTube data, 24 hours for watch history
        </p>
      </div>
    </section>
  );
};