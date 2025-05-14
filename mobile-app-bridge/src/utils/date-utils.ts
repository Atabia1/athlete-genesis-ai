/**
 * Date Utility Functions
 * 
 * This file contains utility functions for formatting dates and times.
 */

/**
 * Format a date as a string (e.g., "Jan 1, 2023")
 * @param date The date to format
 * @returns The formatted date string
 */
export const formatDate = (date?: Date | string | null): string => {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format a time as a string (e.g., "12:34 PM")
 * @param date The date to format
 * @returns The formatted time string
 */
export const formatTime = (date?: Date | string | null): string => {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format a date and time as a string (e.g., "Jan 1, 2023, 12:34 PM")
 * @param date The date to format
 * @returns The formatted date and time string
 */
export const formatDateTime = (date?: Date | string | null): string => {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format a duration in minutes to a string (e.g., "1h 30m")
 * @param minutes The duration in minutes
 * @returns The formatted duration string
 */
export const formatDuration = (minutes?: number): string => {
  if (!minutes) return 'N/A';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}m`;
  }
  
  return `${hours}h ${mins}m`;
};

/**
 * Format a duration in seconds to a string (e.g., "1h 30m 45s")
 * @param seconds The duration in seconds
 * @returns The formatted duration string
 */
export const formatDurationFromSeconds = (seconds?: number): string => {
  if (!seconds) return 'N/A';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours === 0 && minutes === 0) {
    return `${secs}s`;
  }
  
  if (hours === 0) {
    return `${minutes}m ${secs}s`;
  }
  
  return `${hours}h ${minutes}m ${secs}s`;
};

/**
 * Get a relative time string (e.g., "2 hours ago", "just now")
 * @param date The date to format
 * @returns The relative time string
 */
export const getRelativeTimeString = (date?: Date | string | null): string => {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  
  // Convert to seconds
  const diffSec = Math.floor(diffMs / 1000);
  
  if (diffSec < 60) {
    return 'just now';
  }
  
  // Convert to minutes
  const diffMin = Math.floor(diffSec / 60);
  
  if (diffMin < 60) {
    return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
  }
  
  // Convert to hours
  const diffHour = Math.floor(diffMin / 60);
  
  if (diffHour < 24) {
    return `${diffHour} hour${diffHour === 1 ? '' : 's'} ago`;
  }
  
  // Convert to days
  const diffDay = Math.floor(diffHour / 24);
  
  if (diffDay < 30) {
    return `${diffDay} day${diffDay === 1 ? '' : 's'} ago`;
  }
  
  // Convert to months
  const diffMonth = Math.floor(diffDay / 30);
  
  if (diffMonth < 12) {
    return `${diffMonth} month${diffMonth === 1 ? '' : 's'} ago`;
  }
  
  // Convert to years
  const diffYear = Math.floor(diffMonth / 12);
  
  return `${diffYear} year${diffYear === 1 ? '' : 's'} ago`;
};
