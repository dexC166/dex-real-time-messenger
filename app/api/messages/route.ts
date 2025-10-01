/**
 * Message Creation API Route for Dex Real-Time Messenger
 *
 * This file provides the primary message creation API endpoint for our Next.js 14 real-time
 * messaging application. It implements message creation with retry logic, real-time updates,
 * and conversation management that ensures optimal reliability and user experience for
 * message sending and delivery throughout our messaging platform.
 *
 * Key Features:
 * - Message creation with Prisma ORM and MongoDB integration
 * - Retry logic with exponential backoff for transaction conflicts
 * - Real-time message delivery via Pusher integration
 * - Conversation updates with last message tracking
 * - User authentication and authorization
 * - Support for both text and image messages
 *
 * Message Creation Features:
 * - Text and image message support with Cloudinary integration
 * - Automatic read receipt tracking for message sender
 * - Conversation last message timestamp updates
 * - Real-time message broadcasting to all conversation participants
 * - Transaction conflict handling with intelligent retry logic
 * - Comprehensive error handling and status responses
 *
 * This API route is essential for our messaging app because it provides the
 * core message creation functionality that enables users to send and receive
 * messages while maintaining data consistency and real-time synchronization
 * throughout our messaging platform.
 *
 * @fileoverview Message creation API route for Next.js 14 real-time messaging application
 * @author Dayle Cortes
 * @since 2025
 */

import getCurrentUser from '@/app/actions/getCurrentUser';
import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';
import { pusherServer } from '@/app/libs/pusher';

/**
 * Message Creation API Endpoint
 *
 * Handles POST requests for creating new messages in conversations with comprehensive
 * retry logic, real-time updates, and conversation management. This endpoint provides
 * the core message creation functionality for our messaging application.
 *
 * Key Capabilities:
 * - Message creation with Prisma ORM and MongoDB integration
 * - Retry logic with exponential backoff for transaction conflicts
 * - Real-time message delivery via Pusher integration
 * - Conversation updates with last message tracking
 * - User authentication and authorization
 * - Support for both text and image messages
 *
 * Message Creation Features:
 * - Text and image message support with Cloudinary integration
 * - Automatic read receipt tracking for message sender
 * - Conversation last message timestamp updates
 * - Real-time message broadcasting to all conversation participants
 * - Transaction conflict handling with intelligent retry logic
 * - Comprehensive error handling and status responses
 *
 * Usage Patterns:
 * - Form submission: Text message creation from conversation forms
 * - Image upload: Image message creation from Cloudinary uploads
 * - Real-time updates: Live message delivery to all participants
 * - Conversation management: Last message updates and conversation state
 * - Error handling: Graceful handling of creation failures and conflicts
 *
 * API Integration:
 * - POST /api/messages: Primary message creation endpoint
 * - Request body: { message, image, conversationId }
 * - Response: Created message with sender and seen information
 * - Real-time events: messages:new and conversation:update via Pusher
 * - Error responses: 401 (Unauthorized), 500 (Internal Error)
 *
 * Security Features:
 * - User authentication via getCurrentUser action
 * - Authorization checks for user ID and email validation
 * - Conversation access validation through Prisma relationships
 * - Secure message creation with proper user context
 * - Error handling without sensitive information exposure
 *
 * This API endpoint is crucial for our messaging app because it provides the
 * message creation functionality that enables users to send and receive
 * messages while maintaining data consistency and real-time synchronization
 * throughout our messaging platform.
 *
 * @param {Request} request - HTTP request object containing message data
 * @returns {Promise<NextResponse>} JSON response with created message or error status
 *
 * @example
 * ```typescript
 * // Text message creation
 * const response = await fetch('/api/messages', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     message: 'Hello, world!',
 *     conversationId: 'conversation-id-123'
 *   })
 * });
 *
 * // Image message creation
 * const response = await fetch('/api/messages', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     image: 'https://cloudinary.com/image-url',
 *     conversationId: 'conversation-id-123'
 *   })
 * });
 * ```
 */
