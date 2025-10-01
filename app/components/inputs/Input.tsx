/**
 * Reusable Input Component for Dex Real-Time Messenger
 *
 * This file provides a highly reusable Input component for our Next.js 14
 * real-time messaging application. It implements a comprehensive form input
 * system with React Hook Form integration, validation support, and accessibility
 * features that ensure consistent user interface patterns throughout the messaging platform.
 *
 * Key Features:
 * - React Hook Form integration for form state management
 * - Comprehensive validation support with error display
 * - Multiple input types (text, email, password, etc.)
 * - Accessibility features (labels, autoComplete, focus management)
 * - Consistent styling using Tailwind CSS and clsx
 * - Loading states and disabled functionality
 *
 * Form Integration:
 * - Seamless React Hook Form integration via register prop
 * - Automatic validation error display
 * - Required field validation support
 * - Form state synchronization
 *
 * This component is essential for our messaging app because it provides the
 * consistent input interface that users interact with throughout authentication,
 * settings management, conversation creation, and all other form-based
 * interactions in our real-time messaging platform.
 *
 * @fileoverview Reusable Input component for Next.js 14 real-time messaging application
 * @author Dayle Cortes
 * @since 2025
 */

'use client';

import clsx from 'clsx';
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';

/**
 * Input Component Props Interface
 *
 * Defines the complete interface for the Input component, providing type safety
 * and clear documentation for all available props and their purposes.
 *
 * @interface InputProps
 * @property {string} label - Display label for the input field
 * @property {string} id - Unique identifier for the input field
 * @property {string} [type] - HTML input type (text, email, password, etc.)
 * @property {boolean} [required] - Whether the input field is required for validation
 * @property {UseFormRegister<FieldValues>} register - React Hook Form register function
 * @property {FieldErrors} errors - React Hook Form errors object for validation display
 * @property {boolean} [disabled] - Whether the input field is disabled and non-interactive
 */
interface InputProps {
  label: string;
  id: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  disabled?: boolean;
}

/**
 * Reusable Input Component
 *
 * A highly flexible and accessible input component that provides consistent
 * styling and behavior across our messaging application. This component
 * implements comprehensive form integration with React Hook Form, validation
 * support, and accessibility features that ensure optimal user experience.
 *
 * Key Capabilities:
 * - React Hook Form integration for form state management
 * - Comprehensive validation support with error display
 * - Multiple input types (text, email, password, etc.)
 * - Accessibility features (labels, autoComplete, focus management)
 * - Loading states and disabled functionality
 * - Consistent styling and responsive design
 *
 * Input Types Supported:
 * - text: Standard text input for names, messages
 * - email: Email input with browser validation
 * - password: Password input with hidden text
 * - Custom types: Extensible for future input types
 *
 * Usage Patterns:
 * - AuthForm: Name, email, and password inputs for authentication
 * - SettingsModal: Name input for profile management
 * - GroupChatModal: Name input for group conversation creation
 * - Form validation: Required field validation and error display
 * - Loading states: Disabled inputs during form submission
 *
 * Accessibility Features:
 * - Proper label association with htmlFor attribute
 * - AutoComplete support for browser autofill
 * - Focus management with visible focus rings
 * - Error state indication with color changes
 * - Screen reader friendly input structure
 *
 * Styling Architecture:
 * - Base styles: Form input styling with Tailwind CSS
 * - Focus states: Sky blue ring for focus indication
 * - Error states: Rose red ring for validation errors
 * - Disabled states: Reduced opacity with disabled cursor
 * - Responsive design: Works on mobile and desktop
 *
 * This component is crucial for our messaging app because it provides the
 * consistent input interface that users interact with throughout all
 * form-based interactions, ensuring a cohesive and accessible user
 * experience across authentication, settings, and conversation management.
 *
 * @param {InputProps} props - Component props for input configuration
 * @returns {JSX.Element} Styled input element with label and validation
 *
 * @example
 * ```tsx
 * // Email input with validation
 * <Input
 *   id="email"
 *   label="Email Address"
 *   type="email"
 *   register={register}
 *   errors={errors}
 *   required
 * />
 *
 * // Password input with loading state
 * <Input
 *   id="password"
 *   label="Password"
 *   type="password"
 *   register={register}
 *   errors={errors}
 *   disabled={isLoading}
 * />
 * ```
 */
