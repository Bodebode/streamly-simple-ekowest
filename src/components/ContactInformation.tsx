export const ContactInformation = () => {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
      <div className="space-y-4">
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
          <h3 className="font-semibold mb-2">Get in Touch</h3>
          <ul className="space-y-2">
            <li>Email: support@streamly.com</li>
            <li>Phone: +234 123 456 7890</li>
            <li>Address: Lagos, Nigeria</li>
          </ul>
        </div>
        <div className="mt-4">
          <p>For any concerns regarding:</p>
          <ul className="list-disc pl-6">
            <li>Data privacy inquiries</li>
            <li>Content removal requests</li>
            <li>Technical support</li>
            <li>General feedback</li>
          </ul>
        </div>
      </div>
    </section>
  );
};
