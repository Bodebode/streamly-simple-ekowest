import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./components/AuthProvider";
import { useAuth } from "./components/AuthProvider";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import TechStack from "./pages/TechStack";
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import Watch from './pages/Watch';
import { Watch2Earn } from './pages/Watch2Earn';
import RewardsDashboard from './pages/RewardsDashboard';
import MyList from './pages/MyList';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const App = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/watch2earn" element={<Watch2Earn />} />
                <Route 
                  path="/my-list" 
                  element={
                    <ProtectedRoute>
                      <MyList />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/rewards" 
                  element={
                    <ProtectedRoute>
                      <RewardsDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/watch/:videoId" element={<Watch />} />
                <Route 
                  path="/" 
                  element={
                    <ProtectedRoute>
                      <Index />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;