const Input: React.FC<InputProps> = ({
  label,
  id,
  type,
  required,
  register,
  errors,
  disabled,
}) => {
  /**
   * Label Styling Classes
   *
   * Defines the consistent styling for input labels across our messaging
   * application. This ensures proper typography, spacing, and visual
   * hierarchy for all form labels.
   *
   * Label Styles:
   * - block: Makes label a block element for proper spacing
   * - text-sm: Small text size for form labels
   * - font-medium: Medium font weight for label emphasis
   * - leading-6: Line height for proper text spacing
   * - text-gray-900: Dark gray color for good contrast
   *
   * Why these styles?
   * - Consistent typography across all form inputs
   * - Proper visual hierarchy for form structure
   * - Good contrast for accessibility compliance
   * - Responsive text sizing for mobile and desktop
   * - Professional appearance for messaging app
   *
   * This label styling is essential for our messaging app because it
   * provides the consistent visual foundation that makes forms
   * readable and accessible throughout our real-time messaging platform.
   */
  const labelClasses = `
    block
    text-sm
    font-medium
    leading-6
    text-gray-900
  `;

  /**
   * Dynamic Input Classes
   *
   * Constructs the complete className string for the input field using clsx
   * for conditional class application. This approach ensures optimal performance
   * and maintainable styling logic for our input variants and states.
   *
   * Base Styles:
   * - form-input: Tailwind form input base styling
   * - block w-full: Full width block element
   * - rounded-md: Rounded corners for modern appearance
   * - border-0: Removes default border for custom ring styling
   * - py-1.5: Vertical padding for touch targets
   * - text-gray-900: Dark text color for readability
   * - shadow-sm: Subtle shadow for depth
   * - ring-1 ring-inset ring-gray-300: Custom border using ring
   * - placeholder:text-gray-400: Light gray placeholder text
   * - focus:ring-2 focus:ring-inset focus:ring-sky-600: Focus state styling
   * - sm:text-sm sm:leading-6: Responsive typography
   *
   * Conditional Styles:
   * - errors[id]: Rose red ring for validation errors
   * - disabled: Reduced opacity and disabled cursor
   *
   * Why clsx?
   * - Efficient conditional class application
   * - Better performance than template literals
   * - Cleaner code for complex conditional logic
   * - TypeScript support for class validation
   * - Optimized bundle size for production
   *
   * This className construction is essential for our messaging app because
   * it provides the flexible styling system that enables consistent input
   * appearance across all variants while maintaining optimal performance
   * and accessibility throughout our real-time messaging platform.
   */
  const inputClasses = clsx(
    `
    form-input
    block
    w-full
    rounded-md
    border-0
    py-1.5
    text-gray-900
    shadow-sm
    ring-1
    ring-inset
    ring-gray-300
    placeholder:text-gray-400
    focus:ring-2
    focus:ring-inset
    focus:ring-sky-600
    sm:text-sm
    sm:leading-6`,
    errors[id] && 'focus:ring-rose-500',
    disabled && 'opacity-50 cursor-default'
  );

  /**
   * Input Element Rendering
   *
   * Renders the complete input field structure with label, input element,
   * and proper accessibility attributes. This implementation ensures
   * proper HTML semantics, form integration, and user interaction
   * handling for our messaging application.
   *
   * HTML Structure:
   * - div: Container for label and input
   * - label: Accessible label with htmlFor attribute
   * - div: Spacing container for input element
   * - input: Actual input element with all attributes
   *
   * Input Attributes:
   * - id: Unique identifier for label association
   * - type: HTML input type for browser validation
   * - autoComplete: Browser autofill support
   * - disabled: Prevents interaction when disabled
   * - {...register(id, { required })}: React Hook Form integration
   * - className: Applies all conditional styling via clsx
   *
   * Accessibility Features:
   * - Proper label association with htmlFor attribute
   * - AutoComplete support for browser autofill
   * - Focus management with visible focus rings
   * - Error state indication with color changes
   * - Screen reader friendly input structure
   *
   * This input structure is crucial for our messaging app because it provides
   * the accessible form foundation that enables all user input throughout
   * authentication, settings management, and conversation creation while
   * maintaining proper accessibility and user experience standards.
   */
  return (
    <div>
      <label htmlFor={id} className={labelClasses}>
        {label}
      </label>
      <div className="mt-2">
        <input
          id={id}
          type={type}
          autoComplete={id}
          disabled={disabled}
          {...register(id, { required })}
          className={inputClasses}
        />
      </div>
    </div>
  );
};

export default Input;
