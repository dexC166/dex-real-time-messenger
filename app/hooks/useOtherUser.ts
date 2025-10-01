/**
 * Other User Identification Hook for Dex Real-Time Messenger
 *
 * This file provides a specialized useOtherUser hook for our Next.js 14
 * real-time messaging application. It implements user identification
 * with session-based filtering, conversation user extraction, and
 * performance optimization that ensures optimal user experience
 * for conversation-based user identification throughout the messaging platform.
 *
 * Key Features:
 * - Session-based user identification with NextAuth.js integration
 * - Conversation user filtering to identify the "other" user
 * - Type-safe user extraction with FullConversationType support
 * - useMemo optimization for performance and re-render prevention
 * - Flexible conversation type support for different conversation structures
 *
 * Other User Identification Usage Patterns:
 * - Header components: Display other user information in conversation headers
 * - ConversationBox components: Show other user avatars and names in conversation lists
 * - ProfileDrawer components: Display other user profile information and status
 * - Avatar components: Render other user profile images and active status
 * - Message components: Identify message senders and recipients
 *
 * This hook is essential for our messaging app because it provides the
 * user identification functionality that enables conversation-based
 * user display, profile management, and real-time status tracking
 * throughout our real-time messaging platform.
 *
 * @fileoverview Other User Identification Hook for Next.js 14 real-time messaging application
 * @author Dayle Cortes
 * @since 2025
 */

import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import { FullConversationType } from '../types';
import { User } from '@prisma/client';

/**
 * Other User Identification Hook
 *
 * A comprehensive user identification hook that provides other user
 * identification for our messaging application. This hook implements
 * session-based filtering, conversation user extraction, and performance
 * optimization that ensures optimal user experience for conversation-based
 * user identification throughout the messaging platform.
 *
 * Key Capabilities:
 * - Session-based user identification with NextAuth.js integration
 * - Conversation user filtering to identify the "other" user
 * - Type-safe user extraction with FullConversationType support
 * - useMemo optimization for performance and re-render prevention
 * - Flexible conversation type support for different conversation structures
 *
 * Other User Identification Types Supported:
 * - Single conversation: One-on-one conversation with one other user
 * - Group conversation: Multiple users with one "other" user identification
 * - FullConversationType: Complete conversation data with users array
 * - Basic conversation: Simple conversation object with users array
 * - Session-based filtering: Current user exclusion from other user selection
 *
 * Usage Patterns:
 * - Header components: Display other user information in conversation headers
 * - ConversationBox components: Show other user avatars and names in conversation lists
 * - ProfileDrawer components: Display other user profile information and status
 * - Avatar components: Render other user profile images and active status
 * - Message components: Identify message senders and recipients
 *
 * User Identification Features:
 * - Session integration: NextAuth.js session for current user identification
 * - User filtering: Filter out current user from conversation users
 * - Type safety: Type-safe user extraction and validation
 * - Performance: useMemo for efficient user identification
 * - Flexibility: Support for different conversation data structures
 *
 * Performance Features:
 * - useMemo optimization: Prevents unnecessary re-renders
 * - Dependency arrays: Efficient state update triggers
 * - User caching: Memoized user identification for performance
 * - Session synchronization: Real-time session updates
 * - Memory efficiency: Optimized user object extraction
 *
 * This hook is crucial for our messaging app because it provides the
 * user identification functionality that enables conversation-based
 * user display, profile management, and real-time status tracking
 * throughout all conversation-based interfaces.
 *
 * @param {FullConversationType | { users: User[] }} conversation - Conversation object with users array
 * @returns {User | undefined} The other user in the conversation (excluding current user)
 *
 * @example
 * ```tsx
 * // In Header component
 * const otherUser = useOtherUser(conversation);
 *
 * // In ConversationBox component
 * const otherUser = useOtherUser(data);
 *
 * // In ProfileDrawer component
 * const otherUser = useOtherUser(data);
 *
 * // User object structure
 * {
 *   id: string,
 *   name: string,
 *   email: string,
 *   image: string,
 *   createdAt: Date,
 *   updatedAt: Date
 * }
 * ```
 */
const useOtherUser = (
  conversation: FullConversationType | { users: User[] }
) => {
  /**
   * NextAuth.js Session Integration
   *
   * Retrieves the current user session from NextAuth.js for user
   * identification and filtering. This provides the core functionality
   * for identifying the current user and excluding them from the
   * other user selection process.
   *
   * What this provides:
   * - Current user session: NextAuth.js session data for user identification
   * - User email: Current user email for filtering purposes
   * - Session state: Real-time session updates and changes
   * - Authentication context: User authentication status and data
   * - User identification: Foundation for other user identification
   *
   * Why this pattern?
   * - User identification: Session provides current user context
   * - Filtering: Current user email needed for exclusion from other users
   * - Authentication: NextAuth.js integration for user management
   * - Performance: Efficient session retrieval for user identification
   * - Integration: Seamless integration with authentication system
   *
   * This session integration is essential for our messaging app because
   * it provides the current user context that enables accurate
   * other user identification and filtering throughout the
   * conversation-based user management system.
   */
  const session = useSession();

  /**
   * Other User Identification and Filtering
   *
   * Identifies and extracts the "other" user from conversation users
   * by filtering out the current user. This provides the core
   * functionality for other user identification in conversations.
   *
   * What this provides:
   * - Current user email: Session-based current user identification
   * - User filtering: Filter out current user from conversation users
   * - Other user extraction: First user that is not the current user
   * - Type safety: Type-safe user extraction and validation
   * - Performance: useMemo for efficient user identification
   *
   * Why this pattern?
   * - User identification: Filter out current user to find other user
   * - Type safety: Type-safe user extraction and validation
   * - Performance: useMemo prevents unnecessary re-renders
   * - State management: Efficient user identification and caching
   * - Flexibility: Support for different conversation data structures
   *
   * This user identification is essential for our messaging app because
   * it provides the other user identification that enables
   * conversation-based user display, profile management, and
   * real-time status tracking throughout the messaging platform.
   */
  const otherUser = useMemo(() => {
    const currentUserEmail = session?.data?.user?.email;

    const otherUser = conversation.users.filter(
      (user) => user.email !== currentUserEmail
    );

    return otherUser[0];
  }, [session?.data?.user?.email, conversation.users]);

  return otherUser;
};

export default useOtherUser;
