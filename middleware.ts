/**
 * Next.js Middleware for Dex Real-Time Messenger
 *
 * This middleware file implements authentication protection for our Next.js 14 real-time
 * messaging application. It acts as a security gatekeeper, ensuring that only authenticated
 * users can access protected routes while redirecting unauthenticated users to the login page.
 *
 * Key Features:
 * - Route protection using NextAuth.js middleware
 * - Automatic redirect to login page for unauthenticated users
 * - Protection of core messaging functionality
 * - Seamless integration with NextAuth.js authentication flow
 *
 * Protected Routes:
 * - /users/*: User management and user selection for conversations
 * - /conversations/*: All conversation-related pages and messaging functionality
 *
 * This middleware is essential for our messaging app because it ensures that sensitive
 * user data and conversations are only accessible to authenticated users, maintaining
 * privacy and security in our real-time messaging platform.
 *
 * @fileoverview Next.js middleware for authentication protection in Next.js 14 App Router
 * @author Dayle Cortes
 * @since 2025
 */

import { withAuth } from 'next-auth/middleware';

/**
 * NextAuth Middleware Configuration
 *
 * Configures NextAuth.js middleware to protect specific routes and handle authentication
 * redirects. This middleware runs on the Edge Runtime, providing fast authentication
 * checks before pages are rendered.
 *
 * How it works:
 * 1. Intercepts requests to protected routes (defined in config.matcher)
 * 2. Checks if user has a valid session via NextAuth.js
 * 3. If authenticated: Allows access to the requested route
 * 4. If not authenticated: Redirects to the sign-in page
 *
 * This is crucial for our messaging app because it prevents unauthorized access to:
 * - User lists and profiles
 * - Private conversations and messages
 * - Real-time messaging functionality
 * - User settings and preferences
 */
export default withAuth({
  /**
   * Authentication Pages Configuration
   *
   * Defines where users should be redirected when authentication is required.
   * This ensures a smooth user experience by directing unauthenticated users
   * to the appropriate login page.
   */
  pages: {
    /**
     * Sign-In Page Route
     *
     * Redirects unauthenticated users to the root path ('/') which displays
     * our authentication form. This is the entry point for users who need
     * to log in to access protected features.
     *
     * Why '/' as the sign-in page?
     * - Provides a clean, branded login experience
     * - Matches our app's authentication flow design
     * - Ensures users see our custom login form with OAuth options
     * - Maintains consistency with our app's routing structure
     */
    signIn: '/',
  },
});

/**
 * Middleware Route Matcher Configuration
 *
 * Defines which routes should be protected by the authentication middleware.
 * This configuration uses glob patterns to match multiple route variations
 * efficiently.
 *
 * Route Patterns Explained:
 * - '/users/:path*': Matches /users and any sub-routes (e.g., /users/settings)
 * - '/conversations/:path*': Matches /conversations and any sub-routes (e.g., /conversations/123)
 *
 * Why these specific routes?
 * - /users/*: Contains user management, user selection, and user discovery features
 * - /conversations/*: Contains all messaging functionality, conversation lists, and chat interfaces
 *
 * These are the core features of our messaging app that require authentication
 * to protect user privacy and ensure proper access control.
 */
export const config = {
  matcher: ['/users/:path*', '/conversations/:path*'],
};
