/**
 * Real-Time Presence Channel Hook for Dex Real-Time Messenger
 *
 * This file provides a specialized useActiveChannel hook for our Next.js 14
 * real-time messaging application. It implements Pusher presence channel
 * subscription management with real-time user presence tracking, event handling,
 * and global state synchronization that ensures optimal user experience
 * for active status indicators throughout the messaging platform.
 *
 * Key Features:
 * - Pusher presence channel subscription management
 * - Real-time user presence tracking via presence-dex-messenger channel
 * - User join/leave event handling for live status updates
 * - Global active user list synchronization via useActiveList store
 * - Automatic channel cleanup and memory management
 * - Integration with ActiveStatus component for app-wide presence tracking
 *
 * Real-Time Presence Usage Patterns:
 * - ActiveStatus component: Global presence tracking initialization
 * - Real-time status updates: Automatic user presence synchronization
 * - Avatar components: Green dot indicators for online users
 * - Header components: User status display in conversation headers
 * - ProfileDrawer components: User presence information and status
 *
 * This hook is essential for our messaging app because it provides the
 * real-time presence channel management that enables live user status
 * tracking, online indicators, and seamless real-time user experience
 * throughout our real-time messaging platform.
 *
 * @fileoverview Real-Time Presence Channel Hook for Next.js 14 real-time messaging application
 * @author Dayle Cortes
 * @since 2025
 */

import { useEffect, useState } from 'react';
import useActiveList from './useActiveList';
import { Channel, Members } from 'pusher-js';
import { pusherClient } from '../libs/pusher';

/**
 * Real-Time Presence Channel Hook
 *
 * A comprehensive hook that manages Pusher presence channel subscription
 * for our messaging application. This hook implements real-time user presence
 * tracking, event handling, and global state synchronization that ensures
 * optimal user experience for active status indicators throughout the messaging platform.
 *
 * Key Capabilities:
 * - Pusher presence channel subscription management
 * - Real-time user presence tracking via presence-dex-messenger channel
 * - User join/leave event handling for live status updates
 * - Global active user list synchronization via useActiveList store
 * - Automatic channel cleanup and memory management
 * - Integration with ActiveStatus component for app-wide presence tracking
 *
 * Real-Time Presence Types Supported:
 * - Presence channels: Real-time user presence tracking
 * - User join events: pusher:member_added event handling
 * - User leave events: pusher:member_removed event handling
 * - Initial sync: pusher:subscription_succeeded event processing
 * - Global state: useActiveList store integration
 *
 * Usage Patterns:
 * - ActiveStatus component: Global presence tracking initialization
 * - Real-time status updates: Automatic user presence synchronization
 * - Avatar components: Green dot indicators for online users
 * - Header components: User status display in conversation headers
 * - ProfileDrawer components: User presence information and status
 *
 * Presence Channel Features:
 * - Pusher integration: presence-dex-messenger channel subscription
 * - Event binding: Real-time presence event handling
 * - State synchronization: Global active user list updates
 * - Memory management: Automatic channel cleanup
 * - Performance: Efficient presence tracking and updates
 *
 * Performance Features:
 * - Channel caching: Prevents duplicate subscriptions
 * - Event binding: Efficient real-time event handling
 * - State updates: Optimized global state synchronization
 * - Memory cleanup: Automatic channel unsubscription
 * - Dependency management: Efficient useEffect dependencies
 *
 * This hook is crucial for our messaging app because it provides the
 * real-time presence channel management that enables live user status
 * tracking, online indicators, and seamless real-time user experience
 * throughout all conversation and messaging interfaces.
 *
 * @returns {void} Hook that manages presence channel subscription and cleanup
 *
 * @example
 * ```tsx
 * // In ActiveStatus component
 * const ActiveStatus = () => {
 *   useActiveChannel(); // Initialize presence tracking
 *   return null;
 * };
 *
 * // Usage in app/layout.tsx
 * // The ActiveStatus component initializes useActiveChannel
 * // for global presence tracking across the application
 * ```
 */
