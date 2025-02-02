import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./components/AuthProvider";
import { useAuth } from "./components/AuthProvider";
import Index from "./pages/Index";
import Login from "./pages/Login";
import MyList from "./pages/MyList";
import Watch from "./pages/Watch";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Watch2Earn from "./pages/Watch2Earn";
import { RewardsDashboard } from "./pages/RewardsDashboard";
import Profile from "./pages/Profile";

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

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <TooltipProvider>
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
              <Sonner />
            </TooltipProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;