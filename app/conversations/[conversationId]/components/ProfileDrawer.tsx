/**
 * Profile Drawer Component for Dex Real-Time Messenger
 *
 * This file provides a specialized profile drawer component for our Next.js 14 real-time
 * messaging application. It implements conversation participant information display with
 * slide-out drawer animation, real-time presence tracking, and conversation management
 * features that ensure optimal user experience for profile viewing and conversation
 * management.
 *
 * Key Features:
 * - Slide-out drawer with smooth animations and backdrop overlay
 * - Conversation participant information display (individual and group)
 * - Real-time presence tracking with active/offline status
 * - Conversation management with deletion functionality
 * - Responsive design with mobile and desktop optimization
 * - Accessibility features with Headless UI Dialog
 *
 * Profile Display Features:
 * - Individual conversation: Single user profile with avatar and details
 * - Group conversation: Multiple user avatars and member information
 * - Real-time presence: Active/offline status with live updates
 * - User information: Email, join date, and conversation metadata
 * - Conversation actions: Delete conversation with confirmation
 * - Smooth animations: Slide-in/out transitions with backdrop
 *
 * This component is essential for our messaging app because it provides the
 * profile viewing interface that enables users to access participant
 * information and manage conversations while maintaining proper user
 * experience and real-time functionality throughout our messaging platform.
 *
 * @fileoverview Profile drawer component for Next.js 14 real-time messaging application
 * @author Dayle Cortes
 * @since 2025
 */

'use client';

import Avatar from '@/app/components/Avatar';
import AvatarGroup from '@/app/components/AvatarGroup';
import useOtherUser from '@/app/hooks/useOtherUser';
import { Dialog, Transition } from '@headlessui/react';
import { Conversation, User } from '@prisma/client';
import { format } from 'date-fns';
import { Fragment, useMemo, useState } from 'react';
import { IoClose, IoTrash } from 'react-icons/io5';
import ConfirmModal from './ConfirmModal';
import useActiveList from '@/app/hooks/useActiveList';

/**
 * Profile Drawer Props Interface
 *
 * Defines the props interface for the ProfileDrawer component, specifying
 * the required data for profile display and drawer functionality.
 *
 * @interface ProfileDrawerProps
 * @property {boolean} isOpen - Whether the drawer is currently open and visible
 * @property {() => void} onClose - Callback function to close the drawer
 * @property {Conversation & { users: User[] }} data - Conversation data with user information
 */
interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: Conversation & {
    users: User[];
  };
}

/**
 * Profile Drawer Component
 *
 * A specialized profile drawer component that provides conversation participant
 * information display with slide-out drawer animation, real-time presence tracking,
 * and conversation management for our messaging application. This component
 * implements profile viewing functionality with smooth animations and
 * accessibility features that ensures optimal user experience for profile
 * viewing and conversation management.
 *
 * Key Capabilities:
 * - Slide-out drawer with smooth animations and backdrop overlay
 * - Conversation participant information display (individual and group)
 * - Real-time presence tracking with active/offline status
 * - Conversation management with deletion functionality
 * - Responsive design with mobile and desktop optimization
 * - Accessibility features with Headless UI Dialog
 *
 * Profile Display Features:
 * - Individual conversation: Single user profile with avatar and details
 * - Group conversation: Multiple user avatars and member information
 * - Real-time presence: Active/offline status with live updates
 * - User information: Email, join date, and conversation metadata
 * - Conversation actions: Delete conversation with confirmation
 * - Smooth animations: Slide-in/out transitions with backdrop
 *
 * Usage Patterns:
 * - Header component: Profile drawer access from conversation header
 * - Profile viewing: Participant information display and management
 * - Conversation management: Delete conversation with confirmation
 * - Real-time updates: Live presence tracking and status updates
 * - Drawer interaction: Slide-out drawer with smooth animations
 *
 * Layout Features:
 * - Slide-out drawer: Right-side slide-out with smooth transitions
 * - Backdrop overlay: Semi-transparent backdrop with click-to-close
 * - Profile content: Avatar, title, status, and user information
 * - Action buttons: Delete conversation with confirmation modal
 * - Responsive design: Mobile and desktop optimized layout
 *
 * Animation Features:
 * - Backdrop fade: Smooth fade in/out for backdrop overlay
 * - Drawer slide: Transform transition for slide-in/out effect
 * - Duration control: 500ms transitions for smooth animation
 * - Hardware acceleration: Transform-based animations for performance
 * - Accessibility: Proper focus management and keyboard navigation
 *
 * This component is crucial for our messaging app because it provides the
 * profile viewing interface that enables users to access participant
 * information and manage conversations while maintaining proper user
 * experience and real-time functionality throughout our messaging platform.
 *
 * @param {ProfileDrawerProps} props - Component props for profile drawer configuration
 * @param {boolean} props.isOpen - Whether the drawer is currently open and visible
 * @param {() => void} props.onClose - Callback function to close the drawer
 * @param {Conversation & { users: User[] }} props.data - Conversation data with user information
 * @returns {JSX.Element} Profile drawer with participant information and conversation management
 *
 * @example
 * ```tsx
 * // In Header component
 * <ProfileDrawer
 *   isOpen={drawerOpen}
 *   onClose={() => setDrawerOpen(false)}
 *   data={conversation}
 * />
 *
 * // With conversation data
 * <ProfileDrawer isOpen={isOpen} onClose={handleClose} data={conversationData} />
 * ```
 */
