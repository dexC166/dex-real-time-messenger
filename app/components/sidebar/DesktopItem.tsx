/**
 * Desktop Navigation Item Component for Dex Real-Time Messenger
 *
 * This file provides a specialized DesktopItem component for our Next.js 14
 * real-time messaging application. It implements desktop sidebar navigation
 * items with icon display, active state management, click handling, and
 * accessibility features that ensure optimal user experience in the
 * desktop sidebar navigation.
 *
 * Key Features:
 * - Desktop sidebar navigation item with icon and label
 * - Active state management with visual feedback
 * - Click handling for both navigation and custom actions
 * - Accessibility features with screen reader support
 * - Hover states and interactive feedback
 * - Next.js Link integration for client-side navigation
 *
 * Desktop Item Usage Patterns:
 * - DesktopSidebar: Navigation items in desktop sidebar
 * - Route navigation: Chat, Users, and Logout functionality
 * - Active state indication: Current page highlighting
 * - Custom actions: Logout functionality with onClick handler
 * - Icon display: React Icons integration for visual navigation
 *
 * This component is essential for our messaging app because it provides the
 * desktop navigation items that enable user access to conversations,
 * user management, and authentication features throughout our
 * real-time messaging platform.
 *
 * @fileoverview Desktop Navigation Item component for Next.js 14 real-time messaging application
 * @author Dayle Cortes
 * @since 2025
 */

'use client';

import clsx from 'clsx';
import Link from 'next/link';

/**
 * Desktop Item Component Props Interface
 *
 * Defines the complete interface for the DesktopItem component, providing type safety
 * and clear documentation for all available props and their purposes.
 *
 * @interface DesktopItemProps
 * @property {string} label - Display label for the navigation item (used for screen readers)
 * @property {any} icon - React icon component to display in the navigation item
 * @property {string} href - Navigation URL for the item (used by Next.js Link)
 * @property {() => void} [onClick] - Optional click handler for custom actions (e.g., logout)
 * @property {boolean} [active] - Whether the item is currently active/selected
 */
interface DesktopItemProps {
  label: string;
  icon: any;
  href: string;
  onClick?: () => void;
  active?: boolean;
}

/**
 * Desktop Navigation Item Component
 *
 * A specialized navigation item component for desktop sidebar navigation
 * in our messaging application. This component implements comprehensive
 * navigation functionality with icon display, active state management,
 * click handling, and accessibility features that ensure optimal user
 * experience in the desktop sidebar.
 *
 * Key Capabilities:
 * - Desktop sidebar navigation item with icon and label
 * - Active state management with visual feedback
 * - Click handling for both navigation and custom actions
 * - Accessibility features with screen reader support
 * - Hover states and interactive feedback
 * - Next.js Link integration for client-side navigation
 *
 * Desktop Item Types Supported:
 * - Navigation items: Chat, Users with href-based navigation
 * - Action items: Logout with onClick-based functionality
 * - Active items: Current page with visual highlighting
 * - Inactive items: Default state with hover effects
 * - Icon items: React Icons integration for visual navigation
 *
 * Usage Patterns:
 * - DesktopSidebar: Navigation items in desktop sidebar
 * - Route navigation: Chat, Users, and Logout functionality
 * - Active state indication: Current page highlighting
 * - Custom actions: Logout functionality with onClick handler
 * - Icon display: React Icons integration for visual navigation
 *
 * Navigation Features:
 * - Next.js Link: Client-side navigation with href
 * - Active state: Visual highlighting for current page
 * - Hover states: Interactive feedback on mouse hover
 * - Click handling: Custom actions via onClick prop
 * - Icon display: React Icons with consistent sizing
 *
 * Accessibility Features:
 * - Screen reader support: sr-only label for accessibility
 * - Semantic HTML: Proper li and Link structure
 * - Keyboard navigation: Link-based keyboard accessibility
 * - Focus management: Proper focus indicators
 * - ARIA compliance: Accessible navigation structure
 *
 * Styling Architecture:
 * - Base styles: Group, flex, gap, rounded, padding, typography
 * - Interactive states: Hover text and background changes
 * - Active state: Background and text color highlighting
 * - Icon sizing: h-6 w-6 with shrink-0 for consistent display
 * - Responsive design: Consistent sizing across screen sizes
 *
 * This component is crucial for our messaging app because it provides the
 * desktop navigation items that enable user access to conversations,
 * user management, and authentication features throughout all
 * desktop navigation interfaces.
 *
 * @param {DesktopItemProps} props - Component props for navigation item configuration
 * @returns {JSX.Element} Styled navigation item with icon and accessibility features
 *
 * @example
 * ```tsx
 * // Navigation item
 * <DesktopItem
 *   label="Chat"
 *   icon={HiChat}
 *   href="/conversations"
 *   active={pathname === '/conversations'}
 * />
 *
 * // Action item
 * <DesktopItem
 *   label="Logout"
 *   icon={HiArrowLeftOnRectangle}
 *   href="#"
 *   onClick={() => signOut()}
 * />
 * ```
 */
const DesktopItem: React.FC<DesktopItemProps> = ({
  label,
  icon: Icon,
  href,
  onClick,
  active,
}) => {
  /**
   * Click Handler for Custom Actions
   *
   * Handles click events for navigation items that have custom actions
   * (like logout) rather than standard navigation. This allows the
   * component to support both navigation and action-based functionality.
   *
   * What this handles:
   * - Custom actions: onClick-based functionality (e.g., logout)
   * - Navigation: href-based navigation via Next.js Link
   * - Event delegation: Proper click event handling
   * - Action execution: Custom function calls when provided
   *
   * Why this pattern?
   * - Flexibility: Supports both navigation and actions
   * - Consistency: Uniform click handling across all items
   * - Separation: Clear distinction between navigation and actions
   * - Accessibility: Proper event handling for screen readers
   * - User experience: Smooth interaction patterns
   *
   * This click handling is essential for our messaging app because
   * it enables both standard navigation (Chat, Users) and custom
   * actions (Logout) within the same navigation component structure.
   */
  const handleClick = () => {
    if (onClick) {
      return onClick();
    }
  };

  return (
    <li onClick={handleClick}>
      <Link
        href={href}
        className={clsx(
          `
          group
          flex
          gap-x-3
          rounded-md
          p-3
          text-sm
          leading-6
          font-semibold
          text-gray-500
          hover:text-black
          hover:bg-gray-100
        `,
          active && 'bg-gray-100 text-black'
        )}
      >
        <Icon className="h-6 w-6 shrink-0" />
        <span className="sr-only">{label}</span>
      </Link>
    </li>
  );
};

export default DesktopItem;
