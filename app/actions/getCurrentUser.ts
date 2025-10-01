/**
 * Current User Data Retrieval for Dex Real-Time Messenger
 *
 * This file provides a centralized user data retrieval utility for our Next.js 14
 * real-time messaging application. It combines session validation with database
 * user lookup to provide complete user information for authenticated users across
 * all API routes, server actions, and React components.
 *
 * Key Features:
 * - Session-based authentication validation
 * - Database user lookup via Prisma
 * - Complete user data retrieval with all fields
 * - Graceful error handling and null safety
 * - Integration with NextAuth.js session management
 *
 * Usage Patterns:
 * - API route authentication and user identification
 * - Server action user context and authorization
 * - React component user data for UI rendering
 * - Conversation and message ownership validation
 * - User profile and settings management
 *
 * This utility is essential for our messaging app because it provides the
 * complete user context needed for all messaging operations, ensuring that
 * users can only access their own conversations and maintain proper data
 * ownership throughout the real-time messaging platform.
 *
 * @fileoverview Current user data retrieval utility for Next.js 14 real-time messaging application
 * @author Dayle Cortes
 * @since 2025
 */

import prisma from '@/app/libs/prismadb';
import getSession from './getSession';

/**
 * Get Current Authenticated User
 *
 * Retrieves the complete user data for the currently authenticated user by
 * combining session validation with database lookup. This function provides
 * the full user object needed for authorization, UI rendering, and data
 * operations throughout our messaging application.
 *
 * Key Capabilities:
 * - Validates user session via NextAuth.js
 * - Retrieves complete user data from MongoDB via Prisma
 * - Handles authentication failures gracefully
 * - Provides consistent user data structure
 * - Maintains security through session validation
 *
 * User Data Structure:
 * - id: Unique user identifier (MongoDB ObjectId)
 * - name: User's display name
 * - email: User's email address (unique)
 * - emailVerified: Email verification status
 * - image: User's profile picture URL
 * - hashedPassword: Encrypted password (for credential users)
 * - createdAt: Account creation timestamp
 * - updatedAt: Last profile update timestamp
 *
 * Usage in API Routes:
 * - Authentication validation before processing requests
 * - User identification for conversation and message operations
 * - Authorization checks for resource access
 * - User context for Pusher channel authorization
 * - Profile and settings management
 *
 * Usage in Server Actions:
 * - getConversations: User context for conversation filtering
 * - getConversationById: User authorization for conversation access
 * - getMessages: User validation for message retrieval
 * - getUsers: Current user exclusion from user lists
 *
 * Usage in React Components:
 * - Sidebar: User profile display and navigation
 * - DesktopSidebar: User avatar and menu options
 * - Conversation components: User identification and ownership
 * - Settings components: User profile management
 *
 * Security Considerations:
 * - Session validation ensures only authenticated users
 * - Database lookup verifies user existence and validity
 * - Email-based lookup prevents user ID manipulation
 * - Graceful error handling prevents information leakage
 * - Null returns maintain consistent error handling
 *
 * This function is crucial for our messaging app because it provides the
 * complete user context that enables secure access to conversations,
 * messages, and user management features while maintaining data integrity
 * and proper authorization throughout our real-time messaging platform.
 *
 * @returns Promise<User | null> - Complete user object or null if not authenticated
 * @throws Never throws - Returns null for any errors to maintain graceful degradation
 *
 * @example
 * ```typescript
 * // In an API route
 * const currentUser = await getCurrentUser();
 * if (!currentUser?.id) {
 *   return new NextResponse('Unauthorized', { status: 401 });
 * }
 *
 * // In a server action
 * const currentUser = await getCurrentUser();
 * if (!currentUser?.id) {
 *   return [];
 * }
 *
 * // In a React component
 * const currentUser = await getCurrentUser();
 * return <DesktopSidebar currentUser={currentUser!} />;
 * ```
 */
const getCurrentUser = async () => {
  try {
    /**
     * Session Validation
     *
     * Retrieves and validates the current user's session using our getSession
     * utility. This step ensures that only authenticated users can proceed
     * to database lookup, maintaining security throughout the authentication flow.
     *
     * Why validate session first?
     * - Prevents unnecessary database queries for unauthenticated users
     * - Ensures JWT token validation before data access
     * - Maintains security by validating authentication state
     * - Provides consistent error handling for auth failures
     * - Enables graceful degradation for expired sessions
     */
    const session = await getSession();

    /**
     * Email Validation
     *
     * Validates that the session contains a valid user email address.
     * This is essential because:
     * - Email is our primary user identifier in the database
     * - Session might exist but be incomplete or invalid
     * - Email validation prevents database queries with invalid data
     * - Ensures consistent user identification across the platform
     *
     * Why check email specifically?
     * - Email is unique and immutable in our user system
     * - Provides consistent lookup key for database queries
     * - Prevents issues with incomplete or corrupted session data
     * - Maintains data integrity in user identification
     */
    if (!session?.user?.email) {
      return null;
    }

    /**
     * Database User Lookup
     *
     * Retrieves the complete user record from MongoDB using the session email.
     * This step provides the full user context needed for all messaging operations
     * and ensures that the user exists and is active in our system.
     *
     * Why use email for lookup?
     * - Email is unique and consistent across authentication providers
     * - Works for both OAuth and credential-based authentication
     * - Provides reliable user identification
     * - Maintains consistency with NextAuth.js session structure
     *
     * Database Query Details:
     * - Uses Prisma for type-safe database access
     * - findUnique ensures only one user is returned
     * - Email lookup is case-sensitive for security
     * - Returns complete user object with all fields
     */
    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
    });

    /**
     * User Existence Validation
     *
     * Verifies that the user exists in our database. This check is crucial because:
     * - Session might reference a deleted or non-existent user
     * - Database might be out of sync with authentication system
     * - User might have been removed after session creation
     * - Ensures data consistency and prevents orphaned sessions
     *
     * Why return null for non-existent users?
     * - Maintains consistent error handling pattern
     * - Prevents partial or invalid user data from being returned
     * - Ensures security by not exposing user existence information
     * - Enables graceful degradation for edge cases
     */
    if (!currentUser) {
      return null;
    }

    /**
     * User Data Return
     *
     * Returns the complete user object containing all user information needed
     * for messaging operations, UI rendering, and authorization checks.
     *
     * User Object Contents:
     * - Complete profile information (name, email, image)
     * - Account metadata (createdAt, updatedAt)
     * - Authentication data (hashedPassword, emailVerified)
     * - Unique identifiers (id, email)
     *
     * This complete user object enables:
     * - Proper authorization in API routes
     * - User identification in conversations and messages
     * - Profile display in React components
     * - Settings and account management
     * - Pusher channel authorization
     */
    return currentUser;
  } catch (error: any) {
    /**
     * Error Handling
     *
     * Handles any errors that occur during session validation or database lookup.
     * This catch block ensures that the application remains stable even when
     * authentication or database operations fail.
     *
     * Why return null for errors?
     * - Maintains consistent error handling pattern
     * - Prevents application crashes from auth failures
     * - Ensures graceful degradation for edge cases
     * - Maintains security by not exposing error details
     * - Enables proper error handling in calling functions
     *
     * Common Error Scenarios:
     * - Database connection failures
     * - Invalid session data
     * - Prisma query errors
     * - Network connectivity issues
     * - Authentication service failures
     */
    return null;
  }
};

export default getCurrentUser;
