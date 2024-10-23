import React from 'react';
import { Link } from 'react-router-dom';
import { BookMarked, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <BookMarked className="h-6 w-6 text-indigo-600" />
            <span className="font-bold text-xl">WebScraper</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/scrapbook" className="text-gray-700 hover:text-indigo-600">
                  My Scraps
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600"
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;