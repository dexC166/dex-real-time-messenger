/**
 * PostCSS Configuration for Dex Real-Time Messenger
 *
 * This configuration file defines how PostCSS processes CSS in our Next.js 14 real-time
 * messaging application. PostCSS acts as the CSS processing pipeline, transforming our
 * Tailwind CSS utilities and adding vendor prefixes for maximum browser compatibility.
 *
 * Key Features:
 * - Tailwind CSS processing for utility-first styling
 * - Autoprefixer for cross-browser compatibility
 * - Integration with Next.js build system
 * - Optimized CSS output for production
 *
 * Processing Pipeline:
 * 1. Tailwind CSS: Generates utility classes from our configuration
 * 2. Autoprefixer: Adds vendor prefixes for better browser support
 * 3. Next.js: Bundles and optimizes the final CSS
 *
 * This configuration is essential for our messaging app because it ensures our responsive
 * design works consistently across all browsers and devices, from mobile phones to desktop
 * computers, providing a seamless user experience for real-time messaging.
 *
 * @fileoverview PostCSS configuration for Next.js 14 App Router application
 * @author Dayle Cortes
 * @since 2025
 */

/**
 * PostCSS Configuration Object
 *
 * Defines the plugins and their order for CSS processing. The order matters because
 * each plugin transforms the CSS in sequence, building upon the previous transformations.
 */
module.exports = {
  /**
   * PostCSS Plugins Configuration
   *
   * Defines which PostCSS plugins to use and their configuration options.
   * Each plugin serves a specific purpose in our CSS processing pipeline.
   */
  plugins: {
    /**
     * Tailwind CSS Plugin
     *
     * Processes our Tailwind CSS configuration and generates utility classes.
     * This plugin is essential for our messaging app because it:
     *
     * - Generates responsive utility classes for mobile-first design
     * - Creates form styling utilities for our authentication and message forms
     * - Provides consistent spacing, colors, and typography across components
     * - Enables rapid UI development with utility-first approach
     *
     * The empty object {} means we're using Tailwind's default configuration,
     * which reads from our tailwind.config.ts file. This ensures consistency
     * between our Tailwind config and PostCSS processing.
     *
     * Why this matters for our app:
     * - Ensures all Tailwind classes are properly generated
     * - Maintains consistency with our design system
     * - Enables tree-shaking of unused CSS in production
     * - Provides the foundation for our responsive messaging interface
     */
    tailwindcss: {},

    /**
     * Autoprefixer Plugin
     *
     * Automatically adds vendor prefixes to CSS properties for better browser
     * compatibility. This is crucial for our real-time messaging app because:
     *
     * - Ensures our CSS works across all browsers (Chrome, Firefox, Safari, Edge)
     * - Handles CSS Grid, Flexbox, and other modern CSS features
     * - Provides fallbacks for older browser versions
     * - Maintains consistent styling across different devices and platforms
     *
     * The empty object {} means we're using Autoprefixer's default configuration,
     * which automatically detects which prefixes are needed based on browser
     * support data and our target browsers.
     *
     * Why this matters for our app:
     * - Ensures our responsive design works on all devices
     * - Provides consistent styling across different browsers
     * - Handles CSS features like Grid and Flexbox automatically
     * - Maintains professional appearance across all platforms
     *
     * @see {@link https://github.com/postcss/autoprefixer} for Autoprefixer documentation
     */
    autoprefixer: {},
  },
};
