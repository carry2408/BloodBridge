import React, { useState, useEffect } from 'react';
import { Activity, Heart, ShieldCheck, CheckCircle2, XCircle, Search, RefreshCw, Scale, FileText, AlertCircle, Droplets, Thermometer, Stethoscope, Lock, Users } from 'lucide-react';
import { apiHelper } from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import type { WaitingDonorQueueResponse, ScreenDonorRequest, CompleteDonationRequest, BloodGroup, DonorResponse, VolunteerResponse } from '../types';

export const VolunteerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'SCREENING' | 'DONATION'>('SCREENING');
  
  const [screeningQueue, setScreeningQueue] = useState<WaitingDonorQueueResponse[]>([]);
  const [donationQueue, setDonationQueue] = useState<WaitingDonorQueueResponse[]>([]);
  const [currentVolunteer, setCurrentVolunteer] = useState<VolunteerResponse | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Screening Modal State
  const [selectedDonor, setSelectedDonor] = useState<WaitingDonorQueueResponse | null>(null);
  const [screeningForm, setScreeningForm] = useState<ScreenDonorRequest>({
    status: 'SCREENED',
    bloodGroup: 'O_POSITIVE',
    weight: 65,
    bloodPressure: '120/80',
    sugarLevel: 110,
    hemoglobin: 14.5,
    remarks: '',
    volunteerId: 1,
  });
  const [submittingScreening, setSubmittingScreening] = useState(false);

  // Donation Modal State
  const [selectedDonationDonor, setSelectedDonationDonor] = useState<WaitingDonorQueueResponse | null>(null);
  const [donationForm, setDonationForm] = useState<CompleteDonationRequest>({
    volunteerId: 1,
    unitsDonated: 350,
    bloodPressure: '120/80',
    sugarLevel: 110,
    hemoglobin: 14.5,
    remarks: '',
  });
  const [submittingDonation, setSubmittingDonation] = useState(false);

  const fetchInitialData = async (showLoadingSpinner = false) => {
    if (showLoadingSpinner) setLoading(true);
    setError(null);
    try {
      if (user && user.role === 'VOLUNTEER') {
        const activeVol: VolunteerResponse = {
          id: user.id || 1,
          fullName: user.name,
          usn: user.identifier,
          email: '',
          phoneNumber: '',
          role: 'VOLUNTEER',
          status: 'ACTIVE',
          teamId: user.teamId,
          teamName: user.teamName,
        };
        setCurrentVolunteer(activeVol);
        setScreeningForm((prev) => ({ ...prev, volunteerId: activeVol.id }));
        setDonationForm((prev) => ({ ...prev, volunteerId: activeVol.id }));
      }

      const [screenRes, donateRes] = await Promise.all([
        apiHelper.get<WaitingDonorQueueResponse[]>('/dashboard/waiting-for-screening'),
        apiHelper.get<WaitingDonorQueueResponse[]>('/dashboard/waiting-for-donation'),
      ]);

      if (screenRes.success && screenRes.data) {
        setScreeningQueue(screenRes.data);
      }
      if (donateRes.success && donateRes.data) {
        setDonationQueue(donateRes.data);
      }
    } catch (err: unknown) {
      if (showLoadingSpinner) {
        const errorObj = err as Error;
        setError(errorObj.message || 'Failed to load live donor queues');
      }
    } finally {
      if (showLoadingSpinner) setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData(true);

    // Automatically reload donor screening and donation queues every 2 seconds
    const intervalId = setInterval(() => {
      fetchInitialData(false);
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  const handleOpenScreeningModal = (donor: WaitingDonorQueueResponse) => {
    const activeVolId = currentVolunteer?.id || user?.id || 1;
    setSelectedDonor(donor);
    setScreeningForm({
      status: 'SCREENED',
      bloodGroup: 'O_POSITIVE',
      weight: 65,
      bloodPressure: '120/80',
      sugarLevel: 110,
      hemoglobin: 14.5,
      remarks: '',
      volunteerId: activeVolId,
    });
  };

  const handleScreenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDonor) return;
    setSubmittingScreening(true);

    try {
      const activeVolId = currentVolunteer?.id || user?.id || screeningForm.volunteerId || 1;
      const payload: ScreenDonorRequest = {
        ...screeningForm,
        volunteerId: activeVolId,
      };

      const response = await apiHelper.patch<DonorResponse>(
        `/donors/registration/${encodeURIComponent(selectedDonor.registrationId)}/screening`,
        payload
      );

      if (response.success) {
        setSelectedDonor(null);
        fetchInitialData();
      } else {
        alert(response.message || 'Screening submission failed');
      }
    } catch (err: unknown) {
      const errorObj = err as Error;
      alert(errorObj.message || 'Screening update failed');
    } finally {
      setSubmittingScreening(false);
    }
  };

  const handleOpenDonationModal = (donor: WaitingDonorQueueResponse) => {
    const activeVolId = currentVolunteer?.id || user?.id || 1;
    const activeTeamId = currentVolunteer?.teamId || user?.teamId;

    if (activeTeamId && donor.teamId && donor.teamId !== activeTeamId) {
      alert(`Access Restricted: This donor was screened by ${donor.teamName || 'another team'}. Only members of ${donor.teamName || 'that team'} can extract blood and complete this donation.`);
      return;
    }

    setSelectedDonationDonor(donor);
    setDonationForm({
      volunteerId: activeVolId,
      unitsDonated: 350,
      bloodPressure: donor.bloodPressure || '120/80',
      sugarLevel: donor.sugarLevel || 110,
      hemoglobin: donor.hemoglobin || 14.5,
      remarks: 'Donated 350ml smoothly.',
    });
  };

  const handleDonationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDonationDonor) return;
    setSubmittingDonation(true);

    try {
      const activeVolId = currentVolunteer?.id || user?.id || donationForm.volunteerId || 1;
      const payload: CompleteDonationRequest = {
        ...donationForm,
        volunteerId: activeVolId,
      };

      const response = await apiHelper.patch<DonorResponse>(
        `/donors/registration/${encodeURIComponent(selectedDonationDonor.registrationId)}/donate`,
        payload
      );

      if (response.success) {
        setSelectedDonationDonor(null);
        fetchInitialData();
      } else {
        alert(response.message || 'Donation update failed');
      }
    } catch (err: unknown) {
      const errorObj = err as Error;
      alert(errorObj.message || 'Failed to record donation');
    } finally {
      setSubmittingDonation(false);
    }
  };

  const filteredScreeningQueue = screeningQueue.filter(
    (item) =>
      item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.registrationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phoneNumber.includes(searchTerm)
  );

  const activeVolTeamId = currentVolunteer?.teamId || user?.teamId;

  const baseDonationQueue = donationQueue.filter((donor) => {
    if (activeVolTeamId && donor.teamId) {
      return donor.teamId === activeVolTeamId;
    }
    return true;
  });

  const filteredDonationQueue = baseDonationQueue.filter(
    (item) =>
      item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.registrationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phoneNumber.includes(searchTerm) ||
      (item.teamName && item.teamName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Banner Header */}
        <div className="bg-[#1A2636] rounded-2xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-[#16B7CC]/20 border border-[#16B7CC]/30 text-[#16B7CC] px-3 py-1 rounded-full text-xs font-bold">
              <Activity className="w-3.5 h-3.5" />
              Volunteer Field Portal & Team Processing
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">Camp Donor Queue & Vital Processing</h1>
            <p className="text-xs text-gray-400">
              Logged in as: <span className="font-bold text-white">{currentVolunteer?.fullName || user?.name || 'Active Volunteer'}</span> ({currentVolunteer?.usn || user?.identifier || ''}) 
              {(currentVolunteer?.teamName || user?.teamName) && (
                <span className="ml-2 bg-[#C8372D] text-white px-2 py-0.5 rounded text-[11px] font-bold">
                  {currentVolunteer?.teamName || user?.teamName}
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchInitialData(true)}
              disabled={loading}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 border border-white/20"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh Queues
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Main Content Area */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          
          {/* Controls Header */}
          <div className="p-6 border-b border-gray-200 flex flex-col lg:flex-row items-center justify-between gap-4">
            
            {/* Main Section Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-xl w-full lg:w-auto">
              <button
                onClick={() => setActiveTab('SCREENING')}
                className={`flex-1 lg:flex-initial px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'SCREENING'
                    ? 'bg-white text-[#1A2636] shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-[#16B7CC]" />
                Waiting for Screening ({screeningQueue.length})
              </button>
              <button
                onClick={() => setActiveTab('DONATION')}
                className={`flex-1 lg:flex-initial px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'DONATION'
                    ? 'bg-white text-[#1A2636] shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Heart className="w-4 h-4 text-[#C8372D] fill-current" />
                Waiting for Donation ({baseDonationQueue.length})
              </button>
            </div>

            {/* Active Team Filter Info Badge */}
            {activeTab === 'DONATION' && (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-emerald-900 text-xs font-bold">
                <Users className="w-4 h-4 text-emerald-700" />
                <span>Team Queue: <span className="bg-emerald-700 text-white px-2 py-0.5 rounded text-[11px] font-bold">{currentVolunteer?.teamName || user?.teamName || 'Team Queue'}</span></span>
              </div>
            )}

            {/* Search Bar */}
            <div className="relative w-full lg:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search name, pass code, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs text-gray-900 focus:bg-white focus:outline-none focus:border-[#16B7CC]"
              />
            </div>
          </div>

          {/* Queue Tables */}
          {activeTab === 'SCREENING' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    <th className="py-3.5 px-6">Pass Code</th>
                    <th className="py-3.5 px-6">Donor Name</th>
                    <th className="py-3.5 px-6">Age</th>
                    <th className="py-3.5 px-6">Phone</th>
                    <th className="py-3.5 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                  {filteredScreeningQueue.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-gray-400 font-medium">
                        No donors currently waiting for medical screening.
                      </td>
                    </tr>
                  ) : (
                    filteredScreeningQueue.map((donor) => (
                      <tr key={donor.registrationId} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6 font-mono font-bold text-[#16B7CC]">{donor.registrationId}</td>
                        <td className="py-4 px-6 font-semibold text-gray-900">{donor.fullName}</td>
                        <td className="py-4 px-6">{donor.age} yrs</td>
                        <td className="py-4 px-6">{donor.phoneNumber}</td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleOpenScreeningModal(donor)}
                            className="bg-[#16B7CC] hover:bg-[#0E96AA] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm inline-flex items-center gap-1.5"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Perform Screening & Vitals
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    <th className="py-3.5 px-6">Pass Code</th>
                    <th className="py-3.5 px-6">Donor Name</th>
                    <th className="py-3.5 px-6">Blood Group</th>
                    <th className="py-3.5 px-6">Screening Team</th>
                    <th className="py-3.5 px-6">Screening Vitals</th>
                    <th className="py-3.5 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                  {filteredDonationQueue.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-gray-400 font-medium">
                        No screened donors found matching current queue filter.
                      </td>
                    </tr>
                  ) : (
                    filteredDonationQueue.map((donor) => {
                      const isMyTeam = !currentVolunteer?.teamId || !donor.teamId || donor.teamId === currentVolunteer.teamId;

                      return (
                        <tr key={donor.registrationId} className={`transition-colors ${isMyTeam ? 'hover:bg-emerald-50/40' : 'bg-gray-50/50 hover:bg-gray-100/50'}`}>
                          <td className="py-4 px-6 font-mono font-bold text-[#C8372D]">{donor.registrationId}</td>
                          <td className="py-4 px-6 font-semibold text-gray-900">
                            <div>{donor.fullName}</div>
                            <div className="text-[11px] text-gray-400">{donor.phoneNumber}</div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-black uppercase bg-red-100 text-[#C8372D] border border-red-200">
                              {donor.bloodGroup ? donor.bloodGroup.replace('_', ' ') : 'O+'}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 ${
                              isMyTeam ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-gray-200 text-gray-700'
                            }`}>
                              <Users className="w-3 h-3" />
                              {donor.teamName || 'Unassigned'}
                              {isMyTeam && <span className="text-[10px] bg-emerald-700 text-white px-1.5 py-0.2 rounded font-mono ml-1">MY TEAM</span>}
                            </span>
                          </td>
                          <td className="py-4 px-6 font-mono text-[11px] text-gray-600">
                            <div>BP: <span className="font-bold text-gray-900">{donor.bloodPressure || '120/80'}</span> | Hb: <span className="font-bold text-gray-900">{donor.hemoglobin ? donor.hemoglobin + ' g/dL' : '14.5'}</span></div>
                          </td>
                          <td className="py-4 px-6 text-right">
                            {isMyTeam ? (
                              <button
                                onClick={() => handleOpenDonationModal(donor)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm inline-flex items-center gap-1.5"
                              >
                                <Droplets className="w-3.5 h-3.5" />
                                Process Donation Units
                              </button>
                            ) : (
                              <button
                                disabled
                                title={`This donor was screened by ${donor.teamName || 'another team'}. Only ${donor.teamName || 'that team'} can extract blood.`}
                                className="bg-gray-200 text-gray-500 cursor-not-allowed px-3 py-1.5 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 border border-gray-300"
                              >
                                <Lock className="w-3 h-3 text-gray-400" />
                                Restricted to {donor.teamName || 'Screening Team'}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </div>

      {/* Medical Screening Modal */}
      {selectedDonor && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-gray-100 my-8">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#1A2636]">Medical Eligibility & Vital Screening</h3>
                <p className="text-xs text-[#16B7CC] font-mono">{selectedDonor.registrationId}</p>
              </div>
              <button
                onClick={() => setSelectedDonor(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScreenSubmit} className="space-y-4 text-xs">
              
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex justify-between items-center">
                <span className="text-gray-500 font-medium">Donor Name:</span>
                <span className="font-bold text-gray-900 text-sm">{selectedDonor.fullName}</span>
              </div>

              {/* Screening Team Badge */}
              <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-blue-900 text-[11px] flex justify-between items-center">
                <span>Screening Team Assignment:</span>
                <span className="font-bold text-xs bg-blue-700 text-white px-2 py-0.5 rounded">
                  {currentVolunteer?.teamName || user?.teamName || 'Unassigned'}
                </span>
              </div>

              {/* Status Outcome */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Screening Outcome
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setScreeningForm((prev) => ({ ...prev, status: 'SCREENED' }))}
                    className={`py-2.5 px-3 rounded-lg font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      screeningForm.status === 'SCREENED'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                        : 'bg-gray-50 border-gray-300 text-gray-600'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Eligible (SCREENED)
                  </button>

                  <button
                    type="button"
                    onClick={() => setScreeningForm((prev) => ({ ...prev, status: 'REJECTED' }))}
                    className={`py-2.5 px-3 rounded-lg font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      screeningForm.status === 'REJECTED'
                        ? 'bg-red-50 border-red-500 text-red-700'
                        : 'bg-gray-50 border-gray-300 text-gray-600'
                    }`}
                  >
                    <XCircle className="w-4 h-4 text-red-600" />
                    Ineligible (REJECTED)
                  </button>
                </div>
              </div>

              {/* Blood Group */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Blood Group
                </label>
                <select
                  value={screeningForm.bloodGroup}
                  onChange={(e) => setScreeningForm((prev) => ({ ...prev, bloodGroup: e.target.value as BloodGroup }))}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold text-gray-900 focus:outline-none focus:border-[#16B7CC]"
                >
                  <option value="A_POSITIVE">A Positive (A+)</option>
                  <option value="A_NEGATIVE">A Negative (A-)</option>
                  <option value="B_POSITIVE">B Positive (B+)</option>
                  <option value="B_NEGATIVE">B Negative (B-)</option>
                  <option value="AB_POSITIVE">AB Positive (AB+)</option>
                  <option value="AB_NEGATIVE">AB Negative (AB-)</option>
                  <option value="O_POSITIVE">O Positive (O+)</option>
                  <option value="O_NEGATIVE">O Negative (O-)</option>
                </select>
              </div>

              {/* Vitals Grid (BP, Sugar, Hb, Weight) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1 flex items-center gap-1">
                    <Stethoscope className="w-3.5 h-3.5 text-gray-500" /> Blood Pressure (BP)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 120/80"
                    value={screeningForm.bloodPressure || ''}
                    onChange={(e) => setScreeningForm((prev) => ({ ...prev, bloodPressure: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg font-mono font-bold text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1 flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5 text-gray-500" /> Sugar Level (mg/dL)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 110"
                    value={screeningForm.sugarLevel || ''}
                    onChange={(e) => setScreeningForm((prev) => ({ ...prev, sugarLevel: parseFloat(e.target.value) || 100 }))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg font-bold text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1 flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-gray-500" /> Hemoglobin (g/dL)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="e.g. 14.5"
                    value={screeningForm.hemoglobin || ''}
                    onChange={(e) => setScreeningForm((prev) => ({ ...prev, hemoglobin: parseFloat(e.target.value) || 12 }))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg font-bold text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1 flex items-center gap-1">
                    <Scale className="w-3.5 h-3.5 text-gray-500" /> Weight (kg)
                  </label>
                  <input
                    type="number"
                    required
                    min={45}
                    max={200}
                    value={screeningForm.weight}
                    onChange={(e) => setScreeningForm((prev) => ({ ...prev, weight: parseFloat(e.target.value) || 50 }))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg font-bold text-gray-900"
                  />
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-gray-500" /> Medical Remarks
                </label>
                <textarea
                  rows={2}
                  placeholder="Medical observations or reasons for eligibility..."
                  value={screeningForm.remarks}
                  onChange={(e) => setScreeningForm((prev) => ({ ...prev, remarks: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs text-gray-900"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedDonor(null)}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingScreening}
                  className="px-5 py-2 rounded-lg text-xs font-bold bg-[#16B7CC] hover:bg-[#0E96AA] text-white shadow disabled:opacity-50"
                >
                  {submittingScreening ? 'Saving...' : 'Save Screening & Assign Team'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Donation Completion & Units Modal */}
      {selectedDonationDonor && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-gray-100 my-8">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#1A2636]">Record Blood Donation & Extracted Units</h3>
                <p className="text-xs text-[#C8372D] font-mono">{selectedDonationDonor.registrationId}</p>
              </div>
              <button
                onClick={() => setSelectedDonationDonor(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDonationSubmit} className="space-y-4 text-xs">
              
              <div className="bg-red-50 border border-red-200 p-3 rounded-xl flex justify-between items-center text-red-900">
                <span className="text-xs font-medium">Donor Name:</span>
                <span className="font-bold text-sm">{selectedDonationDonor.fullName}</span>
              </div>

              {/* Units Donated */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Droplets className="w-4 h-4 text-[#C8372D]" /> Blood Units Extracted (ml)
                </label>
                <div className="grid grid-cols-3 gap-3 mb-2">
                  <button
                    type="button"
                    onClick={() => setDonationForm((prev) => ({ ...prev, unitsDonated: 350 }))}
                    className={`py-2 px-3 rounded-lg font-bold border text-xs transition-all ${
                      donationForm.unitsDonated === 350
                        ? 'bg-[#C8372D] text-white border-[#C8372D]'
                        : 'bg-gray-50 border-gray-300 text-gray-700'
                    }`}
                  >
                    350 ml (Standard)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDonationForm((prev) => ({ ...prev, unitsDonated: 450 }))}
                    className={`py-2 px-3 rounded-lg font-bold border text-xs transition-all ${
                      donationForm.unitsDonated === 450
                        ? 'bg-[#C8372D] text-white border-[#C8372D]'
                        : 'bg-gray-50 border-gray-300 text-gray-700'
                    }`}
                  >
                    450 ml (Large)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDonationForm((prev) => ({ ...prev, unitsDonated: 500 }))}
                    className={`py-2 px-3 rounded-lg font-bold border text-xs transition-all ${
                      donationForm.unitsDonated === 500
                        ? 'bg-[#C8372D] text-white border-[#C8372D]'
                        : 'bg-gray-50 border-gray-300 text-gray-700'
                    }`}
                  >
                    500 ml
                  </button>
                </div>
                <input
                  type="number"
                  required
                  min={100}
                  max={1000}
                  value={donationForm.unitsDonated || 350}
                  onChange={(e) => setDonationForm((prev) => ({ ...prev, unitsDonated: parseFloat(e.target.value) || 350 }))}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold text-gray-900 focus:outline-none focus:border-[#C8372D]"
                  placeholder="Enter volume in ml..."
                />
              </div>

              {/* Vitals Grid (BP, Sugar, Hb) */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    BP (Blood Pressure)
                  </label>
                  <input
                    type="text"
                    placeholder="120/80"
                    value={donationForm.bloodPressure || ''}
                    onChange={(e) => setDonationForm((prev) => ({ ...prev, bloodPressure: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg font-mono font-bold text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Sugar (mg/dL)
                  </label>
                  <input
                    type="number"
                    placeholder="110"
                    value={donationForm.sugarLevel || ''}
                    onChange={(e) => setDonationForm((prev) => ({ ...prev, sugarLevel: parseFloat(e.target.value) || 100 }))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg font-bold text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Hb (g/dL)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="14.5"
                    value={donationForm.hemoglobin || ''}
                    onChange={(e) => setDonationForm((prev) => ({ ...prev, hemoglobin: parseFloat(e.target.value) || 14 }))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg font-bold text-gray-900"
                  />
                </div>
              </div>

              {/* Donation Remarks */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-gray-500" /> Post-Donation Remarks / Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. 350ml donated smoothly. No adverse reaction recorded."
                  value={donationForm.remarks}
                  onChange={(e) => setDonationForm((prev) => ({ ...prev, remarks: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs text-gray-900"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedDonationDonor(null)}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingDonation}
                  className="px-5 py-2 rounded-lg text-xs font-bold bg-[#C8372D] hover:bg-[#A62820] text-white shadow disabled:opacity-50 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {submittingDonation ? 'Recording...' : 'Complete Donation'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
