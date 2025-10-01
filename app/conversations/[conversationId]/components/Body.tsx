/**
 * Conversation Body Component for Dex Real-Time Messenger
 *
 * This file provides the conversation body component for our Next.js 14 real-time
 * messaging application. It implements message display, real-time message updates,
 * scroll management, and search targeting functionality that ensures optimal user
 * experience for conversation viewing and real-time messaging.
 *
 * Key Features:
 * - Message display with MessageBox component integration
 * - Real-time message updates via Pusher integration
 * - Automatic scroll management for new messages
 * - Message search targeting with smooth scrolling
 * - Read receipt tracking and API integration
 * - Message reference management for search functionality
 *
 * Message Display Features:
 * - Individual message rendering with MessageBox components
 * - Real-time message updates and synchronization
 * - Message search targeting and smooth scrolling
 * - Automatic scroll to bottom for new messages
 * - Message reference tracking for search functionality
 * - Read receipt tracking and API calls
 *
 * This component is essential for our messaging app because it provides the
 * message display and real-time messaging interface that enables users to
 * view, interact with, and search messages while maintaining real-time
 * synchronization throughout our messaging platform.
 *
 * @fileoverview Conversation body component for Next.js 14 real-time messaging application
 * @author Dayle Cortes
 * @since 2025
 */

'use client';

import useConversation from '@/app/hooks/useConversation';
import { FullMessageType } from '@/app/types';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import MessageBox from './MessageBox';
import axios from 'axios';
import { pusherClient } from '@/app/libs/pusher';
import { find } from 'lodash';

/**
 * Body Component Props Interface
 *
 * Defines the props interface for the Body component, specifying
 * the required data for message display and real-time messaging functionality.
 *
 * @interface BodyProps
 * @property {FullMessageType[]} messages - Array of messages for display
 * @property {Dispatch<SetStateAction<FullMessageType[]>>} setMessages - Function to update messages state
 * @property {Dispatch<SetStateAction<string>>} setSearchTargetId - Function to set search target message ID
 * @property {string} searchTargetId - ID of the message to scroll to for search targeting
 */
interface BodyProps {
  messages: FullMessageType[];
  setMessages: Dispatch<SetStateAction<FullMessageType[]>>;
  setSearchTargetId: Dispatch<SetStateAction<string>>;
  searchTargetId: string;
}

/**
 * Conversation Body Component
 *
 * A comprehensive conversation body component that provides message display,
 * real-time message updates, scroll management, and search targeting for our
 * messaging application. This component implements message rendering, Pusher
 * integration, and user interaction that ensures optimal user experience for
 * conversation viewing and real-time messaging.
 *
 * Key Capabilities:
 * - Message display with MessageBox component integration
 * - Real-time message updates via Pusher integration
 * - Automatic scroll management for new messages
 * - Message search targeting with smooth scrolling
 * - Read receipt tracking and API integration
 * - Message reference management for search functionality
 *
 * Message Display Features:
 * - Individual message rendering with MessageBox components
 * - Real-time message updates and synchronization
 * - Message search targeting and smooth scrolling
 * - Automatic scroll to bottom for new messages
 * - Message reference tracking for search functionality
 * - Read receipt tracking and API calls
 *
 * Usage Patterns:
 * - Individual conversation pages: Main message display area for conversations
 * - Real-time messaging: Live message updates and synchronization
 * - Message search: Search targeting with smooth scrolling to specific messages
 * - Message management: Message state updates and real-time synchronization
 * - User interaction: Message viewing and search functionality
 *
 * Layout Features:
 * - Scrollable container: flex-1 overflow-y-auto for proper message scrolling
 * - Message rendering: Individual MessageBox components for each message
 * - Scroll management: Automatic scroll to bottom for new messages
 * - Search targeting: Smooth scrolling to specific messages
 * - Message references: DOM element references for search functionality
 *
 * Real-Time Features:
 * - Pusher integration: Real-time message updates and synchronization
 * - Message handlers: New message and message update event handling
 * - Read receipts: Automatic read receipt tracking and API calls
 * - State synchronization: Real-time message state updates
 * - Scroll management: Automatic scroll to new messages
 *
 * This component is crucial for our messaging app because it provides the
 * message display and real-time messaging interface that enables users to
 * view, interact with, and search messages while maintaining real-time
 * synchronization throughout our messaging platform.
 *
 * @param {BodyProps} props - Component props for conversation body configuration
 * @param {FullMessageType[]} props.messages - Array of messages for display
 * @param {Dispatch<SetStateAction<FullMessageType[]>>} props.setMessages - Function to update messages state
 * @param {Dispatch<SetStateAction<string>>} props.setSearchTargetId - Function to set search target message ID
 * @param {string} props.searchTargetId - ID of the message to scroll to for search targeting
 * @returns {JSX.Element} Conversation body with message display and real-time updates
 *
 * @example
 * ```tsx
 * // In conversation page component
 * <Body
 *   messages={messages}
 *   setMessages={setMessages}
 *   setSearchTargetId={setSearchTargetId}
 *   searchTargetId={searchTargetId}
 * />
 *
 * // With message data from getMessages action
 * <Body messages={messageData} setMessages={handleMessages} setSearchTargetId={handleSearch} searchTargetId={targetId} />
 * ```
 */
