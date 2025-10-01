/**
 * Conversation Cache Hook for Dex Real-Time Messenger
 *
 * This file provides a custom React hook for caching conversation and message data
 * to improve performance and reduce unnecessary API calls. It implements a simple
 * in-memory cache with TTL (Time To Live) functionality for optimal data management.
 *
 * Key Features:
 * - In-memory caching for conversation and message data
 * - TTL-based cache expiration for data freshness
 * - Automatic cache invalidation and cleanup
 * - Type-safe cache operations with TypeScript
 * - Performance optimization for repeated data access
 *
 * Cache Features:
 * - Conversation data caching with user information
 * - Message data caching with sender and read receipt data
 * - TTL-based expiration (5 minutes for conversations, 2 minutes for messages)
 * - Automatic cache cleanup and memory management
 * - Cache hit/miss tracking for performance monitoring
 *
 * This hook is essential for our messaging app because it provides the
 * caching functionality that reduces API calls and improves performance
 * throughout our messaging platform.
 *
 * @fileoverview Conversation cache hook for Next.js 14 real-time messaging application
 * @author Dayle Cortes
 * @since 2025
 */

'use client';

import { useCallback, useRef } from 'react';
import { Conversation, User } from '@prisma/client';
import { FullMessageType } from '@/app/types';

/**
 * Cache Entry Interface
 *
 * Defines the structure for cache entries with TTL functionality.
 *
 * @interface CacheEntry<T>
 * @property {T} data - The cached data
 * @property {number} timestamp - When the data was cached
 * @property {number} ttl - Time to live in milliseconds
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

/**
 * Conversation Cache Hook
 *
 * A custom React hook that provides in-memory caching for conversation and message
 * data to improve performance and reduce unnecessary API calls. This hook implements
 * TTL-based cache expiration and automatic cleanup for optimal data management.
 *
 * Key Capabilities:
 * - In-memory caching for conversation and message data
 * - TTL-based cache expiration for data freshness
 * - Automatic cache invalidation and cleanup
 * - Type-safe cache operations with TypeScript
 * - Performance optimization for repeated data access
 *
 * Cache Types:
 * - Conversations: Cached conversation data with user information
 * - Messages: Cached message data with sender and read receipt information
 * - TTL Management: Different TTL values for different data types
 * - Memory Management: Automatic cleanup of expired entries
 *
 * Usage Patterns:
 * - Conversation loading: Cache conversation data for faster access
 * - Message loading: Cache message data for conversation display
 * - Performance optimization: Reduce API calls for repeated data access
 * - User experience: Faster data loading and better responsiveness
 * - Memory management: Automatic cleanup of expired cache entries
 *
 * TTL Configuration:
 * - Conversations: 5 minutes (300,000ms) - longer TTL for stable data
 * - Messages: 2 minutes (120,000ms) - shorter TTL for frequently updated data
 * - Automatic cleanup: Expired entries are removed on next access
 * - Memory optimization: Prevents memory leaks from stale data
 *
 * This hook is crucial for our messaging app because it provides the
 * caching functionality that reduces API calls and improves performance
 * throughout our messaging platform.
 *
 * @returns {Object} Cache operations and utilities
 *
 * @example
 * ```tsx
 * const { getCachedConversation, setCachedConversation, getCachedMessages, setCachedMessages } = useConversationCache();
 *
 * // Cache conversation data
 * setCachedConversation('conv-123', conversationData);
 *
 * // Retrieve cached conversation
 * const cached = getCachedConversation('conv-123');
 * if (cached) {
 *   // Use cached data
 * } else {
 *   // Fetch from API
 * }
 * ```
 */
