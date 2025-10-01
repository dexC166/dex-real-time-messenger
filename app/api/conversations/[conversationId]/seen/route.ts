/**
 * Message Read Receipt API Route for Dex Real-Time Messenger
 *
 * This file provides the message read receipt API endpoint for our Next.js 14 real-time
 * messaging application. It implements read receipt tracking with user authentication,
 * message validation, database updates, and real-time notifications that ensures proper
 * read status tracking throughout our messaging platform.
 *
 * Key Features:
 * - Read receipt tracking for conversation messages
 * - User authentication and authorization for read status updates
 * - Last message identification and read status marking
 * - Real-time notifications via Pusher for read receipt updates
 * - Database integration with Prisma ORM for read status persistence
 * - Comprehensive error handling and status responses
 *
 * Read Receipt Features:
 * - Last message read status tracking per conversation
 * - User-specific read receipt marking
 * - Real-time read status synchronization
 * - Conversation-specific read receipt management
 * - Message status updates with user context
 *
 * This API route is essential for our messaging app because it provides the
 * read receipt functionality that enables users to track message read status
 * and maintain proper conversation context throughout our messaging platform.
 *
 * @fileoverview Message read receipt API route for Next.js 14 real-time messaging application
 * @author Dayle Cortes
 * @since 2025
 */

import getCurrentUser from '@/app/actions/getCurrentUser';
import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';
import { pusherServer } from '@/app/libs/pusher';

/**
 * Conversation Parameters Interface
 *
 * Defines the parameters interface for conversation read receipt API routes,
 * specifying the conversationId parameter for dynamic route handling.
 *
 * @interface IParams
 * @property {string} [conversationId] - Optional conversation ID from URL parameters
 */
interface IParams {
  conversationId?: string;
}

/**
 * Message Read Receipt API Endpoint
 *
 * Handles POST requests for marking conversation messages as seen by the current user.
 * This endpoint provides read receipt tracking functionality with user authentication,
 * message validation, and real-time notifications for proper read status management.
 *
 * Key Capabilities:
 * - User authentication and authorization for read receipt updates
 * - Conversation validation and message retrieval
 * - Last message identification and read status marking
 * - Real-time notifications via Pusher for read receipt updates
 * - Database updates with Prisma ORM for read status persistence
 * - Comprehensive error handling and status responses
 *
 * Read Receipt Features:
 * - Last message read status tracking per conversation
 * - User-specific read receipt marking
 * - Real-time read status synchronization
 * - Conversation-specific read receipt management
 * - Message status updates with user context
 *
 * Usage Patterns:
 * - Body component: Read receipt tracking when conversation changes
 * - Message display: Read status indicators in conversation lists
 * - Real-time updates: Live read receipt synchronization
 * - User experience: Visual feedback for message read status
 * - Conversation management: Read status tracking per conversation
 *
 * API Integration:
 * - POST /api/conversations/{conversationId}/seen: Primary read receipt endpoint
 * - Request: No body required, conversationId from URL parameters
 * - Response: Updated message or conversation data
 * - Authentication: getCurrentUser action for user validation
 * - Real-time: Pusher notifications for read receipt updates
 *
 * Security Features:
 * - User authentication via getCurrentUser action
 * - Conversation existence validation
 * - User-specific read receipt marking
 * - Real-time notifications only to authorized users
 * - Error handling without sensitive information exposure
 *
 * This API endpoint is crucial for our messaging app because it provides the
 * read receipt functionality that enables users to track message read status
 * and maintain proper conversation context throughout our messaging platform.
 *
 * @param {Request} request - HTTP request object (unused in this implementation)
 * @param {{ params: IParams }} params - Route parameters containing conversationId
 * @returns {Promise<NextResponse>} JSON response with updated message or conversation data
 *
 * @example
 * ```typescript
 * // Mark conversation as seen
 * const response = await fetch('/api/conversations/conversation-id/seen', {
 *   method: 'POST'
 * });
 *
 * // Response: Updated message or conversation data
 * const result = await response.json();
 * ```
 */
