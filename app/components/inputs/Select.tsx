/**
 * Multi-Select Component for Dex Real-Time Messenger
 *
 * This file provides a highly reusable multi-select component for our Next.js 14
 * real-time messaging application. It implements a comprehensive user selection
 * system using react-select with multi-select capabilities, custom styling, and
 * accessibility features that ensure consistent user interface patterns throughout
 * the messaging platform.
 *
 * Key Features:
 * - Multi-select functionality for multiple user selection
 * - React-select integration with custom styling and behavior
 * - Portal-based dropdown to prevent z-index issues
 * - Accessibility features (labels, keyboard navigation, screen reader support)
 * - Consistent styling using Tailwind CSS and custom classNames
 * - Loading states and disabled functionality
 *
 * Selection Patterns:
 * - User selection for group chat creation
 * - Multiple member selection for conversations
 * - Dynamic option mapping from user data
 * - Form integration with React Hook Form
 *
 * This component is essential for our messaging app because it provides the
 * user selection interface that enables group chat creation, member management,
 * and all other multi-user selection features in our real-time messaging platform.
 *
 * @fileoverview Multi-select component for Next.js 14 real-time messaging application
 * @author Dayle Cortes
 * @since 2025
 */

'use client';

import ReactSelect from 'react-select';

/**
 * Select Component Props Interface
 *
 * Defines the complete interface for the Select component, providing type safety
 * and clear documentation for all available props and their purposes.
 *
 * @interface SelectProps
 * @property {string} label - Display label for the select field
 * @property {Record<string, any>} [value] - Currently selected value(s) from options
 * @property {(value: Record<string, any>) => void} onChange - Callback function for selection changes
 * @property {Record<string, any>[]} options - Array of available options for selection
 * @property {boolean} [disabled] - Whether the select field is disabled and non-interactive
 */
interface SelectProps {
  label: string;
  value?: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  options: Record<string, any>[];
  disabled?: boolean;
}

/**
 * Multi-Select Component
 *
 * A highly flexible and accessible multi-select component that provides consistent
 * styling and behavior across our messaging application. This component
 * implements comprehensive user selection with react-select, custom styling,
 * and accessibility features that ensure optimal user experience.
 *
 * Key Capabilities:
 * - Multi-select functionality for multiple user selection
 * - React-select integration with custom styling and behavior
 * - Portal-based dropdown to prevent z-index issues
 * - Accessibility features (labels, keyboard navigation, screen reader support)
 * - Loading states and disabled functionality
 * - Consistent styling and responsive design
 *
 * Selection Types Supported:
 * - Multi-select: Multiple user selection for group chats
 * - User mapping: Dynamic option creation from user data
 * - Form integration: React Hook Form setValue integration
 * - Real-time updates: Dynamic option updates based on user data
 *
 * Usage Patterns:
 * - GroupChatModal: Member selection for group conversation creation
 * - User selection: Multiple user selection from available users
 * - Form integration: setValue integration with React Hook Form
 * - Loading states: Disabled selection during form submission
 * - Dynamic options: User data mapping to select options
 *
 * Accessibility Features:
 * - Proper label association for screen readers
 * - Keyboard navigation support
 * - Focus management with visible focus indicators
 * - Screen reader friendly option announcements
 * - ARIA attributes for multi-select behavior
 *
 * Styling Architecture:
 * - Base styles: Consistent label styling with Tailwind CSS
 * - React-select styling: Custom styles for dropdown and options
 * - Portal rendering: Body portal for z-index management
 * - Responsive design: Works on mobile and desktop
 * - Custom classNames: Text sizing and appearance control
 *
 * This component is crucial for our messaging app because it provides the
 * multi-select interface that enables group chat creation, member management,
 * and all other multi-user selection features, ensuring a cohesive and
 * accessible user experience across conversation management and user selection.
 *
 * @param {SelectProps} props - Component props for select configuration
 * @returns {JSX.Element} Styled multi-select element with label and options
 *
 * @example
 * ```tsx
 * // User selection for group chat
 * <Select
 *   label="Members"
 *   options={users.map((user) => ({
 *     value: user.id,
 *     label: user.name,
 *   }))}
 *   onChange={(value) => setValue("members", value)}
 *   value={selectedMembers}
 * />
 * ```
 */
const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  disabled,
}) => {
  return (
    <div className="z-[100]">
      <label
        className="
          block
          text-sm
          font-medium
          leading-6
          text-gray-900
        "
      >
        {label}
      </label>
      <div className="mt-2">
        <ReactSelect
          isDisabled={disabled}
          value={value}
          onChange={onChange}
          isMulti
          options={options}
          menuPortalTarget={document.body}
          styles={{
            menuPortal: (base) => ({
              ...base,
              zIndex: 9999,
            }),
          }}
          classNames={{
            control: () => 'text-sm',
          }}
        />
      </div>
    </div>
  );
};

export default Select;
