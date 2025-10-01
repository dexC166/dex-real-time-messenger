/**
 * Pusher Real-Time Messaging Configuration for Dex Real-Time Messenger
 *
 * This file configures Pusher for real-time messaging in our Next.js 14 application.
 * It provides both server-side and client-side Pusher instances that enable instant
 * message delivery, conversation updates, and user presence tracking across our
 * messaging platform.
 *
 * Key Features:
 * - Server-side message broadcasting via pusherServer
 * - Client-side real-time subscriptions via pusherClient
 * - Secure channel authorization for private messaging
 * - User presence tracking and online status
 * - Message delivery and read receipt notifications
 *
 * Real-Time Events:
 * - messages:new: New message notifications
 * - conversation:new: New conversation created
 * - conversation:update: Conversation details updated
 * - conversation:remove: Conversation deleted
 * - message:update: Message read receipts and status updates
 * - pusher:member_added/removed: User presence changes
 *
 * This configuration is essential for our messaging app because it enables
 * instant message delivery, real-time conversation updates, and seamless
 * user experience across all connected clients.
 *
 * @fileoverview Pusher configuration for Next.js 14 real-time messaging application
 * @author Dayle Cortes
 * @since 2025
 */

import PusherServer from 'pusher';
import PusherClient from 'pusher-js';

/**
 * Pusher Server Instance - Server-Side Broadcasting
 *
 * Handles real-time message broadcasting from our Next.js API routes to connected
 * clients. This server instance is used to trigger events when messages are sent,
 * conversations are created, or user presence changes occur.
 *
 * Key Capabilities:
 * - Broadcasts messages to specific conversation channels
 * - Sends conversation updates to user-specific channels
 * - Manages user presence and online status
 * - Handles channel authorization for private messaging
 *
 * Usage Patterns:
 * - API routes trigger events after database operations
 * - Messages are broadcast to conversation participants
 * - Conversation updates notify all participants
 * - User presence events update online status
 *
 * This server instance is crucial for our messaging app because it ensures
 * that all real-time events are properly broadcast to the right users at
 * the right time, maintaining message delivery and conversation synchronization.
 */
export const pusherServer = new PusherServer({
  /**
   * Pusher Application ID
   *
   * Unique identifier for our Pusher application. This connects our server
   * instance to the correct Pusher app and enables proper message routing.
   *
   * Environment Variable: PUSHER_APP_ID
   * - Retrieved from Pusher dashboard
   * - Must match the client-side configuration
   * - Required for server-side authentication
   */
  appId: process.env.PUSHER_APP_ID!,

  /**
   * Pusher Application Key
   *
   * Public key used for client authentication and channel identification.
   * This key is safe to expose in client-side code and is used by both
   * server and client instances for proper communication.
   *
   * Environment Variable: NEXT_PUBLIC_PUSHER_APP_KEY
   * - NEXT_PUBLIC_ prefix makes it available in client-side code
   * - Used for channel subscription and event binding
   * - Required for both server and client instances
   */
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,

  /**
   * Pusher Application Secret
   *
   * Private key used for server-side authentication and channel authorization.
   * This secret must be kept secure and is only used on the server side
   * for authenticating channel access and triggering events.
   *
   * Environment Variable: PUSHER_SECRET
   * - Never exposed to client-side code
   * - Used for channel authorization in /api/pusher/auth
   * - Required for server-side event triggering
   */
  secret: process.env.PUSHER_SECRET!,

  /**
   * Pusher Cluster Region
   *
   * Specifies the geographic region for our Pusher application. The "mt1"
   * cluster provides optimal performance for users in the US East region
   * and ensures low-latency message delivery for our messaging application.
   *
   * Why "mt1"?
   * - Optimal for US-based users
   * - Low latency for real-time messaging
   * - Reliable infrastructure for high-frequency events
   * - Cost-effective for our messaging use case
   */
  cluster: 'mt1',

  /**
   * TLS Encryption
   *
   * Enables secure, encrypted connections for all Pusher communications.
   * This is essential for our messaging app because it ensures that:
   *
   * - All messages are encrypted in transit
   * - User data remains secure and private
   * - Channel communications are protected
   * - Meets security requirements for messaging applications
   */
  useTLS: true,
});

/**
 * Pusher Client Instance - Client-Side Subscriptions
 *
 * Handles real-time message subscriptions and event listening on the client side.
 * This client instance enables our React components to receive instant updates
 * when messages are sent, conversations are updated, or user presence changes.
 *
 * Key Capabilities:
 * - Subscribes to conversation-specific channels
 * - Listens for message and conversation events
 * - Manages user presence and online status
 * - Handles channel authorization for private messaging
 *
 * Usage Patterns:
 * - Conversation components subscribe to message channels
 * - User lists track presence via presence channels
 * - Real-time updates trigger UI state changes
 * - Automatic cleanup prevents memory leaks
 *
 * This client instance is essential for our messaging app because it provides
 * the real-time user experience that makes instant messaging feel seamless
 * and responsive across all connected devices.
 */
export const pusherClient = new PusherClient(
  /**
   * Pusher Application Key
   *
   * Public key used for client authentication. Must match the server-side
   * key to ensure proper communication between client and server instances.
   *
   * Environment Variable: NEXT_PUBLIC_PUSHER_APP_KEY
   * - Same key used by pusherServer
   * - Safe to expose in client-side code
   * - Required for channel subscription
   */
  process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
  {
    /**
     * Pusher Cluster Region
     *
     * Must match the server-side cluster configuration to ensure proper
     * message routing and optimal performance for our messaging application.
     */
    cluster: 'mt1',

    /**
     * Channel Authorization Configuration
     *
     * Configures how the client authenticates with private channels. This is
     * essential for our messaging app because it ensures that users can only
     * access conversations they're authorized to participate in.
     *
     * Authorization Flow:
     * 1. Client attempts to subscribe to a private channel
     * 2. Pusher requests authorization from our endpoint
     * 3. Our server validates the user's session
     * 4. Server returns authorization token if valid
     * 5. Client completes subscription with token
     *
     * Security Benefits:
     * - Prevents unauthorized access to private conversations
     * - Validates user authentication before channel access
     * - Ensures only conversation participants can receive messages
     * - Protects against channel hijacking and data leaks
     */
    channelAuthorization: {
      /**
       * Authorization Endpoint
       *
       * API route that handles channel authorization requests. This endpoint
       * validates user sessions and returns authorization tokens for private
       * channels, ensuring secure access to conversation data.
       *
       * Endpoint: /api/pusher/auth
       * - Validates NextAuth.js session
       * - Checks user permissions for the channel
       * - Returns Pusher authorization token
       * - Handles both conversation and presence channels
       */
      endpoint: '/api/pusher/auth',

      /**
       * Transport Method
       *
       * Specifies how authorization requests are sent. "ajax" uses standard
       * HTTP requests, which is compatible with our Next.js API routes and
       * provides reliable authorization handling for our messaging application.
       *
       * Why "ajax"?
       * - Compatible with Next.js API routes
       * - Reliable error handling and retry logic
       * - Works with our authentication system
       * - Provides clear success/failure feedback
       */
      transport: 'ajax',
    },
  }
);
