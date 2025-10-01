/**
 * Individual Conversation Page Component for Dex Real-Time Messenger
 *
 * This file provides the individual conversation page component for our Next.js 14 real-time
 * messaging application. It implements conversation display with client-side data fetching,
 * real-time messaging, and comprehensive error handling that ensures optimal user
 * experience for individual conversation viewing and messaging.
 *
 * Key Features:
 * - Client-side conversation and message data fetching
 * - Real-time messaging with Header, Body, and Form components
 * - Comprehensive error handling and loading states
 * - Search functionality with message targeting
 * - Responsive layout with desktop and mobile optimization
 * - Integration with conversation management system
 *
 * Conversation Display Features:
 * - Individual conversation viewing with complete message history
 * - Real-time message updates and synchronization
 * - Message search and targeting functionality
 * - Conversation metadata display (participants, status, etc.)
 * - Message composition and sending interface
 * - Error handling and recovery mechanisms
 *
 * This component is essential for our messaging app because it provides the
 * individual conversation interface that enables users to view, interact with,
 * and manage specific conversations while maintaining real-time synchronization
 * throughout our messaging platform.
 *
 * @fileoverview Individual conversation page component for Next.js 14 real-time messaging application
 * @author Dayle Cortes
 * @since 2025
 */

'use client';

import EmptyState from '@/app/components/EmptyState';
import Header from './components/Header';
import Body from './components/Body';
import Form from './components/Form';
import { useEffect, useState } from 'react';
import { FullMessageType } from '@/app/types';
import { Conversation, User } from '@prisma/client';

/**
 * Conversation Page Parameters Interface
 *
 * Defines the parameters interface for the conversation page component, specifying
 * the required conversation ID from the dynamic route parameters.
 *
 * @interface IParams
 * @property {string} conversationId - The unique identifier for the conversation
 */
interface IParams {
  conversationId: string;
}

/**
 * Individual Conversation Page Component
 *
 * A comprehensive conversation page component that provides individual conversation
 * display with client-side data fetching, real-time messaging, and comprehensive
 * error handling for our messaging application. This component implements conversation
 * viewing, message management, and user interaction that ensures optimal user
 * experience for individual conversation management and real-time messaging.
 *
 * Key Capabilities:
 * - Client-side conversation and message data fetching
 * - Real-time messaging with Header, Body, and Form components
 * - Comprehensive error handling and loading states
 * - Search functionality with message targeting
 * - Responsive layout with desktop and mobile optimization
 * - Integration with conversation management system
 *
 * Conversation Display Features:
 * - Individual conversation viewing with complete message history
 * - Real-time message updates and synchronization
 * - Message search and targeting functionality
 * - Conversation metadata display (participants, status, etc.)
 * - Message composition and sending interface
 * - Error handling and recovery mechanisms
 *
 * Usage Patterns:
 * - Individual conversation viewing: Main interface for specific conversation display
 * - Real-time messaging: Live message updates and synchronization
 * - Message search: Search functionality with message targeting
 * - Conversation management: User interaction with conversation participants
 * - Responsive layout: Mobile and desktop optimized conversation interface
 *
 * Layout Features:
 * - Responsive design: lg:pl-80 for sidebar spacing, h-full for proper layout
 * - Component integration: Header, Body, and Form components for complete interface
 * - Loading states: Spinner and loading messages during data fetching
 * - Error states: Error display with retry functionality
 * - Empty states: EmptyState component for missing conversation data
 *
 * Data Fetching Features:
 * - Client-side fetching: Conversation and message data from API endpoints
 * - Error handling: Comprehensive error handling with user feedback
 * - Loading states: Visual feedback during data fetching operations
 * - State management: React state for conversation, messages, and UI states
 * - Recovery mechanisms: Retry functionality for failed requests
 *
 * This component is crucial for our messaging app because it provides the
 * individual conversation interface that enables users to view, interact with,
 * and manage specific conversations while maintaining real-time synchronization
 * throughout our messaging platform.
 *
 * @param {Object} props - Component props containing route parameters
 * @param {IParams} props.params - Route parameters containing conversationId
 * @returns {JSX.Element} Individual conversation page with Header, Body, and Form components
 *
 * @example
 * ```tsx
 * // Route: /conversations/[conversationId]
 * // Renders individual conversation page with complete messaging interface
 * // Integrates with Header, Body, and Form components
 * // Handles real-time messaging and error states
 * ```
 */
