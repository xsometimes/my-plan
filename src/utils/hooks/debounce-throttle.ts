import { useRef, useCallback } from 'react';

const defaultDelayTime = 200;

export const useDebounce = (fn: Function, delay: number = defaultDelayTime, deps: any[] = []) => {
  const timer = useRef<any>(null);

  return useCallback((...args) => {
    timer.current && clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      fn(...args);
    }, delay)
  }, [delay, fn, ...deps])
}

export const useThrottle = (fn: Function, delay: number = defaultDelayTime) => {
  const timer = useRef<any>(null);

  return useCallback((...args) => {
    if (timer.current) {
      return
    }
    timer.current = setTimeout(() => {
      fn(...args);
      clearTimeout(timer.current);
      timer.current = null
    }, delay)
  }, [delay, fn])
}
