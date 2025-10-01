/**
 * Desktop Sidebar Component for Dex Real-Time Messenger
 *
 * This file provides a specialized DesktopSidebar component for our Next.js 14
 * real-time messaging application. It implements desktop sidebar navigation
 * with navigation routes, user profile display, settings modal integration,
 * and responsive design that ensures optimal user experience in the
 * desktop sidebar interface.
 *
 * Key Features:
 * - Desktop sidebar navigation with navigation routes and user profile
 * - Settings modal integration with user profile management
 * - Responsive design with fixed positioning and proper z-index
 * - Navigation items with active state management and click handling
 * - User profile display with clickable avatar for settings access
 * - useRoutes hook integration for dynamic navigation generation
 *
 * Desktop Sidebar Usage Patterns:
 * - Sidebar.tsx: Main sidebar layout with desktop and mobile variants
 * - conversations/layout.tsx: Conversation list and chat interface
 * - users/layout.tsx: User list and user management interface
 * - Responsive navigation: Desktop sidebar + mobile footer
 * - User authentication: Current user data for profile and settings
 *
 * This component is essential for our messaging app because it provides the
 * desktop navigation structure that enables user access to conversations,
 * user management, and settings features throughout our
 * real-time messaging platform.
 *
 * @fileoverview Desktop Sidebar component for Next.js 14 real-time messaging application
 * @author Dayle Cortes
 * @since 2025
 */

'use client';

import { useState } from 'react';
import { User } from '@prisma/client';

import useRoutes from '@/app/hooks/useRoutes';

import Avatar from '../Avatar';
import DesktopItem from './DesktopItem';
import SettingsModal from './SettingsModal';

/**
 * Desktop Sidebar Component Props Interface
 *
 * Defines the complete interface for the DesktopSidebar component, providing type safety
 * and clear documentation for all available props and their purposes.
 *
 * @interface DesktopSidebarProps
 * @property {User} currentUser - Current authenticated user object with profile information
 */
interface DesktopSidebarProps {
  currentUser: User;
}

/**
 * Desktop Sidebar Component
 *
 * A comprehensive desktop sidebar component that provides navigation and user profile
 * functionality for our messaging application. This component implements desktop-specific
 * navigation patterns with fixed positioning, responsive design, and user profile
 * management that ensures optimal user experience in the desktop sidebar interface.
 *
 * Key Capabilities:
 * - Desktop sidebar navigation with navigation routes and user profile
 * - Settings modal integration with user profile management
 * - Responsive design with fixed positioning and proper z-index
 * - Navigation items with active state management and click handling
 * - User profile display with clickable avatar for settings access
 * - useRoutes hook integration for dynamic navigation generation
 *
 * Desktop Sidebar Types Supported:
 * - Navigation sidebar: Fixed left sidebar with navigation routes
 * - User profile sidebar: User avatar with settings modal access
 * - Responsive sidebar: Desktop-only display with mobile footer alternative
 * - Settings integration: Settings modal with user profile management
 * - Navigation items: Chat, Users, and Logout functionality
 *
 * Usage Patterns:
 * - Sidebar.tsx: Main sidebar layout with desktop and mobile variants
 * - conversations/layout.tsx: Conversation list and chat interface
 * - users/layout.tsx: User list and user management interface
 * - Responsive navigation: Desktop sidebar + mobile footer
 * - User authentication: Current user data for profile and settings
 *
 * Navigation Features:
 * - useRoutes hook: Dynamic navigation generation with active state
 * - DesktopItem components: Individual navigation items with icons
 * - Active state management: Current page highlighting
 * - Click handling: Navigation and custom actions (logout)
 * - Icon display: React Icons integration for visual navigation
 *
 * User Profile Features:
 * - Avatar display: User profile image with active status
 * - Settings access: Clickable avatar opens settings modal
 * - User information: Current user data for profile management
 * - Modal integration: Settings modal with user profile editing
 * - Interactive feedback: Hover effects and click handling
 *
 * Responsive Design Features:
 * - Desktop only: Hidden on mobile (lg:fixed, lg:flex)
 * - Fixed positioning: Fixed left sidebar with proper z-index
 * - Responsive width: 20 units (lg:w-20) with xl padding
 * - Full height: Full viewport height with overflow handling
 * - Border styling: Right border for visual separation
 *
 * Layout Architecture:
 * - Container: Fixed left sidebar with responsive positioning
 * - Navigation section: Top section with navigation items
 * - User profile section: Bottom section with user avatar
 * - Settings modal: Overlay modal for user profile management
 * - Responsive design: Desktop-only display with mobile alternative
 *
 * This component is crucial for our messaging app because it provides the
 * desktop navigation structure that enables user access to conversations,
 * user management, and settings features throughout all
 * desktop navigation interfaces.
 *
 * @param {DesktopSidebarProps} props - Component props for desktop sidebar configuration
 * @returns {JSX.Element} Desktop sidebar with navigation and user profile
 *
 * @example
 * ```tsx
 * // In Sidebar.tsx
 * <DesktopSidebar currentUser={currentUser} />
 *
 * // With user data
 * <DesktopSidebar currentUser={userData} />
 * ```
 */
const DesktopSidebar: React.FC<DesktopSidebarProps> = ({ currentUser }) => {
  /**
   * Navigation Routes and Settings Modal State
   *
   * Manages the navigation routes and settings modal state for the desktop sidebar.
   * This provides the core functionality for navigation display and user profile
   * management within the desktop sidebar interface.
   *
   * What this manages:
   * - Navigation routes: useRoutes hook for dynamic navigation generation
   * - Settings modal state: isOpen state for modal visibility control
   * - Active navigation: Current page highlighting and navigation state
   * - User interactions: Click handling for navigation and settings access
   * - Modal control: Open/close functionality for settings modal
   *
   * Why this pattern?
   * - Dynamic navigation: useRoutes provides current page awareness
   * - State management: Local state for modal visibility control
   * - User experience: Seamless navigation and settings access
   * - Performance: Efficient state management for sidebar functionality
   * - Integration: Works with DesktopItem components for navigation
   *
   * This state management is essential for our messaging app because
   * it provides the navigation and settings functionality that enables
   * user access to conversations, user management, and profile settings
   * throughout the desktop sidebar interface.
   */
  const routes = useRoutes();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <SettingsModal
        currentUser={currentUser}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
      <div
        className="
          hidden
          lg:fixed
          lg:inset-y-0
          lg:left-0
          lg:z-40
          lg:w-20
          xl:px-6
          lg:overflow-y-auto
          lg:bg-white
          lg:border-r-[1px]
          lg:pb-4
          lg:flex
          lg:flex-col
          justify-between
        "
      >
        <nav
          className="
            mt-4
            flex
            flex-col
            justify-between
          "
        >
          <ul
            role="list"
            className="
              flex
              flex-col
              items-center
              space-y-1
            "
          >
            {routes.map((item) => (
              <DesktopItem
                key={item.label}
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={item.active}
                onClick={item.onClick}
              />
            ))}
          </ul>
        </nav>
        <nav
          className="
            mt-4
            flex
            flex-col
            justify-between
            items-center
          "
        >
          <div
            onClick={() => setIsOpen(true)}
            className="
              cursor-pointer
              hover:opacity-75
              transition
            "
          >
            <Avatar user={currentUser} />
          </div>
        </nav>
      </div>
    </>
  );
};

export default DesktopSidebar;
