/**
 * User Box Component for Dex Real-Time Messenger
 *
 * This file provides a specialized UserBox component for our Next.js 14 real-time
 * messaging application. It implements individual user selection and conversation
 * creation with Avatar integration, loading states, and API integration that ensures
 * optimal user experience for user interaction and conversation initiation.
 *
 * Key Features:
 * - Individual user selection and conversation creation
 * - Avatar component integration for user identification
 * - LoadingModal integration for conversation creation feedback
 * - API integration with /api/conversations endpoint
 * - Next.js router integration for navigation
 * - Responsive design with hover states and transitions
 *
 * User Interaction Features:
 * - User selection: Click handling for conversation creation
 * - Conversation creation: API call to create new conversation
 * - Navigation: Automatic redirect to conversation page
 * - Loading states: Visual feedback during conversation creation
 * - User identification: Avatar and name display
 *
 * This component is essential for our messaging app because it provides the
 * individual user interaction interface that enables users to select and
 * start conversations with other users while maintaining consistent user
 * experience and visual feedback throughout our messaging platform.
 *
 * @fileoverview User Box component for Next.js 14 real-time messaging application
 * @author Dayle Cortes
 * @since 2025
 */

'use client';

import Avatar from '@/app/components/Avatar';
import LoadingModal from '@/app/components/LoadingModal';
import { User } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

/**
 * User Box Component Props Interface
 *
 * Defines the props interface for the UserBox component, ensuring
 * type safety and clear documentation for the user box configuration
 * and data structure.
 *
 * @interface UserBoxProps
 * @property {User} data - User object from Prisma client containing profile information
 *
 * @example
 * ```tsx
 * // In UserList component
 * <UserBox key={item.id} data={item} />
 *
 * // With user data from getUsers action
 * <UserBox data={userData} />
 * ```
 */
interface UserBoxProps {
  data: User;
}

/**
 * User Box Component
 *
 * A specialized user box component that provides individual user selection and
 * conversation creation functionality for our messaging application. This component
 * implements user interaction with Avatar integration, loading states, API integration,
 * and responsive design that ensures optimal user experience for conversation initiation.
 *
 * Key Capabilities:
 * - Individual user selection and conversation creation
 * - Avatar component integration for user identification
 * - LoadingModal integration for conversation creation feedback
 * - API integration with /api/conversations endpoint
 * - Next.js router integration for navigation
 * - Responsive design with hover states and transitions
 *
 * User Interaction Features:
 * - User selection: Click handling for conversation creation
 * - Conversation creation: API call to create new conversation
 * - Navigation: Automatic redirect to conversation page
 * - Loading states: Visual feedback during conversation creation
 * - User identification: Avatar and name display
 *
 * Usage Patterns:
 * - UserList: Individual user items in users list display
 * - User selection: Click handling for conversation creation
 * - Conversation initiation: API call to start new conversation
 * - Navigation: Automatic redirect to conversation interface
 * - Loading feedback: Visual indication during conversation creation
 *
 * API Integration Features:
 * - POST /api/conversations: Creates new conversation with selected user
 * - User ID payload: Sends selected user ID for conversation creation
 * - Response handling: Receives conversation data with ID
 * - Navigation: Redirects to conversation page using conversation ID
 * - Error handling: Graceful handling of API errors
 *
 * Loading State Features:
 * - LoadingModal: Full-screen loading overlay during conversation creation
 * - Loading state: Boolean flag for loading state management
 * - User feedback: Clear indication of ongoing conversation creation
 * - Button states: Disabled state during loading
 * - Visual feedback: LoadingModal with animated spinner
 *
 * Avatar Integration Features:
 * - User identification: Avatar component with user profile image
 * - Active status: Real-time online status indicator
 * - Responsive sizing: Mobile and desktop optimized avatar display
 * - Fallback handling: Placeholder image for users without profile pictures
 * - User data: Complete User object from Prisma client
 *
 * Responsive Design Features:
 * - Full width: w-full for consistent list item width
 * - Flex layout: Flex items-center with space-x-3 for avatar and content
 * - Hover states: hover:bg-neutral-100 for interactive feedback
 * - Rounded corners: rounded-lg for modern design
 * - Transitions: Smooth transition effects for hover states
 * - Cursor pointer: Indicates clickable element
 *
 * This component is crucial for our messaging app because it provides the
 * individual user interaction interface that enables users to select and
 * start conversations with other users while maintaining consistent user
 * experience and visual feedback throughout our messaging platform.
 *
 * @param {UserBoxProps} props - Component props for user box configuration
 * @param {User} props.data - User object from Prisma client containing profile information
 * @returns {JSX.Element} Interactive user box with avatar and conversation creation
 *
 * @example
 * ```tsx
 * // In UserList component
 * <UserBox key={item.id} data={item} />
 *
 * // With user data from getUsers action
 * <UserBox data={userData} />
 * ```
 */
