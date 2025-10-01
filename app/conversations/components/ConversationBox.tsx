/**
 * Conversation Box Component for Dex Real-Time Messenger
 *
 * This file provides the conversation box component for our Next.js 14 real-time
 * messaging application. It implements individual conversation display with
 * navigation, read receipt tracking, and responsive design that ensures optimal
 * user experience for conversation selection and messaging interface.
 *
 * Key Features:
 * - Individual conversation display with navigation functionality
 * - Read receipt tracking and visual indicators
 * - Group and direct conversation support with Avatar/AvatarGroup
 * - Last message display with timestamp formatting
 * - Responsive design with hover states and selection indicators
 * - User session management with NextAuth.js integration
 *
 * Conversation Display Features:
 * - Conversation navigation: Click-to-navigate conversation selection
 * - Read receipt tracking: Visual indicators for message read status
 * - Avatar display: Individual avatars for direct conversations
 * - Group avatar display: AvatarGroup for group conversations
 * - Last message preview: Recent message content with fallback text
 * - Timestamp display: Formatted message timestamps
 *
 * This component is essential for our messaging app because it provides the
 * individual conversation display that enables users to select and navigate
 * conversations while maintaining clear visual feedback and user experience
 * throughout our messaging platform.
 *
 * @fileoverview Conversation box component for Next.js 14 real-time messaging application
 * @author Dayle Cortes
 * @since 2025
 */

'use client';

import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import clsx from 'clsx';
import { FullConversationType } from '@/app/types';
import useOtherUser from '@/app/hooks/useOtherUser';
import Avatar from '@/app/components/Avatar';
import AvatarGroup from '@/app/components/AvatarGroup';

/**
 * Conversation Box Props Interface
 *
 * Defines the props interface for the ConversationBox component, specifying
 * the required data for conversation display and interaction.
 *
 * @interface ConversationBoxProps
 * @property {FullConversationType} data - Complete conversation data with messages and users
 * @property {boolean} [selected] - Optional flag indicating if this conversation is currently selected
 */
interface ConversationBoxProps {
  data: FullConversationType;
  selected?: boolean;
}

/**
 * Conversation Box Component
 *
 * A comprehensive conversation box component that provides individual conversation
 * display with navigation, read receipt tracking, and responsive design for our
 * messaging application. This component implements conversation selection, user
 * identification, and visual feedback that ensures optimal user experience for
 * conversation management and messaging interface.
 *
 * Key Capabilities:
 * - Individual conversation display with navigation functionality
 * - Read receipt tracking and visual indicators
 * - Group and direct conversation support with Avatar/AvatarGroup
 * - Last message display with timestamp formatting
 * - Responsive design with hover states and selection indicators
 * - User session management with NextAuth.js integration
 *
 * Conversation Display Features:
 * - Conversation navigation: Click-to-navigate conversation selection
 * - Read receipt tracking: Visual indicators for message read status
 * - Avatar display: Individual avatars for direct conversations
 * - Group avatar display: AvatarGroup for group conversations
 * - Last message preview: Recent message content with fallback text
 * - Timestamp display: Formatted message timestamps
 *
 * Usage Patterns:
 * - ConversationList: Individual conversation items in conversation list display
 * - Conversation selection: Click handling for conversation navigation
 * - Read receipt display: Visual indicators for message read status
 * - Avatar display: User identification for direct and group conversations
 * - Responsive layout: Mobile and desktop optimized conversation display
 *
 * Layout Features:
 * - Responsive design: Full width with hover states and transitions
 * - Avatar integration: Avatar or AvatarGroup based on conversation type
 * - Content layout: Conversation name, timestamp, and last message preview
 * - Selection state: Visual feedback for currently selected conversation
 * - Navigation: Click handling for conversation navigation
 *
 * Read Receipt Features:
 * - Message read tracking: Visual indicators for read/unread messages
 * - User session integration: Current user email for read receipt checking
 * - Visual feedback: Different styling for read vs unread messages
 * - Performance optimization: useMemo for efficient read receipt calculation
 * - Fallback handling: Graceful handling of missing read receipt data
 *
 * This component is crucial for our messaging app because it provides the
 * individual conversation display that enables users to select and navigate
 * conversations while maintaining clear visual feedback and user experience
 * throughout our messaging platform.
 *
 * @param {ConversationBoxProps} props - Component props for conversation box configuration
 * @param {FullConversationType} props.data - Complete conversation data with messages and users
 * @param {boolean} [props.selected] - Optional flag indicating if this conversation is currently selected
 * @returns {JSX.Element} Interactive conversation box with navigation and visual feedback
 *
 * @example
 * ```tsx
 * // In ConversationList component
 * <ConversationBox
 *   key={item.id}
 *   data={item}
 *   selected={conversationId === item.id}
 * />
 *
 * // With conversation data from getConversations action
 * <ConversationBox data={conversationData} selected={true} />
 * ```
 */
