import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Shield, Mail, KeyRound, AlertCircle, Heart } from 'lucide-react';
import { apiHelper } from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import type { AdminLoginResponse, VolunteerLoginResponse } from '../types';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState<'VOLUNTEER' | 'ADMIN'>('VOLUNTEER');

  // Volunteer state
  const [usn, setUsn] = useState('');
  const [volunteerPassword, setVolunteerPassword] = useState('');

  // Admin state
  const [email, setEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVolunteerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await apiHelper.post<VolunteerLoginResponse>('/auth/volunteer/login', {
        usn: usn.trim(),
        password: volunteerPassword,
      });

      if (response.success && response.data) {
        login(
          response.data.token,
          response.data.volunteerName,
          response.data.usn,
          'VOLUNTEER',
          response.data.teamId,
          response.data.teamName,
          response.data.id
        );
        navigate('/volunteer');
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err: unknown) {
      const errorObj = err as Error;
      setError(errorObj.message || 'Invalid USN or password');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await apiHelper.post<AdminLoginResponse>('/auth/admin/login', {
        email: email.trim(),
        password: adminPassword,
      });

      if (response.success && response.data) {
        login(response.data.token, response.data.adminName, response.data.email, 'ADMIN');
        navigate('/admin');
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err: unknown) {
      const errorObj = err as Error;
      setError(errorObj.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#C8372D] text-white shadow-lg">
          <Heart className="w-7 h-7 fill-current" />
        </div>
        <h2 className="text-3xl font-extrabold text-[#1A2636]">BloodBridge Portal Access</h2>
        <p className="text-xs text-gray-500">Sign in to access your volunteer screening queue or admin controls.</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          
          {/* Tabs */}
          <div className="grid grid-cols-2 bg-gray-100 p-1 border-b border-gray-200">
            <button
              onClick={() => { setActiveTab('VOLUNTEER'); setError(null); }}
              className={`py-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                activeTab === 'VOLUNTEER'
                  ? 'bg-white text-[#1A2636] shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <User className="w-4 h-4 text-[#16B7CC]" />
              Volunteer Portal
            </button>
            <button
              onClick={() => { setActiveTab('ADMIN'); setError(null); }}
              className={`py-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                activeTab === 'ADMIN'
                  ? 'bg-white text-[#1A2636] shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Shield className="w-4 h-4 text-[#C8372D]" />
              Admin Portal
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Volunteer Login Form */}
            {activeTab === 'VOLUNTEER' ? (
              <form onSubmit={handleVolunteerLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Volunteer USN (Identifier)
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. 1MS21CS001"
                      value={usn}
                      onChange={(e) => setUsn(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:bg-white focus:outline-none focus:border-[#16B7CC] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={volunteerPassword}
                      onChange={(e) => setVolunteerPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:bg-white focus:outline-none focus:border-[#16B7CC] transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#16B7CC] hover:bg-[#0E96AA] text-white font-bold py-3.5 px-4 rounded-lg text-sm shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  {loading ? 'Authenticating...' : 'Sign In as Volunteer'}
                </button>
              </form>
            ) : (
              /* Admin Login Form */
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Admin Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      placeholder="admin@bloodbridge.org"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:bg-white focus:outline-none focus:border-[#C8372D] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:bg-white focus:outline-none focus:border-[#C8372D] transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#C8372D] hover:bg-[#A62820] text-white font-bold py-3.5 px-4 rounded-lg text-sm shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Shield className="w-4 h-4" />
                  {loading ? 'Authenticating...' : 'Sign In as Admin'}
                </button>
              </form>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};
