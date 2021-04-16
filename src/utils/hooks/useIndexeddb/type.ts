export interface IndexedDBColumn {
  name: string;
  keyPath: string;
  options?: IDBIndexParameters;
}

export interface IndexedDBStore {
  name: string;
  id: IDBObjectStoreParameters;
  indices: IndexedDBColumn[];
}

export interface IndexedDBConfig {
  databaseName: string;
  stores: IndexedDBStore[];
}

export interface TransactionOptions {
  storeName: string;
  dbMode: IDBTransactionMode;
  eror: (e: Event) => any;
  complete: (e: Event) => any;
  abort?: any;
}
