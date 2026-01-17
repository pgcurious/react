import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useFetch Hook
 *
 * A custom hook for data fetching with loading/error states
 * NOTE: For production, use TanStack Query instead - this is for learning!
 *
 * Features:
 * - Automatic fetch on mount
 * - Loading and error states
 * - Refetch capability
 * - Request cancellation on unmount
 * - Generic typing
 */

interface UseFetchOptions {
  immediate?: boolean;  // Fetch immediately on mount
}

interface UseFetchReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

function useFetch<T>(
  url: string,
  options: UseFetchOptions = { immediate: true }
): UseFetchReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(options.immediate ?? true);
  const [error, setError] = useState<Error | null>(null);

  // Use ref to track if component is mounted
  const mountedRef = useRef(true);
  // Track AbortController for request cancellation
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    // Cancel any in-flight request
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Only update state if component is still mounted
      if (mountedRef.current) {
        setData(result as T);
        setError(null);
      }
    } catch (err) {
      // Ignore abort errors
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }

      if (mountedRef.current) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setData(null);
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [url]);

  // Fetch on mount if immediate is true
  useEffect(() => {
    if (options.immediate) {
      fetchData();
    }
  }, [fetchData, options.immediate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      abortControllerRef.current?.abort();
    };
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  };
}

export { useFetch, type UseFetchOptions, type UseFetchReturn };
