/**
 * Main Sidebar Layout Component for Dex Real-Time Messenger
 *
 * This file provides the main Sidebar layout component for our Next.js 14
 * real-time messaging application. It implements responsive sidebar navigation
 * with desktop and mobile variants, user authentication integration, and
 * consistent layout structure that ensures optimal user experience across
 * all messaging interfaces.
 *
 * Key Features:
 * - Responsive sidebar layout with desktop and mobile variants
 * - User authentication integration via getCurrentUser action
 * - Desktop sidebar with navigation routes and user profile
 * - Mobile footer navigation for mobile devices
 * - Main content area with proper spacing and layout
 * - Server-side user data fetching for optimal performance
 *
 * Sidebar Usage Patterns:
 * - conversations/layout.tsx: Conversation list and chat interface
 * - users/layout.tsx: User list and user management interface
 * - Responsive navigation: Desktop sidebar + mobile footer
 * - User authentication: Current user data for profile and settings
 * - Layout structure: Consistent sidebar + main content layout
 *
 * This component is essential for our messaging app because it provides the
 * main navigation structure that enables user access to conversations,
 * user management, and all other messaging features throughout our
 * real-time messaging platform.
 *
 * @fileoverview Main Sidebar layout component for Next.js 14 real-time messaging application
 * @author Dayle Cortes
 * @since 2025
 */

import getCurrentUser from '@/app/actions/getCurrentUser';
import DesktopSidebar from './DesktopSidebar';
import MobileFooter from './MobileFooter';

/**
 * Main Sidebar Layout Component
 *
 * A comprehensive sidebar layout component that provides responsive navigation
 * for our messaging application. This component implements desktop and mobile
 * navigation variants, user authentication integration, and consistent layout
 * structure that ensures optimal user experience across all messaging interfaces.
 *
 * Key Capabilities:
 * - Responsive sidebar layout with desktop and mobile variants
 * - User authentication integration via getCurrentUser action
 * - Desktop sidebar with navigation routes and user profile
 * - Mobile footer navigation for mobile devices
 * - Main content area with proper spacing and layout
 * - Server-side user data fetching for optimal performance
 *
 * Sidebar Types Supported:
 * - Desktop sidebar: Fixed left sidebar with navigation and user profile
 * - Mobile footer: Bottom navigation bar for mobile devices
 * - Main content: Responsive content area with proper spacing
 * - User authentication: Current user data for profile and settings
 * - Layout structure: Consistent sidebar + main content layout
 *
 * Usage Patterns:
 * - conversations/layout.tsx: Conversation list and chat interface
 * - users/layout.tsx: User list and user management interface
 * - Responsive navigation: Desktop sidebar + mobile footer
 * - User authentication: Current user data for profile and settings
 * - Layout structure: Consistent sidebar + main content layout
 *
 * Responsive Design Features:
 * - Desktop: Fixed left sidebar (lg:w-20) with navigation routes
 * - Mobile: Bottom footer navigation with route items
 * - Main content: Responsive padding (lg:pl-20) for desktop sidebar
 * - Full height: Consistent h-full layout across all screen sizes
 * - Adaptive layout: Different navigation patterns for different devices
 *
 * Layout Architecture:
 * - Container: Full height div with responsive layout
 * - Desktop sidebar: Fixed left sidebar with navigation and user profile
 * - Mobile footer: Bottom navigation bar for mobile devices
 * - Main content: Responsive content area with proper spacing
 * - User integration: Current user data for profile and settings
 *
 * This component is crucial for our messaging app because it provides the
 * main navigation structure that enables user access to conversations,
 * user management, and all other messaging features throughout all
 * messaging interfaces and user interactions.
 *
 * @param {Object} props - Component props containing children to render
 * @param {React.ReactNode} props.children - Child components to render in main content area
 * @returns {Promise<JSX.Element>} Responsive sidebar layout with navigation and content
 *
 * @example
 * ```tsx
 * // In conversations/layout.tsx
 * <Sidebar>
 *   <ConversationList users={users} initialItems={conversations} />
 *   {children}
 * </Sidebar>
 *
 * // In users/layout.tsx
 * <Sidebar>
 *   <UserList items={users} />
 *   {children}
 * </Sidebar>
 * ```
 */
async function Sidebar({ children }: { children: React.ReactNode }) {
  /**
   * User Authentication and Data Fetching
   *
   * Fetches the current authenticated user data using the getCurrentUser action.
   * This server-side data fetching ensures optimal performance and provides
   * user information needed for the desktop sidebar profile display and
   * settings modal functionality.
   *
   * What getCurrentUser provides:
   * - User profile information (name, email, image)
   * - User authentication status and session data
   * - User preferences and settings data
   * - User ID for database operations and real-time features
   * - User account information for profile management
   *
   * Why server-side fetching?
   * - Optimal performance: Data fetched on server before rendering
   * - SEO benefits: User data available for server-side rendering
   * - Security: User data fetched securely on server
   * - Consistency: Same user data across all components
   * - Performance: Reduces client-side API calls
   *
   * This user data fetching is essential for our messaging app because
   * it provides the user information needed for profile display,
   * settings management, and all user-specific features throughout
   * the messaging platform.
   */
  const currentUser = await getCurrentUser();

  return (
    <div className="h-full">
      <DesktopSidebar currentUser={currentUser!} />
      <MobileFooter />
      <main className="lg:pl-20 h-full">{children}</main>
    </div>
  );
}

export default Sidebar;
