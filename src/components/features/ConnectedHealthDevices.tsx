/**
 * Connected Health Devices Component
 * 
 * This component displays a list of connected health devices and allows
 * the user to manage them.
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  Smartphone, 
  Trash2, 
  RefreshCw, 
  AppleIcon,
  Smartphone as AndroidIcon,
  Heart,
  Info,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useToast } from "@/components/ui/use-toast";

interface ConnectedDevice {
  id: string;
  device_id: string;
  device_info: {
    name: string;
    model: string;
    os: string;
    osVersion: string;
  };
  connected_at: string;
  last_sync: string;
}

/**
 * Connected Health Devices Component
 */
const ConnectedHealthDevices = () => {
  const [devices, setDevices] = useState<ConnectedDevice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState<ConnectedDevice | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const supabase = useSupabaseClient();
  const { toast } = useToast();
  
  // Fetch connected devices
  const fetchConnectedDevices = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.functions.invoke('health-sync', {
        body: { action: 'devices' },
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      setDevices(data || []);
    } catch (error) {
      console.error('Error fetching connected devices:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch connected devices. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Disconnect a device
  const disconnectDevice = async (deviceId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('health-sync', {
        body: { action: 'disconnect', deviceId },
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data.success) {
        // Remove the device from the list
        setDevices(devices.filter(device => device.device_id !== deviceId));
        
        toast({
          title: 'Device Disconnected',
          description: 'The device has been disconnected successfully.',
        });
      } else {
        throw new Error(data.error || 'Failed to disconnect device');
      }
    } catch (error) {
      console.error('Error disconnecting device:', error);
      toast({
        title: 'Error',
        description: 'Failed to disconnect device. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setShowDeleteDialog(false);
      setSelectedDevice(null);
    }
  };
  
  // Fetch connected devices on mount
  useEffect(() => {
    fetchConnectedDevices();
  }, []);
  
  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    
    return new Date(dateString).toLocaleDateString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  // Get device icon based on OS
  const getDeviceIcon = (device: ConnectedDevice) => {
    const os = device.device_info?.os?.toLowerCase() || '';
    
    if (os.includes('ios')) {
      return <AppleIcon className="h-5 w-5" />;
    } else if (os.includes('android')) {
      return <AndroidIcon className="h-5 w-5" />;
    } else {
      return <Smartphone className="h-5 w-5" />;
    }
  };
  
  // Get health app name based on device info
  const getHealthAppName = (device: ConnectedDevice) => {
    const os = device.device_info?.os?.toLowerCase() || '';
    
    if (os.includes('ios')) {
      return 'Apple Health';
    } else if (os.includes('android')) {
      // Check if Samsung Health is available
      if (device.device_info?.model?.toLowerCase().includes('samsung')) {
        return 'Samsung Health';
      } else {
        return 'Google Fit';
      }
    } else {
      return 'Health App';
    }
  };
  
  // Check if a device is recently synced (within the last hour)
  const isRecentlySynced = (lastSync?: string) => {
    if (!lastSync) return false;
    
    const lastSyncDate = new Date(lastSync);
    const now = new Date();
    const diffMs = now.getTime() - lastSyncDate.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    return diffHours < 1;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Heart className="mr-2 h-5 w-5" />
          Connected Health Devices
        </CardTitle>
        <CardDescription>
          Manage your connected health devices
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          // Loading state
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center p-4 bg-slate-50 rounded-lg">
                <Skeleton className="h-10 w-10 rounded-full mr-4" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-40 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-9 w-9 rounded-md" />
              </div>
            ))}
          </div>
        ) : devices.length === 0 ? (
          // No devices
          <div className="text-center py-8">
            <Smartphone className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <h3 className="text-lg font-medium mb-1">No Devices Connected</h3>
            <p className="text-sm text-gray-500 mb-4">
              Connect a health app to sync your health data
            </p>
            <Button onClick={() => window.location.href = '/settings/health-apps/connect'}>
              Connect Health App
            </Button>
          </div>
        ) : (
          // Device list
          <div className="space-y-4">
            {devices.map((device) => (
              <div key={device.device_id} className="flex items-center p-4 bg-slate-50 rounded-lg">
                <div className="bg-primary/10 p-2 rounded-full mr-4">
                  {getDeviceIcon(device)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="font-medium">
                      {device.device_info?.name || 'Unknown Device'}
                    </h3>
                    {device.last_sync && (
                      <Badge 
                        variant={isRecentlySynced(device.last_sync) ? 'default' : 'outline'}
                        className="ml-2"
                      >
                        {isRecentlySynced(device.last_sync) ? (
                          <span className="flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Synced
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <Info className="h-3 w-3 mr-1" />
                            Needs Sync
                          </span>
                        )}
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {getHealthAppName(device)} • {device.device_info?.model || 'Unknown Model'}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Connected: {formatDate(device.connected_at)}
                    {device.last_sync && ` • Last Sync: ${formatDate(device.last_sync)}`}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedDevice(device);
                    setShowDeleteDialog(true);
                  }}
                >
                  <Trash2 className="h-5 w-5 text-red-500" />
                </Button>
              </div>
            ))}
            
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={fetchConnectedDevices}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={() => window.location.href = '/settings/health-apps/connect'}>
                Connect New Device
              </Button>
            </div>
          </div>
        )}
        
        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Disconnect Device</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to disconnect this device? This will stop syncing health data from this device.
                {selectedDevice && (
                  <div className="mt-2 p-3 bg-slate-100 rounded-md">
                    <div className="font-medium">
                      {selectedDevice.device_info?.name || 'Unknown Device'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {getHealthAppName(selectedDevice)} • {selectedDevice.device_info?.model || 'Unknown Model'}
                    </div>
                  </div>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500 hover:bg-red-600"
                onClick={() => selectedDevice && disconnectDevice(selectedDevice.device_id)}
              >
                Disconnect
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default ConnectedHealthDevices;
