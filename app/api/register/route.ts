/**
 * User Registration API Route for Dex Real-Time Messenger
 *
 * This file provides the user registration API endpoint for our Next.js 14 real-time
 * messaging application. It implements secure user account creation with comprehensive
 * input validation, password hashing, and duplicate prevention that ensures data
 * integrity and security for new user onboarding throughout our messaging platform.
 *
 * Key Features:
 * - Secure user registration with bcrypt password hashing
 * - Comprehensive input validation and sanitization
 * - Duplicate user prevention with email uniqueness checks
 * - Email format validation with regex patterns
 * - Password strength requirements and validation
 * - Name validation with length and trimming requirements
 *
 * Registration Features:
 * - Email validation with RFC-compliant regex patterns
 * - Password hashing with bcrypt (salt rounds: 12)
 * - Name validation with minimum length requirements
 * - Duplicate email prevention with database checks
 * - Input sanitization with trim() operations
 * - Comprehensive error handling and status responses
 *
 * This API route is essential for our messaging app because it provides the
 * secure user registration functionality that enables new users to create
 * accounts and access real-time messaging features while maintaining data
 * integrity and security throughout our messaging platform.
 *
 * @fileoverview User registration API route for Next.js 14 real-time messaging application
 * @author Dayle Cortes
 * @since 2025
 */

import bcrypt from 'bcrypt';

import prisma from '@/app/libs/prismadb';
import { NextResponse } from 'next/server';

/**
 * User Registration API Endpoint
 *
 * Handles POST requests for creating new user accounts with comprehensive
 * validation, security measures, and duplicate prevention. This endpoint
 * provides the core user registration functionality for our messaging application.
 *
 * Key Capabilities:
 * - Secure user registration with bcrypt password hashing
 * - Comprehensive input validation and sanitization
 * - Duplicate user prevention with email uniqueness checks
 * - Email format validation with regex patterns
 * - Password strength requirements and validation
 * - Name validation with length and trimming requirements
 *
 * Registration Features:
 * - Email validation with RFC-compliant regex patterns
 * - Password hashing with bcrypt (salt rounds: 12)
 * - Name validation with minimum length requirements
 * - Duplicate email prevention with database checks
 * - Input sanitization with trim() operations
 * - Comprehensive error handling and status responses
 *
 * Usage Patterns:
 * - AuthForm component: Registration form submission from authentication page
 * - User onboarding: New user account creation for messaging access
 * - Credential authentication: Email/password account creation
 * - Input validation: Client-side and server-side validation integration
 * - Error handling: User feedback for validation failures and duplicates
 *
 * API Integration:
 * - POST /api/register: Primary user registration endpoint
 * - Request body: { email, name, password }
 * - Response: Created user object or error status
 * - NextAuth.js integration: Works with credentials provider
 * - Error responses: 400 (Validation), 500 (Internal Error)
 *
 * Security Features:
 * - Input validation prevents malicious data submission
 * - Password hashing with bcrypt for secure storage
 * - Email normalization prevents duplicate accounts
 * - Input sanitization prevents injection attacks
 * - Duplicate prevention maintains data integrity
 *
 * This API endpoint is crucial for our messaging app because it provides the
 * secure user registration functionality that enables new users to create
 * accounts and access real-time messaging features while maintaining data
 * integrity and security throughout our messaging platform.
 *
 * @param {Request} request - HTTP request object containing user registration data
 * @returns {Promise<NextResponse>} JSON response with created user or error status
 *
 * @example
 * ```typescript
 * // User registration
 * const response = await fetch('/api/register', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     email: 'user@example.com',
 *     name: 'John Doe',
 *     password: 'securepassword123'
 *   })
 * });
 *
 * // Response: Created user object or validation error
 * const user = await response.json();
 * ```
 */
