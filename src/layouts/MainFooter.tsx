import React from 'react';

export const MainFooter = () => {
  return (
    <footer className="bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="https://www.youtube.com/t/terms">Terms of Service</a></li>
              <li><a href="https://www.youtube.com/reporthistory">Report History</a></li>
              <li><a href="https://www.youtube.com/howyoutubeworks/policies/community-guidelines/">Community Guidelines</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Privacy</h3>
            <ul className="space-y-2">
              <li><a href="https://policies.google.com/privacy">Privacy Policy</a></li>
              <li><a href="https://www.youtube.com/t/terms_dataprocessing">Data Processing Terms</a></li>
              <li><a href="https://support.google.com/youtube/answer/7671399">Privacy Settings</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Safety</h3>
            <ul className="space-y-2">
              <li><a href="https://support.google.com/youtube/answer/2802027">Report Content</a></li>
              <li><a href="https://www.youtube.com/howyoutubeworks/policies/copyright/">Copyright</a></li>
              <li><a href="https://support.google.com/youtube/answer/2801895">Safety Center</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="https://support.google.com/youtube/">Help Center</a></li>
              <li><a href="https://support.google.com/youtube/gethelp">Contact Us</a></li>
              <li><a href="https://www.youtube.com/creators/">Creator Support</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
