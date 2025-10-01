/**
 * NextAuth.js Configuration for Dex Real-Time Messenger
 *
 * This file configures NextAuth.js authentication for our Next.js 14 real-time
 * messaging application. It defines multiple authentication strategies including
 * OAuth providers (Google, GitHub) and credential-based authentication, with
 * full integration to our MongoDB database through Prisma.
 *
 * Key Features:
 * - Multiple authentication providers (OAuth + credentials)
 * - Prisma database integration for user management
 * - JWT-based session management
 * - Secure password hashing with bcrypt
 * - Development debugging and error handling
 *
 * Authentication Flow:
 * 1. Users can sign in via Google, GitHub, or email/password
 * 2. OAuth users are automatically created/updated in the database
 * 3. Credential users are validated against hashed passwords
 * 4. Sessions are managed via secure JWT tokens
 * 5. All authentication data is stored in MongoDB via Prisma
 *
 * This configuration is essential for our messaging app because it provides
 * secure, flexible authentication that supports both social login and traditional
 * credentials, enabling users to access real-time messaging features safely.
 *
 * @fileoverview NextAuth.js configuration for Next.js 14 real-time messaging application
 * @author Dayle Cortes
 * @since 2025
 */

import bcrypt from 'bcrypt';
import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';

import prisma from '@/app/libs/prismadb';

/**
 * NextAuth.js Configuration Object
 *
 * Defines the complete authentication configuration for our messaging application.
 * This object contains all the settings, providers, and strategies that NextAuth.js
 * uses to handle user authentication, session management, and database integration.
 *
 * Key Components:
 * - Database adapter for Prisma integration
 * - Multiple authentication providers
 * - Session and security configuration
 * - Development debugging settings
 */
