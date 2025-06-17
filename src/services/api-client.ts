
/**
 * API Client
 *
 * A robust API client with built-in retry logic, error handling, and request/response interceptors.
 * Supports timeout, retry with exponential backoff, and comprehensive error handling.
 */

// Error types for better error handling
enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  HTTP_ERROR = 'HTTP_ERROR',
  PARSE_ERROR = 'PARSE_ERROR',
  RETRY_EXHAUSTED = 'RETRY_EXHAUSTED',
}

/**
 * Configuration for retry behavior
 */
interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  retryStatusCodes: number[];
  exponentialBackoff?: boolean;
}

/**
 * API request configuration
 */
interface RequestConfig {
  timeout?: number;
  retry?: RetryConfig;
  headers?: Record<string, string>;
  params?: Record<string, any>;
}

/**
 * API client configuration
 */
interface ApiClientConfig {
  baseUrl: string;
  defaultOptions?: RequestConfig;
  requestInterceptors?: RequestInterceptor[];
  responseInterceptors?: ResponseInterceptor[];
  errorInterceptors?: ErrorInterceptor[];
}

/**
 * Request interceptor type
 */
type RequestInterceptor = (
  url: string,
  options: RequestInit & RequestConfig
) => Promise<{ url: string; options: RequestInit & RequestConfig }>;

/**
 * Response interceptor type
 */
type ResponseInterceptor = (
  response: Response,
  request: { url: string; options: RequestInit & RequestConfig }
) => Promise<Response>;

/**
 * Error interceptor type
 */
type ErrorInterceptor = (
  error: any,
  request: { url: string; options: RequestInit & RequestConfig }
) => Promise<any>;

/**
 * Custom API Error class
 */
class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public type: ErrorType = ErrorType.HTTP_ERROR,
    public response?: Response
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * API Client class
 */
