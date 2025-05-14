/**
 * Health App QR Connect Component
 *
 * This component displays a QR code for connecting a mobile device
 * to the web application for health data synchronization.
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  QrCode,
  Smartphone,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  AppleIcon,
  Smartphone as AndroidIcon,
  Heart
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useToast } from "@/components/ui/use-toast";

/**
 * Health App QR Connect Component
 */
const HealthAppQRConnect = () => {
  const [connectionCode, setConnectionCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [activeTab, setActiveTab] = useState('ios');
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const supabase = useSupabaseClient();
  const user = useUser();
  const { toast } = useToast();

  // Generate a new connection code
  const generateConnectionCode = async () => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase.functions.invoke('health-sync', {
        body: { action: 'generate-code' },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.success) {
        setConnectionCode(data.code);
        setExpiresAt(new Date(data.expiresAt));
      } else {
        throw new Error(data.error || 'Failed to generate connection code');
      }
    } catch (error) {
      console.error('Error generating connection code:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate connection code. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Check if the user has connected devices
  const checkConnectedDevices = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('health-sync', {
        body: { action: 'devices' },
      });

      if (error) {
        throw new Error(error.message);
      }

      setIsConnected(data && data.length > 0);
    } catch (error) {
      console.error('Error checking connected devices:', error);
    }
  };

  // Generate a connection code on mount
  useEffect(() => {
    if (user) {
      generateConnectionCode();
      checkConnectedDevices();
    }
  }, [user]);

  // Update time left every second
  useEffect(() => {
    if (!expiresAt) return;

    const interval = setInterval(() => {
      const now = new Date();
      const diff = expiresAt.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft(0);
        clearInterval(interval);
      } else {
        setTimeLeft(Math.floor(diff / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  // Format time left
  const formatTimeLeft = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Get connection URL
  const getConnectionUrl = () => {
    if (!connectionCode) return '';
    return `athletegenesis://connect?code=${connectionCode}`;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Heart className="mr-2 h-5 w-5" />
          Connect Health App
        </CardTitle>
        <CardDescription>
          Sync your health data from Apple Health, Google Fit, or Samsung Health
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ios" className="flex items-center">
              <AppleIcon className="h-4 w-4 mr-2" />
              iOS
            </TabsTrigger>
            <TabsTrigger value="android" className="flex items-center">
              <AndroidIcon className="h-4 w-4 mr-2" />
              Android
            </TabsTrigger>
          </TabsList>

          {/* iOS Tab */}
          <TabsContent value="ios" className="space-y-4 mt-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Connect Apple Health</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Download the Athlete Genesis Health Bridge app from the App Store</li>
                <li>Open the app and tap "Connect to Athlete Genesis"</li>
                <li>Scan the QR code below with the app</li>
                <li>Grant permissions to access your health data</li>
              </ol>
            </div>

            {connectionCode ? (
              <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg">
                <QRCodeSVG
                  value={getConnectionUrl()}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
                <div className="mt-3 text-center">
                  <p className="text-sm text-gray-500">Scan with the Athlete Genesis Health Bridge app</p>
                  {timeLeft > 0 ? (
                    <div className="flex items-center justify-center mt-2">
                      <Clock className="h-4 w-4 mr-1 text-amber-500" />
                      <span className="text-sm font-medium">Expires in {formatTimeLeft()}</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center mt-2">
                      <AlertCircle className="h-4 w-4 mr-1 text-red-500" />
                      <span className="text-sm font-medium">Code expired</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg">
                <Skeleton className="h-[200px] w-[200px]" />
                <div className="mt-3 text-center">
                  <Skeleton className="h-4 w-40 mx-auto" />
                  <Skeleton className="h-4 w-32 mx-auto mt-2" />
                </div>
              </div>
            )}
          </TabsContent>

          {/* Android Tab */}
          <TabsContent value="android" className="space-y-4 mt-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Connect Google Fit or Samsung Health</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Download the Athlete Genesis Health Bridge app from the Google Play Store</li>
                <li>Open the app and tap "Connect to Athlete Genesis"</li>
                <li>Scan the QR code below with the app</li>
                <li>Grant permissions to access your health data</li>
              </ol>
            </div>

            {connectionCode ? (
              <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg">
                <QRCodeSVG
                  value={getConnectionUrl()}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
                <div className="mt-3 text-center">
                  <p className="text-sm text-gray-500">Scan with the Athlete Genesis Health Bridge app</p>
                  {timeLeft > 0 ? (
                    <div className="flex items-center justify-center mt-2">
                      <Clock className="h-4 w-4 mr-1 text-amber-500" />
                      <span className="text-sm font-medium">Expires in {formatTimeLeft()}</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center mt-2">
                      <AlertCircle className="h-4 w-4 mr-1 text-red-500" />
                      <span className="text-sm font-medium">Code expired</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg">
                <Skeleton className="h-[200px] w-[200px]" />
                <div className="mt-3 text-center">
                  <Skeleton className="h-4 w-40 mx-auto" />
                  <Skeleton className="h-4 w-32 mx-auto mt-2" />
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {isConnected && (
          <Alert className="mt-4">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Device Connected</AlertTitle>
            <AlertDescription>
              You already have a device connected to your account. You can connect additional devices if needed.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => window.open('https://athletegenesis.ai/health-app-help', '_blank')}
        >
          Need Help?
        </Button>
        <Button
          onClick={generateConnectionCode}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : timeLeft === 0 ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Generate New Code
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Code
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default HealthAppQRConnect;
