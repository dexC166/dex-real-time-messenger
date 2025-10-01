/**
 * Mobile Footer Navigation Component for Dex Real-Time Messenger
 *
 * This file provides a specialized MobileFooter component for our Next.js 14
 * real-time messaging application. It implements mobile footer navigation
 * with navigation routes, conversation state management, and responsive design
 * that ensures optimal user experience in the mobile navigation interface.
 *
 * Key Features:
 * - Mobile footer navigation with navigation routes and icons
 * - Conversation state management with conditional rendering
 * - Responsive design with fixed bottom positioning
 * - Navigation items with active state management and click handling
 * - useRoutes hook integration for dynamic navigation generation
 * - useConversation hook integration for conversation state awareness
 *
 * Mobile Footer Usage Patterns:
 * - Sidebar.tsx: Mobile navigation in responsive sidebar layout
 * - conversations/layout.tsx: Mobile navigation for conversation interface
 * - users/layout.tsx: Mobile navigation for user management interface
 * - Responsive navigation: Desktop sidebar + mobile footer
 * - Conversation state: Conditional rendering based on conversation open state
 *
 * This component is essential for our messaging app because it provides the
 * mobile navigation structure that enables user access to conversations,
 * user management, and authentication features throughout our
 * real-time messaging platform on mobile devices.
 *
 * @fileoverview Mobile Footer Navigation component for Next.js 14 real-time messaging application
 * @author Dayle Cortes
 * @since 2025
 */

'use client';

import useRoutes from '@/app/hooks/useRoutes';
import useConversation from '@/app/hooks/useConversation';
import MobileItem from './MobileItem';

/**
 * Mobile Footer Navigation Component
 *
 * A comprehensive mobile footer navigation component that provides bottom navigation
 * for our messaging application on mobile devices. This component implements mobile-specific
 * navigation patterns with fixed positioning, conversation state awareness, and responsive
 * design that ensures optimal user experience in the mobile navigation interface.
 *
 * Key Capabilities:
 * - Mobile footer navigation with navigation routes and icons
 * - Conversation state management with conditional rendering
 * - Responsive design with fixed bottom positioning
 * - Navigation items with active state management and click handling
 * - useRoutes hook integration for dynamic navigation generation
 * - useConversation hook integration for conversation state awareness
 *
 * Mobile Footer Types Supported:
 * - Navigation footer: Fixed bottom navigation with route items
 * - Conversation-aware footer: Conditional rendering based on conversation state
 * - Responsive footer: Mobile-only display with desktop sidebar alternative
 * - Navigation items: Chat, Users, and Logout functionality
 * - Icon navigation: React Icons integration for visual navigation
 *
 * Usage Patterns:
 * - Sidebar.tsx: Mobile navigation in responsive sidebar layout
 * - conversations/layout.tsx: Mobile navigation for conversation interface
 * - users/layout.tsx: Mobile navigation for user management interface
 * - Responsive navigation: Desktop sidebar + mobile footer
 * - Conversation state: Conditional rendering based on conversation open state
 *
 * Navigation Features:
 * - useRoutes hook: Dynamic navigation generation with active state
 * - MobileItem components: Individual navigation items with icons
 * - Active state management: Current page highlighting
 * - Click handling: Navigation and custom actions (logout)
 * - Icon display: React Icons integration for visual navigation
 *
 * Conversation State Features:
 * - useConversation hook: Conversation state awareness
 * - Conditional rendering: Hide footer when conversation is open
 * - State management: isOpen state for conversation visibility
 * - User experience: Clean interface during active conversations
 * - Navigation priority: Conversation takes precedence over navigation
 *
 * Responsive Design Features:
 * - Mobile only: Hidden on desktop (lg:hidden)
 * - Fixed positioning: Fixed bottom navigation with proper z-index
 * - Full width: Full viewport width with proper spacing
 * - Bottom positioning: Fixed bottom with border styling
 * - Z-index management: Proper layering for mobile interface
 *
 * Layout Architecture:
 * - Container: Fixed bottom navigation with responsive positioning
 * - Navigation items: MobileItem components with route mapping
 * - Conversation awareness: Conditional rendering based on conversation state
 * - Responsive design: Mobile-only display with desktop alternative
 * - State integration: useRoutes and useConversation hook integration
 *
 * This component is crucial for our messaging app because it provides the
 * mobile navigation structure that enables user access to conversations,
 * user management, and authentication features throughout all
 * mobile navigation interfaces.
 *
 * @returns {JSX.Element | null} Mobile footer navigation or null when conversation is open
 *
 * @example
 * ```tsx
 * // In Sidebar.tsx
 * <MobileFooter />
 *
 * // With conversation state
 * {!isOpen && <MobileFooter />}
 * ```
 */
const MobileFooter = () => {
  /**
   * Navigation Routes and Conversation State
   *
   * Manages the navigation routes and conversation state for the mobile footer.
   * This provides the core functionality for navigation display and conversation
   * state awareness within the mobile footer navigation interface.
   *
   * What this manages:
   * - Navigation routes: useRoutes hook for dynamic navigation generation
   * - Conversation state: useConversation hook for conversation awareness
   * - Active navigation: Current page highlighting and navigation state
   * - Conversation visibility: isOpen state for conditional rendering
   * - Navigation priority: Conversation takes precedence over navigation
   *
   * Why this pattern?
   * - Dynamic navigation: useRoutes provides current page awareness
   * - Conversation awareness: useConversation provides conversation state
   * - User experience: Clean interface during active conversations
   * - Navigation priority: Conversation takes precedence over navigation
   * - State management: Efficient state management for mobile navigation
   *
   * This state management is essential for our messaging app because
   * it provides the navigation and conversation awareness that enables
   * optimal user experience during active conversations and navigation
   * throughout the mobile interface.
   */
  const routes = useRoutes();
  const { isOpen } = useConversation();

  /**
   * Conversation State Conditional Rendering
   *
   * Conditionally renders the mobile footer based on conversation state.
   * This ensures the footer is hidden when a conversation is open, providing
   * a clean interface for active conversations and optimal user experience.
   *
   * What this handles:
   * - Conversation state: isOpen state from useConversation hook
   * - Conditional rendering: Hide footer when conversation is open
   * - User experience: Clean interface during active conversations
   * - Navigation priority: Conversation takes precedence over navigation
   * - State awareness: Real-time conversation state updates
   *
   * Why this pattern?
   * - User experience: Clean interface during active conversations
   * - Navigation priority: Conversation takes precedence over navigation
   * - State awareness: Real-time conversation state updates
   * - Performance: Efficient conditional rendering
   * - Mobile optimization: Optimal mobile interface during conversations
   *
   * This conditional rendering is essential for our messaging app because
   * it provides the conversation-aware navigation that ensures optimal
   * user experience during active conversations throughout the mobile
   * messaging interface.
   */
  if (isOpen) {
    return null;
  }

  return (
    <div
      className="
        fixed
        justify-between
        w-full
        bottom-0
        z-40
        flex
        items-center
        bg-white
        border-t-[1px]
        lg:hidden
      "
    >
      {routes.map((route) => (
        <MobileItem
          key={route.href}
          href={route.href}
          icon={route.icon}
          active={route.active}
          onClick={route.onClick}
        />
      ))}
    </div>
  );
};

export default MobileFooter;
