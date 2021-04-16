import storage from 'good-storage';
import { getRelationShipBetweenArr } from '../../arrayUtils';
import { DB_VERSION } from '../../../common/storageKey';
import { Identifier } from '../../../types/common';
import { IndexedDBConfig } from './type';

interface StorageDBVersion {
  storeNames: string[];
  lastestVersion: number;
}

const indexedDB = window.indexedDB || (window as any).mozIndexedDB || (window as any).webkitIndexedDB || (window as any).msIndexedDB;

/**
 * 获取并自动更新数据库版本
 * @param storeNames 
 * @returns 
 */
function getVersion (storeNames: string[]): number {
  let v = 1;
  const s = storage.get(DB_VERSION);
  if (s) {
    const o: StorageDBVersion = JSON.parse(s)
    v = o.lastestVersion;
    const relationShip = getRelationShipBetweenArr(storeNames, o.storeNames)
    if (relationShip < 2) { // 有新store
      v += 1;
    }
    storage.set(DB_VERSION, JSON.stringify({
      lastestVersion: v,
      storeNames: Array.from(new Set([...o.storeNames, ...storeNames]))
    }))
    return v
  }
  storage.set(DB_VERSION, JSON.stringify({
    lastestVersion: v,
    storeNames
  }))
  return v
}

function validdateStore(db: IDBDatabase, storeName: string) {
  return db.objectStoreNames.contains(storeName);
}

export function validateBeforeTransaction (db: IDBDatabase, storeName: string, reject: Function) {
  if (!db) {
    reject('Queried before opening connection');
  }
  if (!validdateStore(db, storeName)) {
    reject(`Store ${storeName} not found`);
  }
}

export function createTransaction(
  db: IDBDatabase,
  dbMode: IDBTransactionMode,
  currentStore: string,
  resolve,
  reject?,
  abort?
): IDBTransaction {
  const tx: IDBTransaction = db.transaction(currentStore, dbMode);
  tx.onerror = reject;
  tx.oncomplete = resolve;
  tx.onabort = abort;
  return tx;
}

export async function getConnection (config: IndexedDBConfig): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const storeNames = config.stores.map(e => e.name)
    const version = getVersion(storeNames)
    const request: IDBOpenDBRequest = indexedDB.open(config.databaseName, version);
    request.onsuccess = () => {
      resolve(request.result);
    }
    request.onerror = (e: any) => {
      reject(e.target.error.name);
    }
    request.onupgradeneeded = (e: any) => {
      const db = e.target.result;
      config.stores.forEach(s => {
        if (!validdateStore(db, s.name)) {
          const store = db.createObjectStore(s.name, s.id);
          s.indices.forEach(c => {
            const { name, keyPath, options } =c
            store.createIndex(name, keyPath, options)
          });
        }
      })
      db.close();
      resolve(db);
    }
  })
}

export function getActions<T>(currentStore: string, config: IndexedDBConfig) {
  return {
    getById(id: Identifier) {
      return new Promise<T>((resolve, reject) => {
        getConnection(config).then(db => {
          validateBeforeTransaction(db, currentStore, reject);
          const tx = createTransaction(db, 'readonly', currentStore, resolve, reject)
          const objectStore = tx.objectStore(currentStore);
          const request = objectStore.get(+id);
          request.onsuccess = (e: any) => {
            resolve(e.target.result as T)
          }
        }).catch(reject)
      })
    },

    getOneByIndex (keyPath: string, value: Identifier) {
      return new Promise<T | undefined>((resolve, reject) => {
        getConnection(config).then(db => {
          validateBeforeTransaction(db, currentStore, reject);
          const tx = createTransaction(db, 'readonly', currentStore, resolve, reject);
          const objectStore = tx.objectStore(currentStore);
          const index = objectStore.index(keyPath);
          const request = index.get(value);
          request.onsuccess = (e: any) => {
            resolve(e.target.result)
          }
        }).catch(reject)
      })
    },

    getManyByIndex(keyPath: string, value: Identifier) {
      return new Promise<T[]>((resolve, reject) => {
        getConnection(config).then(db => {
          validateBeforeTransaction(db, currentStore, reject);
          const tx = createTransaction(db, 'readonly', currentStore, resolve, reject);
          const objectStore = tx.objectStore(currentStore);
          const index = objectStore.index(keyPath);
          const request = index.getAll(value);
          request.onsuccess = (e: any) => {
            resolve(e.target.result)
          }
        }).catch(reject)
      })
    },

    /**
     * 注意：.getAll在少部分浏览器有兼容性，必要时可用游标cursor实现该功能
     * @returns 
     */
    getAll() {
      return new Promise<T[]>((resolve, reject) => {
        getConnection(config).then(db => {
          validateBeforeTransaction(db, currentStore, reject);
          const tx = createTransaction(db, 'readonly', currentStore, resolve, reject);
          const objectStore = tx.objectStore(currentStore);
          const request = objectStore.getAll();
          request.onsuccess = (e: any) => {
            resolve(e.target.result as T[])
          }
        }).catch(reject)
      })
    },

    add(value: T, key?: any) {
      return new Promise<number>((resolve, reject) => {
        getConnection(config).then(db => {
          validateBeforeTransaction(db, currentStore, reject);
          const tx = createTransaction(db, 'readwrite', currentStore, resolve, reject);
          const objectStore = tx.objectStore(currentStore);
          const request = objectStore.add(value, key);
          request.onsuccess = (e: any) => {
            resolve(e.target.result);
          }
        }).catch(reject);
      })
    },

    update(value: T, key?: any) {
      return new Promise<number>((resolve, reject) => {
        getConnection(config).then(db => {
          validateBeforeTransaction(db, currentStore, reject);
          const tx = createTransaction(db, 'readwrite', currentStore, resolve, reject);
          const objectStore = tx.objectStore(currentStore);
          const request = objectStore.put(value, key);
          request.onsuccess = (e: any) => {
            resolve(e.target.result);
          }
        }).catch(reject);
      })
    },

    deleteById(id: Identifier) {
      return new Promise((resolve, reject) => {
        getConnection(config).then(db => {
          validateBeforeTransaction(db, currentStore, reject);
          const tx = createTransaction(db, 'readwrite', currentStore, resolve, reject);
          const objectStore = tx.objectStore(currentStore);
          const request = objectStore.delete(id);
          request.onsuccess = (e: any) => {
            resolve(e)
          }
        }).catch(reject)
      })
    },

    deleteAll() {
      return new Promise<any>((resolve, reject) => {
        getConnection(config).then(db => {
          validateBeforeTransaction(db, currentStore, reject);
          const tx = createTransaction(db, 'readwrite', currentStore, resolve, reject);
          const objectStore = tx.objectStore(currentStore);
          objectStore.clear();
          tx.oncomplete = (e: any) => {
            resolve(e)
          }
        }).catch(reject)
      })
    },

    openCursor(callback, keyRange?: IDBKeyRange) {
      return new Promise<IDBCursorWithValue | void>((resolve, reject) => {
        getConnection(config).then(db => {
          validateBeforeTransaction(db, currentStore, reject);
          const tx = createTransaction(db, 'readonly', currentStore, resolve, reject);
          const objectStore = tx.objectStore(currentStore);
          const request = objectStore.openCursor(keyRange);
          request.onsuccess = e => {
            callback(e);
            resolve()
          }
        }).catch(reject)
      })
    }

  }
}
