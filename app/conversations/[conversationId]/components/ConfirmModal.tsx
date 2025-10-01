/**
 * Confirmation Modal Component for Dex Real-Time Messenger
 *
 * This file provides a specialized confirmation modal component for our Next.js 14 real-time
 * messaging application. It implements conversation deletion confirmation with destructive
 * action warnings, API integration, and user feedback that ensures optimal user
 * experience for destructive operations and data management.
 *
 * Key Features:
 * - Conversation deletion confirmation with destructive action warnings
 * - API integration for conversation deletion via DELETE endpoint
 * - Loading states and user feedback with toast notifications
 * - Navigation management with router integration
 * - Accessibility features with Headless UI Dialog
 * - Responsive design with mobile and desktop optimization
 *
 * Confirmation Features:
 * - Destructive action warnings with visual indicators
 * - Clear confirmation messaging and user guidance
 * - API integration for conversation deletion
 * - Loading states during deletion process
 * - Error handling with user feedback
 * - Navigation management after successful deletion
 *
 * This component is essential for our messaging app because it provides the
 * confirmation interface that enables users to safely delete conversations
 * while maintaining proper user experience and data integrity
 * throughout our real-time messaging platform.
 *
 * @fileoverview Confirmation modal component for Next.js 14 real-time messaging application
 * @author Dayle Cortes
 * @since 2025
 */

'use client';

import Button from '@/app/components/Button';
import Modal from '@/app/components/Modal';
import useConversation from '@/app/hooks/useConversation';
import { Dialog } from '@headlessui/react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { FiAlertTriangle } from 'react-icons/fi';

/**
 * Confirmation Modal Props Interface
 *
 * Defines the props interface for the ConfirmModal component, specifying
 * the required data for confirmation dialog functionality.
 *
 * @interface ConfirmModalProps
 * @property {boolean} [isOpen] - Whether the modal is currently open and visible
 * @property {() => void} onClose - Callback function to close the modal
 */
interface ConfirmModalProps {
  isOpen?: boolean;
  onClose: () => void;
}

/**
 * Confirmation Modal Component
 *
 * A specialized confirmation modal component that provides conversation deletion
 * confirmation with destructive action warnings, API integration, and user feedback
 * for our messaging application. This component implements confirmation functionality
 * with proper error handling and navigation management that ensures optimal
 * user experience for destructive operations and data management.
 *
 * Key Capabilities:
 * - Conversation deletion confirmation with destructive action warnings
 * - API integration for conversation deletion via DELETE endpoint
 * - Loading states and user feedback with toast notifications
 * - Navigation management with router integration
 * - Accessibility features with Headless UI Dialog
 * - Responsive design with mobile and desktop optimization
 *
 * Confirmation Features:
 * - Destructive action warnings with visual indicators
 * - Clear confirmation messaging and user guidance
 * - API integration for conversation deletion
 * - Loading states during deletion process
 * - Error handling with user feedback
 * - Navigation management after successful deletion
 *
 * Usage Patterns:
 * - ProfileDrawer component: Conversation deletion confirmation
 * - Destructive actions: Confirmation for conversation deletion
 * - User feedback: Loading states and error handling
 * - Navigation: Redirect to conversations list after deletion
 * - Modal integration: Overlay display for confirmation dialog
 *
 * Layout Features:
 * - Warning icon: Red alert triangle with background circle
 * - Confirmation text: Clear title and description
 * - Action buttons: Delete (danger) and Cancel (secondary) buttons
 * - Responsive design: Mobile and desktop optimized layout
 * - Accessibility: Proper ARIA attributes and semantic HTML
 *
 * API Integration Features:
 * - DELETE /api/conversations/{conversationId}: Conversation deletion endpoint
 * - Loading states: Button disabled during API call
 * - Error handling: Toast notifications for API errors
 * - Success handling: Navigation and modal closure
 * - Router integration: Push to conversations and refresh
 *
 * This component is crucial for our messaging app because it provides the
 * confirmation interface that enables users to safely delete conversations
 * while maintaining proper user experience and data integrity
 * throughout our real-time messaging platform.
 *
 * @param {ConfirmModalProps} props - Component props for confirmation modal configuration
 * @param {boolean} [props.isOpen] - Whether the modal is currently open and visible
 * @param {() => void} props.onClose - Callback function to close the modal
 * @returns {JSX.Element} Confirmation modal with conversation deletion interface
 *
 * @example
 * ```tsx
 * // In ProfileDrawer component
 * <ConfirmModal
 *   isOpen={confirmOpen}
 *   onClose={() => setConfirmOpen(false)}
 * />
 *
 * // With confirmation state management
 * <ConfirmModal isOpen={isOpen} onClose={handleClose} />
 * ```
 */