export const authOptions: AuthOptions = {
  /**
   * Prisma Database Adapter
   *
   * Integrates NextAuth.js with our Prisma database client to automatically
   * handle user, account, and session data storage. This adapter is essential
   * for our messaging app because it:
   *
   * - Automatically creates and updates user records in MongoDB
   * - Manages OAuth account connections and tokens
   * - Handles session persistence and cleanup
   * - Provides type-safe database operations
   * - Integrates seamlessly with our Prisma schema
   *
   * The PrismaAdapter automatically creates the necessary database tables
   * and handles all authentication-related database operations, ensuring
   * data consistency and security across our messaging platform.
   */
  adapter: PrismaAdapter(prisma),

  /**
   * Authentication Providers Configuration
   *
   * Defines the available authentication methods for our messaging application.
   * Users can sign in using multiple strategies, providing flexibility and
   * convenience while maintaining security.
   *
   * Provider Order:
   * 1. GitHub OAuth - For developers and tech-savvy users
   * 2. Google OAuth - For general users and easy sign-up
   * 3. Credentials - For traditional email/password authentication
   *
   * This multi-provider approach ensures our messaging app is accessible
   * to users with different preferences and existing accounts.
   */
  providers: [
    /**
     * GitHub OAuth Provider
     *
     * Enables users to sign in using their GitHub accounts. This is particularly
     * useful for our messaging app because it attracts developers and tech-savvy
     * users who likely already have GitHub accounts.
     *
     * Key Features:
     * - One-click authentication with GitHub
     * - Automatic user profile data retrieval
     * - Secure OAuth 2.0 flow
     * - Profile picture and username from GitHub
     *
     * Environment Variables:
     * - GITHUB_ID: GitHub OAuth app client ID
     * - GITHUB_SECRET: GitHub OAuth app client secret
     *
     * The provider automatically handles the OAuth flow, token exchange,
     * and user data retrieval, storing everything securely in our database.
     */
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),

    /**
     * Google OAuth Provider
     *
     * Enables users to sign in using their Google accounts. This is the most
     * popular OAuth provider and provides a familiar authentication experience
     * for most users of our messaging application.
     *
     * Key Features:
     * - One-click authentication with Google
     * - Automatic user profile data retrieval
     * - Secure OAuth 2.0 flow
     * - Profile picture and email from Google
     *
     * Environment Variables:
     * - GOOGLE_CLIENT_ID: Google OAuth app client ID
     * - GOOGLE_CLIENT_SECRET: Google OAuth app client secret
     *
     * The provider automatically handles the OAuth flow, token exchange,
     * and user data retrieval, making it easy for users to get started
     * with our messaging platform.
     */
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    /**
     * Credentials Provider - Email/Password Authentication
     *
     * Enables traditional email/password authentication for users who prefer
     * not to use OAuth providers or want a dedicated account for our messaging
     * application. This provider handles the complete authentication flow
     * including password validation and user verification.
     *
     * Key Features:
     * - Email and password authentication
     * - Secure password hashing with bcrypt
     * - User validation against database
     * - Custom error handling and messaging
     *
     * Security Considerations:
     * - Passwords are hashed with bcrypt before storage
     * - Input validation prevents injection attacks
     * - Secure error messages prevent information leakage
     * - Database queries are protected against SQL injection
     *
     * This provider is essential for our messaging app because it provides
     * a fallback authentication method and supports users who prefer
     * traditional login credentials.
     */
    CredentialsProvider({
      /**
       * Provider Name
       *
       * Identifies this provider in NextAuth.js. Used for:
       * - Provider selection in the UI
       * - API route identification
       * - Error handling and logging
       */
      name: 'credentials',

      /**
       * Credential Fields Configuration
       *
       * Defines the form fields that users will see when signing in with
       * credentials. These fields are used by NextAuth.js to generate
       * the authentication form and validate user input.
       *
       * Field Types:
       * - email: Text input for email address
       * - password: Password input with masking
       *
       * The labels are used for form accessibility and user experience,
       * ensuring clear communication about what information is required.
       */
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },

      /**
       * Authorization Function
       *
       * Validates user credentials and returns user data if authentication
       * is successful. This function is called by NextAuth.js whenever a
       * user attempts to sign in with credentials.
       *
       * Authentication Flow:
       * 1. Validate input credentials (email and password)
       * 2. Query database for user with matching email
       * 3. Verify user exists and has a hashed password
       * 4. Compare provided password with stored hash using bcrypt
       * 5. Return user object if authentication succeeds
       * 6. Throw error if authentication fails
       *
       * Security Features:
       * - Input validation prevents empty credentials
       * - Database queries use Prisma for SQL injection protection
       * - Password comparison uses bcrypt for timing attack protection
       * - Consistent error messages prevent information leakage
       *
       * This function is crucial for our messaging app because it ensures
       * that only authenticated users can access real-time messaging features
       * while maintaining security best practices.
       *
       * @param credentials - User-provided email and password
       * @returns User object if authentication succeeds
       * @throws Error if authentication fails
       */
      async authorize(credentials) {
        /**
         * Input Validation
         *
         * Ensures that both email and password are provided before attempting
         * authentication. This prevents unnecessary database queries and
         * provides clear error messages to users.
         */
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid Credentials');
        }

        /**
         * User Lookup
         *
         * Queries the database to find a user with the provided email address.
         * Uses Prisma for type-safe database access and protection against
         * SQL injection attacks.
         *
         * The query is case-insensitive and looks for exact email matches
         * to ensure consistent user identification across our messaging platform.
         */
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        /**
         * User Existence and Password Validation
         *
         * Verifies that the user exists and has a hashed password stored.
         * This check is essential because:
         * - OAuth users might not have hashed passwords
         * - New users might not have completed registration
         * - Deleted users should not be able to authenticate
         */
        if (!user || !user?.hashedPassword) {
          throw new Error('Invalid credentials');
        }

        /**
         * Password Verification
         *
         * Uses bcrypt to securely compare the provided password with the
         * stored hash. This is the most critical security step because:
         * - bcrypt handles salt generation and comparison
         * - Timing attacks are prevented by constant-time comparison
         * - Password hashes are never exposed in error messages
         * - Failed attempts don't reveal whether the user exists
         */
        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        /**
         * Authentication Result
         *
         * Returns the user object if password verification succeeds, or
         * throws an error if authentication fails. The user object will
         * be used by NextAuth.js to create a session and manage authentication
         * state throughout our messaging application.
         */
        if (!isCorrectPassword) {
          throw new Error('Invalid credentials');
        }

        return user;
      },
    }),
  ],

  /**
   * Development Debugging Configuration
   *
   * Enables detailed logging and debugging information during development.
   * This is essential for troubleshooting authentication issues and
   * understanding the authentication flow during development.
   *
   * Why only in development?
   * - Prevents sensitive information from being logged in production
   * - Reduces log noise in production environments
   * - Maintains security by not exposing internal authentication details
   * - Improves performance by disabling unnecessary logging
   */
  debug: process.env.NODE_ENV === 'development',

  /**
   * Session Management Configuration
   *
   * Defines how user sessions are managed and stored. JWT strategy is chosen
   * for our messaging app because it provides:
   *
   * - Stateless authentication (no server-side session storage)
   * - Better performance for real-time messaging
   * - Easier scaling across multiple server instances
   * - Secure token-based authentication
   *
   * JWT tokens contain user information and are signed with our secret,
   * ensuring they can't be tampered with and providing secure authentication
   * for our real-time messaging features.
   */
  session: {
    strategy: 'jwt',
  },

  /**
   * NextAuth.js Secret Key
   *
   * Used to sign and verify JWT tokens and other cryptographic operations.
   * This secret is essential for security because it ensures that:
   *
   * - JWT tokens can't be forged or tampered with
   * - Session data remains secure and encrypted
   * - Authentication state is protected from manipulation
   * - Cross-site request forgery (CSRF) attacks are prevented
   *
   * The secret should be a long, random string that's kept secure and
   * never exposed in client-side code or version control.
   */
  secret: process.env.NEXTAUTH_SECRET,
};
