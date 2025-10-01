/**
 * User List Retrieval for Dex Real-Time Messenger
 *
 * This file provides a server action for retrieving all available users for our Next.js 14
 * real-time messaging application. It implements user discovery functionality with session
 * validation, database querying, and current user exclusion that ensures optimal user
 * experience for contact discovery and conversation initiation.
 *
 * Key Features:
 * - Server-side user data fetching with session validation
 * - Current user exclusion from user list
 * - Database querying with Prisma ORM
 * - Error handling with graceful fallbacks
 * - User discovery for contact management
 * - Integration with users layout and components
 *
 * User Discovery Features:
 * - All users except current authenticated user
 * - User profile information (name, email, image)
 * - User creation timestamps for sorting
 * - User data for contact discovery and messaging
 * - Optimized database query with proper filtering
 *
 * This function is essential for our messaging app because it provides the
 * user discovery functionality that enables users to find and connect with
 * other users for real-time messaging while maintaining security and
 * optimal performance throughout our messaging platform.
 *
 * @fileoverview User list retrieval server action for Next.js 14 real-time messaging application
 * @author Dayle Cortes
 * @since 2025
 */

import prisma from '@/app/libs/prismadb';
import getSession from './getSession';

/**
 * Get All Available Users
 *
 * Retrieves all users in the system except the current authenticated user for
 * contact discovery and conversation initiation. This server action implements
 * session validation, database querying, and current user exclusion that ensures
 * optimal user experience for user management and messaging functionality.
 *
 * Key Capabilities:
 * - Server-side user data fetching with session validation
 * - Current user exclusion from user list
 * - Database querying with Prisma ORM
 * - Error handling with graceful fallbacks
 * - User discovery for contact management
 * - Integration with users layout and components
 *
 * User Discovery Features:
 * - All users except current authenticated user
 * - User profile information (name, email, image)
 * - User creation timestamps for sorting
 * - User data for contact discovery and messaging
 * - Optimized database query with proper filtering
 *
 * Usage Patterns:
 * - Users layout: Server-side data fetching for user list display
 * - Contact discovery: Display all available users for messaging
 * - User management: User list with contact information
 * - Conversation initiation: User selection for new conversations
 * - User interaction: UserBox components for user selection
 *
 * Database Query Features:
 * - Prisma user.findMany: Efficient database querying
 * - orderBy createdAt desc: Newest users first for better UX
 * - NOT email filter: Excludes current user from results
 * - Session-based filtering: Secure user data access
 * - Error handling: Graceful fallback for database errors
 *
 * Security Considerations:
 * - Session validation ensures only authenticated users
 * - Current user exclusion prevents self-messaging
 * - Database query filtering prevents unauthorized access
 * - Error handling prevents information leakage
 * - Graceful fallbacks maintain application stability
 *
 * Performance Features:
 * - Server-side fetching: Optimal performance with pre-loaded data
 * - Database optimization: Efficient Prisma queries
 * - Error handling: Prevents application crashes
 * - Caching: Server-side rendering benefits
 * - Type safety: Prisma-generated TypeScript types
 *
 * This function is crucial for our messaging app because it provides the
 * user discovery functionality that enables users to find and connect with
 * other users for real-time messaging while maintaining security and
 * optimal performance throughout our messaging platform.
 *
 * @returns {Promise<User[]>} Array of User objects excluding current user, or empty array on error
 * @throws Never throws - Returns empty array for any errors to maintain graceful degradation
 *
 * @example
 * ```typescript
 * // In users/layout.tsx
 * const users = await getUsers();
 * return <UserList items={users} />;
 *
 * // In server components
 * const users = await getUsers();
 * if (users.length === 0) {
 *   return <EmptyState />;
 * }
 * ```
 */
const getUsers = async () => {
  /**
   * Session Validation
   *
   * Validates the current user session to ensure only authenticated users
   * can access the user list. This security check prevents unauthorized
   * access to user data and maintains proper authentication flow.
   *
   * What this validates:
   * - User session exists and is valid
   * - User email is available for filtering
   * - Authentication state is properly maintained
   * - User is authorized to access user data
   *
   * Why return empty array for no session?
   * - Security: Prevents unauthorized access to user data
   * - Consistency: Maintains consistent return type
   * - Graceful degradation: Handles unauthenticated state
   * - User experience: Prevents errors in UI components
   * - Performance: Avoids unnecessary database queries
   *
   * This session validation is essential for our messaging app because
   * it ensures that only authenticated users can discover and connect
   * with other users, maintaining security throughout the platform.
   */
  const session = await getSession();

  if (!session?.user?.email) {
    return [];
  }

  try {
    /**
     * Database User Query
     *
     * Queries the database for all users except the current authenticated user.
     * This query implements efficient filtering, sorting, and data retrieval
     * that provides the user list needed for contact discovery and messaging.
     *
     * Query Features:
     * - findMany: Retrieves all matching user records
     * - orderBy createdAt desc: Newest users first for better UX
     * - NOT email filter: Excludes current user from results
     * - Prisma ORM: Type-safe database access
     * - MongoDB integration: Efficient NoSQL querying
     *
     * Why exclude current user?
     * - User experience: Users don't need to see themselves
     * - Conversation logic: Prevents self-messaging
     * - UI clarity: Cleaner user list display
     * - Performance: Reduces unnecessary data
     * - Security: Prevents self-referential issues
     *
     * Why sort by createdAt desc?
     * - User experience: Newest users appear first
     * - Discovery: Recent signups are more likely to be active
     * - Engagement: Encourages interaction with new users
     * - Performance: Efficient database sorting
     * - Consistency: Predictable user list ordering
     *
     * This database query is essential for our messaging app because
     * it provides the filtered user list that enables contact discovery
     * and conversation initiation while maintaining optimal performance.
     */
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        NOT: {
          email: session.user.email,
        },
      },
    });

    return users;
  } catch (error: any) {
    /**
     * Error Handling
     *
     * Handles any errors that occur during database querying or user retrieval.
     * This catch block ensures that the application remains stable even when
     * database operations fail, providing graceful degradation for edge cases.
     *
     * What this handles:
     * - Database connection failures
     * - Prisma query errors
     * - Network connectivity issues
     * - Authentication service failures
     * - Database schema changes
     *
     * Why return empty array for errors?
     * - Graceful degradation: Prevents application crashes
     * - User experience: Maintains consistent UI behavior
     * - Security: Prevents error information leakage
     * - Performance: Avoids cascading failures
     * - Consistency: Maintains predictable return type
     *
     * Common Error Scenarios:
     * - MongoDB connection timeouts
     * - Prisma client initialization failures
     * - Database authentication errors
     * - Network connectivity issues
     * - Database schema validation errors
     *
     * This error handling is essential for our messaging app because
     * it ensures that user discovery functionality remains stable
     * even when database operations fail, maintaining user experience
     * and application reliability throughout the platform.
     */
    return [];
  }
};

export default getUsers;
