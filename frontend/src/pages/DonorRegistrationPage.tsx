import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, CheckCircle2, Printer, ArrowLeft, AlertCircle, User, Phone, Mail, ShieldCheck } from 'lucide-react';
import { apiHelper } from '../api/axiosClient';
import type { CreateDonorRequest, DonorResponse } from '../types';

export const DonorRegistrationPage: React.FC = () => {
  const [formData, setFormData] = useState<CreateDonorRequest>({
    fullName: '',
    age: 21,
    gender: 'MALE',
    phoneNumber: '',
    email: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registeredDonor, setRegisteredDonor] = useState<DonorResponse | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) || 18 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await apiHelper.post<DonorResponse>('/donors', formData);
      if (response.success && response.data) {
        setRegisteredDonor(response.data);
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (err: unknown) {
      const errorObj = err as Error;
      setError(errorObj.message || 'Failed to complete registration');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        
        {/* Back Link */}
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#1A2636] mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {registeredDonor ? (
          /* Digital Pass Ticket */
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden print:shadow-none print:border-none">
            
            {/* Ticket Header */}
            <div className="bg-[#1A2636] text-white p-6 sm:p-8 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#C8372D] flex items-center justify-center text-white">
                    <Heart className="w-6 h-6 fill-current" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">BloodBridge Donor Pass</h2>
                    <p className="text-xs text-[#16B7CC] font-medium">MSRIT Blood Donation Drive 2026</p>
                  </div>
                </div>
                <div className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Registered
                </div>
              </div>
            </div>

            {/* Ticket Body */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center space-y-1">
                <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Your Digital Pass Registration ID</span>
                <div className="text-2xl sm:text-3xl font-black text-[#1A2636] tracking-widest font-mono">
                  {registeredDonor.registrationId}
                </div>
                <p className="text-[11px] text-amber-600">Present this ID code to the screening table at the venue.</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <span className="text-gray-400 font-medium block mb-1">Donor Name</span>
                  <span className="font-bold text-[#1A2636] text-sm">{registeredDonor.fullName}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <span className="text-gray-400 font-medium block mb-1">Age / Gender</span>
                  <span className="font-bold text-[#1A2636] text-sm">{registeredDonor.age} yrs / {registeredDonor.gender}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <span className="text-gray-400 font-medium block mb-1">Phone Number</span>
                  <span className="font-bold text-[#1A2636] text-sm">{registeredDonor.phoneNumber}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <span className="text-gray-400 font-medium block mb-1">Active Camp</span>
                  <span className="font-bold text-[#16B7CC] text-sm">{registeredDonor.campName}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
                <button
                  onClick={handlePrint}
                  className="w-full sm:w-auto bg-[#1A2636] hover:bg-[#111A26] text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Print Pass Ticket
                </button>
                <button
                  onClick={() => setRegisteredDonor(null)}
                  className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-lg text-xs font-bold transition-colors"
                >
                  Register Another Donor
                </button>
              </div>
            </div>

          </div>
        ) : (
          /* Registration Form */
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-10 space-y-6">
            
            <div className="border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2 text-[#C8372D] font-bold text-xs uppercase tracking-wider mb-1">
                <Heart className="w-4 h-4 fill-current" />
                Blood Drive Registration
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A2636]">Donor Registration Form</h1>
              <p className="text-xs text-gray-500 mt-1">
                Fill in your personal details to receive your instant camp pass.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="Enter your full legal name"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:bg-white focus:outline-none focus:border-[#16B7CC] transition-colors"
                  />
                </div>
              </div>

              {/* Age & Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Age (Years) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="age"
                    min={18}
                    max={65}
                    required
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:bg-white focus:outline-none focus:border-[#16B7CC] transition-colors"
                  />
                  <span className="text-[10px] text-gray-400 mt-1 block">Donors must be between 18 - 65 years old.</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:bg-white focus:outline-none focus:border-[#16B7CC] transition-colors"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Phone Number (10 Digits) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                    <input
                      type="tel"
                      name="phoneNumber"
                      maxLength={10}
                      pattern="[0-9]{10}"
                      required
                      placeholder="9876543210"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:bg-white focus:outline-none focus:border-[#16B7CC] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Email Address (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                    <input
                      type="email"
                      name="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:bg-white focus:outline-none focus:border-[#16B7CC] transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Privacy protected. Medical confidentiality assured.</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#C8372D] hover:bg-[#A62820] text-white font-bold px-8 py-3.5 rounded-lg text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? 'Processing...' : 'Complete Registration'}
                </button>
              </div>

            </form>

          </div>
        )}

      </div>
    </div>
  );
};
