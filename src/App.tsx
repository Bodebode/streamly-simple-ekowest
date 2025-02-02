import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./components/AuthProvider";
import { useAuth } from "./components/AuthProvider";
import Index from "./pages/Index";
import TechStack from "./pages/TechStack";
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { Login } from './pages/Login';
import Watch from './pages/Watch';
import { Watch2Earn } from './pages/Watch2Earn';
import RewardsDashboard from './pages/RewardsDashboard';
import MyList from './pages/MyList';
import { Profile } from './pages/Profile';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/watch2earn" element={<Watch2Earn />} />
                <Route path="/" element={<Index />} />
                <Route path="/watch/:videoId" element={<Watch />} />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
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
              </Routes>
            </TooltipProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;