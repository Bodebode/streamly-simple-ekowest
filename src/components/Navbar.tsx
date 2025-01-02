import { Home, Globe, Star, Calendar, Film, Drum, Search, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-koya-background to-transparent">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-koya-accent">
              <Drum size={28} className="text-koya-accent" />
              Ekowest TV
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className="flex items-center space-x-2 text-koya-text hover:text-koya-accent transition-colors">
                <Home size={20} />
                <span>Home</span>
              </Link>
              
              <Link to="/language" className="flex items-center space-x-2 text-koya-text hover:text-koya-accent transition-colors">
                <Globe size={20} />
                <span>Browse by Language</span>
              </Link>
              
              <Link to="/favorites" className="flex items-center space-x-2 text-koya-text hover:text-koya-accent transition-colors">
                <Star size={20} />
                <span>My Favourites</span>
              </Link>
              
              <Link to="/new" className="flex items-center space-x-2 text-koya-text hover:text-koya-accent transition-colors">
                <Film size={20} />
                <span>New Release</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="text-koya-text hover:text-koya-accent transition-colors">
              <Search size={24} />
            </button>
            <button className="text-koya-text hover:text-koya-accent transition-colors">
              <Mail size={24} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};