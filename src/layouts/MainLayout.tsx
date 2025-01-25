import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { MainFooter } from './MainFooter';

interface MainLayoutProps {
  children: React.ReactNode;
  showMainFooter?: boolean;
}

export const MainLayout = ({ children, showMainFooter = false }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      {showMainFooter ? <MainFooter /> : <Footer />}
    </div>
  );
};