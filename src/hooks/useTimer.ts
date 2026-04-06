import { useState, useEffect, useCallback, useRef } from 'react';

export function useTimer(
  durationSeconds: number,
  onTimeout: () => void,
  isActive: boolean
) {
  const [timeRemaining, setTimeRemaining] = useState(durationSeconds);
  const onTimeoutRef = useRef(onTimeout);
  const timeRef = useRef(timeRemaining);
  onTimeoutRef.current = onTimeout;

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        const next = prev - 1;
        timeRef.current = next;
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  // Separate effect to handle timeout - avoids calling dispatch inside setState
  useEffect(() => {
    if (timeRemaining <= 0 && isActive) {
      onTimeoutRef.current();
    }
  }, [timeRemaining, isActive]);

  const resetTimer = useCallback(() => {
    setTimeRemaining(durationSeconds);
    timeRef.current = durationSeconds;
  }, [durationSeconds]);

  return { timeRemaining: Math.max(0, timeRemaining), resetTimer };
}
