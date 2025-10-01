/**
 * Individual Conversation API Route for Dex Real-Time Messenger
 *
 * This file provides the individual conversation API endpoints for our Next.js 14 real-time
 * messaging application. It implements conversation deletion and retrieval with authentication,
 * security validation, real-time notifications, and database integration that ensures secure
 * and reliable conversation management throughout our messaging platform.
 *
 * Key Features:
 * - Conversation deletion with user authorization and real-time notifications
 * - Conversation retrieval with security validation and user access control
 * - Pusher integration for real-time conversation updates
 * - Prisma ORM integration with MongoDB for data persistence
 * - Comprehensive error handling and status responses
 *
 * Conversation Management Features:
 * - DELETE: Secure conversation deletion with user authorization
 * - GET: Secure conversation retrieval with access validation
 * - Real-time notifications: Pusher integration for live updates
 * - Security validation: User-specific conversation access control
 * - Database integration: Prisma ORM with MongoDB for data operations
 *
 * This API route is essential for our messaging app because it provides the
 * individual conversation management functionality that enables users to
 * delete and retrieve specific conversations while maintaining security
 * and real-time synchronization throughout our messaging platform.
 *
 * @fileoverview Individual conversation API route for Next.js 14 real-time messaging application
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
 * Defines the parameters interface for conversation API routes, specifying
 * the conversationId parameter for dynamic route handling.
 *
 * @interface IParams
 * @property {string} [conversationId] - Optional conversation ID from URL parameters
 */
interface IParams {
  conversationId?: string;
}

/**
 * Conversation Deletion API Endpoint
 *
 * Handles DELETE requests for removing conversations with user authorization,
 * real-time notifications, and database integration. This endpoint provides
 * secure conversation deletion functionality with proper user validation.
 *
 * Key Capabilities:
 * - User authentication and authorization for conversation deletion
 * - Conversation existence validation before deletion
 * - User-specific conversation access control
 * - Real-time notifications via Pusher for all conversation participants
 * - Database deletion with proper user authorization
 * - Comprehensive error handling and status responses
 *
 * Deletion Features:
 * - User authorization: Only conversation participants can delete
 * - Conversation validation: Ensures conversation exists before deletion
 * - Real-time notifications: Notifies all participants of deletion
 * - Database cleanup: Removes conversation from database
 * - Security validation: Prevents unauthorized conversation deletion
 *
 * Usage Patterns:
 * - ConfirmModal component: Conversation deletion confirmation
 * - ProfileDrawer component: Delete conversation action
 * - Conversation management: User interface for conversation deletion
 * - Real-time updates: Live conversation removal synchronization
 * - Navigation management: Redirects after successful deletion
 *
 * API Integration:
 * - DELETE /api/conversations/{conversationId}: Primary conversation deletion endpoint
 * - Request: No body required, conversationId from URL parameters
 * - Response: Deletion result or error status
 * - Authentication: getCurrentUser action for user validation
 * - Real-time: Pusher notifications to all conversation participants
 *
 * Security Features:
 * - User authentication via getCurrentUser action
 * - Conversation existence validation before deletion
 * - User-specific deletion authorization
 * - Real-time notifications only to conversation participants
 * - Error handling without sensitive information exposure
 *
 * This API endpoint is crucial for our messaging app because it provides the
 * conversation deletion functionality that enables users to remove
 * conversations while maintaining security and real-time synchronization
 * throughout our messaging platform.
 *
 * @param {Request} request - HTTP request object (unused in this implementation)
 * @param {{ params: IParams }} params - Route parameters containing conversationId
 * @returns {Promise<NextResponse>} JSON response with deletion result or error status
 *
 * @example
 * ```typescript
 * // Conversation deletion
 * const response = await fetch('/api/conversations/conversation-id', {
 *   method: 'DELETE'
 * });
 *
 * // Response: Deletion result or error
 * const result = await response.json();
 * ```
 */
