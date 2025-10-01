/**
 * Conversations Loading Component for Dex Real-Time Messenger
 *
 * This file provides the conversations loading component for our Next.js 14 real-time
 * messaging application. It implements route-level loading state using Next.js
 * App Router loading.tsx pattern with LoadingModal integration that ensures
 * optimal user experience during conversations page data fetching and navigation.
 *
 * Key Features:
 * - Next.js App Router loading.tsx pattern implementation
 * - LoadingModal component integration for consistent loading UI
 * - Route-level loading state for conversations page transitions
 * - Server-side data fetching loading feedback
 * - Consistent loading experience across conversations interface
 * - Integration with conversations layout and page components
 *
 * Loading Patterns:
 * - Route-level loading: Next.js loading.tsx for page transitions
 * - Server-side data fetching: getConversations and getUsers actions loading feedback
 * - Navigation transitions: Conversations page route changes
 * - Layout loading: Conversations layout component data fetching
 * - User experience: Consistent loading feedback throughout conversations interface
 *
 * This component is essential for our messaging app because it provides the
 * route-level loading state that keeps users informed during conversations page
 * data fetching and navigation transitions, ensuring smooth user experience
 * throughout our messaging platform.
 *
 * @fileoverview Conversations loading component for Next.js 14 real-time messaging application
 * @author Dayle Cortes
 * @since 2025
 */

import LoadingModal from '../components/LoadingModal';

/**
 * Conversations Loading Component
 *
 * A route-level loading component that provides loading feedback for the conversations
 * page using Next.js App Router loading.tsx pattern. This component implements
 * LoadingModal integration for consistent loading UI that ensures optimal user
 * experience during conversations page data fetching and navigation transitions.
 *
 * Key Capabilities:
 * - Next.js App Router loading.tsx pattern implementation
 * - LoadingModal component integration for consistent loading UI
 * - Route-level loading state for conversations page transitions
 * - Server-side data fetching loading feedback
 * - Consistent loading experience across conversations interface
 * - Integration with conversations layout and page components
 *
 * Loading Types Supported:
 * - Route-level loading: Next.js loading.tsx for page transitions
 * - Server-side data fetching: getConversations and getUsers actions loading feedback
 * - Navigation transitions: Conversations page route changes
 * - Layout loading: Conversations layout component data fetching
 * - User experience: Consistent loading feedback throughout conversations interface
 *
 * Usage Patterns:
 * - Conversations page loading: Route-level loading for /conversations page transitions
 * - Server-side fetching: getConversations and getUsers actions loading feedback
 * - Navigation transitions: Conversations page route changes and navigation
 * - Layout loading: Conversations layout component data fetching
 * - User experience: Consistent loading feedback throughout conversations interface
 *
 * Next.js App Router Integration:
 * - loading.tsx pattern: Automatic loading UI for route segments
 * - Route-level loading: Loading state for entire conversations page
 * - Server-side data fetching: Loading feedback during getConversations and getUsers actions
 * - Navigation transitions: Loading state during route changes
 * - Layout integration: Loading state for conversations layout component
 *
 * LoadingModal Integration:
 * - Full-screen loading overlay with backdrop
 * - React-spinners ClipLoader integration for animated spinner
 * - Headless UI Dialog integration for accessibility compliance
 * - Smooth enter/exit animations with Transition components
 * - Non-dismissible modal to prevent user interaction during loading
 * - Consistent styling with messaging app design system
 *
 * This component is crucial for our messaging app because it provides the
 * route-level loading state that keeps users informed during conversations page
 * data fetching and navigation transitions, ensuring smooth user experience
 * throughout our messaging platform.
 *
 * @returns {JSX.Element} LoadingModal component for conversations page loading state
 *
 * @example
 * ```tsx
 * // Next.js App Router automatically uses this loading.tsx file
 * // when navigating to /conversations route or when conversations layout is loading
 * // Displays LoadingModal with animated spinner and backdrop
 * // Provides consistent loading feedback during data fetching
 * ```
 */
const Loading = () => {
  return <LoadingModal />;
};

export default Loading;
