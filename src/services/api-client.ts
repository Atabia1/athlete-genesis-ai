/**
 * API Client
 * 
 * This module provides a standardized API client with:
 * - Error handling
 * - Request/response interceptors
 * - Automatic retry for failed requests
 * - Request cancellation
 * - Request caching
 * - Authentication handling
 */

import { ApiError, ErrorType, logError } from '@/shared/utils/error-handling';

/**
 * Request method
 */
export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Request options
 */
export interface RequestOptions {
  method?: RequestMethod;
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string | number | boolean | undefined>;
  timeout?: number;
  retry?: {
    maxRetries: number;
    retryDelay: number;
    retryStatusCodes: number[];
  };
  cache?: boolean;
  signal?: AbortSignal;
}

/**
 * Default request options
 */
const defaultRequestOptions: RequestOptions = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 seconds
  retry: {
    maxRetries: 3,
    retryDelay: 1000, // 1 second
    retryStatusCodes: [408, 429, 500, 502, 503, 504],
  },
  cache: false,
};

/**
 * Request interceptor
 */
export type RequestInterceptor = (
  url: string,
  options: RequestOptions
) => Promise<{ url: string; options: RequestOptions }>;

/**
 * Response interceptor
 */
export type ResponseInterceptor = (
  response: Response,
  request: { url: string; options: RequestOptions }
) => Promise<Response>;

/**
 * Error interceptor
 */
export type ErrorInterceptor = (
  error: Error,
  request: { url: string; options: RequestOptions }
) => Promise<Response | Error>;

/**
 * API client configuration
 */
export interface ApiClientConfig {
  baseUrl: string;
  defaultOptions?: RequestOptions;
  requestInterceptors?: RequestInterceptor[];
  responseInterceptors?: ResponseInterceptor[];
  errorInterceptors?: ErrorInterceptor[];
}

/**
 * API client options
 */
export interface ApiClientOptions {
  baseURL?: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

/**
 * Request configuration
 */
export interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timeout?: number;
  retries?: number;
}

/**
 * API client
 */
export class ApiClient {
  private baseUrl: string;
  private defaultOptions: RequestOptions;
  private requestInterceptors: RequestInterceptor[];
  private responseInterceptors: ResponseInterceptor[];
  private errorInterceptors: ErrorInterceptor[];
  private cache: Map<string, { data: any; timestamp: number }>;
  private cacheTTL: number = 5 * 60 * 1000; // 5 minutes

