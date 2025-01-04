import { Globe, Star, Calendar, Film, Drum, Search, Mail, LogOut, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthProvider';
import { Button } from './ui/button';
import { useState } from 'react';

export const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-koya-background to-transparent">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-xl md:text-2xl font-bold text-koya-accent">
              <Drum size={24} className="text-koya-accent" />
              <span className="hidden sm:inline">Ekowest TV</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-koya-text hover:text-koya-accent"
          >
            <Menu size={24} />
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
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

            <button className="text-koya-text hover:text-koya-accent transition-colors">
              <Search size={24} />
            </button>
            <button className="text-koya-text hover:text-koya-accent transition-colors">
              <Mail size={24} />
            </button>
            {user && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-koya-text hover:text-koya-accent transition-colors"
              >
                <LogOut size={24} />
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-koya-background border-t border-gray-700 py-4">
            <div className="flex flex-col space-y-4 px-4">
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

              <div className="flex space-x-4">
                <button className="text-koya-text hover:text-koya-accent transition-colors">
                  <Search size={24} />
                </button>
                <button className="text-koya-text hover:text-koya-accent transition-colors">
                  <Mail size={24} />
                </button>
                {user && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    className="text-koya-text hover:text-koya-accent transition-colors"
                  >
                    <LogOut size={24} />
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};