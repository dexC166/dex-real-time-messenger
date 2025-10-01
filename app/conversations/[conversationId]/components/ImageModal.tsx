/**
 * Image Modal Component for Dex Real-Time Messenger
 *
 * This file provides a specialized image modal component for our Next.js 14 real-time
 * messaging application. It implements full-size image viewing with modal overlay,
 * responsive design, and accessibility features that ensure optimal user
 * experience for image message viewing and interaction.
 *
 * Key Features:
 * - Full-size image viewing with modal overlay
 * - Next.js Image component integration for optimization
 * - Responsive design with fixed dimensions
 * - Modal integration with Headless UI
 * - Accessibility features and keyboard navigation
 * - Conditional rendering based on image source
 *
 * Image Viewing Features:
 * - Full-size image display in modal overlay
 * - Object-contain styling for proper image scaling
 * - Fixed dimensions for consistent modal size
 * - Next.js Image optimization and performance
 * - Modal backdrop with click-to-close functionality
 * - Keyboard navigation and accessibility support
 *
 * This component is essential for our messaging app because it provides the
 * image viewing interface that enables users to view full-size images
 * from message content while maintaining proper modal behavior
 * and user experience throughout our real-time messaging platform.
 *
 * @fileoverview Image modal component for Next.js 14 real-time messaging application
 * @author Dayle Cortes
 * @since 2025
 */

'use client';

import Modal from '@/app/components/Modal';
import Image from 'next/image';

/**
 * Image Modal Props Interface
 *
 * Defines the props interface for the ImageModal component, specifying
 * the required data for image viewing and modal functionality.
 *
 * @interface ImageModalProps
 * @property {string | null} [src] - Optional image source URL for display
 * @property {boolean} [isOpen] - Whether the modal is currently open and visible
 * @property {() => void} onClose - Callback function to close the modal
 */
interface ImageModalProps {
  src?: string | null;
  isOpen?: boolean;
  onClose: () => void;
}

/**
 * Image Modal Component
 *
 * A specialized image modal component that provides full-size image viewing
 * with modal overlay, responsive design, and accessibility features for our
 * messaging application. This component implements image display functionality
 * with Next.js Image optimization and Modal integration that ensures optimal
 * user experience for image message viewing and interaction.
 *
 * Key Capabilities:
 * - Full-size image viewing with modal overlay
 * - Next.js Image component integration for optimization
 * - Responsive design with fixed dimensions
 * - Modal integration with Headless UI
 * - Accessibility features and keyboard navigation
 * - Conditional rendering based on image source
 *
 * Image Viewing Features:
 * - Full-size image display in modal overlay
 * - Object-contain styling for proper image scaling
 * - Fixed dimensions for consistent modal size
 * - Next.js Image optimization and performance
 * - Modal backdrop with click-to-close functionality
 * - Keyboard navigation and accessibility support
 *
 * Usage Patterns:
 * - MessageBox component: Image viewing for image messages
 * - Message display: Full-size image viewing from message content
 * - Image interaction: Click-to-expand functionality for images
 * - Modal integration: Overlay display for image viewing
 * - Responsive design: Mobile and desktop optimized image viewing
 *
 * Layout Features:
 * - Modal overlay: Full-screen backdrop with click-to-close
 * - Image container: Fixed 320x320px dimensions for consistent sizing
 * - Image scaling: Object-contain for proper aspect ratio preservation
 * - Next.js Image: Optimized image loading and performance
 * - Responsive design: Works across different screen sizes
 *
 * Modal Integration Features:
 * - Headless UI: Accessibility-compliant modal behavior
 * - Animation: Smooth enter/exit transitions
 * - Focus management: Proper focus trapping and restoration
 * - Keyboard navigation: Escape key support for closing
 * - Backdrop interaction: Click outside to close functionality
 *
 * This component is crucial for our messaging app because it provides the
 * image viewing interface that enables users to view full-size images
 * from message content while maintaining proper modal behavior
 * and user experience throughout our real-time messaging platform.
 *
 * @param {ImageModalProps} props - Component props for image modal configuration
 * @param {string | null} [props.src] - Optional image source URL for display
 * @param {boolean} [props.isOpen] - Whether the modal is currently open and visible
 * @param {() => void} props.onClose - Callback function to close the modal
 * @returns {JSX.Element | null} Image modal with full-size image display or null if no source
 *
 * @example
 * ```tsx
 * // In MessageBox component
 * <ImageModal
 *   src={data.image}
 *   isOpen={imageModalOpen}
 *   onClose={() => setImageModalOpen(false)}
 * />
 *
 * // With image data from message
 * <ImageModal src={messageImage} isOpen={isOpen} onClose={handleClose} />
 * ```
 */
const ImageModal: React.FC<ImageModalProps> = ({ src, isOpen, onClose }) => {
  /**
   * Image Source Validation
   *
   * Validates the image source and returns null if no source is provided.
   * This validation prevents rendering of empty modals and ensures proper
   * component behavior when no image is available.
   *
   * What this provides:
   * - Image source validation
   * - Conditional rendering logic
   * - Empty state handling
   * - Component optimization
   * - User experience enhancement
   *
   * Why source validation is essential:
   * - User experience: Prevents empty modal display
   * - Performance: Avoids unnecessary rendering
   * - Component behavior: Ensures proper modal state
   * - Error prevention: Handles missing image sources gracefully
   * - Optimization: Reduces unnecessary DOM elements
   *
   * Validation Logic:
   * - Source check: Validates src prop exists and is not null
   * - Early return: Returns null if no valid source
   * - Conditional rendering: Only renders modal when image is available
   * - Error handling: Graceful handling of missing image data
   * - Performance: Prevents unnecessary component rendering
   *
   * This source validation is essential for our messaging app because
   * it provides the error handling that ensures proper component
   * behavior and user experience throughout the messaging interface.
   */
  if (!src) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div
        className="
          w-80
          h-80
        "
      >
        <Image alt="Image" className="object-contain" fill src={src} />
      </div>
    </Modal>
  );
};

export default ImageModal;
