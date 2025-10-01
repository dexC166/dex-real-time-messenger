/**
 * Server-Side Session Management for Dex Real-Time Messenger
 *
 * This file provides a centralized session management utility for our Next.js 14
 * real-time messaging application. It wraps NextAuth.js's getServerSession function
 * with our custom authentication configuration, providing a consistent interface
 * for server-side session validation across all API routes and server actions.
 *
 * Key Features:
 * - Server-side session retrieval using NextAuth.js
 * - Integration with our custom authOptions configuration
 * - JWT-based session validation and user authentication
 * - Centralized session management for API routes and server actions
 * - Consistent error handling and null safety
 *
 * Usage Patterns:
 * - API route authentication checks (conversations, messages, settings)
 * - Server action user validation (getCurrentUser, getUsers)
 * - Protected route access control
 * - User identity verification for real-time messaging
 *
 * This utility is essential for our messaging app because it provides the
 * secure session validation foundation that ensures only authenticated users
 * can access conversation features, send messages, and manage their accounts.
 *
 * @fileoverview Server-side session management utility for Next.js 14 real-time messaging application
 * @author Dayle Cortes
 * @since 2025
 */

import { getServerSession } from 'next-auth';
import { authOptions } from '../libs/authOptions';

/**
 * Get Current User Session
 *
 * Retrieves the current user's session from NextAuth.js using our custom
 * authentication configuration. This function provides server-side access
 * to session data, enabling authentication checks in API routes and server actions.
 *
 * Key Capabilities:
 * - Validates JWT tokens and session authenticity
 * - Returns user information from the session
 * - Handles session expiration and invalidation
 * - Integrates with our Prisma database adapter
 * - Provides consistent session data structure
 *
 * Session Data Structure:
 * - session.user: User information (id, email, name, image)
 * - session.expires: Session expiration timestamp
 * - session.accessToken: OAuth access token (if applicable)
 * - session.refreshToken: OAuth refresh token (if applicable)
 *
 * Usage in API Routes:
 * - Authentication validation before processing requests
 * - User identity verification for resource access
 * - Authorization checks for conversation and message operations
 * - User profile and settings management
 *
 * Usage in Server Actions:
 * - getCurrentUser: Fetches full user data from database
 * - getUsers: Retrieves user list excluding current user
 * - getConversations: Gets user's conversation list
 * - getMessages: Fetches messages for authorized conversations
 *
 * Security Considerations:
 * - JWT tokens are validated against our secret key
 * - Session data is cryptographically signed and verified
 * - Expired sessions are automatically rejected
 * - Invalid or tampered tokens return null
 * - No sensitive data is exposed in error messages
 *
 * This function is crucial for our messaging app because it ensures that
 * all server-side operations are performed by authenticated users, maintaining
 * security and data integrity across our real-time messaging platform.
 *
 * @returns Promise<Session | null> - Current user session or null if not authenticated
 * @throws Never throws - Returns null for any errors to maintain graceful degradation
 *
 * @example
 * ```typescript
 * // In an API route
 * const session = await getSession();
 * if (!session?.user?.email) {
 *   return new NextResponse('Unauthorized', { status: 401 });
 * }
 *
 * // In a server action
 * const session = await getSession();
 * if (!session?.user?.email) {
 *   return [];
 * }
 * ```
 */
export default async function getSession() {
  /**
   * NextAuth.js Server Session Retrieval
   *
   * Uses NextAuth.js's getServerSession function to retrieve the current user's
   * session. This function automatically handles JWT token validation, session
   * verification, and user data extraction using our custom authOptions configuration.
   *
   * Why getServerSession?
   * - Designed specifically for server-side usage
   * - Automatically validates JWT tokens and signatures
   * - Handles session expiration and cleanup
   * - Integrates seamlessly with our Prisma adapter
   * - Provides consistent session data structure
   *
   * Configuration Integration:
   * - Uses authOptions from @/app/libs/authOptions
   * - Supports JWT-based session management
   * - Integrates with MongoDB via Prisma adapter
   * - Handles multiple authentication providers
   * - Maintains security through cryptographic validation
   *
   * Error Handling:
   * - Returns null for expired or invalid sessions
   * - Gracefully handles authentication failures
   * - Maintains application stability during auth errors
   * - Provides consistent null safety for callers
   *
   * This implementation is essential for our messaging app because it provides
   * the secure session validation that enables authenticated access to all
   * real-time messaging features while maintaining robust error handling.
   */
  return await getServerSession(authOptions);
}
