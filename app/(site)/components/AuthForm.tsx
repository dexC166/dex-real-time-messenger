/**
 * Authentication Form Component for Dex Real-Time Messenger
 *
 * This file provides a comprehensive authentication form component for our Next.js 14
 * real-time messaging application. It implements multi-provider authentication
 * with form validation, OAuth integration, and seamless NextAuth.js integration
 * that ensures secure user access to the messaging platform.
 *
 * Key Features:
 * - Multi-provider authentication (OAuth + credentials)
 * - React Hook Form integration with validation
 * - NextAuth.js integration for secure authentication
 * - OAuth providers (Google, GitHub) with social buttons
 * - Form variant switching (Login/Register)
 * - Automatic redirect for authenticated users
 * - User feedback with toast notifications
 *
 * Authentication Methods Supported:
 * - Google OAuth: One-click authentication with Google accounts
 * - GitHub OAuth: Developer-friendly authentication with GitHub
 * - Credentials: Traditional email/password authentication
 * - Registration: New user account creation with validation
 *
 * This component is essential for our messaging app because it provides the
 * complete authentication form functionality that enables secure user access
 * to real-time messaging features while maintaining user experience and security
 * throughout our messaging platform.
 *
 * @fileoverview Authentication form component for Next.js 14 real-time messaging application
 * @author Dayle Cortes
 * @since 2025
 */

'use client';

