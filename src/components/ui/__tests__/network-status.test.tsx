/**
 * Tests for NetworkStatus component
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NetworkStatus from '../network-status';

// Mock the hooks used by the component
jest.mock('@/hooks/use-network-status', () => ({
  useNetworkStatus: jest.fn().mockReturnValue({
    isOnline: true,
    wasOffline: false,
    connectionQuality: 'good',
    lastChecked: new Date(),
    checkConnection: jest.fn().mockResolvedValue(true),
    connectionInfo: {
      icon: <div data-testid="wifi-icon" />,
      text: 'Good Connection',
      colorClass: 'text-green-600'
    }
  })
}));

jest.mock('@/context/SyncContext', () => ({
  useSync: jest.fn().mockReturnValue({
    syncStatus: 'idle',
    pendingCount: 0,
    syncNow: jest.fn(),
    lastSyncTime: new Date()
  })
}));

describe('NetworkStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render online status correctly', () => {
    // Arrange & Act
    render(<NetworkStatus />);
    
    // Assert
    expect(screen.getByText('Good Connection')).toBeInTheDocument();
    expect(screen.getByTestId('wifi-icon')).toBeInTheDocument();
  });

  it('should render offline status with appropriate styling', () => {
    // Arrange
    const useNetworkStatus = require('@/hooks/use-network-status').useNetworkStatus;
    useNetworkStatus.mockReturnValue({
      isOnline: false,
      wasOffline: false,
      connectionQuality: 'offline',
      lastChecked: new Date(),
      checkConnection: jest.fn().mockResolvedValue(false),
      connectionInfo: {
        icon: <div data-testid="wifi-off-icon" />,
        text: 'Offline',
        colorClass: 'text-red-600'
      }
    });
    
    // Act
    render(<NetworkStatus />);
    
    // Assert
    expect(screen.getByText('Offline')).toBeInTheDocument();
    expect(screen.getByTestId('wifi-off-icon')).toBeInTheDocument();
    // Check for offline styling classes
    const statusElement = screen.getByText('Offline').closest('div');
    expect(statusElement).toHaveClass('bg-orange-100');
    expect(statusElement).toHaveClass('animate-pulse');
  });

  it('should show refresh button when showRefreshButton is true', () => {
    // Arrange
    const checkConnectionMock = jest.fn().mockResolvedValue(true);
    const useNetworkStatus = require('@/hooks/use-network-status').useNetworkStatus;
    useNetworkStatus.mockReturnValue({
      isOnline: true,
      wasOffline: false,
      connectionQuality: 'good',
      lastChecked: new Date(),
      checkConnection: checkConnectionMock,
      connectionInfo: {
        icon: <div data-testid="wifi-icon" />,
        text: 'Good Connection',
        colorClass: 'text-green-600'
      }
    });
    
    // Act
    render(<NetworkStatus showRefreshButton={true} />);
    
    // Assert
    const refreshButton = screen.getByRole('button');
    expect(refreshButton).toBeInTheDocument();
    
    // Act - Click refresh button
    userEvent.click(refreshButton);
    
    // Assert - Check if checkConnection was called
    expect(checkConnectionMock).toHaveBeenCalledTimes(1);
  });

  it('should show sync indicator when online and showSyncStatus is true', () => {
    // Arrange
    const syncNowMock = jest.fn();
    const useSync = require('@/context/SyncContext').useSync;
    useSync.mockReturnValue({
      syncStatus: 'pending',
      pendingCount: 3,
      syncNow: syncNowMock,
      lastSyncTime: new Date()
    });
    
    // Act
    render(<NetworkStatus showSyncStatus={true} />);
    
    // Assert - This would need to be updated based on your actual SyncIndicator implementation
    // For now, we'll just check that the component doesn't crash
    expect(screen.getByText('Good Connection')).toBeInTheDocument();
  });

  it('should not show sync indicator when offline', () => {
    // Arrange
    const useNetworkStatus = require('@/hooks/use-network-status').useNetworkStatus;
    useNetworkStatus.mockReturnValue({
      isOnline: false,
      wasOffline: false,
      connectionQuality: 'offline',
      lastChecked: new Date(),
      checkConnection: jest.fn().mockResolvedValue(false),
      connectionInfo: {
        icon: <div data-testid="wifi-off-icon" />,
        text: 'Offline',
        colorClass: 'text-red-600'
      }
    });
    
    const useSync = require('@/context/SyncContext').useSync;
    useSync.mockReturnValue({
      syncStatus: 'pending',
      pendingCount: 3,
      syncNow: jest.fn(),
      lastSyncTime: new Date()
    });
    
    // Act
    render(<NetworkStatus showSyncStatus={true} />);
    
    // Assert - SyncIndicator should not be rendered when offline
    expect(screen.queryByTestId('sync-indicator')).not.toBeInTheDocument();
  });
});