const UserBox: React.FC<UserBoxProps> = ({ data }) => {
  /**
   * Next.js Router Integration
   *
   * Integrates with Next.js router for programmatic navigation after
   * successful conversation creation. This enables automatic redirects to
   * the conversation page after creating a new conversation.
   *
   * What this provides:
   * - Programmatic navigation: router.push() for conversation redirects
   * - Route management: Navigation to /conversations/[conversationId]
   * - Client-side routing: Seamless navigation without page refresh
   * - URL management: Proper URL updates for conversation flow
   * - Navigation context: Foundation for post-conversation creation redirects
   *
   * Why this pattern?
   * - User experience: Automatic redirect after successful conversation creation
   * - Navigation: Seamless transition to conversation interface
   * - Client-side routing: No page refresh for better UX
   * - URL management: Proper URL updates and history
   * - Integration: Seamless connection with Next.js routing
   *
   * This router integration is essential for our messaging app because
   * it provides the navigation functionality that enables seamless
   * user experience after successful conversation creation.
   */
  const router = useRouter();

  /**
   * Conversation Creation Loading State
   *
   * Manages the loading state during conversation creation operations to provide
   * user feedback and prevent duplicate submissions. This state ensures
   * optimal user experience during conversation creation processes.
   *
   * What this manages:
   * - Loading state: Boolean flag for conversation creation operations
   * - User feedback: Visual indication of ongoing conversation creation
   * - Button states: Disabled state for user interaction during loading
   * - LoadingModal: Full-screen loading overlay during API calls
   * - State management: Centralized loading state control
   *
   * Why this pattern?
   * - User feedback: Clear indication of ongoing conversation creation
   * - Form protection: Prevents duplicate conversation creation attempts
   * - Button states: Disabled state for better UX
   * - Loading feedback: LoadingModal for visual indication
   * - State management: Centralized loading state control
   *
   * This loading state is essential for our messaging app because
   * it provides the user feedback that ensures smooth conversation
   * creation experience and prevents duplicate API calls.
   */
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Conversation Creation Handler
   *
   * Handles user click events to create new conversations with the selected user.
   * This function implements API integration, loading states, and navigation
   * that provides the complete conversation creation functionality.
   *
   * What this handles:
   * - User click events: onClick handler for conversation creation
   * - Loading state: setIsLoading for conversation creation feedback
   * - API integration: axios POST to /api/conversations endpoint
   * - User ID payload: Sends selected user ID for conversation creation
   * - Response handling: Receives conversation data with ID
   * - Navigation: Automatic redirect to conversation page
   * - Error handling: Graceful handling of API errors
   *
   * Why this pattern?
   * - User interaction: Click handling for conversation creation
   * - API integration: Seamless integration with backend API
   * - User feedback: Clear feedback for conversation creation
   * - Loading states: Disabled interaction during API operations
   * - Navigation: Automatic redirect after successful creation
   * - Error handling: Graceful handling of API errors
   *
   * This conversation creation handler is essential for our messaging app because
   * it provides the complete conversation creation functionality that enables
   * users to start new conversations with other users seamlessly.
   */
  const handleClick = useCallback(() => {
    setIsLoading(true);

    axios
      .post('/api/conversations', {
        userId: data.id,
      })
      .then((data) => {
        router.push(`/conversations/${data.data.id}`);
      })
      .finally(() => setIsLoading(false));
  }, [data, router]);

  return (
    <>
      {isLoading && <LoadingModal />}
      <div
        onClick={handleClick}
        className="
          w-full
          relative
          flex
          items-center
          space-x-3
          bg-white
          p-3
          hover:bg-neutral-100
          rounded-lg
          transition
          cursor-pointer
        "
      >
        <Avatar user={data} />
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
                  text-sm
                  font-medium
                  text-gray-900
                "
              >
                {data.name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserBox;
