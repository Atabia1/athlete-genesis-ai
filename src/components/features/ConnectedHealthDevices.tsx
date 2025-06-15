
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Smartphone, 
  Watch, 
  Activity, 
  Wifi, 
  WifiOff, 
  CheckCircle, 
  AlertCircle,
  Zap
} from "lucide-react";

interface HealthDevice {
  id: string;
  name: string;
  type: 'watch' | 'scale' | 'other';
  status: 'connected' | 'disconnected';
  batteryLevel?: number;
  lastSync?: string;
}

const ConnectedHealthDevices = () => {
  const [devices] = useState<HealthDevice[]>([
    {
      id: '1',
      name: 'Apple Watch',
      type: 'watch',
      status: 'connected',
      batteryLevel: 85,
      lastSync: 'Just now'
    },
    {
      id: '2',
      name: 'Smart Scale',
      type: 'scale',
      status: 'connected',
      batteryLevel: 60,
      lastSync: '5 minutes ago'
    },
    {
      id: '3',
      name: 'Generic Tracker',
      type: 'other',
      status: 'disconnected',
      lastSync: '2 days ago'
    }
  ]);

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {isOnline ? (
                <Wifi className="h-5 w-5 text-green-500" />
              ) : (
                <WifiOff className="h-5 w-5 text-red-500" />
              )}
              Connected Devices
            </CardTitle>
            <CardDescription>
              Manage your connected health devices
            </CardDescription>
          </div>
          <Button variant="outline" disabled={!isOnline}>
            Connect New
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {devices.length === 0 ? (
          <div className="text-center py-4">
            <AlertCircle className="h-6 w-6 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">No devices connected</p>
          </div>
        ) : (
          <div className="space-y-3">
            {devices.map((device) => (
              <div key={device.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {device.type === 'watch' && <Watch className="h-5 w-5 text-blue-500" />}
                  {device.type === 'scale' && <Activity className="h-5 w-5 text-green-500" />}
                  {device.type === 'other' && <Smartphone className="h-5 w-5 text-gray-500" />}
                  <div>
                    <p className="font-medium">{device.name}</p>
                    <div className="text-sm text-muted-foreground">
                      {device.status === 'connected' ? (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          Connected
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <AlertCircle className="h-3 w-3 text-red-500" />
                          Disconnected
                        </div>
                      )}
                      {device.lastSync && ` - Last Sync: ${device.lastSync}`}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {device.status === 'connected' && device.batteryLevel !== undefined && (
                    <div className="flex items-center space-x-1">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <span>{device.batteryLevel}%</span>
                    </div>
                  )}
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConnectedHealthDevices;