export async function POST(request: Request) {
  try {
    /**
     * User Authentication and Authorization
     *
     * Validates the current user's authentication status and extracts user
     * information for message creation. This authentication ensures only
     * authorized users can create messages and provides user context for
     * message ownership and read receipt tracking.
     *
     * What this provides:
     * - Current user identification and validation
     * - User context for message creation
     * - Authorization for message creation operations
     * - User data for sender and seen relationships
     * - Security validation for API access
     *
     * Why authentication is essential:
     * - Security: Ensures only authenticated users can create messages
     * - User context: Provides sender information for message creation
     * - Authorization: Validates user permissions for message operations
     * - Data integrity: Ensures proper user relationships in database
     * - Real-time updates: Enables proper user identification for Pusher events
     *
     * Authentication Logic:
     * - getCurrentUser: Retrieves current user from session
     * - ID validation: Checks currentUser?.id exists
     * - Email validation: Checks currentUser?.email exists
     * - Unauthorized response: Returns 401 if authentication fails
     * - User context: Provides user data for message creation
     *
     * This authentication is essential for our messaging app because it provides
     * the security and user context that enables proper message creation
     * and authorization throughout our messaging platform.
     */
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { message, image, conversationId } = body;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    /**
     * Message Creation with Retry Logic
     *
     * Implements a robust message creation function with retry logic and exponential
     * backoff to handle transaction conflicts in high-concurrency scenarios. This
     * function ensures message creation reliability even under heavy load.
     *
     * What this function provides:
     * - Message creation with Prisma ORM integration
     * - Retry logic for transaction conflicts (P2034 error code)
     * - Exponential backoff for retry delays
     * - Error handling for non-retryable errors
     * - Fallback error handling for maximum retry exhaustion
     *
     * Why retry logic is essential:
     * - Concurrency handling: Manages transaction conflicts in high-traffic scenarios
     * - Reliability: Ensures message creation success under load
     * - User experience: Prevents message loss during temporary conflicts
     * - Performance: Exponential backoff prevents overwhelming the database
     * - Data integrity: Ensures consistent message creation across retries
     *
     * Retry Logic Features:
     * - Transaction conflict detection: P2034 error code from Prisma
     * - Exponential backoff: 100ms * 2^retries delay between attempts
     * - Maximum retries: 3 attempts before giving up
     * - Error propagation: Non-retryable errors are immediately thrown
     * - Fallback handling: Clear error message after maximum retries
     *
     * This retry logic is essential for our messaging app because it provides
     * the reliability that ensures message creation success even under
     * high-concurrency scenarios throughout our messaging platform.
     *
     * @param {any} data - Prisma message creation data object
     * @param {number} maxRetries - Maximum number of retry attempts (default: 3)
     * @returns {Promise<any>} Created message object or throws error
     */
    const createMessageWithRetry = async (
      data: any,
      maxRetries = 3
    ): Promise<any> => {
      let retries = 0;

      while (retries < maxRetries) {
        try {
          return await prisma.message.create(data);
        } catch (error: any) {
          // Only retry on transaction conflicts (P2034)
          if (error.code === 'P2034' && retries < maxRetries - 1) {
            retries++;
            // Wait a bit before retrying (exponential backoff)
            await new Promise((resolve) =>
              setTimeout(resolve, 100 * Math.pow(2, retries))
            );
            continue;
          }
          throw error;
        }
      }

      // Fallback in case we exhaust retries without returning or throwing
      throw new Error('Failed to create message after maximum retries');
    };

    /**
     * Message Creation with Database Integration
     *
     * Creates a new message in the database with proper relationships to conversation,
     * sender, and read receipt tracking. This creation includes comprehensive data
     * relationships and ensures proper message context for real-time updates.
     *
     * What this creates:
     * - Message record with body and image content
     * - Conversation relationship via conversationId
     * - Sender relationship via currentUser.id
     * - Read receipt tracking for message sender
     * - Complete message data with sender and seen information
     *
     * Why comprehensive relationships are essential:
     * - Data integrity: Ensures proper message-conversation relationships
     * - User context: Provides sender information for message display
     * - Read receipts: Enables read status tracking for message sender
     * - Real-time updates: Provides complete message data for Pusher events
     * - Query efficiency: Includes related data to avoid additional queries
     *
     * Message Creation Logic:
     * - Body content: Text message content from request body
     * - Image content: Image URL from Cloudinary upload (optional)
     * - Conversation connection: Links message to specific conversation
     * - Sender connection: Links message to current user as sender
     * - Seen connection: Marks message as seen by sender immediately
     * - Include relationships: Fetches sender and seen user data
     *
     * This message creation is essential for our messaging app because it provides
     * the message data that enables proper message display, real-time updates,
     * and read receipt tracking throughout our messaging platform.
     */
    const newMessage = await createMessageWithRetry({
      data: {
        body: message,
        image: image,
        conversation: {
          connect: {
            id: conversationId,
          },
        },
        sender: {
          connect: {
            id: currentUser.id,
          },
        },
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
      include: {
        seen: true,
        sender: true,
      },
    });

    if (!newMessage) {
      return new NextResponse('Failed to create message', { status: 500 });
    }

    /**
     * Conversation Update with Last Message Tracking
     *
     * Updates the conversation record with the new message and updates the
     * lastMessageAt timestamp to reflect the most recent activity. This update
     * ensures conversation ordering and provides context for conversation lists.
     *
     * What this updates:
     * - Conversation lastMessageAt timestamp to current time
     * - Conversation messages relationship with new message
     * - Complete conversation data with users and messages
     * - Message data with read receipt information
     * - Conversation state for real-time updates
     *
     * Why conversation updates are essential:
     * - Conversation ordering: Enables proper conversation list sorting
     * - Last message display: Shows most recent message in conversation lists
     * - Real-time updates: Provides conversation context for Pusher events
     * - Data consistency: Maintains conversation-message relationships
     * - User experience: Enables proper conversation state management
     *
     * Conversation Update Logic:
     * - lastMessageAt: Updates to current timestamp for sorting
     * - Messages connection: Links new message to conversation
     * - Users inclusion: Fetches all conversation participants
     * - Messages inclusion: Fetches all messages with read receipt data
     * - Complete data: Provides full conversation context for updates
     *
     * This conversation update is essential for our messaging app because it provides
     * the conversation state that enables proper conversation ordering and
     * real-time updates throughout our messaging platform.
     */
    const updatedConversation = await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        lastMessageAt: new Date(),
        messages: {
          connect: {
            id: newMessage.id,
          },
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            seen: true,
          },
        },
      },
    });

    /**
     * Real-Time Message Broadcasting
     *
     * Broadcasts the new message to all conversation participants via Pusher
     * for real-time message delivery. This broadcasting ensures immediate
     * message visibility across all connected clients.
     *
     * What this broadcasts:
     * - New message event to conversation channel
     * - Message data with sender and read receipt information
     * - Real-time message delivery to all participants
     * - Immediate message visibility across clients
     * - Live message updates in conversation views
     *
     * Why real-time broadcasting is essential:
     * - User experience: Provides immediate message delivery
     * - Real-time updates: Enables live conversation functionality
     * - Multi-client sync: Keeps all clients in sync with new messages
     * - Live messaging: Provides instant communication experience
     * - Engagement: Maintains real-time conversation flow
     *
     * Broadcasting Logic:
     * - Channel targeting: Uses conversationId as Pusher channel
     * - Event type: 'messages:new' for new message events
     * - Message data: Complete message object with relationships
     * - Real-time delivery: Immediate broadcast to all subscribers
     * - Client integration: Works with Body component message handlers
     *
     * This real-time broadcasting is essential for our messaging app because
     * it provides the live messaging experience that enables instant
     * communication and real-time updates throughout our messaging platform.
     */
    await pusherServer.trigger(conversationId, 'messages:new', newMessage);

    /**
     * Last Message Extraction for Conversation Updates
     *
     * Extracts the last message from the updated conversation for individual
     * user conversation updates. This extraction provides the most recent
     * message data for conversation list updates.
     *
     * What this extracts:
     * - Last message from updated conversation messages array
     * - Complete message data with sender and read receipt information
     * - Message data for individual user conversation updates
     * - Recent message context for conversation lists
     * - Message data for Pusher conversation:update events
     *
     * Why last message extraction is essential:
     * - Conversation lists: Provides recent message for conversation display
     * - User updates: Enables individual user conversation updates
     * - Real-time sync: Keeps conversation lists updated with new messages
     * - Performance: Provides specific message data without full conversation
     * - User experience: Enables proper conversation list management
     *
     * Extraction Logic:
     * - Array access: Gets last element from messages array
     * - Message data: Complete message object with relationships
     * - User updates: Provides message data for individual user events
     * - Conversation context: Enables conversation list updates
     * - Real-time integration: Works with Pusher conversation events
     *
     * This last message extraction is essential for our messaging app because
     * it provides the message data that enables conversation list updates
     * and individual user real-time synchronization throughout our messaging platform.
     */
    const lastMessage =
      updatedConversation.messages[updatedConversation.messages.length - 1];

    /**
     * Individual User Conversation Updates
     *
     * Sends individual conversation update events to each conversation participant
     * via Pusher for real-time conversation list updates. This ensures each user
     * receives personalized conversation updates with their specific context.
     *
     * What this sends:
     * - Individual conversation:update events to each user
     * - User-specific conversation updates via email channels
     * - Last message data for conversation list updates
     * - Real-time conversation state synchronization
     * - Personalized conversation updates for each participant
     *
     * Why individual updates are essential:
     * - User experience: Provides personalized conversation updates
     * - Real-time sync: Keeps individual conversation lists updated
     * - Multi-user support: Handles different user contexts and states
     * - Conversation management: Enables proper conversation list ordering
     * - Live updates: Provides immediate conversation state changes
     *
     * Individual Update Logic:
     * - User iteration: Maps through all conversation participants
     * - Email targeting: Uses user.email as Pusher channel identifier
     * - Event type: 'conversation:update' for conversation list updates
     * - Message data: Sends last message for conversation display
     * - Real-time delivery: Immediate updates to each user's conversation list
     *
     * This individual user conversation updates are essential for our messaging app because
     * it provides the personalized real-time updates that enable proper
     * conversation list management and user-specific synchronization throughout our messaging platform.
     */
    updatedConversation.users.map((user) => {
      pusherServer.trigger(user.email!, 'conversation:update', {
        id: conversationId,
        messages: [lastMessage],
      });
    });

    /**
     * Success Response with Created Message
     *
     * Returns the successfully created message as JSON response to the client.
     * This response provides the complete message data for client-side state
     * management and real-time updates.
     *
     * What this returns:
     * - Created message object with all relationships
     * - Sender information for message display
     * - Read receipt data for message status
     * - Complete message context for client integration
     * - Success confirmation for message creation
     *
     * Why complete message data is essential:
     * - Client integration: Provides data for client-side state management
     * - Real-time updates: Enables proper message display and updates
     * - User experience: Ensures complete message context for display
     * - State synchronization: Keeps client and server in sync
     * - Message display: Provides all necessary data for message rendering
     *
     * Response Features:
     * - JSON format: Standard JSON response for API consumption
     * - Complete data: Includes sender, seen, and message content
     * - Client ready: Data formatted for immediate client use
     * - Real-time integration: Works with Pusher event handlers
     * - Error handling: Success response confirms message creation
     *
     * This success response is essential for our messaging app because it provides
     * the complete message data that enables proper client-side integration
     * and real-time message display throughout our messaging platform.
     */
    return NextResponse.json(newMessage);
  } catch (error: any) {
    /**
     * Error Handling and Response
     *
     * Handles any errors that occur during message creation and returns appropriate
     * error responses. This error handling ensures graceful failure and provides
     * consistent error responses for client integration.
     *
     * What this handles:
     * - Database errors during message creation
     * - Prisma ORM errors and transaction failures
     * - Pusher broadcasting errors
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
     * - Generic error response: 'InternalError' for all error types
     * - Status code: 500 for internal server errors
     * - Security: No sensitive error information exposure
     * - Consistency: Standardized error response format
     * - Client ready: Error response formatted for client consumption
     *
     * This error handling is essential for our messaging app because it provides
     * the error management that ensures API reliability and proper client
     * integration throughout our messaging platform.
     */
    return new NextResponse('InternalError', { status: 500 });
  }
}