const useActiveChannel = () => {
  /**
   * Active User List Store Integration
   *
   * Integrates with the useActiveList Zustand store to provide global
   * active user state management. This integration enables real-time
   * presence updates to be synchronized across all components that
   * consume the active user list.
   *
   * What this provides:
   * - Global state access: set, add, remove methods from useActiveList
   * - State synchronization: Real-time updates to active user list
   * - Type safety: Type-safe store method integration
   * - Performance: Efficient state updates and re-renders
   * - Integration: Seamless connection with global state management
   *
   * Why this pattern?
   * - Global state: Centralized active user list management
   * - Real-time sync: Live updates from presence events
   * - Type safety: Type-safe store method integration
   * - Performance: Efficient state updates and re-renders
   * - Integration: Seamless connection with global state management
   *
   * This store integration is essential for our messaging app because
   * it provides the global state management that enables real-time
   * presence updates to be synchronized across all components
   * throughout the messaging platform.
   */
  const { set, add, remove } = useActiveList();

  /**
   * Active Channel State Management
   *
   * Manages the current Pusher presence channel instance to prevent
   * duplicate subscriptions and enable proper cleanup. This state
   * ensures that only one presence channel subscription exists
   * and provides the foundation for event binding and cleanup.
   *
   * What this manages:
   * - Channel instance: Current Pusher presence channel
   * - Subscription state: Whether channel is currently subscribed
   * - Cleanup reference: Channel instance for proper unsubscription
   * - Memory management: Prevents duplicate subscriptions
   * - Performance: Efficient channel management
   *
   * Why this pattern?
   * - Memory management: Prevents duplicate subscriptions
   * - Cleanup reference: Channel instance for proper unsubscription
   * - Performance: Efficient channel management
   * - State consistency: Maintains single channel subscription
   * - Integration: Seamless connection with Pusher client
   *
   * This channel state management is essential for our messaging app because
   * it provides the channel management that enables efficient presence
   * tracking and proper cleanup throughout the messaging platform.
   */
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

  /**
   * Presence Channel Subscription and Event Management
   *
   * Manages the complete lifecycle of Pusher presence channel subscription,
   * including initial subscription, event binding, and cleanup. This effect
   * provides the core functionality for real-time user presence tracking
   * and global state synchronization.
   *
   * What this manages:
   * - Channel subscription: Subscribes to presence-dex-messenger channel
   * - Event binding: Binds to pusher:subscription_succeeded, pusher:member_added, pusher:member_removed
   * - State updates: Updates useActiveList store with presence changes
   * - Cleanup: Unsubscribes from channel on component unmount
   * - Memory management: Prevents memory leaks and duplicate subscriptions
   *
   * Why this pattern?
   * - Real-time tracking: Enables live user presence tracking
   * - Global state: Synchronizes presence changes across all components
   * - Memory management: Prevents memory leaks and duplicate subscriptions
   * - Performance: Efficient presence tracking and updates
   * - Integration: Seamless connection with Pusher and global state
   *
   * This presence management is essential for our messaging app because
   * it provides the real-time presence tracking that enables live user
   * status indicators and seamless real-time user experience
   * throughout the messaging platform.
   */
  useEffect(() => {
    /**
     * Channel Reference Management
     *
     * Manages the channel reference to prevent duplicate subscriptions
     * and enable proper cleanup. This pattern ensures that only one
     * presence channel subscription exists and provides efficient
     * channel management.
     *
     * What this does:
     * - Channel reference: Uses existing channel if available
     * - Subscription check: Prevents duplicate subscriptions
     * - State management: Updates activeChannel state
     * - Performance: Efficient channel management
     * - Memory optimization: Prevents unnecessary subscriptions
     *
     * Why this pattern?
     * - Memory optimization: Prevents unnecessary subscriptions
     * - Performance: Efficient channel management
     * - State consistency: Maintains single channel subscription
     * - Cleanup reference: Channel instance for proper unsubscription
     * - Integration: Seamless connection with Pusher client
     *
     * This channel reference management is essential for our messaging app because
     * it provides the efficient channel management that enables optimal
     * presence tracking and memory usage throughout the messaging platform.
     */
    let channel = activeChannel;

    if (!channel) {
      channel = pusherClient.subscribe('presence-dex-messenger');
      setActiveChannel(channel);
    }

    /**
     * Initial Presence Synchronization
     *
     * Handles the pusher:subscription_succeeded event to establish the
     * initial list of active users when the presence channel is first
     * subscribed. This provides the baseline active user list that
     * all subsequent updates are based on.
     *
     * What this does:
     * - Initial sync: Establishes baseline active user list
     * - Member extraction: Extracts user IDs from Pusher members object
     * - State update: Updates useActiveList store with initial members
     * - Performance: Efficient initial state establishment
     * - Synchronization: Ensures all clients start with same active list
     *
     * Why this pattern?
     * - Initial sync: Establishes baseline active user list
     * - Performance: Efficient initial state establishment
     * - Synchronization: Ensures all clients start with same active list
     * - State consistency: Maintains synchronized active user list
     * - Integration: Seamless connection with global state management
     *
     * This initial synchronization is essential for our messaging app because
     * it provides the baseline active user list that enables accurate
     * presence tracking and user status indicators throughout the messaging platform.
     */
    channel.bind('pusher:subscription_succeeded', (members: Members) => {
      const initialMembers: string[] = [];

      members.each((member: Record<string, any>) =>
        initialMembers.push(member.id)
      );
      set(initialMembers);
    });

    /**
     * User Join Event Handling
     *
     * Handles the pusher:member_added event when a user comes online
     * or joins the presence channel. This provides real-time user
     * addition to the active user list and updates all components
     * that display user presence status.
     *
     * What this does:
     * - User addition: Adds new user to active user list
     * - Real-time updates: Live presence status updates
     * - State synchronization: Updates global active user list
     * - Performance: Efficient user addition operation
     * - Integration: Seamless connection with global state management
     *
     * Why this pattern?
     * - Real-time updates: Live presence status updates
     * - Performance: Efficient user addition operation
     * - State synchronization: Updates global active user list
     * - Integration: Seamless connection with global state management
     * - User experience: Immediate presence status updates
     *
     * This user join handling is essential for our messaging app because
     * it provides the real-time user addition that enables live
     * presence tracking and online status indicators throughout the messaging platform.
     */
    channel.bind('pusher:member_added', (member: Record<string, any>) => {
      add(member.id);
    });

    /**
     * User Leave Event Handling
     *
     * Handles the pusher:member_removed event when a user goes offline
     * or leaves the presence channel. This provides real-time user
     * removal from the active user list and updates all components
     * that display user presence status.
     *
     * What this does:
     * - User removal: Removes user from active user list
     * - Real-time updates: Live presence status updates
     * - State synchronization: Updates global active user list
     * - Performance: Efficient user removal operation
     * - Integration: Seamless connection with global state management
     *
     * Why this pattern?
     * - Real-time updates: Live presence status updates
     * - Performance: Efficient user removal operation
     * - State synchronization: Updates global active user list
     * - Integration: Seamless connection with global state management
     * - User experience: Immediate presence status updates
     *
     * This user leave handling is essential for our messaging app because
     * it provides the real-time user removal that enables live
     * presence tracking and offline status indicators throughout the messaging platform.
     */
    channel.bind('pusher:member_removed', (member: Record<string, any>) => {
      remove(member.id);
    });

    /**
     * Channel Cleanup and Memory Management
     *
     * Provides cleanup functionality to unsubscribe from the presence
     * channel and reset the active channel state when the component
     * unmounts. This prevents memory leaks and ensures proper
     * resource management.
     *
     * What this does:
     * - Channel unsubscription: Unsubscribes from presence-dex-messenger channel
     * - State reset: Resets activeChannel state to null
     * - Memory cleanup: Prevents memory leaks
     * - Resource management: Ensures proper cleanup
     * - Performance: Prevents unnecessary channel subscriptions
     *
     * Why this pattern?
     * - Memory cleanup: Prevents memory leaks
     * - Resource management: Ensures proper cleanup
     * - Performance: Prevents unnecessary channel subscriptions
     * - State consistency: Maintains clean state on unmount
     * - Integration: Seamless connection with Pusher client
     *
     * This cleanup is essential for our messaging app because
     * it provides the memory management that prevents memory leaks
     * and ensures optimal performance throughout the messaging platform.
     */
    return () => {
      if (activeChannel) {
        pusherClient.unsubscribe('presence-dex-messenger');
        setActiveChannel(null);
      }
    };
  }, [activeChannel, set, add, remove]);
};

export default useActiveChannel;
