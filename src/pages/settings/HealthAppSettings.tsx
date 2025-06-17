/**
 * Health App Settings Page
 *
 * This page allows users to manage their health app connections.
 * They can connect new health apps, view connected devices, and disconnect devices.
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, RefreshCw, Heart, Info } from 'lucide-react';
import HealthAppQRConnect from '@/components/features/HealthAppQRConnect';
import ConnectedHealthDevices from '@/components/features/ConnectedHealthDevices';
import { healthSyncService } from '@/services/health-sync-service';
import { ApiService } from '@/services/api';
import { HealthData } from '@/integrations/health-apps/types';
import { useAuth } from '@/hooks/use-auth';

/**
 * Health App Settings Page
 */
const HealthAppSettings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [syncStatus, setSyncStatus] = useState<{
    lastSync: string | null;
    syncInProgress: boolean;
    connectedDevices: number;
  }>({
    lastSync: null,
    syncInProgress: false,
    connectedDevices: 0,
  });

  // Create API service instance
  const apiService = new ApiService();

  // Fetch health data and connected devices
  const fetchData = async () => {
    try {
      // Fetch health data
      const data = await healthSyncService.getHealthData();
      setHealthData(data);

      // Fetch connected devices count and sync status
      if (user) {
        try {
          const devices = await apiService.getConnectedDevices();
          setSyncStatus(prev => ({
            ...prev,
            connectedDevices: devices.length
          }));
        } catch (error) {
          console.error('Failed to fetch connected devices:', error);
        }
      }
    } catch (error) {
      console.error('Failed to fetch health data:', error);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, [user]);

  // Format date for display
  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return 'Never';

    const date = new Date(dateStr);
    return date.toLocaleDateString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Health App Settings</h1>
          <p className="text-gray-500 mt-1">
            Manage your connected health apps and sync settings
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="devices">Connected Devices</TabsTrigger>
            <TabsTrigger value="connect">Connect New Device</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="mr-2 h-5 w-5" />
                  Health Data Sync Status
                </CardTitle>
                <CardDescription>
                  Overview of your health data synchronization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">Last Sync</div>
                    <div className="font-semibold">
                      {formatDate(syncStatus.lastSync)}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">Connected Devices</div>
                    <div className="font-semibold">
                      {syncStatus.connectedDevices}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500">Sync Status</div>
                    <div className="font-semibold flex items-center">
                      {syncStatus.syncInProgress ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-1 animate-spin text-blue-500" />
                          Syncing...
                        </>
                      ) : (
                        'Idle'
                      )}
                    </div>
                  </div>
                </div>

                {healthData ? (
                  <Alert className="bg-green-50 border-green-200">
                    <Heart className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-700">Health Data Available</AlertTitle>
                    <AlertDescription className="text-green-600">
                      Your health data is being synced from your connected devices.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>No Health Data</AlertTitle>
                    <AlertDescription>
                      Connect a health app to start syncing your health data.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Connected Devices Tab */}
          <TabsContent value="devices" className="space-y-6 mt-6">
            <ConnectedHealthDevices />
          </TabsContent>

          {/* Connect New Device Tab */}
          <TabsContent value="connect" className="space-y-6 mt-6">
            <HealthAppQRConnect />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HealthAppSettings;