import { useCallback, useEffect, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { BsGithub, BsGoogle } from 'react-icons/bs';
import axios from 'axios';

import Input from '@/app/components/inputs/Input';
import Button from '@/app/components/Button';
import AuthSocialButton from './AuthSocialButton';
import { toast } from 'react-hot-toast';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

/**
 * Authentication Form Variant Type
 *
 * Defines the available authentication form variants for our messaging application.
 * This type ensures type safety and clear documentation for the different
 * authentication modes supported by the AuthForm component.
 *
 * @typedef {'LOGIN' | 'REGISTER'} Variant
 * @property {'LOGIN'} LOGIN - Login form variant for existing users
 * @property {'REGISTER'} REGISTER - Registration form variant for new users
 */
type Variant = 'LOGIN' | 'REGISTER';

/**
 * Authentication Form Component
 *
 * A comprehensive authentication form that provides multi-provider authentication
 * for our messaging application. This component implements form validation,
 * OAuth integration, and seamless NextAuth.js integration that ensures secure
 * user access to the messaging platform.
 *
 * Key Capabilities:
 * - Multi-provider authentication (OAuth + credentials)
 * - React Hook Form integration with validation
 * - NextAuth.js integration for secure authentication
 * - OAuth providers (Google, GitHub) with social buttons
 * - Form variant switching (Login/Register)
 * - Automatic redirect for authenticated users
 * - User feedback with toast notifications
 *
 * Authentication Methods Supported:
 * - Google OAuth: One-click authentication with Google accounts
 * - GitHub OAuth: Developer-friendly authentication with GitHub
 * - Credentials: Traditional email/password authentication
 * - Registration: New user account creation with validation
 *
 * Usage Patterns:
 * - Authentication page: Main authentication form for unauthenticated users
 * - OAuth integration: Google and GitHub authentication flows
 * - Credential authentication: Email/password login and registration
 * - Form validation: React Hook Form with error handling
 * - User feedback: Toast notifications for success/error states
 *
 * Authentication Features:
 * - Multi-provider support: Google, GitHub, and credentials
 * - Form validation: React Hook Form with error handling
 * - OAuth integration: Social authentication buttons
 * - Variant switching: Login/Register form modes
 * - Security: NextAuth.js integration for secure authentication
 *
 * Form Features:
 * - React Hook Form: Comprehensive form state management
 * - Input validation: Email, password, and name validation
 * - Error handling: Form validation errors and API errors
 * - Loading states: Disabled form during authentication
 * - User feedback: Toast notifications for success/error states
 *
 * This component is crucial for our messaging app because it provides the
 * complete authentication form functionality that enables secure user access
 * to real-time messaging features while maintaining user experience and security
 * throughout our messaging platform.
 *
 * @returns {JSX.Element} Authentication form with login/register and OAuth options
 *
 * @example
 * ```tsx
 * // In app/(site)/page.tsx
 * <AuthForm />
 *
 * // Form automatically handles:
 * // - Login/Register variant switching
 * // - OAuth authentication (Google, GitHub)
 * // - Credential authentication
 * // - Form validation and error handling
 * // - User feedback and redirects
 * ```
 */
const AuthForm = () => {
  /**
   * NextAuth.js Session Integration
   *
   * Integrates with NextAuth.js to access current user session data
   * and authentication status. This provides the foundation for
   * authentication state management and automatic redirects.
   *
   * What this provides:
   * - Session data: Current user authentication information
   * - Authentication status: 'authenticated', 'unauthenticated', 'loading'
   * - User data: User profile information when authenticated
   * - Session updates: Real-time session state changes
   * - Authentication context: Foundation for auth state management
   *
   * Why this pattern?
   * - Session management: Centralized authentication state
   * - Real-time updates: Automatic session state synchronization
   * - User data access: Current user information for redirects
   * - Authentication status: Foundation for conditional rendering
   * - Integration: Seamless connection with NextAuth.js
   *
   * This session integration is essential for our messaging app because
   * it provides the authentication state that enables automatic redirects
   * and user session management throughout the authentication flow.
   */
  const session = useSession();

  /**
   * Next.js Router Integration
   *
   * Integrates with Next.js router for programmatic navigation after
   * successful authentication. This enables automatic redirects to
   * the main application after login/registration.
   *
   * What this provides:
   * - Programmatic navigation: router.push() for redirects
   * - Route management: Navigation to /users after authentication
   * - Client-side routing: Seamless navigation without page refresh
   * - URL management: Proper URL updates for authentication flow
   * - Navigation context: Foundation for post-auth redirects
   *
   * Why this pattern?
   * - User experience: Automatic redirect after successful authentication
   * - Navigation: Seamless transition to main application
   * - Client-side routing: No page refresh for better UX
   * - URL management: Proper URL updates and history
   * - Integration: Seamless connection with Next.js routing
   *
   * This router integration is essential for our messaging app because
   * it provides the navigation functionality that enables seamless
   * user experience after successful authentication.
   */
  const router = useRouter();

  /**
   * Authentication Form Variant State
   *
   * Manages the current authentication form variant (LOGIN or REGISTER)
   * to provide different form experiences for existing and new users.
   * This state enables dynamic form rendering and user experience.
   *
   * What this manages:
   * - Form variant: Current authentication mode (LOGIN/REGISTER)
   * - Form rendering: Dynamic form fields based on variant
   * - User experience: Different flows for login vs registration
   * - State updates: Variant switching via toggleVariant function
   * - Form behavior: Different submission logic per variant
   *
   * Why this pattern?
   * - User experience: Different flows for login vs registration
   * - Form rendering: Dynamic fields based on authentication mode
   * - State management: Centralized variant state control
   * - Toggle functionality: Easy switching between modes
   * - Form behavior: Different submission logic per variant
   *
   * This variant state is essential for our messaging app because
   * it provides the form flexibility that enables both login and
   * registration experiences in a single component.
   */
  const [variant, setVariant] = useState<Variant>('LOGIN');

  /**
   * Form Loading State Management
   *
   * Manages the loading state during authentication operations to provide
   * user feedback and prevent duplicate submissions. This state ensures
   * optimal user experience during authentication processes.
   *
   * What this manages:
   * - Loading state: Boolean flag for authentication operations
   * - Form disabling: Prevents duplicate submissions during processing
   * - User feedback: Visual indication of ongoing operations
   * - Button states: Disabled state for submit and social buttons
   * - Input states: Disabled state for form inputs during loading
   *
   * Why this pattern?
   * - User feedback: Clear indication of ongoing operations
   * - Form protection: Prevents duplicate submissions
   * - Button states: Disabled state for better UX
   * - Input states: Disabled form inputs during processing
   * - State management: Centralized loading state control
   *
   * This loading state is essential for our messaging app because
   * it provides the user feedback that ensures smooth authentication
   * experience and prevents form submission issues.
   */
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Automatic Redirect for Authenticated Users
   *
   * Monitors session status and automatically redirects authenticated users
   * to the main application. This prevents authenticated users from
   * seeing the authentication form and ensures proper navigation flow.
   *
   * What this does:
   * - Session monitoring: Watches for authentication status changes
   * - Automatic redirect: Redirects to /users when authenticated
   * - User experience: Prevents authenticated users from seeing auth form
   * - Navigation flow: Ensures proper post-authentication routing
   * - State synchronization: Real-time session status updates
   *
   * Why this pattern?
   * - User experience: Prevents authenticated users from seeing auth form
   * - Navigation flow: Ensures proper post-authentication routing
   * - State synchronization: Real-time session status updates
   * - Automatic handling: No manual intervention required
   * - Integration: Seamless connection with NextAuth.js session
   *
   * This automatic redirect is essential for our messaging app because
   * it provides the navigation flow that ensures authenticated users
   * are properly directed to the main application.
   */
  useEffect(() => {
    if (session?.status === 'authenticated') {
      router.push('/users');
    }
  }, [session?.status, router]);

  /**
   * Form Variant Toggle Function
   *
   * Toggles between LOGIN and REGISTER form variants to provide
   * different authentication experiences for existing and new users.
   * This function enables seamless switching between authentication modes.
   *
   * What this does:
   * - Variant switching: Toggles between LOGIN and REGISTER modes
   * - State updates: Updates variant state with new value
   * - Form rendering: Triggers re-render with new form fields
   * - User experience: Seamless switching between authentication modes
   * - Performance: useCallback for optimized re-render prevention
   *
   * Why this pattern?
   * - User experience: Seamless switching between authentication modes
   * - State management: Centralized variant state control
   * - Performance: useCallback prevents unnecessary re-renders
   * - Form flexibility: Single component handles both login and registration
   * - Toggle functionality: Easy switching between modes
   *
   * This toggle function is essential for our messaging app because
   * it provides the form flexibility that enables both login and
   * registration experiences in a single, cohesive component.
   */
  const toggleVariant = useCallback(() => {
    setVariant(variant === 'LOGIN' ? 'REGISTER' : 'LOGIN');
  }, [variant]);

  /**
   * React Hook Form Configuration
   *
   * Configures React Hook Form for authentication form management with
   * validation, error handling, and form state management. This provides
   * the core form functionality for user authentication.
   *
   * What this provides:
   * - Form registration: register function for form field registration
   * - Form submission: handleSubmit for form submission handling
   * - Error handling: errors object for validation error display
   * - Default values: Empty form fields as starting values
   * - Form state: Comprehensive form state management
   *
   * Why this pattern?
   * - Form validation: Built-in validation with error handling
   * - State management: Comprehensive form state management
   * - User experience: Real-time validation and feedback
   * - Performance: Efficient form state updates
   * - Integration: Seamless integration with form components
   *
   * This form configuration is essential for our messaging app because
   * it provides the form management functionality that enables
   * smooth authentication with validation and error handling.
   */
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  /**
   * Form Submission Handler
   *
   * Handles form submission for both login and registration authentication
   * with API integration, loading states, and user feedback. This provides
   * the complete authentication functionality with error handling.
   *
   * What this handles:
   * - Form submission: handleSubmit for form data processing
   * - Variant handling: Different logic for LOGIN vs REGISTER
   * - API integration: axios calls to /api/register and NextAuth.js
   * - Loading states: setIsLoading for form submission feedback
   * - User feedback: Toast notifications for success/error states
   * - Navigation: Automatic redirect after successful authentication
   *
   * Why this pattern?
   * - Variant handling: Different logic for login vs registration
   * - API integration: Seamless integration with backend APIs
   * - User feedback: Clear feedback for success/error states
   * - Loading states: Disabled form during API operations
   * - Navigation: Automatic redirect after successful authentication
   * - Error handling: Comprehensive error handling with user feedback
   *
   * This submission handler is essential for our messaging app because
   * it provides the complete authentication functionality that enables
   * secure user access to real-time messaging features.
   */
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    if (variant === 'REGISTER') {
      axios
        .post('/api/register', data)
        .then(() => signIn('credentials', data))
        .catch(() => toast.error('Something went wrong!'))
        .finally(() => setIsLoading(false));
    }

    if (variant === 'LOGIN') {
      // NextAuth SignIn
      signIn('credentials', {
        ...data,
        redirect: false,
      })
        .then((callback) => {
          if (callback?.error) {
            toast.error('Invalid Credentials');
          }

          if (callback?.ok && !callback?.error) {
            toast.success('Logged in!');
            router.push('/users');
          }
        })
        .finally(() => setIsLoading(false));
    }
  };

  /**
   * OAuth Social Authentication Handler
   *
   * Handles OAuth social authentication (Google, GitHub) with NextAuth.js
   * integration, loading states, and user feedback. This provides the
   * social authentication functionality for our messaging application.
   *
   * What this handles:
   * - Social authentication: OAuth provider authentication
   * - NextAuth.js integration: signIn with OAuth providers
   * - Loading states: setIsLoading for authentication feedback
   * - User feedback: Toast notifications for success/error states
   * - Error handling: Comprehensive error handling for OAuth flows
   * - Provider support: Google and GitHub OAuth providers
   *
   * Why this pattern?
   * - Social authentication: OAuth provider integration
   * - NextAuth.js integration: Seamless OAuth flow handling
   * - User feedback: Clear feedback for success/error states
   * - Loading states: Disabled buttons during authentication
   * - Error handling: Comprehensive error handling for OAuth flows
   * - Provider support: Multiple OAuth providers (Google, GitHub)
   *
   * This social action handler is essential for our messaging app because
   * it provides the OAuth authentication functionality that enables
   * one-click authentication with popular social providers.
   */
  const socialAction = (action: string) => {
    setIsLoading(true);

    // NextAuth Social Sign In
    signIn(action, { redirect: false })
      .then((callback) => {
        if (callback?.error) {
          toast.error('Invalid Credentials');
        }

        if (callback?.ok && !callback?.error) {
          toast.success('Logged in!');
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div
        className="
          bg-white
          px-4
          py-8
          shadow
          sm:rounded-lg
          sm:px-10  
        "
      >
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {variant === 'REGISTER' && (
            <Input
              id="name"
              label="Name"
              register={register}
              errors={errors}
              disabled={isLoading}
            />
          )}
          <Input
            id="email"
            label="Email Address"
            type="email"
            register={register}
            errors={errors}
            disabled={isLoading}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            register={register}
            errors={errors}
            disabled={isLoading}
          />
          <div>
            <Button disabled={isLoading} fullWidth type="submit">
              {variant === 'LOGIN' ? 'Sign in' : 'Register'}
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div
              className="
                absolute
                inset-0
                flex
                items-center
              "
            >
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <AuthSocialButton
              icon={BsGithub}
              onClick={() => socialAction('github')}
            />
            <AuthSocialButton
              icon={BsGoogle}
              onClick={() => socialAction('google')}
            />
          </div>
        </div>

        <div
          className="
          flex
          gap-2
          justify-center
          text-sm
          mt-6
          px-2
          text-gray-500
        "
        >
          <div>
            {variant === 'LOGIN'
              ? 'New to Dex Messenger?'
              : 'Already have an account?'}
          </div>
          <div onClick={toggleVariant} className="underline cursor-pointer">
            {variant === 'LOGIN' ? 'Create an account' : 'Login'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
