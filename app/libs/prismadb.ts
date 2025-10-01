/**
 * Prisma Database Client for Dex Real-Time Messenger
 *
 * This file configures and exports a singleton Prisma client instance for our
 * Next.js 14 real-time messaging application. It implements the recommended
 * Next.js pattern for Prisma client instantiation to prevent connection
 * issues during development and ensure optimal performance in production.
 *
 * Key Features:
 * - Singleton pattern prevents multiple client instances
 * - Development vs production connection handling
 * - Type-safe database access throughout the application
 * - Integration with NextAuth.js and MongoDB
 *
 * This client is essential for our messaging app because it provides the
 * primary interface for all database operations, including user authentication,
 * conversation management, message handling, and real-time data synchronization.
 *
 * @fileoverview Prisma client configuration for Next.js 14 real-time messaging application
 * @author Dayle Cortes
 * @since 2025
 */

import { PrismaClient } from '@prisma/client';

/**
 * Global Prisma Client Declaration
 *
 * Declares a global variable to store the Prisma client instance. This is
 * necessary for the Next.js development pattern where the client needs to
 * persist across hot reloads and module re-imports.
 *
 * Why use a global variable?
 * - Prevents multiple client instances during development
 * - Avoids connection pool exhaustion from hot reloads
 * - Ensures consistent database connections across the application
 * - Follows Next.js best practices for Prisma integration
 *
 * The global declaration allows TypeScript to recognize the prisma property
 * on the global object, enabling type-safe access throughout the application.
 */
declare global {
  var prisma: PrismaClient | undefined;
}

/**
 * Prisma Client Instance
 *
 * Creates or retrieves the singleton Prisma client instance. This implementation
 * follows the recommended Next.js pattern for Prisma client management:
 *
 * 1. Check if a client already exists in the global scope
 * 2. Create a new client if none exists
 * 3. Store the client globally in development to prevent re-instantiation
 * 4. Export the client for use throughout the application
 *
 * This pattern is crucial for our messaging app because it ensures:
 * - Consistent database connections across API routes and server actions
 * - Proper connection pooling for real-time messaging operations
 * - Type-safe access to our MongoDB database through Prisma
 * - Integration with NextAuth.js authentication system
 */
const client = globalThis.prisma || new PrismaClient();

/**
 * Development Environment Client Persistence
 *
 * Stores the Prisma client in the global scope during development to prevent
 * multiple client instances from being created during hot reloads and module
 * re-imports. This is essential for maintaining stable database connections
 * during development.
 *
 * Why only in development?
 * - Production builds don't have hot reloading issues
 * - Global variables persist across module re-imports in development
 * - Prevents connection pool exhaustion during development
 * - Ensures consistent behavior between development and production
 *
 * In production, the client is created fresh for each serverless function
 * invocation, which is the optimal pattern for serverless deployments.
 */
if (process.env.NODE_ENV !== 'production') globalThis.prisma = client;

/**
 * Default Export - Prisma Client Instance
 *
 * Exports the configured Prisma client instance for use throughout the
 * application. This client provides type-safe access to all database
 * operations defined in our Prisma schema.
 *
 * Usage Examples:
 * - API routes: `import prisma from '@/app/libs/prismadb'`
 * - Server actions: `import prisma from '@/app/libs/prismadb'`
 * - NextAuth.js integration: `import prisma from '@/app/libs/prismadb'`
 *
 * This client is used extensively throughout our messaging app for:
 * - User authentication and profile management
 * - Conversation creation and management
 * - Message sending and retrieval
 * - Real-time data synchronization
 * - OAuth provider account management
 */
export default client;
