import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ShieldCheck, Hospital, Users, Building2, Calendar, BarChart3, Plus, CheckCircle2, XCircle, RefreshCw, UserCheck, Edit, Archive, UserX, Droplets, Eye, Search } from 'lucide-react';
import { apiHelper } from '../api/axiosClient';
import type {
  DashboardSummaryResponse,
  CampResponse, CreateCampRequest, UpdateCampRequest,
  MedicalPartnerResponse, CreateMedicalPartnerRequest,
  TeamResponse, CreateTeamRequest,
  VolunteerResponse, CreateVolunteerRequest,
  DonorResponse,
  BloodGroupReportResponse, MedicalPartnerReportResponse
} from '../types';

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'CAMPS' | 'PARTNERS' | 'TEAMS' | 'VOLUNTEERS' | 'DONORS' | 'REPORTS'>('OVERVIEW');
  const [loading, setLoading] = useState(false);

  // Data states
  const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null);
  const [camps, setCamps] = useState<CampResponse[]>([]);
  const [partners, setPartners] = useState<MedicalPartnerResponse[]>([]);
  const [teams, setTeams] = useState<TeamResponse[]>([]);
  const [volunteers, setVolunteers] = useState<VolunteerResponse[]>([]);
  const [donors, setDonors] = useState<DonorResponse[]>([]);
  const [bloodGroupReports, setBloodGroupReports] = useState<BloodGroupReportResponse[]>([]);
  const [partnerReports, setPartnerReports] = useState<MedicalPartnerReportResponse[]>([]);

  // Donor Search & Filter state
  const [donorSearchTerm, setDonorSearchTerm] = useState('');
  const [donorStatusFilter, setDonorStatusFilter] = useState<'ALL' | 'REGISTERED' | 'SCREENED' | 'DONATED' | 'REJECTED'>('ALL');
  const [donorBloodGroupFilter, setDonorBloodGroupFilter] = useState<string>('ALL');
  const [selectedViewDonor, setSelectedViewDonor] = useState<DonorResponse | null>(null);

  // Create Modals State
  const [showCampModal, setShowCampModal] = useState(false);
  const [campForm, setCampForm] = useState<CreateCampRequest>({
    campName: '',
    description: '',
    venue: '',
    campDate: new Date().toISOString().split('T')[0],
    registrationStart: new Date().toISOString(),
    registrationEnd: new Date(Date.now() + 86400000 * 2).toISOString(),
  });

  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [partnerForm, setPartnerForm] = useState<CreateMedicalPartnerRequest>({
    name: '',
    contactPerson: '',
    contactNumber: '',
    email: '',
    address: '',
  });

  const [showTeamModal, setShowTeamModal] = useState(false);
  const [teamForm, setTeamForm] = useState<CreateTeamRequest>({
    teamName: '',
    teamCode: '',
    description: '',
    medicalPartnerId: 1,
  });

  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const [volunteerForm, setVolunteerForm] = useState<CreateVolunteerRequest>({
    fullName: '',
    usn: '',
    phoneNumber: '',
    email: '',
    teamId: 1,
  });
  const [createdVolunteerResult, setCreatedVolunteerResult] = useState<VolunteerResponse | null>(null);

  // Edit Modals State
  const [editingCamp, setEditingCamp] = useState<CampResponse | null>(null);
  const [editCampForm, setEditCampForm] = useState<UpdateCampRequest>({
    campName: '',
    description: '',
    venue: '',
    campDate: '',
    registrationStart: '',
    registrationEnd: '',
    status: 'ACTIVE',
  });

  const [editingPartner, setEditingPartner] = useState<MedicalPartnerResponse | null>(null);
  const [editPartnerForm, setEditPartnerForm] = useState<CreateMedicalPartnerRequest>({
    name: '',
    contactPerson: '',
    contactNumber: '',
    email: '',
    address: '',
  });

  const [editingTeam, setEditingTeam] = useState<TeamResponse | null>(null);
  const [editTeamForm, setEditTeamForm] = useState<CreateTeamRequest>({
    teamName: '',
    teamCode: '',
    description: '',
    medicalPartnerId: 1,
  });

  const [editingVolunteer, setEditingVolunteer] = useState<VolunteerResponse | null>(null);
  const [editVolunteerForm, setEditVolunteerForm] = useState<CreateVolunteerRequest>({
    fullName: '',
    usn: '',
    phoneNumber: '',
    email: '',
    teamId: 1,
  });

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [sumRes, campRes, partnerRes, teamRes, volRes, donorRes, bgRepRes, mpRepRes] = await Promise.allSettled([
        apiHelper.get<DashboardSummaryResponse>('/dashboard/summary'),
        apiHelper.get<CampResponse[]>('/camps'),
        apiHelper.get<MedicalPartnerResponse[]>('/medical-partners'),
        apiHelper.get<TeamResponse[]>('/teams'),
        apiHelper.get<VolunteerResponse[]>('/volunteers'),
        apiHelper.get<DonorResponse[]>('/donors'),
        apiHelper.get<BloodGroupReportResponse[]>('/reports/blood-groups'),
        apiHelper.get<MedicalPartnerReportResponse[]>('/reports/medical-partners'),
      ]);

      if (sumRes.status === 'fulfilled' && sumRes.value.data) setSummary(sumRes.value.data);
      if (campRes.status === 'fulfilled' && campRes.value.data) setCamps(campRes.value.data);
      if (partnerRes.status === 'fulfilled' && partnerRes.value.data) setPartners(partnerRes.value.data);
      if (teamRes.status === 'fulfilled' && teamRes.value.data) setTeams(teamRes.value.data);
      if (volRes.status === 'fulfilled' && volRes.value.data) setVolunteers(volRes.value.data);
      if (donorRes.status === 'fulfilled' && donorRes.value.data) setDonors(donorRes.value.data);
      if (bgRepRes.status === 'fulfilled' && bgRepRes.value.data) setBloodGroupReports(bgRepRes.value.data);
      if (mpRepRes.status === 'fulfilled' && mpRepRes.value.data) setPartnerReports(mpRepRes.value.data);

    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Creation Handlers
  const handleCreateCamp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiHelper.post<CampResponse>('/camps', campForm);
      if (res.success) {
        setShowCampModal(false);
        fetchAllData();
      }
    } catch (err: unknown) {
      alert((err as Error).message);
    }
  };

  const handleCreatePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiHelper.post<MedicalPartnerResponse>('/medical-partners', partnerForm);
      if (res.success) {
        setShowPartnerModal(false);
        fetchAllData();
      }
    } catch (err: unknown) {
      alert((err as Error).message);
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiHelper.post<TeamResponse>('/teams', teamForm);
      if (res.success) {
        setShowTeamModal(false);
        fetchAllData();
      }
    } catch (err: unknown) {
      alert((err as Error).message);
    }
  };

  const handleCreateVolunteer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...volunteerForm,
        email: volunteerForm.email?.trim() || undefined,
        usn: volunteerForm.usn?.trim() || undefined,
      };
      const res = await apiHelper.post<VolunteerResponse>('/volunteers', payload);
      if (res.success && res.data) {
        setCreatedVolunteerResult(res.data);
        setVolunteerForm({
          fullName: '',
          usn: '',
          phoneNumber: '',
          email: '',
          teamId: 1,
        });
        fetchAllData();
      }
    } catch (err: unknown) {
      alert((err as Error).message);
    }
  };

  // Edit & Archive Handlers
  const handleEditCampOpen = (camp: CampResponse) => {
    setEditingCamp(camp);
    setEditCampForm({
      campName: camp.campName,
      description: camp.description || '',
      venue: camp.venue,
      campDate: camp.campDate,
      registrationStart: camp.registrationStart,
      registrationEnd: camp.registrationEnd,
      status: camp.status,
    });
  };

  const handleUpdateCampSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCamp) return;
    try {
      const res = await apiHelper.put<CampResponse>(`/camps/${editingCamp.id}`, editCampForm);
      if (res.success) {
        setEditingCamp(null);
        fetchAllData();
      }
    } catch (err: unknown) {
      alert((err as Error).message);
    }
  };

  const handleArchiveCamp = async (id: number) => {
    if (!window.confirm('Are you sure you want to archive this camp?')) return;
    try {
      const res = await apiHelper.patch<CampResponse>(`/camps/${id}/archive`);
      if (res.success) fetchAllData();
    } catch (err: unknown) {
      alert((err as Error).message);
    }
  };

  const handleEditPartnerOpen = (partner: MedicalPartnerResponse) => {
    setEditingPartner(partner);
    setEditPartnerForm({
      name: partner.name,
      contactPerson: partner.contactPerson || '',
      contactNumber: partner.contactNumber || '',
      email: partner.email || '',
      address: partner.address || '',
    });
  };

  const handleUpdatePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPartner) return;
    try {
      const res = await apiHelper.put<MedicalPartnerResponse>(`/medical-partners/${editingPartner.id}`, editPartnerForm);
      if (res.success) {
        setEditingPartner(null);
        fetchAllData();
      }
    } catch (err: unknown) {
      alert((err as Error).message);
    }
  };

  const handleDeactivatePartner = async (id: number) => {
    if (!window.confirm('Deactivate this medical partner?')) return;
    try {
      const res = await apiHelper.patch<MedicalPartnerResponse>(`/medical-partners/${id}/deactivate`);
      if (res.success) fetchAllData();
    } catch (err: unknown) {
      alert((err as Error).message);
    }
  };

  const handleActivatePartner = async (id: number) => {
    if (!window.confirm('Reactivate this medical partner?')) return;
    try {
      const res = await apiHelper.patch<MedicalPartnerResponse>(`/medical-partners/${id}/activate`);
      if (res.success) fetchAllData();
    } catch (err: unknown) {
      alert((err as Error).message);
    }
  };

  const handleEditTeamOpen = (team: TeamResponse) => {
    setEditingTeam(team);
    setEditTeamForm({
      teamName: team.teamName,
      teamCode: team.teamCode,
      description: team.description || '',
      medicalPartnerId: team.medicalPartnerId || partners[0]?.id || 1,
    });
  };

  const handleUpdateTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeam) return;
    try {
      const res = await apiHelper.put<TeamResponse>(`/teams/${editingTeam.id}`, editTeamForm);
      if (res.success) {
        setEditingTeam(null);
        fetchAllData();
      }
    } catch (err: unknown) {
      alert((err as Error).message);
    }
  };

  const handleDeactivateTeam = async (id: number) => {
    if (!window.confirm('Deactivate this volunteer team?')) return;
    try {
      const res = await apiHelper.patch<TeamResponse>(`/teams/${id}/deactivate`);
      if (res.success) fetchAllData();
    } catch (err: unknown) {
      alert((err as Error).message);
    }
  };

  const handleActivateTeam = async (id: number) => {
    if (!window.confirm('Reactivate this volunteer team?')) return;
    try {
      const res = await apiHelper.patch<TeamResponse>(`/teams/${id}/activate`);
      if (res.success) fetchAllData();
    } catch (err: unknown) {
      alert((err as Error).message);
    }
  };

  const handleEditVolunteerOpen = (vol: VolunteerResponse) => {
    setEditingVolunteer(vol);
    setEditVolunteerForm({
      fullName: vol.fullName,
      usn: vol.usn,
      phoneNumber: vol.phoneNumber,
      email: vol.email || '',
      teamId: vol.teamId || teams[0]?.id || 1,
    });
  };

  const handleUpdateVolunteerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVolunteer) return;
    try {
      const res = await apiHelper.put<VolunteerResponse>(`/volunteers/${editingVolunteer.id}`, editVolunteerForm);
      if (res.success) {
        setEditingVolunteer(null);
        fetchAllData();
      }
    } catch (err: unknown) {
      alert((err as Error).message);
    }
  };

  const handleDeactivateVolunteer = async (id: number) => {
    if (!window.confirm('Deactivate this volunteer user?')) return;
    try {
      const res = await apiHelper.patch<VolunteerResponse>(`/volunteers/${id}/deactivate`);
      if (res.success) fetchAllData();
    } catch (err: unknown) {
      alert((err as Error).message);
    }
  };

  const handleActivateVolunteer = async (id: number) => {
    if (!window.confirm('Reactivate this volunteer user?')) return;
    try {
      const res = await apiHelper.patch<VolunteerResponse>(`/volunteers/${id}/activate`);
      if (res.success) fetchAllData();
    } catch (err: unknown) {
      alert((err as Error).message);
    }
  };

  // Filtered Donors list
  const filteredDonors = donors.filter((donor) => {
    const term = donorSearchTerm.toLowerCase();
    const matchesSearch =
      donor.fullName.toLowerCase().includes(term) ||
      donor.registrationId.toLowerCase().includes(term) ||
      donor.phoneNumber.includes(term) ||
      (donor.email && donor.email.toLowerCase().includes(term)) ||
      (donor.remarks && donor.remarks.toLowerCase().includes(term)) ||
      (donor.campName && donor.campName.toLowerCase().includes(term));

    const matchesStatus =
      donorStatusFilter === 'ALL' || donor.status === donorStatusFilter;

    const matchesBloodGroup =
      donorBloodGroupFilter === 'ALL' || donor.bloodGroup === donorBloodGroupFilter;

    return matchesSearch && matchesStatus && matchesBloodGroup;
  });

  // Sorted datasets: ACTIVE first, then lexicographically (A-Z) by name
  const sortedCamps = [...camps].sort((a, b) => {
    const statusPriority: Record<string, number> = { ACTIVE: 0, UPCOMING: 1, COMPLETED: 2, ARCHIVED: 3 };
    const pA = statusPriority[a.status] ?? 4;
    const pB = statusPriority[b.status] ?? 4;
    if (pA !== pB) return pA - pB;
    return a.campName.localeCompare(b.campName);
  });

  const sortedPartners = [...partners].sort((a, b) => {
    const isActA = a.status === 'ACTIVE' ? 0 : 1;
    const isActB = b.status === 'ACTIVE' ? 0 : 1;
    if (isActA !== isActB) return isActA - isActB;
    return a.name.localeCompare(b.name);
  });

  const sortedTeams = [...teams].sort((a, b) => {
    const isActA = a.status === 'ACTIVE' ? 0 : 1;
    const isActB = b.status === 'ACTIVE' ? 0 : 1;
    if (isActA !== isActB) return isActA - isActB;
    return a.teamName.localeCompare(b.teamName);
  });

  const sortedVolunteers = [...volunteers].sort((a, b) => {
    const isActA = a.status === 'ACTIVE' ? 0 : 1;
    const isActB = b.status === 'ACTIVE' ? 0 : 1;
    if (isActA !== isActB) return isActA - isActB;
    return a.fullName.localeCompare(b.fullName);
  });

  const sortedDonors = [...filteredDonors].sort((a, b) => {
    const statusPriority: Record<string, number> = { SCREENED: 0, REGISTERED: 1, DONATED: 2, REJECTED: 3 };
    const pA = statusPriority[a.status] ?? 4;
    const pB = statusPriority[b.status] ?? 4;
    if (pA !== pB) return pA - pB;
    return a.fullName.localeCompare(b.fullName);
  });

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-[#1A2636] rounded-2xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-[#C8372D]/20 border border-[#C8372D]/30 text-[#C8372D] px-3 py-1 rounded-full text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin Command Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">System Administration Dashboard</h1>
            <p className="text-xs text-gray-400">Manage camps, medical partners, volunteer teams, donor records, and view live donation analytics.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAllData}
              disabled={loading}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 border border-white/20"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Sync Data
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="bg-white rounded-xl p-1.5 shadow-sm border border-gray-200 flex flex-wrap gap-1">
          {[
            { id: 'OVERVIEW', label: 'Overview', icon: LayoutDashboard },
            { id: 'CAMPS', label: 'Camps', icon: Calendar },
            { id: 'PARTNERS', label: 'Medical Partners', icon: Hospital },
            { id: 'TEAMS', label: 'Teams', icon: Building2 },
            { id: 'VOLUNTEERS', label: 'Volunteers', icon: UserCheck },
            { id: 'DONORS', label: 'All Donors Master', icon: Droplets },
            { id: 'REPORTS', label: 'Reports & Analytics', icon: BarChart3 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                  isSel ? 'bg-[#1A2636] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSel ? 'text-[#16B7CC]' : 'text-gray-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Donors</span>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-[#1A2636]">{summary?.totalRegistrations ?? 0}</div>
                <div className="text-[11px] text-gray-400">Total registered donors in database</div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Completed Donations</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-emerald-600">{summary?.donated ?? 0}</div>
                <div className="text-[11px] text-emerald-600 font-medium">Successfully extracted units</div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Volunteers</span>
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                    <UserCheck className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-[#1A2636]">{summary?.totalVolunteers ?? 0}</div>
                <div className="text-[11px] text-gray-400">Volunteers managing field camps</div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Partners</span>
                  <div className="w-8 h-8 rounded-lg bg-red-50 text-[#C8372D] flex items-center justify-center">
                    <Hospital className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-[#C8372D]">{summary?.totalMedicalPartners ?? 0}</div>
                <div className="text-[11px] text-gray-400">Hospital blood banks affiliated</div>
              </div>

            </div>

            {/* Quick Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-2">
                <span className="text-xs font-bold text-gray-500 uppercase">Waiting Screening</span>
                <div className="text-2xl font-bold text-amber-600">{summary?.registered ?? 0} Donors</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-2">
                <span className="text-xs font-bold text-gray-500 uppercase">Screened & Eligible</span>
                <div className="text-2xl font-bold text-blue-600">{summary?.screened ?? 0} Donors</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-2">
                <span className="text-xs font-bold text-gray-500 uppercase">Deferred / Rejected</span>
                <div className="text-2xl font-bold text-red-600">{summary?.rejected ?? 0} Donors</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CAMPS */}
        {activeTab === 'CAMPS' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#1A2636]">Blood Donation Camps</h3>
                <p className="text-xs text-gray-500">Scheduled and live drive events</p>
              </div>
              <button
                onClick={() => setShowCampModal(true)}
                className="bg-[#C8372D] hover:bg-[#A62820] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" />
                Create New Camp
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    <th className="py-3 px-4">Camp Name</th>
                    <th className="py-3 px-4">Venue</th>
                    <th className="py-3 px-4">Camp Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {sortedCamps.length === 0 ? (
                    <tr><td colSpan={5} className="py-8 text-center text-gray-400">No camps registered yet.</td></tr>
                  ) : (
                    sortedCamps.map((camp) => (
                      <tr key={camp.id} className="hover:bg-gray-50">
                        <td className="py-3.5 px-4 font-bold text-[#1A2636]">{camp.campName}</td>
                        <td className="py-3.5 px-4 text-gray-600">{camp.venue}</td>
                        <td className="py-3.5 px-4 text-gray-600">{camp.campDate}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            camp.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' :
                            camp.status === 'UPCOMING' ? 'bg-blue-100 text-blue-800' :
                            camp.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {camp.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          <button
                            onClick={() => handleEditCampOpen(camp)}
                            className="p-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-[11px] inline-flex items-center gap-1"
                          >
                            <Edit className="w-3.5 h-3.5 text-[#16B7CC]" /> Edit
                          </button>
                          {camp.status !== 'ARCHIVED' && (
                            <button
                              onClick={() => handleArchiveCamp(camp.id)}
                              className="p-1.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold text-[11px] inline-flex items-center gap-1"
                            >
                              <Archive className="w-3.5 h-3.5" /> Archive
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: MEDICAL PARTNERS */}
        {activeTab === 'PARTNERS' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#1A2636]">Medical Partner Hospitals</h3>
                <p className="text-xs text-gray-500">Collaborating blood banks and medical teams</p>
              </div>
              <button
                onClick={() => setShowPartnerModal(true)}
                className="bg-[#16B7CC] hover:bg-[#0E96AA] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" />
                Add Medical Partner
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    <th className="py-3 px-4">Hospital Name</th>
                    <th className="py-3 px-4">Contact Person</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {sortedPartners.length === 0 ? (
                    <tr><td colSpan={5} className="py-8 text-center text-gray-400">No medical partners added.</td></tr>
                  ) : (
                    sortedPartners.map((partner) => (
                      <tr key={partner.id} className="hover:bg-gray-50">
                        <td className="py-3.5 px-4 font-bold text-[#1A2636]">{partner.name}</td>
                        <td className="py-3.5 px-4 text-gray-600">{partner.contactPerson || 'N/A'}</td>
                        <td className="py-3.5 px-4 text-gray-600">{partner.contactNumber || 'N/A'}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            partner.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {partner.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          <button
                            onClick={() => handleEditPartnerOpen(partner)}
                            className="p-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-[11px] inline-flex items-center gap-1"
                          >
                            <Edit className="w-3.5 h-3.5 text-[#16B7CC]" /> Edit
                          </button>
                          {partner.status === 'ACTIVE' ? (
                            <button
                              onClick={() => handleDeactivatePartner(partner.id)}
                              className="p-1.5 rounded bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-[11px] inline-flex items-center gap-1"
                            >
                              <UserX className="w-3.5 h-3.5" /> Deactivate
                            </button>
                          ) : (
                            <button
                              onClick={() => handleActivatePartner(partner.id)}
                              className="p-1.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-[11px] inline-flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Activate
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: TEAMS */}
        {activeTab === 'TEAMS' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#1A2636]">Volunteer Teams</h3>
                <p className="text-xs text-gray-500">Organized operational volunteer units</p>
              </div>
              <button
                onClick={() => setShowTeamModal(true)}
                className="bg-[#1A2636] hover:bg-[#0F1722] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" />
                Create Team
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    <th className="py-3 px-4">Team Name</th>
                    <th className="py-3 px-4">Team Code</th>
                    <th className="py-3 px-4">Medical Partner</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {sortedTeams.length === 0 ? (
                    <tr><td colSpan={5} className="py-8 text-center text-gray-400">No teams created.</td></tr>
                  ) : (
                    sortedTeams.map((team) => (
                      <tr key={team.id} className="hover:bg-gray-50">
                        <td className="py-3.5 px-4 font-bold text-[#1A2636]">{team.teamName}</td>
                        <td className="py-3.5 px-4 font-mono font-semibold text-[#16B7CC]">{team.teamCode}</td>
                        <td className="py-3.5 px-4 text-gray-600">
                          {team.medicalPartnerName || partners.find(p => p.id === team.medicalPartnerId)?.name || 'N/A'}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            team.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {team.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          <button
                            onClick={() => handleEditTeamOpen(team)}
                            className="p-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-[11px] inline-flex items-center gap-1"
                          >
                            <Edit className="w-3.5 h-3.5 text-[#16B7CC]" /> Edit
                          </button>
                          {team.status === 'ACTIVE' ? (
                            <button
                              onClick={() => handleDeactivateTeam(team.id)}
                              className="p-1.5 rounded bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-[11px] inline-flex items-center gap-1"
                            >
                              <UserX className="w-3.5 h-3.5" /> Deactivate
                            </button>
                          ) : (
                            <button
                              onClick={() => handleActivateTeam(team.id)}
                              className="p-1.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-[11px] inline-flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Activate
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: VOLUNTEERS */}
        {activeTab === 'VOLUNTEERS' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#1A2636]">Volunteers Roster</h3>
                <p className="text-xs text-gray-500">Registered volunteers with login credentials</p>
              </div>
              <button
                onClick={() => { setShowVolunteerModal(true); setCreatedVolunteerResult(null); }}
                className="bg-[#C8372D] hover:bg-[#A62820] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" />
                Register New Volunteer
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    <th className="py-3 px-4">Volunteer Name</th>
                    <th className="py-3 px-4">USN</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Assigned Team</th>
                    <th className="py-3 px-4">Auto Password</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {sortedVolunteers.length === 0 ? (
                    <tr><td colSpan={7} className="py-8 text-center text-gray-400">No volunteers registered yet.</td></tr>
                  ) : (
                    sortedVolunteers.map((vol) => (
                      <tr key={vol.id} className="hover:bg-gray-50">
                        <td className="py-3.5 px-4 font-bold text-[#1A2636]">{vol.fullName}</td>
                        <td className="py-3.5 px-4 font-mono text-gray-600">{vol.usn}</td>
                        <td className="py-3.5 px-4 text-gray-600">{vol.phoneNumber}</td>
                        <td className="py-3.5 px-4 font-semibold text-[#16B7CC]">
                          {vol.teamName || teams.find(t => t.id === vol.teamId)?.teamName || 'N/A'}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-mono bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded text-[11px] font-bold">
                            {vol.generatedPassword || `BB@${String(vol.id).padStart(4, '0')}`}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            vol.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {vol.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          <button
                            onClick={() => handleEditVolunteerOpen(vol)}
                            className="p-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-[11px] inline-flex items-center gap-1"
                          >
                            <Edit className="w-3.5 h-3.5 text-[#16B7CC]" /> Edit
                          </button>
                          {vol.status === 'ACTIVE' ? (
                            <button
                              onClick={() => handleDeactivateVolunteer(vol.id)}
                              className="p-1.5 rounded bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-[11px] inline-flex items-center gap-1"
                            >
                              <UserX className="w-3.5 h-3.5" /> Deactivate
                            </button>
                          ) : (
                            <button
                              onClick={() => handleActivateVolunteer(vol.id)}
                              className="p-1.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-[11px] inline-flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Activate
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: DONORS MASTER REGISTRY */}
        {activeTab === 'DONORS' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
            
            {/* Header + Stats Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
              <div>
                <h3 className="text-xl font-extrabold text-[#1A2636] flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-[#C8372D]" />
                  Master Donor Records & Vitals Registry
                </h3>
                <p className="text-xs text-gray-500 mt-1">Complete database of all registered, screened, donated, and deferred donors</p>
              </div>

              {/* Stats Counters */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="bg-red-50 border border-red-200 px-3.5 py-2 rounded-xl text-center">
                  <div className="text-[11px] text-red-700 font-bold">Total Donated</div>
                  <div className="text-base font-extrabold text-[#C8372D]">
                    {donors.filter(d => d.status === 'DONATED').length} Donors
                  </div>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl text-center">
                  <div className="text-[11px] text-emerald-700 font-bold">Total Extracted Volume</div>
                  <div className="text-base font-extrabold text-emerald-800">
                    {(donors.reduce((sum, d) => sum + (d.unitsDonated || 0), 0) / 1000).toFixed(2)} Liters
                  </div>
                </div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search donor name, pass code, phone..."
                  value={donorSearchTerm}
                  onChange={(e) => setDonorSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium focus:outline-none focus:border-[#16B7CC]"
                />
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={donorStatusFilter}
                  onChange={(e) => setDonorStatusFilter(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-bold text-gray-800 focus:outline-none focus:border-[#16B7CC]"
                >
                  <option value="ALL">All Statuses (ALL)</option>
                  <option value="REGISTERED">REGISTERED (Waiting Screening)</option>
                  <option value="SCREENED">SCREENED (Waiting Donation)</option>
                  <option value="DONATED">DONATED (Completed)</option>
                  <option value="REJECTED">REJECTED (Deferred)</option>
                </select>
              </div>

              {/* Blood Group Filter */}
              <div>
                <select
                  value={donorBloodGroupFilter}
                  onChange={(e) => setDonorBloodGroupFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-bold text-gray-800 focus:outline-none focus:border-[#16B7CC]"
                >
                  <option value="ALL">All Blood Groups (ALL)</option>
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
            </div>

            {/* Donors Master Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    <th className="py-3.5 px-4">Pass Code</th>
                    <th className="py-3.5 px-4">Donor Name</th>
                    <th className="py-3.5 px-4">Blood Group</th>
                    <th className="py-3.5 px-4">Age / Gender</th>
                    <th className="py-3.5 px-4">Vitals (BP/Sugar/Hb/Wt)</th>
                    <th className="py-3.5 px-4">Extracted Volume</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Drive Camp</th>
                    <th className="py-3.5 px-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                  {sortedDonors.length === 0 ? (
                    <tr><td colSpan={9} className="py-10 text-center text-gray-400">No donor records found matching search filters.</td></tr>
                  ) : (
                    sortedDonors.map((donor) => (
                      <tr key={donor.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-[#16B7CC]">{donor.registrationId}</td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-[#1A2636]">{donor.fullName}</div>
                          <div className="text-[11px] text-gray-400">{donor.phoneNumber}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-black uppercase bg-red-100 text-[#C8372D] border border-red-200">
                            {donor.bloodGroup ? donor.bloodGroup.replace('_', ' ') : 'N/A'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-medium">{donor.age} yrs / {donor.gender}</td>
                        <td className="py-3.5 px-4 font-mono text-[11px]">
                          <div>BP: <span className="font-bold text-gray-900">{donor.bloodPressure || 'N/A'}</span></div>
                          <div className="text-gray-500">Sugar: {donor.sugarLevel ? donor.sugarLevel + ' mg/dL' : '-'} | Hb: {donor.hemoglobin ? donor.hemoglobin + ' g/dL' : '-'} | Wt: {donor.weight ? donor.weight + 'kg' : '-'}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          {donor.unitsDonated ? (
                            <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded font-mono">
                              {donor.unitsDonated} ml
                            </span>
                          ) : (
                            <span className="text-gray-400 font-mono">-</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            donor.status === 'DONATED' ? 'bg-emerald-100 text-emerald-800' :
                            donor.status === 'SCREENED' ? 'bg-blue-100 text-blue-800' :
                            donor.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {donor.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-gray-600 max-w-[150px] truncate" title={donor.campName}>
                          {donor.campName || 'N/A'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setSelectedViewDonor(donor)}
                            className="p-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-[11px] inline-flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#16B7CC]" /> Dossier
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 7: REPORTS */}
        {activeTab === 'REPORTS' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Blood Group Breakdown */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
              <div>
                <h3 className="text-lg font-bold text-[#1A2636]">Blood Group Distribution</h3>
                <p className="text-xs text-gray-500">Units collected per blood group during drive</p>
              </div>

              <div className="space-y-3 pt-2">
                {bloodGroupReports.length === 0 ? (
                  <p className="text-xs text-gray-400 py-4 text-center">No blood group donation data recorded yet.</p>
                ) : (
                  bloodGroupReports.map((item) => (
                    <div key={item.bloodGroup} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-[#C8372D]">{item.bloodGroup.replace('_', ' ')}</span>
                        <span className="text-[#1A2636]">{item.count} Units</span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#C8372D]"
                          style={{ width: `${Math.min(100, (item.count / 20) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Medical Partner Report */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">
              <div>
                <h3 className="text-lg font-bold text-[#1A2636]">Medical Partner Performance</h3>
                <p className="text-xs text-gray-500">Successful donations collected per hospital partner</p>
              </div>

              <div className="space-y-3 pt-2">
                {partnerReports.length === 0 ? (
                  <p className="text-xs text-gray-400 py-4 text-center">No partner collection data recorded yet.</p>
                ) : (
                  partnerReports.map((item) => (
                    <div key={item.medicalPartnerName} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-[#16B7CC]">{item.medicalPartnerName}</span>
                        <span className="text-[#1A2636]">{item.successfulDonations} Donations</span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#16B7CC]"
                          style={{ width: `${Math.min(100, (item.successfulDonations / 20) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* DONOR MEDICAL DOSSIER MODAL */}
      {selectedViewDonor && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-100 my-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#1A2636]">Donor Medical Dossier</h3>
                <p className="text-xs text-[#16B7CC] font-mono">{selectedViewDonor.registrationId}</p>
              </div>
              <button onClick={() => setSelectedViewDonor(null)} className="text-gray-400 hover:text-gray-600 p-1">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Profile Card */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-base font-extrabold text-[#1A2636]">{selectedViewDonor.fullName}</span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-black bg-red-100 text-[#C8372D] border border-red-200">
                    {selectedViewDonor.bloodGroup ? selectedViewDonor.bloodGroup.replace('_', ' ') : 'N/A'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-gray-600 font-medium">
                  <div>Age / Gender: <span className="font-bold text-gray-900">{selectedViewDonor.age} yrs ({selectedViewDonor.gender})</span></div>
                  <div>Phone: <span className="font-bold text-gray-900">{selectedViewDonor.phoneNumber}</span></div>
                  <div>Email: <span className="font-bold text-gray-900">{selectedViewDonor.email || 'N/A'}</span></div>
                  <div>Status: <span className="font-bold text-gray-900">{selectedViewDonor.status}</span></div>
                </div>
              </div>

              {/* Vitals Breakdown Grid */}
              <div>
                <h4 className="font-bold text-gray-700 uppercase tracking-wider mb-2 text-[11px]">Recorded Vitals & Measurements</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                    <div className="text-gray-500 font-medium">Blood Pressure (BP)</div>
                    <div className="text-sm font-bold text-blue-900 font-mono">{selectedViewDonor.bloodPressure || 'N/A'}</div>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                    <div className="text-gray-500 font-medium">Sugar Level</div>
                    <div className="text-sm font-bold text-amber-900">{selectedViewDonor.sugarLevel ? selectedViewDonor.sugarLevel + ' mg/dL' : 'N/A'}</div>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 p-3 rounded-lg">
                    <div className="text-gray-500 font-medium">Hemoglobin (Hb)</div>
                    <div className="text-sm font-bold text-purple-900">{selectedViewDonor.hemoglobin ? selectedViewDonor.hemoglobin + ' g/dL' : 'N/A'}</div>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg">
                    <div className="text-gray-500 font-medium">Extracted Volume</div>
                    <div className="text-sm font-extrabold text-emerald-900 font-mono">{selectedViewDonor.unitsDonated ? selectedViewDonor.unitsDonated + ' ml' : 'Not Donated'}</div>
                  </div>
                </div>
              </div>

              {/* Drive & Volunteer Attendant */}
              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 space-y-1.5">
                <div>Camp Drive: <span className="font-bold text-gray-900">{selectedViewDonor.campName || 'N/A'}</span></div>
                <div>Attending Volunteer: <span className="font-bold text-gray-900">{selectedViewDonor.volunteerName || 'Not Assigned'}</span></div>
                <div>Medical Remarks: <span className="font-medium text-gray-700">{selectedViewDonor.remarks || 'None'}</span></div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button onClick={() => setSelectedViewDonor(null)} className="px-5 py-2 rounded-lg bg-[#1A2636] text-white font-bold text-xs">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT CAMP MODAL */}
      {editingCamp && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-[#1A2636]">Edit Blood Donation Camp</h3>
            <form onSubmit={handleUpdateCampSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Camp Name</label>
                <input
                  type="text" required
                  value={editCampForm.campName}
                  onChange={(e) => setEditCampForm({...editCampForm, campName: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Venue</label>
                <input
                  type="text" required
                  value={editCampForm.venue}
                  onChange={(e) => setEditCampForm({...editCampForm, venue: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Camp Date</label>
                <input
                  type="date" required
                  value={editCampForm.campDate}
                  onChange={(e) => setEditCampForm({...editCampForm, campDate: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Camp Status</label>
                <select
                  value={editCampForm.status}
                  onChange={(e) => setEditCampForm({...editCampForm, status: e.target.value as any})}
                  className="w-full p-2.5 bg-gray-50 border rounded-lg font-bold text-gray-800"
                >
                  <option value="UPCOMING">UPCOMING</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button type="button" onClick={() => setEditingCamp(null)} className="px-4 py-2 rounded-lg bg-gray-100">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-[#16B7CC] text-white font-bold">Update Camp</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MEDICAL PARTNER MODAL */}
      {editingPartner && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-[#1A2636]">Edit Medical Partner Hospital</h3>
            <form onSubmit={handleUpdatePartnerSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Hospital Name</label>
                <input
                  type="text" required
                  value={editPartnerForm.name}
                  onChange={(e) => setEditPartnerForm({...editPartnerForm, name: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Contact Person</label>
                <input
                  type="text"
                  value={editPartnerForm.contactPerson}
                  onChange={(e) => setEditPartnerForm({...editPartnerForm, contactPerson: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={editPartnerForm.contactNumber}
                  onChange={(e) => setEditPartnerForm({...editPartnerForm, contactNumber: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 border rounded-lg"
                />
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button type="button" onClick={() => setEditingPartner(null)} className="px-4 py-2 rounded-lg bg-gray-100">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-[#16B7CC] text-white font-bold">Update Partner</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT TEAM MODAL */}
      {editingTeam && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-[#1A2636]">Edit Volunteer Team</h3>
            <form onSubmit={handleUpdateTeamSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Team Name</label>
                <input
                  type="text" required
                  value={editTeamForm.teamName}
                  onChange={(e) => setEditTeamForm({...editTeamForm, teamName: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Team Code</label>
                <input
                  type="text" required
                  value={editTeamForm.teamCode}
                  onChange={(e) => setEditTeamForm({...editTeamForm, teamCode: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Associated Medical Partner</label>
                <select
                  required
                  value={editTeamForm.medicalPartnerId}
                  onChange={(e) => setEditTeamForm({...editTeamForm, medicalPartnerId: Number(e.target.value)})}
                  className="w-full p-2.5 bg-gray-50 border rounded-lg font-bold text-gray-800"
                >
                  {partners.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button type="button" onClick={() => setEditingTeam(null)} className="px-4 py-2 rounded-lg bg-gray-100">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-[#1A2636] text-white font-bold">Update Team</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT VOLUNTEER MODAL */}
      {editingVolunteer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-[#1A2636]">Edit Volunteer Details</h3>
            <form onSubmit={handleUpdateVolunteerSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Full Name</label>
                <input
                  type="text" required
                  value={editVolunteerForm.fullName}
                  onChange={(e) => setEditVolunteerForm({...editVolunteerForm, fullName: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">USN</label>
                <input
                  type="text" required
                  value={editVolunteerForm.usn}
                  onChange={(e) => setEditVolunteerForm({...editVolunteerForm, usn: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Phone Number</label>
                <input
                  type="text" required
                  value={editVolunteerForm.phoneNumber}
                  onChange={(e) => setEditVolunteerForm({...editVolunteerForm, phoneNumber: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Assigned Team</label>
                <select
                  required
                  value={editVolunteerForm.teamId}
                  onChange={(e) => setEditVolunteerForm({...editVolunteerForm, teamId: Number(e.target.value)})}
                  className="w-full p-2.5 bg-gray-50 border rounded-lg font-bold text-gray-800"
                >
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.teamName} ({t.teamCode})
                    </option>
                  ))}
                </select>
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button type="button" onClick={() => setEditingVolunteer(null)} className="px-4 py-2 rounded-lg bg-gray-100">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-[#C8372D] text-white font-bold">Update Volunteer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE CAMP MODAL */}
      {showCampModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-[#1A2636]">Create Blood Donation Camp</h3>
            <form onSubmit={handleCreateCamp} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Camp Name</label>
                <input
                  type="text" required
                  value={campForm.campName}
                  onChange={(e) => setCampForm({...campForm, campName: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 border rounded-lg"
                  placeholder="e.g. MSRIT Main Drive 2026"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Venue</label>
                <input
                  type="text" required
                  value={campForm.venue}
                  onChange={(e) => setCampForm({...campForm, venue: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 border rounded-lg"
                  placeholder="e.g. Campus Quadrangle"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Camp Date</label>
                <input
                  type="date" required
                  value={campForm.campDate}
                  onChange={(e) => setCampForm({...campForm, campDate: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 border rounded-lg"
                />
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button type="button" onClick={() => setShowCampModal(false)} className="px-4 py-2 rounded-lg bg-gray-100">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-[#C8372D] text-white font-bold">Create Camp</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE MEDICAL PARTNER MODAL */}
      {showPartnerModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-[#1A2636]">Add Medical Partner Hospital</h3>
            <form onSubmit={handleCreatePartner} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Hospital / Partner Name</label>
                <input
                  type="text" required
                  value={partnerForm.name}
                  onChange={(e) => setPartnerForm({...partnerForm, name: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 border rounded-lg"
                  placeholder="e.g. Manipal Hospital Blood Bank"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Contact Person</label>
                <input
                  type="text"
                  value={partnerForm.contactPerson}
                  onChange={(e) => setPartnerForm({...partnerForm, contactPerson: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={partnerForm.contactNumber}
                  onChange={(e) => setPartnerForm({...partnerForm, contactNumber: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 border rounded-lg"
                />
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button type="button" onClick={() => setShowPartnerModal(false)} className="px-4 py-2 rounded-lg bg-gray-100">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-[#16B7CC] text-white font-bold">Save Partner</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE TEAM MODAL */}
      {showTeamModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-[#1A2636]">Create Volunteer Team</h3>
            <form onSubmit={handleCreateTeam} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Team Name</label>
                <input
                  type="text" required
                  value={teamForm.teamName}
                  onChange={(e) => setTeamForm({...teamForm, teamName: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 border rounded-lg"
                  placeholder="e.g. Team Alpha - Screening"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Team Code</label>
                <input
                  type="text" required
                  value={teamForm.teamCode}
                  onChange={(e) => setTeamForm({...teamForm, teamCode: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 border rounded-lg"
                  placeholder="e.g. ALPHA-01"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Associated Medical Partner</label>
                <select
                  required
                  value={teamForm.medicalPartnerId}
                  onChange={(e) => setTeamForm({...teamForm, medicalPartnerId: Number(e.target.value)})}
                  className="w-full p-2.5 bg-gray-50 border rounded-lg font-bold text-gray-800"
                >
                  {partners.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button type="button" onClick={() => setShowTeamModal(false)} className="px-4 py-2 rounded-lg bg-gray-100">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-[#1A2636] text-white font-bold">Create Team</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE VOLUNTEER MODAL */}
      {showVolunteerModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-[#1A2636]">Register New Volunteer</h3>

            {createdVolunteerResult ? (
              <div className="space-y-4 text-xs">
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl space-y-2 text-emerald-900">
                  <span className="font-bold block text-sm">Volunteer Registered Successfully!</span>
                  <div className="space-y-1 font-mono">
                    <div>USN: <span className="font-bold">{createdVolunteerResult.usn}</span></div>
                    <div>Auto Generated Password: <span className="font-bold text-[#C8372D]">{createdVolunteerResult.generatedPassword}</span></div>
                  </div>
                  <p className="text-[11px] text-emerald-700 mt-2">Provide these credentials to the volunteer for logging in.</p>
                </div>

                <button
                  onClick={() => setShowVolunteerModal(false)}
                  className="w-full py-2.5 bg-[#1A2636] text-white font-bold rounded-lg"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateVolunteer} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold mb-1">Full Name</label>
                  <input
                    type="text" required
                    value={volunteerForm.fullName}
                    onChange={(e) => setVolunteerForm({...volunteerForm, fullName: e.target.value})}
                    className="w-full p-2.5 bg-gray-50 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">USN (Login Identifier)</label>
                  <input
                    type="text" required
                    value={volunteerForm.usn}
                    onChange={(e) => setVolunteerForm({...volunteerForm, usn: e.target.value})}
                    className="w-full p-2.5 bg-gray-50 border rounded-lg"
                    placeholder="1MS21CS001"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Phone Number</label>
                  <input
                    type="text" required
                    value={volunteerForm.phoneNumber}
                    onChange={(e) => setVolunteerForm({...volunteerForm, phoneNumber: e.target.value})}
                    className="w-full p-2.5 bg-gray-50 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">Assign to Team</label>
                  <select
                    required
                    value={volunteerForm.teamId}
                    onChange={(e) => setVolunteerForm({...volunteerForm, teamId: Number(e.target.value)})}
                    className="w-full p-2.5 bg-gray-50 border rounded-lg font-bold text-gray-800"
                  >
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.teamName} ({t.teamCode})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="pt-3 flex justify-end gap-2">
                  <button type="button" onClick={() => setShowVolunteerModal(false)} className="px-4 py-2 rounded-lg bg-gray-100">Cancel</button>
                  <button type="submit" className="px-4 py-2 rounded-lg bg-[#C8372D] text-white font-bold">Register Volunteer</button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
