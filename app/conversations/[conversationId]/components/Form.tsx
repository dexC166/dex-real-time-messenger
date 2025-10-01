/**
 * Message Form Component for Dex Real-Time Messenger
 *
 * This file provides the message form component for our Next.js 14 real-time
 * messaging application. It implements message composition with text input,
 * image upload, form validation, and API integration that ensures optimal
 * user experience for message creation and sending.
 *
 * Key Features:
 * - Message composition with React Hook Form integration
 * - Image upload functionality with Cloudinary integration
 * - Text message input with auto-resizing textarea
 * - Form validation and error handling
 * - API integration for message sending
 * - Responsive layout with mobile and desktop optimization
 *
 * Message Composition Features:
 * - Text message input with MessageInput component
 * - Image upload with Cloudinary CldUploadButton
 * - Form submission with validation
 * - Message sending via API integration
 * - Form reset and textarea height management
 * - Responsive design with proper spacing
 *
 * This component is essential for our messaging app because it provides the
 * message composition interface that enables users to create, edit, and send
 * both text and image messages while maintaining proper form validation
 * and user experience throughout our real-time messaging platform.
 *
 * @fileoverview Message form component for Next.js 14 real-time messaging application
 * @author Dayle Cortes
 * @since 2025
 */

'use client';

import useConversation from '@/app/hooks/useConversation';
import axios from 'axios';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { HiPaperAirplane, HiPhoto } from 'react-icons/hi2';
import MessageInput, { MessageInputRef } from './MessageInput';
import { CldUploadButton } from 'next-cloudinary';
import { useRef } from 'react';

/**
 * Message Form Component
 *
 * A comprehensive message form component that provides message composition
 * with text input, image upload, form validation, and API integration for our
 * messaging application. This component implements message creation features
 * with React Hook Form integration and Cloudinary image upload that ensures
 * optimal user experience for message composition and sending.
 *
 * Key Capabilities:
 * - Message composition with React Hook Form integration
 * - Image upload functionality with Cloudinary integration
 * - Text message input with auto-resizing textarea
 * - Form validation and error handling
 * - API integration for message sending
 * - Responsive layout with mobile and desktop optimization
 *
 * Message Composition Features:
 * - Text message input with MessageInput component
 * - Image upload with Cloudinary CldUploadButton
 * - Form submission with validation
 * - Message sending via API integration
 * - Form reset and textarea height management
 * - Responsive design with proper spacing
 *
 * Usage Patterns:
 * - Individual conversation pages: Main message composition interface
 * - Message creation: Text and image message composition
 * - Form validation: Required field validation and error display
 * - Image upload: Cloudinary integration for image messages
 * - API integration: Message sending via /api/messages endpoint
 *
 * Layout Features:
 * - Form container: White background with border-top for visual separation
 * - Image upload button: Cloudinary CldUploadButton with photo icon
 * - Message input: MessageInput component with auto-resizing textarea
 * - Send button: Paper airplane icon with hover effects
 * - Responsive spacing: Mobile and desktop optimized gaps
 *
 * Form Integration Features:
 * - React Hook Form: Complete form state management
 * - Validation: Required field validation and error handling
 * - Form reset: Automatic form clearing after submission
 * - Textarea management: External height reset via ref
 * - API integration: Message sending with conversation context
 *
 * This component is crucial for our messaging app because it provides the
 * message composition interface that enables users to create, edit, and send
 * both text and image messages while maintaining proper form validation
 * and user experience throughout our real-time messaging platform.
 *
 * @returns {JSX.Element} Message form with text input, image upload, and send button
 *
 * @example
 * ```tsx
 * // In conversation page component
 * <Form />
 *
 * // Integrates with Header and Body components
 * // Provides message composition functionality
 * // Handles both text and image message creation
 * ```
 */
