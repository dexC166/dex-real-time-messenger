/**
 * Conversation Messages API Route for Dex Real-Time Messenger
 *
 * This file provides the conversation messages API endpoint for our Next.js 14 real-time
 * messaging application. It implements secure message retrieval with user authentication,
 * conversation access validation, and comprehensive message data that ensures proper
 * message access and display throughout our messaging platform.
 *
 * Key Features:
 * - Secure message retrieval with user authentication and authorization
 * - Conversation access validation to prevent unauthorized message access
 * - Complete message data with sender and read receipt information
 * - Chronological message ordering for proper conversation flow
 * - Comprehensive error handling and status responses
 *
 * Message Retrieval Features:
 * - All messages for a specific conversation
 * - Sender information for message attribution
 * - Read receipt data for message status tracking
 * - Chronological ordering for conversation flow
 * - User-specific conversation access validation
 *
 * This API route is essential for our messaging app because it provides the
 * secure message retrieval functionality that enables users to access
 * conversation messages while maintaining proper security and data integrity
 * throughout our messaging platform.
 *
 * @fileoverview Conversation messages API route for Next.js 14 real-time messaging application
 * @author Dayle Cortes
 * @since 2025
 */

import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';
import getCurrentUser from '@/app/actions/getCurrentUser';

/**
 * Conversation Parameters Interface
 *
 * Defines the parameters interface for conversation messages API routes,
 * specifying the conversationId parameter for dynamic route handling.
 *
 * @interface IParams
 * @property {string} [conversationId] - Optional conversation ID from URL parameters
 */
interface IParams {
  conversationId?: string;
}

/**
 * Conversation Messages Retrieval API Endpoint
 *
 * Handles GET requests for retrieving all messages from a specific conversation
 * with user authentication, conversation access validation, and comprehensive
 * message data. This endpoint provides secure message access with proper
 * authorization and data integrity.
 *
 * Key Capabilities:
 * - User authentication and authorization for message access
 * - Conversation access validation to prevent unauthorized access
 * - Complete message data with sender and read receipt information
 * - Chronological message ordering for proper conversation flow
 * - Comprehensive error handling and status responses
 *
 * Message Retrieval Features:
 * - All messages for a specific conversation
 * - Sender information for message attribution
 * - Read receipt data for message status tracking
 * - Chronological ordering for conversation flow
 * - User-specific conversation access validation
 *
 * Usage Patterns:
 * - Conversation pages: Message history for conversation display
 * - Message loading: Initial message data for conversation interface
 * - Real-time updates: Base data for Pusher real-time message updates
 * - Message management: Message data for conversation components
 * - API integration: Client-side message data fetching
 *
 * API Integration:
 * - GET /api/messages/{conversationId}: Primary message retrieval endpoint
 * - Request: No body required, conversationId from URL parameters
 * - Response: Array of message objects with sender and read receipt data
 * - Authentication: getCurrentUser action for user validation
 * - Security: User-specific conversation access validation
 *
 * Security Features:
 * - User authentication via getCurrentUser action
 * - Conversation access validation with userIds filtering
 * - User-specific message retrieval
 * - Unauthorized access prevention
 * - Error handling without sensitive information exposure
 *
 * This API endpoint is crucial for our messaging app because it provides the
 * secure message retrieval functionality that enables users to access
 * conversation messages while maintaining proper security and data integrity
 * throughout our messaging platform.
 *
 * @param {Request} request - HTTP request object (unused in this implementation)
 * @param {{ params: IParams }} params - Route parameters containing conversationId
 * @returns {Promise<NextResponse>} JSON response with array of message objects or error status
 *
 * @example
 * ```typescript
 * // Retrieve conversation messages
 * const response = await fetch('/api/messages/conversation-id');
 * const messages = await response.json();
 *
 * // Response: Array of message objects with sender and read receipt data
 * if (response.ok) {
 *   messages.forEach(message => {
 *     console.log(message.body, message.sender.name);
 *   });
 * }
 * ```
 */
