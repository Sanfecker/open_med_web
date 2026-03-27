// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'patient' | 'provider';
  createdAt: string;
}

// Provider types
export interface Provider {
  id: string;
  userId: string;
  providerType: string;
  specialization?: string;
  yearsOfExperience?: number;
  bio?: string;
  rating: number;
  totalReviews: number;
  isVerified: boolean;
  licenseNumber?: string;
  onboardingStatus: 'incomplete' | 'pending_verification' | 'complete';
  profileImage?: string;
  createdAt: string;
  updatedAt: string;

  // User info (populated from search)
  firstName?: string;
  lastName?: string;

  // Clinic info
  clinicName?: string;
  clinicImage?: string;
  location?: string;
}

// Service types
export interface Service {
  id: string;
  providerId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration: number; // in minutes
  isActive: boolean;
  createdAt: string;
}

// Booking types
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Booking {
  id: string;
  userId: string;
  providerId: string;
  serviceId: string;
  date: string; // YYYY-MM-DD format
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  status: BookingStatus;
  price: number;
  currency: string;
  notes?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

// Availability types
export interface RecurringAvailability {
  id: string;
  providerId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  isActive: boolean;
}

export interface DateOverride {
  id: string;
  providerId: string;
  date: string; // YYYY-MM-DD format
  isAvailable: boolean;
  startTime?: string; // HH:mm format
  endTime?: string; // HH:mm format
  reason?: string;
}

export interface TimeSlot {
  providerId: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

// Facility types
export interface Facility {
  id: string;
  name: string;
  type: string;
  address: string;
  city: string;
  region: string;
  phone: string;
  email?: string;
  isVerified: boolean;
  rating: number;
  totalReviews: number;
}

// Search filters
export interface ProviderSearchFilters {
  providerType?: string;
  specialization?: string;
  minRating?: number;
  maxPrice?: number;
  date?: string; // YYYY-MM-DD format
  startTime?: string; // HH:mm format
  isVerified?: boolean;
  limit?: number;
  offset?: number;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'patient' | 'provider';
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Provider registration data (matches backend RegisterProviderRequest)
export interface ProviderRegistrationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  providerType: string;
  specialization: string;
  licenseNumber: string;
  yearsOfExperience: number;
}
