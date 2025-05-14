/**
 * Health App Connect Component
 *
 * This component provides a UI for connecting to health apps on mobile devices.
 * It generates a QR code that can be scanned by the companion mobile app to
 * establish a connection between the web app and the health app.
 */

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { QRCode } from "@/components/ui/qr-code";
import { Smartphone, Activity, RefreshCw, Heart, HeartPulse } from 'lucide-react';
import { healthSyncService } from '@/services/health-sync-service';
import { useToast } from '@/hooks/use-toast';
import { HealthData } from '@/integrations/health-apps/types';

interface HealthAppConnectProps {
  /** Optional callback when health data is synced */
  onHealthDataSync?: (data: HealthData) => void;

  /** Optional className for styling */
  className?: string;
}

/**
 * Health App Connect Component
 *
 * This component provides a UI for connecting to health apps on mobile devices.
 */
const HealthAppConnect = ({ onHealthDataSync, className = '' }: HealthAppConnectProps) => {
  const { toast } = useToast();
  const [connectionUrl, setConnectionUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [healthData, setHealthData] = useState<HealthData | null>(null);

  // Generate connection QR code
  const generateQR = async () => {
    try {
      setIsGenerating(true);
      const url = await healthSyncService.generateConnectionQR();
      setConnectionUrl(url);

      toast({
        title: "QR Code Generated",
        description: "Scan this code with the Athlete Genesis mobile app to connect your health app.",
      });
    } catch (error) {
      toast({
        title: "Failed to generate connection code",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Check connection status and fetch health data
  const checkConnectionStatus = async () => {
    try {
      const data = await healthSyncService.getHealthData();

      if (data && data.lastSyncDate) {
        setIsConnected(true);
        setHealthData(data);

        // Call the callback if provided
        if (onHealthDataSync) {
          onHealthDataSync(data);
        }
      } else {
        setIsConnected(false);
      }
    } catch (error) {
      console.error('Failed to check connection status:', error);
    }
  };

  // Check connection status on mount and periodically
  useEffect(() => {
    // Initialize health sync service
    healthSyncService.initialize().catch(console.error);

    // Check connection status initially
    checkConnectionStatus();

    // Poll for connection status every 10 seconds
    const interval = setInterval(checkConnectionStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  // Format last sync date
  const formatLastSync = (date?: Date) => {
    if (!date) return 'Never';

    // If it's today, show time
    const today = new Date();
    const syncDate = new Date(date);

    if (today.toDateString() === syncDate.toDateString()) {
      return `Today at ${syncDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }

    // Otherwise show date
    return syncDate.toLocaleDateString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="mr-2 h-5 w-5" />
          Connect Health Apps
        </CardTitle>
        <CardDescription>
          Sync your health data from Apple Health, Samsung Health, or Google Fit
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isConnected ? (
          <div className="space-y-4">
            <Alert className="bg-green-50 border-green-200">
              <Heart className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-700">Connected!</AlertTitle>
              <AlertDescription className="text-green-600">
                Your health app is successfully connected. Your data will sync automatically.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-slate-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">Steps</div>
                <div className="text-xl font-semibold">{healthData?.steps?.toLocaleString() || 'N/A'}</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">Heart Rate</div>
                <div className="text-xl font-semibold flex items-center">
                  {healthData?.heartRate?.resting ? (
                    <>
                      {healthData.heartRate.resting}
                      <HeartPulse className="h-4 w-4 ml-1 text-red-500" />
                    </>
                  ) : 'N/A'}
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-500 mt-2">
              Last synced: {formatLastSync(healthData?.lastSyncDate)}
            </div>
          </div>
        ) : connectionUrl ? (
          <div className="flex flex-col items-center space-y-4">
            <QRCode value={connectionUrl} size={200} />
            <p className="text-sm text-gray-500 text-center">
              Scan this QR code with the Athlete Genesis mobile app to connect your health app.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <Smartphone className="h-16 w-16 text-gray-400" />
            <p className="text-sm text-gray-500 text-center">
              Connect your mobile health apps to automatically import your health data and workouts.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        {isConnected ? (
          <Button variant="outline" onClick={generateQR} className="flex items-center">
            <RefreshCw className="mr-2 h-4 w-4" />
            Reconnect
          </Button>
        ) : (
          <Button onClick={generateQR} disabled={isGenerating} className="flex items-center">
            {isGenerating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Smartphone className="mr-2 h-4 w-4" />
                Connect Health App
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default HealthAppConnect;
