import { useState, useEffect } from 'react';

/**
 * useDebounce Hook
 *
 * Debounces a value - useful for search inputs, form validation, etc.
 * The returned value only updates after the delay has passed without changes.
 *
 * Usage:
 * const [query, setQuery] = useState('');
 * const debouncedQuery = useDebounce(query, 300);
 *
 * useEffect(() => {
 *   if (debouncedQuery) {
 *     searchAPI(debouncedQuery);
 *   }
 * }, [debouncedQuery]);
 */

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up the timeout
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clear timeout if value changes before delay completes
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export { useDebounce };
