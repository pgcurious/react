import { useState, useCallback } from 'react';

/**
 * useToggle Hook
 *
 * Simple boolean toggle state management
 *
 * Usage:
 * const [isOpen, toggle, setIsOpen] = useToggle(false);
 *
 * <button onClick={toggle}>Toggle</button>
 * <button onClick={() => setIsOpen(true)}>Open</button>
 * <button onClick={() => setIsOpen(false)}>Close</button>
 */

function useToggle(
  initialValue: boolean = false
): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  return [value, toggle, setValue];
}

export { useToggle };
