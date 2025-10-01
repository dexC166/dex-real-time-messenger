/**
 * Loading Modal Component for Dex Real-Time Messenger
 *
 * This file provides a specialized loading modal component for our Next.js 14
 * real-time messaging application. It implements a full-screen loading overlay
 * using Headless UI with smooth animations, react-spinners integration, and
 * consistent styling that provides clear user feedback during data loading operations.
 *
 * Key Features:
 * - Full-screen loading overlay with backdrop
 * - React-spinners ClipLoader integration for animated spinner
 * - Headless UI Dialog integration for accessibility compliance
 * - Smooth enter/exit animations with Transition components
 * - Non-dismissible modal to prevent user interaction during loading
 * - Consistent styling with messaging app design system
 *
 * Loading Patterns:
 * - Route-level loading states (users/loading.tsx, conversations/loading.tsx)
 * - Component-level loading states (UserBox conversation creation)
 * - Data fetching operations (API calls, database queries)
 * - Navigation transitions and page loads
 *
 * This component is essential for our messaging app because it provides the
 * loading feedback system that keeps users informed during data operations,
 * navigation transitions, and all other loading states in our
 * real-time messaging platform.
 *
 * @fileoverview Loading modal component for Next.js 14 real-time messaging application
 * @author Dayle Cortes
 * @since 2025
 */

'use client';

import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ClipLoader } from 'react-spinners';

/**
 * Loading Modal Component
 *
 * A specialized loading modal that provides full-screen loading feedback
 * across our messaging application. This component implements a non-dismissible
 * modal with animated spinner, smooth transitions, and accessibility features
 * that ensure users understand when the application is processing data.
 *
 * Key Capabilities:
 * - Full-screen loading overlay with backdrop
 * - React-spinners ClipLoader integration for animated spinner
 * - Headless UI Dialog integration for accessibility compliance
 * - Smooth enter/exit animations with Transition components
 * - Non-dismissible modal to prevent user interaction during loading
 * - Consistent styling with messaging app design system
 *
 * Loading Types Supported:
 * - Route-level loading: Next.js loading.tsx files for page transitions
 * - Component-level loading: UserBox conversation creation
 * - Data fetching: API calls and database operations
 * - Navigation transitions: Page loads and route changes
 * - User interactions: Button clicks and form submissions
 *
 * Usage Patterns:
 * - users/loading.tsx: Route-level loading for users page
 * - conversations/loading.tsx: Route-level loading for conversations page
 * - UserBox: Component-level loading during conversation creation
 * - Data fetching: API operations and database queries
 * - Navigation: Page transitions and route changes
 *
 * Accessibility Features:
 * - Proper ARIA attributes and semantic HTML
 * - Screen reader friendly loading announcements
 * - Focus management during loading states
 * - Non-interactive backdrop to prevent user interaction
 * - Consistent loading feedback across all operations
 *
 * Animation System:
 * - Backdrop fade in/out with opacity transitions
 * - Smooth enter/exit transitions (300ms/200ms)
 * - React-spinners ClipLoader with custom styling
 * - Hardware-accelerated transforms for smooth performance
 * - Consistent timing with other modal components
 *
 * This component is crucial for our messaging app because it provides the
 * loading feedback system that keeps users informed during all data operations,
 * ensuring a smooth and responsive user experience throughout our
 * real-time messaging platform.
 *
 * @returns {JSX.Element} Full-screen loading modal with animated spinner
 *
 * @example
 * ```tsx
 * // Route-level loading
 * const Loading = () => {
 *   return <LoadingModal />;
 * };
 *
 * // Component-level loading
 * {isLoading && <LoadingModal />}
 * ```
 */
const LoadingModal = () => {
  return (
    <Transition.Root show as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {}}>
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
              bg-gray-100
              bg-opacity-50
              transition-opacity
            "
          />
        </Transition.Child>
        <div
          className="
            fixed
            inset-0
            z-10
            over-y-auto
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
            "
          >
            <Dialog.Panel>
              <ClipLoader size={40} color="#0284c7" />
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default LoadingModal;
