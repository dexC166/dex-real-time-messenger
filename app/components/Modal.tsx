/**
 * Reusable Modal Component for Dex Real-Time Messenger
 *
 * This file provides a highly reusable Modal component for our Next.js 14
 * real-time messaging application. It implements a comprehensive dialog system
 * using Headless UI with smooth animations, accessibility features, and
 * consistent styling that ensures optimal user experience throughout the messaging platform.
 *
 * Key Features:
 * - Headless UI Dialog integration for accessibility compliance
 * - Smooth enter/exit animations with Transition components
 * - Backdrop overlay with click-to-close functionality
 * - Built-in close button with proper focus management
 * - Responsive design for mobile and desktop
 * - Portal-based rendering to prevent z-index issues
 *
 * Modal Types:
 * - SettingsModal: User profile and account settings
 * - GroupChatModal: Group conversation creation
 * - ConfirmModal: Confirmation dialogs for destructive actions
 * - ImageModal: Image viewing and display
 * - LoadingModal: Loading states and progress indicators
 *
 * This component is essential for our messaging app because it provides the
 * dialog interface that enables settings management, group chat creation,
 * confirmation dialogs, and all other modal interactions in our
 * real-time messaging platform.
 *
 * @fileoverview Reusable Modal component for Next.js 14 real-time messaging application
 * @author Dayle Cortes
 * @since 2025
 */

'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { IoClose } from 'react-icons/io5';

/**
 * Modal Component Props Interface
 *
 * Defines the complete interface for the Modal component, providing type safety
 * and clear documentation for all available props and their purposes.
 *
 * @interface ModalProps
 * @property {boolean} [isOpen] - Whether the modal is currently open and visible
 * @property {() => void} onClose - Callback function to close the modal
 * @property {React.ReactNode} children - Content to be rendered inside the modal
 */
interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

/**
 * Reusable Modal Component
 *
 * A highly flexible and accessible modal component that provides consistent
 * dialog behavior across our messaging application. This component
 * implements comprehensive modal functionality with Headless UI, smooth
 * animations, and accessibility features that ensure optimal user experience.
 *
 * Key Capabilities:
 * - Headless UI Dialog integration for accessibility compliance
 * - Smooth enter/exit animations with Transition components
 * - Backdrop overlay with click-to-close functionality
 * - Built-in close button with proper focus management
 * - Responsive design for mobile and desktop
 * - Portal-based rendering to prevent z-index issues
 *
 * Modal Types Supported:
 * - SettingsModal: User profile and account settings
 * - GroupChatModal: Group conversation creation
 * - ConfirmModal: Confirmation dialogs for destructive actions
 * - ImageModal: Image viewing and display
 * - LoadingModal: Loading states and progress indicators
 *
 * Usage Patterns:
 * - SettingsModal: Profile management and account settings
 * - GroupChatModal: Group conversation creation with member selection
 * - ConfirmModal: Confirmation dialogs for conversation deletion
 * - ImageModal: Image viewing and display in conversations
 * - LoadingModal: Loading states during data fetching
 *
 * Accessibility Features:
 * - Proper ARIA attributes and semantic HTML
 * - Focus management and keyboard navigation
 * - Screen reader friendly announcements
 * - Escape key support for closing
 * - Focus trapping within modal content
 *
 * Animation System:
 * - Backdrop fade in/out with opacity transitions
 * - Modal panel slide and scale animations
 * - Smooth enter/exit transitions (300ms/200ms)
 * - Responsive animations for mobile and desktop
 * - Hardware-accelerated transforms
 *
 * This component is crucial for our messaging app because it provides the
 * dialog interface that enables all modal interactions throughout the
 * application, ensuring a cohesive and accessible user experience
 * across settings, conversations, and user management.
 *
 * @param {ModalProps} props - Component props for modal configuration
 * @returns {JSX.Element} Styled modal dialog with animations and accessibility
 *
 * @example
 * ```tsx
 * // Settings modal
 * <Modal isOpen={isOpen} onClose={onClose}>
 *   <SettingsForm />
 * </Modal>
 *
 * // Confirmation modal
 * <Modal isOpen={isOpen} onClose={onClose}>
 *   <ConfirmDialog onConfirm={handleDelete} />
 * </Modal>
 * ```
 */
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="
              fixed
              inset-0
              bg-gray-500
              bg-opacity-75
              transition-opacity
            "
          />
        </Transition.Child>
        <div
          className="
            fixed
            inset-0
            z-10
            overflow-y-auto
          "
        >
          <div
            className="
              flex
              min-h-full
              items-center
              justify-center
              p-4
              text-center
              sm:p-0
            "
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className="
                  relative
                  transform
                  overflow-hidden
                  rounded-lg
                  bg-white
                  px-4
                  pb-4
                  text-left
                  shadow-xl
                  transition-all
                  w-full
                  sm:my-8
                  sm:w-full
                  sm:max-w-lg
                  sm:p-6
                "
              >
                <div
                  className="
                    absolute
                    right-0
                    top-0
                    hidden
                    pr-4
                    pt-4
                    sm:block
                    z-10
                  "
                >
                  <button
                    type="button"
                    className="
                      rounded-md
                      bg-white
                      text-gray-400
                      hover:text-gray-500
                      focus:outline-none
                      focus:ring-2
                      focus:ring-sky-500
                      focus:ring-offset-2
                    "
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <IoClose className="h-6 w-6" />
                  </button>
                </div>
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Modal;
