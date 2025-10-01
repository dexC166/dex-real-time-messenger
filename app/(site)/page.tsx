/**
 * Authentication Page for Dex Real-Time Messenger
 *
 * This file provides the main authentication page for our Next.js 14
 * real-time messaging application. It implements a comprehensive
 * authentication interface with multiple login methods, responsive design,
 * and seamless integration with NextAuth.js for secure user access
 * to the messaging platform.
 *
 * Key Features:
 * - Multi-provider authentication interface (OAuth + credentials)
 * - Responsive design for mobile and desktop devices
 * - NextAuth.js integration for secure authentication
 * - Branded authentication experience with logo and styling
 * - Seamless integration with AuthForm component
 * - Automatic redirect for authenticated users
 *
 * Authentication Methods Supported:
 * - Google OAuth: One-click authentication with Google accounts
 * - GitHub OAuth: Developer-friendly authentication with GitHub
 * - Credentials: Traditional email/password authentication
 * - Registration: New user account creation with validation
 *
 * This page is essential for our messaging app because it provides the
 * secure entry point that enables users to access real-time messaging
 * features while maintaining authentication security and user experience
 * throughout our messaging platform.
 *
 * @fileoverview Authentication page for Next.js 14 real-time messaging application
 * @author Dayle Cortes
 * @since 2025
 */

import Image from 'next/image';
import AuthForm from './components/AuthForm';

/**
 * Authentication Page Component
 *
 * A comprehensive authentication page that provides the main entry point
 * for our messaging application. This component implements a responsive
 * authentication interface with multiple login methods, branded design,
 * and seamless integration with NextAuth.js for secure user access.
 *
 * Key Capabilities:
 * - Multi-provider authentication interface (OAuth + credentials)
 * - Responsive design for mobile and desktop devices
 * - NextAuth.js integration for secure authentication
 * - Branded authentication experience with logo and styling
 * - Seamless integration with AuthForm component
 * - Automatic redirect for authenticated users
 *
 * Authentication Methods Supported:
 * - Google OAuth: One-click authentication with Google accounts
 * - GitHub OAuth: Developer-friendly authentication with GitHub
 * - Credentials: Traditional email/password authentication
 * - Registration: New user account creation with validation
 *
 * Usage Patterns:
 * - Entry point: Main authentication page for unauthenticated users
 * - OAuth integration: Google and GitHub authentication flows
 * - Credential authentication: Email/password login and registration
 * - Responsive design: Mobile and desktop authentication experience
 * - Branded experience: Logo and consistent messaging app styling
 *
 * Authentication Features:
 * - Multi-provider support: Google, GitHub, and credentials
 * - Responsive design: Mobile-first authentication interface
 * - Branded experience: Logo and consistent app styling
 * - Form integration: AuthForm component for authentication logic
 * - Security: NextAuth.js integration for secure authentication
 *
 * Design Features:
 * - Responsive layout: Mobile and desktop optimized
 * - Branded interface: Logo and consistent app styling
 * - Centered design: Professional authentication experience
 * - Accessibility: Proper semantic HTML and ARIA attributes
 * - Performance: Next.js Image optimization for logo
 *
 * This component is crucial for our messaging app because it provides the
 * secure authentication entry point that enables users to access real-time
 * messaging features while maintaining security and user experience
 * throughout our messaging platform.
 *
 * @returns {JSX.Element} Authentication page with logo, title, and AuthForm
 *
 * @example
 * ```tsx
 * // Route: / (root route for unauthenticated users)
 * // Renders authentication page with multiple login methods
 * // Integrates with NextAuth.js for secure authentication
 * // Redirects authenticated users to /users
 * ```
 */
const Auth = () => {
  return (
    <div
      className="
        flex
        min-h-full
        flex-col
        justify-center
        py-12
        sm:px-6
        lg:px-8
        bg-gray-100
      "
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Image
          height="48"
          width="48"
          className="mx-auto w-auto"
          src="/images/logo.png"
          alt="Logo"
        />
        <h2
          className="
            mt-6
            text-center
            text-3xl
            font-bold
            tracking-tight
            text-gray-900
          "
        >
          Sign into your account
        </h2>
      </div>
      <AuthForm />
    </div>
  );
};

export default Auth;
