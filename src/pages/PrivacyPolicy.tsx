import { YouTubeApiDisclosure } from '../components/YouTubeApiDisclosure';
import { DataHandlingDisclosure } from '../components/DataHandlingDisclosure';
import { CookieDisclosure } from '../components/CookieDisclosure';
import { ContactInformation } from '../components/ContactInformation';

export const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <YouTubeApiDisclosure />
      <DataHandlingDisclosure />
      <CookieDisclosure />
      <ContactInformation />
      
      <div className="mt-8 text-sm text-gray-600 dark:text-gray-400">
        Last updated: {new Date().toLocaleDateString()}
      </div>
    </div>
  );
};