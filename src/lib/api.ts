import type {
  ApiResponse,
  AuthResponse,
  Booking,
  LoginCredentials,
  Provider,
  ProviderSearchFilters,
  ProviderRegistrationData,
  RegisterData,
  Service,
  TimeSlot,
  RecurringAvailability,
  DateOverride,
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class OpenMedAPI {
  private baseURL = API_URL;
  private token: string | null = null;

  constructor() {
    // Try to load token from localStorage on client side
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: {
          ...headers,
          ...(options.headers || {}),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: {
            code: data.error?.code || 'UNKNOWN_ERROR',
            message: data.error?.message || 'An error occurred',
          },
        };
      }

      return {
        success: true,
        data: data.data || data,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Network error',
        },
      };
    }
  }

  // ========== Authentication ==========

  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async registerProvider(data: ProviderRegistrationData): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/auth/register/provider', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async updateProviderProfile(data: any): Promise<ApiResponse<{ provider: Provider }>> {
    return this.request<{ provider: Provider }>('/providers/onboarding/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // Auto-save token on successful login
    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  logout() {
    this.clearToken();
  }

  // ========== Provider Search (Public) ==========

  async searchProviders(
    filters: ProviderSearchFilters = {}
  ): Promise<ApiResponse<{ providers: Provider[] }>> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });

    const queryString = params.toString();
    const endpoint = `/providers/search${queryString ? `?${queryString}` : ''}`;

    return this.request<{ providers: Provider[] }>(endpoint);
  }

  async getProvider(providerId: string): Promise<ApiResponse<{ provider: Provider }>> {
    return this.request<{ provider: Provider }>(`/providers/${providerId}`);
  }

  // ========== Services ==========

  async getProviderServices(providerId: string): Promise<ApiResponse<{ services: Service[] }>> {
    return this.request<{ services: Service[] }>(`/providers/${providerId}/services`);
  }

  async addService(serviceData: {
    name: string;
    description: string;
    price: number;
    currency: string;
    duration: number;
  }): Promise<ApiResponse<{ service: Service }>> {
    return this.request<{ service: Service }>('/providers/services', {
      method: 'POST',
      body: JSON.stringify(serviceData),
    });
  }

  async updateService(
    serviceId: string,
    updates: Partial<Service>
  ): Promise<ApiResponse<{ service: Service }>> {
    return this.request<{ service: Service }>(`/providers/services/${serviceId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteService(serviceId: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/providers/services/${serviceId}`, {
      method: 'DELETE',
    });
  }

  // ========== Availability ==========

  async getAvailability(
    providerId: string,
    date: string
  ): Promise<ApiResponse<{ slots: TimeSlot[] }>> {
    return this.request<{ slots: TimeSlot[] }>(
      `/providers/${providerId}/availability?date=${date}`
    );
  }

  async getRecurringAvailability(
    providerId: string
  ): Promise<ApiResponse<{ availability: RecurringAvailability[] }>> {
    return this.request<{ availability: RecurringAvailability[] }>(
      `/providers/${providerId}/recurring-availability`
    );
  }

  async getProviderAvailability(
    providerId: string
  ): Promise<ApiResponse<{ availability: RecurringAvailability[] }>> {
    return this.request<{ availability: RecurringAvailability[] }>(
      `/providers/${providerId}/availability`
    );
  }

  async setRecurringAvailability(
    availabilityData: {
      dayOfWeek: number;
      startTime: string;
      endTime: string;
    }
  ): Promise<ApiResponse<{ availability: RecurringAvailability }>> {
    return this.request<{ availability: RecurringAvailability }>(
      '/providers/recurring-availability',
      {
        method: 'POST',
        body: JSON.stringify(availabilityData),
      }
    );
  }

  async setDateOverride(
    overrideData: {
      date: string;
      isAvailable: boolean;
      startTime?: string;
      endTime?: string;
      reason?: string;
    }
  ): Promise<ApiResponse<{ override: DateOverride }>> {
    return this.request<{ override: DateOverride }>('/providers/date-overrides', {
      method: 'POST',
      body: JSON.stringify(overrideData),
    });
  }

  // ========== Bookings ==========

  async createBooking(bookingData: {
    providerId: string;
    serviceId: string;
    date: string;
    startTime: string;
    notes?: string;
  }): Promise<ApiResponse<{ booking: Booking }>> {
    return this.request<{ booking: Booking }>('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async getMyBookings(): Promise<ApiResponse<{ bookings: Booking[] }>> {
    return this.request<{ bookings: Booking[] }>('/bookings/my/bookings');
  }

  async getBooking(bookingId: string): Promise<ApiResponse<{ booking: Booking }>> {
    return this.request<{ booking: Booking }>(`/bookings/${bookingId}`);
  }

  async confirmBooking(bookingId: string): Promise<ApiResponse<{ booking: Booking }>> {
    return this.request<{ booking: Booking }>(`/bookings/${bookingId}/confirm`, {
      method: 'PUT',
    });
  }

  async cancelBooking(
    bookingId: string,
    reason?: string
  ): Promise<ApiResponse<{ booking: Booking }>> {
    return this.request<{ booking: Booking }>(`/bookings/${bookingId}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
  }

  async completeBooking(bookingId: string): Promise<ApiResponse<{ booking: Booking }>> {
    return this.request<{ booking: Booking }>(`/bookings/${bookingId}/complete`, {
      method: 'PUT',
    });
  }

  async bookingChat(
    providerId: string,
    message: string,
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>
  ): Promise<ApiResponse<{ message: string; bookingData?: any }>> {
    return this.request<{ message: string; bookingData?: any }>('/ai/booking-chat', {
      method: 'POST',
      body: JSON.stringify({ providerId, message, conversationHistory }),
    });
  }

  // ========== Provider Onboarding ==========

  async completeOnboarding(): Promise<ApiResponse<{ provider: Provider }>> {
    return this.request<{ provider: Provider }>('/providers/onboarding/complete', {
      method: 'POST',
    });
  }

  async updateProfile(updates: {
    bio?: string;
    specialization?: string;
    yearsOfExperience?: number;
    licenseNumber?: string;
  }): Promise<ApiResponse<{ provider: Provider }>> {
    return this.request<{ provider: Provider }>('/providers/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // ========== FCM Tokens ==========

  async registerFCMToken(token: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>('/fcm/register', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async unregisterFCMToken(token: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>('/fcm/unregister', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }
}

// Export a singleton instance
export const api = new OpenMedAPI();

// Export the class for custom instances
export { OpenMedAPI };
