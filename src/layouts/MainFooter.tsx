
import React from 'react';

export const MainFooter = () => {
  return (
    <footer className="bg-background py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Legal</h3>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li><a href="https://www.youtube.com/t/terms" className="hover:underline">Terms</a></li>
              <li><a href="https://www.youtube.com/howyoutubeworks/policies/community-guidelines/" className="hover:underline">Guidelines</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Privacy</h3>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li><a href="https://policies.google.com/privacy" className="hover:underline">Privacy Policy</a></li>
              <li><a href="https://support.google.com/youtube/answer/7671399" className="hover:underline">Settings</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Safety</h3>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li><a href="https://support.google.com/youtube/answer/2802027" className="hover:underline">Report</a></li>
              <li><a href="https://www.youtube.com/howyoutubeworks/policies/copyright/" className="hover:underline">Copyright</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Support</h3>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li><a href="https://support.google.com/youtube/" className="hover:underline">Help</a></li>
              <li><a href="https://support.google.com/youtube/gethelp" className="hover:underline">Contact</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
