/**
 * Message Box Component for Dex Real-Time Messenger
 *
 * This file provides a specialized message box component for our Next.js 14 real-time
 * messaging application. It implements individual message display with sender information,
 * read receipts, image support, and responsive layout that ensures optimal user
 * experience for message viewing and interaction.
 *
 * Key Features:
 * - Individual message display with sender avatar and metadata
 * - Read receipt tracking and display for message status
 * - Image message support with modal viewing functionality
 * - Responsive layout with own/other message differentiation
 * - Date/time formatting for message timestamps
 * - Conditional styling based on message ownership
 *
 * Message Display Features:
 * - Sender information with avatar and name display
 * - Message timestamp with formatted date/time
 * - Text and image message support
 * - Read receipt display for last message
 * - Responsive layout with proper alignment
 * - Image modal integration for full-size viewing
 *
 * This component is essential for our messaging app because it provides the
 * individual message display interface that enables users to view, interact with,
 * and understand message context while maintaining proper visual hierarchy
 * and user experience throughout our real-time messaging platform.
 *
 * @fileoverview Message box component for Next.js 14 real-time messaging application
 * @author Dayle Cortes
 * @since 2025
 */

'use client';

import Avatar from '@/app/components/Avatar';
import { FullMessageType } from '@/app/types';
import clsx from 'clsx';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useState } from 'react';
import ImageModal from './ImageModal';

/**
 * Message Box Props Interface
 *
 * Defines the props interface for the MessageBox component, specifying
 * the required data for individual message display and interaction.
 *
 * @interface MessageBoxProps
 * @property {FullMessageType} data - Complete message data with sender and read receipt information
 * @property {boolean} [isLast] - Whether this is the last message in the conversation
 */
interface MessageBoxProps {
  data: FullMessageType;
  isLast?: boolean;
}

/**
 * Message Box Component
 *
 * A specialized message box component that provides individual message display
 * with sender information, read receipts, image support, and responsive layout
 * for our messaging application. This component implements message rendering
 * with proper visual hierarchy and user interaction that ensures optimal
 * user experience for message viewing and understanding.
 *
 * Key Capabilities:
 * - Individual message display with sender avatar and metadata
 * - Read receipt tracking and display for message status
 * - Image message support with modal viewing functionality
 * - Responsive layout with own/other message differentiation
 * - Date/time formatting for message timestamps
 * - Conditional styling based on message ownership
 *
 * Message Display Features:
 * - Sender information with avatar and name display
 * - Message timestamp with formatted date/time
 * - Text and image message support
 * - Read receipt display for last message
 * - Responsive layout with proper alignment
 * - Image modal integration for full-size viewing
 *
 * Usage Patterns:
 * - Body component: Individual message rendering in conversation display
 * - Message display: Text and image message presentation
 * - Read receipts: Message status tracking and display
 * - Image viewing: Modal integration for full-size image viewing
 * - Responsive layout: Mobile and desktop optimized message display
 *
 * Layout Features:
 * - Message container: Flex layout with proper spacing and alignment
 * - Avatar display: Sender avatar with conditional positioning
 * - Message body: Content area with sender info and message content
 * - Read receipts: Status display for last message from current user
 * - Image support: Next.js Image component with modal integration
 *
 * Message Types:
 * - Text messages: Standard text content with proper formatting
 * - Image messages: Image display with click-to-expand functionality
 * - Mixed content: Support for both text and image messages
 * - Read receipts: Status tracking for message delivery and reading
 *
 * This component is crucial for our messaging app because it provides the
 * individual message display interface that enables users to view, interact with,
 * and understand message context while maintaining proper visual hierarchy
 * and user experience throughout our real-time messaging platform.
 *
 * @param {MessageBoxProps} props - Component props for message box configuration
 * @param {FullMessageType} props.data - Complete message data with sender and read receipt information
 * @param {boolean} [props.isLast] - Whether this is the last message in the conversation
 * @returns {JSX.Element} Individual message box with sender info, content, and read receipts
 *
 * @example
 * ```tsx
 * // In Body component
 * <MessageBox
 *   data={message}
 *   isLast={i === messages.length - 1}
 * />
 *
 * // With message data from getMessages action
 * <MessageBox data={messageData} isLast={isLastMessage} />
 * ```
 */