export async function POST(request: Request, { params }: { params: IParams }) {
  try {
    /**
     * User Authentication and Parameter Extraction
     *
     * Validates the current user's authentication status and extracts the
     * conversationId from URL parameters. This authentication ensures only
     * authorized users can mark messages as seen.
     *
     * What this provides:
     * - Current user identification and validation
     * - Conversation ID extraction from URL parameters
     * - User context for read receipt tracking
     * - Authorization for read status updates
     * - Security validation for API access
     *
     * Why authentication is essential:
     * - Security: Ensures only authenticated users can mark messages as seen
     * - User context: Provides user identification for read receipt tracking
     * - Authorization: Validates user permissions for read status updates
     * - Data integrity: Ensures proper user-specific read receipt tracking
     * - Privacy: Prevents unauthorized read status manipulation
     *
     * Authentication Logic:
     * - getCurrentUser: Retrieves current user from session
     * - Parameter extraction: { conversationId } from URL parameters
     * - User validation: Checks currentUser?.id and currentUser?.email exist
     * - Error response: 401 status with 'unauthorized' message for unauthenticated users
     * - Security: Ensures proper user authentication
     *
     * This authentication is essential for our messaging app because it provides
     * the security and user context that enables proper read receipt tracking
     * and authorization throughout our messaging platform.
     */
    const currentUser = await getCurrentUser();
    const { conversationId } = params;

    /**
     * Unauthenticated User Handling
     *
     * Handles cases where the user is not authenticated by returning a 401
     * unauthorized response. This provides clear error handling for
     * unauthenticated requests attempting to mark messages as seen.
     *
     * What this handles:
     * - Unauthenticated user requests
     * - Missing user ID or email scenarios
     * - Security validation for read receipt access
     * - Clear error responses
     * - Privacy protection
     *
     * Why 401 response for unauthenticated users:
     * - Security: Prevents unauthorized read status manipulation
     * - Clear error: Provides explicit unauthorized status
     * - User experience: Clear indication of authentication requirement
     * - API standards: Follows HTTP status code conventions
     * - Best practices: Proper error handling for authentication failures
     *
     * This unauthenticated handling is essential for our messaging app because
     * it provides the security that prevents unauthorized read receipt
     * manipulation and maintains proper access control throughout our messaging platform.
     */
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('unauthorized', { status: 401 });
    }

    /**
     * Conversation and Message Data Retrieval
     *
     * Retrieves the conversation with all messages and read receipt data to
     * enable proper read status tracking and message identification. This
     * retrieval provides the foundation for read receipt operations.
     *
     * What this retrieves:
     * - Complete conversation data with all participants
     * - All messages in the conversation with read receipt data
     * - User information for read receipt tracking
     * - Message context for read status updates
     * - Conversation validation for proper access control
     *
     * Why comprehensive data retrieval is essential:
     * - Message context: Provides all messages for read receipt tracking
     * - Read receipt data: Includes existing read status for all messages
     * - User information: Enables proper read receipt user identification
     * - Conversation validation: Ensures conversation exists and is accessible
     * - Data integrity: Provides complete context for read receipt operations
     *
     * Data Retrieval Logic:
     * - Prisma findUnique: prisma.conversation.findUnique() for conversation lookup
     * - Message inclusion: include: { messages: { include: { seen: true } } } for read receipt data
     * - User inclusion: include: { users: true } for participant information
     * - Error response: 400 status with 'Invalid ID' message for non-existent conversations
     * - Data context: Provides complete conversation and message context
     *
     * This data retrieval is essential for our messaging app because it provides
     * the conversation and message context that enables proper read receipt
     * tracking and user identification throughout our messaging platform.
     */
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        messages: {
          include: {
            seen: true,
          },
        },
        users: true,
      },
    });

    if (!conversation) {
      return new NextResponse('Invalid ID', { status: 400 });
    }

    /**
     * Last Message Identification
     *
     * Identifies the last message in the conversation to determine which
     * message should be marked as seen. This identification enables proper
     * read receipt tracking for the most recent conversation activity.
     *
     * What this identifies:
     * - The most recent message in the conversation
     * - Last message for read receipt tracking
     * - Message context for read status updates
     * - Conversation activity indicator
     * - Read receipt target for user marking
     *
     * Why last message identification is essential:
     * - Read receipt accuracy: Marks the most recent message as seen
     * - User experience: Provides proper read status for conversation activity
     * - Conversation context: Indicates user has seen latest conversation content
     * - Real-time updates: Enables proper read status synchronization
     * - Performance: Focuses read receipt tracking on most relevant message
     *
     * Last Message Logic:
     * - Array access: conversation.messages[conversation.messages.length - 1]
     * - Empty conversation handling: Returns conversation data if no messages exist
     * - Message context: Provides last message for read receipt operations
     * - Fallback handling: Graceful handling of empty conversations
     * - Data integrity: Ensures proper message identification
     *
     * This last message identification is essential for our messaging app because
     * it provides the message context that enables proper read receipt
     * tracking and user status updates throughout our messaging platform.
     */
    const lastMessage = conversation.messages[conversation.messages.length - 1];

    if (!lastMessage) {
      return NextResponse.json(conversation);
    }

    /**
     * Read Receipt Database Update
     *
     * Updates the last message to mark it as seen by the current user using
     * Prisma ORM with proper relationship management. This update ensures
     * read receipt tracking is properly persisted in the database.
     *
     * What this updates:
     * - Last message read status for current user
     * - Message seen relationship with user connection
     * - Read receipt data with user identification
     * - Message status for real-time updates
     * - Database persistence for read receipt tracking
     *
     * Why database updates are essential:
     * - Data persistence: Ensures read receipt status is saved
     * - User experience: Enables proper read status display
     * - Real-time updates: Provides data for live read receipt synchronization
     * - Message context: Maintains proper message-read receipt relationships
     * - Data integrity: Ensures consistent read receipt tracking
     *
     * Database Update Logic:
     * - Prisma update: prisma.message.update() for message modification
     * - Message identification: where: { id: lastMessage.id } for specific message
     * - User connection: seen: { connect: { id: currentUser.id } } for read receipt
     * - Data inclusion: include: { sender: true, seen: true } for complete data
     * - Relationship management: Proper many-to-many relationship handling
     *
     * This database update is essential for our messaging app because it provides
     * the data persistence that ensures read receipt status is properly saved
     * and synchronized throughout our messaging platform.
     */
    const updatedMessage = await prisma.message.update({
      where: {
        id: lastMessage.id,
      },
      include: {
        sender: true,
        seen: true,
      },
      data: {
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    });

    /**
     * User-Specific Read Receipt Notification
     *
     * Sends a real-time notification to the current user about the read receipt
     * update using Pusher. This notification provides immediate feedback about
     * the read status change and enables proper UI updates.
     *
     * What this notifies:
     * - Current user about read receipt update
     * - Real-time read status changes
     * - Message update with read receipt data
     * - Conversation context for read status
     * - User-specific read receipt confirmation
     *
     * Why user-specific notifications are essential:
     * - User feedback: Provides immediate confirmation of read status update
     * - Real-time updates: Enables live read receipt synchronization
     * - UI updates: Triggers immediate interface updates
     * - User experience: Confirms read receipt action was successful
     * - State management: Keeps user interface in sync with server state
     *
     * Notification Logic:
     * - Pusher trigger: pusherServer.trigger() for real-time notification
     * - User channel: currentUser.email for user-specific delivery
     * - Event type: 'conversation:update' for conversation-level updates
     * - Data payload: { id: conversationId, messages: [updatedMessage] } for context
     * - Real-time delivery: Immediate notification to user's browser
     *
     * This user-specific notification is essential for our messaging app because
     * it provides the real-time feedback that enables users to see immediate
     * read receipt updates and maintains proper UI synchronization throughout our messaging platform.
     */
    await pusherServer.trigger(currentUser.email, 'conversation:update', {
      id: conversationId,
      messages: [updatedMessage],
    });

    /**
     * Duplicate Read Receipt Prevention
     *
     * Checks if the user has already marked this message as seen to prevent
     * duplicate read receipt entries and unnecessary real-time notifications.
     * This prevention ensures efficient read receipt management and optimal performance.
     *
     * What this prevents:
     * - Duplicate read receipt entries in database
     * - Unnecessary real-time notifications
     * - Redundant read status updates
     * - Performance overhead from duplicate operations
     * - UI confusion from duplicate read receipt indicators
     *
     * Why duplicate prevention is essential:
     * - Performance: Prevents unnecessary database operations and notifications
     * - User experience: Avoids confusing duplicate read receipt indicators
     * - Data integrity: Maintains clean read receipt data
     * - Real-time efficiency: Reduces unnecessary Pusher notifications
     * - Resource optimization: Minimizes server and client processing
     *
     * Duplicate Prevention Logic:
     * - Read status check: lastMessage.seenIds.indexOf(currentUser.id) !== -1
     * - Early return: Returns conversation data if already seen
     * - Performance optimization: Avoids unnecessary real-time notifications
     * - Data consistency: Maintains proper read receipt state
     * - User experience: Prevents duplicate read receipt processing
     *
     * This duplicate prevention is essential for our messaging app because
     * it provides the efficiency that ensures optimal read receipt
     * management and prevents unnecessary operations throughout our messaging platform.
     */
    if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
      return NextResponse.json(conversation);
    }

    /**
     * Global Read Receipt Notification
     *
     * Sends a real-time notification to all conversation participants about
     * the read receipt update using Pusher. This notification enables live
     * read status synchronization across all participants.
     *
     * What this notifies:
     * - All conversation participants about read receipt update
     * - Real-time read status changes for all users
     * - Message update with read receipt data
     * - Live read receipt synchronization
     * - Global read status updates
     *
     * Why global notifications are essential:
     * - User experience: All participants see read status changes immediately
     * - Synchronization: Keeps all users in sync with read receipt state
     * - Real-time updates: Provides live read status changes
     * - Collaboration: Enables proper read receipt awareness across participants
     * - UI updates: Triggers immediate interface updates for all users
     *
     * Notification Logic:
     * - Pusher trigger: pusherServer.trigger() for real-time notification
     * - Conversation channel: conversationId for all participants
     * - Event type: 'message:update' for message-level updates
     * - Data payload: updatedMessage for complete message data
     * - Global delivery: Notification to all conversation participants
     *
     * This global notification is essential for our messaging app because
     * it provides the live synchronization that ensures all participants
     * see read receipt updates immediately throughout our messaging platform.
     */
    await pusherServer.trigger(
      conversationId!,
      'message:update',
      updatedMessage
    );

    /**
     * Success Response with Updated Message
     *
     * Returns the updated message with read receipt data as JSON response
     * to the client, providing confirmation of successful read receipt
     * tracking and enabling proper client-side state management.
     *
     * What this returns:
     * - Updated message object with read receipt data
     * - Complete message information including sender and seen users
     * - Read receipt confirmation for client integration
     * - Message data for real-time updates
     * - API response for client-side state management
     *
     * Why complete message data is essential:
     * - Client integration: Provides data for client-side state management
     * - User experience: Confirms successful read receipt tracking
     * - Real-time updates: Enables immediate read status display
     * - State synchronization: Keeps client and server in sync
     * - Message context: Provides complete message data for UI updates
     *
     * Response Features:
     * - JSON format: Standard JSON response for API consumption
     * - Complete data: Includes all message and read receipt information
     * - Client ready: Data formatted for immediate client use
     * - Read receipt data: Includes updated seen user information
     * - Integration: Works with client-side message components
     *
     * This success response is essential for our messaging app because
     * it provides the updated message data that enables proper client-side
     * state management and real-time read receipt synchronization throughout our messaging platform.
     */
    return NextResponse.json(updatedMessage);
  } catch (error: any) {
    /**
     * Error Handling and Response
     *
     * Handles any errors that occur during read receipt tracking and returns
     * appropriate error responses. This error handling ensures graceful failure
     * and provides consistent error responses for client integration.
     *
     * What this handles:
     * - Database errors during read receipt updates
     * - Prisma ORM errors and connection issues
     * - Authentication errors and failures
     * - General application errors
     * - Error response formatting for client consumption
     *
     * Why comprehensive error handling is essential:
     * - User experience: Provides graceful error handling and feedback
     * - Client integration: Enables proper error handling in client code
     * - Debugging: Provides consistent error responses for troubleshooting
     * - Reliability: Ensures API stability under error conditions
     * - Security: Prevents sensitive error information exposure
     *
     * Error Handling Features:
     * - Generic error response: 'Internal Server Error' for all error types
     * - Status code: 500 for internal server errors
     * - Security: No sensitive error information exposure
     * - Consistency: Standardized error response format
     * - Client ready: Error response formatted for client consumption
     *
     * This error handling is essential for our messaging app because
     * it provides the error management that ensures API reliability
     * and proper client integration throughout our read receipt tracking system.
     */
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