export class ApiClient {
  private baseUrl: string;
  private defaultOptions: RequestConfig;
  private requestInterceptors: RequestInterceptor[];
  private responseInterceptors: ResponseInterceptor[];
  private errorInterceptors: ErrorInterceptor[];

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl;
    this.defaultOptions = config.defaultOptions || {};
    this.requestInterceptors = config.requestInterceptors || [];
    this.responseInterceptors = config.responseInterceptors || [];
    this.errorInterceptors = config.errorInterceptors || [];
  }

  /**
   * Build the full URL
   */
  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(endpoint, this.baseUrl);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  /**
   * Apply request interceptors
   */
  private async applyRequestInterceptors(
    url: string,
    options: RequestInit & RequestConfig
  ): Promise<{ url: string; options: RequestInit & RequestConfig }> {
    let currentUrl = url;
    let currentOptions = options;

    for (const interceptor of this.requestInterceptors) {
      const result = await interceptor(currentUrl, currentOptions);
      currentUrl = result.url;
      currentOptions = result.options;
    }

    return { url: currentUrl, options: currentOptions };
  }

  /**
   * Apply response interceptors
   */
  private async applyResponseInterceptors(
    response: Response,
    request: { url: string; options: RequestInit & RequestConfig }
  ): Promise<Response> {
    let currentResponse = response;

    for (const interceptor of this.responseInterceptors) {
      currentResponse = await interceptor(currentResponse, request);
    }

    return currentResponse;
  }

  /**
   * Apply error interceptors
   */
  private async applyErrorInterceptors(
    error: any,
    request: { url: string; options: RequestInit & RequestConfig }
  ): Promise<any> {
    let currentError = error;

    for (const interceptor of this.errorInterceptors) {
      currentError = await interceptor(currentError, request);
    }

    return currentError;
  }

  /**
   * Sleep function for retry delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Calculate retry delay with exponential backoff
   */
  private calculateRetryDelay(attempt: number, baseDelay: number, exponentialBackoff = true): number {
    if (!exponentialBackoff) {
      return baseDelay;
    }
    return baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
  }

  /**
   * Check if error should be retried
   */
  private shouldRetry(error: any, retryConfig: RetryConfig): boolean {
    if (error instanceof ApiError) {
      return error.status ? retryConfig.retryStatusCodes.includes(error.status) : false;
    }
    return error.name === 'TypeError' || error.type === ErrorType.NETWORK_ERROR;
  }

  /**
   * Make HTTP request with retry logic
   */
  private async makeRequest<T>(
    url: string,
    options: RequestInit & RequestConfig
  ): Promise<T> {
    const defaultRetryConfig: RetryConfig = {
      maxRetries: 3,
      retryDelay: 1000,
      retryStatusCodes: [408, 429, 500, 502, 503, 504],
      exponentialBackoff: true,
    };

    const mergedOptions = {
      ...this.defaultOptions,
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...this.defaultOptions.headers,
        ...options.headers,
      } as Record<string, string>,
      retry: {
        ...defaultRetryConfig,
        ...this.defaultOptions.retry,
        ...options.retry,
      } as RetryConfig,
    };

    // Apply request interceptors
    const { url: interceptedUrl, options: interceptedOptions } = await this.applyRequestInterceptors(
      url,
      mergedOptions
    );

    const retryConfig = interceptedOptions.retry!;
    let lastError: any;

    for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
      try {
        // Create AbortController for timeout
        const controller = new AbortController();
        const timeoutId = interceptedOptions.timeout ? 
          setTimeout(() => controller.abort(), interceptedOptions.timeout) : null;

        const fetchOptions: RequestInit = {
          ...interceptedOptions,
          signal: controller.signal,
        };

        // Remove our custom properties from fetch options
        delete (fetchOptions as any).timeout;
        delete (fetchOptions as any).retry;
        delete (fetchOptions as any).params;

        let response: Response;
        try {
          response = await fetch(interceptedUrl, fetchOptions);
        } catch (fetchError: any) {
          if (timeoutId) clearTimeout(timeoutId);
          
          if (fetchError.name === 'AbortError') {
            throw new ApiError('Request timeout', undefined, ErrorType.TIMEOUT_ERROR);
          }
          throw new ApiError('Network error', undefined, ErrorType.NETWORK_ERROR, undefined);
        }

        if (timeoutId) clearTimeout(timeoutId);

        // Apply response interceptors
        response = await this.applyResponseInterceptors(response, {
          url: interceptedUrl,
          options: interceptedOptions,
        });

        if (!response.ok) {
          throw new ApiError(
            `HTTP ${response.status}: ${response.statusText}`,
            response.status,
            ErrorType.HTTP_ERROR,
            response
          );
        }

        // Parse response
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            return await response.json();
          } else {
            return await response.text() as unknown as T;
          }
        } catch (parseError) {
          throw new ApiError('Failed to parse response', response.status, ErrorType.PARSE_ERROR, response);
        }
      } catch (error: any) {
        lastError = error;

        // Apply error interceptors
        const interceptedError = await this.applyErrorInterceptors(error, {
          url: interceptedUrl,
          options: interceptedOptions,
        });

        // If error was transformed by interceptor, use the new error
        if (interceptedError !== error) {
          lastError = interceptedError;
        }

        // Check if we should retry
        if (attempt < retryConfig.maxRetries && this.shouldRetry(lastError, retryConfig)) {
          const delay = this.calculateRetryDelay(
            attempt,
            retryConfig.retryDelay,
            retryConfig.exponentialBackoff
          );
          await this.sleep(delay);
          continue;
        }

        // If we've exhausted retries, throw the last error
        if (attempt >= retryConfig.maxRetries) {
          throw new ApiError(
            'Maximum retry attempts exceeded',
            lastError.status,
            ErrorType.RETRY_EXHAUSTED,
            lastError.response
          );
        }

        throw lastError;
      }
    }

    throw lastError;
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const url = this.buildUrl(endpoint, config.params);
    return this.makeRequest<T>(url, {
      ...config,
      method: 'GET',
    });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: any, config: RequestConfig = {}): Promise<T> {
    const url = this.buildUrl(endpoint, config.params);
    return this.makeRequest<T>(url, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: any, config: RequestConfig = {}): Promise<T> {
    const url = this.buildUrl(endpoint, config.params);
    return this.makeRequest<T>(url, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: any, config: RequestConfig = {}): Promise<T> {
    const url = this.buildUrl(endpoint, config.params);
    return this.makeRequest<T>(url, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const url = this.buildUrl(endpoint, config.params);
    return this.makeRequest<T>(url, {
      ...config,
      method: 'DELETE',
    });
  }

  /**
   * Generic request method
   */
  async request<T>(config: {
    url: string;
    method: string;
    data?: any;
    params?: Record<string, any>;
    headers?: Record<string, string>;
    timeout?: number;
    retry?: Partial<RetryConfig>;
  }): Promise<T> {
    const url = this.buildUrl(config.url, config.params);
    
    const defaultRetryConfig: RetryConfig = {
      maxRetries: 3,
      retryDelay: 1000,
      retryStatusCodes: [408, 429, 500, 502, 503, 504],
      exponentialBackoff: true,
    };

    return this.makeRequest<T>(url, {
      method: config.method,
      body: config.data ? JSON.stringify(config.data) : undefined,
      headers: config.headers,
      timeout: config.timeout,
      retry: config.retry ? { ...defaultRetryConfig, ...config.retry } : defaultRetryConfig,
    });
  }
}

export type {
  ApiClientConfig,
  RequestConfig,
  RetryConfig,
  RequestInterceptor,
  ResponseInterceptor,
  ErrorInterceptor,
};

export { ApiError, ErrorType };
