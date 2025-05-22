/**
 * Service Registry
 *
 * This module provides a centralized registry for all services in the application.
 * It helps manage dependencies between services and provides a clean way to
 * access services throughout the application.
 *
 * Benefits:
 * - Centralized service management
 * - Dependency injection
 * - Easier testing through service mocking
 * - Better organization of service initialization
 */

import { IndexedDBService, dbService } from './indexeddb-service';
import { RetryQueueService, retryQueueService } from './retry-queue-service';
import { SupabaseServiceImpl } from './api/supabase-service';
import { WorkoutService } from './api/workout-service';
import { MealPlanService } from './api/meal-plan-service';
import { UserService, userService } from './api/user-service';
import { PaystackServiceImpl, paystackService } from './api/paystack-service';
import { OpenAIServiceImpl, openAIService } from './api/openai-service';
import { healthApi } from './api/health-api';
import { healthSyncService } from './health-sync-service';
import { AnalyticsService } from './analytics-service';
import { LoggingService } from './logging-service';

/**
 * Service Registry interface
 */
export interface ServiceRegistry {
  // Local storage services
  db: IndexedDBService;
  retryQueue: RetryQueueService;

  // API services
  supabase: SupabaseServiceImpl;
  workout: WorkoutService;
  mealPlan: MealPlanService;
  user: UserService;
  paystack: PaystackServiceImpl;
  openAI: OpenAIServiceImpl;
  health: typeof healthApi;
  healthSync: typeof healthSyncService;

  // Utility services
  analytics: AnalyticsService;
  logging: LoggingService;

  // Initialize all services
  initialize(): Promise<void>;
}

/**
 * Service Registry implementation
 */
class ServiceRegistryImpl implements ServiceRegistry {
  // Local storage services
  db: IndexedDBService;
  retryQueue: RetryQueueService;

  // API services
  supabase: SupabaseServiceImpl;
  workout: WorkoutService;
  mealPlan: MealPlanService;
  user: UserService;
  paystack: PaystackServiceImpl;
  openAI: OpenAIServiceImpl;
  health: typeof healthApi;
  healthSync: typeof healthSyncService;

  // Utility services
  analytics: AnalyticsService;
  logging: LoggingService;

  constructor() {
    try {
      // Initialize services
      this.db = dbService;
      this.retryQueue = retryQueueService;

      // Create API services
      this.supabase = new SupabaseServiceImpl();
      this.workout = new WorkoutService(this.supabase);
      this.mealPlan = new MealPlanService(this.supabase);
      this.user = userService;
      this.paystack = paystackService;
      this.openAI = openAIService;
      this.health = healthApi;
      this.healthSync = healthSyncService;

      // Create utility services
      this.analytics = new AnalyticsService();
      this.logging = new LoggingService();
    } catch (error) {
      console.error('Error initializing service registry:', error);
      // Initialize with minimal services to prevent crashes
      this.db = dbService;
      this.retryQueue = retryQueueService;
      this.supabase = new SupabaseServiceImpl();
      this.workout = new WorkoutService(this.supabase);
      this.mealPlan = new MealPlanService(this.supabase);
      this.user = userService;
      this.paystack = paystackService;
      this.openAI = openAIService;
      this.health = healthApi;
      this.healthSync = healthSyncService;
      this.analytics = new AnalyticsService();
      this.logging = new LoggingService();
    }
  }

  /**
   * Initialize all services
   */
  async initialize(): Promise<void> {
    // Initialize local storage services
    await this.db.initialize();
    this.retryQueue.initialize();

    // Register retry handlers
    this.registerRetryHandlers();

    // Initialize other services
    this.analytics.initialize();
    this.logging.initialize();
  }

  /**
   * Register handlers for retry operations
   */
  private registerRetryHandlers(): void {
    // Register workout service handlers
    this.retryQueue.registerHandler('save_workout',
      (payload) => this.workout.saveWorkout(payload));

    this.retryQueue.registerHandler('delete_workout',
      (payload) => this.workout.deleteWorkout(payload.id));

    this.retryQueue.registerHandler('update_workout',
      (payload) => this.workout.updateWorkout(payload));

    // Register meal plan service handlers
    this.retryQueue.registerHandler('save_meal_plan',
      (payload) => this.mealPlan.saveMealPlan(payload));

    // Register user service handlers
    this.retryQueue.registerHandler('update_user_profile',
      (payload) => this.user.updateProfile(payload));

    // Register health data sync handlers
    this.retryQueue.registerHandler('sync_health_data',
      (payload) => this.health.syncHealthData(payload));
  }
}

// Create singleton instance
export const serviceRegistry = new ServiceRegistryImpl();

/**
 * Hook to use the service registry
 */
export function useServices(): ServiceRegistry {
  return serviceRegistry;
}

/**
 * Initialize all services
 */
export async function initializeServices(): Promise<void> {
  try {
    await serviceRegistry.initialize();
  } catch (error) {
    console.error('Error initializing services:', error);
  }
}

export default serviceRegistry;
