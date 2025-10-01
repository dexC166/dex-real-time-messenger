/**
 * Active User List Store for Dex Real-Time Messenger
 *
 * This file provides a specialized useActiveList Zustand store for our Next.js 14
 * real-time messaging application. It implements global active user state management
 * with real-time presence tracking, user join/leave events, and performance optimization
 * that ensures optimal user experience for active status indicators throughout the messaging platform.
 *
 * Key Features:
 * - Global active user list state management with Zustand
 * - Real-time user presence tracking via Pusher integration
 * - User join/leave event handling for live status updates
 * - Type-safe user ID management with string array storage
 * - Performance optimization with immutable state updates
 * - Integration with Avatar components for online status indicators
 *
 * Active User List Usage Patterns:
 * - useActiveChannel: Real-time presence event handling and user list updates
 * - Avatar components: Green dot indicators for online users
 * - Header components: User status display in conversation headers
 * - ProfileDrawer components: User presence information and status
 * - ActiveStatus component: Global presence tracking initialization
 *
 * This store is essential for our messaging app because it provides the
 * global active user state management that enables real-time presence
 * tracking, online status indicators, and live user awareness
 * throughout our real-time messaging platform.
 *
 * @fileoverview Active User List Store for Next.js 14 real-time messaging application
 * @author Dayle Cortes
 * @since 2025
 */

import { create } from 'zustand';

/**
 * Active List Store Interface
 *
 * Defines the complete interface for the active user list store, providing type safety
 * and clear documentation for all available state properties and methods.
 *
 * @interface ActiveListStore
 * @property {string[]} members - Array of active user IDs (email addresses)
 * @property {(id: string) => void} add - Function to add a user ID to the active list
 * @property {(id: string) => void} remove - Function to remove a user ID from the active list
 * @property {(ids: string[]) => void} set - Function to set the entire active user list
 */
interface ActiveListStore {
  members: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  set: (ids: string[]) => void;
}

/**
 * Active User List Store
 *
 * A comprehensive Zustand store that provides global active user state management
 * for our messaging application. This store implements real-time presence tracking,
 * user join/leave event handling, and performance optimization that ensures optimal
 * user experience for active status indicators throughout the messaging platform.
 *
 * Key Capabilities:
 * - Global active user list state management with Zustand
 * - Real-time user presence tracking via Pusher integration
 * - User join/leave event handling for live status updates
 * - Type-safe user ID management with string array storage
 * - Performance optimization with immutable state updates
 * - Integration with Avatar components for online status indicators
 *
 * Active User List Types Supported:
 * - Active users: Users currently online and connected
 * - Inactive users: Users offline or disconnected
 * - User IDs: Email addresses as unique user identifiers
 * - Real-time updates: Live presence state synchronization
 * - Global state: App-wide active user list management
 *
 * Usage Patterns:
 * - useActiveChannel: Real-time presence event handling and user list updates
 * - Avatar components: Green dot indicators for online users
 * - Header components: User status display in conversation headers
 * - ProfileDrawer components: User presence information and status
 * - ActiveStatus component: Global presence tracking initialization
 *
 * State Management Features:
 * - Zustand store: Lightweight global state management
 * - Immutable updates: Prevents state mutation and ensures performance
 * - Type safety: TypeScript interface for store structure
 * - Real-time sync: Live updates from Pusher presence events
 * - Memory efficiency: Optimized state updates and re-renders
 *
 * Performance Features:
 * - Immutable state updates: Prevents unnecessary re-renders
 * - Efficient filtering: Optimized user removal operations
 * - State normalization: String array for efficient lookups
 * - Real-time updates: Live presence synchronization
 * - Memory optimization: Minimal state footprint
 *
 * This store is crucial for our messaging app because it provides the
 * global active user state management that enables real-time presence
 * tracking, online status indicators, and live user awareness
 * throughout all conversation and messaging interfaces.
 *
 * @returns {ActiveListStore} Zustand store with members array and management methods
 *
 * @example
 * ```tsx
 * // In useActiveChannel
 * const { set, add, remove } = useActiveList();
 *
 * // In Avatar component
 * const { members } = useActiveList();
 * const isActive = members.indexOf(user.email) !== -1;
 *
 * // In Header component
 * const { members } = useActiveList();
 * const isActive = members.indexOf(otherUser?.email!) !== -1;
 *
 * // Store methods
 * add('user@example.com');        // Add user to active list
 * remove('user@example.com');     // Remove user from active list
 * set(['user1@example.com', 'user2@example.com']); // Set entire list
 * ```
 */
