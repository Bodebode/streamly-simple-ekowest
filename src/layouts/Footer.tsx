import React from 'react';
import { Link } from 'react-router-dom';
import { Youtube, ExternalLink, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full py-6 px-4 border-t bg-white dark:bg-koya-card">
      <div className="container mx-auto">
        <div className="flex flex-col gap-6">
          {/* YouTube Attribution Section */}
          <div className="flex items-center gap-2 text-sm">
            <Youtube className="h-5 w-5 text-red-600" />
            <span>Content provided by YouTube</span>
          </div>

          {/* Data Collection Notice */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            This site uses YouTube API Services. By using our service, you agree to our data collection practices in accordance with 
            <a 
              href="https://policies.google.com/privacy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline mx-1"
            >
              Google's Privacy Policy
            </a>
            and our
            <Link 
              to="/privacy"
              className="text-blue-600 dark:text-blue-400 hover:underline mx-1"
            >
              Privacy Policy
            </Link>.
          </div>

          {/* Main Links Section */}
          <div className="flex flex-wrap gap-6">
            <Link 
              to="/privacy"
              className="hover:underline"
            >
              Privacy Policy
            </Link>
            <a 
              href="https://www.youtube.com/t/terms" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:underline"
            >
              YouTube Terms of Service
              <ExternalLink className="h-4 w-4" />
            </a>
            <a 
              href="https://developers.google.com/youtube/terms/api-services-terms-of-service"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:underline"
            >
              YouTube API Terms
              <ExternalLink className="h-4 w-4" />
            </a>
            <a 
              href="mailto:contact@ekowest.tv" 
              className="flex items-center gap-1 hover:underline"
            >
              <Mail className="h-4 w-4" />
              Contact Us
            </a>
          </div>

          {/* Copyright Section */}
          <div className="text-sm">
            © 2025 Ekowest TV. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};