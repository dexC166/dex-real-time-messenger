/**
 * Get All User Conversations
 *
 * Retrieves all conversations for the current authenticated user with complete
 * relational data including participants, messages, and read receipts. This
 * server action implements conversation discovery functionality with session
 * validation, database querying, and comprehensive data inclusion that ensures
 * optimal user experience for conversation management and real-time messaging.
 *
 * Key Capabilities:
 * - Server-side conversation data fetching with session validation
 * - User-specific conversation filtering and security
 * - Complete relational data inclusion (users, messages, read receipts)
 * - Conversation ordering by last message timestamp
 * - Error handling with graceful fallbacks
 * - Integration with conversations layout and components
 *
 * Conversation Discovery Features:
 * - All conversations where current user is a participant
 * - Conversation metadata (name, isGroup, lastMessageAt, createdAt)
 * - User participants for each conversation
 * - Recent messages with sender and read receipt information
 * - Optimized database query with proper filtering and includes
 *
 * Usage Patterns:
 * - Conversations layout: Server-side data fetching for conversation list display
 * - Conversation discovery: Display all user conversations for messaging
 * - Conversation management: User interface for conversation selection and navigation
 * - Real-time updates: Base data for Pusher real-time conversation updates
 * - Conversation list: ConversationList component with conversation data
 *
 * Database Query Features:
 * - Prisma conversation.findMany: Efficient database querying
 * - orderBy lastMessageAt desc: Most recent conversations first
 * - userIds has filter: User-specific conversation filtering
 * - Complete includes: users, messages with sender and seen data
 * - MongoDB integration: Efficient NoSQL querying with Prisma
 *
 * Security Considerations:
 * - Session validation ensures only authenticated users
 * - User-specific filtering prevents unauthorized conversation access
 * - Database query filtering maintains data security
 * - Error handling prevents information leakage
 * - Graceful fallbacks maintain application stability
 *
 * Performance Features:
 * - Server-side fetching: Optimal performance with pre-loaded data
 * - Database optimization: Efficient Prisma queries with proper includes
 * - Error handling: Prevents application crashes
 * - Caching: Server-side rendering benefits
 * - Type safety: Prisma-generated TypeScript types
 *
 * This function is crucial for our messaging app because it provides the
 * conversation discovery functionality that enables users to access and manage
 * their conversations while maintaining security and optimal performance
 * throughout our real-time messaging platform.
 *
 * @returns {Promise<FullConversationType[]>} Array of conversation objects with complete relational data, or empty array on error
 * @throws Never throws - Returns empty array for any errors to maintain graceful degradation
 *
 * @example
 * ```typescript
 * // In conversations/layout.tsx
 * const conversations = await getConversations();
 * return <ConversationList initialItems={conversations} users={users} />;
 *
 * // In server components
 * const conversations = await getConversations();
 * if (conversations.length === 0) {
 *   return <EmptyState />;
 * }
 * ```
 */
import prisma from '@/app/libs/prismadb';
import getCurrentUser from './getCurrentUser';

const getConversations = async () => {
  /**
   * Current User Authentication
   *
   * Retrieves the current authenticated user using the getCurrentUser action
   * to ensure only authenticated users can access their conversations. This
   * authentication check provides security and user context for conversation
   * filtering and data access.
   *
   * What getCurrentUser provides:
   * - Current user session validation
   * - User ID for conversation filtering
   * - User email for authentication verification
   * - User profile information for conversation context
   * - Session state management
   *
   * Why authenticate before querying?
   * - Security: Prevents unauthorized access to conversation data
   * - User context: Provides user ID for conversation filtering
   * - Data integrity: Ensures conversations belong to authenticated user
   * - Performance: Avoids unnecessary database queries for unauthenticated users
   * - Consistency: Maintains consistent authentication flow
   *
   * This authentication is essential for our messaging app because
   * it ensures that only authenticated users can access their
   * conversations while maintaining security throughout the platform.
   */
  const currentUser = await getCurrentUser();

  /**
   * Unauthenticated User Handling
   *
   * Handles cases where no authenticated user is found by returning an empty
   * array. This graceful handling ensures the application remains stable
   * and provides consistent behavior for unauthenticated users.
   *
   * What this handles:
   * - No active user session
   * - Invalid or expired authentication tokens
   * - User not found in database
   * - Authentication service failures
   * - Session validation errors
   *
   * Why return empty array for no user?
   * - Security: Prevents unauthorized access to conversation data
   * - Consistency: Maintains consistent return type
   * - Graceful degradation: Handles unauthenticated state
   * - User experience: Prevents errors in UI components
   * - Performance: Avoids unnecessary database queries
   *
   * This unauthenticated handling is essential for our messaging app because
   * it ensures that conversation data remains secure and the application
   * behaves predictably for all user authentication states.
   */
  if (!currentUser?.id) {
    return [];
  }

  try {
    /**
     * Database Conversation Query
     *
     * Queries the database for all conversations where the current user is a
     * participant. This query implements efficient filtering, ordering, and
     * comprehensive data inclusion that provides the conversation data needed
     * for conversation discovery and real-time messaging.
     *
     * Query Features:
     * - findMany: Retrieves all matching conversation records
     * - orderBy lastMessageAt desc: Most recent conversations first
     * - userIds has filter: User-specific conversation filtering
     * - Complete includes: users, messages with sender and seen data
     * - Prisma ORM: Type-safe database access
     * - MongoDB integration: Efficient NoSQL querying
     *
     * Why order by lastMessageAt desc?
     * - User experience: Most recent conversations appear first
     * - Conversation management: Easy access to active conversations
     * - Real-time updates: Recent activity is most relevant
     * - Performance: Efficient database sorting
     * - Consistency: Predictable conversation list ordering
     *
     * Why userIds has filter?
     * - Security: Only conversations where user is a participant
     * - Data integrity: Prevents access to unauthorized conversations
     * - User experience: Shows only relevant conversations
     * - Performance: Efficient database filtering
     * - Privacy: Maintains conversation privacy
     *
     * Why include users and messages?
     * - Complete data: Provides all conversation information in one query
     * - Performance: Reduces additional database queries
     * - Real-time updates: Base data for Pusher real-time updates
     * - UI rendering: All data needed for conversation list display
     * - User experience: Complete conversation context
     *
     * This database query is essential for our messaging app because
     * it provides the filtered and complete conversation data that enables
     * conversation discovery and management while maintaining security
     * and optimal performance.
     */
    const conversations = await prisma.conversation.findMany({
      orderBy: {
        lastMessageAt: 'desc',
      },
      where: {
        userIds: {
          has: currentUser.id,
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            sender: true,
            seen: true,
          },
        },
      },
    });

    return conversations;
  } catch (error: any) {
    /**
     * Error Handling
     *
     * Handles any errors that occur during database querying or conversation
     * retrieval. This catch block ensures that the application remains stable
     * even when database operations fail, providing graceful degradation for
     * edge cases and maintaining user experience.
     *
     * What this handles:
     * - Database connection failures
     * - Prisma query errors
     * - Network connectivity issues
     * - Authentication service failures
     * - Database schema changes
     * - MongoDB connection timeouts
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
     * - Memory or resource constraints
     *
     * This error handling is essential for our messaging app because
     * it ensures that conversation discovery functionality remains stable
     * even when database operations fail, maintaining user experience
     * and application reliability throughout the platform.
     */
    return [];
  }
};

export default getConversations;
