/**
 * Logging Service
 * 
 * Provides centralized logging functionality
 */

interface LogEntry {
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  data?: any;
  timestamp: Date;
}

class LoggingService {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  async initialize(): Promise<void> {
    console.log('Logging service initialized');
  }

  async shutdown(): Promise<void> {
    this.logs = [];
  }

  info(message: string, data?: any): void {
    this.addLog('info', message, data);
  }

  warn(message: string, data?: any): void {
    this.addLog('warn', message, data);
  }

  error(message: string, data?: any): void {
    this.addLog('error', message, data);
  }

  debug(message: string, data?: any): void {
    this.addLog('debug', message, data);
  }

  private addLog(level: LogEntry['level'], message: string, data?: any): void {
    const entry: LogEntry = {
      level,
      message,
      data,
      timestamp: new Date()
    };

    this.logs.push(entry);
    
    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Also log to console
    console[level](message, data);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }
}

export const loggingService = new LoggingService();
