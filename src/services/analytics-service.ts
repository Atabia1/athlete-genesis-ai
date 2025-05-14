/**
 * Analytics Service
 * 
 * This service provides methods for tracking user events and analytics.
 * It can be configured to use different analytics providers.
 */

/**
 * Event types for analytics
 */
export enum AnalyticsEventType {
  PAGE_VIEW = 'page_view',
  BUTTON_CLICK = 'button_click',
  FORM_SUBMIT = 'form_submit',
  WORKOUT_CREATED = 'workout_created',
  WORKOUT_COMPLETED = 'workout_completed',
  MEAL_PLAN_CREATED = 'meal_plan_created',
  USER_SIGNUP = 'user_signup',
  USER_LOGIN = 'user_login',
  USER_LOGOUT = 'user_logout',
  ERROR = 'error',
}

/**
 * Analytics event interface
 */
export interface AnalyticsEvent {
  type: AnalyticsEventType;
  timestamp: string;
  userId?: string;
  properties?: Record<string, any>;
}

/**
 * Analytics service class
 */
export class AnalyticsService {
  private initialized: boolean = false;
  private userId: string | null = null;
  private eventQueue: AnalyticsEvent[] = [];
  private readonly MAX_QUEUE_SIZE = 100;
  
  /**
   * Initialize the analytics service
   */
  initialize(): void {
    if (this.initialized) {
      return;
    }
    
    // Initialize analytics provider
    this.setupAnalyticsProvider();
    
    // Process any queued events
    this.processEventQueue();
    
    this.initialized = true;
    console.log('Analytics service initialized');
  }
  
  /**
   * Set up the analytics provider
   */
  private setupAnalyticsProvider(): void {
    // This would be replaced with actual analytics provider setup
    // For example, Google Analytics, Mixpanel, etc.
    console.log('Setting up analytics provider');
  }
  
  /**
   * Set the user ID for analytics
   */
  setUserId(userId: string): void {
    this.userId = userId;
    
    // Update user ID in analytics provider
    console.log(`Set analytics user ID: ${userId}`);
  }
  
  /**
   * Clear the user ID (e.g., on logout)
   */
  clearUserId(): void {
    this.userId = null;
    
    // Clear user ID in analytics provider
    console.log('Cleared analytics user ID');
  }
  
  /**
   * Track an event
   */
  trackEvent(type: AnalyticsEventType, properties?: Record<string, any>): void {
    const event: AnalyticsEvent = {
      type,
      timestamp: new Date().toISOString(),
      userId: this.userId || undefined,
      properties,
    };
    
    if (!this.initialized) {
      // Queue the event for later processing
      this.queueEvent(event);
      return;
    }
    
    // Send the event to the analytics provider
    this.sendEvent(event);
  }
  
  /**
   * Queue an event for later processing
   */
  private queueEvent(event: AnalyticsEvent): void {
    // Limit queue size to prevent memory issues
    if (this.eventQueue.length >= this.MAX_QUEUE_SIZE) {
      this.eventQueue.shift(); // Remove oldest event
    }
    
    this.eventQueue.push(event);
  }
  
  /**
   * Process the event queue
   */
  private processEventQueue(): void {
    if (this.eventQueue.length === 0) {
      return;
    }
    
    console.log(`Processing ${this.eventQueue.length} queued analytics events`);
    
    // Process all queued events
    for (const event of this.eventQueue) {
      this.sendEvent(event);
    }
    
    // Clear the queue
    this.eventQueue = [];
  }
  
  /**
   * Send an event to the analytics provider
   */
  private sendEvent(event: AnalyticsEvent): void {
    // This would be replaced with actual analytics provider implementation
    console.log('Sending analytics event:', event);
  }
  
  /**
   * Track a page view
   */
  trackPageView(pageName: string, path: string): void {
    this.trackEvent(AnalyticsEventType.PAGE_VIEW, {
      pageName,
      path,
    });
  }
  
  /**
   * Track a button click
   */
  trackButtonClick(buttonName: string, componentName?: string): void {
    this.trackEvent(AnalyticsEventType.BUTTON_CLICK, {
      buttonName,
      componentName,
    });
  }
  
  /**
   * Track a form submission
   */
  trackFormSubmit(formName: string, formData?: Record<string, any>): void {
    this.trackEvent(AnalyticsEventType.FORM_SUBMIT, {
      formName,
      formData,
    });
  }
  
  /**
   * Track a workout creation
   */
  trackWorkoutCreated(workoutId: string, workoutName: string): void {
    this.trackEvent(AnalyticsEventType.WORKOUT_CREATED, {
      workoutId,
      workoutName,
    });
  }
  
  /**
   * Track a workout completion
   */
  trackWorkoutCompleted(workoutId: string, workoutName: string, duration: number): void {
    this.trackEvent(AnalyticsEventType.WORKOUT_COMPLETED, {
      workoutId,
      workoutName,
      duration,
    });
  }
  
  /**
   * Track an error
   */
  trackError(errorMessage: string, errorCode?: string, componentName?: string): void {
    this.trackEvent(AnalyticsEventType.ERROR, {
      errorMessage,
      errorCode,
      componentName,
    });
  }
}
