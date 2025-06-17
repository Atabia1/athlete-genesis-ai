
import { cn } from '@/shared/utils/cn';
import { Alert, AlertDescription } from './alert';
import { Lock } from 'lucide-react';

interface DisabledFeatureProps {
  children?: React.ReactNode;
  message?: string;
  variant?: 'default' | 'destructive';
  className?: string;
}

export function DisabledFeature({
  children,
  message = 'This feature is not available in your current plan.',
  variant = 'default',
  className,
}: DisabledFeatureProps) {
  return (
    <div className={cn('relative', className)}>
      {children && (
        <div className="opacity-50 pointer-events-none">
          {children}
        </div>
      )}
      <Alert variant={variant} className="mt-2">
        <Lock className="h-4 w-4" />
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </div>
  );
}
