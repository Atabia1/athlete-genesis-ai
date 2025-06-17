
import { Badge } from '@/components/ui/badge';
import { WifiOff } from 'lucide-react';

interface OfflineContentBadgeProps {
  contentType?: string;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  className?: string;
}

const OfflineContentBadge: React.FC<OfflineContentBadgeProps> = ({
  contentType = 'content',
  position = 'top-right',
  className = '',
}) => {
  const positionClasses = {
    'top-right': 'absolute top-2 right-2',
    'top-left': 'absolute top-2 left-2',
    'bottom-right': 'absolute bottom-2 right-2',
    'bottom-left': 'absolute bottom-2 left-2',
  };

  return (
    <Badge 
      variant="secondary" 
      className={`${positionClasses[position]} flex items-center gap-1 text-xs ${className}`}
    >
      <WifiOff className="h-3 w-3" />
      Offline {contentType}
    </Badge>
  );
};

export default OfflineContentBadge;
