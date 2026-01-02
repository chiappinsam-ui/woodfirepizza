import { useEffect, useState } from 'react';
import Auth from './Auth.jsx';
import Navbar from './Navbar.jsx';
import { supabase } from './supabaseClient.js';

function App() {
  const [session, setSession] = useState(null);
  const [authView, setAuthView] = useState('login'); // 'login' or 'register'

  useEffect(() => {
    // 1. Check active session when app loads.
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // 2. Listen for changes (Login, Logout, Auto-refresh).
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar session={session} setAuthView={setAuthView} />

      <main className="mx-auto max-w-7xl p-6 sm:p-8">
        {!session ? (
          <div className="mt-16 flex justify-center">
            <Auth view={authView} onViewChange={setAuthView} />
          </div>
        ) : (
          <div className="mt-10">
            <h1 className="text-4xl font-bold text-gray-800">
              Welcome to the Member Area
            </h1>
            <p className="mt-4 text-gray-600">
              You can now access exclusive bookings and catering options here.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
