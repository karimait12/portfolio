import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { useLenis } from './hooks/useLenis';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { Experience } from './components/sections/Experience';
import { Stack } from './components/Stack';
import { Projects } from './components/sections/Projects';
import { Contact } from './components/sections/Contact';
import { lazy, Suspense } from 'react';
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminLogin = lazy(() => import('./pages/admin/Login'));
import { supabase } from './lib/supabase/client';
import { useState, useEffect } from 'react';

function Portfolio() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        
        <Experience />
        <Stack />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data?.session;
      const role = session?.user?.app_metadata?.role;

      if (session && role === 'admin') {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Checking access...</div>;
  }

  if (!authenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  useLenis();
  return (
    <Routes>
      <Route path="/" element={<Portfolio />} />
      <Route path="/admin/login" element={<Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}><AdminLogin /></Suspense>} />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}><AdminDashboard /></Suspense>
          </AdminRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