const Form = () => {
  /**
   * Conversation ID Integration
   *
   * Integrates with the useConversation hook to get the current conversation ID
   * for message sending and API calls. This integration provides conversation
   * context for message composition and ensures messages are sent to the
   * correct conversation.
   *
   * What useConversation provides:
   * - Current conversation ID from URL parameters
   * - Conversation state management
   * - URL parameter extraction
   * - Conversation context for message sending
   * - Performance optimization with useMemo
   *
   * Why conversation ID is essential:
   * - Message context: Ensures messages are sent to correct conversation
   * - API integration: Provides conversation ID for message creation
   * - User experience: Maintains conversation context throughout form
   * - Real-time updates: Enables proper message routing
   * - Performance: Efficient conversation-specific message handling
   *
   * This conversation ID integration is essential for our messaging app because
   * it provides the conversation context that enables proper message
   * composition and sending throughout the messaging interface.
   */
  const { conversationId } = useConversation();

  /**
   * Message Input Reference
   *
   * Creates a reference to the MessageInput component for external control
   * over textarea height reset functionality. This reference enables
   * form reset and textarea management after message submission.
   *
   * What this provides:
   * - Reference to MessageInput component
   * - External control over textarea height
   * - Form reset functionality
   * - Textarea management after submission
   * - Component integration for form handling
   *
   * Why useRef for messageInputRef:
   * - External control: Enables parent component control over child
   * - Form reset: Provides textarea height reset after submission
   * - Component integration: Works with MessageInput imperative handle
   * - User experience: Maintains clean form state after submission
   * - Performance: Efficient reference management without re-renders
   *
   * This message input reference is essential for our messaging app because
   * it provides the external control that enables proper form
   * management and user experience throughout the messaging interface.
   */
  const messageInputRef = useRef<MessageInputRef>(null);

  /**
   * React Hook Form Configuration
   *
   * Configures React Hook Form for message composition with validation,
   * form state management, and submission handling. This configuration
   * provides comprehensive form functionality for message creation.
   *
   * What this provides:
   * - Form state management with useForm hook
   * - Field registration for form inputs
   * - Form submission handling with validation
   * - Form value setting and watching
   * - Error state management and display
   *
   * Why React Hook Form is essential:
   * - Form state management: Efficient form state handling
   * - Validation: Built-in validation with error display
   * - Performance: Optimized re-rendering and form handling
   * - User experience: Smooth form interaction and feedback
   * - Integration: Seamless integration with form components
   *
   * Form Configuration Features:
   * - register: Field registration for form inputs
   * - handleSubmit: Form submission with validation
   * - setValue: Programmatic form value setting
   * - errors: Form validation error state
   * - watch: Form value watching for real-time updates
   * - defaultValues: Initial form values for message field
   *
   * This React Hook Form configuration is essential for our messaging app because
   * it provides the form state management that enables proper message
   * composition and validation throughout the messaging interface.
   */
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<FieldValues>({
    defaultValues: {
      message: '',
    },
  });

  /**
   * Message Value Watching
   *
   * Watches the message field value for real-time updates and form
   * state synchronization. This watching enables real-time form
   * state management and component updates.
   *
   * What this provides:
   * - Real-time message field value
   * - Form state synchronization
   * - Component update triggers
   * - Message input integration
   * - Form state awareness
   *
   * Why watch message field:
   * - Real-time updates: Provides live form state updates
   * - Component integration: Enables MessageInput synchronization
   * - User experience: Provides responsive form behavior
   * - Form state: Maintains form state awareness
   * - Performance: Efficient form value watching
   *
   * This message value watching is essential for our messaging app because
   * it provides the form state synchronization that enables proper
   * message composition and real-time updates throughout the messaging interface.
   */
  const watchedMessage = watch('message');

  /**
   * Form Submission Handler
   *
   * Handles form submission for message sending with API integration,
   * form reset, and textarea height management. This handler provides
   * complete message submission functionality with proper cleanup.
   *
   * What this handler does:
   * - Sends message data to /api/messages endpoint
   * - Includes conversation ID for message routing
   * - Resets form after successful submission
   * - Resets textarea height for clean UI
   * - Provides message sending functionality
   *
   * Why form submission is essential:
   * - Message sending: Enables message creation and sending
   * - API integration: Connects form to backend message creation
   * - Form reset: Maintains clean form state after submission
   * - User experience: Provides smooth message sending experience
   * - Real-time updates: Enables message delivery and updates
   *
   * Submission Logic:
   * - API call: POST to /api/messages with message data and conversation ID
   * - Form reset: setValue("message", "") to clear form field
   * - Textarea reset: messageInputRef.current?.resetTextareaHeight() for UI cleanup
   * - Validation: shouldValidate: true for form validation
   * - Error handling: Built-in error handling from React Hook Form
   *
   * This form submission handler is essential for our messaging app because
   * it provides the message sending functionality that enables users to
   * create and send messages throughout the messaging interface.
   */
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    axios.post('/api/messages', {
      ...data,
      conversationId,
    });
    setValue('message', '', { shouldValidate: true });
    messageInputRef.current?.resetTextareaHeight();
  };

  /**
   * Image Upload Handler
   *
   * Handles image upload functionality with Cloudinary integration
   * for image message creation. This handler provides image upload
   * and message creation for image messages.
   *
   * What this handler does:
   * - Processes Cloudinary upload result
   * - Extracts secure URL from upload result
   * - Sends image message to /api/messages endpoint
   * - Includes conversation ID for message routing
   * - Provides image message creation functionality
   *
   * Why image upload is essential:
   * - Image messages: Enables image message creation and sending
   * - Cloudinary integration: Provides image upload and storage
   * - API integration: Connects image upload to message creation
   * - User experience: Provides seamless image sharing
   * - Real-time updates: Enables image message delivery
   *
   * Upload Logic:
   * - Cloudinary result: Processes upload result from CldUploadButton
   * - Secure URL: Extracts result?.info?.secure_url for image URL
   * - API call: POST to /api/messages with image URL and conversation ID
   * - Message creation: Creates image message in conversation
   * - Real-time updates: Enables image message display in conversation
   *
   * This image upload handler is essential for our messaging app because
   * it provides the image message functionality that enables users to
   * share and send images throughout the messaging interface.
   */
  const handleUpload = (result: any) => {
    axios.post('/api/messages', {
      image: result?.info?.secure_url,
      conversationId,
    });
  };

  return (
    <div
      className="
        py-4
        px-4
        bg-white
        border-t
        flex
        items-center
        gap-2
        lg:gap-4
        w-full
      "
    >
      <CldUploadButton
        options={{ maxFiles: 1 }}
        onUpload={handleUpload}
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
      >
        <HiPhoto size={30} className="text-sky-500" />
      </CldUploadButton>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="
          flex
          items-center 
          gap-2 
          lg:gap-4
          w-full
          max-h-32
        "
      >
        <MessageInput
          id="message"
          register={register}
          errors={errors}
          required
          placeholder="Write a message"
          onEnterPress={handleSubmit(onSubmit)}
          watchedMessage={watchedMessage}
          ref={messageInputRef}
        />
        <button
          type="submit"
          className="
            rounded-full
            p-2
            bg-sky-500
            cursor-pointer
            hover:bg-sky-600
            transition
          "
        >
          <HiPaperAirplane size={18} className="text-white" />
        </button>
      </form>
    </div>
  );
};

export default Form;
