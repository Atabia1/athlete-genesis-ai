/**
 * useAnnounce: Hook for screen reader announcements
 * 
 * This hook provides a way to announce messages to screen readers
 * using ARIA live regions. It's useful for announcing dynamic content
 * changes, form submission results, and other important updates.
 * 
 * Features:
 * - Supports different politeness levels (polite, assertive)
 * - Clears announcements after a delay
 * - Queues multiple announcements
 */

import { useCallback, useEffect, useRef, useState } from 'react';

export type AnnouncementPoliteness = 'polite' | 'assertive';

export interface AnnounceOptions {
  /** How urgently the screen reader should announce the message */
  politeness?: AnnouncementPoliteness;
  /** How long to wait before clearing the announcement (ms) */
  clearDelay?: number;
}

/**
 * Hook for announcing messages to screen readers
 */
export function useAnnounce() {
  // Keep track of announcements for each politeness level
  const [politeAnnouncement, setPoliteAnnouncement] = useState<string>('');
  const [assertiveAnnouncement, setAssertiveAnnouncement] = useState<string>('');
  
  // Use refs to keep track of timeouts
  const politeTimeoutRef = useRef<number | null>(null);
  const assertiveTimeoutRef = useRef<number | null>(null);
  
  // Queue for announcements
  const politeQueueRef = useRef<string[]>([]);
  const assertiveQueueRef = useRef<string[]>([]);
  
  // Clear an announcement after a delay
  const clearAnnouncement = useCallback((politeness: AnnouncementPoliteness, delay: number) => {
    const timeoutRef = politeness === 'polite' ? politeTimeoutRef : assertiveTimeoutRef;
    const setAnnouncement = politeness === 'polite' ? setPoliteAnnouncement : setAssertiveAnnouncement;
    const queueRef = politeness === 'polite' ? politeQueueRef : assertiveQueueRef;
    
    // Clear any existing timeout
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }
    
    // Set a new timeout to clear the announcement
    timeoutRef.current = window.setTimeout(() => {
      setAnnouncement('');
      timeoutRef.current = null;
      
      // Process the next announcement in the queue
      if (queueRef.current.length > 0) {
        const nextAnnouncement = queueRef.current.shift();
        if (nextAnnouncement) {
          setAnnouncement(nextAnnouncement);
          clearAnnouncement(politeness, delay);
        }
      }
    }, delay);
  }, []);
  
  // Announce a message to screen readers
  const announce = useCallback((
    message: string,
    options: AnnounceOptions = {}
  ) => {
    const { 
      politeness = 'polite',
      clearDelay = 5000
    } = options;
    
    const setAnnouncement = politeness === 'polite' ? setPoliteAnnouncement : setAssertiveAnnouncement;
    const timeoutRef = politeness === 'polite' ? politeTimeoutRef : assertiveTimeoutRef;
    const queueRef = politeness === 'polite' ? politeQueueRef : assertiveQueueRef;
    
    // If there's no active announcement, announce immediately
    if (timeoutRef.current === null) {
      setAnnouncement(message);
      clearAnnouncement(politeness, clearDelay);
    } else {
      // Otherwise, add to the queue
      queueRef.current.push(message);
    }
  }, [clearAnnouncement]);
  
  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (politeTimeoutRef.current !== null) {
        window.clearTimeout(politeTimeoutRef.current);
      }
      if (assertiveTimeoutRef.current !== null) {
        window.clearTimeout(assertiveTimeoutRef.current);
      }
    };
  }, []);
  
  return {
    /** Announce a message to screen readers */
    announce,
    /** Current polite announcement */
    politeAnnouncement,
    /** Current assertive announcement */
    assertiveAnnouncement
  };
}

/**
 * Example usage:
 * 
 * function FormSubmitButton() {
 *   const { announce } = useAnnounce();
 *   const [isSubmitting, setIsSubmitting] = useState(false);
 *   
 *   const handleSubmit = async () => {
 *     setIsSubmitting(true);
 *     announce('Submitting form...', { politeness: 'polite' });
 *     
 *     try {
 *       await submitForm();
 *       announce('Form submitted successfully!', { politeness: 'assertive' });
 *     } catch (error) {
 *       announce('Error submitting form. Please try again.', { politeness: 'assertive' });
 *     } finally {
 *       setIsSubmitting(false);
 *     }
 *   };
 *   
 *   return (
 *     <button onClick={handleSubmit} disabled={isSubmitting}>
 *       {isSubmitting ? 'Submitting...' : 'Submit'}
 *     </button>
 *   );
 * }
 */
