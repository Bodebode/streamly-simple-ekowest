export const DataHandlingDisclosure = () => {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Data Handling & Storage</h2>
      <div className="space-y-4">
        <p>We handle your data with utmost care and transparency:</p>
        <ul className="list-disc pl-6">
          <li>Video preferences are stored locally in your browser</li>
          <li>Watch history is maintained for 24 hours only</li>
          <li>No personal data is shared with third parties</li>
          <li>Cache is automatically cleared every 24 hours</li>
          <li>You can manually clear cached data at any time</li>
        </ul>
        <p>
          Data retention period: 24 hours maximum
        </p>
      </div>
    </section>
  );
};