const useActiveList = create<ActiveListStore>((set) => ({
  /**
   * Active User Members Array
   *
   * Stores the current list of active user IDs (email addresses) who are
   * currently online and connected to the messaging platform. This array
   * is updated in real-time through Pusher presence events and provides
   * the foundation for all active status indicators throughout the app.
   *
   * What this stores:
   * - User IDs: Email addresses of currently active users
   * - Real-time state: Live updates from Pusher presence events
   * - Global state: App-wide active user list
   * - Status foundation: Base for all online/offline indicators
   * - Performance: Efficient array for user lookups
   *
   * Why this pattern?
   * - Real-time updates: Live presence state synchronization
   * - Global state: App-wide active user awareness
   * - Performance: Efficient array operations for user lookups
   * - Type safety: String array for consistent user identification
   * - Integration: Seamless integration with Avatar components
   *
   * This members array is essential for our messaging app because
   * it provides the real-time active user state that enables
   * live presence indicators and user status awareness
   * throughout the messaging platform.
   */
  members: [],

  /**
   * Add User to Active List
   *
   * Adds a user ID to the active members list when they come online
   * or join the presence channel. This method is called by useActiveChannel
   * when processing pusher:member_added events.
   *
   * What this does:
   * - Adds user ID: Appends new user ID to members array
   * - Immutable update: Creates new array to prevent state mutation
   * - Real-time sync: Updates active list when user comes online
   * - Performance: Efficient array append operation
   * - State consistency: Maintains synchronized active user list
   *
   * Why this pattern?
   * - Immutable updates: Prevents state mutation and ensures performance
   * - Real-time sync: Live updates when users come online
   * - Performance: Efficient array append operation
   * - State consistency: Maintains synchronized active user list
   * - Integration: Seamless integration with presence events
   *
   * This add method is essential for our messaging app because
   * it provides the real-time user addition that enables
   * live presence tracking and online status indicators
   * throughout the messaging platform.
   *
   * @param {string} id - User ID (email address) to add to active list
   */
  add: (id) =>
    set((state) => ({
      members: [...state.members, id],
    })),

  /**
   * Remove User from Active List
   *
   * Removes a user ID from the active members list when they go offline
   * or leave the presence channel. This method is called by useActiveChannel
   * when processing pusher:member_removed events.
   *
   * What this does:
   * - Removes user ID: Filters out user ID from members array
   * - Immutable update: Creates new array to prevent state mutation
   * - Real-time sync: Updates active list when user goes offline
   * - Performance: Efficient array filter operation
   * - State consistency: Maintains synchronized active user list
   *
   * Why this pattern?
   * - Immutable updates: Prevents state mutation and ensures performance
   * - Real-time sync: Live updates when users go offline
   * - Performance: Efficient array filter operation
   * - State consistency: Maintains synchronized active user list
   * - Integration: Seamless integration with presence events
   *
   * This remove method is essential for our messaging app because
   * it provides the real-time user removal that enables
   * live presence tracking and offline status indicators
   * throughout the messaging platform.
   *
   * @param {string} id - User ID (email address) to remove from active list
   */
  remove: (id) =>
    set((state) => ({
      members: state.members.filter((memberId) => memberId !== id),
    })),

  /**
   * Set Entire Active User List
   *
   * Sets the entire active members list, typically used during initial
   * presence channel subscription when receiving the complete list of
   * currently active users. This method is called by useActiveChannel
   * when processing pusher:subscription_succeeded events.
   *
   * What this does:
   * - Sets entire list: Replaces members array with new user IDs
   * - Initial sync: Establishes baseline active user list
   * - Real-time sync: Updates active list with current presence state
   * - Performance: Efficient array replacement operation
   * - State consistency: Maintains synchronized active user list
   *
   * Why this pattern?
   * - Initial sync: Establishes baseline active user list
   * - Real-time sync: Updates active list with current presence state
   * - Performance: Efficient array replacement operation
   * - State consistency: Maintains synchronized active user list
   * - Integration: Seamless integration with presence events
   *
   * This set method is essential for our messaging app because
   * it provides the initial presence synchronization that enables
   * accurate active user state and live presence tracking
   * throughout the messaging platform.
   *
   * @param {string[]} ids - Array of user IDs (email addresses) to set as active list
   */
  set: (ids) =>
    set({
      members: ids,
    }),
}));

export default useActiveList;
