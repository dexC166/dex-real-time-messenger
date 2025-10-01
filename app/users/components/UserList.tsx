/**
 * User List Component for Dex Real-Time Messenger
 *
 * This file provides a specialized UserList component for our Next.js 14 real-time
 * messaging application. It implements a responsive user list display with contact
 * management, UserBox integration, and consistent styling that ensures optimal user
 * experience for user discovery and contact interaction.
 *
 * Key Features:
 * - Responsive user list display with contact management
 * - UserBox component integration for individual user items
 * - Fixed sidebar layout with responsive design
 * - Contact header with "Contacts" title
 * - Scrollable user list with overflow handling
 * - Integration with users layout and page components
 *
 * Contact Management Features:
 * - User discovery: Display all available users for messaging
 * - Contact interaction: UserBox components for user selection
 * - Responsive design: Mobile and desktop optimized layout
 * - Scrollable list: Overflow handling for large user lists
 * - Visual hierarchy: Clear contact header and user organization
 *
 * This component is essential for our messaging app because it provides the
 * user list interface that enables users to discover and interact with
 * other users for real-time messaging while maintaining consistent layout
 * and user experience throughout our messaging platform.
 *
 * @fileoverview User List component for Next.js 14 real-time messaging application
 * @author Dayle Cortes
 * @since 2025
 */

'use client';

import { User } from '@prisma/client';
import UserBox from './UserBox';

/**
 * User List Component Props Interface
 *
 * Defines the props interface for the UserList component, ensuring
 * type safety and clear documentation for the user list configuration
 * and data structure.
 *
 * @interface UserListProps
 * @property {User[]} items - Array of User objects from Prisma client for display
 *
 * @example
 * ```tsx
 * // In users/layout.tsx
 * <UserList items={users} />
 *
 * // With user data from getUsers action
 * <UserList items={userData} />
 * ```
 */
interface UserListProps {
  items: User[];
}

/**
 * User List Component
 *
 * A specialized user list component that provides contact management and user
 * discovery functionality for our messaging application. This component implements
 * responsive user list display with UserBox integration, fixed sidebar layout,
 * and consistent styling that ensures optimal user experience for user interaction.
 *
 * Key Capabilities:
 * - Responsive user list display with contact management
 * - UserBox component integration for individual user items
 * - Fixed sidebar layout with responsive design
 * - Contact header with "Contacts" title
 * - Scrollable user list with overflow handling
 * - Integration with users layout and page components
 *
 * Contact Management Features:
 * - User discovery: Display all available users for messaging
 * - Contact interaction: UserBox components for user selection
 * - Responsive design: Mobile and desktop optimized layout
 * - Scrollable list: Overflow handling for large user lists
 * - Visual hierarchy: Clear contact header and user organization
 *
 * Usage Patterns:
 * - Users layout: Main user list display in users/layout.tsx
 * - Contact discovery: Display all available users for messaging
 * - User interaction: UserBox components for user selection and conversation creation
 * - Responsive layout: Mobile and desktop optimized user interface
 * - Layout integration: Consistent with users layout system
 *
 * Layout Features:
 * - Fixed sidebar: Fixed positioning with responsive design
 * - Contact header: "Contacts" title with proper typography
 * - User list: Scrollable list of UserBox components
 * - Responsive design: Mobile and desktop optimized layout
 * - Overflow handling: Scrollable content for large user lists
 *
 * Responsive Design Features:
 * - Mobile: Full width with bottom padding (pb-20) for mobile footer
 * - Desktop: Fixed left sidebar (lg:left-20, lg:w-80) with proper spacing
 * - Scrollable: Overflow-y-auto for large user lists
 * - Border styling: Right border for visual separation
 * - Full height: Fixed inset-y-0 for full viewport height
 *
 * UserBox Integration:
 * - Individual user items: UserBox components for each user
 * - User interaction: Click handling for conversation creation
 * - User data: Complete User object from Prisma client
 * - Key prop: Unique user ID for React key optimization
 * - Loading states: LoadingModal integration for conversation creation
 *
 * This component is crucial for our messaging app because it provides the
 * user list interface that enables users to discover and interact with
 * other users for real-time messaging while maintaining consistent layout
 * and user experience throughout our messaging platform.
 *
 * @param {UserListProps} props - Component props for user list configuration
 * @param {User[]} props.items - Array of User objects from Prisma client for display
 * @returns {JSX.Element} Responsive user list with contact management
 *
 * @example
 * ```tsx
 * // In users/layout.tsx
 * <UserList items={users} />
 *
 * // With user data from getUsers action
 * <UserList items={userData} />
 * ```
 */
const UserList: React.FC<UserListProps> = ({ items }) => {
  return (
    <aside
      className="
        fixed
        inset-y-0
        pb-20
        lg:pb-0
        lg:left-20
        lg:w-80
        lg:block
        overflow-y-auto
        border-r
        border-gray-200
        block
        w-full
        left-0
      "
    >
      <div className="px-5">
        <div className="flex-col">
          <div
            className="
              text-2xl
              font-bold
              text-neutral-800
              py-4
            "
          >
            Contacts
          </div>
        </div>
        {items.map((item) => (
          <UserBox key={item.id} data={item} />
        ))}
      </div>
    </aside>
  );
};

export default UserList;