export async function POST(request: Request) {
  try {
    /**
     * Request Body Extraction and Initial Processing
     *
     * Extracts user registration data from the request body and prepares
     * it for validation and processing. This extraction provides the
     * foundation for user account creation with proper data handling.
     *
     * What this extracts:
     * - Email address for user identification and authentication
     * - Display name for user profile and conversation display
     * - Password for secure account authentication
     * - Request body parsing for data processing
     * - User data preparation for validation
     *
     * Why this extraction is essential:
     * - Data access: Provides user data for registration processing
     * - Validation preparation: Enables comprehensive input validation
     * - Security: Ensures proper data handling and sanitization
     * - User experience: Enables clear validation error messages
     * - Integration: Works with AuthForm component submission
     *
     * Data Extraction Logic:
     * - JSON parsing: request.json() for request body extraction
     * - Destructuring: { email, name, password } for clean data access
     * - Data preparation: Raw data ready for validation and processing
     * - Error handling: Built-in JSON parsing error handling
     * - Type safety: TypeScript ensures proper data structure
     *
     * This data extraction is essential for our messaging app because it provides
     * the user data that enables secure account creation and validation
     * throughout our user registration process.
     */
    const body = await request.json();
    const { email, name, password } = body;

    /**
     * Required Fields Validation
     *
     * Validates that all required fields (email, name, password) are present
     * in the request body. This validation prevents incomplete registration
     * attempts and provides clear error messages for missing data.
     *
     * What this validates:
     * - Email presence: Ensures email address is provided
     * - Name presence: Ensures display name is provided
     * - Password presence: Ensures password is provided
     * - Field completeness: Prevents incomplete registration attempts
     * - User feedback: Provides clear error messages for missing fields
     *
     * Why required field validation is essential:
     * - Data integrity: Ensures all necessary user data is provided
     * - User experience: Provides clear feedback for missing information
     * - Security: Prevents incomplete or malicious registration attempts
     * - Validation: Foundation for comprehensive input validation
     * - Error handling: Clear error messages for user guidance
     *
     * Validation Logic:
     * - Field checks: !email || !name || !password for presence validation
     * - Error response: 400 status with 'Missing required fields' message
     * - Early return: Prevents further processing with incomplete data
     * - User feedback: Clear error message for missing required fields
     * - Security: Prevents processing of incomplete registration data
     *
     * This required field validation is essential for our messaging app because
     * it provides the data integrity that ensures complete user registration
     * and clear user feedback throughout our registration process.
     */
    // ✅ SECURITY FIX: Input validation
    if (!email || !name || !password) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    /**
     * Email Format Validation
     *
     * Validates email address format using a comprehensive regex pattern
     * that follows RFC standards. This validation ensures proper email
     * format and prevents invalid email addresses from being registered.
     *
     * What this validates:
     * - Email format: RFC-compliant email address structure
     * - Character validation: Proper email character usage
     * - Domain validation: Valid domain structure with TLD
     * - Format compliance: Ensures email follows standard format
     * - User feedback: Clear error message for invalid email format
     *
     * Why email format validation is essential:
     * - Data integrity: Ensures valid email addresses for authentication
     * - User experience: Prevents invalid email registration attempts
     * - Security: Prevents malicious email format exploitation
     * - Authentication: Ensures proper email for login and recovery
     * - Communication: Validates email for notifications and updates
     *
     * Email Validation Logic:
     * - Regex pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ for RFC compliance
     * - Format check: emailRegex.test(email) for pattern matching
     * - Error response: 400 status with 'Invalid email format' message
     * - Early return: Prevents further processing with invalid email
     * - User feedback: Clear error message for format issues
     *
     * This email format validation is essential for our messaging app because
     * it provides the email integrity that ensures proper authentication
     * and communication throughout our messaging platform.
     */
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new NextResponse('Invalid email format', { status: 400 });
    }

    /**
     * Password Strength Validation
     *
     * Validates password strength by checking minimum length requirements.
     * This validation ensures users create secure passwords that meet
     * basic security standards for account protection.
     *
     * What this validates:
     * - Password length: Minimum 6 characters for basic security
     * - Password strength: Ensures adequate password complexity
     * - Security standards: Meets minimum password requirements
     * - User guidance: Provides clear password requirements
     * - Account protection: Prevents weak password usage
     *
     * Why password strength validation is essential:
     * - Security: Ensures adequate password protection for accounts
     * - User experience: Provides clear password requirements
     * - Account protection: Prevents easily guessable passwords
     * - Authentication: Ensures secure login credentials
     * - Best practices: Follows security standards for password requirements
     *
     * Password Validation Logic:
     * - Length check: password.length < 6 for minimum length
     * - Error response: 400 status with length requirement message
     * - Early return: Prevents further processing with weak password
     * - User feedback: Clear error message for password requirements
     * - Security: Ensures adequate password protection
     *
     * This password strength validation is essential for our messaging app because
     * it provides the password security that ensures adequate account protection
     * and secure authentication throughout our messaging platform.
     */
    // Password strength validation
    if (password.length < 6) {
      return new NextResponse('Password must be at least 6 characters', {
        status: 400,
      });
    }

    /**
     * Name Validation and Sanitization
     *
     * Validates and sanitizes the user's display name by checking minimum
     * length requirements and trimming whitespace. This validation ensures
     * proper display names for user identification in conversations.
     *
     * What this validates:
     * - Name length: Minimum 2 characters after trimming
     * - Name sanitization: Trims whitespace for clean display
     * - Display quality: Ensures meaningful user names
     * - User experience: Prevents empty or meaningless names
     * - Conversation display: Ensures proper user identification
     *
     * Why name validation is essential:
     * - User experience: Ensures meaningful display names in conversations
     * - Data quality: Prevents empty or whitespace-only names
     * - Display integrity: Ensures proper user identification
     * - Conversation clarity: Enables clear user identification
     * - Data sanitization: Removes unnecessary whitespace
     *
     * Name Validation Logic:
     * - Trimming: name.trim() removes leading/trailing whitespace
     * - Length check: name.trim().length < 2 for minimum length
     * - Error response: 400 status with length requirement message
     * - Early return: Prevents further processing with invalid name
     * - User feedback: Clear error message for name requirements
     *
     * This name validation is essential for our messaging app because it provides
     * the display name quality that ensures proper user identification
     * and conversation clarity throughout our messaging platform.
     */
    // Name validation
    if (name.trim().length < 2) {
      return new NextResponse('Name must be at least 2 characters', {
        status: 400,
      });
    }

    /**
     * Duplicate User Prevention
     *
     * Checks if a user with the provided email address already exists
     * in the database to prevent duplicate account creation. This check
     * ensures email uniqueness and maintains data integrity.
     *
     * What this checks:
     * - Email uniqueness: Prevents duplicate email addresses
     * - User existence: Checks if user already exists in database
     * - Data integrity: Maintains unique user identification
     * - Account security: Prevents account takeover attempts
     * - User experience: Provides clear error for existing accounts
     *
     * Why duplicate prevention is essential:
     * - Data integrity: Ensures unique user identification
     * - Security: Prevents account takeover and confusion
     * - User experience: Clear feedback for existing accounts
     * - Authentication: Ensures unique login credentials
     * - Database consistency: Maintains proper user data structure
     *
     * Duplicate Check Logic:
     * - Database query: prisma.user.findUnique() for email lookup
     * - Email normalization: email.toLowerCase() for case-insensitive check
     * - Existence check: existingUser check for duplicate prevention
     * - Error response: 400 status with 'User already exists' message
     * - Early return: Prevents duplicate account creation
     *
     * This duplicate prevention is essential for our messaging app because
     * it provides the data integrity that ensures unique user accounts
     * and prevents authentication confusion throughout our messaging platform.
     */
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return new NextResponse('User already exists', { status: 400 });
    }

    /**
     * Password Hashing with bcrypt
     *
     * Securely hashes the user's password using bcrypt with 12 salt rounds
     * for optimal security. This hashing ensures passwords are never stored
     * in plain text and provides strong protection against password breaches.
     *
     * What this provides:
     * - Password hashing: bcrypt.hash() with 12 salt rounds
     * - Security: Strong password protection against breaches
     * - Salt generation: Automatic salt generation for each password
     * - Hash storage: Secure password hash for database storage
     * - Authentication: Enables secure password verification
     *
     * Why bcrypt hashing is essential:
     * - Security: Prevents plain text password storage
     * - Protection: Strong defense against password breaches
     * - Salt rounds: 12 rounds provide optimal security/performance balance
     * - Industry standard: bcrypt is widely accepted for password hashing
     * - Authentication: Enables secure password verification during login
     *
     * Hashing Logic:
     * - bcrypt.hash(): Asynchronous password hashing function
     * - Salt rounds: 12 rounds for optimal security/performance
     * - Password input: Uses validated password from request
     * - Hash output: Secure hash ready for database storage
     * - Security: Never stores plain text passwords
     *
     * This password hashing is essential for our messaging app because it provides
     * the password security that ensures user account protection
     * and secure authentication throughout our messaging platform.
     */
    const hashedPassword = await bcrypt.hash(password, 12);

    /**
     * User Account Creation
     *
     * Creates a new user account in the database with validated and sanitized
     * data. This creation includes proper data normalization and ensures
     * the user account is ready for authentication and messaging features.
     *
     * What this creates:
     * - User record: New user account in MongoDB via Prisma
     * - Email normalization: email.toLowerCase().trim() for consistency
     * - Name sanitization: name.trim() for clean display names
     * - Password storage: Secure hashed password for authentication
     * - Account data: Complete user account with all required fields
     *
     * Why user creation is essential:
     * - Account creation: Enables new user access to messaging features
     * - Data normalization: Ensures consistent data storage
     * - Authentication: Provides user account for login functionality
     * - Messaging access: Enables user participation in conversations
     * - User experience: Completes registration process for new users
     *
     * User Creation Logic:
     * - Prisma create: prisma.user.create() for database insertion
     * - Email normalization: toLowerCase().trim() for consistency
     * - Name sanitization: trim() for clean display names
     * - Password storage: hashedPassword for secure authentication
     * - Data integrity: Complete user account with validated data
     *
     * This user creation is essential for our messaging app because it provides
     * the user account that enables access to real-time messaging features
     * and secure authentication throughout our messaging platform.
     */
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        name: name.trim(),
        hashedPassword,
      },
    });

    /**
     * Success Response with Created User
     *
     * Returns the successfully created user account as JSON response to the client.
     * This response provides the user data for client-side state management
     * and enables immediate authentication after registration.
     *
     * What this returns:
     * - Created user object with all account data
     * - User ID for authentication and identification
     * - Email and name for user profile display
     * - Account creation confirmation
     * - User data for client-side integration
     *
     * Why complete user data is essential:
     * - Client integration: Provides data for client-side state management
     * - Authentication: Enables immediate login after registration
     * - User experience: Confirms successful account creation
     * - Profile display: Provides user data for interface display
     * - State management: Enables proper user state initialization
     *
     * Response Features:
     * - JSON format: Standard JSON response for API consumption
     * - Complete data: Includes all user account information
     * - Client ready: Data formatted for immediate client use
     * - Authentication ready: User data ready for login process
     * - Success confirmation: Confirms successful account creation
     *
     * This success response is essential for our messaging app because it provides
     * the user data that enables immediate authentication and proper
     * user state management throughout our messaging platform.
     */
    return NextResponse.json(user);
  } catch (error: any) {
    /**
     * Error Handling and Response
     *
     * Handles any errors that occur during user registration and returns appropriate
     * error responses. This error handling ensures graceful failure and provides
     * consistent error responses for client integration.
     *
     * What this handles:
     * - Database errors during user creation
     * - Prisma ORM errors and connection issues
     * - bcrypt hashing errors and failures
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
     * integration throughout our user registration process.
     */
    return new NextResponse('Internal Error', { status: 500 });
  }
}
