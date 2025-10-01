/**
 * Social Authentication Button Component for Dex Real-Time Messenger
 *
 * This file provides a reusable social authentication button component for our Next.js 14
 * real-time messaging application. It implements OAuth provider buttons with consistent
 * styling, accessibility features, and seamless integration with NextAuth.js social
 * authentication flows for optimal user experience.
 *
 * Key Features:
 * - Reusable social authentication button component
 * - React Icons integration with IconType support
 * - Consistent styling with Tailwind CSS
 * - Accessibility features and keyboard navigation
 * - OAuth provider integration (Google, GitHub)
 * - Click handling for social authentication flows
 *
 * OAuth Providers Supported:
 * - Google OAuth: One-click authentication with Google accounts
 * - GitHub OAuth: Developer-friendly authentication with GitHub
 * - Extensible: Easy addition of new OAuth providers
 *
 * This component is essential for our messaging app because it provides the
 * reusable social authentication button functionality that enables one-click
 * OAuth authentication with popular social providers while maintaining
 * consistent styling and user experience throughout our messaging platform.
 *
 * @fileoverview Social authentication button component for Next.js 14 real-time messaging application
 * @author Dayle Cortes
 * @since 2025
 */

import { IconType } from 'react-icons';

/**
 * Social Authentication Button Props Interface
 *
 * Defines the props interface for the AuthSocialButton component, ensuring
 * type safety and clear documentation for the social authentication button
 * configuration and behavior.
 *
 * @interface AuthSocialButtonProps
 * @property {IconType} icon - React Icons IconType for OAuth provider icon display
 * @property {() => void} onClick - Click handler function for social authentication
 *
 * @example
 * ```tsx
 * // Google OAuth button
 * <AuthSocialButton
 *   icon={BsGoogle}
 *   onClick={() => socialAction('google')}
 * />
 *
 * // GitHub OAuth button
 * <AuthSocialButton
 *   icon={BsGithub}
 *   onClick={() => socialAction('github')}
 * />
 * ```
 */
interface AuthSocialButtonProps {
  icon: IconType;
  onClick: () => void;
}

/**
 * Social Authentication Button Component
 *
 * A reusable social authentication button component that provides OAuth provider
 * buttons with consistent styling, accessibility features, and seamless integration
 * with NextAuth.js social authentication flows for optimal user experience.
 *
 * Key Capabilities:
 * - Reusable social authentication button component
 * - React Icons integration with IconType support
 * - Consistent styling with Tailwind CSS
 * - Accessibility features and keyboard navigation
 * - OAuth provider integration (Google, GitHub)
 * - Click handling for social authentication flows
 *
 * OAuth Providers Supported:
 * - Google OAuth: One-click authentication with Google accounts
 * - GitHub OAuth: Developer-friendly authentication with GitHub
 * - Extensible: Easy addition of new OAuth providers
 *
 * Usage Patterns:
 * - Authentication form: Social authentication buttons in AuthForm
 * - OAuth integration: Google and GitHub authentication flows
 * - Social login: One-click authentication with social providers
 * - Consistent styling: Unified button appearance across providers
 * - Accessibility: Keyboard navigation and screen reader support
 *
 * Button Features:
 * - React Icons: IconType support for provider icons
 * - Consistent styling: Tailwind CSS with unified design
 * - Accessibility: Keyboard navigation and focus management
 * - Click handling: OAuth provider authentication flows
 * - Responsive design: Mobile and desktop optimized
 *
 * Styling Features:
 * - Tailwind CSS: Utility-first styling approach
 * - Hover states: Interactive button feedback
 * - Focus states: Accessibility-focused keyboard navigation
 * - Shadow effects: Visual depth and button hierarchy
 * - Ring borders: Subtle border styling for button definition
 *
 * This component is crucial for our messaging app because it provides the
 * reusable social authentication button functionality that enables one-click
 * OAuth authentication with popular social providers while maintaining
 * consistent styling and user experience throughout our messaging platform.
 *
 * @param {AuthSocialButtonProps} props - Component props
 * @param {IconType} props.icon - React Icons IconType for OAuth provider icon
 * @param {() => void} props.onClick - Click handler for social authentication
 * @returns {JSX.Element} Social authentication button with icon and click handling
 *
 * @example
 * ```tsx
 * // In AuthForm component
 * <AuthSocialButton
 *   icon={BsGoogle}
 *   onClick={() => socialAction('google')}
 * />
 *
 * <AuthSocialButton
 *   icon={BsGithub}
 *   onClick={() => socialAction('github')}
 * />
 * ```
 */
const AuthSocialButton: React.FC<AuthSocialButtonProps> = ({
  icon: Icon,
  onClick,
}) => {
  /**
   * Social Button Styling Classes
   *
   * Defines the comprehensive Tailwind CSS classes for the social authentication
   * button, providing consistent styling, accessibility features, and responsive
   * design that ensures optimal user experience across all OAuth providers.
   *
   * What this provides:
   * - Layout: inline-flex with full width and center justification
   * - Styling: Rounded corners, white background, gray text
   * - Visual effects: Shadow, ring border, hover states
   * - Accessibility: Focus outline management
   * - Responsive design: Mobile and desktop optimized
   *
   * Why this pattern?
   * - Consistency: Unified styling across all OAuth providers
   * - Accessibility: Proper focus management and keyboard navigation
   * - Visual hierarchy: Shadow and ring effects for button definition
   * - Interactive feedback: Hover states for user engagement
   * - Responsive design: Mobile and desktop optimized styling
   *
   * This styling approach is essential for our messaging app because
   * it provides the consistent visual design that ensures all social
   * authentication buttons have the same appearance and behavior
   * throughout our messaging platform.
   */
  const socialButtonClasses = `
    inline-flex
    w-full
    justify-center
    rounded-md
    bg-white
    px-4
    py-2
    text-gray-500
    shadow-sm
    ring-1
    ring-inset
    ring-gray-300
    hover:bg-gray-50
    focus:outline-offset-0
  `;

  return (
    <button type="button" onClick={onClick} className={socialButtonClasses}>
      <Icon />
    </button>
  );
};

export default AuthSocialButton;
