export const ContactInformation = () => {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
      <div className="space-y-4">
        <p>
          For any questions about our privacy policy or data handling practices, please contact us:
        </p>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
          <ul className="space-y-2">
            <li>
              <span className="font-semibold">Email:</span>{" "}
              <a 
                href="mailto:contact@ekowest.tv"
                className="text-blue-500 hover:underline"
              >
                contact@ekowest.tv
              </a>
            </li>
            <li>
              <span className="font-semibold">Support Hours:</span> Monday - Friday, 9:00 AM - 5:00 PM WAT
            </li>
            <li>
              <span className="font-semibold">Response Time:</span> Within 48 hours
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};