const Body: React.FC<BodyProps> = ({
  messages,
  setMessages,
  setSearchTargetId,
  searchTargetId,
}) => {
  /**
   * Bottom Scroll Reference
   *
   * Creates a reference to the bottom scroll element for automatic scrolling
   * to new messages. This reference enables smooth scrolling behavior and
   * ensures users always see the latest messages in the conversation.
   *
   * What this provides:
   * - Reference to bottom scroll element
   * - Automatic scroll to new messages
   * - Smooth scrolling behavior
   * - User experience for message viewing
   * - Scroll management for real-time updates
   *
   * Why useRef for bottomRef:
   * - DOM access: Direct access to scroll element
   * - Performance: Efficient DOM manipulation
   * - Scroll control: Programmatic scroll management
   * - User experience: Automatic scroll to new messages
   * - Real-time updates: Scroll to new messages from Pusher events
   *
   * This bottom scroll reference is essential for our messaging app because
   * it provides the scroll management that ensures users always see the
   * latest messages and maintain proper conversation flow throughout the messaging interface.
   */
  const bottomRef = useRef<HTMLDivElement>(null);

  /**
   * Message References Management
   *
   * Creates a reference object to store DOM element references for each message
   * to enable search targeting and smooth scrolling to specific messages. This
   * reference management provides efficient message targeting for search functionality.
   *
   * What this provides:
   * - Object to store message DOM element references
   * - Message targeting for search functionality
   * - Smooth scrolling to specific messages
   * - Search functionality integration
   * - Performance optimization for message targeting
   *
   * Why useRef for messageRefs:
   * - DOM access: Direct access to message elements
   * - Performance: Efficient message targeting
   * - Search functionality: Enables smooth scrolling to specific messages
   * - User experience: Smooth search targeting behavior
   * - Memory management: Efficient reference storage and cleanup
   *
   * This message references management is essential for our messaging app because
   * it provides the message targeting functionality that enables users to
   * search and navigate to specific messages throughout the conversation.
   */
  const messageRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  /**
   * Conversation ID Integration
   *
   * Integrates with the useConversation hook to get the current conversation ID
   * for Pusher channel subscription and API calls. This integration provides
   * conversation context for real-time messaging and read receipt tracking.
   *
   * What useConversation provides:
   * - Current conversation ID from URL parameters
   * - Conversation state management
   * - URL parameter extraction
   * - Conversation context for real-time updates
   * - Performance optimization with useMemo
   *
   * Why conversation ID is essential:
   * - Pusher subscription: Channel subscription for real-time updates
   * - API calls: Read receipt tracking and message updates
   * - Real-time updates: Conversation-specific message updates
   * - User experience: Context-aware messaging functionality
   * - Performance: Efficient conversation-specific updates
   *
   * This conversation ID integration is essential for our messaging app because
   * it provides the conversation context that enables real-time messaging
   * and read receipt tracking throughout the messaging interface.
   */
  const { conversationId } = useConversation();

  /**
   * Message Reference Setter
   *
   * Creates a callback function to set message DOM element references for
   * search targeting functionality. This setter provides efficient message
   * reference management with proper cleanup for memory optimization.
   *
   * What this function does:
   * - Sets message DOM element references in messageRefs object
   * - Cleans up references when elements are unmounted
   * - Enables search targeting functionality
   * - Provides smooth scrolling to specific messages
   * - Manages memory efficiently with reference cleanup
   *
   * Why useCallback for setMessageRef:
   * - Performance optimization: Prevents unnecessary re-renders
   * - Reference management: Efficient message reference handling
   * - Memory management: Proper cleanup of unmounted elements
   * - Search functionality: Enables smooth scrolling to specific messages
   * - User experience: Responsive search targeting behavior
   *
   * Message Reference Logic:
   * - Element mounting: Stores reference when element is mounted
   * - Element unmounting: Removes reference when element is unmounted
   * - Search targeting: Enables smooth scrolling to specific messages
   * - Memory management: Prevents memory leaks with proper cleanup
   * - Performance: Optimized with useCallback for efficient re-rendering
   *
   * This message reference setter is essential for our messaging app because
   * it provides the message targeting functionality that enables users to
   * search and navigate to specific messages throughout the conversation.
   */
  const setMessageRef = useCallback((el: HTMLDivElement | null, id: string) => {
    if (el) {
      messageRefs.current[id] = el;
    } else {
      delete messageRefs.current[id];
    }
  }, []);

  /**
   * Read Receipt Tracking
   *
   * Tracks read receipts for the current conversation by calling the seen API
   * endpoint whenever the conversation changes. This tracking ensures proper
   * read receipt management and user status updates.
   *
   * What this effect does:
   * - Calls /api/conversations/{conversationId}/seen endpoint
   * - Tracks read receipts for the current conversation
   * - Updates user status and read receipt data
   * - Provides real-time read receipt tracking
   * - Integrates with conversation management system
   *
   * Why track read receipts:
   * - User experience: Shows read status for messages
   * - Real-time updates: Live read receipt tracking
   * - Conversation context: Conversation-specific read tracking
   * - API integration: Server-side read receipt management
   * - Performance: Efficient read receipt tracking
   *
   * Read Receipt API Integration:
   * - POST /api/conversations/{conversationId}/seen: Marks conversation as seen
   * - Conversation-specific: Tracks read receipts per conversation
   * - Real-time updates: Live read receipt synchronization
   * - User status: Updates user read status in real-time
   * - Performance: Efficient API calls with conversation context
   *
   * This read receipt tracking is essential for our messaging app because
   * it provides the read receipt functionality that enables users to see
   * message read status and maintain proper conversation context throughout the messaging platform.
   */
  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  /**
   * Real-Time Message Updates
   *
   * Manages real-time message updates using Pusher integration to provide
   * live message synchronization and automatic UI updates from server events.
   * This effect handles new messages, message updates, and scroll management.
   *
   * What this effect provides:
   * - Pusher channel subscription for real-time updates
   * - New message handler for incoming messages
   * - Message update handler for message changes
   * - Automatic scroll to new messages
   * - Read receipt tracking for new messages
   * - Event cleanup and channel unsubscription
   *
   * Real-Time Event Handlers:
   * - messages:new: Adds new messages to the conversation
   * - message:update: Updates existing messages with changes
   * - Scroll management: Automatic scroll to new messages
   * - Read receipts: Automatic read receipt tracking
   * - Duplicate prevention: Prevents duplicate message display
   *
   * Why real-time updates are essential:
   * - User experience: Provides live message updates
   * - Synchronization: Keeps UI in sync with server state
   * - Performance: Efficient real-time updates without polling
   * - Scalability: Handles multiple users and conversations
   * - Reliability: Ensures consistent message state across clients
   *
   * Message Handler Logic:
   * - New message detection: Checks for duplicate messages using lodash find
   * - State updates: Adds new messages to messages array
   * - Read receipts: Calls seen API for new messages
   * - Scroll management: Automatically scrolls to new messages
   * - Performance: Efficient message state management
   *
   * This real-time integration is essential for our messaging app because
   * it provides the live message updates that enable real-time
   * messaging and maintain message state synchronization across all clients.
   */
  useEffect(() => {
    pusherClient.subscribe(conversationId);
    bottomRef?.current?.scrollIntoView();

    const messageHandler = (message: FullMessageType) => {
      axios.post(`/api/conversations/${conversationId}/seen`);

      setMessages((current) => {
        if (find(current, { id: message.id })) {
          return current;
        }

        return [...current, message];
      });

      bottomRef?.current?.scrollIntoView();
    };

    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages((current) =>
        current.map((currentMessage) => {
          if (currentMessage.id === newMessage.id) {
            return newMessage;
          }

          return currentMessage;
        })
      );
    };

    pusherClient.bind('messages:new', messageHandler);
    pusherClient.bind('message:update', updateMessageHandler);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind('messages:new', messageHandler);
      pusherClient.unbind('message:update', updateMessageHandler);
    };
  }, [conversationId, setMessages]);

  /**
   * Message Search Targeting
   *
   * Handles message search targeting by smoothly scrolling to specific messages
   * when searchTargetId is provided. This functionality enables users to navigate
   * to specific messages found through search functionality.
   *
   * What this effect does:
   * - Checks if searchTargetId exists and message reference is available
   * - Smoothly scrolls to the target message
   * - Clears searchTargetId after scrolling
   * - Provides smooth scrolling behavior
   * - Integrates with search functionality
   *
   * Why search targeting is essential:
   * - User experience: Enables navigation to specific messages
   * - Search functionality: Provides smooth scrolling to search results
   * - Message navigation: Allows users to find and view specific messages
   * - Performance: Efficient message targeting with DOM references
   * - Integration: Works with search functionality throughout the app
   *
   * Search Targeting Logic:
   * - Target validation: Checks if searchTargetId and message reference exist
   * - Smooth scrolling: Uses smooth scrolling behavior for better UX
   * - State cleanup: Clears searchTargetId after successful targeting
   * - Performance: Uses DOM references for efficient scrolling
   * - User experience: Provides smooth navigation to specific messages
   *
   * This search targeting functionality is essential for our messaging app because
   * it provides the message navigation that enables users to find and
   * navigate to specific messages throughout the conversation.
   */
  useEffect(() => {
    if (searchTargetId && messageRefs.current[searchTargetId]) {
      const targetMessage = messageRefs.current[searchTargetId];

      if (targetMessage) {
        targetMessage.scrollIntoView({
          behavior: 'smooth',
        });
      }
      setSearchTargetId('');
    }
  }, [searchTargetId, setSearchTargetId]);

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message, i) => (
        <div
          ref={(el) => setMessageRef(el, message.id)}
          key={message.id}
          className="p-0 m-0"
        >
          <MessageBox
            isLast={i === messages.length - 1}
            key={message.id}
            data={message}
          />
        </div>
      ))}
      <div ref={bottomRef} className="pt-4" />
    </div>
  );
};

export default Body;
