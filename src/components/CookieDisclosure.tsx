export const CookieDisclosure = () => {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Cookie Usage</h2>
      <div className="space-y-4">
        <p>We use cookies and local storage for:</p>
        <ul className="list-disc pl-6">
          <li>Temporary video data caching</li>
          <li>Theme preferences (light/dark mode)</li>
          <li>Session management</li>
          <li>Performance optimization</li>
        </ul>
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
          <h3 className="font-semibold mb-2">Cookie Types:</h3>
          <ul className="list-disc pl-6">
            <li>Essential cookies: For basic site functionality</li>
            <li>Performance cookies: For enhanced user experience</li>
            <li>YouTube API cookies: For video playback functionality</li>
          </ul>
        </div>
      </div>
    </section>
  );
};
