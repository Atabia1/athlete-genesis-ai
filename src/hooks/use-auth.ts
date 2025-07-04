
/**
 * Re-export of the authentication hook from the auth feature
 * 
 * This file re-exports the useAuth hook from the auth feature to maintain
 * backward compatibility with existing imports.
 */

export { useAuth, type AuthUser, type UseAuthReturn, AuthProvider } from '@/features/auth/hooks/use-auth';
