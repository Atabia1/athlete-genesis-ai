
export enum RetryStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  SUCCESS = 'success',
  FAILED = 'failed'
}

export enum RetryPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export type RetryOperationType = 'sync' | 'upload' | 'download' | 'api_call';

export interface RetryOperation {
  id: string;
  type: RetryOperationType;
  payload: any;
  status: RetryStatus;
  priority: RetryPriority;
  attempts: number;
  maxAttempts: number;
  createdAt: Date;
  lastAttemptAt?: Date;
}

class RetryQueueService {
  private operations: RetryOperation[] = [];
  private subscribers: ((operations: RetryOperation[]) => void)[] = [];
  private handlers: Map<RetryOperationType, (payload: any) => Promise<any>> = new Map();

  initialize() {
    // Initialize the service
  }

  registerHandler(type: RetryOperationType, handler: (payload: any) => Promise<any>): void {
    this.handlers.set(type, handler);
  }

  async addToQueue(
    type: RetryOperationType, 
    payload: any, 
    priority: RetryPriority = RetryPriority.MEDIUM,
    maxAttempts: number = 3
  ): Promise<string> {
    const operation: RetryOperation = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      payload,
      status: RetryStatus.PENDING,
      priority,
      attempts: 0,
      maxAttempts,
      createdAt: new Date()
    };

    this.operations.push(operation);
    this.notifySubscribers();
    return operation.id;
  }

  async processQueue(): Promise<void> {
    // Process pending operations
    const pendingOps = this.operations.filter(op => op.status === RetryStatus.PENDING);
    for (const op of pendingOps) {
      op.status = RetryStatus.IN_PROGRESS;
      this.notifySubscribers();
      
      try {
        const handler = this.handlers.get(op.type);
        if (handler) {
          await handler(op.payload);
        } else {
          // Simulate processing if no handler
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        op.status = RetryStatus.SUCCESS;
        op.attempts++;
      } catch (error) {
        op.status = RetryStatus.FAILED;
        op.attempts++;
      }
    }
    this.notifySubscribers();
  }

  async clearQueue(): Promise<void> {
    this.operations = [];
    this.notifySubscribers();
  }

  subscribeToQueueChanges(callback: (operations: RetryOperation[]) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  private notifySubscribers() {
    this.subscribers.forEach(callback => callback([...this.operations]));
  }
}

export const retryQueueService = new RetryQueueService();
