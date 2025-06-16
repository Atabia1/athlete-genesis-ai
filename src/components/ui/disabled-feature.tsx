
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Crown, Star } from 'lucide-react';

interface DisabledFeatureProps {
  title: string;
  description: string;
  requiredPlan?: 'elite' | 'premium';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  onUpgrade?: () => void;
}

const DisabledFeature: React.FC<DisabledFeatureProps> = ({
  title,
  description,
  requiredPlan = 'elite',
  className = '',
  size = 'md',
  onUpgrade,
}) => {
  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const getBadgeVariant = () => {
    if (requiredPlan === 'elite') return 'default';
    return 'secondary';
  };

  const getIcon = () => {
    if (requiredPlan === 'elite') return <Crown className="h-4 w-4" />;
    if (requiredPlan === 'premium') return <Star className="h-4 w-4" />;
    return <Lock className="h-4 w-4" />;
  };

  return (
    <Card className={`relative overflow-hidden opacity-60 ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-gray-100/50 to-gray-200/50 z-10" />
      <CardHeader className={`relative z-20 ${sizeClasses[size]}`}>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-gray-700">
            {getIcon()}
            <span className="ml-2">{title}</span>
          </CardTitle>
          <Badge variant={getBadgeVariant()}>
            {requiredPlan === 'elite' ? 'Elite Only' : 'Premium Feature'}
          </Badge>
        </div>
        <CardDescription className="text-gray-600">{description}</CardDescription>
      </CardHeader>
      
      {onUpgrade && (
        <CardContent className={`relative z-20 ${sizeClasses[size]} pt-0`}>
          <Button 
            onClick={onUpgrade}
            className="w-full"
            variant="outline"
          >
            Upgrade to {requiredPlan === 'elite' ? 'Elite' : 'Premium'}
          </Button>
        </CardContent>
      )}
    </Card>
  );
};

export default DisabledFeature;
