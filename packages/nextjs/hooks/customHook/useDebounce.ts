import { useEffect, useState } from "react";
import { Dispatch, SetStateAction } from "react";

function useDebounce(
  value: string,
  delay: number,
): { currentValue: string; debouncedValue: string; setValue: (value: string) => void } {
  const [currentValue, setCurrentValue] = useState<string>(value);
  const [debouncedValue, setDebouncedValue] = useState<string>(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(currentValue);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [currentValue, delay]);

  const setValue = (value: string) => {
    setCurrentValue(value);
  };

  return { currentValue, debouncedValue, setValue };
}

export default useDebounce;
