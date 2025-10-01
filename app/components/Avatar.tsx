/**
 * User Avatar Component for Dex Real-Time Messenger
 *
 * This file provides a highly reusable Avatar component for our Next.js 14
 * real-time messaging application. It implements user profile image display
 * with active status indicators, responsive sizing, and consistent styling
 * that ensures optimal user identification throughout the messaging platform.
 *
 * Key Features:
 * - User profile image display with Next.js Image optimization
 * - Real-time active status indicator with green dot
 * - Responsive sizing for mobile and desktop
 * - Fallback placeholder image for users without profile pictures
 * - Active status integration via useActiveList hook
 * - Consistent styling with messaging app design system
 *
 * Avatar Usage Patterns:
 * - UserBox: User selection and conversation creation
 * - ConversationBox: Conversation list display
 * - MessageBox: Message sender identification
 * - Header: Conversation participant display
 * - ProfileDrawer: User profile information
 * - DesktopSidebar: Current user profile display
 *
 * This component is essential for our messaging app because it provides the
 * user identification system that enables visual user recognition, active
 * status awareness, and consistent user display throughout our
 * real-time messaging platform.
 *
 * @fileoverview User Avatar component for Next.js 14 real-time messaging application
 * @author Dayle Cortes
 * @since 2025
 */

'use client';

import { User } from '@prisma/client';
import Image from 'next/image';
import useActiveList from '../hooks/useActiveList';

/**
 * Avatar Component Props Interface
 *
 * Defines the complete interface for the Avatar component, providing type safety
 * and clear documentation for all available props and their purposes.
 *
 * @interface AvatarProps
 * @property {User} [user] - User object containing profile information and image
 */
interface AvatarProps {
  user?: User;
}

/**
 * User Avatar Component
 *
 * A highly flexible and responsive avatar component that displays user profile
 * images with real-time active status indicators. This component implements
 * comprehensive user identification with Next.js Image optimization, active
 * status integration, and consistent styling that ensures optimal user
 * recognition throughout our messaging application.
 *
 * Key Capabilities:
 * - User profile image display with Next.js Image optimization
 * - Real-time active status indicator with green dot
 * - Responsive sizing for mobile and desktop
 * - Fallback placeholder image for users without profile pictures
 * - Active status integration via useActiveList hook
 * - Consistent styling with messaging app design system
 *
 * Avatar Types Supported:
 * - Individual users: Single user profile display
 * - Active users: Real-time online status indication
 * - Inactive users: Offline status display
 * - Users without images: Placeholder image fallback
 * - Responsive sizing: Mobile (36px) and desktop (44px)
 *
 * Usage Patterns:
 * - UserBox: User selection and conversation creation
 * - ConversationBox: Conversation list display with user identification
 * - MessageBox: Message sender identification in chat
 * - Header: Conversation participant display
 * - ProfileDrawer: User profile information display
 * - DesktopSidebar: Current user profile display
 *
 * Active Status Features:
 * - Real-time online status detection via useActiveList hook
 * - Green dot indicator for active users
 * - White ring border for visual distinction
 * - Responsive sizing for different screen sizes
 * - Automatic status updates based on user presence
 *
 * Styling Architecture:
 * - Base styles: Rounded full circle with overflow hidden
 * - Responsive sizing: h-9 w-9 (mobile), md:h-11 md:w-11 (desktop)
 * - Active indicator: Green dot with white ring border
 * - Image optimization: Next.js Image with 256x256 dimensions
 * - Fallback handling: Placeholder image for missing profiles
 *
 * This component is crucial for our messaging app because it provides the
 * user identification system that enables visual user recognition, active
 * status awareness, and consistent user display throughout all
 * conversation and messaging interfaces.
 *
 * @param {AvatarProps} props - Component props for avatar configuration
 * @returns {JSX.Element} Styled avatar with user image and active status
 *
 * @example
 * ```tsx
 * // Basic user avatar
 * <Avatar user={currentUser} />
 *
 * // User in conversation list
 * <Avatar user={otherUser} />
 *
 * // Message sender avatar
 * <Avatar user={message.sender} />
 * ```
 */
const Avatar: React.FC<AvatarProps> = ({ user }) => {
  /**
   * Active Status Detection
   *
   * Retrieves the current list of active users from the useActiveList hook
   * and determines if the current user is online by checking if their email
   * is present in the active members list.
   *
   * Active Status Logic:
   * - useActiveList hook provides real-time active user list
   * - members array contains email addresses of online users
   * - indexOf check determines if user email exists in active list
   * - isActive boolean controls green dot indicator display
   *
   * Why email-based checking?
   * - Email is unique identifier across authentication providers
   * - Consistent with NextAuth.js session structure
   * - Works for both OAuth and credential-based users
   * - Provides reliable user identification for presence
   *
   * This active status detection is essential for our messaging app because
   * it provides real-time user presence information that helps users
   * understand who is available for messaging and conversation.
   */
  const { members } = useActiveList();
  const isActive = members.indexOf(user?.email!) !== -1;

  return (
    <div className="relative">
      <div
        className="
          relative
          inline-block
          rounded-full
          overflow-hidden
          h-9
          w-9
          md:h-11
          md:w-11
        "
      >
        <Image
          alt="Avatar"
          src={user?.image || '/images/placeholder.jpg'}
          height={256}
          width={256}
        />
      </div>
      {isActive ? (
        <span
          className="
          absolute
          block
          rounded-full
          bg-green-500
          ring-2
          ring-white
          top-0
          right-0
          h-2
          w-2
          md:h-3
          md:w-3
        "
        />
      ) : null}
    </div>
  );
};

export default Avatar;
