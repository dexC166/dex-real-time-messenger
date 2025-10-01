/**
 * Tailwind CSS Configuration for Dex Real-Time Messenger
 *
 * This configuration file defines how Tailwind CSS processes and generates utility classes
 * for our Next.js 14 real-time messaging application. It's specifically tuned for a modern
 * React app with utility-first styling, responsive design, and enhanced form components.
 *
 * Key Features:
 * - Content scanning for tree-shaking unused styles
 * - Forms plugin for enhanced form styling
 * - Mobile-first responsive design support
 * - Integration with React Hook Form
 *
 * Content Paths:
 * - pages directory: Covers any remaining Pages Router files
 * - app directory: Covers all App Router files (our main structure)
 *
 * The glob patterns ensure we catch React components, utility functions, configuration files,
 * and documentation files. This comprehensive scanning ensures all our Tailwind classes are
 * properly included in the final CSS bundle, preventing missing styles in production.
 *
 * Forms Plugin:
 * - Provides beautiful, accessible form styling that works seamlessly with React Hook Form
 * - Essential for authentication forms, message input forms, settings/profile forms
 * - Uses 'class' strategy for more predictable styling behavior and better React integration
 * - Automatically styles input fields, select dropdowns, checkboxes, radio buttons, and textareas
 *
 * @fileoverview Tailwind CSS configuration for Next.js 14 App Router application
 * @author Dayle Cortes
 * @since 2025
 * @see https://github.com/tailwindlabs/tailwindcss-forms for forms plugin documentation
 */

import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
  ],
};

export default config;
