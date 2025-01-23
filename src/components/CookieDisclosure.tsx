export const CookieDisclosure = () => {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Cookie Usage & Device Information</h2>
      <div className="space-y-4">
        <p>We collect and store information from your devices through:</p>
        <ul className="list-disc pl-6">
          <li>Browser cookies and local storage</li>
          <li>Device-specific identifiers</li>
          <li>Browser settings and preferences</li>
        </ul>
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
          <h3 className="font-semibold mb-2">Cookie Types & Purposes:</h3>
          <ul className="list-disc pl-6">
            <li>Essential cookies: Required for basic site functionality</li>
            <li>Performance cookies: To enhance user experience</li>
            <li>YouTube API cookies: Required for video playback and functionality</li>
            <li>Authentication cookies: For session management</li>
          </ul>
        </div>
        <p>
          Third-party cookies may be placed by YouTube API Services for video functionality.
          You can manage cookie preferences through your browser settings.
        </p>
      </div>
    </section>
  );
};