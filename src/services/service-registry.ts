
/**
 * Service Registry
 *
 * This module provides a centralized registry for all services in the application.
 * It manages service initialization, dependency injection, and lifecycle management.
 */

import { indexedDBService } from './indexeddb-service';
import { healthSyncService } from './health-sync-service';
import { retryQueueService } from './retry-queue-service';
import { websocketService } from './websocket-service';
import { analyticsService } from './analytics-service';
import { loggingService } from './logging-service';

/**
 * Interface for service configuration
 */
interface ServiceConfig {
  name: string;
  instance: any;
  dependencies?: string[];
  initialized: boolean;
}

/**
 * Service Registry class
 */
class ServiceRegistry {
  private services: Map<string, ServiceConfig> = new Map();
  private initializationOrder: string[] = [];

  /**
   * Register a service with the registry
   */
  register(name: string, instance: any, dependencies: string[] = []) {
    this.services.set(name, {
      name,
      instance,
      dependencies,
      initialized: false,
    });
  }

  /**
   * Get a service by name
   */
  get<T>(name: string): T {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service '${name}' not found in registry`);
    }
    return service.instance;
  }

  /**
   * Initialize all services in dependency order
   */
  async initializeAll() {
    console.log('Initializing services...');
    
    // Determine initialization order based on dependencies
    this.calculateInitializationOrder();

    // Initialize services in order
    for (const serviceName of this.initializationOrder) {
      await this.initializeService(serviceName);
    }

    console.log('All services initialized successfully');
  }

  /**
   * Initialize a specific service
   */
  private async initializeService(name: string) {
    const service = this.services.get(name);
    if (!service || service.initialized) {
      return;
    }

    console.log(`Initializing service: ${name}`);

    try {
      // Initialize dependencies first
      for (const dep of service.dependencies) {
        await this.initializeService(dep);
      }

      // Initialize the service itself
      if (service.instance.initialize) {
        // Pass dependencies to the service if needed
        const dependencies = service.dependencies.map(dep => this.get(dep));
        await service.instance.initialize(...dependencies);
      }

      service.initialized = true;
      console.log(`Service '${name}' initialized successfully`);
    } catch (error) {
      console.error(`Failed to initialize service '${name}':`, error);
      throw error;
    }
  }

  /**
   * Calculate the order in which services should be initialized
   */
  private calculateInitializationOrder() {
    const visited = new Set<string>();
    const visiting = new Set<string>();
    this.initializationOrder = [];

    const visit = (serviceName: string) => {
      if (visited.has(serviceName)) return;
      if (visiting.has(serviceName)) {
        throw new Error(`Circular dependency detected involving service '${serviceName}'`);
      }

      visiting.add(serviceName);
      const service = this.services.get(serviceName);
      if (service) {
        for (const dep of service.dependencies) {
          visit(dep);
        }
      }
      visiting.delete(serviceName);
      visited.add(serviceName);
      this.initializationOrder.push(serviceName);
    };

    for (const [serviceName] of this.services) {
      visit(serviceName);
    }
  }

  /**
   * Shutdown all services
   */
  async shutdownAll() {
    console.log('Shutting down services...');
    
    // Shutdown in reverse order
    for (const serviceName of this.initializationOrder.reverse()) {
      const service = this.services.get(serviceName);
      if (service?.instance.shutdown) {
        try {
          await service.instance.shutdown();
          console.log(`Service '${serviceName}' shut down successfully`);
        } catch (error) {
          console.error(`Failed to shutdown service '${serviceName}':`, error);
        }
      }
    }
  }
}

// Create the global service registry
const serviceRegistry = new ServiceRegistry();

// Register all services
serviceRegistry.register('indexedDB', indexedDBService);
serviceRegistry.register('healthSync', healthSyncService, ['indexedDB']);
serviceRegistry.register('retryQueue', retryQueueService, ['indexedDB']);
serviceRegistry.register('websocket', websocketService);
serviceRegistry.register('analytics', analyticsService);
serviceRegistry.register('logging', loggingService);

// Export the registry and individual services for convenience
export { serviceRegistry };
export { indexedDBService as dbService };
export { healthSyncService };
export { retryQueueService };
export { websocketService };
export { analyticsService };
export { loggingService };

/**
 * Initialize all services on application start
 */
export async function initializeServices() {
  try {
    await serviceRegistry.initializeAll();
  } catch (error) {
    console.error('Failed to initialize services:', error);
    throw error;
  }
}

/**
 * Shutdown all services on application exit
 */
export async function shutdownServices() {
  try {
    await serviceRegistry.shutdownAll();
  } catch (error) {
    console.error('Failed to shutdown services:', error);
  }
}
