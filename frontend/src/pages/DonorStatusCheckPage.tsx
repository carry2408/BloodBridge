import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, CheckCircle2, XCircle, Clock, Heart, User, Phone, ShieldCheck, ArrowLeft, AlertCircle } from 'lucide-react';
import { apiHelper } from '../api/axiosClient';
import type { DonorResponse } from '../types';

export const DonorStatusCheckPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';
  const [regId, setRegId] = useState(initialId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [donorDetails, setDonorDetails] = useState<DonorResponse | null>(null);

  const fetchStatus = async (id: string) => {
    if (!id.trim()) return;
    setLoading(true);
    setError(null);
    setDonorDetails(null);

    try {
      const response = await apiHelper.get<DonorResponse>(`/donors/registration/${encodeURIComponent(id.trim())}`);
      if (response.success && response.data) {
        setDonorDetails(response.data);
      } else {
        setError(response.message || 'Donor registration ID not found');
      }
    } catch (err: unknown) {
      const errorObj = err as Error;
      setError(errorObj.message || 'Registration ID not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      fetchStatus(initialId);
    }
  }, [initialId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStatus(regId);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DONATED':
        return (
          <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Donation Completed
          </span>
        );
      case 'SCREENED':
        return (
          <span className="bg-blue-100 text-blue-800 border border-blue-300 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            Screened & Ready for Extraction
          </span>
        );
      case 'REJECTED':
        return (
          <span className="bg-red-100 text-red-800 border border-red-300 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
            <XCircle className="w-4 h-4 text-red-600" />
            Screening Ineligible
          </span>
        );
      default:
        return (
          <span className="bg-amber-100 text-amber-800 border border-amber-300 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-600" />
            Registered - Awaiting Medical Screening
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#1A2636] transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Search Header Card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 sm:p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1A2636]">Track Donor Registration Pass</h1>
            <p className="text-xs text-gray-500 mt-1">Enter your Registration Pass Code (e.g. MSRIT-BDC-2026-0001)</p>
          </div>

          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="MSRIT-BDC-2026-XXXX"
                value={regId}
                onChange={(e) => setRegId(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:bg-white focus:outline-none focus:border-[#16B7CC] font-mono tracking-wider transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#16B7CC] hover:bg-[#0E96AA] text-white px-6 py-3 rounded-lg text-sm font-bold shadow transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Check Status'}
            </button>
          </form>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Donor Result Card */}
        {donorDetails && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-[#1A2636] text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Registration Pass</span>
                <h3 className="text-xl font-bold font-mono text-[#16B7CC]">{donorDetails.registrationId}</h3>
              </div>
              <div>{getStatusBadge(donorDetails.status)}</div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-1">
                  <span className="text-gray-400 font-medium flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-gray-500" /> Donor Name
                  </span>
                  <span className="font-bold text-[#1A2636] text-sm block">{donorDetails.fullName}</span>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-1">
                  <span className="text-gray-400 font-medium flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-gray-500" /> Phone
                  </span>
                  <span className="font-bold text-[#1A2636] text-sm block">{donorDetails.phoneNumber}</span>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-1">
                  <span className="text-gray-400 font-medium flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-[#C8372D]" /> Blood Group
                  </span>
                  <span className="font-bold text-[#C8372D] text-sm block">
                    {donorDetails.bloodGroup ? donorDetails.bloodGroup.replace('_', ' ') : 'Pending Screening'}
                  </span>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-1">
                  <span className="text-gray-400 font-medium">Recorded Weight</span>
                  <span className="font-bold text-[#1A2636] text-sm block">
                    {donorDetails.weight ? `${donorDetails.weight} kg` : 'Pending Screening'}
                  </span>
                </div>
              </div>

              {donorDetails.remarks && (
                <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-lg text-xs text-amber-900">
                  <span className="font-bold block mb-1">Medical Remarks:</span>
                  <p>{donorDetails.remarks}</p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
