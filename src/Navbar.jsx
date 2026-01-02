import { supabase } from './supabaseClient.js';

export default function Navbar({ session, setAuthView }) {
  return (
    <nav className="flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4 sm:px-8">
      {/* Left: brand placeholder */}
      <div className="hidden text-xl font-bold md:block">{/* Logo here */}</div>

      {/* Right: nav links + auth controls */}
      <div className="flex items-center gap-6 text-sm font-medium text-gray-600 sm:gap-8">
        <a href="#" className="hover:text-blue-500">
          Home
        </a>
        <a href="#" className="hover:text-blue-500">
          Menu
        </a>
        <a href="#" className="hover:text-blue-500">
          Catering Options
        </a>
        <a href="#" className="hover:text-blue-500">
          Bookings
        </a>
        <a href="#" className="hover:text-blue-500">
          Gallery
        </a>
        <a href="#" className="hover:text-blue-500">
          Contact
        </a>

        <div className="ml-2 flex items-center gap-4 border-l border-gray-300 pl-4 sm:gap-5 sm:pl-6">
          {!session ? (
            <>
              <button
                onClick={() => setAuthView?.('login')}
                className="btn-login"
              >
                Login
              </button>
              <button
                onClick={() => setAuthView?.('register')}
                className="rounded-full bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
              >
                Register
              </button>
            </>
          ) : (
            <button
              onClick={() => supabase.auth.signOut()}
              className="text-red-500 hover:text-red-700"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
