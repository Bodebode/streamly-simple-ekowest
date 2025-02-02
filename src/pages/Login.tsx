import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthUI } from "@/components/AuthUI";
import { Drum } from "lucide-react";

const Login = () => {
  const [isLoading] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-koya-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center">
          <Drum className="w-12 h-12 text-koya-accent" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Welcome to Ekowest TV
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Sign in to your account to continue
          </p>
        </div>
        
        <div className="mt-8">
          <AuthUI />
        </div>

        {isLoading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-koya-accent"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;