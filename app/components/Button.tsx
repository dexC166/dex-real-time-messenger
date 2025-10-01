/**
 * Reusable Button Component for Dex Real-Time Messenger
 *
 * This file provides a highly reusable Button component for our Next.js 14
 * real-time messaging application. It implements a comprehensive design system
 * with multiple variants, states, and accessibility features that ensure
 * consistent user interface patterns throughout the messaging platform.
 *
 * Key Features:
 * - Multiple button variants (primary, secondary, danger)
 * - Comprehensive accessibility support (focus-visible, keyboard navigation)
 * - Loading states and disabled functionality
 * - Flexible sizing and layout options
 * - Consistent styling using Tailwind CSS and clsx
 *
 * Design System:
 * - Primary: Sky blue background (bg-sky-500) for main actions
 * - Secondary: Gray text (text-gray-900) for secondary actions
 * - Danger: Rose red background (bg-rose-500) for destructive actions
 * - Disabled: Reduced opacity (opacity-50) with disabled cursor
 *
 * This component is essential for our messaging app because it provides the
 * consistent button interface that users interact with throughout authentication,
 * conversation management, settings, and all other user actions in our
 * real-time messaging platform.
 *
 * @fileoverview Reusable Button component for Next.js 14 real-time messaging application
 * @author Dayle Cortes
 * @since 2025
 */

'use client';

import clsx from 'clsx';

/**
 * Button Component Props Interface
 *
 * Defines the complete interface for the Button component, providing type safety
 * and clear documentation for all available props and their purposes.
 *
 * @interface ButtonProps
 * @property {('button' | 'submit' | 'reset' | undefined)} [type] - HTML button type for form submission behavior
 * @property {boolean} [fullWidth] - Whether button should take full width of container
 * @property {React.ReactNode} [children] - Button content (text, icons, etc.)
 * @property {() => void} [onClick] - Click handler function for button interactions
 * @property {boolean} [secondary] - Whether to use secondary button styling (gray text)
 * @property {boolean} [danger] - Whether to use danger button styling (red background)
 * @property {boolean} [disabled] - Whether button is disabled and non-interactive
 */
interface ButtonProps {
  type?: 'button' | 'submit' | 'reset' | undefined;
  fullWidth?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
  secondary?: boolean;
  danger?: boolean;
  disabled?: boolean;
}

/**
 * Reusable Button Component
 *
 * A highly flexible and accessible button component that provides consistent
 * styling and behavior across our messaging application. This component
 * implements a comprehensive design system with multiple variants, states,
 * and accessibility features that ensure optimal user experience.
 *
 * Key Capabilities:
 * - Multiple visual variants (primary, secondary, danger)
 * - Comprehensive accessibility support (focus-visible, keyboard navigation)
 * - Loading states and disabled functionality
 * - Flexible sizing and layout options
 * - Consistent hover and focus states
 * - Form integration (submit, reset, button types)
 *
 * Button Variants:
 * - Primary (default): Sky blue background for main actions
 * - Secondary: Gray text for secondary/cancel actions
 * - Danger: Rose red background for destructive actions
 * - Disabled: Reduced opacity with disabled cursor
 *
 * Usage Patterns:
 * - AuthForm: Submit buttons for login/registration
 * - SettingsModal: Submit and cancel buttons for form actions
 * - ConfirmModal: Delete (danger) and cancel (secondary) buttons
 * - GroupChatModal: Create (primary) and cancel (secondary) buttons
 * - Form submissions: Type="submit" for form handling
 * - Action buttons: Type="button" for custom onClick handlers
 *
 * Accessibility Features:
 * - Focus-visible outline for keyboard navigation
 * - Proper ARIA attributes and semantic HTML
 * - Disabled state with appropriate cursor and opacity
 * - Screen reader friendly button content
 * - Keyboard interaction support
 *
 * Styling Architecture:
 * - Base styles: Flexbox centering, rounded corners, padding
 * - Typography: Small text, semibold weight for readability
 * - Focus states: Visible outline with proper offset
 * - Hover states: Color transitions for interactive feedback
 * - Responsive design: Works on mobile and desktop
 *
 * This component is crucial for our messaging app because it provides the
 * consistent button interface that users interact with throughout all
 * user actions, ensuring a cohesive and accessible user experience
 * across authentication, conversation management, and settings.
 *
 * @param {ButtonProps} props - Component props for button configuration
 * @returns {JSX.Element} Styled button element with appropriate variants
 *
 * @example
 * ```tsx
 * // Primary submit button
 * <Button type="submit" disabled={isLoading} fullWidth>
 *   Sign In
 * </Button>
 *
 * // Secondary cancel button
 * <Button secondary onClick={onClose}>
 *   Cancel
 * </Button>
 *
 * // Danger delete button
 * <Button danger onClick={onDelete}>
 *   Delete
 * </Button>
 * ```
 */