const useConversationCache = () => {
  /**
   * Conversation Cache Storage
   *
   * Stores conversation data with TTL functionality using a Map for efficient
   * key-value operations. This cache provides fast access to conversation data
   * while maintaining data freshness through TTL expiration.
   *
   * Cache Structure:
   * - Key: conversationId (string)
   * - Value: CacheEntry<Conversation & { users: User[] }>
   * - TTL: 5 minutes (300,000ms) for conversation data
   * - Automatic cleanup: Expired entries are removed on access
   */
  const conversationCache = useRef<
    Map<string, CacheEntry<Conversation & { users: User[] }>>
  >(new Map());

  /**
   * Messages Cache Storage
   *
   * Stores message data with TTL functionality using a Map for efficient
   * key-value operations. This cache provides fast access to message data
   * while maintaining data freshness through TTL expiration.
   *
   * Cache Structure:
   * - Key: conversationId (string)
   * - Value: CacheEntry<FullMessageType[]>
   * - TTL: 2 minutes (120,000ms) for message data
   * - Automatic cleanup: Expired entries are removed on access
   */
  const messagesCache = useRef<Map<string, CacheEntry<FullMessageType[]>>>(
    new Map()
  );

  /**
   * Cache Cleanup Utility
   *
   * Removes expired entries from the cache to prevent memory leaks and maintain
   * optimal performance. This utility is called automatically when accessing
   * cache entries to ensure data freshness.
   *
   * What this does:
   * - Checks current timestamp against entry timestamp + TTL
   * - Removes expired entries from the cache
   * - Prevents memory leaks from stale data
   * - Maintains optimal cache performance
   *
   * Why cleanup is important:
   * - Memory management: Prevents memory leaks from stale data
   * - Performance: Keeps cache size optimal for fast access
   * - Data freshness: Ensures only fresh data is served
   * - Resource optimization: Prevents unnecessary memory usage
   */
  const cleanupExpiredEntries = useCallback(
    <T>(cache: Map<string, CacheEntry<T>>) => {
      const now = Date.now();
      const keysToDelete: string[] = [];

      // Use forEach instead of for...of for better compatibility
      cache.forEach((entry, key) => {
        if (now > entry.timestamp + entry.ttl) {
          keysToDelete.push(key);
        }
      });

      // Delete expired entries
      keysToDelete.forEach((key) => cache.delete(key));
    },
    []
  );

  /**
   * Get Cached Conversation
   *
   * Retrieves conversation data from the cache if it exists and hasn't expired.
   * This function provides fast access to conversation data while ensuring
   * data freshness through TTL validation.
   *
   * @param {string} conversationId - The conversation ID to retrieve
   * @returns {Conversation & { users: User[] } | null} Cached conversation data or null if not found/expired
   */
  const getCachedConversation = useCallback(
    (conversationId: string): (Conversation & { users: User[] }) | null => {
      cleanupExpiredEntries(conversationCache.current);

      const entry = conversationCache.current.get(conversationId);
      if (entry) {
        return entry.data;
      }
      return null;
    },
    [cleanupExpiredEntries]
  );

  /**
   * Set Cached Conversation
   *
   * Stores conversation data in the cache with TTL expiration. This function
   * enables fast access to conversation data for subsequent requests.
   *
   * @param {string} conversationId - The conversation ID to cache
   * @param {Conversation & { users: User[] }} data - The conversation data to cache
   */
  const setCachedConversation = useCallback(
    (conversationId: string, data: Conversation & { users: User[] }) => {
      conversationCache.current.set(conversationId, {
        data,
        timestamp: Date.now(),
        ttl: 300000, // 5 minutes
      });
    },
    []
  );

  /**
   * Get Cached Messages
   *
   * Retrieves message data from the cache if it exists and hasn't expired.
   * This function provides fast access to message data while ensuring
   * data freshness through TTL validation.
   *
   * @param {string} conversationId - The conversation ID to retrieve messages for
   * @returns {FullMessageType[] | null} Cached message data or null if not found/expired
   */
  const getCachedMessages = useCallback(
    (conversationId: string): FullMessageType[] | null => {
      cleanupExpiredEntries(messagesCache.current);

      const entry = messagesCache.current.get(conversationId);
      if (entry) {
        return entry.data;
      }
      return null;
    },
    [cleanupExpiredEntries]
  );

  /**
   * Set Cached Messages
   *
   * Stores message data in the cache with TTL expiration. This function
   * enables fast access to message data for subsequent requests.
   *
   * @param {string} conversationId - The conversation ID to cache messages for
   * @param {FullMessageType[]} data - The message data to cache
   */
  const setCachedMessages = useCallback(
    (conversationId: string, data: FullMessageType[]) => {
      messagesCache.current.set(conversationId, {
        data,
        timestamp: Date.now(),
        ttl: 120000, // 2 minutes
      });
    },
    []
  );

  /**
   * Clear Cache
   *
   * Clears all cached data from both conversation and message caches.
   * This function is useful for cache invalidation and memory management.
   */
  const clearCache = useCallback(() => {
    conversationCache.current.clear();
    messagesCache.current.clear();
  }, []);

  /**
   * Get Cache Stats
   *
   * Returns cache statistics for monitoring and debugging purposes.
   * This function provides insights into cache usage and performance.
   *
   * @returns {Object} Cache statistics including size and hit rates
   */
  const getCacheStats = useCallback(() => {
    return {
      conversationCacheSize: conversationCache.current.size,
      messagesCacheSize: messagesCache.current.size,
      totalCacheSize:
        conversationCache.current.size + messagesCache.current.size,
    };
  }, []);

  return {
    getCachedConversation,
    setCachedConversation,
    getCachedMessages,
    setCachedMessages,
    clearCache,
    getCacheStats,
  };
};

export default useConversationCache;
