import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Search, Play, MonitorPlay, Filter, RefreshCw, Smartphone } from 'lucide-react';

const APIDocumentation = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-koya-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">YouTube API Services Implementation</h1>
        
        {/* Core Services Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Core API Services Implementation</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 dark:bg-koya-card">
              <Search className="w-8 h-8 mb-4 text-koya-accent" />
              <h3 className="text-lg font-semibold mb-2">Search API</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Powers content discovery and category-based browsing functionality
              </p>
            </Card>
            <Card className="p-6 dark:bg-koya-card">
              <Play className="w-8 h-8 mb-4 text-koya-accent" />
              <h3 className="text-lg font-semibold mb-2">Videos API</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Retrieves detailed video metadata and statistics
              </p>
            </Card>
            <Card className="p-6 dark:bg-koya-card">
              <MonitorPlay className="w-8 h-8 mb-4 text-koya-accent" />
              <h3 className="text-lg font-semibold mb-2">Related Videos API</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Drives our intelligent recommendation system
              </p>
            </Card>
          </div>
        </section>

        {/* Implementation Details */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Implementation Details</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 dark:bg-koya-card">
              <h3 className="text-lg font-semibold mb-4">Data Processing</h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <Filter className="w-5 h-5 mt-1 flex-shrink-0 text-koya-accent" />
                  <span>Content filtering based on view count, comments, and duration</span>
                </li>
                <li className="flex items-start gap-2">
                  <RefreshCw className="w-5 h-5 mt-1 flex-shrink-0 text-koya-accent" />
                  <span>7-day automatic content refresh cycle</span>
                </li>
              </ul>
            </Card>
            <Card className="p-6 dark:bg-koya-card">
              <h3 className="text-lg font-semibold mb-4">Quality Control</h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <Smartphone className="w-5 h-5 mt-1 flex-shrink-0 text-koya-accent" />
                  <span>Fully responsive design for all devices</span>
                </li>
                <li className="flex items-start gap-2">
                  <Play className="w-5 h-5 mt-1 flex-shrink-0 text-koya-accent" />
                  <span>High-resolution video previews and thumbnails</span>
                </li>
              </ul>
            </Card>
          </div>
        </section>

        {/* User Interface Features */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">User Interface Integration</h2>
          <Card className="p-6 dark:bg-koya-card">
            <ul className="space-y-4 text-gray-600 dark:text-gray-300">
              <li>• Netflix-style grid layout for intuitive content discovery</li>
              <li>• Hover-based video previews (85-115 second clips)</li>
              <li>• Custom video player controls including dim lights and fullscreen</li>
              <li>• Smart content recommendations based on viewing history</li>
              <li>• Efficient error handling with graceful fallbacks</li>
            </ul>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default APIDocumentation;