export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    /**
     * User Authentication and Parameter Extraction
     *
     * Validates the current user's authentication status and extracts the
     * conversationId from URL parameters. This authentication ensures only
     * authorized users can delete conversations.
     *
     * What this provides:
     * - Current user identification and validation
     * - Conversation ID extraction from URL parameters
     * - User context for conversation deletion
     * - Authorization for deletion operations
     * - Security validation for API access
     *
     * Why authentication is essential:
     * - Security: Ensures only authenticated users can delete conversations
     * - User context: Provides user identification for authorization
     * - Authorization: Validates user permissions for deletion operations
     * - Data integrity: Ensures proper user-specific operations
     * - Privacy: Prevents unauthorized conversation deletion
     *
     * Authentication Logic:
     * - getCurrentUser: Retrieves current user from session
     * - Parameter extraction: { conversationId } from URL parameters
     * - User validation: Checks currentUser?.id exists
     * - Early return: Prevents further processing without authentication
     * - Security: Ensures proper user authentication
     *
     * This authentication is essential for our messaging app because it provides
     * the security and user context that enables proper conversation deletion
     * and authorization throughout our messaging platform.
     */
    const currentUser = await getCurrentUser();
    const { conversationId } = params;

    /**
     * Unauthenticated User Handling
     *
     * Handles cases where the user is not authenticated by returning a null
     * response. This provides graceful handling for unauthenticated requests
     * without exposing sensitive information.
     *
     * What this handles:
     * - Unauthenticated user requests
     * - Missing user ID scenarios
     * - Security validation for deletion access
     * - Graceful error handling
     * - Privacy protection
     *
     * Why null response for unauthenticated users:
     * - Security: Prevents unauthorized access to conversation deletion
     * - Privacy: Doesn't expose conversation existence to unauthenticated users
     * - Graceful handling: Provides clean response without errors
     * - User experience: Prevents confusing error messages
     * - Best practices: Follows security best practices for API endpoints
     *
     * This unauthenticated handling is essential for our messaging app because
     * it provides the security that prevents unauthorized conversation deletion
     * and maintains proper access control throughout our messaging platform.
     */
    if (!currentUser?.id) {
      return new NextResponse(null);
    }

    /**
     * Conversation Existence Validation
     *
     * Validates that the conversation exists before attempting deletion by
     * querying the database for the conversation with user information.
     * This validation ensures proper conversation handling and user context.
     *
     * What this validates:
     * - Conversation existence in database
     * - Conversation data retrieval for user context
     * - User information for notification purposes
     * - Conversation validity before deletion
     * - Database integrity for conversation operations
     *
     * Why conversation validation is essential:
     * - Data integrity: Ensures conversation exists before deletion
     * - User context: Provides user information for notifications
     * - Error handling: Prevents deletion of non-existent conversations
     * - Real-time notifications: Enables proper participant notification
     * - User experience: Provides clear error messages for invalid conversations
     *
     * Validation Logic:
     * - Database query: prisma.conversation.findUnique() for conversation lookup
     * - User inclusion: include: { users: true } for participant information
     * - Error response: 400 status with 'Invalid ID' message for non-existent conversations
     * - User context: Provides user data for real-time notifications
     * - Data integrity: Ensures proper conversation handling
     *
     * This conversation validation is essential for our messaging app because
     * it provides the data integrity that ensures proper conversation deletion
     * and user context for real-time notifications throughout our messaging platform.
     */
    const existingConversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    });

    if (!existingConversation) {
      return new NextResponse('Invalid ID', { status: 400 });
    }

    /**
     * User-Authorized Conversation Deletion
     *
     * Deletes the conversation from the database with user-specific authorization
     * to ensure only conversation participants can delete the conversation.
     * This deletion provides secure conversation removal with proper authorization.
     *
     * What this deletes:
     * - Conversation record from database
     * - User-specific conversation access validation
     * - Conversation data with proper authorization
     * - Database cleanup for conversation removal
     * - Authorized deletion with user validation
     *
     * Why user-specific deletion is essential:
     * - Security: Ensures only conversation participants can delete
     * - Authorization: Validates user permissions for deletion
     * - Data integrity: Prevents unauthorized conversation deletion
     * - Privacy: Protects conversation data from unauthorized access
     * - User experience: Provides proper authorization for deletion
     *
     * Deletion Logic:
     * - Prisma deleteMany: prisma.conversation.deleteMany() for database deletion
     * - User authorization: userIds: { hasSome: [currentUser.id] } for user-specific deletion
     * - Conversation identification: id: conversationId for specific conversation
     * - Authorization validation: Ensures user is conversation participant
     * - Database cleanup: Removes conversation from database
     *
     * This user-authorized deletion is essential for our messaging app because
     * it provides the security that ensures only authorized users can delete
     * conversations and maintains proper access control throughout our messaging platform.
     */
    const deletedConversation = await prisma.conversation.deleteMany({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [currentUser.id],
        },
      },
    });

    /**
     * Real-Time Deletion Notifications
     *
     * Sends real-time notifications to all conversation participants about
     * the conversation deletion using Pusher. This provides immediate
     * synchronization of conversation removal across all participants.
     *
     * What this notifies:
     * - All conversation participants about deletion
     * - Real-time conversation removal updates
     * - Live synchronization of conversation state
     * - Immediate UI updates for all participants
     * - Conversation removal confirmation
     *
     * Why real-time notifications are essential:
     * - User experience: Immediate visibility of conversation deletion
     * - Synchronization: Keeps all participants in sync
     * - Real-time updates: Provides live conversation state changes
     * - UI updates: Enables immediate conversation list updates
     * - Collaboration: Ensures all users see deletion immediately
     *
     * Notification Logic:
     * - User iteration: existingConversation.users.forEach() for all participants
     * - Email validation: if (user.email) for valid email addresses
     * - Pusher trigger: pusherServer.trigger() for real-time notifications
     * - Event type: 'conversation:remove' for deletion events
     * - Data payload: existingConversation for conversation information
     *
     * This real-time notification is essential for our messaging app because
     * it provides the live synchronization that ensures all participants
     * see conversation deletions immediately throughout our messaging platform.
     */
    existingConversation.users.forEach((user) => {
      if (user.email) {
        pusherServer.trigger(
          user.email,
          'conversation:remove',
          existingConversation
        );
      }
    });

    /**
     * Success Response with Deletion Result
     *
     * Returns the deletion result as JSON response to the client, providing
     * confirmation of successful conversation deletion and enabling proper
     * client-side state management.
     *
     * What this returns:
     * - Deletion result from database operation
     * - Confirmation of successful conversation deletion
     * - Client-side state management data
     * - Deletion confirmation for UI updates
     * - API response for client integration
     *
     * Why deletion result is essential:
     * - Client integration: Provides data for client-side state management
     * - User experience: Confirms successful conversation deletion
     * - UI updates: Enables immediate conversation list updates
     * - State synchronization: Keeps client and server in sync
     * - Confirmation: Provides deletion confirmation to user
     *
     * Response Features:
     * - JSON format: Standard JSON response for API consumption
     * - Deletion data: Includes deletion result from database
     * - Client ready: Data formatted for immediate client use
     * - Confirmation: Confirms successful conversation deletion
     * - Integration: Works with client-side conversation management
     *
     * This success response is essential for our messaging app because
     * it provides the confirmation that enables proper client-side
     * state management and user feedback throughout our messaging platform.
     */
    return NextResponse.json(deletedConversation);
  } catch (error: any) {
    /**
     * Error Handling and Response
     *
     * Handles any errors that occur during conversation deletion and returns
     * appropriate error responses. This error handling ensures graceful failure
     * and provides consistent error responses for client integration.
     *
     * What this handles:
     * - Database errors during conversation deletion
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
     * and proper client integration throughout our conversation management system.
     */
    return new NextResponse('Internal Error', { status: 500 });
  }
}

