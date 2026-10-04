import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, Activity, User, LogOut, Shield, PlusCircle, Search, LayoutDashboard } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-[#1A2636] text-white shadow-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <div className="w-9 h-9 rounded-lg bg-[#C8372D] flex items-center justify-center text-white shadow-sm">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <span>Blood<span className="text-[#16B7CC]">Bridge</span></span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              to="/"
              className={`transition-colors hover:text-[#16B7CC] ${isActive('/') ? 'text-[#16B7CC] font-semibold' : 'text-gray-300'}`}
            >
              Home
            </Link>
            <Link
              to="/register-donor"
              className={`flex items-center gap-1.5 transition-colors hover:text-[#16B7CC] ${isActive('/register-donor') ? 'text-[#16B7CC] font-semibold' : 'text-gray-300'}`}
            >
              <PlusCircle className="w-4 h-4" />
              Register as Donor
            </Link>
            <Link
              to="/check-status"
              className={`flex items-center gap-1.5 transition-colors hover:text-[#16B7CC] ${isActive('/check-status') ? 'text-[#16B7CC] font-semibold' : 'text-gray-300'}`}
            >
              <Search className="w-4 h-4" />
              Check Status
            </Link>

            {isAuthenticated && user?.role === 'VOLUNTEER' && (
              <Link
                to="/volunteer"
                className={`flex items-center gap-1.5 transition-colors hover:text-[#16B7CC] ${isActive('/volunteer') ? 'text-[#16B7CC] font-semibold' : 'text-gray-300'}`}
              >
                <Activity className="w-4 h-4 text-[#16B7CC]" />
                Volunteer Queue
              </Link>
            )}

            {isAuthenticated && user?.role === 'ADMIN' && (
              <Link
                to="/admin"
                className={`flex items-center gap-1.5 transition-colors hover:text-[#16B7CC] ${isActive('/admin') ? 'text-[#16B7CC] font-semibold' : 'text-gray-300'}`}
              >
                <LayoutDashboard className="w-4 h-4 text-[#16B7CC]" />
                Admin Portal
              </Link>
            )}
          </nav>

          {/* User Auth Buttons */}
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg text-xs font-medium">
                  <User className="w-3.5 h-3.5 text-[#16B7CC]" />
                  <span className="text-gray-200">{user.name}</span>
                  <span className="bg-[#16B7CC]/20 text-[#16B7CC] border border-[#16B7CC]/30 px-1.5 py-0.5 rounded text-[10px] font-bold">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 bg-[#C8372D] hover:bg-[#A62820] text-white px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 bg-[#16B7CC] hover:bg-[#0E96AA] text-white px-4 py-2 rounded-md text-xs font-semibold transition-colors shadow-sm"
              >
                <Shield className="w-4 h-4" />
                Portal Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