const MessageBox: React.FC<MessageBoxProps> = ({ data, isLast }) => {
  /**
   * User Session Integration
   *
   * Integrates with NextAuth.js session to determine message ownership
   * and provide user context for message display. This integration
   * enables proper message alignment and read receipt functionality.
   *
   * What useSession provides:
   * - Current user session data
   * - User email for ownership comparison
   * - Authentication state management
   * - User context for message display
   * - Session state for component updates
   *
   * Why session integration is essential:
   * - Message ownership: Determines if message is from current user
   * - Layout alignment: Enables proper message positioning
   * - Read receipts: Provides user context for status display
   * - User experience: Ensures proper message identification
   * - Authentication: Maintains user context throughout app
   *
   * This session integration is essential for our messaging app because
   * it provides the user context that enables proper message
   * identification and layout throughout the messaging interface.
   */
  const session = useSession();

  /**
   * Image Modal State Management
   *
   * Manages the image modal open/close state using React useState hook
   * to provide image viewing functionality for image messages. This
   * state management enables full-size image viewing and user interaction.
   *
   * What this state provides:
   * - Image modal visibility state
   * - Image modal open/close control
   * - Image viewing functionality
   * - User interaction state management
   * - Modal integration for image display
   *
   * Why useState for imageModalOpen:
   * - User interaction: Controls image modal visibility
   * - State management: Maintains modal state throughout component lifecycle
   * - User experience: Provides image viewing functionality
   * - Performance: Efficient re-rendering with state updates
   * - Integration: Works with ImageModal component
   *
   * This image modal state management is essential for our messaging app because
   * it provides the image viewing functionality that enables users to
   * view full-size images throughout the messaging interface.
   */
  const [imageModalOpen, setImageModalOpen] = useState(false);

  /**
   * Message Ownership Detection
   *
   * Determines if the current message belongs to the authenticated user
   * by comparing sender email with session user email. This detection
   * enables proper message alignment and styling differentiation.
   *
   * What this provides:
   * - Message ownership identification
   * - Layout alignment control
   * - Styling differentiation
   * - User experience enhancement
   * - Message context understanding
   *
   * Why ownership detection is essential:
   * - Layout alignment: Enables proper message positioning (own vs other)
   * - Visual differentiation: Different styling for own vs other messages
   * - User experience: Clear indication of message ownership
   * - Read receipts: Enables read receipt display for own messages
   * - Consistency: Maintains standard messaging app behavior
   *
   * Ownership Logic:
   * - Email comparison: Compares sender email with session user email
   * - Boolean result: Returns true if message is from current user
   * - Layout control: Enables conditional styling and alignment
   * - User experience: Provides clear message ownership indication
   * - Performance: Efficient comparison with optional chaining
   *
   * This ownership detection is essential for our messaging app because
   * it provides the message context that enables proper layout
   * and user experience throughout the messaging interface.
   */
  const isOwn = session?.data?.user?.email === data?.sender?.email;

  /**
   * Read Receipt List Generation
   *
   * Generates a formatted list of users who have seen the message,
   * excluding the sender. This list provides read receipt information
   * for message status tracking and user feedback.
   *
   * What this provides:
   * - List of users who have seen the message
   * - Sender exclusion from read receipt list
   * - Formatted string for display
   * - Read receipt status information
   * - User feedback for message delivery
   *
   * Why read receipts are essential:
   * - Message status: Shows who has seen the message
   * - User feedback: Provides delivery confirmation
   * - User experience: Enables message status understanding
   * - Communication context: Shows message reach and engagement
   * - Standard behavior: Maintains expected messaging app functionality
   *
   * Read Receipt Logic:
   * - Filter seen users: Excludes sender from read receipt list
   * - Map user names: Extracts user names for display
   * - Join formatting: Creates comma-separated string for display
   * - Empty handling: Handles cases where no users have seen the message
   * - Performance: Efficient array operations for read receipt processing
   *
   * This read receipt list generation is essential for our messaging app because
   * it provides the message status information that enables users to
   * understand message delivery and engagement throughout the messaging interface.
   */
  const seenList = (data.seen || [])
    .filter((user) => user.email !== data?.sender?.email)
    .map((user) => user.name)
    .join(', ');

  /**
   * Message Container Styling
   *
   * Applies conditional styling to the message container based on
   * message ownership. This styling ensures proper message alignment
   * and visual hierarchy for optimal user experience.
   *
   * What this provides:
   * - Base container styling with flex layout
   * - Conditional alignment based on message ownership
   * - Proper spacing and padding
   * - Responsive layout support
   * - Visual hierarchy for message display
   *
   * Why conditional styling is essential:
   * - User experience: Clear visual distinction between own and other messages
   * - Layout alignment: Proper message positioning in conversation flow
   * - Visual hierarchy: Maintains readable conversation layout
   * - Standard behavior: Follows expected messaging app patterns
   * - Responsiveness: Works across different screen sizes
   *
   * Container Styling Logic:
   * - Base styles: flex gap-3 p-4 for consistent layout
   * - Own messages: justify-end for right alignment
   * - Other messages: default left alignment
   * - Spacing: Consistent gap and padding for readability
   * - Responsiveness: Works on mobile and desktop
   *
   * This container styling is essential for our messaging app because
   * it provides the visual hierarchy that enables users to
   * understand message flow and ownership throughout the messaging interface.
   */
  const container = clsx('flex gap-3 p-4', isOwn && 'justify-end');

  /**
   * Avatar Positioning Styling
   *
   * Applies conditional styling to the avatar container based on
   * message ownership. This styling ensures proper avatar positioning
   * for visual consistency and user experience.
   *
   * What this provides:
   * - Avatar container styling
   * - Conditional positioning based on message ownership
   * - Visual consistency in message layout
   * - Proper avatar alignment
   * - User experience enhancement
   *
   * Why avatar positioning is essential:
   * - Visual consistency: Maintains proper avatar placement
   * - User experience: Clear indication of message sender
   * - Layout alignment: Ensures proper message flow
   * - Standard behavior: Follows expected messaging app patterns
   * - Responsiveness: Works across different screen sizes
   *
   * Avatar Styling Logic:
   * - Own messages: order-2 for right-side avatar positioning
   * - Other messages: default left-side avatar positioning
   * - Visual consistency: Maintains proper avatar placement
   * - Layout flow: Ensures proper message alignment
   * - User experience: Clear sender identification
   *
   * This avatar positioning styling is essential for our messaging app because
   * it provides the visual consistency that enables users to
   * identify message senders throughout the messaging interface.
   */
  const avatar = clsx(isOwn && 'order-2');

  /**
   * Message Body Styling
   *
   * Applies conditional styling to the message body container based on
   * message ownership. This styling ensures proper content alignment
   * and visual hierarchy for optimal user experience.
   *
   * What this provides:
   * - Message body container styling
   * - Conditional alignment based on message ownership
   * - Proper content layout and spacing
   * - Visual hierarchy for message content
   * - User experience enhancement
   *
   * Why body styling is essential:
   * - Content alignment: Ensures proper message content positioning
   * - Visual hierarchy: Maintains readable message layout
   * - User experience: Clear message content presentation
   * - Layout consistency: Maintains proper message flow
   * - Responsiveness: Works across different screen sizes
   *
   * Body Styling Logic:
   * - Base styles: flex flex-col gap-2 for content layout
   * - Own messages: items-end for right alignment
   * - Other messages: default left alignment
   * - Content flow: Proper message content organization
   * - Visual hierarchy: Clear message structure
   *
   * This body styling is essential for our messaging app because
   * it provides the content layout that enables users to
   * read and understand messages throughout the messaging interface.
   */
  const body = clsx('flex flex-col gap-2', isOwn && 'items-end');

  /**
   * Message Content Styling
   *
   * Applies conditional styling to the message content based on
   * message ownership and content type. This styling ensures
   * proper message presentation and visual differentiation.
   *
   * What this provides:
   * - Message content styling
   * - Conditional colors based on message ownership
   * - Content type styling (text vs image)
   * - Proper text formatting and layout
   * - Visual differentiation for message types
   *
   * Why message styling is essential:
   * - Visual differentiation: Clear distinction between own and other messages
   * - Content presentation: Proper text and image display
   * - User experience: Readable and attractive message presentation
   * - Standard behavior: Follows expected messaging app patterns
   * - Responsiveness: Works across different screen sizes
   *
   * Message Styling Logic:
   * - Base styles: text-sm max-w-2xl break-words whitespace-break-spaces
   * - Own messages: bg-sky-500 text-white for blue background
   * - Other messages: bg-gray-100 for light gray background
   * - Image messages: rounded p-0 for image-specific styling
   * - Text messages: rounded-2xl py-2 px-3 for text-specific styling
   *
   * This message styling is essential for our messaging app because
   * it provides the visual presentation that enables users to
   * read and understand messages throughout the messaging interface.
   */
  const message = clsx(
    `text-sm 
    max-w-2xl
    break-words
    whitespace-break-spaces
    `,
    isOwn ? 'bg-sky-500 text-white' : 'bg-gray-100',
    data.image ? 'rounded p-0' : 'rounded-2xl py-2 px-3'
  );

  return (
    <div className={container}>
      <div className={avatar}>
        <Avatar user={data.sender} />
      </div>
      <div className={body}>
        <div className="flex items-center gap-1">
          <div className="text-sm text-gray-500">{data.sender.name}</div>
          <div className="text-xs text-gray-400">
            {format(new Date(data.createdAt), 'p')}
          </div>
        </div>
        <div className={message}>
          <ImageModal
            src={data.image}
            isOpen={imageModalOpen}
            onClose={() => setImageModalOpen(false)}
          />
          {data.image ? (
            <Image
              onClick={() => setImageModalOpen(true)}
              alt="Image"
              height="288"
              width="288"
              src={data.image}
              className="
                object-cover
                cursor-pointer
                hover:scale-110
                transition
                translate
              "
            />
          ) : (
            <div>{data.body}</div>
          )}
        </div>
        {isLast && isOwn && seenList.length > 0 && (
          <div
            className="
              text-xs
              font-light
              text-gray-500
            "
          >
            {`Seen by ${seenList}`}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBox;
