
import { Badge } from '@/components/ui/badge';
import { Download, CheckCircle } from 'lucide-react';

interface OfflineContentBadgeProps {
  isDownloaded?: boolean;
  isDownloading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const OfflineContentBadge: React.FC<OfflineContentBadgeProps> = ({
  isDownloaded = false,
  isDownloading = false,
  size = 'sm',
  className = '',
}) => {
  if (isDownloading) {
    return (
      <Badge variant="secondary" className={`flex items-center gap-1 ${className}`}>
        <Download className={`animate-pulse ${size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'}`} />
        Downloading...
      </Badge>
    );
  }

  if (isDownloaded) {
    return (
      <Badge variant="secondary" className={`flex items-center gap-1 ${className}`}>
        <CheckCircle className={`text-green-600 ${size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'}`} />
        Available Offline
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className={`flex items-center gap-1 ${className}`}>
      <Download className={`${size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'}`} />
      Download for Offline
    </Badge>
  );
};

export default OfflineContentBadge;
