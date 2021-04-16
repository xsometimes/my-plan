import { createContext, useEffect, useState, useContext } from 'react';
import { getActions, getConnection } from './db';
import { IndexedDBConfig } from './type';

interface UseIndexedDBProps {
  config: IndexedDBConfig;
  children?;
  loading?;
  actions?: typeof getActions
}

const ObservationCreateContext = createContext<UseIndexedDBProps>({} as UseIndexedDBProps)

const IndexedDBProvider = (props: UseIndexedDBProps) => {
  // isInitialized:openDB成功与否的变量
  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(() => {
    getConnection(props.config).then(() => setIsInitialized(true))
  }, [props.config])

  return isInitialized ? (
    <ObservationCreateContext.Provider value={{ config: props.config, actions: getActions }}>
      {props.children}
    </ObservationCreateContext.Provider>
  ) : (props.loading || null);
}

export function useIndexedDBStore<T>(storeName: string) {
  const ctx = useContext(ObservationCreateContext);
  // @ts-ignore
  return ctx.actions<T>(storeName, ctx.config);
}

export default IndexedDBProvider;
