import React from 'react';

export const useLocalStorage = <T>(
  key: string,
  initialValue?: T,
): [T, (x: T) => void] => {
  const [storedValue, setStoredValue] = React.useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = React.useCallback(
    (key: string) => (value: T) => {
      try {
        setStoredValue(value);
        if (typeof value === 'undefined') {
          localStorage.removeItem(key);
        } else {
          localStorage.setItem(key, JSON.stringify(value));
        }
      } catch (error) {
        // no-op
      }
    },
    [],
  );

  return [storedValue, setValue(key)];
};
