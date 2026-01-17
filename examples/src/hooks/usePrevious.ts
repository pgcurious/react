import { useRef, useEffect } from 'react';

/**
 * usePrevious Hook
 *
 * Returns the previous value of a variable
 * Useful for comparing previous and current props/state
 *
 * Usage:
 * const [count, setCount] = useState(0);
 * const previousCount = usePrevious(count);
 *
 * console.log(`Count changed from ${previousCount} to ${count}`);
 */

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  // Return previous value (happens before update in useEffect)
  return ref.current;
}

export { usePrevious };
