
/**
 * API Service
 *
 * This module provides an instance of the API client with authentication handling
 * and other application-specific configurations.
 */

import { ApiClient, RequestInterceptor, ResponseInterceptor, ErrorInterceptor } from './api-client';
import { logError } from '@/shared/utils/error-handling';
import { getApiBaseUrl } from '@/utils/env-config';
import { HealthData } from '@/integrations/health-apps/types';

// Authentication token storage key
const AUTH_TOKEN_KEY = 'auth_token';

/**
 * Get the authentication token from local storage
 */
function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

/**
 * Set the authentication token in local storage
 */
export function setAuthToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

/**
 * Clear the authentication token from local storage
 */
export function clearAuthToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

/**
 * Authentication request interceptor
 */
const authRequestInterceptor: RequestInterceptor = async (url, options) => {
  const token = getAuthToken();

  if (token) {
    return {
      url,
      options: {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${token}`,
        } as Record<string, string>,
      },
    };
  }

  return { url, options };
};

/**
 * Authentication response interceptor
 */
const authResponseInterceptor: ResponseInterceptor = async (response) => {
  // Check for authentication token in response headers
  const authToken = response.headers.get('X-Auth-Token');

  if (authToken) {
    setAuthToken(authToken);
  }

  return response;
};

/**
 * Authentication error interceptor
 */
const authErrorInterceptor: ErrorInterceptor = async (error) => {
  // Handle 401 Unauthorized errors
  if (error instanceof Response && error.status === 401) {
    // Clear the authentication token
    clearAuthToken();

    // Redirect to login page
    window.location.href = '/login';
  }

  return error;
};

/**
 * Logging request interceptor
 */
const loggingRequestInterceptor: RequestInterceptor = async (url, options) => {
  if (import.meta.env.DEV) {
    console.log(`API Request: ${options.method} ${url}`, {
      headers: options.headers,
      body: options.body,
      params: options.params,
    });
  }

  return { url, options };
};

/**
 * Logging response interceptor
 */
const loggingResponseInterceptor: ResponseInterceptor = async (response) => {
  if (import.meta.env.DEV) {
    console.log(`API Response: ${response.status}`, {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    });
  }

  return response;
};

/**
 * Logging error interceptor
 */
const loggingErrorInterceptor: ErrorInterceptor = async (error) => {
  logError(error, 'ApiService');

  if (import.meta.env.DEV) {
    console.error(`API Error:`, error);
  }

  return error;
};

/**
 * Create the API client instance
 */
export const api = new ApiClient({
  baseUrl: getApiBaseUrl(),
  defaultOptions: {
    timeout: 30000, // 30 seconds
    retry: {
      maxRetries: 3,
      retryDelay: 1000, // 1 second
      retryStatusCodes: [408, 429, 500, 502, 503, 504],
    },
  },
  requestInterceptors: [
    authRequestInterceptor,
    loggingRequestInterceptor,
  ],
  responseInterceptors: [
    authResponseInterceptor,
    loggingResponseInterceptor,
  ],
  errorInterceptors: [
    authErrorInterceptor,
    loggingErrorInterceptor,
  ],
});

/**
 * API service for authentication
 */
export const authApi = {
  /**
   * Login with email and password
   */
  login: async (email: string, password: string) => {
    const response = await api.post<{ token: string; user: any }>('/auth/login', {
      email,
      password,
    });

    if (response.token) {
      setAuthToken(response.token);
    }

    return response;
  },

  /**
   * Register a new user
   */
  register: async (userData: {
    email: string;
    password: string;
    name: string;
    [key: string]: any;
  }) => {
    return api.post<{ token: string; user: any }>('/auth/register', userData);
  },

  /**
   * Logout the current user
   */
  logout: async () => {
    await api.post('/auth/logout', {});
    clearAuthToken();
  },

  /**
   * Get the current user
   */
  getCurrentUser: async () => {
    return api.get<any>('/auth/me');
  },

  /**
   * Request a password reset
   */
  requestPasswordReset: async (email: string) => {
    return api.post<{ message: string }>('/auth/forgot-password', { email });
  },

  /**
   * Reset password with token
   */
  resetPassword: async (token: string, password: string) => {
    return api.post<{ message: string }>('/auth/reset-password', {
      token,
      password,
    });
  },
};

/**
 * API service for workouts
 */
export const workoutApi = {
  /**
   * Get all workouts
   */
  getWorkouts: async () => {
    return api.get<any[]>('/workouts');
  },

  /**
   * Get a workout by ID
   */
  getWorkout: async (id: string) => {
    return api.get<any>(`/workouts/${id}`);
  },

  /**
   * Create a new workout
   */
  createWorkout: async (workout: any) => {
    return api.post<any>('/workouts', workout);
  },

  /**
   * Update a workout
   */
  updateWorkout: async (id: string, workout: any) => {
    return api.put<any>(`/workouts/${id}`, workout);
  },

  /**
   * Delete a workout
   */
  deleteWorkout: async (id: string) => {
    return api.delete<void>(`/workouts/${id}`);
  },
};

/**
 * API service for user profile
 */
export const profileApi = {
  /**
   * Get user profile
   */
  getProfile: async () => {
    return api.get<any>('/profile');
  },

  /**
   * Update user profile
   */
  updateProfile: async (profile: any) => {
    return api.put<any>('/profile', profile);
  },

  /**
   * Update user avatar
   */
  updateAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);

    return api.post<{ avatarUrl: string }>('/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

/**
 * API service for payment
 */
export const paymentApi = {
  /**
   * Get available plans
   */
  getPlans: async () => {
    return api.get<any[]>('/plans');
  },

  /**
   * Subscribe to a plan
   */
  subscribe: async (planId: string, paymentMethodId: string) => {
    return api.post<any>('/subscriptions', {
      planId,
      paymentMethodId,
    });
  },

  /**
   * Cancel subscription
   */
  cancelSubscription: async () => {
    return api.delete<void>('/subscriptions');
  },

  /**
   * Get subscription status
   */
  getSubscriptionStatus: async () => {
    return api.get<any>('/subscriptions/status');
  },
};

/**
 * API service for health data
 */
export class ApiService {
  /**
   * Verify a connection code
   */
  async verifyConnectionCode(code: string, deviceInfo: any): Promise<{ success: boolean; userId: string; deviceId: string }> {
    return api.post<{ success: boolean; userId: string; deviceId: string }>('/health/connect', {
      code,
      deviceInfo,
    });
  }

  /**
   * Disconnect a device
   */
  async disconnectDevice(deviceId: string): Promise<{ success: boolean }> {
    return api.post<{ success: boolean }>('/health/disconnect', {
      deviceId,
    });
  }

  /**
   * Sync health data
   */
  async syncHealthData(healthData: any): Promise<{ success: boolean }> {
    return api.post<{ success: boolean }>('/health/sync', {
      healthData,
    });
  }

  /**
   * Get health data
   */
  async getHealthData(): Promise<any> {
    return api.get<any>('/health/data');
  }

  /**
   * Get connected devices
   */
  async getConnectedDevices(): Promise<any[]> {
    return api.get<any[]>('/health/devices');
  }

  /**
   * Sync a workout to health apps
   */
  async syncWorkout(workout: any): Promise<{ success: boolean }> {
    return api.post<{ success: boolean }>('/health/workout/sync', {
      workout,
    });
  }

  /**
   * Create a new health data entry
   */
  async createHealthDataEntry(userId: string, data: Partial<HealthData>): Promise<HealthData> {
    console.log('Creating health data entry for user:', userId, data);
    // Implementation will be added later
    return data as HealthData;
  }

  /**
   * Update health data for a user
   */
  async updateHealthData(userId: string, data: Partial<HealthData>): Promise<HealthData> {
    console.log('Updating health data for user:', userId, data);
    // Implementation will be added later
    return data as HealthData;
  }

  /**
   * Delete a health data entry
   */
  async deleteHealthData(userId: string, entryId: string): Promise<void> {
    console.log('Deleting health data entry:', entryId, 'for user:', userId);
    // Implementation will be added later
  }
}

// Export the API client instance
export default api;
