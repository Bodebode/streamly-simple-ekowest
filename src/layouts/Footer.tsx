
import React from 'react';
import { Link } from 'react-router-dom';
import { Youtube, ExternalLink } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full py-4 px-4 border-t bg-white dark:bg-koya-card">
      <div className="container mx-auto">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Youtube className="h-4 w-4 text-red-600" />
            <span>Content provided by YouTube</span>
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
            <a 
              href="https://www.youtube.com/t/terms" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:underline"
            >
              Terms<ExternalLink className="h-3 w-3" />
            </a>
            <span className="text-gray-600 dark:text-gray-400">© 2025 Ekowest TV</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
