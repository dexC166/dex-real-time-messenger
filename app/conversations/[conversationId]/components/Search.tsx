/**
 * Message Search Component for Dex Real-Time Messenger
 *
 * This file provides a specialized message search component for our Next.js 14 real-time
 * messaging application. It implements message search functionality with regex-based
 * filtering, smooth animations, and search targeting that ensures optimal user
 * experience for finding and navigating to specific messages within conversations.
 *
 * Key Features:
 * - Message search with regex-based keyword filtering
 * - Smooth search bar animations with opacity and transform transitions
 * - Search targeting with automatic scroll to found messages
 * - Click-outside-to-close functionality for better UX
 * - Auto-focus on search bar open for immediate typing
 * - React Hook Form integration for form state management
 *
 * Search Features:
 * - Multi-keyword search with regex pattern matching
 * - Case-insensitive search for better user experience
 * - Search targeting with smooth scroll to first match
 * - Form validation and state management
 * - Search bar visibility control with animations
 * - Search icon positioning with smooth transitions
 *
 * This component is essential for our messaging app because it provides the
 * message search functionality that enables users to find and navigate
 * to specific messages while maintaining smooth animations and user
 * experience throughout our real-time messaging platform.
 *
 * @fileoverview Message search component for Next.js 14 real-time messaging application
 * @author Dayle Cortes
 * @since 2025
 */

'use client';

import { FullMessageType } from '@/app/types';
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { IoSearch } from 'react-icons/io5';

/**
 * Search Component Props Interface
 *
 * Defines the props interface for the Search component, specifying
 * the required data for message search functionality.
 *
 * @interface SearchProps
 * @property {boolean} searchBarOpen - Whether the search bar is currently open and visible
 * @property {() => void} onClick - Callback function to open the search bar
 * @property {() => void} onClose - Callback function to close the search bar
 * @property {FullMessageType[]} messages - Array of messages to search through
 * @property {Dispatch<SetStateAction<string>>} setSearchTargetId - Function to set the target message ID for search targeting
 */
interface SearchProps {
  searchBarOpen: boolean;
  onClick: () => void;
  onClose: () => void;
  messages: FullMessageType[];
  setSearchTargetId: Dispatch<SetStateAction<string>>;
}

/**
 * Message Search Component
 *
 * A specialized message search component that provides message search functionality
 * with regex-based filtering, smooth animations, and search targeting for our
 * messaging application. This component implements search features with form
 * integration and user interaction that ensures optimal user experience for
 * finding and navigating to specific messages within conversations.
 *
 * Key Capabilities:
 * - Message search with regex-based keyword filtering
 * - Smooth search bar animations with opacity and transform transitions
 * - Search targeting with automatic scroll to found messages
 * - Click-outside-to-close functionality for better UX
 * - Auto-focus on search bar open for immediate typing
 * - React Hook Form integration for form state management
 *
 * Search Features:
 * - Multi-keyword search with regex pattern matching
 * - Case-insensitive search for better user experience
 * - Search targeting with smooth scroll to first match
 * - Form validation and state management
 * - Search bar visibility control with animations
 * - Search icon positioning with smooth transitions
 *
 * Usage Patterns:
 * - Header component: Search functionality in conversation header
 * - Message search: Finding specific messages within conversations
 * - Search targeting: Navigation to found messages with smooth scrolling
 * - Search bar interaction: Open/close with smooth animations
 * - Form integration: Search query input with React Hook Form
 *
 * Layout Features:
 * - Search form: Flex layout with proper spacing and alignment
 * - Search input: Styled input with placeholder and focus states
 * - Search icon: Positioned icon with hover effects and click handling
 * - Animations: Smooth opacity and transform transitions
 * - Responsive design: Mobile and desktop optimized layout
 *
 * Animation Features:
 * - Search bar fade: Opacity transition for search bar visibility
 * - Icon positioning: Transform transition for search icon movement
 * - Duration control: 1200ms for search bar, 500ms for icon
 * - Smooth transitions: Ease-in-out timing for natural feel
 * - Hardware acceleration: Transform-based animations for performance
 *
 * This component is crucial for our messaging app because it provides the
 * message search functionality that enables users to find and navigate
 * to specific messages while maintaining smooth animations and user
 * experience throughout our real-time messaging platform.
 *
 * @param {SearchProps} props - Component props for search configuration
 * @param {boolean} props.searchBarOpen - Whether the search bar is currently open and visible
 * @param {() => void} props.onClick - Callback function to open the search bar
 * @param {() => void} props.onClose - Callback function to close the search bar
 * @param {FullMessageType[]} props.messages - Array of messages to search through
 * @param {Dispatch<SetStateAction<string>>} props.setSearchTargetId - Function to set the target message ID for search targeting
 * @returns {JSX.Element} Search component with search input and icon
 *
 * @example
 * ```tsx
 * // In Header component
 * <Search
 *   searchBarOpen={searchBarOpen}
 *   onClick={() => setSearchBarOpen(true)}
 *   onClose={() => setSearchBarOpen(false)}
 *   messages={messages}
 *   setSearchTargetId={setSearchTargetId}
 * />
 *
 * // With search state management
 * <Search searchBarOpen={isOpen} onClick={handleOpen} onClose={handleClose} messages={messageData} setSearchTargetId={handleTarget} />
 * ```
 */
