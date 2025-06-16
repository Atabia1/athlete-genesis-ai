
/**
 * Accessibility Tests for DataSyncIndicator Component
 */

import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import DataSyncIndicator, { SyncStatus } from '../data-sync-indicator';

// Add jest-axe matchers
expect.extend(toHaveNoViolations);

describe('DataSyncIndicator Accessibility', () => {
  it('should have no accessibility violations in default variant', async () => {
    const { container } = render(
      <DataSyncIndicator 
        status={SyncStatus.SUCCESS} 
        lastSyncTime={new Date()} 
      />
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('should have no accessibility violations in badge variant', async () => {
    const { container } = render(
      <DataSyncIndicator 
        status={SyncStatus.SUCCESS} 
        lastSyncTime={new Date()} 
        variant="badge"
      />
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('should have no accessibility violations in compact variant', async () => {
    const { container } = render(
      <DataSyncIndicator 
        status={SyncStatus.SUCCESS} 
        lastSyncTime={new Date()} 
        variant="compact"
      />
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('should have no accessibility violations in icon-only variant', async () => {
    const { container } = render(
      <DataSyncIndicator 
        status={SyncStatus.SUCCESS} 
        lastSyncTime={new Date()} 
        variant="icon-only"
      />
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('should have no accessibility violations with sync button', async () => {
    const { container } = render(
      <DataSyncIndicator 
        status={SyncStatus.SUCCESS} 
        lastSyncTime={new Date()} 
        showSyncButton={true}
        onSyncClick={() => {}}
      />
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('should have proper ARIA attributes', () => {
    const ariaLabel = 'Data synchronization status';
    render(
      <DataSyncIndicator 
        status={SyncStatus.SUCCESS} 
        lastSyncTime={new Date()} 
        ariaLabel={ariaLabel}
      />
    );
    
    const element = screen.getByLabelText(ariaLabel);
    expect(element).toBeInTheDocument();
  });
  
  it('should have accessible text for each status', () => {
    const { rerender } = render(
      <DataSyncIndicator status={SyncStatus.IDLE} />
    );
    expect(screen.getByText('Not synced')).toBeInTheDocument();
    
    rerender(<DataSyncIndicator status={SyncStatus.SYNCING} />);
    expect(screen.getByText('Syncing...')).toBeInTheDocument();
    
    rerender(<DataSyncIndicator status={SyncStatus.SUCCESS} />);
    expect(screen.getByText('Synced')).toBeInTheDocument();
    
    rerender(<DataSyncIndicator status={SyncStatus.ERROR} />);
    expect(screen.getByText('Sync failed')).toBeInTheDocument();
    
    rerender(<DataSyncIndicator status={SyncStatus.OFFLINE} />);
    expect(screen.getByText('Offline')).toBeInTheDocument();
    
    rerender(<DataSyncIndicator status={SyncStatus.REALTIME} />);
    expect(screen.getByText('Real-time')).toBeInTheDocument();
  });
  
  it('should have accessible button when showSyncButton is true', () => {
    const onSyncClick = jest.fn();
    render(
      <DataSyncIndicator 
        status={SyncStatus.SUCCESS} 
        showSyncButton={true}
        onSyncClick={onSyncClick}
      />
    );
    
    const button = screen.getByLabelText('Sync now');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', 'Sync now');
  });
  
  it('should not show sync button when status is SYNCING', () => {
    render(
      <DataSyncIndicator 
        status={SyncStatus.SYNCING} 
        showSyncButton={true}
        onSyncClick={() => {}}
      />
    );
    
    const button = screen.queryByLabelText('Sync now');
    expect(button).not.toBeInTheDocument();
  });
  
  it('should have accessible time information', () => {
    const lastSyncTime = new Date();
    lastSyncTime.setMinutes(lastSyncTime.getMinutes() - 5); // 5 minutes ago
    
    render(
      <DataSyncIndicator 
        status={SyncStatus.SUCCESS} 
        lastSyncTime={lastSyncTime}
        showLastSync={true}
      />
    );
    
    const timeInfo = screen.getByText(/Last synced:/);
    expect(timeInfo).toBeInTheDocument();
    expect(timeInfo).toHaveTextContent('5m ago');
  });
});
