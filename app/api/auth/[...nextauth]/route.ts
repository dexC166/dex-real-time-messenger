/**
 * NextAuth.js API Route Handler for Dex Real-Time Messenger
 *
 * This file implements the NextAuth.js API route handler for our Next.js 14 App Router
 * real-time messaging application. It provides the complete authentication API that
 * handles user sign-in, sign-out, session management, and OAuth provider callbacks
 * for our messaging platform.
 *
 * Key Features:
 * - Dynamic route handler using [...nextauth] catch-all pattern
 * - Supports both GET and POST HTTP methods
 * - Integrates with our custom authOptions configuration
 * - Handles OAuth providers (Google, GitHub) and credentials
 * - Manages JWT-based sessions and database integration
 *
 * API Endpoints:
 * - GET /api/auth/signin: Sign-in page and provider discovery
 * - POST /api/auth/signin: Credential-based authentication
 * - GET /api/auth/signout: Sign-out page and logout handling
 * - POST /api/auth/signout: Session termination
 * - GET /api/auth/session: Current session information
 * - GET /api/auth/csrf: CSRF token for form protection
 * - GET /api/auth/providers: Available authentication providers
 * - GET /api/auth/callback/[provider]: OAuth provider callbacks
 * - POST /api/auth/callback/[provider]: OAuth provider token exchange
 *
 * This API route is essential for our messaging app because it provides the
 * secure authentication foundation that enables users to access real-time
 * messaging features while maintaining session state and user identity.
 *
 * @fileoverview NextAuth.js API route handler for Next.js 14 App Router authentication
 * @author Dayle Cortes
 * @since 2025
 */

import { authOptions } from '@/app/libs/authOptions';
import NextAuth from 'next-auth';

/**
 * NextAuth.js Handler Instance
 *
 * Creates the NextAuth.js handler using our custom authentication configuration.
 * This handler is responsible for processing all authentication-related requests
 * and managing the complete authentication flow for our messaging application.
 *
 * Key Responsibilities:
 * - Processes authentication requests from client components
 * - Handles OAuth provider callbacks and token exchange
 * - Manages session creation, validation, and termination
 * - Integrates with our Prisma database for user management
 * - Provides secure authentication for real-time messaging features
 *
 * Configuration Integration:
 * - Uses authOptions from @/app/libs/authOptions
 * - Supports multiple authentication providers (Google, GitHub, Credentials)
 * - Implements JWT-based session management
 * - Integrates with MongoDB via Prisma adapter
 * - Handles secure password hashing and validation
 *
 * This handler is crucial for our messaging app because it ensures that only
 * authenticated users can access conversation features, real-time messaging,
 * and user management functionality while maintaining security best practices.
 */
const handler = NextAuth(authOptions);

/**
 * HTTP Method Exports
 *
 * Exports the NextAuth.js handler for both GET and POST HTTP methods.
 * This dual export pattern is required by Next.js 14 App Router to handle
 * different types of authentication requests appropriately.
 *
 * GET Method Usage:
 * - Provider discovery and sign-in page rendering
 * - OAuth provider callback handling
 * - Session information retrieval
 * - CSRF token generation
 * - Sign-out page display
 *
 * POST Method Usage:
 * - Credential-based authentication submission
 * - OAuth provider token exchange
 * - Session termination requests
 * - Form-based authentication processing
 *
 * Why both methods?
 * - GET: For page rendering, callbacks, and data retrieval
 * - POST: For form submissions, token exchange, and state changes
 * - NextAuth.js automatically routes requests to appropriate handlers
 * - Ensures proper HTTP semantics for different authentication operations
 *
 * This dual export pattern is essential for our messaging app because it
 * provides the complete authentication API that supports all authentication
 * flows while maintaining proper HTTP method usage and security practices.
 */
export { handler as GET, handler as POST };
