/**
 * Mobile Navigation Item Component for Dex Real-Time Messenger
 *
 * This file provides a specialized MobileItem component for our Next.js 14
 * real-time messaging application. It implements mobile footer navigation
 * items with icon display, active state management, click handling, and
 * responsive design that ensures optimal user experience in the
 * mobile footer navigation interface.
 *
 * Key Features:
 * - Mobile footer navigation item with icon display
 * - Active state management with visual feedback
 * - Click handling for both navigation and custom actions
 * - Responsive design with full-width mobile layout
 * - Hover states and interactive feedback
 * - Next.js Link integration for client-side navigation
 *
 * Mobile Item Usage Patterns:
 * - MobileFooter: Navigation items in mobile footer
 * - Route navigation: Chat, Users, and Logout functionality
 * - Active state indication: Current page highlighting
 * - Custom actions: Logout functionality with onClick handler
 * - Icon display: React Icons integration for visual navigation
 *
 * This component is essential for our messaging app because it provides the
 * mobile navigation items that enable user access to conversations,
 * user management, and authentication features throughout our
 * real-time messaging platform on mobile devices.
 *
 * @fileoverview Mobile Navigation Item component for Next.js 14 real-time messaging application
 * @author Dayle Cortes
 * @since 2025
 */

'use client';

import clsx from 'clsx';
import Link from 'next/link';

/**
 * Mobile Item Component Props Interface
 *
 * Defines the complete interface for the MobileItem component, providing type safety
 * and clear documentation for all available props and their purposes.
 *
 * @interface MobileItemProps
 * @property {string} href - Navigation URL for the item (used by Next.js Link)
 * @property {any} icon - React icon component to display in the navigation item
 * @property {boolean} [active] - Whether the item is currently active/selected
 * @property {() => void} [onClick] - Optional click handler for custom actions (e.g., logout)
 */
interface MobileItemProps {
  href: string;
  icon: any;
  active?: boolean;
  onClick?: () => void;
}

/**
 * Mobile Navigation Item Component
 *
 * A specialized navigation item component for mobile footer navigation
 * in our messaging application. This component implements comprehensive
 * navigation functionality with icon display, active state management,
 * click handling, and responsive design that ensures optimal user
 * experience in the mobile footer interface.
 *
 * Key Capabilities:
 * - Mobile footer navigation item with icon display
 * - Active state management with visual feedback
 * - Click handling for both navigation and custom actions
 * - Responsive design with full-width mobile layout
 * - Hover states and interactive feedback
 * - Next.js Link integration for client-side navigation
 *
 * Mobile Item Types Supported:
 * - Navigation items: Chat, Users with href-based navigation
 * - Action items: Logout with onClick-based functionality
 * - Active items: Current page with visual highlighting
 * - Inactive items: Default state with hover effects
 * - Icon items: React Icons integration for visual navigation
 *
 * Usage Patterns:
 * - MobileFooter: Navigation items in mobile footer
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
 * Mobile Design Features:
 * - Full width: w-full for optimal mobile touch targets
 * - Centered content: justify-center for balanced layout
 * - Touch-friendly: p-4 padding for adequate touch area
 * - Icon-only display: No text labels for clean mobile interface
 * - Responsive sizing: h-6 w-6 icons for mobile visibility
 *
 * Styling Architecture:
 * - Base styles: Group, flex, gap, typography, width, padding
 * - Interactive states: Hover text and background changes
 * - Active state: Background and text color highlighting
 * - Icon sizing: h-6 w-6 for consistent mobile display
 * - Mobile optimization: Full-width layout with centered content
 *
 * This component is crucial for our messaging app because it provides the
 * mobile navigation items that enable user access to conversations,
 * user management, and authentication features throughout all
 * mobile navigation interfaces.
 *
 * @param {MobileItemProps} props - Component props for navigation item configuration
 * @returns {JSX.Element} Styled mobile navigation item with icon and responsive design
 *
 * @example
 * ```tsx
 * // Navigation item
 * <MobileItem
 *   href="/conversations"
 *   icon={HiChat}
 *   active={pathname === '/conversations'}
 * />
 *
 * // Action item
 * <MobileItem
 *   href="#"
 *   icon={HiArrowLeftOnRectangle}
 *   onClick={() => signOut()}
 * />
 * ```
 */
const MobileItem: React.FC<MobileItemProps> = ({
  href,
  icon: Icon,
  active,
  onClick,
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
   * - Accessibility: Proper event handling for touch interfaces
   * - User experience: Smooth interaction patterns on mobile
   *
   * This click handling is essential for our messaging app because
   * it enables both standard navigation (Chat, Users) and custom
   * actions (Logout) within the same mobile navigation component structure.
   */
  const handleClick = () => {
    if (onClick) {
      return onClick();
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={clsx(
        `
        group
        flex
        gap-x-3
        text-sm
        leading-6
        font-semibold
        w-full
        justify-center
        p-4
        text-gray-500
        hover:text-black
        hover:bg-gray-100
      `,
        active && 'bg-gray-100 text-black'
      )}
    >
      <Icon className="h-6 w-6" />
    </Link>
  );
};

export default MobileItem;
