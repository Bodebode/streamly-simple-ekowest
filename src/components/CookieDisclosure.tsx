export const CookieDisclosure = () => {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Cookie & Technology Usage</h2>
      <div className="space-y-4">
        <p>We use cookies and similar technologies to collect and store information when you visit our website:</p>
        
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
          <h3 className="font-semibold mb-2">Information We Collect:</h3>
          <ul className="list-disc pl-6">
            <li>Device information (browser type, operating system)</li>
            <li>Usage data (viewing history, preferences)</li>
            <li>Performance metrics</li>
            <li>YouTube API interaction data</li>
          </ul>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
          <h3 className="font-semibold mb-2">Cookie Types:</h3>
          <ul className="list-disc pl-6">
            <li>Essential cookies: Required for basic site functionality</li>
            <li>Performance cookies: Help us improve site performance</li>
            <li>YouTube API cookies: Enable video playback and features</li>
            <li>Preference cookies: Remember your settings and choices</li>
          </ul>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          Third-party services, including YouTube API Services, may also place cookies on your device. 
          These are governed by their respective privacy policies.
        </p>
      </div>
    </section>
  );
};