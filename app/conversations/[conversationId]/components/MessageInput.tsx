/**
 * Message Input Component for Dex Real-Time Messenger
 *
 * This file provides a specialized message input component for our Next.js 14 real-time
 * messaging application. It implements auto-resizing textarea functionality, React Hook
 * Form integration, keyboard shortcuts, and message composition features that ensure
 * optimal user experience for message input and composition.
 *
 * Key Features:
 * - Auto-resizing textarea with min/max height constraints
 * - React Hook Form integration for form state management
 * - Enter key submission with Shift+Enter for new lines
 * - Imperative handle for external height reset control
 * - Message content synchronization with form state
 * - Character limit enforcement and validation
 *
 * Message Input Features:
 * - Dynamic textarea resizing based on content
 * - Keyboard shortcuts for message submission
 * - Form integration with React Hook Form
 * - External height reset functionality
 * - Message content state synchronization
 * - Character limit and validation support
 *
 * This component is essential for our messaging app because it provides the
 * message composition interface that enables users to write, edit, and send
 * messages while maintaining proper form integration and user experience
 * throughout our real-time messaging platform.
 *
 * @fileoverview Message input component for Next.js 14 real-time messaging application
 * @author Dayle Cortes
 * @since 2025
 */

'use client';

import {
  ChangeEvent,
  useState,
  KeyboardEvent,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';

/**
 * Message Input Reference Interface
 *
 * Defines the imperative handle interface for the MessageInput component,
 * providing external control over textarea height reset functionality.
 * This interface enables parent components to reset the textarea height
 * after message submission or other operations.
 *
 * @interface MessageInputRef
 * @property {() => void} resetTextareaHeight - Function to reset textarea height to minimum
 */
export interface MessageInputRef {
  resetTextareaHeight: () => void;
}

/**
 * Message Input Props Interface
 *
 * Defines the props interface for the MessageInput component, specifying
 * the required data for message input functionality and form integration.
 *
 * @interface MessageInputProps
 * @property {string} [placeholder] - Optional placeholder text for the textarea
 * @property {string} id - Unique identifier for the textarea field
 * @property {string} [type] - Optional HTML input type (not used for textarea)
 * @property {boolean} [required] - Whether the input field is required for validation
 * @property {UseFormRegister<FieldValues>} register - React Hook Form register function
 * @property {FieldErrors} errors - React Hook Form errors object for validation display
 * @property {() => void} onEnterPress - Function to call when Enter key is pressed
 * @property {string} watchedMessage - Current message value from form state
 */
interface MessageInputProps {
  placeholder?: string;
  id: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  onEnterPress: () => void;
  watchedMessage: string;
}

/**
 * Message Input Component
 *
 * A specialized message input component that provides auto-resizing textarea
 * functionality, React Hook Form integration, and keyboard shortcuts for our
 * messaging application. This component implements message composition features
 * with dynamic height adjustment and form state synchronization that ensures
 * optimal user experience for message input and composition.
 *
 * Key Capabilities:
 * - Auto-resizing textarea with min/max height constraints
 * - React Hook Form integration for form state management
 * - Enter key submission with Shift+Enter for new lines
 * - Imperative handle for external height reset control
 * - Message content synchronization with form state
 * - Character limit enforcement and validation
 *
 * Message Input Features:
 * - Dynamic textarea resizing based on content
 * - Keyboard shortcuts for message submission
 * - Form integration with React Hook Form
 * - External height reset functionality
 * - Message content state synchronization
 * - Character limit and validation support
 *
 * Usage Patterns:
 * - Form component: Main message input for conversation forms
 * - Message composition: Text input for writing and editing messages
 * - Form integration: React Hook Form integration for message state
 * - Keyboard shortcuts: Enter to send, Shift+Enter for new lines
 * - Height management: Auto-resize and external height reset
 *
 * Layout Features:
 * - Auto-resizing textarea: Dynamic height based on content
 * - Height constraints: Minimum and maximum height limits
 * - Form integration: React Hook Form register and validation
 * - Keyboard shortcuts: Enter key handling for message submission
 * - Character limits: Maximum character count enforcement
 *
 * Form Integration Features:
 * - React Hook Form: Seamless form state management
 * - Validation support: Required field validation and error display
 * - State synchronization: Content sync with form state
 * - External control: Imperative handle for height reset
 * - Form submission: Integration with form submission handlers
 *
 * This component is crucial for our messaging app because it provides the
 * message composition interface that enables users to write, edit, and send
 * messages while maintaining proper form integration and user experience
 * throughout our real-time messaging platform.
 *
 * @param {MessageInputProps} props - Component props for message input configuration
 * @param {string} [props.placeholder] - Optional placeholder text for the textarea
 * @param {string} props.id - Unique identifier for the textarea field
 * @param {string} [props.type] - Optional HTML input type (not used for textarea)
 * @param {boolean} [props.required] - Whether the input field is required for validation
 * @param {UseFormRegister<FieldValues>} props.register - React Hook Form register function
 * @param {FieldErrors} props.errors - React Hook Form errors object for validation display
 * @param {() => void} props.onEnterPress - Function to call when Enter key is pressed
 * @param {string} props.watchedMessage - Current message value from form state
 * @returns {JSX.Element} Auto-resizing textarea with form integration and keyboard shortcuts
 *
 * @example
 * ```tsx
 * // In Form component
 * <MessageInput
 *   id="message"
 *   register={register}
 *   errors={errors}
 *   required
 *   placeholder="Write a message"
 *   onEnterPress={handleSubmit(onSubmit)}
 *   watchedMessage={watchedMessage}
 *   ref={messageInputRef}
 * />
 *
 * // With form integration
 * <MessageInput id="message" register={register} errors={errors} onEnterPress={handleSubmit} watchedMessage={message} />
 * ```
 */
const MessageInput = forwardRef<MessageInputRef, MessageInputProps>(
  function MessageInput(props, ref) {
    const {
      placeholder,
      id,
      required,
      register,
      onEnterPress,
      watchedMessage,
    } = props;

    /**
     * Message Content State Management
     *
     * Manages the local message content state using React useState hook
     * to provide controlled input behavior and content synchronization
     * with form state. This state management enables proper textarea
     * control and form integration.
     *
     * What this state provides:
     * - Local message content for controlled input
     * - Content synchronization with form state
     * - Input control for textarea element
     * - State management for message composition
     * - Form integration support
     *
     * Why useState for content:
     * - Controlled input: Provides controlled textarea behavior
     * - Form integration: Syncs with React Hook Form state
     * - User experience: Enables proper input handling
     * - Performance: Efficient re-rendering with state updates
     * - State management: Maintains content state throughout component lifecycle
     *
     * This message content state management is essential for our messaging app because
     * it provides the controlled input behavior that enables proper message
     * composition and form integration throughout the messaging interface.
     */
    const [content, setContent] = useState('');

    /**
     * Textarea Height Constants
     *
     * Defines the height constraints and base font size for the auto-resizing
     * textarea functionality. These constants ensure consistent height behavior
     * and proper textarea resizing across different content lengths.
     *
     * Height Constants:
     * - MIN_HEIGHT_REM: Minimum height in rem units (2.5rem)
     * - MAX_HEIGHT_REM: Maximum height in rem units (8rem)
     * - BASE_FONT_SIZE: Base font size for height calculations (16px)
     *
     * Why these specific values:
     * - MIN_HEIGHT_REM: Provides comfortable single-line height
     * - MAX_HEIGHT_REM: Prevents excessive textarea height
     * - BASE_FONT_SIZE: Standard font size for consistent calculations
     * - User experience: Balanced height constraints for optimal UX
     * - Performance: Efficient height calculations with rem units
     *
     * This height configuration is essential for our messaging app because
     * it provides the height constraints that ensure proper textarea
     * behavior and optimal user experience for message composition.
     */
    const MIN_HEIGHT_REM = 2.5;
    const MAX_HEIGHT_REM = 8;
    const BASE_FONT_SIZE = 16;

    /**
     * Textarea Resize Function
     *
     * Handles dynamic textarea resizing based on content length and scroll height.
     * This function provides smooth auto-resizing behavior that adjusts the textarea
     * height to fit the content while respecting min/max height constraints.
     *
     * What this function does:
     * - Resets textarea height to 0 for accurate measurement
     * - Calculates new height based on scrollHeight and font size
     * - Applies min/max height constraints
     * - Sets the calculated height in rem units
     * - Provides smooth auto-resizing behavior
     *
     * Why auto-resize is essential:
     * - User experience: Provides smooth textarea expansion
     * - Content visibility: Ensures all content is visible
     * - Height management: Prevents excessive textarea height
     * - Performance: Efficient height calculations
     * - Responsiveness: Adapts to different content lengths
     *
     * Resize Logic:
     * - Height reset: Sets height to 0 for accurate scrollHeight measurement
     * - Height calculation: scrollHeight / BASE_FONT_SIZE for rem conversion
     * - Min constraint: Math.max with MIN_HEIGHT_REM for minimum height
     * - Max constraint: Math.min with MAX_HEIGHT_REM for maximum height
     * - Height application: Sets calculated height in rem units
     *
     * This textarea resize function is essential for our messaging app because
     * it provides the auto-resizing functionality that enables smooth
     * message composition and optimal user experience throughout the messaging interface.
     */
    const resizeTextarea = (textareaElement: HTMLTextAreaElement) => {
      textareaElement.style.height = '0';
      const newHeight = Math.min(
        Math.max(textareaElement.scrollHeight / BASE_FONT_SIZE, MIN_HEIGHT_REM),
        MAX_HEIGHT_REM
      );
      textareaElement.style.height = `${newHeight}rem`;
    };

    /**
     * Textarea Height Reset Function
     *
     * Resets the textarea height to the minimum height, typically called after
     * message submission or when clearing the input. This function provides
     * external control over textarea height for form management.
     *
     * What this function does:
     * - Finds the textarea element by ID
     * - Resets height to minimum height (MIN_HEIGHT_REM)
     * - Provides external height control
     * - Enables form reset functionality
     * - Maintains consistent textarea behavior
     *
     * Why height reset is essential:
     * - Form reset: Clears textarea height after submission
     * - User experience: Provides clean input state
     * - Height management: Resets to minimum height
     * - External control: Enables parent component control
     * - Consistency: Maintains predictable textarea behavior
     *
     * Height Reset Logic:
     * - Element lookup: Uses document.getElementById for textarea access
     * - Type assertion: Casts to HTMLTextAreaElement for type safety
     * - Height reset: Sets height to MIN_HEIGHT_REM
     * - Error handling: Checks for element existence
     * - Performance: Efficient DOM manipulation
     *
     * This height reset function is essential for our messaging app because
     * it provides the external height control that enables proper form
     * management and user experience throughout the messaging interface.
     */
    const resetTextareaHeight = () => {
      const textareaElement = document.getElementById(
        id
      ) as HTMLTextAreaElement;

      if (textareaElement) {
        textareaElement.style.height = `${MIN_HEIGHT_REM}rem`;
      }
    };

    /**
     * Keyboard Event Handler
     *
     * Handles keyboard events for the textarea, specifically Enter key
     * submission and Shift+Enter for new lines. This handler provides
     * intuitive keyboard shortcuts for message composition and submission.
     *
     * What this handler does:
     * - Detects Enter key press without Shift modifier
     * - Prevents default Enter behavior (new line)
     * - Calls onEnterPress function for message submission
     * - Clears content and resets textarea height
     * - Provides smooth message submission experience
     *
     * Why keyboard shortcuts are essential:
     * - User experience: Provides intuitive message submission
     * - Efficiency: Enables quick message sending
     * - Accessibility: Supports keyboard navigation
     * - Form integration: Works with form submission
     * - Consistency: Standard messaging app behavior
     *
     * Keyboard Logic:
     * - Enter key: Submits message and clears input
     * - Shift+Enter: Allows new lines in message
     * - Event prevention: Prevents default Enter behavior
     * - Content clearing: Clears local content state
     * - Height reset: Resets textarea to minimum height
     *
     * This keyboard event handler is essential for our messaging app because
     * it provides the keyboard shortcuts that enable efficient message
     * composition and submission throughout the messaging interface.
     */
    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        onEnterPress();
        setContent('');
        resetTextareaHeight();
      }
    };

    /**
     * Input Change Handler
     *
     * Handles input changes for the textarea, updating local content state
     * and triggering textarea resizing. This handler provides real-time
     * content updates and auto-resizing functionality.
     *
     * What this handler does:
     * - Updates local content state with input value
     * - Triggers textarea resizing based on content
     * - Provides real-time content updates
     * - Enables auto-resizing behavior
     * - Maintains controlled input state
     *
     * Why input handling is essential:
     * - Content updates: Provides real-time content state
     * - Auto-resizing: Enables dynamic textarea resizing
     * - User experience: Provides responsive input behavior
     * - Form integration: Works with React Hook Form
     * - Performance: Efficient content state management
     *
     * Input Logic:
     * - Content update: Sets content state with input value
     * - Resize trigger: Calls resizeTextarea with target element
     * - Real-time updates: Provides immediate content feedback
     * - Auto-resizing: Enables smooth height adjustment
     * - State management: Maintains controlled input behavior
     *
     * This input change handler is essential for our messaging app because
     * it provides the content management that enables real-time message
     * composition and auto-resizing functionality throughout the messaging interface.
     */
    const handleInput = (event: ChangeEvent<HTMLTextAreaElement>) => {
      setContent(event.target.value);
      resizeTextarea(event.target);
    };

    /**
     * Form State Synchronization
     *
     * Synchronizes local content state with form state from React Hook Form
     * using useEffect. This synchronization ensures that the textarea content
     * stays in sync with the form state and provides proper form integration.
     *
     * What this effect does:
     * - Watches watchedMessage from form state
     * - Updates local content state when form state changes
     * - Provides form state synchronization
     * - Enables external content updates
     * - Maintains consistent state between form and component
     *
     * Why form synchronization is essential:
     * - Form integration: Keeps component in sync with form state
     * - External updates: Enables content updates from parent components
     * - State consistency: Maintains consistent state across form
     * - User experience: Provides seamless form behavior
     * - Performance: Efficient state synchronization
     *
     * Synchronization Logic:
     * - Form watching: Monitors watchedMessage from form state
     * - State update: Updates local content when form state changes
     * - Dependency management: Only updates when watchedMessage changes
     * - Performance: Efficient state synchronization
     * - Consistency: Maintains state consistency across form
     *
     * This form state synchronization is essential for our messaging app because
     * it provides the form integration that enables proper message
     * composition and form state management throughout the messaging interface.
     */
    useEffect(() => {
      setContent(watchedMessage);
    }, [watchedMessage]);

    /**
     * Imperative Handle Implementation
     *
     * Implements the imperative handle interface to provide external control
     * over the textarea height reset functionality. This handle enables parent
     * components to reset the textarea height after message submission or
     * other operations.
     *
     * What this provides:
     * - External height reset control
     * - Parent component access to resetTextareaHeight
     * - Form integration for height management
     * - External textarea control
     * - Component API for parent components
     *
     * Why imperative handle is essential:
     * - External control: Enables parent component control
     * - Form integration: Provides form reset functionality
     * - Height management: Enables external height control
     * - User experience: Provides clean input state after submission
     * - API design: Provides clean component interface
     *
     * Handle Implementation:
     * - resetTextareaHeight: Exposes height reset function
     * - External access: Enables parent component control
     * - Form integration: Works with form submission
     * - Height management: Provides external height control
     * - API design: Clean component interface
     *
     * This imperative handle implementation is essential for our messaging app because
     * it provides the external control that enables proper form
     * management and user experience throughout the messaging interface.
     */
    useImperativeHandle(ref, () => ({
      resetTextareaHeight,
    }));

    return (
      <div className="flex items-center w-full">
        <textarea
          id={id}
          autoComplete={id}
          {...register(id, { required })}
          placeholder={placeholder}
          value={content}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          className="
          text-black
            font-light
            py-2
            px-4
            bg-neutral-100
            w-full
            h-10
            max-h-32
            rounded-2xl
            focus:outline-none
            overflow-x-hidden
            resize-none
            scroll-smooth
          "
          maxLength={4096}
        />
      </div>
    );
  }
);

MessageInput.displayName = 'MessageInput';

export default MessageInput;
