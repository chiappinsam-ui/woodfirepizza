import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

export default function Auth({ view = 'login', onViewChange }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localView, setLocalView] = useState(view);

  useEffect(() => {
    setLocalView(view);
  }, [view]);

  const activeView = onViewChange ? view : localView;
  const isLogin = activeView === 'login';

  const handleAuth = async (event) => {
    event.preventDefault();
    setLoading(true);

    let error;

    if (isLogin) {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      error = signInError;
    } else {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      error = signUpError;
    }

    if (error) {
      alert(error.message);
    } else if (!isLogin) {
      // If signing up, Supabase usually sends a confirmation email by default.
      alert('Check your email for the login link!');
    }

    setLoading(false);
  };

  const toggleView = () => {
    const nextView = isLogin ? 'register' : 'login';
    if (onViewChange) {
      onViewChange(nextView);
    } else {
      setLocalView(nextView);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100">
      <div className="w-96 rounded bg-white p-8 shadow-md">
        <h1 className="mb-4 text-center text-2xl font-bold text-gray-800">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className="mb-6 text-center text-sm text-gray-500">
          {isLogin
            ? 'Sign in to access your dashboard'
            : 'Sign up to get started'}
        </p>

        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          <input
            className="rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <input
            className="rounded border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <button
            type="submit"
            className="rounded bg-blue-600 p-2 text-white transition hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={toggleView}
            className="text-sm text-blue-600 hover:underline"
          >
            {isLogin
              ? "Don't have an account? Sign Up"
              : 'Already have an account? Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}
