
/**
 * Re-export of the authentication hook from the auth feature
 * 
 * This file re-exports the useAuth hook from the auth feature to maintain
 * backward compatibility with existing imports.
 */

export { useAuth, type User, type LoginCredentials, type RegistrationData, type PasswordResetRequest, type PasswordResetData, type UseAuthResult } from '@/features/auth/hooks/use-auth';

// Augment the original UseAuthResult type to include logout and signOut methods
declare module '@/features/auth/hooks/use-auth' {
  interface UseAuthResult {
    logout: () => void;
    signOut: () => void; // Alias for logout
  }
}
