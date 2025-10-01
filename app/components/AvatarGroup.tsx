/**
 * User Avatar Group Component for Dex Real-Time Messenger
 *
 * This file provides a specialized AvatarGroup component for our Next.js 14
 * real-time messaging application. It implements group conversation user display
 * with overlapping avatar positioning, responsive sizing, and consistent styling
 * that ensures optimal group identification throughout the messaging platform.
 *
 * Key Features:
 * - Group conversation user display with overlapping avatars
 * - Maximum 3 users displayed with strategic positioning
 * - Next.js Image optimization for performance
 * - Fallback placeholder image for users without profile pictures
 * - Responsive sizing for mobile and desktop
 * - Consistent styling with messaging app design system
 *
 * Avatar Group Usage Patterns:
 * - ConversationBox: Group conversation list display
 * - Header: Group conversation participant display
 * - ProfileDrawer: Group conversation information display
 * - Group chat identification: Visual representation of group members
 *
 * This component is essential for our messaging app because it provides the
 * group identification system that enables visual group recognition, member
 * awareness, and consistent group display throughout our
 * real-time messaging platform.
 *
 * @fileoverview User Avatar Group component for Next.js 14 real-time messaging application
 * @author Dayle Cortes
 * @since 2025
 */

'use client';

import { User } from '@prisma/client';
import Image from 'next/image';

/**
 * Avatar Group Component Props Interface
 *
 * Defines the complete interface for the AvatarGroup component, providing type safety
 * and clear documentation for all available props and their purposes.
 *
 * @interface AvatarGroupProps
 * @property {User[]} [users] - Array of user objects containing profile information and images
 */
interface AvatarGroupProps {
  users?: User[];
}

/**
 * User Avatar Group Component
 *
 * A specialized avatar group component that displays multiple user profile images
 * in an overlapping layout for group conversations. This component implements
 * comprehensive group identification with strategic positioning, Next.js Image
 * optimization, and consistent styling that ensures optimal group recognition
 * throughout our messaging application.
 *
 * Key Capabilities:
 * - Group conversation user display with overlapping avatars
 * - Maximum 3 users displayed with strategic positioning
 * - Next.js Image optimization for performance
 * - Fallback placeholder image for users without profile pictures
 * - Responsive sizing for mobile and desktop
 * - Consistent styling with messaging app design system
 *
 * Avatar Group Types Supported:
 * - Group conversations: Multiple user display with overlapping layout
 * - Member identification: Visual representation of group participants
 * - User limit: Maximum 3 users displayed for optimal visual clarity
 * - Responsive sizing: 44px container with 21px individual avatars
 * - Fallback handling: Placeholder images for missing profile pictures
 *
 * Usage Patterns:
 * - ConversationBox: Group conversation list display with member identification
 * - Header: Group conversation participant display in chat header
 * - ProfileDrawer: Group conversation information display in profile
 * - Group chat identification: Visual representation of group members
 * - Member awareness: Understanding who is in the group conversation
 *
 * Positioning Strategy:
 * - First user (index 0): Top-left position with 12px left offset
 * - Second user (index 1): Bottom-center position
 * - Third user (index 2): Bottom-right position
 * - Overlapping layout: Creates visual group representation
 * - Strategic spacing: Optimal visual balance and recognition
 *
 * Styling Architecture:
 * - Container: 44px x 44px relative positioning
 * - Individual avatars: 21px x 21px with absolute positioning
 * - Rounded full: Circular avatar display with overflow hidden
 * - Image optimization: Next.js Image with 256x256 dimensions
 * - Fallback handling: Placeholder image for missing profiles
 *
 * This component is crucial for our messaging app because it provides the
 * group identification system that enables visual group recognition, member
 * awareness, and consistent group display throughout all
 * conversation and messaging interfaces.
 *
 * @param {AvatarGroupProps} props - Component props for avatar group configuration
 * @returns {JSX.Element} Styled avatar group with overlapping user images
 *
 * @example
 * ```tsx
 * // Group conversation display
 * <AvatarGroup users={conversation.users} />
 *
 * // Group chat header
 * <AvatarGroup users={groupMembers} />
 *
 * // Profile drawer group info
 * <AvatarGroup users={data.users} />
 * ```
 */
const AvatarGroup: React.FC<AvatarGroupProps> = ({ users = [] }) => {
  /**
   * User Limit and Slicing
   *
   * Limits the displayed users to a maximum of 3 for optimal visual clarity
   * and performance. This ensures the avatar group doesn't become cluttered
   * and maintains a clean, recognizable appearance.
   *
   * Why limit to 3 users?
   * - Visual clarity: Prevents overcrowded avatar display
   * - Performance: Reduces rendering overhead for large groups
   * - Recognition: Easier to identify group members at a glance
   * - Design consistency: Maintains clean, professional appearance
   * - Mobile optimization: Works well on smaller screens
   *
   * This user limiting is essential for our messaging app because it ensures
   * the avatar group remains visually clear and performant, even for
   * large group conversations with many participants.
   */
  const slicedUsers = users?.slice(0, 3);

  /**
   * Avatar Positioning Map
   *
   * Defines the strategic positioning for each avatar in the group display.
   * This creates an overlapping layout that visually represents group
   * membership while maintaining optimal visual balance and recognition.
   *
   * Positioning Strategy:
   * - Index 0: Top-left with 12px left offset for visual balance
   * - Index 1: Bottom-center for central positioning
   * - Index 2: Bottom-right for right-side balance
   * - Overlapping layout: Creates cohesive group representation
   * - Strategic spacing: Optimal visual hierarchy and recognition
   *
   * Why this positioning?
   * - Visual hierarchy: First user is most prominent (top-left)
   * - Balance: Even distribution across the container
   * - Recognition: Easy to identify individual group members
   * - Consistency: Predictable layout across all group displays
   * - Mobile friendly: Works well on different screen sizes
   *
   * This positioning strategy is crucial for our messaging app because it
   * provides a clear, recognizable visual representation of group
   * membership that users can quickly understand and navigate.
   */
  const positionMap = {
    0: 'top-0 left-[12px]',
    1: 'bottom-0',
    2: 'bottom-0 right-0',
  };

  return (
    <div
      className="
        relative
        h-11
        w-11
      "
    >
      {slicedUsers.map((user, index) => (
        <div
          key={user.id}
          className={`
            absolute
            inline-block
            rounded-full
            overflow-hidden
            h-[21px]
            w-[21px]
            ${positionMap[index as keyof typeof positionMap]}
          `}
        >
          <Image
            alt="Avatar"
            height={256}
            width={256}
            src={user?.image || '/images/placeholder.jpg'}
          />
        </div>
      ))}
    </div>
  );
};

export default AvatarGroup;
