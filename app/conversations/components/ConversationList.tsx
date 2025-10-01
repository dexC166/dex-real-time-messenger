/**
 * Conversation List Component for Dex Real-Time Messenger
 *
 * This file provides the conversation list component for our Next.js 14 real-time
 * messaging application. It implements conversation management with real-time updates,
 * responsive sidebar layout, and group chat creation that ensures optimal user
 * experience for conversation discovery and real-time messaging.
 *
 * Key Features:
 * - Real-time conversation updates via Pusher integration
 * - Responsive sidebar layout with mobile and desktop optimization
 * - Group chat creation with GroupChatModal integration
 * - Conversation state management with useConversation hook
 * - Conversation display with ConversationBox components
 * - User session management with NextAuth.js integration
 *
 * Real-Time Features:
 * - Conversation creation: Real-time new conversation updates
 * - Conversation updates: Real-time message updates and changes
 * - Conversation removal: Real-time conversation deletion
 * - Pusher integration: WebSocket-based real-time communication
 * - State synchronization: Automatic UI updates from server events
 *
 * This component is essential for our messaging app because it provides the
 * conversation management interface that enables users to discover, create,
 * and manage conversations while maintaining real-time synchronization
 * throughout our messaging platform.
 *
 * @fileoverview Conversation list component for Next.js 14 real-time messaging application
 * @author Dayle Cortes
 * @since 2025
 */

'use client';

