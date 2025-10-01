/**
 * Navigation Routes Hook for Dex Real-Time Messenger
 *
 * This file provides a specialized useRoutes hook for our Next.js 14
 * real-time messaging application. It implements dynamic navigation
 * route generation with active state management, conversation awareness,
 * and authentication integration that ensures optimal user experience
 * for navigation throughout the messaging platform.
 *
 * Key Features:
 * - Dynamic navigation route generation with active state management
 * - Conversation awareness with conversationId-based active states
 * - Next.js usePathname integration for current page detection
 * - React Icons integration for visual navigation indicators
 * - NextAuth.js signOut integration for authentication logout
 * - useMemo optimization for performance and re-render prevention
 *
 * Navigation Routes Usage Patterns:
 * - DesktopSidebar: Desktop navigation with route items and active states
 * - MobileFooter: Mobile navigation with route items and active states
 * - Active state management: Current page highlighting and conversation awareness
 * - Authentication integration: Logout functionality with NextAuth.js
 * - Icon display: React Icons integration for visual navigation
 *
 * This hook is essential for our messaging app because it provides the
 * dynamic navigation system that enables user access to conversations,
 * user management, and authentication features throughout our
 * real-time messaging platform.
 *
 * @fileoverview Navigation Routes Hook for Next.js 14 real-time messaging application
 * @author Dayle Cortes
 * @since 2025
 */

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { HiChat } from 'react-icons/hi';
import { HiArrowLeftOnRectangle, HiUsers } from 'react-icons/hi2';
import { signOut } from 'next-auth/react';
import useConversation from './useConversation';

/**
 * Navigation Routes Hook
 *
 * A comprehensive navigation hook that provides dynamic route generation
 * for our messaging application. This hook implements navigation route
 * management with active state detection, conversation awareness, and
 * authentication integration that ensures optimal user experience
 * for navigation throughout the messaging platform.
 *
 * Key Capabilities:
 * - Dynamic navigation route generation with active state management
 * - Conversation awareness with conversationId-based active states
 * - Next.js usePathname integration for current page detection
 * - React Icons integration for visual navigation indicators
 * - NextAuth.js signOut integration for authentication logout
 * - useMemo optimization for performance and re-render prevention
 *
 * Navigation Route Types Supported:
 * - Chat route: /conversations with conversation awareness
 * - Users route: /users with user management functionality
 * - Logout route: # with NextAuth.js signOut integration
 * - Active routes: Current page highlighting and conversation awareness
 * - Icon routes: React Icons integration for visual navigation
 *
 * Usage Patterns:
 * - DesktopSidebar: Desktop navigation with route items and active states
 * - MobileFooter: Mobile navigation with route items and active states
 * - Active state management: Current page highlighting and conversation awareness
 * - Authentication integration: Logout functionality with NextAuth.js
 * - Icon display: React Icons integration for visual navigation
 *
 * Navigation Features:
 * - Dynamic generation: useMemo for optimized route generation
 * - Active state detection: pathname and conversationId-based highlighting
 * - Conversation awareness: Chat route active when conversation is open
 * - Icon integration: React Icons for visual navigation indicators
 * - Authentication: NextAuth.js signOut for logout functionality
 *
 * Performance Features:
 * - useMemo optimization: Prevents unnecessary re-renders
 * - Dependency array: [pathname, conversationId] for efficient updates
 * - Route caching: Memoized route generation for performance
 * - State synchronization: Real-time updates for active states
 * - Memory efficiency: Optimized route object generation
 *
 * This hook is crucial for our messaging app because it provides the
 * dynamic navigation system that enables user access to conversations,
 * user management, and authentication features throughout all
 * navigation interfaces.
 *
 * @returns {Array} Array of navigation route objects with label, href, icon, active, and onClick properties
 *
 * @example
 * ```tsx
 * // In DesktopSidebar
 * const routes = useRoutes();
 *
 * // In MobileFooter
 * const routes = useRoutes();
 *
 * // Route object structure
 * {
 *   label: 'Chat',
 *   href: '/conversations',
 *   icon: HiChat,
 *   active: pathname === '/conversations' || !!conversationId,
 * }
 * ```
 */
const useRoutes = () => {
  /**
   * Current Pathname and Conversation State
   *
   * Retrieves the current pathname and conversation state for navigation
   * route generation. This provides the core functionality for active
   * state detection and conversation awareness within the navigation system.
   *
   * What this provides:
   * - Current pathname: usePathname hook for current page detection
   * - Conversation state: useConversation hook for conversation awareness
   * - Active state detection: pathname-based route highlighting
   * - Conversation awareness: conversationId-based active states
   * - Navigation context: Current page and conversation state
   *
   * Why this pattern?
   * - Active state detection: pathname provides current page awareness
   * - Conversation awareness: conversationId enables conversation-based highlighting
   * - Navigation context: Current state for route generation
   * - Performance: Efficient state retrieval for navigation
   * - Integration: Seamless integration with Next.js and conversation state
   *
   * This state management is essential for our messaging app because
   * it provides the navigation context that enables active state
   * detection and conversation awareness throughout the
   * navigation system.
   */
  const pathname = usePathname();
  const { conversationId } = useConversation();

  /**
   * Memoized Navigation Routes Generation
   *
   * Generates the navigation routes array with active state detection,
   * conversation awareness, and authentication integration. This provides
   * the complete navigation system for the messaging application.
   *
   * What this generates:
   * - Chat route: /conversations with conversation awareness
   * - Users route: /users with user management functionality
   * - Logout route: # with NextAuth.js signOut integration
   * - Active states: Current page highlighting and conversation awareness
   * - Icon integration: React Icons for visual navigation indicators
   *
   * Why this pattern?
   * - Performance: useMemo prevents unnecessary re-renders
   * - Active state detection: pathname and conversationId-based highlighting
   * - Conversation awareness: Chat route active when conversation is open
   * - Authentication: NextAuth.js signOut for logout functionality
   * - Icon integration: React Icons for visual navigation indicators
   *
   * This route generation is essential for our messaging app because
   * it provides the complete navigation system that enables user
   * access to conversations, user management, and authentication
   * features throughout the messaging platform.
   */
  const routes = useMemo(
    () => [
      {
        label: 'Chat',
        href: '/conversations',
        icon: HiChat,
        active: pathname === '/conversations' || !!conversationId,
      },
      {
        label: 'Users',
        href: '/users',
        icon: HiUsers,
        active: pathname === '/users',
      },
      {
        label: 'Logout',
        href: '#',
        onClick: () => signOut(),
        icon: HiArrowLeftOnRectangle,
      },
    ],
    [pathname, conversationId]
  );

  return routes;
};

export default useRoutes;