  /**
   * Create a new API client
   */
  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl;
    this.defaultOptions = { ...defaultRequestOptions, ...config.defaultOptions };
    this.requestInterceptors = config.requestInterceptors || [];
    this.responseInterceptors = config.responseInterceptors || [];
    this.errorInterceptors = config.errorInterceptors || [];
    this.cache = new Map();
  }

  /**
   * Add a request interceptor
   */
  public addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Add a response interceptor
   */
  public addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * Add an error interceptor
   */
  public addErrorInterceptor(interceptor: ErrorInterceptor): void {
    this.errorInterceptors.push(interceptor);
  }

  /**
   * Clear the cache
   */
  public clearCache(): void {
    this.cache.clear();
  }

  /**
   * Set the cache TTL
   */
  public setCacheTTL(ttl: number): void {
    this.cacheTTL = ttl;
  }

  /**
   * Create a request URL with query parameters
   */
  private createUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
    // Ensure path starts with a slash
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    
    // Create the full URL
    const url = new URL(`${this.baseUrl}${normalizedPath}`);
    
    // Add query parameters
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    
    return url.toString();
  }

  /**
   * Create a cache key for a request
   */
  private createCacheKey(url: string, options: RequestOptions): string {
    return `${options.method || 'GET'}-${url}-${JSON.stringify(options.body || {})}`;
  }

  /**
   * Check if a cached response is valid
   */
  private isCacheValid(cacheKey: string): boolean {
    const cached = this.cache.get(cacheKey);
    
    if (!cached) {
      return false;
    }
    
    const now = Date.now();
    return now - cached.timestamp < this.cacheTTL;
  }

  /**
   * Get a cached response
   */
  private getCachedResponse(cacheKey: string): any {
    const cached = this.cache.get(cacheKey);
    return cached?.data;
  }

  /**
   * Cache a response
   */
  private cacheResponse(cacheKey: string, data: any): void {
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * Execute a request with interceptors and error handling
   */
  private async executeRequest(
    url: string,
    options: RequestOptions,
    retryCount: number = 0
  ): Promise<any> {
    try {
      // Apply request interceptors
      let interceptedRequest = { url, options };
      
      for (const interceptor of this.requestInterceptors) {
        interceptedRequest = await interceptor(
          interceptedRequest.url,
          interceptedRequest.options
        );
      }
      
      // Destructure the intercepted request
      const { url: interceptedUrl, options: interceptedOptions } = interceptedRequest;
      
      // Check cache
      if (interceptedOptions.cache && interceptedOptions.method === 'GET') {
        const cacheKey = this.createCacheKey(interceptedUrl, interceptedOptions);
        
        if (this.isCacheValid(cacheKey)) {
          return this.getCachedResponse(cacheKey);
        }
      }
      
      // Create abort controller for timeout
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => {
        abortController.abort();
      }, interceptedOptions.timeout || 30000);
      
      // Merge abort signals
      const signal = interceptedOptions.signal
        ? this.mergeAbortSignals(interceptedOptions.signal, abortController.signal)
        : abortController.signal;
      
      // Prepare fetch options
      const fetchOptions: RequestInit = {
        method: interceptedOptions.method,
        headers: interceptedOptions.headers,
        body: interceptedOptions.body ? JSON.stringify(interceptedOptions.body) : undefined,
        signal,
      };
      
      // Execute the request
      const response = await fetch(interceptedUrl, fetchOptions);
      
      // Clear timeout
      clearTimeout(timeoutId);
      
      // Apply response interceptors
      let interceptedResponse = response;
      
      for (const interceptor of this.responseInterceptors) {
        interceptedResponse = await interceptor(
          interceptedResponse,
          { url: interceptedUrl, options: interceptedOptions }
        );
      }
      
      // Handle error responses
      if (!interceptedResponse.ok) {
        throw new ApiError(
          `API request failed with status ${interceptedResponse.status}`,
          interceptedResponse.status,
          await this.getErrorCodeFromResponse(interceptedResponse),
          { url: interceptedUrl, method: interceptedOptions.method }
        );
      }
      
      // Parse response
      const contentType = interceptedResponse.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await interceptedResponse.json();
      } else {
        data = await interceptedResponse.text();
      }
      
      // Cache response if needed
      if (interceptedOptions.cache && interceptedOptions.method === 'GET') {
        const cacheKey = this.createCacheKey(interceptedUrl, interceptedOptions);
        this.cacheResponse(cacheKey, data);
      }
      
      return data;
    } catch (error) {
      // Handle aborted requests
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new ApiError(
          'Request aborted',
          408,
          'REQUEST_ABORTED',
          { url, method: options.method }
        );
      }
      
      // Handle timeout
      if (error instanceof DOMException && error.name === 'TimeoutError') {
        throw new ApiError(
          'Request timed out',
          408,
          'REQUEST_TIMEOUT',
          { url, method: options.method }
        );
      }
      
      // Handle network errors
      if (error instanceof Error && error.message.includes('Network')) {
        this.handleNetworkError(error);
      }
      
      // Handle request errors
      if (error instanceof Error && error.message.includes('Request')) {
        this.handleRequestError(error, options);
      }
      
      // Apply error interceptors
      let interceptedError = error instanceof Error ? error : new Error(String(error));
      
      for (const interceptor of this.errorInterceptors) {
        try {
          const result = await interceptor(
            interceptedError,
            { url, options }
          );
          
          if (result instanceof Response) {
            // If the interceptor returns a response, use it
            const contentType = result.headers.get('content-type');
            
            if (contentType && contentType.includes('application/json')) {
              return await result.json();
            } else {
              return await result.text();
            }
          } else {
            // If the interceptor returns an error, use it
            interceptedError = result;
          }
        } catch (interceptorError) {
          // If the interceptor throws, use the original error
          logError(interceptorError, 'ApiClient.errorInterceptor');
        }
      }
      
      // Handle retry
      const retry = options.retry || this.defaultOptions.retry;
      
      if (
        retry &&
        retryCount < retry.maxRetries &&
        interceptedError instanceof ApiError &&
        retry.retryStatusCodes.includes(interceptedError.statusCode)
      ) {
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, retry.retryDelay));
        
        // Retry the request
        return this.executeRequest(url, options, retryCount + 1);
      }
      
      // Rethrow the error
      throw interceptedError;
    }
  }

  /**
   * Merge abort signals
   */
  private mergeAbortSignals(signal1: AbortSignal, signal2: AbortSignal): AbortSignal {
    const controller = new AbortController();
    
    const abortHandler = () => {
      controller.abort();
    };
    
    signal1.addEventListener('abort', abortHandler);
    signal2.addEventListener('abort', abortHandler);
    
    return controller.signal;
  }

  /**
   * Get error code from response
   */
  private async getErrorCodeFromResponse(response: Response): Promise<string> {
    try {
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        const data = await response.clone().json();
        return data.code || data.error || `HTTP_${response.status}`;
      }
    } catch (error) {
      // Ignore parsing errors
    }
    
    return `HTTP_${response.status}`;
  }

  /**
   * Handle network errors
   */
  private handleNetworkError(error: any): never {
    console.error('Network error:', error.message);
    throw new ApiError(
      'Network connection failed. Please check your internet connection.',
      'NETWORK_ERROR',
      '0' // Convert number to string
    );
  }

  /**
   * Handle request errors
   */
  private handleRequestError(error: any, config: RequestConfig): never {
    if (error.name === 'AbortError') {
      console.error('Request timeout:', error.message);
      throw new ApiError(
        'Request timed out. Please try again.',
        'TIMEOUT_ERROR',
        '408' // Convert number to string
      );
    }

    console.error('Request error:', error.message);
    throw new ApiError(
      'Request failed. Please try again.',
      'REQUEST_ERROR',
      '400' // Convert number to string
    );
  }

  /**
   * Send a request
   */
  public async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const mergedOptions = { ...this.defaultOptions, ...options };
    const url = this.createUrl(path, mergedOptions.params);
    
    return this.executeRequest(url, mergedOptions);
  }

  /**
   * Send a GET request
   */
  public async get<T>(path: string, options: Omit<RequestOptions, 'method'> = {}): Promise<T> {
    return this.request<T>(path, { ...options, method: 'GET' });
  }

  /**
   * Send a POST request
   */
  public async post<T>(path: string, data: any, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<T> {
    return this.request<T>(path, { ...options, method: 'POST', body: data });
  }

  /**
   * Send a PUT request
   */
  public async put<T>(path: string, data: any, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<T> {
    return this.request<T>(path, { ...options, method: 'PUT', body: data });
  }

  /**
   * Send a PATCH request
   */
  public async patch<T>(path: string, data: any, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<T> {
    return this.request<T>(path, { ...options, method: 'PATCH', body: data });
  }

  /**
   * Send a DELETE request
   */
  public async delete<T>(path: string, options: Omit<RequestOptions, 'method'> = {}): Promise<T> {
    return this.request<T>(path, { ...options, method: 'DELETE' });
  }
}

export default ApiClient;
