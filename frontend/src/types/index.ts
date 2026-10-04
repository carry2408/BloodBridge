export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export type Role = 'ADMIN' | 'VOLUNTEER';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type BloodGroup = 'A_POSITIVE' | 'A_NEGATIVE' | 'B_POSITIVE' | 'B_NEGATIVE' | 'AB_POSITIVE' | 'AB_NEGATIVE' | 'O_POSITIVE' | 'O_NEGATIVE';
export type DonorStatus = 'REGISTERED' | 'SCREENED' | 'DONATED' | 'REJECTED';
export type CampStatus = 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
export type MedicalPartnerStatus = 'ACTIVE' | 'INACTIVE';
export type TeamStatus = 'ACTIVE' | 'INACTIVE';
export type VolunteerStatus = 'ACTIVE' | 'INACTIVE';

// Auth DTOs
export interface VolunteerLoginRequest {
  usn: string;
  password?: string;
}

export interface VolunteerLoginResponse {
  id?: number;
  token: string;
  usn: string;
  volunteerName: string;
  teamId?: number;
  teamName?: string;
}

export interface AdminLoginRequest {
  email: string;
  password?: string;
}

export interface AdminLoginResponse {
  token: string;
  email: string;
  adminName: string;
}

export interface AuthUser {
  id?: number;
  name: string;
  identifier: string; // email or usn
  role: Role;
  token: string;
  teamId?: number;
  teamName?: string;
}

// Donor DTOs
export interface CreateDonorRequest {
  fullName: string;
  age: number;
  gender: Gender;
  phoneNumber: string;
  email?: string;
}

export interface ScreenDonorRequest {
  status: 'SCREENED' | 'REJECTED';
  bloodGroup: BloodGroup;
  weight: number;
  unitsDonated?: number;
  bloodPressure?: string;
  sugarLevel?: number;
  hemoglobin?: number;
  remarks?: string;
  volunteerId: number;
}

export interface CompleteDonationRequest {
  volunteerId?: number;
  unitsDonated?: number;
  bloodPressure?: string;
  sugarLevel?: number;
  hemoglobin?: number;
  remarks?: string;
}

export interface WaitingDonorQueueResponse {
  registrationId: string;
  fullName: string;
  age: number;
  phoneNumber: string;
  teamId?: number;
  teamName?: string;
  volunteerId?: number;
  volunteerName?: string;
  bloodGroup?: BloodGroup;
  weight?: number;
  bloodPressure?: string;
  sugarLevel?: number;
  hemoglobin?: number;
}

export interface DonorResponse {
  id: number;
  registrationId: string;
  fullName: string;
  age: number;
  gender: Gender;
  phoneNumber: string;
  email?: string;
  bloodGroup?: BloodGroup;
  weight?: number;
  unitsDonated?: number;
  bloodPressure?: string;
  sugarLevel?: number;
  hemoglobin?: number;
  remarks?: string;
  status: DonorStatus;
  campId: number;
  campName: string;
  volunteerId?: number;
  volunteerName?: string;
  createdAt: string;
  updatedAt: string;
}

// Camp DTOs
export interface CreateCampRequest {
  campName: string;
  description?: string;
  venue: string;
  campDate: string;
  registrationStart: string;
  registrationEnd: string;
}

export interface UpdateCampRequest {
  campName: string;
  description?: string;
  venue: string;
  campDate: string;
  registrationStart: string;
  registrationEnd: string;
  status: CampStatus;
}

export interface CampResponse {
  id: number;
  campName: string;
  description?: string;
  venue: string;
  campDate: string;
  registrationStart: string;
  registrationEnd: string;
  status: CampStatus;
  createdAt: string;
  updatedAt: string;
}

// Medical Partner DTOs
export interface CreateMedicalPartnerRequest {
  name: string;
  contactPerson?: string;
  contactNumber?: string;
  email?: string;
  address?: string;
}

export interface MedicalPartnerResponse {
  id: number;
  name: string;
  contactPerson?: string;
  contactNumber?: string;
  email?: string;
  address?: string;
  status: MedicalPartnerStatus;
  campId: number;
  campName: string;
  createdAt: string;
  updatedAt: string;
}

// Team DTOs
export interface CreateTeamRequest {
  teamName: string;
  teamCode: string;
  description?: string;
  medicalPartnerId: number;
}

export interface TeamResponse {
  id: number;
  teamName: string;
  teamCode: string;
  description?: string;
  status: TeamStatus;
  medicalPartnerId: number;
  medicalPartnerName: string;
  createdAt: string;
  updatedAt: string;
}

// Volunteer DTOs
export interface CreateVolunteerRequest {
  fullName: string;
  usn: string;
  phoneNumber: string;
  email?: string;
  teamId: number;
}

export interface VolunteerResponse {
  id: number;
  role: Role;
  fullName: string;
  usn: string;
  phoneNumber: string;
  email?: string;
  status: VolunteerStatus;
  teamId?: number;
  teamName?: string;
  generatedPassword?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Dashboard DTOs
export interface DashboardSummaryResponse {
  totalRegistrations: number;
  registered: number;
  screened: number;
  donated: number;
  rejected: number;
  totalVolunteers: number;
  totalTeams: number;
  totalMedicalPartners: number;
}

export interface WaitingDonorQueueResponse {
  registrationId: string;
  fullName: string;
  age: number;
  phoneNumber: string;
}

// Report DTOs
export interface ReportSummaryResponse {
  totalRegistered: number;
  totalScreened: number;
  totalDonated: number;
  totalRejected: number;
}

export interface BloodGroupReportResponse {
  bloodGroup: BloodGroup;
  count: number;
}

export interface MedicalPartnerReportResponse {
  medicalPartnerName: string;
  successfulDonations: number;
}
