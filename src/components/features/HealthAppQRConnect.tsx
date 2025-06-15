import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import QRCode from 'qrcode.react';
import { 
  CheckCircle, 
  Clock, 
  RefreshCw, 
  AlertTriangle,
  Download,
  Wifi,
  WifiOff
} from "lucide-react";

const HealthAppQRConnect = () => {
  const [qrCode, setQrCode] = useState('https://example.com/health-app-connect');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionError, setConnectionError] = useState('');

  const handleConnect = async () => {
    setIsLoading(true);
    setConnectionError('');
    
    // Simulate connection attempt
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate success or failure
    const success = Math.random() > 0.3;
    if (success) {
      setIsConnected(true);
    } else {
      setConnectionError('Failed to connect. Please try again.');
    }
    setIsLoading(false);
  };

  const handleRetry = () => {
    setIsConnected(false);
    setConnectionError('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect to Health App</CardTitle>
        <CardDescription>
          Sync your workout data seamlessly with your preferred health app.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-4 py-8">
        {isConnected ? (
          <div className="flex flex-col items-center space-y-2">
            <CheckCircle className="h-10 w-10 text-green-500" />
            <h4 className="text-lg font-semibold">Connected!</h4>
            <p className="text-sm text-muted-foreground">
              Your data is now being synced.
            </p>
            <Button variant="outline" onClick={handleRetry}>Disconnect</Button>
          </div>
        ) : (
          <>
            {connectionError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{connectionError}</AlertDescription>
              </Alert>
            )}
            <QRCode value={qrCode} size={256} level="H" />
            <p className="text-sm text-muted-foreground">
              Scan this QR code with your health app to connect.
            </p>
            <Button onClick={handleConnect} disabled={isLoading}>
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Connect"
              )}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default HealthAppQRConnect;