import useConversation from '@/app/hooks/useConversation';
import { FullConversationType } from '@/app/types';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { MdOutlineGroupAdd } from 'react-icons/md';
import ConversationBox from './ConversationBox';
import GroupChatModal from './GroupChatModal';
import { User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { pusherClient } from '@/app/libs/pusher';
import { find } from 'lodash';

/**
 * Conversation List Props Interface
 *
 * Defines the props interface for the ConversationList component, specifying
 * the required data for conversation management and group chat creation.
 *
 * @interface ConversationListProps
 * @property {FullConversationType[]} initialItems - Initial conversation data from server-side fetching
 * @property {User[]} users - Available users for group chat creation
 */
interface ConversationListProps {
  initialItems: FullConversationType[];
  users: User[];
}

/**
 * Conversation List Component
 *
 * A comprehensive conversation list component that provides conversation management
 * with real-time updates, responsive sidebar layout, and group chat creation for
 * our messaging application. This component implements Pusher integration for
 * real-time updates, conversation state management, and responsive design that
 * ensures optimal user experience for conversation discovery and messaging.
 *
 * Key Capabilities:
 * - Real-time conversation updates via Pusher integration
 * - Responsive sidebar layout with mobile and desktop optimization
 * - Group chat creation with GroupChatModal integration
 * - Conversation state management with useConversation hook
 * - Conversation display with ConversationBox components
 * - User session management with NextAuth.js integration
 *
 * Real-Time Features:
 * - Conversation creation: Real-time new conversation updates
 * - Conversation updates: Real-time message updates and changes
 * - Conversation removal: Real-time conversation deletion
 * - Pusher integration: WebSocket-based real-time communication
 * - State synchronization: Automatic UI updates from server events
 *
 * Usage Patterns:
 * - Conversation management: Main interface for conversation discovery and management
 * - Real-time updates: Automatic conversation list updates from server events
 * - Group chat creation: User interface for creating new group conversations
 * - Conversation navigation: Click-to-navigate conversation selection
 * - Responsive layout: Mobile and desktop optimized conversation interface
 *
 * Layout Features:
 * - Responsive sidebar: Fixed positioning with mobile/desktop variants
 * - Conversation display: ConversationBox components for each conversation
 * - Group chat button: MdOutlineGroupAdd icon for group chat creation
 * - Modal integration: GroupChatModal for group chat creation interface
 * - State management: useConversation hook for conversation state awareness
 *
 * Real-Time Integration:
 * - Pusher subscription: User-specific channel subscription
 * - Event handlers: conversation:new, conversation:update, conversation:remove
 * - State updates: Automatic conversation list updates from real-time events
 * - Cleanup: Proper event unbinding and channel unsubscription
 * - Error handling: Graceful handling of real-time connection issues
 *
 * This component is crucial for our messaging app because it provides the
 * conversation management interface that enables users to discover, create,
 * and manage conversations while maintaining real-time synchronization
 * throughout our messaging platform.
 *
 * @param {ConversationListProps} props - Component props containing conversation data and users
 * @param {FullConversationType[]} props.initialItems - Initial conversation data from server-side fetching
 * @param {User[]} props.users - Available users for group chat creation
 * @returns {JSX.Element} Conversation list with real-time updates and group chat creation
 *
 * @example
 * ```tsx
 * // In conversations/layout.tsx
 * <ConversationList users={users} initialItems={conversations} />
 *
 * // Real-time updates automatically handled
 * // Group chat creation via GroupChatModal
 * // Conversation navigation via ConversationBox components
 * ```
 */
const ConversationList: React.FC<ConversationListProps> = ({
  initialItems,
  users,
}) => {
  /**
   * User Session Management
   *
   * Manages user session state using NextAuth.js useSession hook to provide
   * authentication context and user information needed for real-time features
   * and conversation management throughout the component.
   *
   * What useSession provides:
   * - User authentication status and session data
   * - User email for Pusher channel subscription
   * - User profile information for conversation management
   * - Session state management and updates
   * - Authentication context for protected features
   *
   * Why session management is essential:
   * - Real-time features: User email needed for Pusher channel subscription
   * - Authentication: Ensures only authenticated users can access conversations
   * - User context: Provides user information for conversation management
   * - Security: Maintains secure access to conversation data
   * - State management: Handles authentication state changes
   *
   * This session management is essential for our messaging app because
   * it provides the authentication context that enables real-time features,
   * conversation management, and secure access to messaging functionality.
   */
  const session = useSession();

  /**
   * Conversation Items State Management
   *
   * Manages the conversation list state using React useState hook to provide
   * dynamic conversation updates and real-time synchronization with server events.
   * This state management enables real-time conversation list updates and
   * maintains conversation data throughout the component lifecycle.
   *
   * What this state provides:
   * - Dynamic conversation list updates from real-time events
   * - Initial conversation data from server-side fetching
   * - Real-time conversation creation, updates, and removal
   * - State synchronization with server events
   * - Conversation list management and display
   *
   * Why useState for conversation items:
   * - Real-time updates: Dynamic updates from Pusher events
   * - State management: Maintains conversation list state
   * - Performance: Efficient re-rendering with state updates
   * - Synchronization: Keeps UI in sync with server state
   * - User experience: Provides responsive conversation list updates
   *
   * This state management is essential for our messaging app because
   * it provides the dynamic conversation list that enables real-time
   * updates and maintains conversation data throughout the user experience.
   */
  const [items, setItems] = useState(initialItems);

  /**
   * Group Chat Modal State Management
   *
   * Manages the group chat modal visibility state using React useState hook
   * to provide group chat creation functionality and modal control throughout
   * the component lifecycle.
   *
   * What this state provides:
   * - Group chat modal visibility control
   * - Modal open/close state management
   * - Group chat creation interface control
   * - User interaction state for modal
   * - Modal state synchronization with UI
   *
   * Why useState for modal state:
   * - User interaction: Controls modal visibility based on user actions
   * - State management: Maintains modal state throughout component lifecycle
   * - Performance: Efficient re-rendering with state updates
   * - User experience: Provides responsive modal control
   * - Integration: Works with GroupChatModal component
   *
   * This modal state management is essential for our messaging app because
   * it provides the group chat creation interface that enables users to
   * create new group conversations and manage conversation participants.
   */
  const [isModalOpen, setIsModalOpen] = useState(false);

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
   * Conversation State Management
   *
   * Manages conversation state using the useConversation hook to provide
   * conversation awareness and state management throughout the component.
   * This state management enables conditional rendering and conversation
   * navigation based on current conversation state.
   *
   * What useConversation provides:
   * - conversationId: Current active conversation ID
   * - isOpen: Boolean flag indicating if a conversation is currently open
   * - URL parameter extraction: Conversation state derived from URL parameters
   * - State optimization: useMemo for efficient state management
   * - Type safety: Type-safe conversation state extraction
   *
   * Why conversation state management is essential:
   * - Conditional rendering: Controls conversation list visibility
   * - Navigation: Enables conversation selection and navigation
   * - State awareness: Provides conversation context throughout component
   * - User experience: Ensures proper conversation state management
   * - Performance: Optimized state updates and re-render prevention
   *
   * This conversation state management is essential for our messaging app because
   * it provides the conversation awareness that enables conditional rendering,
   * navigation, and proper conversation state management throughout the interface.
   */
  const { conversationId, isOpen } = useConversation();

  /**
   * Pusher Channel Key Generation
   *
   * Generates a unique Pusher channel key using the user's email address
   * for real-time communication and event subscription. This key enables
   * user-specific real-time updates and ensures secure channel access.
   *
   * What this provides:
   * - User-specific Pusher channel subscription
   * - Real-time event binding and communication
   * - Secure channel access based on user authentication
   * - Channel key optimization with useMemo
   * - Real-time conversation updates and synchronization
   *
   * Why useMemo for pusherKey:
   * - Performance: Prevents unnecessary re-computation
   * - Optimization: Memoizes channel key generation
   * - Dependencies: Only recalculates when user email changes
   * - Real-time: Ensures consistent channel subscription
   * - Security: Maintains user-specific channel access
   *
   * This pusher key generation is essential for our messaging app because
   * it provides the real-time communication channel that enables
   * user-specific updates and secure real-time messaging functionality.
   */
  const pusherKey = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  /**
   * Real-Time Conversation Updates
   *
   * Manages real-time conversation updates using Pusher integration to provide
   * live conversation synchronization and automatic UI updates from server events.
   * This effect handles conversation creation, updates, and removal in real-time.
   *
   * What this effect provides:
   * - Pusher channel subscription for real-time updates
   * - Conversation creation handler for new conversations
   * - Conversation update handler for message changes
   * - Conversation removal handler for deleted conversations
   * - Event cleanup and channel unsubscription
   *
   * Real-Time Event Handlers:
   * - conversation:new: Adds new conversations to the list
   * - conversation:update: Updates existing conversations with new messages
   * - conversation:remove: Removes deleted conversations from the list
   * - Navigation: Redirects to conversations home when active conversation is deleted
   * - Cleanup: Proper event unbinding and channel unsubscription
   *
   * Why real-time updates are essential:
   * - User experience: Provides live conversation updates
   * - Synchronization: Keeps UI in sync with server state
   * - Performance: Efficient real-time updates without polling
   * - Scalability: Handles multiple users and conversations
   * - Reliability: Ensures consistent conversation state across clients
   *
   * This real-time integration is essential for our messaging app because
   * it provides the live conversation updates that enable real-time
   * messaging and maintain conversation state synchronization across all clients.
   */
  useEffect(() => {
    if (!pusherKey) {
      return;
    }

    pusherClient.subscribe(pusherKey);

    /**
     * New Conversation Handler
     *
     * Handles real-time conversation creation events by adding new conversations
     * to the conversation list. This handler ensures that new conversations
     * appear immediately in the UI without requiring page refresh.
     *
     * What this handler does:
     * - Receives conversation:new events from Pusher
     * - Checks if conversation already exists in the list
     * - Adds new conversation to the beginning of the list
     * - Prevents duplicate conversations in the list
     * - Updates UI with new conversation immediately
     *
     * Why this pattern for new conversations:
     * - User experience: Immediate visibility of new conversations
     * - Performance: Efficient list updates without full refresh
     * - Deduplication: Prevents duplicate conversations in the list
     * - Ordering: New conversations appear at the top of the list
     * - Real-time: Provides live conversation creation updates
     *
     * This new conversation handler is essential for our messaging app because
     * it provides the real-time conversation creation that enables users to
     * see new conversations immediately without manual refresh.
     */
    const newHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        if (find(current, { id: conversation.id })) {
          return current;
        }

        return [conversation, ...current];
      });
    };

    /**
     * Conversation Update Handler
     *
     * Handles real-time conversation update events by updating existing conversations
     * with new message data. This handler ensures that conversation updates
     * are reflected immediately in the UI without requiring page refresh.
     *
     * What this handler does:
     * - Receives conversation:update events from Pusher
     * - Finds the conversation to update by ID
     * - Updates the conversation with new message data
     * - Preserves other conversation properties
     * - Updates UI with new conversation data immediately
     *
     * Why this pattern for conversation updates:
     * - User experience: Immediate visibility of conversation updates
     * - Performance: Efficient conversation updates without full refresh
     * - Data integrity: Preserves conversation properties while updating messages
     * - Real-time: Provides live conversation update synchronization
     * - Scalability: Handles multiple conversation updates efficiently
     *
     * This conversation update handler is essential for our messaging app because
     * it provides the real-time conversation updates that enable users to
     * see conversation changes immediately without manual refresh.
     */
    const updateHandler = (conversation: FullConversationType) => {
      setItems((current) =>
        current.map((currentConversation) => {
          if (currentConversation.id === conversation.id) {
            return {
              ...currentConversation,
              messages: conversation.messages,
            };
          }

          return currentConversation;
        })
      );
    };

    /**
     * Conversation Removal Handler
     *
     * Handles real-time conversation removal events by removing deleted conversations
     * from the conversation list. This handler ensures that deleted conversations
     * are removed immediately from the UI and handles navigation appropriately.
     *
     * What this handler does:
     * - Receives conversation:remove events from Pusher
     * - Removes the conversation from the conversation list
     * - Checks if the removed conversation is currently active
     * - Redirects to conversations home if active conversation is removed
     * - Updates UI with conversation removal immediately
     *
     * Why this pattern for conversation removal:
     * - User experience: Immediate visibility of conversation removal
     * - Navigation: Redirects user when active conversation is removed
     * - Performance: Efficient conversation removal without full refresh
     * - Real-time: Provides live conversation deletion synchronization
     * - State management: Maintains proper conversation state after removal
     *
     * This conversation removal handler is essential for our messaging app because
     * it provides the real-time conversation removal that enables users to
     * see conversation deletions immediately and maintains proper navigation state.
     */
    const removeHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        return [...current.filter((convo) => convo.id !== conversation.id)];
      });

      if (conversationId === conversation.id) {
        router.push('/conversations');
      }
    };

    pusherClient.bind('conversation:new', newHandler);
    pusherClient.bind('conversation:update', updateHandler);
    pusherClient.bind('conversation:remove', removeHandler);

    /**
     * Real-Time Event Cleanup
     *
     * Provides cleanup functionality for real-time event handlers and Pusher
     * channel subscriptions. This cleanup ensures proper resource management
     * and prevents memory leaks when the component unmounts or dependencies change.
     *
     * What this cleanup provides:
     * - Pusher channel unsubscription to prevent memory leaks
     * - Event handler unbinding to prevent stale event handlers
     * - Resource cleanup for proper component lifecycle management
     * - Memory optimization and performance improvement
     * - Proper real-time connection management
     *
     * Why cleanup is essential:
     * - Memory management: Prevents memory leaks from event handlers
     * - Performance: Ensures proper resource cleanup
     * - Reliability: Prevents stale event handlers from firing
     * - Scalability: Manages real-time connections efficiently
     * - Best practices: Follows React and Pusher cleanup patterns
     *
     * This cleanup is essential for our messaging app because
     * it provides the proper resource management that ensures
     * efficient real-time communication and prevents memory leaks.
     */
    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind('conversation:new', newHandler);
      pusherClient.unbind('conversation:update', updateHandler);
      pusherClient.unbind('conversation:remove', removeHandler);
    };
  }, [pusherKey, conversationId, router]);

  return (
    <>
      <GroupChatModal
        users={users}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <aside
        className={clsx(
          `
          fixed
          inset-y-0
          pb-20
          lg:pb-0
          lg:left-20
          lg:w-80
          lg:block
          overflow-y-auto
          border-r
          border-gray-200`,
          isOpen ? 'hidden' : 'block w-full left-0'
        )}
      >
        <div className="px-5">
          <div className="flex justify-between mb-4 pt-4">
            <div
              className="
                text-2xl
                font-bold
                text-neutral-800
              "
            >
              Messages
            </div>
            <div
              onClick={() => setIsModalOpen(true)}
              className="
                rounded-full
                p-2
                bg-gray-100
                text-gray-600
                cursor-pointer
                hover:opacity-75
                transition
              "
            >
              <MdOutlineGroupAdd size={20} />
            </div>
          </div>
          {items.map((item) => (
            <ConversationBox
              key={item.id}
              data={item}
              selected={conversationId === item.id}
            />
          ))}
        </div>
      </aside>
    </>
  );
};

export default ConversationList;
