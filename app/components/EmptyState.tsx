/**
 * Empty State Component for Dex Real-Time Messenger
 *
 * This file provides a specialized EmptyState component for our Next.js 14
 * real-time messaging application. It implements user guidance and empty state
 * display with visual messaging, responsive design, and consistent styling
 * that ensures optimal user experience when no conversations are available.
 *
 * Key Features:
 * - Empty state display with visual messaging and guidance
 * - React Icons integration with BsChatDotsFill for visual appeal
 * - Responsive design for mobile and desktop
 * - Consistent styling with messaging app design system
 * - User guidance for conversation selection and creation
 * - Full-height layout with centered content
 *
 * Empty State Usage Patterns:
 * - conversations/page.tsx: Default state when no conversation is selected
 * - users/page.tsx: Default state for users page display
 * - conversations/[conversationId]/page.tsx: Fallback when conversation fails to load
 * - User guidance: Instructions for starting new conversations
 *
 * This component is essential for our messaging app because it provides the
 * empty state system that guides users when no conversations are available,
 * ensuring clear user experience and actionable guidance throughout our
 * real-time messaging platform.
 *
 * @fileoverview Empty State component for Next.js 14 real-time messaging application
 * @author Dayle Cortes
 * @since 2025
 */

import { BsChatDotsFill } from 'react-icons/bs';

/**
 * Empty State Component
 *
 * A specialized empty state component that provides user guidance and visual
 * messaging when no conversations are available. This component implements
 * comprehensive empty state display with React Icons integration, responsive
 * design, and consistent styling that ensures optimal user experience
 * throughout our messaging application.
 *
 * Key Capabilities:
 * - Empty state display with visual messaging and guidance
 * - React Icons integration with BsChatDotsFill for visual appeal
 * - Responsive design for mobile and desktop
 * - Consistent styling with messaging app design system
 * - User guidance for conversation selection and creation
 * - Full-height layout with centered content
 *
 * Empty State Types Supported:
 * - No conversation selected: Default state when no conversation is active
 * - Users page display: Default state for users page interface
 * - Conversation fallback: Fallback when conversation fails to load
 * - User guidance: Instructions for starting new conversations
 * - Visual messaging: Clear communication about next steps
 *
 * Usage Patterns:
 * - conversations/page.tsx: Default state when no conversation is selected
 * - users/page.tsx: Default state for users page display
 * - conversations/[conversationId]/page.tsx: Fallback when conversation fails to load
 * - User guidance: Instructions for starting new conversations
 * - Visual messaging: Clear communication about next steps
 *
 * Visual Design Features:
 * - Chat icon: BsChatDotsFill with custom blue color (#0266C8)
 * - Responsive sizing: 64px icon size for visual prominence
 * - Typography: Large, semibold heading for clear messaging
 * - Layout: Centered content with proper spacing and alignment
 * - Background: Light gray background for visual separation
 *
 * Styling Architecture:
 * - Container: Full-height with centered content and responsive padding
 * - Icon: 64px size with custom blue color for visual appeal
 * - Typography: 2xl semibold heading with proper spacing
 * - Layout: Flexbox centering with gap spacing
 * - Responsive: Mobile and desktop optimized padding and sizing
 *
 * This component is crucial for our messaging app because it provides the
 * empty state system that guides users when no conversations are available,
 * ensuring clear user experience and actionable guidance throughout all
 * conversation and messaging interfaces.
 *
 * @returns {JSX.Element} Styled empty state with visual messaging and guidance
 *
 * @example
 * ```tsx
 * // Default conversation state
 * <EmptyState />
 *
 * // Users page display
 * <EmptyState />
 *
 * // Conversation fallback
 * <EmptyState />
 * ```
 */
const EmptyState = () => {
  return (
    <div
      className="
        px-4
        py-10
        sm:px-6
        lg:px-8
        lg:py-6
        h-full
        flex
        justify-center
        items-center
        bg-gray-100
      "
    >
      <div
        className="
          text-center
          items-center
          flex
          flex-col
          gap-3
        "
      >
        <BsChatDotsFill size={64} style={{ color: '#0266C8' }} />
        <h3
          className="
            mt-2
            text-2xl
            font-semibold
            text-gray-900
          "
        >
          Select a chat or start a new conversation
        </h3>
      </div>
    </div>
  );
};

export default EmptyState;
