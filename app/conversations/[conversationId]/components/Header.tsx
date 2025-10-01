/**
 * Conversation Header Component for Dex Real-Time Messenger
 *
 * This file provides the conversation header component for our Next.js 14 real-time
 * messaging application. It implements conversation metadata display, participant
 * information, real-time presence tracking, and search functionality that ensures
 * optimal user experience for conversation identification and interaction.
 *
 * Key Features:
 * - Conversation metadata display with participant information
 * - Real-time presence tracking for direct conversations
 * - Group conversation support with member count display
 * - Message search functionality with Search component integration
 * - Profile drawer access for conversation management
 * - Responsive design with mobile and desktop optimization
 *
 * Conversation Header Features:
 * - Conversation name and participant display
 * - Real-time active status for direct conversations
 * - Group member count for group conversations
 * - Mobile navigation with back button
 * - Search functionality with message targeting
 * - Profile drawer access for conversation settings
 *
 * This component is essential for our messaging app because it provides the
 * conversation identification and interaction interface that enables users to
 * identify conversations, access search functionality, and manage conversation
 * settings while maintaining real-time presence awareness throughout our
 * messaging platform.
 *
 * @fileoverview Conversation header component for Next.js 14 real-time messaging application
 * @author Dayle Cortes
 * @since 2025
 */

'use client';

import Avatar from '@/app/components/Avatar';
import AvatarGroup from '@/app/components/AvatarGroup';
import useOtherUser from '@/app/hooks/useOtherUser';
import { Conversation, User } from '@prisma/client';
import Link from 'next/link';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { HiChevronLeft, HiEllipsisHorizontal } from 'react-icons/hi2';
import ProfileDrawer from './ProfileDrawer';
import useActiveList from '@/app/hooks/useActiveList';
import Search from './Search';
import clsx from 'clsx';
import { FullMessageType } from '@/app/types';

/**
 * Header Component Props Interface
 *
 * Defines the props interface for the Header component, specifying
 * the required data for conversation header display and functionality.
 *
 * @interface HeaderProps
 * @property {Conversation & { users: User[] }} conversation - Conversation data with user participants
 * @property {FullMessageType[]} messages - Array of messages for search functionality
 * @property {Dispatch<SetStateAction<string>>} setSearchTargetId - Function to set search target message ID
 */
interface HeaderProps {
  conversation: Conversation & {
    users: User[];
  };
  messages: FullMessageType[];
  setSearchTargetId: Dispatch<SetStateAction<string>>;
}

/**
 * Conversation Header Component
 *
 * A comprehensive conversation header component that provides conversation
 * metadata display, participant information, real-time presence tracking,
 * and search functionality for our messaging application. This component
 * implements conversation identification, user interaction, and responsive
 * design that ensures optimal user experience for conversation management
 * and real-time messaging.
 *
 * Key Capabilities:
 * - Conversation metadata display with participant information
 * - Real-time presence tracking for direct conversations
 * - Group conversation support with member count display
 * - Message search functionality with Search component integration
 * - Profile drawer access for conversation management
 * - Responsive design with mobile and desktop optimization
 *
 * Conversation Header Features:
 * - Conversation name and participant display
 * - Real-time active status for direct conversations
 * - Group member count for group conversations
 * - Mobile navigation with back button
 * - Search functionality with message targeting
 * - Profile drawer access for conversation settings
 *
 * Usage Patterns:
 * - Individual conversation pages: Main header for conversation display
 * - Conversation identification: User identification and conversation metadata
 * - Message search: Search functionality with message targeting
 * - Profile management: Access to conversation settings and participant information
 * - Mobile navigation: Back button for mobile conversation navigation
 *
 * Layout Features:
 * - Responsive design: Mobile and desktop optimized header layout
 * - Participant display: Avatar or AvatarGroup based on conversation type
 * - Status display: Active/offline status for direct conversations
 * - Action buttons: Search and profile drawer access
 * - Mobile navigation: Back button for mobile conversation navigation
 *
 * Real-Time Features:
 * - Presence tracking: Real-time active status for direct conversations
 * - User identification: Other user identification for direct conversations
 * - Group support: Member count display for group conversations
 * - Status updates: Live presence status updates via Pusher integration
 * - User experience: Clear indication of conversation participants and status
 *
 * This component is crucial for our messaging app because it provides the
 * conversation identification and interaction interface that enables users to
 * identify conversations, access search functionality, and manage conversation
 * settings while maintaining real-time presence awareness throughout our
 * messaging platform.
 *
 * @param {HeaderProps} props - Component props for conversation header configuration
 * @param {Conversation & { users: User[] }} props.conversation - Conversation data with user participants
 * @param {FullMessageType[]} props.messages - Array of messages for search functionality
 * @param {Dispatch<SetStateAction<string>>} props.setSearchTargetId - Function to set search target message ID
 * @returns {JSX.Element} Conversation header with metadata, search, and profile access
 *
 * @example
 * ```tsx
 * // In conversation page component
 * <Header
 *   conversation={conversation}
 *   messages={messages}
 *   setSearchTargetId={setSearchTargetId}
 * />
 *
 * // With conversation data from getConversationById action
 * <Header conversation={conversationData} messages={messageData} setSearchTargetId={handleSearch} />
 * ```
 */
