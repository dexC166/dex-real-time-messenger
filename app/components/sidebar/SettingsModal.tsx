/**
 * Settings Modal Component for Dex Real-Time Messenger
 *
 * This file provides a specialized SettingsModal component for our Next.js 14
 * real-time messaging application. It implements user profile management
 * with form handling, image upload, API integration, and modal functionality
 * that ensures optimal user experience for profile settings and account management.
 *
 * Key Features:
 * - User profile management with name and image editing
 * - Cloudinary image upload integration with CldUploadButton
 * - React Hook Form integration with validation and error handling
 * - API integration with /api/settings endpoint for profile updates
 * - Modal integration with Headless UI for accessibility
 * - Loading states and user feedback with react-hot-toast
 *
 * Settings Modal Usage Patterns:
 * - DesktopSidebar: User profile settings access via avatar click
 * - Profile management: Name and image editing functionality
 * - Account settings: User profile information updates
 * - Image upload: Cloudinary integration for profile pictures
 * - Form validation: React Hook Form with error handling
 *
 * This component is essential for our messaging app because it provides the
 * user profile management interface that enables users to update their
 * account information, profile pictures, and personal settings throughout our
 * real-time messaging platform.
 *
 * @fileoverview Settings Modal component for Next.js 14 real-time messaging application
 * @author Dayle Cortes
 * @since 2025
 */

'use client';

import { User } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Modal from '../Modal';
import Input from '../inputs/Input';
import Image from 'next/image';
import { CldUploadButton } from 'next-cloudinary';
import Button from '../Button';
import clsx from 'clsx';

/**
 * Settings Modal Component Props Interface
 *
 * Defines the complete interface for the SettingsModal component, providing type safety
 * and clear documentation for all available props and their purposes.
 *
 * @interface SettingsModalProps
 * @property {User} currentUser - Current authenticated user object with profile information
 * @property {boolean} [isOpen] - Whether the modal is currently open/visible
 * @property {() => void} onClose - Function to close the modal
 */
interface SettingsModalProps {
  currentUser: User;
  isOpen?: boolean;
  onClose: () => void;
}

/**
 * Settings Modal Component
 *
 * A comprehensive settings modal component that provides user profile management
 * for our messaging application. This component implements profile editing
 * functionality with form handling, image upload, API integration, and modal
 * functionality that ensures optimal user experience for account settings.
 *
 * Key Capabilities:
 * - User profile management with name and image editing
 * - Cloudinary image upload integration with CldUploadButton
 * - React Hook Form integration with validation and error handling
 * - API integration with /api/settings endpoint for profile updates
 * - Modal integration with Headless UI for accessibility
 * - Loading states and user feedback with react-hot-toast
 *
 * Settings Modal Types Supported:
 * - Profile editing: Name and image modification
 * - Image upload: Cloudinary integration for profile pictures
 * - Form validation: React Hook Form with error handling
 * - API integration: Profile updates via /api/settings endpoint
 * - Modal interface: Headless UI modal with accessibility features
 *
 * Usage Patterns:
 * - DesktopSidebar: User profile settings access via avatar click
 * - Profile management: Name and image editing functionality
 * - Account settings: User profile information updates
 * - Image upload: Cloudinary integration for profile pictures
 * - Form validation: React Hook Form with error handling
 *
 * Profile Management Features:
 * - Name editing: Text input with validation and error handling
 * - Image upload: Cloudinary integration with CldUploadButton
 * - Form validation: React Hook Form with real-time validation
 * - API integration: Profile updates via /api/settings endpoint
 * - Loading states: Disabled form during API operations
 *
 * Image Upload Features:
 * - Cloudinary integration: CldUploadButton for image upload
 * - Image preview: Real-time preview of selected image
 * - Upload validation: Single file upload with validation
 * - Fallback handling: Placeholder image for missing profiles
 * - Loading states: Disabled upload during form submission
 *
 * Form Integration Features:
 * - React Hook Form: Comprehensive form state management
 * - Field validation: Required field validation and error display
 * - Form submission: API integration with loading states
 * - Error handling: Toast notifications for success/error states
 * - Router integration: Page refresh after successful updates
 *
 * This component is crucial for our messaging app because it provides the
 * user profile management interface that enables users to update their
 * account information, profile pictures, and personal settings throughout all
 * user account management interfaces.
 *
 * @param {SettingsModalProps} props - Component props for settings modal configuration
 * @returns {JSX.Element} Settings modal with profile editing form
 *
 * @example
 * ```tsx
 * // In DesktopSidebar
 * <SettingsModal
 *   currentUser={currentUser}
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 * />
 *
 * // With user data
 * <SettingsModal
 *   currentUser={userData}
 *   isOpen={modalOpen}
 *   onClose={handleClose}
 * />
 * ```
 */