/**
 * Conversation Retrieval API Endpoint
 *
 * Handles GET requests for retrieving individual conversations with user
 * authorization and security validation. This endpoint provides secure
 * conversation access with proper user validation and access control.
 *
 * Key Capabilities:
 * - User authentication and authorization for conversation access
 * - Conversation existence validation and retrieval
 * - User-specific conversation access control
 * - Security validation to prevent unauthorized access
 * - Complete conversation data with user information
 * - Comprehensive error handling and status responses
 *
 * Retrieval Features:
 * - User authorization: Only conversation participants can access
 * - Conversation validation: Ensures conversation exists and user has access
 * - Complete data: Includes all conversation and user information
 * - Security validation: Prevents unauthorized conversation access
 * - Database integration: Prisma ORM with MongoDB for data retrieval
 *
 * Usage Patterns:
 * - Conversation pages: Individual conversation display and management
 * - Profile drawers: Conversation information display
 * - Message components: Conversation context for messaging
 * - Real-time updates: Base data for conversation synchronization
 * - Navigation: Conversation-specific routing and display
 *
 * API Integration:
 * - GET /api/conversations/{conversationId}: Primary conversation retrieval endpoint
 * - Request: No body required, conversationId from URL parameters
 * - Response: Complete conversation object or error status
 * - Authentication: getCurrentUser action for user validation
 * - Security: User-specific conversation access validation
 *
 * Security Features:
 * - User authentication via getCurrentUser action
 * - Conversation access validation with userIds filtering
 * - User-specific conversation retrieval
 * - Unauthorized access prevention
 * - Error handling without sensitive information exposure
 *
 * This API endpoint is crucial for our messaging app because it provides the
 * conversation retrieval functionality that enables users to access
 * specific conversations while maintaining security and proper access
 * control throughout our messaging platform.
 *
 * @param {Request} request - HTTP request object (unused in this implementation)
 * @param {{ params: IParams }} params - Route parameters containing conversationId
 * @returns {Promise<NextResponse>} JSON response with conversation data or error status
 *
 * @example
 * ```typescript
 * // Conversation retrieval
 * const response = await fetch('/api/conversations/conversation-id');
 * const conversation = await response.json();
 *
 * // Response: Complete conversation object or error
 * if (response.ok) {
 *   // Use conversation data
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
     * authorized users can access conversations.
     *
     * What this provides:
     * - Current user identification and validation
     * - Conversation ID extraction from URL parameters
     * - User context for conversation access
     * - Authorization for retrieval operations
     * - Security validation for API access
     *
     * Why authentication is essential:
     * - Security: Ensures only authenticated users can access conversations
     * - User context: Provides user identification for authorization
     * - Authorization: Validates user permissions for conversation access
     * - Data integrity: Ensures proper user-specific operations
     * - Privacy: Prevents unauthorized conversation access
     *
     * Authentication Logic:
     * - getCurrentUser: Retrieves current user from session
     * - Parameter extraction: { conversationId } from URL parameters
     * - User validation: Checks currentUser?.id exists
     * - Error response: 401 status with null response for unauthenticated users
     * - Security: Ensures proper user authentication
     *
     * This authentication is essential for our messaging app because it provides
     * the security and user context that enables proper conversation access
     * and authorization throughout our messaging platform.
     */
    const currentUser = await getCurrentUser();
    const { conversationId } = params;

    /**
     * Unauthenticated User Handling
     *
     * Handles cases where the user is not authenticated by returning a 401
     * unauthorized response. This provides clear error handling for
     * unauthenticated requests.
     *
     * What this handles:
     * - Unauthenticated user requests
     * - Missing user ID scenarios
     * - Security validation for conversation access
     * - Clear error responses
     * - Privacy protection
     *
     * Why 401 response for unauthenticated users:
     * - Security: Prevents unauthorized access to conversation data
     * - Clear error: Provides explicit unauthorized status
     * - User experience: Clear indication of authentication requirement
     * - API standards: Follows HTTP status code conventions
     * - Best practices: Proper error handling for authentication failures
     *
     * This unauthenticated handling is essential for our messaging app because
     * it provides the security that prevents unauthorized conversation access
     * and maintains proper access control throughout our messaging platform.
     */
    if (!currentUser?.id) {
      return new NextResponse(null, { status: 401 });
    }

    /**
     * User-Authorized Conversation Retrieval
     *
     * Retrieves the conversation from the database with user-specific authorization
     * to ensure only conversation participants can access the conversation.
     * This retrieval provides secure conversation access with proper authorization.
     *
     * What this retrieves:
     * - Conversation data from database
     * - User-specific conversation access validation
     * - Complete conversation information with user data
     * - Authorized retrieval with user validation
     * - Security validation for conversation access
     *
     * Why user-specific retrieval is essential:
     * - Security: Ensures only conversation participants can access
     * - Authorization: Validates user permissions for conversation access
     * - Data integrity: Prevents unauthorized conversation access
     * - Privacy: Protects conversation data from unauthorized access
     * - User experience: Provides proper authorization for conversation access
     *
     * Retrieval Logic:
     * - Prisma findUnique: prisma.conversation.findUnique() for database retrieval
     * - User authorization: userIds: { has: currentUser.id } for user-specific access
     * - Conversation identification: id: conversationId for specific conversation
     * - User inclusion: include: { users: true } for complete user data
     * - Authorization validation: Ensures user is conversation participant
     *
     * Security Note:
     * The userIds: { has: currentUser.id } filter is a critical security feature
     * that ensures only conversation participants can access the conversation.
     * This prevents unauthorized users from accessing conversations they're not
     * part of, maintaining proper data privacy and security.
     *
     * This user-authorized retrieval is essential for our messaging app because
     * it provides the security that ensures only authorized users can access
     * conversations and maintains proper access control throughout our messaging platform.
     */
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
        userIds: {
          has: currentUser.id, // ✅ SECURITY FIX: Only return if user is part of conversation
        },
      },
      include: {
        users: true,
      },
    });

    /**
     * Conversation Not Found Handling
     *
     * Handles cases where the conversation doesn't exist or the user doesn't
     * have access to it by returning a 404 not found response. This provides
     * clear error handling for invalid conversation access.
     *
     * What this handles:
     * - Non-existent conversation scenarios
     * - Unauthorized conversation access
     * - Invalid conversation ID scenarios
     * - Clear error responses
     * - User experience feedback
     *
     * Why 404 response for missing conversations:
     * - User experience: Clear indication that conversation doesn't exist
     * - Security: Doesn't reveal whether conversation exists or user lacks access
     * - API standards: Follows HTTP status code conventions
     * - Error handling: Provides consistent error responses
     * - Best practices: Proper error handling for missing resources
     *
     * This not found handling is essential for our messaging app because
     * it provides the clear error feedback that helps users understand
     * when conversations are not accessible throughout our messaging platform.
     */
    if (!conversation) {
      return new NextResponse('Conversation not found', { status: 404 });
    }

    /**
     * Success Response with Conversation Data
     *
     * Returns the complete conversation data as JSON response to the client,
     * providing all conversation information including participants for
     * proper client-side rendering and state management.
     *
     * What this returns:
     * - Complete conversation object with all data
     * - User participants for conversation display
     * - Conversation metadata for UI rendering
     * - Client-side state management data
     * - API response for client integration
     *
     * Why complete conversation data is essential:
     * - Client integration: Provides data for client-side rendering
     * - User experience: Enables proper conversation display
     * - State management: Supports client-side state management
     * - UI rendering: Provides all necessary data for conversation UI
     * - Real-time updates: Base data for real-time synchronization
     *
     * Response Features:
     * - JSON format: Standard JSON response for API consumption
     * - Complete data: Includes all conversation and user information
     * - Client ready: Data formatted for immediate client use
     * - User data: Includes all conversation participants
     * - Integration: Works with client-side conversation components
     *
     * This success response is essential for our messaging app because
     * it provides the complete conversation data that enables proper
     * client-side rendering and state management throughout our messaging platform.
     */
    return NextResponse.json(conversation);
  } catch (error: any) {
    /**
     * Error Handling and Response
     *
     * Handles any errors that occur during conversation retrieval and returns
     * appropriate error responses. This error handling ensures graceful failure
     * and provides consistent error responses for client integration.
     *
     * What this handles:
     * - Database errors during conversation retrieval
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
     * and proper client integration throughout our conversation management system.
     */
    return new NextResponse('Internal Error', { status: 500 });
  }
}
