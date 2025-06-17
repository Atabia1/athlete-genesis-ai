
import { ApiClient } from '../api-client';

export interface PaystackPlan {
  id: string;
  name: string;
  amount: number;
  interval: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'biannually' | 'annually';
  description?: string;
  currency?: string;
}

export interface PaystackSubscription {
  id: string;
  customer: {
    email: string;
    customer_code: string;
  };
  plan: PaystackPlan;
  status: 'active' | 'cancelled' | 'paused' | 'completed';
  next_payment_date: string;
  created_at: string;
}

export interface PaystackTransaction {
  id: number;
  status: string;
  reference: string;
  amount: number;
  customer: {
    email: string;
  };
  plan: string | null;
  paid_at: string | null;
  created_at: string;
  authorization: {
    authorization_code: string;
    card_type: string;
    last4: string;
    exp_month: string;
    exp_year: string;
    bank: string;
  };
}

export interface PaystackCustomer {
  id: number;
  email: string;
  customer_code: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  metadata: any;
  created_at: string;
}

export interface PaystackDiscount {
  id: number;
  code: string;
  name: string;
  percent_off: number;
  duration: 'once' | 'forever' | 'repeating';
  duration_in_months: number | null;
  active: boolean;
  created_at: string;
}

export interface PaystackResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

export interface PaystackListResponse<T> {
  status: boolean;
  message: string;
  data: T[];
  meta: {
    total: number;
    skipped: number;
    perPage: number;
    page: number;
    pageCount: number;
  };
}

export interface PaystackCheckoutOptions {
  key: string;
  email: string;
  amount: number;
  currency?: string;
  ref?: string;
  plan?: string;
  quantity?: number;
  channels?: string[];
  metadata?: {
    custom_fields?: Array<{
      display_name: string;
      variable_name: string;
      value: string;
    }>;
    [key: string]: any;
  };
  label?: string;
  onClose?: () => void;
  onSuccess?: (reference: string) => void;
  callback?: (reference: string) => void;
}

export interface PaystackSubscriptionRequest {
  customer: string;
  plan: string;
  authorization?: string;
  start_date?: string;
}

export interface PaystackPlanRequest {
  name: string;
  amount: number;
  interval: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'biannually' | 'annually';
  description?: string;
  send_invoices?: boolean;
  send_sms?: boolean;
  currency?: string;
  invoice_limit?: number;
}

export interface PaystackCustomerRequest {
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  metadata?: any;
}

export interface PaystackDiscountRequest {
  name: string;
  code: string;
  percent_off: number;
  duration: 'once' | 'forever' | 'repeating';
  duration_in_months?: number;
  max_redemptions?: number;
  applies_to?: {
    plan_ids: string[];
  };
}

export class PaystackApiService {
  private apiClient: ApiClient;
  private apiUrl: string;

  constructor() {
    this.apiUrl = 'https://api.paystack.co';

    this.apiClient = new ApiClient({
      baseUrl: this.apiUrl,
      defaultOptions: {
        timeout: 30000,
        retry: {
          maxRetries: 3,
          retryDelay: 1000,
          retryStatusCodes: [408, 429, 500, 502, 503, 504],
        },
      },
    });
  }