export async function GET(request: Request, { params }: { params: IParams }) {
  try {
    /**
     * User Authentication and Parameter Extraction
     *
     * Validates the current user's authentication status and extracts the
     * conversationId from URL parameters. This authentication ensures only
     * authorized users can access conversation messages.
     *
     * What this provides:
     * - Current user identification and validation
     * - Conversation ID extraction from URL parameters
     * - User context for message access
     * - Authorization for message retrieval operations
     * - Security validation for API access
     *
     * Why authentication is essential:
     * - Security: Ensures only authenticated users can access messages
     * - User context: Provides user identification for authorization
     * - Authorization: Validates user permissions for message access
     * - Data integrity: Ensures proper user-specific message access
     * - Privacy: Prevents unauthorized message access
     *
     * Authentication Logic:
     * - getCurrentUser: Retrieves current user from session
     * - Parameter extraction: { conversationId } from URL parameters
     * - User validation: Checks currentUser?.id exists
     * - Error response: 401 status with 'Unauthorized' message for unauthenticated users
     * - Security: Ensures proper user authentication
     *
     * This authentication is essential for our messaging app because it provides
     * the security and user context that enables proper message access
     * and authorization throughout our messaging platform.
     */
    const currentUser = await getCurrentUser();
    const { conversationId } = params;

    /**
     * Unauthenticated User Handling
     *
     * Handles cases where the user is not authenticated by returning a 401
     * unauthorized response. This provides clear error handling for
     * unauthenticated requests attempting to access conversation messages.
     *
     * What this handles:
     * - Unauthenticated user requests
     * - Missing user ID scenarios
     * - Security validation for message access
     * - Clear error responses
     * - Privacy protection
     *
     * Why 401 response for unauthenticated users:
     * - Security: Prevents unauthorized access to conversation messages
     * - Clear error: Provides explicit unauthorized status
     * - User experience: Clear indication of authentication requirement
     * - API standards: Follows HTTP status code conventions
     * - Best practices: Proper error handling for authentication failures
     *
     * This unauthenticated handling is essential for our messaging app because
     * it provides the security that prevents unauthorized message access
     * and maintains proper access control throughout our messaging platform.
     */
    if (!currentUser?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    /**
     * Conversation ID Validation
     *
     * Validates that the conversationId parameter is provided and not empty.
     * This validation ensures proper API usage and prevents invalid requests
     * that could cause database errors or security issues.
     *
     * What this validates:
     * - Conversation ID presence in URL parameters
     * - Non-empty conversation ID value
     * - Proper API request format
     * - Required parameter validation
     * - Request integrity validation
     *
     * Why conversation ID validation is essential:
     * - API integrity: Ensures proper API request format
     * - Database safety: Prevents invalid database queries
     * - User experience: Provides clear error messages for invalid requests
     * - Security: Prevents potential injection or manipulation attempts
     * - Performance: Avoids unnecessary database operations
     *
     * Validation Logic:
     * - Parameter check: !conversationId for missing or empty values
     * - Error response: 400 status with 'Conversation ID required' message
     * - Early return: Prevents further processing without valid conversation ID
     * - API standards: Follows HTTP status code conventions
     * - User feedback: Clear indication of required parameter
     *
     * This conversation ID validation is essential for our messaging app because
     * it provides the request validation that ensures proper API usage
     * and prevents invalid database operations throughout our messaging platform.
     */
    if (!conversationId) {
      return new NextResponse('Conversation ID required', { status: 400 });
    }

    /**
     * User-Authorized Conversation Access Validation
     *
     * Validates that the current user has access to the specified conversation
     * before retrieving messages. This validation prevents unauthorized access
     * to conversation messages and ensures proper data security.
     *
     * What this validates:
     * - User membership in the conversation
     * - Conversation existence and accessibility
     * - User-specific conversation access rights
     * - Data security and privacy protection
     * - Authorization for message retrieval
     *
     * Why conversation access validation is essential:
     * - Security: Prevents unauthorized access to conversation messages
     * - Privacy: Protects user data from unauthorized access
     * - Data integrity: Ensures proper user-specific data access
     * - User experience: Provides clear error messages for unauthorized access
     * - Compliance: Maintains proper data access controls
     *
     * Access Validation Logic:
     * - Prisma findUnique: prisma.conversation.findUnique() for conversation lookup
     * - User authorization: userIds: { has: currentUser.id } for user-specific access
     * - Conversation identification: id: conversationId for specific conversation
     * - Error response: 404 status with 'Conversation not found' message for unauthorized access
     * - Security: Ensures only conversation participants can access messages
     *
     * Security Note:
     * The userIds: { has: currentUser.id } filter is a critical security feature
     * that ensures only conversation participants can access the conversation.
     * This prevents unauthorized users from accessing messages they're not
     * part of, maintaining proper data privacy and security.
     *
     * This conversation access validation is essential for our messaging app because
     * it provides the security that ensures only authorized users can access
     * conversation messages and maintains proper data privacy throughout our messaging platform.
     */
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
        userIds: {
          has: currentUser.id,
        },
      },
    });

    if (!conversation) {
      return new NextResponse('Conversation not found', { status: 404 });
    }

    /**
     * Message Data Retrieval with Complete Information
     *
     * Retrieves all messages for the conversation with sender and read receipt
     * information using Prisma ORM. This retrieval provides comprehensive
     * message data for proper conversation display and real-time functionality.
     *
     * What this retrieves:
     * - All messages for the specified conversation
     * - Sender information for message attribution
     * - Read receipt data for message status tracking
     * - Chronological message ordering for conversation flow
     * - Complete message data for UI rendering
     *
     * Why comprehensive message data is essential:
     * - User experience: Provides complete message context for display
     * - Message attribution: Sender information for proper message identification
     * - Read receipts: User read status for message status tracking
     * - Conversation flow: Chronological ordering for natural conversation reading
     * - Real-time updates: Base data for Pusher real-time message synchronization
     *
     * Message Retrieval Logic:
     * - Prisma findMany: prisma.message.findMany() for message collection retrieval
     * - Conversation filtering: where: { conversationId } for conversation-specific messages
     * - Sender inclusion: include: { sender: true } for user information
     * - Read receipt inclusion: include: { seen: true } for read status data
     * - Chronological ordering: orderBy: { createdAt: 'asc' } for conversation flow
     *
     * Why chronological ordering is essential:
     * - Conversation flow: Messages in natural reading order
     * - User experience: Proper conversation sequence for understanding
     * - Message threading: Correct order for replies and responses
     * - Real-time updates: Consistent message ordering across clients
     * - Performance: Efficient database sorting for message display
     *
     * This message retrieval is essential for our messaging app because
     * it provides the complete message data that enables proper conversation
     * display and real-time messaging functionality throughout our messaging platform.
     */
    const messages = await prisma.message.findMany({
      where: {
        conversationId: conversationId,
      },
      include: {
        sender: true,
        seen: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    /**
     * Success Response with Message Data
     *
     * Returns the retrieved messages as JSON response to the client, providing
     * complete message data for conversation display and real-time functionality.
     * This response enables proper client-side message rendering and state management.
     *
     * What this returns:
     * - Array of message objects with complete data
     * - Sender information for message attribution
     * - Read receipt data for message status tracking
     * - Chronologically ordered messages for conversation flow
     * - API response for client-side integration
     *
     * Why complete message data is essential:
     * - Client integration: Provides data for client-side message rendering
     * - User experience: Enables proper conversation display
     * - Real-time updates: Base data for Pusher real-time message synchronization
     * - Message management: Complete data for message state management
     * - UI rendering: All necessary data for message components
     *
     * Response Features:
     * - JSON format: Standard JSON response for API consumption
     * - Complete data: Includes all message, sender, and read receipt information
     * - Client ready: Data formatted for immediate client use
     * - Message ordering: Chronologically ordered for conversation flow
     * - Integration: Works with client-side message components
     *
     * This success response is essential for our messaging app because
     * it provides the complete message data that enables proper conversation
     * display and real-time messaging functionality throughout our messaging platform.
     */
    return NextResponse.json(messages);
  } catch (error: any) {
    /**
     * Error Handling and Response
     *
     * Handles any errors that occur during message retrieval and returns
     * appropriate error responses. This error handling ensures graceful failure
     * and provides consistent error responses for client integration.
     *
     * What this handles:
     * - Database errors during message retrieval
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
     * - Generic error response: 'Internal Error' for all error types
     * - Status code: 500 for internal server errors
     * - Security: No sensitive error information exposure
     * - Consistency: Standardized error response format
     * - Client ready: Error response formatted for client consumption
     *
     * This error handling is essential for our messaging app because
     * it provides the error management that ensures API reliability
     * and proper client integration throughout our message retrieval system.
     */
    return new NextResponse('Internal Error', { status: 500 });
  }
}