const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  /**
   * Other User Identification
   *
   * Identifies the "other" user in the conversation using the useOtherUser hook
   * to provide user context for individual conversations. This identification
   * enables proper user information display and presence tracking.
   *
   * What useOtherUser provides:
   * - Other user identification from conversation data
   * - User context for individual conversations
   * - User data for profile display
   * - User information for presence tracking
   * - Performance optimization with useMemo
   *
   * Why other user identification is essential:
   * - User context: Provides user information for individual conversations
   * - Profile display: Enables user profile information display
   * - Presence tracking: Provides user context for active status
   * - User experience: Ensures proper user identification
   * - Performance: Efficient user identification with memoization
   *
   * This other user identification is essential for our messaging app because
   * it provides the user context that enables proper profile
   * display and presence tracking throughout the messaging interface.
   */
  const otherUser = useOtherUser(data);

  /**
   * Confirmation Modal State Management
   *
   * Manages the confirmation modal open/close state using React useState hook
   * to provide conversation deletion confirmation functionality. This state
   * management enables conversation deletion with proper confirmation.
   *
   * What this state provides:
   * - Confirmation modal visibility state
   * - Confirmation modal open/close control
   * - Conversation deletion confirmation
   * - User interaction state management
   * - Modal integration for deletion confirmation
   *
   * Why useState for confirmOpen:
   * - User interaction: Controls confirmation modal visibility
   * - State management: Maintains modal state throughout component lifecycle
   * - User experience: Provides confirmation for destructive actions
   * - Performance: Efficient re-rendering with state updates
   * - Integration: Works with ConfirmModal component
   *
   * This confirmation modal state management is essential for our messaging app because
   * it provides the conversation deletion confirmation that enables users to
   * safely delete conversations throughout the messaging interface.
   */
  const [confirmOpen, setConfirmOpen] = useState(false);

  /**
   * Active User List Integration
   *
   * Integrates with the useActiveList hook to get the global active user list
   * for real-time presence tracking. This integration provides live presence
   * status for conversation participants.
   *
   * What useActiveList provides:
   * - Global active user list from Zustand store
   * - Real-time presence tracking
   * - Active user synchronization
   * - Presence state management
   * - Performance optimization with Zustand
   *
   * Why active list integration is essential:
   * - Real-time presence: Provides live user presence status
   * - User experience: Shows active/offline status for participants
   * - Global state: Maintains consistent presence across app
   * - Performance: Efficient presence tracking with Zustand
   * - Synchronization: Keeps presence state in sync across components
   *
   * This active list integration is essential for our messaging app because
   * it provides the real-time presence tracking that enables users to
   * see live participant status throughout the messaging interface.
   */
  const { members } = useActiveList();

  /**
   * Active Status Detection
   *
   * Determines if the other user is currently active by checking their email
   * against the global active user list. This detection provides real-time
   * presence status for individual conversations.
   *
   * What this provides:
   * - Real-time active status for other user
   * - Presence detection using email comparison
   * - Active/offline status determination
   * - User experience enhancement
   * - Real-time presence updates
   *
   * Why active status detection is essential:
   * - User experience: Shows live presence status for participants
   * - Real-time updates: Provides immediate presence changes
   * - User context: Helps users understand participant availability
   * - Performance: Efficient presence checking with array indexOf
   * - Integration: Works with global active user list
   *
   * Active Status Logic:
   * - Email comparison: Checks otherUser.email against members array
   * - Index check: Uses indexOf to find user in active list
   * - Boolean result: Returns true if user is active, false if offline
   * - Real-time updates: Updates automatically when presence changes
   * - Performance: Efficient array lookup for presence detection
   *
   * This active status detection is essential for our messaging app because
   * it provides the real-time presence information that enables users to
   * see live participant status throughout the messaging interface.
   */
  const isActive = members.indexOf(otherUser?.email!) !== -1;

  /**
   * Joined Date Formatting
   *
   * Formats the other user's creation date into a human-readable format
   * using date-fns for display in the profile drawer. This formatting
   * provides user-friendly date information for individual conversations.
   *
   * What this provides:
   * - Formatted join date for user display
   * - Human-readable date format
   * - User-friendly date information
   * - Profile information enhancement
   * - Date formatting optimization
   *
   * Why useMemo for joinedDate:
   * - Performance optimization: Prevents unnecessary date formatting
   * - Dependency management: Only recalculates when otherUser.createdAt changes
   * - User experience: Provides formatted date for profile display
   * - Consistency: Ensures consistent date formatting
   * - Efficiency: Avoids repeated date formatting on re-renders
   *
   * Date Formatting Logic:
   * - Date creation: Creates new Date from otherUser.createdAt
   * - Format application: Uses date-fns format with 'PP' pattern
   * - Human-readable: Produces user-friendly date format
   * - Memoization: Caches result until otherUser.createdAt changes
   * - Performance: Efficient date formatting with memoization
   *
   * This joined date formatting is essential for our messaging app because
   * it provides the user-friendly date information that enhances
   * profile display and user experience throughout the messaging interface.
   */
  const joinedDate = useMemo(() => {
    return format(new Date(otherUser.createdAt), 'PP');
  }, [otherUser.createdAt]);

  /**
   * Conversation Title Generation
   *
   * Generates the appropriate title for the conversation based on whether
   * it's a group conversation or individual conversation. This title
   * provides clear identification for the conversation in the profile drawer.
   *
   * What this provides:
   * - Conversation title for profile display
   * - Group vs individual conversation handling
   * - Clear conversation identification
   * - User experience enhancement
   * - Title generation optimization
   *
   * Why useMemo for title:
   * - Performance optimization: Prevents unnecessary title generation
   * - Dependency management: Only recalculates when data.name or otherUser.name changes
   * - User experience: Provides clear conversation identification
   * - Consistency: Ensures consistent title display
   * - Efficiency: Avoids repeated title generation on re-renders
   *
   * Title Generation Logic:
   * - Group conversation: Uses data.name if available, falls back to otherUser.name
   * - Individual conversation: Uses otherUser.name for user identification
   * - Fallback handling: Ensures title is always available
   * - Memoization: Caches result until dependencies change
   * - Performance: Efficient title generation with memoization
   *
   * This conversation title generation is essential for our messaging app because
   * it provides the clear conversation identification that enhances
   * user experience and profile display throughout the messaging interface.
   */
  const title = useMemo(() => {
    return data.name || otherUser.name;
  }, [data.name, otherUser.name]);

  /**
   * Status Text Generation
   *
   * Generates the appropriate status text for the conversation based on
   * whether it's a group conversation or individual conversation with
   * real-time presence tracking. This status provides user context
   * for conversation participants.
   *
   * What this provides:
   * - Status text for conversation display
   * - Group vs individual conversation handling
   * - Real-time presence status for individuals
   * - Member count for group conversations
   * - User context enhancement
   *
   * Why useMemo for statusText:
   * - Performance optimization: Prevents unnecessary status generation
   * - Dependency management: Only recalculates when data or isActive changes
   * - User experience: Provides clear status information
   * - Consistency: Ensures consistent status display
   * - Efficiency: Avoids repeated status generation on re-renders
   *
   * Status Text Logic:
   * - Group conversation: Shows member count (e.g., "3 members")
   * - Individual conversation: Shows active/offline status based on presence
   * - Real-time updates: Updates automatically when presence changes
   * - Memoization: Caches result until dependencies change
   * - Performance: Efficient status generation with memoization
   *
   * This status text generation is essential for our messaging app because
   * it provides the user context that enhances conversation
   * understanding and user experience throughout the messaging interface.
   */
  const statusText = useMemo(() => {
    if (data.isGroup) {
      return `${data.users.length} members`;
    }

    return isActive ? 'Active' : 'Offline';
  }, [data, isActive]);

  return (
    <>
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
      />
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="
                fixed
                inset-0
                bg-black
                bg-opacity-40
              "
            />
          </Transition.Child>
          <div
            className="
              fixed
              inset-0
              overflow-hidden
            "
          >
            <div
              className="
                absolute
                inset-0
                overflow-hidden
              "
            >
              <div
                className="
                  pointer-events-none
                  fixed
                  inset-y-0
                  right-0
                  flex
                  max-w-full
                  pl-10
                "
              >
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel
                    className="
                      pointer-events-auto
                      w-screen
                      max-w-md
                    "
                  >
                    <div
                      className="
                        flex
                        h-full
                        flex-col
                        overflow-y-scroll
                        bg-white
                        py-6
                        shadow-xl
                      "
                    >
                      <div className="px-4 sm:px-6">
                        <div
                          className="
                            flex
                            items-start
                            justify-end
                          "
                        >
                          <div
                            className="
                              ml-3
                              flex
                              h-7
                              items-center
                            "
                          >
                            <button
                              type="button"
                              className="
                                rounded-md
                                bg-white
                                text-gray-400
                                hover:text-gray-500
                                focus:outline-none
                                focus:ring-2
                                focus:ring-skye-500
                                focus:ring-offst-2
                              "
                              onClick={onClose}
                            >
                              <span className="sr-only">Close panel</span>
                              <IoClose size={24} />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div
                        className="
                          relative mt-6
                          flex-1 px-4
                          sm:px-6
                        "
                      >
                        <div className="flex flex-col items-center">
                          <div className="mb-2">
                            {data.isGroup ? (
                              <AvatarGroup users={data.users} />
                            ) : (
                              <Avatar user={otherUser} />
                            )}
                          </div>
                          <div>{title}</div>
                          <div className="text-sm text-gray-500">
                            {statusText}
                          </div>
                          <div className="flex gap-10 my-8">
                            <div
                              onClick={() => setConfirmOpen(true)}
                              className="
                                flex
                                flex-col
                                gap-3
                                items-center
                                cursor-pointer
                                hover:opacity-75
                              "
                            >
                              <div
                                className="
                                  w-10
                                  h-10
                                  bg-neutral-100
                                  rounded-full
                                  flex
                                  items-center
                                  justify-center
                                "
                              >
                                <IoTrash size={20} />
                              </div>
                              <div
                                className="
                                  text-sm
                                  font-light
                                  text-neutral-600
                                "
                              >
                                Delete
                              </div>
                            </div>
                          </div>
                          <div
                            className="
                              w-full
                              pb-5
                              pt-5
                              sm:px-0
                              sm:pt-0
                            "
                          >
                            <dl
                              className="
                                space-y-8
                                px-4
                                sm:space-y-6
                                sm:px-6
                              "
                            >
                              {data.isGroup && (
                                <div>
                                  <dt
                                    className="
                                      text-sm
                                      font-medium
                                      text-gray-500
                                      sm:w-40
                                      sm:flex-shrink-0
                                    "
                                  >
                                    Emails
                                  </dt>
                                  {data.users.map((user, index) => {
                                    return (
                                      <dd
                                        key={index}
                                        className="
                                          mt-1
                                          text-sm
                                          text-gray-900
                                          sm:col-span-2
                                        "
                                      >
                                        {user.email}
                                      </dd>
                                    );
                                  })}
                                </div>
                              )}
                              {!data.isGroup && (
                                <div>
                                  <dt
                                    className="
                                      text-sm
                                      font-medium
                                      text-gray-500
                                      sm:w-40
                                      sm:flex-shrink-0
                                    "
                                  >
                                    Email
                                  </dt>
                                  <dd
                                    className="
                                      mt-1
                                      text-sm
                                      text-gray-900
                                      sm:col-span-2
                                    "
                                  >
                                    {otherUser.email}
                                  </dd>
                                </div>
                              )}
                              {!data.isGroup && (
                                <>
                                  <hr />
                                  <div>
                                    <dt
                                      className="
                                        text-sm
                                        font-medium
                                        text-gray-500
                                        sm:w-40
                                        sm:flex-shrink-0
                                      "
                                    >
                                      Joined
                                    </dt>
                                    <dd
                                      className="
                                        mt-1
                                        text-sm
                                        text-gray-900
                                        sm:col-span-2
                                      "
                                    >
                                      <time dateTime={joinedDate}>
                                        {joinedDate}
                                      </time>
                                    </dd>
                                  </div>
                                </>
                              )}
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default ProfileDrawer;
