import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import Auth from './pages/Auth.tsx';
import Index from './pages/Index.tsx';
import TechStack from './pages/TechStack.tsx';
import Watch2Earn from './pages/Watch2Earn.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: 'auth',
        element: <Auth />,
      },
      {
        path: 'tech-stack',
        element: <TechStack />,
      },
      {
        path: 'watch2earn',
        element: <Watch2Earn />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
);