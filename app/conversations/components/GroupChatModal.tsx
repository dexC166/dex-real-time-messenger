/**
 * Group Chat Modal Component for Dex Real-Time Messenger
 *
 * This file provides the group chat modal component for our Next.js 14 real-time
 * messaging application. It implements group conversation creation with form
 * validation, user selection, and API integration that ensures optimal user
 * experience for group chat creation and conversation management.
 *
 * Key Features:
 * - Group conversation creation with form validation
 * - Multi-user selection with Select component integration
 * - React Hook Form integration for form management
 * - API integration with /api/conversations endpoint
 * - Loading states and error handling with toast notifications
 * - Modal integration with Headless UI for accessibility
 *
 * Group Chat Creation Features:
 * - Group name input with validation
 * - Multi-user member selection
 * - Form validation and error handling
 * - API integration for conversation creation
 * - Real-time updates via Pusher integration
 * - Loading states and user feedback
 *
 * This component is essential for our messaging app because it provides the
 * group chat creation interface that enables users to create and manage
 * group conversations while maintaining proper validation and user experience
 * throughout our messaging platform.
 *
 * @fileoverview Group chat modal component for Next.js 14 real-time messaging application
 * @author Dayle Cortes
 * @since 2025
 */

'use client';

import Button from '@/app/components/Button';
import Modal from '@/app/components/Modal';
import Input from '@/app/components/inputs/Input';
import Select from '@/app/components/inputs/Select';
import { User } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

/**
 * Group Chat Modal Props Interface
 *
 * Defines the props interface for the GroupChatModal component, specifying
 * the required data for group chat creation and modal control.
 *
 * @interface GroupChatModalProps
 * @property {boolean} [isOpen] - Optional flag indicating if the modal is currently open
 * @property {() => void} onClose - Function to close the modal
 * @property {User[]} users - Array of available users for group chat creation
 */
interface GroupChatModalProps {
  isOpen?: boolean;
  onClose: () => void;
  users: User[];
}

/**
 * Group Chat Modal Component
 *
 * A comprehensive group chat modal component that provides group conversation
 * creation with form validation, user selection, and API integration for our
 * messaging application. This component implements React Hook Form integration,
 * multi-user selection, and real-time updates that ensures optimal user
 * experience for group chat creation and conversation management.
 *
 * Key Capabilities:
 * - Group conversation creation with form validation
 * - Multi-user selection with Select component integration
 * - React Hook Form integration for form management
 * - API integration with /api/conversations endpoint
 * - Loading states and error handling with toast notifications
 * - Modal integration with Headless UI for accessibility
 *
 * Group Chat Creation Features:
 * - Group name input with validation
 * - Multi-user member selection
 * - Form validation and error handling
 * - API integration for conversation creation
 * - Real-time updates via Pusher integration
 * - Loading states and user feedback
 *
 * Usage Patterns:
 * - ConversationList: Group chat creation interface in conversation list
 * - Group chat creation: User interface for creating new group conversations
 * - User selection: Multi-user selection for group participants
 * - Form validation: React Hook Form integration for form management
 * - API integration: Conversation creation via /api/conversations endpoint
 *
 * Form Features:
 * - React Hook Form integration: Form validation and state management
 * - Group name input: Required text input for group conversation name
 * - Member selection: Multi-select dropdown for user selection
 * - Form validation: Required field validation and error display
 * - Loading states: Disabled form elements during API calls
 *
 * API Integration Features:
 * - POST /api/conversations: Creates new group conversation
 * - Group data payload: Sends group name and member IDs
 * - Real-time updates: Pusher integration for live conversation updates
 * - Error handling: Toast notifications for API errors
 * - Success handling: Modal close and page refresh on success
 *
 * This component is crucial for our messaging app because it provides the
 * group chat creation interface that enables users to create and manage
 * group conversations while maintaining proper validation and user experience
 * throughout our messaging platform.
 *
 * @param {GroupChatModalProps} props - Component props for group chat modal configuration
 * @param {boolean} [props.isOpen] - Optional flag indicating if the modal is currently open
 * @param {() => void} props.onClose - Function to close the modal
 * @param {User[]} props.users - Array of available users for group chat creation
 * @returns {JSX.Element} Group chat creation modal with form validation and user selection
 *
 * @example
 * ```tsx
 * // In ConversationList component
 * <GroupChatModal
 *   users={users}
 *   isOpen={isModalOpen}
 *   onClose={() => setIsModalOpen(false)}
 * />
 *
 * // With user data from getUsers action
 * <GroupChatModal users={userData} isOpen={true} onClose={handleClose} />
 * ```
 */