const ConversationId = ({ params }: { params: IParams }) => {
  /**
   * Message State Management
   *
   * Manages the message state for the conversation using React useState hook
   * to provide real-time message updates and synchronization. This state
   * management enables message display, updates, and real-time functionality.
   *
   * What this state provides:
   * - Array of FullMessageType objects for message display
   * - Real-time message updates and synchronization
   * - Message state for Body component integration
   * - Message data for conversation display
   * - State updates for real-time messaging
   *
   * Why useState for messages:
   * - Real-time updates: Enables message updates from Pusher events
   * - Component integration: Provides message data to Body component
   * - State management: Maintains message state throughout component lifecycle
   * - Performance: Efficient re-rendering with state updates
   * - User experience: Real-time message display and updates
   *
   * This message state management is essential for our messaging app because
   * it provides the message data that enables real-time messaging and
   * conversation display throughout the messaging interface.
   */
  const [messages, setMessages] = useState<FullMessageType[]>([]);

  /**
   * Conversation State Management
   *
   * Manages the conversation state for the current conversation using React
   * useState hook to provide conversation metadata and participant information.
   * This state management enables conversation display and user interaction.
   *
   * What this state provides:
   * - Conversation object with users array for participant information
   * - Conversation metadata (name, isGroup, lastMessageAt, etc.)
   * - Participant information for conversation display
   * - Conversation data for Header component integration
   * - State updates for conversation changes
   *
   * Why useState for conversation:
   * - Conversation display: Provides conversation data for Header component
   * - Participant information: Enables user identification and display
   * - State management: Maintains conversation state throughout component lifecycle
   * - Performance: Efficient re-rendering with state updates
   * - User experience: Complete conversation context and metadata
   *
   * This conversation state management is essential for our messaging app because
   * it provides the conversation data that enables conversation display and
   * user interaction throughout the messaging interface.
   */
  const [conversation, setConversation] = useState<
    (Conversation & { users: User[] }) | null
  >(null);

  /**
   * Search Target State Management
   *
   * Manages the search target state for message search functionality using
   * React useState hook to provide message targeting and search features.
   * This state management enables message search and highlighting.
   *
   * What this state provides:
   * - String ID of the currently targeted message for search
   * - Message search and targeting functionality
   * - Search state for Body component integration
   * - Message highlighting and navigation
   * - Search functionality state management
   *
   * Why useState for searchTargetId:
   * - Message search: Enables message targeting and highlighting
   * - Component integration: Provides search state to Body component
   * - State management: Maintains search state throughout component lifecycle
   * - Performance: Efficient re-rendering with state updates
   * - User experience: Message search and navigation functionality
   *
   * This search target state management is essential for our messaging app because
   * it provides the search functionality that enables message targeting and
   * navigation throughout the messaging interface.
   */
  const [searchTargetId, setSearchTargetId] = useState<string>('');

  /**
   * Loading State Management
   *
   * Manages the loading state for data fetching operations using React useState
   * hook to provide visual feedback during API calls and data loading. This
   * state management ensures proper user feedback and prevents UI issues.
   *
   * What this state provides:
   * - Boolean flag indicating if data is currently being fetched
   * - Visual feedback during data fetching operations
   * - Loading state for UI component rendering
   * - User experience feedback for ongoing operations
   * - State management for loading indicators
   *
   * Why useState for isLoading:
   * - User feedback: Provides visual indication of ongoing operations
   * - UI control: Controls loading indicators and component rendering
   * - State management: Maintains loading state throughout component lifecycle
   * - Performance: Efficient re-rendering with state updates
   * - User experience: Clear indication of data fetching status
   *
   * This loading state management is essential for our messaging app because
   * it provides the user feedback that enables clear indication of
   * data fetching progress and prevents UI issues during loading.
   */
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Error State Management
   *
   * Manages the error state for data fetching operations using React useState
   * hook to provide error handling and user feedback. This state management
   * ensures graceful error handling and user experience.
   *
   * What this state provides:
   * - String error message for error display
   * - Error handling and user feedback
   * - Error state for UI component rendering
   * - User experience feedback for error conditions
   * - State management for error recovery
   *
   * Why useState for error:
   * - Error handling: Provides error information for user display
   * - UI control: Controls error indicators and component rendering
   * - State management: Maintains error state throughout component lifecycle
   * - Performance: Efficient re-rendering with state updates
   * - User experience: Clear indication of error conditions and recovery options
   *
   * This error state management is essential for our messaging app because
   * it provides the error handling that enables graceful error recovery
   * and user feedback throughout the messaging interface.
   */
  const [error, setError] = useState<string | null>(null);

  /**
   * Data Fetching Effect
   *
   * Handles client-side data fetching for conversation and message data using
   * useEffect hook with dependency on conversationId. This effect implements
   * comprehensive data fetching with error handling and loading states.
   *
   * What this effect does:
   * - Fetches conversation data from /api/conversations/[conversationId]
   * - Fetches message data from /api/messages/[conversationId]
   * - Handles loading states and error conditions
   * - Updates conversation and message state with fetched data
   * - Provides error handling and recovery mechanisms
   *
   * Data Fetching Process:
   * - Set loading state to true and clear any previous errors
   * - Fetch conversation data with error handling
   * - Fetch message data with error handling
   * - Update state with fetched data on success
   * - Handle errors with user feedback and state reset
   * - Set loading state to false in finally block
   *
   * Why client-side fetching?
   * - Real-time updates: Enables real-time message updates and synchronization
   * - User experience: Provides immediate feedback and error handling
   * - State management: Enables local state management for real-time features
   * - Performance: Efficient data fetching with loading states
   * - Integration: Works with real-time messaging and Pusher integration
   *
   * Error Handling Features:
   * - HTTP status code checking for API responses
   * - Error message extraction and user feedback
   * - Development logging for debugging and monitoring
   * - State reset on error to prevent inconsistent UI
   * - Graceful error recovery with retry functionality
   *
   * This data fetching effect is essential for our messaging app because
   * it provides the conversation and message data that enables real-time
   * messaging and conversation display throughout the messaging interface.
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch conversation data
        const conversationResponse = await fetch(
          `/api/conversations/${params.conversationId}`
        );

        if (!conversationResponse.ok) {
          throw new Error(
            `Failed to fetch conversation: ${conversationResponse.status}`
          );
        }

        const fetchedConversation: Conversation & {
          users: User[];
        } = await conversationResponse.json();

        // Fetch messages data
        const messagesResponse = await fetch(
          `/api/messages/${params.conversationId}`
        );

        if (!messagesResponse.ok) {
          throw new Error(
            `Failed to fetch messages: ${messagesResponse.status}`
          );
        }

        const fetchedMessages: FullMessageType[] =
          await messagesResponse.json();

        setConversation(fetchedConversation);
        setMessages(fetchedMessages);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred';
        setError(errorMessage);

        // Log error for monitoring (replace with your logging service)
        if (process.env.NODE_ENV === 'development') {
          console.error('Conversation fetch error:', error);
        }

        // Reset state on error
        setConversation(null);
        setMessages([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [params.conversationId]);

  /**
   * Loading State Rendering
   *
   * Renders the loading state UI when data is being fetched. This loading
   * state provides visual feedback to users during data fetching operations
   * and ensures a smooth user experience.
   *
   * What this renders:
   * - Responsive layout with sidebar spacing (lg:pl-80)
   * - Centered loading spinner with animation
   * - Loading message for user feedback
   * - Full height layout for proper positioning
   * - Consistent styling with messaging app design
   *
   * Why show loading state?
   * - User feedback: Provides clear indication of ongoing operations
   * - User experience: Prevents confusion during data fetching
   * - Visual feedback: Animated spinner indicates active loading
   * - Consistency: Maintains consistent UI during loading
   * - Performance: Prevents UI issues during data fetching
   *
   * This loading state rendering is essential for our messaging app because
   * it provides the user feedback that enables clear indication of
   * data fetching progress and maintains smooth user experience.
   */
  // Show loading state
  if (isLoading) {
    return (
      <div className="lg:pl-80 h-full">
        <div className="h-full flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-sm text-gray-500">Loading conversation...</p>
        </div>
      </div>
    );
  }

  /**
   * Error State Rendering
   *
   * Renders the error state UI when data fetching fails. This error state
   * provides user feedback for error conditions and recovery options to
   * ensure graceful error handling and user experience.
   *
   * What this renders:
   * - Responsive layout with sidebar spacing (lg:pl-80)
   * - Centered error message with clear error information
   * - Retry button for error recovery
   * - Full height layout for proper positioning
   * - Consistent styling with messaging app design
   *
   * Why show error state?
   * - User feedback: Provides clear indication of error conditions
   * - Error recovery: Enables users to retry failed operations
   * - User experience: Prevents confusion during error conditions
   * - Visual feedback: Clear error messaging and recovery options
   * - Consistency: Maintains consistent UI during error states
   *
   * Error Recovery Features:
   * - Retry button with window.location.reload() for full page refresh
   * - Clear error messaging for user understanding
   * - Consistent styling with messaging app design
   * - Full height layout for proper positioning
   * - Responsive design for mobile and desktop
   *
   * This error state rendering is essential for our messaging app because
   * it provides the error handling that enables graceful error recovery
   * and user feedback throughout the messaging interface.
   */
  // Show error state
  if (error) {
    return (
      <div className="lg:pl-80 h-full">
        <div className="h-full flex flex-col items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900">
              Unable to load conversation
            </h3>
            <p className="mt-1 text-sm text-gray-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Empty State Rendering
   *
   * Renders the empty state UI when no conversation data is available. This
   * empty state provides user guidance and maintains consistent UI when
   * conversation data is missing or unavailable.
   *
   * What this renders:
   * - Responsive layout with sidebar spacing (lg:pl-80)
   * - EmptyState component for user guidance
   * - Full height layout for proper positioning
   * - Consistent styling with messaging app design
   *
   * Why show empty state?
   * - User guidance: Provides clear indication when conversation data is missing
   * - User experience: Prevents confusion when no conversation is available
   * - Visual feedback: Clear messaging about missing data
   * - Consistency: Maintains consistent UI during empty states
   * - Performance: Prevents UI issues when data is unavailable
   *
   * This empty state rendering is essential for our messaging app because
   * it provides the user guidance that enables clear indication of
   * missing conversation data and maintains consistent user experience.
   */
  // Show empty state if no conversation
  if (!conversation) {
    return (
      <div className="lg:pl-80 h-full">
        <div className="h-full flex flex-col">
          <EmptyState />
        </div>
      </div>
    );
  }

  /**
   * Main Conversation Interface Rendering
   *
   * Renders the main conversation interface with Header, Body, and Form components
   * when conversation data is successfully loaded. This interface provides the
   * complete messaging experience with real-time updates and user interaction.
   *
   * What this renders:
   * - Responsive layout with sidebar spacing (lg:pl-80)
   * - Header component with conversation metadata and search functionality
   * - Body component with message display and real-time updates
   * - Form component with message composition and sending
   * - Full height layout for proper positioning
   *
   * Component Integration:
   * - Header: Conversation metadata, participant information, and search functionality
   * - Body: Message display, real-time updates, and message targeting
   * - Form: Message composition, sending, and image upload functionality
   * - State management: Conversation, messages, and search state integration
   * - Real-time features: Pusher integration for live message updates
   *
   * Why this component structure?
   * - User experience: Provides complete messaging interface with all features
   * - Real-time updates: Enables live message updates and synchronization
   * - Component separation: Clear separation of concerns for maintainability
   * - State management: Efficient state management and component integration
   * - Performance: Optimized rendering and real-time functionality
   *
   * This main conversation interface rendering is essential for our messaging app because
   * it provides the complete messaging experience that enables users to view,
   * interact with, and manage conversations while maintaining real-time
   * synchronization throughout our messaging platform.
   */
  return (
    <div className="lg:pl-80 h-full">
      <div className="h-full flex flex-col">
        <Header
          conversation={conversation}
          messages={messages}
          setSearchTargetId={setSearchTargetId}
        />
        <Body
          messages={messages}
          setMessages={setMessages}
          setSearchTargetId={setSearchTargetId}
          searchTargetId={searchTargetId}
        />
        <Form />
      </div>
    </div>
  );
};

export default ConversationId;