const Header: React.FC<HeaderProps> = ({
  conversation,
  messages,
  setSearchTargetId,
}) => {
  /**
   * Other User Identification
   *
   * Identifies the "other" user in a direct conversation using the useOtherUser hook
   * to provide user identification for direct conversations and group chat
   * participant display. This identification ensures proper user context.
   *
   * What useOtherUser provides:
   * - Other user identification: User object for the conversation participant
   * - Group conversation handling: Returns null for group chats
   * - Type safety: Type-safe user extraction from conversation data
   * - Performance optimization: useMemo for efficient user extraction
   * - User context: Provides user information for conversation display
   *
   * Why useOtherUser is essential:
   * - User display: Shows the other participant in direct conversations
   * - Conversation context: Enables proper conversation identification
   * - User experience: Clear indication of conversation participants
   * - Group chat handling: Differentiates direct from group conversations
   * - Performance: Efficient user extraction without re-computation
   *
   * This other user identification is essential for our messaging app because
   * it provides the user context that enables proper user identification and
   * conversation display throughout the messaging platform.
   */
  const otherUser = useOtherUser(conversation);

  /**
   * Profile Drawer State Management
   *
   * Manages the profile drawer open/close state using React useState hook
   * to provide profile drawer functionality for conversation management
   * and participant information access.
   *
   * What this state provides:
   * - Profile drawer visibility state
   * - Profile drawer open/close control
   * - Conversation management access
   * - Participant information display
   * - User interaction state management
   *
   * Why useState for drawerOpen:
   * - User interaction: Controls profile drawer visibility
   * - State management: Maintains drawer state throughout component lifecycle
   * - User experience: Provides profile drawer access for conversation management
   * - Performance: Efficient re-rendering with state updates
   * - Integration: Works with ProfileDrawer component
   *
   * This profile drawer state management is essential for our messaging app because
   * it provides the profile drawer functionality that enables users to access
   * conversation settings and participant information throughout the messaging interface.
   */
  const [drawerOpen, setDrawerOpen] = useState(false);

  /**
   * Search Bar State Management
   *
   * Manages the search bar open/close state using React useState hook
   * to provide search functionality for message searching and targeting
   * within the conversation.
   *
   * What this state provides:
   * - Search bar visibility state
   * - Search bar open/close control
   * - Message search functionality
   * - Search interaction state management
   * - User experience for search access
   *
   * Why useState for searchBarOpen:
   * - User interaction: Controls search bar visibility
   * - State management: Maintains search state throughout component lifecycle
   * - User experience: Provides search functionality for message finding
   * - Performance: Efficient re-rendering with state updates
   * - Integration: Works with Search component
   *
   * This search bar state management is essential for our messaging app because
   * it provides the search functionality that enables users to find and target
   * specific messages within conversations throughout the messaging interface.
   */
  const [searchBarOpen, setSearchBarOpen] = useState(false);

  /**
   * Active User List Integration
   *
   * Integrates with the global active user list (Zustand store) to determine
   * the online status of the other user in a direct conversation. This
   * integration provides real-time presence tracking for user availability.
   *
   * What useActiveList provides:
   * - Global list of active user emails
   * - Real-time presence tracking
   * - Active status for user display
   * - Zustand store integration
   * - Performance optimization with memoized selector
   *
   * Why active status is essential:
   * - User experience: Shows online/offline status of other user
   * - Real-time presence: Provides live updates for user availability
   * - Conversation context: Informs user about participant availability
   * - UI clarity: Visual indicator for active users
   * - Integration: Works with global active user list
   *
   * This active status integration is essential for our messaging app because
   * it provides the real-time presence tracking that enables users to see
   * the online status of other participants, enhancing user experience.
   */
  const { members } = useActiveList();
  const isActive = members.indexOf(otherUser?.email!) !== -1;

  /**
   * Status Text Generation
   *
   * Generates the appropriate status text for the conversation header based on
   * conversation type (group or direct) and user presence status. This status
   * text provides clear indication of conversation participants and their
   * availability status.
   *
   * What this provides:
   * - Group conversation: Member count display (e.g., "3 members")
   * - Direct conversation: Active/offline status based on real-time presence
   * - User experience: Clear indication of conversation participants
   * - Real-time updates: Live presence status updates
   * - Performance optimization: useMemo for efficient status calculation
   *
   * Why useMemo for statusText:
   * - Performance optimization: Prevents unnecessary re-computation
   * - Status calculation: Efficiently determines status based on conversation type
   * - Dependency management: Only recalculates when conversation or isActive changes
   * - User experience: Efficient status display updates
   * - Consistency: Maintains consistent status text data
   *
   * Status Text Logic:
   * - Group conversations: Shows member count for group identification
   * - Direct conversations: Shows "Active" or "Offline" based on real-time presence
   * - Real-time updates: Status updates automatically when presence changes
   * - User experience: Clear indication of conversation participants and status
   *
   * This status text generation is essential for our messaging app because
   * it provides the status information that enables users to understand
   * conversation participants and their availability status throughout the messaging interface.
   */
  const statusText = useMemo(() => {
    if (conversation.isGroup) {
      return `${conversation.users.length} members`;
    }

    return isActive ? 'Active' : 'Offline';
  }, [conversation, isActive]);

  /**
   * Search Toggle Handler
   *
   * Handles the search bar toggle functionality using useCallback for performance
   * optimization. This handler provides search bar open/close functionality
   * for message searching within the conversation.
   *
   * What this handler does:
   * - Toggles search bar visibility state
   * - Provides search functionality access
   * - Manages search interaction state
   * - Enables message searching within conversation
   * - Integrates with Search component
   *
   * Why useCallback for toggleSearch:
   * - Performance optimization: Prevents unnecessary re-renders
   * - Event handling: Efficiently handles search toggle events
   * - Dependency management: Only re-creates when searchBarOpen changes
   * - User experience: Provides responsive search functionality
   * - Consistency: Maintains consistent search toggle behavior
   *
   * Search Toggle Logic:
   * - Toggle functionality: Switches between open and closed states
   * - User experience: Provides easy access to search functionality
   * - State management: Maintains search bar visibility state
   * - Integration: Works with Search component for message searching
   * - Performance: Optimized with useCallback for efficient re-rendering
   *
   * This search toggle handler is essential for our messaging app because
   * it provides the search functionality that enables users to find and target
   * specific messages within conversations throughout the messaging interface.
   */
  const toggleSearch = useCallback(() => {
    setSearchBarOpen(searchBarOpen === false ? true : false);
  }, [searchBarOpen]);

  return (
    <>
      <ProfileDrawer
        data={conversation}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
      <div
        className="
          bg-white
          w-full
          flex
          border-b-[1px]
          sm:px-4
          py-3
          px-4
          lg:px-6
          justify-between
          items-center
          shadow-sm
          gap-3
        "
      >
        <div className="flex flex-shrink-0 gap-3 items-center">
          <Link
            href="/conversations"
            className="
              lg:hidden
              block
              text-sky-500
              hover:text-600
              transition
              cursor-pointer
            "
          >
            <HiChevronLeft size={32} />
          </Link>
          {conversation.isGroup ? (
            <AvatarGroup users={conversation.users} />
          ) : (
            <Avatar user={otherUser} />
          )}

          <div className="flex flex-col">
            <div>{conversation.name || otherUser.name}</div>
            <div
              className="
                text-sm
                font-light
                text-neutral-500
              "
            >
              {statusText}
            </div>
          </div>
        </div>
        <div
          className={clsx(
            `
            flex
            w-full
            gap-3
            justify-end
            items-center
            `
          )}
        >
          <Search
            searchBarOpen={searchBarOpen}
            onClick={() => toggleSearch()}
            onClose={() => setSearchBarOpen(false)}
            messages={messages}
            setSearchTargetId={setSearchTargetId}
          />
          <HiEllipsisHorizontal
            size={32}
            onClick={() => {
              setDrawerOpen(true);
            }}
            className="
              text-sky-500
              cursor-pointer
              hover:text-sky-600
              transition
            "
          />
        </div>
      </div>
    </>
  );
};

export default Header;