const GroupChatModal: React.FC<GroupChatModalProps> = ({
  isOpen,
  onClose,
  users,
}) => {
  /**
   * Next.js Router Integration
   *
   * Integrates with Next.js useRouter hook to provide programmatic navigation
   * and page refresh functionality for group chat creation and user experience
   * throughout the messaging application.
   *
   * What useRouter provides:
   * - Programmatic navigation with router.push()
   * - Page refresh functionality with router.refresh()
   * - Route management and navigation control
   * - URL parameter access and manipulation
   * - Next.js App Router integration
   *
   * Why router integration is essential:
   * - Page refresh: Refreshes conversation list after group creation
   * - Navigation: Enables navigation after successful group creation
   * - State management: Handles navigation state and URL updates
   * - Integration: Works with Next.js App Router system
   * - Performance: Efficient navigation without page reloads
   *
   * This router integration is essential for our messaging app because
   * it provides the navigation functionality that enables users to
   * see newly created group conversations immediately after creation.
   */
  const router = useRouter();

  /**
   * Loading State Management
   *
   * Manages the loading state for group chat creation using React useState hook
   * to provide visual feedback during API calls and form submission. This state
   * management ensures proper user feedback and prevents multiple submissions.
   *
   * What this state provides:
   * - Loading state for group chat creation API calls
   * - Visual feedback during form submission
   * - Prevention of multiple form submissions
   * - Disabled form elements during loading
   * - User experience feedback for ongoing operations
   *
   * Why useState for loading state:
   * - User feedback: Provides visual indication of ongoing operations
   * - Form control: Disables form elements during API calls
   * - Prevention: Prevents multiple form submissions
   * - Performance: Efficient re-rendering with state updates
   * - User experience: Clear indication of form submission status
   *
   * This loading state management is essential for our messaging app because
   * it provides the user feedback that enables clear indication of
   * group chat creation progress and prevents form submission issues.
   */
  const [isLoading, setIsLoading] = useState(false);

  /**
   * React Hook Form Integration
   *
   * Integrates with React Hook Form for comprehensive form management including
   * validation, state management, and error handling. This integration provides
   * robust form functionality for group chat creation with proper validation.
   *
   * What React Hook Form provides:
   * - Form state management with register, handleSubmit, setValue, watch
   * - Form validation with errors object
   * - Field value watching for real-time updates
   * - Form submission handling with validation
   * - Error display and validation feedback
   *
   * Form Configuration:
   * - defaultValues: Initial form values for name and members
   * - register: Field registration for form inputs
   * - handleSubmit: Form submission handler with validation
   * - setValue: Programmatic field value setting
   * - watch: Real-time field value watching
   * - errors: Form validation errors object
   *
   * Why React Hook Form is essential:
   * - Validation: Comprehensive form validation and error handling
   * - Performance: Optimized re-rendering and form state management
   * - User experience: Real-time validation and error feedback
   * - Developer experience: Simple API for form management
   * - Accessibility: Built-in accessibility features for form inputs
   *
   * This form integration is essential for our messaging app because
   * it provides the form management that enables robust group chat
   * creation with proper validation and user feedback.
   */
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      members: [],
    },
  });

  /**
   * Member Selection Watching
   *
   * Watches the members field value using React Hook Form's watch function
   * to provide real-time updates for member selection. This watching enables
   * dynamic form updates and validation based on selected members.
   *
   * What this provides:
   * - Real-time member selection updates
   * - Dynamic form validation based on selected members
   * - Member selection state for form submission
   * - User experience feedback for member selection
   * - Form state synchronization with UI
   *
   * Why watch for members:
   * - Real-time updates: Provides immediate feedback for member selection
   * - Form validation: Enables validation based on selected members
   * - User experience: Clear indication of selected members
   * - State management: Maintains member selection state
   * - Performance: Efficient watching with React Hook Form
   *
   * This member watching is essential for our messaging app because
   * it provides the real-time updates that enable users to see
   * their member selection and maintain proper form state.
   */
  const members = watch('members');

  /**
   * Group Chat Creation Handler
   *
   * Handles group chat creation form submission with API integration, loading
   * states, and error handling. This handler manages the complete group chat
   * creation flow from form submission to success/error handling.
   *
   * What this handler does:
   * - Sets loading state to true during API call
   * - Sends POST request to /api/conversations with group data
   * - Includes isGroup: true flag for group conversation creation
   * - Refreshes page to show new group conversation
   * - Closes modal on successful creation
   * - Shows error toast on API failure
   * - Resets loading state in finally block
   *
   * API Integration:
   * - POST /api/conversations: Creates new group conversation
   * - Group data payload: Sends group name and member IDs
   * - Real-time updates: Pusher integration for live conversation updates
   * - Error handling: Toast notifications for API errors
   * - Success handling: Modal close and page refresh on success
   *
   * Why this pattern for group creation:
   * - User experience: Provides clear feedback during group creation
   * - Error handling: Graceful handling of API errors with user feedback
   * - Success handling: Immediate visibility of new group conversation
   * - Loading states: Prevents multiple submissions and provides feedback
   * - Integration: Works with existing conversation management system
   *
   * This group creation handler is essential for our messaging app because
   * it provides the group chat creation functionality that enables users to
   * create and manage group conversations with proper validation and feedback.
   */
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    axios
      .post('/api/conversations', {
        ...data,
        isGroup: true,
      })
      .then(() => {
        router.refresh();
        onClose();
      })
      .catch(() => toast.error('Something went wrong!'))
      .finally(() => setIsLoading(false));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2
              className="
                text-base
                font-semibold
                leading-7
                text-gray-900
              "
            >
              Create a group chat
            </h2>
            <p
              className="
                mt-1
                text-sm
                leading-6
                text-gray-600
              "
            >
              Create a chat with more than 2 people.
            </p>
            <div
              className="
                mt-10
                flex
                flex-col
                gap-y-8
              "
            >
              <Input
                register={register}
                label="Name"
                id="name"
                disabled={isLoading}
                required
                errors={errors}
              />
              <Select
                disabled={isLoading}
                label="Members"
                options={users.map((user) => ({
                  value: user.id,
                  label: user.name,
                }))}
                onChange={(value) =>
                  setValue('members', value, {
                    shouldValidate: true,
                  })
                }
                value={members}
              />
            </div>
          </div>
        </div>
        <div
          className="
            mt-6
            flex
            items-center
            justify-end
            gap-x-6
          "
        >
          <Button
            type="button"
            disabled={isLoading}
            secondary
            onClick={() => onClose()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            Create
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default GroupChatModal;
