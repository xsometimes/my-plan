import { useReducer, useRef } from 'react';

type UseSyncStateProps<T> = [() => T, (newValue: T) => void]

export function useForceUpdate () {
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  return forceUpdate;
}

export function useSyncState<T>(initialValue: T): UseSyncStateProps<T> {
  const ref = useRef<T>(initialValue);
  const forceUpdate = useForceUpdate()

  return [
    () => ref.current,
    (newValue: T) => {
      ref.current = newValue;
      forceUpdate()
    }
  ]
}