const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose }) => {
  /**
   * Router Integration
   *
   * Integrates with Next.js router for navigation management after successful
   * conversation deletion. This integration provides proper navigation flow
   * and ensures users are redirected to the conversations list after deletion.
   *
   * What useRouter provides:
   * - Navigation methods (push, refresh, back, forward)
   * - Current route information
   * - Programmatic navigation control
   * - Route state management
   * - Navigation history access
   *
   * Why router integration is essential:
   * - Navigation flow: Redirects user after successful deletion
   * - User experience: Maintains proper navigation state
   * - Route management: Ensures user lands on correct page
   * - State refresh: Refreshes route data after deletion
   * - Performance: Efficient navigation without full page reload
   *
   * This router integration is essential for our messaging app because
   * it provides the navigation management that ensures proper user
   * flow and experience after conversation deletion.
   */
  const router = useRouter();

  /**
   * Conversation ID Integration
   *
   * Integrates with the useConversation hook to get the current conversation ID
   * for conversation deletion API calls. This integration provides conversation
   * context for the deletion operation and ensures the correct conversation
   * is targeted for deletion.
   *
   * What useConversation provides:
   * - Current conversation ID from URL parameters
   * - Conversation state management
   * - URL parameter extraction
   * - Conversation context for deletion
   * - Performance optimization with useMemo
   *
   * Why conversation ID is essential:
   * - API targeting: Ensures correct conversation is deleted
   * - User context: Maintains conversation context throughout deletion
   * - Data integrity: Prevents accidental deletion of wrong conversation
   * - Performance: Efficient conversation-specific deletion
   * - User experience: Provides clear context for deletion operation
   *
   * This conversation ID integration is essential for our messaging app because
   * it provides the conversation context that enables proper conversation
   * deletion and maintains data integrity throughout the messaging interface.
   */
  const { conversationId } = useConversation();

  /**
   * Loading State Management
   *
   * Manages the loading state during conversation deletion using React useState hook
   * to provide user feedback and prevent multiple deletion attempts. This state
   * management enables proper loading indicators and button state control.
   *
   * What this state provides:
   * - Loading state for deletion operation
   * - Button disabled state during API call
   * - User feedback for operation progress
   * - Prevention of multiple deletion attempts
   * - UI state management for deletion process
   *
   * Why useState for isLoading:
   * - User feedback: Provides loading indicators during deletion
   * - Button control: Disables buttons during API call
   * - Error prevention: Prevents multiple deletion attempts
   * - User experience: Shows operation progress to user
   * - Performance: Efficient state management for loading states
   *
   * This loading state management is essential for our messaging app because
   * it provides the user feedback that ensures proper deletion
   * experience and prevents user confusion during the deletion process.
   */
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Conversation Deletion Handler
   *
   * Handles conversation deletion with API integration, loading states,
   * error handling, and navigation management. This handler provides
   * complete conversation deletion functionality with proper user feedback.
   *
   * What this handler does:
   * - Sets loading state to true at start of deletion
   * - Calls DELETE /api/conversations/{conversationId} endpoint
   * - Handles successful deletion with navigation and modal closure
   * - Handles errors with toast notifications
   * - Resets loading state after completion
   *
   * Why useCallback for onDelete:
   * - Performance optimization: Prevents unnecessary re-renders
   * - Dependency management: Proper dependency array for optimization
   * - Event handling: Efficient event handler for button clicks
   * - State management: Proper state updates during deletion
   * - API integration: Seamless integration with deletion endpoint
   *
   * Deletion Logic:
   * - Loading start: setIsLoading(true) to show loading state
   * - API call: DELETE request to conversation endpoint
   * - Success handling: Close modal, navigate to conversations, refresh route
   * - Error handling: Show error toast notification
   * - Loading end: setIsLoading(false) to reset loading state
   *
   * This conversation deletion handler is essential for our messaging app because
   * it provides the deletion functionality that enables users to
   * safely delete conversations while maintaining proper user
   * experience and data integrity throughout the messaging interface.
   */
  const onDelete = useCallback(() => {
    setIsLoading(true);

    axios
      .delete(`/api/conversations/${conversationId}`)
      .then(() => {
        onClose();
        router.push('/conversations');
        router.refresh();
      })
      .catch(() => toast.error('Something went wrong!'))
      .finally(() => setIsLoading(false));
  }, [conversationId, router, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="sm:flex sm:items-start">
        <div
          className="
            mx-auto
            flex
            h-12
            w-12
            flex-shrink-0
            items-center
            justify-center
            rounded-full
            bg-red-100
            sm:mx-0
            sm:h-10
            sm:w-10
          "
        >
          <FiAlertTriangle
            className="
              h-6
              w-6
              text-red-600
            "
          />
        </div>
        <div
          className="
            mt-3
            text-center
            sm:ml-4
            sm:mt-0
            sm:text-left
          "
        >
          <Dialog.Title
            as="h3"
            className="
              text-base
              font-semibold
              leading-6
              text-gray-900
            "
          >
            Delete conversation
          </Dialog.Title>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Are you sure you want to delete this conversation? This action
              cannot be undone.
            </p>
          </div>
        </div>
      </div>
      <div
        className="
          mt-5
          sm:mt-4
          sm:flex
          sm:flex-row-reverse
        "
      >
        <Button disabled={isLoading} danger onClick={onDelete}>
          Delete
        </Button>
        <Button disabled={isLoading} secondary onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