const SettingsModal: React.FC<SettingsModalProps> = ({
  currentUser,
  isOpen,
  onClose,
}) => {
  /**
   * Router and Loading State Management
   *
   * Manages the Next.js router and loading state for the settings modal.
   * This provides the core functionality for navigation and user feedback
   * during profile update operations.
   *
   * What this manages:
   * - Router: Next.js useRouter for page refresh after updates
   * - Loading state: isLoading state for form submission feedback
   * - User feedback: Loading indicators during API operations
   * - Navigation: Page refresh after successful profile updates
   * - State management: Form submission state control
   *
   * Why this pattern?
   * - User feedback: Loading states provide clear operation feedback
   * - Navigation: Router refresh ensures updated data display
   * - State management: Local state for form submission control
   * - User experience: Clear feedback during profile updates
   * - Performance: Efficient state management for form operations
   *
   * This state management is essential for our messaging app because
   * it provides the user feedback and navigation functionality that
   * ensures smooth profile update operations throughout the
   * user account management interface.
   */
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  /**
   * React Hook Form Configuration
   *
   * Configures React Hook Form for profile editing with validation,
   * error handling, and form state management. This provides the
   * core form functionality for user profile updates.
   *
   * What this provides:
   * - Form registration: register function for form field registration
   * - Form submission: handleSubmit for form submission handling
   * - Value setting: setValue for programmatic value updates
   * - Field watching: watch for real-time field value monitoring
   * - Error handling: errors object for validation error display
   * - Default values: Current user data as form default values
   *
   * Why this pattern?
   * - Form validation: Built-in validation with error handling
   * - State management: Comprehensive form state management
   * - User experience: Real-time validation and feedback
   * - Performance: Efficient form state updates
   * - Integration: Seamless integration with form components
   *
   * This form configuration is essential for our messaging app because
   * it provides the form management functionality that enables
   * smooth profile editing with validation and error handling
   * throughout the user account management interface.
   */
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: currentUser?.name,
      image: currentUser?.image,
    },
  });

  /**
   * Image Field Monitoring
   *
   * Monitors the image field value for real-time preview updates.
   * This provides the image preview functionality that shows users
   * their selected image before form submission.
   *
   * What this provides:
   * - Real-time monitoring: watch function for image field changes
   * - Image preview: Current image value for preview display
   * - Form integration: Seamless integration with form state
   * - User feedback: Visual feedback for image selection
   * - State synchronization: Form state and UI synchronization
   *
   * Why this pattern?
   * - User experience: Real-time image preview feedback
   * - Form integration: Seamless integration with form state
   * - State management: Efficient field value monitoring
   * - Visual feedback: Clear indication of selected image
   * - Performance: Optimized field watching for image updates
   *
   * This image monitoring is essential for our messaging app because
   * it provides the image preview functionality that enables
   * users to see their selected profile image before submission
   * throughout the profile management interface.
   */
  const image = watch('image');

  /**
   * Cloudinary Image Upload Handler
   *
   * Handles image upload from Cloudinary and updates the form
   * with the uploaded image URL. This provides the image upload
   * functionality for profile picture updates.
   *
   * What this handles:
   * - Image upload: Cloudinary upload result processing
   * - Form updates: setValue for image field updates
   * - Validation: shouldValidate for form validation trigger
   * - URL extraction: secure_url from Cloudinary result
   * - Form integration: Seamless integration with form state
   *
   * Why this pattern?
   * - Image upload: Cloudinary integration for profile pictures
   * - Form integration: Seamless integration with form state
   * - Validation: Automatic form validation after image upload
   * - User experience: Immediate feedback for image selection
   * - Performance: Efficient image upload and form updates
   *
   * This upload handler is essential for our messaging app because
   * it provides the image upload functionality that enables
   * users to update their profile pictures seamlessly
   * throughout the profile management interface.
   */
  const handleUpload = (result: any) => {
    setValue('image', result?.info?.secure_url, {
      shouldValidate: true,
    });
  };

  /**
   * Form Submission Handler
   *
   * Handles form submission for profile updates with API integration,
   * loading states, and user feedback. This provides the complete
   * profile update functionality with error handling.
   *
   * What this handles:
   * - Form submission: handleSubmit for form data processing
   * - API integration: axios POST to /api/settings endpoint
   * - Loading states: setIsLoading for form submission feedback
   * - Success handling: router.refresh() and modal close
   * - Error handling: toast.error for API error feedback
   * - User feedback: Loading states and success/error notifications
   *
   * Why this pattern?
   * - API integration: Seamless integration with backend API
   * - User feedback: Clear feedback for success/error states
   * - Loading states: Disabled form during API operations
   * - Navigation: Page refresh for updated data display
   * - Error handling: Comprehensive error handling with user feedback
   *
   * This submission handler is essential for our messaging app because
   * it provides the profile update functionality that enables
   * users to save their profile changes with proper feedback
   * throughout the user account management interface.
   */
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    axios
      .post('/api/settings', data)
      .then(() => {
        router.refresh();
        onClose();
      })
      .catch(() => toast.error('Something went wrong!'))
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12">
          <div className="border-gray-900/10 pb-12">
            <h2
              className="
                text-base
                font-semibold
                leading-7
                text-gray-900
              "
            >
              Profile
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Edit your public information.
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
                disabled={isLoading}
                label="Name"
                id="name"
                errors={errors}
                required
                register={register}
              />
              <div>
                <label
                  className="
                    block
                    text-sm
                    font-medium
                    leading-6
                    text-gray-900
                  "
                >
                  Photo
                </label>
                <div
                  className="
                    mt-2
                    flex
                    items-center
                    gap-x-3
                  "
                  style={{
                    pointerEvents: isLoading ? 'none' : 'auto',
                  }}
                >
                  <Image
                    width="48"
                    height="48"
                    className="rounded-full"
                    src={
                      image || currentUser?.image || '/images/placeholder.jpg'
                    }
                    alt="Avatar"
                  />
                  <CldUploadButton
                    options={{ maxFiles: 1 }}
                    onUpload={handleUpload}
                    uploadPreset={
                      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
                    }
                  >
                    <div
                      className={clsx(
                        `
                        flex
                        justify-center
                        px-3
                        py-2
                        text-sm
                        font-semibold
                        focus-visible:outline
                        focus-visible:outline-2
                        focus-visible:outline-offset-2`,
                        isLoading
                          ? 'opacity-50 cursor-default'
                          : 'opacity-100 cursor-pointer'
                      )}
                    >
                      Change
                    </div>
                  </CldUploadButton>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div
              className="
                mt-6
                flex
                items-center
                justify-end
                gap-x-6
              "
            >
              <Button disabled={isLoading} secondary onClick={onClose}>
                Cancel
              </Button>
              <Button disabled={isLoading} type="submit">
                Submit
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default SettingsModal;
