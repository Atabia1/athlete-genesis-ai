/**
 * Logging Service
 * 
 * This service provides methods for logging messages, warnings, and errors.
 * It can be configured to send logs to different destinations (console, file, remote service).
 */

/**
 * Log levels
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
}

/**
 * Log entry interface
 */
export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  userId?: string;
  sessionId?: string;
}

/**
 * Logging service class
 */
export class LoggingService {
  private initialized: boolean = false;
  private userId: string | null = null;
  private sessionId: string | null = null;
  private logQueue: LogEntry[] = [];
  private readonly MAX_QUEUE_SIZE = 100;
  private minLevel: LogLevel = LogLevel.INFO; // Default minimum log level
  
  /**
   * Initialize the logging service
   */
  initialize(): void {
    if (this.initialized) {
      return;
    }
    
    // Set minimum log level based on environment
    this.setMinLevelFromEnvironment();
    
    // Generate a session ID
    this.sessionId = this.generateSessionId();
    
    // Process any queued logs
    this.processLogQueue();
    
    this.initialized = true;
    this.info('Logging service initialized', { sessionId: this.sessionId });
  }
  
  /**
   * Set the minimum log level based on environment
   */
  private setMinLevelFromEnvironment(): void {
    const env = import.meta.env.MODE || 'development';
    
    switch (env) {
      case 'production':
        this.minLevel = LogLevel.INFO;
        break;
      case 'test':
        this.minLevel = LogLevel.WARN;
        break;
      default:
        this.minLevel = LogLevel.DEBUG;
        break;
    }
  }
  
  /**
   * Generate a unique session ID
   */
  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
  
  /**
   * Set the user ID for logging
   */
  setUserId(userId: string): void {
    this.userId = userId;
    this.info('User ID set for logging', { userId });
  }
  
  /**
   * Clear the user ID (e.g., on logout)
   */
  clearUserId(): void {
    this.userId = null;
    this.info('User ID cleared for logging');
  }
  
  /**
   * Log a message at the specified level
   */
  log(level: LogLevel, message: string, context?: Record<string, any>): void {
    // Skip logs below the minimum level
    if (this.shouldSkipLog(level)) {
      return;
    }
    
    const logEntry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      userId: this.userId || undefined,
      sessionId: this.sessionId || undefined,
    };
    
    if (!this.initialized) {
      // Queue the log for later processing
      this.queueLog(logEntry);
      return;
    }
    
    // Send the log to the appropriate destination
    this.sendLog(logEntry);
  }
  
  /**
   * Check if a log should be skipped based on level
   */
  private shouldSkipLog(level: LogLevel): boolean {
    const levelOrder = {
      [LogLevel.DEBUG]: 0,
      [LogLevel.INFO]: 1,
      [LogLevel.WARN]: 2,
      [LogLevel.ERROR]: 3,
      [LogLevel.FATAL]: 4,
    };
    
    return levelOrder[level] < levelOrder[this.minLevel];
  }
  
  /**
   * Queue a log for later processing
   */
  private queueLog(logEntry: LogEntry): void {
    // Limit queue size to prevent memory issues
    if (this.logQueue.length >= this.MAX_QUEUE_SIZE) {
      this.logQueue.shift(); // Remove oldest log
    }
    
    this.logQueue.push(logEntry);
  }
  
  /**
   * Process the log queue
   */
  private processLogQueue(): void {
    if (this.logQueue.length === 0) {
      return;
    }
    
    console.log(`Processing ${this.logQueue.length} queued logs`);
    
    // Process all queued logs
    for (const logEntry of this.logQueue) {
      this.sendLog(logEntry);
    }
    
    // Clear the queue
    this.logQueue = [];
  }
  
  /**
   * Send a log to the appropriate destination
   */
  private sendLog(logEntry: LogEntry): void {
    // In a real implementation, this would send logs to different destinations
    // based on configuration (console, file, remote service, etc.)
    
    // For now, just log to console
    const { level, message, timestamp, context } = logEntry;
    
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(`[${timestamp}] DEBUG: ${message}`, context);
        break;
      case LogLevel.INFO:
        console.info(`[${timestamp}] INFO: ${message}`, context);
        break;
      case LogLevel.WARN:
        console.warn(`[${timestamp}] WARN: ${message}`, context);
        break;
      case LogLevel.ERROR:
        console.error(`[${timestamp}] ERROR: ${message}`, context);
        break;
      case LogLevel.FATAL:
        console.error(`[${timestamp}] FATAL: ${message}`, context);
        break;
    }
  }
  
  /**
   * Log a debug message
   */
  debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context);
  }
  
  /**
   * Log an info message
   */
  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context);
  }
  
  /**
   * Log a warning message
   */
  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context);
  }
  
  /**
   * Log an error message
   */
  error(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, context);
  }
  
  /**
   * Log a fatal error message
   */
  fatal(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.FATAL, message, context);
  }
}