const ConversationBox: React.FC<ConversationBoxProps> = ({
  data,
  selected,
}) => {
  /**
   * Other User Identification
   *
   * Identifies the "other" user in a conversation using the useOtherUser hook
   * to provide user information for direct conversations. This identification
   * enables proper user display and avatar rendering for conversation interfaces.
   *
   * What useOtherUser provides:
   * - Other user identification: User object for the conversation participant
   * - Session-based filtering: Excludes current user from conversation users
   * - Type safety: Type-safe user extraction from FullConversationType
   * - Performance optimization: useMemo for efficient user identification
   * - Flexible support: Works with different conversation structures
   *
   * Why other user identification is essential:
   * - User display: Shows the other participant in direct conversations
   * - Avatar rendering: Provides user data for Avatar component
   * - Conversation context: Enables proper conversation identification
   * - User experience: Clear indication of conversation participants
   * - Performance: Optimized user identification without re-computation
   *
   * This other user identification is essential for our messaging app because
   * it provides the user context that enables proper conversation display
   * and user identification throughout the conversation interface.
   */
  const otherUser = useOtherUser(data);

  /**
   * User Session Management
   *
   * Manages user session state using NextAuth.js useSession hook to provide
   * authentication context and user information needed for read receipt tracking
   * and conversation management throughout the component.
   *
   * What useSession provides:
   * - User authentication status and session data
   * - User email for read receipt tracking
   * - User profile information for conversation management
   * - Session state management and updates
   * - Authentication context for protected features
   *
   * Why session management is essential:
   * - Read receipt tracking: User email needed for read receipt checking
   * - Authentication: Ensures only authenticated users can access conversations
   * - User context: Provides user information for conversation management
   * - Security: Maintains secure access to conversation data
   * - State management: Handles authentication state changes
   *
   * This session management is essential for our messaging app because
   * it provides the authentication context that enables read receipt
   * tracking and secure access to conversation functionality.
   */
  const session = useSession();

  /**
   * Next.js Router Integration
   *
   * Integrates with Next.js useRouter hook to provide programmatic navigation
   * and routing functionality for conversation navigation and user experience
   * throughout the messaging application.
   *
   * What useRouter provides:
   * - Programmatic navigation with router.push()
   * - Route management and navigation control
   * - URL parameter access and manipulation
   * - Navigation state management
   * - Next.js App Router integration
   *
   * Why router integration is essential:
   * - Navigation: Enables conversation navigation and routing
   * - User experience: Provides smooth navigation between conversations
   * - State management: Handles navigation state and URL updates
   * - Integration: Works with Next.js App Router system
   * - Performance: Efficient navigation without page reloads
   *
   * This router integration is essential for our messaging app because
   * it provides the navigation functionality that enables users to
   * navigate between conversations and maintain proper routing state.
   */
  const router = useRouter();

  /**
   * Conversation Click Handler
   *
   * Handles conversation click events by navigating to the specific conversation
   * page using Next.js router. This handler enables conversation selection and
   * navigation throughout the messaging application.
   *
   * What this handler does:
   * - Receives click events on conversation box elements
   * - Navigates to the specific conversation page using router.push()
   * - Uses conversation ID from data prop for navigation
   * - Provides smooth navigation between conversations
   * - Maintains conversation state and URL parameters
   *
   * Why useCallback for handleClick:
   * - Performance: Prevents unnecessary re-renders of child components
   * - Optimization: Memoizes click handler function
   * - Dependencies: Only recreates when data.id or router changes
   * - Navigation: Ensures consistent navigation behavior
   * - User experience: Provides responsive conversation selection
   *
   * This click handler is essential for our messaging app because
   * it provides the conversation navigation that enables users to
   * select and navigate between conversations throughout the interface.
   */
  const handleClick = useCallback(() => {
    router.push(`/conversations/${data.id}`);
  }, [data.id, router]);

  /**
   * Last Message Extraction
   *
   * Extracts the most recent message from the conversation messages array
   * using useMemo for performance optimization. This extraction enables
   * last message preview and timestamp display in conversation boxes.
   *
   * What this provides:
   * - Last message object from conversation messages array
   * - Message content for preview display
   * - Message timestamp for time display
   * - Message read receipt data for status tracking
   * - Performance optimization with useMemo
   *
   * Why useMemo for lastMessage:
   * - Performance: Prevents unnecessary re-computation
   * - Optimization: Memoizes last message extraction
   * - Dependencies: Only recalculates when messages array changes
   * - User experience: Efficient last message display
   * - Memory: Reduces unnecessary object creation
   *
   * This last message extraction is essential for our messaging app because
   * it provides the recent message preview that enables users to see
   * conversation activity and content at a glance.
   */
  const lastMessage = useMemo(() => {
    const messages = data.messages || [];

    return messages[messages.length - 1];
  }, [data.messages]);

  /**
   * User Email Extraction
   *
   * Extracts the current user's email from the session data using useMemo
   * for performance optimization. This email is used for read receipt
   * tracking and user identification throughout the component.
   *
   * What this provides:
   * - Current user email from session data
   * - User identification for read receipt tracking
   * - Authentication context for user-specific features
   * - Performance optimization with useMemo
   * - Type safety with optional chaining
   *
   * Why useMemo for userEmail:
   * - Performance: Prevents unnecessary re-computation
   * - Optimization: Memoizes email extraction
   * - Dependencies: Only recalculates when session data changes
   * - Read receipts: Enables efficient read receipt tracking
   * - Memory: Reduces unnecessary string creation
   *
   * This user email extraction is essential for our messaging app because
   * it provides the user identification that enables read receipt
   * tracking and user-specific conversation features.
   */
  const userEmail = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  /**
   * Read Receipt Status Calculation
   *
   * Calculates whether the current user has seen the last message in the
   * conversation using useMemo for performance optimization. This calculation
   * enables visual read receipt indicators and unread message styling.
   *
   * What this provides:
   * - Boolean flag indicating if last message has been seen
   * - Read receipt status for visual indicators
   * - User-specific read status tracking
   * - Performance optimization with useMemo
   * - Fallback handling for missing data
   *
   * Read Receipt Logic:
   * - Checks if last message exists
   * - Extracts seen array from last message
   * - Verifies current user email is available
   * - Filters seen array for current user email
   * - Returns true if user has seen the message
   *
   * Why useMemo for hasSeen:
   * - Performance: Prevents unnecessary re-computation
   * - Optimization: Memoizes read receipt calculation
   * - Dependencies: Only recalculates when userEmail or lastMessage changes
   * - Visual feedback: Enables efficient read receipt display
   * - Memory: Reduces unnecessary boolean calculations
   *
   * This read receipt calculation is essential for our messaging app because
   * it provides the visual feedback that enables users to see which
   * messages they have read and which are still unread.
   */
  const hasSeen = useMemo(() => {
    if (!lastMessage) {
      return false;
    }

    const seenArray = lastMessage.seen || [];

    if (!userEmail) {
      return false;
    }

    return seenArray.filter((user) => user.email === userEmail).length !== 0;
  }, [userEmail, lastMessage]);

  /**
   * Last Message Text Display
   *
   * Generates appropriate display text for the last message in the conversation
   * using useMemo for performance optimization. This text generation handles
   * different message types and provides fallback text for empty conversations.
   *
   * What this provides:
   * - Display text for last message preview
   * - Image message handling with "Sent an Image" text
   * - Text message display with message body
   * - Fallback text for empty conversations
   * - Performance optimization with useMemo
   *
   * Message Text Logic:
   * - Image messages: "Sent an Image" for image content
   * - Text messages: Message body content for text messages
   * - Empty conversations: "Started a conversation" fallback
   * - Null handling: Graceful handling of missing message data
   * - Type safety: Optional chaining for safe property access
   *
   * Why useMemo for lastMessageText:
   * - Performance: Prevents unnecessary re-computation
   * - Optimization: Memoizes text generation
   * - Dependencies: Only recalculates when lastMessage changes
   * - User experience: Efficient message preview display
   * - Memory: Reduces unnecessary string creation
   *
   * This last message text generation is essential for our messaging app because
   * it provides the message preview that enables users to see conversation
   * content and activity at a glance without opening the conversation.
   */
  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) {
      return 'Sent an Image';
    }

    if (lastMessage?.body) {
      return lastMessage.body;
    }

    return 'Started a conversation';
  }, [lastMessage]);

  return (
    <div
      onClick={handleClick}
      className={clsx(
        `
        w-full
        relative
        flex
        items-center
        space-x-3
        p-3
        hover:bg-neutral-100
        rounded-lg
        transition
        cursor-pointer
      `,
        selected ? 'bg-neutral-100' : 'bg-white'
      )}
    >
      {data.isGroup ? (
        <AvatarGroup users={data.users} />
      ) : (
        <Avatar user={otherUser} />
      )}
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div
            className="
              flex
              justify-between
              items-center
              mb-1
            "
          >
            <p
              className="
                text-md
                font-medium
                text-gray-900
              "
            >
              {data.name || otherUser.name}
            </p>
            {lastMessage?.createdAt && (
              <p
                className="
                  text-xs
                  text-gray-400
                  font-light
                "
              >
                {format(new Date(lastMessage.createdAt), 'p')}
              </p>
            )}
          </div>
          <p
            className={clsx(
              `
              truncate
              text-sm
            `,
              hasSeen ? 'text-gray-500' : 'text-black font-medium'
            )}
          >
            {lastMessageText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConversationBox;
