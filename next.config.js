/**
 * Next.js Configuration for Dex Real-Time Messenger
 *
 * This configuration file defines how Next.js builds and serves our real-time messaging application.
 * It's crucial for enabling advanced features like image optimization, data serialization, and
 * security policies for external resources.
 *
 * @fileoverview Central configuration hub for Next.js 14 App Router application
 * @author Dayle Cortes
 * @since 2025
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * Experimental Features Configuration
   *
   * Enables cutting-edge Next.js features that aren't yet stable but are safe for production use.
   * Think of this as your "advanced settings" section - we only enable features that provide
   * significant value with minimal risk.
   */
  experimental: {
    /**
     * SWC Plugins for Enhanced Data Serialization
     *
     * The next-superjson-plugin is essential for our real-time messaging app because it allows
     * us to safely serialize complex JavaScript objects (like Date objects, BigInt, RegExp, etc.)
     * that would normally break when sent over the network as JSON.
     *
     * Why this matters for our app:
     * - Prisma returns Date objects from MongoDB that need to be serialized for API responses
     * - Message timestamps, user creation dates, and conversation metadata all contain Date objects
     * - Without superjson, these would become strings and lose their Date methods
     * - This plugin automatically handles the serialization/deserialization at build time
     *
     * @see {@link https://github.com/blitz-js/superjson} for more details on superjson capabilities
     */
    swcPlugins: [['next-superjson-plugin', {}]],
  },

  /**
   * Image Optimization Configuration
   *
   * Next.js Image component provides automatic optimization, lazy loading, and responsive images.
   * However, for security reasons, Next.js requires you to explicitly whitelist external domains
   * that you want to load images from. This prevents malicious sites from using your app as an
   * image proxy.
   *
   * Each remotePattern entry tells Next.js: "It's safe to load images from this domain"
   */
  images: {
    /**
     * External Image Domains Whitelist
     *
     * These domains are where our user avatars and uploaded images come from. Each entry
     * follows the pattern: { protocol, hostname, port, pathname }
     *
     * Security Note: Only add domains you trust completely. Each domain here can potentially
     * be used to load any image into your application.
     */
    remotePatterns: [
      {
        /**
         * Google OAuth Profile Images
         *
         * When users sign in with Google OAuth, their profile pictures are hosted on
         * Google's CDN. This domain pattern allows us to display their avatars in our
         * Avatar components and user lists.
         *
         * Pattern: https://lh3.googleusercontent.com/any/path/here
         */
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        /**
         * GitHub OAuth Profile Images
         *
         * Similar to Google, GitHub users have their profile pictures hosted on GitHub's
         * infrastructure. This enables our Avatar components to display GitHub user avatars
         * when they authenticate via GitHub OAuth.
         *
         * Pattern: https://avatars.githubusercontent.com/any/path/here
         */
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        /**
         * Cloudinary CDN for User-Uploaded Images
         *
         * This is where our app stores user-uploaded images (profile pictures, message attachments).
         * Cloudinary provides automatic image optimization, resizing, and format conversion.
         *
         * Why Cloudinary?
         * - Automatic image optimization (WebP, AVIF conversion)
         * - Responsive image generation
         * - Built-in security and access controls
         * - Global CDN for fast image delivery
         *
         * Pattern: https://res.cloudinary.com/cloud_name/image/upload/any/path/here
         *
         * @see {@link https://cloudinary.com/} for Cloudinary documentation
         */
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

/**
 * Export the configuration object
 *
 * Next.js automatically looks for this file and imports the default export.
 * The configuration is applied during both development and production builds.
 */
module.exports = nextConfig;
