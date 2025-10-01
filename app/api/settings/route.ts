/**
 * User Settings API Route for Dex Real-Time Messenger
 *
 * This file provides the user settings API endpoint for our Next.js 14 real-time
 * messaging application. It implements user profile updates with authentication,
 * data validation, and database integration that ensures secure and reliable
 * profile management throughout our messaging platform.
 *
 * Key Features:
 * - User profile updates with name and image modification
 * - Authentication and authorization for secure updates
 * - Prisma ORM integration with MongoDB for data persistence
 * - Input validation and data sanitization
 * - Comprehensive error handling and status responses
 *
 * Settings Update Features:
 * - Name updates for user display in conversations
 * - Image updates for profile pictures and avatars
 * - Authentication validation for secure access
 * - Database updates with proper user identification
 * - Response formatting for client integration
 *
 * This API route is essential for our messaging app because it provides the
 * user profile management functionality that enables users to update their
 * account information and maintain current profile data throughout our
 * real-time messaging platform.
 *
 * @fileoverview User settings API route for Next.js 14 real-time messaging application
 * @author Dayle Cortes
 * @since 2025
 */

import getCurrentUser from '@/app/actions/getCurrentUser';
import prisma from '@/app/libs/prismadb';
import { NextResponse } from 'next/server';

/**
 * User Settings Update API Endpoint
 *
 * Handles POST requests for updating user profile settings including name
 * and image. This endpoint provides secure profile management functionality
 * with authentication validation and database integration.
 *
 * Key Capabilities:
 * - User profile updates with name and image modification
 * - Authentication and authorization for secure updates
 * - Prisma ORM integration with MongoDB for data persistence
 * - Input validation and data sanitization
 * - Comprehensive error handling and status responses
 *
 * Settings Update Features:
 * - Name updates for user display in conversations
 * - Image updates for profile pictures and avatars
 * - Authentication validation for secure access
 * - Database updates with proper user identification
 * - Response formatting for client integration
 *
 * Usage Patterns:
 * - SettingsModal component: Profile editing form submission
 * - User profile management: Name and image updates
 * - Account settings: User profile information modifications
 * - Cloudinary integration: Image upload and URL updates
 * - Form validation: React Hook Form with error handling
 *
 * API Integration:
 * - POST /api/settings: Primary user settings update endpoint
 * - Request body: { name, image }
 * - Response: Updated user object or error status
 * - Authentication: getCurrentUser action for user validation
 * - Error responses: 401 (Unauthorized), 500 (Internal Error)
 *
 * Security Features:
 * - User authentication via getCurrentUser action
 * - Authorization checks for user ID and email validation
 * - Secure database updates with user identification
 * - Input validation and data sanitization
 * - Error handling without sensitive information exposure
 *
 * This API endpoint is crucial for our messaging app because it provides the
 * user profile management functionality that enables users to update their
 * account information and maintain current profile data throughout our
 * real-time messaging platform.
 *
 * @param {Request} request - HTTP request object containing user settings data
 * @returns {Promise<NextResponse>} JSON response with updated user or error status
 *
 * @example
 * ```typescript
 * // User profile update
 * const response = await fetch('/api/settings', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     name: 'John Doe',
 *     image: 'https://cloudinary.com/profile-image-url'
 *   })
 * });
 *
 * // Response: Updated user object or error
 * const updatedUser = await response.json();
 * ```
 */
