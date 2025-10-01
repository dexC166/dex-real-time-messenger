/**
 * Root Layout Component for Dex Real-Time Messenger
 *
 * This file defines the root layout component for our Next.js 14 App Router
 * real-time messaging application. It serves as the foundation for the entire
 * application, providing global context providers, typography configuration,
 * and the basic HTML structure that wraps all pages and components.
 *
 * Key Features:
 * - Global context providers (AuthContext, ToasterContext)
 * - Typography configuration with Google Fonts (Inter)
 * - Global CSS imports and styling foundation
 * - Real-time messaging infrastructure (ActiveStatus)
 * - SEO metadata configuration
 *
 * Context Providers:
 * - AuthContext: Client-side authentication state management
 * - ToasterContext: Global toast notification system
 * - ActiveStatus: Real-time user presence tracking
 *
 * This layout is essential for our messaging app because it provides the
 * global infrastructure that enables authentication, notifications, real-time
 * features, and consistent styling across all pages and components in our
 * real-time messaging platform.
 *
 * @fileoverview Root layout component for Next.js 14 real-time messaging application
 * @author Dayle Cortes
 * @since 2025
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ToasterContext from './context/ToasterContext';
import AuthContext from './context/AuthContext';
import ActiveStatus from './components/ActiveStatus';

/**
 * Inter Font Configuration
 *
 * Configures the Inter font family from Google Fonts for our messaging application.
 * Inter is chosen for its excellent readability and modern appearance, which is
 * essential for a messaging app where users spend extended time reading text.
 *
 * Font Configuration:
 * - Family: Inter (Google Fonts)
 * - Subsets: ['latin'] for optimal loading performance
 * - Usage: Applied globally via className to body element
 * - Optimization: Next.js automatically optimizes font loading
 *
 * Why Inter?
 * - Excellent readability for extended text reading
 * - Modern, clean appearance suitable for messaging UI
 * - Wide character support for international users
 * - Optimized for both desktop and mobile displays
 * - Consistent with modern web application standards
 *
 * This font configuration is crucial for our messaging app because it ensures
 * consistent, readable typography across all components, improving user
 * experience during extended messaging sessions.
 */
const inter = Inter({ subsets: ['latin'] });

/**
 * Root Layout Props Interface
 *
 * Defines the props interface for the RootLayout component, ensuring type safety
 * and proper component usage throughout our messaging application.
 *
 * @interface RootLayoutProps
 * @property {React.ReactNode} children - Child components to be rendered within the layout
 */
interface RootLayoutProps {
  children: React.ReactNode;
}

/**
 * Application Metadata Configuration
 *
 * Defines the global metadata for our real-time messaging application, including
 * SEO information, page titles, and social media sharing data. This metadata
 * is used by search engines, social media platforms, and browser tabs.
 *
 * Metadata Features:
 * - Page title for browser tabs and bookmarks
 * - Description for search engine results
 * - Social media sharing optimization
 * - SEO-friendly application information
 *
 * Why this metadata?
 * - "Dex-Real-Time-Messenger": Clear, descriptive application name
 * - "FB Messenger Inspired": Indicates functionality and user expectations
 * - SEO optimization for discoverability
 * - Consistent branding across all pages
 *
 * This metadata is essential for our messaging app because it provides
 * clear identification and description for users, search engines, and
 * social media platforms, improving discoverability and user trust.
 */
export const metadata: Metadata = {
  title: 'Dex-Real-Time-Messenger',
  description: 'FB Messenger Inspired',
};

/**
 * Root Layout Component
 *
 * The main layout component that wraps the entire application with global
 * context providers, typography, and HTML structure. This component serves
 * as the foundation for all pages and components in our real-time messaging
 * application.
 *
 * Key Capabilities:
 * - Provides global context providers for app-wide state
 * - Configures typography and styling foundation
 * - Renders the basic HTML structure (html, body)
 * - Integrates real-time messaging infrastructure
 * - Enables consistent user experience across all pages
 *
 * Context Provider Hierarchy:
 * - AuthContext: Wraps entire app for authentication state
 * - ToasterContext: Provides global toast notifications
 * - ActiveStatus: Manages real-time user presence
 * - children: All page components and content
 *
 * HTML Structure:
 * - html: Root HTML element with language attribute
 * - body: Main content container with typography classes
 * - Context providers: Authentication, notifications, real-time features
 * - children: Dynamic page content from App Router
 *
 * This component is crucial for our messaging app because it provides the
 * global infrastructure that enables authentication, real-time features,
 * notifications, and consistent styling across all pages and components.
 *
 * @param {RootLayoutProps} props - Component props containing children to render
 * @returns {JSX.Element} Complete HTML structure with context providers
 *
 * @example
 * ```tsx
 * // Automatically used by Next.js App Router
 * // Wraps all pages in app/ directory
 * <RootLayout>
 *   <PageContent />
 * </RootLayout>
 * ```
 */
const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContext>
          <ToasterContext />
          <ActiveStatus />
          {children}
        </AuthContext>
      </body>
    </html>
  );
};

export default RootLayout;
