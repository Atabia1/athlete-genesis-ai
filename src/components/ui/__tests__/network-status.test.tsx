
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import NetworkStatus from '@/components/ui/network-status';

// Mock the useNetworkStatus hook
vi.mock('@/hooks/use-network-status', () => ({
  useNetworkStatus: vi.fn(() => ({
    isOnline: true,
    wasOffline: false,
  }))
}));

// Mock the sync indicator component
vi.mock('@/components/ui/sync-indicator', () => ({
  default: () => <div data-testid="sync-indicator">Sync Indicator</div>
}));

describe('NetworkStatus', () => {
  const mockUseNetworkStatus = vi.mocked(
    () => import('@/hooks/use-network-status').then(m => m.useNetworkStatus)
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders online status correctly', () => {
    render(<NetworkStatus />);
    
    expect(screen.getByText('Online')).toBeInTheDocument();
    expect(screen.getByText('All systems operational.')).toBeInTheDocument();
  });

  it('renders offline status correctly', () => {
    vi.mocked(mockUseNetworkStatus).mockReturnValue({
      isOnline: false,
      wasOffline: true,
    });

    render(<NetworkStatus />);
    
    expect(screen.getByText('Offline')).toBeInTheDocument();
    expect(screen.getByText('Limited connectivity. Syncing may be delayed.')).toBeInTheDocument();
  });

  it('shows retry button when offline and showRetryButton is true', () => {
    vi.mocked(mockUseNetworkStatus).mockReturnValue({
      isOnline: false,
      wasOffline: true,
    });

    const container = render(<NetworkStatus showRetryButton={true} />);
    expect(container.getByText('Retry')).toBeInTheDocument();
  });

  it('hides retry button when showRetryButton is false', () => {
    vi.mocked(mockUseNetworkStatus).mockReturnValue({
      isOnline: false,
      wasOffline: true,
    });

    render(<NetworkStatus showRetryButton={false} />);
    expect(screen.queryByText('Retry')).not.toBeInTheDocument();
  });

  it('shows details when showDetails is true', () => {
    render(<NetworkStatus showDetails={true} />);
    expect(screen.getByText('All systems operational.')).toBeInTheDocument();
  });

  it('hides details when showDetails is false', () => {
    render(<NetworkStatus showDetails={false} />);
    expect(screen.queryByText('All systems operational.')).not.toBeInTheDocument();
  });

  it('includes sync indicator', () => {
    render(<NetworkStatus />);
    expect(screen.getByTestId('sync-indicator')).toBeInTheDocument();
  });
});