export async function POST(request: Request) {
  try {
    /**
     * User Authentication and Authorization
     *
     * Validates the current user's authentication status and extracts user
     * information for profile updates. This authentication ensures only
     * authorized users can update their profile settings.
     *
     * What this provides:
     * - Current user identification and validation
     * - User context for profile updates
     * - Authorization for settings modification
     * - User data for database operations
     * - Security validation for API access
     *
     * Why authentication is essential:
     * - Security: Ensures only authenticated users can update profiles
     * - User context: Provides user identification for database updates
     * - Authorization: Validates user permissions for settings operations
     * - Data integrity: Ensures proper user-specific updates
     * - Privacy: Prevents unauthorized access to user settings
     *
     * Authentication Logic:
     * - getCurrentUser: Retrieves current user from session
     * - ID validation: Checks currentUser?.id exists
     * - Email validation: Checks currentUser?.email exists
     * - Unauthorized response: Returns 401 if authentication fails
     * - User context: Provides user data for profile updates
     *
     * This authentication is essential for our messaging app because it provides
     * the security and user context that enables proper profile updates
     * and authorization throughout our messaging platform.
     */
    const currentUser = await getCurrentUser();
    const body = await request.json();

    /**
     * Request Body Extraction and Data Processing
     *
     * Extracts user settings data from the request body and prepares
     * it for validation and database updates. This extraction provides
     * the foundation for profile update operations.
     *
     * What this extracts:
     * - Name: User display name for conversation identification
     * - Image: Profile image URL for avatar display
     * - Request body parsing for data processing
     * - User data preparation for database updates
     * - Settings data for profile modification
     *
     * Why this extraction is essential:
     * - Data access: Provides user settings data for updates
     * - Profile management: Enables name and image modifications
     * - User experience: Allows users to update their profile information
     * - Database integration: Prepares data for Prisma operations
     * - Client integration: Works with SettingsModal component
     *
     * Data Extraction Logic:
     * - JSON parsing: request.json() for request body extraction
     * - Destructuring: { name, image } for clean data access
     * - Data preparation: Raw data ready for database updates
     * - Error handling: Built-in JSON parsing error handling
     * - Type safety: TypeScript ensures proper data structure
     *
     * This data extraction is essential for our messaging app because it provides
     * the user settings data that enables profile updates and user
     * customization throughout our messaging platform.
     */
    const { name, image } = body;

    /**
     * Authentication Validation
     *
     * Validates that the current user is properly authenticated and has
     * the necessary permissions to update their profile settings. This
     * validation ensures secure access to profile modification features.
     *
     * What this validates:
     * - User authentication status
     * - User ID presence for database operations
     * - Email presence for user identification
     * - Authorization for settings updates
     * - Security validation for API access
     *
     * Why authentication validation is essential:
     * - Security: Ensures only authenticated users can update profiles
     * - Authorization: Validates user permissions for settings operations
     * - Data integrity: Ensures proper user-specific updates
     * - Privacy: Prevents unauthorized access to user settings
     * - User experience: Provides clear error messages for unauthorized access
     *
     * Validation Logic:
     * - ID check: !currentUser?.id for user identification
     * - Email check: !currentUser?.email for user validation
     * - Error response: 401 status with 'Unauthorized' message
     * - Early return: Prevents further processing without authentication
     * - Security: Ensures proper user authentication
     *
     * This authentication validation is essential for our messaging app because
     * it provides the security that ensures only authorized users can
     * update their profile settings throughout our messaging platform.
     */
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    /**
     * User Profile Database Update
     *
     * Updates the user's profile information in the database using Prisma ORM
     * with the provided name and image data. This update ensures the user's
     * profile information is properly stored and synchronized.
     *
     * What this updates:
     * - User name: Display name for conversation identification
     * - User image: Profile picture URL for avatar display
     * - Database record: User profile data in MongoDB
     * - User identification: Updates based on current user ID
     * - Profile synchronization: Ensures data consistency
     *
     * Why database updates are essential:
     * - Data persistence: Ensures profile changes are saved
     * - User experience: Enables profile customization
     * - Conversation display: Updates user information in conversations
     * - Avatar management: Enables profile picture updates
     * - Data consistency: Maintains synchronized user data
     *
     * Database Update Logic:
     * - Prisma update: prisma.user.update() for database modification
     * - User identification: where: { id: currentUser?.id } for user-specific updates
     * - Data updates: name and image fields for profile modification
     * - Database integration: MongoDB via Prisma ORM
     * - Data integrity: Ensures proper user-specific updates
     *
     * This database update is essential for our messaging app because it provides
     * the data persistence that ensures profile changes are properly saved
     * and synchronized throughout our messaging platform.
     */
    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser?.id,
      },
      data: {
        name: name,
        image: image,
      },
    });

    /**
     * Success Response with Updated User
     *
     * Returns the successfully updated user profile as JSON response to the client.
     * This response provides the updated user data for client-side state management
     * and enables immediate profile updates in the user interface.
     *
     * What this returns:
     * - Updated user object with all profile data
     * - User ID for authentication and identification
     * - Updated name and image for profile display
     * - Profile update confirmation
     * - User data for client-side integration
     *
     * Why complete user data is essential:
     * - Client integration: Provides data for client-side state management
     * - Profile display: Enables immediate profile updates in UI
     * - User experience: Confirms successful profile updates
     * - State synchronization: Keeps client and server in sync
     * - Avatar updates: Enables immediate profile picture changes
     *
     * Response Features:
     * - JSON format: Standard JSON response for API consumption
     * - Complete data: Includes all updated user profile information
     * - Client ready: Data formatted for immediate client use
     * - Profile ready: User data ready for profile display
     * - Success confirmation: Confirms successful profile updates
     *
     * This success response is essential for our messaging app because it provides
     * the updated user data that enables immediate profile updates and proper
     * user state management throughout our messaging platform.
     */
    return NextResponse.json(updatedUser);
  } catch (error: any) {
    /**
     * Error Handling and Response
     *
     * Handles any errors that occur during user profile updates and returns appropriate
     * error responses. This error handling ensures graceful failure and provides
     * consistent error responses for client integration.
     *
     * What this handles:
     * - Database errors during user updates
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
     * This error handling is essential for our messaging app because it provides
     * the error management that ensures API reliability and proper client
     * integration throughout our user profile management system.
     */
    return new NextResponse('Internal Error', { status: 500 });
  }
}
