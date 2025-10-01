/**
 * Users Layout Component for Dex Real-Time Messenger
 *
 * This file provides the users layout component for our Next.js 14 real-time
 * messaging application. It implements user management interface with server-side
 * data fetching, responsive sidebar layout, and user list display that ensures
 * optimal user experience for user discovery and contact management.
 *
 * Key Features:
 * - Server-side user data fetching with getUsers action
 * - Responsive sidebar layout with Sidebar component
 * - User list display with UserList component
 * - Full-height layout with proper content structure
 * - User management interface for contact discovery
 * - Integration with main messaging application layout
 *
 * User Management Features:
 * - User discovery: Display all available users for messaging
 * - Contact management: User list with contact information
 * - Server-side fetching: Optimal performance with pre-loaded data
 * - Responsive design: Mobile and desktop optimized layout
 * - Sidebar integration: Consistent navigation and layout structure
 *
 * This component is essential for our messaging app because it provides the
 * user management interface that enables users to discover and connect with
 * other users for real-time messaging while maintaining consistent layout
 * and navigation throughout our messaging platform.
 *
 * @fileoverview Users layout component for Next.js 14 real-time messaging application
 * @author Dayle Cortes
 * @since 2025
 */

import getUsers from '../actions/getUsers';
import Sidebar from '../components/sidebar/Sidebar';
import UserList from './components/UserList';

/**
 * Users Layout Component
 *
 * A comprehensive users layout component that provides user management interface
 * for our messaging application. This component implements server-side data fetching,
 * responsive sidebar layout, and user list display that ensures optimal user
 * experience for user discovery and contact management.
 *
 * Key Capabilities:
 * - Server-side user data fetching with getUsers action
 * - Responsive sidebar layout with Sidebar component
 * - User list display with UserList component
 * - Full-height layout with proper content structure
 * - User management interface for contact discovery
 * - Integration with main messaging application layout
 *
 * User Management Features:
 * - User discovery: Display all available users for messaging
 * - Contact management: User list with contact information
 * - Server-side fetching: Optimal performance with pre-loaded data
 * - Responsive design: Mobile and desktop optimized layout
 * - Sidebar integration: Consistent navigation and layout structure
 *
 * Usage Patterns:
 * - User management: Main interface for user discovery and contact management
 * - Contact discovery: Display all available users for messaging
 * - User list: Contact information and user interaction
 * - Responsive layout: Mobile and desktop optimized user interface
 * - Sidebar integration: Consistent navigation and layout structure
 *
 * Layout Features:
 * - Server-side fetching: getUsers action for optimal performance
 * - Sidebar integration: Consistent navigation and layout structure
 * - User list display: UserList component with contact information
 * - Full-height layout: Proper content structure with h-full
 * - Responsive design: Mobile and desktop optimized layout
 *
 * Data Flow:
 * - getUsers action: Fetches all users except current user
 * - UserList component: Displays users with contact information
 * - Sidebar component: Provides navigation and layout structure
 * - Children components: Additional user management interfaces
 * - Server-side rendering: Optimal performance with pre-loaded data
 *
 * This component is crucial for our messaging app because it provides the
 * user management interface that enables users to discover and connect with
 * other users for real-time messaging while maintaining consistent layout
 * and navigation throughout our messaging platform.
 *
 * @param {Object} props - Component props containing children to render
 * @param {React.ReactNode} props.children - Child components to render in main content area
 * @returns {Promise<JSX.Element>} Users layout with sidebar, user list, and content area
 *
 * @example
 * ```tsx
 * // Route: /users
 * // Renders users layout with user list and content area
 * // Integrates with Sidebar component for navigation
 * // Displays UserList component with all available users
 * ```
 */
export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /**
   * Server-Side User Data Fetching
   *
   * Fetches all available users for the user management interface using the
   * getUsers action. This server-side data fetching ensures optimal performance
   * and provides user data needed for contact discovery and user interaction.
   *
   * What getUsers provides:
   * - All users except current authenticated user
   * - User profile information (name, email, image)
   * - User creation timestamps for sorting
   * - User data for contact discovery and messaging
   * - Optimized database query with proper filtering
   *
   * Why server-side fetching?
   * - Optimal performance: Data fetched on server before rendering
   * - SEO benefits: User data available for server-side rendering
   * - Security: User data fetched securely on server
   * - Consistency: Same user data across all components
   * - Performance: Reduces client-side API calls
   *
   * This user data fetching is essential for our messaging app because
   * it provides the user information needed for contact discovery,
   * user interaction, and all user management features throughout
   * the messaging platform.
   */
  const users = await getUsers();

  return (
    <Sidebar>
      <div className="h-full">
        <UserList items={users} />
        {children}
      </div>
    </Sidebar>
  );
}