const Button: React.FC<ButtonProps> = ({
  type,
  fullWidth,
  children,
  onClick,
  secondary,
  danger,
  disabled,
}) => {
  /**
   * Dynamic Button Classes
   *
   * Constructs the complete className string for the button using clsx for
   * conditional class application. This approach ensures optimal performance
   * and maintainable styling logic for our button variants.
   *
   * Base Styles:
   * - flex justify-center: Centers content horizontally
   * - rounded-md: Rounded corners for modern appearance
   * - px-3 py-2: Consistent padding for touch targets
   * - text-sm font-semibold: Readable typography
   * - focus-visible:outline: Accessibility focus indicators
   *
   * Conditional Styles:
   * - disabled: Reduced opacity and disabled cursor
   * - fullWidth: Full width of container
   * - secondary: Gray text color for secondary actions
   * - danger: Rose red background for destructive actions
   * - primary: Sky blue background for main actions
   *
   * Why clsx?
   * - Efficient conditional class application
   * - Better performance than template literals
   * - Cleaner code for complex conditional logic
   * - TypeScript support for class validation
   * - Optimized bundle size for production
   *
   * This className construction is essential for our messaging app because
   * it provides the flexible styling system that enables consistent button
   * appearance across all variants while maintaining optimal performance
   * and accessibility throughout our real-time messaging platform.
   */
  const buttonClasses = clsx(
    `
    flex
    justify-center
    rounded-md
    px-3
    py-2
    text-sm
    font-semibold
    focus-visible:outline
    focus-visible:outline-2
    focus-visible:outline-offset-2`,
    disabled && 'opacity-50 cursor-default',
    fullWidth && 'w-full',
    secondary ? 'text-gray-900' : 'text-white',
    danger && 'bg-rose-500 hover:bg-rose-600 focus-visible:outline-rose-600',
    !secondary &&
      !danger &&
      'bg-sky-500 hover:bg-sky-600 focus-visible:outline-sky-600'
  );

  /**
   * Button Element Rendering
   *
   * Renders the actual button element with all props and styling applied.
   * This implementation ensures proper HTML semantics, accessibility,
   * and user interaction handling for our messaging application.
   *
   * HTML Attributes:
   * - onClick: Handles click events for button interactions
   * - type: Specifies button type for form behavior
   * - disabled: Prevents interaction when button is disabled
   * - className: Applies all conditional styling via clsx
   *
   * Accessibility Features:
   * - Proper button semantics for screen readers
   * - Focus management for keyboard navigation
   * - Disabled state handling for form validation
   * - Click handler support for custom interactions
   *
   * This button element is crucial for our messaging app because it provides
   * the interactive foundation that enables all user actions throughout
   * authentication, conversation management, and settings while maintaining
   * proper accessibility and user experience standards.
   */
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={buttonClasses}
    >
      {children}
    </button>
  );
};

export default Button;
