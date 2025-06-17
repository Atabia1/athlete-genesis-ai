
/**
 * Service Registry
 * 
 * Central registry for all application services with dependency injection
 */

import { IndexedDBService } from './indexeddb/index';
import { healthSyncService } from './health-sync-service';
import { retryQueueService } from './retry-queue-service';
import { SupabaseService } from './api/supabase-service';
import { MealPlanService } from './api/meal-plan-service';
import { mockUserService } from './api/user-service';
import { PaystackApiService } from './api/paystack-service';

/**
 * Service interface
 */
export interface IService {
  initialize(): Promise<void>;
  shutdown(): Promise<void>;
}

/**
 * Service registry interface
 */
export interface IServiceRegistry {
  register(name: string, service: any): void;
  get<T>(name: string): T;
  isRegistered(name: string): boolean;
  initialize(): Promise<void>;
  shutdown(): Promise<void>;
}

/**
 * Service Registry implementation
 */
class ServiceRegistry implements IServiceRegistry {
  private services: Map<string, any> = new Map();
  private initialized = false;

  /**
   * Initialize all services
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Initialize core services
      const dbService = new IndexedDBService('AthleteGenesisDB', [
        {
          name: 'health_data',
          keyPath: 'id',
          autoIncrement: false,
        },
        {
          name: 'connection_codes',
          keyPath: 'id',
          autoIncrement: false,
        }
      ]);
      await dbService.initDatabase();
      this.register('indexedDBService', dbService);

      // Initialize health sync service
      await healthSyncService.initialize();
      this.register('healthSyncService', healthSyncService);

      // Register other services
      this.register('retryQueueService', retryQueueService);
      this.register('supabaseService', new SupabaseService());
      this.register('mealPlanService', new MealPlanService());
      this.register('userService', mockUserService);
      this.register('paystackService', new PaystackApiService());

      this.initialized = true;
      console.log('Service registry initialized successfully');
    } catch (error) {
      console.error('Failed to initialize service registry:', error);
      throw error;
    }
  }

  /**
   * Register a service
   * @param name Service name
   * @param service Service instance
   */
  register(name: string, service: any): void {
    if (this.services.has(name)) {
      console.warn(`Service "${name}" already registered. Overwriting.`);
    }
    this.services.set(name, service);
  }

  /**
   * Get a service
   * @param name Service name
   * @returns Service instance
   */
  get<T>(name: string): T {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service "${name}" not registered`);
    }
    return service as T;
  }

  /**
   * Check if a service is registered
   * @param name Service name
   * @returns True if the service is registered, false otherwise
   */
  isRegistered(name: string): boolean {
    return this.services.has(name);
  }

  /**
   * Shutdown all services
   */
  async shutdown(): Promise<void> {
    for (const [name, service] of this.services) {
      if (service && typeof service.shutdown === 'function') {
        try {
          await service.shutdown();
          console.log(`Service "${name}" shut down successfully`);
        } catch (error) {
          console.error(`Failed to shut down service "${name}":`, error);
        }
      }
    }
    this.services.clear();
    this.initialized = false;
    console.log('Service registry shut down');
  }
}

// Export singleton instance
export const serviceRegistry = new ServiceRegistry();
export default serviceRegistry;
