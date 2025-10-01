/**
 * Type Definitions for Dex Real-Time Messenger
 *
 * This file defines the core TypeScript types used throughout our Next.js 14
 * real-time messaging application. These types extend the base Prisma models
 * with additional relational data that's commonly needed in our components
 * and API responses.
 *
 * Key Features:
 * - Extends Prisma models with related data
 * - Provides type safety for API responses
 * - Enables efficient data fetching patterns
 * - Supports real-time messaging functionality
 *
 * These types are essential for our messaging app because they ensure type
 * safety when working with complex relational data from our MongoDB database,
 * particularly for messages with sender information and read receipts, and
 * conversations with participant lists and message threads.
 *
 * @fileoverview TypeScript type definitions for Next.js 14 real-time messaging application
 * @author Dayle Cortes
 * @since 2025
 */

import { Conversation, Message, User } from '@prisma/client';

/**
 * Full Message Type - Complete Message Data with Relations
 *
 * Extends the base Prisma Message model with essential relational data
 * needed for displaying messages in our real-time messaging interface.
 * This type represents a message with all its associated user information
 * and read receipt data.
 *
 * Key Features:
 * - Includes sender information for message attribution
 * - Contains read receipt data for message status tracking
 * - Supports both text and image messages
 * - Enables real-time message updates and notifications
 *
 * Usage Patterns:
 * - Message display in conversation threads
 * - Real-time message updates via Pusher
 * - Read receipt functionality and status indicators
 * - Message search and filtering operations
 *
 * This type is crucial for our messaging app because it provides all the
 * data needed to render messages with proper attribution, read status,
 * and real-time updates without additional database queries.
 *
 * @example
 * ```typescript
 * // Used in conversation components
 * const [messages, setMessages] = useState<FullMessageType[]>([]);
 *
 * // Used in message display components
 * interface MessageBoxProps {
 *   data: FullMessageType;
 *   isLast?: boolean;
 * }
 * ```
 */
export type FullMessageType = Message & {
  /**
   * Message Sender Information
   *
   * Contains the complete User object of the person who sent this message.
   * This enables displaying sender names, avatars, and other profile
   * information without additional database queries.
   *
   * Used for:
   * - Message attribution in conversation threads
   * - Avatar display in message bubbles
   * - Sender identification in group conversations
   * - User presence and activity tracking
   */
  sender: User;

  /**
   * Read Receipt Data
   *
   * Array of User objects representing who has seen this message.
   * This enables read receipt functionality, unread message indicators,
   * and message status tracking across all conversation participants.
   *
   * Used for:
   * - Read receipt indicators in message bubbles
   * - Unread message counts in conversation lists
   * - Message status tracking (sent, delivered, read)
   * - Real-time read receipt updates via Pusher
   */
  seen: User[];
};

/**
 * Full Conversation Type - Complete Conversation Data with Relations
 *
 * Extends the base Prisma Conversation model with all participant information
 * and message threads needed for displaying conversations in our messaging
 * interface. This type represents a complete conversation with all its
 * associated data.
 *
 * Key Features:
 * - Includes all conversation participants
 * - Contains complete message threads with sender and read receipt data
 * - Supports both direct and group conversations
 * - Enables efficient conversation list rendering
 *
 * Usage Patterns:
 * - Conversation list display and navigation
 * - Conversation detail pages with message threads
 * - Real-time conversation updates via Pusher
 * - Conversation search and filtering operations
 *
 * This type is essential for our messaging app because it provides all the
 * data needed to render conversations with participant lists, message
 * threads, and real-time updates in a single, type-safe structure.
 *
 * @example
 * ```typescript
 * // Used in conversation list components
 * interface ConversationListProps {
 *   initialItems: FullConversationType[];
 * }
 *
 * // Used in conversation box components
 * interface ConversationBoxProps {
 *   data: FullConversationType;
 *   selected?: boolean;
 * }
 * ```
 */
export type FullConversationType = Conversation & {
  /**
   * Conversation Participants
   *
   * Array of User objects representing all participants in this conversation.
   * This enables displaying participant lists, avatars, and other user
   * information without additional database queries.
   *
   * Used for:
   * - Participant list display in conversation headers
   * - Avatar group rendering for group conversations
   * - User presence and activity tracking
   * - Conversation participant management
   */
  users: User[];

  /**
   * Complete Message Thread
   *
   * Array of FullMessageType objects representing all messages in this
   * conversation. Each message includes sender information and read receipt
   * data, providing complete message context for the conversation.
   *
   * Used for:
   * - Message thread display in conversation views
   * - Message search and filtering within conversations
   * - Real-time message updates and notifications
   * - Message history and pagination
   */
  messages: FullMessageType[];
};
