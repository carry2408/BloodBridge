import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShieldCheck, Activity, Users, Hospital, ArrowRight, Clock, PlusCircle, Search, Award, CheckCircle2 } from 'lucide-react';
import { apiHelper } from '../api/axiosClient';
import type { DashboardSummaryResponse } from '../types';

export const PublicHomePage: React.FC = () => {
  const navigate = useNavigate();
  const [quickRegId, setQuickRegId] = useState('');
  const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null);

  useEffect(() => {
    // Fetch summary metrics if public or available
    apiHelper.get<DashboardSummaryResponse>('/dashboard/summary')
      .then((res) => {
        if (res.success && res.data) {
          setSummary(res.data);
        }
      })
      .catch(() => {
        // Fallback demo summary data if backend is offline or unauthenticated
        setSummary({
          totalRegistrations: 1420,
          registered: 180,
          screened: 240,
          donated: 950,
          rejected: 50,
          totalVolunteers: 64,
          totalTeams: 12,
          totalMedicalPartners: 8,
        });
      });
  }, []);

  const handleQuickLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickRegId.trim()) {
      navigate(`/check-status?id=${encodeURIComponent(quickRegId.trim())}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Emergency Appeal Strip */}
      <div className="bg-[#C8372D] text-white py-2 px-4 text-xs font-medium text-center flex items-center justify-center gap-2">
        <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Urgent</span>
        <span>Active Blood Drive: MSRIT Annual Blood Donation Drive 2026</span>
        <Link to="/register-donor" className="underline font-bold hover:text-gray-100 flex items-center gap-1 ml-2">
          Register Now <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative bg-[#1A2636] text-white py-20 lg:py-28 overflow-hidden">
        {/* Background Demo Image with Dark Overlay */}
        <div className="absolute inset-0 z-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=1600&q=80')` }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A2636] via-[#1A2636]/90 to-transparent z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#16B7CC]">
                <Activity className="w-4 h-4" />
                <span>Saving Lives Through Structured Donating</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Give Blood. <br />
                <span className="text-[#16B7CC]">Bridge Hope.</span> Save Lives.
              </h1>

              <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl">
                Join our medical donation network. Fast, transparent registration, instant digital passes, and real-time screening tracking for all volunteers and hospitals.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/register-donor"
                  className="flex items-center gap-2 bg-[#C8372D] hover:bg-[#A62820] text-white font-bold px-7 py-3.5 rounded-lg shadow-lg hover:shadow-xl transition-all text-sm"
                >
                  <PlusCircle className="w-5 h-5" />
                  Register as Donor
                </Link>
                <Link
                  to="/check-status"
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-6 py-3.5 rounded-lg transition-colors text-sm"
                >
                  <Search className="w-5 h-5 text-[#16B7CC]" />
                  Lookup Pass Status
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#16B7CC]" />
                  <span>100% Medical Vetted</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Instant Queue Pass</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>Certified Drives</span>
                </div>
              </div>
            </div>

            {/* Hero Right: Pinned Quick Pass Card */}
            <div className="lg:col-span-5">
              <div className="glass-dark p-6 sm:p-8 rounded-2xl shadow-2xl border border-white/15">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                  <div>
                    <h3 className="text-lg font-bold text-white">Donor Pass Lookup</h3>
                    <p className="text-xs text-gray-400">Track your donation queue status instantly</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#16B7CC]/20 border border-[#16B7CC]/40 flex items-center justify-center text-[#16B7CC]">
                    <Search className="w-5 h-5" />
                  </div>
                </div>

                <form onSubmit={handleQuickLookup} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                      Registration ID / Pass Code
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. MSRIT-BDC-2026-0001"
                      value={quickRegId}
                      onChange={(e) => setQuickRegId(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-[#16B7CC] transition-colors"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#16B7CC] hover:bg-[#0E96AA] text-white font-bold py-3 px-4 rounded-lg text-sm shadow-md transition-colors flex items-center justify-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    Verify Registration
                  </button>
                </form>

                <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-gray-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Present your digital pass code to the volunteer screening table on drive day.</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Statistics Strip */}
      <section className="bg-white border-b border-gray-200 py-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2 text-[#C8372D] mb-1">
                <Heart className="w-6 h-6 fill-current" />
              </div>
              <div className="text-3xl font-extrabold text-[#1A2636]">
                {summary?.donated ?? 950}+
              </div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Donations Completed</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2 text-[#16B7CC] mb-1">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-3xl font-extrabold text-[#1A2636]">
                {summary?.totalRegistrations ?? 1420}+
              </div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Registered Donors</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2 text-emerald-600 mb-1">
                <Hospital className="w-6 h-6" />
              </div>
              <div className="text-3xl font-extrabold text-[#1A2636]">
                {summary?.totalMedicalPartners ?? 8}
              </div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Medical Partners</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2 text-amber-500 mb-1">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="text-3xl font-extrabold text-[#1A2636]">
                {summary?.totalVolunteers ?? 64}
              </div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Volunteers</p>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 text-[#16B7CC] font-bold text-xs uppercase tracking-widest">
              <span className="w-8 h-0.5 bg-[#16B7CC]"></span>
              Standardized Donation Process
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A2636]">
              Simple 3-Step Donation Lifecycle
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              BloodBridge streamlines the donation drive from online registration to medical screening and successful extraction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow relative">
              <div className="w-12 h-12 rounded-lg bg-[#C8372D]/10 text-[#C8372D] flex items-center justify-center font-bold text-lg mb-6">
                01
              </div>
              <h3 className="text-lg font-bold text-[#1A2636] mb-2">Online Registration</h3>
              <p className="text-gray-600 text-xs leading-relaxed mb-4">
                Fill out the quick donor registration form online. Receive your instant digital registration pass ID.
              </p>
              <Link to="/register-donor" className="text-xs font-bold text-[#C8372D] hover:underline flex items-center gap-1">
                Start Registration <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow relative">
              <div className="w-12 h-12 rounded-lg bg-[#16B7CC]/10 text-[#16B7CC] flex items-center justify-center font-bold text-lg mb-6">
                02
              </div>
              <h3 className="text-lg font-bold text-[#1A2636] mb-2">Medical Screening</h3>
              <p className="text-gray-600 text-xs leading-relaxed mb-4">
                Visit the camp venue. Volunteers check your weight, blood pressure, and verify blood group eligibility.
              </p>
              <span className="text-xs font-semibold text-gray-500">Verified by Medical Partners</span>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow relative">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-lg mb-6">
                03
              </div>
              <h3 className="text-lg font-bold text-[#1A2636] mb-2">Blood Extraction & Certificate</h3>
              <p className="text-gray-600 text-xs leading-relaxed mb-4">
                Donate safely with certified healthcare staff. Your status is updated to DONATED in real time.
              </p>
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Complete & Recorded
              </span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