  private async makeRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    data?: any
  ): Promise<T> {
    try {
      const headers = {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY || ''}`,
        'Content-Type': 'application/json',
      };

      let response;
      if (method === 'GET') {
        response = await this.apiClient.get<PaystackResponse<T>>(endpoint, {
          headers,
          params: data,
        });
      } else {
        response = await this.apiClient.request<PaystackResponse<T>>({
          url: endpoint,
          method,
          headers,
          data,
        });
      }

      return response.data;
    } catch (error) {
      console.error(`Paystack API error (${endpoint}):`, error);
      throw error;
    }
  }

  // Plans
  async createPlan(plan: PaystackPlanRequest): Promise<PaystackPlan> {
    return this.makeRequest<PaystackPlan>('/plan', 'POST', plan);
  }

  async updatePlan(planId: string, updates: Partial<PaystackPlanRequest>): Promise<PaystackPlan> {
    return this.makeRequest<PaystackPlan>(`/plan/${planId}`, 'PUT', updates);
  }

  async getPlan(planId: string): Promise<PaystackPlan> {
    return this.makeRequest<PaystackPlan>(`/plan/${planId}`, 'GET');
  }

  async getPlans(page = 1, perPage = 50): Promise<PaystackListResponse<PaystackPlan>> {
    return this.makeRequest<PaystackListResponse<PaystackPlan>>('/plan', 'GET', {
      perPage,
      page,
    });
  }

  // Customers
  async createCustomer(customer: PaystackCustomerRequest): Promise<PaystackCustomer> {
    return this.makeRequest<PaystackCustomer>('/customer', 'POST', customer);
  }

  async updateCustomer(
    customerId: string,
    updates: Partial<PaystackCustomerRequest>
  ): Promise<PaystackCustomer> {
    return this.makeRequest<PaystackCustomer>(`/customer/${customerId}`, 'PUT', updates);
  }

  async getCustomer(customerId: string): Promise<PaystackCustomer> {
    return this.makeRequest<PaystackCustomer>(`/customer/${customerId}`, 'GET');
  }

  async getCustomers(page = 1, perPage = 50): Promise<PaystackListResponse<PaystackCustomer>> {
    return this.makeRequest<PaystackListResponse<PaystackCustomer>>('/customer', 'GET', {
      perPage,
      page,
    });
  }

  // Subscriptions
  async createSubscription(email: string, planId: string, metadata?: any): Promise<any> {
    console.log('Creating subscription for:', email, 'plan:', planId, 'metadata:', metadata);
    // Implementation will be added later
    return { data: { subscription_code: 'mock_subscription_code' } };
  }

  async pauseSubscription(subscriptionId: string): Promise<any> {
    console.log('Pausing subscription:', subscriptionId);
    // Implementation will be added later
    return { data: { status: 'paused' } };
  }

  async resumeSubscription(subscriptionId: string): Promise<any> {
    console.log('Resuming subscription:', subscriptionId);
    // Implementation will be added later
    return { data: { status: 'active' } };
  }

  async getSubscriptions(customerId: string, page: number = 1, perPage: number = 50): Promise<any> {
    console.log('Getting subscriptions for customer:', customerId, 'page:', page, 'perPage:', perPage);
    // Implementation will be added later
    return { data: [] };
  }

  async getTransaction(transactionId: string): Promise<any> {
    console.log('Getting transaction:', transactionId);
    // Implementation will be added later
    return { data: {} };
  }

  async cancelSubscription(subscriptionId: string): Promise<any> {
    console.log('Canceling subscription:', subscriptionId);
    return this.makeRequest('/subscription/disable', 'POST', {
      code: subscriptionId,
      token: subscriptionId
    });
  }

  async getCustomerSubscriptions(customerId: string): Promise<any> {
    console.log('Getting customer subscriptions:', customerId);
    return this.makeRequest('/customer', 'GET', {
      customer: customerId
    });
  }

  async getSubscription(subscriptionId: string): Promise<PaystackSubscription> {
    return this.makeRequest<PaystackSubscription>(`/subscription/${subscriptionId}`, 'GET');
  }

  // Transactions
  async verifyTransaction(reference: string): Promise<PaystackTransaction> {
    return this.makeRequest<PaystackTransaction>(`/transaction/verify/${reference}`, 'GET');
  }

  async getTransactions(
    page = 1,
    perPage = 50,
    from?: string,
    to?: string,
    status?: string,
    customer?: string
  ): Promise<PaystackListResponse<PaystackTransaction>> {
    const params: Record<string, any> = { perPage, page };
    if (from) params.from = from;
    if (to) params.to = to;
    if (status) params.status = status;
    if (customer) params.customer = customer;

    return this.makeRequest<PaystackListResponse<PaystackTransaction>>('/transaction', 'GET', params);
  }

  // Discounts
  async createDiscount(discount: PaystackDiscountRequest): Promise<PaystackDiscount> {
    return this.makeRequest<PaystackDiscount>('/discount', 'POST', discount);
  }

  async getDiscount(discountId: string): Promise<PaystackDiscount> {
    return this.makeRequest<PaystackDiscount>(`/discount/${discountId}`, 'GET');
  }

  async getDiscounts(page = 1, perPage = 50): Promise<PaystackListResponse<PaystackDiscount>> {
    return this.makeRequest<PaystackListResponse<PaystackDiscount>>('/discount', 'GET', {
      perPage,
      page,
    });
  }

  async getDiscountCode(codeId: string): Promise<any> {
    console.log('Getting discount code:', codeId);
    // Implementation will be added later
    return { data: {} };
  }

  // Checkout
  getCheckoutUrl(options: PaystackCheckoutOptions): string {
    const baseUrl = 'https://checkout.paystack.com/';
    const params = new URLSearchParams();

    // Required parameters
    params.append('key', options.key);
    params.append('email', options.email);
    params.append('amount', (options.amount * 100).toString()); // Convert to kobo/cents

    // Optional parameters
    if (options.currency) params.append('currency', options.currency);
    if (options.ref) params.append('ref', options.ref);
    if (options.plan) params.append('plan', options.plan);
    if (options.quantity) params.append('quantity', options.quantity.toString());
    if (options.label) params.append('label', options.label);

    // Metadata
    if (options.metadata) {
      params.append('metadata', JSON.stringify(options.metadata));
    }

    // Channels
    if (options.channels && options.channels.length > 0) {
      params.append('channels', options.channels.join(','));
    }

    return `${baseUrl}?${params.toString()}`;
  }

  // Helper methods
  generateReference(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    return `ref-${timestamp}-${random}`;
  }

  formatAmount(amount: number, currency = 'NGN'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  }
}

export default new PaystackApiService();