const Search: React.FC<SearchProps> = ({
  searchBarOpen,
  onClick,
  onClose,
  messages,
  setSearchTargetId,
}) => {
  /**
   * Search Input Reference
   *
   * Creates a reference to the search input element for focus management
   * and click-outside detection. This reference enables proper user
   * interaction and accessibility features.
   *
   * What this provides:
   * - Reference to search input element
   * - Focus management for auto-focus functionality
   * - Click-outside detection for search bar closing
   * - DOM access for input manipulation
   * - User interaction enhancement
   *
   * Why useRef for inputRef:
   * - Focus control: Enables programmatic focus on search bar open
   * - Click detection: Provides element reference for click-outside detection
   * - DOM access: Direct access to input element for manipulation
   * - Performance: Efficient DOM access without re-renders
   * - User experience: Enables smooth search interaction
   *
   * This search input reference is essential for our messaging app because
   * it provides the DOM access that enables proper focus management
   * and user interaction throughout the search functionality.
   */
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * React Hook Form Configuration
   *
   * Configures React Hook Form for search query management with validation,
   * form state management, and submission handling. This configuration
   * provides comprehensive form functionality for search input.
   *
   * What this provides:
   * - Form state management with useForm hook
   * - Field registration for search input
   * - Form submission handling with validation
   * - Form value setting and clearing
   * - Error state management and display
   *
   * Why React Hook Form is essential:
   * - Form state management: Efficient search query state handling
   * - Validation: Built-in validation with error display
   * - Performance: Optimized re-rendering and form handling
   * - User experience: Smooth search input interaction
   * - Integration: Seamless integration with form components
   *
   * Form Configuration Features:
   * - register: Field registration for search input
   * - handleSubmit: Form submission with validation
   * - setValue: Programmatic form value setting and clearing
   * - errors: Form validation error state
   * - defaultValues: Initial form values for search query
   *
   * This React Hook Form configuration is essential for our messaging app because
   * it provides the form state management that enables proper search
   * query handling and user interaction throughout the search functionality.
   */
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      searchQuery: '',
    },
  });

  /**
   * Search Submission Handler
   *
   * Handles search form submission with regex-based message filtering,
   * search targeting, and form cleanup. This handler provides
   * complete search functionality with proper message targeting.
   *
   * What this handler does:
   * - Clears search query after submission
   * - Splits search query into keywords
   * - Creates regex pattern for multi-keyword search
   * - Filters messages using case-insensitive regex matching
   * - Sets search target to first matching message
   * - Provides search targeting functionality
   *
   * Why async for onSubmit:
   * - Form handling: Proper form submission handling
   * - Search processing: Efficient search query processing
   * - User experience: Smooth search interaction
   * - Performance: Non-blocking search operations
   * - Integration: Works with React Hook Form submission
   *
   * Search Logic:
   * - Query splitting: Splits search query into individual keywords
   * - Regex creation: Creates case-insensitive regex pattern with OR logic
   * - Message filtering: Filters messages that contain any of the keywords
   * - Target setting: Sets first matching message as search target
   * - Form cleanup: Clears search query after successful search
   *
   * This search submission handler is essential for our messaging app because
   * it provides the search functionality that enables users to find
   * and navigate to specific messages throughout the conversation.
   */
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setValue('searchQuery', '', { shouldValidate: true });

    if (data.searchQuery) {
      const keywords = data.searchQuery.split(' ');
      const regexPattern = keywords.join('|');
      const regex = new RegExp(regexPattern, 'i');

      let filteredMessages = messages.filter(
        (message) => message.body && regex.test(message.body)
      );

      if (filteredMessages.length != 0) {
        setSearchTargetId(filteredMessages[0].id);
      }
    }
  };

  /**
   * Auto-Focus on Search Bar Open
   *
   * Automatically focuses the search input when the search bar opens
   * to provide immediate typing capability. This effect ensures
   * optimal user experience for search interaction.
   *
   * What this effect does:
   * - Checks if search bar is open and input reference exists
   * - Focuses the search input element
   * - Provides immediate typing capability
   * - Enhances user experience for search interaction
   * - Ensures proper focus management
   *
   * Why auto-focus is essential:
   * - User experience: Enables immediate typing without additional clicks
   * - Accessibility: Provides proper focus management for keyboard users
   * - Efficiency: Reduces interaction steps for search functionality
   * - Performance: Efficient focus management with useRef
   * - Integration: Works seamlessly with search bar animations
   *
   * Auto-Focus Logic:
   * - State check: Verifies searchBarOpen is true
   * - Reference check: Ensures inputRef.current exists
   * - Focus application: Calls focus() on input element
   * - Dependency management: Only runs when searchBarOpen changes
   * - Performance: Efficient focus management without unnecessary calls
   *
   * This auto-focus functionality is essential for our messaging app because
   * it provides the user experience that enables immediate search
   * interaction and proper accessibility throughout the search functionality.
   */
  useEffect(() => {
    if (searchBarOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchBarOpen]);

  /**
   * Click-Outside-to-Close Functionality
   *
   * Handles click-outside detection to close the search bar when
   * users click outside the search input. This functionality provides
   * intuitive search bar behavior and better user experience.
   *
   * What this effect does:
   * - Adds mousedown event listener to document
   * - Checks if click target is outside search input
   * - Closes search bar when clicking outside
   * - Removes event listener on cleanup
   * - Provides intuitive search bar behavior
   *
   * Why click-outside is essential:
   * - User experience: Provides intuitive search bar closing behavior
   * - Accessibility: Enables proper focus management and interaction
   * - Efficiency: Reduces interaction steps for search bar management
   * - Performance: Efficient event handling with proper cleanup
   * - Integration: Works seamlessly with search bar animations
   *
   * Click-Outside Logic:
   * - Event listener: Adds mousedown listener to document
   * - Target check: Verifies click target is outside input element
   * - Close action: Calls onClose when clicking outside
   * - Cleanup: Removes event listener on component unmount
   * - Dependency management: Proper dependency array for effect
   *
   * This click-outside functionality is essential for our messaging app because
   * it provides the user experience that enables intuitive search
   * bar interaction and proper accessibility throughout the search functionality.
   */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [inputRef, onClose]);

  return (
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
      <div
        id="searchQuery"
        {...register('searchQuery')}
        className={`
          flex
          items-center
          w-full
          h-full
          px-3
        `}
      >
        <input
          id="searchQuery"
          autoComplete="searchQuery"
          {...register('searchQuery')}
          ref={inputRef}
          placeholder="Search"
          className={`
            pl-10
            text-gray-800
            bg-gray-100
            font-light
            py-2
            w-full
            rounded-2xl
            focus:outline-none
            overflow-hidden
            resize-none
            transition-opacity
            ease-in-out
            transform
            duration-[1200ms]
            ${searchBarOpen ? ' opacity-100' : 'opacity-0 pointer-events-none'}
        `}
          maxLength={4096}
          style={{ visibility: searchBarOpen ? 'visible' : 'hidden' }}
        />

        <div
          className={`
            relative
            transition-all
            duration-500
            ease-in-out
            shrink-0
            pl-3
            ${
              searchBarOpen
                ? 'right-full translate-x-full'
                : 'right-8 translate-x-full'
            }`}
        >
          <IoSearch
            size={24}
            onClick={onClick}
            className={`
              text-sky-500
              cursor-pointer
              hover:text-sky-600
            `}
          />
        </div>
      </div>
    </form>
  );
};

export default Search;
