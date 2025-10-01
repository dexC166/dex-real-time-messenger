/**
 * Conversations Layout Component for Dex Real-Time Messenger
 *
 * This file provides the conversations layout component for our Next.js 14 real-time
 * messaging application. It implements conversation management interface with server-side
 * data fetching, responsive sidebar layout, and conversation list display that ensures
 * optimal user experience for conversation discovery and real-time messaging.
 *
 * Key Features:
 * - Server-side conversation and user data fetching
 * - Responsive sidebar layout with Sidebar component
 * - Conversation list display with ConversationList component
 * - Full-height layout with proper content structure
 * - Conversation management interface for messaging
 * - Integration with main messaging application layout
 *
 * Conversation Management Features:
 * - Conversation discovery: Display all user conversations
 * - User management: User list for group chat creation
 * - Server-side fetching: Optimal performance with pre-loaded data
 * - Responsive design: Mobile and desktop optimized layout
 * - Sidebar integration: Consistent navigation and layout structure
 *
 * This component is essential for our messaging app because it provides the
 * conversation management interface that enables users to access and manage
 * their conversations while maintaining consistent layout and navigation
 * throughout our real-time messaging platform.
 *
 * @fileoverview Conversations layout component for Next.js 14 real-time messaging application
 * @author Dayle Cortes
 * @since 2025
 */

import getConversations from '../actions/getConversations';
import getUsers from '../actions/getUsers';
import Sidebar from '../components/sidebar/Sidebar';
import ConversationList from './components/ConversationList';

/**
 * Conversations Layout Component
 *
 * A comprehensive conversations layout component that provides conversation management
 * interface for our messaging application. This component implements server-side data
 * fetching, responsive sidebar layout, and conversation list display that ensures
 * optimal user experience for conversation discovery and real-time messaging.
 *
 * Key Capabilities:
 * - Server-side conversation and user data fetching
 * - Responsive sidebar layout with Sidebar component
 * - Conversation list display with ConversationList component
 * - Full-height layout with proper content structure
 * - Conversation management interface for messaging
 * - Integration with main messaging application layout
 *
 * Conversation Management Features:
 * - Conversation discovery: Display all user conversations
 * - User management: User list for group chat creation
 * - Server-side fetching: Optimal performance with pre-loaded data
 * - Responsive design: Mobile and desktop optimized layout
 * - Sidebar integration: Consistent navigation and layout structure
 *
 * Usage Patterns:
 * - Conversation management: Main interface for conversation discovery and management
 * - Conversation discovery: Display all user conversations for messaging
 * - User management: User list for group chat creation and conversation initiation
 * - Responsive layout: Mobile and desktop optimized conversation interface
 * - Sidebar integration: Consistent navigation and layout structure
 *
 * Layout Features:
 * - Server-side fetching: getConversations and getUsers actions for optimal performance
 * - Sidebar integration: Consistent navigation and layout structure
 * - Conversation list display: ConversationList component with conversation data
 * - Full-height layout: Proper content structure with h-full
 * - Responsive design: Mobile and desktop optimized layout
 *
 * Data Flow:
 * - getConversations action: Fetches all user conversations with messages and participants
 * - getUsers action: Fetches all users for group chat creation
 * - ConversationList component: Displays conversations with real-time updates
 * - Sidebar component: Provides navigation and layout structure
 * - Children components: Additional conversation interfaces (conversation pages)
 * - Server-side rendering: Optimal performance with pre-loaded data
 *
 * This component is crucial for our messaging app because it provides the
 * conversation management interface that enables users to access and manage
 * their conversations while maintaining consistent layout and navigation
 * throughout our real-time messaging platform.
 *
 * @param {Object} props - Component props containing children to render
 * @param {React.ReactNode} props.children - Child components to render in main content area
 * @returns {Promise<JSX.Element>} Conversations layout with sidebar, conversation list, and content area
 *
 * @example
 * ```tsx
 * // Route: /conversations
 * // Renders conversations layout with conversation list and content area
 * // Integrates with Sidebar component for navigation
 * // Displays ConversationList component with all user conversations
 * ```
 */
export default async function ConversationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /**
   * Server-Side Conversation Data Fetching
   *
   * Fetches all user conversations for the conversation management interface using the
   * getConversations action. This server-side data fetching ensures optimal performance
   * and provides conversation data needed for conversation discovery and messaging.
   *
   * What getConversations provides:
   * - All conversations where current user is a participant
   * - Conversation metadata (name, isGroup, lastMessageAt)
   * - User participants for each conversation
   * - Recent messages with sender and read receipt information
   * - Optimized database query with proper filtering and includes
   *
   * Why server-side fetching?
   * - Optimal performance: Data fetched on server before rendering
   * - SEO benefits: Conversation data available for server-side rendering
   * - Security: Conversation data fetched securely on server
   * - Consistency: Same conversation data across all components
   * - Performance: Reduces client-side API calls
   *
   * This conversation data fetching is essential for our messaging app because
   * it provides the conversation information needed for conversation discovery,
   * real-time messaging, and all conversation management features throughout
   * the messaging platform.
   */
  const conversations = await getConversations();

  /**
   * Server-Side User Data Fetching
   *
   * Fetches all available users for group chat creation and conversation management
   * using the getUsers action. This server-side data fetching ensures optimal performance
   * and provides user data needed for group chat creation and user interaction.
   *
   * What getUsers provides:
   * - All users except current authenticated user
   * - User profile information (name, email, image)
   * - User creation timestamps for sorting
   * - User data for group chat creation and conversation initiation
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
   * it provides the user information needed for group chat creation,
   * conversation initiation, and all user management features throughout
   * the messaging platform.
   */
  const users = await getUsers();

  return (
    <Sidebar>
      <div className="h-full">
        <ConversationList users={users} initialItems={conversations} />
        {children}
      </div>
    </Sidebar>
  );
}
